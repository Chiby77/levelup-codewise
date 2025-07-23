import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Clock, ChevronLeft, ChevronRight, Send, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CodeEditor } from './CodeEditor';
import { FlowchartDrawer } from './FlowchartDrawer';

interface ExamInterfaceProps {
  exam: {
    id: string;
    title: string;
    duration_minutes: number;
    total_marks: number;
  };
  studentData: {
    name: string;
    email: string;
  };
  onComplete: (submissionId: string) => void;
}

interface Question {
  id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'coding' | 'flowchart' | 'short_answer';
  options?: any;
  correct_answer?: string;
  sample_code?: string;
  marks: number;
  order_number: number;
}

export const ExamInterface: React.FC<ExamInterfaceProps> = ({ exam, studentData, onComplete }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeLeft, setTimeLeft] = useState(exam.duration_minutes * 60);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    fetchQuestions();
    startTimer();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('exam_id', exam.id)
        .order('order_number');

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleAutoSubmit = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    toast.warning('Time expired! Submitting your exam...');
    await submitExam();
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const updateAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const navigateQuestion = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (direction === 'next' && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const submitExam = async () => {
    setSubmitting(true);
    try {
      const timeTaken = Math.round((exam.duration_minutes * 60 - timeLeft) / 60);
      
      // Calculate total possible marks
      const maxScore = questions.reduce((total, q) => total + q.marks, 0);

      const submissionData = {
        exam_id: exam.id,
        student_name: studentData.name,
        student_email: studentData.email || null,
        answers: answers,
        time_taken_minutes: timeTaken,
        max_score: maxScore
      };

      const { data, error } = await supabase
        .from('student_submissions')
        .insert(submissionData)
        .select()
        .single();

      if (error) throw error;

      // Trigger AI grading
      const { error: gradeError } = await supabase.functions.invoke('grade-exam', {
        body: { 
          submissionId: data.id,
          examId: exam.id,
          answers: answers,
          questions: questions
        }
      });

      if (gradeError) {
        console.error('Grading error:', gradeError);
        toast.warning('Exam submitted successfully, but grading failed. Please contact administrator.');
      } else {
        toast.success('Exam submitted and graded successfully!');
      }

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      onComplete(data.id);
    } catch (error) {
      console.error('Error submitting exam:', error);
      toast.error('Failed to submit exam. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading exam...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">{exam.title}</h1>
              <p className="text-muted-foreground">Student: {studentData.name}</p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span className={`text-lg font-mono ${timeLeft < 300 ? 'text-red-600 animate-pulse' : ''}`}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Time Remaining</p>
              </div>
              
              <div className="text-center">
                <p className="text-lg font-semibold">{answeredCount}/{questions.length}</p>
                <p className="text-xs text-muted-foreground">Answered</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Question */}
        {currentQuestion && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    Question {currentQuestionIndex + 1}
                  </CardTitle>
                  <p className="text-muted-foreground mt-2">
                    {currentQuestion.question_text}
                  </p>
                </div>
                <Badge variant="outline">
                  {currentQuestion.marks} marks
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <QuestionRenderer
                question={currentQuestion}
                answer={answers[currentQuestion.id]}
                onAnswerChange={(answer) => updateAnswer(currentQuestion.id, answer)}
              />
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => navigateQuestion('prev')}
            disabled={currentQuestionIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            {questions.map((_, index) => (
              <Button
                key={index}
                variant={index === currentQuestionIndex ? 'default' : answers[questions[index].id] ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setCurrentQuestionIndex(index)}
                className="w-10 h-10"
              >
                {index + 1}
              </Button>
            ))}
          </div>

          {currentQuestionIndex === questions.length - 1 ? (
            <Button onClick={() => setShowSubmitDialog(true)}>
              <Send className="h-4 w-4 mr-2" />
              Submit Exam
            </Button>
          ) : (
            <Button onClick={() => navigateQuestion('next')}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Submit Confirmation Dialog */}
        <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Submit Examination
              </DialogTitle>
              <DialogDescription className="space-y-3">
                <p>Are you sure you want to submit your exam?</p>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm">
                    • Questions answered: {answeredCount} of {questions.length}
                  </p>
                  <p className="text-sm">
                    • Time remaining: {formatTime(timeLeft)}
                  </p>
                  <p className="text-sm">
                    • Once submitted, you cannot make changes
                  </p>
                </div>
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
                Review Answers
              </Button>
              <Button onClick={submitExam} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Exam'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

interface QuestionRendererProps {
  question: Question;
  answer: any;
  onAnswerChange: (answer: any) => void;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({ question, answer, onAnswerChange }) => {
  switch (question.question_type) {
    case 'multiple_choice':
      return (
        <RadioGroup value={answer || ''} onValueChange={onAnswerChange}>
          {question.options?.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      );

    case 'coding':
      return (
        <CodeEditor
          initialCode={question.sample_code || ''}
          value={answer || question.sample_code || ''}
          onChange={onAnswerChange}
        />
      );

    case 'flowchart':
      return (
        <FlowchartDrawer
          value={answer}
          onChange={onAnswerChange}
        />
      );

    case 'short_answer':
      return (
        <Textarea
          placeholder="Enter your answer here..."
          value={answer || ''}
          onChange={(e) => onAnswerChange(e.target.value)}
          className="min-h-[120px]"
        />
      );

    default:
      return <div>Unknown question type</div>;
  }
};