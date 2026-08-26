import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  searchServices, getFacilities, facilityLabel, formatPrice,
  ORTHOPEDICS_KEYS, ELECTIVE_SURGERY_KEYS,
  type Facility,
} from "../../lib/starkwell";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Search, Activity, Stethoscope, Bone, Smile, Eye, Heart, MapPin, Star, DollarSign, Shield, CheckCircle, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { SiteNav } from "../components/SiteNav";
import logo from "../../assets/b2725744d7bb552f20e2a7bcebca16e19b4a014d.png";

interface SearchResult {
  billing_code: string;
  code_description: string;
  payers: number;
  min_rate: number;
  avg_rate: number;
  max_rate: number;
  min_cash: number;
  medicare_allowed: number;
}

interface PayerRate {
  payer_name: string;
  providers: number;
  min_rate: number;
  avg_rate: number;
  max_rate: number;
}

interface HospitalCash {
  hospital_name: string;
  hospital_city: string;
  cash_price: number;
}

interface HcaHospital {
  hospital_name: string;
  min_rate: number;
  max_rate: number;
  payers: number;
}

interface Medicare {
  setting: string;
  allowed: number;
  pays: number;
}

interface ImhHospital {
  hospital_name: string;
  cash_price: number;
  min_charge: number;
  max_charge: number;
}

interface RevereRate {
  specialty: string;
  description: string;
  cash_price: number;
}

interface QuestRate {
  category: string;
  description: string;
  cash_price: number;
}

interface EncompassRate {
  hospital_name: string;
  description: string;
  cash_price: number;
  min_charge: number;
  max_charge: number;
}

interface UtahStateHospitalRate {
  hospital_name: string;
  description: string;
  cash_price: number;
}

interface UofuStudentHealthRate {
  category: string;
  description: string;
  cash_price: number;
}

interface MedicaidFeeRate {
  provider_type: string;
  rate: number;
}

interface CostPlusDrug {
  drug_name: string;
  dosage_form: string;
  min_price: number;
  max_price: number;
  url: string;
}

interface NadacDrug {
  ndc_description: string;
  nadac_per_unit: number;
  unit: string;
  otc: string;
}

interface DrugResults {
  query: string;
  costplus: CostPlusDrug[];
  nadac: NadacDrug[];
}

interface RateDetail {
  billing_code: string;
  description: string;
  payer_rates: PayerRate[];
  hospital_cash: HospitalCash[];
  uofu_hospital: { cash_price: number; min_negotiated: number; max_negotiated: number; payers: number } | null;
  hca_hospitals: HcaHospital[];
  intermountain_hospitals: ImhHospital[];
  ashley_regional: ImhHospital[];
  tanner_clinic: RevereRate[];
  revere_health: RevereRate[];
  quest_health: QuestRate[];
  encompass_health: EncompassRate[];
  utah_state_hospital: UtahStateHospitalRate[];
  uofu_student_health: UofuStudentHealthRate[];
  castleview: ImhHospital[];
  uintah_basin: ImhHospital[];
  mountain_west: ImhHospital[];
  central_valley: ImhHospital[];
  milford: ImhHospital[];
  blue_mountain: ImhHospital[];
  gunnison_valley: ImhHospital[];
  kane_county: ImhHospital[];
  beaver_valley: ImhHospital[];
  wayne_county: ImhHospital[];
  san_juan: ImhHospital[];
  moab_regional: ImhHospital[];
  holy_cross: HospitalCash[];
  ascent_behavioral: RevereRate[];
  ernest_health: EncompassRate[];
  medicaid_fees: MedicaidFeeRate[];
  medicare: Medicare[];
}

function fmt(n: number) {
  if (!n || n === 0) return "—";
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function Utah() {
  const navigate = useNavigate();

  // Real facilities for the "Featured Utah providers" section below, fetched so
  // the figures follow each monthly rebuild. CMS-named only: this section is
  // about recognisable places, and an address is not a feature.
  const [featured, setFeatured] = useState<Facility[]>([]);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const svcs = await searchServices("MRI knee", { limit: 1 });
        if (!svcs.length) return;
        const all = await getFacilities(svcs[0].service_key, { limit: 60 });
        const named = all
          .filter(f => f.name_source === "cms" && f.providers >= 10)
          .sort((a, b) => a.median_price - b.median_price);
        if (!cancelled) setFeatured(named.slice(0, 3));
      } catch {
        if (!cancelled) setFeatured([]);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchMode, setSearchMode] = useState<"procedures" | "medications">("procedures");
  const [expandedCode, setExpandedCode] = useState<string | null>(null);
  const [detail, setDetail] = useState<RateDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [drugResults, setDrugResults] = useState<DrugResults | null>(null);

  const handleSearch = useCallback(async () => {
    const q = query.trim();
    if (!q) return;
    if (searchMode === "medications") {
      setIsSearching(true);
      setHasSearched(true);
      setDrugResults(null);
      try {
        const res = await fetch(`/api/drugs?q=${encodeURIComponent(q)}&limit=20`);
        if (!res.ok) throw new Error(await res.text());
        setDrugResults(await res.json());
      } catch {
        setDrugResults({ query: q, costplus: [], nadac: [] });
      } finally {
        setIsSearching(false);
      }
      return;
    }
    setIsSearching(true);
    setHasSearched(true);
    setExpandedCode(null);
    setDetail(null);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=20`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setResults(data.results ?? []);
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [query, searchMode]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const toggleDetail = useCallback(async (code: string) => {
    if (expandedCode === code) {
      setExpandedCode(null);
      setDetail(null);
      return;
    }
    setExpandedCode(code);
    setIsLoadingDetail(true);
    setDetail(null);
    try {
      const res = await fetch(`/api/rates?code=${encodeURIComponent(code)}`);
      if (!res.ok) throw new Error(await res.text());
      setDetail(await res.json());
    } catch {
      setDetail(null);
    } finally {
      setIsLoadingDetail(false);
    }
  }, [expandedCode]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="relative bg-white border-b border-gray-100 sticky top-0 z-50">
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

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-blue-600 text-white px-4 py-1 text-sm">
              Now serving Utah
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Utah's most trusted healthcare marketplace.
            </h1>
            
            {/* "120+" was invented; the measured figure is 31,271. The booking
                promise is also dropped — there is no scheduling integration, so
                claiming instant booking describes a feature that does not exist. */}
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Compare published prices from 31,620 Utah providers, across 166 procedures.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              {/* Mode Toggle */}
              <div className="flex gap-1 mb-3 bg-gray-100 rounded-lg p-1 w-fit mx-auto">
                <button
                  onClick={() => { setSearchMode("procedures"); setHasSearched(false); setDrugResults(null); }}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${searchMode === "procedures" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                  Procedures &amp; Services
                </button>
                <button
                  onClick={() => { setSearchMode("medications"); setHasSearched(false); setResults([]); }}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${searchMode === "medications" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                  Medications
                </button>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={searchMode === "medications" ? "Search medications... (e.g. metformin, lisinopril, atorvastatin)" : "Find care in Utah... (e.g. knee MRI, blood test, colonoscopy)"}
                    className="pl-12 h-14 text-lg border-2 border-gray-200 bg-white"
                  />
                </div>
                <Button
                  size="lg"
                  onClick={handleSearch}
                  disabled={isSearching || !query.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-14 text-lg disabled:opacity-60"
                >
                  {isSearching ? <Loader2 className="size-5 animate-spin" /> : "Search"}
                </Button>
              </div>
            </div>

            {/* Stats Bar */}
            {/* Measured from the July 2026 serving slice. REFRESH after each
                monthly rebuild. Previous values were "120+ Verified Providers"
                (we price 31,271), "Up to 60% savings" sourced to Duly Health and
                Care — another company's marketing, not a measurement of this
                data — and "14 Cities" (229). */}
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="text-2xl font-bold text-blue-600 mb-1">31,620</div>
                <div className="text-sm text-gray-600">Providers priced</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="text-2xl font-bold text-green-600 mb-1">2.0&times;</div>
                <div className="text-sm text-gray-600 mb-1">price gap, same procedure</div>
                <div className="text-[10px] text-[#9ca3af]">Middle 80% of providers</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="text-2xl font-bold text-purple-600 mb-1">229 Cities</div>
                <div className="text-sm text-gray-600">covered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      {hasSearched && (
        <section className="py-10 bg-gray-50 border-t border-gray-100">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              {isSearching ? (
                <div className="flex items-center justify-center py-16 gap-3 text-gray-500">
                  <Loader2 className="size-5 animate-spin" />
                  <span>{searchMode === "medications" ? "Searching drug database..." : "Searching pricing database..."}</span>
                </div>
              ) : searchMode === "medications" ? (
                drugResults && (drugResults.costplus.length > 0 || drugResults.nadac.length > 0) ? (
                  <div className="space-y-8">
                    {drugResults.costplus.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
                          Cost Plus Drugs — Retail Price
                        </h3>
                        <div className="space-y-2">
                          {drugResults.costplus.map((d, i) => (
                            <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center justify-between gap-4">
                              <div>
                                <p className="font-medium text-gray-900">{d.drug_name}</p>
                                {d.dosage_form && <p className="text-sm text-gray-500 mt-0.5">{d.dosage_form}</p>}
                              </div>
                              <div className="text-right shrink-0">
                                <p className="font-semibold text-green-700">
                                  {d.min_price === d.max_price ? fmt(d.min_price) : `${fmt(d.min_price)}–${fmt(d.max_price)}`}
                                </p>
                                {d.url && (
                                  <a href={d.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                                    View on Cost Plus
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {drugResults.nadac.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
                          NADAC — Pharmacy Acquisition Cost (per unit)
                        </h3>
                        <div className="space-y-2">
                          {drugResults.nadac.map((d, i) => (
                            <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center justify-between gap-4">
                              <div>
                                <p className="font-medium text-gray-900">{d.ndc_description}</p>
                                {d.otc === "Y" && <span className="text-xs text-gray-400">OTC</span>}
                              </div>
                              <div className="text-right shrink-0">
                                <p className="font-semibold text-blue-700">${d.nadac_per_unit.toFixed(4)}</p>
                                <p className="text-xs text-gray-400">per {d.unit || "unit"}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-gray-400 text-center">NADAC = National Average Drug Acquisition Cost (CMS). Actual pharmacy prices may vary.</p>
                  </div>
                ) : (
                  <div className="text-center py-16 text-gray-500">
                    <Search className="size-10 mx-auto mb-3 opacity-30" />
                    <p className="text-lg">No medications found for "{query}"</p>
                    <p className="text-sm mt-1">Try a generic name — e.g. "metformin", "lisinopril", "atorvastatin"</p>
                  </div>
                )
              ) : results.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <Search className="size-10 mx-auto mb-3 opacity-30" />
                  <p className="text-lg">No procedures found for "{query}"</p>
                  <p className="text-sm mt-1">Try a different term — e.g. "MRI", "blood panel", "office visit"</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-500 mb-4">{results.length} procedures found for "{query}"</p>
                  <div className="space-y-3">
                    {results.map((r) => (
                      <div key={r.billing_code} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        {/* Result row */}
                        <div className="flex items-start gap-4 p-5">
                          <div className="shrink-0">
                            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-mono font-semibold px-2 py-1 rounded">
                              {r.billing_code}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 leading-snug">
                              {r.code_description}
                            </p>
                            <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                              {r.payers > 0 && (
                                <span className="flex items-center gap-1">
                                  <Shield className="size-3.5 text-blue-500" />
                                  {r.payers} payers · {fmt(r.min_rate)}–{fmt(r.max_rate)} negotiated
                                </span>
                              )}
                              {r.min_cash > 0 && (
                                <span className="flex items-center gap-1">
                                  <DollarSign className="size-3.5 text-green-500" />
                                  From {fmt(r.min_cash)} cash
                                </span>
                              )}
                              {r.medicare_allowed > 0 && (
                                <span className="flex items-center gap-1 text-gray-400">
                                  Medicare allows {fmt(r.medicare_allowed)}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => toggleDetail(r.billing_code)}
                            className="shrink-0 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {expandedCode === r.billing_code ? (
                              <><ChevronUp className="size-4" /> Hide</>
                            ) : (
                              <><ChevronDown className="size-4" /> Rates</>
                            )}
                          </button>
                        </div>

                        {/* Expanded detail panel */}
                        {expandedCode === r.billing_code && (
                          <div className="border-t border-gray-100 bg-gray-50 p-5">
                            {isLoadingDetail ? (
                              <div className="flex items-center gap-2 text-gray-500 py-4">
                                <Loader2 className="size-4 animate-spin" /> Loading rates...
                              </div>
                            ) : detail ? (
                              <div className="space-y-5">
                                {/* Payer negotiated rates */}
                                {detail.payer_rates.length > 0 && (
                                  <div>
                                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                                      Payer Negotiated Rates
                                    </h4>
                                    <div className="overflow-x-auto">
                                      <table className="w-full text-sm">
                                        <thead>
                                          <tr className="text-left text-gray-400 border-b border-gray-200">
                                            <th className="pb-2 font-medium">Payer</th>
                                            <th className="pb-2 font-medium text-right">Providers</th>
                                            <th className="pb-2 font-medium text-right">Min</th>
                                            <th className="pb-2 font-medium text-right">Avg</th>
                                            <th className="pb-2 font-medium text-right">Max</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {detail.payer_rates.map((p) => (
                                            <tr key={p.payer_name} className="border-b border-gray-100 last:border-0">
                                              <td className="py-1.5 text-gray-800">{p.payer_name}</td>
                                              <td className="py-1.5 text-right text-gray-500">{p.providers.toLocaleString()}</td>
                                              <td className="py-1.5 text-right text-gray-700">{fmt(p.min_rate)}</td>
                                              <td className="py-1.5 text-right font-medium text-gray-900">{fmt(p.avg_rate)}</td>
                                              <td className="py-1.5 text-right text-gray-700">{fmt(p.max_rate)}</td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                )}

                                {/* Hospital cash + UofU + HCA side by side */}
                                <div className="grid md:grid-cols-2 gap-5">
                                  {/* UofU Hospital */}
                                  {detail.uofu_hospital && (
                                    <div>
                                      <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                                        U of U Hospital
                                      </h4>
                                      <div className="bg-white rounded-lg p-3 border border-gray-200 text-sm space-y-1">
                                        {detail.uofu_hospital.cash_price > 0 && (
                                          <div className="flex justify-between">
                                            <span className="text-gray-600">Cash price</span>
                                            <span className="font-semibold text-green-700">{fmt(detail.uofu_hospital.cash_price)}</span>
                                          </div>
                                        )}
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">Negotiated range</span>
                                          <span className="text-gray-800">{fmt(detail.uofu_hospital.min_negotiated)}–{fmt(detail.uofu_hospital.max_negotiated)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">Payers</span>
                                          <span className="text-gray-600">{detail.uofu_hospital.payers}</span>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* HCA hospitals */}
                                  {detail.hca_hospitals.length > 0 && (
                                    <div>
                                      <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                                        HCA/MountainStar Hospitals
                                      </h4>
                                      <div className="space-y-1">
                                        {detail.hca_hospitals.map((h) => (
                                          <div key={h.hospital_name} className="bg-white rounded-lg px-3 py-2 border border-gray-200 text-sm flex justify-between">
                                            <span className="text-gray-700 truncate mr-2">{h.hospital_name}</span>
                                            <span className="shrink-0 text-gray-600">{fmt(h.min_rate)}–{fmt(h.max_rate)}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Intermountain hospitals */}
                                {detail.intermountain_hospitals?.length > 0 && (
                                  <div>
                                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                                      Intermountain Health Hospitals
                                    </h4>
                                    <div className="grid sm:grid-cols-2 gap-1">
                                      {detail.intermountain_hospitals.map((h) => (
                                        <div key={h.hospital_name} className="bg-white rounded-lg px-3 py-2 border border-gray-200 text-sm flex justify-between">
                                          <span className="text-gray-700 truncate mr-2">{h.hospital_name}</span>
                                          <span className="shrink-0 text-gray-600">
                                            {h.cash_price > 0 ? fmt(h.cash_price) : `${fmt(h.min_charge)}–${fmt(h.max_charge)}`}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Ashley Regional Medical Center */}
                                {detail.ashley_regional?.length > 0 && (
                                  <div>
                                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                                      Ashley Regional Medical Center (Vernal)
                                    </h4>
                                    <div className="grid sm:grid-cols-2 gap-1">
                                      {detail.ashley_regional.map((h) => (
                                        <div key={h.hospital_name} className="bg-white rounded-lg px-3 py-2 border border-gray-200 text-sm flex justify-between">
                                          <span className="text-gray-700 truncate mr-2">{h.hospital_name}</span>
                                          <span className="shrink-0 text-gray-600">
                                            {h.cash_price > 0 ? fmt(h.cash_price) : `${fmt(h.min_charge)}–${fmt(h.max_charge)}`}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Tanner Clinic */}
                                {detail.tanner_clinic?.length > 0 && (
                                  <div>
                                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                                      Tanner Clinic (Northern Utah)
                                    </h4>
                                    <div className="grid sm:grid-cols-2 gap-1">
                                      {detail.tanner_clinic.map((r, i) => (
                                        <div key={i} className="bg-white rounded-lg px-3 py-2 border border-gray-200 text-sm flex justify-between">
                                          <span className="text-gray-700 truncate mr-2">{r.description}</span>
                                          <span className="shrink-0 font-medium text-gray-800">{fmt(r.cash_price)}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Revere Health clinic prices */}
                                {detail.revere_health?.length > 0 && (
                                  <div>
                                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                                      Revere Health (Clinic Cash Price)
                                    </h4>
                                    <div className="grid sm:grid-cols-2 gap-1">
                                      {detail.revere_health.map((r, i) => (
                                        <div key={i} className="bg-white rounded-lg px-3 py-2 border border-gray-200 text-sm flex justify-between">
                                          <span className="text-gray-700 truncate mr-2">{r.specialty}</span>
                                          <span className="shrink-0 font-medium text-gray-800">{fmt(r.cash_price)}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Quest Health direct-to-consumer lab prices */}
                                {detail.quest_health?.length > 0 && (
                                  <div>
                                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                                      Quest Health (Direct-Pay Lab Price)
                                    </h4>
                                    <div className="grid sm:grid-cols-2 gap-1">
                                      {detail.quest_health.map((r, i) => (
                                        <div key={i} className="bg-white rounded-lg px-3 py-2 border border-gray-200 text-sm flex justify-between">
                                          <span className="text-gray-700 truncate mr-2">{r.description}</span>
                                          <span className="shrink-0 font-medium text-gray-800">{fmt(r.cash_price)}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Encompass Health Rehab Hospital */}
                                {detail.encompass_health?.length > 0 && (
                                  <div>
                                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                                      Encompass Health Rehab Hospital – Sandy
                                    </h4>
                                    <div className="grid sm:grid-cols-2 gap-1">
                                      {detail.encompass_health.map((r, i) => (
                                        <div key={i} className="bg-white rounded-lg px-3 py-2 border border-gray-200 text-sm flex justify-between">
                                          <span className="text-gray-700 truncate mr-2">{r.description}</span>
                                          <span className="shrink-0 font-medium text-gray-800">{fmt(r.cash_price)}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Castleview Hospital */}
                                {detail.castleview?.length > 0 && (
                                  <div>
                                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                                      Castleview Hospital (Price, UT)
                                    </h4>
                                    <div className="grid sm:grid-cols-2 gap-1">
                                      {detail.castleview.map((h, i) => (
                                        <div key={i} className="bg-white rounded-lg px-3 py-2 border border-gray-200 text-sm flex justify-between">
                                          <span className="text-gray-700 truncate mr-2">{h.hospital_name}</span>
                                          <span className="shrink-0 text-gray-600">
                                            {h.cash_price > 0 ? fmt(h.cash_price) : `${fmt(h.min_charge)}–${fmt(h.max_charge)}`}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* UofU Student Health Center */}
                                {detail.uofu_student_health?.length > 0 && (
                                  <div>
                                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                                      U of U Student Health Center
                                    </h4>
                                    <div className="grid sm:grid-cols-2 gap-1">
                                      {detail.uofu_student_health.map((r, i) => (
                                        <div key={i} className="bg-white rounded-lg px-3 py-2 border border-gray-200 text-sm flex justify-between">
                                          <span className="text-gray-700 truncate mr-2">{r.description}</span>
                                          <span className="shrink-0 font-medium text-gray-800">{fmt(r.cash_price)}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Uintah Basin Medical Center */}
                                {detail.uintah_basin?.length > 0 && (
                                  <div>
                                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                                      Uintah Basin Medical Center (Roosevelt, UT)
                                    </h4>
                                    <div className="grid sm:grid-cols-2 gap-1">
                                      {detail.uintah_basin.map((h, i) => (
                                        <div key={i} className="bg-white rounded-lg px-3 py-2 border border-gray-200 text-sm flex justify-between">
                                          <span className="text-gray-700 truncate mr-2">{h.description || h.hospital_name}</span>
                                          <span className="shrink-0 text-gray-600">
                                            {h.cash_price > 0 ? fmt(h.cash_price) : `${fmt(h.min_charge)}–${fmt(h.max_charge)}`}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Mountain West Medical Center */}
                                {detail.mountain_west?.length > 0 && (
                                  <div>
                                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                                      Mountain West Medical Center (Tooele, UT)
                                    </h4>
                                    <div className="grid sm:grid-cols-2 gap-1">
                                      {detail.mountain_west.map((h, i) => (
                                        <div key={i} className="bg-white rounded-lg px-3 py-2 border border-gray-200 text-sm flex justify-between">
                                          <span className="text-gray-700 truncate mr-2">{h.description || h.hospital_name}</span>
                                          <span className="shrink-0 text-gray-600">
                                            {h.cash_price > 0 ? fmt(h.cash_price) : `${fmt(h.min_charge)}–${fmt(h.max_charge)}`}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Utah State Hospital (behavioral health) */}
                                {detail.utah_state_hospital?.length > 0 && (
                                  <div>
                                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                                      Utah State Hospital (Behavioral Health – Provo)
                                    </h4>
                                    <div className="grid sm:grid-cols-2 gap-1">
                                      {detail.utah_state_hospital.map((r, i) => (
                                        <div key={i} className="bg-white rounded-lg px-3 py-2 border border-gray-200 text-sm flex justify-between">
                                          <span className="text-gray-700 truncate mr-2">{r.description}</span>
                                          <span className="shrink-0 font-medium text-gray-800">{fmt(r.cash_price)}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Utah Medicaid fee schedule */}
                                {detail.medicaid_fees?.length > 0 && (
                                  <div>
                                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                                      Utah Medicaid Rates
                                    </h4>
                                    <div className="flex flex-wrap gap-3">
                                      {detail.medicaid_fees.map((m, i) => (
                                        <div key={i} className="bg-white rounded-lg px-4 py-2 border border-gray-200 text-sm">
                                          <span className="text-gray-500">{m.provider_type}: </span>
                                          <span className="font-medium">{fmt(m.rate)}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Medicare reference */}
                                {detail.medicare.length > 0 && (
                                  <div>
                                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                                      Medicare Reference (2024)
                                    </h4>
                                    <div className="flex flex-wrap gap-3">
                                      {detail.medicare.map((m) => (
                                        <div key={m.setting} className="bg-white rounded-lg px-4 py-2 border border-gray-200 text-sm">
                                          <span className="text-gray-500">{m.setting}: </span>
                                          <span className="font-medium">allows {fmt(m.allowed)}</span>
                                          {m.pays > 0 && <span className="text-gray-400">, pays {fmt(m.pays)}</span>}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Central Valley Medical Center */}
                                {detail.central_valley?.length > 0 && (
                                  <div>
                                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                                      Central Valley Medical Center (Nephi, UT)
                                    </h4>
                                    <div className="grid sm:grid-cols-2 gap-1">
                                      {detail.central_valley.map((h, i) => (
                                        <div key={i} className="bg-white rounded-lg px-3 py-2 border border-gray-200 text-sm flex justify-between">
                                          <span className="text-gray-700 truncate mr-2">{h.description || h.hospital_name}</span>
                                          <span className="shrink-0 text-gray-600">
                                            {h.cash_price > 0 ? fmt(h.cash_price) : `${fmt(h.min_charge)}–${fmt(h.max_charge)}`}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Milford Valley Memorial Hospital */}
                                {detail.milford?.length > 0 && (
                                  <div>
                                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                                      Milford Valley Memorial Hospital (Milford, UT)
                                    </h4>
                                    <div className="grid sm:grid-cols-2 gap-1">
                                      {detail.milford.map((h, i) => (
                                        <div key={i} className="bg-white rounded-lg px-3 py-2 border border-gray-200 text-sm flex justify-between">
                                          <span className="text-gray-700 truncate mr-2">{h.description || h.hospital_name}</span>
                                          <span className="shrink-0 text-gray-600">
                                            {h.cash_price > 0 ? fmt(h.cash_price) : `${fmt(h.min_charge)}–${fmt(h.max_charge)}`}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Blue Mountain Hospital */}
                                {detail.blue_mountain?.length > 0 && (
                                  <div>
                                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                                      Blue Mountain Hospital (Blanding, UT)
                                    </h4>
                                    <div className="grid sm:grid-cols-2 gap-1">
                                      {detail.blue_mountain.map((h, i) => (
                                        <div key={i} className="bg-white rounded-lg px-3 py-2 border border-gray-200 text-sm flex justify-between">
                                          <span className="text-gray-700 truncate mr-2">{h.description || h.hospital_name}</span>
                                          <span className="shrink-0 text-gray-600">
                                            {h.cash_price > 0 ? fmt(h.cash_price) : `${fmt(h.min_charge)}–${fmt(h.max_charge)}`}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Gunnison Valley Hospital */}
                                {detail.gunnison_valley?.length > 0 && (
                                  <div>
                                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                                      Gunnison Valley Hospital (Gunnison, UT)
                                    </h4>
                                    <div className="grid sm:grid-cols-2 gap-1">
                                      {detail.gunnison_valley.map((h, i) => (
                                        <div key={i} className="bg-white rounded-lg px-3 py-2 border border-gray-200 text-sm flex justify-between">
                                          <span className="text-gray-700 truncate mr-2">{h.description || h.hospital_name}</span>
                                          <span className="shrink-0 text-gray-600">
                                            {h.cash_price > 0 ? fmt(h.cash_price) : `${fmt(h.min_charge)}–${fmt(h.max_charge)}`}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Kane County Hospital */}
                                {detail.kane_county?.length > 0 && (
                                  <div>
                                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                                      Kane County Hospital (Kanab, UT)
                                    </h4>
                                    <div className="grid sm:grid-cols-2 gap-1">
                                      {detail.kane_county.map((h, i) => (
                                        <div key={i} className="bg-white rounded-lg px-3 py-2 border border-gray-200 text-sm flex justify-between">
                                          <span className="text-gray-700 truncate mr-2">{h.description || h.hospital_name}</span>
                                          <span className="shrink-0 text-gray-600">
                                            {h.cash_price > 0 ? fmt(h.cash_price) : `${fmt(h.min_charge)}–${fmt(h.max_charge)}`}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Beaver Valley Hospital */}
                                {detail.beaver_valley?.length > 0 && (
                                  <div>
                                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                                      Beaver Valley Hospital (Beaver, UT)
                                    </h4>
                                    <div className="grid sm:grid-cols-2 gap-1">
                                      {detail.beaver_valley.map((h, i) => (
                                        <div key={i} className="bg-white rounded-lg px-3 py-2 border border-gray-200 text-sm flex justify-between">
                                          <span className="text-gray-700 truncate mr-2">{h.description || h.hospital_name}</span>
                                          <span className="shrink-0 text-gray-600">
                                            {h.cash_price > 0 ? fmt(h.cash_price) : `${fmt(h.min_charge)}–${fmt(h.max_charge)}`}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Wayne County Hospital */}
                                {detail.wayne_county?.length > 0 && (
                                  <div>
                                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                                      Wayne County Hospital (Loa, UT)
                                    </h4>
                                    <div className="grid sm:grid-cols-2 gap-1">
                                      {detail.wayne_county.map((h, i) => (
                                        <div key={i} className="bg-white rounded-lg px-3 py-2 border border-gray-200 text-sm flex justify-between">
                                          <span className="text-gray-700 truncate mr-2">{h.description || h.hospital_name}</span>
                                          <span className="shrink-0 text-gray-600">
                                            {h.cash_price > 0 ? fmt(h.cash_price) : `${fmt(h.min_charge)}–${fmt(h.max_charge)}`}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* San Juan Hospital */}
                                {detail.san_juan?.length > 0 && (
                                  <div>
                                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                                      San Juan Hospital (Monticello, UT)
                                    </h4>
                                    <div className="grid sm:grid-cols-2 gap-1">
                                      {detail.san_juan.map((h, i) => (
                                        <div key={i} className="bg-white rounded-lg px-3 py-2 border border-gray-200 text-sm flex justify-between">
                                          <span className="text-gray-700 truncate mr-2">{h.description || h.hospital_name}</span>
                                          <span className="shrink-0 text-gray-600">
                                            {h.cash_price > 0 ? fmt(h.cash_price) : `${fmt(h.min_charge)}–${fmt(h.max_charge)}`}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Moab Regional Hospital */}
                                {detail.moab_regional?.length > 0 && (
                                  <div>
                                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                                      Moab Regional Hospital (Moab, UT)
                                    </h4>
                                    <div className="grid sm:grid-cols-2 gap-1">
                                      {detail.moab_regional.map((h, i) => (
                                        <div key={i} className="bg-white rounded-lg px-3 py-2 border border-gray-200 text-sm flex justify-between">
                                          <span className="text-gray-700 truncate mr-2">{h.description || h.hospital_name}</span>
                                          <span className="shrink-0 text-gray-600">
                                            {h.cash_price > 0 ? fmt(h.cash_price) : `${fmt(h.min_charge)}–${fmt(h.max_charge)}`}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Holy Cross Hospitals (CommonSpirit) */}
                                {detail.holy_cross?.length > 0 && (
                                  <div>
                                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                                      Holy Cross Hospitals (CommonSpirit)
                                    </h4>
                                    <div className="grid sm:grid-cols-2 gap-1">
                                      {detail.holy_cross.map((h, i) => (
                                        <div key={i} className="bg-white rounded-lg px-3 py-2 border border-gray-200 text-sm flex justify-between">
                                          <span className="text-gray-700 truncate mr-2">{h.hospital_name}</span>
                                          <span className="shrink-0 font-medium text-gray-800">{fmt(h.cash_price)}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Ascent Behavioral Hospital */}
                                {detail.ascent_behavioral?.length > 0 && (
                                  <div>
                                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                                      Ascent Behavioral Hospital (Millcreek, UT)
                                    </h4>
                                    <div className="grid sm:grid-cols-2 gap-1">
                                      {detail.ascent_behavioral.map((r, i) => (
                                        <div key={i} className="bg-white rounded-lg px-3 py-2 border border-gray-200 text-sm flex justify-between">
                                          <span className="text-gray-700 truncate mr-2">{r.description}</span>
                                          <span className="shrink-0 font-medium text-gray-800">{fmt(r.cash_price)}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Northern Utah Rehab / Utah Valley Specialty (Ernest Health) */}
                                {detail.ernest_health?.length > 0 && (
                                  <div>
                                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                                      Ernest Health Hospitals (Ogden &amp; Provo)
                                    </h4>
                                    <div className="grid sm:grid-cols-2 gap-1">
                                      {detail.ernest_health.map((r, i) => (
                                        <div key={i} className="bg-white rounded-lg px-3 py-2 border border-gray-200 text-sm flex justify-between">
                                          <span className="text-gray-700 truncate mr-2">{r.hospital_name}</span>
                                          <span className="shrink-0 text-gray-600">{fmt(r.cash_price)}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {detail.payer_rates.length === 0 && !detail.uofu_hospital && detail.hca_hospitals.length === 0 && !detail.intermountain_hospitals?.length && !detail.revere_health?.length && !detail.ashley_regional?.length && !detail.tanner_clinic?.length && !detail.quest_health?.length && !detail.encompass_health?.length && !detail.utah_state_hospital?.length && !detail.uofu_student_health?.length && !detail.castleview?.length && !detail.uintah_basin?.length && !detail.mountain_west?.length && !detail.central_valley?.length && !detail.milford?.length && !detail.blue_mountain?.length && !detail.gunnison_valley?.length && !detail.kane_county?.length && !detail.beaver_valley?.length && !detail.wayne_county?.length && !detail.san_juan?.length && !detail.moab_regional?.length && !detail.holy_cross?.length && !detail.ascent_behavioral?.length && !detail.ernest_health?.length && (
                                  <p className="text-sm text-gray-400 py-2">No rate data found for this code yet.</p>
                                )}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-400 py-2">Could not load rates — is the API running?</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Utah Care Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Browse Utah care by type
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Category 1 */}
              <Card
                onClick={() => navigate(`/prices?category=${encodeURIComponent("Primary care")}`)}
                className="bg-white border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Stethoscope className="size-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Primary Care</h3>
                </CardContent>
              </Card>

              {/* Category 2 */}
              <Card
                onClick={() => navigate(`/prices?category=${encodeURIComponent("Imaging")}`)}
                className="bg-white border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="size-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Imaging & Radiology</h3>
                </CardContent>
              </Card>

              {/* Category 3 — no "Orthopedics" backend category (splits
                  across Imaging and Procedure), so this uses the curated
                  ORTHOPEDICS_KEYS list instead. */}
              <Card
                onClick={() => navigate(`/prices?keys=${encodeURIComponent(ORTHOPEDICS_KEYS.join(","))}`)}
                className="bg-white border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bone className="size-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Orthopedics</h3>
                </CardContent>
              </Card>

              {/* Category 4 */}
              <Card
                onClick={() => navigate(`/prices?category=${encodeURIComponent("Dental")}`)}
                className="bg-white border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Smile className="size-8 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Dental</h3>
                </CardContent>
              </Card>

              {/* Category 5 */}
              <Card
                onClick={() => navigate(`/prices?category=${encodeURIComponent("Vision")}`)}
                className="bg-white border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="size-8 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Vision</h3>
                </CardContent>
              </Card>

              {/* Category 6 */}
              <Card
                onClick={() => navigate(`/prices?keys=${encodeURIComponent(ELECTIVE_SURGERY_KEYS.join(","))}`)}
                className="bg-white border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="size-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Elective Surgery</h3>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Utah Providers */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Featured Utah providers
            </h2>

            {/* Live facilities from the serving API. Replaces three invented
                providers - "Utah Imaging Associates" 4.9 (127 reviews) at $387,
                "Wasatch Orthopedic Clinic", "Mountain West Dental" - none of
                which exist, none of whose prices were real, each with a
                "Book Now" button that did nothing.

                Star ratings here are CMS overall ratings and appear only where
                CMS publishes one. There are no review counts and no booking:
                we have no source for reviews and no scheduling integration. */}
            {featured.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-8">
                {featured.map(f => (
                  <Card
                    key={`${f.address}|${f.city}`}
                    className="bg-white border-2 border-gray-200 hover:shadow-xl transition-shadow"
                  >
                    <CardHeader>
                      <CardTitle className="text-xl mb-2">{facilityLabel(f)}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <MapPin className="size-4" />
                        <span>
                          {f.city.toLowerCase().replace(/\b[a-z]/g, c => c.toUpperCase())}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        {f.providers} providers billing here
                      </div>
                      {f.rating && /^\d$/.test(f.rating) && (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="size-5 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold text-lg">{f.rating}/5</span>
                          </div>
                          <span className="text-sm text-gray-600">CMS rating</span>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                          {formatPrice(f.median_price)}
                        </div>
                        <div className="text-sm text-gray-500">
                          median knee MRI &middot; {formatPrice(f.low_price)}&ndash;{formatPrice(f.high_price)}
                        </div>
                      </div>
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => navigate("/prices?q=MRI+knee")}
                      >
                        Compare prices
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                Published prices are loading&hellip;
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Why Utah Section */}
      <section className="py-16 bg-[#0f172a] text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">
              Built for Utah patients.
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Column 1 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="size-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Price transparency</h3>
                <p className="text-gray-300">
                  Utah providers publish real prices on Starkwell.
                </p>
              </div>

              {/* Column 2 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="size-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Self-pay friendly</h3>
                <p className="text-gray-300">
                  No insurance needed. Browse, compare, book.
                </p>
              </div>

              {/* Column 3 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="size-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Utah-verified</h3>
                <p className="text-gray-300">
                  Every provider is licensed and verified in the state of Utah.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Ready to find affordable care in Utah?
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg"
                onClick={() => navigate("/signup-consumer")}
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8"
              >
                Find Care Near You
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate("/signup-provider")}
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-lg px-8"
              >
                List Your Utah Practice
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-6 gap-8 mb-8">
            <div>
              <img 
                src={logo} 
                alt="Starkwell" 
                className="h-8 mb-4"
              />
              <p className="text-sm text-gray-600">
                Your AI-powered healthcare marketplace for finding care, comparing prices, and booking appointments.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">For Patients</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Find a Doctor</a></li>
                <li><a href="#" className="hover:text-blue-600">Compare Prices</a></li>
                <li><button onClick={() => navigate("/prices")} className="hover:text-blue-600">Compare Prices</button></li>
                <li><button onClick={() => navigate("/subscription-tiers")} className="hover:text-blue-600">Subscription Tiers</button></li>
                <li><a href="#" className="hover:text-blue-600">Patient Resources</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">For Providers</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Join Starkwell</a></li>
                <li><a href="#" className="hover:text-blue-600">Provider Portal</a></li>
                <li><a href="#" className="hover:text-blue-600">Resources</a></li>
                <li><a href="#" className="hover:text-blue-600">Contact Sales</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Locations</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><button onClick={() => navigate("/utah")} className="hover:text-blue-600">Utah Hub</button></li>
                <li><a href="#" className="hover:text-blue-600 text-gray-400">Coming Soon: Arizona</a></li>
                <li><a href="#" className="hover:text-blue-600 text-gray-400">Coming Soon: Nevada</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><button onClick={() => navigate("/about")} className="hover:text-blue-600">About</button></li>
                <li><button onClick={() => navigate("/trust")} className="hover:text-blue-600">Trust & Safety</button></li>
                <li><a href="#" className="hover:text-blue-600">Careers</a></li>
                <li><a href="#" className="hover:text-blue-600">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/privacy" className="hover:text-blue-600">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-blue-600">Terms of Service</a></li>
                <li><a href="/hipaa-privacy" className="hover:text-blue-600">HIPAA Notice</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-600">
                © 2026 Starkwell. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm text-gray-600">
                <a href="/privacy" className="hover:text-blue-600">Privacy</a>
                <a href="/terms" className="hover:text-blue-600">Terms</a>
                <a href="/hipaa-privacy" className="hover:text-blue-600">HIPAA</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}