import React, { useEffect, useState } from "react";
import { Users, BookOpen, Award, Trophy, TrendingUp, Star, Target, GraduationCap } from "lucide-react";

const ModernStatsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({
    students: 0,
    aGrades: 0,
    passRate: 0,
    resources: 0,
  });

  const finalStats = {
    students: 2000,
    aGrades: 300,
    passRate: 98.5,
    resources: 350,
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

    const animateCount = (key: keyof typeof finalStats, duration = 2500) => {
      const start = 0;
      const end = finalStats[key];
      const startTime = Date.now();

      const update = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = key === 'passRate' 
          ? parseFloat((start + (end - start) * easeOut).toFixed(1))
          : Math.floor(start + (end - start) * easeOut);

        setCounts(prev => ({ ...prev, [key]: current }));

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };

      requestAnimationFrame(update);
    };

    // Stagger animations
    animateCount("students", 2500);
    setTimeout(() => animateCount("aGrades", 2500), 200);
    setTimeout(() => animateCount("passRate", 2500), 400);
    setTimeout(() => animateCount("resources", 2500), 600);
  }, [isVisible]);

  const stats = [
    {
      icon: Users,
      label: "Students Trained",
      value: counts.students,
      suffix: "+",
      color: "from-blue-500 to-indigo-600",
      glowColor: "shadow-blue-500/50",
      description: "And counting!",
    },
    {
      icon: Trophy,
      label: "A Grades in 2025",
      value: counts.aGrades,
      suffix: "+",
      color: "from-yellow-500 to-orange-500",
      glowColor: "shadow-yellow-500/50",
      description: "ZIMSEC Results",
      highlight: true,
    },
    {
      icon: Target,
      label: "Pass Rate",
      value: counts.passRate,
      suffix: "%",
      color: "from-emerald-500 to-teal-600",
      glowColor: "shadow-emerald-500/50",
      description: "Record Breaking!",
      highlight: true,
    },
    {
      icon: BookOpen,
      label: "Study Resources",
      value: counts.resources,
      suffix: "+",
      color: "from-purple-500 to-pink-600",
      glowColor: "shadow-purple-500/50",
      description: "Notes & Papers",
    },
  ];

  return (
    <section
      id="stats-section"
      className="py-24 relative overflow-hidden"
    >
      {/* Celebration Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-background to-yellow-900/20" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />

      {/* Floating celebration elements */}
      <div className="absolute top-10 left-10 text-4xl animate-float opacity-30">🏆</div>
      <div className="absolute top-20 right-20 text-3xl animate-floatLarge opacity-30">⭐</div>
      <div className="absolute bottom-20 left-20 text-4xl animate-float opacity-30">🎓</div>
      <div className="absolute bottom-10 right-10 text-3xl animate-floatLarge opacity-30">🌟</div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/20 text-yellow-400 text-sm font-semibold mb-4 border border-yellow-500/30">
            <Trophy className="w-4 h-4" />
            2025 ZIMSEC Results Celebration
            <Trophy className="w-4 h-4" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-yellow-400 via-emerald-500 to-blue-500 bg-clip-text text-transparent animate-gradientShift bg-[length:200%_200%]">
              Our 2025 Impact
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slideUp" style={{ animationDelay: "0.2s" }}>
            Setting new records in A Level Computer Science excellence across Zimbabwe
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
                <div className={`bg-card/80 backdrop-blur-sm rounded-3xl p-8 border ${stat.highlight ? 'border-yellow-500/50' : 'border-border/50'} hover:border-accent/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl group-hover:shadow-accent/20 relative overflow-hidden`}>
                  {/* Highlight glow for special stats */}
                  {stat.highlight && (
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-emerald-500/10 animate-pulse" />
                  )}
                  
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`} />
                  
                  {/* Content */}
                  <div className="relative z-10 text-center">
                    {/* Icon */}
                    <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${stat.color} p-5 shadow-lg ${stat.glowColor} group-hover:animate-bounce transform rotate-3 group-hover:rotate-0 transition-transform duration-300`}>
                      <Icon className="w-full h-full text-white" />
                    </div>

                    {/* Number */}
                    <div className="mb-2">
                      <span className={`text-5xl md:text-6xl font-black ${stat.highlight ? 'bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent' : 'text-foreground'}`}>
                        {stat.value}
                      </span>
                      <span className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent ml-1`}>
                        {stat.suffix}
                      </span>
                    </div>

                    {/* Label */}
                    <p className="text-lg font-semibold text-foreground mb-1">
                      {stat.label}
                    </p>
                    
                    {/* Description */}
                    <p className="text-sm text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>

                  {/* Floating particles */}
                  <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`absolute w-1.5 h-1.5 bg-gradient-to-r ${stat.color} rounded-full opacity-0 group-hover:opacity-60 animate-float`}
                        style={{
                          left: `${15 + i * 25}%`,
                          top: `${5 + i * 15}%`,
                          animationDelay: `${i * 0.4}s`,
                          animationDuration: `${2.5 + i}s`,
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
        <div className="text-center mt-20 animate-slideUp" style={{ animationDelay: "0.8s" }}>
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/30 to-emerald-500/30 rounded-2xl blur-xl animate-pulse" />
            <div className="relative bg-gradient-to-r from-emerald-600/90 to-teal-600/90 backdrop-blur-sm rounded-2xl p-8 border border-emerald-400/50">
              <div className="flex items-center justify-center gap-2 mb-4">
                <GraduationCap className="w-8 h-8 text-yellow-400" />
                <h3 className="text-2xl md:text-3xl font-bold text-white">
                  Be Part of Our 2026 Success Story!
                </h3>
                <Star className="w-8 h-8 text-yellow-400 animate-spin" />
              </div>
              <p className="text-white/90 mb-6 max-w-xl mx-auto">
                Join thousands of successful students and achieve your A Level Computer Science goals
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => window.open('https://chat.whatsapp.com/Jqi8HmLBRbF3g5GAMXbClh?mode=hqrt2', '_blank')}
                  className="px-8 py-4 bg-white text-emerald-700 rounded-xl font-bold hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-white/30 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Join CompSci Group
                </button>
                <button className="px-8 py-4 border-2 border-white text-white rounded-xl font-bold hover:bg-white hover:text-emerald-700 transition-all duration-300 hover:scale-105">
                  View Success Stories
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernStatsSection;