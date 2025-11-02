import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Users, BookOpen, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export const WhatsAppPromo = () => {
  const handleJoinGroup = () => {
    window.open('https://chat.whatsapp.com/Jqi8HmLBRbF3g5GAMXbClh?mode=wwt', '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-green-500/10 via-background to-green-600/10 border-green-500/20 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <MessageCircle className="h-6 w-6 text-green-500" />
            </div>
            Join Bluewave Academy WhatsApp Community!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Connect with fellow CS students, get instant help, share resources, and stay updated with the latest exam tips!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
              <Users className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">Study Together</p>
                <p className="text-xs text-muted-foreground">Collaborative learning</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
              <BookOpen className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">Free Resources</p>
                <p className="text-xs text-muted-foreground">Exclusive materials</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
              <Trophy className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">Exam Tips</p>
                <p className="text-xs text-muted-foreground">Success strategies</p>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleJoinGroup}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6 text-lg"
            size="lg"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Join WhatsApp Group Now
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Free to join • Active community • Expert guidance
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};
