// src/Pages/Dashboard.tsx

import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useLocation } from "react-router-dom";
import DashboardHome from "./DashboardHome";
import { Outlet } from "react-router-dom";
import UserManagementPage from "@/components/ui/AdminDashboard/ShowUserMnagement";
import UserManagement from "@/components/ui/Dashboard/UserMnagement";
import ProfilePage from "@/components/Profile";
import ShowUserManagementPage from "@/components/ui/AdminDashboard/ShowUserMnagement";

export default function DashboardLayout() {
  const location = useLocation();

  const role = sessionStorage.getItem("roleName");

  // const showDashboardHome = location.pathname === `/${role}/user-management` || location.pathname === "/";
// const showDashboardHome =
//     (location.pathname === `/${role}/user-management` || location.pathname === "/") &&
//     role !== "Admin"; // Don't show for admin
const showDashboardHome =
  (location.pathname === `/${role}/user-management` || location.pathname === "/") &&
  !["admin", "superadmin"].includes(role); 

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />

        <main className="flex-1 p-4 overflow-auto">
        <div className="flex justify-between items-center mb-4">
  <SidebarTrigger />
  <ProfilePage />
</div>


          {/* {showDashboardHome && <DashboardHome />} */}
      {showDashboardHome && (
  role === "Admin" || "SuperAdmin" ? <ShowUserManagementPage /> : <DashboardHome />
)}


          {/* <DashboardHome/> */}

          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
