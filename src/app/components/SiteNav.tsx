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
 * Desktop keeps the existing horizontal row. Below `md` the links collapse
 * behind a hamburger. Defined once here so the pages stay in sync; previously
 * adding "Compare Prices" meant editing four files and I only edited one.
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
  // desktop layout.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const onResize = () => { if (window.innerWidth >= 1024) setOpen(false); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const go = (to?: string) => {
    setOpen(false);
    if (to) navigate(to);
  };

  return (
    <>
      {/* Desktop */}
      <div className={`hidden lg:flex items-center ${brand ? "gap-1" : "gap-6"}`}>
        {LINKS.map(l => (
          <Button
            key={l.label}
            variant="ghost"
            className={brand ? "text-white/95 hover:text-white hover:bg-white/15" : "text-gray-700 hover:text-blue-600"}
            onClick={() => go(l.to)}
          >
            {l.label}
          </Button>
        ))}
        <Button onClick={() => go(ctaTo)}
                className={brand ? "ml-2 bg-white text-blue-700 hover:bg-blue-50 font-semibold" : "bg-blue-600 hover:bg-blue-700"}>
          {ctaLabel}
        </Button>
      </div>

      {/* Mobile trigger */}
      <button
        type="button"
        className={`lg:hidden inline-flex items-center justify-center rounded-md p-2 focus:outline-none focus-visible:ring-2 ${
          brand ? "text-white hover:bg-white/15 focus-visible:ring-white" : "text-gray-700 hover:bg-gray-100 focus-visible:ring-blue-500"}`}
        aria-expanded={open}
        aria-controls="site-nav-mobile"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen(v => !v)}
      >
        {open ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>

      {/* Mobile panel. Rendered as a sibling below the header bar rather than a
          fixed overlay, so it pushes content instead of covering a sticky
          header the user then cannot dismiss. */}
      {open && (
        <div
          id="site-nav-mobile"
          className="lg:hidden absolute left-0 right-0 top-full border-t border-gray-100 bg-white shadow-lg"
        >
          <nav className="container mx-auto px-6 py-2 flex flex-col">
            {LINKS.map(l => (
              <button
                key={l.label}
                type="button"
                onClick={() => go(l.to)}
                className="w-full text-left py-3 text-gray-700 hover:text-blue-600 border-b border-gray-100 last:border-b-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
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
