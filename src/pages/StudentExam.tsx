import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { StudentExamPortal } from '@/components/exam/StudentExamPortal';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function StudentExam() {
  const navigate = useNavigate();
  const location = useLocation();
  const examId: string | null = location.state?.examId ?? null;
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      if (!session) navigate('/auth');
      else setChecking(false);
    });
    return () => { mounted = false; };
  }, [navigate]);

  if (checking) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="p-3 sm:p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/student-dashboard')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
      <StudentExamPortal
        onBack={() => navigate('/student-dashboard')}
        initialExamId={examId}
      />
    </div>
  );
}
