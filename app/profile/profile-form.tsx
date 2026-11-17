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
}

const inputClass =
  "h-10 rounded-lg border-white/15 bg-[#101010] text-xs text-white placeholder:text-white/40 focus-visible:border-[#5c53fe]/70 focus-visible:ring-[#5c53fe]/25 sm:h-11 sm:text-sm"

const submitButtonClass =
  "flex h-10 w-full items-center justify-center rounded-lg bg-[#5c53fe] text-xs font-medium text-white shadow-[0_0_15px_rgba(92,83,254,0.35)] transition-colors hover:bg-[#6c63ff] disabled:pointer-events-none disabled:opacity-60 sm:h-11 sm:text-sm"

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

  const initial = (user.name || user.email || "U").charAt(0).toUpperCase()
  const dirty = name !== (user.name ?? "") || image !== (user.image ?? "")

  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) return

    const formData = new FormData()
    formData.append("image", file)

    try {
      setSaving(true)

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
        toast.add({ title: "Image uploaded successfully", type: "success" })
      } else {
        setError("Image upload failed.")
      }
    } catch {
      setError("Something went wrong while uploading image.")
    } finally {
      setSaving(false)
    }
  }

  // better-auth's updateUser only touches the signed-in user's own record —
  // no id is passed, the session decides whose document is updated.
  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!dirty || saving) return

    setError(null)
    setSaving(true)

    try {
      const { error: authError } = await authClient.updateUser({
        name,
        // An empty URL clears the picture (falls back to the placeholder).
        image: image.trim() || null,
      })

      if (authError) {
        setError(authError.message ?? "Could not update your profile.")
        return
      }

      toast.add({ title: "Profile updated", type: "success" })
      // Re-render server components so navbar/sidebar pick up the new data
      // (better-auth's client also refreshes its session signal).
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-gradient-to-b p-6 shadow-[0_15px_50px_rgba(0,0,0,0.55)] backdrop-blur sm:p-8">
        <Link
          href={dashboardHref}
          className="inline-flex items-center gap-1.5 text-xs text-white/50 transition-colors hover:text-white"
        >
          <ArrowLeft size={14} />
          Back to dashboard
        </Link>

        <h1 className="mt-4 text-center font-manrope text-xl font-bold tracking-tight sm:text-2xl">
          Your profile
        </h1>

        <p className="mt-1.5 text-center text-xs text-white/55 sm:text-sm">
          Update your name and profile picture.
        </p>

        {error ? (
          <p
            role="alert"
            className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-300"
          >
            {error}
          </p>
        ) : null}

        <form onSubmit={handleSave} className="mt-5 flex flex-col gap-4">
          {/* Picture — live preview of the URL below (or the initial placeholder) */}
          <div className="flex items-center gap-3.5 rounded-xl border border-white/15 bg-[#101010] p-3">
            {image.trim() ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image.trim()}
                alt="Profile preview"
                className="size-14 shrink-0 rounded-full border-2 border-[#5c53fe]/60 object-cover sm:size-16"
              />
            ) : (
              <span className="flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-white/20 bg-white/[0.04] text-white/50 sm:size-16">
                <Camera className="size-5" />
              </span>
            )}

            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <Label htmlFor="profile-image" className="text-xs text-white/70">
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

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="profile-name" className="text-xs text-white/70">
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

          {/* Email — read-only, managed by auth */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="profile-email" className="text-xs text-white/70">
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

          <button
            type="submit"
            disabled={saving || !dirty}
            className={submitButtonClass}
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </form>
      </div>
    </main>
  )
}
