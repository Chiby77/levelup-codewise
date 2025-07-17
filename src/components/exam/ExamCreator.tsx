import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ExamCreatorProps {
  onExamCreated: () => void;
}

interface Question {
  id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'coding' | 'flowchart' | 'short_answer';
  options: string[];
  correct_answer: string;
  sample_code: string;
  marks: number;
  order_number: number;
}

export const ExamCreator: React.FC<ExamCreatorProps> = ({ onExamCreated }) => {
  const [examData, setExamData] = useState({
    title: '',
    description: '',
    duration_minutes: 60,
    total_marks: 100,
    status: 'draft' as 'draft' | 'active'
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    question_text: '',
    question_type: 'multiple_choice',
    options: ['', '', '', ''],
    correct_answer: '',
    sample_code: '',
    marks: 10
  });
  const [loading, setLoading] = useState(false);

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
      order_number: questions.length + 1
    };

    setQuestions([...questions, newQuestion]);
    setCurrentQuestion({
      question_text: '',
      question_type: 'multiple_choice',
      options: ['', '', '', ''],
      correct_answer: '',
      sample_code: '',
      marks: 10
    });
    toast.success('Question added!');
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
    toast.success('Question removed');
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(currentQuestion.options || ['', '', '', ''])];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const saveExam = async () => {
    if (!examData.title.trim()) {
      toast.error('Please enter an exam title');
      return;
    }

    if (questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    setLoading(true);

    try {
      // Insert exam
      const { data: examResponse, error: examError } = await supabase
        .from('exams')
        .insert(examData)
        .select()
        .single();

      if (examError) throw examError;

      // Insert questions
      const questionsToInsert = questions.map((q, index) => ({
        exam_id: examResponse.id,
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.question_type === 'multiple_choice' ? q.options : null,
        correct_answer: q.correct_answer,
        sample_code: q.sample_code,
        marks: q.marks,
        order_number: index + 1
      }));

      const { error: questionsError } = await supabase
        .from('questions')
        .insert(questionsToInsert);

      if (questionsError) throw questionsError;

      toast.success('Exam created successfully!');
      
      // Reset form
      setExamData({
        title: '',
        description: '',
        duration_minutes: 60,
        total_marks: 100,
        status: 'draft'
      });
      setQuestions([]);
      setCurrentQuestion({
        question_text: '',
        question_type: 'multiple_choice',
        options: ['', '', '', ''],
        correct_answer: '',
        sample_code: '',
        marks: 10
      });

      onExamCreated();
    } catch (error) {
      console.error('Error creating exam:', error);
      toast.error('Failed to create exam');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Create New Exam</h2>
        <Button onClick={saveExam} disabled={loading} className="min-w-[120px]">
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Saving...' : 'Save Exam'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exam Details */}
        <Card>
          <CardHeader>
            <CardTitle>Exam Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Exam Title</Label>
              <Input
                id="title"
                value={examData.title}
                onChange={(e) => setExamData({ ...examData, title: e.target.value })}
                placeholder="Enter exam title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={examData.description}
                onChange={(e) => setExamData({ ...examData, description: e.target.value })}
                placeholder="Enter exam description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={examData.duration_minutes}
                  onChange={(e) => setExamData({ ...examData, duration_minutes: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="marks">Total Marks</Label>
                <Input
                  id="marks"
                  type="number"
                  value={examData.total_marks}
                  onChange={(e) => setExamData({ ...examData, total_marks: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={examData.status} onValueChange={(value: 'draft' | 'active') => setExamData({ ...examData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Question Creator */}
        <Card>
          <CardHeader>
            <CardTitle>Add Question</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question">Question Text</Label>
              <Textarea
                id="question"
                value={currentQuestion.question_text}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, question_text: e.target.value })}
                placeholder="Enter your question"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Question Type</Label>
                <Select value={currentQuestion.question_type} onValueChange={(value: any) => setCurrentQuestion({ ...currentQuestion, question_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                    <SelectItem value="coding">Coding</SelectItem>
                    <SelectItem value="flowchart">Flowchart</SelectItem>
                    <SelectItem value="short_answer">Short Answer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="questionMarks">Marks</Label>
                <Input
                  id="questionMarks"
                  type="number"
                  value={currentQuestion.marks}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, marks: parseInt(e.target.value) })}
                />
              </div>
            </div>

            {currentQuestion.question_type === 'multiple_choice' && (
              <div className="space-y-2">
                <Label>Options</Label>
                {(currentQuestion.options || ['', '', '', '']).map((option, index) => (
                  <Input
                    key={index}
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                ))}
                <div className="space-y-2">
                  <Label htmlFor="correct">Correct Answer</Label>
                  <Input
                    id="correct"
                    value={currentQuestion.correct_answer}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, correct_answer: e.target.value })}
                    placeholder="Enter the correct answer"
                  />
                </div>
              </div>
            )}

            {currentQuestion.question_type === 'coding' && (
              <div className="space-y-2">
                <Label htmlFor="sampleCode">Sample Code</Label>
                <Textarea
                  id="sampleCode"
                  value={currentQuestion.sample_code}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, sample_code: e.target.value })}
                  placeholder="Enter sample code template"
                  className="font-mono"
                />
              </div>
            )}

            <Button onClick={addQuestion} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Questions List */}
      {questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Questions ({questions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={question.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">Q{index + 1}</span>
                        <Badge variant="outline">{question.question_type}</Badge>
                        <Badge variant="secondary">{question.marks} marks</Badge>
                      </div>
                      <p className="text-sm">{question.question_text}</p>
                      {question.question_type === 'multiple_choice' && question.options.length > 0 && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          Options: {question.options.filter(o => o.trim()).join(', ')}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQuestion(question.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};