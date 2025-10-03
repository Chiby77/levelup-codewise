import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { FileText, Users, CheckCircle, Clock, TrendingUp, Award } from 'lucide-react';

interface EnhancedExamStatsProps {
  totalExams: number;
  activeExams: number;
  totalSubmissions: number;
  totalQuestions: number;
  averageScore?: number;
  completionRate?: number;
}

export const EnhancedExamStats: React.FC<EnhancedExamStatsProps> = ({
  totalExams,
  activeExams,
  totalSubmissions,
  totalQuestions,
  averageScore = 0,
  completionRate = 0
}) => {
  const stats = [
    {
      title: 'Total Exams',
      value: totalExams,
      icon: FileText,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/10 to-cyan-500/10'
    },
    {
      title: 'Active Exams',
      value: activeExams,
      icon: Clock,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-500/10 to-emerald-500/10'
    },
    {
      title: 'Submissions',
      value: totalSubmissions,
      icon: Users,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-500/10 to-pink-500/10'
    },
    {
      title: 'Total Questions',
      value: totalQuestions,
      icon: CheckCircle,
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-500/10 to-red-500/10'
    },
    {
      title: 'Avg Score',
      value: `${averageScore.toFixed(1)}%`,
      icon: Award,
      gradient: 'from-yellow-500 to-amber-500',
      bgGradient: 'from-yellow-500/10 to-amber-500/10'
    },
    {
      title: 'Completion',
      value: `${completionRate.toFixed(1)}%`,
      icon: TrendingUp,
      gradient: 'from-indigo-500 to-violet-500',
      bgGradient: 'from-indigo-500/10 to-violet-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-primary/20">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50 group-hover:opacity-100 transition-opacity`} />
              
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <motion.div
                    className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </motion.div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {stat.title}
                  </p>
                  <motion.p 
                    className="text-3xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 200,
                      delay: index * 0.05 + 0.2 
                    }}
                  >
                    {stat.value}
                  </motion.p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};