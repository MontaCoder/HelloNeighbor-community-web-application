import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Cta = () => {
  const navigate = useNavigate();
  
  return (
    <div className="cta-section">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Join Our Smart Neighborhood Today</h2>
        <p className="mb-8">Sign up to start building connections and enhancing your local community</p>
        <div className="flex gap-4 justify-center">
          <Button 
            variant="outline" 
            className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            onClick={() => navigate("/auth?mode=sign-in")}
          >
            Learn More
          </Button>
          <Button 
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            onClick={() => navigate("/auth?mode=sign-up")}
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
};
