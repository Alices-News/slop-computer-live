# Fork notes

Parent: [clawdbotatg/slop-computer-live](https://github.com/clawdbotatg/slop-computer-live)  
License: MIT (Austin Griffith, 2026). This overlay adds a second copyright line for Alices News changes only; it does not replace theirs.

Remotes:

- `origin` — https://github.com/Alices-News/slop-computer-live
- `upstream` — https://github.com/clawdbotatg/slop-computer-live

Pull upstream when we want their fixes. Keep identity overlay on this branch as a small, named commit.

DNS: `live.alices.news` and `media.alices.news` A records are in the Cloudflare zone (DNS-only, origin `45.82.75.142`). Nameservers for the zone are `lennon.ns.cloudflare.com` / `sharon.ns.cloudflare.com`. The registrar is still Namecheap (`dns1.registrar-servers.com`); HTTPS certs issue after those nameservers are set at Namecheap.

## Overlay files (this phase)

Hostname swap `live.slop.computer` → `live.alices.news`, `media.slop.computer` → `media.alices.news`, plus enabling their server-side recorder. No product rewrite.

| File | What changed |
| --- | --- |
| `deploy/Caddyfile` | Public vhosts. Dropped `circle.slop.computer` (different repo). Left the `/ipfs` reverse_proxy commented out — Kubo is optional and this box already binds `:8080` for Endless Channel. |
| `packages/nextjs/.env.example` | Documented production `NEXT_PUBLIC_*` URLs for alices.news. Real `.env.local` lives on the VPS (gitignored, inlined at `next build`). |
| `packages/relay/.env.example` | Documented production CORS / admin domain / HLS URL. Real `.env` lives on the VPS. |
| `packages/browser-host/.env.example` | Production CORS origin. |
| `deploy/slop-broadcast.env.example` | God-mode URL on `live.alices.news`. Real `deploy/slop-broadcast.env` is gitignored. |
| `ops/deploy.sh` | `PROD_HOST` and bundle needles, if we later use the Mac-build path. First bring-up builds on the VPS per `deploy/README.md`. |
| `packages/relay/src/index.ts` | Production `slop_session` cookie domain reads `COOKIE_DOMAIN` (still defaults to `.slop.computer`). Without this, Set-Cookie is scoped to the parent fork domain and login never sticks on `live.alices.news`. |

Checkout lives at `Alices News/slop-computer-live/`, not inside `alice-agent/`.

Alice wiring, discovery, and clipper work belong in later commits, not rewritten history.
