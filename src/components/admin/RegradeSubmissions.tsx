import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

export const RegradeSubmissions = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const regradeStuckSubmissions = async () => {
    setLoading(true);
    setResults(null);

    try {
      // Find all ungraded or stuck submissions
      const { data: submissions, error: fetchError } = await supabase
        .from('student_submissions')
        .select('*, exams(id, title)')
        .or('graded.eq.false,grading_status.eq.processing,grading_status.eq.failed')
        .order('submitted_at', { ascending: false });

      if (fetchError) throw fetchError;

      if (!submissions || submissions.length === 0) {
        toast.success('No stuck submissions found!');
        setResults({ success: 0, failed: 0, total: 0 });
        setLoading(false);
        return;
      }

      toast.info(`Found ${submissions.length} submissions to grade...`);

      let successCount = 0;
      let failCount = 0;

      // Process each submission
      for (const submission of submissions) {
        try {
          // Fetch questions for this exam
          const { data: questions, error: qError } = await supabase
            .from('questions')
            .select('*')
            .eq('exam_id', submission.exam_id)
            .order('order_number');

          if (qError || !questions || questions.length === 0) {
            console.error('No questions found for exam:', submission.exam_id);
            failCount++;
            continue;
          }

          // Update status to processing
          await supabase
            .from('student_submissions')
            .update({ grading_status: 'processing' })
            .eq('id', submission.id);

          // Invoke grading function
          const { data: gradeData, error: gradeError } = await supabase.functions.invoke('grade-exam', {
            body: {
              submissionId: submission.id,
              examId: submission.exam_id,
              answers: submission.answers || {},
              questions: questions
            }
          });

          if (gradeError) {
            console.error('Grading error for submission:', submission.id, gradeError);
            // Update to failed status
            await supabase
              .from('student_submissions')
              .update({ grading_status: 'failed' })
              .eq('id', submission.id);
            failCount++;
          } else {
            console.log('Successfully graded submission:', submission.id);
            successCount++;
          }

          // Small delay to avoid overwhelming the server
          await new Promise(resolve => setTimeout(resolve, 500));

        } catch (err) {
          console.error('Error processing submission:', submission.id, err);
          failCount++;
        }
      }

      setResults({
        success: successCount,
        failed: failCount,
        total: submissions.length
      });

      if (successCount > 0) {
        toast.success(`Successfully graded ${successCount} submission(s)!`);
      }
      if (failCount > 0) {
        toast.warning(`${failCount} submission(s) failed to grade. Check console for details.`);
      }

    } catch (error: any) {
      console.error('Error regrading submissions:', error);
      toast.error('Failed to regrade submissions: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          <CardTitle>Regrade Stuck Submissions</CardTitle>
        </div>
        <CardDescription>
          Find and regrade all submissions that are stuck in pending/processing status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-900">
                This will trigger grading for all ungraded submissions
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                The new grading system is ULTRA LENIENT - students get at least 70% for any coding attempt
                and generous marks for all question types. No more zeros!
              </p>
            </div>
          </div>
        </div>

        <Button 
          onClick={regradeStuckSubmissions}
          disabled={loading}
          className="w-full"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Grading Submissions...' : 'Grade All Stuck Submissions'}
        </Button>

        {results && (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <Card className="bg-green-50">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold text-green-600">{results.success}</p>
                      <p className="text-xs text-green-700">Success</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-red-50">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <div>
                      <p className="text-2xl font-bold text-red-600">{results.failed}</p>
                      <p className="text-xs text-red-700">Failed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{results.total}</p>
                      <p className="text-xs text-blue-700">Total</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};