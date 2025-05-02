
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
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const isPrimary = variant === "primary";
  
  const baseClasses = isPrimary
    ? "bg-accent hover:bg-accent/90 text-white"
    : "bg-white/10 hover:bg-white/20 text-white border-white";

  const animationClass = prefersReducedMotion || !pulseEffect
    ? ""
    : "animated-button";

  const hoverClass = isHovered && !prefersReducedMotion
    ? isPrimary ? "scale-105" : "border-glow"
    : "";

  return (
    <Button
      size="lg"
      className={cn(
        baseClasses,
        animationClass,
        hoverClass,
        "transition-all duration-300",
        className
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      {icon && <ArrowRight className={`ml-2 h-4 w-4 ${isHovered && !prefersReducedMotion ? "animate-bounce-x" : ""}`} />}

      <style jsx global>{`
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
    </Button>
  );
};

export default AnimatedButton;
