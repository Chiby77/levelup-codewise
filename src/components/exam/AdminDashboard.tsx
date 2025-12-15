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
import { UserManagement } from '@/components/admin/UserManagement';
import { FeedbackViewer } from '@/components/admin/FeedbackViewer';
import { RegradeSubmissions } from "@/components/admin/RegradeSubmissions";
import { QuestionBank } from "@/components/admin/QuestionBank";
import { AdminDownloads } from "@/components/admin/AdminDownloads";
import { LogOut, Plus, FileText, Users, BarChart3, Trash2, Power, Activity, Clock, Mail, Download, Calendar, FolderOpen, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRealtimeSubmissions } from '@/hooks/useRealtimeSubmissions';
import { useCachedExams, useCachedSubmissions, useInvalidateCache } from '@/hooks/useCachedData';
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
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [scheduleData, setScheduleData] = useState({ startTime: '', endTime: '', autoActivate: true, autoDeactivate: true });

  // Use cached data for better performance
  const { data: exams = [], isLoading: examsLoading, refetch: refetchExams } = useCachedExams();
  const { data: submissions = [], isLoading: submissionsLoading, refetch: refetchSubmissions } = useCachedSubmissions();
  const { invalidateExams, invalidateSubmissions } = useInvalidateCache();

  const loading = examsLoading || submissionsLoading;

  // Real-time notifications for new submissions
  const handleNewSubmission = useCallback(() => {
    invalidateSubmissions();
  }, [invalidateSubmissions]);

  useRealtimeSubmissions({ onNewSubmission: handleNewSubmission, enabled: true });

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
      totalQuestions: 0, // Will be calculated on demand
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
      <div className="container mx-auto p-4 sm:p-6">
        {/* Header */}
        <motion.div 
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-6 rounded-xl border bg-card"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">CS Experts Zimbabwe - Examination System</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportGrades}>
              <Download className="h-4 w-4 mr-2" />Export
            </Button>
            <Button variant="outline" onClick={onLogout} className="hover:bg-destructive/10 hover:text-destructive">
              <LogOut className="h-4 w-4 mr-2" />Logout
            </Button>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 h-auto gap-1">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="exams" className="text-xs">Exams</TabsTrigger>
            <TabsTrigger value="submissions" className="text-xs">Submissions</TabsTrigger>
            <TabsTrigger value="users" className="text-xs">Users</TabsTrigger>
            <TabsTrigger value="bank" className="text-xs">Q-Bank</TabsTrigger>
            <TabsTrigger value="downloads" className="text-xs">Downloads</TabsTrigger>
            <TabsTrigger value="feedback" className="text-xs">Feedback</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs">Analytics</TabsTrigger>
            <TabsTrigger value="monitoring" className="text-xs">Live</TabsTrigger>
            <TabsTrigger value="create" className="text-xs">Create</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <EnhancedExamStats 
              totalExams={stats.totalExams}
              activeExams={stats.activeExams}
              totalSubmissions={stats.totalSubmissions}
              totalQuestions={0}
              averageScore={stats.averageScore}
              completionRate={stats.completionRate}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-primary" />Recent Exams
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {exams.slice(0, 5).map((exam) => (
                    <div key={exam.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{exam.title}</p>
                        <p className="text-xs text-muted-foreground">{exam.duration_minutes} mins | {exam.total_marks} marks</p>
                      </div>
                      <Badge variant={exam.status === 'active' ? 'default' : 'secondary'}>{exam.status}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="h-5 w-5 text-primary" />Recent Submissions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {submissions.slice(0, 5).map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{sub.student_name}</p>
                        <p className="text-xs text-muted-foreground">{sub.total_score}/{sub.max_score} ({Math.round((sub.total_score / sub.max_score) * 100)}%)</p>
                      </div>
                      <Badge variant={sub.graded ? 'default' : 'secondary'}>{sub.graded ? 'Graded' : 'Pending'}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <StudentLeaderboard />
          </TabsContent>

          <TabsContent value="exams" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Exam Management</h2>
              <Button onClick={() => setActiveTab('create')}><Plus className="h-4 w-4 mr-2" />Create Exam</Button>
            </div>
            
            <div className="grid gap-4">
              {exams.map((exam) => (
                <Card key={exam.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{exam.title}</h3>
                          <Badge variant={exam.status === 'active' ? 'default' : 'secondary'}>{exam.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{exam.description}</p>
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <span>⏱️ {exam.duration_minutes} mins</span>
                          <span>📝 {exam.total_marks} marks</span>
                          {exam.start_time && <span>🗓️ Start: {new Date(exam.start_time).toLocaleString()}</span>}
                          {exam.end_time && <span>🔚 End: {new Date(exam.end_time).toLocaleString()}</span>}
                        </div>
                      </div>
                      <div className="flex gap-2 items-start">
                        <Button size="sm" variant="outline" onClick={() => { 
                          setSelectedExam(exam); 
                          setScheduleData({
                            startTime: exam.start_time || '',
                            endTime: exam.end_time || '',
                            autoActivate: exam.auto_activate || false,
                            autoDeactivate: exam.auto_deactivate || false
                          });
                          setShowScheduleDialog(true);
                        }}>
                          <Calendar className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => toggleExamStatus(exam.id, exam.status)}>
                          <Power className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteExam(exam.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="submissions" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Submissions ({submissions.length})</h2>
              <Button variant="outline" onClick={exportGrades}><Download className="h-4 w-4 mr-2" />Export CSV</Button>
            </div>

            <div className="grid gap-3">
              {submissions.map((sub) => {
                const exam = exams.find(e => e.id === sub.exam_id);
                return (
                  <Card key={sub.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{sub.student_name}</h3>
                            <Badge variant={sub.graded ? 'default' : 'secondary'}>{sub.graded ? 'Graded' : 'Pending'}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{sub.student_email}</p>
                          <div className="flex flex-wrap gap-3 text-sm mt-2">
                            <span className="font-medium text-primary">{sub.total_score}/{sub.max_score} ({Math.round((sub.total_score / sub.max_score) * 100)}%)</span>
                            <span className="text-muted-foreground">Exam: {exam?.title || 'Unknown'}</span>
                            <span className="text-muted-foreground">{new Date(sub.submitted_at).toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 items-start">
                          {!sub.graded && (
                            <Button size="sm" onClick={() => gradeSubmission(sub)}>
                              <Activity className="h-4 w-4 mr-1" />Grade
                            </Button>
                          )}
                          {sub.graded && sub.student_email && (
                            <Button size="sm" variant="outline" onClick={() => { setSelectedSubmission(sub); setShowEmailDialog(true); }}>
                              <Mail className="h-4 w-4 mr-1" />Send Results
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
        <DialogContent>
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
    </div>
  );
};