import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Star, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface LeaderboardEntry {
  student_name: string;
  student_email: string;
  total_exams: number;
  average_score: number;
  highest_score: number;
  total_points: number;
}

export const StudentLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data: submissions, error } = await supabase
        .from('student_submissions')
        .select('student_name, student_email, total_score, max_score')
        .eq('graded', true)
        .gt('max_score', 0);

      if (error) throw error;

      // Group by student and calculate stats
      const studentStats = new Map<string, {
        name: string;
        email: string;
        scores: number[];
        maxScores: number[];
      }>();

      submissions?.forEach(sub => {
        const key = sub.student_email || sub.student_name;
        if (!studentStats.has(key)) {
          studentStats.set(key, {
            name: sub.student_name,
            email: sub.student_email || '',
            scores: [],
            maxScores: []
          });
        }
        const stats = studentStats.get(key)!;
        stats.scores.push(sub.total_score || 0);
        stats.maxScores.push(sub.max_score || 0);
      });

      // Calculate leaderboard entries
      const entries: LeaderboardEntry[] = [];
      studentStats.forEach((stats, key) => {
        const totalExams = stats.scores.length;
        const totalPoints = stats.scores.reduce((a, b) => a + b, 0);
        const totalMaxPoints = stats.maxScores.reduce((a, b) => a + b, 0);
        const averageScore = totalMaxPoints > 0 
          ? (totalPoints / totalMaxPoints) * 100 
          : 0;
        const highestScore = Math.max(
          ...stats.scores.map((score, i) => 
            stats.maxScores[i] > 0 ? (score / stats.maxScores[i]) * 100 : 0
          )
        );

        entries.push({
          student_name: stats.name,
          student_email: stats.email,
          total_exams: totalExams,
          average_score: averageScore,
          highest_score: highestScore,
          total_points: totalPoints
        });
      });

      // Sort by average score (descending)
      entries.sort((a, b) => b.average_score - a.average_score);

      setLeaderboard(entries);
    } catch (error: any) {
      console.error('Error fetching leaderboard:', error);
      toast.error('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <Star className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-yellow-500">🥇 1st</Badge>;
    if (rank === 2) return <Badge className="bg-gray-400">🥈 2nd</Badge>;
    if (rank === 3) return <Badge className="bg-amber-600">🥉 3rd</Badge>;
    return <Badge variant="outline">#{rank}</Badge>;
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-blue-600 dark:text-blue-400';
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading leaderboard...</p>
        </CardContent>
      </Card>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Student Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No graded submissions yet. The leaderboard will appear once students complete exams.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <TrendingUp className="h-6 w-6 text-primary animate-pulse" />
          Student Leaderboard - Top Performers
        </CardTitle>
        <p className="text-sm text-muted-foreground">Ranked by average score across all exams</p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {leaderboard.map((entry, index) => (
            <motion.div
              key={entry.student_email || entry.student_name}
              className={`p-4 hover:bg-accent/50 transition-colors ${
                index < 3 ? 'bg-gradient-to-r from-primary/5 to-transparent' : ''
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex items-center gap-4">
                {/* Rank Icon */}
                <div className="flex-shrink-0 w-12 text-center">
                  {getRankIcon(index + 1)}
                  {getRankBadge(index + 1)}
                </div>

                {/* Student Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">
                    {entry.student_name}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {entry.student_email}
                  </p>
                </div>

                {/* Stats */}
                <div className="hidden sm:flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <p className="font-semibold text-lg">{entry.total_exams}</p>
                    <p className="text-muted-foreground text-xs">Exams</p>
                  </div>
                  
                  <div className="text-center">
                    <p className={`font-bold text-xl ${getPerformanceColor(entry.average_score)}`}>
                      {entry.average_score.toFixed(1)}%
                    </p>
                    <p className="text-muted-foreground text-xs">Avg Score</p>
                  </div>

                  <div className="text-center">
                    <p className="font-semibold text-lg text-primary">
                      {entry.highest_score.toFixed(1)}%
                    </p>
                    <p className="text-muted-foreground text-xs">Best Score</p>
                  </div>

                  <div className="text-center">
                    <p className="font-semibold text-lg text-secondary">
                      {entry.total_points.toFixed(0)}
                    </p>
                    <p className="text-muted-foreground text-xs">Total Points</p>
                  </div>
                </div>

                {/* Mobile Stats */}
                <div className="sm:hidden text-right">
                  <p className={`font-bold text-xl ${getPerformanceColor(entry.average_score)}`}>
                    {entry.average_score.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {entry.total_exams} exams
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};