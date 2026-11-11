"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowUpRight } from "lucide-react"
import { useSession } from "@/lib/auth-client"
import { applyToJob } from "@/lib/actions/jobs"

const ApplyButton = ({
  jobId,
  jobTitle,
}: {
  jobId: string
  jobTitle: string
}) => {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [loading, setLoading] = useState(false)

  const user = session?.user

  const handleApply = async () => {
    if (!user) {
      router.push(`/sign-in?redirectTo=/jobs/${jobId}`)
      return
    } else if (user.role === "seeker") {
      const application = {
        jobId,
        userId: user.id,
        email: user.email,
        jobTitle,
      }

      const res = await applyToJob(application)
      if(res.insertedId){
        console.log("application submitted successfully")
        router.push('/browse-jobs')
      }
    } else {
      console.log("user not seeker")
    }
  }

  return (
    <button
      type="button"
      onClick={handleApply}
      disabled={isPending || loading}
      className="rounded-lg bg-[#5c53fe] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4940e8] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? "Applying..." : "Apply Now"}
      <ArrowUpRight size={15} className="ml-1 inline" />
    </button>
  )
}

export default ApplyButton
