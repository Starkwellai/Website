import type { ReactNode } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

/**
 * One definition per term, written for someone who has never dealt with
 * insurance billing before — Starkwell's own promise on Home is to translate
 * exactly this kind of language, so the definitions live here instead of
 * assuming a glossary page nobody will go find on their own.
 */
export const GLOSSARY = {
  median: "The middle price when every real negotiated rate for this service is lined up from lowest to highest — half the rates are above it, half below. Used instead of an average so one unusually high or low rate can't skew the number.",
  "negotiated rate": "The specific price an insurer and a provider agreed to in their contract. Not a sticker price, not an estimate — this is the number Starkwell shows everywhere a price appears.",
  "in-network": "This provider has a contracted rate with your specific insurance plan. Going here means that negotiated price and your plan's normal cost-sharing apply.",
  coinsurance: "After you've met your deductible, the percentage of the bill you still pay yourself — your plan covers the rest, up to your out-of-pocket maximum.",
  copay: "A flat dollar amount you pay for a visit or service, instead of a percentage of the bill. Set by your plan, not by the provider.",
  deductible: "How much you have to pay out of pocket for covered care before your insurance starts sharing the cost.",
  "out-of-pocket maximum": "The most you'll pay in a year for covered care. Once you hit it, your plan covers 100% of everything else that's covered.",
} as const satisfies Record<string, string>;

export type GlossaryKey = keyof typeof GLOSSARY;

/**
 * Tap/click-to-open, not hover — same reasoning as FullRangeInfo in
 * PriceSearch.tsx: a title attribute or hover-only tooltip never opens on a
 * touch screen, and this needs to work for every visitor, not just desktop
 * mouse users. stopPropagation matters because most call sites sit inside a
 * whole-card onClick (selecting a facility/provider).
 */
export function GlossaryTerm({ term, children }: { term: GlossaryKey; children?: ReactNode }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <span
          role="button"
          tabIndex={0}
          onClick={e => e.stopPropagation()}
          // A span with role="button" gets click from the mouse but not
          // from Enter/Space the way a real <button> does — without this a
          // keyboard user can focus the term and never open the definition.
          onKeyDown={e => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); e.currentTarget.click(); }
          }}
          className="underline decoration-dotted decoration-gray-400 underline-offset-2 cursor-pointer hover:decoration-gray-600"
        >
          {children ?? term}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-72 text-sm text-gray-700" onClick={e => e.stopPropagation()}>
        {GLOSSARY[term]}
      </PopoverContent>
    </Popover>
  );
}
