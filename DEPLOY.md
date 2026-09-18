# Deploying the Starkwell demo

One container, one small droplet, one public link. FastAPI serves both the
API and the built frontend on a single port — see `Dockerfile` and the
`RewritePrefix`/SPA-fallback additions in `api/serving_api.py`.

## 1. Create the droplet

- [DigitalOcean → Create → Droplet](https://cloud.digitalocean.com/droplets/new)
- Image: **Marketplace → Docker** (Docker pre-installed on Ubuntu — skip a
  manual install step)
- Plan: Basic, **Regular SSD, $6/mo (nominally 1 GB RAM / 1 vCPU / 25 GB
  disk)** — plenty for a 244 MB dataset and a single demo container. The
  droplet actually running today reports **~1.9 GB RAM and 48 GB disk** via
  `free -h`/`df -h` — either DigitalOcean has quietly upgraded this tier's
  specs since this was written, or the original numbers here were just off.
  Either way: the memory limits in step 3 are tuned to that *observed*
  1.9 GB, not the nominal 1 GB. If this droplet is ever recreated from
  scratch, re-check `free -h` before assuming those numbers still fit — a
  genuinely 1 GB machine would need them roughly halved.
- Region: closest to who you're sending the link to (SFO3 is closest to Utah)
- Authentication: **SSH key** → paste the public key below (a fresh keypair
  was generated for this specifically, not reused from anywhere else)

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIHN/zWGaQTMmjmQakF1iHzORm8/Bg/C2lbyK47gokgD/ starkwell-deploy
```

Create it, then send me the droplet's IP address and I'll handle the rest
over SSH from here (private key is already at `~/.ssh/starkwell_deploy`).

## 2. One-time: the AI search API key

The AI-assisted search fallback (`POST /api/services/ai-search`, see
`api/serving_api.py`) needs an Anthropic API key at runtime. This is a
secret, not a config path like every other `STARKWELL_*` value, so it does
**not** go in the Dockerfile's `ENV` block (that would bake it into the
image's layer history) — it lives in a file only on the droplet, injected at
`docker run` time.

1. Get a key from the [Anthropic Console](https://console.anthropic.com/)
   (requires signing up and adding billing — a human step, not something to
   script).
2. Once, over SSH on the droplet:
   ```bash
   echo "STARKWELL_ANTHROPIC_API_KEY=sk-ant-..." > /root/starkwell.env
   chmod 600 /root/starkwell.env
   ```
3. That's it — every `docker run` below reads it via `--env-file`. Without
   this file, the feature just stays off (`enabled: false` in the API
   response) rather than failing; nothing else about the site needs it.

## 2b. One-time: persistent data directory

Everything inside the container is wiped on every `docker rm` (every
redeploy, every rollback) — until 2026-09-17, that included absolutely
everything the app ever wrote, because nothing was ever mounted from the
host. The first thing that actually needed to survive a redeploy was
zero-result search logging (see `api/serving_api.py`'s `_log_search_miss`),
so this now exists and every `docker run` below mounts it in:
```bash
mkdir -p /root/starkwell-data
```
`-v /root/starkwell-data:/app/data-writable` maps that host directory into
the container at `/app/data-writable`. Anything the app needs to persist
long-term (this search-miss log now, a future reviews table, etc.) goes
there, never in the container's own writable layer or in `/tmp` (which is
still fine for the ephemeral DuckDB query cache — that's *supposed* to reset
on every restart, see `db()`).

## 3. What happens next (for reference — I'll run these)

```bash
# From the repo root, package the project (data is already staged locally by
# deploy/package_data.ps1) and copy it to the droplet — no rsync on this
# machine, so a tarball over scp instead
tar --exclude node_modules --exclude dist --exclude .git --exclude utah_pricing \
    --exclude '*.make' --exclude '*.zip' -czf /tmp/starkwell.tar.gz .
scp -i ~/.ssh/starkwell_deploy /tmp/starkwell.tar.gz root@<DROPLET_IP>:/root/

# On the droplet: unpack and build
ssh -i ~/.ssh/starkwell_deploy root@<DROPLET_IP> \
  "mkdir -p /root/starkwell && tar -xzf /root/starkwell.tar.gz -C /root/starkwell && \
   cd /root/starkwell && docker build -t starkwell:new ."
```

Then run `deploy/swap.sh` (below) over SSH to actually put the new image live.

**Why a separate swap step, not just `docker rm -f` then `docker run`**: that
straight-line sequence has a real failure mode — found the hard way on
2026-09-16, when a redeploy's `docker run` failed (`--env-file` pointed at a
`/root/starkwell.env` that didn't exist on this droplet) *after* the old
container had already been removed, leaving the site down with nothing
running until someone noticed and started a container by hand. The image
itself was fine; the failure was purely in the handoff between old and new.
`swap.sh` starts the new image as a throwaway container on a side port
first, waits for it to actually answer `/api/health`, and only *then* touches
the live container on port 80 — so a bad image, a missing env file, or any
other startup failure aborts with the old container still running,
untouched, instead of taking the site down.

The script itself lives at `deploy/swap.sh` (copy it to the droplet once,
alongside the repo, at `/root/starkwell/deploy/swap.sh`) rather than being
duplicated here — a copy inline in this doc would inevitably drift out of
sync with the real file. Run it as `bash deploy/swap.sh` from `/root/starkwell`
after `docker build`.

**2026-09-16 addendum, after a second incident the same night**: the first
version of `swap.sh` ran the canary at the *same* `--memory=1400m` cap
alongside the still-running production container — on this droplet's ~1.9GB
of RAM, two containers each capable of using up to 1.4GB is more than the
box has, and it briefly froze the whole machine (SSH included) exactly like
the 2026-09-14 OOM incident below, before `--restart unless-stopped`
recovered the production container on its own once the overload passed. The
fix wasn't rewriting the swap logic — running two copies briefly during a
deploy is inherently going to spike memory on a box this size no matter how
it's sequenced — it was giving the droplet **2GB of swap** (there was
none configured before):
```bash
fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab   # persists across reboots
```
This is standard practice for small-memory cloud instances specifically for
this scenario: a transient memory spike now pages to disk (slower, but
survivable) instead of triggering the kernel OOM killer and freezing the
box. If this droplet is ever recreated from scratch, redo this step before
running `swap.sh` for the first time.

That's it — `http://<DROPLET_IP>` is then a working public link. Two things
worth knowing about what `swap.sh` is protecting against, both added
2026-09-14 (the memory cap) and still true after the 2026-09-16 rewrite above:

- **`--memory=1400m` is a hard safety cap**, not a tuning knob to raise
  casually. `api/serving_api.py`'s `prices` table is built once at process
  startup into a file-backed, disk-spilling DuckDB database (see the long
  comment in `db()`) rather than held fully in memory — an earlier version
  materialized it fully in-memory with no realistic cap, used over 1 GB RSS,
  and OOM-killed the droplet in a crash loop that took the whole box
  (including SSH) briefly unresponsive. `--memory=1400m` means a regression
  here gets this ONE container killed and auto-restarted by
  `--restart unless-stopped`, not the whole droplet. Verified peak usage is
  ~650-700 MB; 1400m leaves real headroom without being so loose it stops
  protecting anything.
- **Every container takes ~2-3 minutes to start answering requests** (a
  fresh deploy, or an automatic restart after a crash) — before it starts
  listening at all, `serving_api.py` builds that same materialized table,
  which takes that long on this droplet's single weak vCPU (~30 seconds on a
  normal dev machine). A request during that window gets connection-refused
  immediately rather than hanging, which is deliberate — see the comment
  above `if __name__ == "__main__":` in `serving_api.py`. This is exactly
  why `swap.sh` polls the *canary's* health endpoint before touching
  production instead of assuming `docker run` returning means the app is
  up — the process was previously **do not consider a deploy finished at
  the moment `docker run` returns, poll `/api/health` yourself**; `swap.sh`
  now does that polling as part of the swap itself, on both the canary and
  the final production container.

**Quick backend-only redeploy**: for a change to `api/serving_api.py` alone
(no new data, no frontend change), skip the full tar/scp — `/root/starkwell`
already holds the last full upload, so just push the one file and rebuild.
Docker's layer cache makes this rebuild take well under a minute instead of
several:
```bash
scp -i ~/.ssh/starkwell_deploy api/serving_api.py root@<DROPLET_IP>:/root/starkwell/api/serving_api.py
ssh -i ~/.ssh/starkwell_deploy root@<DROPLET_IP> "cd /root/starkwell && docker build -t starkwell:new ."
# then run deploy/swap.sh on the droplet, same as a full deploy
```

## 4. Rolling back

Every deploy tags the image it's replacing as `starkwell:rollback-<timestamp>`
before swapping (see step 3), so recovering from a bad deploy is just running
an older tag instead of `starkwell:latest`:
```bash
docker images | grep starkwell   # find the rollback tag to use
docker rm -f starkwell
docker run -d --name starkwell --restart unless-stopped -p 80:8080 --memory=1400m \
  --env-file /root/starkwell.env \
  -v /root/starkwell-data:/app/data-writable starkwell:rollback-<timestamp>
```
This is also the fix for the 2026-09-14 outage described above: the bad
image was never re-tagged as `:latest`, so `starkwell:latest` still pointed
at the last known-good build and rolling back was exactly this.

Rollback tags accumulate (~1.3-1.5 GB each) and this droplet's disk isn't
huge — check in on it occasionally:
```bash
df -h /                                  # keep an eye on free space
docker system df                         # build cache in particular can
                                          # grow to several GB doing nothing
docker builder prune -af                 # always safe — cached layers only
docker rmi starkwell:rollback-<old-tag>  # keep the last ~5-6, drop older ones
```

## 5. Refreshing the data later

After a monthly rebuild, re-run `deploy/package_data.ps1` locally, then
re-sync and re-build on the droplet (same commands as step 3 — `docker build`
picks up the new files). `/root/starkwell.env` from step 2 already lives on
the droplet and doesn't need to be redone — it survives every future
rebuild.

## 6. Optional, later, still cheap

- **A real domain + HTTPS**: a domain costs ~$10-15/year, and
  [Caddy](https://caddyserver.com/) in front of the container gets free
  auto-renewing HTTPS with about 5 lines of config. Not needed for an IP link
  sent to a handful of people — worth doing once this is more than a demo.
- Everything above stays at **$6/month total** with no domain.
