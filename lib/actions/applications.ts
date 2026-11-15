
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

export const updateApplications = async (
  id: string,
  data: { status: string }
) => {
  const res = await fetch(`${BASE_URL}/applications/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

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
// Get applications count
export const getApplicationsCount = async (
  applicantId: string
): Promise<{ count: number }> => {
  const response = await fetch(
    `${BASE_URL}/applications/count?applicantId=${encodeURIComponent(applicantId)}`
  )

  if (!response.ok) {
    throw new Error("Failed to fetch applications count")
  }

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

// Get every application for one job — the recruiter "review applicants"
// screen reads this. The API matches jobId stored as string or ObjectId.
export const getApplicationsForJob = async (
  jobId: string
): Promise<Application[]> => {
  const response = await fetch(
    `${BASE_URL}/applications?jobId=${encodeURIComponent(jobId)}`
  )

  if (!response.ok) return []

  return response.json()
}
