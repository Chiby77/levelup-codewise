import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Sparkles, Users } from 'lucide-react';
import { BluewaveLogo } from '@/components/BluewaveLogo';
import { toast } from '@/hooks/use-toast';

export default function Auth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        await redirectBasedOnRole(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        await redirectBasedOnRole(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const redirectBasedOnRole = async (userId: string) => {
    // Students go to student dashboard - admins should use the secret portal
    navigate('/student-dashboard');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Don't show toast here, redirect will happen from onAuthStateChange
      // The redirect is handled by the auth state change listener
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prevent admin email from signing up
      if (email.toLowerCase() === 'tinodaishemchibi@gmail.com') {
        toast({
          variant: "destructive",
          title: "Signup not allowed",
          description: "This email is reserved for admin. Please use the login form.",
        });
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/student-dashboard`,
          data: {
            full_name: fullName,
            student_id: studentId,
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Account created!",
        description: "You can now sign in with your credentials.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-primary/10 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 border-primary/30 hover:bg-primary/10 hover:border-primary/50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>

        <div className="text-center space-y-3">
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-hero rounded-2xl blur-lg animate-pulse" />
              <BluewaveLogo className="relative h-20 w-20 rounded-2xl shadow-xl" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gradient-primary">
            Bluewave Academy
          </h1>
          <p className="text-muted-foreground">Digital Examination System</p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Powered by <strong className="text-primary">Bluewave Technologies</strong></span>
          </div>
        </div>

        <Card className="border-primary/20 shadow-elegant bg-card/80 backdrop-blur">
          <CardHeader className="space-y-1 bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle className="text-primary">Student Portal</CardTitle>
            </div>
            <CardDescription>Sign in to access your exams and results</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2 bg-primary/10">
                <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Login
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-foreground">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-primary/30 focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-foreground">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-primary/30 focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-hero hover:opacity-90 text-primary-foreground font-semibold" 
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4 mt-4">
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-4">
                    <p className="text-sm text-primary">
                      <strong>Student Registration:</strong> Create your account to access exams and view your results.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-foreground">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="border-primary/30 focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-student-id" className="text-foreground">Student ID (Optional)</Label>
                    <Input
                      id="signup-student-id"
                      type="text"
                      placeholder="STU12345"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="border-primary/30 focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-foreground">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-primary/30 focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-foreground">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="border-primary/30 focus:border-primary focus:ring-primary"
                    />
                    <p className="text-xs text-muted-foreground">
                      Minimum 6 characters
                    </p>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-hero hover:opacity-90 text-primary-foreground font-semibold" 
                    disabled={loading}
                  >
                    {loading ? 'Creating account...' : 'Sign Up as Student'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            Co-founder & CEO: <strong className="text-primary">Tinodaishe M. Chibi</strong>
          </p>
          <p className="text-xs text-muted-foreground">
            © 2026 Bluewave Technologies. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
