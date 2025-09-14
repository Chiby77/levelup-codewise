import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AnimatedHeroBackground from "./AnimatedHeroBackground";
import EnhancedQuoteRotator from "./EnhancedQuoteRotator";
import AnimatedButton from "./AnimatedButton";
import AnimatedHeading from "./AnimatedHeading";
import AnimatedLogo from "./AnimatedLogo";
import MotivationalQuotes from "./MotivationalQuotes";

const Hero = () => {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <AnimatedHeroBackground />
        
        {/* Hero Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-8 sm:py-16">
          {/* Animated Logo - Responsive positioning */}
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 md:left-8 scale-75 sm:scale-100">
            <AnimatedLogo />
          </div>
          
          {/* Main Heading - Responsive text */}
          <div className="mt-16 sm:mt-8 mb-4 sm:mb-6">
            <AnimatedHeading 
              text="Master A Level Computer Science" 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight"
              delay={800}
            />
          </div>
          
          {/* Motivational Message */}
          <div className="mb-6 text-center space-y-2 animate-fadeIn px-4" style={{ animationDelay: '1000ms' }}>
            <div className="bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <p className="text-lg sm:text-xl font-bold text-primary mb-2 animate-pulse">
                ✨ WISHING YOU ALL THE BEST IN YOUR FINAL EXAMS ✨
              </p>
              <p className="text-base sm:text-lg font-semibold text-secondary">
                🙏 USAKANGANWE PRAYER 🙏
              </p>
              <p className="text-sm sm:text-base font-medium text-white/90 mt-2">
                💝 LET'S MAKE OUR PARENTS HAPPY 💝
              </p>
            </div>
          </div>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 max-w-xs sm:max-w-lg md:max-w-2xl mx-auto animate-fadeIn px-4" style={{ animationDelay: "1.2s" }}>
            Expert guidance, comprehensive resources, and a supportive community to help you excel in your studies.
          </p>
          
          {/* Quote Rotator - Responsive */}
          <div className="mb-6 sm:mb-8 px-4">
            <EnhancedQuoteRotator />
          </div>
          
          {/* Action Buttons - Fully responsive stacking */}
          <div className="flex flex-col gap-3 sm:gap-4 mt-6 sm:mt-8 justify-center items-center animate-fadeIn px-4 sm:px-0 md:flex-row" style={{ animationDelay: "1.4s" }}>
            <AnimatedButton 
              variant="primary" 
              icon 
              pulseEffect
              onClick={() => navigate("/downloads")}
              className="w-full sm:w-auto min-w-[200px] text-sm sm:text-base"
            >
              Get Started
            </AnimatedButton>
            
            <AnimatedButton 
              variant="secondary"
              onClick={() => navigate("/exams")}
              className="w-full sm:w-auto min-w-[200px] text-sm sm:text-base"
            >
              Digital Exams
            </AnimatedButton>
            
            <AnimatedButton 
              variant="outline"
              onClick={() => navigate("/about")}
              className="w-full sm:w-auto min-w-[200px] text-sm sm:text-base"
            >
              Learn More
            </AnimatedButton>
          </div>
        </div>

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

export default Hero;