
import { useEffect, useState } from "react";

interface AnimatedHeadingProps {
  text: string;
  className?: string;
  delay?: number;
}

const AnimatedHeading = ({ text, className = "", delay = 0 }: AnimatedHeadingProps) => {
  const [animate, setAnimate] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    
    // Start animation after specified delay
    const timer = setTimeout(() => setAnimate(true), delay);
    
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
      clearTimeout(timer);
    };
  }, [delay]);

  return (
    <h1 
      className={`text-4xl md:text-6xl font-bold text-white ${className} ${
        animate && !prefersReducedMotion 
          ? "animate-heading-entrance" 
          : ""
      }`}
    >
      {text}

      <style jsx global>{`
        @keyframes headingEntrance {
          0% {
            opacity: 0;
            transform: translateY(-30px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-heading-entrance {
          animation: headingEntrance 0.8s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
        }
      `}</style>
    </h1>
  );
};

export default AnimatedHeading;
