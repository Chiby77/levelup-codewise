import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { StudentExamPortal } from '@/components/exam/StudentExamPortal';
import { ArrowLeft } from 'lucide-react';

export default function StudentExam() {
  const navigate = useNavigate();
  const location = useLocation();
  const examId = location.state?.examId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="p-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/student-dashboard')}
          className="flex items-center gap-2 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
      <StudentExamPortal onBack={() => navigate('/student-dashboard')} />
    </div>
  );
}
