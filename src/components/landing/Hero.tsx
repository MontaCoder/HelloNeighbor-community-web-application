import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="relative h-[600px] flex items-center justify-center"
      style={{
        backgroundImage: "url('/imgs/hood.png')",
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
  );
};