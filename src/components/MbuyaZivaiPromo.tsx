import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Sparkles, MessageSquare, BookOpen, Code, Zap, ArrowRight, Bot, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const MbuyaZivaiPromo = () => {
  const navigate = useNavigate();
  const [, setIsHovered] = useState(false);

  const features = [
    { icon: Brain, title: "Smart AI Tutor", description: "Instant answers to Computer Science questions" },
    { icon: Code, title: "Code Helper", description: "Debug code, understand algorithms, learn programming" },
    { icon: BookOpen, title: "Study Guide", description: "Find resources, past papers and study materials" },
    { icon: GraduationCap, title: "Exam Prep", description: "Practice quizzes and exam preparation" },
  ];

  const sampleQuestions = [
    "What is a binary tree?",
    "Explain VB.NET arrays",
    "How do stacks work?",
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">AI-Powered Learning</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
              Meet <span className="text-gradient-primary">Mbuya Zivai</span>
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Your intelligent AI study companion. Ask questions about Computer Science, get help with
              programming, find study resources, and prepare for exams — powered by advanced AI.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-primary/10">
                    <feature.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="bg-gradient-primary hover:opacity-95 gap-2 shadow-glow"
              >
                <Bot className="w-5 h-5" />
                Start Chatting
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/auth")}
                className="border-primary/30 hover:bg-primary/5"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Try Demo
              </Button>
            </div>
          </motion.div>

          {/* Right - Chat preview */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            viewport={{ once: true }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Card className="relative overflow-hidden border-primary/20 shadow-elegant">
              <div className="bg-card">
                <div className="flex items-center gap-3 p-4 border-b bg-primary/5">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary rounded-full blur-md opacity-50 animate-pulse" />
                    <div className="relative bg-gradient-primary p-2 rounded-full">
                      <Brain className="w-5 h-5 text-primary-foreground" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Mbuya Zivai</h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      Online · AI Assistant
                    </p>
                  </div>
                </div>

                <CardContent className="p-4 space-y-4 min-h-[300px]">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex gap-3"
                  >
                    <div className="bg-primary/15 p-2 rounded-full h-fit">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <div className="bg-muted rounded-2xl rounded-tl-sm p-3 max-w-[80%]">
                      <p className="text-sm text-foreground">
                        Mhoro! I'm Mbuya Zivai, your AI study companion. Ask me anything about Computer Science.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex justify-end"
                  >
                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm p-3 max-w-[80%]">
                      <p className="text-sm">What is a binary search algorithm?</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="flex gap-3"
                  >
                    <div className="bg-primary/15 p-2 rounded-full h-fit">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <div className="bg-muted rounded-2xl rounded-tl-sm p-3 max-w-[80%]">
                      <p className="text-sm text-foreground">
                        Binary search is an efficient algorithm that finds a target value in a <strong>sorted</strong> array
                        by repeatedly dividing the search interval in half.
                      </p>
                      <div className="mt-2 p-2 bg-background rounded-lg">
                        <p className="text-xs font-mono text-foreground">Time Complexity: O(log n)</p>
                      </div>
                    </div>
                  </motion.div>

                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
                    <div className="flex flex-wrap gap-2">
                      {sampleQuestions.map((q, i) => (
                        <motion.span
                          key={q}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1.3 + i * 0.08 }}
                          className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary cursor-pointer hover:bg-primary/15 transition-colors"
                        >
                          {q}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </CardContent>

                <div className="p-4 border-t bg-muted/30">
                  <div className="flex items-center gap-2 bg-background rounded-full px-4 py-2 border border-border">
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Ask Mbuya Zivai anything...</span>
                    <Zap className="w-4 h-4 text-primary ml-auto" />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MbuyaZivaiPromo;
