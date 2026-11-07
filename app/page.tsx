import FeaturedJob from "@/components/featured-job";
import Footer from "@/components/footer";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#010109]">
      <Navbar />
      <Hero />
      <FeaturedJob />
      <Footer />
    </div>
  )
}
