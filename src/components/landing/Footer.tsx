import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Bird, Briefcase, Camera, Code2, Globe } from "lucide-react";

export const Footer = () => {
  const navigate = useNavigate();

  const footerLinks = {
    Product: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Security", href: "#security" },
      { label: "Integrations", href: "#integrations" },
    ],
    Company: [
      { label: "About", href: "#about" },
      { label: "Blog", href: "#blog" },
      { label: "Careers", href: "#careers" },
      { label: "Press", href: "#press" },
    ],
    Resources: [
      { label: "Help Center", href: "#help" },
      { label: "Community Guidelines", href: "#guidelines" },
      { label: "API Documentation", href: "#api" },
      { label: "Status", href: "#status" },
    ],
    Legal: [
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Terms of Service", href: "#terms" },
      { label: "Cookie Policy", href: "#cookies" },
      { label: "GDPR", href: "#gdpr" },
    ],
  };

  const socialLinks = [
    { icon: Bird, href: "#", label: "Twitter" },
    { icon: Globe, href: "#", label: "Facebook" },
    { icon: Camera, href: "#", label: "Instagram" },
    { icon: Briefcase, href: "#", label: "LinkedIn" },
    { icon: Code2, href: "#", label: "GitHub" },
  ];

  return (
    <footer className="bg-background border-t border-border/40">
      <div className="max-w-6xl mx-auto px-6">
        <div className="py-16">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
            <div className="col-span-2">
              <a href="/" className="flex items-center gap-2 mb-6">
                <img
                  src="/imgs/logo.png"
                  alt="HelloNeighbor"
                  className="h-8 w-auto"
                />
                <span className="font-semibold text-foreground text-lg">
                  HelloNeighbor
                </span>
              </a>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-xs">
                Building stronger communities, one connection at a time. Join
                thousands of neighborhoods transforming how they connect.
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-3">
                {footerLinks.Product.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-3">
                {footerLinks.Company.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Resources</h4>
              <ul className="space-y-3">
                {footerLinks.Resources.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-3">
                {footerLinks.Legal.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="py-6 border-t border-border/40">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 HelloNeighbor. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Button
                size="sm"
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => navigate("/auth")}
              >
                Sign in
              </Button>
              <Button
                size="sm"
                className="btn-lift"
                onClick={() => navigate("/auth?mode=sign-up")}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
