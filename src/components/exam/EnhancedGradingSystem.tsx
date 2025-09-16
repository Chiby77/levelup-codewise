import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Check, X, Clock, BarChart3, FileText, MessageSquare, Send, Bot, Star, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EnhancedGradingSystemProps {
  submission: any;
  questions: any[];
  onGradingComplete: (gradedSubmission: any) => void;
}

interface GradingCriteria {
  correctness: number;
  codeQuality: number;
  efficiency: number;
  documentation: number;
}

export const EnhancedGradingSystem: React.FC<EnhancedGradingSystemProps> = ({
  submission,
  questions,
  onGradingComplete
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [grades, setGrades] = useState<Record<string, any>>({});
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [isAIGrading, setIsAIGrading] = useState(false);
  const [gradingCriteria, setGradingCriteria] = useState<GradingCriteria>({
    correctness: 40,
    codeQuality: 25,
    efficiency: 20,
    documentation: 15
  });
  const [rubric, setRubric] = useState<string>('standard');

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = submission.answers[currentQuestion?.id] || '';

  const handleQuestionGrade = (questionId: string, score: number, maxScore: number, feedback: string) => {
    setGrades(prev => ({
      ...prev,
      [questionId]: { score, maxScore, feedback }
    }));
  };

  const calculateTotalScore = () => {
    const totalScore = Object.values(grades).reduce((sum: number, grade: any) => sum + grade.score, 0);
    const maxScore = Object.values(grades).reduce((sum: number, grade: any) => sum + grade.maxScore, 0);
    return { totalScore, maxScore };
  };

  const handleAIGrading = async () => {
    setIsAIGrading(true);
    try {
      for (const question of questions) {
        const answer = submission.answers[question.id];
        if (answer) {
          const { data, error } = await supabase.functions.invoke('enhanced-ai', {
            body: {
              action: 'grade_answer',
              question: question.question_text,
              answer: answer,
              questionType: question.question_type,
              maxMarks: question.marks,
              rubric: rubric,
              criteria: gradingCriteria
            }
          });

          if (error) throw error;

          const aiGrade = data.grade;
          setGrades(prev => ({
            ...prev,
            [question.id]: {
              score: aiGrade.score,
              maxScore: question.marks,
              feedback: aiGrade.feedback,
              aiGenerated: true,
              breakdown: aiGrade.breakdown
            }
          }));
        }
      }
      toast.success('AI grading completed successfully!');
    } catch (error) {
      console.error('AI grading error:', error);
      toast.error('AI grading failed. Please grade manually.');
    } finally {
      setIsAIGrading(false);
    }
  };

  const submitGrading = async () => {
    try {
      const { totalScore, maxScore } = calculateTotalScore();
      const percentage = (totalScore / maxScore) * 100;
      
      const { error } = await supabase
        .from('student_submissions')
        .update({
          score: totalScore,
          max_score: maxScore,
          percentage: percentage,
          detailed_grades: grades,
          grading_status: 'graded',
          graded_at: new Date().toISOString(),
          graded_by: 'manual' // Could be user ID in real implementation
        })
        .eq('id', submission.id);

      if (error) throw error;

      toast.success('Grading completed successfully!');
      onGradingComplete({ ...submission, score: totalScore, max_score: maxScore, percentage });
    } catch (error) {
      console.error('Error submitting grades:', error);
      toast.error('Failed to submit grades');
    }
  };

  const renderQuestionGrading = () => {
    if (!currentQuestion) return null;

    const currentGrade = grades[currentQuestion.id] || { score: 0, maxScore: currentQuestion.marks, feedback: '' };

    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Question {currentQuestionIndex + 1}</span>
            <Badge variant="outline">{currentQuestion.marks} marks</Badge>
          </CardTitle>
          <p className="text-muted-foreground">{currentQuestion.question_text}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Student Answer */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Student Answer:</h4>
            {currentQuestion.question_type === 'coding' ? (
              <pre className="bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto text-sm">
                <code>{currentAnswer}</code>
              </pre>
            ) : (
              <p className="text-sm">{currentAnswer}</p>
            )}
          </div>

          {/* Grading Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Score</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="number"
                  min="0"
                  max={currentQuestion.marks}
                  value={currentGrade.score}
                  onChange={(e) => handleQuestionGrade(
                    currentQuestion.id,
                    parseInt(e.target.value) || 0,
                    currentQuestion.marks,
                    currentGrade.feedback
                  )}
                  className="w-20 px-2 py-1 text-sm border rounded"
                />
                <span className="text-sm text-muted-foreground">/ {currentQuestion.marks}</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Grade</label>
              <div className="mt-1">
                <Progress value={(currentGrade.score / currentQuestion.marks) * 100} className="h-2" />
                <span className="text-sm text-muted-foreground">
                  {((currentGrade.score / currentQuestion.marks) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Feedback */}
          <div>
            <label className="text-sm font-medium">Feedback</label>
            <Textarea
              value={currentGrade.feedback}
              onChange={(e) => handleQuestionGrade(
                currentQuestion.id,
                currentGrade.score,
                currentQuestion.marks,
                e.target.value
              )}
              placeholder="Provide detailed feedback for the student..."
              className="mt-1"
              rows={4}
            />
          </div>

          {/* AI-Generated Breakdown (if available) */}
          {currentGrade.breakdown && (
            <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
              <h5 className="font-semibold text-sm mb-2 flex items-center gap-1">
                <Bot className="h-4 w-4" />
                AI Analysis
              </h5>
              <div className="space-y-1 text-sm">
                <div>Correctness: {currentGrade.breakdown.correctness}/10</div>
                <div>Code Quality: {currentGrade.breakdown.codeQuality}/10</div>
                <div>Efficiency: {currentGrade.breakdown.efficiency}/10</div>
                <div>Documentation: {currentGrade.breakdown.documentation}/10</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const { totalScore, maxScore } = calculateTotalScore();
  const completedQuestions = Object.keys(grades).length;

  return (
    <div className="space-y-6">
      {/* Grading Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div>
              <h2 className="text-xl">Grading: {submission.student_name}</h2>
              <p className="text-sm text-muted-foreground">
                Submitted: {new Date(submission.submitted_at).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {totalScore} / {maxScore}
              </div>
              <div className="text-sm text-muted-foreground">
                {maxScore > 0 ? ((totalScore / maxScore) * 100).toFixed(1) : 0}%
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="text-sm">
                Progress: {completedQuestions} / {questions.length} questions graded
              </div>
              <Progress value={(completedQuestions / questions.length) * 100} className="w-32 h-2" />
            </div>
            
            <div className="flex gap-2">
              <Select value={rubric} onValueChange={setRubric}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="strict">Strict</SelectItem>
                  <SelectItem value="lenient">Lenient</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                onClick={handleAIGrading}
                disabled={isAIGrading}
                className="flex items-center gap-2"
              >
                {isAIGrading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                    AI Grading...
                  </>
                ) : (
                  <>
                    <Bot className="h-4 w-4" />
                    AI Grade All
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question Navigation */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm">Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {questions.map((question, index) => {
                const isGraded = grades[question.id];
                const isActive = index === currentQuestionIndex;
                
                return (
                  <Button
                    key={question.id}
                    variant={isActive ? 'default' : isGraded ? 'secondary' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => setCurrentQuestionIndex(index)}
                  >
                    <span className="mr-2">{index + 1}</span>
                    {isGraded && <Check className="h-4 w-4 ml-auto" />}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Question Grading */}
        <div className="lg:col-span-3">
          {renderQuestionGrading()}
        </div>
      </div>

      {/* Submit Grading */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">
                Total Score: <span className="font-semibold">{totalScore} / {maxScore}</span>
                {maxScore > 0 && (
                  <span className="ml-2">({((totalScore / maxScore) * 100).toFixed(1)}%)</span>
                )}
              </p>
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={completedQuestions !== questions.length}
                  className="font-semibold"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit Grading
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Submit Grading</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to submit the grading for {submission.student_name}?
                    <br />
                    <br />
                    Final Score: {totalScore} / {maxScore} ({maxScore > 0 ? ((totalScore / maxScore) * 100).toFixed(1) : 0}%)
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={submitGrading}>
                    Submit Grading
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};