/**
 * Small inline tag for a feature we describe but haven't built. Use it next to
 * the feature's name so a visitor can't read the line as something that works
 * today. Keep the wording identical everywhere ("Coming soon") so it reads as
 * one consistent promise-vs-reality convention across the site.
 */
export function ComingSoonBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block align-middle rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-800 ${className}`}
    >
      Coming soon
    </span>
  );
}
