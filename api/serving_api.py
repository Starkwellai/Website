"""
Starkwell serving API — procedure-first search over the published price slice.

WHY THIS EXISTS SEPARATELY FROM utah_pricing/api.py
---------------------------------------------------
The older API reads the pre-summary schema: a 999 MB+ `payer_rates` parquet in
the site folder which it aggregates live at startup. That data is stale (it
predates the Regence re-fetch, EMI Health, MotivHealth and the provenance_key
rework) and the shape is code-first — you search a CPT code and get rates.

The product is procedure-first: "MRI knee near Provo" -> ranked providers with
what you'd pay. That is the shape data/serving/service_provider_prices.parquet
already has, so this serves it directly. 119 MB, no warm-up, no materialization.

THE ONE RULE THIS MODULE EXISTS TO ENFORCE
------------------------------------------
Never order providers by price alone.

build_serving.py already drops `unlikely`-evidence rows before writing the
slice, so every row here is fit to show. Among the rows that remain, `evidence`
records WHY we believe a provider performs a service:

    performed    the provider actually billed this code (Medicare volume)
    peer         providers of the same taxonomy perform it
    peer_family  providers of the same taxonomy perform this CPT family
    unknown      the taxonomy is not judgeable — no evidence either way

`unknown` is not a small tail: 1,241,460 of 5.79M displayable rows. Those rows
exist because a negotiated rate proves a provider is IN NETWORK for a code, not
that they PERFORM it, and payers sign blanket contracts covering codes a
provider will never bill.

Ordering "MRI - knee" by median_rate alone puts THE LACTATION NETWORK, LLC at
the top at $48. Ordering by (evidence_rank, median_rate) puts real physicians at
$216-276. Same data, same filter — the only difference is honouring the ladder.
So every provider query here goes through provider_rows(), and the ORDER BY
lives in exactly one place.

Run:
  py api/serving_api.py            # http://127.0.0.1:8001
"""

from __future__ import annotations

import os
import threading
from pathlib import Path
from typing import Any, Optional

import duckdb
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

# Month directories mean this path never changes when a new month is published;
# build_serving.py rewrites this file from whichever month is _COMPLETE.
SLICE = Path(os.environ.get(
    "STARKWELL_SLICE",
    "D:/Starkwell/data/serving/service_provider_prices.parquet"))
CASH = Path(os.environ.get(
    "STARKWELL_CASH",
    "D:/Starkwell/data/serving/cash_by_service.parquet"))
# 102 CMS-verified Utah facilities: real names, star ratings, ownership.
FACILITIES = Path(os.environ.get(
    "STARKWELL_FACILITIES",
    "D:/Starkwell/data/reference/facility_dim.parquet"))
# facility_id x measure -> score, for the 102 facilities above. HCAHPS patient-
# experience survey results (nurse/doctor communication, cleanliness, "would
# recommend") and CMS complication/mortality rates vs the national rate. Real
# federal survey data, not a rating anyone here invented.
FACILITY_MEASURES = Path(os.environ.get(
    "STARKWELL_FACILITY_MEASURES",
    "D:/Starkwell/data/reference/facility_measures.parquet"))
# Hand-written 25-row hospital crosswalk. It exists because fuzzy matching
# previously mapped Holy Cross West Valley onto Jordan Valley and Wayne County
# onto Kane County. It carries the address that bridges the cash layer's
# hospital NAMES to the slice's addresses; all 22 cash hospitals resolve.
HOSPITAL_XW = Path(os.environ.get(
    "STARKWELL_HOSPITAL_XW",
    "D:/Starkwell/data/reference/hospital_dim.parquet"))
# Plan cost-sharing, built by build_plan_design.py from the CMS Marketplace PUFs.
PLAN_DESIGN = Path(os.environ.get(
    "STARKWELL_PLAN_DESIGN",
    "D:/Starkwell/data/reference/plan_design.parquet"))
PLAN_BENEFITS = Path(os.environ.get(
    "STARKWELL_PLAN_BENEFITS",
    "D:/Starkwell/data/reference/plan_benefits.parquet"))
# plan_id -> the rate files that priced its NETWORK. Built by
# build_plan_network.py. This is what makes a rate plan-exact rather than a
# payer average.
PLAN_NETWORK = Path(os.environ.get(
    "STARKWELL_PLAN_NETWORK",
    "D:/Starkwell/data/reference/plan_network.parquet"))
# The month-partitioned summaries. Needed for network-exact rates: the serving
# slice aggregates provenance_key away, and provenance_key is what identifies
# the network a rate belongs to.
SUMMARY_DIR = Path(os.environ.get(
    "STARKWELL_SUMMARY", "D:/Starkwell/data/summary/2026-08"))
CATALOG = Path(os.environ.get(
    "STARKWELL_CATALOG", "D:/Starkwell/data/reference/shoppable_services.parquet"))
# Pre-aggregated (network, npi, code) -> rate. Built by build_network_rates.py.
# Exists purely for latency: the same lookup against price_summary took 10.4s
# for Regence.
NETWORK_RATES = Path(os.environ.get(
    "STARKWELL_NETWORK_RATES",
    "D:/Starkwell/data/reference/network_rates.parquet"))
# Full NPI registry — entity_type, taxonomy_code, address/city/state, lat/lng.
# The serving slice doesn't carry taxonomy_code (it's a service-price fact
# table, not a provider dimension), so specialty has to come from here.
PROVIDERS = Path(os.environ.get(
    "STARKWELL_PROVIDERS", "D:/Starkwell/data/providers.parquet"))
# NUCC taxonomy code -> human-readable specialty ("207Q00000X" -> "Family
# Medicine Physician"). Public, stable code set — not derived or inferred.
TAXONOMY = Path(os.environ.get(
    "STARKWELL_TAXONOMY", "D:/Starkwell/data/reference/nucc_taxonomy_251.csv"))

# Street-token canonicalisation, used ONLY to join slice addresses to CMS
# facility names. The slice writes "4401 HARRISON BLVD", CMS writes "4401
# HARRISON BOULEVARD", so a literal join matches nothing.
#
# EXACT match after normalisation. Never fuzzy. Fuzzy hospital matching in this
# project previously mapped Holy Cross West Valley onto Jordan Valley and Wayne
# County onto Kane County. Token substitution is deterministic; edit-distance
# scoring guesses, and a wrong guess sends a patient to the wrong hospital.
#
# Addresses that do not match stay unnamed and render as the address itself.
# That is honest and still usable; a confident wrong name is neither.
_SUBS = [
    (r"\bNORTH\b", "N"), (r"\bSOUTH\b", "S"), (r"\bEAST\b", "E"), (r"\bWEST\b", "W"),
    (r"\bDRIVE\b", "DR"), (r"\bBOULEVARD\b", "BLVD"), (r"\bSTREET\b", "ST"),
    (r"\bAVENUE\b", "AVE"), (r"\bROAD\b", "RD"), (r"\bLANE\b", "LN"),
    (r"\bCOURT\b", "CT"), (r"\bPARKWAY\b", "PKWY"), (r"\bHIGHWAY\b", "HWY"),
    (r"\bCIRCLE\b", "CIR"), (r"\bPLACE\b", "PL"), (r"\bTERRACE\b", "TER"),
]


# Known Utah health systems, curated. Used to label an address that the CMS
# facility list does not cover, e.g. "University of Utah Health, Salt Lake City".
#
# Curated rather than inferred. Deriving a system from the common prefix of the
# organisation names at an address turns "WASATCH MENTAL HEALTH" and "WASATCH
# BEHAVIORAL HEALTH" into "WASATCH", which is a mountain range.
SYSTEMS = [
    ("University of Utah Health", ["UNIVERSITY OF UTAH%", "U OF U %", "U-U %",
                                   "%DEPARTMENT OF UNIVERSITY OF UTAH%",
                                   "UNIVERSITY HEALTH CARE%"]),
    ("Intermountain Health",      ["IHC HEALTH%", "INTERMOUNTAIN%"]),
    ("MountainStar Healthcare",   ["MOUNTAINSTAR%"]),
    ("Steward Health Care",       ["STEWARD%"]),
    ("Wasatch Behavioral Health", ["WASATCH MENTAL HEALTH%", "WASATCH BEHAVIORAL%"]),
    ("Davis Behavioral Health",   ["DAVIS BEHAVIORAL%"]),
    ("Weber Human Services",      ["WEBER HUMAN SERVICES%"]),
    ("Revere Health",             ["REVERE HEALTH%"]),
    ("Tanner Clinic",             ["TANNER %"]),
    ("Midtown Community Health",  ["MIDTOWN COMMUNITY HEALTH%"]),
]

# A system label requires AGREEMENT among the organisations at the address, not
# just one match. Below this share the address stays unnamed.
#
# This is the guard that makes the rule safe. 100 MARIO CAPECCHI DR hosts both
# Intermountain and University of Utah; 4403 HARRISON BLVD hosts dozens of
# unrelated solo practices. Neither has an answer, and inventing one would send
# a patient to the wrong health system.
SYSTEM_MIN_SHARE = 0.7
SYSTEM_MIN_ORGS = 2


def norm_addr(col: str) -> str:
    """SQL expression normalising an address column for the facility join."""
    e = f"upper(trim({col}))"
    e = f"regexp_replace({e}, '[.,#]', '', 'g')"
    for pat, rep in _SUBS:
        e = f"regexp_replace({e}, '{pat}', '{rep}', 'g')"
    return f"regexp_replace({e}, '\\s+', ' ', 'g')"

# Allow-listed ORDER BY clauses. The sort key is validated by the route's regex
# and then looked up here, so no user string ever reaches the SQL text.
#
# `recommended` is the default and leads with evidence_rank for the reason
# documented on provider_rows(). The price sorts are offered because a user
# explicitly asking "cheapest first" deserves an answer — but the UI shows the
# evidence badge on every row, so an unconfirmed provider is never silently
# presented as the best choice. evidence_rank stays as the tiebreaker.
ORDERINGS = {
    "recommended": "evidence_rank, median_rate",
    "price_asc": "median_rate, evidence_rank",
    "price_desc": "median_rate DESC, evidence_rank",
}

# DuckDB connections are not thread-safe; FastAPI serves concurrently.
_con: Optional[duckdb.DuckDBPyConnection] = None
_lock = threading.Lock()

app = FastAPI(title="Starkwell serving API", version="1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


class RewritePrefix:
    """Pure-ASGI middleware: rewrites a path prefix before routing.

    In dev, Vite's own proxy rewrites the frontend's `/serving/*` calls to
    this server's `/api/*` (see vite.config.ts). There is no such proxy in
    production, where this same process serves both the built frontend and
    the API on one port — so this does the identical rewrite here, letting
    the frontend code stay unchanged in both environments.
    """
    def __init__(self, app, prefix: str, target: str):
        self.app, self.prefix, self.target = app, prefix, target

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http" and scope["path"].startswith(self.prefix):
            scope = dict(scope)
            scope["path"] = self.target + scope["path"][len(self.prefix):]
        await self.app(scope, receive, send)


app.add_middleware(RewritePrefix, prefix="/serving", target="/api")


def _build_system_view(con: duckdb.DuckDBPyConnection) -> None:
    """View `system_at` : address -> agreed health system, or absent.

    One row per address only where a single system holds SYSTEM_MIN_SHARE of the
    organisation NPIs registered there. Addresses without agreement simply do
    not appear, so a LEFT JOIN yields NULL and the caller shows the address.
    """
    providers = PROVIDERS
    if not providers.exists():
        con.execute("CREATE VIEW system_at AS "
                    "SELECT NULL::VARCHAR addr, NULL::VARCHAR city, "
                    "NULL::VARCHAR system WHERE false")
        return

    case = "CASE\n"
    for name, pats in SYSTEMS:
        cond = " OR ".join(f"upper(o.name) LIKE '{p}'" for p in pats)
        case += f"  WHEN {cond} THEN '{name}'\n"
    case += "  ELSE NULL END"

    con.execute(f"""
        CREATE VIEW system_at AS
        WITH tagged AS (
          SELECT upper(trim(o.address)) AS addr, upper(trim(o.city)) AS city,
                 {case} AS system
          FROM read_parquet('{providers.as_posix()}') o
          WHERE o.entity_type = '2'
            AND o.address IS NOT NULL AND trim(o.address) <> ''),
        per AS (SELECT addr, city, system, count(*) n FROM tagged GROUP BY 1,2,3),
        tot AS (SELECT addr, city, sum(n) total FROM per GROUP BY 1,2),
        best AS (
          SELECT p.addr, p.city, p.system, p.n, t.total,
                 row_number() OVER (PARTITION BY p.addr, p.city
                                    ORDER BY p.n DESC) rk
          FROM per p JOIN tot t USING (addr, city)
          WHERE p.system IS NOT NULL)
        SELECT addr, city, system
        FROM best
        WHERE rk = 1
          AND total >= {SYSTEM_MIN_ORGS}
          AND n::DOUBLE / total >= {SYSTEM_MIN_SHARE}
    """)


def _build_org_view(con: duckdb.DuckDBPyConnection) -> None:
    """View `org_at` : address -> the specific organisation billing there, or
    absent. The third naming tier, below CMS and system:

        cms     exact match against the CMS facility list (102 places)
        system  >=70% of org NPIs at the address agree on a KNOWN system
                (curated list — "IHC Health Services Inc" reads as
                "Intermountain Health, Logan", not a legal-entity name)
        org     >=70% of org NPIs agree on ONE organisation NOT in that
                curated list — e.g. "Riverwoods Urgent Care Center LC",
                a real, specific business name, just not a multi-location
                chain worth curating a system label for

    Same SYSTEM_MIN_SHARE/SYSTEM_MIN_ORGS guard as system_at, and for the
    same reason: one organisation's word against nothing is still a
    guess if there's only one NPI on record, and disagreement at an
    address (a shared medical office building) must stay unnamed rather
    than pick a side.

    Addresses whose dominant org matches a curated SYSTEM are excluded here
    on purpose — system_at already names them, and the two views agreeing
    is nothing to display twice.
    """
    providers = PROVIDERS
    if not providers.exists():
        con.execute("CREATE VIEW org_at AS "
                    "SELECT NULL::VARCHAR addr, NULL::VARCHAR city, "
                    "NULL::VARCHAR org WHERE false")
        return

    system_case = "CASE\n"
    for name, pats in SYSTEMS:
        cond = " OR ".join(f"upper(o.name) LIKE '{p}'" for p in pats)
        system_case += f"  WHEN {cond} THEN '{name}'\n"
    system_case += "  ELSE NULL END"

    con.execute(f"""
        CREATE VIEW org_at AS
        WITH tagged AS (
          SELECT upper(trim(o.address)) AS addr, upper(trim(o.city)) AS city,
                 o.name AS org, {system_case} AS system
          FROM read_parquet('{providers.as_posix()}') o
          WHERE o.entity_type = '2'
            AND o.address IS NOT NULL AND trim(o.address) <> ''),
        per AS (SELECT addr, city, org, count(*) n FROM tagged GROUP BY 1,2,3),
        tot AS (SELECT addr, city, sum(n) total FROM per GROUP BY 1,2),
        best AS (
          SELECT p.addr, p.city, p.org, p.n, t.total,
                 row_number() OVER (PARTITION BY p.addr, p.city
                                    ORDER BY p.n DESC) rk
          FROM per p JOIN tot t USING (addr, city))
        SELECT b.addr, b.city, b.org
        FROM best b
        WHERE b.rk = 1
          AND b.total >= {SYSTEM_MIN_ORGS}
          AND b.n::DOUBLE / b.total >= {SYSTEM_MIN_SHARE}
          AND NOT EXISTS (
            SELECT 1 FROM system_at sy
            WHERE sy.addr = b.addr AND sy.city = b.city)
    """)


def _build_verified_org_view(con: duckdb.DuckDBPyConnection) -> None:
    """View `verified_org_at` : address -> an organisation name backed by ONE
    NPI record, cross-checked against a SEPARATE, independent NPI record.

    system_at/org_at both require >=2 organisation NPIs in agreement — a
    real guard, but it silently drops every address where only one
    organisation ever registered there at all: 8,187 of the ~10,769 Utah
    addresses with any organisation data. That's not thin evidence because
    a second org disagreed; it's the complete NPPES picture — there is no
    second org record to check.

    So this checks a genuinely different, independent record instead: does
    an INDIVIDUAL provider (entity_type=1) at that same address share the
    exact phone number the organisation registered? Two separately-filed
    NPPES records agreeing on a phone number is real corroboration, not a
    lone entry we're hoping is right — of the addresses with a phone
    number on file, ~28% clear this bar.

    Deliberately excluded here: anything system_at/org_at already named
    (stronger evidence wins), and any org with no phone on file at all
    (nothing to cross-check against).
    """
    providers = PROVIDERS
    if not providers.exists():
        con.execute("CREATE VIEW verified_org_at AS "
                    "SELECT NULL::VARCHAR addr, NULL::VARCHAR city, "
                    "NULL::VARCHAR org WHERE false")
        return

    con.execute(f"""
        CREATE VIEW verified_org_at AS
        WITH org_counts AS (
          SELECT upper(trim(o.address)) AS addr, upper(trim(o.city)) AS city,
                 count(*) OVER (PARTITION BY upper(trim(o.address)), upper(trim(o.city))) AS n_orgs
          FROM read_parquet('{providers.as_posix()}') o
          WHERE o.entity_type = '2'
            AND o.address IS NOT NULL AND trim(o.address) <> ''
        ),
        single_orgs AS (
          SELECT DISTINCT upper(trim(o.address)) AS addr, upper(trim(o.city)) AS city,
                 o.name AS org, o.phone AS phone
          FROM read_parquet('{providers.as_posix()}') o
          JOIN org_counts oc ON oc.addr = upper(trim(o.address)) AND oc.city = upper(trim(o.city))
          WHERE o.entity_type = '2' AND oc.n_orgs = 1
            AND o.phone IS NOT NULL AND trim(o.phone) <> ''
        ),
        indiv_phones AS (
          SELECT DISTINCT upper(trim(i.address)) AS addr, upper(trim(i.city)) AS city, i.phone AS phone
          FROM read_parquet('{providers.as_posix()}') i
          WHERE i.entity_type = '1'
            AND i.address IS NOT NULL AND trim(i.address) <> ''
            AND i.phone IS NOT NULL AND trim(i.phone) <> ''
        )
        SELECT DISTINCT so.addr, so.city, so.org
        FROM single_orgs so
        JOIN indiv_phones ip ON ip.addr = so.addr AND ip.city = so.city AND ip.phone = so.phone
        WHERE NOT EXISTS (SELECT 1 FROM system_at sy WHERE sy.addr = so.addr AND sy.city = so.city)
          AND NOT EXISTS (SELECT 1 FROM org_at og WHERE og.addr = so.addr AND og.city = so.city)
    """)


def _build_specialty_view(con: duckdb.DuckDBPyConnection) -> None:
    """View `specialty_at` : npi -> human-readable specialty, or absent.

    An individual provider's own taxonomy code, resolved through the public
    NUCC code set (`Display Name`) — never inferred, never fuzzy. A provider
    with no taxonomy on file, or a code absent from the NUCC list (884 codes,
    all current as of this file's version), simply doesn't get a label; the
    caller shows nothing rather than guessing. This is what turns a Layer-3
    list of fifty identical-looking last names into something a patient can
    actually tell apart by, without inventing anything — see the flow audit,
    Finding 1.
    """
    if not (PROVIDERS.exists() and TAXONOMY.exists()):
        con.execute("CREATE VIEW specialty_at AS "
                    "SELECT NULL::VARCHAR npi, NULL::VARCHAR specialty WHERE false")
        return
    con.execute(f"""
        CREATE VIEW specialty_at AS
        SELECT CAST(p.npi AS VARCHAR) AS npi,
               any_value(t."Display Name") AS specialty
        FROM read_parquet('{PROVIDERS.as_posix()}') p
        JOIN read_csv('{TAXONOMY.as_posix()}', header=true) t
          ON p.taxonomy_code = t."Code"
        WHERE p.taxonomy_code IS NOT NULL
        GROUP BY 1
    """)


def db() -> duckdb.DuckDBPyConnection:
    global _con
    if _con is None:
        if not SLICE.exists():
            raise HTTPException(503, f"serving slice not found: {SLICE}")
        # Small limits on purpose: this runs alongside a 24 GB rebuild.
        _con = duckdb.connect()
        _con.execute("SET enable_progress_bar=false")
        _con.execute("SET threads=2")
        _con.execute("SET memory_limit='2GB'")
        # UTAH ONLY. The serving slice is not state-filtered — build_serving.py
        # has no state predicate — so it carries 3,196 providers in other states
        # (WA 1,221, FL 236, TX 204, ID 158, AZ 145...), 460,139 rows, 7.2% of
        # the total. Left in, a Utah patient searching a knee MRI is shown a
        # $54 professional-component row in Bullhead City, Arizona, and the
        # "Utah cities covered" count reads 1,025 when Utah has roughly 250
        # municipalities.
        #
        # Filtering here rather than in the parquet keeps the slice intact for
        # any future multi-state use, and costs one join against a 4.5 MB file.
        # The proper home for this is build_serving.py; see the note there.
        providers = PROVIDERS
        if providers.exists():
            _con.execute(f"""
                CREATE VIEW prices AS
                SELECT s.* FROM read_parquet('{SLICE.as_posix()}') s
                JOIN (SELECT DISTINCT CAST(npi AS VARCHAR) AS npi
                      FROM read_parquet('{providers.as_posix()}')
                      WHERE state = 'UT') u
                  ON u.npi = CAST(s.npi AS VARCHAR)
            """)
        else:
            _con.execute(f"CREATE VIEW prices AS "
                         f"SELECT * FROM read_parquet('{SLICE.as_posix()}')")
        _build_system_view(_con)
        _build_org_view(_con)
        _build_verified_org_view(_con)
        _build_specialty_view(_con)
        if CASH.exists():
            _con.execute(
                f"CREATE VIEW cash AS "
                f"SELECT * FROM read_parquet('{CASH.as_posix()}')")
    return _con


def q_(sql: str, params: list[Any] | None = None) -> list[dict]:
    """Alias for q(); named apart so the plan endpoints read clearly."""
    return q(sql, params)


def q(sql: str, params: list[Any] | None = None) -> list[dict]:
    """Parameterised query -> list of dicts. Never interpolate user input."""
    with _lock:
        cur = db().execute(sql, params or [])
        cols = [d[0] for d in cur.description]
        return [dict(zip(cols, row)) for row in cur.fetchall()]


@app.get("/api/health")
def health():
    if not SLICE.exists():
        return {"ok": False, "detail": f"missing slice: {SLICE}"}
    r = q("SELECT count(*) n, count(DISTINCT npi) providers, "
          "count(DISTINCT service_key) services FROM prices")
    return {"ok": True, "slice": str(SLICE), **r[0]}


@app.get("/api/services")
def services(
    q_: str = Query("", alias="q", description="free-text procedure search"),
    category: Optional[str] = None,
    categories: Optional[str] = Query(
        None, description="comma-separated category list, matches ANY — "
                           "for browse groupings that span several real "
                           "categories (e.g. Home's 'Specialist' tile)"),
    keys: Optional[str] = Query(
        None, description="comma-separated exact service_key list — for a "
                           "hand-curated set that doesn't correspond to any "
                           "single category (e.g. 'Elective Surgery')"),
    limit: int = Query(30, ge=1, le=200),
):
    """Procedure-first search. This is the product's entry point."""
    # is_primary keeps this consistent with facility_rows() and provider_rows(),
    # both of which already default to the headline component only — without
    # it, a $280 professional read and a $1,592 facility charge for the same
    # service get averaged and ranged together, which is not a price anyone
    # is quoted for anything.
    where = ["is_primary"]
    params: list[Any] = []
    if q_:
        # Tokenise. Matching the raw phrase as one substring meant "mri knee"
        # found nothing, because the service is named "MRI - knee" and the
        # punctuation sits between the words. Every token must appear
        # somewhere in the name or the synonyms, in any order.
        #
        # search_terms carries the synonyms the catalog was built with, so
        # "scan" finds imaging and "xray" finds "X-ray" without the UI knowing.
        for tok in q_.lower().split():
            where.append("(lower(display_name) LIKE ? OR lower(search_terms) LIKE ?)")
            params += [f"%{tok}%", f"%{tok}%"]
    if category:
        where.append("category = ?")
        params.append(category)
    if categories:
        cat_list = [c.strip() for c in categories.split(",") if c.strip()]
        where.append(f"category IN ({','.join(['?'] * len(cat_list))})")
        params += cat_list
    if keys:
        key_list = [k.strip() for k in keys.split(",") if k.strip()]
        where.append(f"service_key IN ({','.join(['?'] * len(key_list))})")
        params += key_list

    # low_price/high_price use the 5th/95th percentile, not true min/max. A
    # blanket network contract can leave a grocery-store pharmacy with a
    # $0.01 "rate" for an MRI it will never actually perform — real data, but
    # not a price anyone is quoted, and evidence tagging alone doesn't catch
    # every case (some of these are tagged peer_family, not just unknown).
    # Individual providers still show their own real rate untouched in
    # /providers; this only keeps one bad row from setting the headline range
    # everyone sees first.
    #
    # low_price_full/high_price_full are the true min/max of the same group —
    # not hidden, just not the headline. The UI shows low_price/high_price as
    # "typical price range" and surfaces the full pair on demand, so a $0.01
    # blanket-contract row is still reachable, never erased.
    return {"query": q_, "results": q(f"""
        SELECT service_key,
               any_value(display_name)      AS display_name,
               any_value(category)          AS category,
               count(DISTINCT npi)          AS providers,
               median(median_rate)          AS typical_price,
               quantile_cont(median_rate, 0.05) AS low_price,
               quantile_cont(median_rate, 0.95) AS high_price,
               min(median_rate)             AS low_price_full,
               max(median_rate)             AS high_price_full
        FROM prices
        WHERE {' AND '.join(where)}
        GROUP BY service_key
        ORDER BY providers DESC
        LIMIT {int(limit)}
    """, params)}


@app.get("/api/categories")
def categories():
    return {"categories": q("""
        SELECT category,
               count(DISTINCT service_key) AS services,
               count(DISTINCT npi)         AS providers
        FROM prices
        GROUP BY category ORDER BY services DESC
    """)}


@app.get("/api/services/{service_key}/providers")
def provider_rows(
    service_key: str,
    city: Optional[str] = None,
    address: Optional[str] = Query(
        None, description="drill down into one location from /facilities"),
    max_price: Optional[float] = None,
    trusted_only: bool = Query(
        False, description="only rows where we can show the provider performs it"),
    comparable_only: bool = Query(
        True, description="only the headline component, so prices are like-for-like"),
    sort: str = Query("recommended", pattern="^(recommended|price_asc|price_desc)$"),
    limit: int = Query(25, ge=1, le=200),
):
    """Providers for a service — THE ordering rule lives here and nowhere else.

    ORDER BY evidence_rank first, then price. Sorting by price alone surfaces
    providers who merely have a negotiated rate for the code, which is how a
    lactation consultancy becomes the cheapest MRI in Utah.

    comparable_only defaults to TRUE and that default matters. A service spans
    billing components, and for MRI - knee they are not remotely alike:

        professional  20,448 rows   $280   Medicare $72    radiologist's READ only
        global        10,740 rows   $327   Medicare $243   the whole scan
        facility       4,664 rows $1,592   Medicare $0

    `is_primary` marks the headline component. Mixing them ranks a $280
    read-fee above a $327 complete scan and presents it to a patient as the
    cheaper option — they would pay the read fee AND a facility fee. Showing
    like-for-like is the difference between a price and a misleading number.

    location_grade is passed through so the caller can refuse to compute a
    distance from a centroid: `approximate` / `Geocodio_Area` rows carry a
    coordinate that looks precise and is not.
    """
    where = ["service_key = ?", "median_rate IS NOT NULL"]
    params: list[Any] = [service_key]
    if comparable_only:
        where.append("is_primary")
    if city:
        where.append("upper(city) = ?")
        params.append(city.upper())
    if address:
        where.append("upper(trim(address)) = ?")
        params.append(address.upper().strip())
    if max_price is not None:
        where.append("median_rate <= ?")
        params.append(max_price)
    if trusted_only:
        where.append("evidence <> 'unknown'")

    rows = q(f"""
        SELECT s.npi, s.provider_name, s.address, s.city, s.zip, s.lat, s.lng,
               s.location_grade,
               s.median_rate, s.min_rate, s.max_rate,
               s.medicare_allowed, s.pct_of_medicare,
               s.n_payers, s.obs_count, s.component,
               s.evidence, s.evidence_rank, s.is_primary,
               sp.specialty,
               any_value(s.display_name) OVER () AS display_name
        FROM prices s
        LEFT JOIN specialty_at sp ON sp.npi = CAST(s.npi AS VARCHAR)
        WHERE {' AND '.join(where)}
        ORDER BY {ORDERINGS[sort]}
        LIMIT {int(limit)}
    """, params)
    if not rows:
        raise HTTPException(404, f"no displayable providers for {service_key}")
    return {
        "service_key": service_key,
        "display_name": rows[0].get("display_name"),
        "count": len(rows),
        "results": rows,
    }


@app.get("/api/services/{service_key}/facilities")
def facility_rows(
    service_key: str,
    city: Optional[str] = None,
    named_only: bool = Query(False, description="only CMS-verified facilities"),
    plan_id: Optional[str] = Query(
        None, description="price every location for this plan"),
    deductible_remaining: Optional[float] = Query(
        None, description="how much deductible is left; defaults to the plan's full amount"),
    limit: int = Query(25, ge=1, le=200),
):
    """Places, not payees — the first layer of "where do I go".

    GROUPED BY ADDRESS, NOT BY ORGANISATION NPI. Insurers contract with
    individual physician NPIs, so that is where the prices live: for MRI - knee
    only 188 of 10,740 like-for-like providers (1.8%) are organisations.
    Grouping on organisation NPIs would discard 98% of the data. Grouping on
    address keeps all of it and reconstructs the real campuses — 496 providers
    at 50 N MEDICAL DR is University of Utah Hospital.

    A facility gets a NAME only from an exact normalised address match against
    the CMS facility list. 107 of 11,581 locations match (0.9%), but they hold
    10.8% of all priced providers because they are the big hospitals. The rest
    are labelled by address.

    The price shown is the MEDIAN across the location, with the range alongside.
    Not the minimum: one cheap physician at a 496-provider campus is not the
    price of going there.
    """
    # Every column is qualified with s. — the system_at join introduces a second
    # `city`, and an unqualified reference is a binder error that only fires
    # when the city filter is actually used.
    where = ["s.service_key = ?", "s.median_rate IS NOT NULL",
             "s.is_primary", "s.address IS NOT NULL", "trim(s.address) <> ''"]
    params: list[Any] = [service_key]
    if city:
        where.append("upper(trim(s.city)) = ?")
        params.append(city.upper().strip())

    have_dim = FACILITIES.exists()
    cms_name = "NULL"
    join = ""
    if have_dim:
        cms_name = "any_value(f.facility_name)"
        join = f"""
          LEFT JOIN (
            SELECT {norm_addr('d.address')} AS naddr, upper(trim(d.city)) AS ncity,
                   d.facility_name, d.overall_rating, d.facility_kind,
                   d.facility_id, d.patient_star, d.surveys
            FROM read_parquet('{FACILITIES.as_posix()}') d
          ) f ON f.naddr = {norm_addr('s.address')}
             AND f.ncity = upper(trim(s.city))"""
    join += """
          LEFT JOIN system_at sy ON sy.addr = upper(trim(s.address))
                                AND sy.city = upper(trim(s.city))
          LEFT JOIN org_at og ON og.addr = upper(trim(s.address))
                             AND og.city = upper(trim(s.city))
          LEFT JOIN verified_org_at vo ON vo.addr = upper(trim(s.address))
                                      AND vo.city = upper(trim(s.city))"""

    # Naming precedence, strongest evidence first:
    #   cms           exact address match against the CMS facility list
    #   system        >=70% of organisations at this address agree on one
    #                 KNOWN system — a curated list, so "IHC Health Services
    #                 Inc" reads as "Intermountain Health, Logan"
    #   org           >=70% agree on one organisation NOT in that curated
    #                 list — still a real, specific business name, just not
    #                 a chain
    #   org_verified  only ONE organisation NPI on record at this address —
    #                 not enough for the tiers above — but an INDEPENDENT
    #                 individual-provider NPI record at the same address
    #                 shares its phone number. Two separately-filed NPPES
    #                 records agreeing, not one lone entry taken on faith.
    #   (none)        caller renders the address
    # name_source travels with the name so the UI can show each tier's
    # actual confidence rather than presenting a phone-corroborated guess
    # with the same certainty as a CMS-verified hospital.
    # facility_name/system/org are returned SEPARATELY and composed by the
    # caller. Building "System, City" in SQL needs title-casing that DuckDB
    # has no initcap for, and keeping them apart lets the UI style each tier
    # differently.
    name_col = (
        f"{cms_name} AS facility_name, "
        f"any_value(sy.system) AS system, "
        f"COALESCE(any_value(og.org), any_value(vo.org)) AS org, "
        f"CASE WHEN {cms_name} IS NOT NULL THEN 'cms' "
        f"     WHEN any_value(sy.system) IS NOT NULL THEN 'system' "
        f"     WHEN any_value(og.org) IS NOT NULL THEN 'org' "
        f"     WHEN any_value(vo.org) IS NOT NULL THEN 'org_verified' END AS name_source, "
        + ("any_value(f.overall_rating) AS rating, "
           "any_value(f.facility_kind) AS facility_kind, "
           # patient_star/surveys are HCAHPS patient-experience survey results —
           # a different CMS measure from the overall_rating star above, so
           # they travel separately rather than overloading one field.
           "any_value(f.facility_id) AS facility_id, "
           "any_value(f.patient_star) AS patient_star, "
           "any_value(f.surveys) AS surveys"
           if have_dim else
           "NULL AS rating, NULL AS facility_kind, "
           "NULL AS facility_id, NULL AS patient_star, NULL AS surveys"))

    having = ""
    if named_only:
        having = ("HAVING " + (f"{cms_name} IS NOT NULL OR " if have_dim else "")
                  + "any_value(sy.system) IS NOT NULL OR any_value(og.org) IS NOT NULL "
                    "OR any_value(vo.org) IS NOT NULL")

    rows = q(f"""
        SELECT upper(trim(s.address)) AS address,
               upper(trim(s.city))    AS city,
               {name_col},
               count(DISTINCT s.npi)  AS providers,
               median(s.median_rate)  AS median_price,
               -- 5th/95th percentile, not true min/max — see the comment on
               -- the same choice in services() above. A facility with very
               -- few providers naturally has its percentile bounds converge
               -- toward the real min/max; that's correct, not a shortfall.
               quantile_cont(s.median_rate, 0.05) AS low_price,
               quantile_cont(s.median_rate, 0.95) AS high_price,
               -- True min/max, not shown as the headline but not erased
               -- either — see services() above for why both exist.
               min(s.median_rate)     AS low_price_full,
               max(s.median_rate)     AS high_price_full,
               median(s.pct_of_medicare) AS pct_of_medicare,
               min(s.evidence_rank)   AS best_evidence_rank,
               any_value(s.lat)       AS lat,
               any_value(s.lng)       AS lng,
               any_value(s.location_grade) AS location_grade
        FROM prices s
        {join}
        WHERE {' AND '.join(where)}
        GROUP BY 1, 2
        {having}
        ORDER BY providers DESC, median_price
        LIMIT {int(limit)}
    """, params)
    if not rows:
        raise HTTPException(404, f"no locations for {service_key}")

    # ---- optional: price every location for one plan -----------------------
    # Done here rather than by calling /estimate 25 times: one query for the
    # network rates, then the cost-sharing arithmetic per row in Python.
    #
    # A location where the plan's network publishes no rate is NOT priced. It
    # gets network_coverage="not_published" instead, because the payer median
    # would look like a quote for somewhere the member may be out of network —
    # which is the surprise bill this is meant to prevent.
    if plan_id and PLAN_DESIGN.exists() and PLAN_NETWORK.exists() \
            and NETWORK_RATES.exists() and CATALOG.exists():
        plan = q_(f"""SELECT * FROM read_parquet('{PLAN_DESIGN.as_posix()}')
                      WHERE plan_id = ? LIMIT 1""", [plan_id])
        pn = q_(f"""SELECT any_value(rate_network_name) AS net
                    FROM read_parquet('{PLAN_NETWORK.as_posix()}')
                    WHERE plan_id = ?""", [plan_id])
        net = pn[0]["net"] if pn else None
        if plan and net:
            plan = plan[0]
            ben = q_(f"""
                SELECT b.copay, b.coinsurance_pct
                FROM read_parquet('{PLAN_BENEFITS.as_posix()}') b
                WHERE b.plan_id = ? AND b.benefit = (
                    SELECT any_value({BENEFIT_SQL}) FROM prices
                    WHERE service_key = ?)
                LIMIT 1""", [plan_id, service_key])
            ben = ben[0] if ben else {}
            addrs = [r["address"] for r in rows]
            netrates = {r["addr"]: r["rate"] for r in q_(f"""
                SELECT upper(trim(p.address)) AS addr, median(nr.rate) AS rate
                FROM read_parquet('{NETWORK_RATES.as_posix()}') nr
                JOIN prices p ON CAST(p.npi AS VARCHAR) = CAST(nr.npi AS VARCHAR)
                WHERE nr.rate_network_name = ?
                  AND p.service_key = ?
                  AND upper(trim(p.address)) IN (SELECT unnest(?::VARCHAR[]))
                  AND nr.code IN (SELECT DISTINCT code
                                  FROM read_parquet('{CATALOG.as_posix()}')
                                  WHERE service_key = ? AND status = 'ok')
                GROUP BY 1""", [net, service_key, addrs, service_key])}

            ded = plan.get("deductible_individual")
            moop = plan.get("moop_individual")
            left = deductible_remaining if deductible_remaining is not None else ded
            for r in rows:
                nrate = netrates.get(r["address"])
                r["network"] = net
                if nrate is None:
                    r["network_coverage"] = "not_published"
                    r["your_cost"] = None
                    r["network_rate"] = None
                    continue
                r["network_coverage"] = "in_network"
                r["network_rate"] = round(float(nrate), 2)
                lo = max(0.0, float(left or 0))
                toward = min(float(nrate), lo)
                after = float(nrate) - toward
                if after > 0 and ben.get("copay") is not None:
                    share = min(float(ben["copay"]), after)
                elif after > 0 and ben.get("coinsurance_pct") is not None:
                    share = after * float(ben["coinsurance_pct"]) / 100.0
                else:
                    share = after
                total = toward + share
                if moop:
                    total = min(total, float(moop))
                r["your_cost"] = round(total, 2)
            # Rank by what the member actually pays, keeping unpriced last.
            rows.sort(key=lambda r: (r.get("your_cost") is None,
                                     r.get("your_cost") or 0))

    return {"service_key": service_key, "count": len(rows), "results": rows}


@app.get("/api/services/{service_key}/cash")
def cash_rows(service_key: str, limit: int = Query(25, ge=1, le=100)):
    """Hospital cash price vs the negotiated FACILITY rate at the same hospital.

    THE COMPONENT CHOICE IS THE WHOLE POINT. A hospital's published cash price
    is a facility charge for the service. Compared against the wrong component
    it produces nonsense:

        vs `facility`  1,467 pairs, median 1.54x, cash cheaper in 26%   <- valid
        vs `global`    1,502 pairs, median 5.34x, cash cheaper in  7%   <- invalid

    The global and professional rates include the physician's fee, which the
    hospital's cash price does not cover, so comparing them showed lab_folate at
    "$306 cash vs $8 insured" and made cash look 5.65x worse than it is. Note
    that `is_primary` cannot be used here: it selects each service's headline
    component, which is `professional` for 73 of 166 services, and it never
    marks `facility` at all.

    Joined through the hand-written hospital crosswalk, exact after street-token
    normalisation. All 22 cash hospitals resolve; 16 have overlapping services.

    WHAT THIS DOES NOT SAY: an insured patient also pays the physician fee on
    top of the facility rate, so a cash price above the facility rate is not
    automatically the worse deal. The endpoint returns both numbers and leaves
    the arithmetic visible rather than declaring a winner.
    """
    if not (CASH.exists() and HOSPITAL_XW.exists()):
        raise HTTPException(503, "cash layer not available")
    rows = q(f"""
        WITH xw AS (
          SELECT DISTINCT upper(trim(hospital)) AS hosp, {norm_addr('address')} AS naddr
          FROM read_parquet('{HOSPITAL_XW.as_posix()}') WHERE address IS NOT NULL),
        cash AS (
          SELECT upper(trim(hospital)) AS hosp, service_key,
                 min(cash_median) AS cash_price, min(list_median) AS list_price
          FROM read_parquet('{CASH.as_posix()}')
          WHERE cash_median > 0 AND service_key = ? GROUP BY 1, 2),
        ins AS (
          SELECT {norm_addr('address')} AS naddr,
                 any_value(city) AS city, any_value(address) AS address,
                 median(median_rate) AS facility_rate, count(DISTINCT npi) AS providers
          FROM prices
          WHERE component = 'facility' AND median_rate > 0
            AND service_key = ? AND address IS NOT NULL AND trim(address) <> ''
          GROUP BY 1)
        SELECT c.hosp AS hospital, i.city, i.address,
               c.cash_price, c.list_price, i.facility_rate, i.providers,
               c.cash_price / i.facility_rate AS ratio
        FROM cash c
        JOIN xw ON xw.hosp = c.hosp
        JOIN ins i ON i.naddr = xw.naddr
        ORDER BY ratio
        LIMIT {int(limit)}
    """, [service_key, service_key])
    if not rows:
        raise HTTPException(404, f"no cash/facility pairs for {service_key}")
    return {"service_key": service_key, "count": len(rows), "results": rows}


@app.get("/api/facilities/{facility_id}/quality")
def facility_quality(facility_id: str):
    """HCAHPS patient-experience survey results and CMS safety measures.

    Real federal data, not a rating anyone here invented: HCAHPS is CMS's own
    standardized patient-satisfaction survey, run at every hospital, publicly
    reported since 2008. `kind = 'patient_experience'` covers the review-like
    ground (nurse/doctor communication, cleanliness, "would recommend");
    `kind = 'complication'` covers mortality and complication rates, each
    already framed by CMS as better/worse/no different than the national
    rate. Returns everything CMS publishes for this facility and lets the
    caller curate what to surface, same as cash_rows above.

    Only the 102 CMS-tracked Utah hospitals and ambulatory surgery centers
    have a facility_id at all — most physician-office visits won't.
    """
    if not FACILITY_MEASURES.exists():
        raise HTTPException(503, "facility quality data not available")
    rows = q(f"""
        SELECT kind, measure_id, measure_name, score, vs_national
        FROM read_parquet('{FACILITY_MEASURES.as_posix()}')
        WHERE facility_id = ?
        ORDER BY kind, measure_id
    """, [facility_id])
    if not rows:
        raise HTTPException(404, f"no quality data for facility {facility_id}")
    return {"facility_id": facility_id, "count": len(rows), "results": rows}


# Our service categories -> the CMS PUF benefit category that governs cost
# sharing. Imaging splits: advanced imaging and plain radiology are different
# benefits with different copays, so "MRI - knee" and "Chest X-ray" must not
# share a rule.
BENEFIT_SQL = """
CASE
  WHEN lower(display_name) LIKE '%mri%' OR lower(display_name) LIKE '%ct %'
    OR lower(display_name) LIKE '%ct-%' OR lower(display_name) LIKE '%pet %'
                              THEN 'Imaging (CT/PET Scans, MRIs)'
  WHEN category = 'Imaging'   THEN 'X-rays and Diagnostic Imaging'
  WHEN category = 'Lab'       THEN 'Laboratory Outpatient and Professional Services'
  WHEN category = 'Primary care' OR category = 'Pediatrics'
                              THEN 'Primary Care Visit to Treat an Injury or Illness'
  WHEN category = 'Specialty' THEN 'Specialist Visit'
  WHEN category = 'Preventive' THEN 'Preventive Care/Screening/Immunization'
  WHEN category = 'Mental health' THEN 'Mental/Behavioral Health Outpatient Services'
  WHEN category = 'Therapy'   THEN 'Rehabilitative Physical Therapy'
  WHEN category = 'Urgent care' THEN 'Urgent Care Centers or Facilities'
  WHEN category = 'Emergency' THEN 'Emergency Room Services'
  WHEN category = 'Maternity' THEN 'Delivery and All Inpatient Services for Maternity Care'
  WHEN category = 'Procedure' THEN 'Outpatient Surgery Physician/Surgical Services'
  -- Added with the second catalog pass (2026-08-15): specialties split out of
  -- the old "Specialty" catch-all. None of the standard ACA SBC benefit
  -- categories have a dedicated line for these, so all default to the same
  -- 'Specialist Visit' bucket "Specialty" itself used -- the safe default,
  -- not a precise one. If a plan carves out its own benefit for one of these
  -- (e.g. a distinct hearing-exam allowance), this can't express that.
  WHEN category = 'Cardiology'      THEN 'Specialist Visit'
  WHEN category = 'Neurology'       THEN 'Specialist Visit'
  WHEN category = 'Pulmonology'     THEN 'Specialist Visit'
  WHEN category = 'ENT'             THEN 'Specialist Visit'
  WHEN category = 'Audiology'       THEN 'Specialist Visit'
  WHEN category = 'Endocrinology'   THEN 'Specialist Visit'
  WHEN category = 'Allergy'         THEN 'Specialist Visit'
  WHEN category = 'Sleep medicine'  THEN 'Specialist Visit'
  -- Vision and Dental previously had no WHEN clause at all and no ELSE, so
  -- every Vision/Dental row silently returned NULL benefit -- list prices
  -- still worked, but "what you pay with insurance" never computed for any
  -- of them. Made explicit rather than left as a silent fallthrough:
  WHEN category = 'Vision' THEN 'Specialist Visit'
  WHEN category = 'Dental' THEN NULL  -- ACA medical plans generally exclude
                                       -- adult dental; staying unpriced here
                                       -- is a deliberate choice, not a gap.
END
"""


@app.get("/api/plans")
def plans(payer: Optional[str] = None, q: Optional[str] = None):
    """Selectable plans. Standard variants only — the plan people actually hold.

    PUF plan ids carry a variant suffix: -01 is the standard plan, -02/-03 are
    tribal cost-sharing-reduction variants and -04/-05/-06 are income-based CSR
    silver. Showing all seven would offer one person six versions of their own
    plan with different deductibles.
    """
    if not PLAN_DESIGN.exists():
        raise HTTPException(503, "plan design not built — run build_plan_design.py")
    where = ["payer_key IS NOT NULL", "right(plan_id, 2) IN ('01', '00')",
             "deductible_individual IS NOT NULL"]
    params: list[Any] = []
    if payer:
        where.append("payer_key = ?")
        params.append(payer)
    if q:
        where.append("lower(plan_name) LIKE ?")
        params.append(f"%{q.lower()}%")
    return {"results": q_(f"""
        SELECT any_value(plan_id) AS plan_id, payer_key, issuer, plan_name, metal,
               plan_type, hsa_eligible,
               min(deductible_individual) AS deductible,
               min(moop_individual)       AS moop
        FROM read_parquet('{PLAN_DESIGN.as_posix()}')
        WHERE {' AND '.join(where)}
        GROUP BY payer_key, issuer, plan_name, metal, plan_type, hsa_eligible
        ORDER BY payer_key, deductible
    """, params)}


@app.get("/api/estimate")
def estimate(
    service_key: str,
    plan_id: str,
    address: Optional[str] = None,
    city: Optional[str] = None,
    deductible_remaining: Optional[float] = Query(
        None, description="how much of the deductible is left; omit to show both cases"),
):
    """What this member actually pays, at this location, on this plan.

        patient cost = negotiated rate, applied through the plan's cost sharing

    THE HONEST LIMITS, stated here because the UI must state them too:

    1. The negotiated rate is the PAYER's, not the specific plan's. Only Regence
       and MotivHealth publish plan-identified rates. Measured on Regence, the
       within-payer spread for the same provider and code is 1.18x median, and
       84% of combinations sit within 25% — so this is an estimate with a known
       error bar, not a guess.
    2. Cost sharing comes from the ACA marketplace PUFs, so employer plans
       (Aetna, Cigna, DMBA, PEHP, MotivHealth) are absent. No public source
       publishes those designs.
    3. Deductible-to-date lives in the insurer's claims system. We ask rather
       than assume; the exact figure needs a payer FHIR Patient Access
       connection.

    Before the deductible is met the member owes the full negotiated rate, so
    for an HDHP member pre-deductible this is not an estimate at all — it is the
    contracted amount.
    """
    if not (PLAN_DESIGN.exists() and PLAN_BENEFITS.exists()):
        raise HTTPException(503, "plan design not built — run build_plan_design.py")

    plan = q_(f"""SELECT * FROM read_parquet('{PLAN_DESIGN.as_posix()}')
                  WHERE plan_id = ? LIMIT 1""", [plan_id])
    if not plan:
        raise HTTPException(404, f"unknown plan {plan_id}")
    plan = plan[0]

    where = ["service_key = ?", "is_primary", "median_rate > 0"]
    params: list[Any] = [service_key]
    if address:
        where.append("upper(trim(address)) = ?")
        params.append(address.upper().strip())
    if city:
        where.append("upper(trim(city)) = ?")
        params.append(city.upper().strip())

    # NETWORK-EXACT RATE WHERE WE CAN GET IT.
    #
    # An insurer negotiates per network, not per plan, and networks price
    # differently: only 21.9% of SelectHealth provider/code combinations are
    # identical across its three individual networks. One provider, CPT 73721 —
    # SIGNATURE $154.07, VALUE $154.07, MED $168.33. Serving the payer median
    # gives every member the wrong one of those.
    #
    # plan_network.parquet resolves plan_id -> the source files that priced its
    # network, and those file URLs are the provenance_key on the fact rows.
    # Falls back to the payer median when a plan has no network mapping, and
    # says which basis it used so the UI can be honest about precision.
    rate = q_(f"""
        SELECT median(median_rate) AS negotiated_rate,
               count(DISTINCT npi) AS providers,
               any_value(display_name) AS display_name,
               any_value(category) AS category,
               any_value({BENEFIT_SQL}) AS benefit,
               list(DISTINCT npi) AS npis
        FROM prices WHERE {' AND '.join(where)}
    """, params)

    # NETWORK-EXACT RATE WHERE WE CAN GET IT.
    #
    # An insurer negotiates per network, not per plan, and networks price
    # differently: only 21.9% of SelectHealth provider/code combinations are
    # identical across its three individual networks. One provider, CPT 73721 —
    # SIGNATURE $154.07, VALUE $154.07, MED $168.33. Serving the payer median
    # hands most members the wrong one of those.
    #
    # This has to read price_summary, NOT the serving slice: build_serving
    # aggregates provenance_key away, and provenance_key is what carries the
    # network. Scoped to one payer file, the NPIs already found at this
    # location, and this service's codes, so it stays a small scan.
    # network_coverage:
    #   "in_network"     this plan's network has a rate here -> exact
    #   "not_published"  the plan maps to a network, but that network publishes
    #                    no rate for this service at this location
    #   "unknown"        no network mapping for this plan (employer plans, and
    #                    payers whose files are not network-identified)
    #
    # `not_published` is a WARNING, not a price. SelectHealth's networks differ wildly
    # at one address: at University of Utah Hospital, VALUE covers 19,805 codes
    # and SIGNATURE 19,803, while MED covers 283 and CARE none at all. A member
    # on Med Benchmark Gold walking into that hospital for a knee MRI is the
    # surprise-bill scenario this product exists to prevent. It is NOT proof of
    # exclusion — a rate can be unpublished for other reasons — so it is worded
    # as "not listed", never "not covered".
    rate_basis, network_name, network_coverage = "payer", None, "unknown"
    if (rate and rate[0]["negotiated_rate"] is not None
            and PLAN_NETWORK.exists() and CATALOG.exists()
            and NETWORK_RATES.exists()):
        npis = [str(n) for n in (rate[0].get("npis") or [])]
        pn = q_(f"""SELECT any_value(rate_network_name) AS net,
                           any_value(payer_key) AS payer, count(*) AS files
                    FROM read_parquet('{PLAN_NETWORK.as_posix()}')
                    WHERE plan_id = ?""", [plan_id])
        if npis and pn and pn[0]["files"]:
            payer, net = pn[0]["payer"], pn[0]["net"]
            try:
                # Reads the PRE-AGGREGATED network rates, not price_summary.
                # Live, this filter cost 10.4 SECONDS for Regence — 28.5 GB
                # across 8 partitions filtered by 264 file URLs. Precomputed to
                # (network, npi, code) over the 469 shoppable codes it is 110 MB
                # and answers instantly. Rebuild it with build_network_rates.py
                # after every monthly rebuild.
                nr = q_(f"""
                    SELECT median(rate) AS r, count(DISTINCT npi) AS n
                    FROM read_parquet('{NETWORK_RATES.as_posix()}')
                    WHERE rate_network_name = ?
                      AND CAST(npi AS VARCHAR) IN (SELECT unnest(?::VARCHAR[]))
                      AND code IN (
                          SELECT DISTINCT code FROM read_parquet('{CATALOG.as_posix()}')
                          WHERE service_key = ? AND status = 'ok')
                """, [net, npis, service_key])
                network_name = net
                if nr and nr[0]["r"] is not None:
                    rate[0]["negotiated_rate"] = nr[0]["r"]
                    rate_basis, network_coverage = "network", "in_network"
                else:
                    network_coverage = "not_published"
            except Exception as e:
                # Network refinement is an enhancement; the payer-level answer
                # is still correct, just wider. But do NOT swallow it silently —
                # a quiet fallback is indistinguishable from a working feature.
                print(f"[estimate] network lookup failed for plan {plan_id}: "
                      f"{type(e).__name__}: {e}", flush=True)
                network_coverage = "unknown"
    if not rate or rate[0]["negotiated_rate"] is None:
        raise HTTPException(404, "no negotiated rate for that service and location")
    r = rate[0]
    negotiated = float(r["negotiated_rate"])

    ben = q_(f"""SELECT * FROM read_parquet('{PLAN_BENEFITS.as_posix()}')
                 WHERE plan_id = ? AND benefit = ? LIMIT 1""",
             [plan_id, r["benefit"]]) if r["benefit"] else []
    ben = ben[0] if ben else None

    ded = plan.get("deductible_individual")
    moop = plan.get("moop_individual")
    remaining = deductible_remaining if deductible_remaining is not None else ded

    def compute(left: Optional[float]) -> dict:
        """Apply the plan to the rate. Deductible first, then the share."""
        if left is None:
            return {"amount": negotiated, "basis": "full negotiated rate",
                    "detail": "deductible status unknown"}
        left = max(0.0, float(left))
        toward_ded = min(negotiated, left)
        after = negotiated - toward_ded
        share = 0.0
        basis = []
        if toward_ded > 0:
            basis.append(f"${toward_ded:,.0f} applied to your deductible")
        if after > 0 and ben:
            if ben.get("copay") is not None:
                share = min(float(ben["copay"]), after)
                basis.append(f"${share:,.0f} copay")
            elif ben.get("coinsurance_pct") is not None:
                share = after * float(ben["coinsurance_pct"]) / 100.0
                basis.append(f"{ben['coinsurance_pct']:.0f}% coinsurance on ${after:,.0f}")
            else:
                share = after
                basis.append("no cost-sharing rule published; full rate shown")
        elif after > 0:
            share = after
            basis.append("no cost-sharing rule published; full rate shown")
        total = toward_ded + share
        if moop:
            total = min(total, float(moop))
        return {"amount": round(total, 2), "basis": " + ".join(basis) or "—"}

    out = {
        "service_key": service_key,
        "display_name": r["display_name"],
        "benefit": r["benefit"],
        "location": {"address": address, "city": city, "providers": r["providers"]},
        "negotiated_rate": round(negotiated, 2),
        # 'network' = this plan's actual network rate. 'payer' = the insurer's
        # median across networks, roughly +/-18%. The UI must say which.
        "rate_basis": rate_basis,
        "network": network_name,
        "network_coverage": network_coverage,
        "network_warning": (
            f"{network_name} does not list a rate for this service at this "
            f"location. Check with your plan before booking — an out-of-network "
            f"visit can cost far more than the price shown."
            if network_coverage == "not_published" else None),
        "plan": {
            "plan_id": plan_id, "name": plan.get("plan_name"),
            "issuer": plan.get("issuer"), "payer_key": plan.get("payer_key"),
            "metal": plan.get("metal"), "hsa_eligible": plan.get("hsa_eligible"),
            "deductible": ded, "moop": moop,
        },
        "cost_sharing": ({"copay": ben.get("copay"),
                          "coinsurance_pct": ben.get("coinsurance_pct"),
                          "after_deductible": ben.get("after_deductible")}
                         if ben else None),
        "estimate": compute(remaining),
        "if_deductible_met": compute(0.0),
        "if_deductible_unmet": compute(ded),
        "caveats": (
            ["This is your plan's own network rate, not a payer average."]
            if rate_basis == "network" else
            ["Negotiated rate is your insurer's median across networks; "
             "within-payer variation is about 18% at the median."]
        ) + [
            "Cost sharing is from public marketplace filings and covers "
            "individual plans only, not employer coverage.",
        ],
    }
    return out


@app.get("/api/providers/{npi}")
def provider(npi: str):
    rows = q("""
        SELECT service_key, display_name, category, median_rate,
               pct_of_medicare, n_payers, evidence, evidence_rank
        FROM prices
        WHERE npi = ? AND median_rate IS NOT NULL
        ORDER BY evidence_rank, category, display_name
    """, [npi])
    if not rows:
        raise HTTPException(404, f"no displayable services for NPI {npi}")
    who = q("""SELECT any_value(provider_name) provider_name, any_value(address) address,
                      any_value(city) city, any_value(zip) zip,
                      any_value(lat) lat, any_value(lng) lng,
                      any_value(location_grade) location_grade
               FROM prices WHERE npi = ?""", [npi])[0]
    return {"npi": npi, **who, "services": rows}


# ---- production static hosting -------------------------------------------
# Only mounted when a built frontend is actually present (`npm run build`
# output). In local dev the Vite dev server serves the frontend on its own
# port and this stays inert, so nothing changes for the existing workflow.
DIST = Path(os.environ.get("STARKWELL_DIST", "/app/dist"))
if DIST.exists():
    app.mount("/assets", StaticFiles(directory=DIST / "assets"), name="assets")

    # Registered LAST, after every /api route, so it only catches paths that
    # don't match one of those. React Router owns client-side routes like
    # /prices or /about — reloading on one of them must still return
    # index.html rather than a 404, and this is what does that.
    @app.get("/{full_path:path}")
    async def spa(full_path: str):
        candidate = DIST / full_path
        if candidate.is_file():
            return FileResponse(candidate)
        return FileResponse(DIST / "index.html")


if __name__ == "__main__":
    import uvicorn
    host = os.environ.get("STARKWELL_HOST", "127.0.0.1")
    port = int(os.environ.get("STARKWELL_PORT", "8001"))
    uvicorn.run(app, host=host, port=port, log_level="info")
