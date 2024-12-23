import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import QuoteRotator from "./QuoteRotator";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Hero = () => {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary pt-16">
      <div className="absolute inset-0 bg-black/50" />
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fadeIn">
          Master A Level Computer Science
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto animate-fadeIn" style={{ animationDelay: "0.2s" }}>
          Expert guidance, comprehensive resources, and a supportive community to help you excel in your studies.
        </p>
        
        <QuoteRotator />
        
        <div className="space-x-4 animate-fadeIn mt-8" style={{ animationDelay: "0.4s" }}>
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-white"
            onClick={() => navigate("/about")}
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="bg-white/10 hover:bg-white/20 text-white border-white"
            onClick={() => setShowDialog(true)}
          >
            Learn More
          </Button>
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
  );
};

export default Hero;