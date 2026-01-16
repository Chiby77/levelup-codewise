import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { EnhancedExamCreator } from './EnhancedExamCreator';
import { SubmissionViewer } from './SubmissionViewer';
import { EnhancedExamStats } from './EnhancedExamStats';
import { LiveExamMonitoring } from './LiveExamMonitoring';
import { ScoreAnalytics } from './ScoreAnalytics';
import { StudentLeaderboard } from './StudentLeaderboard';
import { ExamPreview } from './ExamPreview';
import { UserManagement } from '@/components/admin/UserManagement';
import { FeedbackViewer } from '@/components/admin/FeedbackViewer';
import { RegradeSubmissions } from "@/components/admin/RegradeSubmissions";
import { QuestionBank } from "@/components/admin/QuestionBank";
import { AdminDownloads } from "@/components/admin/AdminDownloads";
import ClassManagement from '@/components/admin/ClassManagement';
import AssignmentManagement from '@/components/admin/AssignmentManagement';
import AnnouncementManagement from '@/components/admin/AnnouncementManagement';
import { LogOut, Plus, FileText, Users, BarChart3, Trash2, Power, Activity, Clock, Mail, Download, Calendar, FolderOpen, MessageSquare, Volume2, VolumeX, BookOpen, Megaphone, ClipboardList, Globe, Eye, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useRealtimeSubmissionsWithSound } from '@/hooks/useRealtimeSubmissionsWithSound';
import { useCachedExams, useCachedSubmissions, useInvalidateCache } from '@/hooks/useCachedData';
import { useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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
  start_time?: string;
  end_time?: string;
  auto_activate?: boolean;
  auto_deactivate?: boolean;
  is_general?: boolean;
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
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [previewExamId, setPreviewExamId] = useState<string | null>(null);
  const [sendingReminders, setSendingReminders] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [scheduleData, setScheduleData] = useState({ startTime: '', endTime: '', autoActivate: true, autoDeactivate: true });

  // Use cached data for better performance
  const { data: exams = [], isLoading: examsLoading, refetch: refetchExams } = useCachedExams();
  const { data: submissions = [], isLoading: submissionsLoading, refetch: refetchSubmissions } = useCachedSubmissions();
  const { invalidateExams, invalidateSubmissions } = useInvalidateCache();

  // Fetch total questions count
  const { data: totalQuestions = 0 } = useQuery({
    queryKey: ['totalQuestions'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    },
    staleTime: 5 * 60 * 1000,
  });

  const loading = examsLoading || submissionsLoading;

  // Real-time notifications for new submissions with sound
  const handleNewSubmission = useCallback(() => {
    invalidateSubmissions();
  }, [invalidateSubmissions]);

  const { soundEnabled, toggleSound } = useRealtimeSubmissionsWithSound({ onNewSubmission: handleNewSubmission, enabled: true });

  const fetchData = useCallback(() => {
    refetchExams();
    refetchSubmissions();
  }, [refetchExams, refetchSubmissions]);

  // Memoized stats for performance
  const stats = useMemo(() => {
    const gradedSubmissions = submissions.filter((s: Submission) => s.graded && s.max_score > 0);
    return {
      totalExams: exams.length,
      activeExams: exams.filter((e: Exam) => e.status === 'active').length,
      totalSubmissions: submissions.length,
      averageScore: gradedSubmissions.length > 0
        ? gradedSubmissions.reduce((acc: number, s: Submission) => acc + ((s.total_score || 0) / s.max_score) * 100, 0) / gradedSubmissions.length
        : 0,
      completionRate: submissions.length > 0 ? (submissions.filter((s: Submission) => s.graded).length / submissions.length) * 100 : 0,
    };
  }, [exams, submissions]);

  const deleteExam = async (examId: string) => {
    if (!confirm('Delete this exam and all related data?')) return;
    try {
      const { error } = await supabase.from('exams').delete().eq('id', examId);
      if (error) throw error;
      toast.success('Exam deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete exam');
    }
  };

  const toggleExamStatus = async (examId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'draft' : 'active';
    try {
      const { error } = await supabase.from('exams').update({ status: newStatus }).eq('id', examId);
      if (error) throw error;
      toast.success(`Exam ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const scheduleExam = async () => {
    if (!selectedExam) return;
    try {
      const { error } = await supabase.from('exams').update({
        start_time: scheduleData.startTime || null,
        end_time: scheduleData.endTime || null,
        auto_activate: scheduleData.autoActivate,
        auto_deactivate: scheduleData.autoDeactivate
      }).eq('id', selectedExam.id);

      if (error) throw error;
      toast.success('Exam schedule updated');
      setShowScheduleDialog(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to schedule exam');
    }
  };

  const sendResultsEmail = async () => {
    if (!selectedSubmission || !selectedSubmission.student_email) {
      toast.error('No email address available');
      return;
    }

    try {
      const exam = exams.find(e => e.id === selectedSubmission.exam_id);
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(
        'https://lprllsdtgnewmsnjyxhj.supabase.co/functions/v1/admin-user-management',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'send_results_email',
            data: {
              submissionId: selectedSubmission.id,
              studentEmail: selectedSubmission.student_email,
              studentName: selectedSubmission.student_name,
              totalScore: selectedSubmission.total_score,
              maxScore: selectedSubmission.max_score,
              gradeDetails: selectedSubmission.grade_details,
              examTitle: exam?.title
            }
          }),
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      toast.success('Results email sent successfully!');
      setShowEmailDialog(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to send email');
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
    toast.success('Grades exported');
  };

  const gradeSubmission = async (submission: Submission) => {
    try {
      await supabase.functions.invoke('grade-exam', {
        body: { submissionId: submission.id, examId: submission.exam_id || '', answers: submission.answers, questions: [] }
      });
      toast.success('Grading initiated');
      setTimeout(fetchData, 2000);
    } catch (error) {
      toast.error('Grading failed');
    }
  };

  const sendBulkPaymentReminders = async () => {
    setSendingReminders(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(
        'https://lprllsdtgnewmsnjyxhj.supabase.co/functions/v1/send-payment-reminders',
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${session?.access_token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'send_bulk_reminders' }),
        }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      toast.success(`Payment reminders sent: ${result.success} successful, ${result.failed} failed`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to send payment reminders');
    } finally {
      setSendingReminders(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-2 py-3 sm:p-6 max-w-7xl">
        {/* Header - Mobile optimized */}
        <motion.div 
          className="flex flex-col gap-3 mb-4 sm:mb-6 p-3 sm:p-6 rounded-xl border bg-card"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">CS Experts Zimbabwe - Examination System</p>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <Button variant="outline" size="sm" onClick={toggleSound} title={soundEnabled ? 'Mute notifications' : 'Enable sound notifications'}>
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={exportGrades}>
                <Download className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Export</span>
              </Button>
              <Button variant="outline" size="sm" onClick={onLogout} className="hover:bg-destructive/10 hover:text-destructive">
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-3 sm:space-y-4">
          {/* Mobile-optimized scrollable tabs with better visibility */}
          <ScrollArea className="w-full whitespace-nowrap pb-1">
            <TabsList className="inline-flex h-auto gap-0.5 sm:gap-1 p-0.5 sm:p-1 w-max min-w-full bg-muted/50">
              <TabsTrigger value="overview" className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Overview</TabsTrigger>
              <TabsTrigger value="exams" className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Exams</TabsTrigger>
              <TabsTrigger value="submissions" className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Submissions</TabsTrigger>
              <TabsTrigger value="classes" className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Classes</TabsTrigger>
              <TabsTrigger value="assignments" className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Assign</TabsTrigger>
              <TabsTrigger value="announcements" className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Announce</TabsTrigger>
              <TabsTrigger value="users" className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Users</TabsTrigger>
              <TabsTrigger value="bank" className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Q-Bank</TabsTrigger>
              <TabsTrigger value="downloads" className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Downloads</TabsTrigger>
              <TabsTrigger value="feedback" className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Feedback</TabsTrigger>
              <TabsTrigger value="analytics" className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Analytics</TabsTrigger>
              <TabsTrigger value="monitoring" className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Live</TabsTrigger>
              <TabsTrigger value="create" className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Create</TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" className="h-1.5 sm:h-2" />
          </ScrollArea>

          <TabsContent value="overview" className="space-y-6">
            <EnhancedExamStats 
              totalExams={stats.totalExams}
              activeExams={stats.activeExams}
              totalSubmissions={stats.totalSubmissions}
              totalQuestions={totalQuestions}
              averageScore={stats.averageScore}
              completionRate={stats.completionRate}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
              <Card>
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-lg text-foreground">
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />Recent Exams
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5 sm:space-y-2 p-2 sm:p-6 pt-0">
                  {exams.slice(0, 5).map((exam) => (
                    <div key={exam.id} className="flex items-center justify-between p-2 sm:p-3 bg-muted/50 rounded-lg">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-xs sm:text-sm text-foreground truncate">{exam.title}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">{exam.duration_minutes} mins | {exam.total_marks} marks</p>
                      </div>
                      <Badge variant={exam.status === 'active' ? 'default' : 'secondary'} className="text-[10px] sm:text-xs ml-2 shrink-0">{exam.status}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-lg text-foreground">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />Recent Submissions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5 sm:space-y-2 p-2 sm:p-6 pt-0">
                  {submissions.slice(0, 5).map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between p-2 sm:p-3 bg-muted/50 rounded-lg">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-xs sm:text-sm text-foreground truncate">{sub.student_name}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">{sub.total_score}/{sub.max_score} ({Math.round((sub.total_score / sub.max_score) * 100)}%)</p>
                      </div>
                      <Badge variant={sub.graded ? 'default' : 'secondary'} className="text-[10px] sm:text-xs ml-2 shrink-0">{sub.graded ? 'Graded' : 'Pending'}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <StudentLeaderboard />
          </TabsContent>

          <TabsContent value="exams" className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">Exam Management</h2>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <Button size="sm" onClick={() => setActiveTab('create')}><Plus className="h-4 w-4 mr-1" />Create</Button>
                <Button variant="outline" size="sm" onClick={sendBulkPaymentReminders} disabled={sendingReminders}>
                  <Send className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">{sendingReminders ? 'Sending...' : 'Reminders'}</span>
                </Button>
              </div>
            </div>
            
            <div className="grid gap-2 sm:gap-4">
              {exams.map((exam) => (
                <Card key={exam.id}>
                  <CardContent className="p-2 sm:p-4">
                    <div className="flex flex-col gap-2 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-xs sm:text-base text-foreground truncate max-w-[150px] sm:max-w-none">{exam.title}</h3>
                          <Badge variant={exam.status === 'active' ? 'default' : 'secondary'} className="text-[10px] sm:text-xs">{exam.status}</Badge>
                          <Badge variant="outline" className="text-[10px] sm:text-xs">
                            {exam.is_general !== false ? <><Globe className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5" />Gen</> : <><Users className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5" />Class</>}
                          </Badge>
                        </div>
                        <p className="text-[10px] sm:text-sm text-muted-foreground mb-1 sm:mb-2 line-clamp-1">{exam.description}</p>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground">
                          <span>⏱️ {exam.duration_minutes}m</span>
                          <span>📝 {exam.total_marks}pts</span>
                          {exam.start_time && <span className="hidden sm:inline">🗓️ {new Date(exam.start_time).toLocaleDateString()}</span>}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 items-center justify-end">
                        <Button size="sm" variant="outline" className="h-7 w-7 sm:h-8 sm:w-8 p-0" onClick={() => {
                          setPreviewExamId(exam.id);
                          setShowPreviewDialog(true);
                        }} title="Preview">
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 w-7 sm:h-8 sm:w-8 p-0" onClick={() => { 
                          setSelectedExam(exam); 
                          setScheduleData({
                            startTime: exam.start_time || '',
                            endTime: exam.end_time || '',
                            autoActivate: exam.auto_activate || false,
                            autoDeactivate: exam.auto_deactivate || false
                          });
                          setShowScheduleDialog(true);
                        }} title="Schedule">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 w-7 sm:h-8 sm:w-8 p-0" onClick={() => toggleExamStatus(exam.id, exam.status)} title={exam.status === 'active' ? 'Deactivate' : 'Activate'}>
                          <Power className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" className="h-7 w-7 sm:h-8 sm:w-8 p-0" onClick={() => deleteExam(exam.id)} title="Delete">
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="submissions" className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">Submissions ({submissions.length})</h2>
              <Button variant="outline" size="sm" onClick={exportGrades}><Download className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">Export CSV</span></Button>
            </div>

            <div className="grid gap-2 sm:gap-3">
              {submissions.map((sub) => {
                const exam = exams.find(e => e.id === sub.exam_id);
                return (
                  <Card key={sub.id}>
                    <CardContent className="p-2 sm:p-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1 flex-wrap">
                            <h3 className="font-semibold text-xs sm:text-base text-foreground truncate">{sub.student_name}</h3>
                            <Badge variant={sub.graded ? 'default' : 'secondary'} className="text-[10px] sm:text-xs">{sub.graded ? 'Graded' : 'Pending'}</Badge>
                          </div>
                          <p className="text-[10px] sm:text-sm text-muted-foreground truncate">{sub.student_email}</p>
                          <div className="flex flex-wrap gap-2 sm:gap-3 text-[10px] sm:text-sm mt-1 sm:mt-2">
                            <span className="font-medium text-primary">{sub.total_score}/{sub.max_score} ({Math.round((sub.total_score / sub.max_score) * 100)}%)</span>
                            <span className="text-muted-foreground hidden sm:inline">Exam: {exam?.title || 'Unknown'}</span>
                            <span className="text-muted-foreground">{new Date(sub.submitted_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-1.5 sm:gap-2 items-center justify-end">
                          {!sub.graded && (
                            <Button size="sm" className="h-7 text-[10px] sm:text-xs" onClick={() => gradeSubmission(sub)}>
                              <Activity className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />Grade
                            </Button>
                          )}
                          {sub.graded && sub.student_email && (
                            <Button size="sm" variant="outline" className="h-7 text-[10px] sm:text-xs" onClick={() => { setSelectedSubmission(sub); setShowEmailDialog(true); }}>
                              <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />Send
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <RegradeSubmissions />
          </TabsContent>

          <TabsContent value="classes"><ClassManagement /></TabsContent>
          <TabsContent value="assignments"><AssignmentManagement /></TabsContent>
          <TabsContent value="announcements"><AnnouncementManagement /></TabsContent>
          <TabsContent value="users"><UserManagement /></TabsContent>
          <TabsContent value="bank"><QuestionBank /></TabsContent>
          <TabsContent value="downloads"><AdminDownloads /></TabsContent>
          <TabsContent value="feedback"><FeedbackViewer /></TabsContent>
          <TabsContent value="analytics"><ScoreAnalytics submissions={submissions} /></TabsContent>
          <TabsContent value="monitoring"><LiveExamMonitoring /></TabsContent>
          <TabsContent value="create"><EnhancedExamCreator onExamCreated={fetchData} /></TabsContent>
        </Tabs>
      </div>

      {/* Schedule Exam Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Exam: {selectedExam?.title}</DialogTitle>
            <DialogDescription>Set automatic start and end times for the exam.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Start Time</Label>
              <Input type="datetime-local" value={scheduleData.startTime ? scheduleData.startTime.slice(0, 16) : ''} 
                onChange={(e) => setScheduleData(prev => ({ ...prev, startTime: e.target.value ? new Date(e.target.value).toISOString() : '' }))} />
            </div>
            <div>
              <Label>End Time</Label>
              <Input type="datetime-local" value={scheduleData.endTime ? scheduleData.endTime.slice(0, 16) : ''} 
                onChange={(e) => setScheduleData(prev => ({ ...prev, endTime: e.target.value ? new Date(e.target.value).toISOString() : '' }))} />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={scheduleData.autoActivate} onChange={(e) => setScheduleData(prev => ({ ...prev, autoActivate: e.target.checked }))} />
                Auto-activate at start
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={scheduleData.autoDeactivate} onChange={(e) => setScheduleData(prev => ({ ...prev, autoDeactivate: e.target.checked }))} />
                Auto-deactivate at end
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>Cancel</Button>
            <Button onClick={scheduleExam}>Save Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Results Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Results Email</DialogTitle>
            <DialogDescription>
              Send exam results to {selectedSubmission?.student_name} ({selectedSubmission?.student_email})
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-muted rounded-lg">
            <p><strong>Score:</strong> {selectedSubmission?.total_score}/{selectedSubmission?.max_score} ({selectedSubmission && Math.round((selectedSubmission.total_score / selectedSubmission.max_score) * 100)}%)</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailDialog(false)}>Cancel</Button>
            <Button onClick={sendResultsEmail}><Mail className="h-4 w-4 mr-2" />Send Email</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Exam Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Exam Preview Mode
            </DialogTitle>
            <DialogDescription>
              Test the exam as a student would see it
            </DialogDescription>
          </DialogHeader>
          {previewExamId && (
            <ExamPreview 
              examId={previewExamId} 
              onClose={() => setShowPreviewDialog(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};