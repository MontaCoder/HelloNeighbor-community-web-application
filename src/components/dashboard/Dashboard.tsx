import { useAuth } from "@/components/auth/AuthProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AlertsPreview } from "@/components/dashboard/AlertsPreview";
import { EventsPreview } from "@/components/dashboard/EventsPreview";
import { LocationDetector } from "@/components/location/LocationDetector";
import { LocationMap } from "@/components/location/LocationMap";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, ArrowRight, Bell, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarContent } from "@/components/ui/sidebar";

export function Dashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#FAF9F6]">
        <AppSidebar />
        {isMobile && <SidebarContent />}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
            {/* Welcome Section */}
            <Card className="bg-white rounded-xl shadow-lg border-0 overflow-hidden transition-all duration-200 hover:shadow-xl">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-3">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 animate-fade-in">
                      Welcome back, {profile?.full_name || "Neighbor"}
                    </h1>
                    {profile?.neighborhood && (
                      <div className="flex items-center text-gray-600 animate-fade-in">
                        <MapPin className="h-5 w-5 mr-2 text-primary" />
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
            <Card className="border-0 shadow-lg overflow-hidden animate-fade-in transition-all duration-200 hover:shadow-xl">
              <CardContent className="p-0 relative">
                <div className="aspect-[16/9] md:aspect-[21/9] lg:aspect-[3/1] relative">
                  <LocationMap />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button 
                      variant="secondary" 
                      className="shadow-md hover:shadow-xl transition-all duration-200 hover:scale-105"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
              <div className="w-full group transition-all duration-200 hover:scale-[1.02]">
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Bell className="h-5 w-5 text-accent" />
                        Recent Alerts
                      </h2>
                    </div>
                    <AlertsPreview />
                  </CardContent>
                </Card>
              </div>
              <div className="w-full group transition-all duration-200 hover:scale-[1.02]">
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-accent" />
                        Upcoming Events
                      </h2>
                    </div>
                    <EventsPreview />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
