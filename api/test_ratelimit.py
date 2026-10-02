"""Pins RateLimiter, including the cleanup path the first version of this
logic never exercised. Pure, no server:

    python api/test_ratelimit.py      (or: pytest api/test_ratelimit.py)
"""
from ratelimit import RateLimited, RateLimiter


def _blocked(rl, key, now):
    try:
        rl.check(key, now)
    except RateLimited:
        return True
    return False


def test_allows_up_to_limit_then_blocks():
    rl = RateLimiter(limit=3, window=60)
    for t in (0, 1, 2):
        rl.check("a", now=t)
    assert _blocked(rl, "a", now=3)


def test_window_slides():
    rl = RateLimiter(limit=2, window=60)
    rl.check("a", now=0)
    rl.check("a", now=1)
    assert _blocked(rl, "a", now=30)
    rl.check("a", now=61)  # the hit at t=0 has aged out


def test_keys_are_independent():
    rl = RateLimiter(limit=1, window=60)
    rl.check("a", now=0)
    rl.check("b", now=0)
    assert _blocked(rl, "a", now=1)


def test_blocked_attempts_are_not_recorded():
    rl = RateLimiter(limit=1, window=60)
    rl.check("a", now=0)
    for t in range(1, 20):
        assert _blocked(rl, "a", now=t)
    rl.check("a", now=61)  # only the t=0 hit counted; it has aged out


def test_prune_drops_keys_that_aged_out():
    rl = RateLimiter(limit=5, window=60, max_keys=10)
    for i in range(11):
        rl.check(f"old{i}", now=0)
    assert len(rl) == 11
    rl.check("fresh", now=1000)  # over the cap, so this call prunes first
    assert len(rl) == 1


def test_flood_of_live_keys_is_capped_and_amortized():
    rl = RateLimiter(limit=5, window=3600, max_keys=100)
    for i in range(1000):
        rl.check(f"ip{i}", now=float(i))  # all inside the window: nothing is stale
    assert len(rl) <= 101
    # evicts the least-recently-seen, so the newest keys survive
    assert "ip999" in rl._hits and "ip0" not in rl._hits


if __name__ == "__main__":
    for name, fn in list(globals().items()):
        if name.startswith("test_"):
            fn()
            print("ok", name)
