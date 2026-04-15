import { Navigation } from "./Navigation";
import { Hero } from "./Hero";
import { Stats } from "./Stats";
import { Features } from "./Features";
import { Showcase } from "./Showcase";
import { Testimonials } from "./Testimonials";
import { Cta } from "./Cta";
import { Footer } from "./Footer";

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <Stats />
      <Showcase />
      <Features />
      <Testimonials />
      <Cta />
      <Footer />
    </div>
  );
};