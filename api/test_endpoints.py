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
print(f"  service key: {KEY}")

# A real location, so the /facilities/{key}/... cases below hit a place that
# exists as well as ones that don't.
with urllib.request.urlopen(f"{BASE}/services/{KEY}/facilities?limit=1", timeout=120) as r:
    _fac = json.load(r)["results"][0]
FKEY, FADDR, FCITY = _fac["facility_key"], _fac["address"], _fac["city"]
print(f"  facility: {FKEY} ({FADDR}, {FCITY})\n")

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

# Endpoints added on this branch. Same reasoning as above: conditionally built
# SQL and optional parameters are where 500s hide.
for fkey, addr, city in [(FKEY, FADDR, FCITY), (FKEY, "WRONG ST", FCITY), (FKEY, FADDR, ""),
                         ("0" * 16, "1 NOWHERE ST", "NOWHERE"), ("x", "O'BRIEN AVE", "O'BRIEN")]:
    cases.append((f"/facilities/{urllib.parse.quote(fkey, safe='')}/services",
                  {"address": addr, "city": city}))
cases.append((f"/facilities/{FKEY}/services", {}))           # missing required params -> 422
cases.append((f"/facilities/{FKEY}/reviews", {}))
cases.append((f"/facilities/{FKEY}/listing", {}))

for q in [None, "", "metformin", "LISINOPRIL", "accu-chek", "a'b", "'; DROP TABLE costplus_drugs;--", "café", "%", "_"]:
    for lim in [None, 1, 20, 100]:
        cases.append(("/drugs", {"q": q, "limit": lim}))
for bad in [0, 101, -1, "abc"]:                               # rejected, never reach SQL
    cases.append(("/drugs", {"q": "metformin", "limit": bad}))
for name in ["Lisinopril", "Lisinopril / HCTZ", "Amlodipine-Atorvastatin", "no such drug", "a'b", "x" * 400]:
    cases.append(("/drugs/detail", {"name": name}))
cases.append(("/drugs/detail", {}))                            # missing required -> 422

for q in [None, "", "heart attack", "stroke", "a'b", "%"]:
    cases.append(("/hospital-stays", {"q": q}))
for drg in ["807", "470", "999999", "abc", "-1"]:
    cases.append((f"/hospital-stays/{drg}", {}))

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


# --- explicit expectations -------------------------------------------------
# The sweep above only proves "no 5xx". These pin what the review fixes changed.
def post(path: str, body: dict) -> int:
    req = urllib.request.Request(
        f"{BASE}{path}", data=json.dumps(body).encode(),
        headers={"Content-Type": "application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return r.status
    except urllib.error.HTTPError as e:
        return e.code


import hashlib
FAKE_ADDR, FAKE_CITY = "1 TEST-ONLY NOWHERE ST", "NOWHERE"
FAKE_KEY = hashlib.sha256(f"{FAKE_ADDR}|{FAKE_CITY}".encode()).hexdigest()[:16]

expectations = [
    ("real location -> 200",
     call(f"/facilities/{FKEY}/services", {"address": FADDR, "city": FCITY})[0], {200}),
    ("key that doesn't match address -> 400",
     call(f"/facilities/{FKEY}/services", {"address": "WRONG ST", "city": FCITY})[0], {400}),
    # The hash is public, so a made-up address with a matching hash must be
    # turned away before it can cost a table scan.
    ("made-up address with a VALID hash -> 404",
     call(f"/facilities/{FAKE_KEY}/services", {"address": FAKE_ADDR, "city": FAKE_CITY})[0], {404}),
    # 404 happens before any insert, so this writes nothing. 429 is also fine:
    # a repeated sweep from one IP can exhaust the review limiter.
    ("review for an unknown location -> 404, writes nothing",
     post(f"/facilities/{FAKE_KEY}/reviews", {"rating": 5}), {404, 429}),
]
bad = [(name, got, want) for name, got, want in expectations if got not in want]
print(f"\n  {len(expectations)} explicit expectations, {len(bad)} wrong")
for name, got, want in bad:
    print(f"  WRONG  {name}: got {got}, wanted {sorted(want)}")
if not bad:
    print("  all expectations met")
raise SystemExit(1 if (fails or bad) else 0)
