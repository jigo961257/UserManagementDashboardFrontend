import { useLocation } from "react-router-dom";
import {
  Calendar,
  Container,
  LayoutDashboard,
  Settings,
  TableOfContents,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items
const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "User Management", url: "/dashboard/user-management", icon: User },
  {
    title: "Content Management",
    url: "/dashboard/content-management",
    icon: Container,
  },
  {
    title: "Reports",
    url: "/dashboard/reports",
    icon: Calendar,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "Rules Management",
    url: "/dashboard/rules-management",
    icon: TableOfContents,
  },
  {
    title: "Automation Management",
    url: "/dashboard/automation-management",
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="text-white">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="mt-5">
              {items.map((item) => {
                const isActive = location.pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a
                        href={item.url}
                        className={`flex items-center space-x-2
                          "text-white font-semibold" : "text-gray-400"
                        }`}
                      >
                        <item.icon
                          className={`w-5 h-5 ${
                            isActive ? "text-white fill-white" : "text-white-200"
                          }`}
                        />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
