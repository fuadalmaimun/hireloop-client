import { redirect } from "next/navigation"

import { getSession } from "@/lib/core/server"
import { ProfileForm } from "./profile-form"

// Profile screen — /profile
//
// Server-gated: unauthenticated visitors are redirected to sign-in.
// Updates go through better-auth's updateUser, which is bound to the
// current session — a user can only ever change their own record.
export default async function ProfilePage() {
  const session = await getSession()

  if (!session?.user) {
    redirect("/sign-in?redirectTo=/profile")
  }

  const { name, email, image, role } = session.user

  return (
    <ProfileForm
      user={{ name, email, image }}
      dashboardHref={`/dashboard/${role || "seeker"}`}
    />
  )
}
