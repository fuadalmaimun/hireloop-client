'use server'
import { JobFormData } from "@/lib/types/job"
import { protectedMutation } from "../core/server"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

// insert job
export async function createJob(
  data: JobFormData & {
    recruiterId: string
  }
) {
  const api = `${BASE_URL}/jobs`
  const response = await protectedMutation(api, "POST", data)
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

// apply to job
export const applyToJob = async (data: {
  jobId: string
  userId: string
  email: string
  jobTitle: string
}) => {
  const response = await fetch(`${BASE_URL}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  return response.json()
}
