"""Per-key sliding-window rate limiter, in-process.

One class instead of the four copies of the same dict-and-list logic that
lived in serving_api.py (AI search, reviews, appointment requests, provider
auth). Its own module so the cleanup behavior can be tested without importing
the API, which opens DuckDB.

In-process state is safe only because the API runs a single uvicorn worker
(see the __main__ block in serving_api.py); it resets on every restart.

Thread-safe: the endpoints that use it are plain `def` handlers, which FastAPI
runs on a threadpool, so check() is called concurrently.
"""
from __future__ import annotations

import ipaddress
import threading
import time
from typing import Optional, Sequence, Union

Network = Union[ipaddress.IPv4Network, ipaddress.IPv6Network]


class RateLimited(Exception):
    """Raised when a key has used up its allowance for the current window."""


class RateLimiter:
    def __init__(self, limit: int, window: float, max_keys: int = 2000) -> None:
        self.limit = limit
        self.window = window
        self.max_keys = max_keys
        self._hits: dict[str, list[float]] = {}
        # Without this, _prune iterating the dict while another thread inserts
        # raises "dictionary changed size during iteration" (a 500 instead of a
        # 429, in exactly the flood it exists for), and two simultaneous
        # requests from one key can both read a count below the limit.
        self._lock = threading.Lock()

    def check(self, key: str, now: Optional[float] = None) -> None:
        now = time.time() if now is None else now
        with self._lock:
            if len(self._hits) > self.max_keys:
                self._prune(now)
            hits = [t for t in self._hits.get(key, []) if now - t < self.window]
            if len(hits) >= self.limit:
                raise RateLimited
            hits.append(now)
            self._hits[key] = hits

    def _prune(self, now: float) -> None:
        """Drop keys whose newest hit has aged out. If a flood of distinct keys
        is all still inside the window nothing is stale, so also evict the
        least-recently-seen down to 75% of the cap: that bounds memory, and
        leaves headroom so the next prune isn't triggered by the very next
        call (which would make every request during a flood walk the dict).
        Evicting live keys resets their counts, which is the cheaper failure
        than unbounded growth. Caller holds self._lock."""
        for stale in [k for k, v in self._hits.items() if not v or now - v[-1] >= self.window]:
            del self._hits[stale]
        target = int(self.max_keys * 0.75)
        if len(self._hits) > target:
            oldest_first = sorted(self._hits, key=lambda k: self._hits[k][-1])
            for k in oldest_first[: len(self._hits) - target]:
                del self._hits[k]

    def __len__(self) -> int:
        with self._lock:
            return len(self._hits)


def parse_trusted_proxies(spec: str) -> tuple[Network, ...]:
    """Parse a comma-separated list of proxy addresses or CIDR ranges
    ("172.17.0.1, 10.0.0.0/8"). Raises ValueError on anything malformed so a
    typo fails the container at startup, where the deploy's canary check
    catches it, instead of silently trusting nothing (or everything)."""
    return tuple(ipaddress.ip_network(part.strip(), strict=False)
                 for part in spec.split(",") if part.strip())


def resolve_client_ip(peer: Optional[str], forwarded_for: Optional[str],
                      trusted_proxies: Sequence[Network] = ()) -> str:
    """The address rate limits are keyed on.

    Directly exposed (today): the TCP peer. Behind a reverse proxy that
    terminates TLS (nginx, Caddy, a platform load balancer) the peer is the
    proxy for every visitor, so every limit would collapse into one site-wide
    bucket and one person could lock out all providers.

    X-Forwarded-For is honored ONLY when the TCP peer is one of
    `trusted_proxies`, and then the LAST entry is used: that is the one the
    trusted proxy appended, whereas earlier entries are whatever the client
    claimed. Gating on the peer (rather than a bare on/off flag) matters
    because the container port is also reachable without going through the
    proxy: with a flag, anyone could hit it directly with a forged header and
    pick a fresh rate-limit key on every request, defeating the login
    brute-force limit. Empty by default, so nothing is trusted."""
    if peer and forwarded_for and trusted_proxies:
        try:
            peer_ip = ipaddress.ip_address(peer)
        except ValueError:
            return peer
        if any(peer_ip in net for net in trusted_proxies if net.version == peer_ip.version):
            last = forwarded_for.split(",")[-1].strip()
            if last:
                return last
    return peer or "unknown"
