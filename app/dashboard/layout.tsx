import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "../componets/DashboardSidebar"
import {  Toaster } from "@/components/ui/toast"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="bg-[#010109]">
      <DashboardSidebar />
      <main className="min-w-0 flex-1">
        <div className="p-3 sm:p-4">
          <SidebarTrigger />
        </div>
        {children}
      </main>
      <Toaster />
    </SidebarProvider>
  )
}
