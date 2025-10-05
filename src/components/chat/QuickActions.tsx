import { ArrowRight, Award, Brain, Code, NetworkIcon, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

interface QuickActionProps {
  onActionClick: (query: string) => (e: React.MouseEvent) => void;
  suggestedTopics: {
    icon: React.ReactNode;
    text: string;
    query: string;
  }[];
}

export function QuickActions({ onActionClick, suggestedTopics }: QuickActionProps) {
  const popularTopics = [
    {
      icon: <Award className="h-5 w-5" />,
      text: "Computer Science degrees",
      query: "Tell me about Computer Science degrees in Zimbabwe",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <NetworkIcon className="h-5 w-5" />,
      text: "OSI network model",
      query: "Explain the OSI model",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Code className="h-5 w-5" />,
      text: "Python calculator",
      query: "Write a calculator program in Python",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <Brain className="h-5 w-5" />,
      text: "Data structures",
      query: "Explain data structures",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="space-y-6 p-4 animate-fadeIn">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-accent" />
          <h4 className="text-sm font-bold text-foreground">Popular Topics</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {popularTopics.map((topic, index) => (
            <Card 
              key={index}
              className="group relative overflow-hidden border-border/50 hover:border-accent/50 transition-all cursor-pointer hover:shadow-lg hover:scale-[1.02]"
              onClick={onActionClick(topic.query)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${topic.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
              
              <div className="p-4 flex items-center gap-3 relative z-10">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${topic.gradient} text-white shadow-md`}>
                  {topic.icon}
                </div>
                
                <span className="flex-1 text-sm font-medium">{topic.text}</span>
                
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      {suggestedTopics.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-primary" />
            <h4 className="text-sm font-bold text-foreground">Advanced Topics</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestedTopics.map((topic, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-border/50 hover:border-primary/50 transition-all cursor-pointer hover:shadow-lg hover:scale-[1.02]"
                onClick={onActionClick(topic.query)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-0 group-hover:opacity-10 transition-opacity"></div>
                
                <div className="p-4 flex items-center gap-3 relative z-10">
                  <div className="text-primary">
                    {topic.icon}
                  </div>
                  
                  <span className="flex-1 text-sm font-medium">{topic.text}</span>
                  
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
