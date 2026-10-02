"""Per-key sliding-window rate limiter, in-process.

One class instead of the four copies of the same dict-and-list logic that
lived in serving_api.py (AI search, reviews, appointment requests, provider
auth). Its own module so the cleanup behavior can be tested without importing
the API, which opens DuckDB.

In-process state is safe only because the API runs a single uvicorn worker
(see the __main__ block in serving_api.py); it resets on every restart.
"""
from __future__ import annotations

import time
from typing import Optional


class RateLimited(Exception):
    """Raised when a key has used up its allowance for the current window."""


class RateLimiter:
    def __init__(self, limit: int, window: float, max_keys: int = 2000) -> None:
        self.limit = limit
        self.window = window
        self.max_keys = max_keys
        self._hits: dict[str, list[float]] = {}

    def check(self, key: str, now: Optional[float] = None) -> None:
        now = time.time() if now is None else now
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
        than unbounded growth."""
        for stale in [k for k, v in self._hits.items() if not v or now - v[-1] >= self.window]:
            del self._hits[stale]
        target = int(self.max_keys * 0.75)
        if len(self._hits) > target:
            oldest_first = sorted(self._hits, key=lambda k: self._hits[k][-1])
            for k in oldest_first[: len(self._hits) - target]:
                del self._hits[k]

    def __len__(self) -> int:
        return len(self._hits)
