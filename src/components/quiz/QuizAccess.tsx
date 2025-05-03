
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { BookCheck, Brain, Code, Database, Network, Shield } from 'lucide-react';
import { QuizComponent } from './QuizComponent';

interface QuizAccessProps {
  onClose?: () => void;
}

export function QuizAccess({ onClose }: QuizAccessProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [quizStarted, setQuizStarted] = useState(false);

  const quizCategories = [
    { id: 'algorithms', name: 'Algorithms', icon: <Code className="w-5 h-5 text-blue-500" /> },
    { id: 'data-structures', name: 'Data Structures', icon: <Database className="w-5 h-5 text-green-500" /> },
    { id: 'networking', name: 'Networking', icon: <Network className="w-5 h-5 text-purple-500" /> },
    { id: 'security', name: 'Security', icon: <Shield className="w-5 h-5 text-red-500" /> },
    { id: 'general', name: 'General Computer Science', icon: <Brain className="w-5 h-5 text-amber-500" /> }
  ];

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const handleQuizFinish = () => {
    setQuizStarted(false);
    setSelectedCategory(undefined);
    if (onClose) onClose();
  };

  if (quizStarted) {
    return <QuizComponent category={selectedCategory} onFinish={handleQuizFinish} />;
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookCheck className="w-5 h-5 text-primary" />
          Knowledge Assessment Quizzes
        </CardTitle>
        <CardDescription>
          Test your computer science knowledge with our interactive quizzes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Select a category</h3>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Choose quiz category" />
              </SelectTrigger>
              <SelectContent>
                {quizCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id} className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      {category.icon}
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {quizCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className="flex items-center justify-start gap-2 h-auto py-3 px-4"
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2">
                    {category.icon}
                    <span className="font-medium">{category.name}</span>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {onClose && (
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button onClick={startQuiz} disabled={!selectedCategory}>
          Start Quiz
        </Button>
      </CardFooter>
    </Card>
  );
}
