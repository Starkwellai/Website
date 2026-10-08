import { Clock, Globe, Phone, ShieldCheck } from "lucide-react";
import type { PublicListingClaim } from "../../lib/starkwell";

/**
 * What an approved practice wrote about itself: phone, website, hours, insurance note.
 * Shown on the facility page and under a facility in price search. Everything here is
 * written by the practice, not checked by Starkwell, and the label says so. The website
 * is only ever rendered as a link when the server accepted it as an http(s) address.
 */
export function PracticeDetails({ claim }: { claim: PublicListingClaim }) {
  const hasAny = claim.phone || claim.website || claim.hours || claim.insurance_note;
  if (!hasAny) return null;
  return (
    <div className="mt-2 space-y-1 text-sm text-gray-700">
      {claim.phone && (
        <p className="flex items-center gap-2">
          <Phone className="size-4 text-gray-400 shrink-0" />
          <a href={`tel:${claim.phone.replace(/[^\d+]/g, "")}`} className="hover:underline">{claim.phone}</a>
        </p>
      )}
      {claim.website && (
        <p className="flex items-center gap-2 min-w-0">
          <Globe className="size-4 text-gray-400 shrink-0" />
          <a href={claim.website} target="_blank" rel="noopener noreferrer nofollow"
             className="text-blue-600 hover:underline truncate">{claim.website.replace(/^https?:\/\//i, "")}</a>
        </p>
      )}
      {claim.hours && (
        <p className="flex items-start gap-2">
          <Clock className="size-4 text-gray-400 shrink-0 mt-0.5" />
          <span className="whitespace-pre-wrap">{claim.hours}</span>
        </p>
      )}
      {claim.insurance_note && (
        <p className="flex items-start gap-2">
          <ShieldCheck className="size-4 text-gray-400 shrink-0 mt-0.5" />
          <span><span className="text-gray-500">Insurance: </span>{claim.insurance_note}</span>
        </p>
      )}
      <p className="text-xs text-gray-400">Details provided by the practice; not checked by Starkwell.</p>
    </div>
  );
}
