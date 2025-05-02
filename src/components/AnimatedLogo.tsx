
import { useEffect, useState } from "react";

const AnimatedLogo = () => {
  const [animate, setAnimate] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    
    // Start animation after a short delay
    const timer = setTimeout(() => setAnimate(true), 500);
    
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <div className="relative">
        <div 
          className={`font-bold text-2xl md:text-3xl text-white ${
            animate && !prefersReducedMotion 
              ? "animate-logo-entrance" 
              : ""
          }`}
        >
          <span className="text-white">CS</span>
          <span className="text-accent ml-2">Experts</span>
          <span className="text-white ml-2">Zimbabwe</span>
        </div>
      </div>
      
      <style>
        {`
          @keyframes logoEntrance {
            0% {
              opacity: 0;
              transform: scale(0.5) rotate(-10deg);
            }
            50% {
              transform: scale(1.2) rotate(5deg);
            }
            100% {
              opacity: 1;
              transform: scale(1) rotate(0);
            }
          }
          
          .animate-logo-entrance {
            animation: logoEntrance 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          }
        `}
      </style>
    </>
  );
};

export default AnimatedLogo;
