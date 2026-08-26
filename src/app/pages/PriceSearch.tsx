import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Checkbox } from "../components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "../components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Search, MapPin, Info, AlertTriangle, ArrowLeft, Star, Scale, X, ShieldCheck, ClipboardList } from "lucide-react";
import { ProviderMap, type MapPoint } from "../components/ProviderMap";
import { SiteNav } from "../components/SiteNav";
import logo from "../../assets/b2725744d7bb552f20e2a7bcebca16e19b4a014d.png";
import {
  searchServices, getFacilities, getProviders, listCategories, listPlans,
  getCashPrices, getFacilityQuality, formatPrice, isPreciseLocation, facilityLabel, isHSA,
  EVIDENCE_LABEL, SORT_LABEL,
  type Service, type Facility, type ProviderPrice, type Evidence,
  type Category, type ProviderSort, type Plan, type CashPrice, type QualityMeasure,
} from "../../lib/starkwell";

/** HCAHPS publishes a derived "_STAR_RATING" for these same questions, but
 *  in this dataset every one of them is null for all 48 facilities that
 *  otherwise have data (checked directly — 0 of 48 populated) — a real gap
 *  in what CMS computed for this reporting cycle, not a suppression per
 *  facility. These "% who said Always / Yes / 9-10" fields are the ones
 *  that are actually populated (40-44 of 48), so they're what the dialog
 *  shows — real HCAHPS numbers, just not converted to a 1-5 star scale. */
const PATIENT_EXPERIENCE_MEASURES = new Set([
  "H_HSP_RATING_9_10", "H_RECMND_DY", "H_CLEAN_HSP_A_P", "H_QUIET_HSP_A_P",
  "H_COMP_1_A_P", "H_COMP_2_A_P", "H_COMP_6_Y_P",
  "H_NURSE_RESPECT_A_P", "H_DOCTOR_RESPECT_A_P",
]);
const PATIENT_EXPERIENCE_LABELS: Record<string, string> = {
  H_HSP_RATING_9_10: "Rated the hospital 9 or 10 out of 10",
  H_RECMND_DY: "Would definitely recommend this hospital",
  H_CLEAN_HSP_A_P: "Room and bathroom always clean",
  H_QUIET_HSP_A_P: "Always quiet around their room at night",
  H_COMP_1_A_P: "Nurses always communicated well",
  H_COMP_2_A_P: "Doctors always communicated well",
  H_COMP_6_Y_P: "Given clear info about recovery at home",
  H_NURSE_RESPECT_A_P: "Nurses always treated them with respect",
  H_DOCTOR_RESPECT_A_P: "Doctors always treated them with respect",
};

/**
 * low_price/high_price are the 5th/95th percentile — the "typical price
 * range" shown by default, so a $0.01 blanket-contract placeholder rate
 * doesn't set the headline range everyone sees first. low_price_full/
 * high_price_full are the true min/max of the same group. This is never
 * hidden, just not the headline — see the comment on services() in
 * api/serving_api.py for the full reasoning.
 *
 * Unconditional, not "only when unusual" — checked directly against live
 * data and this affects essentially every service (200 of 200 sampled),
 * because blanket-contract placeholder rates are a routine feature of how
 * insurers publish TiC files, not a rare data error. A threshold that only
 * showed this "when it matters" would in practice always show it, while
 * implying its absence meant a clean range — false for ~100% of cards.
 */
function fullRangeNote(
  lowFull: number | null | undefined, highFull: number | null | undefined,
): string | null {
  if (lowFull == null || highFull == null) return null;
  // formatPrice rounds to whole dollars, which turns the exact $0.01
  // blanket-contract placeholder this note exists to explain into a
  // confusing "$0" — show cents below $1 so the number stays legible.
  const fmt = (n: number) => n < 1 ? `$${n.toFixed(2)}` : formatPrice(n);
  return `Full range, including rates far outside typical pricing: ${fmt(lowFull)}–${fmt(highFull)}. `
    + "Insurers' published files routinely include placeholder rates from blanket "
    + "network contracts (e.g. $0.01 for a service a provider never performs) — "
    + "excluded from the typical range above, never erased from the data.";
}

/** A `title` attribute never opens on tap — there is no hover state on a
 *  touch screen — so a plain span left this note completely unreachable on
 *  mobile. Popover opens on click/tap on every input type. The trigger sits
 *  inside a card that is itself a button (whole-card select), so this stops
 *  propagation to avoid double-firing the card's own onClick, and pads out
 *  the 12px icon to a real tap target without disturbing the inline text. */
function FullRangeInfo({ note }: { note: string | null }) {
  if (!note) return null;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <span
          role="button"
          tabIndex={0}
          onClick={e => e.stopPropagation()}
          aria-label="Full price range, including outlier rates"
          className="inline-flex items-center justify-center ml-1 p-2 align-middle text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <Info className="h-3 w-3" />
        </span>
      </PopoverTrigger>
      <PopoverContent
        className="w-72 text-sm text-gray-700"
        onClick={e => e.stopPropagation()}
      >
        {note}
      </PopoverContent>
    </Popover>
  );
}

/**
 * Procedure-first price search, in three layers:
 *
 *   procedure  ->  place  ->  individual provider
 *
 * The middle layer groups by STREET ADDRESS, not by organisation NPI. Insurers
 * contract with individual physicians, so organisation NPIs hold only 1.8% of
 * like-for-like knee-MRI providers; grouping on them would throw away 98% of
 * the data. Address grouping keeps all of it and reconstructs the real
 * campuses — 496 providers at 50 N MEDICAL DR is University of Utah Hospital.
 *
 * A place is NAMED only on an exact match against the CMS facility list.
 * Otherwise it shows its address. Guessing the name from whichever organisation
 * happens to be registered at the address labels Utah Valley Hospital
 * "Kirk W Leininger" — see lib/starkwell.ts.
 *
 * Ordering is the server's. Never re-sort by price in this file.
 */

const EVIDENCE_STYLE: Record<Evidence, string> = {
  performed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  peer: "bg-blue-50 text-blue-700 border-blue-200",
  peer_family: "bg-slate-50 text-slate-600 border-slate-200",
  unknown: "bg-amber-50 text-amber-700 border-amber-200",
};

// Short badge text, so the card reads in a glance instead of competing with
// the price for attention. The full EVIDENCE_LABEL sentence isn't dropped —
// it's still there, in the badge's title attribute (hover/long-press) — this
// is a faster read of the same honest claim, not a softer one.
const EVIDENCE_SHORT: Record<Evidence, string> = {
  performed: "Confirmed",
  peer: "Likely performs this",
  peer_family: "Possibly performs this",
  unknown: "Unconfirmed",
};

type CompareKind = "facility" | "provider";

export function PriceSearch() {
  const navigate = useNavigate();
  // ?q= lets the home page hand its search straight through, and makes a
  // result page linkable — which matters before anything is indexed, since
  // URLs are expensive to change once crawled.
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  // Lets Home's "Browse by care type" tiles (and any other future link) land
  // pre-filtered — query and city already worked this way, category quietly
  // didn't, which is why the tiles never actually did anything once clicked.
  const [category, setCategory] = useState(params.get("category") || "all");
  // Home's "Specialist" and "Elective Surgery" tiles don't map to one real
  // category — they land here via ?categories= (matches any) or ?keys=
  // (a hand-curated service_key list) instead. Cleared whenever the sidebar
  // Category dropdown is used directly, since "show me exactly Dental" and
  // "show me any of these 8 specialties" can otherwise contradict each other
  // and silently zero out the results.
  const [browseCategories, setBrowseCategories] = useState(
    (params.get("categories") || "").split(",").map(s => s.trim()).filter(Boolean),
  );
  const [browseKeys, setBrowseKeys] = useState(
    (params.get("keys") || "").split(",").map(s => s.trim()).filter(Boolean),
  );
  const [selected, setSelected] = useState<Service | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [facility, setFacility] = useState<Facility | null>(null);
  const [providers, setProviders] = useState<ProviderPrice[]>([]);
  const [city, setCity] = useState(params.get("city") || "");
  const [namedOnly, setNamedOnly] = useState(false);
  const [trustedOnly, setTrustedOnly] = useState(false);
  const [comparableOnly, setComparableOnly] = useState(true);
  const [sort, setSort] = useState<ProviderSort>("recommended");
  // Facilities arrive ordered by provider count, not price — the spread is
  // usually the whole point of looking, so this needs the same sort control
  // the provider list already has. Client-side: the facility list is at most
  // 25 rows, already fully fetched, and re-querying the server for a re-sort
  // of data already in hand would just add a round trip.
  const [facilitySort, setFacilitySort] = useState<ProviderSort>("recommended");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Compare tray. Scoped to one layer at a time — comparing a hospital
  // against an individual physician isn't a like-for-like question, so
  // facilities and providers get separate, small (max 3) selections rather
  // than one mixed list.
  const [compareFacilities, setCompareFacilities] = useState<Facility[]>([]);
  const [compareProviders, setCompareProviders] = useState<ProviderPrice[]>([]);
  const MAX_COMPARE = 3;

  // Insurance. Selecting a plan turns "what does this cost" into "what do I
  // pay" — the network's own rate, run through this plan's deductible and cost
  // sharing. Deductible-remaining is asked rather than assumed: it lives in the
  // insurer's claims system and no public source has it.
  const [plans, setPlans] = useState<Plan[]>([]);
  // Carrier is chosen first, then plan — 158 plans in one flat list made it
  // impossible to find your own plan without already knowing its exact name.
  const [issuer, setIssuer] = useState<string>("");
  const [planId, setPlanId] = useState<string>("");
  const [dedLeft, setDedLeft] = useState<string>("");

  const issuers = useMemo(
    () => Array.from(new Set(plans.map(p => p.issuer))).sort(),
    [plans]);
  const plansForIssuer = useMemo(
    () => plans.filter(p => p.issuer === issuer)
      .sort((a, b) => a.plan_name.localeCompare(b.plan_name)),
    [plans, issuer]);
  const plan = useMemo(
    () => plans.find(p => p.plan_id === planId) ?? null, [plans, planId]);

  // Hospital cash prices for the chosen service, keyed by address so a facility
  // card can show "or $X cash". Only ~22 Utah hospitals publish these, so most
  // cards will have none — absence is normal, not a failure.
  const [cash, setCash] = useState<Map<string, CashPrice>>(new Map());

  // Quality & Safety dialog. Facility rather than facility_id, so the modal
  // can show the name/address it's for while the fetch is still in flight.
  const [qualityFacility, setQualityFacility] = useState<Facility | null>(null);
  const [qualityMeasures, setQualityMeasures] = useState<QualityMeasure[]>([]);
  const [qualityLoading, setQualityLoading] = useState(false);

  useEffect(() => {
    if (!qualityFacility?.facility_id) return;
    let cancelled = false;
    setQualityLoading(true);
    getFacilityQuality(qualityFacility.facility_id)
      .then(rows => { if (!cancelled) setQualityMeasures(rows); })
      .finally(() => { if (!cancelled) setQualityLoading(false); });
    return () => { cancelled = true; };
  }, [qualityFacility]);

  useEffect(() => { listCategories().then(setCategories).catch(() => {}); }, []);
  useEffect(() => { listPlans().then(setPlans).catch(() => {}); }, []);
  useEffect(() => {
    if (!selected) { setCash(new Map()); return; }
    let cancelled = false;
    getCashPrices(selected.service_key).then(rows => {
      if (cancelled) return;
      const m = new Map<string, CashPrice>();
      for (const r of rows) m.set(r.address.trim().toUpperCase(), r);
      setCash(m);
    });
    return () => { cancelled = true; };
  }, [selected]);
  // Default the input to the plan's full deductible — the common case is that
  // none of it has been met yet, and it makes the number concrete immediately.
  useEffect(() => {
    if (plan?.deductible != null) setDedLeft(String(plan.deductible));
  }, [plan]);

  function toggleCompareFacility(f: Facility) {
    setCompareFacilities(cur => {
      const key = `${f.address}|${f.city}`;
      if (cur.some(x => `${x.address}|${x.city}` === key)) {
        return cur.filter(x => `${x.address}|${x.city}` !== key);
      }
      return cur.length >= MAX_COMPARE ? cur : [...cur, f];
    });
  }
  function toggleCompareProvider(p: ProviderPrice) {
    setCompareProviders(cur => {
      const key = `${p.npi}-${p.component}-${p.median_rate}`;
      if (cur.some(x => `${x.npi}-${x.component}-${x.median_rate}` === key)) {
        return cur.filter(x => `${x.npi}-${x.component}-${x.median_rate}` !== key);
      }
      return cur.length >= MAX_COMPARE ? cur : [...cur, p];
    });
  }

  async function runSearch(q: string, cat: string) {
    setLoading(true); setError(null);
    setSelected(null); setFacility(null); setFacilities([]); setProviders([]);
    setCompareFacilities([]); setCompareProviders([]);
    try {
      setServices(await searchServices(q, {
        category: cat === "all" ? undefined : cat, limit: 24,
        categories: browseCategories.length ? browseCategories : undefined,
        keys: browseKeys.length ? browseKeys : undefined,
      }));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally { setLoading(false); }
  }

  useEffect(() => { runSearch(query, category); /* eslint-disable-next-line */ }, [category, browseCategories, browseKeys]);

  // Layer 2 — places offering the chosen procedure.
  useEffect(() => {
    if (!selected || facility) return;
    let cancelled = false;
    setLoading(true); setError(null);
    getFacilities(selected.service_key, {
      city: city || undefined, namedOnly, limit: 25,
      planId: planId || undefined,
      deductibleRemaining: dedLeft === "" ? undefined : Number(dedLeft),
    })
      .then(r => { if (!cancelled) setFacilities(r); })
      .catch(e => { if (!cancelled) setError(e instanceof Error ? e.message : String(e)); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [selected, facility, city, namedOnly, planId, dedLeft]);

  // Layer 3 — individual providers at the chosen place.
  useEffect(() => {
    if (!selected || !facility) return;
    let cancelled = false;
    setLoading(true); setError(null);
    getProviders(selected.service_key, {
      address: facility.address, city: facility.city,
      trustedOnly, comparableOnly, sort, limit: 50,
    })
      .then(r => { if (!cancelled) setProviders(r.results); })
      .catch(e => { if (!cancelled) setError(e instanceof Error ? e.message : String(e)); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [selected, facility, trustedOnly, comparableOnly, sort]);

  const points: MapPoint[] = useMemo(() => {
    if (facility) {
      // ONE pin, not one per provider. Layer 3 is filtered to a single address,
      // so every provider shares a coordinate: mapping them individually stacks
      // 50 identical markers on one point and reports "50 of 50 shown", which is
      // true and useless. The map's job here is "where is this place".
      return [{
        key: `${facility.address}|${facility.city}`,
        label: facilityLabel(facility),
        city: facility.city,
        lat: facility.lat, lng: facility.lng,
        location_grade: facility.location_grade,
        price: facility.median_price,
        detail: `${providers.length} shown · ${formatPrice(facility.low_price)}–${formatPrice(facility.high_price)}`,
      }];
    }
    return facilities.map(f => ({
      key: `${f.address}|${f.city}`, label: facilityLabel(f), city: f.city,
      lat: f.lat, lng: f.lng, location_grade: f.location_grade,
      price: f.median_price,
      detail: `${f.providers} providers · ${formatPrice(f.low_price)}–${formatPrice(f.high_price)}`,
    }));
  }, [facility, providers, facilities]);

  // The number a sort should act on is whichever one the card is actually
  // showing as its headline: what-you-pay when a plan is priced, list price
  // otherwise. A location with no rate on the member's network has no number
  // to sort by at all — those sink to the bottom regardless of direction,
  // same as "no data" would in any price list.
  const sortedFacilities = useMemo(() => {
    const headline = (f: Facility) =>
      plan ? (f.your_cost ?? null) : f.median_price;
    if (facilitySort === "recommended") return facilities;
    const withPrice = facilities.filter(f => headline(f) != null);
    const withoutPrice = facilities.filter(f => headline(f) == null);
    withPrice.sort((a, b) => {
      const diff = (headline(a) as number) - (headline(b) as number);
      return facilitySort === "price_asc" ? diff : -diff;
    });
    return [...withPrice, ...withoutPrice];
  }, [facilities, facilitySort, plan]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="relative bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <img
              src={logo}
              alt="Starkwell"
              className="h-12 md:h-20 cursor-pointer rounded-[5px]"
              onClick={() => navigate("/")}
            />
            <SiteNav />
          </div>
        </div>
      </header>

      <main className={`container mx-auto px-6 py-8 max-w-7xl ${
        (!facility && compareFacilities.length > 0) || (facility && compareProviders.length > 0)
          ? "pb-28" : ""}`}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
          What will it cost, and where should I go?
        </h1>
        <p className="text-gray-600 mb-6">
          Prices are negotiated rates published by insurers.
        </p>

        {/* Same framed-card pattern as the Home hero search — a shadowed
            card with a grey inner border and tall, borderless inputs —
            reused deliberately so this page reads as the same product
            instead of a plainer tool bolted onto it. */}
        <Card className="shadow-xl border-gray-200 max-w-3xl mb-6">
          <CardContent className="p-2 rounded-[5px] bg-[#cbcbcb]">
            <form
              className="flex flex-col sm:flex-row gap-2"
              onSubmit={e => { e.preventDefault(); runSearch(query, category); }}
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <Input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="MRI knee, colonoscopy, blood test…"
                  className="pl-12 h-14 border-0 focus-visible:ring-0 text-base"
                />
              </div>
              {/* Kept visible here, not just as a post-selection sidebar filter —
                  Home already promises "procedure + location" together, and the
                  city stayed set once picked, so it should stay visible once picked. */}
              <div className="relative sm:w-56">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <Input
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="City, e.g. PROVO"
                  className="pl-12 h-14 border-0 focus-visible:ring-0 text-base"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 h-14 px-8 text-base"
              >
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* User-facing text only. The previous version printed the raw error
            and "Is the serving API running on port 8001?" — developer language
            that would appear in front of whoever is watching. The detail is
            still available, but folded away and sent to the console for us. */}
        {error && (
          <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="font-medium">Prices are temporarily unavailable</p>
                <p className="mt-1">
                  We couldn&rsquo;t reach the pricing service just now. Try again in a
                  moment — nothing is wrong with your search.
                </p>
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs text-amber-700">
                    Technical detail
                  </summary>
                  <p className="mt-1 font-mono text-xs break-all">{error}</p>
                </details>
              </div>
            </div>
          </div>
        )}

        {/* Breadcrumb */}
        {selected && (
          <div className="flex flex-wrap items-center gap-2 mb-4 text-sm">
            <Button
              variant="ghost" size="sm"
              onClick={() => {
                setSelected(null); setFacility(null);
                setCompareFacilities([]); setCompareProviders([]);
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> All procedures
            </Button>
            <span className="text-gray-400">/</span>
            <button
              className="text-blue-600 hover:underline disabled:text-gray-900 disabled:no-underline"
              disabled={!facility}
              onClick={() => { setFacility(null); setCompareProviders([]); }}
            >
              {selected.display_name}
            </button>
            {facility && (
              <>
                <span className="text-gray-400">/</span>
                <span className="text-gray-900 font-medium">{facilityLabel(facility)}</span>
              </>
            )}
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card className="lg:sticky lg:top-24 border-2 border-gray-200">
              <CardContent className="p-5 space-y-5">
                {/* Insurance first — it changes every number below it. Carrier,
                    then plan: a flat list of 158 plan names made it impossible
                    to find your own without already knowing its exact title. */}
                <div>
                  <Label className="text-sm font-semibold text-gray-900 mb-2 block">
                    Insurance carrier
                  </Label>
                  <Select
                    value={issuer || "none"}
                    onValueChange={v => {
                      setIssuer(v === "none" ? "" : v);
                      setPlanId("");
                    }}
                  >
                    <SelectTrigger><SelectValue placeholder="Select your carrier" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No plan — show list prices</SelectItem>
                      {issuers.map(i => (
                        <SelectItem key={i} value={i}>{i}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {issuer && (
                  <div>
                    <Label className="text-sm font-semibold text-gray-900 mb-2 block">
                      Your plan
                    </Label>
                    <Select value={planId || "none"} onValueChange={v => setPlanId(v === "none" ? "" : v)}>
                      <SelectTrigger><SelectValue placeholder="Select your plan" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Select a plan…</SelectItem>
                        {plansForIssuer.map(p => (
                          <SelectItem key={p.plan_id} value={p.plan_id}>
                            {p.plan_name}{p.metal ? ` · ${p.metal}` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {plan && (
                  <p className="-mt-3 text-xs text-gray-500">
                    {plan.deductible != null && <>{formatPrice(plan.deductible)} deductible</>}
                    {plan.moop != null && <> · {formatPrice(plan.moop)} max out-of-pocket</>}
                    {isHSA(plan) && <> · HSA-eligible</>}
                  </p>
                )}

                {plan && (
                  <div>
                    <Label htmlFor="ded" className="text-sm font-semibold text-gray-900 mb-2 block">
                      Deductible left this year
                    </Label>
                    <Input
                      id="ded"
                      type="number"
                      min={0}
                      value={dedLeft}
                      onChange={e => setDedLeft(e.target.value)}
                      placeholder={String(plan.deductible ?? 0)}
                    />
                    {/* Only the member knows this. It lives in the insurer's
                        claims system, and no public file carries it. */}
                    <p className="mt-1 text-xs text-gray-500">
                      Your insurer&rsquo;s app or a recent claim shows this. Set it to 0
                      if you&rsquo;ve already met your deductible.
                    </p>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-semibold text-gray-900 mb-2 block">
                    Category
                  </Label>
                  <Select
                    value={category}
                    onValueChange={c => {
                      setBrowseCategories([]); setBrowseKeys([]); setCategory(c);
                    }}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      {categories.map(c => (
                        <SelectItem key={c.category} value={c.category}>
                          {c.category} ({c.services})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selected && !facility && (
                  <>
                    <label className="flex items-start gap-2 cursor-pointer">
                      <Checkbox
                        checked={namedOnly}
                        onCheckedChange={v => setNamedOnly(Boolean(v))}
                        className="mt-0.5"
                      />
                      <span className="text-sm text-gray-700">
                        Named facilities only
                        <span className="block text-xs text-gray-500">
                          Hospitals matched to the CMS facility list
                        </span>
                      </span>
                    </label>
                  </>
                )}

                {selected && facility && (
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-900 block">Show</Label>
                    <label className="flex items-start gap-2 cursor-pointer">
                      <Checkbox
                        checked={comparableOnly}
                        onCheckedChange={v => setComparableOnly(Boolean(v))}
                        className="mt-0.5"
                      />
                      <span className="text-sm text-gray-700">
                        Like-for-like prices
                        <span className="block text-xs text-gray-500">
                          One billing component, so prices are comparable
                        </span>
                      </span>
                    </label>
                    <label className="flex items-start gap-2 cursor-pointer">
                      <Checkbox
                        checked={trustedOnly}
                        onCheckedChange={v => setTrustedOnly(Boolean(v))}
                        className="mt-0.5"
                      />
                      <span className="text-sm text-gray-700">
                        Confirmed providers only
                        <span className="block text-xs text-gray-500">
                          Hide rates we cannot tie to this procedure
                        </span>
                      </span>
                    </label>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {/* Layer 1 — procedures */}
            {!selected && (
              <div className="grid gap-3 sm:grid-cols-2">
                {services.map(s => (
                  <button
                    key={s.service_key}
                    type="button"
                    onClick={() => setSelected(s)}
                    className="text-left rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <Card className="h-full bg-white transition hover:border-blue-400">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900">{s.display_name}</p>
                            <p className="text-sm text-gray-500">{s.category}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-semibold text-gray-900">
                              {formatPrice(s.typical_price)}
                            </p>
                            <p className="text-xs text-gray-500">typical</p>
                          </div>
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                          {s.providers.toLocaleString()} providers ·{" "}
                          typical {formatPrice(s.low_price)}–{formatPrice(s.high_price)}
                          <FullRangeInfo note={fullRangeNote(s.low_price_full, s.high_price_full)} />
                        </p>
                      </CardContent>
                    </Card>
                  </button>
                ))}
                {!loading && services.length === 0 && !error && (
                  <p className="text-gray-500">No procedures matched “{query}”.</p>
                )}
              </div>
            )}

            {/* Layers 2 and 3 share the map / list split */}
            {selected && (
              <>
                {facility && (
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <p className="text-sm text-gray-600">
                      {facility.address}, {facility.city}
                    </p>
                    <Select value={sort} onValueChange={v => setSort(v as ProviderSort)}>
                      <SelectTrigger className="w-[210px] bg-white"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {(Object.keys(SORT_LABEL) as ProviderSort[]).map(k => (
                          <SelectItem key={k} value={k}>{SORT_LABEL[k]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Facilities arrived ordered by provider count. The price
                    spread between them is usually the whole reason to be
                    looking, so this gets the same sort control Layer 3 has
                    always had. */}
                {!facility && facilities.length > 0 && (
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <p className="text-sm text-gray-600">
                      {facilities.length} location{facilities.length === 1 ? "" : "s"}
                    </p>
                    <Select value={facilitySort} onValueChange={v => setFacilitySort(v as ProviderSort)}>
                      <SelectTrigger className="w-[210px] bg-white"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recommended">Most providers</SelectItem>
                        <SelectItem value="price_asc">{SORT_LABEL.price_asc}</SelectItem>
                        <SelectItem value="price_desc">{SORT_LABEL.price_desc}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="mb-3 flex items-start gap-2 rounded-md border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900">
                  <Info className="h-4 w-4 mt-0.5 shrink-0" />
                  {facility ? (
                    <p>
                      Individual providers billing at this address. An insurer rate proves a
                      provider is <em>in network</em> for a code — not that they perform it.
                    </p>
                  ) : plan ? (
                    <p>
                      Priced for <strong>{plan.plan_name}</strong> using that plan&rsquo;s own
                      network rate and cost sharing. Locations marked{" "}
                      <strong>check coverage</strong> publish no rate on your network —
                      confirm with your insurer before booking.
                    </p>
                  ) : (
                    <p>
                      Places are grouped by street address. The price shown is the{" "}
                      <strong>median</strong> across everyone billing there, with the range
                      beside it — one low price at a large campus is not the price of going.
                      Pick your insurance to see what <em>you</em> would pay.
                    </p>
                  )}
                </div>

                {/* The homepage makes a fuller version of this claim, then it
                    disappears — by the time someone's comparing actual prices
                    is exactly when they'd want the reassurance the number is
                    real. This is Starkwell's answer to a star rating; it
                    should be visible where the decision is happening, not
                    just above the fold on Home. */}
                <div className="mb-4 flex items-center gap-1.5 text-xs text-gray-500">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                  Every price here comes from insurers&rsquo; own published rate files —
                  not estimates, not a survey.
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="lg:sticky lg:top-24 h-fit order-2 lg:order-1">
                    <ProviderMap providers={points} />
                  </div>

                  <div className="space-y-3 order-1 lg:order-2">
                    {/* Layer 2 — places */}
                    {!facility && sortedFacilities.map(f => {
                      const key = `${f.address}|${f.city}`;
                      const inCompare = compareFacilities.some(
                        x => `${x.address}|${x.city}` === key);
                      return (
                      <div
                        key={key}
                        role="button"
                        tabIndex={0}
                        onClick={() => setFacility(f)}
                        onKeyDown={e => {
                          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setFacility(f); }
                        }}
                        className="w-full text-left rounded-xl cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      >
                        <Card className="bg-white transition hover:border-blue-400">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-gray-900 truncate">
                                    {facilityLabel(f)}
                                  </p>
                                  <button
                                    type="button"
                                    title={inCompare ? "Remove from comparison" : "Add to comparison"}
                                    aria-pressed={inCompare}
                                    onClick={e => { e.stopPropagation(); toggleCompareFacility(f); }}
                                    disabled={!inCompare && compareFacilities.length >= MAX_COMPARE}
                                    className={`shrink-0 rounded-md border p-1 transition disabled:opacity-30 disabled:cursor-not-allowed ${
                                      inCompare
                                        ? "bg-blue-600 border-blue-600 text-white"
                                        : "bg-white border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-300"}`}
                                  >
                                    <Scale className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                                {/* Always show the street when the label is a
                                    NAME, because several addresses can share
                                    one system label — three sites all read
                                    "University of Utah Health, Salt Lake City",
                                    and the street is what tells them apart. */}
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                  <MapPin className="h-3 w-3 shrink-0" />
                                  {f.name_source ? `${f.address}, ${f.city}` : f.city}
                                </p>
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                  <Badge variant="outline" className="bg-white text-gray-600">
                                    {f.providers} {f.providers === 1 ? "provider" : "providers"}
                                  </Badge>
                                  {f.rating && /^\d$/.test(f.rating) && (
                                    <Badge
                                      variant="outline"
                                      className="bg-amber-50 text-amber-700 border-amber-200"
                                    >
                                      <Star className="h-3 w-3 mr-1" />
                                      {f.rating}/5 CMS
                                    </Badge>
                                  )}
                                  {/* Different CMS survey from the overall
                                      rating above — HCAHPS patient-experience
                                      stars, with the real survey count so it
                                      reads as evidence, not a bare number. */}
                                  {f.patient_star != null && (
                                    <Badge
                                      variant="outline"
                                      className="bg-emerald-50 text-emerald-700 border-emerald-200"
                                    >
                                      <Star className="h-3 w-3 mr-1" />
                                      {f.patient_star}/5 patient rating
                                      {f.surveys != null && ` (${f.surveys} surveys)`}
                                    </Badge>
                                  )}
                                  {f.name_source === "system" && (
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                      health system
                                    </Badge>
                                  )}
                                  {f.name_source === "org" && (
                                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                                      practice name
                                    </Badge>
                                  )}
                                  {f.name_source === "org_verified" && (
                                    <Badge
                                      variant="outline"
                                      className="bg-slate-50 text-slate-600 border-slate-200"
                                      title="Only one business is registered at this address, cross-checked against a matching phone number on a separate provider record — a real signal, but thinner than a confirmed name."
                                    >
                                      unconfirmed name
                                    </Badge>
                                  )}
                                  {!f.name_source && (
                                    <Badge variant="outline" className="bg-slate-50 text-slate-600">
                                      unnamed location
                                    </Badge>
                                  )}
                                  {plan && f.network_coverage === "not_published" && (
                                    <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300">
                                      check coverage
                                    </Badge>
                                  )}
                                </div>
                                {/* Only the 102 CMS-tracked hospitals/ASCs have
                                    a facility_id — most physician offices
                                    won't, so this stays hidden rather than
                                    opening an empty dialog. */}
                                {f.facility_id && (
                                  <button
                                    type="button"
                                    onClick={e => { e.stopPropagation(); setQualityFacility(f); }}
                                    className="mt-1.5 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:underline"
                                  >
                                    <ClipboardList className="h-3 w-3" />
                                    Quality &amp; safety data
                                  </button>
                                )}
                              </div>
                              {/* With a plan selected the headline becomes what
                                  the MEMBER pays; the negotiated rate drops to
                                  context. Without one it stays the list price. */}
                              <div className="text-right shrink-0">
                                {plan && f.your_cost != null ? (
                                  <>
                                    <p className="text-lg font-semibold text-gray-900">
                                      {formatPrice(f.your_cost)}
                                    </p>
                                    <p className="text-xs text-gray-500">you pay</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                      {formatPrice(f.network_rate)} negotiated
                                    </p>
                                  </>
                                ) : plan && f.network_coverage === "not_published" ? (
                                  <>
                                    <p className="text-sm font-semibold text-amber-700">
                                      Not listed
                                    </p>
                                    <p className="text-xs text-gray-500 max-w-[7rem]">
                                      on your plan&rsquo;s network
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <p className="text-lg font-semibold text-gray-900">
                                      {formatPrice(f.median_price)}
                                    </p>
                                    <p className="text-xs text-gray-500">median</p>
                                    <p className="text-xs text-gray-500">
                                      typical {formatPrice(f.low_price)}–{formatPrice(f.high_price)}
                                      <FullRangeInfo note={fullRangeNote(f.low_price_full, f.high_price_full)} />
                                    </p>
                                  </>
                                )}
                                {/* Self-pay price, where the hospital publishes one.
                                    ~22 Utah hospitals do, so most cards have none.

                                    THE COMPARISON IS ONLY DRAWN AGAINST what the
                                    member would actually pay. A cash price is a
                                    FACILITY charge; median_price is the service's
                                    headline component, which is the PHYSICIAN fee for
                                    73 of 166 services. Comparing those two made a
                                    knee X-ray read "$45 median vs $205 cash" — cash
                                    looking 4.5x worse when the two numbers are not
                                    measuring the same thing. Without a plan the cash
                                    price is shown as plain information, uncompared.

                                    Even against your_cost, "cheaper" is the exception:
                                    across 1,467 like-for-like pairs cash wins 26% of
                                    the time, median 1.54x the negotiated rate. */}
                                {(() => {
                                  const c = cash.get(f.address.trim().toUpperCase());
                                  if (!c) return null;
                                  const comparable = plan && f.your_cost != null;
                                  const cheaper = comparable && c.cash_price < (f.your_cost as number);
                                  return (
                                    <p className={`mt-1 text-xs ${
                                      cheaper ? "font-semibold text-emerald-700" : "text-gray-400"}`}>
                                      {formatPrice(c.cash_price)} cash price
                                      {cheaper && " — less than your share"}
                                    </p>
                                  );
                                })()}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      );
                    })}
                    {/* Shown only when a cash price is actually on screen.
                        Two separate traps, and the second is the one people
                        miss: money paid as self-pay does not accumulate, so a
                        cash payment leaves the deductible exactly where it was
                        and the next visit still costs full price. */}
                    {!facility && cash.size > 0 && facilities.some(
                      f => cash.has(f.address.trim().toUpperCase())) && (
                      <div className="rounded-md border border-gray-200 bg-white p-3 text-xs text-gray-600">
                        <p className="font-medium text-gray-800 mb-1">About cash prices</p>
                        <p>
                          These are the hospital&rsquo;s self-pay rates. If you have
                          insurance, a provider may not offer this price — and paying
                          cash usually <strong>does not count</strong> toward your
                          deductible or out-of-pocket maximum, so it won&rsquo;t reduce
                          what you owe later in the year. Ask the billing office before
                          you decide.
                        </p>
                      </div>
                    )}

                    {!facility && !loading && facilities.length === 0 && !error && (
                      <p className="text-gray-500">
                        No locations{city ? ` in ${city}` : ""} for this procedure.
                      </p>
                    )}

                    {/* Layer 3 — providers */}
                    {facility && providers.map(p => {
                      const pkey = `${p.npi}-${p.component}-${p.median_rate}`;
                      const inCompare = compareProviders.some(
                        x => `${x.npi}-${x.component}-${x.median_rate}` === pkey);
                      return (
                      <Card key={pkey} className="bg-white">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-gray-900 truncate">
                                  {p.provider_name}
                                </p>
                                <button
                                  type="button"
                                  title={inCompare ? "Remove from comparison" : "Add to comparison"}
                                  aria-pressed={inCompare}
                                  onClick={() => toggleCompareProvider(p)}
                                  disabled={!inCompare && compareProviders.length >= MAX_COMPARE}
                                  className={`shrink-0 rounded-md border p-1 transition disabled:opacity-30 disabled:cursor-not-allowed ${
                                    inCompare
                                      ? "bg-blue-600 border-blue-600 text-white"
                                      : "bg-white border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-300"}`}
                                >
                                  <Scale className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              {/* Real, not inferred — the provider's own NUCC
                                  taxonomy code. This is what turns fifty
                                  identical-looking rows into something a
                                  patient can actually tell apart by, without
                                  adding a rating or photo nobody can verify. */}
                              {p.specialty && (
                                <p className="text-sm text-gray-700">{p.specialty}</p>
                              )}
                              <p className="text-sm text-gray-500 flex items-center gap-1">
                                <MapPin className="h-3 w-3 shrink-0" />
                                {p.city ?? "—"}
                                {!isPreciseLocation(p.location_grade) && (
                                  <span className="text-amber-600">· approximate</span>
                                )}
                              </p>
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                <Badge
                                  variant="outline"
                                  className={EVIDENCE_STYLE[p.evidence]}
                                  title={EVIDENCE_LABEL[p.evidence]}
                                >
                                  {EVIDENCE_SHORT[p.evidence]}
                                </Badge>
                                <Badge variant="outline" className="bg-white text-gray-600">
                                  {p.n_payers} {p.n_payers === 1 ? "plan" : "plans"}
                                </Badge>
                                {p.component && p.component !== "global" && (
                                  <Badge
                                    variant="outline"
                                    className="bg-amber-50 text-amber-700 border-amber-200"
                                  >
                                    {p.component === "professional"
                                      ? "interpretation fee only"
                                      : p.component}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-lg font-semibold text-gray-900">
                                {formatPrice(p.median_rate)}
                              </p>
                              {p.pct_of_medicare != null && (
                                <p className="text-xs text-gray-500">
                                  {Math.round(p.pct_of_medicare)}% of Medicare
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      );
                    })}
                    {facility && !loading && providers.length === 0 && !error && (
                      <p className="text-gray-500">No providers match these filters here.</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Compare tray. Scoped to whichever layer is on screen — facilities
          while browsing places, providers once inside one — so it never
          shows a stale selection from a layer the user has left. */}
      {!facility && compareFacilities.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-40 border-t border-gray-200 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
          <div className="container mx-auto px-6 py-3 max-w-7xl">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                <Scale className="h-4 w-4" /> Comparing {compareFacilities.length} of {MAX_COMPARE}
              </p>
              <button
                type="button"
                onClick={() => setCompareFacilities([])}
                className="text-xs text-gray-500 hover:text-gray-800"
              >
                Clear
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto">
              {compareFacilities.map(f => {
                const headline = plan
                  ? (f.your_cost != null ? formatPrice(f.your_cost) : "Not listed")
                  : formatPrice(f.median_price);
                return (
                  <div
                    key={`${f.address}|${f.city}`}
                    className="flex items-center gap-2 shrink-0 rounded-lg border border-gray-200 bg-gray-50 pl-3 pr-2 py-2 min-w-[220px]"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{facilityLabel(f)}</p>
                      <p className="text-xs text-gray-500">
                        {headline}{plan && f.your_cost != null ? " you pay" : plan ? "" : " median"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleCompareFacility(f)}
                      className="shrink-0 text-gray-400 hover:text-gray-700"
                      title="Remove"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {facility && compareProviders.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-40 border-t border-gray-200 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
          <div className="container mx-auto px-6 py-3 max-w-7xl">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                <Scale className="h-4 w-4" /> Comparing {compareProviders.length} of {MAX_COMPARE}
              </p>
              <button
                type="button"
                onClick={() => setCompareProviders([])}
                className="text-xs text-gray-500 hover:text-gray-800"
              >
                Clear
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto">
              {compareProviders.map(p => (
                <div
                  key={`${p.npi}-${p.component}-${p.median_rate}`}
                  className="flex items-center gap-2 shrink-0 rounded-lg border border-gray-200 bg-gray-50 pl-3 pr-2 py-2 min-w-[220px]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.provider_name}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {p.specialty ?? EVIDENCE_SHORT[p.evidence]} · {formatPrice(p.median_rate)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleCompareProvider(p)}
                    className="shrink-0 text-gray-400 hover:text-gray-700"
                    title="Remove"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quality & Safety — real CMS HCAHPS survey results and safety
          measures, not a rating anyone here invented. See
          getFacilityQuality() in lib/starkwell.ts for the source. */}
      <Dialog open={!!qualityFacility} onOpenChange={open => { if (!open) setQualityFacility(null); }}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {qualityFacility ? facilityLabel(qualityFacility) : "Quality & safety"}
            </DialogTitle>
            <DialogDescription>
              From CMS's Hospital Compare survey — real patient responses and
              outcome data, not a rating built for this site.
            </DialogDescription>
          </DialogHeader>

          {qualityLoading && (
            <p className="text-sm text-gray-500 py-4">Loading…</p>
          )}

          {!qualityLoading && qualityMeasures.length === 0 && (
            <p className="text-sm text-gray-500 py-4">
              CMS hasn&rsquo;t published quality data for this location.
            </p>
          )}

          {!qualityLoading && qualityMeasures.length > 0 && (() => {
            const experience = qualityMeasures.filter(
              m => PATIENT_EXPERIENCE_MEASURES.has(m.measure_id));
            const complications = qualityMeasures.filter(
              m => m.kind === "complication");
            return (
              <div className="space-y-6">
                {experience.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                      Patient experience
                    </h3>
                    {qualityFacility?.patient_star != null && (
                      <p className="flex items-center gap-1 text-sm text-gray-700 mb-2">
                        <Star className="h-3.5 w-3.5 text-amber-500" />
                        {qualityFacility.patient_star}/5 overall
                        {qualityFacility.surveys != null && ` (${qualityFacility.surveys} surveys)`}
                      </p>
                    )}
                    <div className="space-y-2">
                      {experience.map(m => (
                        <div key={m.measure_id} className="flex items-center justify-between gap-3">
                          <span className="text-sm text-gray-700">
                            {PATIENT_EXPERIENCE_LABELS[m.measure_id] ?? m.measure_name}
                          </span>
                          {m.score != null ? (
                            <span className="text-sm font-medium text-gray-900 shrink-0">
                              {m.score}%
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400 shrink-0">not enough surveys</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {complications.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                      Safety & complications
                    </h3>
                    {/* CMS's own vs_national framing leads, not the raw rate —
                        a bare "11.1" means nothing without knowing what's
                        normal, but "no different than the national rate" does. */}
                    <div className="space-y-2">
                      {complications.map(m => (
                        <div key={m.measure_id} className="flex items-center justify-between gap-3">
                          <span className="text-sm text-gray-700">{m.measure_name}</span>
                          <span className={`text-xs shrink-0 ${
                            m.vs_national?.startsWith("Better") ? "text-emerald-700"
                              : m.vs_national?.startsWith("Worse") ? "text-red-700"
                              : "text-gray-500"}`}
                          >
                            {m.vs_national ?? "not enough cases"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
