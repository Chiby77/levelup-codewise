
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Phone, MapPin, MessageSquare, Send, Sparkles } from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Start animations after a short delay
    const timer = setTimeout(() => setAnimate(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    toast({
      title: "Message Sent",
      description: "Thank you for your message. We'll get back to you soon!",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12 relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        </div>
        
        <h1 className={`text-4xl md:text-6xl font-bold text-foreground mb-2 relative z-10 ${animate ? "animate-fadeIn" : "opacity-0"}`}>
          Get in 
          <span className="relative ml-3">
            Touch
            <span className="absolute -top-6 -right-8 text-2xl animate-float text-accent">
              <Sparkles className="h-8 w-8" />
            </span>
          </span>
        </h1>
        
        <p className={`text-xl mb-12 text-muted-foreground max-w-2xl ${animate ? "animate-fadeIn [animation-delay:200ms]" : "opacity-0"}`}>
          Have questions about our A-Level Computer Science programs? We're here to help! Reach out through any of the channels below.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {/* Contact Form with enhanced animations */}
          <Card className={`bg-background/80 backdrop-blur-sm border-border shadow-lg ${animate ? "animate-fadeIn [animation-delay:400ms]" : "opacity-0"}`}>
            <CardHeader>
              <CardTitle className="text-2xl text-foreground flex items-center gap-2">
                <span>Send us a Message</span>
                <MessageSquare className="h-5 w-5 text-accent animate-pulse" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className={`space-y-2 ${animate ? "animate-fadeIn [animation-delay:600ms]" : "opacity-0"}`}>
                  <label htmlFor="name" className="text-foreground">Name</label>
                  <Input 
                    id="name" 
                    placeholder="Your name" 
                    className="bg-background/50 backdrop-blur-sm border-border transition-all focus:ring-2 focus:ring-accent/25" 
                  />
                </div>
                <div className={`space-y-2 ${animate ? "animate-fadeIn [animation-delay:700ms]" : "opacity-0"}`}>
                  <label htmlFor="email" className="text-foreground">Email</label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Your email" 
                    className="bg-background/50 backdrop-blur-sm border-border transition-all focus:ring-2 focus:ring-accent/25" 
                  />
                </div>
                <div className={`space-y-2 ${animate ? "animate-fadeIn [animation-delay:800ms]" : "opacity-0"}`}>
                  <label htmlFor="message" className="text-foreground">Message</label>
                  <Textarea 
                    id="message" 
                    placeholder="Your message" 
                    className="min-h-[150px] bg-background/50 backdrop-blur-sm border-border transition-all focus:ring-2 focus:ring-accent/25"
                  />
                </div>
                <Button 
                  type="submit" 
                  className={`w-full relative overflow-hidden group ${animate ? "animate-fadeIn [animation-delay:900ms]" : "opacity-0"}`}
                  disabled={isSubmitting}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? "Sending..." : "Send Message"}
                    <Send className={`h-4 w-4 transition-transform ${!isSubmitting && "group-hover:translate-x-1"}`} />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-accent to-accent/80 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information with enhanced animations */}
          <div className="space-y-6">
            <Card className={`bg-background/80 backdrop-blur-sm border-border shadow-lg hover:shadow-xl transition-all ${animate ? "animate-fadeIn [animation-delay:500ms]" : "opacity-0"}`}>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4 text-foreground">
                  <div className="p-3 rounded-full bg-primary/10 text-accent">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <a 
                      href="mailto:tinodaishemchibi@gmail.com" 
                      className="hover:text-accent transition-colors relative group"
                    >
                      tinodaishemchibi@gmail.com
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`bg-background/80 backdrop-blur-sm border-border shadow-lg hover:shadow-xl transition-all ${animate ? "animate-fadeIn [animation-delay:600ms]" : "opacity-0"}`}>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4 text-foreground">
                  <div className="p-3 rounded-full bg-primary/10 text-accent">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <a 
                      href="tel:+263781081816" 
                      className="hover:text-accent transition-colors relative group"
                    >
                      +263 78 108 1816
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`bg-background/80 backdrop-blur-sm border-border shadow-lg hover:shadow-xl transition-all ${animate ? "animate-fadeIn [animation-delay:700ms]" : "opacity-0"}`}>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4 text-foreground">
                  <div className="p-3 rounded-full bg-primary/10 text-accent">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">WhatsApp</h3>
                    <a 
                      href="https://wa.me/263718176525" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="hover:text-accent transition-colors relative group"
                    >
                      +263 71 817 6525
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`bg-background/80 backdrop-blur-sm border-border shadow-lg hover:shadow-xl transition-all ${animate ? "animate-fadeIn [animation-delay:800ms]" : "opacity-0"}`}>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4 text-foreground">
                  <div className="p-3 rounded-full bg-primary/10 text-accent">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Location</h3>
                    <a 
                      href="https://maps.app.goo.gl/yMY8dqBXFpkc5ALB6" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-accent transition-colors relative group"
                    >
                      View on Google Maps
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Contact;
