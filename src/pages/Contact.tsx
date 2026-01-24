import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Send, 
  Sparkles, 
  GraduationCap,
  Users,
  Calendar,
  BookOpen,
  Star,
  CheckCircle2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

// Validation schema
const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().max(20, "Phone number too long").optional(),
  bookingType: z.enum(["general", "private-lessons", "school-seminar"]),
  message: z.string().trim().min(1, "Message is required").max(2000, "Message must be less than 2000 characters")
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [bookingType, setBookingType] = useState<"general" | "private-lessons" | "school-seminar">("general");
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const validateForm = (formData: FormData): ContactFormData | null => {
    const data = {
      name: formData.get('from_name') as string,
      email: formData.get('from_email') as string,
      phone: formData.get('phone') as string || undefined,
      bookingType: bookingType,
      message: formData.get('message') as string
    };

    const result = contactSchema.safeParse(data);
    
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof ContactFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      return null;
    }
    
    setErrors({});
    return result.data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const validatedData = validateForm(formData);
    if (!validatedData) {
      setIsSubmitting(false);
      toast({
        title: "Validation Error",
        description: "Please check your form inputs and try again.",
        variant: "destructive"
      });
      return;
    }

    // Build message with booking type context
    const messagePrefix = bookingType === "private-lessons" 
      ? "[PRIVATE LESSONS INQUIRY]\n" 
      : bookingType === "school-seminar" 
        ? "[SCHOOL SEMINAR BOOKING]\n" 
        : "";
    
    const fullMessage = `${messagePrefix}${validatedData.phone ? `Phone: ${validatedData.phone}\n\n` : ""}${validatedData.message}`;
    
    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: { 
          name: validatedData.name, 
          email: validatedData.email, 
          message: fullMessage 
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.success) {
        toast({
          title: "Message Sent Successfully!",
          description: bookingType !== "general" 
            ? "Thank you for your booking inquiry. Tino will get back to you within 24 hours!" 
            : "Thank you for your message. We'll get back to you soon!",
        });
        form.reset();
        setBookingType("general");
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Contact form error');
      toast({
        title: "Error",
        description: "Failed to send message. Please try again or contact us directly via WhatsApp.",
        variant: "destructive"
      });
    }
    
    setIsSubmitting(false);
  };

  const bookingOptions = [
    {
      id: "general" as const,
      title: "General Inquiry",
      description: "Questions about our programs",
      icon: MessageSquare,
      color: "emerald"
    },
    {
      id: "private-lessons" as const,
      title: "Private Lessons",
      description: "1-on-1 with Tino Chibi",
      icon: GraduationCap,
      color: "blue"
    },
    {
      id: "school-seminar" as const,
      title: "School Seminar",
      description: "Book for your school",
      icon: Users,
      color: "purple"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900/10 via-background to-teal-900/5 text-foreground overflow-hidden">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12 relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        </div>
        
        <h1 className={`text-4xl md:text-6xl font-bold text-foreground mb-2 relative z-10 ${animate ? "animate-fadeIn" : "opacity-0"}`}>
          Get in 
          <span className="relative ml-3">
            Touch
            <span className="absolute -top-6 -right-8 text-2xl animate-float text-emerald-500">
              <Sparkles className="h-8 w-8" />
            </span>
          </span>
        </h1>
        
        <p className={`text-xl mb-8 text-muted-foreground max-w-2xl ${animate ? "animate-fadeIn [animation-delay:200ms]" : "opacity-0"}`}>
          Have questions about our A-Level Computer Science programs? Book private lessons or seminars with Tino Chibi!
        </p>

        {/* Private Lessons & Seminars Promo Section */}
        <div className={`mb-12 ${animate ? "animate-fadeIn [animation-delay:300ms]" : "opacity-0"}`}>
          <Card className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 border-0 overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-xl animate-pulse" />
                    <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                      <GraduationCap className="w-12 h-12 md:w-16 md:h-16 text-white" />
                    </div>
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <Badge className="bg-yellow-400 text-yellow-900 mb-2">Now Available</Badge>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Private Lessons & School Seminars
                  </h2>
                  <p className="text-white/90 mb-4">
                    <span className="font-bold text-yellow-300">Tinodaishe M. Chibi</span> (CEO, Bluewave Technologies) 
                    is now available for personalized A Level Computer Science tutoring and school-wide seminars.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <div className="flex items-center gap-1 text-white/90 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                      <span>Exam Preparation</span>
                    </div>
                    <div className="flex items-center gap-1 text-white/90 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                      <span>Programming Mastery</span>
                    </div>
                    <div className="flex items-center gap-1 text-white/90 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                      <span>Career Guidance</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 ${animate ? "animate-fadeIn [animation-delay:400ms]" : "opacity-0"}`}>
          <Card className="bg-background/80 backdrop-blur-sm border-blue-200/50 hover:border-blue-400 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-blue-500/10">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-blue-700">Private Lessons</CardTitle>
                  <CardDescription>1-on-1 personalized tutoring</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Customized curriculum based on your needs
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Flexible scheduling (online/in-person)
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Past paper practice with detailed feedback
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Programming projects & code reviews
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-background/80 backdrop-blur-sm border-purple-200/50 hover:border-purple-400 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-purple-500/10">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-purple-700">School Seminars</CardTitle>
                  <CardDescription>Inspire your students</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Engaging presentations for Form 5 & 6
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Exam tips and success strategies
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Career guidance in tech industry
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Interactive Q&A sessions
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
          {/* Contact Form with booking type selection */}
          <Card className={`bg-background/80 backdrop-blur-sm border-emerald-200/50 shadow-lg ${animate ? "animate-fadeIn [animation-delay:500ms]" : "opacity-0"}`}>
            <CardHeader className="bg-gradient-to-r from-emerald-50/50 to-teal-50/50 rounded-t-lg">
              <CardTitle className="text-2xl text-emerald-700 flex items-center gap-2">
                <span>Book or Inquire</span>
                <Calendar className="h-5 w-5 text-emerald-500" />
              </CardTitle>
              <CardDescription>Select your inquiry type and fill in the details</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Booking Type Selection */}
              <div className="mb-6">
                <label className="text-sm font-medium text-foreground mb-3 block">What would you like?</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {bookingOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = bookingType === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setBookingType(option.id)}
                        className={`p-3 rounded-xl border-2 transition-all text-left ${
                          isSelected 
                            ? option.color === "emerald" 
                              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950"
                              : option.color === "blue"
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                                : "border-purple-500 bg-purple-50 dark:bg-purple-950"
                            : "border-border hover:border-muted-foreground/50"
                        }`}
                      >
                        <Icon className={`w-5 h-5 mb-1 ${
                          option.color === "emerald" ? "text-emerald-600" :
                          option.color === "blue" ? "text-blue-600" : "text-purple-600"
                        }`} />
                        <p className="font-medium text-sm">{option.title}</p>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-foreground text-sm font-medium">Name *</label>
                  <Input 
                    id="name" 
                    name="from_name"
                    placeholder="Your full name" 
                    className={`bg-background/50 backdrop-blur-sm border-emerald-200 transition-all focus:ring-2 focus:ring-emerald-400/25 ${errors.name ? 'border-red-500' : ''}`}
                    maxLength={100}
                    required
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-foreground text-sm font-medium">Email *</label>
                    <Input 
                      id="email" 
                      name="from_email"
                      type="email" 
                      placeholder="your@email.com" 
                      className={`bg-background/50 backdrop-blur-sm border-emerald-200 transition-all focus:ring-2 focus:ring-emerald-400/25 ${errors.email ? 'border-red-500' : ''}`}
                      maxLength={255}
                      required
                    />
                    {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-foreground text-sm font-medium">Phone (optional)</label>
                    <Input 
                      id="phone" 
                      name="phone"
                      type="tel" 
                      placeholder="+263 7X XXX XXXX" 
                      className="bg-background/50 backdrop-blur-sm border-emerald-200 transition-all focus:ring-2 focus:ring-emerald-400/25"
                      maxLength={20}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-foreground text-sm font-medium">
                    {bookingType === "private-lessons" 
                      ? "Tell us about your learning goals *" 
                      : bookingType === "school-seminar"
                        ? "School details & preferred dates *"
                        : "Message *"}
                  </label>
                  <Textarea 
                    id="message" 
                    name="message"
                    placeholder={
                      bookingType === "private-lessons" 
                        ? "E.g., I'm a Form 6 student preparing for November exams. I need help with programming and algorithms..." 
                        : bookingType === "school-seminar"
                          ? "E.g., School name, number of students, preferred dates, topics of interest..."
                          : "Your message..."
                    }
                    className={`min-h-[120px] bg-background/50 backdrop-blur-sm border-emerald-200 transition-all focus:ring-2 focus:ring-emerald-400/25 ${errors.message ? 'border-red-500' : ''}`}
                    maxLength={2000}
                    required
                  />
                  {errors.message && <p className="text-xs text-red-500">{errors.message}</p>}
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 relative overflow-hidden group"
                  disabled={isSubmitting}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? "Sending..." : bookingType !== "general" ? "Submit Booking Request" : "Send Message"}
                    <Send className={`h-4 w-4 transition-transform ${!isSubmitting && "group-hover:translate-x-1"}`} />
                  </span>
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className={`bg-background/80 backdrop-blur-sm border-emerald-200/50 shadow-lg hover:shadow-xl transition-all ${animate ? "animate-fadeIn [animation-delay:600ms]" : "opacity-0"}`}>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4 text-foreground">
                  <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-600">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <a 
                      href="mailto:tinodaishemchibi@gmail.com" 
                      className="hover:text-emerald-600 transition-colors relative group"
                    >
                      tinodaishemchibi@gmail.com
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full"></span>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`bg-background/80 backdrop-blur-sm border-emerald-200/50 shadow-lg hover:shadow-xl transition-all ${animate ? "animate-fadeIn [animation-delay:700ms]" : "opacity-0"}`}>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4 text-foreground">
                  <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-600">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <a 
                      href="tel:+263781081816" 
                      className="hover:text-emerald-600 transition-colors relative group"
                    >
                      +263 78 108 1816
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full"></span>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`bg-background/80 backdrop-blur-sm border-green-200/50 shadow-lg hover:shadow-xl transition-all ${animate ? "animate-fadeIn [animation-delay:800ms]" : "opacity-0"}`}>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4 text-foreground">
                  <div className="p-3 rounded-full bg-green-500/10 text-green-600">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">WhatsApp (Fastest Response)</h3>
                    <a 
                      href="https://wa.me/263718176525" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="hover:text-green-600 transition-colors relative group"
                    >
                      +263 71 817 6525
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 transition-all group-hover:w-full"></span>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`bg-background/80 backdrop-blur-sm border-emerald-200/50 shadow-lg hover:shadow-xl transition-all ${animate ? "animate-fadeIn [animation-delay:900ms]" : "opacity-0"}`}>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4 text-foreground">
                  <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-600">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Location</h3>
                    <a 
                      href="https://maps.app.goo.gl/yMY8dqBXFpkc5ALB6" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-emerald-600 transition-colors relative group"
                    >
                      View on Google Maps
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full"></span>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp Group CTA */}
            <Card className={`bg-gradient-to-r from-green-600 to-emerald-600 border-0 ${animate ? "animate-fadeIn [animation-delay:1000ms]" : "opacity-0"}`}>
              <CardContent className="pt-6 pb-6">
                <div className="text-center text-white">
                  <h3 className="font-bold text-lg mb-2">Join Our WhatsApp Community</h3>
                  <p className="text-white/80 text-sm mb-4">Get study tips, past papers, and connect with other students</p>
                  <Button
                    onClick={() => window.open('https://chat.whatsapp.com/Jqi8HmLBRbF3g5GAMXbClh?mode=hqrt2', '_blank')}
                    className="bg-white text-green-700 hover:bg-yellow-300 font-semibold"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Join CompSci Group
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-muted-foreground">
          <p className="text-sm">© 2026 Bluewave Technologies. All rights reserved.</p>
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
