import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Users, BookOpen, Trophy, Info } from "lucide-react";
import { motion } from "framer-motion";

export const WhatsAppPromo = () => {
  const handleJoinGroup = () => {
    window.open("https://chat.whatsapp.com/Jqi8HmLBRbF3g5GAMXbClh?mode=hqrt2", "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* Notice */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
              <Info className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Where to find Tino Chibi</h3>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Tinodaishe M. Chibi</strong> is active in the
                <strong className="text-primary"> CompSci Group</strong> — join below to study and chat with him directly.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Promo */}
      <Card className="bg-card border-primary/20 shadow-elegant">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-2xl text-foreground">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            Join the CompSci Group
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-muted-foreground">
            Connect with fellow Bluewave Academy students, get instant help from Tinodaishe M. Chibi,
            share resources, and stay updated with the latest exam tips.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl border border-primary/10">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Study Together</p>
                <p className="text-xs text-muted-foreground">Collaborative learning</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl border border-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Free Resources</p>
                <p className="text-xs text-muted-foreground">Exclusive materials</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl border border-primary/10">
              <Trophy className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Exam Tips</p>
                <p className="text-xs text-muted-foreground">Success strategies</p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleJoinGroup}
            className="w-full bg-gradient-primary hover:opacity-95 text-primary-foreground font-semibold py-6 text-lg"
            size="lg"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Join CompSci Group Now
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Free to join · Active community · Expert guidance from the founder
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};
