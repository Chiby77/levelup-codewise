
import { useState, useEffect } from "react";
import { UserRound } from "lucide-react";
import { Dialog, DialogContent } from "./ui/dialog";
import MbuyaZivai from "./MbuyaZivai";

const FloatingChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [haloColor, setHaloColor] = useState(0);

  // Enhanced color palette with 10 different colors
  const haloGradients = [
    "linear-gradient(135deg, #F97316 0%, #8B5CF6 50%, #D946EF 100%)",
    "linear-gradient(135deg, #3B82F6 0%, #10B981 50%, #F59E0B 100%)",
    "linear-gradient(135deg, #EF4444 0%, #EC4899 50%, #8B5CF6 100%)",
    "linear-gradient(135deg, #10B981 0%, #3B82F6 50%, #6366F1 100%)",
    "linear-gradient(135deg, #F59E0B 0%, #EF4444 50%, #EC4899 100%)",
    "linear-gradient(135deg, #06B6D4 0%, #8B5CF6 50%, #F43F5E 100%)",
    "linear-gradient(135deg, #D946EF 0%, #F97316 50%, #3B82F6 100%)",
    "linear-gradient(135deg, #6366F1 0%, #10B981 50%, #F43F5E 100%)",
    "linear-gradient(135deg, #F43F5E 0%, #F59E0B 50%, #06B6D4 100%)",
    "linear-gradient(135deg, #8B5CF6 0%, #EF4444 50%, #10B981 100%)"
  ];

  // Change halo color every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setHaloColor(prev => (prev + 1) % 10);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const buttonStyle = {
    background: haloGradients[haloColor],
    boxShadow: "0 10px 25px -5px rgba(249, 115, 22, 0.4)",
    transition: "background 1.5s ease, transform 0.3s ease-in-out"
  };

  const iconContainerStyle = {
    background: "linear-gradient(45deg, rgba(0,0,0,0.2), rgba(0,0,0,0.4))",
    backdropFilter: "blur(4px)"
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform z-50 flex items-center gap-2 group border-2 border-white/40 animate-float hover:scale-110"
        style={buttonStyle}
      >
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center animate-spin"
          style={{...iconContainerStyle, animationDuration: "10s"}}
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

      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-spin {
          animation: spin 10s linear infinite;
        }
      `}</style>
    </>
  );
};

export default FloatingChatButton;
