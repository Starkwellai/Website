import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Skeleton } from "../components/ui/skeleton";
import { MapPin, Star, ShieldCheck, ArrowLeft, Building2 } from "lucide-react";
import { SiteNav } from "../components/SiteNav";
import { AppointmentRequestsNotLive } from "../components/AppointmentRequestsNotLive";
import { PracticeDetails } from "../components/PracticeDetails";
import logo from "../../assets/b2725744d7bb552f20e2a7bcebca16e19b4a014d.png";
import {
  getFacilityProfile, getFacilityReviews, getPublicListing, requestAppointment,
  formatPrice,
  type FacilityProfile as FacilityProfileData, type FacilityReviews, type PublicListingClaim,
} from "../../lib/starkwell";

/**
 * One physical location, every procedure it's priced for. The reverse of
 * PriceSearch — that page goes procedure -> places; this goes place ->
 * procedures. Reached from a facility card's "View full profile" link,
 * which already has address/city in hand (facility_key alone is an opaque
 * hash — see getFacilityProfile()).
 */
export function FacilityProfile() {
  const navigate = useNavigate();
  const { facilityKey = "" } = useParams();
  const [params] = useSearchParams();
  const address = params.get("address") || "";
  const city = params.get("city") || "";

  const [profile, setProfile] = useState<FacilityProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!facilityKey || !address || !city) { setError("missing"); setLoading(false); return; }
    let cancelled = false;
    setLoading(true); setError(null);
    getFacilityProfile(facilityKey, address, city)
      .then(p => { if (!cancelled) setProfile(p); })
      .catch(e => { if (!cancelled) setError(e instanceof Error ? e.message : String(e)); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [facilityKey, address, city]);

  const [reviews, setReviews] = useState<FacilityReviews | null>(null);
  useEffect(() => {
    if (!facilityKey) return;
    getFacilityReviews(facilityKey).then(setReviews).catch(() => setReviews(null));
  }, [facilityKey]);

  const [claims, setClaims] = useState<PublicListingClaim[]>([]);
  // Off on the server until claims are verified and the site is https — see
  // AppointmentRequestsNotLive. Defaults to off so a failed fetch never offers
  // a form the server would refuse.
  const [appointmentsEnabled, setAppointmentsEnabled] = useState(false);
  useEffect(() => {
    if (!facilityKey) return;
    getPublicListing(facilityKey)
      .then(l => { setClaims(l.claims); setAppointmentsEnabled(l.appointmentRequestsEnabled); })
      .catch(() => { setClaims([]); setAppointmentsEnabled(false); });
  }, [facilityKey]);

  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestName, setRequestName] = useState("");
  const [requestContact, setRequestContact] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [requestSent, setRequestSent] = useState(false);

  async function handleRequestAppointment() {
    if (!facilityKey || !requestName.trim() || !requestContact.trim()) return;
    setRequestSubmitting(true); setRequestError(null);
    try {
      await requestAppointment(facilityKey, {
        patient_name: requestName.trim(),
        contact: requestContact.trim(),
        message: requestMessage.trim() || undefined,
      });
      setRequestSent(true); setShowRequestForm(false);
    } catch (e) {
      setRequestError(
        e instanceof Error && e.message.startsWith("429")
          ? "Too many requests sent recently — please try again later."
          : "Couldn't send that request — please try again."
      );
    } finally {
      setRequestSubmitting(false);
    }
  }

  const title = profile?.facility_name ?? address;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="relative bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-2">
          <div className="flex items-center justify-between">
            <img src={logo} alt="Starkwell" className="h-9 md:h-12 cursor-pointer rounded-[5px]" onClick={() => navigate("/")} />
            <SiteNav />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-3xl">
        <Button variant="ghost" className="mb-4 -ml-3" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 size-4" /> Back
        </Button>

        {loading && (
          <div className="space-y-3">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-64 rounded-lg" />
          </div>
        )}

        {!loading && error && (
          <p className="text-gray-500">
            {error === "missing"
              ? "This link is missing the location it points to — go back and open a facility from search results."
              : "Couldn't load this location — try again."}
          </p>
        )}

        {!loading && profile && (
          <>
            <div className="flex items-start gap-3 mb-1">
              <Building2 className="h-7 w-7 text-blue-600 shrink-0 mt-1" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h1>
                <p className="text-gray-600 flex items-center gap-1 mt-1">
                  <MapPin className="h-4 w-4 shrink-0" />
                  {profile.facility_name ? `${profile.address}, ` : ""}{profile.city}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-6 mt-3">
              <Badge variant="outline" className="bg-white text-gray-600">
                {profile.services.length} priced {profile.services.length === 1 ? "procedure" : "procedures"}
              </Badge>
              {profile.rating && /^\d$/.test(profile.rating) && (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  <Star className="h-3 w-3 mr-1" />
                  {profile.rating}/5 CMS rating
                </Badge>
              )}
              {profile.patient_star != null && (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  <Star className="h-3 w-3 mr-1" />
                  {profile.patient_star}/5 patient rating
                  {profile.surveys != null && ` (${profile.surveys} surveys)`}
                </Badge>
              )}
              {reviews?.sources.starkwell && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Star className="h-3 w-3 mr-1 fill-blue-500" />
                  {reviews.sources.starkwell.average}/5 · {reviews.sources.starkwell.count} Starkwell{" "}
                  {reviews.sources.starkwell.count === 1 ? "review" : "reviews"}
                </Badge>
              )}
            </div>

            {claims.length > 0 && (
              <Card className="mb-6 border-teal-200 bg-teal-50/40">
                <CardContent className="p-4 space-y-3">
                  {claims.map((c, i) => (
                    <div key={i} className={i > 0 ? "pt-3 border-t border-teal-200" : ""}>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-medium text-gray-900">{c.practice_name}</h3>
                        <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
                          Claimed by this practice
                        </Badge>
                      </div>
                      {c.description && <p className="text-sm text-gray-700 whitespace-pre-wrap">{c.description}</p>}
                      <PracticeDetails claim={c} />
                    </div>
                  ))}
                  <div className="pt-3 border-t border-teal-200">
                    {!appointmentsEnabled ? (
                      <AppointmentRequestsNotLive />
                    ) : requestSent ? (
                      <p className="text-sm text-green-700 flex items-center gap-1.5">
                        <ShieldCheck className="h-4 w-4" />
                        Request sent — the practice will reach out to you directly.
                      </p>
                    ) : showRequestForm ? (
                      <div className="space-y-2 max-w-sm">
                        <Input placeholder="Your name" value={requestName}
                               onChange={e => setRequestName(e.target.value)} maxLength={120} />
                        <Input placeholder="Phone or email so they can reach you" value={requestContact}
                               onChange={e => setRequestContact(e.target.value)} maxLength={200} />
                        <Textarea placeholder="What you'd like to be seen for (optional)" value={requestMessage}
                                  onChange={e => setRequestMessage(e.target.value)} maxLength={1000} rows={2} />
                        {requestError && <p className="text-sm text-red-700" role="alert">{requestError}</p>}
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleRequestAppointment}
                                  disabled={requestSubmitting || !requestName.trim() || !requestContact.trim()}
                                  className="bg-teal-600 hover:bg-teal-700">
                            {requestSubmitting ? "Sending…" : "Send request"}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setShowRequestForm(false)}>Cancel</Button>
                        </div>
                        <p className="text-xs text-gray-500">
                          This isn't a confirmed appointment — the practice will contact you to schedule.
                        </p>
                      </div>
                    ) : (
                      <Button size="sm" onClick={() => setShowRequestForm(true)} className="bg-teal-600 hover:bg-teal-700">
                        Request an appointment
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <h2 className="text-lg font-semibold text-gray-900 mb-3">Priced procedures here</h2>
            <div className="space-y-2 mb-8">
              {profile.services.map(s => (
                <button
                  key={s.service_key}
                  type="button"
                  onClick={() => navigate(`/prices?q=${encodeURIComponent(s.display_name)}&city=${encodeURIComponent(profile.city)}`)}
                  className="w-full text-left bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between gap-4 hover:border-blue-400 hover:shadow-sm transition"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{s.display_name}</p>
                    <p className="text-xs text-gray-500">{s.category} · {s.providers} contracted {s.providers === 1 ? "provider" : "providers"}</p>
                  </div>
                  <p className="font-semibold text-gray-900 shrink-0">{formatPrice(s.median_price)}</p>
                </button>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
