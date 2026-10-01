import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Skeleton } from "../components/ui/skeleton";
import { Search, ArrowLeft, ExternalLink, AlertTriangle } from "lucide-react";
import { SiteNav } from "../components/SiteNav";
import logo from "../../assets/b2725744d7bb552f20e2a7bcebca16e19b4a014d.png";
import {
  searchDrugs, getDrug, formatPrice,
  type DrugSummary, type DrugDetail,
} from "../../lib/starkwell";

// Hand-picked common generics, verified to return real results from Cost
// Plus Drugs' own catalog before shipping — same reasoning as every other
// popular-search chip list on the site.
const POPULAR_DRUGS = [
  { label: "Atorvastatin (cholesterol)", query: "atorvastatin" },
  { label: "Lisinopril (blood pressure)", query: "lisinopril" },
  { label: "Metformin (diabetes)", query: "metformin" },
  { label: "Levothyroxine (thyroid)", query: "levothyroxine" },
  { label: "Amoxicillin (antibiotic)", query: "amoxicillin" },
  { label: "Albuterol (inhaler)", query: "albuterol" },
  { label: "Omeprazole (acid reflux)", query: "omeprazole" },
  { label: "Sertraline (antidepressant)", query: "sertraline" },
];

/**
 * NOT a Utah pharmacy price comparison — deliberately. The commercial
 * insurer files that power every other price on this site were checked and
 * have zero real pharmacies billing in them (medical claims data, not
 * pharmacy-benefit claims; see serving_api.py's DRUG_PRICES comment for the
 * full explanation). This instead surfaces Cost Plus Drugs' own published
 * mail-order cash prices — real and verifiable, but ONE specific online
 * pharmacy, not a market comparison. The disclosure below is load-bearing,
 * not boilerplate: without it this page would look exactly like
 * PriceSearch/HospitalStays and imply something this data can't support.
 */
export function DrugPrices() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DrugSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<DrugSummary | null>(null);
  const [detail, setDetail] = useState<DrugDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!query.trim()) { setResults([]); setHasSearched(false); setLoading(false); return; }
    let cancelled = false;
    setLoading(true);
    setError(null);
    searchDrugs(query.trim())
      .then(r => { if (!cancelled) setResults(r); })
      .catch(() => { if (!cancelled) setError("Couldn't load price data — try again."); })
      .finally(() => { if (!cancelled) { setLoading(false); setHasSearched(true); } });
    return () => { cancelled = true; };
  }, [query]);

  useEffect(() => {
    if (!selected) { setDetail(null); return; }
    let cancelled = false;
    setDetailLoading(true);
    getDrug(selected.drug_name)
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
              What does Cost Plus Drugs charge?
            </h1>
            <p className="text-gray-600 mb-6">
              One specific online pharmacy's real, published mail-order prices — not a Utah pharmacy comparison.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3 max-w-2xl">
              <AlertTriangle className="size-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-900">
                <strong>This is not a Utah pharmacy comparison.</strong> Every other price on Starkwell compares
                real local options. This page is different: it's the real, current cash price from one specific
                mail-order pharmacy, Cost Plus Drugs — not what your insurance would charge, not what a Utah
                pharmacy counter would quote you, and not compared against anything else. It's here because it's
                often dramatically cheaper than a retail copay, not because it's "the" price for this drug.
              </p>
            </div>

            <Card className="shadow-xl border-gray-200 max-w-2xl mb-6">
              <CardContent className="p-2 rounded-[5px] bg-[#cbcbcb]">
                <div className="relative">
                  <Label htmlFor="drug-search" className="sr-only">Drug name</Label>
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-500" />
                  <Input
                    id="drug-search"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Lisinopril, metformin, albuterol…"
                    className="pl-12 h-14 border-0 focus-visible:ring-0 text-base bg-white rounded-[3px]"
                  />
                </div>
              </CardContent>
            </Card>

            {!query.trim() && (
              <div className="flex flex-wrap gap-2 mb-6 max-w-2xl">
                <span className="text-sm text-gray-500 w-full mb-1">Not sure what to search for? Try one of these:</span>
                {POPULAR_DRUGS.map(s => (
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

            {error && <p className="text-red-700 mb-4">{error}</p>}

            {loading && (
              <div className="grid gap-3 sm:grid-cols-2 max-w-4xl">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 rounded-lg" />
                ))}
              </div>
            )}

            {!loading && hasSearched && results.length === 0 && (
              <p className="text-gray-500">
                No matches at Cost Plus Drugs — try the generic name, or this specific drug may not be in their catalog.
              </p>
            )}

            {!loading && results.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2 max-w-4xl">
                {results.map(r => (
                  <button
                    key={r.drug_name}
                    type="button"
                    onClick={() => setSelected(r)}
                    className="text-left bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-md transition-shadow"
                  >
                    <p className="font-medium text-gray-900 mb-1">{r.drug_name}</p>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{r.variant_count} {r.variant_count === 1 ? "strength/form" : "strengths/forms"}</span>
                      <span className="font-semibold text-gray-900">from {formatPrice(r.min_price)}</span>
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
              All medications
            </Button>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {selected.drug_name}
            </h1>

            <div className="mb-4 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 max-w-3xl">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <p>
                Real, current prices from <strong>Cost Plus Drugs</strong> — one specific mail-order pharmacy,
                not a Utah pharmacy comparison. Click through to order or to see exact package sizes.
              </p>
            </div>

            {detailLoading ? (
              <div className="space-y-3 max-w-3xl">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
              </div>
            ) : !detail ? (
              <p className="text-gray-500">Couldn't load this — try again.</p>
            ) : (
              <div className="space-y-3 max-w-3xl">
                {detail.variants.map(v => (
                  <a
                    key={v.dosage_form}
                    href={v.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Card className="hover:border-blue-400 transition">
                      <CardContent className="p-4 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">{v.friendly_dosage_form}</p>
                          <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                            View &amp; order at Cost Plus Drugs
                            <ExternalLink className="h-3 w-3" />
                          </p>
                        </div>
                        <p className="text-lg font-semibold text-gray-900 shrink-0">from {formatPrice(v.price)}</p>
                      </CardContent>
                    </Card>
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
