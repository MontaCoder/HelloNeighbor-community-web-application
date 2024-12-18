import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AlertsPreview } from "@/components/dashboard/AlertsPreview";
import { EventsPreview } from "@/components/dashboard/EventsPreview";

const Index = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

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
  }

  // Landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-primary">Hello! Neighbour</h1>
        </div>
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate("/auth?mode=sign-in")}
          >
            Sign In
          </Button>
          <Button 
            onClick={() => navigate("/auth?mode=sign-up")}
          >
            Sign Up
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div 
        className="relative h-[600px] flex items-center justify-center"
        style={{
          backgroundImage: "url('/lovable-uploads/64c21a70-029f-489c-8202-9d98b5fae77f.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center text-white max-w-3xl mx-auto px-4">
          <h2 className="text-5xl font-bold mb-6">
            Welcome to Your Smart Neighborhood Experience
          </h2>
          <p className="text-xl mb-8">
            Join our community platform designed to bring neighbors together, 
            facilitate communication, and create a stronger, more connected neighborhood.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg"
              variant="outline"
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
              onClick={() => navigate("/auth?mode=sign-in")}
            >
              Learn More
            </Button>
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90"
              onClick={() => navigate("/auth?mode=sign-up")}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-primary text-white py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold">99%</div>
            <div className="text-sm opacity-80">Community Satisfaction</div>
          </div>
          <div>
            <div className="text-3xl font-bold">1.2k</div>
            <div className="text-sm opacity-80">Active Members</div>
          </div>
          <div>
            <div className="text-3xl font-bold">125+</div>
            <div className="text-sm opacity-80">Monthly Events</div>
          </div>
          <div>
            <div className="text-3xl font-bold">10%</div>
            <div className="text-sm opacity-80">Growth Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;