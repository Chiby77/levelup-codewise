
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
        className="fixed bottom-6 right-6 p-4 bg-gradient-to-br from-[#F97316] via-[#8B5CF6] to-[#D946EF] text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 z-50 flex items-center gap-2 group animate-pulse border-2 border-white"
        style={{
          backgroundSize: "300% 300%",
          animation: "gradientShift 8s ease infinite, pulse 2s infinite"
        }}
      >
        <div className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
          <UserRound className="w-6 h-6" />
        </div>
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-linear font-bold text-lg">
          Chat with Mbuya Zivai
        </span>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl h-[80vh] p-0 gap-0 bg-gradient-to-br from-[#111] to-[#222] border-accent/20">
          <MbuyaZivai />
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </>
  );
};

export default FloatingChatButton;
