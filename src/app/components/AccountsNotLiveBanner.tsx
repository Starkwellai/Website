import { Info } from "lucide-react";

/**
 * Top-of-page note for the signed-in-style pages (dashboard, settings,
 * profile, notifications). There is no patient account system yet — no sign-up
 * stores anything and nobody is signed in — so these pages are a preview of
 * what accounts will look like, not a place where settings are kept.
 */
export function AccountsNotLiveBanner() {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900" role="note">
      <Info className="mt-0.5 size-5 shrink-0" />
      <p>
        <strong>Preview only — patient accounts are coming soon.</strong> Nothing on this page is
        saved or sent to us yet, and no one is signed in. Price search, hospital stays and drug
        prices work today without an account.
      </p>
    </div>
  );
}
