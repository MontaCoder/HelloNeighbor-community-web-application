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
        <div className="flex items-center gap-4">
          <a href="#" className="text-gray-600 hover:text-gray-900">Home</a>
          <a href="#about" className="text-gray-600 hover:text-gray-900">About Us</a>
          <a href="#help" className="text-gray-600 hover:text-gray-900">Help</a>
          <Button 
            variant="outline" 
            onClick={() => navigate("/auth?mode=sign-in")}
          >
            Sign In
          </Button>
          <Button 
            className="bg-primary"
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
          backgroundImage: "url('/lovable-uploads/3c81abf5-3723-43a2-ab93-b842264d83e8.png')",
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
      <div className="bg-primary py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-4 gap-8 text-center">
          <div className="text-white">
            <div className="text-4xl font-bold mb-2">99%</div>
            <div className="text-sm opacity-80">Community Satisfaction</div>
          </div>
          <div className="text-white">
            <div className="text-4xl font-bold mb-2">1.2k</div>
            <div className="text-sm opacity-80">Active Members</div>
          </div>
          <div className="text-white">
            <div className="text-4xl font-bold mb-2">125+</div>
            <div className="text-sm opacity-80">Monthly Events</div>
          </div>
          <div className="text-white">
            <div className="text-4xl font-bold mb-2">10%</div>
            <div className="text-sm opacity-80">Growth Rate</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Essential Services for Community Managers</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">Seamless Event Management for Your Community</h3>
              <p className="text-gray-600">Plan, organize, and manage community events with ease</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">Efficient Resident Issue Reporting System</h3>
              <p className="text-gray-600">Track and resolve resident issues quickly and effectively</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">Insightful Neighborhood Analytics at Your Fingertips</h3>
              <p className="text-gray-600">Get valuable insights into your community's needs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2">Explore Our Tailored Services for</h2>
          <h3 className="text-2xl text-center mb-12">an Enhanced Community Living Experience</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h4 className="text-xl font-bold mb-4">Discover Personalized Features Designed Just for You</h4>
              <p className="text-gray-600 mb-4">Get insights into your community and discover features that match your needs</p>
              <Button variant="outline">Learn More</Button>
            </div>
            <div className="text-center">
              <h4 className="text-xl font-bold mb-4">Join the Marketplace to Buy and Sell Within Your Community</h4>
              <p className="text-gray-600 mb-4">Connect with neighbors and trade locally</p>
              <Button variant="outline">Sign Up</Button>
            </div>
            <div className="text-center">
              <h4 className="text-xl font-bold mb-4">Sign Up for Exciting Community Events and Activities</h4>
              <p className="text-gray-600 mb-4">Stay involved and connected with your neighbors</p>
              <Button variant="outline">Sign Up</Button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Smart Neighborhood Today</h2>
          <p className="mb-8">Sign up to start building connections and enhancing your local community</p>
          <div className="flex gap-4 justify-center">
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-black"
              onClick={() => navigate("/auth?mode=sign-in")}
            >
              Learn More
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={() => navigate("/auth?mode=sign-up")}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-xl mb-4">Stay Connected with Your Community</h3>
            <p className="mb-4">Join today to experience the future of neighborhood living</p>
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-primary"
              >
                Learn More
              </Button>
              <Button 
                className="bg-white text-primary hover:bg-white/90"
                onClick={() => navigate("/auth?mode=sign-up")}
              >
                Sign Up
              </Button>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4">About Us</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Contact Us</a></li>
              <li><a href="#" className="hover:underline">Support</a></li>
              <li><a href="#" className="hover:underline">Marketing</a></li>
              <li><a href="#" className="hover:underline">Become a Partner</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Legal Services</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="hover:underline">Terms of Service</a></li>
              <li><a href="#" className="hover:underline">User Guide</a></li>
              <li><a href="#" className="hover:underline">Site Map</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Follow Us</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Facebook</a></li>
              <li><a href="#" className="hover:underline">Twitter</a></li>
              <li><a href="#" className="hover:underline">Instagram</a></li>
              <li><a href="#" className="hover:underline">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-white/20">
          <div className="flex justify-between items-center">
            <p>&copy; 2024 Hello! Neighbour. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:underline">Privacy Policy</a>
              <a href="#" className="hover:underline">Terms of Service</a>
              <a href="#" className="hover:underline">Cookies Settings</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;