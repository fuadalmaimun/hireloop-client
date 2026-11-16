import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

export const getSession = async () => {
  "use server"
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  return session
}

export const requireRole = async (role: string) => {
  const session = await getSession()

  if (!session || session.user.role !== role) {
    redirect("/unauthorized")
  }

  return session
}

export const getToken = async () => {
  const session = await getSession()

  if (!session || !session.session.token) {
    redirect("/unauthorized")
  }

  return session.session.token
}
export const protectedMutation = async (
  api: string,
  method: string,
  data?: unknown
) => {
  const token = await getToken()

  const res = await fetch(api, {
    method,
    headers: {
      "content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: data ? JSON.stringify(data) : null,
  })

  if (res.status === 401) {
    redirect("/unauthorized")
  }

  return res
}

// fetch wrapper that adds the Bearer token and keeps any options
// (method, body, cache, extra headers) the caller passes in.
export const authFetch = async (api: string) => {
  const token = await getToken()

  const res = await fetch(api, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  })

  if (res.status === 401 || res.status === 403) redirect("/unauthorized")

  return res
}
