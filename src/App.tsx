import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./components/ui/app-sidebar"
import DashboardStats from "./Dashboard/dashboard"
import UserDistributionChart from "./Dashboard/userDistribution"
import StateWisePieChart from "./Dashboard/StateDistribution"
import TrendingContent from "./Dashboard/carsoul"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider >
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
        <DashboardStats/>
      <UserDistributionChart/>
      <StateWisePieChart/>
      <TrendingContent/>
        {/* <Button/> */}
      </main>
    </SidebarProvider>
  )
}