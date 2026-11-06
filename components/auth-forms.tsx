"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { signIn, signUp } from "@/lib/auth-client";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BriefcaseBusiness,
  ShieldCheck,
  UserSearch,
} from "lucide-react";

const inputClass =
  "h-10 rounded-lg border-white/15 bg-[#101010] text-xs text-white placeholder:text-white/40 focus-visible:border-[#5c53fe]/70 focus-visible:ring-[#5c53fe]/25 sm:h-11 sm:text-sm";

const submitButtonClass =
  "flex h-10 w-full items-center justify-center rounded-lg bg-[#5c53fe] text-xs font-medium text-white shadow-[0_0_15px_rgba(92,83,254,0.35)] transition-colors hover:bg-[#6c63ff] disabled:pointer-events-none disabled:opacity-60 sm:h-11 sm:text-sm";

const socialButtonClass =
  "flex h-10 w-full items-center justify-center gap-2.5 rounded-lg border border-white/15 bg-[#1a1a1b] text-xs font-medium text-white/90 transition-colors hover:bg-white/10 sm:h-11 sm:text-sm";

function GoogleIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12.3v4.51h6.47a5.57 5.57 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.26-5.17 3.26-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12.3 24c3.24 0 5.95-1.08 7.95-2.91l-3.86-3a7.23 7.23 0 0 1-10.71-3.81H1.67v3.09A12 12 0 0 0 12.3 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.75 14.28a7.2 7.2 0 0 1 0-4.56V6.63H1.67a12 12 0 0 0 0 10.74l4.08-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12.3 4.77c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.24 1.19 15.53 0 12.3 0A12 12 0 0 0 1.67 6.63l4.08 3.09A7.23 7.23 0 0 1 12.3 4.77Z"
      />
    </svg>
  );
}

function Divider() {
  return (
    <div className="my-5 flex items-center gap-3">
      <span className="h-px flex-1 bg-white/10" />
      <span className="text-[11px] text-white/35">or continue with</span>
      <span className="h-px flex-1 bg-white/10" />
    </div>
  );
}

function ErrorBox({ children }: { children: React.ReactNode }) {
  return (
    <p
      role="alert"
      className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-300"
    >
      {children}
    </p>
  );
}

// Sign In Form
export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [remember, setRemember] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await signIn.email({
      email,
      password,
      rememberMe: remember,
    });

    if (authError) {
      setError(
        authError.message ?? "Unable to sign in. Check your email and password."
      );
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#0e0e14]/95 to-[#101010] p-6 shadow-[0_15px_50px_rgba(0,0,0,0.55)] backdrop-blur sm:p-8">
      <div className="flex justify-center">
        <div className="flex h-7 items-center gap-1.5 rounded-full border border-white/20 bg-gradient-to-b from-[#303030] to-[#090909] px-3 shadow-[inset_0_0_6px_rgba(255,255,255,0.1)]">
          <span className="text-[10px]" aria-hidden="true">💼</span>
          <span className="whitespace-nowrap font-mono text-[9px] uppercase tracking-wider text-white/50">
            <strong className="text-white">50,000+</strong> jobs waiting
          </span>
        </div>
      </div>

      <h1 className="mt-4 text-center font-manrope text-xl font-bold tracking-tight sm:text-2xl">
        Sign in to your account
      </h1>
      <p className="mt-1.5 text-center text-xs text-white/55 sm:text-sm">
        Access thousands of curated opportunities.
      </p>

      {error ? (
        <div className="mt-5">
          <ErrorBox>{error}</ErrorBox>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signin-email" className="text-xs text-white/70">
            Email
          </Label>
          <Input
            id="signin-email"
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

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signin-password" className="text-xs text-white/70">
            Password
          </Label>
          <Input
            id="signin-password"
            type="password"
            name="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>

        <Label
          htmlFor="signin-remember"
          className="mt-1 w-fit cursor-pointer text-xs font-normal text-white/60"
        >
          <Checkbox
            id="signin-remember"
            checked={remember}
            onCheckedChange={(checked) => setRemember(checked === true)}
            className="size-3.5 data-checked:border-[#5c53fe] data-checked:bg-[#5c53fe]"
          />
          Remember me
        </Label>

        <button type="submit" disabled={loading} className={submitButtonClass}>
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <Divider />

      <button
        type="button"
        onClick={() => void signIn.social({ provider: "google", callbackURL: "/" })}
        className={socialButtonClass}
      >
        <GoogleIcon />
        Sign in with Google
      </button>

      <p className="mt-6 text-center text-xs text-white/50 sm:text-sm">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="font-semibold text-[#827aff] transition-colors hover:text-white"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}

// Sign Up Form
export function SignUpForm() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState("seeker");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const { error: authError } = await signUp.email({
      name,
      email,
      password,
      role,
    });

    if (authError) {
      setError(authError.message ?? "Unable to create your account.");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#0e0e14]/95 to-[#101010] p-6 shadow-[0_15px_50px_rgba(0,0,0,0.55)] backdrop-blur sm:p-8">
      <div className="flex justify-center">
        <div className="flex h-7 items-center gap-1.5 rounded-full border border-white/20 bg-gradient-to-b from-[#303030] to-[#090909] px-3 shadow-[inset_0_0_6px_rgba(255,255,255,0.1)]">
          <span className="text-[10px]" aria-hidden="true">💼</span>
          <span className="whitespace-nowrap font-mono text-[9px] uppercase tracking-wider text-white/50">
            <strong className="text-white">100% free</strong> forever plan
          </span>
        </div>
      </div>

      <h1 className="mt-4 text-center font-manrope text-xl font-bold tracking-tight sm:text-2xl">
        Create your account
      </h1>
      <p className="mt-1.5 text-center text-xs text-white/55 sm:text-sm">
        Join over 2M job seekers already on HireLoop.
      </p>

      {error ? (
        <div className="mt-5">
          <ErrorBox>{error}</ErrorBox>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
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

        {/* Account type — saved to better-auth user as `role` */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-white/70">Account type</Label>
          <div role="radiogroup" aria-label="Account type" className="grid grid-cols-3 gap-2">
            {[
              { value: "seeker", label: "Seeker", icon: UserSearch },
              { value: "recruiter", label: "Recruiter", icon: BriefcaseBusiness },
              { value: "admin", label: "Admin", icon: ShieldCheck },
            ].map((option) => (
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
                  <option.icon className="size-4" aria-hidden="true" />
                  <span className="text-[11px] font-medium leading-none">
                    {option.label}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </div>

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

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-password" className="text-xs text-white/70">
            Password
          </Label>
          <Input
            id="signup-password"
            type="password"
            name="password"
            required
            minLength={6}
            autoComplete="new-password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>

        <button type="submit" disabled={loading} className={submitButtonClass}>
          {loading ? "Creating account…" : "Get Started"}
        </button>
      </form>

      <Divider />

      <button
        type="button"
        onClick={() => void signIn.social({ provider: "google", callbackURL: "/" })}
        className={socialButtonClass}
      >
        <GoogleIcon />
        Sign up with Google
      </button>

      <p className="mt-5 text-center text-[10px] leading-relaxed text-white/35 sm:text-[11px]">
        By creating an account you agree to HireLoop&apos;s Terms of Service and
        Privacy Policy.
      </p>

      <p className="mt-4 text-center text-xs text-white/50 sm:text-sm">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-semibold text-[#827aff] transition-colors hover:text-white"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
