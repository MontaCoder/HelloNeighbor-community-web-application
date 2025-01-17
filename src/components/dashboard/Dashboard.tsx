import { useAuth } from "@/components/auth/AuthProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AlertsPreview } from "@/components/dashboard/AlertsPreview";
import { EventsPreview } from "@/components/dashboard/EventsPreview";
import { LocationDetector } from "@/components/location/LocationDetector";
import { LocationMap } from "@/components/location/LocationMap";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function Dashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#FAF9F6]">
        <AppSidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 animate-fade-in">
            {/* Welcome Section */}
            <Card className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-2">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 animate-fade-in">
                      Welcome back, {profile?.full_name || "Neighbor"}
                    </h1>
                    {profile?.neighborhood && (
                      <div className="flex items-center text-gray-600 animate-fade-in delay-100">
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
            <Card className="border-0 shadow-sm overflow-hidden animate-fade-in delay-200">
              <CardContent className="p-0">
                <div className="aspect-[16/9] md:aspect-[21/9] lg:aspect-[3/1] relative">
                  <LocationMap />
                  <div className="absolute top-4 right-4">
                    <Button 
                      variant="secondary" 
                      className="shadow-md hover:shadow-lg transition-shadow"
                      onClick={() => navigate('/neighbors')}
                    >
                      View Neighbors
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alerts and Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in delay-300">
              <div className="w-full transition-transform hover:scale-[1.01] duration-200">
                <AlertsPreview />
              </div>
              <div className="w-full transition-transform hover:scale-[1.01] duration-200">
                <EventsPreview />
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}