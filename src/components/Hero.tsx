import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
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
        <div className="space-x-4 animate-fadeIn" style={{ animationDelay: "0.4s" }}>
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-white"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="bg-white/10 hover:bg-white/20 text-white border-white"
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;