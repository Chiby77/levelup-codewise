import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Clock, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ExamInterface } from './ExamInterface';
import { ExamResults } from './ExamResults';

interface StudentExamPortalProps {
  onBack: () => void;
}

interface Exam {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  total_marks: number;
}

export const StudentExamPortal: React.FC<StudentExamPortalProps> = ({ onBack }) => {
  const [step, setStep] = useState<'select' | 'details' | 'exam' | 'results'>('select');
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [studentData, setStudentData] = useState({
    name: '',
    email: ''
  });
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveExams();
  }, []);

  const fetchActiveExams = async () => {
    try {
      // RLS on exams table now handles visibility:
      // - General exams (is_general=true) visible to all authenticated users
      // - Class-specific exams visible only to students enrolled in those classes
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExams(data || []);
    } catch (error) {
      console.error('Error fetching exams:', error);
      toast.error('Failed to load exams');
    } finally {
      setLoading(false);
    }
  };

  const handleExamSelect = (exam: Exam) => {
    setSelectedExam(exam);
    setStep('details');
  };

  const handleStartExam = () => {
    if (!studentData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    setStep('exam');
  };

  const handleExamComplete = (submissionId: string) => {
    setSubmissionId(submissionId);
    setStep('results');
  };

  const handleReturnToPortal = () => {
    setStep('select');
    setSelectedExam(null);
    setStudentData({ name: '', email: '' });
    setSubmissionId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading exams...</p>
        </div>
      </div>
    );
  }

  if (step === 'exam' && selectedExam) {
    return (
      <ExamInterface
        exam={selectedExam}
        studentData={studentData}
        onComplete={handleExamComplete}
      />
    );
  }

  if (step === 'results' && submissionId) {
    return (
      <ExamResults
        submissionId={submissionId}
        studentData={studentData}
        onReturnToPortal={handleReturnToPortal}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="container mx-auto max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={step === 'details' ? () => setStep('select') : onBack}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {step === 'details' ? 'Back to Exam Selection' : 'Back to Portal Selection'}
        </Button>

        {step === 'select' && (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold">Available Examinations</h1>
              <p className="text-muted-foreground">
                Select an exam to begin your assessment
              </p>
            </div>

            {exams.length === 0 ? (
              <Card className="text-center">
                <CardContent className="py-12">
                  <p className="text-muted-foreground text-lg mb-4">
                    No active examinations available at the moment
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Please check back later or contact your administrator
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {exams.map((exam) => (
                  <Card 
                    key={exam.id} 
                    className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/50"
                    onClick={() => handleExamSelect(exam)}
                  >
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg sm:text-xl">{exam.title}</CardTitle>
                          <p className="text-muted-foreground mt-1">{exam.description}</p>
                        </div>
                        <Button variant="outline" className="w-full sm:w-auto">
                          Start Exam
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{exam.duration_minutes} minutes</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>Total Marks: {exam.total_marks}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 'details' && selectedExam && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{selectedExam.title}</CardTitle>
                <p className="text-muted-foreground">{selectedExam.description}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-5 w-5" />
                    <span>Duration: {selectedExam.duration_minutes} minutes</span>
                  </div>
                  <div className="text-muted-foreground">
                    <span>Total Marks: {selectedExam.total_marks}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Student Information</h3>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="studentName">Full Name *</Label>
                      <Input
                        id="studentName"
                        value={studentData.name}
                        onChange={(e) => setStudentData({ ...studentData, name: e.target.value })}
                        placeholder="Enter your full name"
                        required
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studentEmail">Email (Optional)</Label>
                      <Input
                        id="studentEmail"
                        type="email"
                        value={studentData.email}
                        onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
                        placeholder="Enter your email address"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Exam Instructions:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Read all questions carefully before answering</li>
                    <li>• For coding questions, write clean and commented code</li>
                    <li>• For flowcharts, use the drawing tool provided</li>
                    <li>• You can navigate between questions freely</li>
                    <li>• Your exam will auto-submit when time expires</li>
                    <li>• Make sure you have a stable internet connection</li>
                  </ul>
                </div>

                <Button 
                  onClick={handleStartExam} 
                  className="w-full mt-6" 
                  size="lg"
                  disabled={!studentData.name.trim()}
                >
                  <User className="h-4 w-4 mr-2" />
                  Start Examination
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mt-12 text-center text-sm text-muted-foreground space-y-2">
          <p>Bluewave Technologies Digital Examination System</p>
          <p>Co-founder & CEO: Tinodaishe M. Chibi</p>
          <p className="text-xs">© 2026 Bluewave Technologies. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};