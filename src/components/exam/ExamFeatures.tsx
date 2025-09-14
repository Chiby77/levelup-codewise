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

  // Hide calculator and camera features - they were blocking students
  return null;
};