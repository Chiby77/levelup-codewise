import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Code, Cpu, Database, Globe, Zap, Star, Trophy, Award, Sparkles } from "lucide-react";
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
        
        {/* Celebration gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-emerald-600/30 to-blue-600/20 animate-gradientShift opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.2),transparent_50%)] animate-pulse" />
        
        {/* Celebration floating shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-30 animate-floatLarge blur-xl" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full opacity-25 animate-float blur-2xl" />
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-25 animate-floatLarge blur-xl" />
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full opacity-20 animate-float blur-lg" />

        {/* Confetti effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-5%`,
                backgroundColor: ['#FFD700', '#00FF00', '#FF6B6B', '#4ECDC4', '#45B7D1'][i % 5],
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-8 sm:py-16 pt-20">
          
          {/* Modern Logo with morphing effect */}
          <div className="mb-6 animate-scaleIn">
            <div className="relative inline-block">
              <div className="bg-gradient-to-r from-yellow-400 via-emerald-500 to-blue-500 bg-clip-text text-transparent font-bold text-3xl md:text-4xl animate-gradientShift bg-[length:200%_200%]">
                CS Experts Zimbabwe
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-yellow-500/20 via-emerald-500/20 to-blue-500/20 rounded-lg blur-lg animate-morphing" />
            </div>
          </div>
          
          {/* ZIMSEC 2025 Results Celebration Banner */}
          <div className="mb-8 animate-slideDown">
            <div className="relative max-w-5xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/40 via-emerald-500/40 to-yellow-500/40 rounded-3xl blur-2xl animate-neonPulse" />
              <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 rounded-3xl p-8 border-4 border-yellow-400/50 shadow-2xl">
                {/* Trophy icons */}
                <div className="flex justify-center gap-4 mb-4">
                  <Trophy className="w-12 h-12 text-yellow-400 animate-bounce" />
                  <Award className="w-12 h-12 text-yellow-300 animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <Trophy className="w-12 h-12 text-yellow-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4">
                  <span className="text-white drop-shadow-lg">🎉 ZIMSEC 2025 </span>
                  <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    RESULTS ARE OUT!
                  </span>
                  <span className="text-white drop-shadow-lg"> 🎉</span>
                </h1>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-yellow-400/30">
                    <p className="text-5xl md:text-6xl font-black text-yellow-400 animate-pulse">300+</p>
                    <p className="text-white font-semibold">A Grades Achieved</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-yellow-400/30">
                    <p className="text-5xl md:text-6xl font-black text-yellow-300 animate-pulse">98.5%</p>
                    <p className="text-white font-semibold">Pass Rate Record</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-yellow-400/30">
                    <p className="text-5xl md:text-6xl font-black text-yellow-400 animate-pulse">#1</p>
                    <p className="text-white font-semibold">In Computer Science</p>
                  </div>
                </div>
                
                <p className="text-xl md:text-2xl text-white font-bold flex items-center justify-center gap-2">
                  <Sparkles className="w-6 h-6 text-yellow-400 animate-spin" />
                  Congratulations to ALL our A Level Students!
                  <Sparkles className="w-6 h-6 text-yellow-400 animate-spin" />
                </p>
              </div>
            </div>
          </div>

          {/* Join CompSci Group CTA */}
          <div className="mb-8 animate-slideUp" style={{ animationDelay: '0.3s' }}>
            <div className="relative max-w-3xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-2xl blur-xl animate-pulse" />
              <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 border border-green-400/50">
                <p className="text-lg md:text-xl text-white font-semibold mb-3">
                  🚀 Form 5 & Form 6 Students - Your Journey Starts Here!
                </p>
                <button
                  onClick={() => window.open('https://chat.whatsapp.com/Jqi8HmLBRbF3g5GAMXbClh?mode=hqrt2', '_blank')}
                  className="bg-white text-green-700 font-bold px-8 py-4 rounded-full text-lg hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-green-500/50 flex items-center gap-3 mx-auto"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Join CompSci Group Now
                  <Star className="w-5 h-5 text-yellow-500 animate-spin" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Enhanced description */}
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 max-w-4xl mx-auto animate-slideUp leading-relaxed" style={{ animationDelay: "0.5s" }}>
            Join Zimbabwe's #1 A Level Computer Science community. Expert guidance, proven results, and a supportive network to help you achieve excellence.
          </p>

          {/* Feature showcase */}
          <div className="mb-6 animate-slideLeft" style={{ animationDelay: "0.7s" }}>
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
          <div className="mb-8 animate-slideRight" style={{ animationDelay: "0.9s" }}>
            <EnhancedQuoteRotator />
          </div>
          
          {/* Enhanced Action Buttons */}
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center animate-slideUp" style={{ animationDelay: "1.1s" }}>
            <button
              onClick={() => handleNavigation("/downloads", "/downloads")}
              className="group relative px-8 py-4 min-w-[200px] bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/40"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 animate-gradientShift bg-[length:200%_200%] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                Get Started
                <Zap className="w-5 h-5 group-hover:animate-bounce" />
              </span>
            </button>
            
            <button
              onClick={() => handleNavigation("/exams", "/exams")}
              className="group relative px-8 py-4 min-w-[200px] bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/40"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                Digital Exams
                <Cpu className="w-5 h-5 group-hover:animate-spin" />
              </span>
            </button>
            
            <button
              onClick={() => handleNavigation("/about", "/about")}
              className="group relative px-8 py-4 min-w-[200px] border-2 border-white/30 text-white font-bold rounded-2xl backdrop-blur-sm hover:border-yellow-400 hover:bg-yellow-400/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/30"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                Learn More
                <Globe className="w-5 h-5 group-hover:animate-wiggle" />
              </span>
            </button>
          </div>

          {/* Additional interactive elements */}
          <div className="mt-12 animate-fadeIn" style={{ animationDelay: "1.3s" }}>
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
              <DialogTitle className="text-2xl font-bold mb-4 text-foreground">Why Choose Computer Science?</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-foreground">
              <p className="text-muted-foreground">
                Computer Science is more than just programming – it's about solving real-world problems 
                through computational thinking and innovative solutions. In today's digital age, 
                understanding computer science is becoming increasingly crucial for success in almost 
                any field.
              </p>
              <h3 className="font-semibold text-lg text-foreground">Why Join Us?</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Expert guidance from experienced educators</li>
                <li>Comprehensive study materials and resources</li>
                <li>Hands-on programming practice</li>
                <li>Career guidance and industry insights</li>
                <li>Supportive community of learners</li>
                <li>Access to past papers and detailed solutions</li>
              </ul>
              <p className="text-muted-foreground">
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

        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        .animate-confetti {
          animation: confetti linear infinite;
        }
      `}</style>
    </>
  );
};

export default NextGenHero;
