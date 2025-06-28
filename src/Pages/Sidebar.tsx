// src/Pages/Dashboard.tsx

import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useLocation } from "react-router-dom";
import DashboardHome from "./DashboardHome";
import { Outlet } from "react-router-dom";
import ShowUserManagementPage from "@/components/ui/AdminDashboard/ShowUserMnagement";

export default function DashboardLayout() {
  const location = useLocation();

  const role = sessionStorage.getItem("role_name");

const showDashboardHome =
  (location.pathname === `/user-management` || location.pathname === "/")

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />

        <main className="flex-1 p-4 overflow-auto">
        <div className="flex justify-between items-center mb-4">
  <SidebarTrigger />
  {/* <ProfilePage /> */}
</div>


      {showDashboardHome && (
  role === "SuperAdmin" ? <ShowUserManagementPage /> : <DashboardHome />
)}

          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}

