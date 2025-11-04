import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ExamCreator } from './ExamCreator';
import { EnhancedExamCreator } from './EnhancedExamCreator';
import { SubmissionViewer } from './SubmissionViewer';
import { ExamAnalytics } from './ExamAnalytics';
import { EnhancedExamStats } from './EnhancedExamStats';
import { AnimatedExamCard } from './AnimatedExamCard';
import { LiveExamMonitoring } from './LiveExamMonitoring';
import { ScoreAnalytics } from './ScoreAnalytics';
import { StudentLeaderboard } from './StudentLeaderboard';
import { UserManagement } from '@/components/admin/UserManagement';
import { AdminDownloads } from '@/components/admin/AdminDownloads';
import { FeedbackViewer } from '@/components/admin/FeedbackViewer';
import { LogOut, Plus, FileText, Users, BarChart3, Sparkles, Trash2, Power, Activity, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface AdminDashboardProps {
  onLogout: () => void;
}

interface Exam {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  total_marks: number;
  status: string;
  created_at: string;
}

interface Submission {
  id: string;
  exam_id?: string;
  student_name: string;
  student_email?: string;
  submitted_at: string;
  total_score: number;
  max_score: number;
  graded: boolean;
  answers: any;
  grade_details: any;
  time_taken_minutes?: number;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [examsResponse, submissionsResponse, questionsResponse] = await Promise.all([
        supabase.from('exams').select('*').order('created_at', { ascending: false }),
        supabase.from('student_submissions').select('*').order('submitted_at', { ascending: false }),
        supabase.from('questions').select('id', { count: 'exact', head: true })
      ]);

      if (examsResponse.error) throw examsResponse.error;
      if (submissionsResponse.error) throw submissionsResponse.error;

      setExams(examsResponse.data || []);
      setSubmissions(submissionsResponse.data || []);
      setTotalQuestions(questionsResponse.count || 0);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const gradeAllPending = async () => {
    setLoading(true);
    const pendingSubmissions = submissions.filter(s => !s.graded);
    
    try {
      for (const submission of pendingSubmissions) {
        await supabase.functions.invoke('grade-exam', {
          body: {
            submissionId: submission.id,
            examId: submission.exam_id || '',
            studentAnswers: submission.answers,
            questions: []
          }
        });
      }
      
      toast.success(`Initiated grading for ${pendingSubmissions.length} submissions`);
      await fetchData();
    } catch (error) {
      console.error('Error grading submissions:', error);
      toast.error('Failed to grade submissions');
    } finally {
      setLoading(false);
    }
  };

  const exportGrades = () => {
    const csv = 'Student Name,Email,Score,Max Score,Percentage,Graded,Submitted At\n' +
      submissions.map(s => 
        `"${s.student_name}","${s.student_email || ''}",${s.total_score},${s.max_score},${Math.round((s.total_score / s.max_score) * 100)}%,${s.graded ? 'Yes' : 'No'},"${new Date(s.submitted_at).toLocaleString()}"`
      ).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exam-grades.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Grades exported successfully');
  };

  const deleteExam = async (examId: string) => {
    if (!confirm('Are you sure you want to delete this exam? This will also delete all related questions.')) return;

    try {
      const { error } = await supabase
        .from('exams')
        .delete()
        .eq('id', examId);

      if (error) throw error;
      toast.success('Exam deleted successfully');
      await fetchData();
    } catch (error) {
      console.error('Error deleting exam:', error);
      toast.error('Failed to delete exam');
    }
  };

  const toggleExamStatus = async (examId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'draft' : 'active';
    
    try {
      const { error } = await supabase
        .from('exams')
        .update({ status: newStatus })
        .eq('id', examId);

      if (error) throw error;
      toast.success(`Exam ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
      await fetchData();
    } catch (error) {
      console.error('Error toggling exam status:', error);
      toast.error('Failed to update exam status');
    }
  };

  const requestGrading = async (submissionId: string) => {
    try {
      const submission = submissions.find(s => s.id === submissionId);
      if (!submission) return;

      await supabase.functions.invoke('grade-exam', {
        body: {
          submissionId,
          examId: submission.exam_id || '',
          studentAnswers: submission.answers,
          questions: []
        }
      });
      
      toast.success('Grading requested successfully');
      await fetchData();
    } catch (error) {
      console.error('Error requesting grading:', error);
      toast.error('Failed to request grading');
    }
  };

  const stats = {
    totalExams: exams.length,
    activeExams: exams.filter(e => e.status === 'active').length,
    totalSubmissions: submissions.length,
    totalQuestions: totalQuestions,
    averageScore: submissions.filter(s => s.graded && s.max_score > 0).length > 0
      ? submissions
          .filter(s => s.graded && s.max_score > 0)
          .reduce((acc, s) => acc + ((s.total_score || 0) / s.max_score) * 100, 0) / 
        submissions.filter(s => s.graded && s.max_score > 0).length
      : 0,
    completionRate: submissions.length > 0
      ? (submissions.filter(s => s.graded).length / submissions.length) * 100
      : 0,
    gradedSubmissions: submissions.filter(s => s.graded).length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto p-4 sm:p-6 relative z-10">
        <motion.div 
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-6 rounded-xl border border-primary/20 backdrop-blur-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base mt-1">CS Experts Zimbabwe - Next-Gen Digital Examination System</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/admin-content'}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Manage Content
            </Button>
            <Button 
              variant="outline"
              onClick={onLogout} 
              className="w-full sm:w-auto hover:bg-destructive/10 hover:text-destructive hover:scale-105 transition-all"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-9 h-auto">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="leaderboard" className="text-xs sm:text-sm">🏆 Top</TabsTrigger>
            <TabsTrigger value="monitoring" className="text-xs sm:text-sm flex items-center gap-1">
              <Activity className="h-3 w-3" />
              Live
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
            <TabsTrigger value="feedback" className="text-xs sm:text-sm flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              Feedback
            </TabsTrigger>
            <TabsTrigger value="exams" className="text-xs sm:text-sm">Exams</TabsTrigger>
            <TabsTrigger value="submissions" className="text-xs sm:text-sm">Submissions</TabsTrigger>
            <TabsTrigger value="users" className="text-xs sm:text-sm">Users</TabsTrigger>
            <TabsTrigger value="create" className="text-xs sm:text-sm">Create</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <EnhancedExamStats 
              totalExams={stats.totalExams}
              activeExams={stats.activeExams}
              totalSubmissions={stats.totalSubmissions}
              totalQuestions={stats.totalQuestions}
              averageScore={stats.averageScore}
              completionRate={stats.completionRate}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-primary/20 hover:border-primary/40 transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Recent Exams
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {exams.slice(0, 5).map((exam, index) => (
                        <motion.div 
                          key={exam.id} 
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/5 to-transparent rounded-lg border border-primary/10 hover:border-primary/30 transition-all"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ x: 5 }}
                        >
                          <div>
                            <p className="font-medium">{exam.title}</p>
                            <p className="text-sm text-muted-foreground">
                              ⏱️ {exam.duration_minutes} mins | 📝 {exam.total_marks} marks
                            </p>
                          </div>
                          <Badge variant={exam.status === 'active' ? 'default' : 'secondary'} className="animate-pulse">
                            {exam.status}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-accent/20 hover:border-accent/40 transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-accent" />
                      Recent Submissions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {submissions.slice(0, 5).map((submission, index) => (
                        <motion.div 
                          key={submission.id} 
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-accent/5 to-transparent rounded-lg border border-accent/10 hover:border-accent/30 transition-all"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ x: -5 }}
                        >
                          <div>
                            <p className="font-medium">{submission.student_name}</p>
                            <p className="text-sm text-muted-foreground">
                              Score: <span className="font-semibold text-primary">{submission.total_score}/{submission.max_score}</span> ({Math.round((submission.total_score / submission.max_score) * 100)}%)
                            </p>
                          </div>
                          <Badge variant={submission.graded ? 'default' : 'secondary'}>
                            {submission.graded ? '✅ Graded' : '⏳ Pending'}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <StudentLeaderboard />
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <LiveExamMonitoring />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <ScoreAnalytics submissions={submissions} />
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            <FeedbackViewer />
          </TabsContent>

          <TabsContent value="exams" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Exam Management</h2>
              <Button onClick={() => setActiveTab('create')}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Exam
              </Button>
            </div>
            
            <div className="grid gap-4">
              {exams.map((exam) => (
                <Card key={exam.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{exam.title}</CardTitle>
                        <p className="text-muted-foreground mt-1">{exam.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={exam.status === 'active' ? 'default' : 'secondary'}>
                          {exam.status}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleExamStatus(exam.id, exam.status)}
                        >
                          <Power className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteExam(exam.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>Duration: {exam.duration_minutes} minutes</span>
                      <span>Total Marks: {exam.total_marks}</span>
                      <span>Created: {new Date(exam.created_at).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="submissions" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl sm:text-2xl font-bold">Submissions & Grading</h2>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button onClick={gradeAllPending} disabled={loading} className="w-full sm:w-auto">
                  Grade All Pending
                </Button>
                <Button variant="outline" onClick={exportGrades} disabled={submissions.length === 0} className="w-full sm:w-auto">
                  Export Grades
                </Button>
              </div>
            </div>
            <SubmissionViewer submissions={submissions} onGradeRequest={requestGrading} />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UserManagement />
          </TabsContent>

          <TabsContent value="create">
            <EnhancedExamCreator onExamCreated={fetchData} />
          </TabsContent>
        </Tabs>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>CS Experts Zimbabwe Digital Examination System</p>
          <p>Powered by Intellix Inc | Founded by Tinodaishe M Chibi</p>
        </div>
      </div>
    </div>
  );
};