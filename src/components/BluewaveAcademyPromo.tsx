import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MessageCircle, Users, BookOpen, Sparkles, GraduationCap, Star, Zap, Trophy, Award } from 'lucide-react';

export const BluewaveAcademyPromo = () => {
  const handleJoinGroup = () => {
    window.open('https://chat.whatsapp.com/Jqi8HmLBRbF3g5GAMXbClh?mode=hqrt2', '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="my-16"
    >
      <div className="relative overflow-hidden rounded-3xl">
        {/* Animated gradient background - celebration theme */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-600 animate-gradientShift bg-[length:200%_200%]" />
        
        {/* Glowing orbs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-300/20 rounded-full blur-3xl animate-floatLarge" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl animate-pulse" />
        
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="relative z-10 px-6 py-12 md:px-12 md:py-16">
          {/* Results Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-yellow-400/90 text-emerald-900 text-sm font-bold border-2 border-yellow-300 shadow-lg shadow-yellow-400/30">
              <Trophy className="w-5 h-5" />
              2025 ZIMSEC: 300+ A's | 98.5% Pass Rate
              <Trophy className="w-5 h-5" />
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-3xl md:text-5xl lg:text-6xl font-black text-center text-white mb-4"
          >
            Join <span className="text-yellow-300">CompSci Group</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl md:text-2xl text-center text-white/90 mb-3 font-medium"
          >
            Whether you're Form 5 or Form 6 — This is YOUR Place!
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-base md:text-lg text-center text-white/80 mb-10 max-w-2xl mx-auto"
          >
            Led by <span className="font-semibold text-yellow-300">Tino Chibi</span> — Get exclusive study materials, 
            exam tips, and connect with Zimbabwe's most successful A Level Computer Science community.
          </motion.p>

          {/* Benefits grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
          >
            {[
              { icon: Users, label: "Active Community", desc: "2000+ Students" },
              { icon: BookOpen, label: "Free Resources", desc: "350+ Materials" },
              { icon: Award, label: "Proven Results", desc: "98.5% Pass Rate" },
              { icon: Zap, label: "Exam Tips", desc: "Insider Secrets" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30 hover:bg-white/25 transition-all duration-300 hover:scale-105"
              >
                <item.icon className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
                <p className="text-white font-semibold text-sm">{item.label}</p>
                <p className="text-white/80 text-xs">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="flex flex-col items-center gap-4"
          >
            <Button
              onClick={handleJoinGroup}
              size="lg"
              className="bg-white text-emerald-600 hover:bg-yellow-300 hover:text-emerald-700 font-bold text-lg px-10 py-6 rounded-full shadow-2xl hover:shadow-yellow-300/50 transition-all duration-300 hover:scale-110 group"
            >
              <MessageCircle className="w-6 h-6 mr-3 group-hover:animate-bounce" />
              Join CompSci Group Now
              <Star className="w-5 h-5 ml-3 text-yellow-500 group-hover:animate-spin" />
            </Button>
            
            <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
              <span className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-md">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </span>
              <span>+2,000 students already joined!</span>
            </div>
          </motion.div>

          {/* Floating elements */}
          <div className="absolute top-10 left-10 text-4xl animate-float opacity-50">🏆</div>
          <div className="absolute top-20 right-16 text-3xl animate-floatLarge opacity-50">🎓</div>
          <div className="absolute bottom-16 left-20 text-3xl animate-float opacity-50">💡</div>
          <div className="absolute bottom-10 right-10 text-4xl animate-floatLarge opacity-50">⭐</div>
        </div>
      </div>
    </motion.div>
  );
};