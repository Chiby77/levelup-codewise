import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, BookOpen } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ActiveExam {
  id: string;
  student_name: string;
  student_email: string;
  exam_id: string;
  exam_title?: string;
  submitted_at: string;
  grading_status: string;
  time_taken_minutes?: number;
}

export function LiveExamMonitoring() {
  const [activeExams, setActiveExams] = useState<ActiveExam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveExams();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('exam-monitoring')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'student_submissions'
        },
        (payload) => {
          console.log('Realtime submission update:', payload);
          fetchActiveExams();
        }
      )
      .subscribe();

    // Refresh every 10 seconds
    const interval = setInterval(fetchActiveExams, 10000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  const fetchActiveExams = async () => {
    try {
      // Get submissions from the last 2 hours that are either processing or recently submitted
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
      
      const { data: submissions, error: submissionsError } = await supabase
        .from('student_submissions')
        .select('*')
        .gte('submitted_at', twoHoursAgo)
        .order('submitted_at', { ascending: false });

      if (submissionsError) throw submissionsError;

      // Fetch exam details
      const examIds = [...new Set(submissions?.map(s => s.exam_id) || [])];
      const { data: exams, error: examsError } = await supabase
        .from('exams')
        .select('id, title')
        .in('id', examIds);

      if (examsError) throw examsError;

      const examMap = new Map(exams?.map(e => [e.id, e.title]) || []);

      const active = submissions?.map(sub => ({
        ...sub,
        exam_title: examMap.get(sub.exam_id)
      })) || [];

      setActiveExams(active);
    } catch (error) {
      console.error('Error fetching active exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Live Exam Monitoring</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="relative">
            <Clock className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          </div>
          Live Exam Monitoring
          <Badge variant="secondary">{activeExams.length} submissions</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeExams.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No recent exam activity
          </div>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {activeExams.map((exam) => (
              <div
                key={exam.id}
                className="flex items-start gap-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className={`w-2 h-2 rounded-full mt-2 ${getStatusColor(exam.grading_status)}`} />
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{exam.student_name}</span>
                    </div>
                    <Badge variant={exam.grading_status === 'completed' ? 'default' : 'secondary'}>
                      {exam.grading_status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="h-3 w-3" />
                    <span>{exam.exam_title || 'Unknown Exam'}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>📧 {exam.student_email}</span>
                    <span>⏱️ {exam.time_taken_minutes || 0} min</span>
                    <span>🕒 {formatDistanceToNow(new Date(exam.submitted_at), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
