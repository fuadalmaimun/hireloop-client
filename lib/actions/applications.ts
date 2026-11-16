"use server"

import type { Application, ApplicationInput } from "@/lib/types/application"
import { authFetch, protectedMutation } from "../core/server"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

// Create application
export const createApplication = async (data: ApplicationInput) => {
  const api = `${BASE_URL}/applications`
  const response = await protectedMutation(api, "POST", data)

  return response.json()
}

// Update application status
export const updateApplications = async (
  id: string,
  data: { status: string }
) => {
  const api = `${BASE_URL}/applications/${id}`
  const response = await protectedMutation(api, "PATCH", data)

  return response.json()
}

// Get all applications
export const getApplications = async (query = "") => {
  const response = await authFetch(`${BASE_URL}/applications?${query}`)
  return response.json()
}

// Get applications count
export const getApplicationsCount = async (query = "") => {
  const response = await authFetch(`${BASE_URL}/applications/count?${query}`)
  return response.json()
}

// Check existing application
export const getApplicationForJob = async (
  jobId: string,
  applicantId: string
): Promise<Application | null> => {
  const response = await authFetch(
    `${BASE_URL}/applications?jobId=${jobId}&applicantId=${applicantId}`
  )

  if (!response.ok) return null

  const list: Application[] = await response.json()

  return list[0] ?? null
}

// Get applications for one job
export const getApplicationsForJob = async (
  jobId: string
): Promise<Application[]> => {
  try {
    const response = await authFetch(
      `${BASE_URL}/applications?jobId=${encodeURIComponent(jobId)}`
    )

    if (!response.ok) return []

    const data = await response.json()

    return Array.isArray(data) ? data : []
  } catch (error) {
    const digest = (error as { digest?: string })?.digest

    if (typeof digest === "string" && digest.startsWith("NEXT_")) {
      throw error
    }

    console.error("Error fetching applications:", error)
    return []
  }
}
