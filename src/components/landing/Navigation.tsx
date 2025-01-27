import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Navigation = () => {
  const navigate = useNavigate();
  
  return (
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center bg-primary-light text-primary-foreground">
      <div className="flex items-center">
        <img src="/imgs/logo.png" alt="Hello! Neighbour Logo" className="h-10" />
      </div>
      <div className="flex items-center gap-4">
        <a href="#" className="hover:text-secondary-dark">Home</a>
        <a href="#about" className="hover:text-secondary-dark">About Us</a>
        <a href="#help" className="hover:text-secondary-dark">Help</a>
        <Button 
          variant="outline" 
          className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
          onClick={() => navigate("/auth?mode=sign-in")}
        >
          Sign In
        </Button>
        <Button 
          className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          onClick={() => navigate("/auth?mode=sign-up")}
        >
          Sign Up
        </Button>
      </div>
    </nav>
  );
};
