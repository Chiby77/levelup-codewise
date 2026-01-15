import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Eye, Clock, CheckCircle, XCircle, ArrowLeft, ArrowRight, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  options: any;
  correct_answer: string | null;
  marks: number;
  order_number: number;
  sample_code?: string | null;
  programming_language?: string | null;
}

interface Exam {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  total_marks: number;
}

interface ExamPreviewProps {
  examId: string;
  onClose: () => void;
}

// Helper to format question text
const formatQuestionText = (text: string): string => {
  return text
    .replace(/\\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\s+/gm, '')
    .trim();
};

export const ExamPreview: React.FC<ExamPreviewProps> = ({ examId, onClose }) => {
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExamData();
  }, [examId]);

  const fetchExamData = async () => {
    try {
      const [examRes, questionsRes] = await Promise.all([
        supabase.from('exams').select('*').eq('id', examId).single(),
        supabase.from('questions').select('*').eq('exam_id', examId).order('order_number')
      ]);

      if (examRes.error) throw examRes.error;
      if (questionsRes.error) throw questionsRes.error;

      setExam(examRes.data);
      setQuestions(questionsRes.data || []);
    } catch (error) {
      console.error('Error fetching exam:', error);
      toast.error('Failed to load exam preview');
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentIndex];

  const handleAnswerChange = (value: string) => {
    if (currentQuestion) {
      setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
    }
  };

  const goNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const submitPreview = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    let total = 0;
    
    questions.forEach(q => {
      if (q.question_type === 'multiple_choice' && q.correct_answer) {
        total++;
        if (answers[q.id]?.toLowerCase().trim() === q.correct_answer.toLowerCase().trim()) {
          correct++;
        }
      }
    });
    
    return { correct, total };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!exam || questions.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No questions found for this exam.</p>
        <Button onClick={onClose} className="mt-4">Close</Button>
      </div>
    );
  }

  if (showResults) {
    const { correct, total } = calculateScore();
    
    return (
      <div className="space-y-6 max-h-[70vh] overflow-y-auto p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold">Preview Complete!</h3>
          <p className="text-muted-foreground mt-2">
            MCQ Score: {correct}/{total} ({total > 0 ? Math.round((correct/total) * 100) : 0}%)
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold">Question Review:</h4>
          {questions.map((q, idx) => {
            const userAnswer = answers[q.id] || 'Not answered';
            const isCorrect = q.question_type === 'multiple_choice' && 
              userAnswer.toLowerCase().trim() === (q.correct_answer || '').toLowerCase().trim();
            
            return (
              <Card key={q.id} className={`${q.question_type === 'multiple_choice' ? (isCorrect ? 'border-green-300 bg-green-50/50' : 'border-red-300 bg-red-50/50') : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <span className="font-medium text-sm">Q{idx + 1}.</span>
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap">{formatQuestionText(q.question_text)}</p>
                      <div className="mt-2 text-xs space-y-1">
                        <p><span className="text-muted-foreground">Your answer:</span> {userAnswer}</p>
                        {q.question_type === 'multiple_choice' && q.correct_answer && (
                          <p><span className="text-muted-foreground">Correct answer:</span> <span className="text-green-600 font-medium">{q.correct_answer}</span></p>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">{q.marks} marks</Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Button onClick={onClose} className="w-full">Close Preview</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Preview Header */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
        <div className="flex items-center gap-2 text-amber-700">
          <Eye className="h-4 w-4" />
          <span className="text-sm font-medium">Preview Mode - This is how students will see the exam</span>
        </div>
      </div>

      {/* Exam Info */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="font-semibold">{exam.title}</h3>
          <p className="text-sm text-muted-foreground">{exam.description}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" /> {exam.duration_minutes} mins
          </Badge>
          <Badge variant="outline" className="gap-1">
            <FileText className="h-3 w-3" /> {exam.total_marks} marks
          </Badge>
        </div>
      </div>

      {/* Question Navigator */}
      <div className="flex flex-wrap gap-1">
        {questions.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
              idx === currentIndex 
                ? 'bg-primary text-primary-foreground' 
                : answers[questions[idx].id] 
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {/* Current Question */}
      {currentQuestion && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Question {currentIndex + 1} of {questions.length}</CardTitle>
              <Badge>{currentQuestion.marks} marks</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="whitespace-pre-wrap text-sm">{formatQuestionText(currentQuestion.question_text)}</p>

            {currentQuestion.sample_code && (
              <pre className="bg-muted p-3 rounded-lg text-xs overflow-x-auto">
                <code>{currentQuestion.sample_code}</code>
              </pre>
            )}

            {currentQuestion.question_type === 'multiple_choice' && currentQuestion.options && (
              <RadioGroup
                value={answers[currentQuestion.id] || ''}
                onValueChange={handleAnswerChange}
                className="space-y-2"
              >
                {(Array.isArray(currentQuestion.options) ? currentQuestion.options : []).filter((opt: any) => opt && String(opt).trim()).map((option: any, idx: number) => (
                  <div key={idx} className="flex items-center space-x-2 p-2 rounded border hover:bg-muted/50">
                    <RadioGroupItem value={String(option)} id={`option-${idx}`} />
                    <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer text-sm">{String(option)}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {(currentQuestion.question_type === 'short_answer' || currentQuestion.question_type === 'coding') && (
              <Textarea
                placeholder={currentQuestion.question_type === 'coding' ? 'Write your code here...' : 'Type your answer here...'}
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="min-h-[120px] font-mono text-sm"
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between gap-2">
        <Button variant="outline" onClick={goPrev} disabled={currentIndex === 0}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Previous
        </Button>
        
        {currentIndex === questions.length - 1 ? (
          <Button onClick={submitPreview}>
            <CheckCircle className="h-4 w-4 mr-1" /> Finish Preview
          </Button>
        ) : (
          <Button onClick={goNext}>
            Next <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
};
