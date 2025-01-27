import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="relative min-h-screen flex items-center justify-center bg-fixed bg-cover bg-center"
      style={{
        backgroundImage: "url('/imgs/hood.png')" 
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 mt-16">
        <h2 className="text-5xl md:text-6xl font-bold mb-6 md:mb-8 animate-fade-in">
          Welcome to Your Smart Neighborhood Experience
        </h2>
        <p className="text-xl md:text-2xl mb-10 md:mb-12 leading-relaxed opacity-90">
          Join our community platform designed to bring neighbors together, 
          facilitate communication, and create a stronger, more connected neighborhood.
        </p>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center">
          <Button 
            variant="outline" 
            size="lg"
            className="w-full md:w-auto bg-white text-primary hover:bg-primary hover:text-white border-2 border-white transition-all duration-300"
            onClick={() => navigate("/auth?mode=sign-in")}
          >
            Learn More
          </Button>
          <Button 
            variant="default" 
            size="lg"
            className="w-full md:w-auto"
            onClick={() => navigate("/auth?mode=sign-up")}
          >
            Sign Up Now
          </Button>
        </div>
      </div>
    </div>
  );
};