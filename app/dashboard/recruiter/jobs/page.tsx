"use client";

import * as React from "react";
import Link from "next/link";
import { CalendarDays, Eye, PenLine, PlusCircle, Search, Trash2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { JobFormData } from "@/lib/types/job";



const DUMMY_JOBS: JobFormData[] = [
  {
    ref: "HL-90210",
    jobTitle: "Senior Product Designer",
    location: "Dhaka, Bangladesh",
    jobDescription: "Lead the end-to-end design process for our core platform.",
    jobType: "full-time",
    workplaceType: "hybrid",
    experienceLevel: "senior",
    skills: "Figma, Design Systems, Prototyping",
    openings: "1",
    salaryMin: "8000",
    salaryMax: "12000",
    salaryPeriod: "month",
    applicationDeadline: "2026-11-30",
    companyName: "Nexus Lab",
    category: "Design",
    status: "Active",
    datePosted: "2026-10-24",
  },
  {
    ref: "HL-88231",
    jobTitle: "Full-stack Engineer",
    location: "Remote",
    jobDescription: "Build and ship features across the hiring pipeline.",
    jobType: "contract",
    workplaceType: "remote",
    experienceLevel: "mid",
    skills: "React, Node.js, PostgreSQL",
    openings: "2",
    salaryMin: "4000",
    salaryMax: "6000",
    salaryPeriod: "month",
    applicationDeadline: "2026-11-20",
    companyName: "Quantum",
    category: "Engineering",
    status: "Active",
    datePosted: "2026-10-22",
  },
  {
    ref: "HL-11022",
    jobTitle: "Marketing Director",
    location: "Singapore",
    jobDescription: "Own growth marketing across APAC markets.",
    jobType: "full-time",
    workplaceType: "on-site",
    experienceLevel: "lead",
    skills: "Growth, SEO, Brand",
    openings: "1",
    salaryMin: "9000",
    salaryMax: "14000",
    salaryPeriod: "month",
    applicationDeadline: "2026-10-31",
    companyName: "Vanguard",
    category: "Marketing",
    status: "Closed",
    datePosted: "2026-10-15",
  },
  {
    ref: "HL-99032",
    jobTitle: "Backend Architect",
    location: "Dhaka, Bangladesh",
    jobDescription: "Design the event-driven backbone of the platform.",
    jobType: "full-time",
    workplaceType: "on-site",
    experienceLevel: "senior",
    skills: "Go, Kafka, MongoDB",
    openings: "1",
    salaryMin: "10000",
    salaryMax: "15000",
    salaryPeriod: "month",
    applicationDeadline: "2026-12-15",
    companyName: "Circuit",
    category: "Engineering",
    status: "Active",
    datePosted: "2026-10-10",
  },
  {
    ref: "HL-77411",
    jobTitle: "Content Strategist",
    location: "Remote",
    jobDescription: "Shape editorial voice and the careers blog.",
    jobType: "freelance",
    workplaceType: "remote",
    experienceLevel: "mid",
    skills: "Copywriting, SEO, Editorial",
    openings: "1",
    salaryMin: "1500",
    salaryMax: "2500",
    salaryPeriod: "month",
    applicationDeadline: "2026-11-05",
    companyName: "Quantum",
    category: "Marketing",
    status: "Closed",
    datePosted: "2026-09-28",
  },
];

const CATEGORY_LIST = [
  "Design",
  "Engineering",
  "Marketing",
] as const;

const selectClass =
  "h-10 rounded-lg border-white/15 bg-[#0d0d10] text-sm text-white focus-visible:border-[#5c53fe]/70 focus-visible:ring-[#5c53fe]/25 sm:w-44";

// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: JobFormData["status"] }) {
  const active = status === "Active";
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
          "size-1.5 rounded-full " +
          (active ? "bg-[#22c55e]" : "bg-[#a1a4aa]")
        }
        aria-hidden="true"
      />
      {status}
    </span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-[#1a1a1f] px-2.5 py-0.5 text-[11px] text-[#ededef]">
      {category}
    </span>
  );
}

function CompanyAvatar({ name }: { name: string }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#222228] text-[11px] font-semibold text-[#ededef]">
        {name.charAt(0).toUpperCase()}
      </span>
      <span className="text-sm text-[#ededef]">{name}</span>
    </span>
  );
}

function ActionButtons() {
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
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Delete job"
        className="text-white/50 hover:bg-[#ef4444]/10 hover:text-[#f87171]"
      >
        <Trash2 />
      </Button>
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ManageJobsPage() {
  // Demo data lives in state so delete works without a backend
  const [jobs, setJobs] = React.useState<JobFormData[]>(DUMMY_JOBS);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [pillFilter, setPillFilter] = React.useState<"all" | "Active" | "Closed">("all");

  const deleteJob = (ref: string) => {
    setJobs((prev) => prev.filter((job) => job.ref !== ref));
    // TODO: call API to delete the job post once backend is ready
    // e.g. deleteJobPost(ref)
  };

  const filtered = jobs.filter((job) => {
    if (pillFilter !== "all" && job.status !== pillFilter) return false;
    if (statusFilter === "active" && job.status !== "Active") return false;
    if (statusFilter === "closed" && job.status !== "Closed") return false;
    if (categoryFilter !== "all" && job.category !== categoryFilter) return false;
    if (
      search &&
      !job.jobTitle.toLowerCase().includes(search.toLowerCase()) &&
      !job.ref.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const activeCount = jobs.filter((job) => job.status === "Active").length;
  const closedCount = jobs.filter((job) => job.status === "Closed").length;

  return (
    <div className="min-h-screen bg-[#010109] text-white">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Header Section — Figma "Manage Jobs" heading + Create Job button */}
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

        {/* Filters Section — two selects + Active/Closed segmented pills */}
        <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-white/40">
                Status
              </p>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as string)}>
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
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-white/40">
                Category
              </p>
              <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as string)}>
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
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-white/40">
              Quick filter
            </p>
            <div className="flex w-fit items-center gap-1 rounded-lg border border-white/10 bg-[#0d0d10] p-1">
              {([
                { value: "all", label: "All" },
                { value: "Active", label: `Active (${activeCount})` },
                { value: "Closed", label: `Closed (${closedCount})` },
              ] as const).map((pill) => (
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
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/30"
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
          {/* ===== Desktop table (lg and up) ===== */}
          <div className="hidden min-w-0 lg:block">
            {/* Header row — #1a1a1f like the Figma table header */}
            <div className="grid grid-cols-[1.7fr_1.4fr_1.1fr_0.9fr_1.1fr_1fr_0.9fr] items-center border-b border-white/[0.07] bg-[#1a1a1f] px-4 py-3">
              <span className="text-xs font-medium uppercase tracking-wide text-[#a0a0ab]">Title</span>
              <span className="text-xs font-medium uppercase tracking-wide text-[#a0a0ab]">Company</span>
              <span className="text-xs font-medium uppercase tracking-wide text-[#a0a0ab]">Category</span>
              <span className="text-xs font-medium uppercase tracking-wide text-[#a0a0ab]">Type</span>
              <span className="text-xs font-medium uppercase tracking-wide text-[#a0a0ab]">Date Posted</span>
              <span className="text-xs font-medium uppercase tracking-wide text-[#a0a0ab]">Status</span>
              <span className="text-right text-xs font-medium uppercase tracking-wide text-[#a0a0ab]">Actions</span>
            </div>

            {filtered.map((job, index) => (
              <div
                key={job.ref}
                className={
                  "grid grid-cols-[1.7fr_1.4fr_1.1fr_0.9fr_1.1fr_1fr_0.9fr] items-center px-4 py-3 " +
                  (index > 0 ? "border-t border-white/[0.07]" : "")
                }
              >
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate text-sm font-medium text-[#ededef]">
                    {job.jobTitle}
                  </span>
                  <span className="text-xs text-[#a0a0ab]">Ref: {job.ref}</span>
                </div>
                <CompanyAvatar name={job.companyName} />
                <div><CategoryBadge category={job.category} /></div>
                <span className="text-sm text-[#a0a0ab]">
                  {job.jobType === "full-time"
                    ? "Full-time"
                    : job.jobType === "contract"
                      ? "Contract"
                      : job.jobType === "freelance"
                        ? "Freelance"
                        : job.jobType === "part-time"
                          ? "Part-time"
                          : job.jobType === "internship"
                            ? "Internship"
                            : job.jobType}
                </span>
                <span className="text-sm text-[#a0a0ab]">{formatDate(job.datePosted)}</span>
                <div><StatusBadge status={job.status} /></div>
                <div className="flex justify-end">
                  <ActionButtons />
                </div>
              </div>
            ))}
          </div>

          {/* ===== Mobile/tablet cards (below lg) ===== */}
          <div className="flex flex-col divide-y divide-white/[0.07] lg:hidden">
            {filtered.map((job) => (
              <article key={job.ref} className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <h3 className="truncate text-sm font-semibold text-[#ededef]">
                      {job.jobTitle}
                    </h3>
                    <span className="text-xs text-[#a0a0ab]">Ref: {job.ref}</span>
                  </div>
                  <StatusBadge status={job.status} />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#a0a0ab]">
                  <CompanyAvatar name={job.companyName} />
                  <CategoryBadge category={job.category} />
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="size-3.5" aria-hidden="true" />
                    {formatDate(job.datePosted)}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-[#a0a0ab]">
                    {job.jobType === "full-time"
                      ? "Full-time"
                      : job.jobType === "contract"
                        ? "Contract"
                        : job.jobType === "freelance"
                          ? "Freelance"
                          : job.jobType}{" "}
                    · {job.workplaceType === "remote"
                      ? "Remote"
                      : job.workplaceType === "hybrid"
                        ? "Hybrid"
                        : "On-site"}
                  </span>
                  <ActionButtons  />
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
          Showing {filtered.length} of {jobs.length} job posts (demo data)
        </p>
      </main>
    </div>
  );
}
