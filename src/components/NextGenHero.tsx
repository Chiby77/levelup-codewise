import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Code, Cpu, Database, Globe, Zap, Star } from "lucide-react";
import ParticleBackground from "./ParticleBackground";
import EnhancedQuoteRotator from "./EnhancedQuoteRotator";
import MotivationalQuotes from "./MotivationalQuotes";

const NextGenHero = () => {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    { icon: Code, text: "Advanced Programming", color: "text-blue-400" },
    { icon: Database, text: "Database Systems", color: "text-green-400" },
    { icon: Globe, text: "Web Development", color: "text-purple-400" },
    { icon: Cpu, text: "System Architecture", color: "text-orange-400" },
    { icon: Zap, text: "Algorithm Design", color: "text-yellow-400" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleNavigation = (path: string, fallback: string) => {
    try {
      navigate(path);
    } catch (error) {
      console.error("Navigation error:", error);
      window.location.href = fallback;
    }
  };

  return (
    <>
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Enhanced Background */}
        <ParticleBackground />
        
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary/20 to-accent/30 animate-gradientShift opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(138,43,226,0.1),transparent_50%)] animate-pulse" />
        
        {/* Floating shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-20 animate-floatLarge blur-xl" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-15 animate-float blur-2xl" />
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full opacity-25 animate-floatLarge blur-xl" />

        {/* Hero Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-8 sm:py-16 pt-20">
          
          {/* Modern Logo with morphing effect */}
          <div className="mb-8 animate-scaleIn">
            <div className="relative inline-block">
              <div className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-bold text-3xl md:text-4xl animate-gradientShift bg-[length:200%_200%]">
                CS Experts Zimbabwe
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 rounded-lg blur-lg animate-morphing" />
            </div>
          </div>
          
          {/* Main Heading with enhanced effects */}
          <div className="mb-6 animate-slideDown">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight mb-4">
              <span className="bg-gradient-to-r from-white via-orange-300 to-white bg-clip-text text-transparent animate-gradientShift bg-[length:200%_200%]">
                A Level Students
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradientShift bg-[length:200%_200%]">
                Results Pending
              </span>
            </h1>
          </div>
          
          {/* Enhanced motivational message with glowing border */}
          <div className="mb-8 animate-slideUp" style={{ animationDelay: '0.5s' }}>
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-pink-500/30 rounded-2xl blur-xl animate-neonPulse" />
              <div className="relative bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="space-y-3">
                  <p className="text-xl sm:text-2xl font-bold text-orange-300 animate-pulse flex items-center justify-center gap-2">
                    <Star className="w-6 h-6 animate-spin" />
                    📚 EXAMS COMPLETE - AWAITING RESULTS 📚
                    <Star className="w-6 h-6 animate-spin" />
                  </p>
                  <p className="text-lg sm:text-xl font-semibold text-purple-300 animate-bounce">
                    🎓 YOU'VE WORKED HARD - NOW REST & PRAY 🙏
                  </p>
                  <p className="text-base sm:text-lg font-medium text-pink-300 animate-pulse">
                    💝 BEST OF LUCK TO ALL A LEVEL STUDENTS 💝
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced description */}
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto animate-slideUp leading-relaxed" style={{ animationDelay: "0.7s" }}>
            Expert guidance, comprehensive resources, and a supportive community to help you excel in your studies.
          </p>

          {/* Feature showcase */}
          <div className="mb-8 animate-slideLeft" style={{ animationDelay: "0.9s" }}>
            <div className="flex items-center justify-center space-x-4 text-lg font-semibold">
              <span className="text-white/70">Featuring:</span>
              <div className="flex items-center space-x-2">
                {React.createElement(features[currentFeature].icon, {
                  className: `w-6 h-6 ${features[currentFeature].color} animate-bounce`
                })}
                <span className={`${features[currentFeature].color} transition-all duration-500`}>
                  {features[currentFeature].text}
                </span>
              </div>
            </div>
          </div>
          
          {/* Quote Rotator with enhanced styling */}
          <div className="mb-8 animate-slideRight" style={{ animationDelay: "1.1s" }}>
            <EnhancedQuoteRotator />
          </div>
          
          {/* Enhanced Action Buttons */}
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center animate-slideUp" style={{ animationDelay: "1.3s" }}>
            <button
              onClick={() => handleNavigation("/downloads", "/downloads")}
              className="group relative px-8 py-4 min-w-[200px] bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/40"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 animate-gradientShift bg-[length:200%_200%] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                Get Started
                <Zap className="w-5 h-5 group-hover:animate-bounce" />
              </span>
            </button>
            
            <button
              onClick={() => handleNavigation("/exams", "/exams")}
              className="group relative px-8 py-4 min-w-[200px] bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/40"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                Digital Exams
                <Cpu className="w-5 h-5 group-hover:animate-spin" />
              </span>
            </button>
            
            <button
              onClick={() => handleNavigation("/about", "/about")}
              className="group relative px-8 py-4 min-w-[200px] border-2 border-white/30 text-white font-bold rounded-2xl backdrop-blur-sm hover:border-accent hover:bg-accent/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-accent/30"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                Learn More
                <Globe className="w-5 h-5 group-hover:animate-wiggle" />
              </span>
            </button>
          </div>

          {/* Additional interactive elements */}
          <div className="mt-12 animate-fadeIn" style={{ animationDelay: "1.5s" }}>
            <p className="text-white/60 text-sm mb-4">Scroll down for more amazing features</p>
            <div className="w-6 h-10 mx-auto border-2 border-white/30 rounded-full relative">
              <div className="w-1 h-3 bg-white/60 rounded-full absolute top-2 left-1/2 transform -translate-x-1/2 animate-bounce" />
            </div>
          </div>
        </div>

        {/* Dialog remains the same */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold mb-4">Why Choose Computer Science?</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-gray-700">
              <p>
                Computer Science is more than just programming – it's about solving real-world problems 
                through computational thinking and innovative solutions. In today's digital age, 
                understanding computer science is becoming increasingly crucial for success in almost 
                any field.
              </p>
              <h3 className="font-semibold text-lg">Why Join Us?</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Expert guidance from experienced educators</li>
                <li>Comprehensive study materials and resources</li>
                <li>Hands-on programming practice</li>
                <li>Career guidance and industry insights</li>
                <li>Supportive community of learners</li>
                <li>Access to past papers and detailed solutions</li>
              </ul>
              <p>
                By joining A Level Computer Science Experts, you're not just preparing for an exam – 
                you're investing in your future in the ever-growing tech industry. Our proven track 
                record of success and comprehensive approach to teaching ensures you'll have the best 
                possible foundation for your computer science journey.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Motivational Quotes Component */}
      <MotivationalQuotes />

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </>
  );
};

export default NextGenHero;
