import React from "react";
import { useNavigate } from "react-router-dom";
import { Code2, Database, Globe, Cpu, Brain, Rocket, BookOpen, Users, Award, Target, ArrowRight } from "lucide-react";

const EnhancedFeatureSection = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Code2, title: "Advanced Programming", description: "Master Python, Java, VB and JavaScript through hands-on exercises and real-world projects." },
    { icon: Database, title: "Database Management", description: "Understand database design, SQL queries, and data modeling techniques." },
    { icon: Globe, title: "Web Development", description: "Build modern, responsive web applications using cutting-edge technologies." },
    { icon: Cpu, title: "System Architecture", description: "Learn how computer systems work — from hardware to software integration." },
    { icon: Brain, title: "Algorithm Design", description: "Develop problem-solving skills through algorithmic thinking and optimization." },
    { icon: Rocket, title: "AI & Machine Learning", description: "Explore artificial intelligence and machine learning fundamentals." },
  ];

  const benefits = [
    { icon: BookOpen, title: "Comprehensive Resources", description: "Complete study materials, past papers and practice questions." },
    { icon: Users, title: "Expert Guidance", description: "Learn from experienced educators with proven track records." },
    { icon: Award, title: "Proven Results", description: "Consistent top grades and a 98.5% pass rate." },
    { icon: Target, title: "Focused Learning", description: "Curriculum aligned with A Level examination requirements." },
  ];

  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4 border border-primary/20">
            <Brain className="w-4 h-4" />
            What you will learn
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4 tracking-tight">
            A complete A Level CS curriculum
          </h2>
          <p className="text-lg text-muted-foreground">
            Every topic, structured and explained — from your first line of code to your final exam.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-elegant transition-all duration-300"
              >
                <div className="w-12 h-12 mb-5 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-lg text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="text-center group p-4">
                <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-base text-foreground mb-1">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-primary rounded-3xl p-8 md:p-12 text-center shadow-elegant">
          <h3 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
            Ready to start your journey?
          </h3>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Join Bluewave Academy and learn alongside Zimbabwe's brightest A Level Computer Science students.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/auth")}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary rounded-xl font-semibold hover:scale-[1.02] transition-transform shadow-lg"
            >
              Create your account
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/downloads")}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
            >
              Browse resources
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedFeatureSection;
