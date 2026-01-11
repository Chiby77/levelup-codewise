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
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!mounted) return;

      if (!session) {
        setLoading(false);
        navigate('/auth');
        return;
      }

      setUser(session.user);

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin')
        .single();

      if (!mounted) return;

      if (roleData) {
        setIsAdmin(true);
      } else {
        // Students never see the admin entrypoint
        navigate('/student-dashboard');
      }

      setLoading(false);
    };

    run();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      if (!session) {
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
        navigate('/auth');
        return;
      }

      setUser(session.user);

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin')
        .single();

      if (!mounted) return;

      setIsAdmin(!!roleData);
      if (!roleData) navigate('/student-dashboard');
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Non-admins are redirected away; render nothing.
  if (!user || !isAdmin) return null;

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
};