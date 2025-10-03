import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, FileText, TrendingUp, Users, Play, Edit, Trash2, Copy } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnimatedExamCardProps {
  exam: {
    id: string;
    title: string;
    description: string;
    duration_minutes: number;
    total_marks: number;
    status: string;
    subject: string;
  };
  questionCount?: number;
  submissionCount?: number;
  onStart?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  index: number;
}

export const AnimatedExamCard: React.FC<AnimatedExamCardProps> = ({
  exam,
  questionCount = 0,
  submissionCount = 0,
  onStart,
  onEdit,
  onDelete,
  onDuplicate,
  index
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="h-full hover:shadow-xl transition-all duration-300 border-primary/20 hover:border-primary/40 bg-gradient-to-br from-card via-card to-primary/5 relative overflow-hidden group">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardHeader className="relative">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                {exam.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {exam.description || 'No description available'}
              </p>
            </div>
            <Badge 
              variant={exam.status === 'active' ? 'default' : 'secondary'}
              className="ml-2 animate-pulse"
            >
              {exam.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <motion.div 
              className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Clock className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="text-sm font-semibold">{exam.duration_minutes} min</p>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center gap-2 p-3 rounded-lg bg-accent/5 border border-accent/10"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <TrendingUp className="h-4 w-4 text-accent" />
              <div>
                <p className="text-xs text-muted-foreground">Total Marks</p>
                <p className="text-sm font-semibold">{exam.total_marks}</p>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center gap-2 p-3 rounded-lg bg-secondary/5 border border-secondary/10"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FileText className="h-4 w-4 text-secondary" />
              <div>
                <p className="text-xs text-muted-foreground">Questions</p>
                <p className="text-sm font-semibold">{questionCount}</p>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Users className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Submissions</p>
                <p className="text-sm font-semibold">{submissionCount}</p>
              </div>
            </motion.div>
          </div>

          {/* Subject Badge */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              📚 {exam.subject}
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            {onStart && (
              <Button 
                onClick={onStart}
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all hover:scale-105"
              >
                <Play className="h-4 w-4 mr-2" />
                Start
              </Button>
            )}
            {onEdit && (
              <Button 
                onClick={onEdit}
                variant="outline"
                size="icon"
                className="hover:bg-primary/10 hover:border-primary transition-all"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDuplicate && (
              <Button 
                onClick={onDuplicate}
                variant="outline"
                size="icon"
                className="hover:bg-accent/10 hover:border-accent transition-all"
              >
                <Copy className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button 
                onClick={onDelete}
                variant="outline"
                size="icon"
                className="hover:bg-destructive/10 hover:border-destructive hover:text-destructive transition-all"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};