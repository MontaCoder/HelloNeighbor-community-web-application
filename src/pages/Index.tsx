import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AlertsPreview } from "@/components/dashboard/AlertsPreview";
import { EventsPreview } from "@/components/dashboard/EventsPreview";
import { LandingPage } from "@/components/landing/LandingPage";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  // If user is logged in, show the dashboard
  if (user) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-[#FAF9F6]">
          <AppSidebar />
          <main className="flex-1 p-6">
            <div className="max-w-6xl mx-auto">
              <header className="mb-8">
                <h1 className="text-4xl font-bold text-primary mb-2">
                  Welcome, {user?.email || "Neighbor"}
                </h1>
                <p className="text-lg text-gray-600">Stay connected with your community</p>
              </header>
              
              <div className="grid gap-6 md:grid-cols-2">
                <AlertsPreview />
                <EventsPreview />
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  // Landing page for non-authenticated users
  return <LandingPage />;
};

export default Index;