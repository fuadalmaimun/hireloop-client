import Link from "next/link"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getJobs } from "@/lib/api/jobs"
import type { JobFormData } from "@/lib/types/job"
import { ManageJobsTable } from "@/app/componets/ManageJobsTable"

export default async function ManageJobsPage() {
  const jobs: JobFormData[] = await getJobs()

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

        {/* Filters + search + table — client component (in-memory filtering) */}
        <ManageJobsTable jobs={jobs} />
      </main>
    </div>
  )
}
