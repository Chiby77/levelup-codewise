
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '../ui/card';
import { Button } from '../ui/button';
import { 
  AlertTriangle, 
  BookOpen, 
  CheckCircle2, 
  Check, 
  HelpCircle, 
  X, 
  RotateCcw, 
  Database, 
  Network, 
  Shield, 
  Brain, 
  Code
} from 'lucide-react';
import { QuizQuestion } from '@/types/universityPrograms';
import { getQuizQuestions } from '@/utils/ai/quiz/quizData';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { toast } from '../ui/use-toast';

interface QuizComponentProps {
  onFinish: () => void;
  category?: string;
}

export function QuizComponent({ onFinish, category }: QuizComponentProps) {
  const [questions] = useState<QuizQuestion[]>(getQuizQuestions(5, category));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const handleOptionSelect = (optionIndex: number) => {
    if (hasAnswered) return;
    setSelectedOption(optionIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) {
      toast({
        title: "Please select an answer",
        description: "You need to select an option before submitting your answer.",
        variant: "destructive",
      });
      return;
    }

    setHasAnswered(true);
    const isCorrect = selectedOption === questions[currentQuestionIndex].correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      toast({
        title: "Correct!",
        description: "Well done! That's the right answer.",
        variant: "default",
      });
    } else {
      toast({
        title: "Incorrect",
        description: questions[currentQuestionIndex].explanation,
        variant: "destructive",
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      setQuizComplete(true);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'data structures':
        return <Database className="w-4 h-4" />;
      case 'algorithms':
        return <Code className="w-4 h-4" />;
      case 'networking':
        return <Network className="w-4 h-4" />;
      case 'security':
        return <Shield className="w-4 h-4" />;
      default:
        return <Brain className="w-4 h-4" />;
    }
  };

  const handleRestartQuiz = () => {
    window.location.reload();
  };

  if (quizComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    let feedback = "You did well!";
    
    if (percentage < 40) {
      feedback = "Keep studying and try again!";
    } else if (percentage < 70) {
      feedback = "Good effort! With more practice, you'll improve!";
    } else if (percentage < 90) {
      feedback = "Great job! You have a solid understanding!";
    } else {
      feedback = "Excellent! You've mastered this subject!";
    }

    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Quiz Results</CardTitle>
          <CardDescription className="text-center">
            You scored {score} out of {questions.length}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <div className="w-full max-w-md">
            <Progress value={percentage} className="h-3" />
          </div>
          <div className="text-4xl font-bold">{percentage}%</div>
          <p className="text-center text-muted-foreground">{feedback}</p>
          
          {percentage >= 70 ? (
            <div className="flex items-center gap-2 text-green-500">
              <CheckCircle2 />
              <span>Congratulations on passing the quiz!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-amber-500">
              <AlertTriangle />
              <span>Keep learning and try again to improve your score!</span>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-4 justify-center">
          <Button onClick={handleRestartQuiz} variant="outline" className="flex gap-2">
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </Button>
          <Button onClick={onFinish}>Return to Chat</Button>
        </CardFooter>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <Badge variant="outline" className="flex gap-1 items-center">
            <HelpCircle className="w-3 h-3" />
            <span>Question {currentQuestionIndex + 1}/{questions.length}</span>
          </Badge>
          <Badge variant={currentQuestion.difficulty === 'easy' ? 'secondary' : 
                          currentQuestion.difficulty === 'medium' ? 'default' : 'destructive'}>
            {currentQuestion.difficulty}
          </Badge>
        </div>
        <Badge className="self-start flex gap-1 items-center">
          {getCategoryIcon(currentQuestion.category)}
          {currentQuestion.category}
        </Badge>
        <CardTitle className="text-lg mt-2">{currentQuestion.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {currentQuestion.options.map((option, index) => (
          <Button
            key={index}
            variant={selectedOption === index 
              ? hasAnswered 
                ? index === currentQuestion.correctAnswer
                  ? "default"
                  : "destructive"
                : "default" 
              : "outline"}
            className={`w-full justify-start text-left ${
              hasAnswered && index === currentQuestion.correctAnswer 
                ? "border-green-500 bg-green-50 dark:bg-green-900/20" 
                : ""
            }`}
            onClick={() => handleOptionSelect(index)}
            disabled={hasAnswered}
          >
            <div className="flex items-center w-full">
              {/* Show check or X only after answering */}
              {hasAnswered && index === selectedOption && selectedOption !== currentQuestion.correctAnswer && (
                <X className="mr-2 w-4 h-4 text-red-500" />
              )}
              {hasAnswered && index === currentQuestion.correctAnswer && (
                <Check className="mr-2 w-4 h-4 text-green-500" />
              )}
              
              <span>{option}</span>
            </div>
          </Button>
        ))}

        {hasAnswered && (
          <div className="mt-4 p-3 border rounded-md bg-muted/50">
            <div className="flex items-center gap-2 font-medium mb-2">
              <BookOpen className="w-4 h-4" />
              <span>Explanation:</span>
            </div>
            <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Score: {score}/{currentQuestionIndex + (hasAnswered ? 1 : 0)}
        </div>
        {!hasAnswered ? (
          <Button onClick={handleSubmitAnswer} disabled={selectedOption === null}>
            Submit Answer
          </Button>
        ) : (
          <Button onClick={handleNextQuestion}>
            {currentQuestionIndex < questions.length - 1 ? "Next Question" : "See Results"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
