#!/usr/bin/env bash
# Nightly copy of the data that exists nowhere else: provider accounts and
# claimed listings, patient reviews, and the activity logs. Everything else on
# the server can be rebuilt from this repo and the data pipeline; these cannot.
#
# SQLite files are copied with SQLite's own online-backup call, not `cp`: the
# API may be mid-write, and a plain copy of a live database can come out
# corrupt. Each copy is then opened and integrity-checked, and the script exits
# non-zero (and says so in the log) if any check fails.
#
# Installed on the droplet as a daily cron job by deploy/install_backup.sh.
# Keeps the newest 14 days. Backups are root-only (they contain password
# hashes and session tokens).
#
# NOTE: this protects against corruption, a bad deploy, or deleting the wrong
# file. It lives on the same disk as the data, so it does NOT protect against
# losing the server itself. For that, turn on DigitalOcean droplet backups or
# copy /root/starkwell-backups somewhere else.
set -euo pipefail

SRC=${SRC:-/root/starkwell-data}
DEST_ROOT=${DEST_ROOT:-/root/starkwell-backups}
KEEP_DAYS=${KEEP_DAYS:-14}
STAMP=$(date -u +%Y-%m-%d)
DEST="$DEST_ROOT/$STAMP"

umask 077
mkdir -p "$DEST"
log() { echo "$(date -u +%FT%TZ) $*" | tee -a "$DEST_ROOT/backup.log"; }

set +e
python3 - "$SRC" "$DEST" <<'PY'
import glob, os, shutil, sqlite3, sys
src, dest = sys.argv[1], sys.argv[2]
failed = False
for path in sorted(glob.glob(os.path.join(src, "*.db"))):
    name = os.path.basename(path)
    out = os.path.join(dest, name)
    if os.path.exists(out):
        os.remove(out)
    live = sqlite3.connect(f"file:{path}?mode=ro", uri=True)
    copy = sqlite3.connect(out)
    live.backup(copy)
    live.close()
    ok = copy.execute("PRAGMA integrity_check").fetchone()[0]
    tables = [r[0] for r in copy.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")]
    rows = {t: copy.execute(f'SELECT count(*) FROM "{t}"').fetchone()[0] for t in tables}
    copy.close()
    print(f"{name}: integrity={ok} rows={rows}")
    if ok != "ok":
        failed = True
# Append-only logs: a plain copy is fine (worst case the last line is partial).
for path in sorted(glob.glob(os.path.join(src, "*.jsonl"))):
    shutil.copy2(path, os.path.join(dest, os.path.basename(path)))
    print(f"{os.path.basename(path)}: copied")
sys.exit(1 if failed else 0)
PY
status=$?
set -e
if [ "$status" -ne 0 ]; then
  log "BACKUP FAILED (integrity check or copy error) -> $DEST"
  exit 1
fi

# Retention: drop dated folders older than KEEP_DAYS.
find "$DEST_ROOT" -mindepth 1 -maxdepth 1 -type d -name '20??-??-??' -mtime +"$KEEP_DAYS" -exec rm -rf {} +

log "backup ok -> $DEST ($(du -sh "$DEST" | cut -f1))"
