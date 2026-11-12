
import type { Application, ApplicationInput } from "@/lib/types/application"

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

// Create application
export const createApplication = async (data: ApplicationInput) => {
  const response = await fetch(`${BASE_URL}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  return response.json()
}

// Get all applications
export const getApplications = async (
  applicantId: string
): Promise<Application[]> => {
  const response = await fetch(
    `${BASE_URL}/applications?applicantId=${encodeURIComponent(applicantId)}`
  )

  if (!response.ok) return []

  return response.json()
}

// Get applications count
export const getApplicationsCount = async (
  applicantId: string
): Promise<{ count: number }> => {
  const response = await fetch(
    `${BASE_URL}/applications/count?applicantId=${encodeURIComponent(applicantId)}`
  )
  if (!response.ok) return { count: 0 }
  return response.json()
}

// Check existing application
export const getApplicationForJob = async (
  jobId: string,
  applicantId: string
): Promise<Application | null> => {
  const response = await fetch(
    `${BASE_URL}/applications?jobId=${encodeURIComponent(jobId)}&applicantId=${encodeURIComponent(applicantId)}`
  )

  if (!response.ok) return null

  const list: Application[] = await response.json()

  return list[0] ?? null
}
