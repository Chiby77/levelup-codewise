import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Calendar,
  Clock,
  Edit,
  Eye,
  Globe,
  Power,
  Save,
  Trash2,
  Users,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Exam {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  total_marks: number;
  status: string;
  created_at: string;
  start_time?: string;
  end_time?: string;
  auto_activate?: boolean;
  auto_deactivate?: boolean;
  is_general?: boolean;
}

interface ClassOption {
  id: string;
  name: string;
  subject: string;
  year_level: string;
}

interface ExamClassAssignment {
  class_id: string;
  exam_id: string;
}

interface ExamManagementProps {
  exams: Exam[];
  onRefresh: () => void;
}

export const ExamManagement: React.FC<ExamManagementProps> = ({ exams, onRefresh }) => {
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [assignedClasses, setAssignedClasses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    duration_minutes: 60,
    total_marks: 100,
    status: 'draft' as 'draft' | 'active',
    is_general: true,
    start_time: '',
    end_time: '',
    auto_activate: false,
    auto_deactivate: false,
  });
  
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  const [studentsPreview, setStudentsPreview] = useState<{ name: string; email: string }[]>([]);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const { data, error } = await supabase
      .from('classes')
      .select('id, name, subject, year_level')
      .eq('is_active', true)
      .order('name');
    
    if (!error && data) {
      setClasses(data);
    }
  };

  const fetchAssignedClasses = async (examId: string) => {
    const { data, error } = await supabase
      .from('exam_class_assignments')
      .select('class_id')
      .eq('exam_id', examId);
    
    if (!error && data) {
      setAssignedClasses(data.map(a => a.class_id));
      setSelectedClassIds(data.map(a => a.class_id));
    }
  };

  const fetchStudentsPreview = async (classIds: string[], isGeneral: boolean) => {
    if (isGeneral) {
      // For general exams, show all enrolled students
      const { data, error } = await supabase
        .from('class_enrollments')
        .select('student_email, student_id')
        .eq('is_active', true)
        .limit(20);
      
      if (!error && data) {
        const uniqueStudents = Array.from(new Map(data.map(s => [s.student_email, s])).values());
        setStudentsPreview(uniqueStudents.map(s => ({
          name: s.student_id,
          email: s.student_email
        })));
      }
    } else if (classIds.length > 0) {
      // For class-specific exams, show enrolled students
      const { data, error } = await supabase
        .from('class_enrollments')
        .select('student_email, student_id')
        .in('class_id', classIds)
        .eq('is_active', true);
      
      if (!error && data) {
        const uniqueStudents = Array.from(new Map(data.map(s => [s.student_email, s])).values());
        setStudentsPreview(uniqueStudents.map(s => ({
          name: s.student_id,
          email: s.student_email
        })));
      }
    } else {
      setStudentsPreview([]);
    }
  };

  const openEditDialog = async (exam: Exam) => {
    setSelectedExam(exam);
    setEditForm({
      title: exam.title,
      description: exam.description || '',
      duration_minutes: exam.duration_minutes,
      total_marks: exam.total_marks,
      status: exam.status as 'draft' | 'active',
      is_general: exam.is_general !== false,
      start_time: exam.start_time ? new Date(exam.start_time).toISOString().slice(0, 16) : '',
      end_time: exam.end_time ? new Date(exam.end_time).toISOString().slice(0, 16) : '',
      auto_activate: exam.auto_activate || false,
      auto_deactivate: exam.auto_deactivate || false,
    });
    
    await fetchAssignedClasses(exam.id);
    setShowEditDialog(true);
  };

  const handleClassToggle = (classId: string) => {
    setSelectedClassIds(prev => {
      const newIds = prev.includes(classId)
        ? prev.filter(id => id !== classId)
        : [...prev, classId];
      
      // Fetch students preview for selected classes
      fetchStudentsPreview(newIds, editForm.is_general);
      return newIds;
    });
  };

  const handleAudienceChange = (isGeneral: boolean) => {
    setEditForm(prev => ({ ...prev, is_general: isGeneral }));
    if (isGeneral) {
      setSelectedClassIds([]);
    }
    fetchStudentsPreview(isGeneral ? [] : selectedClassIds, isGeneral);
  };

  const validateSchedule = (): boolean => {
    if (editForm.start_time && editForm.end_time) {
      const start = new Date(editForm.start_time);
      const end = new Date(editForm.end_time);
      
      if (end <= start) {
        toast.error('End time must be after start time');
        return false;
      }
    }
    
    if (editForm.auto_activate && !editForm.start_time) {
      toast.error('Start time is required for auto-activation');
      return false;
    }
    
    if (editForm.auto_deactivate && !editForm.end_time) {
      toast.error('End time is required for auto-deactivation');
      return false;
    }
    
    return true;
  };

  const saveExam = async () => {
    if (!selectedExam) return;
    
    if (!validateSchedule()) return;
    
    setLoading(true);
    
    try {
      // Determine the correct status
      let finalStatus = editForm.status;
      if (editForm.auto_activate && editForm.start_time) {
        const startTime = new Date(editForm.start_time);
        if (startTime > new Date()) {
          finalStatus = 'draft';
        }
      }
      
      // Update exam
      const { error: examError } = await supabase
        .from('exams')
        .update({
          title: editForm.title,
          description: editForm.description,
          duration_minutes: editForm.duration_minutes,
          total_marks: editForm.total_marks,
          status: finalStatus,
          is_general: editForm.is_general,
          start_time: editForm.start_time || null,
          end_time: editForm.end_time || null,
          auto_activate: editForm.auto_activate,
          auto_deactivate: editForm.auto_deactivate,
        })
        .eq('id', selectedExam.id);
      
      if (examError) throw examError;
      
      // Update class assignments
      if (!editForm.is_general) {
        // Remove old assignments
        await supabase
          .from('exam_class_assignments')
          .delete()
          .eq('exam_id', selectedExam.id);
        
        // Add new assignments
        if (selectedClassIds.length > 0) {
          const { data: { user } } = await supabase.auth.getUser();
          
          const assignments = selectedClassIds.map(classId => ({
            exam_id: selectedExam.id,
            class_id: classId,
            assigned_by: user?.id || '',
          }));
          
          const { error: assignError } = await supabase
            .from('exam_class_assignments')
            .insert(assignments);
          
          if (assignError) throw assignError;
        }
      } else {
        // Remove all class assignments for general exams
        await supabase
          .from('exam_class_assignments')
          .delete()
          .eq('exam_id', selectedExam.id);
      }
      
      toast.success('Exam updated successfully');
      setShowEditDialog(false);
      onRefresh();
    } catch (error: any) {
      console.error('Error updating exam:', error);
      toast.error(error.message || 'Failed to update exam');
    } finally {
      setLoading(false);
    }
  };

  const toggleExamStatus = async (exam: Exam) => {
    const newStatus = exam.status === 'active' ? 'draft' : 'active';
    
    try {
      const { error } = await supabase
        .from('exams')
        .update({ status: newStatus })
        .eq('id', exam.id);
      
      if (error) throw error;
      toast.success(`Exam ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
      onRefresh();
    } catch (error) {
      toast.error('Failed to update exam status');
    }
  };

  const deleteExam = async (examId: string) => {
    if (!confirm('Are you sure you want to delete this exam? This will also delete all questions and submissions.')) {
      return;
    }
    
    try {
      const { error } = await supabase.from('exams').delete().eq('id', examId);
      if (error) throw error;
      toast.success('Exam deleted');
      onRefresh();
    } catch (error) {
      toast.error('Failed to delete exam');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'draft': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-foreground">Exam Management</h2>
        <Badge variant="outline">{exams.length} Exams</Badge>
      </div>
      
      <div className="grid gap-4">
        {exams.map((exam) => (
          <Card key={exam.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Exam Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h3 className="font-semibold text-foreground truncate">{exam.title}</h3>
                    <Badge variant={exam.status === 'active' ? 'default' : 'secondary'}>
                      {exam.status}
                    </Badge>
                    <Badge variant="outline">
                      {exam.is_general !== false ? (
                        <><Globe className="h-3 w-3 mr-1" /> General</>
                      ) : (
                        <><Users className="h-3 w-3 mr-1" /> Class-specific</>
                      )}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {exam.description || 'No description'}
                  </p>
                  
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {exam.duration_minutes} mins
                    </span>
                    <span>📝 {exam.total_marks} marks</span>
                    {exam.start_time && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(exam.start_time), 'MMM d, HH:mm')}
                      </span>
                    )}
                    {exam.auto_activate && (
                      <Badge variant="outline" className="text-[10px] bg-green-500/10">
                        <CheckCircle className="h-2 w-2 mr-1" /> Auto-activate
                      </Badge>
                    )}
                    {exam.auto_deactivate && (
                      <Badge variant="outline" className="text-[10px] bg-red-500/10">
                        <AlertTriangle className="h-2 w-2 mr-1" /> Auto-deactivate
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(exam)}
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleExamStatus(exam)}
                    title={exam.status === 'active' ? 'Deactivate' : 'Activate'}
                  >
                    <Power className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteExam(exam.id)}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {exams.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No exams found. Create one from the "Create" tab.
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Exam</DialogTitle>
            <DialogDescription>
              Update exam settings, audience, and schedule.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={editForm.duration_minutes}
                    onChange={(e) => setEditForm(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) || 60 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marks">Total Marks</Label>
                  <Input
                    id="marks"
                    type="number"
                    value={editForm.total_marks}
                    onChange={(e) => setEditForm(prev => ({ ...prev, total_marks: parseInt(e.target.value) || 100 }))}
                  />
                </div>
              </div>
            </div>
            
            {/* Audience Selection */}
            <div className="space-y-4 border rounded-lg p-4">
              <Label className="text-base font-semibold">Audience</Label>
              
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={editForm.is_general ? 'default' : 'outline'}
                  onClick={() => handleAudienceChange(true)}
                  className="flex-1"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  General (All Students)
                </Button>
                <Button
                  type="button"
                  variant={!editForm.is_general ? 'default' : 'outline'}
                  onClick={() => handleAudienceChange(false)}
                  className="flex-1"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Specific Classes
                </Button>
              </div>
              
              {!editForm.is_general && (
                <div className="space-y-2">
                  <Label>Select Classes</Label>
                  <ScrollArea className="h-32 border rounded-md p-2">
                    {classes.map((cls) => (
                      <div key={cls.id} className="flex items-center gap-2 py-1">
                        <Checkbox
                          checked={selectedClassIds.includes(cls.id)}
                          onCheckedChange={() => handleClassToggle(cls.id)}
                        />
                        <span className="text-sm">
                          {cls.name} - {cls.subject} ({cls.year_level})
                        </span>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
              )}
              
              {/* Students Preview */}
              {studentsPreview.length > 0 && (
                <div className="mt-2 p-2 bg-muted rounded-md">
                  <p className="text-xs text-muted-foreground mb-1">
                    {editForm.is_general ? 'All enrolled students can see this exam' : `${studentsPreview.length} students will see this exam`}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {studentsPreview.slice(0, 5).map((s, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {s.email}
                      </Badge>
                    ))}
                    {studentsPreview.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{studentsPreview.length - 5} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Schedule */}
            <div className="space-y-4 border rounded-lg p-4">
              <Label className="text-base font-semibold">Schedule</Label>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_time">Start Time</Label>
                  <Input
                    id="start_time"
                    type="datetime-local"
                    value={editForm.start_time}
                    onChange={(e) => setEditForm(prev => ({ ...prev, start_time: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_time">End Time</Label>
                  <Input
                    id="end_time"
                    type="datetime-local"
                    value={editForm.end_time}
                    onChange={(e) => setEditForm(prev => ({ ...prev, end_time: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={editForm.auto_activate}
                    onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, auto_activate: checked }))}
                  />
                  <Label className="text-sm">Auto-activate at start time</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={editForm.auto_deactivate}
                    onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, auto_deactivate: checked }))}
                  />
                  <Label className="text-sm">Auto-deactivate at end time</Label>
                </div>
              </div>
              
              {editForm.auto_activate && editForm.start_time && (
                <p className="text-xs text-muted-foreground">
                  ℹ️ Exam will be saved as "draft" and automatically activated at {format(new Date(editForm.start_time), 'PPp')}
                </p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveExam} disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
