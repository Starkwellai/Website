# Deploying the Starkwell demo

One container, one small droplet, one public link. FastAPI serves both the
API and the built frontend on a single port — see `Dockerfile` and the
`RewritePrefix`/SPA-fallback additions in `api/serving_api.py`.

## 1. Create the droplet

- [DigitalOcean → Create → Droplet](https://cloud.digitalocean.com/droplets/new)
- Image: **Marketplace → Docker** (Docker pre-installed on Ubuntu — skip a
  manual install step)
- Plan: Basic, **Regular SSD, $6/mo (1 GB RAM / 1 vCPU / 25 GB disk)** — plenty
  for a 244 MB dataset and a single demo container
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

## 3. What happens next (for reference — I'll run these)

```bash
# From the repo root, package the project (data is already staged locally by
# deploy/package_data.ps1) and copy it to the droplet — no rsync on this
# machine, so a tarball over scp instead
tar --exclude node_modules --exclude dist --exclude .git -czf /tmp/starkwell.tar.gz .
scp -i ~/.ssh/starkwell_deploy /tmp/starkwell.tar.gz root@<DROPLET_IP>:/root/

# On the droplet: unpack, build, run
ssh -i ~/.ssh/starkwell_deploy root@<DROPLET_IP> \
  "mkdir -p /root/starkwell && tar -xzf /root/starkwell.tar.gz -C /root/starkwell && \
   cd /root/starkwell && docker build -t starkwell . && \
   docker run -d --name starkwell --restart unless-stopped -p 80:8080 \
     --env-file /root/starkwell.env starkwell"
```

That's it — `http://<DROPLET_IP>` is then a working public link.

## 4. Refreshing the data later

After a monthly rebuild, re-run `deploy/package_data.ps1` locally, then
re-sync and re-build on the droplet (same two commands above — `docker build`
picks up the new files, `docker run` needs the old container removed first:
`docker rm -f starkwell`). `/root/starkwell.env` from step 2 already lives on
the droplet and doesn't need to be redone — it survives every future
rebuild.

## 5. Optional, later, still cheap

- **A real domain + HTTPS**: a domain costs ~$10-15/year, and
  [Caddy](https://caddyserver.com/) in front of the container gets free
  auto-renewing HTTPS with about 5 lines of config. Not needed for an IP link
  sent to a handful of people — worth doing once this is more than a demo.
- Everything above stays at **$6/month total** with no domain.
