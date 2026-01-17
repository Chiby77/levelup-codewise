import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUp, Calendar, CheckCircle, Clock, BookOpen, Upload, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Assignment {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  max_marks: number;
  class_id: string;
  class_name?: string;
  class_subject?: string;
  is_active: boolean;
  results_released: boolean;
}

interface Submission {
  id: string;
  assignment_id: string;
  file_name: string;
  marks: number | null;
  feedback: string | null;
  graded: boolean;
  submitted_at: string;
}

interface EnrolledClass {
  id: string;
  name: string;
  subject: string;
}

export default function StudentAssignments() {
  const [enrolledClasses, setEnrolledClasses] = useState<EnrolledClass[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [uploading, setUploading] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchEnrolledClasses();
  }, []);

  useEffect(() => {
    if (enrolledClasses.length > 0) {
      fetchAssignments();
      fetchSubmissions();
    }
  }, [enrolledClasses, selectedClass]);

  // Realtime updates so marks/results show up without the student needing to refresh
  useEffect(() => {
    let channel: any;

    const setup = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      channel = supabase
        .channel('student-assignments-live')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'assignment_submissions',
            filter: `student_id=eq.${user.id}`,
          },
          () => {
            fetchSubmissions();
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'assignments',
          },
          () => {
            fetchAssignments();
          }
        )
        .subscribe();
    };

    setup();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [enrolledClasses, selectedClass]);

  const fetchEnrolledClasses = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data: enrollments, error } = await supabase
      .from('class_enrollments')
      .select('class_id, classes(id, name, subject)')
      .eq('student_id', user.id)
      .eq('is_active', true);

    if (error) {
      toast.error('Failed to fetch enrolled classes');
      setLoading(false);
      return;
    }

    const classes = enrollments?.map(e => e.classes).filter(Boolean) as EnrolledClass[];
    setEnrolledClasses(classes || []);
    setLoading(false);
  };

  const fetchAssignments = async () => {
    const classIds = selectedClass === 'all' 
      ? enrolledClasses.map(c => c.id)
      : [selectedClass];

    if (classIds.length === 0) return;

    const { data, error } = await supabase
      .from('assignments')
      .select('*, classes(name, subject)')
      .in('class_id', classIds)
      .eq('is_active', true)
      .order('due_date', { ascending: true, nullsFirst: false });

    if (error) {
      toast.error('Failed to fetch assignments');
      return;
    }

    const mappedAssignments = data?.map(a => ({
      ...a,
      class_name: a.classes?.name,
      class_subject: a.classes?.subject,
    })) || [];
    
    setAssignments(mappedAssignments);
  };

  const fetchSubmissions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('assignment_submissions')
      .select('*')
      .eq('student_id', user.id)
      .order('submitted_at', { ascending: false });

    if (!error) {
      setSubmissions(data || []);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !selectedAssignment) return;
    
    const file = e.target.files[0];
    const allowedTypes = ['application/pdf', 'application/zip', 'application/x-zip-compressed', 'image/jpeg', 'image/png', 'image/gif'];
    
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload PDF, ZIP, or image files only.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds 10MB limit');
      return;
    }

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${selectedAssignment.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('assignments')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      const { error: insertError } = await supabase
        .from('assignment_submissions')
        .insert({
          assignment_id: selectedAssignment.id,
          student_id: user.id,
          student_email: user.email || '',
          student_name: profile?.full_name || user.email || 'Unknown',
          file_path: fileName,
          file_name: file.name,
          file_type: file.type,
        });

      if (insertError) throw insertError;

      toast.success('Assignment submitted successfully!');
      setUploadDialogOpen(false);
      setSelectedAssignment(null);
      fetchSubmissions();
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload assignment');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getSubmissionForAssignment = (assignmentId: string) => {
    return submissions.find(s => s.assignment_id === assignmentId);
  };

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const handleViewResult = (submission: Submission) => {
    setSelectedSubmission(submission);
    setResultDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (enrolledClasses.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center text-muted-foreground">
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>You are not enrolled in any classes yet</p>
          <p className="text-sm">Contact your administrator to be enrolled in a class</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FileUp className="h-6 w-6 text-primary" />
          My Assignments
        </h2>
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {enrolledClasses.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name} - {c.subject}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {assignments.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            <FileUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No assignments available</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {assignments.map((assignment) => {
            const submission = getSubmissionForAssignment(assignment.id);
            const overdue = isOverdue(assignment.due_date);
            
            return (
              <Card key={assignment.id} className={overdue && !submission ? 'border-destructive/50' : ''}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-lg">{assignment.title}</CardTitle>
                      <CardDescription>
                        {assignment.class_name} • {assignment.class_subject}
                      </CardDescription>
                    </div>
                    {submission ? (
                      submission.graded && assignment.results_released ? (
                        <Badge variant="default" className="bg-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Graded
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <Clock className="h-3 w-3 mr-1" />
                          Submitted
                        </Badge>
                      )
                    ) : overdue ? (
                      <Badge variant="destructive">Overdue</Badge>
                    ) : (
                      <Badge variant="outline">Pending</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {assignment.description && (
                    <p className="text-sm text-muted-foreground">{assignment.description}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    {assignment.due_date && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Due: {format(new Date(assignment.due_date), 'PPp')}
                      </div>
                    )}
                    <div className="text-muted-foreground">
                      Max Marks: {assignment.max_marks}
                    </div>
                  </div>

                  {submission ? (
                    <div className="pt-2 space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Submitted: {format(new Date(submission.submitted_at), 'PPp')}
                      </p>
                      {submission.graded && assignment.results_released && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewResult(submission)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Result ({submission.marks}/{assignment.max_marks})
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Dialog open={uploadDialogOpen && selectedAssignment?.id === assignment.id} 
                            onOpenChange={(open) => {
                              setUploadDialogOpen(open);
                              if (!open) setSelectedAssignment(null);
                            }}>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full" 
                          disabled={overdue}
                          onClick={() => setSelectedAssignment(assignment)}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {overdue ? 'Submission Closed' : 'Submit Assignment'}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Submit: {assignment.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="bg-muted/50 p-3 rounded-lg text-sm">
                            <p><strong>Class:</strong> {assignment.class_name}</p>
                            <p><strong>Max Marks:</strong> {assignment.max_marks}</p>
                            {assignment.due_date && (
                              <p><strong>Due:</strong> {format(new Date(assignment.due_date), 'PPp')}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label>Upload File (PDF, ZIP, or Images - Max 10MB)</Label>
                            <Input
                              ref={fileInputRef}
                              type="file"
                              accept=".pdf,.zip,image/*"
                              onChange={handleFileUpload}
                              disabled={uploading}
                            />
                          </div>
                          {uploading && (
                            <div className="flex items-center justify-center py-4">
                              <div className="animate-spin rounded-full h-6 w-6 border-4 border-primary border-t-transparent" />
                              <span className="ml-2">Uploading...</span>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Result Dialog */}
      <Dialog open={resultDialogOpen} onOpenChange={setResultDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assignment Result</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <div className="text-4xl font-bold text-primary">
                  {selectedSubmission.marks}
                </div>
                <p className="text-muted-foreground">marks obtained</p>
              </div>
              {selectedSubmission.feedback && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="font-medium mb-2">Feedback:</p>
                  <p className="text-sm whitespace-pre-wrap">{selectedSubmission.feedback}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}