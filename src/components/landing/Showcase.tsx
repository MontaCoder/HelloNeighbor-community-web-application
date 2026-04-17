import { useEffect, useRef, useState } from "react";
import { MessageSquare, Bell, Calendar, Users, MapPin, Shield } from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    name: "Community Chat",
    desc: "Real-time messaging with verified neighbors",
    color: "bg-accent",
  },
  {
    icon: Bell,
    name: "Smart Alerts",
    desc: "Instant notifications for what matters",
    color: "bg-red-500",
  },
  {
    icon: Calendar,
    name: "Events",
    desc: "Organize and discover community events",
    color: "bg-primary",
  },
  {
    icon: Users,
    name: "Neighbors",
    desc: "Connect with people in your area",
    color: "bg-secondary",
  },
  {
    icon: MapPin,
    name: "Marketplace",
    desc: "Buy, sell, and trade locally",
    color: "bg-blue-500",
  },
  {
    icon: Shield,
    name: "Verified",
    desc: "Safe and trusted community",
    color: "bg-amber-500",
  },
];

export const Showcase = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="showcase" ref={ref} className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-accent mb-4 block animate-slide-up">
              The complete solution
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight animate-slide-up stagger-1">
              Everything your neighborhood needs, in one place
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10 animate-slide-up stagger-2">
              HelloNeighbor brings together the tools your community needs to thrive. From staying informed about what's happening on your block to organizing the next community potluck.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-4 rounded-xl bg-card border border-border/40 hover:shadow-soft-md transition-all duration-300 animate-slide-up`}
                  style={{ animationDelay: `${300 + i * 50}ms` }}
                >
                  <div className={`w-10 h-10 rounded-lg ${feature.color}/10 flex items-center justify-center`}>
                    <feature.icon className={`h-5 w-5 text-foreground`} style={{ color: feature.color.replace('bg-', '') }} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{feature.name}</p>
                    <p className="text-xs text-muted-foreground">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`relative ${isVisible ? "animate-fade-in" : "opacity-0"}`} style={{ animationDelay: "200ms" }}>
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 rounded-3xl blur-2xl" />

            <div className="relative bg-card rounded-2xl shadow-soft-xl border border-border/40 overflow-hidden">
              <div className="aspect-[4/3] relative">
                <picture className="block w-full h-full">
                  <source srcSet="/imgs/hood.avif" type="image/avif" />
                  <source srcSet="/imgs/hood.webp" type="image/webp" />
                  <img
                    src="/imgs/hood.webp"
                    alt="Neighborhood"
                    className="block w-full h-full object-cover"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-soft-lg border border-white/20">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">Community Chat</p>
                        <p className="text-xs text-muted-foreground">24 neighbors active now</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-medium text-accent">S</div>
                        <p className="text-xs text-foreground bg-muted/50 rounded-lg px-3 py-1.5">Has anyone seen a gray tabby cat?</p>
                      </div>
                      <div className="flex items-start gap-2 justify-end">
                        <p className="text-xs text-white bg-primary rounded-lg px-3 py-1.5">Yes! She's safe now 😊</p>
                        <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center text-[10px] font-medium text-secondary">M</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-border/40">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex -space-x-2">
                    {["Oakwood", "Willowbrook", "Riverside", "Cedar"].map((name, i) => (
                      <div
                        key={i}
                        className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary-light text-white flex items-center justify-center text-[10px] font-semibold ring-2 ring-card"
                      >
                        {name[0]}
                      </div>
                    ))}
                  </div>
                  <span>+1,196 neighbors connected</span>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 bg-card rounded-xl shadow-soft-lg border border-border/40 p-3 animate-float">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs font-medium text-foreground">All systems operational</span>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-card rounded-xl shadow-soft-lg border border-border/40 p-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">Next Event</p>
                  <p className="text-[10px] text-muted-foreground">Block Party • Tomorrow 4pm</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
