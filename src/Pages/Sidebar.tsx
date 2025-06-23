// src/Pages/Dashboard.tsx

import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useLocation } from "react-router-dom";
import DashboardHome from "./DashboardHome";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  const location = useLocation();

  // Only render DashboardHome for /user-management path
  const showDashboardHome = location.pathname === "/user-management";
    // const showDashboardHome = ["/user-management", "/content-management"].includes(location.pathname);
// 

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />

        <main className="flex-1 p-4 overflow-auto">
          <SidebarTrigger className="mb-4" />

          {/* Conditionally show DashboardHome only on user-management */}
          {showDashboardHome && <DashboardHome />}

          {/* Always render nested route content */}
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
