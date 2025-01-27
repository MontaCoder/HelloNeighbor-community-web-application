import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  const navigate = useNavigate();
  
  return (
    <footer className="footer-section">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold text-xl mb-4">Stay Connected with Your Community</h3>
          <p className="mb-4">Join today to experience the future of neighborhood living</p>
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
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
          <ul className="space-y-2 social-links">
            <li><a href="#" className="hover:underline">Facebook</a></li>
            <li><a href="#" className="hover:underline">Twitter</a></li>
            <li><a href="#" className="hover:underline">Instagram</a></li>
            <li><a href="#" className="hover:underline">LinkedIn</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-primary-foreground/20">
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
  );
};
