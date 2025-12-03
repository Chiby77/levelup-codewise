import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Database, Search, Filter, Check, Tag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface QuestionBankItem {
  id: string;
  question_text: string;
  question_type: string;
  options?: any;
  correct_answer?: string;
  sample_code?: string;
  programming_language?: string;
  marks: number;
  difficulty_level: string;
  subject: string;
  tags: string[];
  category?: string;
}

interface QuestionBankImporterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (questions: any[]) => void;
}

export const QuestionBankImporter: React.FC<QuestionBankImporterProps> = ({
  open,
  onOpenChange,
  onImport,
}) => {
  const [questions, setQuestions] = useState<QuestionBankItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');

  useEffect(() => {
    if (open) {
      fetchQuestions();
      setSelectedIds(new Set());
    }
  }, [open]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('question_bank')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      setQuestions(data || []);
    } catch (error: any) {
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = searchQuery === '' || 
      q.question_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'all' || q.question_type === filterType;
    const matchesDifficulty = filterDifficulty === 'all' || q.difficulty_level === filterDifficulty;
    const matchesSubject = filterSubject === 'all' || q.subject === filterSubject;
    return matchesSearch && matchesType && matchesDifficulty && matchesSubject;
  });

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const selectAll = () => {
    if (selectedIds.size === filteredQuestions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredQuestions.map(q => q.id)));
    }
  };

  const handleImport = () => {
    const selectedQuestions = questions
      .filter(q => selectedIds.has(q.id))
      .map((q, index) => ({
        id: Date.now().toString() + index,
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.options || [],
        correct_answer: q.correct_answer || '',
        sample_code: q.sample_code || '',
        programming_language: q.programming_language || 'python',
        marks: q.marks,
        difficulty: q.difficulty_level,
        category: q.category || '',
        order_number: index + 1,
      }));

    onImport(selectedQuestions);
    toast.success(`Imported ${selectedQuestions.length} questions from bank`);
    onOpenChange(false);
  };

  const totalMarks = questions
    .filter(q => selectedIds.has(q.id))
    .reduce((sum, q) => sum + q.marks, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Import from Question Bank
          </DialogTitle>
        </DialogHeader>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pb-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
              <SelectItem value="coding">Coding</SelectItem>
              <SelectItem value="short_answer">Short Answer</SelectItem>
              <SelectItem value="flowchart">Flowchart</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
            <SelectTrigger>
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterSubject} onValueChange={setFilterSubject}>
            <SelectTrigger>
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
              <SelectItem value="Mathematics">Mathematics</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Selection Summary */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={selectAll}>
              <Check className="h-4 w-4 mr-1" />
              {selectedIds.size === filteredQuestions.length ? 'Deselect All' : 'Select All'}
            </Button>
            <span className="text-sm text-muted-foreground">
              {selectedIds.size} selected | Total: {totalMarks} marks
            </span>
          </div>
          <span className="text-sm text-muted-foreground">
            {filteredQuestions.length} questions available
          </span>
        </div>

        {/* Questions List */}
        <ScrollArea className="h-[400px] pr-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No questions found. Try adjusting filters or add questions to the bank first.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredQuestions.map((question) => (
                <div
                  key={question.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedIds.has(question.id)
                      ? 'bg-primary/10 border-primary'
                      : 'bg-muted/30 border-border hover:border-primary/50'
                  }`}
                  onClick={() => toggleSelect(question.id)}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedIds.has(question.id)}
                      onCheckedChange={() => toggleSelect(question.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="outline">{question.question_type}</Badge>
                        <Badge variant="secondary">{question.difficulty_level}</Badge>
                        <Badge>{question.marks} marks</Badge>
                        {question.programming_language && question.question_type === 'coding' && (
                          <Badge variant="outline">{question.programming_language}</Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium line-clamp-2">{question.question_text}</p>
                      {question.tags && question.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {question.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              <Tag className="h-3 w-3 mr-1" />{tag}
                            </Badge>
                          ))}
                          {question.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">+{question.tags.length - 3}</Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleImport} disabled={selectedIds.size === 0}>
            <Database className="h-4 w-4 mr-2" />
            Import {selectedIds.size} Questions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};