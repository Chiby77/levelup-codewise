import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Clock, ChevronLeft, ChevronRight, Send, AlertTriangle, Shield } from 'lucide-react';
import MotivationalQuotes from '../MotivationalQuotes';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CodeEditor } from './CodeEditor';
import { FlowchartDrawer } from './FlowchartDrawer';
import { AIInvigilator } from './AIInvigilator';
import { TabPreventionSystem } from './TabPreventionSystem';
import { ExamFeatures } from './ExamFeatures';

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
  programming_language?: string;
}

export const ExamInterface: React.FC<ExamInterfaceProps> = ({ exam, studentData, onComplete }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeLeft, setTimeLeft] = useState(exam.duration_minutes * 60);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [violations, setViolations] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    fetchQuestions();
    startTimer();
    enableFullscreen();
    setupExamSecurity();
    
    // Prevent browser back button
    window.history.pushState(null, '', window.location.href);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      exitFullscreen();
      removeExamSecurity();
    };
  }, []);

  const enableFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
        toast.success('Exam mode activated - Full screen enabled');
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
      toast.warning('Could not enable fullscreen mode');
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen && document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const setupExamSecurity = () => {
    // Prevent tab switching and window focus loss
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount(prev => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            toast.error('Too many tab switches! Exam will be submitted automatically.');
            setTimeout(submitExam, 2000);
          } else {
            toast.warning(`Warning: Tab switching detected (${newCount}/3). Exam will auto-submit after 3 violations.`);
          }
          return newCount;
        });
        setViolations(prev => [...prev, 'Tab switching detected']);
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to leave the exam? Your progress will be lost.';
      return 'Are you sure you want to leave the exam? Your progress will be lost.';
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent common shortcuts that might be used to cheat
      if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 't' || e.key === 'n' || e.key === 'w')) ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J')
      ) {
        e.preventDefault();
        toast.warning('This action is not allowed during the exam');
        setViolations(prev => [...prev, `Blocked keyboard shortcut: ${e.key}`]);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('keydown', handleKeyDown);

    // Store handlers for cleanup
    (window as any)._examSecurityHandlers = {
      handleVisibilityChange,
      handleBeforeUnload,
      handleKeyDown
    };
  };

  const removeExamSecurity = () => {
    const handlers = (window as any)._examSecurityHandlers;
    if (handlers) {
      document.removeEventListener('visibilitychange', handlers.handleVisibilityChange);
      window.removeEventListener('beforeunload', handlers.handleBeforeUnload);
      document.removeEventListener('keydown', handlers.handleKeyDown);
    }
  };

  const handleViolation = (violation: string) => {
    setViolations(prev => [...prev, violation]);
  };

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
    toast.warning('Time expired! Submitting your exam automatically...');
    // Ensure grading happens even on auto-submit
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
    if (submitting) return; // Prevent double submission
    
    setSubmitting(true);
    setShowSubmitDialog(false);
    
    try {
      // Get authenticated user's email
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Authentication required to submit exam');
        setSubmitting(false);
        return;
      }

      const timeTaken = Math.round((exam.duration_minutes * 60 - timeLeft) / 60);
      
      // Calculate total possible marks
      const maxScore = questions.reduce((total, q) => total + q.marks, 0);

      console.log('Submitting exam with answers:', answers);

      const submissionData = {
        exam_id: exam.id,
        student_name: studentData.name,
        student_email: user.email,
        answers: answers,
        time_taken_minutes: timeTaken,
        max_score: maxScore,
        grading_status: 'processing'
      };

      const { data, error } = await supabase
        .from('student_submissions')
        .insert(submissionData)
        .select()
        .single();

      if (error) {
        console.error('Submission error:', error);
        throw error;
      }

      console.log('Submission created:', data.id);

      // Trigger AI grading immediately - don't let it fail silently
      console.log('Triggering grading for submission:', data.id);
      try {
        const { data: gradeData, error: gradeError } = await supabase.functions.invoke('grade-exam', {
          body: { 
            submissionId: data.id,
            examId: exam.id,
            answers: answers,
            questions: questions
          }
        });

        if (gradeError) {
          console.error('Grading error:', gradeError);
          // Update submission status to indicate grading needed
          await supabase
            .from('student_submissions')
            .update({ grading_status: 'failed' })
            .eq('id', data.id);
          toast.warning('Exam submitted! Grading will be retried shortly.');
        } else {
          console.log('Grading completed:', gradeData);
          toast.success('Exam submitted and graded successfully!');
        }
      } catch (gradeErr) {
        console.error('Grading invocation error:', gradeErr);
        // Update submission status to indicate grading needed
        await supabase
          .from('student_submissions')
          .update({ grading_status: 'failed' })
          .eq('id', data.id);
        toast.warning('Exam submitted! Grading will be completed shortly.');
      }

      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Navigate to results
      setTimeout(() => {
        onComplete(data.id);
      }, 1000);
      
    } catch (error: any) {
      console.error('Error submitting exam:', error);
      toast.error(error.message || 'Failed to submit exam. Please try again.');
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

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No questions available for this exam.</p>
          <Button onClick={() => window.location.reload()}>Reload</Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  // Format question text nicely - handle poorly formatted admin input
  const formatQuestionText = (text: string) => {
    if (!text) return '';
    // Clean up whitespace, handle line breaks, fix common formatting issues
    return text
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\n{3,}/g, '\n\n') // Max 2 line breaks
      .replace(/^\s+|\s+$/g, '') // Trim whitespace
      .split('\n')
      .map(line => line.trim())
      .join('\n');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 pb-safe">
      {/* AI Invigilation System */}
      <AIInvigilator 
        isActive={true} 
        onViolationDetected={handleViolation}
      />
      
      {/* Exam Features & Tools - Hidden on mobile to prevent UI interference */}
      <div className="hidden sm:block">
        <ExamFeatures 
          isExamActive={true}
          questionCount={questions.length}
          timeRemaining={timeLeft}
        />
      </div>
      
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
        {/* Compact Mobile Header */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border p-2 sm:p-4 mb-3 sm:mb-6">
          {/* Title Row */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <h1 className="text-base sm:text-2xl font-bold truncate flex-1">{exam.title}</h1>
            <Badge variant="outline" className="shrink-0">
              {currentQuestion?.marks || 0} marks
            </Badge>
          </div>
          
          {/* Stats Row - Compact on mobile */}
          <div className="grid grid-cols-4 gap-1 sm:gap-4 text-center mb-2">
            <div className="bg-muted/50 rounded p-1 sm:p-2">
              <div className={`text-sm sm:text-lg font-mono font-bold ${timeLeft < 300 ? 'text-red-600 animate-pulse' : ''}`}>
                {formatTime(timeLeft)}
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Time</p>
            </div>
            
            <div className="bg-muted/50 rounded p-1 sm:p-2">
              <p className="text-sm sm:text-lg font-semibold">{answeredCount}/{questions.length}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Done</p>
            </div>
            
            <div className="bg-muted/50 rounded p-1 sm:p-2">
              <span className={`text-sm sm:text-lg font-semibold ${violations.length > 5 ? 'text-red-600' : violations.length > 2 ? 'text-yellow-600' : 'text-green-600'}`}>
                {violations.length}
              </span>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Alerts</p>
            </div>
            
            <div className="bg-muted/50 rounded p-1 sm:p-2">
              <span className={`text-sm sm:text-lg font-semibold ${tabSwitchCount >= 2 ? 'text-red-600' : tabSwitchCount >= 1 ? 'text-yellow-600' : 'text-green-600'}`}>
                {tabSwitchCount}/3
              </span>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Tabs</p>
            </div>
          </div>
          
          {/* Progress */}
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Q{currentQuestionIndex + 1}/{questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1.5 sm:h-2" />
          </div>
        </div>

        {/* Question */}
        {currentQuestion && (
          <Card className="mb-3 sm:mb-6">
            <CardHeader className="p-3 sm:p-6 pb-2 sm:pb-4">
              <CardTitle className="text-sm sm:text-lg flex items-center gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm">
                  {currentQuestionIndex + 1}
                </span>
                Question
              </CardTitle>
              {/* Nicely formatted question text */}
              <div className="mt-2 sm:mt-3 text-sm sm:text-base text-foreground leading-relaxed whitespace-pre-wrap break-words">
                {formatQuestionText(currentQuestion.question_text)}
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
              <QuestionRenderer
                question={currentQuestion}
                answer={answers[currentQuestion.id]}
                onAnswerChange={(answer) => updateAnswer(currentQuestion.id, answer)}
              />
            </CardContent>
          </Card>
        )}

        {/* Navigation - Optimized for mobile */}
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Question Navigator - Scrollable on mobile */}
          <div className="overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
            <div className="flex gap-1 sm:gap-2 min-w-max justify-start sm:justify-center">
              {questions.map((_, index) => (
                <Button
                  key={index}
                  variant={index === currentQuestionIndex ? 'default' : answers[questions[index].id] ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentQuestionIndex(index)}
                  className="w-7 h-7 sm:w-10 sm:h-10 text-xs sm:text-sm p-0 shrink-0"
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Prev/Next Buttons */}
          <div className="flex justify-between gap-2">
            <Button
              variant="outline"
              onClick={() => navigateQuestion('prev')}
              disabled={currentQuestionIndex === 0}
              className="flex-1 sm:flex-none"
              size="sm"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Prev
            </Button>

            {currentQuestionIndex === questions.length - 1 ? (
              <Button onClick={() => setShowSubmitDialog(true)} className="flex-1 sm:flex-none" size="sm">
                <Send className="h-4 w-4 mr-1" />
                Submit
              </Button>
            ) : (
              <Button onClick={() => navigateQuestion('next')} className="flex-1 sm:flex-none" size="sm">
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
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
      
      {/* Motivational Quotes for Exam */}
      <MotivationalQuotes showExamQuotes={true} />
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
          language={question.programming_language || 'python'}
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