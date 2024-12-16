import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AlertsPreview } from "@/components/dashboard/AlertsPreview";
import { EventsPreview } from "@/components/dashboard/EventsPreview";
import { useAuth } from "@/components/auth/AuthProvider";

const Index = () => {
  const { profile } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#FAF9F6]">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-primary mb-2">
                Welcome, {profile?.full_name || "Neighbor"}
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
};

export default Index;