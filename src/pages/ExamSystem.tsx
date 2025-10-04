import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AdminDashboard } from '@/components/exam/AdminDashboard';
import { StudentExamPortal } from '@/components/exam/StudentExamPortal';
import { GraduationCap, User, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const ExamSystem = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'select' | 'admin' | 'student' | 'exam'>('select');
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentExamId, setCurrentExamId] = useState<string>('');
  const [studentInfo, setStudentInfo] = useState<{ name: string; email?: string }>({ name: '' });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setUser(session.user);
      // Check if user is admin
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin')
        .single();
      
      if (roleData) {
        setIsAdmin(true);
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (session) {
        checkAdminRole(session.user.id);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  };

  const checkAdminRole = async (userId: string) => {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .single();
    
    setIsAdmin(!!data);
  };

  const handleModeSelect = (selectedMode: 'admin' | 'student') => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (selectedMode === 'admin' && !isAdmin) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You don't have admin privileges.",
      });
      return;
    }

    if (selectedMode === 'student') {
      navigate('/student-dashboard');
      return;
    }

    setMode(selectedMode);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMode('select');
    navigate('/');
  };

  const handleStartExam = (examId: string, student: { name: string; email?: string }) => {
    setCurrentExamId(examId);
    setStudentInfo(student);
    setMode('exam');
  };

  if (mode === 'select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="w-full max-w-4xl space-y-8 relative z-10">
          {/* Back to Home Button */}
          <div className="flex justify-start animate-in slide-in-from-left duration-500">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </div>
          
          <div className="text-center space-y-4 animate-in fade-in zoom-in duration-700">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-br from-primary to-accent p-6 rounded-full animate-pulse shadow-xl">
                <GraduationCap className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              CS Experts Zimbabwe
            </h1>
            <p className="text-2xl text-muted-foreground">
              Next-Gen Digital Examination System
            </p>
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse" />
              Powered by Intellix Inc | Founded by Tinodaishe M Chibi
              <span className="inline-block w-2 h-2 bg-accent rounded-full animate-pulse" />
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="animate-in slide-in-from-left duration-500 delay-200">
              <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 group relative overflow-hidden h-full"
                    onClick={() => handleModeSelect('admin')}>
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="text-center pb-4 relative">
                  <div className="bg-gradient-to-br from-secondary to-secondary/50 p-6 rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-bold">Admin Portal</CardTitle>
                </CardHeader>
                <CardContent className="text-center relative">
                  <p className="text-muted-foreground mb-6 text-lg">
                    Create and manage exams, view student submissions and results
                  </p>
                  <Button className="w-full group-hover:scale-105 transition-transform bg-gradient-to-r from-secondary to-secondary/80" size="lg">
                    Access Admin Panel
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="animate-in slide-in-from-right duration-500 delay-300">
              <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 group relative overflow-hidden h-full"
                    onClick={() => handleModeSelect('student')}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="text-center pb-4 relative">
                  <div className="bg-gradient-to-br from-primary to-accent p-6 rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <GraduationCap className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-bold">Student Portal</CardTitle>
                </CardHeader>
                <CardContent className="text-center relative">
                  <p className="text-muted-foreground mb-6 text-lg">
                    Take exams, submit answers, and view your results
                  </p>
                  <Button className="w-full group-hover:scale-105 transition-transform bg-gradient-to-r from-primary to-accent" size="lg">
                    Start Examination
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'admin') {
    if (!user || !isAdmin) {
      navigate('/auth');
      return null;
    }
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="p-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
        <AdminDashboard onLogout={handleLogout} />
      </div>
    );
  }

  if (mode === 'student') {
    if (!user) {
      navigate('/auth');
      return null;
    }
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="p-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
        <StudentExamPortal onBack={() => navigate('/student-dashboard')} />
      </div>
    );
  }

  if (mode === 'exam') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="p-4">
          <Button 
            variant="outline" 
            onClick={() => setMode('student')}
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Portal
          </Button>
        </div>
        <StudentExamPortal onBack={() => setMode('student')} />
      </div>
    );
  }

  return null;
};