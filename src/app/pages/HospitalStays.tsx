import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { Search, ArrowLeft, Building2, Info, Star, BadgeCheck } from "lucide-react";
import { SiteNav } from "../components/SiteNav";
import logo from "../../assets/b2725744d7bb552f20e2a7bcebca16e19b4a014d.png";
import {
  searchHospitalStays, getHospitalStay, formatPrice,
  type HospitalStaySummary, type HospitalStayDetail,
} from "../../lib/starkwell";

// Hand-picked, not algorithmically derived (e.g. "most facilities") — the
// goal is broad, recognizable starting points for someone who doesn't know
// DRG terminology, same reasoning as PriceSearch's POPULAR_SEARCHES. `query`
// is a verified-to-match substring against drg_desc/search_terms (see
// drg_search_terms.py); `label` is the friendly text shown on the chip,
// since a DRG has no single "display_name" the way a shoppable service does.
const POPULAR_STAYS = [
  { label: "Having a baby (vaginal delivery)", query: "having a baby" },
  { label: "C-section", query: "c-section" },
  { label: "Hip replacement", query: "hip replacement" },
  { label: "Knee replacement", query: "knee replacement" },
  { label: "Gallbladder removal", query: "gallbladder removal" },
  { label: "Heart attack", query: "heart attack" },
  { label: "Stroke", query: "stroke" },
  { label: "Pneumonia", query: "pneumonia" },
];

/**
 * "How much will my whole hospital stay cost?" — a whole-stay bundle
 * (MS-DRG), not one line item. Real negotiated commercial rates from the
 * same insurer files as the rest of the site; see build_hospital_stays.py
 * for exactly how these were validated and why the list is restricted to
 * DRGs with a real, verified plain-language name.
 */
export function HospitalStays() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<HospitalStaySummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<HospitalStaySummary | null>(null);
  const [detail, setDetail] = useState<HospitalStayDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // 766 real stay types is a real dataset, not a browsable list — no one
  // visits this page to scroll past all of them. Only fetch once there's
  // an actual query; an empty query shows the popular-search chips instead
  // of dumping every result (sorted by facility count, so childbirth-
  // related stays would dominate every first impression of this page).
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!query.trim()) { setResults([]); setHasSearched(false); setLoading(false); return; }
    let cancelled = false;
    setLoading(true);
    setError(null);
    searchHospitalStays(query.trim())
      .then(r => { if (!cancelled) setResults(r); })
      .catch(() => { if (!cancelled) setError("Couldn't load hospital stay data — try again."); })
      .finally(() => { if (!cancelled) { setLoading(false); setHasSearched(true); } });
    return () => { cancelled = true; };
  }, [query]);

  useEffect(() => {
    if (!selected) { setDetail(null); return; }
    let cancelled = false;
    setDetailLoading(true);
    getHospitalStay(selected.drg_code)
      .then(d => { if (!cancelled) setDetail(d); })
      .catch(() => { if (!cancelled) setDetail(null); })
      .finally(() => { if (!cancelled) setDetailLoading(false); });
    return () => { cancelled = true; };
  }, [selected]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="relative bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-2">
          <div className="flex items-center justify-between">
            <img
              src={logo}
              alt="Starkwell"
              className="h-9 md:h-12 cursor-pointer rounded-[5px]"
              onClick={() => navigate("/")}
            />
            <SiteNav />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-5xl">
        {!selected ? (
          <>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
              How much will my whole hospital stay cost?
            </h1>
            <p className="text-gray-600 mb-6">
              Real negotiated rates for the whole stay — not just one test or procedure — compared across Utah hospitals.
            </p>

            <Card className="shadow-xl border-gray-200 max-w-2xl mb-6">
              <CardContent className="p-2 rounded-[5px] bg-[#cbcbcb]">
                <div className="relative">
                  <Label htmlFor="stay-search" className="sr-only">Reason for a hospital stay</Label>
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-500" />
                  <Input
                    id="stay-search"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="C-section, hip replacement, gallbladder removal…"
                    className="pl-12 h-14 border-0 focus-visible:ring-0 text-base bg-white rounded-[3px]"
                  />
                </div>
              </CardContent>
            </Card>

            {!query.trim() && (
              <div className="flex flex-wrap gap-2 mb-6 max-w-2xl">
                <span className="text-sm text-gray-500 w-full mb-1">Not sure what to search for? Try one of these:</span>
                {POPULAR_STAYS.map(s => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => setQuery(s.query)}
                    className="text-sm px-3 py-1.5 rounded-full border border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:text-blue-600 transition-colors"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3 max-w-2xl">
              <Info className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-900">
                These are real negotiated rates from insurers' own published files, the same as every other price on Starkwell —
                not a Medicare estimate. Your own plan will negotiate its own rate, so treat this as a strong real-world reference, not a guaranteed bill.
              </p>
            </div>

            {error && <p className="text-red-700 mb-4">{error}</p>}

            {loading && (
              <div className="grid gap-3 sm:grid-cols-2 max-w-4xl">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-lg" />
                ))}
              </div>
            )}

            {!loading && hasSearched && results.length === 0 && (
              <p className="text-gray-500">No matches — try fewer or different words.</p>
            )}

            {!loading && results.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2 max-w-4xl">
                {results.map(r => (
                  <button
                    key={r.drg_code}
                    type="button"
                    onClick={() => setSelected(r)}
                    className="text-left bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-md transition-shadow"
                  >
                    <p className="font-medium text-gray-900 mb-1">{r.friendly_name}</p>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{r.facility_count} Utah hospitals</span>
                      <span className="font-semibold text-gray-900">{formatPrice(r.statewide_median_rate)}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <Button variant="ghost" className="mb-4 -ml-3" onClick={() => setSelected(null)}>
              <ArrowLeft className="mr-2 size-4" />
              All hospital stays
            </Button>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {selected.friendly_name}
            </h1>

            {detailLoading ? (
              <div className="space-y-3 max-w-3xl">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
              </div>
            ) : !detail ? (
              <p className="text-gray-500">Couldn't load this comparison — try again.</p>
            ) : (
              <>
                <p className="text-gray-600 mb-4">
                  {detail.facility_count} Utah hospitals with real rate data, cheapest first.
                </p>

                <div className="mb-4 flex items-start gap-2 rounded-md border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900 max-w-3xl">
                  <Info className="h-4 w-4 mt-0.5 shrink-0" />
                  <p>
                    A hospital having a rate on file for this stay means it's <em>in network</em>{" "}
                    for it — not a guarantee it's a facility that regularly performs it. Cross-check
                    with the hospital directly for anything specialized.
                  </p>
                </div>

                {detail.medicare_avg_paid != null && (
                  <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 mb-6 max-w-3xl">
                    <p className="text-sm text-gray-700">
                      <strong>Utah Medicare average paid for this stay: {formatPrice(detail.medicare_avg_paid)}</strong>
                      {" "}— a statewide reference point across all Utah hospitals, not this specific one. Useful for a
                      general sense of scale, not a substitute for the real rates below.
                    </p>
                  </div>
                )}

                <div className="space-y-3 max-w-3xl">
                  {detail.facilities.map(f => (
                    <Card key={f.npi}>
                      <CardContent className="p-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <Building2 className="size-5 text-blue-600 flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="font-medium text-gray-900 truncate">{f.facility_name}</p>
                              {f.cms_verified && (
                                <BadgeCheck className="size-4 text-blue-500 flex-shrink-0" aria-label="CMS-verified hospital" />
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{f.city}</p>
                            {f.cms_verified && (f.overall_rating || f.patient_star != null) && (
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                {f.overall_rating && (
                                  <span className="inline-flex items-center gap-0.5 text-xs text-gray-600">
                                    <Star className="size-3.5 fill-amber-400 text-amber-400" />
                                    {f.overall_rating}/5 CMS rating
                                  </span>
                                )}
                                {f.patient_star != null && (
                                  <span className="text-xs text-gray-500">
                                    · {f.patient_star}/5 patient experience
                                  </span>
                                )}
                                {f.birthing_friendly && (
                                  <Badge variant="outline" className="text-xs border-pink-200 text-pink-700 bg-pink-50">
                                    Birthing friendly
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-lg font-semibold text-gray-900">{formatPrice(f.median_rate)}</p>
                          {f.low_rate !== f.high_rate && (
                            <p className="text-xs text-gray-500">
                              {formatPrice(f.low_rate)}–{formatPrice(f.high_rate)} range
                            </p>
                          )}
                          {f.n_observations > 1 && (
                            <Badge variant="outline" className="mt-1 text-xs">
                              {f.n_observations} rates on file
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
