import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Code, FileText, Sparkles, Brain } from 'lucide-react';
import { toast } from 'sonner';

interface Question {
  id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'coding' | 'flowchart' | 'short_answer';
  options: string[];
  correct_answer: string;
  sample_code: string;
  marks: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  order_number: number;
}

interface EnhancedQuestionBuilderProps {
  onQuestionAdd: (question: Question) => void;
}

export const EnhancedQuestionBuilder: React.FC<EnhancedQuestionBuilderProps> = ({
  onQuestionAdd
}) => {
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    question_text: '',
    question_type: 'multiple_choice',
    options: ['', '', '', ''],
    correct_answer: '',
    sample_code: '',
    marks: 10,
    difficulty: 'medium',
    category: ''
  });

  const questionTypes = [
    { value: 'multiple_choice', label: 'Multiple Choice', icon: '📝' },
    { value: 'coding', label: 'Coding', icon: '💻' },
    { value: 'flowchart', label: 'Flowchart', icon: '📊' },
    { value: 'short_answer', label: 'Short Answer', icon: '✍️' }
  ];

  const addQuestion = () => {
    if (!currentQuestion.question_text?.trim()) {
      toast.error('Please enter a question');
      return;
    }

    const newQuestion: Question = {
      id: Date.now().toString(),
      question_text: currentQuestion.question_text,
      question_type: currentQuestion.question_type || 'multiple_choice',
      options: currentQuestion.options || [],
      correct_answer: currentQuestion.correct_answer || '',
      sample_code: currentQuestion.sample_code || '',
      marks: currentQuestion.marks || 10,
      difficulty: currentQuestion.difficulty || 'medium',
      category: currentQuestion.category || '',
      order_number: 0
    };

    onQuestionAdd(newQuestion);
    
    // Reset form with animation
    setCurrentQuestion({
      question_text: '',
      question_type: 'multiple_choice',
      options: ['', '', '', ''],
      correct_answer: '',
      sample_code: '',
      marks: 10,
      difficulty: 'medium',
      category: ''
    });
    
    toast.success('Question added successfully! ✨');
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(currentQuestion.options || ['', '', '', ''])];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const addOption = () => {
    const newOptions = [...(currentQuestion.options || []), ''];
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = (currentQuestion.options || []).filter((_, i) => i !== index);
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-primary/20 hover:border-primary/40 transition-all">
        <CardHeader className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Question Builder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Question Text */}
          <motion.div 
            className="space-y-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Label htmlFor="question" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Question Text *
            </Label>
            <Textarea
              id="question"
              value={currentQuestion.question_text}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, question_text: e.target.value })}
              placeholder="Enter your question here..."
              className="min-h-[100px] focus:border-primary transition-all"
            />
          </motion.div>

          {/* Question Type & Difficulty */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div 
              className="space-y-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Label>Question Type</Label>
              <Select 
                value={currentQuestion.question_type} 
                onValueChange={(value: any) => setCurrentQuestion({ ...currentQuestion, question_type: value })}
              >
                <SelectTrigger className="focus:ring-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {questionTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <span className="flex items-center gap-2">
                        <span>{type.icon}</span>
                        {type.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div 
              className="space-y-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              <Label>Difficulty</Label>
              <Select 
                value={currentQuestion.difficulty} 
                onValueChange={(value: any) => setCurrentQuestion({ ...currentQuestion, difficulty: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">
                    <Badge variant="outline" className="bg-green-500/10">Easy</Badge>
                  </SelectItem>
                  <SelectItem value="medium">
                    <Badge variant="outline" className="bg-yellow-500/10">Medium</Badge>
                  </SelectItem>
                  <SelectItem value="hard">
                    <Badge variant="outline" className="bg-red-500/10">Hard</Badge>
                  </SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div 
              className="space-y-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Label htmlFor="marks">Marks</Label>
              <Input
                id="marks"
                type="number"
                value={currentQuestion.marks}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, marks: parseInt(e.target.value) })}
                className="focus:border-primary"
              />
            </motion.div>
          </div>

          {/* Category */}
          <motion.div 
            className="space-y-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <Label htmlFor="category">Category / Topic</Label>
            <Input
              id="category"
              value={currentQuestion.category}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, category: e.target.value })}
              placeholder="e.g., Algorithms, Data Structures, Programming"
            />
          </motion.div>

          {/* Dynamic Content Based on Question Type */}
          <AnimatePresence mode="wait">
            {currentQuestion.question_type === 'multiple_choice' && (
              <motion.div
                key="mcq"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <Label>Options</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addOption}
                    className="hover:bg-primary/10"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Option
                  </Button>
                </div>
                
                {(currentQuestion.options || []).map((option, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-2"
                  >
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1"
                    />
                    {(currentQuestion.options?.length || 0) > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(index)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </motion.div>
                ))}
                
                <div className="space-y-2">
                  <Label htmlFor="correct">Correct Answer</Label>
                  <Input
                    id="correct"
                    value={currentQuestion.correct_answer}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, correct_answer: e.target.value })}
                    placeholder="Enter the correct answer"
                    className="border-primary/30"
                  />
                </div>
              </motion.div>
            )}

            {currentQuestion.question_type === 'coding' && (
              <motion.div
                key="coding"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-2"
              >
                <Label htmlFor="sampleCode" className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Sample Code / Expected Solution
                </Label>
                <Textarea
                  id="sampleCode"
                  value={currentQuestion.sample_code}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, sample_code: e.target.value })}
                  placeholder="Enter sample code template or expected solution..."
                  className="font-mono min-h-[200px] bg-muted/50"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Add Question Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={addQuestion} 
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all"
              size="lg"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};