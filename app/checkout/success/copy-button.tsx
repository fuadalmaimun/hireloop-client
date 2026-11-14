"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="shrink-0 text-gray-400 transition hover:text-white"
      title="Copy Subscription ID"
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  )
}
