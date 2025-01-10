import { useAuth } from "@/components/auth/AuthProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AlertsPreview } from "@/components/dashboard/AlertsPreview";
import { EventsPreview } from "@/components/dashboard/EventsPreview";
import { LocationDetector } from "@/components/location/LocationDetector";
import { LocationMap } from "@/components/location/LocationMap";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function Dashboard() {
  const { profile } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#FAF9F6]">
        <AppSidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
            {/* Welcome Card */}
            <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-2">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                      Welcome back, {profile?.full_name || "Neighbor"}
                    </h1>
                    {profile?.neighborhood && (
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-5 w-5 mr-2" />
                        <p className="text-base md:text-lg">
                          {profile.neighborhood}
                        </p>
                      </div>
                    )}
                  </div>
                  <LocationDetector />
                </div>
              </CardContent>
            </Card>

            {/* Map Section */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-0">
                <div className="aspect-[16/9] md:aspect-[21/9] lg:aspect-[3/1]">
                  <LocationMap />
                </div>
              </CardContent>
            </Card>

            {/* Alerts and Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="w-full">
                <AlertsPreview />
              </div>
              <div className="w-full">
                <EventsPreview />
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}