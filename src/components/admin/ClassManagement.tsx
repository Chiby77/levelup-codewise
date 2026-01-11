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
import { Plus, Users, BookOpen, Trash2, UserPlus, UserMinus, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

interface Class {
  id: string;
  name: string;
  subject: string;
  description: string | null;
  year_level: string;
  is_active: boolean;
  created_at: string;
}

interface Enrollment {
  id: string;
  class_id: string;
  student_id: string;
  student_email: string;
  enrolled_at: string;
  is_active: boolean;
}

interface Exam {
  id: string;
  title: string;
  subject: string;
  status: string;
}

export default function ClassManagement() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [examAssignments, setExamAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  
  // Create class form
  const [newClassName, setNewClassName] = useState('');
  const [newClassSubject, setNewClassSubject] = useState('');
  const [newClassDescription, setNewClassDescription] = useState('');
  const [newClassYearLevel, setNewClassYearLevel] = useState('Year 1');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  // Enrollment form
  const [enrollEmail, setEnrollEmail] = useState('');
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  
  // Exam assignment
  const [selectedExam, setSelectedExam] = useState('');
  const [assignExamDialogOpen, setAssignExamDialogOpen] = useState(false);

  useEffect(() => {
    fetchClasses();
    fetchExams();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchEnrollments(selectedClass.id);
      fetchExamAssignments(selectedClass.id);
    }
  }, [selectedClass]);

  const fetchClasses = async () => {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast.error('Failed to fetch classes');
      return;
    }
    setClasses(data || []);
    setLoading(false);
  };

  const fetchEnrollments = async (classId: string) => {
    const { data, error } = await supabase
      .from('class_enrollments')
      .select('*')
      .eq('class_id', classId)
      .order('enrolled_at', { ascending: false });
    
    if (error) {
      toast.error('Failed to fetch enrollments');
      return;
    }
    setEnrollments(data || []);
  };

  const fetchExams = async () => {
    const { data, error } = await supabase
      .from('exams')
      .select('id, title, subject, status')
      .order('created_at', { ascending: false });
    
    if (error) return;
    setExams(data || []);
  };

  const fetchExamAssignments = async (classId: string) => {
    const { data, error } = await supabase
      .from('exam_class_assignments')
      .select('*, exams(title, subject, status)')
      .eq('class_id', classId);
    
    if (error) return;
    setExamAssignments(data || []);
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('classes')
      .insert({
        name: newClassName,
        subject: newClassSubject,
        description: newClassDescription || null,
        year_level: newClassYearLevel,
        created_by: user.id,
      });

    if (error) {
      toast.error('Failed to create class');
      return;
    }

    toast.success('Class created successfully');
    setCreateDialogOpen(false);
    setNewClassName('');
    setNewClassSubject('');
    setNewClassDescription('');
    fetchClasses();
  };

  const handleEnrollStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Find student by email (must already have an account)
    const normalizedEmail = enrollEmail.trim().toLowerCase();

    const { data: lookupData, error: lookupError } = await supabase.functions.invoke(
      'admin-user-management',
      {
        body: {
          action: 'find_user_by_email',
          data: { email: normalizedEmail },
        },
      }
    );

    if (lookupError) {
      console.error('find_user_by_email error:', lookupError);
      toast.error('Failed to look up student account');
      return;
    }

    const studentId: string | undefined = lookupData?.user?.id;

    if (!studentId) {
      toast.error('Student must sign up first (account not found for this email)');
      return;
    }

    const { error } = await supabase
      .from('class_enrollments')
      .insert({
        class_id: selectedClass.id,
        student_id: studentId,
        student_email: enrollEmail,
        enrolled_by: user.id,
      });

    if (error) {
      if (error.code === '23505') {
        toast.error('Student already enrolled in this class');
      } else {
        toast.error('Failed to enroll student');
      }
      return;
    }

    toast.success('Student enrolled successfully');
    setEnrollDialogOpen(false);
    setEnrollEmail('');
    fetchEnrollments(selectedClass.id);
  };

  const handleUnenrollStudent = async (enrollmentId: string) => {
    const { error } = await supabase
      .from('class_enrollments')
      .delete()
      .eq('id', enrollmentId);

    if (error) {
      toast.error('Failed to unenroll student');
      return;
    }

    toast.success('Student unenrolled');
    if (selectedClass) {
      fetchEnrollments(selectedClass.id);
    }
  };

  const handleAssignExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass || !selectedExam) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('exam_class_assignments')
      .insert({
        exam_id: selectedExam,
        class_id: selectedClass.id,
        assigned_by: user.id,
      });

    if (error) {
      if (error.code === '23505') {
        toast.error('Exam already assigned to this class');
      } else {
        toast.error('Failed to assign exam');
      }
      return;
    }

    toast.success('Exam assigned to class');
    setAssignExamDialogOpen(false);
    setSelectedExam('');
    fetchExamAssignments(selectedClass.id);
  };

  const handleUnassignExam = async (assignmentId: string) => {
    const { error } = await supabase
      .from('exam_class_assignments')
      .delete()
      .eq('id', assignmentId);

    if (error) {
      toast.error('Failed to unassign exam');
      return;
    }

    toast.success('Exam unassigned from class');
    if (selectedClass) {
      fetchExamAssignments(selectedClass.id);
    }
  };

  const handleDeleteClass = async (classId: string) => {
    if (!confirm('Are you sure you want to delete this class? This will also remove all enrollments.')) return;

    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', classId);

    if (error) {
      toast.error('Failed to delete class');
      return;
    }

    toast.success('Class deleted');
    setSelectedClass(null);
    fetchClasses();
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading classes...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          Class Management
        </h2>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Class
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Class</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateClass} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="class-name">Class Name</Label>
                <Input
                  id="class-name"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="e.g., Computer Science 101"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={newClassSubject}
                  onChange={(e) => setNewClassSubject(e.target.value)}
                  placeholder="e.g., Computer Science"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year-level">Year Level</Label>
                <Select value={newClassYearLevel} onValueChange={setNewClassYearLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Year 1">Year 1</SelectItem>
                    <SelectItem value="Year 2">Year 2</SelectItem>
                    <SelectItem value="Year 3">Year 3</SelectItem>
                    <SelectItem value="Year 4">Year 4</SelectItem>
                    <SelectItem value="Form 1">Form 1</SelectItem>
                    <SelectItem value="Form 2">Form 2</SelectItem>
                    <SelectItem value="Form 3">Form 3</SelectItem>
                    <SelectItem value="Form 4">Form 4</SelectItem>
                    <SelectItem value="Form 5">Form 5</SelectItem>
                    <SelectItem value="Form 6">Form 6</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={newClassDescription}
                  onChange={(e) => setNewClassDescription(e.target.value)}
                  placeholder="Class description..."
                />
              </div>
              <Button type="submit" className="w-full">Create Class</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Classes List */}
        <div className="md:col-span-1 space-y-4">
          <h3 className="font-semibold text-lg">Your Classes</h3>
          {classes.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No classes created yet
              </CardContent>
            </Card>
          ) : (
            classes.map((cls) => (
              <Card 
                key={cls.id} 
                className={`cursor-pointer transition-colors ${selectedClass?.id === cls.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                onClick={() => setSelectedClass(cls)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{cls.name}</h4>
                      <p className="text-sm text-muted-foreground">{cls.subject}</p>
                      <Badge variant="outline" className="mt-1">{cls.year_level}</Badge>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClass(cls.id);
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

        {/* Class Details */}
        <div className="md:col-span-2">
          {selectedClass ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{selectedClass.name}</span>
                  <Badge>{selectedClass.year_level}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="students">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="students">
                      <Users className="h-4 w-4 mr-2" />
                      Students ({enrollments.length})
                    </TabsTrigger>
                    <TabsTrigger value="exams">
                      <ClipboardList className="h-4 w-4 mr-2" />
                      Assigned Exams ({examAssignments.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="students" className="space-y-4">
                    <div className="flex justify-end">
                      <Dialog open={enrollDialogOpen} onOpenChange={setEnrollDialogOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Enroll Student
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Enroll Student</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleEnrollStudent} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="student-email">Student Email</Label>
                              <Input
                                id="student-email"
                                type="email"
                                value={enrollEmail}
                                onChange={(e) => setEnrollEmail(e.target.value)}
                                placeholder="student@example.com"
                                required
                              />
                            </div>
                            <Button type="submit" className="w-full">Enroll Student</Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>

                    {enrollments.length === 0 ? (
                      <p className="text-center text-muted-foreground py-4">No students enrolled</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Enrolled</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {enrollments.map((enrollment) => (
                            <TableRow key={enrollment.id}>
                              <TableCell>{enrollment.student_email}</TableCell>
                              <TableCell>{new Date(enrollment.enrolled_at).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUnenrollStudent(enrollment.id)}
                                >
                                  <UserMinus className="h-4 w-4 text-destructive" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </TabsContent>

                  <TabsContent value="exams" className="space-y-4">
                    <div className="flex justify-end">
                      <Dialog open={assignExamDialogOpen} onOpenChange={setAssignExamDialogOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Assign Exam
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Assign Exam to Class</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleAssignExam} className="space-y-4">
                            <div className="space-y-2">
                              <Label>Select Exam</Label>
                              <Select value={selectedExam} onValueChange={setSelectedExam}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose an exam" />
                                </SelectTrigger>
                                <SelectContent>
                                  {exams.map((exam) => (
                                    <SelectItem key={exam.id} value={exam.id}>
                                      {exam.title} ({exam.status})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <Button type="submit" className="w-full">Assign Exam</Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>

                    {examAssignments.length === 0 ? (
                      <p className="text-center text-muted-foreground py-4">No exams assigned</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Exam</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {examAssignments.map((assignment) => (
                            <TableRow key={assignment.id}>
                              <TableCell>{assignment.exams?.title}</TableCell>
                              <TableCell>
                                <Badge variant={assignment.exams?.status === 'active' ? 'default' : 'secondary'}>
                                  {assignment.exams?.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUnassignExam(assignment.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a class to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
