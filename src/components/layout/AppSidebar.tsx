import { NavLink } from "react-router-dom"
import {
  Bell,
  Calendar,
  Home,
  MessageSquare,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"

const menuItems = [
  { title: "Home", icon: Home, path: "/" },
  { title: "Alerts", icon: Bell, path: "/alerts" },
  { title: "Events", icon: Calendar, path: "/events" },
  { title: "Exchange", icon: ShoppingBag, path: "/exchange" },
  { title: "Messages", icon: MessageSquare, path: "/messages" },
  { title: "Neighbors", icon: Users, path: "/neighbors" },
  { title: "Settings", icon: Settings, path: "/settings" },
]

export function AppSidebar() {
  return (
    <aside className="w-full border-b border-border bg-background/95 px-4 py-4 shadow-sm backdrop-blur md:sticky md:top-0 md:h-svh md:w-64 md:border-b-0 md:border-r">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          HelloNeighbor
        </p>
        <h2 className="text-2xl font-semibold text-primary">Community</h2>
      </div>

      <nav className="grid grid-cols-2 gap-2 md:flex md:flex-col">
        {menuItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground hover:bg-muted"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
