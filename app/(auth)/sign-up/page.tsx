"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { signUp } from "@/lib/auth-client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Camera, X, BriefcaseBusiness, UserSearch } from "lucide-react"

const roles = [
  { value: "seeker", label: "Seeker", icon: UserSearch },
  { value: "recruiter", label: "Recruiter", icon: BriefcaseBusiness },
] as const

const inputClass =
  "h-10 rounded-lg border-white/15 bg-[#101010] text-xs text-white placeholder:text-white/40 focus-visible:border-[#5c53fe]/70 focus-visible:ring-[#5c53fe]/25 sm:h-11 sm:text-sm"

const submitButtonClass =
  "flex h-10 w-full items-center justify-center rounded-lg bg-[#5c53fe] text-xs font-medium text-white shadow-[0_0_15px_rgba(92,83,254,0.35)] transition-colors hover:bg-[#6c63ff] disabled:pointer-events-none disabled:opacity-60 sm:h-11 sm:text-sm"

function Divider() {
  return (
    <div className="my-5 flex items-center gap-3">
      <span className="h-px flex-1 bg-white/10" />
      <span className="h-px flex-1 bg-white/10" />
    </div>
  )
}

function ErrorBox({ children }: { children: React.ReactNode }) {
  return (
    <p
      role="alert"
      className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-300"
    >
      {children}
    </p>
  )
}

export default function SignUpPage() {
  // useSearchParams() inside the form requires a Suspense boundary so the
  // page can be statically prerendered.
  return (
    <React.Suspense>
      <SignUpForm />
    </React.Suspense>
  )
}

function SignUpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const redirectTo = searchParams.get("redirectTo") || "/"

  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [role, setRole] = React.useState<"seeker" | "recruiter">("seeker")
  const [image, setImage] = React.useState<File | null>(null)
  const [imagePreview, setImagePreview] = React.useState<string | null>(null)
  const imageInputRef = React.useRef<HTMLInputElement>(null)

  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [imageUrl, setImageUrl] = React.useState("")
  // TODO(image-upload): on submit, upload `image` to storage and pass the
  // resulting URL to signUp.email({ ..., image }) — not implemented yet.
  // `imagePreview` is only a local object-URL preview for the UI.

  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {

    const file = event.target.files?.[0] ?? null
    setImage(file)

    if (!file) return

    if (imagePreview) URL.revokeObjectURL(imagePreview)

    setImagePreview(URL.createObjectURL(file))

    const formData = new FormData()
    formData.append("image", file)

    const imagebbAPI = `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGEBB_API_KEY}`

    const res = await fetch(imagebbAPI, {
      method: "POST",
      body: formData,
    })

    const result = await res.json()
    const imageUrl = result.data.url
    setImageUrl(imageUrl)

    console.log(imageUrl)
  }

  function handleImageRemove() {
    if (imageInputRef.current) imageInputRef.current.value = ""
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImage(null)
    setImagePreview(null)
    setImageUrl("")
  }

async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  if (loading) return;

  setError(null);

  if (password.length <= 6) {
    setError("Password must be at least 6 characters.");
    return;
  }

  setLoading(true);

  try {
    const { error: authError } = await signUp.email({
      name,
      email,
      password,
      role,
      image: imageUrl,
    });

    if (authError) {
      setError(authError.message ?? "Unable to create your account.");
      return;
    }

    router.replace(redirectTo);
    router.refresh();
  } catch {
    setError("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
}

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-gradient-to-b p-6 shadow-[0_15px_50px_rgba(0,0,0,0.55)] backdrop-blur sm:p-8">
        {/* Badge */}
        <div className="flex justify-center">
          <div className="flex h-7 items-center gap-1.5 rounded-full border border-white/20 bg-gradient-to-b from-[#303030] to-[#090909] px-3 shadow-[inset_0_0_6px_rgba(255,255,255,0.1)]">
            <span className="text-[10px]">💼</span>

            <span className="font-mono text-[9px] tracking-wider whitespace-nowrap text-white/50 uppercase">
              <strong className="text-white">100% free</strong> forever plan
            </span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="mt-4 text-center font-manrope text-xl font-bold tracking-tight sm:text-2xl">
          Create your account
        </h1>

        <p className="mt-1.5 text-center text-xs text-white/55 sm:text-sm">
          Join over 2M job seekers already on HireLoop.
        </p>

        {/* Error */}
        {error && (
          <div className="mt-5">
            <ErrorBox>{error}</ErrorBox>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="signup-name" className="text-xs text-white/70">
              Full name
            </Label>

            <Input
              id="signup-name"
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

          {/* Account Type */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-white/70">Account type</Label>

            <div
              role="radiogroup"
              aria-label="Account type"
              className="grid grid-cols-2 gap-2"
            >
              {roles.map((option) => (
                <label key={option.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value={option.value}
                    checked={role === option.value}
                    onChange={() => setRole(option.value)}
                    className="peer sr-only"
                  />

                  <span
                    className={
                      "flex flex-col items-center gap-1.5 rounded-lg border px-2 py-3 text-center transition-colors " +
                      (role === option.value
                        ? "border-[#5c53fe] bg-[#5c53fe]/10 text-white"
                        : "border-white/15 bg-[#101010] text-white/60 hover:border-white/30")
                    }
                  >
                    <option.icon className="size-4" />

                    <span className="text-[11px] leading-none font-medium">
                      {option.label}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="signup-email" className="text-xs text-white/70">
              Email
            </Label>

            <Input
              id="signup-email"
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="signup-password" className="text-xs text-white/70">
              Password
            </Label>

            <Input
              id="signup-password"
              type="password"
              name="password"
              required
              minLength={7}
              autoComplete="new-password"
              placeholder="At least 7 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Profile Image — upload not wired up yet, handler only */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="signup-image" className="text-xs text-white/70">
              Profile image
            </Label>

            <div className="flex items-center gap-3.5 rounded-xl border border-white/15 bg-[#101010] p-3 transition-colors focus-within:border-[#5c53fe]/70 hover:border-white/25">
              <label
                htmlFor="signup-image"
                className="group relative shrink-0 cursor-pointer"
                title="Choose a profile image"
              >
                {imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imagePreview}
                    alt="Selected profile preview"
                    className="size-14 rounded-full border-2 border-[#5c53fe]/60 object-cover sm:size-16"
                  />
                ) : (
                  <span className="flex size-14 items-center justify-center rounded-full border-2 border-dashed border-white/20 bg-white/[0.04] text-white/50 transition-colors group-hover:border-[#5c53fe]/60 group-hover:text-[#827aff] sm:size-16">
                    <Camera className="size-5" />
                  </span>
                )}

                <span className="absolute -right-0.5 -bottom-0.5 flex size-5 items-center justify-center rounded-full bg-[#5c53fe] text-white shadow-[0_0_8px_rgba(92,83,254,0.5)]">
                  <Camera className="size-2.5" />
                </span>
              </label>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-white">
                  {imageUrl || "Upload a profile photo"}
                </p>
                <p className="mt-0.5 text-[11px] text-white/45">
                  PNG or JPG — optional
                </p>
              </div>

              {imageUrl ? (
                <button
                  type="button"
                  onClick={handleImageRemove}
                  aria-label="Remove selected image"
                  className="flex size-7 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-300"
                >
                  <X className="size-3.5" />
                </button>
              ) : (
                <label
                  htmlFor="signup-image"
                  className="shrink-0 cursor-pointer rounded-lg border border-white/15 px-3 py-1.5 text-[11px] font-medium text-white/80 transition-colors hover:border-[#5c53fe]/60 hover:bg-[#5c53fe]/10 hover:text-white"
                >
                  Choose
                </label>
              )}
            </div>

            {/* Hidden input — the picker UI above triggers it */}
            <Input
              ref={imageInputRef}
              id="signup-image"
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="sr-only"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={submitButtonClass}
          >
            {loading ? "Creating account…" : "Get Started"}
          </button>
        </form>

        <Divider />

        {/* Terms */}
        <p className="mt-5 text-center text-[10px] leading-relaxed text-white/35 sm:text-[11px]">
          By creating an account you agree to HireLoop&apos;s Terms of Service
          and Privacy Policy.
        </p>

        {/* Sign In Link */}
        <p className="mt-4 text-center text-xs text-white/50 sm:text-sm">
          Already have an account?{" "}
          <Link
            href={`/sign-in${searchParams.toString() ? `?${searchParams.toString()}` : ""}`}
            className="font-semibold text-[#827aff] transition-colors hover:text-white"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
