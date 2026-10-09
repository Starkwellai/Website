import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { SiteNav } from "./SiteNav";
import logo from "../../assets/b2725744d7bb552f20e2a7bcebca16e19b4a014d.png";

/**
 * The site's top bar, used on every public page: brand-colored (the same blue-to-teal as the
 * site's call-to-action bands), with the logo on a white tile hard against the left edge of the
 * page, not inset inside a centered container. Navigation fills the rest of the bar, evenly
 * spaced, on wide screens and collapses behind a menu button on smaller ones.
 *
 *   <SiteHeader />                       full navigation (most pages)
 *   <SiteHeader ctaTo=".." ctaLabel=".." /> a different call-to-action button
 *   <SiteHeader minimal />               logo only, for focused flows (sign in, sign up)
 *   <SiteHeader right={...} />           your own controls on the right (the practice dashboard)
 */
export function SiteHeader({ ctaTo, ctaLabel, minimal = false, right }: {
  ctaTo?: string;
  ctaLabel?: string;
  minimal?: boolean;
  right?: ReactNode;
}) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-700 via-blue-600 to-teal-500 shadow-md">
      <div className="flex items-center justify-between gap-3 pl-2 pr-2 sm:pl-3 sm:pr-4 xl:pl-4 xl:pr-6 py-2 xl:py-3">
        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="Starkwell home"
          className="shrink-0 rounded-lg bg-white p-1.5 xl:p-2 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <img src={logo} alt="Starkwell" className="h-8 xl:h-11 w-auto rounded-[5px] block" />
        </button>
        {right ? (
          <div className="flex items-center gap-2 md:gap-4">{right}</div>
        ) : minimal ? null : (
          <SiteNav tone="brand" ctaTo={ctaTo} ctaLabel={ctaLabel} />
        )}
      </div>
    </header>
  );
}
