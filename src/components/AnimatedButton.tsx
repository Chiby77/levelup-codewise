
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  onClick?: () => void;
  icon?: boolean;
  className?: string;
  pulseEffect?: boolean;
}

const AnimatedButton = ({ 
  variant = "primary", 
  children, 
  onClick, 
  icon = false, 
  className,
  pulseEffect = false
}: AnimatedButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  
  // 10 different gradient colors for the primary button
  const primaryGradients = [
    "linear-gradient(135deg, #F97316 0%, #f97316dd 100%)",
    "linear-gradient(135deg, #3B82F6 0%, #3b82f6dd 100%)",
    "linear-gradient(135deg, #8B5CF6 0%, #8b5cf6dd 100%)",
    "linear-gradient(135deg, #10B981 0%, #10b981dd 100%)",
    "linear-gradient(135deg, #F43F5E 0%, #f43f5edd 100%)",
    "linear-gradient(135deg, #F59E0B 0%, #f59e0bdd 100%)",
    "linear-gradient(135deg, #6366F1 0%, #6366f1dd 100%)",
    "linear-gradient(135deg, #06B6D4 0%, #06b6d4dd 100%)",
    "linear-gradient(135deg, #EC4899 0%, #ec4899dd 100%)",
    "linear-gradient(135deg, #D946EF 0%, #d946efdd 100%)",
  ];

  // 10 different shimmer colors for the secondary button
  const secondaryShimmers = [
    "rgba(249, 115, 22, 0.2)", // orange
    "rgba(59, 130, 246, 0.2)",  // blue
    "rgba(139, 92, 246, 0.2)",  // purple
    "rgba(16, 185, 129, 0.2)",  // green
    "rgba(244, 63, 94, 0.2)",   // rose
    "rgba(245, 158, 11, 0.2)",  // amber
    "rgba(99, 102, 241, 0.2)",  // indigo
    "rgba(6, 182, 212, 0.2)",   // cyan
    "rgba(236, 72, 153, 0.2)",  // pink
    "rgba(217, 70, 239, 0.2)",  // fuchsia
  ];
  
  // Cycle through colors
  useEffect(() => {
    const colorInterval = setInterval(() => {
      setColorIndex(prev => (prev + 1) % 10);
    }, 5000);
    
    return () => clearInterval(colorInterval);
  }, []);

  const isPrimary = variant === "primary";
  
  const buttonStyles = isPrimary
    ? { background: primaryGradients[colorIndex], transition: "background 1.5s ease" }
    : {};
    
  const secondaryGlowStyle = isPrimary 
    ? {} 
    : { boxShadow: `0 0 10px ${secondaryShimmers[colorIndex]}`, transition: "box-shadow 1.5s ease" };

  const animationClass = pulseEffect ? "animated-button" : "";
  const hoverClass = isHovered ? isPrimary ? "scale-105" : "border-glow" : "";

  return (
    <>
      <Button
        size="lg"
        className={cn(
          isPrimary
            ? "text-white"
            : "bg-white/10 hover:bg-white/20 text-white border-white",
          animationClass,
          hoverClass,
          "transition-all duration-300",
          className
        )}
        style={{...buttonStyles, ...secondaryGlowStyle}}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children}
        {icon && <ArrowRight className={`ml-2 h-4 w-4 ${isHovered ? "animate-bounce-x" : ""}`} />}
      </Button>
      
      <style jsx>{`
        .animated-button {
          animation: pulse 2s infinite;
        }

        .border-glow {
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(249, 115, 22, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(249, 115, 22, 0);
          }
        }

        @keyframes bounce-x {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(4px);
          }
        }
      `}</style>
    </>
  );
};

export default AnimatedButton;
