import logo from "../../assets/b2725744d7bb552f20e2a7bcebca16e19b4a014d.png";

/**
 * Shared Starkwell wordmark. The zip's original version was a placeholder
 * (`<!-- PASTE YOUR SVG CODE HERE -->` around a generic "STARKWELL" text
 * glyph) — this points at the real logo asset used everywhere else in the
 * site instead.
 *
 * Most pages in this codebase import the logo image directly in their header
 * markup (see Home.tsx, Dashboard.tsx, Utah.tsx) rather than going through a
 * component, so this is provided for completeness / future reuse rather than
 * wired into every header.
 */
export function Logo({ className = "h-8 w-auto" }: { className?: string }) {
  return <img src={logo} alt="Starkwell" className={className} />;
}
