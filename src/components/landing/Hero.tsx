import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
      <div
        className="absolute inset-0 bg-fixed bg-cover bg-center"
        style={{ backgroundImage: "url('/imgs/hood.png')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/95 via-primary-dark/85 to-primary-dark/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/50 via-transparent to-transparent" />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span className="text-xs font-medium text-white/90">
                Now in 1,200+ neighborhoods
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 animate-slide-up">
              Your neighborhood,{" "}
              <span className="text-accent">reimagined</span>
            </h1>

            <p className="text-lg text-white/80 leading-relaxed mb-10 animate-slide-up stagger-1">
              The modern platform that transforms how communities connect,
              communicate, and thrive together. Built for neighbors, by
              neighbors.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up stagger-2">
              <Button
                size="lg"
                className="btn-lift group bg-white text-primary hover:bg-white/90"
                onClick={() => navigate("/auth?mode=sign-up")}
              >
                Start for free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="btn-lift bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
                onClick={() => navigate("/auth?mode=sign-in")}
              >
                See it in action
              </Button>
            </div>

            <div className="flex items-center gap-6 mt-12 animate-slide-up stagger-3">
              <div className="flex -space-x-3">
                {["M", "J", "S", "A", "K"].map((initial, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center text-sm font-semibold ring-2 ring-white/50"
                  >
                    {initial}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  Join 1,200+ happy neighbors
                </p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="w-4 h-4 text-amber-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-sm text-white/60 ml-1">5.0</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block animate-fade-in stagger-2">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
              <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />

              <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-soft-xl border border-white/20 p-6 space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-border/40">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-accent"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Community Chat</p>
                    <p className="text-xs text-muted-foreground">
                      24 neighbors active now
                    </p>
                  </div>
                </div>

                {[
                  { name: "Sarah M.", msg: "Thanks for the block party heads up!", time: "2m ago", avatar: "S" },
                  { name: "Mike R.", msg: "Has anyone seen a gray tabby cat?", time: "5m ago", avatar: "M" },
                  { name: "Lisa K.", msg: "The farmer's market is back on Elm!", time: "12m ago", avatar: "L" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary flex-shrink-0">
                      {item.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="font-medium text-sm text-foreground">{item.name}</span>
                        <span className="text-xs text-muted-foreground">{item.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{item.msg}</p>
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t border-border/40">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex -space-x-1">
                      {["J", "A", "T", "P"].map((l, i) => (
                        <div
                          key={i}
                          className="w-5 h-5 rounded-full bg-secondary/20 text-secondary flex items-center justify-center text-[10px] font-medium ring-1 ring-background"
                        >
                          {l}
                        </div>
                      ))}
                    </div>
                    <span>+18 more in the conversation</span>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-white backdrop-blur-xl rounded-xl shadow-soft-md border border-white/20 p-4 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Alert Resolved</p>
                    <p className="text-xs text-muted-foreground">Lost dog found safe!</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-6 bg-white backdrop-blur-xl rounded-xl shadow-soft-md border border-white/20 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Next Event</p>
                    <p className="text-xs text-muted-foreground">BBQ, Sat 4pm @ Park</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};