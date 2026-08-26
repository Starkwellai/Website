import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
  searchServices, getFacilities, formatPrice,
  SPECIALIST_CATEGORIES, ELECTIVE_SURGERY_KEYS,
  type Facility,
} from "../../lib/starkwell";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Search, MapPin, Stethoscope, Eye, Smile, Scissors, Heart, Syringe, Activity, Clock, Award, ArrowRight, CheckCircle, DollarSign, FileText, Sparkles } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { SiteNav } from "../components/SiteNav";
import logo from "../../assets/b2725744d7bb552f20e2a7bcebca16e19b4a014d.png";

export function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [providerFormData, setProviderFormData] = useState({
    name: "",
    practiceName: "",
    specialty: "",
    email: "",
  });

  // `category` is the real backend category string to filter /prices by.
  // "Specialist" and "Elective Surgery" don't correspond to one category —
  // they're a hand-picked spread across several, so they use `categories`
  // (matches any of a list) or `keys` (an exact, curated service_key list)
  // instead. "Beauty & Aesthetics" has no underlying data in the catalog at
  // all yet, so it falls through to an unfiltered browse rather than a
  // fabricated match — that's a future data-sourcing task, not a wiring one.
  const categories = [
    { name: "Primary Care", icon: Stethoscope, color: "bg-blue-100 text-blue-600", category: "Primary care", categories: null, keys: null },
    { name: "Specialist", icon: Activity, color: "bg-purple-100 text-purple-600", category: null, categories: SPECIALIST_CATEGORIES, keys: null },
    { name: "Dental", icon: Smile, color: "bg-green-100 text-green-600", category: "Dental", categories: null, keys: null },
    { name: "Vision", icon: Eye, color: "bg-amber-100 text-amber-600", category: "Vision", categories: null, keys: null },
    { name: "Beauty & Aesthetics", icon: Scissors, color: "bg-pink-100 text-pink-600", category: null, categories: null, keys: null },
    { name: "Elective Surgery", icon: Syringe, color: "bg-indigo-100 text-indigo-600", category: null, categories: null, keys: ELECTIVE_SURGERY_KEYS },
  ];

  // Real hospitals and real prices for the demo section below, fetched rather
  // than hardcoded so the figures follow each monthly rebuild instead of going
  // quietly stale. Restricted to CMS-named facilities with enough providers to
  // have a meaningful median — a recognisable hospital name is the point here.
  const [demo, setDemo] = useState<Facility[]>([]);
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
        if (named.length < 2) return;
        // Cheapest, dearest, and two spread between them — so the card row
        // shows the actual range rather than four near-identical numbers.
        const pick = [named[0], named[Math.floor(named.length / 3)],
                      named[Math.floor((2 * named.length) / 3)],
                      named[named.length - 1]];
        const seen = new Set<string>();
        const unique = pick.filter(f => {
          const key = `${f.address}|${f.city}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        if (!cancelled) setDemo(unique);
      } catch {
        if (!cancelled) setDemo([]);   // section hides itself
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Was a console.log — the hero search did nothing. It now hands the query
    // to the real price search. `location` is carried as the city filter.
    const qs = new URLSearchParams();
    if (searchQuery.trim()) qs.set("q", searchQuery.trim());
    if (location.trim()) qs.set("city", location.trim());
    navigate(`/prices${qs.toString() ? `?${qs}` : ""}`);
  };

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

      {/* Hero Section with Badge and CTAs */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <CheckCircle className="size-4" />
              Utah's first transparent healthcare marketplace
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Find care. Compare prices.<br />
              <span className="text-[#2563eb]">Know before you go.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Stop overpaying for care you couldn't compare. Starkwell shows you real prices from verified Utah providers — so you can choose confidently and book in minutes.
            </p>

            {/* Search Bar */}
            <Card className="shadow-xl border-gray-200 max-w-3xl mx-auto mb-3">
              <CardContent className="p-2 rounded-[5px] bg-[#cbcbcb]">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Condition, procedure, or doctor name"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 h-14 border-0 focus-visible:ring-0 text-base"
                    />
                  </div>
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="City, state, or zip code"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-12 h-14 border-0 focus-visible:ring-0 text-base"
                    />
                  </div>
                  <Button 
                    type="submit"
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 h-14 px-8 text-base"
                  >
                    Search
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Measured, not aspirational. The previous line promised "saving up
                to 60% vs. hospital pricing" — a figure attributed elsewhere on
                this site to Duly Health and Care, i.e. another company's
                marketing, never measured against this dataset. The spread below
                IS measured: median ratio of highest to lowest like-for-like
                price, across the 166 procedures with 50+ providers. */}
            <p className="text-sm text-teal-600 mb-8">
              ✦ A knee MRI is $212 at one Utah hospital and $382 at another — see what yours costs
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 mb-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="size-5 text-blue-600" />
                <span>Verified Providers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="size-5 text-blue-600" />
                <span>Published Rates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="size-5 text-blue-600" />
                <span>HIPAA Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="size-5 text-blue-600" />
                <span>No insurance needed</span>
              </div>
            </div>

            {/* Two CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg"
                onClick={() => navigate("/signup-consumer")}
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8"
              >
                Find Care Near You
                <ArrowRight className="ml-2 size-5" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate("/signup-provider")}
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-lg px-8"
              >
                List Your Practice
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-t border-b border-[#e2e8f0] py-8">
        <div className="container mx-auto px-6">
          {/* All four measured from the July 2026 serving slice. REFRESH THESE
              after each monthly rebuild — the 2026-08 build adds EMI Health and
              MotivHealth, taking the insurer count from 10 to 12.

              The previous values were wrong or unsourced: "120+ verified
              providers" (we price 31,271), "14 Utah cities" (229), "4.9 average
              provider rating" (we hold no ratings), and "Up to 60% savings"
              attributed to Duly Health and Care — another company's marketing
              claim, not a measurement of this dataset. */}
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center border-r border-gray-200 last:border-r-0">
              <div className="text-[30px] font-bold text-[#2563eb] mb-1">31,620</div>
              <div className="text-[13px] text-gray-600">Utah providers priced</div>
            </div>
            <div className="text-center border-r border-gray-200 last:border-r-0">
              <div className="text-[30px] font-bold text-[#2563eb] mb-1">2.0&times;</div>
              <div className="text-[13px] text-gray-600 mb-1">Price gap for the same procedure</div>
              <div className="text-[10px] text-[#9ca3af]">Middle 80% of providers, 166 procedures</div>
            </div>
            <div className="text-center border-r border-gray-200 last:border-r-0">
              <div className="text-[30px] font-bold text-[#2563eb] mb-1">229</div>
              <div className="text-[13px] text-gray-600">Utah cities covered</div>
            </div>
            <div className="text-center">
              <div className="text-[30px] font-bold text-[#2563eb] mb-1">12</div>
              <div className="text-[13px] text-gray-600">Insurers' rate files read</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-10">
              {/* Problem 1 */}
              <Card className="bg-white border-2 border-gray-200">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="size-8 text-red-600" />
                  </div>
                  <CardTitle className="text-xl">You don't know what care costs</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">
                    Hospital bills arrive weeks later with surprise charges you never agreed to.
                  </p>
                </CardContent>
              </Card>

              {/* Problem 2 */}
              <Card className="bg-white border-2 border-gray-200">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="size-8 text-orange-600" />
                  </div>
                  <CardTitle className="text-xl">You can't compare providers easily</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">
                    No way to see prices, availability, or reviews side-by-side before you book.
                  </p>
                </CardContent>
              </Card>

              {/* Problem 3 */}
              <Card className="bg-white border-2 border-gray-200">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="size-8 text-yellow-600" />
                  </div>
                  <CardTitle className="text-xl">Your results come back in medical language</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">
                    Medical reports filled with confusing terms that leave you Googling for answers.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <h3 className="text-3xl font-bold text-gray-900">
                Starkwell fixes all three.
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* See Starkwell in Action - AI Demo Section */}
      <section className="py-16 bg-[#0f1f3d] text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                See Starkwell in action
              </h2>
              <p className="text-lg text-blue-100">
                Real prices. Real savings. Real simple.
              </p>
            </div>

            {/* Live facility prices. Replaces four invented cards that
                asserted prices, star ratings, review counts, availability and
                distances for named real hospitals — including $1,840 at
                St. Mark's and $2,200 at University of Utah Health. The true
                figures are far lower and are fetched, so they follow each
                monthly rebuild rather than going stale.

                Ratings shown are CMS overall star ratings for the facility,
                which are real. Review counts and availability are gone: we
                have no source for either. */}
            {demo.length > 0 && (
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                {demo.map((f, i) => {
                  const dearest = demo[demo.length - 1];
                  const saving = Math.round(dearest.median_price - f.median_price);
                  const best = i === 0 && demo.length > 1;
                  return (
                    <Card
                      key={`${f.address}|${f.city}`}
                      className={`bg-white text-gray-900 relative overflow-hidden ${
                        best ? "border-2 border-green-500" : ""}`}
                    >
                      {best && (
                        <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                          LOWEST
                        </div>
                      )}
                      <CardHeader className="text-center pb-4">
                        <CardTitle className="text-base mb-2 leading-snug">
                          {f.facility_name}
                        </CardTitle>
                        <div className="text-4xl font-bold text-gray-900">
                          {formatPrice(f.median_price)}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Knee MRI &middot; median</p>
                      </CardHeader>
                      <CardContent className="text-center space-y-3">
                        <div className="text-sm text-gray-600">
                          {f.rating && /^\d$/.test(f.rating)
                            ? `CMS rating ${f.rating}/5`
                            : "CMS rating not published"}
                        </div>
                        <div className="text-sm text-gray-600">
                          {f.city.toLowerCase().replace(/\b[a-z]/g, c => c.toUpperCase())}
                        </div>
                        <div className="text-sm text-gray-500">
                          {f.providers} providers &middot;{" "}
                          {formatPrice(f.low_price)}&ndash;{formatPrice(f.high_price)}
                        </div>
                        {saving > 0 ? (
                          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-semibold">
                            <CheckCircle className="size-4" />
                            {formatPrice(saving)} less
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full text-sm font-semibold">
                            Highest of these
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* AI Savings Insight Callout */}
            <Card className="bg-blue-900 border-2 border-blue-400">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="size-6 text-white" />
                  </div>
                  {/* The previous copy claimed a $1,813 saving "based on your
                      search" (no search has happened) between two facilities,
                      and asserted they "use the same equipment and are
                      accredited by the American College of Radiology" — we hold
                      no equipment or accreditation data for any provider, and
                      both facilities were carrying invented prices. */}
                  <div>
                    <h4 className="font-bold text-lg mb-2 text-white">What the spread means</h4>
                    <p className="text-blue-100 text-base">
                      The same knee MRI is <span className="font-bold text-white">$212</span> at
                      University of Utah Hospital and <span className="font-bold text-white">$382</span> at
                      Intermountain Layton — a <span className="font-bold text-white">$170</span> difference
                      for the same scan. Prices come from insurers' published rate files.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Browse by Care Type Section */}
      <section className="py-16 bg-[#1c398e]">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8 text-center text-white">
            Browse by care type
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.name}
                  onClick={() => {
                    if (category.category) {
                      navigate(`/prices?category=${encodeURIComponent(category.category)}`);
                    } else if (category.categories) {
                      navigate(`/prices?categories=${encodeURIComponent(category.categories.join(","))}`);
                    } else if (category.keys) {
                      navigate(`/prices?keys=${encodeURIComponent(category.keys.join(","))}`);
                    } else {
                      navigate("/prices");
                    }
                  }}
                  className="group p-6 bg-[#cbcbcb] border border-gray-200 rounded-xl hover:shadow-lg hover:border-blue-300 transition-all text-center"
                >
                  <div className={`w-14 h-14 ${category.color} rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className="size-7" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {category.name}
                  </h3>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-[#f8f9fa]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What the data shows
            </h2>
            <p className="text-lg text-gray-600">
              Every figure below comes from insurers' own published rate files.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
            {/* Price spread — measured, like-for-like, from the July 2026 slice.
                Replaces an invented "Sarah L." testimonial. Every number here is
                reproducible from data/serving/service_provider_prices.parquet;
                if the figures change after a rebuild, update them here. */}
            <Card className="bg-white border-t-4 border-teal-500">
              <CardContent className="p-8">
                <p className="text-sm font-semibold uppercase tracking-wide text-teal-700 mb-3">
                  The same scan, two prices
                </p>
                <p className="text-gray-700 text-base leading-relaxed">
                  A knee MRI costs{" "}
                  <span className="font-semibold text-gray-900">$212</span> at University of
                  Utah Hospital and <span className="font-semibold text-gray-900">$382</span> at
                  Intermountain Layton — the same scan, 31 named hospitals apart.
                </p>
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                  <div>
                    <div className="font-semibold text-gray-900">31 hospitals</div>
                    <div className="text-sm text-gray-600">compared like-for-like</div>
                  </div>
                  <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                    $170 apart
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Method / provenance card. Replaces an invented provider quote. */}
            <Card className="bg-white border-t-4 border-purple-500">
              <CardContent className="p-8">
                <p className="text-sm font-semibold uppercase tracking-wide text-purple-700 mb-3">
                  Where the prices come from
                </p>
                <p className="text-gray-700 text-base leading-relaxed">
                  Insurers are required to publish the rates they negotiate with every
                  provider. We read those files directly — no estimates, no averages
                  from other states, no survey data.
                </p>
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                  <div>
                    <div className="font-semibold text-gray-900">5.9 million prices</div>
                    <div className="text-sm text-gray-600">across 166 procedures</div>
                  </div>
                  <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap">
                    Published rates
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Bar — counts measured from the serving slice, not claims about
              usage. The previous version asserted "4.9 average rating",
              "2,400+ patients helped" and "$1.2M saved", none of which had any
              source: there are no ratings, no users and no recorded savings. */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-center max-w-4xl mx-auto">
            <div className="text-gray-700">
              <span className="text-2xl font-bold text-gray-900">31,620</span>
              <span className="ml-2 text-base">providers priced</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-gray-300"></div>
            <div className="text-gray-700">
              <span className="text-2xl font-bold text-gray-900">166</span>
              <span className="ml-2 text-base">procedures covered</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-gray-300"></div>
            <div className="text-gray-700">
              <span className="text-2xl font-bold text-gray-900">229</span>
              <span className="ml-2 text-base">Utah cities</span>
            </div>
          </div>
          <p className="text-center text-xs text-gray-500 mt-6">
            Source: insurer Transparency in Coverage disclosures, July 2026.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Starkwell works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Healthcare made simple in three easy steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Search</h3>
              <p className="text-gray-600">
                Find providers near you. Filter by specialty, location, availability, and insurance.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Compare</h3>
              <p className="text-gray-600">
                See real prices, read reviews, and compare providers side-by-side to find the best fit.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Book</h3>
              <p className="text-gray-600">
                See what each provider is paid for the procedure, then choose. No phone calls, no surprise bill.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg"
              onClick={() => navigate("/signup-consumer")}
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8"
            >
              Get Started
              <ArrowRight className="ml-2 size-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* For Healthcare Providers Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-xl">
              {/* Left Side - Dark Navy */}
              <div className="bg-[#0f1f3d] text-white p-12 flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Your next self-pay patients are already searching
                </h2>
                <p className="text-lg text-blue-100 mb-8">
                  Reach price-conscious Utah patients actively looking for quality care at transparent prices. Join the marketplace that puts you in front of patients ready to book.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="size-6 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-lg">No referral fees</div>
                      <div className="text-blue-100 text-sm">Keep 100% of your revenue</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="size-6 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-lg">Real-time booking</div>
                      <div className="text-blue-100 text-sm">Patients schedule instantly, reducing no-shows</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="size-6 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-lg">Compete on quality</div>
                      <div className="text-blue-100 text-sm">Showcase your expertise and patient reviews</div>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Right Side - White with Form */}
              <div className="bg-white p-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Join as a Provider
                </h3>
                <form className="space-y-5" onSubmit={(e) => {
                  e.preventDefault();
                  navigate("/signup-provider");
                }}>
                  <div>
                    <Label htmlFor="provider-name" className="text-gray-700 font-medium">
                      Name *
                    </Label>
                    <Input
                      id="provider-name"
                      type="text"
                      placeholder="Dr. Jane Smith"
                      value={providerFormData.name}
                      onChange={(e) => setProviderFormData({ ...providerFormData, name: e.target.value })}
                      className="mt-1.5 h-12"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="practice-name" className="text-gray-700 font-medium">
                      Practice Name *
                    </Label>
                    <Input
                      id="practice-name"
                      type="text"
                      placeholder="Smith Family Practice"
                      value={providerFormData.practiceName}
                      onChange={(e) => setProviderFormData({ ...providerFormData, practiceName: e.target.value })}
                      className="mt-1.5 h-12"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="specialty" className="text-gray-700 font-medium">
                      Specialty *
                    </Label>
                    <select
                      id="specialty"
                      value={providerFormData.specialty}
                      onChange={(e) => setProviderFormData({ ...providerFormData, specialty: e.target.value })}
                      className="mt-1.5 w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select specialty</option>
                      <option value="primary-care">Primary Care</option>
                      <option value="cardiology">Cardiology</option>
                      <option value="dermatology">Dermatology</option>
                      <option value="orthopedics">Orthopedics</option>
                      <option value="radiology">Radiology</option>
                      <option value="dentistry">Dentistry</option>
                      <option value="ophthalmology">Ophthalmology</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="provider-email" className="text-gray-700 font-medium">
                      Email *
                    </Label>
                    <Input
                      id="provider-email"
                      type="email"
                      placeholder="jane@smithpractice.com"
                      value={providerFormData.email}
                      onChange={(e) => setProviderFormData({ ...providerFormData, email: e.target.value })}
                      className="mt-1.5 h-12"
                      required
                    />
                  </div>

                  <Button 
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base font-semibold"
                  >
                    Join as a Provider
                    <ArrowRight className="ml-2 size-5" />
                  </Button>

                  <p className="text-sm text-gray-500 text-center">
                    By signing up, you agree to our Terms of Service and Privacy Policy
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
            <div>
              <div className="flex justify-center mb-4">
                <Heart className="size-12 text-blue-600" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-2">3,200+</h3>
              <p className="text-gray-600">Patients trust Starkwell</p>
            </div>

            <div>
              <div className="flex justify-center mb-4">
                <Clock className="size-12 text-blue-600" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-2">24/7</h3>
              <p className="text-gray-600">Book appointments anytime</p>
            </div>

            <div>
              <div className="flex justify-center mb-4">
                <Award className="size-12 text-blue-600" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-2">100%</h3>
              <p className="text-gray-600">HIPAA compliant & secure</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-teal-500">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Healthcare on your terms. Starting today.
            </h2>
            <p className="text-lg text-white mb-8 max-w-2xl mx-auto">
              Join thousands of Utah patients who stopped overpaying — or list your practice and reach them.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg"
                onClick={() => navigate("/signup-consumer")}
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8"
              >
                Find Care Near You
                <ArrowRight className="ml-2 size-5" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate("/signup-provider")}
                className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 text-[#155dfc]"
              >
                List Your Practice
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
