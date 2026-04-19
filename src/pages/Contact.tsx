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
  CheckCircle2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().max(20).optional(),
  bookingType: z.enum(["general", "private-lessons", "school-seminar"]),
  message: z.string().trim().min(1, "Message is required").max(2000),
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
      name: formData.get("from_name") as string,
      email: formData.get("from_email") as string,
      phone: (formData.get("phone") as string) || undefined,
      bookingType: bookingType,
      message: formData.get("message") as string,
    };
    const result = contactSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as keyof ContactFormData] = err.message;
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
      toast({ title: "Validation Error", description: "Please check your form inputs and try again.", variant: "destructive" });
      return;
    }
    const messagePrefix =
      bookingType === "private-lessons"
        ? "[PRIVATE LESSONS INQUIRY]\n"
        : bookingType === "school-seminar"
        ? "[SCHOOL SEMINAR BOOKING]\n"
        : "";
    const fullMessage = `${messagePrefix}${validatedData.phone ? `Phone: ${validatedData.phone}\n\n` : ""}${validatedData.message}`;
    try {
      const { data, error } = await supabase.functions.invoke("send-contact-email", {
        body: { name: validatedData.name, email: validatedData.email, message: fullMessage },
      });
      if (error) throw new Error(error.message);
      if (data?.success) {
        toast({
          title: "Message Sent Successfully",
          description:
            bookingType !== "general"
              ? "Thank you for your booking inquiry. Tino will get back to you within 24 hours."
              : "Thank you for your message. We'll get back to you soon.",
        });
        form.reset();
        setBookingType("general");
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      console.error("Contact form error");
      toast({
        title: "Error",
        description: "Failed to send message. Please try again or contact us directly via WhatsApp.",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  const bookingOptions = [
    { id: "general" as const, title: "General Inquiry", description: "Questions about our programs", icon: MessageSquare },
    { id: "private-lessons" as const, title: "Private Lessons", description: "1-on-1 with Tino Chibi", icon: GraduationCap },
    { id: "school-seminar" as const, title: "School Seminar", description: "Book for your school", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 text-foreground overflow-hidden">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <h1 className={`text-4xl md:text-6xl font-bold text-foreground mb-2 relative z-10 ${animate ? "animate-fadeIn" : "opacity-0"}`}>
          Get in
          <span className="relative ml-3">
            Touch
            <span className="absolute -top-6 -right-8 text-primary">
              <Sparkles className="h-8 w-8" />
            </span>
          </span>
        </h1>

        <p className={`text-xl mb-8 text-muted-foreground max-w-2xl ${animate ? "animate-fadeIn [animation-delay:200ms]" : "opacity-0"}`}>
          Have questions about our A-Level Computer Science programs? Book private lessons or seminars with Tino Chibi.
        </p>

        <div className={`mb-12 ${animate ? "animate-fadeIn [animation-delay:300ms]" : "opacity-0"}`}>
          <Card className="bg-gradient-hero border-0 overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary-foreground/20 rounded-full blur-xl animate-pulse" />
                    <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                      <GraduationCap className="w-12 h-12 md:w-16 md:h-16 text-primary-foreground" />
                    </div>
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <Badge className="bg-primary-foreground text-primary mb-2">Now Available</Badge>
                  <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
                    Private Lessons & School Seminars
                  </h2>
                  <p className="text-primary-foreground/90 mb-4">
                    <span className="font-bold">Tinodaishe M. Chibi</span> (CEO, Bluewave Technologies) is now available for personalized
                    A Level Computer Science tutoring and school-wide seminars.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    {["Exam Preparation", "Programming Mastery", "Career Guidance"].map((item) => (
                      <div key={item} className="flex items-center gap-1 text-primary-foreground/90 text-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 ${animate ? "animate-fadeIn [animation-delay:400ms]" : "opacity-0"}`}>
          <Card className="bg-card/80 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all hover:shadow-elegant">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-primary">Private Lessons</CardTitle>
                  <CardDescription>1-on-1 personalized tutoring</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {[
                  "Customized curriculum based on your needs",
                  "Flexible scheduling (online/in-person)",
                  "Past paper practice with detailed feedback",
                  "Programming projects & code reviews",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-primary" />
                    {t}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all hover:shadow-elegant">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-primary">School Seminars</CardTitle>
                  <CardDescription>Inspire your students</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {[
                  "Engaging presentations for Form 5 & 6",
                  "Exam tips and success strategies",
                  "Career guidance in tech industry",
                  "Interactive Q&A sessions",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-primary" />
                    {t}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
          <Card className={`bg-card/80 backdrop-blur-sm border-primary/20 shadow-elegant ${animate ? "animate-fadeIn [animation-delay:500ms]" : "opacity-0"}`}>
            <CardHeader className="bg-primary/5 rounded-t-lg">
              <CardTitle className="text-2xl text-primary flex items-center gap-2">
                <span>Book or Inquire</span>
                <Calendar className="h-5 w-5 text-primary" />
              </CardTitle>
              <CardDescription>Select your inquiry type and fill in the details</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
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
                          isSelected ? "border-primary bg-primary/10" : "border-border hover:border-muted-foreground/50"
                        }`}
                      >
                        <Icon className="w-5 h-5 mb-1 text-primary" />
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
                    className={`bg-background/50 border-primary/30 focus:ring-2 focus:ring-primary/25 ${errors.name ? "border-destructive" : ""}`}
                    maxLength={100}
                    required
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-foreground text-sm font-medium">Email *</label>
                    <Input
                      id="email"
                      name="from_email"
                      type="email"
                      placeholder="your@email.com"
                      className={`bg-background/50 border-primary/30 focus:ring-2 focus:ring-primary/25 ${errors.email ? "border-destructive" : ""}`}
                      maxLength={255}
                      required
                    />
                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-foreground text-sm font-medium">Phone (optional)</label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+263 7X XXX XXXX"
                      className="bg-background/50 border-primary/30 focus:ring-2 focus:ring-primary/25"
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
                    className={`min-h-[120px] bg-background/50 border-primary/30 focus:ring-2 focus:ring-primary/25 ${errors.message ? "border-destructive" : ""}`}
                    maxLength={2000}
                    required
                  />
                  {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-hero hover:opacity-90 relative overflow-hidden group"
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

          <div className="space-y-6">
            {[
              { icon: Mail, title: "Email", value: "tinodaishemchibi@gmail.com", href: "mailto:tinodaishemchibi@gmail.com" },
              { icon: Phone, title: "Phone", value: "+263 78 108 1816", href: "tel:+263781081816" },
              { icon: MessageSquare, title: "WhatsApp (Fastest Response)", value: "+263 71 817 6525", href: "https://wa.me/263718176525" },
              { icon: MapPin, title: "Location", value: "View on Google Maps", href: "https://maps.app.goo.gl/yMY8dqBXFpkc5ALB6" },
            ].map(({ icon: Icon, title, value, href }, i) => (
              <Card
                key={title}
                className={`bg-card/80 backdrop-blur-sm border-primary/20 shadow-elegant hover:shadow-glow transition-all ${
                  animate ? "animate-fadeIn" : "opacity-0"
                }`}
                style={{ animationDelay: `${600 + i * 100}ms` }}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4 text-foreground">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{title}</h3>
                      <a
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="hover:text-primary transition-colors"
                      >
                        {value}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className={`bg-gradient-hero border-0 ${animate ? "animate-fadeIn [animation-delay:1000ms]" : "opacity-0"}`}>
              <CardContent className="pt-6 pb-6">
                <div className="text-center text-primary-foreground">
                  <h3 className="font-bold text-lg mb-2">Join Our WhatsApp Community</h3>
                  <p className="text-primary-foreground/80 text-sm mb-4">Get study tips, past papers, and connect with other students</p>
                  <Button
                    onClick={() => window.open("https://chat.whatsapp.com/Jqi8HmLBRbF3g5GAMXbClh?mode=hqrt2", "_blank")}
                    className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold"
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Join CompSci Group
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-16 text-center text-muted-foreground">
          <p className="text-sm">© 2026 Bluewave Academy · Powered by Bluewave Technologies.</p>
        </div>
      </div>

      <style>{`
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default Contact;
