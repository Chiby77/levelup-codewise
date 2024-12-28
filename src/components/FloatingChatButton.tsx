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
        className="fixed bottom-6 right-6 p-4 bg-secondary text-white rounded-full shadow-lg hover:bg-secondary/90 transition-all transform hover:scale-110 z-50 flex items-center gap-2 group animate-bounce"
      >
        <UserRound className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-linear">
          Chat with Mbuya Zivai
        </span>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <MbuyaZivai />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingChatButton;