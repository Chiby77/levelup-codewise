
import { Bot, GraduationCap, Heart } from "lucide-react";
import { CardDescription, CardTitle } from "../ui/card";

export function ChatHeader() {
  return (
    <>
      <div className="absolute -top-6 -right-6 w-12 h-12 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute -bottom-6 -left-6 w-14 h-14 bg-accent/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      
      <CardTitle className="flex items-center gap-2 text-2xl group">
        <div className="relative">
          <Bot className="w-8 h-8 text-primary z-10 relative" />
          <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-sm animate-pulse"></div>
        </div>
        <span>Chat with Mbuya Zivai</span>
        <Heart className="w-5 h-5 text-red-500 ml-2 animate-heartbeat" />
      </CardTitle>
      <CardDescription className="text-muted-foreground flex items-center gap-2">
        <span>Your wise AI guide to Computer Science and programming knowledge</span>
        <GraduationCap className="w-4 h-4 text-accent animate-bounce" style={{ animationDuration: "2s" }} />
      </CardDescription>
    </>
  );
}
