import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Navigation = () => {
  const navigate = useNavigate();
  
  return (
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
  );
};