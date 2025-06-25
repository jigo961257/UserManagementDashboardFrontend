import { useLocation } from "react-router-dom";
import {
  Calendar,
  Container,
  
  Settings,
  TableOfContents,
  User,
  User2,
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
  // { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "User Management", url: "user-management", icon: User },
  {
    title: "Content Management",
    url: "content-management",
    icon: Container,
  },
  {
    title: "Reports",
    url: "reports",
    icon: Calendar,
  },
  {
    title: "Settings",
    url: "settings",
    icon: Settings,
  },
  {
    title: "Rules Management",
    url: "rules-management",
    icon: TableOfContents,
  },
  {
    title: "Automation Management",
    url: "automation-management",
    icon: Settings,
  },
  // {
  //   title: "Logout",
  //   url: "/",
  //   icon: User2,
  // },
];

const logoutItem = {
  title: "Logout",
  url: "/",
  icon: User2,
};

export function AppSidebar() {
  const location = useLocation();
  const role = (sessionStorage.getItem("role_name") || "");


  return (
    <Sidebar className="text-white">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="mt-5">
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                console.log(isActive);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a
                         href={`/${item.url}`} 
                        className={`flex items-center space-x-2
                          "text-white font-semibold" : "text-gray-400" 
                        }`}
                                  onClick={() => {
            if (item.title === "Logout") {
              sessionStorage.removeItem("accessToken");
              sessionStorage.removeItem("roleName");
            }
          }}
         

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
          {/* Bottom Logout item */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="mb-5">
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a
                    href={logoutItem.url}
                    onClick={() => {
                      sessionStorage.removeItem("accessToken");
                      sessionStorage.removeItem("roleName");
                    }}
                    className="flex items-center space-x-2 "
                  >
                    <logoutItem.icon className="w-5 h-5" />
                    <span>{logoutItem.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

