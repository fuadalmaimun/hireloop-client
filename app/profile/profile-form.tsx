
"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Camera } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/toast"

type ProfileUser = {
  name?: string | null
  email?: string | null
  image?: string | null
  role?: string | null
}

const inputClass =
  "h-11 rounded-lg border-white/15 bg-[#101010] text-sm text-white placeholder:text-white/40 focus-visible:border-[#5c53fe]/70 focus-visible:ring-[#5c53fe]/25"

const submitButtonClass =
  "flex h-12 w-full items-center justify-center rounded-lg bg-[#5c53fe] text-sm font-medium text-white shadow-[0_0_15px_rgba(92,83,254,0.35)] transition-colors hover:bg-[#6c63ff] disabled:pointer-events-none disabled:opacity-60"

export function ProfileForm({
  user,
  dashboardHref,
}: {
  user: ProfileUser
  dashboardHref: string
}) {
  const router = useRouter()

  const [name, setName] = React.useState(user.name ?? "")
  const [image, setImage] = React.useState(user.image ?? "")
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const dirty =
    name !== (user.name ?? "") || image !== (user.image ?? "")

  async function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0]

    if (!file) return

    const formData = new FormData()
    formData.append("image", file)

    try {
      setSaving(true)
      setError(null)

      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGEBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      )

      const result = await res.json()

      if (result.success) {
        setImage(result.data.url)
        toast.add({
          title: "Image uploaded successfully",
          type: "success",
        })
      } else {
        setError("Image upload failed.")
      }
    } catch {
      setError("Something went wrong while uploading image.")
    } finally {
      setSaving(false)
    }
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!dirty || saving) return

    setError(null)
    setSaving(true)

    try {
      const { error: authError } = await authClient.updateUser({
        name,
        image: image.trim() || null,
      })

      if (authError) {
        setError(authError.message ?? "Could not update your profile.")
        return
      }

      toast.add({ title: "Profile updated", type: "success" })
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 sm:py-16">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-gradient-to-b p-8 shadow-[0_15px_50px_rgba(0,0,0,0.55)] backdrop-blur sm:p-10">

        <Link
          href={dashboardHref}
          className="inline-flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        <h1 className="mt-6 text-center font-manrope text-2xl font-bold tracking-tight sm:text-3xl">
          Your profile
        </h1>

        <p className="mt-2 text-center text-sm text-white/55">
          Manage your personal information and profile picture.
        </p>

        {error ? (
          <p
            role="alert"
            className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            {error}
          </p>
        ) : null}

        <form onSubmit={handleSave} className="mt-8 flex flex-col gap-6">

          {/* Profile Image */}
          <div className="flex items-center gap-4 rounded-xl border border-white/15 bg-[#101010] p-4 sm:p-5">
            {image.trim() ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image.trim()}
                alt="Profile preview"
                className="size-16 shrink-0 rounded-full border-2 border-[#5c53fe]/60 object-cover sm:size-20"
              />
            ) : (
              <span className="flex size-16 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-white/20 bg-white/[0.04] text-white/50 sm:size-20">
                <Camera className="size-6" />
              </span>
            )}

            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Label htmlFor="profile-image" className="text-sm text-white/70">
                Upload profile picture
              </Label>

              <Input
                id="profile-image"
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                disabled={saving}
                className={inputClass}
              />
            </div>
          </div>

          {/* Full Name */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="profile-name" className="text-sm text-white/70">
              Full name
            </Label>

            <Input
              id="profile-name"
              type="text"
              name="name"
              required
              autoComplete="name"
              placeholder="Jane Cooper"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="profile-email" className="text-sm text-white/70">
              Email
            </Label>

            <Input
              id="profile-email"
              type="email"
              value={user.email ?? ""}
              disabled
              className={`${inputClass} opacity-60`}
            />
          </div>

          {/* User Role */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="profile-role" className="text-sm text-white/70">
              Account role
            </Label>

            <Input
              id="profile-role"
              type="text"
              value={user.role ?? "User"}
              disabled
              className={`${inputClass} capitalize opacity-60`}
            />
          </div>

          <button
            type="submit"
            disabled={saving || !dirty}
            className={submitButtonClass}
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </main>
  )
}
