import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AdminLogin } from '@/components/exam/AdminLogin';
import { AdminDashboard } from '@/components/exam/AdminDashboard';
import { StudentExamPortal } from '@/components/exam/StudentExamPortal';
import { GraduationCap, User, ArrowLeft } from 'lucide-react';

export const ExamSystem = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'select' | 'admin' | 'student'>('select');
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);

  const handleModeSelect = (selectedMode: 'admin' | 'student') => {
    setMode(selectedMode);
  };

  const handleAdminLogin = () => {
    setAdminAuthenticated(true);
  };

  const handleLogout = () => {
    setAdminAuthenticated(false);
    setMode('select');
  };

  if (mode === 'select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-8">
          {/* Back to Home Button */}
          <div className="flex justify-start">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </div>
          
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-primary/10 p-4 rounded-full">
                <GraduationCap className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              CS Experts Zimbabwe
            </h1>
            <p className="text-xl text-muted-foreground">
              Digital Examination System
            </p>
            <p className="text-sm text-muted-foreground">
              Powered by Intellix Inc | Founded by Tinodaishe M Chibi
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/50"
                  onClick={() => handleModeSelect('admin')}>
              <CardHeader className="text-center pb-4">
                <div className="bg-secondary/10 p-4 rounded-full w-fit mx-auto mb-4">
                  <User className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle className="text-2xl">Admin Portal</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">
                  Create and manage exams, view student submissions and results
                </p>
                <Button className="w-full" size="lg">
                  Access Admin Panel
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/50"
                  onClick={() => handleModeSelect('student')}>
              <CardHeader className="text-center pb-4">
                <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-4">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Student Portal</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">
                  Take exams, submit answers, and view your results
                </p>
                <Button className="w-full" size="lg" variant="outline">
                  Start Examination
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'admin') {
    if (!adminAuthenticated) {
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
          <AdminLogin 
            onLogin={handleAdminLogin} 
            onBack={() => setMode('select')} 
          />
        </div>
      );
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
        <StudentExamPortal onBack={() => setMode('select')} />
      </div>
    );
  }

  return null;
};