#!/usr/bin/env bash
# One-command code deploy from the repo root: package the code, copy it to the
# droplet, build the image there, run the zero-downtime swap (deploy/swap.sh), and
# probe the live site once a second while it happens.
#
# Usage (from the repo root, in Git Bash):
#   bash deploy/deploy.sh
#
# Output files (override with OUT=...): $OUT/deploy_run.txt style output goes to stdout,
# the probe log to $OUT/probe2.txt. The last line printed is "SWAP EXIT CODE: <n>".
#
# This ships code only. The data files already live on the droplet in
# /root/starkwell/data and are NOT re-sent. To change data, follow DEPLOY.md.
set -uo pipefail

HOST=${HOST:-root@147.182.138.132}
KEY=${KEY:-$HOME/.ssh/starkwell_deploy}
OUT=${OUT:-${TMPDIR:-/tmp}}
SSH="ssh -i $KEY -o ConnectTimeout=20"

mkdir -p "$OUT"
TAR="$OUT/starkwell-code.tar.gz"
PROBE="$OUT/probe2.txt"
rm -f "$PROBE" "$OUT/probe2.stop"

echo "== packaging code"
tar -czf "$TAR" src api public index.html package.json package-lock.json \
    vite.config.ts postcss.config.mjs deploy/swap.sh || { echo "SWAP EXIT CODE: 90"; exit 90; }

echo "== copying to droplet"
scp -i "$KEY" "$TAR" "$HOST:/root/starkwell-code.tar.gz" || { echo "SWAP EXIT CODE: 91"; exit 91; }

echo "== building image on droplet"
$SSH "$HOST" "mkdir -p /root/starkwell && tar -xzf /root/starkwell-code.tar.gz -C /root/starkwell && cd /root/starkwell && docker build -t starkwell:new ." \
  || { echo "SWAP EXIT CODE: 92"; exit 92; }

echo "== probing the live site once a second during the swap"
( while [ ! -f "$OUT/probe2.stop" ]; do
    code=$(curl -s -o /dev/null -m 10 -w "%{http_code}" https://starkwellhealth.com/api/health || echo 000)
    echo "$(date -u +%H:%M:%S) $code" >> "$PROBE"
    sleep 1
  done ) &
PROBE_PID=$!

echo "== swapping (takes about 4-5 minutes)"
$SSH "$HOST" "cd /root/starkwell && bash deploy/swap.sh"
RC=$?

touch "$OUT/probe2.stop"; sleep 2; kill "$PROBE_PID" 2>/dev/null || true
echo "probe requests: $(wc -l < "$PROBE" 2>/dev/null || echo 0), not 200: $(grep -vc ' 200$' "$PROBE" 2>/dev/null || echo 0)"
echo "SWAP EXIT CODE: $RC"
exit $RC
