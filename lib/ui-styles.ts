// Shared Tailwind class strings for the dark dashboard UI.
// Keep these in sync with the Figma tokens — editing once updates every page.

/** Text fields in forms (job/new page). */
export const inputClass =
  "h-10 rounded-lg border-white/15 bg-[#0d0d10] text-sm text-white placeholder:text-white/30 focus-visible:border-[#5c53fe]/70 focus-visible:ring-[#5c53fe]/25"

/** Job description textarea (multi-line form field). */
export const textareaClass =
  "min-h-32 rounded-lg border-white/15 bg-[#0d0d10] text-sm text-white placeholder:text-white/30 focus-visible:border-[#5c53fe]/70 focus-visible:ring-[#5c53fe]/25"

/** Filter selects in the Manage Jobs table. */
export const selectClass =
  "h-11 rounded-lg border-white/15 bg-[#0d0d10] px-2 text-sm text-white focus-visible:border-[#5c53fe]/70 focus-visible:ring-[#5c53fe]/25 sm:w-48"

/** Search input with the filter selects' height (icon sits over pl-10). */
export const searchInputClass =
  "h-11 rounded-lg border-white/15 bg-[#0d0d10] pr-4 pl-10 text-sm text-white placeholder:text-white/30 focus-visible:border-[#5c53fe]/70 focus-visible:ring-[#5c53fe]/25"

/** Uppercase monospace mini-label above filters ("STATUS", "QUICK FILTER"). */
export const monoLabelClass =
  "font-mono text-xs tracking-[0.2em] text-white/40 uppercase"

/** Dark card / table shell used across dashboard pages. */
export const darkCardClass =
  "rounded-xl border border-white/10 bg-[#141418]"

/** Ghost-ish icon buttons (view/edit actions). */
export const ghostIconButtonClass =
  "text-white/50 hover:bg-white/10 hover:text-white"
