import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#010109]">
      <Navbar />
      <Hero />
    </div>
  )
}
