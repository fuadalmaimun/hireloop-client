import { notFound } from "next/navigation"

import { getDetailsPage } from "@/lib/api/jobs"

const JobDetailsPage = async ({
  params,
}: {
  params: Promise<{ jobId: string }>
}) => {
  const { jobId } = await params

  const job = await getDetailsPage(jobId)

  if (!job?._id) notFound()

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold">{job.jobTitle}</h1>
      <p>Company Name: {job.companyName}</p>
      <p>Location: {job.location}</p>
      <p>Description: {job.jobDescription}</p>
      <p>Salary: {job.salary}</p>
    </div>
  )
}

export default JobDetailsPage
