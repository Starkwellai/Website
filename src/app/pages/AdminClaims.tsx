import { useCallback, useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { AlertCircle, CheckCircle2, ShieldCheck, XCircle } from "lucide-react";
import {
  adminListClaims, adminDecideClaim,
  type AdminClaim, type AdminClaimCounts, type ClaimStatus,
} from "../../lib/starkwell";

/**
 * Owner-only screen at /admin/claims (not linked anywhere on the site). A practice
 * can claim any location, and a claim stays private until it is approved here.
 * Sign-in is a long secret code kept on the server (STARKWELL_ADMIN_TOKEN); it is
 * held in this browser tab only (sessionStorage), so closing the tab signs you out.
 */
const TOKEN_KEY = "starkwell_admin_token";
const TABS: { key: ClaimStatus; label: string }[] = [
  { key: "pending", label: "Waiting for review" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Not approved" },
];

function readToken(): string {
  try { return sessionStorage.getItem(TOKEN_KEY) ?? ""; } catch { return ""; }
}

export function AdminClaims() {
  const [token, setToken] = useState(readToken());
  const [draftToken, setDraftToken] = useState("");
  const [tab, setTab] = useState<ClaimStatus>("pending");
  const [claims, setClaims] = useState<AdminClaim[]>([]);
  const [counts, setCounts] = useState<AdminClaimCounts | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [busyId, setBusyId] = useState<number | null>(null);

  const signOut = useCallback((message?: string) => {
    try { sessionStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
    setToken(""); setClaims([]); setCounts(null);
    if (message) setError(message);
  }, []);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true); setError(null);
    try {
      const r = await adminListClaims(token, tab);
      setClaims(r.claims); setCounts(r.counts);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.startsWith("401")) signOut("That admin code wasn't accepted.");
      else if (msg.startsWith("404")) signOut("Admin access isn't set up on this server.");
      else setError(msg.startsWith("429") ? "Too many attempts — wait a few minutes and try again." : "Couldn't load claims — try again.");
    } finally {
      setLoading(false);
    }
  }, [token, tab, signOut]);

  useEffect(() => { void load(); }, [load]);

  async function decide(c: AdminClaim, decision: ClaimStatus) {
    setBusyId(c.id); setError(null);
    try {
      await adminDecideClaim(token, c.id, decision, notes[c.id]);
      await load();
    } catch {
      setError("Couldn't save that decision — try again.");
    } finally {
      setBusyId(null);
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Review practice claims</h1>
            </div>
            <p className="text-sm text-gray-600">Enter the admin code. It stays in this browser tab only.</p>
            {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                const t = draftToken.trim();
                if (!t) return;
                try { sessionStorage.setItem(TOKEN_KEY, t); } catch { /* ignore */ }
                setError(null); setToken(t); setDraftToken("");
              }}
            >
              <Input type="password" autoComplete="off" placeholder="Admin code" value={draftToken}
                     onChange={(e) => setDraftToken(e.target.value)} autoFocus />
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={!draftToken.trim()}>
                Sign in
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">Practice claims</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={() => signOut()}>Sign out</Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-6 max-w-4xl">
        <p className="text-sm text-gray-600 mb-4">
          A claim stays private until you approve it. To check one: call a published phone number for the
          location, and compare the NPI record with the claim. Approve only when you are satisfied it is
          the real practice.
        </p>

        <div className="flex gap-2 mb-4 flex-wrap" role="tablist">
          {TABS.map(t => (
            <Button key={t.key} role="tab" aria-selected={tab === t.key} size="sm"
                    variant={tab === t.key ? "default" : "outline"} onClick={() => setTab(t.key)}>
              {t.label}{counts ? ` (${counts[t.key]})` : ""}
            </Button>
          ))}
        </div>

        {error && (
          <div role="alert" className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg p-3 mb-4">
            <AlertCircle className="size-4 mt-0.5 shrink-0" /><span>{error}</span>
          </div>
        )}

        {loading && claims.length === 0 && <p className="text-sm text-gray-500">Loading…</p>}
        {!loading && claims.length === 0 && !error && (
          <p className="text-sm text-gray-500">
            {tab === "pending" ? "Nothing is waiting for review." : "No claims in this list."}
          </p>
        )}

        <div className="space-y-4">
          {claims.map(c => (
            <Card key={c.id}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <p className="font-semibold text-gray-900">{c.facility_label}</p>
                    <p className="text-sm text-gray-600">{c.address}, {c.city}</p>
                    <p className="text-xs text-gray-400">Claimed {new Date(c.claimed_at).toLocaleString()}</p>
                  </div>
                  <Badge variant="outline" className={
                    c.status === "approved" ? "border-green-600 text-green-700 bg-green-50"
                    : c.status === "rejected" ? "border-red-300 text-red-700 bg-red-50"
                    : "border-amber-300 text-amber-800 bg-amber-50"}>
                    {c.status === "approved" ? "Approved" : c.status === "rejected" ? "Not approved" : "Waiting"}
                  </Badge>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-0.5">
                    <p className="font-medium text-gray-900">Who claimed it</p>
                    <p>{c.practice_name} — {c.contact_name}</p>
                    <p><a className="text-blue-600 hover:underline" href={`mailto:${c.email}`}>{c.email}</a>{c.phone ? ` · ${c.phone}` : ""}</p>
                    <p className="text-gray-600">
                      {[c.specialty, [c.provider_city, c.provider_state].filter(Boolean).join(", ")].filter(Boolean).join(" · ") || "No specialty or city given"}
                    </p>
                    {c.message && <p className="text-gray-600 italic">&ldquo;{c.message}&rdquo;</p>}
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-medium text-gray-900">Check it</p>
                    <p>
                      Phone on file for this address:{" "}
                      {c.published_phones.length ? c.published_phones.join(", ") : <span className="text-gray-500">none on file</span>}
                    </p>
                    {c.npi ? (
                      c.npi_record ? (
                        <p>
                          NPI {c.npi}: {c.npi_record.name} at {c.npi_record.address}, {c.npi_record.city}
                          {c.npi_at_claimed_address
                            ? <span className="text-green-700"> — same address as the claim</span>
                            : <span className="text-amber-700"> — a different address from the claim</span>}
                        </p>
                      ) : <p className="text-amber-700">NPI {c.npi} was not found in the registry data.</p>
                    ) : <p className="text-gray-500">No NPI was given.</p>}
                  </div>
                </div>

                {c.description && (
                  <div className="text-sm bg-gray-50 border border-gray-200 rounded p-3">
                    <p className="text-xs font-medium text-gray-500 mb-1">Description they wrote</p>
                    <p className="whitespace-pre-wrap">{c.description}</p>
                  </div>
                )}

                {c.review_note && c.status !== "pending" && (
                  <p className="text-sm text-gray-600">Your note: {c.review_note}</p>
                )}

                <div className="space-y-2 pt-1">
                  <Textarea rows={2} maxLength={500} placeholder="Optional note (the practice sees it if you don't approve)"
                            value={notes[c.id] ?? ""} onChange={(e) => setNotes({ ...notes, [c.id]: e.target.value })} />
                  <div className="flex gap-2 flex-wrap">
                    {c.status !== "approved" && (
                      <Button size="sm" disabled={busyId === c.id} onClick={() => decide(c, "approved")} className="bg-green-600 hover:bg-green-700">
                        <CheckCircle2 className="mr-1 size-4" />Approve
                      </Button>
                    )}
                    {c.status !== "rejected" && (
                      <Button size="sm" variant="outline" disabled={busyId === c.id} onClick={() => decide(c, "rejected")}
                              className="text-red-700 border-red-200 hover:bg-red-50">
                        <XCircle className="mr-1 size-4" />Don&rsquo;t approve
                      </Button>
                    )}
                    {c.status !== "pending" && (
                      <Button size="sm" variant="ghost" disabled={busyId === c.id} onClick={() => decide(c, "pending")}>
                        Move back to waiting
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
