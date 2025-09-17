import React, { useState } from "react";
import { Code2, Database, Globe, Cpu, Zap, BookOpen, Users, Award, Target, Lightbulb, Brain, Rocket } from "lucide-react";

const EnhancedFeatureSection = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Code2,
      title: "Advanced Programming",
      description: "Master programming concepts with hands-on coding exercises and real-world projects.",
      details: "Learn Python, Java, and JavaScript through interactive tutorials and challenging assignments.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      icon: Database,
      title: "Database Management",
      description: "Understand database design, SQL queries, and data modeling techniques.",
      details: "Work with MySQL, PostgreSQL, and NoSQL databases in practical scenarios.",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-950/20",
    },
    {
      icon: Globe,
      title: "Web Development",
      description: "Build modern web applications using cutting-edge technologies and frameworks.",
      details: "Create responsive websites with HTML5, CSS3, React, and modern deployment strategies.",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
    },
    {
      icon: Cpu,
      title: "System Architecture",
      description: "Learn how computer systems work from hardware to software integration.",
      details: "Explore CPU architecture, memory management, and operating system principles.",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
    },
    {
      icon: Brain,
      title: "Algorithm Design",
      description: "Develop problem-solving skills through algorithmic thinking and optimization.",
      details: "Master sorting, searching, and graph algorithms with time complexity analysis.",
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    },
    {
      icon: Rocket,
      title: "AI & Machine Learning",
      description: "Explore artificial intelligence and machine learning fundamentals.",
      details: "Build AI models, understand neural networks, and implement ML algorithms.",
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
    },
  ];

  const benefits = [
    {
      icon: BookOpen,
      title: "Comprehensive Resources",
      description: "Access to complete study materials, past papers, and practice questions.",
    },
    {
      icon: Users,
      title: "Expert Guidance",
      description: "Learn from experienced educators with proven track records.",
    },
    {
      icon: Award,
      title: "Proven Results",
      description: "95% success rate with students achieving top grades.",
    },
    {
      icon: Target,
      title: "Focused Learning",
      description: "Targeted curriculum aligned with A Level examination requirements.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full px-6 py-2 mb-6 animate-slideDown">
            <Lightbulb className="w-5 h-5 text-accent animate-pulse" />
            <span className="text-sm font-semibold text-accent">What You'll Learn</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-slideUp">
            Master Every Aspect of Computer Science
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fadeIn">
            Our comprehensive curriculum covers all essential topics to ensure your success in A Level Computer Science
          </p>
        </div>

        {/* Interactive Features Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Feature List */}
          <div className="space-y-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = activeFeature === index;
              
              return (
                <div
                  key={index}
                  className={`p-6 rounded-xl cursor-pointer transition-all duration-500 ${
                    isActive 
                      ? `${feature.bgColor} border-2 border-accent/50 scale-105 shadow-xl` 
                      : 'bg-card hover:bg-muted/50 border border-border hover:border-accent/30'
                  }`}
                  onClick={() => setActiveFeature(index)}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.color} shadow-lg ${isActive ? 'animate-bounce' : ''}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Feature Details */}
          <div className="lg:sticky lg:top-20">
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-2xl">
              <div className="mb-6">
                {React.createElement(features[activeFeature].icon, {
                  className: `w-16 h-16 p-4 rounded-xl bg-gradient-to-r ${features[activeFeature].color} text-white shadow-lg animate-pulse`
                })}
              </div>
              
              <h3 className="text-2xl font-bold mb-4">{features[activeFeature].title}</h3>
              <p className="text-lg text-muted-foreground mb-6">{features[activeFeature].description}</p>
              <p className="text-foreground leading-relaxed">{features[activeFeature].details}</p>
              
              {/* Progress indicator */}
              <div className="mt-8">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Module Progress</span>
                  <span>{Math.round(((activeFeature + 1) / features.length) * 100)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r ${features[activeFeature].color} transition-all duration-500`}
                    style={{ width: `${((activeFeature + 1) / features.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="text-center group animate-slideUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-accent/20 to-secondary/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-10 h-10 text-accent group-hover:animate-bounce" />
                </div>
                <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 backdrop-blur-sm border border-accent/20">
          <h3 className="text-2xl font-bold mb-4">Ready to Excel in Computer Science?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of successful students who have achieved top grades with our comprehensive program.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 animate-neonPulse">
              Start Your Journey
            </button>
            <button className="px-8 py-4 border-2 border-accent text-accent rounded-xl font-semibold hover:bg-accent hover:text-white transition-all duration-300 hover:scale-105">
              View Sample Lessons
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedFeatureSection;