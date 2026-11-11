import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { FileText } from "lucide-react"

import { auth } from "@/lib/auth"
import { getApplications } from "@/lib/actions/applications"
import { ApplicationsTable } from "./components/ApplicationsTable"

export default async function MyApplicationsPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect("/sign-in")
  }

  const applications = await getApplications(session.user.id)

  return (
    <div className="min-h-screen bg-[#010109] text-white">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Header — Figma dashboard "Section - Welcome Header" pattern */}
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#827aff]">
          <FileText className="size-3.5" aria-hidden="true" />
          Applications
        </div>

        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-manrope text-2xl font-bold tracking-tight sm:text-3xl">
              My Applications
            </h1>

            <p className="mt-1.5 max-w-md text-sm text-[#a0a0ab]">
              Track every role you applied to and where it stands in the
              hiring pipeline.
            </p>
          </div>

          <p className="shrink-0 text-sm text-white/50">
            {applications.length}{" "}
            {applications.length === 1 ? "application" : "applications"}
          </p>
        </div>

        <ApplicationsTable applications={applications} />
      </main>
    </div>
  )
}
