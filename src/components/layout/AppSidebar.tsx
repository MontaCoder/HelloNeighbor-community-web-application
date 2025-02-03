import { Home, Bell, Calendar, ShoppingBag, MessageSquare, Users, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Home", icon: Home, path: "/" },
  { title: "Alerts", icon: Bell, path: "/alerts" },
  { title: "Events", icon: Calendar, path: "/events" },
  { title: "Exchange", icon: ShoppingBag, path: "/exchange" },
  { title: "Messages", icon: MessageSquare, path: "/messages" },
  { title: "Neighbors", icon: Users, path: "/neighbors" },
  { title: "Settings", icon: Settings, path: "/settings" },
];

export function AppSidebar({ isSidebarOpen, setIsSidebarOpen }) {
  const isMobile = useIsMobile();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.path} className="flex items-center gap-3 px-3 py-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {isMobile && (
        <button
          className="fixed bottom-4 right-4 z-50 p-2 bg-primary text-white rounded-full shadow-lg"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? "Close" : "Menu"}
        </button>
      )}
    </Sidebar>
  );
}
