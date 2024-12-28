import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Thank you for your message. We'll get back to you soon!",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-4xl font-bold text-foreground mb-8 animate-fadeIn">Contact Us</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="bg-background border-border">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-foreground">Name</label>
                  <Input id="name" placeholder="Your name" className="bg-background border-border" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-foreground">Email</label>
                  <Input id="email" type="email" placeholder="Your email" className="bg-background border-border" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-foreground">Message</label>
                  <Textarea 
                    id="message" 
                    placeholder="Your message" 
                    className="min-h-[150px] bg-background border-border"
                  />
                </div>
                <Button type="submit" className="w-full">Send Message</Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="bg-background border-border">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4 text-foreground">
                  <Mail className="h-6 w-6" />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p>contact@csexperts.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background border-border">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4 text-foreground">
                  <Phone className="h-6 w-6" />
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p>+263 77 123 4567</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background border-border">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4 text-foreground">
                  <MapPin className="h-6 w-6" />
                  <div>
                    <h3 className="font-semibold">Address</h3>
                    <p>123 Tech Street, Harare, Zimbabwe</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;