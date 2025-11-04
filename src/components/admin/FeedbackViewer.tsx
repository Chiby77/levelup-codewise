import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, MessageSquare, Star, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

interface Feedback {
  id: string;
  user_id: string;
  exam_id: string | null;
  feedback_text: string;
  rating: number | null;
  submitted_at: string;
  exam_title?: string;
}

export function FeedbackViewer() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [examFilter, setExamFilter] = useState<string>('all');
  const [exams, setExams] = useState<any[]>([]);

  useEffect(() => {
    fetchFeedback();
    fetchExams();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('feedback-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'student_feedback'
        },
        () => {
          console.log('New feedback received');
          fetchFeedback();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    applyFilters();
  }, [feedbacks, ratingFilter, examFilter]);

  const fetchFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from('student_feedback')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      // Fetch exam titles
      const examIds = [...new Set(data?.filter(f => f.exam_id).map(f => f.exam_id) || [])];
      if (examIds.length > 0) {
        const { data: examsData } = await supabase
          .from('exams')
          .select('id, title')
          .in('id', examIds);

        const examMap = new Map(examsData?.map(e => [e.id, e.title]) || []);
        const feedbackWithExams = data?.map(f => ({
          ...f,
          exam_title: f.exam_id ? examMap.get(f.exam_id) : 'General Feedback'
        }));
        setFeedbacks(feedbackWithExams || []);
      } else {
        setFeedbacks(data || []);
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
      toast.error('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  const fetchExams = async () => {
    try {
      const { data, error } = await supabase
        .from('exams')
        .select('id, title')
        .order('title');

      if (error) throw error;
      setExams(data || []);
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...feedbacks];

    if (ratingFilter !== 'all') {
      filtered = filtered.filter(f => f.rating === parseInt(ratingFilter));
    }

    if (examFilter !== 'all') {
      if (examFilter === 'general') {
        filtered = filtered.filter(f => !f.exam_id);
      } else {
        filtered = filtered.filter(f => f.exam_id === examFilter);
      }
    }

    setFilteredFeedbacks(filtered);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let yPos = 20;

    // Title
    doc.setFontSize(18);
    doc.text('Student Feedback Report', margin, yPos);
    yPos += 10;

    // Date
    doc.setFontSize(10);
    doc.text(`Generated: ${format(new Date(), 'PPP')}`, margin, yPos);
    yPos += 10;

    // Statistics
    const avgRating = filteredFeedbacks.reduce((acc, f) => acc + (f.rating || 0), 0) / filteredFeedbacks.length;
    doc.text(`Total Feedback: ${filteredFeedbacks.length}`, margin, yPos);
    yPos += 5;
    doc.text(`Average Rating: ${avgRating.toFixed(1)} / 5`, margin, yPos);
    yPos += 15;

    // Feedback items
    doc.setFontSize(12);
    filteredFeedbacks.forEach((feedback, index) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }

      // Feedback header
      doc.setFont('helvetica', 'bold');
      doc.text(`Feedback #${index + 1}`, margin, yPos);
      yPos += 6;

      // Details
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      
      if (feedback.exam_title) {
        doc.text(`Exam: ${feedback.exam_title}`, margin + 5, yPos);
        yPos += 5;
      }

      if (feedback.rating) {
        doc.text(`Rating: ${'⭐'.repeat(feedback.rating)} (${feedback.rating}/5)`, margin + 5, yPos);
        yPos += 5;
      }

      doc.text(`Date: ${format(new Date(feedback.submitted_at), 'PPP')}`, margin + 5, yPos);
      yPos += 5;

      // Feedback text
      const splitText = doc.splitTextToSize(feedback.feedback_text, pageWidth - 2 * margin - 5);
      doc.text(splitText, margin + 5, yPos);
      yPos += splitText.length * 5 + 10;
    });

    doc.save(`feedback-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    toast.success('PDF exported successfully!');
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Student Feedback</CardTitle>
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
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Student Feedback
            <Badge variant="secondary">{filteredFeedbacks.length}</Badge>
          </CardTitle>
          <Button onClick={exportToPDF} disabled={filteredFeedbacks.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">⭐⭐⭐⭐⭐ (5 stars)</SelectItem>
                <SelectItem value="4">⭐⭐⭐⭐ (4 stars)</SelectItem>
                <SelectItem value="3">⭐⭐⭐ (3 stars)</SelectItem>
                <SelectItem value="2">⭐⭐ (2 stars)</SelectItem>
                <SelectItem value="1">⭐ (1 star)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Select value={examFilter} onValueChange={setExamFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by exam" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Exams</SelectItem>
                <SelectItem value="general">General Feedback</SelectItem>
                {exams.map(exam => (
                  <SelectItem key={exam.id} value={exam.id}>
                    {exam.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Feedback list */}
        {filteredFeedbacks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No feedback found
          </div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {filteredFeedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {feedback.rating && (
                      <div className="flex items-center gap-1">
                        {Array.from({ length: feedback.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    )}
                    {feedback.exam_title && (
                      <Badge variant="outline">{feedback.exam_title}</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(feedback.submitted_at), 'PPp')}
                  </div>
                </div>
                <p className="text-sm whitespace-pre-wrap">{feedback.feedback_text}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
