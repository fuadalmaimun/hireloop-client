"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { BriefcaseBusiness, ExternalLink, MapPin, Search, FileText } from "lucide-react"

import type { Application } from "@/lib/types/application"
import { APPLICATION_STATUSES } from "@/lib/types/application"
import { formatRelativeDate } from "@/lib/format"
import {
  darkCardClass,
  monoLabelClass,
  searchInputClass,
} from "@/lib/ui-styles"
import { ApplicationStatusBadge } from "@/app/browse-jobs/components/badges"
import { FilterSelect } from "@/app/browse-jobs/components/FilterSelect"

type Props = { applications: Application[] }

export function ApplicationsTable({ applications }: Props) {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [activeTab, setActiveTab] = useState<"Active" | "Archived">("Active")

  // Statistics calculation
  const totalApplied = applications.length
  const shortlistedCount = applications.filter(app => app.status?.toLowerCase() === "shortlisted").length
  const interviewsCount = applications.filter(app => app.status?.toLowerCase() === "interview" || app.status?.toLowerCase() === "review").length
  const successRate = totalApplied > 0 ? Math.round((applications.filter(app => app.status?.toLowerCase() === "offered").length / totalApplied) * 100) : 0

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase()

    return applications.filter((application) => {
      const matchesSearch =
        !query ||
        application.jobTitle?.toLowerCase().includes(query) ||
        application.companyName?.toLowerCase().includes(query)

      const matchesStatus =
        status === "all" ||
        application.status?.toLowerCase() === status.toLowerCase()

      return matchesSearch && matchesStatus
    })
  }, [applications, search, status])

  return (
    <div className="space-y-6">
      {/* Top Header & Export PDF */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-manrope">My Applications</h1>
          <p className="text-sm text-white/60 mt-1">
            Track your job applications and interview progress in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-lg bg-[#1a1a1f] p-1 border border-white/10">
            <button
              onClick={() => setActiveTab("Active")}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === "Active" ? "bg-[#2a2a35] text-white" : "text-white/60 hover:text-white"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab("Archived")}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === "Archived" ? "bg-[#2a2a35] text-white" : "text-white/60 hover:text-white"
              }`}
            >
              Archived
            </button>
          </div>

          <button
            onClick={() => alert("Exporting PDF...")}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-medium text-black hover:bg-white/90 transition"
          >
            <FileText className="size-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className={`${darkCardClass} p-5`}>
          <p className="text-xs font-medium text-white/50 uppercase tracking-wider">Total Applied</p>
          <p className="text-3xl font-bold text-white mt-2">{totalApplied}</p>
        </div>
        <div className={`${darkCardClass} p-5`}>
          <p className="text-xs font-medium text-white/50 uppercase tracking-wider">Shortlisted</p>
          <p className="text-3xl font-bold text-white mt-2">{shortlistedCount}</p>
        </div>
        <div className={`${darkCardClass} p-5`}>
          <p className="text-xs font-medium text-white/50 uppercase tracking-wider">Interviews / Review</p>
          <p className="text-3xl font-bold text-amber-400 mt-2">{interviewsCount}</p>
        </div>
        <div className={`${darkCardClass} p-5`}>
          <p className="text-xs font-medium text-white/50 uppercase tracking-wider">Success Rate</p>
          <p className="text-3xl font-bold text-emerald-400 mt-2">{successRate}%</p>
        </div>
      </div>

      {/* Filters Section */}
      <section className="mt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2">
            <label htmlFor="application-search" className={monoLabelClass}>
              Search
            </label>

            <div className="relative">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/40"
                aria-hidden="true"
              />
              <input
                id="application-search"
                type="text"
                placeholder="Job title or company"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className={searchInputClass + " w-full sm:w-64"}
              />
            </div>
          </div>

          <FilterSelect
            label="Status"
            value={status}
            onValueChange={setStatus}
            options={APPLICATION_STATUSES}
            allLabel="All statuses"
          />
        </div>

        {applications.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Desktop table */}
            <div className={`${darkCardClass} mt-5 hidden overflow-hidden lg:block`}>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.03]">
                    {["Job Title", "Company", "Applied", "Status", "Action"].map(
                      (heading) => (
                        <th
                          key={heading}
                          className={
                            "px-4 py-3 font-medium " + monoLabelClass
                          }
                        >
                          {heading}
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody>
                  {visible.map((application) => (
                    <tr
                      key={application._id}
                      className="border-b border-white/5 transition-colors last:border-0 hover:bg-white/[0.03]"
                    >
                      <td className="max-w-[260px] px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white">
                            <BriefcaseBusiness className="size-4 text-white/70" />
                          </span>
                          <div className="truncate">
                            <p className="truncate font-medium text-white">
                              {application.jobTitle}
                            </p>
                            {application.jobRef ? (
                              <p className={monoLabelClass}>{application.jobRef}</p>
                            ) : null}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-[#ededef]">
                        {application.companyName}
                      </td>

                      <td className="px-4 py-3.5 text-white/60">
                        {formatRelativeDate(application.dateApplied)}
                      </td>

                      <td className="px-4 py-3.5">
                        <ApplicationStatusBadge status={application.status} />
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <ViewDetailsLink jobId={application.jobId} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {visible.length === 0 ? <NoResults /> : null}
            </div>

            {/* Tablet + mobile cards */}
            <div className="mt-5 flex flex-col gap-3 lg:hidden">
              {visible.map((application) => (
                <article
                  key={application._id}
                  className={`${darkCardClass} p-4`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-white">
                        {application.jobTitle}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-white/60">
                        <BriefcaseBusiness
                          className="size-3.5 shrink-0"
                          aria-hidden="true"
                        />
                        {application.companyName}
                      </p>
                    </div>

                    <ApplicationStatusBadge status={application.status} />
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-xs text-white/50">
                      Applied {formatRelativeDate(application.dateApplied)}
                    </p>

                    <ViewDetailsLink jobId={application.jobId} />
                  </div>
                </article>
              ))}

              {visible.length === 0 ? <NoResults mobile /> : null}
            </div>
          </>
        )}
      </section>
    </div>
  )
}

function ViewDetailsLink({ jobId }: { jobId: string }) {
  return (
    <Link
      href={`/jobs/${jobId}`}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs font-medium text-white/70 transition-colors hover:border-[#5c53fe]/60 hover:bg-[#5c53fe]/10 hover:text-white"
    >
      Details
      <ExternalLink className="size-3.5" aria-hidden="true" />
    </Link>
  )
}

function NoResults({ mobile = false }: { mobile?: boolean }) {
  return (
    <div
      className={
        (mobile ? "" : "border-t border-white/10 ") +
        "px-4 py-10 text-center text-sm text-white/50"
      }
    >
      No applications match your filters.
    </div>
  )
}

function EmptyState() {
  return (
    <div className={`${darkCardClass} mt-5 flex flex-col items-center px-4 py-14 text-center`}>
      <span className="flex size-12 items-center justify-center rounded-full bg-[#222228]">
        <MapPin className="size-5 text-white/40" aria-hidden="true" />
      </span>

      <h2 className="mt-4 font-manrope text-lg font-semibold text-white">
        No applications yet
      </h2>

      <p className="mt-1.5 max-w-sm text-sm text-white/50">
        When you apply to a job, your submission shows up here with its
        current status.
      </p>

      <Link
        href="/browse-jobs"
        className="mt-5 inline-flex h-10 items-center rounded-lg bg-[#5c53fe] px-5 text-sm font-medium text-white shadow-[0_0_15px_rgba(92,83,254,0.35)] transition hover:bg-[#6c63ff]"
      >
        Browse jobs
      </Link>
    </div>
  )
}