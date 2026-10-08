import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { AlertCircle, Star } from "lucide-react";
import {
  adminListReviews, adminDecideReview,
  type AdminReview, type AdminReviewView, type AdminReviewAction,
} from "../../lib/starkwell";

/**
 * Owner-only review moderation (the Reviews half of /admin/claims). Reviews are anonymous and
 * unverified, so nothing is removed automatically: a practice can report one, and you decide.
 * "Hide" takes it off the public page and out of the counts but keeps it, so it can be restored.
 */
const VIEWS: { key: AdminReviewView; label: string }[] = [
  { key: "flagged", label: "Reported" },
  { key: "recent", label: "Newest" },
  { key: "hidden", label: "Hidden" },
];

export function AdminReviewsPanel({ token, onAuthError, onCounts }: {
  token: string;
  onAuthError: (message: string) => void;
  onCounts?: (counts: { flagged: number; hidden: number }) => void;
}) {
  const [view, setView] = useState<AdminReviewView>("flagged");
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [counts, setCounts] = useState<{ flagged: number; hidden: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const r = await adminListReviews(token, view);
      setReviews(r.reviews); setCounts(r.counts); onCounts?.(r.counts);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.startsWith("401")) onAuthError("That admin code wasn't accepted.");
      else setError("Couldn't load reviews — try again.");
    } finally {
      setLoading(false);
    }
  }, [token, view, onAuthError, onCounts]);

  useEffect(() => { void load(); }, [load]);

  async function act(id: number, action: AdminReviewAction) {
    setBusyId(id); setError(null);
    try { await adminDecideReview(token, id, action); await load(); }
    catch { setError("Couldn't save that — try again."); }
    finally { setBusyId(null); }
  }

  return (
    <div>
      <p className="text-sm text-gray-600 mb-4">
        Reviews are anonymous and unverified. A practice can report one; you decide. &ldquo;Hide&rdquo; removes it
        from the public page and the counts, and you can restore it later.
      </p>
      <div className="flex gap-2 mb-4 flex-wrap" role="tablist">
        {VIEWS.map(v => (
          <Button key={v.key} role="tab" aria-selected={view === v.key} size="sm"
                  variant={view === v.key ? "default" : "outline"} onClick={() => setView(v.key)}>
            {v.label}{counts && v.key !== "recent" ? ` (${counts[v.key]})` : ""}
          </Button>
        ))}
      </div>

      {error && (
        <div role="alert" className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg p-3 mb-4">
          <AlertCircle className="size-4 mt-0.5 shrink-0" /><span>{error}</span>
        </div>
      )}
      {loading && reviews.length === 0 && <p className="text-sm text-gray-500">Loading…</p>}
      {!loading && reviews.length === 0 && !error && (
        <p className="text-sm text-gray-500">
          {view === "flagged" ? "Nothing has been reported." : view === "hidden" ? "No hidden reviews." : "No reviews yet."}
        </p>
      )}

      <div className="space-y-3">
        {reviews.map(r => (
          <Card key={r.id}>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex" aria-label={`${r.rating} out of 5 stars`}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <Star key={n} className={`h-4 w-4 ${n <= r.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                  ))}
                </div>
                <span className="text-xs text-gray-500">{r.author_name || "Anonymous"} · {new Date(r.created_at).toLocaleString()}</span>
                {r.hidden === 1 && <Badge variant="outline" className="border-gray-300 text-gray-600 text-[10px]">Hidden</Badge>}
                {r.flagged_at && <Badge variant="outline" className="border-amber-300 text-amber-800 bg-amber-50 text-[10px]">Reported</Badge>}
              </div>
              <p className="text-xs text-gray-500">{r.location ?? `Location ${r.facility_key} (not claimed by any practice)`}</p>
              {r.comment ? <p className="text-sm text-gray-800 whitespace-pre-wrap">{r.comment}</p> : <p className="text-sm text-gray-400 italic">No comment.</p>}
              {r.reply_text && <p className="text-sm text-gray-600 border-l-2 border-gray-200 pl-3">Practice reply: {r.reply_text}</p>}
              {r.flag_reason && <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded p-2">Reported because: {r.flag_reason}</p>}
              <div className="flex gap-2 flex-wrap pt-1">
                {r.hidden === 1 ? (
                  <Button size="sm" variant="outline" disabled={busyId === r.id} onClick={() => act(r.id, "restore")}>Restore</Button>
                ) : (
                  <Button size="sm" variant="outline" disabled={busyId === r.id} onClick={() => act(r.id, "hide")}
                          className="text-red-700 border-red-200 hover:bg-red-50">Hide from the site</Button>
                )}
                {r.flagged_at && (
                  <Button size="sm" variant="ghost" disabled={busyId === r.id} onClick={() => act(r.id, "dismiss_flag")}>
                    Dismiss the report
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
