import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calculator, 
  BookOpen, 
  Search, 
  Timer, 
  Save, 
  Flag,
  Brain,
  Target,
  TrendingUp,
  Award
} from 'lucide-react';
import { toast } from 'sonner';

interface ExamFeaturesProps {
  isExamActive: boolean;
  questionCount: number;
  timeRemaining: number;
}

export const ExamFeatures: React.FC<ExamFeaturesProps> = ({ 
  isExamActive, 
  questionCount, 
  timeRemaining 
}) => {
  const [calculator, setCalculator] = useState('');
  const [notes, setNotes] = useState('');
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const performCalculation = () => {
    try {
      // Safe evaluation for basic math operations
      const result = Function('"use strict"; return (' + calculator + ')')();
      setCalculator(result.toString());
      toast.success('Calculation completed');
    } catch (error) {
      toast.error('Invalid calculation');
      setCalculator('');
    }
  };

  const saveNotes = () => {
    localStorage.setItem('examNotes', notes);
    toast.success('Notes saved locally');
  };

  const flagQuestion = (questionIndex: number) => {
    setFlaggedQuestions(prev => 
      prev.includes(questionIndex) 
        ? prev.filter(q => q !== questionIndex)
        : [...prev, questionIndex]
    );
  };

  if (!isExamActive) return null;

  return (
    <div className="fixed bottom-4 left-4 w-80 z-40">
      <Card className="bg-white/95 backdrop-blur-sm shadow-lg border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Exam Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="calculator" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-3">
              <TabsTrigger value="calculator" className="text-xs">
                <Calculator className="h-3 w-3" />
              </TabsTrigger>
              <TabsTrigger value="notes" className="text-xs">
                <BookOpen className="h-3 w-3" />
              </TabsTrigger>
              <TabsTrigger value="flags" className="text-xs">
                <Flag className="h-3 w-3" />
              </TabsTrigger>
              <TabsTrigger value="stats" className="text-xs">
                <TrendingUp className="h-3 w-3" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calculator" className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter calculation..."
                  value={calculator}
                  onChange={(e) => setCalculator(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && performCalculation()}
                  className="text-sm"
                />
                <Button size="sm" onClick={performCalculation}>
                  =
                </Button>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {['7', '8', '9', '/'].map(btn => (
                  <Button key={btn} variant="outline" size="sm" 
                    onClick={() => setCalculator(prev => prev + btn)}
                    className="h-8 text-xs">
                    {btn}
                  </Button>
                ))}
                {['4', '5', '6', '*'].map(btn => (
                  <Button key={btn} variant="outline" size="sm" 
                    onClick={() => setCalculator(prev => prev + btn)}
                    className="h-8 text-xs">
                    {btn}
                  </Button>
                ))}
                {['1', '2', '3', '-'].map(btn => (
                  <Button key={btn} variant="outline" size="sm" 
                    onClick={() => setCalculator(prev => prev + btn)}
                    className="h-8 text-xs">
                    {btn}
                  </Button>
                ))}
                {['0', '.', 'C', '+'].map(btn => (
                  <Button key={btn} variant="outline" size="sm" 
                    onClick={() => btn === 'C' ? setCalculator('') : setCalculator(prev => prev + btn)}
                    className="h-8 text-xs">
                    {btn}
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="notes" className="space-y-2">
              <Textarea
                placeholder="Take notes here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="h-24 text-sm resize-none"
              />
              <Button size="sm" onClick={saveNotes} className="w-full">
                <Save className="h-3 w-3 mr-1" />
                Save Notes
              </Button>
            </TabsContent>

            <TabsContent value="flags" className="space-y-2">
              <div className="text-xs text-gray-600 mb-2">
                Flagged for Review: {flaggedQuestions.length}
              </div>
              <div className="flex flex-wrap gap-1">
                {flaggedQuestions.map(q => (
                  <Badge key={q} variant="outline" className="text-xs">
                    Q{q + 1}
                    <button
                      onClick={() => flagQuestion(q)}
                      className="ml-1 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              {flaggedQuestions.length === 0 && (
                <div className="text-xs text-gray-500 text-center py-4">
                  No questions flagged yet
                </div>
              )}
            </TabsContent>

            <TabsContent value="stats" className="space-y-2">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="font-semibold text-blue-600">{questionCount}</div>
                  <div className="text-gray-600">Total Questions</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded">
                  <div className="font-semibold text-green-600">
                    {Math.floor(timeRemaining / 60)}m
                  </div>
                  <div className="text-gray-600">Time Left</div>
                </div>
                <div className="text-center p-2 bg-yellow-50 rounded">
                  <div className="font-semibold text-yellow-600">{flaggedQuestions.length}</div>
                  <div className="text-gray-600">Flagged</div>
                </div>
                <div className="text-center p-2 bg-purple-50 rounded">
                  <div className="font-semibold text-purple-600">
                    {Math.round((1 - timeRemaining / (questionCount * 60)) * 100)}%
                  </div>
                  <div className="text-gray-600">Progress</div>
                </div>
              </div>
              
              <div className="mt-3 pt-2 border-t">
                <div className="text-xs font-medium mb-1">Performance Indicators</div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Pace</span>
                    <Badge variant="outline" className="text-xs">
                      {timeRemaining > questionCount * 30 ? 'Good' : 'Hurry'}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Focus Level</span>
                    <Badge variant="outline" className="text-xs">
                      {flaggedQuestions.length < 3 ? 'High' : 'Review Needed'}
                    </Badge>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};