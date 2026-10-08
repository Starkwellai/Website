import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { MessageSquare, Star } from "lucide-react";
import {
  getMyReviews, replyToReview, deleteReviewReply, flagReview,
  type ProviderReview, type ProviderReviewSummary,
} from "../../lib/starkwell";

/**
 * Reviews patients have left for a practice's APPROVED locations. A practice can reply once
 * per review (the reply is shown publicly under it) and can report a review to Starkwell;
 * only Starkwell can hide one. Reviews are anonymous and unverified, which is why a report
 * goes to a person instead of removing the review automatically.
 */
export function ProviderReviewsCard() {
  const [locations, setLocations] = useState<ProviderReviewSummary[]>([]);
  const [reviews, setReviews] = useState<ProviderReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [replyingId, setReplyingId] = useState<number | null>(null);
  const [replyDraft, setReplyDraft] = useState("");
  const [reportingId, setReportingId] = useState<number | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  async function load() {
    try {
      const r = await getMyReviews();
      setLocations(r.locations); setReviews(r.reviews); setError(null);
    } catch {
      setError("Couldn't load your reviews — try again in a moment.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { void load(); }, []);

  async function run(action: () => Promise<void>, done: () => void) {
    setBusy(true); setActionError(null);
    try { await action(); done(); await load(); }
    catch (e) { setActionError(e instanceof Error ? e.message : "That didn't work — try again."); }
    finally { setBusy(false); }
  }

  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="size-5 text-blue-600" />
          Patient reviews
        </CardTitle>
        <CardDescription>
          Reviews left for your approved locations. You can reply publicly, or report a review that
          isn&rsquo;t from a real patient or breaks the rules.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && <p className="text-sm text-gray-500">Loading…</p>}
        {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
        {actionError && <p className="text-sm text-red-700" role="alert">{actionError}</p>}

        {!loading && !error && locations.length === 0 && (
          <p className="text-sm text-gray-600 py-4 text-center">
            Reviews show up here once one of your locations is approved.
          </p>
        )}

        {locations.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {locations.map(l => (
              <Badge key={l.facility_key} variant="outline" className="bg-white text-gray-700">
                {l.facility_label}: {l.count === 0 ? "no reviews yet" : `${l.average}/5 from ${l.count} ${l.count === 1 ? "review" : "reviews"}`}
              </Badge>
            ))}
          </div>
        )}

        <ul className="space-y-4 divide-y divide-gray-100">
          {reviews.map(r => (
            <li key={r.id} className="pt-4 first:pt-0">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex" aria-label={`${r.rating} out of 5 stars`}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <Star key={n} className={`h-4 w-4 ${n <= r.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                  ))}
                </div>
                <span className="text-xs text-gray-500">
                  {r.author_name || "Anonymous"} · {new Date(r.created_at).toLocaleDateString()} · {r.facility_label}
                </span>
                {r.flagged_at && <Badge variant="outline" className="border-amber-300 text-amber-800 bg-amber-50 text-[10px]">Reported</Badge>}
              </div>
              {r.comment && <p className="text-sm text-gray-800 mt-1 whitespace-pre-wrap">{r.comment}</p>}

              {r.reply_text && replyingId !== r.id && (
                <div className="mt-2 ml-3 pl-3 border-l-2 border-blue-200">
                  <p className="text-xs text-gray-500">Your public reply · {r.reply_at ? new Date(r.reply_at).toLocaleDateString() : ""}</p>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">{r.reply_text}</p>
                </div>
              )}

              {replyingId === r.id ? (
                <div className="mt-2 space-y-2">
                  <Textarea value={replyDraft} onChange={e => setReplyDraft(e.target.value)} maxLength={1000} rows={3}
                            placeholder="Write a reply. Patients will see it under their review. Please don't include any health information." />
                  <div className="flex gap-2">
                    <Button size="sm" disabled={busy || !replyDraft.trim()} className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => run(() => replyToReview(r.id, replyDraft.trim()), () => setReplyingId(null))}>
                      {busy ? "Saving…" : "Post reply"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setReplyingId(null)}>Cancel</Button>
                  </div>
                </div>
              ) : reportingId === r.id ? (
                <div className="mt-2 space-y-2">
                  <Textarea value={reportReason} onChange={e => setReportReason(e.target.value)} maxLength={300} rows={2}
                            placeholder="Why should Starkwell look at this review? (for example: not a patient of ours, spam, abusive)" />
                  <div className="flex gap-2">
                    <Button size="sm" disabled={busy || reportReason.trim().length < 3}
                            onClick={() => run(() => flagReview(r.id, reportReason.trim()), () => { setReportingId(null); setReportReason(""); })}>
                      {busy ? "Sending…" : "Send report"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setReportingId(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="mt-2 flex gap-2 flex-wrap">
                  <Button size="sm" variant="outline" onClick={() => { setReplyingId(r.id); setReplyDraft(r.reply_text ?? ""); setReportingId(null); setActionError(null); }}>
                    {r.reply_text ? "Edit reply" : "Reply"}
                  </Button>
                  {r.reply_text && (
                    <Button size="sm" variant="ghost" disabled={busy} onClick={() => run(() => deleteReviewReply(r.id), () => undefined)}>
                      Remove reply
                    </Button>
                  )}
                  {!r.flagged_at && (
                    <Button size="sm" variant="ghost" className="text-gray-600"
                            onClick={() => { setReportingId(r.id); setReportReason(""); setReplyingId(null); setActionError(null); }}>
                      Report
                    </Button>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
        {!loading && locations.length > 0 && reviews.length === 0 && (
          <p className="text-sm text-gray-600">No reviews yet for your locations.</p>
        )}
      </CardContent>
    </Card>
  );
}
