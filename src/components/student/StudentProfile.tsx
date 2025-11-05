import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { 
  TrendingUp, 
  Award, 
  Calendar, 
  Clock,
  Target,
  BarChart3,
  Trophy,
  CheckCircle2
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Submission {
  id: string;
  exam_id: string;
  submitted_at: string;
  total_score: number;
  max_score: number;
  graded: boolean;
  time_taken_minutes: number;
  exams: {
    title: string;
    subject: string;
    difficulty_level?: string;
  };
}

interface PerformanceData {
  totalExams: number;
  averageScore: number;
  highestScore: number;
  passRate: number;
  classAverage?: number;
}

export const StudentProfile = ({ studentEmail }: { studentEmail: string }) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    totalExams: 0,
    averageScore: 0,
    highestScore: 0,
    passRate: 0,
  });

  useEffect(() => {
    fetchSubmissions();
  }, [studentEmail]);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('student_submissions')
        .select('*, exams(title, subject, difficulty_level)')
        .eq('student_email', studentEmail)
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      const submissions = data || [];
      setSubmissions(submissions);
      calculatePerformanceData(submissions);

      // Fetch class average
      const { data: allSubmissions } = await supabase
        .from('student_submissions')
        .select('total_score, max_score')
        .eq('graded', true);

      if (allSubmissions && allSubmissions.length > 0) {
        const classAvg = allSubmissions
          .filter(s => s.max_score && s.max_score > 0)
          .reduce((acc, s) => acc + ((s.total_score || 0) / s.max_score) * 100, 0) / allSubmissions.length;
        
        setPerformanceData(prev => ({ ...prev, classAverage: classAvg }));
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePerformanceData = (submissions: Submission[]) => {
    const gradedSubmissions = submissions.filter(s => s.graded && s.max_score && s.max_score > 0);
    
    if (gradedSubmissions.length === 0) {
      return;
    }

    const scores = gradedSubmissions.map(s => ((s.total_score || 0) / s.max_score) * 100);
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const highestScore = Math.max(...scores);
    const passRate = (scores.filter(s => s >= 50).length / scores.length) * 100;

    setPerformanceData({
      totalExams: gradedSubmissions.length,
      averageScore,
      highestScore,
      passRate,
    });
  };

  const getScoreTrend = () => {
    const gradedSubmissions = submissions
      .filter(s => s.graded && s.max_score && s.max_score > 0)
      .reverse();

    return gradedSubmissions.map((s, index) => ({
      exam: `Exam ${index + 1}`,
      score: Math.round(((s.total_score || 0) / s.max_score) * 100),
      date: new Date(s.submitted_at).toLocaleDateString(),
    }));
  };

  const getSubjectPerformance = () => {
    const subjectScores: Record<string, { total: number; count: number }> = {};

    submissions
      .filter(s => s.graded && s.max_score && s.max_score > 0)
      .forEach(s => {
        const subject = s.exams.subject || 'Unknown';
        const score = ((s.total_score || 0) / s.max_score) * 100;
        
        if (!subjectScores[subject]) {
          subjectScores[subject] = { total: 0, count: 0 };
        }
        subjectScores[subject].total += score;
        subjectScores[subject].count += 1;
      });

    return Object.entries(subjectScores).map(([subject, data]) => ({
      subject,
      average: Math.round(data.total / data.count),
    }));
  };

  const getDifficultyBreakdown = () => {
    const difficultyStats: Record<string, { passed: number; total: number }> = {
      easy: { passed: 0, total: 0 },
      medium: { passed: 0, total: 0 },
      hard: { passed: 0, total: 0 },
    };

    submissions
      .filter(s => s.graded && s.max_score && s.max_score > 0)
      .forEach(s => {
        const difficulty = s.exams.difficulty_level || 'medium';
        const score = ((s.total_score || 0) / s.max_score) * 100;
        
        if (difficultyStats[difficulty]) {
          difficultyStats[difficulty].total += 1;
          if (score >= 50) {
            difficultyStats[difficulty].passed += 1;
          }
        }
      });

    return Object.entries(difficultyStats)
      .filter(([_, data]) => data.total > 0)
      .map(([difficulty, data]) => ({
        name: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
        value: Math.round((data.passed / data.total) * 100),
      }));
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (percentage >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (percentage >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p>Loading profile...</p>
      </div>
    );
  }

  const scoreTrend = getScoreTrend();
  const subjectPerformance = getSubjectPerformance();
  const difficultyBreakdown = getDifficultyBreakdown();

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceData.totalExams}</div>
            <p className="text-xs text-muted-foreground">Completed & Graded</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceData.averageScore.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Class Avg: {performanceData.classAverage?.toFixed(1) || 'N/A'}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceData.highestScore.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Personal Best</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceData.passRate.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">Exams Passed (≥50%)</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <Tabs defaultValue="progress" className="space-y-4">
        <TabsList>
          <TabsTrigger value="progress">Progress Trend</TabsTrigger>
          <TabsTrigger value="subjects">Subject Performance</TabsTrigger>
          <TabsTrigger value="difficulty">Difficulty Breakdown</TabsTrigger>
          <TabsTrigger value="history">Submission History</TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Score Progression</CardTitle>
              <CardDescription>Your performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              {scoreTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={scoreTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="exam" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      name="Your Score (%)"
                    />
                    {performanceData.classAverage && (
                      <Line 
                        type="monotone" 
                        dataKey={() => performanceData.classAverage}
                        stroke="hsl(var(--muted-foreground))" 
                        strokeDasharray="5 5"
                        name="Class Average"
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-muted-foreground py-8">No exam data yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance by Subject</CardTitle>
              <CardDescription>Average scores across different subjects</CardDescription>
            </CardHeader>
            <CardContent>
              {subjectPerformance.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={subjectPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="average" fill="hsl(var(--primary))" name="Average Score (%)" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-muted-foreground py-8">No subject data yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="difficulty" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pass Rate by Difficulty</CardTitle>
              <CardDescription>Success rate across exam difficulty levels</CardDescription>
            </CardHeader>
            <CardContent>
              {difficultyBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={difficultyBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {difficultyBreakdown.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-muted-foreground py-8">No difficulty data yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Submission History</CardTitle>
              <CardDescription>All your exam attempts and scores</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {submissions.map((submission) => {
                    const percentage = submission.graded && submission.max_score > 0
                      ? ((submission.total_score || 0) / submission.max_score) * 100
                      : 0;

                    return (
                      <Card key={submission.id} className="border">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <CardTitle className="text-base">
                                {submission.exams.title}
                              </CardTitle>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {new Date(submission.submitted_at).toLocaleDateString()}
                                <Clock className="h-3 w-3 ml-2" />
                                {submission.time_taken_minutes} mins
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              {submission.graded ? (
                                <>
                                  <Badge className={getGradeColor(percentage)}>
                                    {submission.total_score}/{submission.max_score}
                                  </Badge>
                                  <span className="text-xs font-semibold">
                                    {percentage.toFixed(1)}%
                                  </span>
                                </>
                              ) : (
                                <Badge variant="outline">Pending</Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          {submission.graded && submission.max_score > 0 && (
                            <div className="space-y-2">
                              <Progress value={percentage} className="h-2" />
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">
                                  Subject: {submission.exams.subject}
                                </span>
                                {submission.exams.difficulty_level && (
                                  <Badge variant="secondary" className="text-xs">
                                    {submission.exams.difficulty_level}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};