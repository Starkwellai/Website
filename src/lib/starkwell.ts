/**
 * Starkwell data access.
 *
 * The one module the UI talks to for pricing. Components must not call fetch()
 * for price data directly — when this moves from the local API to Supabase or a
 * hosted endpoint, only this file changes.
 *
 * ORDERING IS NOT A UI CONCERN. The server returns providers already ranked by
 * evidence then price, and the UI must render them in the order received.
 * Re-sorting a result set by price in a component reintroduces the exact bug
 * this layer exists to prevent: a negotiated rate proves a provider is IN
 * NETWORK for a code, not that they PERFORM it, so sorting "MRI - knee" by
 * price alone floats a lactation consultancy to the top at $48 while real
 * radiologists sit at $216+. See api/serving_api.py for the full explanation.
 */

const BASE = "/serving";

/** Why we believe this provider performs this service, best first. */
export type Evidence = "performed" | "peer" | "peer_family" | "unknown";

/** Human-facing label for the evidence ladder. Use this, never the raw enum. */
export const EVIDENCE_LABEL: Record<Evidence, string> = {
  performed: "Known to perform this",
  peer: "Same specialty performs this",
  peer_family: "Related specialty performs this",
  unknown: "In network — not confirmed to perform this",
};

/**
 * Geocode quality. A centroid grade renders as a confident pin in a place the
 * provider may not be, so it must never drive a distance or "nearest" ranking.
 *
 * TWO VOCABULARIES EXIST and both must be handled. The serving slice emits
 * lowercase `exact` / `approximate`; providers.parquet carries the geocoder's
 * own labels (`Exact`, `Non_Exact`, `No_Match`, and `Geocodio_*` from the
 * Geocodio backfill). Matching only the capitalised set marked all 29,844
 * precise providers as approximate and put "· approximate location" on every
 * row on the page. Compare case-insensitively against both.
 */
export type LocationGrade = string;

const PRECISE = new Set([
  "exact", "geocodio_exact", "geocodio_approx", "approximate_street",
]);

export function isPreciseLocation(g: LocationGrade | null | undefined): boolean {
  return g ? PRECISE.has(g.toLowerCase()) : false;
}

export interface Service {
  service_key: string;
  display_name: string;
  category: string;
  providers: number;
  typical_price: number | null;
  /** 5th/95th percentile — the "typical price range" shown by default. */
  low_price: number | null;
  high_price: number | null;
  /** True min/max, including rare outlier rates (e.g. $0.01 blanket-contract
   *  placeholders). Not the headline number, but never hidden — see
   *  low_price/high_price above for why the two differ. */
  low_price_full: number | null;
  high_price_full: number | null;
}

export interface ProviderPrice {
  npi: string;
  provider_name: string;
  address: string | null;
  city: string | null;
  zip: string | null;
  lat: number | null;
  lng: number | null;
  location_grade: LocationGrade | null;
  median_rate: number;
  min_rate: number | null;
  max_rate: number | null;
  medicare_allowed: number | null;
  pct_of_medicare: number | null;
  n_payers: number;
  obs_count: number;
  /** Billing component: "global" (whole service), "professional" (read/interpretation only), "facility". */
  component: string | null;
  evidence: Evidence;
  evidence_rank: number;
  /** True when this row is the service's headline component and so price-comparable. */
  is_primary: boolean;
  /** From the provider's own NUCC taxonomy code, e.g. "Orthopaedic Surgery Physician". Null if unresolved. */
  specialty: string | null;
}

/**
 * A place, grouped by street address rather than by organisation NPI.
 *
 * Insurers contract with individual physicians, so organisation NPIs hold only
 * 1.8% of like-for-like knee-MRI providers — grouping on them would discard
 * almost everything. Address grouping keeps every row and reconstructs the real
 * campuses.
 *
 * `facility_name` is null unless the address matched the CMS facility list
 * exactly. Render the address when it is null; never substitute a nearby
 * organisation's name, which would label Utah Valley Hospital "Kirk W Leininger".
 */
export interface Facility {
  address: string;
  city: string;
  /** CMS-verified facility name, from an exact address match. Null otherwise. */
  facility_name: string | null;
  /** Health system agreed by >=70% of organisations at this address, from a
   *  curated list of known Utah systems. */
  system: string | null;
  /** The specific organisation name, either from >=70% agreement among
   *  organisations at this address (name_source "org"), or from a single
   *  organisation NPI corroborated by a phone-number match against an
   *  independent individual-provider record (name_source "org_verified",
   *  lower confidence — see facilityLabel). */
  org: string | null;
  /** How the name was established — governs how much the UI should assert it. */
  name_source: "cms" | "system" | "org" | "org_verified" | null;
  /** CMS overall star rating, only for CMS-named facilities. */
  rating: string | null;
  facility_kind: string | null;
  /** CMS Certification Number. Only the 102 tracked hospitals/ASCs have one —
   *  pass it to getFacilityQuality() for the fuller HCAHPS/safety picture. */
  facility_id: string | null;
  /** HCAHPS patient-experience star rating (1-5) — a different CMS survey
   *  from `rating` above, so it travels separately. Null below CMS's
   *  reporting threshold, same as `rating`. */
  patient_star: number | null;
  /** How many patients the patient_star rating is based on. */
  surveys: number | null;
  providers: number;
  /** Median across the location. NOT the minimum — one cheap physician at a
   *  496-provider campus is not the price of going there. */
  median_price: number;
  /** 5th/95th percentile — the "typical price range" shown by default. */
  low_price: number;
  high_price: number;
  /** True min/max, including rare outlier rates. Not the headline, never
   *  hidden — see the Service interface above for the full explanation. */
  low_price_full: number;
  high_price_full: number;
  pct_of_medicare: number | null;
  best_evidence_rank: number;
  lat: number | null;
  lng: number | null;
  location_grade: LocationGrade | null;

  // Present only when a plan was supplied.
  /** The plan's own network rate here. Null when the network lists nothing. */
  network_rate?: number | null;
  /** What the member pays after deductible and cost sharing. */
  your_cost?: number | null;
  network?: string | null;
  /** "in_network" | "not_published" — the latter is a warning, not a price. */
  network_coverage?: string | null;
}

export async function getFacilities(
  serviceKey: string,
  opts: {
    city?: string; namedOnly?: boolean; limit?: number;
    /** Price every location for this plan. */
    planId?: string;
    /** How much deductible is left. Defaults to the plan's full deductible. */
    deductibleRemaining?: number;
  } = {},
): Promise<Facility[]> {
  const r = await get<{ results: Facility[] }>(
    `/services/${encodeURIComponent(serviceKey)}/facilities`,
    {
      city: opts.city, named_only: opts.namedOnly, limit: opts.limit ?? 25,
      plan_id: opts.planId,
      deductible_remaining: opts.deductibleRemaining,
    },
  );
  return r.results;
}

function titleCase(s: string): string {
  return s.toLowerCase().replace(/\b[a-z]/g, c => c.toUpperCase());
}

/**
 * Label for a place, strongest evidence first:
 *   cms           "MCKAY-DEE HOSPITAL"                exact CMS address match
 *   system        "University of Utah Health, Provo"  >=70% of orgs agree on
 *                                                      a known multi-location
 *                                                      chain
 *   org           "Riverwoods Urgent Care Center LC"   >=70% agree on one
 *                                                      organisation not in
 *                                                      that curated chain list
 *   org_verified  "Likely: Example Clinic LLC"         one organisation NPI,
 *                                                      corroborated by a
 *                                                      phone match against an
 *                                                      independent record —
 *                                                      real evidence, but
 *                                                      thinner than the tiers
 *                                                      above, so it says so
 *   none          "4403 HARRISON BLVD"                no agreement — address
 *
 * The fallback is the address, never a nearby organisation's name. A shared
 * campus (Intermountain and University of Utah both at 100 Mario Capecchi Dr)
 * and a medical office building of unrelated practices both land here, and in
 * both cases the address is the only true answer.
 */
export function facilityLabel(f: Facility): string {
  if (f.facility_name) return f.facility_name;
  if (f.system) return `${f.system}, ${titleCase(f.city)}`;
  if (f.org) return f.name_source === "org_verified"
    ? `Likely: ${titleCase(f.org)}`
    : titleCase(f.org);
  return f.address;
}

/** A selectable insurance plan, from the CMS marketplace filings. */
export interface Plan {
  plan_id: string;
  payer_key: string;
  issuer: string;
  plan_name: string;
  metal: string | null;
  plan_type: string | null;
  hsa_eligible: string | boolean | null;
  deductible: number | null;
  moop: number | null;
}

export async function listPlans(payer?: string): Promise<Plan[]> {
  const r = await get<{ results: Plan[] }>("/plans", { payer });
  return r.results;
}

export function isHSA(p: Plan): boolean {
  return String(p.hsa_eligible ?? "").toLowerCase().startsWith("y")
      || p.hsa_eligible === true;
}

/**
 * Hospital cash price against the negotiated FACILITY rate at the same hospital.
 *
 * The component pairing is the whole point. A cash price is a facility charge;
 * compared against a global or professional rate it produces nonsense (one
 * service showed "$306 cash vs $8 insured" because $8 was a physician fee).
 * The API pairs it only with `component = 'facility'`.
 *
 * Cash is NOT reliably cheaper: measured across 1,467 like-for-like pairs the
 * median is 1.54x the negotiated rate, and cash wins in only 26% of cases —
 * though when it wins it can win by 10x. Never present it as "the cheaper way".
 */
export interface CashPrice {
  hospital: string;
  city: string | null;
  address: string;
  cash_price: number;
  list_price: number | null;
  facility_rate: number;
  providers: number;
  ratio: number;
}

export async function getCashPrices(serviceKey: string): Promise<CashPrice[]> {
  try {
    const r = await get<{ results: CashPrice[] }>(
      `/services/${encodeURIComponent(serviceKey)}/cash`, { limit: 100 });
    return r.results;
  } catch {
    // 404 simply means no hospital publishes a cash price for this service —
    // true for most of the 166, and not an error worth surfacing.
    return [];
  }
}

/**
 * One CMS HCAHPS/safety measure for a facility. Real federal survey data —
 * `kind: "patient_experience"` is the review-like half (nurse/doctor
 * communication, cleanliness, "would recommend"); `kind: "complication"` is
 * mortality/complication rates, each already framed by CMS as better/worse/
 * no different than the national rate. `score` is null when CMS suppressed
 * it for too few cases — show that honestly, don't hide the row.
 */
export interface QualityMeasure {
  kind: "patient_experience" | "complication";
  measure_id: string;
  measure_name: string;
  score: number | null;
  vs_national: string | null;
}

export async function getFacilityQuality(facilityId: string): Promise<QualityMeasure[]> {
  try {
    const r = await get<{ results: QualityMeasure[] }>(
      `/facilities/${encodeURIComponent(facilityId)}/quality`);
    return r.results;
  } catch {
    // 404/503 means no CMS quality data for this facility — true for most
    // physician offices (only the 102 tracked hospitals/ASCs have any),
    // not an error worth surfacing.
    return [];
  }
}

export interface Category {
  category: string;
  services: number;
  providers: number;
}

/**
 * "Specialist" isn't one backend category — it's a hand-picked spread across
 * the named specialties plus the catch-all "Specialty" (general specialist
 * office visits). Shared between Home's tile and the dashboard's sidebar link
 * so the two don't quietly drift apart.
 */
export const SPECIALIST_CATEGORIES = [
  "Cardiology", "Neurology", "Pulmonology", "ENT", "Audiology",
  "Endocrinology", "Allergy", "Sleep medicine", "Specialty",
];

/**
 * Bone/joint/spine care — there's no "Orthopedics" category in the backend
 * (these split across Imaging and Procedure), so this is a curated keys
 * list: musculoskeletal imaging plus musculoskeletal procedures, same
 * approach as ELECTIVE_SURGERY_KEYS below.
 */
export const ORTHOPEDICS_KEYS = [
  "xray_ankle_foot", "xray_hand_wrist", "xray_knee", "xray_shoulder",
  "xray_hip", "dexa_bone_density", "ct_spine", "mri_knee", "mri_shoulder",
  "carpal_tunnel_release", "shoulder_arthroscopy", "lumbar_spinal_fusion",
  "knee_arthroscopy", "orthopedic_hardware_removal", "shoulder_replacement",
  "hip_replacement", "knee_replacement", "hammertoe_correction",
  "joint_injection", "cervical_spinal_fusion", "si_joint_injection",
  "trigger_finger_release", "lumbar_laminectomy",
];

/**
 * True operative/implant/replacement procedures only — deliberately excludes
 * diagnostic scopes, injections, biopsies, and catheter-based ablations/PCI
 * so this matches what a patient would actually call "surgery".
 */
export const ELECTIVE_SURGERY_KEYS = [
  "blepharoplasty", "breast_lump_excision", "cabg", "carpal_tunnel_release",
  "cataract_surgery", "cervical_spinal_fusion", "gallbladder_removal",
  "hammertoe_correction", "hernia_repair", "hip_replacement",
  "knee_arthroscopy", "knee_replacement", "lumbar_laminectomy",
  "lumbar_spinal_fusion", "mohs_surgery", "orthopedic_hardware_removal",
  "pacemaker_insertion", "robotic_prostatectomy", "shoulder_arthroscopy",
  "shoulder_replacement", "skin_cancer_excision",
  "spinal_cord_stimulator_implant", "tavr", "tonsillectomy",
  "trigger_finger_release", "turbinate_reduction",
  "turp_prostate_resection", "vasectomy", "vitrectomy",
  "watchman_laa_closure", "eyelid_ptosis_repair",
];

async function get<T>(path: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params ?? {})) {
    if (v !== undefined && v !== "") qs.set(k, String(v));
  }
  const url = `${BASE}${path}${qs.toString() ? `?${qs}` : ""}`;
  const res = await fetch(url);
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText}${detail ? ` — ${detail.slice(0, 160)}` : ""}`);
  }
  return res.json() as Promise<T>;
}

/** Procedure-first search — the product's entry point. */
export async function searchServices(
  query: string,
  opts: {
    category?: string;
    /** Matches ANY of these categories — for a browse grouping that spans
     *  several real categories (e.g. Home's "Specialist" tile). */
    categories?: string[];
    /** Exact service_key list — for a hand-curated set that doesn't map to
     *  any single category (e.g. "Elective Surgery"). */
    keys?: string[];
    limit?: number;
  } = {},
): Promise<Service[]> {
  const r = await get<{ results: Service[] }>("/services", {
    q: query, category: opts.category, limit: opts.limit ?? 30,
    categories: opts.categories?.join(","),
    keys: opts.keys?.join(","),
  });
  return r.results;
}

export async function listCategories(): Promise<Category[]> {
  const r = await get<{ categories: Category[] }>("/categories");
  return r.categories;
}

/**
 * Providers for a service, already ranked by evidence then price.
 * Render in the order returned.
 */
/**
 * "recommended" leads with evidence then price and is the default.
 * The price sorts answer a direct "cheapest first" question — the UI must keep
 * the evidence badge visible when they are used.
 */
export type ProviderSort = "recommended" | "price_asc" | "price_desc";

export const SORT_LABEL: Record<ProviderSort, string> = {
  recommended: "Recommended",
  price_asc: "Price: low to high",
  price_desc: "Price: high to low",
};

export async function getProviders(
  serviceKey: string,
  opts: {
    city?: string;
    /** Drill down into one location returned by getFacilities. */
    address?: string;
    maxPrice?: number; trustedOnly?: boolean;
    /** Defaults to true: show one billing component so prices are like-for-like. */
    comparableOnly?: boolean;
    sort?: ProviderSort;
    limit?: number;
  } = {},
): Promise<{ display_name: string; results: ProviderPrice[] }> {
  return get(`/services/${encodeURIComponent(serviceKey)}/providers`, {
    city: opts.city,
    address: opts.address,
    max_price: opts.maxPrice,
    trusted_only: opts.trustedOnly,
    comparable_only: opts.comparableOnly ?? true,
    sort: opts.sort ?? "recommended",
    limit: opts.limit ?? 25,
  });
}

export async function getProvider(npi: string) {
  return get<{
    npi: string; provider_name: string; address: string | null; city: string | null;
    zip: string | null; lat: number | null; lng: number | null;
    location_grade: LocationGrade | null;
    services: Array<{
      service_key: string; display_name: string; category: string;
      median_rate: number; pct_of_medicare: number | null;
      n_payers: number; evidence: Evidence; evidence_rank: number;
    }>;
  }>(`/providers/${encodeURIComponent(npi)}`);
}

export async function health() {
  return get<{ ok: boolean; n: number; providers: number; services: number; slice: string }>("/health");
}

export function formatPrice(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return `$${Math.round(n).toLocaleString()}`;
}
