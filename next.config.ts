import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    /** Security upgrade agent flag — set by `next upgrade --agent=security`. */
    agentUpgrade: "security",
  },
}

export default nextConfig