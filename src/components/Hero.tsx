
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AnimatedHeroBackground from "./AnimatedHeroBackground";
import EnhancedQuoteRotator from "./EnhancedQuoteRotator";
import AnimatedButton from "./AnimatedButton";
import AnimatedHeading from "./AnimatedHeading";
import AnimatedLogo from "./AnimatedLogo";

const Hero = () => {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <AnimatedHeroBackground />
        
        {/* Hero Content */}
        <div className="container mx-auto px-4 text-center relative z-10 py-16">
          {/* Animated Logo */}
          <div className="absolute top-0 left-4 md:left-8">
            <AnimatedLogo />
          </div>
          
          {/* Main Heading */}
          <AnimatedHeading 
            text="Master A Level Computer Science" 
            className="mb-6"
            delay={800}
          />
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto animate-fadeIn" style={{ animationDelay: "1s" }}>
            Expert guidance, comprehensive resources, and a supportive community to help you excel in your studies.
          </p>
          
          {/* Quote Rotator */}
          <EnhancedQuoteRotator />
          
          {/* Action Buttons */}
          <div className="space-x-4 mt-8 animate-fadeIn" style={{ animationDelay: "1.2s" }}>
            <AnimatedButton 
              variant="primary" 
              icon 
              pulseEffect
              onClick={() => navigate("/about")}
            >
              Get Started
            </AnimatedButton>
            
            <AnimatedButton 
              variant="secondary"
              onClick={() => setShowDialog(true)}
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
