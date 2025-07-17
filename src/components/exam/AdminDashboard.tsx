import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ExamCreator } from './ExamCreator';
import { SubmissionViewer } from './SubmissionViewer';
import { LogOut, Plus, FileText, Users, BarChart3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [examsResponse, submissionsResponse] = await Promise.all([
        supabase.from('exams').select('*').order('created_at', { ascending: false }),
        supabase.from('student_submissions').select('*').order('submitted_at', { ascending: false })
      ]);

      if (examsResponse.error) throw examsResponse.error;
      if (submissionsResponse.error) throw submissionsResponse.error;

      setExams(examsResponse.data || []);
      setSubmissions(submissionsResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalExams: exams.length,
    activeExams: exams.filter(e => e.status === 'active').length,
    totalSubmissions: submissions.length,
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
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">CS Experts Zimbabwe - Digital Examination System</p>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="exams">Manage Exams</TabsTrigger>
            <TabsTrigger value="submissions">View Submissions</TabsTrigger>
            <TabsTrigger value="create">Create Exam</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalExams}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.activeExams} active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.gradedSubmissions} graded
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Grading Progress</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.totalSubmissions > 0 
                      ? Math.round((stats.gradedSubmissions / stats.totalSubmissions) * 100)
                      : 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Auto-graded by AI
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Status</CardTitle>
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">Online</div>
                  <p className="text-xs text-muted-foreground">
                    All systems operational
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Exams</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {exams.slice(0, 5).map((exam) => (
                      <div key={exam.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">{exam.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {exam.duration_minutes} mins | {exam.total_marks} marks
                          </p>
                        </div>
                        <Badge variant={exam.status === 'active' ? 'default' : 'secondary'}>
                          {exam.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {submissions.slice(0, 5).map((submission) => (
                      <div key={submission.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">{submission.student_name}</p>
                          <p className="text-sm text-muted-foreground">
                            Score: {submission.total_score}/{submission.max_score}
                          </p>
                        </div>
                        <Badge variant={submission.graded ? 'default' : 'secondary'}>
                          {submission.graded ? 'Graded' : 'Pending'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
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
                      <Badge variant={exam.status === 'active' ? 'default' : 'secondary'}>
                        {exam.status}
                      </Badge>
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

          <TabsContent value="submissions">
            <SubmissionViewer submissions={submissions} />
          </TabsContent>

          <TabsContent value="create">
            <ExamCreator onExamCreated={fetchData} />
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