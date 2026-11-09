"use client"

import * as React from "react"
import Link from "next/link"
import { CalendarDays, Eye, PenLine, PlusCircle, Search } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { JobFormData } from "@/lib/types/job"
import { getJobs } from "@/lib/api/jobs"
import { DeleteJobDialog } from "@/app/componets/DeleteDialog"

const CATEGORY_LIST = ["Design", "Engineering", "Marketing"] as const

const selectClass =
  "h-10 rounded-lg border-white/15 bg-[#0d0d10] text-sm text-white focus-visible:border-[#5c53fe]/70 focus-visible:ring-[#5c53fe]/25 sm:w-44"

function StatusBadge({ status }: { status: JobFormData["status"] }) {
  const active = status === "Active"
  return (
    <span
      className={
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium " +
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
      {status}
    </span>
  )
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-[#1a1a1f] px-2.5 py-0.5 text-[11px] text-[#ededef]">
      {category}
    </span>
  )
}

function CompanyAvatar({ name }: { name?: string }) {
  const displayName = name || "Unknown"

  return (
    <span className="flex items-center gap-2.5">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#222228] text-[11px] font-semibold text-[#ededef]">
        {displayName.charAt(0).toUpperCase()}
      </span>
      <span className="text-sm text-[#ededef]">{displayName}</span>
    </span>
  )
}

function ActionButtons({
  job,
  onDelete,
}: {
  job: JobFormData
  onDelete: (idOrRef: string) => void
}) {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="View job"
        className="text-white/50 hover:bg-white/10 hover:text-white"
      >
        <Eye />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Edit job"
        className="text-white/50 hover:bg-white/10 hover:text-white"
      >
        <PenLine />
      </Button>
      <DeleteJobDialog
        job={job}
        onDelete={() => onDelete(job._id || job.ref)}
      />
    </div>
  )
}

function formatDate(iso: string) {
  if (!iso) return "N/A"
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default function ManageJobsPage() {
  const [jobs, setJobs] = React.useState<JobFormData[]>([])
  const [loading, setLoading] = React.useState(true)

  const [statusFilter, setStatusFilter] = React.useState("all")
  const [categoryFilter, setCategoryFilter] = React.useState("all")
  const [search, setSearch] = React.useState("")
  const [pillFilter, setPillFilter] = React.useState<
    "all" | "Active" | "Closed"
  >("all")

  React.useEffect(() => {
    getJobs()
      .then((data) => {
        setJobs(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Failed to fetch jobs:", err)
        setLoading(false)
      })
  }, [])

  const deleteJob = (idOrRef: string) => {
    setJobs((prev) =>
      prev.filter((job) => job._id !== idOrRef && job.ref !== idOrRef)
    )
    // TODO: call API to delete the job post from backend
  }

  const filtered = jobs.filter((job) => {
    if (pillFilter !== "all" && job.status !== pillFilter) return false
    if (statusFilter === "active" && job.status !== "Active") return false
    if (statusFilter === "closed" && job.status !== "Closed") return false
    if (categoryFilter !== "all" && job.category !== categoryFilter)
      return false
    if (
      search &&
      !job.jobTitle.toLowerCase().includes(search.toLowerCase()) &&
      !job.ref.toLowerCase().includes(search.toLowerCase())
    )
      return false
    return true
  })

  const activeCount = jobs.filter((job) => job.status === "Active").length
  const closedCount = jobs.filter((job) => job.status === "Closed").length

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#010109] text-white">
        <p className="text-sm text-white/50">Loading jobs...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#010109] text-white">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-manrope text-2xl font-bold tracking-tight sm:text-3xl">
              Manage Jobs
            </h1>
            <p className="mt-1.5 max-w-md text-sm text-[#a0a0ab]">
              Oversee all active listings and historical job posts across the
              platform.
            </p>
          </div>

          <Button
            render={<Link href="/dashboard/recruiter/job/new" />}
            nativeButton={false}
            className="h-10 shrink-0 rounded-lg bg-[#5c53fe] px-4 text-sm font-medium text-white shadow-[0_0_15px_rgba(92,83,254,0.35)] hover:bg-[#6c63ff]"
          >
            <PlusCircle className="size-4" aria-hidden="true" />
            Create Job
          </Button>
        </div>

        {/* Filters Section */}
        <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <p className="font-mono text-xs tracking-[0.2em] text-white/40 uppercase">
                Status
              </p>
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as string)}
              >
                <SelectTrigger className={selectClass}>
                  <SelectValue>
                    {statusFilter === "active"
                      ? "Active"
                      : statusFilter === "closed"
                        ? "Closed"
                        : "All Statuses"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <p className="font-mono text-xs tracking-[0.2em] text-white/40 uppercase">
                Category
              </p>
              <Select
                value={categoryFilter}
                onValueChange={(v) => setCategoryFilter(v as string)}
              >
                <SelectTrigger className={selectClass}>
                  <SelectValue>
                    {categoryFilter === "all"
                      ? "All Categories"
                      : categoryFilter}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORY_LIST.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="font-mono text-xs tracking-[0.2em] text-white/40 uppercase">
              Quick filter
            </p>
            <div className="flex w-fit items-center gap-1 rounded-lg border border-white/10 bg-[#0d0d10] p-1">
              {(
                [
                  { value: "all", label: "All" },
                  { value: "Active", label: `Active (${activeCount})` },
                  { value: "Closed", label: `Closed (${closedCount})` },
                ] as const
              ).map((pill) => (
                <button
                  key={pill.value}
                  type="button"
                  onClick={() => setPillFilter(pill.value)}
                  className={
                    "flex h-7 items-center rounded-md px-3 text-xs font-medium transition-colors " +
                    (pillFilter === pill.value
                      ? "bg-[#5c53fe] text-white"
                      : "text-white/55 hover:text-white")
                  }
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mt-5">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/30"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search by job title or ref…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 rounded-lg border-white/15 bg-[#0d0d10] pl-9 text-sm text-white placeholder:text-white/30 focus-visible:border-[#5c53fe]/70 focus-visible:ring-[#5c53fe]/25"
          />
        </div>

        {/* Data Table Section */}
        <section className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-[#141418]">
          <div className="hidden min-w-0 lg:block">
            <div className="grid grid-cols-[1.7fr_1.4fr_1.1fr_0.9fr_1.1fr_1fr_0.9fr] items-center border-b border-white/[0.07] bg-[#1a1a1f] px-4 py-3">
              <span className="text-xs font-medium tracking-wide text-[#a0a0ab] uppercase">
                Title
              </span>
              <span className="text-xs font-medium tracking-wide text-[#a0a0ab] uppercase">
                Company
              </span>
              <span className="text-xs font-medium tracking-wide text-[#a0a0ab] uppercase">
                Category
              </span>
              <span className="text-xs font-medium tracking-wide text-[#a0a0ab] uppercase">
                Type
              </span>
              <span className="text-xs font-medium tracking-wide text-[#a0a0ab] uppercase">
                Date Posted
              </span>
              <span className="text-xs font-medium tracking-wide text-[#a0a0ab] uppercase">
                Status
              </span>
              <span className="text-right text-xs font-medium tracking-wide text-[#a0a0ab] uppercase">
                Actions
              </span>
            </div>

            {filtered.map((jobItem) => (
              <div
                key={jobItem._id || jobItem.ref}
                className="grid grid-cols-[1.7fr_1.4fr_1.1fr_0.9fr_1.1fr_1fr_0.9fr] items-center border-t border-white/[0.07] px-4 py-3 first:border-t-0"
              >
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate text-sm font-medium text-[#ededef]">
                    {jobItem.jobTitle}
                  </span>
                  <span className="text-xs text-[#a0a0ab]">
                    Ref: {jobItem.ref}
                  </span>
                </div>
                <CompanyAvatar name={jobItem.companyName} />
                <div>
                  <CategoryBadge category={jobItem.category} />
                </div>
                <span className="text-sm text-[#a0a0ab]">
                  {jobItem.jobType}
                </span>
                <span className="text-sm text-[#a0a0ab]">
                  {formatDate(jobItem.datePosted)}
                </span>
                <div>
                  <StatusBadge status={jobItem.status} />
                </div>
                <div className="flex justify-end">
                  <ActionButtons job={jobItem} onDelete={deleteJob} />
                </div>
              </div>
            ))}
          </div>

          {/* Mobile/tablet cards */}
          <div className="flex flex-col divide-y divide-white/[0.07] lg:hidden">
            {filtered.map((jobItem) => (
              <article key={jobItem._id || jobItem.ref} className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <h3 className="truncate text-sm font-semibold text-[#ededef]">
                      {jobItem.jobTitle}
                    </h3>
                    <span className="text-xs text-[#a0a0ab]">
                      Ref: {jobItem.ref}
                    </span>
                  </div>
                  <StatusBadge status={jobItem.status} />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#a0a0ab]">
                  <CompanyAvatar name={jobItem.companyName} />
                  <CategoryBadge category={jobItem.category} />
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="size-3.5" aria-hidden="true" />
                    {formatDate(jobItem.datePosted)}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-[#a0a0ab]">
                    {jobItem.jobType} · {jobItem.workplaceType}
                  </span>
                  <ActionButtons job={jobItem} onDelete={deleteJob} />
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-white/45">
              No job posts match the current filters.
            </div>
          )}
        </section>

        <p className="mt-3 text-xs text-white/35">
          Showing {filtered.length} of {jobs.length} job posts
        </p>
      </main>
    </div>
  )
}
