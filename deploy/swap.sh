#!/usr/bin/env bash
# Zero-downtime deploy. Run on the droplet (or over ssh) after
# `docker build -t starkwell:new .`.
#
# How it works (blue/green behind Caddy):
#   * The app runs as one container publishing to 127.0.0.1 on EITHER port 8080
#     or port 8081. Caddy (HTTPS, ports 80/443) forwards to whichever one
#     /etc/caddy/Caddyfile names in its `reverse_proxy 127.0.0.1:<port>` line.
#   * A deploy starts the new image on the OTHER port while the live container
#     keeps serving, waits for the new one to answer /api/health (cold start
#     takes ~215-235s), then points Caddy at it and reloads Caddy (a graceful
#     reload: in-flight requests finish, no connection is dropped), checks the
#     site through Caddy, and only then retires the old container.
#   * Anything that fails before the switch leaves the live site untouched.
#     A failed check after the switch puts Caddy back on the old container.
#
# History: the first version of this script was written after a 2026-09-16
# outage where `rm` then `run` left no container running. Until 2026-10-07 it
# still stopped the live container before starting the new one, which meant
# about 3.5 minutes of 502s on every deploy while the data loaded.
#
# Containers publish ONLY to 127.0.0.1, so the app is not reachable except
# through Caddy. Never publish them on a public port.
#
# Rolling back: `IMAGE=starkwell:rollback-<timestamp> bash deploy/swap.sh`
# does the same zero-downtime swap onto an older image (see DEPLOY.md).
set -euo pipefail

IMAGE=${IMAGE:-starkwell:new}
CADDYFILE=${CADDYFILE:-/etc/caddy/Caddyfile}
SITE_HOST=${SITE_HOST:-starkwellhealth.com}
TIMEOUT_S=${TIMEOUT_S:-360}   # cold start measured at ~215-235s on 2026-10
DRAIN_S=${DRAIN_S:-20}        # let in-flight requests on the old container finish

# Which port is live right now?
ACTIVE=$(grep -oP 'reverse_proxy 127\.0\.0\.1:\K[0-9]+' "$CADDYFILE" | head -n1 || true)
if [ -z "$ACTIVE" ]; then
  echo "FAILED: could not find 'reverse_proxy 127.0.0.1:<port>' in $CADDYFILE" >&2
  exit 1
fi
if [ "$ACTIVE" = "8080" ]; then NEW=8081; else NEW=8080; fi
echo "Live container is on port $ACTIVE; starting the new one on port $NEW..."

# Clear anything left over on the spare port (a failed earlier run, or the old
# "canary" container from the previous version of this script).
docker rm -f starkwell-canary >/dev/null 2>&1 || true
for c in $(docker ps -aq --filter "publish=$NEW"); do docker rm -f "$c" >/dev/null 2>&1 || true; done
docker rm -f "starkwell-$NEW" >/dev/null 2>&1 || true

docker run -d --name "starkwell-$NEW" --restart unless-stopped \
  -p "127.0.0.1:$NEW:8080" --memory=1400m \
  --env-file /root/starkwell.env \
  -v /root/starkwell-data:/app/data-writable "$IMAGE" >/dev/null

echo "Waiting for the new container to answer /api/health (up to ${TIMEOUT_S}s)..."
elapsed=0
until curl -sf "http://127.0.0.1:$NEW/api/health" >/dev/null 2>&1; do
  sleep 5
  elapsed=$((elapsed + 5))
  if [ "$elapsed" -ge "$TIMEOUT_S" ]; then
    echo "FAILED: new container never became healthy. Live site untouched." >&2
    docker logs --tail 40 "starkwell-$NEW" >&2 || true
    docker rm -f "starkwell-$NEW" >/dev/null 2>&1 || true
    exit 1
  fi
done
echo "New container healthy after ${elapsed}s. Switching Caddy to port $NEW..."

cp "$CADDYFILE" "$CADDYFILE.before-swap"
sed -i "s/reverse_proxy 127\.0\.0\.1:$ACTIVE/reverse_proxy 127.0.0.1:$NEW/" "$CADDYFILE"
if ! caddy validate --config "$CADDYFILE" >/dev/null 2>&1; then
  echo "FAILED: Caddy rejected the new config. Restoring the old one; live site untouched." >&2
  cp "$CADDYFILE.before-swap" "$CADDYFILE"
  docker rm -f "starkwell-$NEW" >/dev/null 2>&1 || true
  exit 1
fi
systemctl reload caddy

# Check the real path: through Caddy, over HTTPS, as a visitor would.
ok=0
for _ in 1 2 3 4 5 6; do
  code=$(curl -s -o /dev/null -m 10 -w "%{http_code}" --resolve "$SITE_HOST:443:127.0.0.1" "https://$SITE_HOST/api/health" || true)
  if [ "$code" = "200" ]; then ok=1; break; fi
  sleep 2
done
if [ "$ok" != "1" ]; then
  echo "FAILED: site did not answer through Caddy after the switch. Putting Caddy back on port $ACTIVE." >&2
  cp "$CADDYFILE.before-swap" "$CADDYFILE"
  systemctl reload caddy
  docker rm -f "starkwell-$NEW" >/dev/null 2>&1 || true
  exit 1
fi
echo "Live on port $NEW."

# Tag the image we just replaced so it can be rolled back to, then promote.
docker tag starkwell:latest "starkwell:rollback-$(date +%Y%m%d-%H%M)" 2>/dev/null || true
docker tag "$IMAGE" starkwell:latest

echo "Letting in-flight requests on the old container finish (${DRAIN_S}s)..."
sleep "$DRAIN_S"
for c in $(docker ps -aq --filter "publish=$ACTIVE"); do docker rm -f "$c" >/dev/null 2>&1 || true; done
echo "Old container retired. Live and healthy."

# Keep only the newest few rollback images. Every swap tags the previous image
# starkwell:rollback-<time> (~1.5GB each); 26 had piled up by 2026-10-03 and
# the droplet's disk hit 91%. The tag names sort chronologically. Runs last and
# is allowed to fail: it must never turn a successful deploy into an error
# (with `set -o pipefail`, grep finding no rollback tags yet would otherwise
# abort the script here).
KEEP_ROLLBACKS=4
docker images starkwell --format '{{.Tag}}' | grep '^rollback-' | sort -r   | tail -n +$((KEEP_ROLLBACKS + 1))   | while read -r tag; do
      docker rmi "starkwell:$tag" >/dev/null 2>&1 && echo "Removed old rollback image: $tag" || true
    done || true
