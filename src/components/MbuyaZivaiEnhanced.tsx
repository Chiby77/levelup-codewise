import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, X, Sparkles, Brain, Heart } from 'lucide-react';
import { toast } from 'sonner';

// Enhanced AI responses with Shona integration
const enhancedResponses = {
  greetings: [
    { en: "Hello! I'm Mbuya Zivai, your AI study companion. How can I help you today?", sn: "Mhoro! Ndini Mbuya Zivai, shamwari yako yekudzidza. Ndinogona kukubatsira sei nhasi?" },
    { en: "Welcome back! Ready to conquer your studies?", sn: "Wakadzokazve! Wakagadzirira kutora zvidzidzo zvako here?" },
    { en: "Good day, my child! Let's make learning exciting today.", sn: "Zuva rakanaka mwanangu! Ngatiite kuti kudzidza kuve kusagwagwa nhasi." }
  ],
  motivation: [
    { en: "You're doing amazingly well! Keep pushing forward!", sn: "Uri kuita zvakanaka chaizvo! Ramba uchisimuka!" },
    { en: "Every step counts towards your success!", sn: "Danho rese rinoverengeka mukufambira mberi kwako!" },
    { en: "Remember, diamonds are made under pressure!", sn: "Rangarira kuti madhaimondi anoitwa pasi pokumanikidza!" },
    { en: "Your parents will be so proud when you succeed!", sn: "Vabereki vako vachafara chaizvo kana wabudirira!" }
  ],
  computerScience: [
    { en: "Computer Science is like solving puzzles - each problem teaches you something new!", sn: "Computer Science yakafanana nekugadziridza mazano - dambudziko rega rega rinokudzidzisa chimwe chitsva!" },
    { en: "Programming is a superpower in today's world. You're learning to create magic!", sn: "Programming isimba guru munyika yedu yanhasi. Uri kudzidza kugadzira mashiripiti!" },
    { en: "Algorithms are like recipes - follow the steps and you'll get great results!", sn: "Ma-algorithms akafanana nerecipe - tevera matanho uye uchawana mhedzisiro yakanaka!" }
  ],
  exam: [
    { en: "Take a deep breath. You've prepared well for this!", sn: "Wafemera zvishoma. Wakagadzirira zvakanaka izvi!" },
    { en: "Read each question carefully and trust your knowledge!", sn: "Verenga mubvunzo wega wega zvakanyanya uye vimba neruzivo rwako!" },
    { en: "Remember - you know more than you think you do!", sn: "Rangarira - unoziva zvakawanda kupfuura zvaunorangarira!" }
  ]
};

const shonaWisdom = [
  "Mwana asingaregi kubvunzwa hasviki pakafukidza.",
  "Kudzidza hakuperi, kudzidza igore.",
  "Muromo ukafemera haupindire nyimo.",
  "Ukama hwemwenga ndihwo huli pa verenga.",
  "Chova moyo, chikafukidza chikakupa."
];

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'mbuya';
  timestamp: Date;
  language?: 'en' | 'sn';
}

export const MbuyaZivaiEnhanced: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentMood, setCurrentMood] = useState<'wise' | 'encouraging' | 'analytical'>('wise');
  const [language, setLanguage] = useState<'en' | 'sn' | 'both'>('both');

  // Enhanced AI response generation
  const generateResponse = useCallback((userMessage: string): { text: string; language: 'en' | 'sn' } => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Context-aware response selection
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('mhoro')) {
      const responses = enhancedResponses.greetings;
      const selected = responses[Math.floor(Math.random() * responses.length)];
      return { text: language === 'sn' ? selected.sn : selected.en, language: language === 'sn' ? 'sn' : 'en' };
    }
    
    if (lowerMessage.includes('exam') || lowerMessage.includes('test') || lowerMessage.includes('afraid')) {
      const responses = enhancedResponses.exam;
      const selected = responses[Math.floor(Math.random() * responses.length)];
      return { text: language === 'sn' ? selected.sn : selected.en, language: language === 'sn' ? 'sn' : 'en' };
    }
    
    if (lowerMessage.includes('computer') || lowerMessage.includes('programming') || lowerMessage.includes('code')) {
      const responses = enhancedResponses.computerScience;
      const selected = responses[Math.floor(Math.random() * responses.length)];
      return { text: language === 'sn' ? selected.sn : selected.en, language: language === 'sn' ? 'sn' : 'en' };
    }
    
    if (lowerMessage.includes('motivation') || lowerMessage.includes('help') || lowerMessage.includes('difficult')) {
      const responses = enhancedResponses.motivation;
      const selected = responses[Math.floor(Math.random() * responses.length)];
      return { text: language === 'sn' ? selected.sn : selected.en, language: language === 'sn' ? 'sn' : 'en' };
    }

    // Random wisdom
    if (Math.random() > 0.7) {
      const wisdom = shonaWisdom[Math.floor(Math.random() * shonaWisdom.length)];
      return { 
        text: `${wisdom} - This Shona wisdom means: every question you ask helps you learn more!`, 
        language: 'sn' 
      };
    }
    
    // Default encouraging response
    const responses = enhancedResponses.motivation;
    const selected = responses[Math.floor(Math.random() * responses.length)];
    return { text: language === 'sn' ? selected.sn : selected.en, language: language === 'sn' ? 'sn' : 'en' };
  }, [language]);

  // Enhanced typing simulation
  const simulateTyping = useCallback((responseText: string, responseLanguage: 'en' | 'sn') => {
    setIsTyping(true);
    
    // Simulate more realistic typing time based on message length
    const typingTime = Math.min(Math.max(responseText.length * 50, 1000), 3000);
    
    setTimeout(() => {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: responseText,
        sender: 'mbuya',
        timestamp: new Date(),
        language: responseLanguage
      };
      
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
    }, typingTime);
  }, []);

  const handleSendMessage = useCallback(() => {
    if (!inputMessage.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    
    // Generate enhanced AI response
    const { text: responseText, language: responseLanguage } = generateResponse(inputMessage);
    simulateTyping(responseText, responseLanguage);
  }, [inputMessage, generateResponse, simulateTyping]);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcome = enhancedResponses.greetings[0];
      const welcomeMessage: Message = {
        id: 'welcome',
        text: language === 'sn' ? welcome.sn : welcome.en,
        sender: 'mbuya',
        timestamp: new Date(),
        language: language === 'sn' ? 'sn' : 'en'
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length, language]);

  // Enhanced periodic wisdom
  useEffect(() => {
    if (!isOpen) return;
    
    const interval = setInterval(() => {
      if (Math.random() > 0.8 && messages.length > 0) {
        const wisdom = shonaWisdom[Math.floor(Math.random() * shonaWisdom.length)];
        const wisdomMessage: Message = {
          id: `wisdom-${Date.now()}`,
          text: `💫 ${wisdom}`,
          sender: 'mbuya',
          timestamp: new Date(),
          language: 'sn'
        };
        setMessages(prev => [...prev, wisdomMessage]);
        
        setTimeout(() => {
          setMessages(prev => prev.filter(msg => msg.id !== wisdomMessage.id));
        }, 8000);
      }
    }, 15000);
    
    return () => clearInterval(interval);
  }, [isOpen, messages.length]);

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-xl transition-all duration-300 z-50"
        aria-label="Chat with Mbuya Zivai"
      >
        <div className="relative">
          <MessageSquare className="h-6 w-6 text-white" />
          <Sparkles className="h-3 w-3 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
        </div>
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl border z-50 flex flex-col">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg p-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
              <Brain className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-sm">Mbuya Zivai AI</CardTitle>
              <p className="text-xs opacity-90">Enhanced Study Companion</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(prev => prev === 'en' ? 'sn' : prev === 'sn' ? 'both' : 'en')}
              className="text-white hover:bg-white/20 text-xs p-1"
            >
              {language === 'en' ? 'EN' : language === 'sn' ? 'SN' : 'BOTH'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-2 ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              {message.language && (
                <Badge
                  variant="outline"
                  className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'border-white/30 text-white/80' : ''
                  }`}
                >
                  {message.language === 'sn' ? 'Shona' : 'English'}
                </Badge>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-2 max-w-[80%]">
              <div className="flex items-center gap-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <Brain className="h-3 w-3 text-purple-600 animate-pulse ml-2" />
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <div className="p-3 border-t">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask Mbuya Zivai anything..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="text-sm"
          />
          <Button size="sm" onClick={handleSendMessage} disabled={!inputMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-center mt-2">
          <Badge variant="outline" className="text-xs">
            <Heart className="h-3 w-3 mr-1 text-red-500" />
            Powered by Advanced AI
          </Badge>
        </div>
      </div>
    </div>
  );
};