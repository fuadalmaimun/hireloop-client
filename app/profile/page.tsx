import { redirect } from "next/navigation"

import { getSession } from "@/lib/core/server"
import { ProfileForm } from "./profile-form"

// Profile screen — /profile
export default async function ProfilePage() {
  const session = await getSession()

  if (!session?.user) {
    redirect("/sign-in?redirectTo=/profile")
  }

  const { name, email, image, role } = session.user

  return (
    <ProfileForm
      user={{
        name,
        email,
        image,
        role,
      }}
      dashboardHref="/dashboard"
    />
  )
}