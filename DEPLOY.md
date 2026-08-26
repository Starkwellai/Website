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

## 2. What happens next (for reference — I'll run these)

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
   docker run -d --name starkwell --restart unless-stopped -p 80:8080 starkwell"
```

That's it — `http://<DROPLET_IP>` is then a working public link.

## 3. Refreshing the data later

After a monthly rebuild, re-run `deploy/package_data.ps1` locally, then
re-sync and re-build on the droplet (same two commands above — `docker build`
picks up the new files, `docker run` needs the old container removed first:
`docker rm -f starkwell`).

## 4. Optional, later, still cheap

- **A real domain + HTTPS**: a domain costs ~$10-15/year, and
  [Caddy](https://caddyserver.com/) in front of the container gets free
  auto-renewing HTTPS with about 5 lines of config. Not needed for an IP link
  sent to a handful of people — worth doing once this is more than a demo.
- Everything above stays at **$6/month total** with no domain.
