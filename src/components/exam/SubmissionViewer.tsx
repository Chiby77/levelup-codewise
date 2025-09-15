import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Download, Eye, FileText } from 'lucide-react';
import { generatePDFReport } from '@/utils/reportGenerator';
import { toast } from 'sonner';

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

interface SubmissionViewerProps {
  submissions: Submission[];
  onGradeRequest?: (submissionId: string) => void;
}

export const SubmissionViewer: React.FC<SubmissionViewerProps> = ({ submissions, onGradeRequest }) => {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  const handleDownloadReport = async (submission: Submission) => {
    try {
      await generatePDFReport(submission);
      toast.success('Report downloaded successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Student Submissions</h2>
        <div className="text-sm text-muted-foreground">
          Total: {submissions.length} | Graded: {submissions.filter(s => s.graded).length}
        </div>
      </div>

      {submissions.length === 0 ? (
        <Card className="text-center">
          <CardContent className="py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg mb-2">No submissions yet</p>
            <p className="text-sm text-muted-foreground">
              Student submissions will appear here once they complete exams
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {submissions.map((submission) => (
            <Card key={submission.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{submission.student_name}</CardTitle>
                    {submission.student_email && (
                      <p className="text-sm text-muted-foreground">{submission.student_email}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={submission.graded ? 'default' : 'secondary'}>
                      {submission.graded ? 'Graded' : 'Pending'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="flex gap-6 text-sm">
                      <span>Submitted: {formatDate(submission.submitted_at)}</span>
                      {submission.time_taken_minutes && (
                        <span>Time: {submission.time_taken_minutes} minutes</span>
                      )}
                    </div>
                    {submission.graded && (
                      <div className={`text-lg font-semibold ${getScoreColor(submission.total_score, submission.max_score)}`}>
                        Score: {submission.total_score}/{submission.max_score} 
                        ({Math.round((submission.total_score / submission.max_score) * 100)}%)
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedSubmission(submission)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            Submission Details - {submission.student_name}
                          </DialogTitle>
                        </DialogHeader>
                        <SubmissionDetails submission={submission} />
                      </DialogContent>
                    </Dialog>
                    
                    {!submission.graded && onGradeRequest && (
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => onGradeRequest(submission.id)}
                      >
                        Grade This
                      </Button>
                    )}
                    
                    {submission.graded && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadReport(submission)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Report
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const SubmissionDetails: React.FC<{ submission: Submission }> = ({ submission }) => {
  const answers = submission.answers || {};
  const gradeDetails = submission.grade_details || {};

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
        <div>
          <p className="text-sm text-muted-foreground">Student</p>
          <p className="font-medium">{submission.student_name}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Submitted</p>
          <p className="font-medium">{new Date(submission.submitted_at).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Score</p>
          <p className="font-medium">{submission.total_score}/{submission.max_score}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Time Taken</p>
          <p className="font-medium">{submission.time_taken_minutes || 0} minutes</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Answers & Grading</h3>
        <div className="space-y-4">
          {Object.entries(answers).map(([questionId, answer], index) => (
            <Card key={questionId}>
              <CardHeader>
                <CardTitle className="text-sm">Question {index + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Student Answer:</p>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      {typeof answer === 'string' ? (
                        <p className="text-sm">{answer}</p>
                      ) : (
                        <pre className="text-sm whitespace-pre-wrap">
                          {JSON.stringify(answer, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                  
                  {gradeDetails[questionId] && (
                    <div>
                      <p className="text-sm font-medium">AI Feedback:</p>
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                        <p className="text-sm">{gradeDetails[questionId].feedback}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Score: {gradeDetails[questionId].score}/{gradeDetails[questionId].maxScore}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};