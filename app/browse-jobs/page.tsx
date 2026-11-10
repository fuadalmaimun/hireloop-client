import { getJobs } from "@/lib/api/jobs"
import type { JobFormData } from "@/lib/types/job"
import { BrowseJobs } from "@/app/componets/BrowseJobs"

export default async function BrowseJobsPage() {
  const jobs: JobFormData[] = await getJobs()

  return <BrowseJobs jobs={jobs} />
}
