import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { getSession } from "@/lib/core/server"
import { getDetailsPage } from "@/lib/api/jobs"
import { getApplicationsForJob } from "@/lib/actions/applications"
import { monoLabelClass } from "@/lib/ui-styles"
import type { JobFormData } from "@/lib/types/job"
import { ApplicantsTable } from "./components/ApplicantsTable"

// Recruiter "review applicants" screen for one job posting:
// /dashboard/recruiter/jobs/[jobId]/applications
//
// The page authenticates, loads the job (404 if it doesn't exist) and hands
// everything to the client table — mirroring the seeker applications page.

export default async function JobApplicationsPage({
  params,
}: {
  params: Promise<{ jobId: string }>
}) {
  const { jobId } = await params

  const session = await getSession()

  if (!session?.user) {
    redirect("/sign-in")
  }

  const job = (await getDetailsPage(jobId)) as JobFormData | null

  if (!job?._id) notFound()

  const applications = await getApplicationsForJob(jobId)

  return (
    <div className="min-h-screen bg-[#010109] text-white">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Link
          href="/dashboard/recruiter/jobs"
          className="inline-flex items-center gap-1.5 text-sm text-white/55 transition-colors hover:text-white"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to jobs
        </Link>

        <div className="mt-4">
          <p className={monoLabelClass}>Job ref · {job.ref || "—"}</p>

          <h1 className="mt-1 font-manrope text-2xl font-bold tracking-tight sm:text-3xl">
            {job.jobTitle}
          </h1>

          <p className="mt-1.5 text-sm text-[#a0a0ab]">
            {job.companyName} · {job.location}
          </p>
        </div>

        {/* Applicant list — client component (search + status dropdowns) */}
        <ApplicantsTable applications={applications} />
      </main>
    </div>
  )
}
