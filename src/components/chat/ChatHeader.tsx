import { Bot, GraduationCap, Sparkles, Brain } from "lucide-react";
import { CardDescription, CardTitle } from "../ui/card";

export function ChatHeader() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 p-6 rounded-t-lg">
      {/* Animated background orbs */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }}></div>
      
      <div className="relative z-10">
        <CardTitle className="flex items-center gap-3 text-2xl mb-2">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-md opacity-60 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-primary to-accent p-2 rounded-full">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 animate-pulse" />
          </div>
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent font-bold">
            Mbuya Zivai
          </span>
          <Brain className="w-5 h-5 text-accent ml-auto animate-pulse" />
        </CardTitle>
        
        <CardDescription className="text-sm flex items-center gap-2 ml-11">
          <span className="text-muted-foreground">AI-Powered Computer Science Assistant</span>
          <GraduationCap className="w-4 h-4 text-accent" />
        </CardDescription>
        
        {/* Status indicator */}
        <div className="flex items-center gap-2 mt-3 ml-11">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs text-muted-foreground">Online & Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}
