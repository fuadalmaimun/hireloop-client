import type { JobStatus } from "@/lib/types/job"

// Small format/normalize helpers shared across dashboard pages.

export function formatDate(iso: string) {
  if (!iso) return "N/A"

  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

/**
 * The API may return the status in different casings ("Closed", "closed",
 * "CLOSED") or omit it entirely — normalize so filters and badges agree.
 */
export function normalizeStatus(raw: string | undefined): JobStatus {
  return raw?.trim().toLowerCase() === "closed" ? "Closed" : "Active"
}
