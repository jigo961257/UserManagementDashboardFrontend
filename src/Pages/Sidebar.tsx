// src/Pages/Dashboard.tsx

import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardHome from "./DashboardHome";

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full"> {/* Flex wrapper added here */}
        <AppSidebar />

        <main className="flex-1 p-4 overflow-auto">
          <SidebarTrigger className="mb-4" />
          
          {/* If you're navigating between pages, use Outlet */}
          {/* <Outlet /> */}
          <DashboardHome />
        </main>
      </div>
    </SidebarProvider>
  );
}
