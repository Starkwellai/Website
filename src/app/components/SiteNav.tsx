import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";

/**
 * Site header navigation, responsive.
 *
 * The four marketing pages each carried the same seven inline buttons with no
 * small-screen handling. At 375px that wrapped into a 113px-tall block of
 * overlapping targets — no horizontal overflow, so it was easy to miss, but
 * unusable on a phone.
 *
 * Wide screens get one row, larger type, spread evenly across the whole bar
 * (the "brand" look used by SiteHeader). Below that the links collapse behind a
 * hamburger. Defined once here so the pages stay in sync; previously adding
 * "Compare Prices" meant editing four files and I only edited one.
 */

interface NavLink {
  label: string;
  to?: string;          // absent = no destination yet
}

const LINKS: NavLink[] = [
  { label: "For Providers", to: "/providers" },
  { label: "Compare Prices", to: "/prices" },
  { label: "Hospital Stays", to: "/hospital-stays" },
  { label: "Saved", to: "/saved" },
  { label: "Utah Hub", to: "/utah" },
  { label: "About", to: "/about" },
  { label: "Trust & Safety", to: "/trust" },
  { label: "Help", to: "/help" },
];

interface Props {
  /** Route for the primary call to action. */
  ctaTo?: string;
  ctaLabel?: string;
  /** "light" = the original look for a white bar; "brand" = white text for the blue/teal header. */
  tone?: "light" | "brand";
}

export function SiteNav({ ctaTo = "/signup-consumer",
                          ctaLabel = "Accounts: Coming Soon",
                          tone = "light" }: Props) {
  const brand = tone === "brand";
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // Close on Escape, and whenever the viewport grows past the breakpoint —
  // otherwise resizing with the menu open leaves an orphaned panel over the
  // desktop layout. The brand row needs 1280px for larger type; the light one 1024px.
  useEffect(() => {
    const wide = brand ? 1280 : 1024;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const onResize = () => { if (window.innerWidth >= wide) setOpen(false); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [brand]);

  const go = (to?: string) => {
    setOpen(false);
    if (to) navigate(to);
  };

  return (
    <>
      {/* Desktop. Brand: fills the space beside the logo, items evenly spaced, type that grows with
          the screen (17px from 1280, 18px from 1400, 20px from 1536); each size was measured to
          fit on one line at its smallest width. Light: the original compact row. */}
      {brand ? (
        <div className="hidden xl:flex flex-1 items-center justify-evenly pl-4">
          {LINKS.map(l => (
            <Button
              key={l.label}
              variant="ghost"
              className="text-[17px] min-[1400px]:text-[18px] 2xl:text-xl font-medium px-2 min-[1400px]:px-3 h-11 text-white/95 hover:text-white hover:bg-white/15"
              onClick={() => go(l.to)}
            >
              {l.label}
            </Button>
          ))}
          <Button onClick={() => go(ctaTo)}
                  className="text-[17px] min-[1400px]:text-[18px] 2xl:text-xl h-11 px-4 min-[1400px]:px-5 bg-white text-blue-700 hover:bg-blue-50 font-semibold">
            {ctaLabel}
          </Button>
        </div>
      ) : (
        <div className="hidden lg:flex items-center gap-6">
          {LINKS.map(l => (
            <Button key={l.label} variant="ghost" className="text-gray-700 hover:text-blue-600" onClick={() => go(l.to)}>
              {l.label}
            </Button>
          ))}
          <Button onClick={() => go(ctaTo)} className="bg-blue-600 hover:bg-blue-700">
            {ctaLabel}
          </Button>
        </div>
      )}

      {/* Mobile trigger */}
      <button
        type="button"
        className={`${brand ? "xl:hidden" : "lg:hidden"} inline-flex items-center justify-center rounded-md p-2 focus:outline-none focus-visible:ring-2 ${
          brand ? "text-white hover:bg-white/15 focus-visible:ring-white" : "text-gray-700 hover:bg-gray-100 focus-visible:ring-blue-500"}`}
        aria-expanded={open}
        aria-controls="site-nav-mobile"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen(v => !v)}
      >
        {open ? <X className="size-7" /> : <Menu className="size-7" />}
      </button>

      {/* Mobile panel. Rendered as a sibling below the header bar rather than a
          fixed overlay, so it pushes content instead of covering a sticky
          header the user then cannot dismiss. */}
      {open && (
        <div
          id="site-nav-mobile"
          className={`${brand ? "xl:hidden" : "lg:hidden"} absolute left-0 right-0 top-full border-t border-gray-100 bg-white shadow-lg`}
        >
          <nav className="container mx-auto px-6 py-2 flex flex-col">
            {LINKS.map(l => (
              <button
                key={l.label}
                type="button"
                onClick={() => go(l.to)}
                className="w-full text-left py-3 text-lg text-gray-700 hover:text-blue-600 border-b border-gray-100 last:border-b-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                {l.label}
              </button>
            ))}
            <Button
              onClick={() => go(ctaTo)}
              className="bg-blue-600 hover:bg-blue-700 my-3"
            >
              {ctaLabel}
            </Button>
          </nav>
        </div>
      )}
    </>
  );
}
