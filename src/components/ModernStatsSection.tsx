import React, { useEffect, useState } from "react";
import { Users, BookOpen, Award, Clock } from "lucide-react";

const ModernStatsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({
    students: 0,
    resources: 0,
    success: 0,
    experience: 0,
  });

  const finalStats = {
    students: 1500,
    resources: 250,
    success: 95,
    experience: 8,
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById("stats-section");
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const animateCount = (key: keyof typeof finalStats, duration = 2000) => {
      const start = 0;
      const end = finalStats[key];
      const startTime = Date.now();

      const update = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (end - start) * easeOut);

        setCounts(prev => ({ ...prev, [key]: current }));

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };

      requestAnimationFrame(update);
    };

    // Stagger animations
    animateCount("students", 2000);
    setTimeout(() => animateCount("resources", 2000), 200);
    setTimeout(() => animateCount("success", 2000), 400);
    setTimeout(() => animateCount("experience", 2000), 600);
  }, [isVisible]);

  const stats = [
    {
      icon: Users,
      label: "Students Helped",
      value: counts.students,
      suffix: "+",
      color: "from-blue-500 to-purple-600",
      glowColor: "shadow-blue-500/50",
    },
    {
      icon: BookOpen,
      label: "Study Resources",
      value: counts.resources,
      suffix: "+",
      color: "from-green-500 to-emerald-600",
      glowColor: "shadow-green-500/50",
    },
    {
      icon: Award,
      label: "Success Rate",
      value: counts.success,
      suffix: "%",
      color: "from-orange-500 to-red-600",
      glowColor: "shadow-orange-500/50",
    },
    {
      icon: Clock,
      label: "Years Experience",
      value: counts.experience,
      suffix: "+",
      color: "from-purple-500 to-pink-600",
      glowColor: "shadow-purple-500/50",
    },
  ];

  return (
    <section
      id="stats-section"
      className="py-20 relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-slideDown">
            Our Impact
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slideUp" style={{ animationDelay: "0.2s" }}>
            Transforming A Level Computer Science education across Zimbabwe
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`relative group animate-scaleIn`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Card */}
                <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border/50 hover:border-accent/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl group-hover:shadow-accent/20">
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`} />
                  
                  {/* Content */}
                  <div className="relative z-10 text-center">
                    {/* Icon */}
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${stat.color} p-4 shadow-lg ${stat.glowColor} group-hover:animate-bounce`}>
                      <Icon className="w-full h-full text-white" />
                    </div>

                    {/* Number */}
                    <div className="mb-2">
                      <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                        {stat.value}
                      </span>
                      <span className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent ml-1`}>
                        {stat.suffix}
                      </span>
                    </div>

                    {/* Label */}
                    <p className="text-muted-foreground font-medium">
                      {stat.label}
                    </p>
                  </div>

                  {/* Floating particles */}
                  <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className={`absolute w-1 h-1 bg-gradient-to-r ${stat.color} rounded-full opacity-0 group-hover:opacity-60 animate-float`}
                        style={{
                          left: `${20 + i * 30}%`,
                          top: `${10 + i * 20}%`,
                          animationDelay: `${i * 0.5}s`,
                          animationDuration: `${3 + i}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 animate-slideUp" style={{ animationDelay: "0.8s" }}>
          <p className="text-xl text-muted-foreground mb-4">
            Join thousands of successful students today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 animate-neonPulse">
              Start Learning Now
            </button>
            <button className="px-8 py-4 border-2 border-accent text-accent rounded-xl font-semibold hover:bg-accent hover:text-white transition-all duration-300 hover:scale-105">
              View Success Stories
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernStatsSection;