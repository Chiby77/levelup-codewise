
import { ArrowRight, Award, Brain, Code, NetworkIcon } from "lucide-react";
import { Button } from "../ui/button";

interface QuickActionProps {
  onActionClick: (query: string) => (e: React.MouseEvent) => void;
  suggestedTopics: {
    icon: React.ReactNode;
    text: string;
    query: string;
  }[];
}

export function QuickActions({ onActionClick, suggestedTopics }: QuickActionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8 animate-fadeIn [animation-delay:500ms]">
      <h4 className="text-sm font-semibold text-muted-foreground col-span-full mb-1">Popular topics:</h4>
      
      <Button 
        variant="outline" 
        className="justify-start group hover:bg-accent/10 border-dashed" 
        onClick={onActionClick("Tell me about Computer Science degrees in Zimbabwe")}
      >
        <Award className="mr-2 h-4 w-4 text-accent" />
        <span>Computer Science degrees</span>
        <ArrowRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Button>
      
      <Button 
        variant="outline" 
        className="justify-start group hover:bg-accent/10 border-dashed" 
        onClick={onActionClick("Explain the OSI model")}
      >
        <NetworkIcon className="mr-2 h-4 w-4 text-accent" />
        <span>OSI network model</span>
        <ArrowRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Button>
      
      <Button 
        variant="outline" 
        className="justify-start group hover:bg-accent/10 border-dashed" 
        onClick={onActionClick("Write a calculator program in Python")}
      >
        <Code className="mr-2 h-4 w-4 text-accent" />
        <span>Python calculator example</span>
        <ArrowRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Button>
      
      <Button 
        variant="outline" 
        className="justify-start group hover:bg-accent/10 border-dashed" 
        onClick={onActionClick("Explain data structures")}
      >
        <Brain className="mr-2 h-4 w-4 text-accent" />
        <span>Data structures</span>
        <ArrowRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Button>
      
      {/* Advanced topics */}
      <h4 className="text-sm font-semibold text-muted-foreground col-span-full mt-4 mb-1">
        Advanced topics:
      </h4>
      
      {suggestedTopics.map((topic, index) => (
        <Button 
          key={index}
          variant="outline" 
          className="justify-start group hover:bg-accent/10 border-dashed" 
          onClick={onActionClick(topic.query)}
        >
          {topic.icon}
          <span>{topic.text}</span>
          <ArrowRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Button>
      ))}
    </div>
  );
}
