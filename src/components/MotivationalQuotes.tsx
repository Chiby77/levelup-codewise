import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Quote {
  text: string;
  author?: string;
  language: 'en' | 'sn';
}

const motivationalQuotes: Quote[] = [
  // English quotes
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", language: 'en' },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", language: 'en' },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", language: 'en' },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson", language: 'en' },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", language: 'en' },
  { text: "Excellence is never an accident. It is always the result of high intention and intelligent effort.", author: "Aristotle", language: 'en' },
  { text: "Your education is a gift. Use it to make your parents proud.", language: 'en' },
  { text: "Hard work beats talent when talent doesn't work hard.", language: 'en' },
  { text: "Every expert was once a beginner. Every pro was once an amateur.", language: 'en' },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", language: 'en' },
  
  // Shona quotes
  { text: "Kukunda hakuperi, kukundwa hakuurayi: kushingirira ndiko kunokosha.", language: 'sn' },
  { text: "Chiedza chakafukidza nyika yose chakatanga pamwenje mumwe.", language: 'sn' },
  { text: "Usina tariro huna ramangwana.", language: 'sn' },
  { text: "Kudzidza kunoguma neguva.", language: 'sn' },
  { text: "Mwana anochema anosvasvura.", language: 'sn' },
  { text: "Ziva zvako, reva zvako, ita zvako.", language: 'sn' },
  { text: "Muti unonzi iwe uchiri mudiriri.", language: 'sn' },
  { text: "Pfuura nepakafanira, simuka pakafanira.", language: 'sn' },
  { text: "Vabereki vanofara kana vana vavo vachibudirira.", language: 'sn' },
  { text: "Kushingaira kwako kuchabereka michero yakanaka.", language: 'sn' },
];

const examQuotes: Quote[] = [
  { text: "WISHING YOU ALL THE BEST IN YOUR FINAL EXAMS", language: 'en' },
  { text: "USAKANGANWE PRAYER - LET'S MAKE OUR PARENTS HAPPY", language: 'en' },
  { text: "You've prepared well. Trust yourself and shine!", language: 'en' },
  { text: "Every question is an opportunity to show your knowledge.", language: 'en' },
  { text: "Stay calm, read carefully, and let your preparation guide you.", language: 'en' },
  { text: "Kukanyangadza kwenyu kuri kuuya neshure kwokumirira.", language: 'sn' },
  { text: "Munamato nemushando zvinokuremekedza vabereki venyu.", language: 'sn' },
  { text: "Pfuurai mavambo enyu nekushingirira.", language: 'sn' },
];

interface MotivationalQuotesProps {
  showExamQuotes?: boolean;
}

export const MotivationalQuotes: React.FC<MotivationalQuotesProps> = ({ showExamQuotes = false }) => {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [userDisabled, setUserDisabled] = useState(false);

  useEffect(() => {
    // Check if user has disabled quotes
    const disabled = localStorage.getItem('motivationalQuotesDisabled') === 'true';
    setUserDisabled(disabled);

    if (disabled) return;

    const quotes = showExamQuotes ? examQuotes : motivationalQuotes;
    
    const showQuote = () => {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setCurrentQuote(randomQuote);
      setIsVisible(true);

      // Auto-hide after 5 seconds
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setCurrentQuote(null), 300); // Allow fade out
      }, 5000);
    };

    // Show initial quote after 3 seconds
    const initialTimer = setTimeout(showQuote, 3000);

    // Show quotes every 45-90 seconds
    const interval = setInterval(() => {
      if (!document.hidden) { // Only show when tab is active
        showQuote();
      }
    }, Math.random() * 45000 + 45000); // Random between 45-90 seconds

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [showExamQuotes, userDisabled]);

  const handleDisable = () => {
    localStorage.setItem('motivationalQuotesDisabled', 'true');
    setUserDisabled(true);
    setIsVisible(false);
    setCurrentQuote(null);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setCurrentQuote(null), 300);
  };

  if (!currentQuote || userDisabled) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
    }`}>
      <Card className="max-w-sm p-4 bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-sm border shadow-lg">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">💫</span>
              <span className="text-sm font-medium text-primary">
                {currentQuote.language === 'sn' ? 'Mufaro' : 'Inspiration'}
              </span>
            </div>
            
            <p className={`text-sm ${currentQuote.language === 'sn' ? 'font-medium' : ''} leading-relaxed`}>
              {currentQuote.text}
            </p>
            
            {currentQuote.author && (
              <p className="text-xs text-muted-foreground mt-2 italic">
                — {currentQuote.author}
              </p>
            )}
          </div>
          
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0 hover:bg-red-100"
            >
              <X className="h-3 w-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDisable}
              className="h-6 w-6 p-0 hover:bg-gray-100 text-xs"
              title="Disable motivational quotes"
            >
              ⚙️
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MotivationalQuotes;