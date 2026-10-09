import { useNavigate } from "react-router";
import { SiteNav } from "./SiteNav";
import logo from "../../assets/b2725744d7bb552f20e2a7bcebca16e19b4a014d.png";

/**
 * The site's top bar: brand-colored (the same blue-to-teal as the site's call-to-action
 * bands), with the logo on a white tile hard against the left edge of the page, not inset
 * inside a centered container, so it reads as the first thing on the page on any screen.
 * Taller than the old plain white bar. Used by the pages one at a time; the older pages
 * still carry their own copy of the plain header.
 */
export function SiteHeader({ ctaTo, ctaLabel }: { ctaTo?: string; ctaLabel?: string }) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-700 via-blue-600 to-teal-500 shadow-md">
      <div className="flex items-center justify-between gap-3 pl-2 pr-2 sm:pl-3 sm:pr-4 lg:pl-4 lg:pr-6 py-2 lg:py-3">
        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="Starkwell home"
          className="shrink-0 rounded-lg bg-white p-1.5 lg:p-2 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <img src={logo} alt="Starkwell" className="h-8 lg:h-11 w-auto rounded-[5px] block" />
        </button>
        <SiteNav tone="brand" ctaTo={ctaTo} ctaLabel={ctaLabel} />
      </div>
    </header>
  );
}
