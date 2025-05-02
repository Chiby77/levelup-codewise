
import { useEffect, useState } from "react";

interface AnimatedHeadingProps {
  text: string;
  className?: string;
  delay?: number;
}

const AnimatedHeading = ({ text, className = "", delay = 0 }: AnimatedHeadingProps) => {
  const [animate, setAnimate] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);

  // 10 different color gradients for the text
  const textGradients = [
    "linear-gradient(to right, #ffffff, #f97316, #ffffff)",
    "linear-gradient(to right, #ffffff, #3b82f6, #ffffff)",
    "linear-gradient(to right, #ffffff, #8b5cf6, #ffffff)",
    "linear-gradient(to right, #ffffff, #10b981, #ffffff)",
    "linear-gradient(to right, #ffffff, #f43f5e, #ffffff)",
    "linear-gradient(to right, #ffffff, #f59e0b, #ffffff)",
    "linear-gradient(to right, #ffffff, #6366f1, #ffffff)",
    "linear-gradient(to right, #ffffff, #06b6d4, #ffffff)",
    "linear-gradient(to right, #ffffff, #ec4899, #ffffff)",
    "linear-gradient(to right, #ffffff, #d946ef, #ffffff)",
  ];
  
  // Check for reduced motion preference and start animation cycles
  useEffect(() => {
    // Start animation after specified delay
    const timer = setTimeout(() => setAnimate(true), delay);
    
    // Cycle through color gradients
    const colorInterval = setInterval(() => {
      setColorIndex(prev => (prev + 1) % 10);
    }, 5000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(colorInterval);
    };
  }, [delay]);

  const headingStyle = {
    backgroundImage: textGradients[colorIndex],
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    transition: "background-image 1.5s ease"
  };

  return (
    <>
      <h1 
        className={`text-4xl md:text-6xl font-bold ${className} ${
          animate ? "animate-heading-entrance" : ""
        }`}
        style={headingStyle}
      >
        {text}
      </h1>

      <style>{`
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
    </>
  );
};

export default AnimatedHeading;
