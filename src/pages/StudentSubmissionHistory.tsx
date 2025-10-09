import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Calendar, Clock, FileCheck, TrendingUp, Award } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface Submission {
  id: string;
  exam_id: string;
  student_name: string;
  submitted_at: string;
  total_score: number;
  max_score: number;
  time_taken_minutes: number;
  graded: boolean;
  grade_details: any;
  exams: {
    title: string;
    subject: string;
  };
}

export default function StudentSubmissionHistory() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) {
        toast.error('Please log in to view your submission history');
        navigate('/auth');
        return;
      }

      setUserEmail(user.email);

      const { data, error } = await supabase
        .from('student_submissions')
        .select(`
          *,
          exams (
            title,
            subject
          )
        `)
        .eq('student_email', user.email)
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      setSubmissions(data || []);
    } catch (error: any) {
      console.error('Error loading submissions:', error);
      toast.error('Failed to load submission history');
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-50';
    if (percentage >= 60) return 'text-blue-600 bg-blue-50';
    if (percentage >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getGradeLetter = (percentage: number) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading submission history...</p>
        </div>
      </div>
    );
  }

  const totalSubmissions = submissions.length;
  const gradedSubmissions = submissions.filter(s => s.graded);
  const averageScore = gradedSubmissions.length > 0
    ? gradedSubmissions.reduce((sum, s) => sum + (s.total_score / s.max_score * 100), 0) / gradedSubmissions.length
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="container mx-auto max-w-6xl">
        <Button 
          variant="outline" 
          onClick={() => navigate('/student-dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Exam Submission History</h1>
          <p className="text-muted-foreground">View all your exam submissions and grades</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Exams</p>
                  <p className="text-3xl font-bold">{totalSubmissions}</p>
                </div>
                <FileCheck className="h-10 w-10 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                  <p className="text-3xl font-bold">{averageScore.toFixed(1)}%</p>
                </div>
                <TrendingUp className="h-10 w-10 text-blue-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Best Grade</p>
                  <p className="text-3xl font-bold">
                    {gradedSubmissions.length > 0
                      ? getGradeLetter(Math.max(...gradedSubmissions.map(s => s.total_score / s.max_score * 100)))
                      : 'N/A'}
                  </p>
                </div>
                <Award className="h-10 w-10 text-yellow-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submissions List */}
        <Card>
          <CardHeader>
            <CardTitle>All Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {submissions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No exam submissions yet</p>
                <Button onClick={() => navigate('/student-dashboard')}>
                  Go to Dashboard
                </Button>
              </div>
            ) : (
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {submissions.map((submission) => {
                    const percentage = (submission.total_score / submission.max_score) * 100;
                    const gradeLetter = getGradeLetter(percentage);

                    return (
                      <Card key={submission.id} className="overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold">{submission.exams?.title || 'Exam'}</h3>
                                <Badge variant="outline">{submission.exams?.subject || 'Subject'}</Badge>
                                {submission.graded ? (
                                  <Badge className={getGradeColor(percentage)}>
                                    {gradeLetter}
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary">Pending</Badge>
                                )}
                              </div>
                              
                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {formatDistanceToNow(new Date(submission.submitted_at), { addSuffix: true })}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {submission.time_taken_minutes} minutes
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col md:items-end gap-2">
                              {submission.graded ? (
                                <>
                                  <div className="text-2xl font-bold">
                                    {submission.total_score} / {submission.max_score}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {percentage.toFixed(1)}%
                                  </div>
                                </>
                              ) : (
                                <div className="text-muted-foreground">
                                  Grading in progress...
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Detailed Feedback */}
                          {submission.graded && submission.grade_details && (
                            <div className="mt-4 pt-4 border-t">
                              <p className="text-sm font-semibold mb-2">Question Breakdown:</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {Object.entries(submission.grade_details).map(([qId, details]: [string, any], idx) => (
                                  <div key={qId} className="text-xs p-2 bg-muted/50 rounded">
                                    <div className="flex justify-between mb-1">
                                      <span className="font-medium">Q{idx + 1}</span>
                                      <span>{details.score}/{details.maxScore}</span>
                                    </div>
                                    <p className="text-muted-foreground line-clamp-2">{details.feedback}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
