import { NavLink } from "react-router-dom";
import {
  Bell,
  Calendar,
  Home,
  MessageSquare,
  Settings,
  ShoppingBag,
  Users,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { title: "Home", icon: Home, path: "/" },
  { title: "Alerts", icon: Bell, path: "/alerts", badge: null },
  { title: "Events", icon: Calendar, path: "/events" },
  { title: "Exchange", icon: ShoppingBag, path: "/exchange" },
  { title: "Messages", icon: MessageSquare, path: "/messages" },
  { title: "Neighbors", icon: Users, path: "/neighbors" },
  { title: "Settings", icon: Settings, path: "/settings" },
];

export function AppSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || user?.email?.[0]?.toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/95 backdrop-blur-lg shadow-soft-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <NavLink to="/" className="flex items-center gap-2">
              <img
                src="/imgs/logo.png"
                alt="HelloNeighbor"
                className="h-8 w-auto"
              />
              <span className="font-semibold text-primary hidden sm:block">
                HelloNeighbor
              </span>
            </NavLink>

            <nav className="hidden md:flex items-center gap-1">
              {menuItems.map((item) => (
                <NavLink
                  key={item.title}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-soft-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <Avatar className="h-9 w-9 ring-2 ring-primary/10">
                <AvatarImage src={profile?.avatar_url || ""} />
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden lg:block">
                <p className="text-sm font-medium text-foreground">
                  {profile?.full_name || "Neighbor"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {profile?.full_name ? "Community Member" : user?.email}
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground hidden sm:flex"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
            </Button>

            <button
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <nav className="bg-white border-t border-border/40 px-4 py-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </NavLink>
          ))}
          <button
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </nav>
      </div>
    </header>
  );
}