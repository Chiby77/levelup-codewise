import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { useToast } from "./ui/use-toast";

interface Message {
  role: "assistant" | "user";
  content: string;
}

export default function MbuyaZivai() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);

  const systemPrompt = `You are Mbuya Zivai, a knowledgeable AI assistant for A Level Computer Science Experts in Zimbabwe. 
You help students with computer science concepts and programming questions.
You should be friendly, patient, and explain concepts clearly.
Base your knowledge on the following context about the organization:
- A Level Computer Science Experts started as a WhatsApp group in Masvingo
- It was founded by Brave Machangu and grew with help from L Chenyika, J Mapasure and T Chibi
- They provide computer science education and career guidance across Zimbabwe
- They offer programming tutorials and past exam papers
When answering programming questions, provide clear explanations and example code when relevant.`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Perplexity API key to continue.",
        variant: "destructive",
      });
      return;
    }

    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-sonar-small-128k-online",
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            ...messages,
            userMessage,
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const assistantMessage = {
        role: "assistant" as const,
        content: data.choices[0].message.content,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from Mbuya Zivai. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      setShowApiKeyInput(false);
      toast({
        title: "API Key Set",
        description: "You can now chat with Mbuya Zivai!",
      });
    }
  };

  if (showApiKeyInput) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle>Enter Perplexity API Key</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleApiKeySubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Enter your Perplexity API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <Button type="submit" className="w-full">
              Set API Key
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Chat with Mbuya Zivai</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] mb-4 p-4 border rounded-lg">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.role === "assistant"
                  ? "bg-primary/10 p-3 rounded-lg"
                  : "bg-secondary/10 p-3 rounded-lg"
              }`}
            >
              <p className="font-semibold">
                {message.role === "assistant" ? "Mbuya Zivai" : "You"}:
              </p>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          ))}
          {isLoading && (
            <div className="text-center text-muted-foreground">
              Mbuya Zivai is thinking...
            </div>
          )}
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Mbuya Zivai anything about computer science..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}