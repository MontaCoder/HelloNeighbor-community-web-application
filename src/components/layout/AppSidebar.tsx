import { Home, Bell, Calendar, ShoppingBag, MessageSquare, Users, Settings, Menu } from "lucide-react";
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
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

const menuItems = [
  { title: "Home", icon: Home, path: "/" },
  { title: "Alerts", icon: Bell, path: "/alerts" },
  { title: "Events", icon: Calendar, path: "/events" },
  { title: "Exchange", icon: ShoppingBag, path: "/exchange" },
  { title: "Messages", icon: MessageSquare, path: "/messages" },
  { title: "Neighbors", icon: Users, path: "/neighbors" },
  { title: "Settings", icon: Settings, path: "/settings" },
];

export function AppSidebar() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);

  return (
    <>
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      )}
      <Sidebar className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out fixed md:relative z-40`}>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="px-2 md:px-3">Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.path} className="flex items-center gap-3 px-2 md:px-3 py-2" onClick={() => isMobile && setIsOpen(false)}>
                        <item.icon className="h-5 w-5" />
                        <span className="text-sm md:text-base">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}