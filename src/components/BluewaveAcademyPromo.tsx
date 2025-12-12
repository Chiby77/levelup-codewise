import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Users, BookOpen, Trophy, GraduationCap, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const BluewaveAcademyPromo = () => {
  const handleJoinGroup = () => {
    window.open('https://chat.whatsapp.com/Jqi8HmLBRbF3g5GAMXbClh?mode=hqrt2', '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="py-12"
    >
      <Card className="bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-green-500/20 border-2 border-blue-500/30 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 overflow-hidden relative">
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-green-500/20 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <CardHeader className="pb-4 relative z-10">
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Star className="h-6 w-6 text-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
            <Sparkles className="h-8 w-8 text-blue-400" />
            <Star className="h-6 w-6 text-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
          </motion.div>
          
          <CardTitle className="flex flex-col items-center gap-3 text-center">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg">
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
            <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 bg-clip-text text-transparent">
              Join Bluewave Academy!
            </span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6 relative z-10">
          <div className="text-center space-y-2">
            <p className="text-xl font-semibold text-foreground">
              Whether you're in <span className="text-blue-400">Form 5</span> or <span className="text-purple-400">Form 6</span>
            </p>
            <p className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
              Bluewave Academy is THE PLACE TO BE! 🌊
            </p>
          </div>
          
          <p className="text-muted-foreground text-center text-lg">
            Led by <span className="font-bold text-primary">Tino Chibi</span>, get expert guidance, exclusive resources, and join a community of future tech leaders!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center gap-2 p-4 bg-background/50 rounded-xl border border-blue-500/20"
            >
              <Users className="h-8 w-8 text-blue-500" />
              <div className="text-center">
                <p className="font-bold text-foreground">Study Together</p>
                <p className="text-xs text-muted-foreground">Form 5 & 6 Students</p>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center gap-2 p-4 bg-background/50 rounded-xl border border-green-500/20"
            >
              <BookOpen className="h-8 w-8 text-green-500" />
              <div className="text-center">
                <p className="font-bold text-foreground">Free Resources</p>
                <p className="text-xs text-muted-foreground">Exclusive Materials</p>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center gap-2 p-4 bg-background/50 rounded-xl border border-purple-500/20"
            >
              <Trophy className="h-8 w-8 text-purple-500" />
              <div className="text-center">
                <p className="font-bold text-foreground">Exam Tips</p>
                <p className="text-xs text-muted-foreground">Success Strategies</p>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center gap-2 p-4 bg-background/50 rounded-xl border border-yellow-500/20"
            >
              <MessageCircle className="h-8 w-8 text-yellow-500" />
              <div className="text-center">
                <p className="font-bold text-foreground">24/7 Help</p>
                <p className="text-xs text-muted-foreground">Community Support</p>
              </div>
            </motion.div>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={handleJoinGroup}
              className="w-full bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 hover:from-green-500 hover:via-green-400 hover:to-emerald-500 text-white font-bold py-6 text-xl shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300"
              size="lg"
            >
              <MessageCircle className="h-6 w-6 mr-3 animate-bounce" />
              Join Bluewave Academy WhatsApp Now!
            </Button>
          </motion.div>

          <p className="text-sm text-center text-muted-foreground">
            🎓 Free to join • 📚 Active community • 🏆 Expert guidance by Tino Chibi
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};
