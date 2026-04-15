import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const Cta = () => {
  const navigate = useNavigate();

  const benefits = [
    "Free forever for neighborhoods",
    "Setup in under 5 minutes",
    "No credit card required",
    "Verified community members only",
  ];

  return (
    <section className="py-32 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-fixed bg-cover bg-center"
        style={{ backgroundImage: "url('/imgs/hood.png')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/95 via-primary-dark/85 to-primary-dark/90" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/50 via-transparent to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          <span className="text-sm font-medium text-white/90">
            First 100 neighborhoods get premium features free
          </span>
        </div>

        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 tracking-tight leading-[1]">
          Ready to meet
          <br />
          <span className="text-accent">your neighbors?</span>
        </h2>

        <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed">
          Join thousands of neighborhoods that have already discovered a better way to connect. It takes less than 5 minutes to get started.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button
            size="lg"
            className="btn-lift bg-white text-primary hover:bg-white/90 text-lg font-semibold px-10 py-7 h-auto shadow-soft-xl"
            onClick={() => navigate("/auth?mode=sign-up")}
          >
            Create your neighborhood
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="btn-lift bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 text-lg px-10 py-7 h-auto"
            onClick={() => navigate("/auth?mode=sign-in")}
          >
            Sign in
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-white/60">
          {benefits.map((benefit, i) => (
            <div key={i} className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};