"use server"

import type { User } from "@/lib/types/user"
import { protectedMutation } from "../core/server"


const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

// Get every registered user — the admin "Users management" screen reads this.
export const getUsers = async (): Promise<User[]> => {
  const response = await fetch(`${BASE_URL}/users`)

  if (!response.ok) return []

  return response.json()
}

// Update user role
export const updateUserRole = async (
  id: string,
  role: "seeker" | "recruiter" | "admin"
) => {
  const api = `${BASE_URL}/users/${id}/role`

  const response = await protectedMutation(api, "PATCH", { role })

  return response.json()
}
