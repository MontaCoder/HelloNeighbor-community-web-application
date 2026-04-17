import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "py-2" : "py-4"}`}>
      <div className={`absolute inset-0 transition-all duration-500 ${isScrolled ? "bg-background/95 backdrop-blur-xl border-b border-border/10 shadow-soft-sm" : "bg-transparent"}`} />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center">
          <a href="/" className="flex items-center gap-2.5 group">
            <img
              src="/imgs/logo.png"
              alt="HelloNeighbor"
              className={`h-10 w-auto transition-all duration-300 ${isScrolled ? "" : "brightness-0 invert"}`}
            />
            <span className={`font-semibold text-lg tracking-tight transition-colors duration-300 ${isScrolled ? "text-foreground" : "text-white"}`}>
              HelloNeighbor
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className={`text-sm font-medium transition-colors duration-200 hover:text-primary ${isScrolled ? "text-muted-foreground" : "text-white/80"}`}
            >
              Features
            </a>
            <a
              href="#showcase"
              className={`text-sm font-medium transition-colors duration-200 hover:text-primary ${isScrolled ? "text-muted-foreground" : "text-white/80"}`}
            >
              How it works
            </a>
            <a
              href="#testimonials"
              className={`text-sm font-medium transition-colors duration-200 hover:text-primary ${isScrolled ? "text-muted-foreground" : "text-white/80"}`}
            >
              Stories
            </a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button
              variant={isScrolled ? "ghost" : "ghost"}
              size="sm"
              onClick={() => navigate("/auth?mode=sign-in")}
              className={isScrolled ? "text-muted-foreground" : "text-white/80 hover:text-white hover:bg-white/10"}
            >
              Sign in
            </Button>
            <Button
              size="sm"
              className="btn-lift"
              onClick={() => navigate("/auth?mode=sign-up")}
            >
              Get started
            </Button>
          </div>

          <button
            className={`md:hidden p-2 rounded-lg transition-colors ${isScrolled ? "text-foreground hover:bg-muted" : "text-white hover:bg-white/10"}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? "max-h-96" : "max-h-0"}`}>
        <div className={`absolute inset-x-0 top-full backdrop-blur-xl border-b px-6 py-6 space-y-4 ${isScrolled ? "bg-background/95 border-border/10" : "bg-black/90 border-white/10"}`}>
          <a href="#features" className={`block font-medium transition-colors py-2 ${isScrolled ? "text-foreground" : "text-white"}`}>
            Features
          </a>
          <a href="#showcase" className={`block font-medium transition-colors py-2 ${isScrolled ? "text-foreground" : "text-white"}`}>
            How it works
          </a>
          <a href="#testimonials" className={`block font-medium transition-colors py-2 ${isScrolled ? "text-foreground" : "text-white"}`}>
            Stories
          </a>
          <div className="flex gap-3 pt-4 border-t border-border/10">
            <Button variant="outline" className="flex-1" onClick={() => navigate("/auth?mode=sign-in")}>
              Sign in
            </Button>
            <Button className="flex-1" onClick={() => navigate("/auth?mode=sign-up")}>
              Get started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
