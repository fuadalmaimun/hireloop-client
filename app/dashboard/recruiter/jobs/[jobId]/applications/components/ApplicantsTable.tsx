"use client"

import { useMemo, useState } from "react"
import { Download, FileText, Mail, Search, Users } from "lucide-react"

import { toast } from "@/components/ui/toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ApplicationStatusBadge } from "@/app/browse-jobs/components/badges"
import { formatRelativeDate } from "@/lib/format"
import {
  APPLICATION_STATUSES,
  type Application,
  type ApplicationStatus,
} from "@/lib/types/application"
import {
  darkCardClass,
  ghostIconButtonClass,
  monoLabelClass,
  rowHoverClass,
  searchInputClass,
} from "@/lib/ui-styles"
import { updateApplications } from "@/lib/actions/applications"

// Recruiter-side applicant table for one job posting. Read-only data +
// an optimistic status dropdown; the database write for status changes is
// intentionally left out for now (see handleStatusChange).

type ApplicantsTableProps = {
  applications: Application[]
}

export function ApplicantsTable({ applications }: ApplicantsTableProps) {
  const [search, setSearch] = useState("")
  const [rows, setRows] = useState(applications)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return rows

    return rows.filter(
      (application) =>
        application.applicantName?.toLowerCase().includes(query) ||
        application.applicantEmail?.toLowerCase().includes(query)
    )
  }, [rows, search])

  // Pipeline snapshot — small stat strip above the table.
  const stats = useMemo(() => {
    const byStatus = (status: string) =>
      rows.filter((a) => a.status === status).length

    return {
      total: rows.length,
      underReview: byStatus("Under Review"),
      shortlisted: byStatus("Shortlisted"),
      offered: byStatus("Offered"),
    }
  }, [rows])

  // Optimistic status change — local rows only, DB write comes later.
  const handleStatusChange = async (id: string, status: string) => {
    const result = await updateApplications(id, { status })
    console.log("updated result", result)

      

    setRows((prev) =>
      prev.map((row) =>
        row._id === id
          ? { ...row, status: status as Application["status"] }
          : row
      )
    )

    // TODO(status-update): persist via the API once the endpoint exists.
    toast.add({
      title: `Marked as ${status}`,
      description: "Database persistence coming soon.",
      type: "info",
    })
  }

  return (
    <>
      {/* Pipeline stats */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Applicants", value: stats.total },
          { label: "Under Review", value: stats.underReview },
          { label: "Shortlisted", value: stats.shortlisted },
          { label: "Offered", value: stats.offered },
        ].map((stat) => (
          <div key={stat.label} className={`${darkCardClass} bg-[#0d0d10] p-4`}>
            <p className="text-sm text-[#a0a0ab]">{stat.label}</p>

            <p className="mt-1 font-manrope text-3xl font-bold tracking-tight">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search + export */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-white/30"
            aria-hidden="true"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by applicant name or email…"
            aria-label="Search applicants"
            className={`${searchInputClass} bg-[#0d0d10]`}
          />
        </div>

        <button
          type="button"
          className="flex h-11 shrink-0 items-center gap-2 rounded-lg border border-white/10 bg-[#0d0d10] px-4 text-sm font-medium text-white/70 transition-colors hover:border-white/30 hover:text-white"
        >
          <Download className="size-4" aria-hidden="true" />
          Export CSV
        </button>
      </div>

      {/* Applicant table */}
      <section className={`${darkCardClass} mt-6 overflow-hidden`}>
        {rows.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden min-w-0 lg:block">
              <div className="grid grid-cols-[1.5fr_1fr_1fr_0.9fr_1.2fr] items-center border-b border-white/[0.07] bg-[#1a1a1f] px-5 py-4">
                {[
                  "Applicant",
                  "Applied",
                  "Resume",
                  "Cover letter",
                  "Status",
                ].map((title) => (
                  <span
                    key={title}
                    className="text-xs font-medium tracking-wide text-[#a0a0ab] uppercase"
                  >
                    {title}
                  </span>
                ))}
              </div>

              {filtered.map((application) => (
                <ApplicantRow
                  key={application._id}
                  application={application}
                  onStatusChange={handleStatusChange}
                />
              ))}

              {filtered.length === 0 ? <NoMatches /> : null}
            </div>

            {/* Mobile cards */}
            <div className="flex flex-col divide-y divide-white/[0.07] lg:hidden">
              {filtered.map((application) => (
                <ApplicantCard
                  key={application._id}
                  application={application}
                  onStatusChange={handleStatusChange}
                />
              ))}

              {filtered.length === 0 ? <NoMatches /> : null}
            </div>
          </>
        )}
      </section>

      {rows.length > 0 ? (
        <p className="mt-4 px-1 text-xs text-white/35">
          Showing {filtered.length} of {rows.length} applicants
        </p>
      ) : null}
    </>
  )
}

/** One table row — status dropdown writes optimistic local state only. */
function ApplicantRow({
  application,
  onStatusChange,
}: {
  application: Application
  onStatusChange: (id: string, status: string) => void
}) {
  return (
    <div
      className={
        "grid grid-cols-[1.5fr_1fr_1fr_0.9fr_1.2fr] items-center border-t border-white/[0.07] px-5 py-4 first:border-t-0 " +
        rowHoverClass
      }
    >
      <ApplicantIdentity application={application} />

      <span className="text-sm text-[#a0a0ab]">
        {formatRelativeDate(application.dateApplied)}
      </span>

      <ResumeLink url={application.resumeUrl} />

      <span
        className="truncate text-sm text-[#a0a0ab]"
        title={application.coverLetter || undefined}
      >
        {application.coverLetter || "—"}
      </span>

      <StatusControl
        application={application}
        onStatusChange={onStatusChange}
      />
    </div>
  )
}

function ApplicantCard({
  application,

  onStatusChange,
}: {
  application: Application
  onStatusChange: (id: string, status: string) => void
}) {
  return (
    <article className={"p-5 sm:p-6 " + rowHoverClass}>
      <div className="flex items-start justify-between gap-4">
        <ApplicantIdentity application={application} />

        <ApplicationStatusBadge status={application.status} />
      </div>

      <p className="mt-3 text-xs text-[#a0a0ab]">
        Applied {formatRelativeDate(application.dateApplied)}
      </p>

      {application.coverLetter ? (
        <p className="mt-2 line-clamp-2 text-xs text-white/60">
          {application.coverLetter}
        </p>
      ) : null}

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/[0.07] pt-3">
        <ResumeLink url={application.resumeUrl} />

        <StatusControl
          application={application}
          onStatusChange={onStatusChange}
          compact
        />
      </div>
    </article>
  )
}

function ApplicantIdentity({ application }: { application: Application }) {
  const name = application.applicantName || "Unknown"

  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#222228] text-xs font-semibold text-[#ededef]">
        {name.charAt(0).toUpperCase()}
      </span>

      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-[#ededef]">{name}</p>

        <a
          href={`mailto:${application.applicantEmail}`}
          className="flex w-fit items-center gap-1 truncate text-xs text-white/40 transition-colors hover:text-white"
        >
          <Mail className="size-3" aria-hidden="true" />
          {application.applicantEmail}
        </a>
      </div>
    </div>
  )
}

function ResumeLink({ url }: { url?: string }) {
  if (!url) return <span className="text-sm text-white/30">—</span>

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-fit items-center gap-1.5 text-sm text-[#827aff] transition-colors hover:text-white"
    >
      <FileText className="size-4" aria-hidden="true" />
      Resume
    </a>
  )
}

/**
 * Status dropdown — updates local state optimistically. The database write
 * is not wired yet: when the backend lands, call
 * `PUT /applications/:id { status }` (or a server action) inside the
 * parent's handleStatusChange and reconcile any server errors with the
 * local rows.
 */
function StatusControl({
  application,
  onStatusChange,
  compact = false,
}: {
  application: Application
  onStatusChange: (id: string, status: string) => void
  compact?: boolean
}) {
  const onChange = (next: ApplicationStatus | null) => {
    if (!next || next === application.status) return

    onStatusChange(application._id, next)
  }

  if (compact) {
    return (
      <Select value={application.status} onValueChange={onChange}>
        <SelectTrigger
          className="h-8 w-36 rounded-lg border-white/10 bg-[#0d0d10] px-2 text-xs text-white"
          aria-label="Change applicant status"
        >
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {APPLICATION_STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  return (
    <div className="flex items-center justify-end gap-3">
      <ApplicationStatusBadge status={application.status} />

      <Select value={application.status} onValueChange={onChange}>
        <SelectTrigger
          className="h-8 w-9 rounded-md border-white/10 bg-[#0d0d10] px-0"
          aria-label="Change applicant status"
        >
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {APPLICATION_STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function NoMatches() {
  return (
    <p className="px-5 py-10 text-center text-sm text-white/45">
      No applicants match the current search.
    </p>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center px-5 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-[#222228]">
        <Users className="size-5 text-white/40" aria-hidden="true" />
      </span>

      <h2 className="mt-4 font-manrope text-lg font-semibold">
        No applicants yet
      </h2>

      <p className="mt-1.5 max-w-sm text-sm text-white/50">
        When seekers apply to this job, their submissions show up here for
        review.
      </p>

      <p className={`mt-4 ${monoLabelClass}`}>
        Share the job link to start receiving applications
      </p>
    </div>
  )
}
