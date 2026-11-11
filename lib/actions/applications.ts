import type { Application, ApplicationInput } from "@/lib/types/application"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

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
  userId: string
): Promise<Application[]> => {
  const response = await fetch(
    `${BASE_URL}/applications?userId=${encodeURIComponent(userId)}`
  )

  if (!response.ok) return []
  return response.json()
}

// Check existing application
export const getApplicationForJob = async (
  jobId: string,
  userId: string
): Promise<Application | null> => {
  const response = await fetch(
    `${BASE_URL}/applications?jobId=${encodeURIComponent(jobId)}&userId=${encodeURIComponent(userId)}`
  )

  if (!response.ok) return null

  const list: Application[] = await response.json()
  return list[0] ?? null
}
