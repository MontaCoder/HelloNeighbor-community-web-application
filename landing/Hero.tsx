import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="relative min-h-screen flex items-center justify-center bg-fixed bg-cover bg-center"
      style={{
        backgroundImage: "url('/lovable-uploads/hood.png')" // Make sure to place your image in the public folder
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 mt-16">
        <h2 className="text-6xl font-bold mb-8 animate-fade-in">
          Welcome to Your Smart Neighborhood Experience
        </h2>
        <p className="text-2xl mb-12 leading-relaxed opacity-90">
          Join our community platform designed to bring neighbors together, 
          facilitate communication, and create a stronger, more connected neighborhood.
        </p>
        <div className="flex gap-6 justify-center">
          <Button 
            size="lg"
            variant="outline"
            className="text-lg px-8 py-6 bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-black transition-all duration-300"
            onClick={() => navigate("/auth?mode=sign-in")}
          >
            Learn More
          </Button>
          <Button 
            size="lg"
            className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 transition-all duration-300"
            onClick={() => navigate("/auth?mode=sign-up")}
          >
            Sign Up Now
          </Button>
        </div>
      </div>
    </div>
  );
};