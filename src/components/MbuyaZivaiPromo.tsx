import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Brain, 
  Sparkles, 
  MessageSquare, 
  BookOpen, 
  Code, 
  Zap,
  ArrowRight,
  Bot,
  GraduationCap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MbuyaZivaiPromo = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const features = [
    {
      icon: Brain,
      title: 'Smart AI Tutor',
      description: 'Get instant answers to Computer Science questions',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Code,
      title: 'Code Helper',
      description: 'Debug code, understand algorithms, learn programming',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: BookOpen,
      title: 'Study Guide',
      description: 'Find resources, past papers, and study materials',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: GraduationCap,
      title: 'Exam Prep',
      description: 'Practice quizzes and exam preparation assistance',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const sampleQuestions = [
    "What is a binary tree?",
    "Explain VB.NET arrays",
    "How do stacks work?",
    "SQL JOIN examples",
    "Convert 255 to binary"
  ];

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-emerald-900/5 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-600/10 via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
              <span className="text-sm font-medium text-emerald-600">AI-Powered Learning</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold">
              Meet{' '}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 bg-clip-text text-transparent">
                Mbuya Zivai
              </span>
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Your intelligent AI study companion. Ask questions about Computer Science, 
              get help with programming, find study resources, and prepare for exams - 
              all powered by advanced AI technology.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-card/50 border border-border/50 hover:border-emerald-500/30 transition-colors"
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${feature.color}`}>
                    <feature.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <Button
                size="lg"
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 gap-2 shadow-lg shadow-emerald-500/20"
              >
                <Bot className="w-5 h-5" />
                Start Chatting
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/auth')}
                className="border-emerald-500/30 hover:bg-emerald-500/10"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Try Demo
              </Button>
            </div>

            {/* WhatsApp Integration Notice */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <div className="p-2 rounded-full bg-green-500/20">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-400">WhatsApp Coming Soon!</p>
                <p className="text-xs text-muted-foreground">Chat with Mbuya Zivai directly on WhatsApp</p>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Chat Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Card className="relative overflow-hidden border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
              {/* Animated border glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 animate-pulse" />
              
              <div className="relative bg-card/95 backdrop-blur-sm">
                {/* Chat Header */}
                <div className="flex items-center gap-3 p-4 border-b bg-gradient-to-r from-emerald-600/10 to-teal-600/10">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500 rounded-full blur-md opacity-50 animate-pulse" />
                    <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-full">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-700 dark:text-emerald-400">Mbuya Zivai</h4>
                    <p className="text-xs text-emerald-600/70 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      Online • AI Assistant
                    </p>
                  </div>
                </div>

                <CardContent className="p-4 space-y-4 min-h-[300px]">
                  {/* AI Message */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex gap-3"
                  >
                    <div className="bg-emerald-500/20 p-2 rounded-full h-fit">
                      <Bot className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl rounded-tl-sm p-3 max-w-[80%]">
                      <p className="text-sm">
                        Mhoro! 👋 I'm Mbuya Zivai, your AI study companion. Ask me anything about Computer Science!
                      </p>
                    </div>
                  </motion.div>

                  {/* User Message */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex justify-end"
                  >
                    <div className="bg-emerald-600 text-white rounded-2xl rounded-tr-sm p-3 max-w-[80%]">
                      <p className="text-sm">What is a binary search algorithm?</p>
                    </div>
                  </motion.div>

                  {/* AI Response */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="flex gap-3"
                  >
                    <div className="bg-emerald-500/20 p-2 rounded-full h-fit">
                      <Bot className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl rounded-tl-sm p-3 max-w-[80%]">
                      <p className="text-sm">
                        Binary search is an efficient algorithm that finds a target value in a <strong>sorted</strong> array by repeatedly dividing the search interval in half. 🔍
                      </p>
                      <div className="mt-2 p-2 bg-background/50 rounded-lg">
                        <p className="text-xs font-mono">Time Complexity: O(log n)</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Suggested Questions */}
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
                    <div className="flex flex-wrap gap-2">
                      {sampleQuestions.slice(0, 3).map((q, i) => (
                        <motion.span
                          key={q}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1.4 + i * 0.1 }}
                          className="text-xs px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 cursor-pointer hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                        >
                          {q}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </CardContent>

                {/* Chat Input Preview */}
                <div className="p-4 border-t bg-muted/30">
                  <div className="flex items-center gap-2 bg-background rounded-full px-4 py-2 border">
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Ask Mbuya Zivai anything...</span>
                    <Zap className="w-4 h-4 text-emerald-500 ml-auto" />
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
