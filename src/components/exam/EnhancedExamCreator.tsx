import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Save, Upload, Download, Copy, FileText, Code, Calculator } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EnhancedExamCreatorProps {
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
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  time_limit?: number;
}

export const EnhancedExamCreator: React.FC<EnhancedExamCreatorProps> = ({ onExamCreated }) => {
  const [examData, setExamData] = useState({
    title: '',
    description: '',
    duration_minutes: 60,
    total_marks: 100,
    status: 'draft' as 'draft' | 'active',
    exam_type: 'standard' as 'standard' | 'coding' | 'mixed',
    instructions: '',
    passing_marks: 50,
    randomize_questions: false,
    allow_review: true
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    question_text: '',
    question_type: 'multiple_choice',
    options: ['', '', '', ''],
    correct_answer: '',
    sample_code: '',
    marks: 10,
    difficulty: 'medium',
    category: '',
    time_limit: 0
  });
  const [loading, setLoading] = useState(false);
  const [bulkImport, setBulkImport] = useState('');

  const questionTypes = [
    { value: 'multiple_choice', label: 'Multiple Choice', icon: <FileText className="h-4 w-4" /> },
    { value: 'coding', label: 'Programming/Coding', icon: <Code className="h-4 w-4" /> },
    { value: 'flowchart', label: 'Flowchart/Diagram', icon: <FileText className="h-4 w-4" /> },
    { value: 'short_answer', label: 'Short Answer', icon: <FileText className="h-4 w-4" /> },
    { value: 'essay', label: 'Essay/Long Answer', icon: <FileText className="h-4 w-4" /> },
    { value: 'fill_blank', label: 'Fill in the Blanks', icon: <FileText className="h-4 w-4" /> },
    { value: 'true_false', label: 'True/False', icon: <FileText className="h-4 w-4" /> },
    { value: 'matching', label: 'Matching', icon: <FileText className="h-4 w-4" /> }
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
      time_limit: currentQuestion.time_limit || 0,
      order_number: questions.length + 1
    };

    setQuestions([...questions, newQuestion]);
    setCurrentQuestion({
      question_text: '',
      question_type: 'multiple_choice',
      options: ['', '', '', ''],
      correct_answer: '',
      sample_code: '',
      marks: 10,
      difficulty: 'medium',
      category: '',
      time_limit: 0
    });
    toast.success('Question added!');
  };

  const bulkImportQuestions = () => {
    try {
      const lines = bulkImport.split('\n').filter(line => line.trim());
      const newQuestions: Question[] = [];
      
      lines.forEach((line, index) => {
        const parts = line.split('|');
        if (parts.length >= 3) {
          const question: Question = {
            id: (Date.now() + index).toString(),
            question_text: parts[0].trim(),
            question_type: (parts[1].trim() as any) || 'multiple_choice',
            options: parts[2] ? parts[2].split(',').map(opt => opt.trim()) : [],
            correct_answer: parts[3]?.trim() || '',
            sample_code: parts[4]?.trim() || '',
            marks: parseInt(parts[5]) || 10,
            difficulty: (parts[6]?.trim() as any) || 'medium',
            category: parts[7]?.trim() || '',
            time_limit: parseInt(parts[8]) || 0,
            order_number: questions.length + newQuestions.length + 1
          };
          newQuestions.push(question);
        }
      });
      
      setQuestions([...questions, ...newQuestions]);
      setBulkImport('');
      toast.success(`Added ${newQuestions.length} questions`);
    } catch (error) {
      toast.error('Error importing questions. Check format.');
    }
  };

  const duplicateQuestion = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      const duplicate = { 
        ...question, 
        id: Date.now().toString(),
        order_number: questions.length + 1
      };
      setQuestions([...questions, duplicate]);
      toast.success('Question duplicated');
    }
  };

  const exportQuestions = () => {
    const csvContent = questions.map(q => 
      `${q.question_text}|${q.question_type}|${q.options.join(',')}|${q.correct_answer}|${q.sample_code}|${q.marks}|${q.difficulty}|${q.category}|${q.time_limit}`
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${examData.title || 'exam'}_questions.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Questions exported');
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
      const { data: examResponse, error: examError } = await supabase
        .from('exams')
        .insert({
          ...examData,
          instructions: examData.instructions || 'Please read all questions carefully before answering.'
        })
        .select()
        .single();

      if (examError) throw examError;

      const questionsToInsert = questions.map((q, index) => ({
        exam_id: examResponse.id,
        question_text: q.question_text,
        question_type: q.question_type,
        options: ['multiple_choice', 'true_false', 'matching'].includes(q.question_type) ? q.options : null,
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
        status: 'draft',
        exam_type: 'standard',
        instructions: '',
        passing_marks: 50,
        randomize_questions: false,
        allow_review: true
      });
      setQuestions([]);
      
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
        <h2 className="text-2xl font-bold">Enhanced Exam Creator</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportQuestions} disabled={questions.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={saveExam} disabled={loading} className="min-w-[120px]">
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : 'Save Exam'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details">Exam Details</TabsTrigger>
          <TabsTrigger value="questions">Add Questions</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Import</TabsTrigger>
          <TabsTrigger value="preview">Preview ({questions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Exam Title *</Label>
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

                <div className="space-y-2">
                  <Label htmlFor="instructions">Instructions</Label>
                  <Textarea
                    id="instructions"
                    value={examData.instructions}
                    onChange={(e) => setExamData({ ...examData, instructions: e.target.value })}
                    placeholder="Special instructions for students"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exam Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="passing">Passing Marks</Label>
                    <Input
                      id="passing"
                      type="number"
                      value={examData.passing_marks}
                      onChange={(e) => setExamData({ ...examData, passing_marks: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Exam Type</Label>
                    <Select value={examData.exam_type} onValueChange={(value: any) => setExamData({ ...examData, exam_type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="coding">Coding Focus</SelectItem>
                        <SelectItem value="mixed">Mixed Types</SelectItem>
                      </SelectContent>
                    </Select>
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
          </div>
        </TabsContent>

        <TabsContent value="questions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Question</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question">Question Text *</Label>
                <Textarea
                  id="question"
                  value={currentQuestion.question_text}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, question_text: e.target.value })}
                  placeholder="Enter your question"
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Question Type</Label>
                  <Select value={currentQuestion.question_type} onValueChange={(value: any) => setCurrentQuestion({ ...currentQuestion, question_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {questionTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            {type.icon}
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={currentQuestion.difficulty} onValueChange={(value: any) => setCurrentQuestion({ ...currentQuestion, difficulty: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={currentQuestion.category}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, category: e.target.value })}
                    placeholder="e.g., Algorithms, Data Structures"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeLimit">Time Limit (seconds, 0 = no limit)</Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    value={currentQuestion.time_limit}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, time_limit: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              {['multiple_choice', 'true_false'].includes(currentQuestion.question_type || '') && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Options</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addOption}>
                      <Plus className="h-3 w-3 mr-1" />
                      Add Option
                    </Button>
                  </div>
                  {(currentQuestion.options || []).map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                      />
                      {(currentQuestion.options?.length || 0) > 2 && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeOption(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <div className="space-y-2">
                    <Label htmlFor="correct">Correct Answer</Label>
                    <Input
                      id="correct"
                      value={currentQuestion.correct_answer}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, correct_answer: e.target.value })}
                      placeholder="Enter the exact correct answer"
                    />
                  </div>
                </div>
              )}

              {currentQuestion.question_type === 'coding' && (
                <div className="space-y-2">
                  <Label htmlFor="sampleCode">Sample Code/Template</Label>
                  <Textarea
                    id="sampleCode"
                    value={currentQuestion.sample_code}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, sample_code: e.target.value })}
                    placeholder="Enter sample code template or expected solution"
                    className="font-mono min-h-[120px]"
                  />
                  <div className="space-y-2">
                    <Label htmlFor="correct">Expected Answer/Solution</Label>
                    <Textarea
                      id="correct"
                      value={currentQuestion.correct_answer}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, correct_answer: e.target.value })}
                      placeholder="Enter the expected code solution or key points"
                      className="font-mono"
                    />
                  </div>
                </div>
              )}

              {!['multiple_choice', 'coding', 'true_false'].includes(currentQuestion.question_type || '') && (
                <div className="space-y-2">
                  <Label htmlFor="correct">Expected Answer</Label>
                  <Textarea
                    id="correct"
                    value={currentQuestion.correct_answer}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, correct_answer: e.target.value })}
                    placeholder="Enter the expected answer or key points to look for"
                  />
                </div>
              )}

              <Button onClick={addQuestion} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Import Questions</CardTitle>
              <p className="text-sm text-muted-foreground">
                Format: Question|Type|Options|Correct Answer|Sample Code|Marks|Difficulty|Category|Time Limit
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={bulkImport}
                onChange={(e) => setBulkImport(e.target.value)}
                placeholder="What is Python?|multiple_choice|A language,A snake,Both|Both||10|easy|Programming|0"
                className="min-h-[200px] font-mono text-sm"
              />
              <Button onClick={bulkImportQuestions} disabled={!bulkImport.trim()}>
                <Upload className="h-4 w-4 mr-2" />
                Import Questions
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          {questions.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Questions Preview ({questions.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <div key={question.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Q{index + 1}</span>
                          <Badge variant="outline">{question.question_type}</Badge>
                          <Badge variant="secondary">{question.marks} marks</Badge>
                          <Badge variant="outline">{question.difficulty}</Badge>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => duplicateQuestion(question.id)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setQuestions(questions.filter(q => q.id !== question.id))}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm mb-2">{question.question_text}</p>
                      {question.options.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          Options: {question.options.filter(o => o.trim()).join(' • ')}
                        </div>
                      )}
                      {question.correct_answer && (
                        <div className="text-xs text-green-600 mt-1">
                          Answer: {question.correct_answer.substring(0, 100)}
                          {question.correct_answer.length > 100 ? '...' : ''}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No questions added yet</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};