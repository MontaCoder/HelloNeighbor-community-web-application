import { useAuth } from "@/components/auth/AuthProvider";
import { Card } from "@/components/ui/card";
import { AlertsPreview } from "@/components/dashboard/AlertsPreview";
import { EventsPreview } from "@/components/dashboard/EventsPreview";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export function Dashboard() {
  const { profile } = useAuth();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background w-full">
        <AppSidebar />
        <main className="flex-1">
          <div className="container mx-auto p-4 space-y-6">
            <h1 className="text-2xl font-bold">Welcome, {profile?.full_name}</h1>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Alerts</h2>
                <AlertsPreview />
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
                <EventsPreview />
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}