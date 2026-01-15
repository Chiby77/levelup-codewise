import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FileUp, Trash2, CheckCircle, Eye, Download, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';

interface Assignment {
  id: string;
  title: string;
  description: string | null;
  class_id: string;
  due_date: string | null;
  max_marks: number;
  is_active: boolean;
  results_released: boolean;
  created_at: string;
}

interface AssignmentSubmission {
  id: string;
  assignment_id: string;
  student_id: string;
  student_email: string;
  student_name: string;
  file_path: string;
  file_name: string;
  file_type: string;
  marks: number | null;
  feedback: string | null;
  graded: boolean;
  graded_at: string | null;
  submitted_at: string;
}

interface Class {
  id: string;
  name: string;
  subject: string;
}

export default function AssignmentManagement() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Create assignment form
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newMaxMarks, setNewMaxMarks] = useState('100');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  // Grading
  const [gradingSubmission, setGradingSubmission] = useState<AssignmentSubmission | null>(null);
  const [gradeMarks, setGradeMarks] = useState('');
  const [gradeFeedback, setGradeFeedback] = useState('');
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchAssignments(selectedClass);
    }
  }, [selectedClass]);

  useEffect(() => {
    if (selectedAssignment) {
      fetchSubmissions(selectedAssignment.id);
    }
  }, [selectedAssignment]);

  const fetchClasses = async () => {
    const { data, error } = await supabase
      .from('classes')
      .select('id, name, subject')
      .eq('is_active', true)
      .order('name');
    
    if (error) {
      toast.error('Failed to fetch classes');
      return;
    }
    setClasses(data || []);
    setLoading(false);
  };

  const fetchAssignments = async (classId: string) => {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('class_id', classId)
      .order('created_at', { ascending: false });
    
    if (error) {
      toast.error('Failed to fetch assignments');
      return;
    }
    setAssignments(data || []);
  };

  const fetchSubmissions = async (assignmentId: string) => {
    const { data, error } = await supabase
      .from('assignment_submissions')
      .select('*')
      .eq('assignment_id', assignmentId)
      .order('submitted_at', { ascending: false });
    
    if (error) {
      toast.error('Failed to fetch submissions');
      return;
    }
    setSubmissions(data || []);
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass) {
      toast.error('Please select a class first');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('assignments')
      .insert({
        title: newTitle,
        description: newDescription || null,
        class_id: selectedClass,
        due_date: newDueDate || null,
        max_marks: parseInt(newMaxMarks),
        created_by: user.id,
      });

    if (error) {
      toast.error('Failed to create assignment');
      return;
    }

    toast.success('Assignment created successfully');
    setCreateDialogOpen(false);
    setNewTitle('');
    setNewDescription('');
    setNewDueDate('');
    setNewMaxMarks('100');
    fetchAssignments(selectedClass);
  };

  const handleGradeSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    // Validate marks
    const marks = parseFloat(gradeMarks);
    if (isNaN(marks) || marks < 0) {
      toast.error('Please enter a valid mark');
      return;
    }

    if (selectedAssignment && marks > selectedAssignment.max_marks) {
      toast.error(`Marks cannot exceed ${selectedAssignment.max_marks}`);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Not authenticated');
      return;
    }

    try {
      const { error } = await supabase
        .from('assignment_submissions')
        .update({
          marks: marks,
          feedback: gradeFeedback.trim() || null,
          graded: true,
          graded_at: new Date().toISOString(),
          graded_by: user.id,
        })
        .eq('id', gradingSubmission.id);

      if (error) {
        console.error('Grading error:', error);
        throw error;
      }

      toast.success(`Graded ${gradingSubmission.student_name}: ${marks}/${selectedAssignment?.max_marks}`);
      setGradeDialogOpen(false);
      setGradingSubmission(null);
      setGradeMarks('');
      setGradeFeedback('');
      if (selectedAssignment) {
        fetchSubmissions(selectedAssignment.id);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to grade submission');
    }
  };

  const handleReleaseResults = async (releaseAll: boolean) => {
    if (!selectedAssignment) return;

    const { error } = await supabase
      .from('assignments')
      .update({ results_released: true })
      .eq('id', selectedAssignment.id);

    if (error) {
      toast.error('Failed to release results');
      return;
    }

    toast.success('Results released to students');
    if (selectedClass) {
      fetchAssignments(selectedClass);
    }
    setSelectedAssignment({ ...selectedAssignment, results_released: true });
  };

  const handleDownloadFile = async (filePath: string, fileName: string) => {
    const { data, error } = await supabase.storage
      .from('assignments')
      .download(filePath);

    if (error) {
      toast.error('Failed to download file');
      return;
    }

    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    if (!confirm('Are you sure? This will delete all submissions.')) return;

    const { error } = await supabase
      .from('assignments')
      .delete()
      .eq('id', assignmentId);

    if (error) {
      toast.error('Failed to delete assignment');
      return;
    }

    toast.success('Assignment deleted');
    setSelectedAssignment(null);
    if (selectedClass) {
      fetchAssignments(selectedClass);
    }
  };

  const openGradeDialog = (submission: AssignmentSubmission) => {
    setGradingSubmission(submission);
    setGradeMarks(submission.marks?.toString() || '');
    setGradeFeedback(submission.feedback || '');
    setGradeDialogOpen(true);
  };

  const gradedCount = submissions.filter(s => s.graded).length;
  const ungradedCount = submissions.length - gradedCount;

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FileUp className="h-6 w-6" />
          Assignment Management
        </h2>
      </div>

      {/* Class Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Label>Select Class:</Label>
            <Select value={selectedClass} onValueChange={(val) => {
              setSelectedClass(val);
              setSelectedAssignment(null);
            }}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Choose a class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name} - {cls.subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedClass && (
              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Assignment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Assignment</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateAssignment} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Assignment title"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        placeholder="Assignment instructions..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Due Date</Label>
                        <Input
                          type="datetime-local"
                          value={newDueDate}
                          onChange={(e) => setNewDueDate(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Max Marks</Label>
                        <Input
                          type="number"
                          value={newMaxMarks}
                          onChange={(e) => setNewMaxMarks(e.target.value)}
                          min="1"
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full">Create Assignment</Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedClass && (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Assignments List */}
          <div className="md:col-span-1 space-y-4">
            <h3 className="font-semibold">Assignments</h3>
            {assignments.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  No assignments yet
                </CardContent>
              </Card>
            ) : (
              assignments.map((assignment) => (
                <Card 
                  key={assignment.id}
                  className={`cursor-pointer transition-colors ${selectedAssignment?.id === assignment.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                  onClick={() => setSelectedAssignment(assignment)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{assignment.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Max: {assignment.max_marks} marks
                        </p>
                        {assignment.due_date && (
                          <p className="text-xs text-muted-foreground">
                            Due: {format(new Date(assignment.due_date), 'PPp')}
                          </p>
                        )}
                        <div className="flex gap-2 mt-2">
                          {assignment.results_released && (
                            <Badge variant="default">Released</Badge>
                          )}
                          {!assignment.is_active && (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAssignment(assignment.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Submissions */}
          <div className="md:col-span-2">
            {selectedAssignment ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{selectedAssignment.title}</span>
                    <div className="flex gap-2">
                      <Badge variant="outline">{gradedCount} graded</Badge>
                      <Badge variant="destructive">{ungradedCount} pending</Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-muted-foreground">
                      {selectedAssignment.description || 'No description'}
                    </p>
                    {!selectedAssignment.results_released && gradedCount > 0 && (
                      <Button onClick={() => handleReleaseResults(true)}>
                        <Send className="h-4 w-4 mr-2" />
                        Release All Results
                      </Button>
                    )}
                  </div>

                  {submissions.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No submissions yet
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>File</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead>Marks</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {submissions.map((submission) => (
                          <TableRow key={submission.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{submission.student_name}</p>
                                <p className="text-xs text-muted-foreground">{submission.student_email}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDownloadFile(submission.file_path, submission.file_name)}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                {submission.file_name.length > 15 
                                  ? submission.file_name.substring(0, 15) + '...' 
                                  : submission.file_name}
                              </Button>
                            </TableCell>
                            <TableCell>
                              {format(new Date(submission.submitted_at), 'PP')}
                            </TableCell>
                            <TableCell>
                              {submission.graded ? (
                                <Badge variant="default">
                                  {submission.marks}/{selectedAssignment.max_marks}
                                </Badge>
                              ) : (
                                <Badge variant="secondary">Pending</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openGradeDialog(submission)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                {submission.graded ? 'Edit' : 'Grade'}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                  <FileUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select an assignment to view submissions</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Grade Dialog */}
      <Dialog open={gradeDialogOpen} onOpenChange={setGradeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Grade Submission</DialogTitle>
          </DialogHeader>
          {gradingSubmission && (
            <form onSubmit={handleGradeSubmission} className="space-y-4">
              <div className="bg-muted p-3 rounded-lg">
                <p className="font-medium">{gradingSubmission.student_name}</p>
                <p className="text-sm text-muted-foreground">{gradingSubmission.student_email}</p>
              </div>
              <div className="space-y-2">
                <Label>Marks (out of {selectedAssignment?.max_marks})</Label>
                <Input
                  type="number"
                  value={gradeMarks}
                  onChange={(e) => setGradeMarks(e.target.value)}
                  min="0"
                  max={selectedAssignment?.max_marks}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Feedback (Optional)</Label>
                <Textarea
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  placeholder="Feedback for the student..."
                  rows={4}
                />
              </div>
              <Button type="submit" className="w-full">Save Grade</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
