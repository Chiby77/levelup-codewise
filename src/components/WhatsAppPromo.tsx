import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Users, BookOpen, Trophy, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export const WhatsAppPromo = () => {
  const handleJoinGroup = () => {
    window.open('https://chat.whatsapp.com/Jqi8HmLBRbF3g5GAMXbClh?mode=hqrt2', '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* Important Notice */}
      <Card className="bg-gradient-to-r from-amber-500/10 via-background to-orange-500/10 border-amber-400/30">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-500/20 rounded-lg flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-700 mb-1">Important Notice</h3>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Tinodaishe M. Chibi</strong> is no longer in the A Level CS Experts WhatsApp group. 
                Join the <strong className="text-emerald-600">CompSci Group</strong> below - that's where he is!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Promo Card */}
      <Card className="bg-gradient-to-br from-emerald-500/10 via-background to-teal-600/10 border-emerald-500/20 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <MessageCircle className="h-6 w-6 text-emerald-500" />
            </div>
            Join the CompSci Group!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Connect with fellow CS students, get instant help from Tinodaishe M. Chibi, share resources, and stay updated with the latest exam tips!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800">
              <Users className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="font-medium text-emerald-700 dark:text-emerald-300">Study Together</p>
                <p className="text-xs text-muted-foreground">Collaborative learning</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-100 dark:border-teal-800">
              <BookOpen className="h-5 w-5 text-teal-500" />
              <div>
                <p className="font-medium text-teal-700 dark:text-teal-300">Free Resources</p>
                <p className="text-xs text-muted-foreground">Exclusive materials</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
              <Trophy className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium text-green-700 dark:text-green-300">Exam Tips</p>
                <p className="text-xs text-muted-foreground">Success strategies</p>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleJoinGroup}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-6 text-lg"
            size="lg"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Join CompSci Group Now
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Free to join • Active community • Expert guidance from the founder
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};
