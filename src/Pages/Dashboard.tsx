// src/Pages/Dashboard.tsx (this acts as a layout)

import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import Cards from "@/Dashboard/card";
import UserDistributionChart from "@/Dashboard/userDistribution";
import StateWisePieChart from "@/Dashboard/StateDistribution";
import TrendingContent from "@/Dashboard/carsoul";

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main >
        <SidebarTrigger />
        <Outlet /> {/* This is where nested route content (children) will render */}
        
        {/* These components are always shown */}
        <Cards />
        <UserDistributionChart />
        <StateWisePieChart />
        <TrendingContent />
      </main>
    </SidebarProvider>
  );
}
