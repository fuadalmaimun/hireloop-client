"use client"

import * as React from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"
import type { JobFormData } from "@/lib/types/job"

interface DeleteJobDialogProps {
  job: JobFormData
  onDelete: () => void
}

export function DeleteJobDialog({ job, onDelete }: DeleteJobDialogProps) {
  const jobIdentifier = job?._id

  return (
    <AlertDialog>
      <AlertDialogTrigger
        aria-label="Delete job"
        className="inline-flex size-8 items-center justify-center rounded-md p-2 text-white/50 transition-colors hover:bg-[#ef4444]/10 hover:text-[#f87171]"
      >
        <Trash2 className="size-4" />
      </AlertDialogTrigger>

      <AlertDialogContent className="border-white/10 bg-[#141418] text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold text-[#ededef]">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-[#a0a0ab]">
            This action cannot be undone. This will permanently delete this job
            post
            {jobIdentifier ? ` (Ref: ${jobIdentifier})` : ""} and remove its
            data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="border-white/10 bg-transparent text-white hover:bg-white/10 hover:text-white">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="bg-[#ef4444] text-white hover:bg-[#dc2626]"
          >
            Yes, delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
