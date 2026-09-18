#!/usr/bin/env bash
# Run on the droplet (or over ssh) after `docker build -t starkwell:new .`.
# Verifies the new image actually starts and serves before ever stopping the
# live container -- see DEPLOY.md's "swap.sh" section for why this exists
# (the straight-line rm-then-run sequence it replaces caused a real outage
# on 2026-09-16 when `docker run` failed after the old container was
# already gone).
set -euo pipefail

CANARY_PORT=8081
TIMEOUT_S=240   # the documented ~2-3 min cold-start window, plus margin

echo "Starting canary on port $CANARY_PORT..."
docker rm -f starkwell-canary >/dev/null 2>&1 || true
docker run -d --name starkwell-canary -p "$CANARY_PORT:8080" --memory=1400m \
  --env-file /root/starkwell.env \
  -v /root/starkwell-data:/app/data-writable starkwell:new

echo "Waiting for canary to answer /api/health (up to ${TIMEOUT_S}s)..."
elapsed=0
until curl -sf "http://localhost:$CANARY_PORT/api/health" >/dev/null 2>&1; do
  sleep 5
  elapsed=$((elapsed + 5))
  if [ "$elapsed" -ge "$TIMEOUT_S" ]; then
    echo "FAILED: canary never became healthy. Live site untouched." >&2
    docker logs --tail 40 starkwell-canary >&2
    docker rm -f starkwell-canary >/dev/null 2>&1 || true
    exit 1
  fi
done
echo "Canary healthy after ${elapsed}s. Swapping into production..."

docker rm -f starkwell-canary
docker tag starkwell:latest "starkwell:rollback-$(date +%Y%m%d-%H%M)" 2>/dev/null || true
docker rm -f starkwell
docker run -d --name starkwell --restart unless-stopped -p 80:8080 --memory=1400m \
  --env-file /root/starkwell.env \
  -v /root/starkwell-data:/app/data-writable starkwell:new
docker tag starkwell:new starkwell:latest

echo "Waiting for production to answer on port 80..."
until curl -sf "http://localhost/api/health" >/dev/null 2>&1; do sleep 5; done
echo "Live and healthy."
