import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Download, CheckCircle, XCircle, Award, FileText, RotateCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { generatePDFReport } from '@/utils/reportGenerator';

interface ExamResultsProps {
  submissionId: string;
  studentData: {
    name: string;
    email: string;
  };
  onReturnToPortal: () => void;
}

interface SubmissionResult {
  id: string;
  total_score: number;
  max_score: number;
  graded: boolean;
  grade_details: any;
  time_taken_minutes: number;
  submitted_at: string;
  student_name: string;
  student_email?: string;
  answers: any;
}

export const ExamResults: React.FC<ExamResultsProps> = ({ 
  submissionId, 
  studentData, 
  onReturnToPortal 
}) => {
  const [submission, setSubmission] = useState<SubmissionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingReport, setDownloadingReport] = useState(false);

  useEffect(() => {
    fetchSubmissionResults();
  }, [submissionId]);

  const fetchSubmissionResults = async () => {
    try {
      const { data, error } = await supabase
        .from('student_submissions')
        .select('*')
        .eq('id', submissionId)
        .single();

      if (error) throw error;
      setSubmission(data);
    } catch (error) {
      console.error('Error fetching results:', error);
      toast.error('Failed to load exam results');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!submission) return;
    
    setDownloadingReport(true);
    try {
      await generatePDFReport(submission);
      toast.success('Report downloaded successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setDownloadingReport(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Results Not Found</h2>
            <p className="text-muted-foreground mb-4">
              Unable to load your exam results. Please contact support.
            </p>
            <Button onClick={onReturnToPortal}>
              Return to Portal
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const percentage = Math.round((submission.total_score / submission.max_score) * 100);
  const getGradeColor = (percent: number) => {
    if (percent >= 80) return "text-green-600";
    if (percent >= 60) return "text-blue-600";
    if (percent >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getGradeLabel = (percent: number) => {
    if (percent >= 80) return "Excellent";
    if (percent >= 60) return "Good";
    if (percent >= 40) return "Fair";
    return "Needs Improvement";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {percentage >= 70 ? (
              <Award className="h-16 w-16 text-yellow-500" />
            ) : percentage >= 50 ? (
              <CheckCircle className="h-16 w-16 text-green-500" />
            ) : (
              <FileText className="h-16 w-16 text-blue-500" />
            )}
          </div>
          <h1 className="text-3xl font-bold mb-2">Exam Results</h1>
          <p className="text-muted-foreground">
            Congratulations on completing your examination, {studentData.name}!
          </p>
        </div>

        {/* Score Card */}
        <Card className="mb-6 border-2 border-primary/20">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">Your Score</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-4">
              <div className={`text-6xl font-bold ${getGradeColor(percentage)} mb-2`}>
                {percentage}%
              </div>
              <div className="text-xl text-muted-foreground mb-2">
                {submission.total_score} out of {submission.max_score} marks
              </div>
              <Badge variant={percentage >= 70 ? "default" : percentage >= 50 ? "secondary" : "destructive"} className="text-lg px-4 py-1">
                {getGradeLabel(percentage)}
              </Badge>
            </div>
            
            <Progress value={percentage} className="h-4 mb-4" />
            
            <div className="flex justify-center gap-8 text-sm text-muted-foreground">
              <div>
                <p className="font-medium">Time Taken</p>
                <p>{submission.time_taken_minutes || 0} minutes</p>
              </div>
              <div>
                <p className="font-medium">Submitted</p>
                <p>{new Date(submission.submitted_at).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        {submission.grade_details && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Question Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(submission.grade_details).map(([questionId, details]: [string, any], index) => (
                  <div key={questionId} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      {details.score === details.maxScore ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : details.score > 0 ? (
                        <div className="h-5 w-5 rounded-full bg-yellow-500 flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-white"></div>
                        </div>
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <div>
                        <p className="font-medium">Question {index + 1}</p>
                        <p className="text-sm text-muted-foreground">{details.feedback}</p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {details.score}/{details.maxScore}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={handleDownloadReport}
            disabled={downloadingReport}
            size="lg"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {downloadingReport ? 'Generating Report...' : 'Download Detailed Report'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onReturnToPortal}
            size="lg"
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Return to Portal
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>CS Experts Zimbabwe Digital Examination System</p>
          <p>Powered by Intellix Inc | Founded by Tinodaishe M Chibi</p>
        </div>
      </div>
    </div>
  );
};