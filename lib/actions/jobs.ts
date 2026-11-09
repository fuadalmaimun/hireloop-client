import { JobFormData, JobFormFields } from "@/lib/types/job"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

// insert job
export const createJob = async (data: JobFormFields) => {
  const response = await fetch(`${BASE_URL}/jobs`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

export const deleteJob = async (jobId: string) => {
  const response = await fetch(`${BASE_URL}/jobs/${jobId}`, {
    method: "DELETE",
  })
  return response.json()
}

export const updateJob = async (
  jobId: string,
  updatedJob: Partial<JobFormData>
) => {
  const { _id, ...jobData } = updatedJob

  const response = await fetch(`${BASE_URL}/jobs/${jobId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jobData),
  })

  return response.json()
}