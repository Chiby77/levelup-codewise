
import { useState } from "react";
import { UserRound } from "lucide-react";
import { Dialog, DialogContent } from "./ui/dialog";
import MbuyaZivai from "./MbuyaZivai";

const FloatingChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 z-50 flex items-center gap-2 group animate-pulse border-2 border-white/40"
        style={{
          background: "linear-gradient(135deg, #F97316 0%, #8B5CF6 50%, #D946EF 100%)",
          backgroundSize: "300% 300%",
          animation: "gradientShift 8s ease infinite, pulse 2s infinite",
          boxShadow: "0 10px 25px -5px rgba(249, 115, 22, 0.4)"
        }}
      >
        <div className="w-10 h-10 rounded-full flex items-center justify-center"
             style={{
               background: "linear-gradient(45deg, rgba(0,0,0,0.2), rgba(0,0,0,0.4))",
               backdropFilter: "blur(4px)"
             }}>
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
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(249, 115, 22, 0); }
          100% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0); }
        }
      `}</style>
    </>
  );
};

export default FloatingChatButton;
