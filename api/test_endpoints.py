"""Exercise every serving-API endpoint against every parameter combination.

The city-filter 500 was a Binder Error: adding the system_at join gave the query
two `city` columns, and the unqualified reference in the WHERE clause only got
bound when a city was actually supplied. Every test up to that point had left
city empty, so nothing exercised the broken branch.

That is the bug CLASS worth hunting: SQL assembled conditionally, where a filter
that is usually absent carries an error nobody sees. So this walks the full
cross-product of optional parameters rather than the happy path.

A 404 is a legitimate answer (no rows). A 422 is legitimate for a rejected
value. Only 5xx is a defect.
"""
import itertools
import json
import urllib.parse
import urllib.request

BASE = "http://127.0.0.1:8001/api"


def call(path: str, params: dict) -> tuple[int, str]:
    qs = urllib.parse.urlencode({k: v for k, v in params.items() if v not in (None, "")})
    url = f"{BASE}{path}" + (f"?{qs}" if qs else "")
    try:
        with urllib.request.urlopen(url, timeout=120) as r:
            return r.status, ""
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", "replace")[:120]
    except Exception as e:
        return 0, f"{type(e).__name__}: {e}"


# Resolve a real service key first.
import urllib.error
with urllib.request.urlopen(f"{BASE}/services?q=mri%20knee&limit=1", timeout=120) as r:
    KEY = json.load(r)["results"][0]["service_key"]
print(f"  service key: {KEY}\n")

CITY = [None, "OGDEN", "ogden", "Salt Lake City", "NOWHERE", "O'BRIEN"]
BOOL = [None, "true", "false"]
SORT = [None, "recommended", "price_asc", "price_desc"]

cases: list[tuple[str, dict]] = []

# /services
for q in [None, "mri", "mri knee", "x", "'; DROP TABLE prices;--", "café"]:
    for cat in [None, "Imaging", "Nonexistent"]:
        cases.append(("/services", {"q": q, "category": cat, "limit": 5}))

# /categories
cases.append(("/categories", {}))

# /facilities  - the endpoint that broke
for city, named in itertools.product(CITY, BOOL):
    cases.append((f"/services/{KEY}/facilities",
                  {"city": city, "named_only": named, "limit": 5}))

# Rejected values must 422, never reach the SQL. `sort` is the only parameter
# interpolated into the query text rather than bound, so it is the one place an
# injection could land; it is validated by regex and then looked up in an
# allow-list. Keep these cases.
for bad in ["DROP TABLE", "median_rate; --", "' OR 1=1--", ""]:
    cases.append((f"/services/{KEY}/providers", {"sort": bad, "limit": 2}))

# /providers  - same conditional-WHERE construction
for city, trusted, comp, srt in itertools.product(
        CITY[:4], BOOL, BOOL[:2], SORT):
    cases.append((f"/services/{KEY}/providers",
                  {"city": city, "trusted_only": trusted,
                   "comparable_only": comp, "sort": srt, "limit": 5}))

# /providers with the address drill-down, incl. an apostrophe and a bad value
for addr in [None, "4401 HARRISON BLVD", "NO SUCH ST", "O'CONNOR AVE"]:
    for city in [None, "OGDEN"]:
        cases.append((f"/services/{KEY}/providers",
                      {"address": addr, "city": city, "limit": 5}))

# unknown service key, and one with characters needing escaping
for bad in ["no_such_service", "a'b", "../etc"]:
    cases.append((f"/services/{urllib.parse.quote(bad, safe='')}/facilities", {}))
    cases.append((f"/services/{urllib.parse.quote(bad, safe='')}/providers", {}))

# /providers/{npi}
for npi in ["1234567890", "abc", "'"]:
    cases.append((f"/providers/{urllib.parse.quote(npi, safe='')}", {}))

cases.append(("/health", {}))

fails, ok404, ok422, good = [], 0, 0, 0
for path, params in cases:
    status, body = call(path, params)
    if status >= 500 or status == 0:
        fails.append((path, params, status, body))
    elif status == 404:
        ok404 += 1
    elif status == 422:
        ok422 += 1
    else:
        good += 1

print(f"  {len(cases)} requests: {good} ok, {ok404} 404 (no rows), "
      f"{ok422} 422 (rejected), {len(fails)} FAILURES\n")
for path, params, status, body in fails:
    shown = {k: v for k, v in params.items() if v not in (None, "")}
    print(f"  FAIL {status}  {path}  {shown}")
    print(f"       {body}")
if not fails:
    print("  no 5xx across the parameter matrix")
