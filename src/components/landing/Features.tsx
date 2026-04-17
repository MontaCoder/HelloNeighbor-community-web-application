import { useEffect, useRef, useState } from "react";
import { MessageSquare, Bell, Calendar, MapPin, Shield, Users } from "lucide-react";

const features = [
  {
    num: "01",
    icon: MessageSquare,
    title: "Community Chat",
    description: "Real-time messaging keeps neighbors connected. Share updates, ask questions, and build relationships with verified residents in your area. No more wondering if anyone on your street knows each other.",
    stat: "50k+ messages daily",
  },
  {
    num: "02",
    icon: Bell,
    title: "Smart Alerts",
    description: "Get notified about what matters. From safety concerns to community announcements, our intelligent alerting keeps everyone informed without the noise. The right info, at the right time.",
    stat: "< 30 second delivery",
  },
  {
    num: "03",
    icon: Calendar,
    title: "Event Management",
    description: "Plan and discover community events effortlessly. From block parties to book clubs, bring your community together with shared calendars. More attendance, less coordination headache.",
    stat: "2,500+ events monthly",
  },
  {
    num: "04",
    icon: MapPin,
    title: "Local Marketplace",
    description: "Buy, sell, and trade with neighbors you trust. Find local services, borrow tools, or give away items you no longer need. Good for your wallet, good for the planet.",
    stat: "$0 listing fees",
  },
];

export const Features = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" ref={sectionRef} className="py-24 bg-background relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-muted/50 via-background to-background" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-16">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent mb-4 block">
            Built for community
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight leading-[1.1]">
            Tools that bring people together
          </h2>
          <p className="text-lg text-muted-foreground">
            Purpose-built features designed for the way real neighborhoods work. Not a generic app with community features bolted on—but something built from the ground up for neighbors.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`group ${isVisible ? "animate-fade-in" : "opacity-0"}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-6">
                  <span className="text-6xl font-bold text-muted/20 leading-none select-none">
                    {feature.num}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {feature.description}
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-xs font-medium text-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature.stat}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-24 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-primary-dark via-primary to-primary-light relative overflow-hidden">
          <div className="absolute inset-0 hood-bg bg-cover bg-center opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 to-transparent" />

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Your neighborhood deserves better than a Facebook group
              </h3>
              <p className="text-white/70">
                Join the communities that made the switch.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {["Oak", "Will", "Riv", "Ced", "Map"].map((name, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-white to-white/80 text-primary flex items-center justify-center text-sm font-bold ring-2 ring-white/50"
                  >
                    {name}
                  </div>
                ))}
              </div>
              <div className="text-white">
                <p className="font-semibold">1,200+ neighborhoods</p>
                <p className="text-sm text-white/60">trust HelloNeighbor</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
