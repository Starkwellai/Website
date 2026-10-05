#!/usr/bin/env bash
# One-time setup on the droplet: put backup_data.sh in place and schedule it
# daily at 03:30 UTC. Safe to run again; it replaces its own cron line.
#   bash deploy/install_backup.sh
set -euo pipefail
cd "$(dirname "$0")"
install -m 700 backup_data.sh /root/backup_data.sh
LINE='30 3 * * * /root/backup_data.sh >> /root/starkwell-backups/cron.log 2>&1'
mkdir -p /root/starkwell-backups && chmod 700 /root/starkwell-backups
( crontab -l 2>/dev/null | grep -v 'backup_data.sh' || true; echo "$LINE" ) | crontab -
echo "Installed. Current crontab:"; crontab -l
echo "Running one backup now to prove it works..."
/root/backup_data.sh
