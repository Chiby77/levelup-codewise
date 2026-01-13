import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  Award, 
  FileText, 
  TrendingUp,
  Target,
  BookOpen,
  Users,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface StudentPortalProps {
  onStartExam: (examId: string, studentInfo: { name: string; email?: string }) => void;
}

interface Exam {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  total_marks: number;
  subject: string;
  status: string;
  created_at: string;
}

interface StudentSubmission {
  id: string;
  exam_id: string;
  total_score: number;
  max_score: number;
  graded: boolean;
  submitted_at: string;
  time_taken_minutes?: number;
}

export const EnhancedStudentPortal: React.FC<StudentPortalProps> = ({ onStartExam }) => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('exams');

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      // RLS on exams table now handles visibility:
      // - General exams (is_general=true) visible to all authenticated users
      // - Class-specific exams visible only to students enrolled in those classes
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExams(data || []);
    } catch (error) {
      console.error('Error fetching exams:', error);
      toast.error('Failed to load exams');
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = (examId: string) => {
    if (!studentName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    onStartExam(examId, {
      name: studentName.trim(),
      email: studentEmail.trim() || undefined
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getExamStats = () => {
    const totalExams = exams.length;
    const completedExams = submissions.filter(s => s.graded).length;
    const avgScore = submissions.length > 0 
      ? Math.round(submissions.reduce((sum, s) => sum + (s.total_score / s.max_score * 100), 0) / submissions.length)
      : 0;

    return { totalExams, completedExams, avgScore };
  };

  const stats = getExamStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading exams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="container mx-auto p-4 sm:p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2">CS Experts Zimbabwe</h1>
          <p className="text-muted-foreground text-sm sm:text-lg">Digital Examination Portal</p>
          <div className="mt-4 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              placeholder="Your full name *"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Email (optional)"
              type="email"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 h-auto">
            <TabsTrigger value="exams" className="text-xs sm:text-sm">Available Exams</TabsTrigger>
            <TabsTrigger value="stats" className="text-xs sm:text-sm">Statistics</TabsTrigger>
            <TabsTrigger value="help" className="text-xs sm:text-sm">Help & Info</TabsTrigger>
          </TabsList>

          <TabsContent value="exams" className="space-y-6">
            {exams.length === 0 ? (
              <Card className="text-center">
                <CardContent className="py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-lg mb-2">No active exams</p>
                  <p className="text-sm text-muted-foreground">
                    Check back later for new exam announcements
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {exams.map((exam) => (
                  <Card key={exam.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg sm:text-xl">{exam.title}</CardTitle>
                          <p className="text-muted-foreground mt-1 text-sm sm:text-base">{exam.description}</p>
                          <div className="flex items-center gap-1 mt-2">
                            <Badge variant="outline">{exam.subject}</Badge>
                          </div>
                        </div>
                        <Badge variant="default" className="whitespace-nowrap">
                          Active
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{exam.duration_minutes} mins</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-muted-foreground" />
                            <span>{exam.total_marks} marks</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{formatDate(exam.created_at)}</span>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleStartExam(exam.id)}
                          disabled={!studentName.trim()}
                          className="w-full sm:w-auto min-w-[120px]"
                        >
                          Start Exam
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available Exams</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalExams}</div>
                  <p className="text-xs text-muted-foreground">
                    Ready to take
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.completedExams}</div>
                  <p className="text-xs text-muted-foreground">
                    Exams completed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.avgScore}%</div>
                  <p className="text-xs text-muted-foreground">
                    Overall performance
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Exam System Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/20">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Auto-Grading</h4>
                      <p className="text-sm text-muted-foreground">AI-powered instant feedback</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/20">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Timed Exams</h4>
                      <p className="text-sm text-muted-foreground">Automatic submission and timing</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/20">
                      <Target className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Multiple Question Types</h4>
                      <p className="text-sm text-muted-foreground">Coding, multiple choice, and more</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/20">
                      <Users className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Secure Testing</h4>
                      <p className="text-sm text-muted-foreground">Tab prevention and monitoring</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="help" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>How to Take an Exam</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Enter Your Information</h4>
                    <p className="text-sm text-muted-foreground">Fill in your name and email (optional) at the top of the page</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Select an Exam</h4>
                    <p className="text-sm text-muted-foreground">Choose from the available active exams and click "Start Exam"</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Answer Questions</h4>
                    <p className="text-sm text-muted-foreground">Complete all questions within the time limit</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium">Submit & Get Results</h4>
                    <p className="text-sm text-muted-foreground">Submit your answers and receive AI-powered feedback</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Important Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-sm"><strong>Tab Prevention:</strong> Do not switch tabs or leave the exam window during the test</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm"><strong>Time Management:</strong> Keep track of remaining time and pace yourself accordingly</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm"><strong>Auto-Save:</strong> Your answers are automatically saved as you progress</p>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-sm"><strong>Technical Issues:</strong> Contact support immediately if you experience any problems</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>Bluewave Technologies Digital Examination System</p>
          <p>Co-founder & CEO: Tinodaishe M. Chibi</p>
        </div>
      </div>
    </div>
  );
};