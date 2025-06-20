// src/Pages/Dashboard.tsx (this acts as a layout)

import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import DashboardHome from "./DashboardHome";


export default function DashboardLayout() {
  return (
    <>
    <SidebarProvider>
      <AppSidebar />
      <main className="p-4"> {/* default width of sidebar */}
        {/* <SidebarTrigger /> */}

        <Outlet /> {/* This is where nested route content (children) will render */}
        
        <DashboardHome/>
      </main>
   </SidebarProvider>
    </>
  );
}
