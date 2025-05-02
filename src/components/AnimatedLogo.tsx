
import { useEffect, useState } from "react";

const AnimatedLogo = () => {
  const [animate, setAnimate] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  
  // 10 different color schemes
  const colorSchemes = [
    { text: "text-white", accent: "text-[#F97316]" },
    { text: "text-blue-100", accent: "text-[#3B82F6]" },
    { text: "text-purple-100", accent: "text-[#8B5CF6]" },
    { text: "text-green-100", accent: "text-[#10B981]" },
    { text: "text-rose-100", accent: "text-[#F43F5E]" },
    { text: "text-amber-100", accent: "text-[#F59E0B]" },
    { text: "text-indigo-100", accent: "text-[#6366F1]" },
    { text: "text-cyan-100", accent: "text-[#06B6D4]" },
    { text: "text-emerald-100", accent: "text-[#10B981]" },
    { text: "text-pink-100", accent: "text-[#EC4899]" },
  ];

  useEffect(() => {
    // Start animation after a short delay
    const timer = setTimeout(() => setAnimate(true), 500);
    
    // Cycle through color schemes
    const colorInterval = setInterval(() => {
      setColorIndex(prev => (prev + 1) % 10);
    }, 5000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(colorInterval);
    };
  }, []);

  const currentScheme = colorSchemes[colorIndex];

  return (
    <>
      <div className="relative">
        <div 
          className={`font-bold text-2xl md:text-3xl ${animate ? "animate-logo-entrance" : ""}`}
        >
          <span className={`${currentScheme.text} transition-colors duration-1000`}>CS</span>
          <span className={`${currentScheme.accent} ml-2 transition-colors duration-1000`}>Experts</span>
          <span className={`${currentScheme.text} ml-2 transition-colors duration-1000`}>Zimbabwe</span>
        </div>
      </div>
      
      <style>{`
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
      `}</style>
    </>
  );
};

export default AnimatedLogo;
