import React, { useEffect, useState } from "react";
import { Users, BookOpen, Target, GraduationCap, Trophy } from "lucide-react";

const ModernStatsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({ students: 0, aGrades: 0, passRate: 0, resources: 0 });

  const finalStats = { students: 2000, aGrades: 300, passRate: 98.5, resources: 350 };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.1 }
    );
    const section = document.getElementById("stats-section");
    if (section) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const animateCount = (key: keyof typeof finalStats, duration = 2200) => {
      const end = finalStats[key];
      const startTime = Date.now();
      const update = () => {
        const progress = Math.min((Date.now() - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = key === "passRate" ? parseFloat((end * eased).toFixed(1)) : Math.floor(end * eased);
        setCounts((prev) => ({ ...prev, [key]: current }));
        if (progress < 1) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
    };
    animateCount("students");
    setTimeout(() => animateCount("aGrades"), 150);
    setTimeout(() => animateCount("passRate"), 300);
    setTimeout(() => animateCount("resources"), 450);
  }, [isVisible]);

  const stats = [
    { icon: Users, label: "Students Trained", value: counts.students, suffix: "+", description: "Across Zimbabwe" },
    { icon: Trophy, label: "A Grades Achieved", value: counts.aGrades, suffix: "+", description: "ZIMSEC results" },
    { icon: Target, label: "Pass Rate", value: counts.passRate, suffix: "%", description: "Consistent performance" },
    { icon: BookOpen, label: "Study Resources", value: counts.resources, suffix: "+", description: "Notes & past papers" },
  ];

  return (
    <section id="stats-section" className="py-24 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4 border border-primary/20">
            <GraduationCap className="w-4 h-4" />
            Our Achievements
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4 tracking-tight">
            Proven results, year after year
          </h2>
          <p className="text-lg text-muted-foreground">
            Numbers that reflect the dedication of our students and teachers across Zimbabwe.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="group relative bg-card border border-border rounded-2xl p-6 md:p-8 hover:border-primary/40 hover:shadow-elegant transition-all duration-300"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className="w-12 h-12 mb-5 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl md:text-5xl font-black text-foreground tabular-nums">
                    {stat.value}
                  </span>
                  <span className="text-2xl font-bold text-primary">{stat.suffix}</span>
                </div>
                <p className="text-sm md:text-base font-semibold text-foreground mb-1">{stat.label}</p>
                <p className="text-xs md:text-sm text-muted-foreground">{stat.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ModernStatsSection;
