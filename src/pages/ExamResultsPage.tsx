import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ExamResults } from '@/components/exam/ExamResults';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function ExamResultsPage() {
  const { submissionId } = useParams<{ submissionId: string }>();
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!submissionId) {
        navigate('/submission-history');
        return;
      }
      const { data, error } = await supabase
        .from('student_submissions')
        .select('student_name, student_email')
        .eq('id', submissionId)
        .maybeSingle();
      if (error || !data) {
        toast.error('Could not load this submission');
        navigate('/submission-history');
        return;
      }
      setStudentData({ name: data.student_name || 'Student', email: data.student_email || '' });
      setLoading(false);
    })();
  }, [submissionId, navigate]);

  if (loading || !studentData || !submissionId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="container mx-auto p-4">
        <Button variant="outline" onClick={() => navigate('/submission-history')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to History
        </Button>
      </div>
      <ExamResults
        submissionId={submissionId}
        studentData={studentData}
        onReturnToPortal={() => navigate('/submission-history')}
      />
    </div>
  );
}
