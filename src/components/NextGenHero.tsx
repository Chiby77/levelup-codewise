import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Code2, Cpu, Database, Globe, Zap, ArrowRight, Sparkles, Waves, ShieldCheck } from "lucide-react";

const NextGenHero = () => {
  const navigate = useNavigate();
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    { icon: Code2, text: "Advanced Programming" },
    { icon: Database, text: "Database Systems" },
    { icon: Globe, text: "Web Development" },
    { icon: Cpu, text: "System Architecture" },
    { icon: Zap, text: "Algorithm Design" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-gradient-hero pt-24 pb-16">
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-[0.08]" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
        backgroundSize: "32px 32px",
      }} />

      {/* Floating soft orbs */}
      <div className="absolute top-1/4 -left-24 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-24 w-[28rem] h-[28rem] bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Brand chip */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-8 animate-fadeIn">
            <Waves className="h-4 w-4" />
            <span className="font-medium">Bluewave Academy</span>
            <span className="text-white/40">•</span>
            <span className="text-white/70">A Level Computer Science</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-[1.05] animate-slideUp">
            Master Computer Science.
            <span className="block mt-2 bg-gradient-to-r from-sky-200 via-white to-sky-100 bg-clip-text text-transparent">
              Build Your Future.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed animate-fadeIn" style={{ animationDelay: "0.2s" }}>
            Bluewave Academy is Zimbabwe's home for A Level Computer Science excellence — expert guidance, comprehensive resources, and a community built for results.
          </p>

          {/* Rotating feature */}
          <div className="mb-10 animate-fadeIn" style={{ animationDelay: "0.35s" }}>
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <span className="text-sm uppercase tracking-wider text-white/60 font-semibold">Now learning</span>
              <div className="flex items-center gap-2 text-white">
                {React.createElement(features[currentFeature].icon, { className: "w-5 h-5 text-sky-200" })}
                <span className="font-semibold transition-all duration-500">{features[currentFeature].text}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fadeIn" style={{ animationDelay: "0.5s" }}>
            <button
              onClick={() => navigate("/downloads")}
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-semibold rounded-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 min-w-[200px]"
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate("/exams")}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 min-w-[200px]"
            >
              <Sparkles className="w-4 h-4" />
              Digital Exams
            </button>
            <button
              onClick={() => navigate("/about")}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white/80 font-medium hover:text-white transition-colors min-w-[160px]"
            >
              Learn More
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Trust strip */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-white/60 text-sm animate-fadeIn" style={{ animationDelay: "0.7s" }}>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-200" />
              <span>Trusted by 2,000+ students</span>
            </div>
            <span className="hidden sm:inline text-white/20">•</span>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-200" />
              <span>98.5% pass rate</span>
            </div>
            <span className="hidden sm:inline text-white/20">•</span>
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-sky-200" />
              <span>350+ resources</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NextGenHero;
