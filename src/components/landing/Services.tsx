import { Button } from "@/components/ui/button";
import { Sparkles, ShoppingBag, Calendar } from "lucide-react";

const services = [
  {
    icon: <Sparkles className="h-8 w-8" />,
    title: "Personalized Experience",
    description: "Discover features that match your needs and get insights into your community.",
    action: "Learn More",
    color: "from-primary/10 to-primary/5",
  },
  {
    icon: <ShoppingBag className="h-8 w-8" />,
    title: "Community Marketplace",
    description: "Connect with neighbors and trade locally. Find what you need right next door.",
    action: "Join Now",
    color: "from-accent/10 to-accent/5",
  },
  {
    icon: <Calendar className="h-8 w-8" />,
    title: "Events & Activities",
    description: "Stay involved and connected with your neighbors through exciting community events.",
    action: "Explore Events",
    color: "from-secondary/10 to-secondary/5",
  },
];

export const Services = () => {
  return (
    <div className="py-24 bg-card">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent mb-4 block">
            Tailored for you
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Services designed for community living
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to enhance your neighborhood experience in one place.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-2xl bg-gradient-to-br p-8 border border-border/40 shadow-soft-sm hover:shadow-soft-md transition-all duration-500 hover:-translate-y-1 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>

                <h4 className="text-xl font-semibold text-foreground mb-3">
                  {service.title}
                </h4>

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  className="shadow-sm group-hover:shadow-soft transition-all duration-300 btn-lift"
                >
                  {service.action}
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};