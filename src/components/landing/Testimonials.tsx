import { useEffect, useRef, useState } from "react";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "HelloNeighbor transformed how we stay connected. After 15 years in the same neighborhood, I finally know my neighbors' names. We've started a weekly potluck that has become the highlight of our week.",
    author: "Maria Rodriguez",
    role: "Oakwood Heights Resident",
    avatar: "M",
    avatarBg: "bg-primary",
  },
  {
    quote:
      "The alert system saved my dog's life. When she got out during a storm, I posted an alert and within 20 minutes three neighbors had spotted her. This platform is a game-changer for community safety.",
    author: "James Chen",
    role: "Willowbrook Community Member",
    avatar: "J",
    avatarBg: "bg-secondary",
  },
  {
    quote:
      "Our HOA meetings used to have 10% attendance. Now with HelloNeighbor, we're at 85%. The ease of posting events and the reminder system brought our community together like never before.",
    author: "Sarah Thompson",
    role: "Riverside HOA President",
    avatar: "S",
    avatarBg: "bg-accent",
  },
];

export const Testimonials = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="py-24 bg-muted/30 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent mb-4 block">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Stories from real communities
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See how HelloNeighbor is bringing neighborhoods together across the
            country.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`relative bg-card rounded-2xl p-8 shadow-soft border border-border/40 ${
                isVisible ? "animate-scale-in" : "opacity-0"
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="absolute -top-4 left-8">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <Quote className="w-4 h-4 text-accent" />
                </div>
              </div>

              <p className="text-foreground leading-relaxed mb-8 pt-4">
                "{testimonial.quote}"
              </p>

              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full ${testimonial.avatarBg} text-white flex items-center justify-center text-lg font-semibold`}
                >
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`mt-16 text-center ${
            isVisible ? "animate-slide-up" : "opacity-0"
          }`}
        >
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <span>Trusted by neighbors in</span>
            <div className="flex -space-x-2">
              {["CA", "NY", "TX", "FL", "WA", "CO"].map((state) => (
                <div
                  key={state}
                  className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium text-foreground"
                >
                  {state}
                </div>
              ))}
            </div>
            <span>and 45+ more states</span>
          </div>
        </div>
      </div>
    </section>
  );
};