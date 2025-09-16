import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Clock, Award, Download, FileText, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ExamAnalyticsProps {
  examId: string;
}

interface AnalyticsData {
  totalSubmissions: number;
  averageScore: number;
  completionRate: number;
  averageTime: number;
  scoreDistribution: any[];
  questionPerformance: any[];
  submissionTimeline: any[];
  difficultyAnalysis: any[];
}

export const ExamAnalytics: React.FC<ExamAnalyticsProps> = ({ examId }) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all');
  const [viewType, setViewType] = useState('overview');

  useEffect(() => {
    fetchAnalytics();
  }, [examId, timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch exam submissions
      const { data: submissions, error: submissionsError } = await supabase
        .from('student_submissions')
        .select('*')
        .eq('exam_id', examId);

      if (submissionsError) throw submissionsError;

      // Fetch exam questions
      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('exam_id', examId);

      if (questionsError) throw questionsError;

      // Process analytics data
      const processedAnalytics = processAnalyticsData(submissions || [], questions || []);
      setAnalytics(processedAnalytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (submissions: any[], questions: any[]): AnalyticsData => {
    const totalSubmissions = submissions.length;
    const completedSubmissions = submissions.filter(s => s.score !== null);
    
    // Calculate averages
    const averageScore = completedSubmissions.length > 0 
      ? completedSubmissions.reduce((sum, s) => sum + (s.percentage || 0), 0) / completedSubmissions.length 
      : 0;
    
    const completionRate = (completedSubmissions.length / totalSubmissions) * 100;
    
    const averageTime = completedSubmissions.length > 0
      ? completedSubmissions.reduce((sum, s) => sum + (s.time_taken_minutes || 0), 0) / completedSubmissions.length
      : 0;

    // Score distribution
    const scoreRanges = [
      { range: '0-20%', count: 0, color: '#ef4444' },
      { range: '21-40%', count: 0, color: '#f97316' },
      { range: '41-60%', count: 0, color: '#eab308' },
      { range: '61-80%', count: 0, color: '#22c55e' },
      { range: '81-100%', count: 0, color: '#10b981' }
    ];

    completedSubmissions.forEach(submission => {
      const percentage = submission.percentage || 0;
      if (percentage <= 20) scoreRanges[0].count++;
      else if (percentage <= 40) scoreRanges[1].count++;
      else if (percentage <= 60) scoreRanges[2].count++;
      else if (percentage <= 80) scoreRanges[3].count++;
      else scoreRanges[4].count++;
    });

    // Question performance analysis
    const questionPerformance = questions.map(question => {
      const questionAnswers = completedSubmissions
        .map(s => s.detailed_grades?.[question.id])
        .filter(Boolean);
      
      const averageScore = questionAnswers.length > 0
        ? questionAnswers.reduce((sum, grade) => sum + grade.score, 0) / questionAnswers.length
        : 0;
      
      const maxScore = question.marks;
      const percentage = (averageScore / maxScore) * 100;

      return {
        questionNumber: question.order_number,
        questionText: question.question_text.substring(0, 50) + '...',
        averageScore,
        maxScore,
        percentage,
        difficulty: percentage > 80 ? 'Easy' : percentage > 60 ? 'Medium' : percentage > 40 ? 'Hard' : 'Very Hard'
      };
    });

    // Submission timeline
    const submissionTimeline = submissions.reduce((timeline: any[], submission) => {
      const date = new Date(submission.submitted_at).toDateString();
      const existing = timeline.find(item => item.date === date);
      if (existing) {
        existing.submissions++;
      } else {
        timeline.push({ date, submissions: 1 });
      }
      return timeline;
    }, []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Difficulty analysis
    const difficultyAnalysis = [
      { difficulty: 'Easy', count: questionPerformance.filter(q => q.difficulty === 'Easy').length },
      { difficulty: 'Medium', count: questionPerformance.filter(q => q.difficulty === 'Medium').length },
      { difficulty: 'Hard', count: questionPerformance.filter(q => q.difficulty === 'Hard').length },
      { difficulty: 'Very Hard', count: questionPerformance.filter(q => q.difficulty === 'Very Hard').length }
    ];

    return {
      totalSubmissions,
      averageScore,
      completionRate,
      averageTime,
      scoreDistribution: scoreRanges,
      questionPerformance,
      submissionTimeline,
      difficultyAnalysis
    };
  };

  const exportAnalytics = async () => {
    try {
      const csvContent = generateCSVReport();
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `exam-analytics-${examId}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Analytics report exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export analytics');
    }
  };

  const generateCSVReport = () => {
    if (!analytics) return '';
    
    let csv = 'Exam Analytics Report\n\n';
    csv += 'Overview\n';
    csv += `Total Submissions,${analytics.totalSubmissions}\n`;
    csv += `Average Score,${analytics.averageScore.toFixed(2)}%\n`;
    csv += `Completion Rate,${analytics.completionRate.toFixed(2)}%\n`;
    csv += `Average Time,${analytics.averageTime.toFixed(2)} minutes\n\n`;
    
    csv += 'Question Performance\n';
    csv += 'Question,Average Score,Max Score,Percentage,Difficulty\n';
    analytics.questionPerformance.forEach(q => {
      csv += `"${q.questionText}",${q.averageScore.toFixed(2)},${q.maxScore},${q.percentage.toFixed(2)}%,${q.difficulty}\n`;
    });
    
    return csv;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Exam Analytics</h2>
          <p className="text-muted-foreground">Comprehensive performance analysis</p>
        </div>
        <div className="flex gap-2">
          <Select value={viewType} onValueChange={setViewType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="detailed">Detailed</SelectItem>
              <SelectItem value="questions">Questions</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportAnalytics} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Submissions</p>
                <p className="text-2xl font-bold">{analytics.totalSubmissions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                <p className="text-2xl font-bold">{analytics.averageScore.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">{analytics.completionRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Avg. Time</p>
                <p className="text-2xl font-bold">{analytics.averageTime.toFixed(0)}m</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      {viewType === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Score Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Score Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.scoreDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Difficulty Analysis Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5" />
                Question Difficulty
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.difficultyAnalysis}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analytics.difficultyAnalysis.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#10b981', '#f59e0b', '#ef4444', '#7c2d12'][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Question Performance */}
      {(viewType === 'questions' || viewType === 'detailed') && (
        <Card>
          <CardHeader>
            <CardTitle>Question Performance Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.questionPerformance.map((question, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium">Question {question.questionNumber}</h4>
                      <p className="text-sm text-muted-foreground">{question.questionText}</p>
                    </div>
                    <Badge variant={
                      question.difficulty === 'Easy' ? 'secondary' :
                      question.difficulty === 'Medium' ? 'default' :
                      question.difficulty === 'Hard' ? 'destructive' : 'outline'
                    }>
                      {question.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Progress value={question.percentage} className="h-2" />
                    </div>
                    <div className="text-sm font-medium">
                      {question.averageScore.toFixed(1)} / {question.maxScore} ({question.percentage.toFixed(1)}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submission Timeline */}
      {viewType === 'detailed' && (
        <Card>
          <CardHeader>
            <CardTitle>Submission Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.submissionTimeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="submissions" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};