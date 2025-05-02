
import { useState, useEffect } from "react";
import { UserRound } from "lucide-react";
import { Dialog, DialogContent } from "./ui/dialog";
import MbuyaZivai from "./MbuyaZivai";

const FloatingChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [haloColor, setHaloColor] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    
    // Get reduced motion preference from HTML class
    const checkReducedMotionClass = () => {
      setPrefersReducedMotion(document.documentElement.classList.contains("reduce-motion"));
    };
    
    // Set up an observer to watch for class changes
    const observer = new MutationObserver(checkReducedMotionClass);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
      observer.disconnect();
    };
  }, []);

  // Change halo color every 5 seconds
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const interval = setInterval(() => {
      setHaloColor(prev => (prev + 1) % 5);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  // Define halo gradient based on current color index
  const haloGradients = [
    "linear-gradient(135deg, #F97316 0%, #8B5CF6 50%, #D946EF 100%)",
    "linear-gradient(135deg, #3B82F6 0%, #10B981 50%, #F59E0B 100%)",
    "linear-gradient(135deg, #EF4444 0%, #EC4899 50%, #8B5CF6 100%)",
    "linear-gradient(135deg, #10B981 0%, #3B82F6 50%, #6366F1 100%)",
    "linear-gradient(135deg, #F59E0B 0%, #EF4444 50%, #EC4899 100%)"
  ];

  const animationClass = prefersReducedMotion 
    ? "" 
    : "animate-float hover:scale-110";

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform z-50 flex items-center gap-2 group border-2 border-white/40 ${animationClass}`}
        style={{
          background: haloGradients[haloColor],
          backgroundSize: "300% 300%",
          animation: prefersReducedMotion 
            ? "none" 
            : "gradientShift 8s ease infinite, float 3s ease-in-out infinite, pulse 2s infinite",
          boxShadow: "0 10px 25px -5px rgba(249, 115, 22, 0.4)"
        }}
      >
        <div 
          className={`w-10 h-10 rounded-full flex items-center justify-center ${prefersReducedMotion ? "" : "animate-spin"}`}
          style={{
            background: "linear-gradient(45deg, rgba(0,0,0,0.2), rgba(0,0,0,0.4))",
            backdropFilter: "blur(4px)",
            animation: prefersReducedMotion ? "none" : "spin 10s linear infinite"
          }}
        >
          <UserRound className="w-6 h-6" />
        </div>
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-linear font-bold text-lg pr-0 group-hover:pr-2">
          Chat with Mbuya Zivai
        </span>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl h-[80vh] p-0 gap-0 border-accent/20 overflow-hidden"
                      style={{
                        background: "linear-gradient(to bottom right, #111 0%, #222 100%)",
                        boxShadow: "0 25px 50px -12px rgba(249, 115, 22, 0.25)"
                      }}>
          <MbuyaZivai />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingChatButton;
