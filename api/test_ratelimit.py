"""Pins RateLimiter, including the cleanup path the first version of this
logic never exercised. Pure, no server:

    python api/test_ratelimit.py      (or: pytest api/test_ratelimit.py)
"""
import sys
import threading
import time

from ratelimit import RateLimited, RateLimiter, parse_trusted_proxies, resolve_client_ip


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


def _hammer(rl, worker, n_threads):
    """Run worker(i) on n_threads threads with a tiny switch interval so a
    missing lock actually shows up; return any exceptions the workers raised."""
    errors = []
    start = threading.Barrier(n_threads)

    def run(i):
        try:
            start.wait()
            worker(i)
        except Exception as e:  # noqa: BLE001 - the point is to catch anything
            errors.append(repr(e))

    old = sys.getswitchinterval()
    sys.setswitchinterval(1e-6)
    try:
        threads = [threading.Thread(target=run, args=(i,)) for i in range(n_threads)]
        for th in threads:
            th.start()
        for th in threads:
            th.join()
    finally:
        sys.setswitchinterval(old)
    return errors


def test_concurrent_flood_never_raises():
    # Tiny cap so pruning (which iterates and deletes) runs constantly while
    # other threads insert. Without the lock this raises "dictionary changed
    # size during iteration" -- a 500 instead of a 429.
    rl = RateLimiter(limit=5, window=3600, max_keys=40)

    def worker(i):
        for n in range(1500):
            try:
                rl.check(f"ip-{i}-{n}", now=float(n))
            except RateLimited:
                pass

    assert _hammer(rl, worker, n_threads=8) == []


class _SlowReadDict(dict):
    """Pauses between a key's count being read and the new hit being written,
    which is the window an unlocked check-then-append races through. Makes the
    overshoot deterministic: without this, a lockless limiter still allowed
    exactly 5 in 4 of 5 runs, so the test would usually stay green."""
    def get(self, key, default=None):
        value = super().get(key, default)
        time.sleep(0.002)
        return value


def test_concurrent_requests_cannot_overshoot_the_limit():
    rl = RateLimiter(limit=5, window=3600)
    rl._hits = _SlowReadDict()
    allowed = []

    def worker(i):
        for _ in range(20):
            try:
                rl.check("same-ip", now=1.0)
                allowed.append(1)
            except RateLimited:
                pass

    assert _hammer(rl, worker, n_threads=12) == []
    assert len(allowed) == 5


PROXY = parse_trusted_proxies("10.0.0.2")


def test_client_ip_with_no_trusted_proxies_ignores_the_header():
    # Directly exposed: a client-supplied X-Forwarded-For must NOT choose its
    # own rate-limit key.
    assert resolve_client_ip("203.0.113.9", "1.2.3.4") == "203.0.113.9"


def test_client_ip_behind_proxy_uses_the_proxy_appended_entry():
    # The proxy appends the real peer; anything before it was client-claimed.
    assert resolve_client_ip("10.0.0.2", "6.6.6.6, 198.51.100.7", PROXY) == "198.51.100.7"
    assert resolve_client_ip("10.0.0.2", "198.51.100.7", PROXY) == "198.51.100.7"


def test_client_ip_header_from_a_non_proxy_peer_is_ignored():
    # The container port is also reachable without the proxy. A caller that is
    # not the proxy must not be able to pick its own key by forging the header.
    assert resolve_client_ip("203.0.113.9", "198.51.100.7", PROXY) == "203.0.113.9"


def test_client_ip_trusted_proxy_cidr_and_ipv6():
    nets = parse_trusted_proxies("172.17.0.0/16, ::1")
    assert resolve_client_ip("172.17.0.1", "198.51.100.7", nets) == "198.51.100.7"
    assert resolve_client_ip("172.18.0.1", "198.51.100.7", nets) == "172.18.0.1"
    assert resolve_client_ip("::1", "198.51.100.7", nets) == "198.51.100.7"
    # an IPv4 peer is never matched by an IPv6 network
    assert resolve_client_ip("10.0.0.2", "198.51.100.7", parse_trusted_proxies("::/0")) == "10.0.0.2"


def test_client_ip_falls_back_when_header_missing_or_blank():
    assert resolve_client_ip("10.0.0.2", None, PROXY) == "10.0.0.2"
    assert resolve_client_ip("10.0.0.2", " , ", PROXY) == "10.0.0.2"
    assert resolve_client_ip(None, None) == "unknown"
    assert resolve_client_ip("not-an-ip", "198.51.100.7", PROXY) == "not-an-ip"


def test_malformed_proxy_setting_fails_loudly():
    for bad in ("10.0.0.2, banana", "300.1.1.1"):
        try:
            parse_trusted_proxies(bad)
        except ValueError:
            continue
        raise AssertionError(f"accepted {bad!r}")
    assert parse_trusted_proxies("") == ()
    assert parse_trusted_proxies(" , ") == ()


if __name__ == "__main__":
    for name, fn in list(globals().items()):
        if name.startswith("test_"):
            fn()
            print("ok", name)
