import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ComingSoonBadge } from "../components/ComingSoonBadge";
import { ProviderListingsCard } from "../components/ProviderListingsCard";
import { ProviderReviewsCard } from "../components/ProviderReviewsCard";
import { ProviderAccountCard } from "../components/ProviderAccountCard";
import { AppointmentRequestsCard } from "../components/AppointmentRequestsCard";
import { Building2, CalendarClock, ClipboardCheck, LogOut, Star } from "lucide-react";
import logo from "../../assets/b2725744d7bb552f20e2a7bcebca16e19b4a014d.png";
import {
  getCurrentProviderAccount, logoutProviderAccount, getMyListings, getMyReviews, getAppointmentRequests,
  type ProviderAccount, type ClaimedListing, type ProviderReviewSummary,
} from "../../lib/starkwell";

/**
 * A practice's home: its locations and what patients see for each, the reviews it has
 * received, and its account. Every number here comes from the server; nothing is invented.
 * Starkwell holds no patient records, scheduling or messages, so this page has none of those.
 *
 * Identity comes from a real provider-account session (getCurrentProviderAccount), and a
 * visitor without one is sent to /provider-login.
 */
const DETAIL_FIELDS = ["description", "phone", "website", "hours", "insurance_note"] as const;

function Tile({ icon, label, value, note }: { icon: React.ReactNode; label: string; value: React.ReactNode; note?: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm text-gray-600">{label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {note && <p className="text-xs text-gray-500 mt-1">{note}</p>}
          </div>
          <div className="text-gray-300 shrink-0">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProviderDashboard() {
  const navigate = useNavigate();
  const [account, setAccount] = useState<ProviderAccount | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [listings, setListings] = useState<ClaimedListing[] | null>(null);
  const [reviewSummary, setReviewSummary] = useState<ProviderReviewSummary[] | null>(null);
  const [requests, setRequests] = useState<{ enabled: boolean; newCount: number } | null>(null);

  const loadAccount = useCallback(async () => {
    try {
      const acct = await getCurrentProviderAccount();
      if (!acct) { navigate("/provider-login"); return; }
      setAccount(acct);
    } catch {
      navigate("/provider-login");
    } finally {
      setCheckingAuth(false);
    }
  }, [navigate]);

  useEffect(() => { void loadAccount(); }, [loadAccount]);

  // The summary tiles re-read the same server data the cards below show.
  useEffect(() => {
    if (!account) return;
    getMyListings().then(setListings).catch(() => setListings([]));
    getMyReviews().then(r => setReviewSummary(r.locations)).catch(() => setReviewSummary([]));
    getAppointmentRequests()
      .then(r => setRequests({ enabled: r.enabled, newCount: r.requests.filter(x => x.status === "new").length }))
      .catch(() => setRequests({ enabled: false, newCount: 0 }));
  }, [account]);

  const handleLogout = () => {
    void logoutProviderAccount();
    navigate("/");
  };

  if (checkingAuth || !account) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500 text-sm">
        Loading your dashboard…
      </div>
    );
  }

  const approved = listings?.filter(l => l.status === "approved").length ?? 0;
  const waiting = listings?.filter(l => l.status === "pending").length ?? 0;
  const reviewCount = reviewSummary?.reduce((n, l) => n + l.count, 0) ?? 0;
  const reviewAvg = reviewCount > 0
    ? Math.round((reviewSummary!.reduce((n, l) => n + (l.average ?? 0) * l.count, 0) / reviewCount) * 10) / 10
    : null;
  const filled = listings?.reduce((n, l) => n + DETAIL_FIELDS.filter(f => !!l[f]).length, 0) ?? 0;
  const possible = (listings?.length ?? 0) * DETAIL_FIELDS.length;
  const providerName = account.contact_name || account.practice_name;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-2 md:px-4 py-2">
          <div className="flex items-center justify-between">
            <img src={logo} alt="Starkwell" className="h-9 md:h-12 cursor-pointer rounded-[5px]" onClick={() => navigate("/")} />
            <div className="flex items-center gap-2 md:gap-4">
              <Badge variant="outline" className="border-green-600 text-green-700 bg-green-50 hidden sm:inline-flex">
                Practice account
              </Badge>
              <span className="text-sm text-gray-600 hidden md:inline">{providerName}</span>
              <Button variant="ghost" size="sm" className="text-gray-700" onClick={handleLogout}>
                <LogOut className="mr-2 size-4" />
                Log out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Welcome, {providerName}</h1>
          <p className="text-sm md:text-base text-gray-600">{account.practice_name}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8">
          <Tile icon={<Building2 className="size-8" />} label="Locations"
                value={listings === null ? "…" : approved}
                note={listings === null ? undefined
                  : listings.length === 0 ? "Claim your first location below"
                  : waiting > 0 ? `approved · ${waiting} waiting for review`
                  : "approved and public"} />
          <Tile icon={<Star className="size-8" />} label="Patient reviews"
                value={reviewSummary === null ? "…" : reviewAvg === null ? "None yet" : `${reviewAvg}/5`}
                note={reviewSummary === null ? undefined : reviewCount > 0 ? `${reviewCount} ${reviewCount === 1 ? "review" : "reviews"} across your locations` : "Reviews appear once a location is approved"} />
          <Tile icon={<ClipboardCheck className="size-8" />} label="Listing details filled in"
                value={listings === null ? "…" : possible === 0 ? "—" : `${Math.round((filled / possible) * 100)}%`}
                note={possible === 0 ? "Claim a location to start" : "Description, phone, website, hours, insurance"} />
          <Tile icon={<CalendarClock className="size-8" />} label="Appointment requests"
                value={requests === null ? "…" : requests.enabled ? requests.newCount : <ComingSoonBadge />}
                note={requests === null ? undefined : requests.enabled ? "new, waiting for your reply" : "Online requests aren't live yet"} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <ProviderListingsCard />
            <ProviderReviewsCard />
            <AppointmentRequestsCard />
          </div>
          <div className="space-y-6">
            <ProviderAccountCard account={account} onChanged={loadAccount} />
            <Card>
              <CardHeader>
                <CardTitle className="text-base">What patients see</CardTitle>
                <CardDescription>
                  Once a location is approved, its page shows the description, phone, website, hours and
                  insurance note you wrote, labeled as written by the practice, plus your public replies
                  to reviews.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
