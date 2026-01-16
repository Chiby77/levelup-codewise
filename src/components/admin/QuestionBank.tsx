import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Database, Plus, Trash2, Edit, Copy, Tag } from "lucide-react";

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
  created_at: string;
}

export const QuestionBank = () => {
  const [questions, setQuestions] = useState<QuestionBankItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionBankItem | null>(null);
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
  const [searchTags, setSearchTags] = useState("");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    question_text: "",
    question_type: "multiple_choice" as "multiple_choice" | "coding" | "short_answer" | "flowchart",
    options: ["", "", "", ""] as string[],
    correct_answer: "",
    sample_code: "",
    programming_language: "python" as "python" | "javascript" | "java" | "cpp" | "vb" | "c",
    marks: 10,
    difficulty_level: "medium",
    subject: "Computer Science",
    tags: [] as string[],
    category: "",
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("question_bank")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (filterSubject !== "all") {
        query = query.eq("subject", filterSubject);
      }
      if (filterType !== "all") {
        query = query.eq("question_type", filterType as any);
      }
      if (filterDifficulty !== "all") {
        query = query.eq("difficulty_level", filterDifficulty);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      let filteredData = data || [];
      
      // Filter by tags if search is active
      if (searchTags.trim()) {
        const searchTagsArray = searchTags.split(',').map(t => t.trim().toLowerCase());
        filteredData = filteredData.filter(q => 
          q.tags?.some(tag => searchTagsArray.some(st => tag.toLowerCase().includes(st)))
        );
      }

      setQuestions(filteredData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [filterSubject, filterType, filterDifficulty, searchTags]);

  const handleSave = async () => {
    if (!formData.question_text.trim()) {
      toast({
        title: "Validation Error",
        description: "Question text is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.subject.trim()) {
      toast({
        title: "Validation Error",
        description: "Subject is required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Filter out empty options for multiple choice
      const filteredOptions = formData.question_type === "multiple_choice" 
        ? formData.options.filter(opt => opt.trim() !== '')
        : null;

      const questionData = {
        question_text: formData.question_text.trim(),
        question_type: formData.question_type,
        options: filteredOptions,
        correct_answer: formData.correct_answer.trim() || null,
        sample_code: formData.sample_code.trim() || null,
        programming_language: formData.question_type === "coding" ? formData.programming_language : null,
        marks: formData.marks || 10,
        difficulty_level: formData.difficulty_level,
        subject: formData.subject.trim(),
        tags: formData.tags.length > 0 ? formData.tags : null,
        category: formData.category.trim() || null,
        created_by: user.id,
        is_active: true,
      };

      if (editingQuestion) {
        const { error } = await supabase
          .from("question_bank")
          .update(questionData)
          .eq("id", editingQuestion.id);

        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        toast({ title: "Success", description: "Question updated successfully" });
      } else {
        const { error } = await supabase
          .from("question_bank")
          .insert([questionData]);

        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        toast({ title: "Success", description: "Question added to bank" });
      }

      setShowDialog(false);
      resetForm();
      fetchQuestions();
    } catch (error: any) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save question",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;

    try {
      const { error } = await supabase
        .from("question_bank")
        .update({ is_active: false })
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Success", description: "Question deleted" });
      fetchQuestions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (question: QuestionBankItem) => {
    setEditingQuestion(question);
    setFormData({
      question_text: question.question_text,
      question_type: question.question_type as "multiple_choice" | "coding" | "short_answer" | "flowchart",
      options: question.options || [],
      correct_answer: question.correct_answer || "",
      sample_code: question.sample_code || "",
      programming_language: (question.programming_language || "python") as "python" | "javascript" | "java" | "cpp" | "vb" | "c",
      marks: question.marks,
      difficulty_level: question.difficulty_level,
      subject: question.subject,
      tags: question.tags || [],
      category: question.category || "",
    });
    setShowDialog(true);
  };

  const handleDuplicate = (question: QuestionBankItem) => {
    setEditingQuestion(null);
    setFormData({
      question_text: question.question_text + " (Copy)",
      question_type: question.question_type as "multiple_choice" | "coding" | "short_answer" | "flowchart",
      options: question.options || [],
      correct_answer: question.correct_answer || "",
      sample_code: question.sample_code || "",
      programming_language: (question.programming_language || "python") as "python" | "javascript" | "java" | "cpp" | "vb" | "c",
      marks: question.marks,
      difficulty_level: question.difficulty_level,
      subject: question.subject,
      tags: question.tags || [],
      category: question.category || "",
    });
    setShowDialog(true);
  };

  const resetForm = () => {
    setFormData({
      question_text: "",
      question_type: "multiple_choice",
      options: ["", "", "", ""],
      correct_answer: "",
      sample_code: "",
      programming_language: "python",
      marks: 10,
      difficulty_level: "medium",
      subject: "Computer Science",
      tags: [],
      category: "",
    });
    setEditingQuestion(null);
  };

  const addOption = () => {
    setFormData({ ...formData, options: [...formData.options, ""] });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = formData.options.filter((_, i) => i !== index);
    setFormData({ ...formData, options: newOptions });
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tag.trim()] });
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="pb-2 sm:pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base text-foreground">
              <Database className="h-4 w-4 sm:h-5 sm:w-5" />
              Question Bank
            </CardTitle>
            <Button size="sm" onClick={() => { resetForm(); setShowDialog(true); }}>
              <Plus className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Add Question</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-2 sm:p-6 pt-0">
          {/* Filters - Mobile optimized */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger className="text-xs sm:text-sm h-8 sm:h-10">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="text-xs sm:text-sm h-8 sm:h-10">
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
              <SelectTrigger className="text-xs sm:text-sm h-8 sm:h-10">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Search tags..."
              value={searchTags}
              onChange={(e) => setSearchTags(e.target.value)}
              className="text-xs sm:text-sm h-8 sm:h-10"
            />
          </div>

          {/* Questions List - Mobile optimized */}
          <div className="space-y-2 sm:space-y-4">
            {loading && <p className="text-center text-muted-foreground py-4">Loading...</p>}
            {!loading && questions.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No questions found. Add your first question!</p>
            )}
            {questions.map((question) => (
              <Card key={question.id} className="border-l-4 border-l-primary">
                <CardContent className="p-2 sm:pt-6 sm:p-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2 flex-wrap">
                        <Badge variant="outline" className="text-[10px] sm:text-xs">{question.question_type.replace('_', ' ')}</Badge>
                        <Badge variant="secondary" className="text-[10px] sm:text-xs">{question.difficulty_level}</Badge>
                        <Badge className="text-[10px] sm:text-xs">{question.marks} pts</Badge>
                      </div>
                      <p className="font-medium text-xs sm:text-sm text-foreground mb-1 sm:mb-2 line-clamp-2">{question.question_text}</p>
                      <div className="flex flex-wrap gap-1 mb-1 sm:mb-2">
                        {question.tags?.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-[10px]">
                            <Tag className="h-2 w-2 sm:h-3 sm:w-3 mr-0.5" />
                            {tag}
                          </Badge>
                        ))}
                        {question.tags && question.tags.length > 3 && (
                          <Badge variant="outline" className="text-[10px]">+{question.tags.length - 3}</Badge>
                        )}
                      </div>
                      {question.category && (
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Category: {question.category}</p>
                      )}
                    </div>
                    <div className="flex gap-1 sm:gap-2 justify-end">
                      <Button size="sm" variant="outline" className="h-7 w-7 sm:h-8 sm:w-8 p-0" onClick={() => handleDuplicate(question)} title="Duplicate">
                        <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 w-7 sm:h-8 sm:w-8 p-0" onClick={() => handleEdit(question)} title="Edit">
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" className="h-7 w-7 sm:h-8 sm:w-8 p-0" onClick={() => handleDelete(question.id)} title="Delete">
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingQuestion ? "Edit Question" : "Add New Question"}</DialogTitle>
            <DialogDescription>
              {editingQuestion ? "Update the question details" : "Add a question to the bank for reuse"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Question Text</label>
              <Textarea
                value={formData.question_text}
                onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Question Type</label>
              <Select value={formData.question_type} onValueChange={(value: any) => setFormData({ ...formData, question_type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                  <SelectItem value="coding">Coding</SelectItem>
                  <SelectItem value="short_answer">Short Answer</SelectItem>
                  <SelectItem value="flowchart">Flowchart</SelectItem>
                </SelectContent>
              </Select>
            </div>

              <div>
                <label className="text-sm font-medium">Marks</label>
                <Input
                  type="number"
                  value={formData.marks}
                  onChange={(e) => setFormData({ ...formData, marks: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Difficulty</label>
                <Select value={formData.difficulty_level} onValueChange={(value) => setFormData({ ...formData, difficulty_level: value })}>
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

              <div>
                <label className="text-sm font-medium">Subject</label>
                <Input
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Category</label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Algorithms"
                />
              </div>
            </div>

            {formData.question_type === "multiple_choice" && (
              <div>
                <label className="text-sm font-medium">Options</label>
                {formData.options.map((option, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />
                    <Button variant="outline" size="sm" onClick={() => removeOption(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addOption}>Add Option</Button>
              </div>
            )}

            {(formData.question_type === "coding" || formData.question_type === "multiple_choice" || formData.question_type === "short_answer") && (
              <div>
                <label className="text-sm font-medium">Correct Answer</label>
                <Textarea
                  value={formData.correct_answer}
                  onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                  rows={2}
                />
              </div>
            )}

            {formData.question_type === "coding" && (
              <>
                <div>
                  <label className="text-sm font-medium">Programming Language</label>
                  <Select value={formData.programming_language} onValueChange={(value: any) => setFormData({ ...formData, programming_language: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="cpp">C++</SelectItem>
                      <SelectItem value="vb">VB.NET</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Sample Code (Optional)</label>
                  <Textarea
                    value={formData.sample_code}
                    onChange={(e) => setFormData({ ...formData, sample_code: e.target.value })}
                    rows={4}
                  />
                </div>
              </>
            )}

            <div>
              <label className="text-sm font-medium">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                    {tag} ×
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add tag and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag(e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading || !formData.question_text}>
              {editingQuestion ? "Update" : "Add"} Question
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
