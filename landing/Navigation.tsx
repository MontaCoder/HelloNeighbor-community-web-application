import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../src/components/ui/button";

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <img 
            src="/imgs/logo.png" 
            alt="Hello! Neighbour Logo" 
            className={`h-16 w-auto ${isScrolled ? 'filter-none' : 'brightness-0 invert'}`}
          />
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className={`hover:text-primary transition-colors ${isScrolled ? 'text-gray-600' : 'text-white'}`}>Home</a>
          <a href="#about" className={`hover:text-primary transition-colors ${isScrolled ? 'text-gray-600' : 'text-white'}`}>About Us</a>
          <a href="#help" className={`hover:text-primary transition-colors ${isScrolled ? 'text-gray-600' : 'text-white'}`}>Help</a>
          <Button 
            variant="outline" 
            size="default"  // Change from "md" to "default"
            className="transition-colors"
            onClick={() => navigate("/auth?mode=sign-in")}
          >
            Sign In
          </Button>
          <Button 
            variant="default" 
            size="default"  // Change from "md" to "default"
            className="ml-2"
            onClick={() => navigate("/auth?mode=sign-up")}
          >
            Sign Up
          </Button>
        </div>
      </div>
    </nav>
  );
};