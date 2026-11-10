"use client"

import { useState } from "react"

import type { JobFormData } from "@/lib/types/job"
import {
  CATEGORY_LIST,
  EXPERIENCE_LEVELS,
  JOB_TYPES,
  SALARY_PERIODS,
  WORKPLACE_TYPES,
} from "@/lib/constants/job-options"
import { darkCardClass, monoLabelClass } from "@/lib/ui-styles"
import { FilterSelect } from "./FilterSelect"
import { JobCard } from "./JobCard"
import { SearchInput } from "./SearchInput"

const CATEGORY_TABS = [
  { value: "all", label: "All" },
  ...CATEGORY_LIST.map((category) => ({ value: category, label: category })),
]

/**
 * Browse Jobs listing — search, category tabs and a filter sidebar.
 *
 * NOTE: the handlers below only keep local state so the UI responds.
 * Wiring them to actually filter the list / set URL query params is
 * intentionally left for the next step (see TODOs).
 */
export function BrowseJobs({ jobs }: { jobs: JobFormData[] }) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [jobType, setJobType] = useState("all")
  const [workplaceType, setWorkplaceType] = useState("all")
  const [experienceLevel, setExperienceLevel] = useState("all")
  const [salaryPeriod, setSalaryPeriod] = useState("all")
  const [location, setLocation] = useState("all")

  const locations = Array.from(
    new Set(jobs.map((job) => job.location).filter(Boolean))
  ).sort()

  // TODO: filter `jobs` by search + filters here (or set query params).
  const visibleJobs = jobs

  return (
    <div className="min-h-screen bg-[#010109] text-white">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div>
          <h1 className="font-manrope text-2xl font-bold tracking-tight sm:text-3xl">
            Browse Jobs
          </h1>

          <p className="mt-1.5 max-w-md text-sm text-[#a0a0ab]">
            Discover openings across the platform — search and filter by what
            matters to you.
          </p>
        </div>

        {/* Search */}
        <div className="mt-7">
          <SearchInput
            value={search}
            onChange={setSearch} // TODO: apply keyword filtering
            placeholder="Search by job title, ref, or company…"
          />
        </div>

        {/* Category tabs (industry) */}
        <div className="mt-5 flex w-fit flex-wrap items-center gap-1 rounded-lg border border-white/10 bg-[#0d0d10] p-1.5">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setCategory(tab.value)} // TODO: filter by category
              className={
                "flex h-8 items-center rounded-md px-4 text-xs font-medium transition-colors " +
                (category === tab.value
                  ? "bg-[#5c53fe] text-white"
                  : "text-white/55 hover:text-white")
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters sidebar + results */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[230px_minmax(0,1fr)]">
          <aside className={`${darkCardClass} h-fit p-5`}>
            <p className={monoLabelClass}>Filters</p>

            <div className="mt-4 flex flex-col gap-4">
              <FilterSelect
                label="Job type"
                value={jobType}
                onValueChange={(value) => setJobType(value)} // TODO: filter by job type
                options={JOB_TYPES}
                allLabel="All types"
              />

              <FilterSelect
                label="Workplace"
                value={workplaceType}
                onValueChange={(value) => setWorkplaceType(value)} // TODO: filter by workplace
                options={WORKPLACE_TYPES}
                allLabel="All workplaces"
              />

              <FilterSelect
                label="Experience"
                value={experienceLevel}
                onValueChange={(value) => setExperienceLevel(value)} // TODO: filter by experience
                options={EXPERIENCE_LEVELS}
                allLabel="All levels"
              />

              <FilterSelect
                label="Salary period"
                value={salaryPeriod}
                onValueChange={(value) => setSalaryPeriod(value)} // TODO: filter by salary period
                options={SALARY_PERIODS}
                allLabel="Any period"
              />

              <FilterSelect
                label="Location"
                value={location}
                onValueChange={(value) => setLocation(value)} // TODO: filter by location
                options={locations}
                allLabel="All locations"
              />
            </div>
          </aside>

          <section className="flex flex-col gap-4">
            <p className={monoLabelClass}>{visibleJobs.length} jobs</p>

            {visibleJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </section>
        </div>
      </main>
    </div>
  )
}
