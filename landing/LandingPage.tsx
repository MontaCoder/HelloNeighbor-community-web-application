import { Navigation } from "./Navigation";
import { Hero } from "./Hero";
import { Stats } from "./Stats";
import { Features } from "./Features";
import { Services } from "./Services";
import { Cta } from "./Cta";
import { Footer } from "./Footer";

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <Stats />
      <Features />
      <Services />
      <Cta />
      <Footer />
    </div>
  );
};