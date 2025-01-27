import { useEffect, useRef, useState } from 'react';

export const Stats = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className="bg-gradient-to-r from-primary to-primary-dark py-24">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-12 text-center">
        {[
          { value: "99%", label: "Community Satisfaction" },
          { value: "1.2k", label: "Active Members" },
          { value: "125+", label: "Monthly Events" },
          { value: "10%", label: "Growth Rate" }
        ].map((stat, index) => (
          <div 
            key={index}
            className={`text-white transform transition-all duration-700 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className="text-5xl font-bold mb-3">{stat.value}</div>
            <div className="text-lg opacity-90">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};