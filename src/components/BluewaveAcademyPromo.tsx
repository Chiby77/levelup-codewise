import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageCircle, Users, BookOpen, Award, Zap, Trophy } from "lucide-react";

export const BluewaveAcademyPromo = () => {
  const handleJoinGroup = () => {
    window.open("https://chat.whatsapp.com/Jqi8HmLBRbF3g5GAMXbClh?mode=hqrt2", "_blank");
  };

  const benefits = [
    { icon: Users, label: "Active Community", desc: "2000+ Students" },
    { icon: BookOpen, label: "Free Resources", desc: "350+ Materials" },
    { icon: Award, label: "Proven Results", desc: "98.5% Pass Rate" },
    { icon: Zap, label: "Insider Tips", desc: "Weekly Drops" },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="my-16"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-hero shadow-elegant">
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }} />

        <div className="relative z-10 px-6 py-12 md:px-12 md:py-16">
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/15 backdrop-blur-sm text-white text-sm font-semibold border border-white/20">
              <Trophy className="w-4 h-4 text-sky-200" />
              ZIMSEC 2025 — 300+ A's, 98.5% Pass Rate
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-center text-white mb-3 tracking-tight">
            Join the <span className="bg-gradient-to-r from-sky-200 to-white bg-clip-text text-transparent">CompSci Group</span>
          </h2>

          <p className="text-lg md:text-xl text-center text-white/85 mb-2 font-medium">
            Form 5 or Form 6 — this is your place.
          </p>

          <p className="text-base text-center text-white/70 mb-10 max-w-2xl mx-auto">
            Led by <span className="font-semibold text-sky-200">Tino Chibi</span> — get exclusive study materials,
            exam tips, and connect with Zimbabwe's most successful A Level Computer Science community.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {benefits.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + index * 0.08, duration: 0.3 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/15 hover:bg-white/15 transition-colors"
              >
                <item.icon className="w-7 h-7 text-sky-200 mx-auto mb-2" />
                <p className="text-white font-semibold text-sm">{item.label}</p>
                <p className="text-white/65 text-xs">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-4">
            <Button
              onClick={handleJoinGroup}
              size="lg"
              className="bg-white text-primary hover:bg-sky-100 font-semibold text-base px-8 py-6 rounded-full shadow-xl transition-all duration-300 hover:scale-[1.03]"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Join CompSci Group Now
            </Button>
            <p className="text-white/60 text-xs">Free to join • Active daily • Run by Tino Chibi</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
