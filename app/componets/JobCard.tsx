"use client"

import { CalendarDays, MapPin } from "lucide-react"

import type { JobFormData, JobOption } from "@/lib/types/job"
import { EXPERIENCE_LEVELS, JOB_TYPES, WORKPLACE_TYPES } from "@/lib/constants/job-options"
import { formatDate } from "@/lib/format"
import { darkCardClass, monoLabelClass } from "@/lib/ui-styles"
import { CategoryBadge, CompanyAvatar, StatusBadge } from "./badges"

/** Look up a dropdown label from its stored value ("full-time" -> "Full-time"). */
const optionLabel = (options: JobOption[], value: string) =>
  options.find((option) => option.value === value)?.label ?? value

/** Dark job card used in the Browse Jobs listing. */
export function JobCard({ job }: { job: JobFormData }) {
  const salaryText =
    job.salary || [job.salaryMin, job.salaryMax].filter(Boolean).join(" – ")

  const tags = [
    optionLabel(JOB_TYPES, job.jobType),
    optionLabel(WORKPLACE_TYPES, job.workplaceType),
    optionLabel(EXPERIENCE_LEVELS, job.experienceLevel),
  ].filter(Boolean)

  return (
    <article
      className={`${darkCardClass} p-5 transition-colors hover:border-[#5c53fe]/40`}
    >
      {/* Company + status */}
      <div className="flex items-start justify-between gap-4">
        <CompanyAvatar name={job.companyName} />
        <StatusBadge status={job.status} />
      </div>

      {/* Title + reference */}
      <div className="mt-4">
        <h3 className="font-manrope text-base font-semibold text-white">
          {job.jobTitle}
        </h3>
        <p className={`mt-1 ${monoLabelClass}`}>{job.ref}</p>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-[#a0a0ab]">
        {job.jobDescription}
      </p>

      {/* Attribute pills */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {salaryText ? (
          <CategoryBadge category={salaryText} />
        ) : null}

        {tags.map((tag) => (
          <CategoryBadge key={tag} category={tag} />
        ))}

        <CategoryBadge category={job.category} />
      </div>

      {/* Meta footer */}
      <footer className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-white/50">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="size-3.5" aria-hidden="true" />
          {job.location}
        </span>

        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="size-3.5" aria-hidden="true" />
          Posted {formatDate(job.datePosted)}
        </span>

        {job.applicationDeadline ? (
          <span>Apply by {formatDate(job.applicationDeadline)}</span>
        ) : null}
      </footer>
    </article>
  )
}
