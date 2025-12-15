import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  GraduationCap, 
  BookOpen, 
  FileText, 
  Image, 
  TrendingUp,
  LogOut,
  Clock,
  Award,
  Calendar,
  History
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { WhatsAppPromo } from '@/components/WhatsAppPromo';
import { FeedbackModal } from '@/components/FeedbackModal';
import { StudentProfile } from '@/components/student/StudentProfile';
import { StudyRecommendations } from '@/components/student/StudyRecommendations';
import { useCachedActiveExams, useCachedAnnouncements, useCachedStudyTips } from '@/hooks/useCachedData';
import { useQuery } from '@tanstack/react-query';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Use cached data for better performance
  const { data: exams = [], isLoading: examsLoading } = useCachedActiveExams();
  const { data: announcements = [], isLoading: announcementsLoading } = useCachedAnnouncements();
  const { data: tips = [], isLoading: tipsLoading } = useCachedStudyTips();

  // Cached submissions query
  const { data: submissions = [], isLoading: submissionsLoading } = useQuery({
    queryKey: ['student-submissions', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const { data } = await supabase
        .from('student_submissions')
        .select('*, exams(title)')
        .eq('student_email', user.email)
        .order('submitted_at', { ascending: false });
      return data || [];
    },
    enabled: !!user?.email,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Cached books query
  const { data: books = [], isLoading: booksLoading } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const { data } = await supabase.storage.from('books').list();
      return data || [];
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

  const loading = examsLoading || announcementsLoading || tipsLoading || submissionsLoading;

  useEffect(() => {
    checkAuth();
    
    // Show feedback modal occasionally (every 5th login)
    const loginCount = parseInt(localStorage.getItem('loginCount') || '0') + 1;
    localStorage.setItem('loginCount', loginCount.toString());
    if (loginCount % 5 === 0) {
      setTimeout(() => setShowFeedback(true), 3000);
    }
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
      return;
    }
    setUser(session.user);
    fetchProfile(session.user.id);
  };

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (data) setProfile(data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  // Memoized stats calculation for performance
  const stats = useMemo(() => {
    const totalExams = submissions.length;
    const gradedExams = submissions.filter((s: any) => s.graded && s.max_score && s.max_score > 0).length;
    const avgScore = gradedExams > 0 
      ? submissions
          .filter((s: any) => s.graded && s.max_score && s.max_score > 0)
          .reduce((acc: number, s: any) => acc + ((s.total_score || 0) / s.max_score) * 100, 0) / gradedExams 
      : 0;

    return { totalExams, gradedExams, avgScore: avgScore.toFixed(1) };
  }, [submissions]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Student Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Welcome, {profile?.full_name || user?.email}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalExams}</div>
              <p className="text-xs text-muted-foreground">
                {stats.gradedExams} graded
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgScore}%</div>
              <p className="text-xs text-muted-foreground">
                Across all graded exams
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Available Exams</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{exams.length}</div>
              <p className="text-xs text-muted-foreground">
                Ready to take
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <Button 
            onClick={() => navigate('/submission-history')}
            variant="outline"
            className="gap-2"
          >
            <History className="h-4 w-4" />
            View Full Submission History
          </Button>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="exams" className="space-y-4">
          <TabsList>
            <TabsTrigger value="exams">Available Exams</TabsTrigger>
            <TabsTrigger value="profile">📊 My Progress</TabsTrigger>
            <TabsTrigger value="recommendations">💡 Study Plan</TabsTrigger>
            <TabsTrigger value="history">Recent Submissions</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="exams" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Available Exams</CardTitle>
                <CardDescription>Click on an exam to start</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {exams.map((exam) => (
                      <Card key={exam.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => navigate('/student-exam', { state: { examId: exam.id } })}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <CardTitle className="text-lg">{exam.title}</CardTitle>
                              <CardDescription>{exam.description}</CardDescription>
                            </div>
                            <Badge variant="secondary">{exam.subject}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {exam.duration_minutes} mins
                            </div>
                            <div className="flex items-center gap-1">
                              <Award className="h-4 w-4" />
                              {exam.total_marks} marks
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <StudentProfile studentEmail={user?.email || ''} />
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            <StudyRecommendations studentEmail={user?.email || ''} />
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Exam History</CardTitle>
                <CardDescription>Your past exam submissions and scores</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {submissions.map((submission) => (
                      <Card key={submission.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <CardTitle className="text-lg">
                                {submission.exams?.title || 'Exam'}
                              </CardTitle>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                {new Date(submission.submitted_at).toLocaleDateString()}
                              </div>
                            </div>
                            {submission.graded ? (
                              <Badge variant={submission.total_score / submission.max_score >= 0.5 ? 'default' : 'destructive'}>
                                {submission.total_score}/{submission.max_score}
                              </Badge>
                            ) : (
                              <Badge variant="outline">Pending</Badge>
                            )}
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="announcements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Announcements</CardTitle>
                <CardDescription>Latest updates and news</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {announcements.map((announcement) => (
                      <Card key={announcement.id}>
                        <CardHeader>
                          <CardTitle className="text-lg">{announcement.title}</CardTitle>
                          <CardDescription>
                            {new Date(announcement.created_at).toLocaleDateString()}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">{announcement.content}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    <CardTitle>Study Tips</CardTitle>
                  </div>
                  <CardDescription>Helpful tips for exam preparation</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3">
                      {tips.map((tip) => (
                        <Card key={tip.id}>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm">{tip.title}</CardTitle>
                            <Badge variant="outline" className="w-fit">
                              {tip.category}
                            </Badge>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <p className="text-sm text-muted-foreground">{tip.content}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    <CardTitle>Books & Materials</CardTitle>
                  </div>
                  <CardDescription>Download study materials</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-2">
                      {books.map((book) => (
                        <Button 
                          key={book.name} 
                          variant="outline" 
                          className="w-full justify-start"
                          onClick={async () => {
                            const { data } = await supabase.storage
                              .from('books')
                              .createSignedUrl(book.name, 60);
                            if (data) window.open(data.signedUrl, '_blank');
                          }}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          {book.name}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* WhatsApp Community Promotion */}
        <div className="mt-8">
          <WhatsAppPromo />
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal 
        isOpen={showFeedback} 
        onClose={() => setShowFeedback(false)} 
      />
    </div>
  );
}
