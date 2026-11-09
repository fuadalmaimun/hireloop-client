// Small presentational badges/avatars shared by job list views.

import type { JobStatus } from "@/lib/types/job"
import { normalizeStatus } from "@/lib/format"

export function StatusBadge({ status }: { status: JobStatus }) {
  const active = normalizeStatus(status) === "Active"

  return (
    <span
      className={
        "inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium " +
        (active
          ? "border-[#22c55e] bg-[#22c55e]/10 text-[#22c55e]"
          : "border-white/10 bg-[#a1a4aa]/15 text-[#a0a0ab]")
      }
    >
      <span
        className={
          "size-1.5 rounded-full " + (active ? "bg-[#22c55e]" : "bg-[#a1a4aa]")
        }
        aria-hidden="true"
      />
      {active ? "Active" : "Closed"}
    </span>
  )
}

export function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex w-fit items-center rounded-full border border-white/10 bg-[#1a1a1f] px-3 py-1 text-[11px] text-[#ededef]">
      {category}
    </span>
  )
}

export function CompanyAvatar({ name }: { name?: string }) {
  const displayName = name || "Unknown"

  return (
    <span className="flex min-w-0 items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#222228] text-xs font-semibold text-[#ededef]">
        {displayName.charAt(0).toUpperCase()}
      </span>
      <span className="truncate text-sm text-[#ededef]">{displayName}</span>
    </span>
  )
}
