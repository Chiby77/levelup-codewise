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
  TrendingUp,
  LogOut,
  Clock,
  Award,
  Calendar,
  History,
  FileUp,
  Trophy,
  Star,
  Target,
  Sparkles
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { WhatsAppPromo } from '@/components/WhatsAppPromo';
import { FeedbackModal } from '@/components/FeedbackModal';
import { StudentProfile } from '@/components/student/StudentProfile';
import { StudyRecommendations } from '@/components/student/StudyRecommendations';
import StudentAssignments from '@/components/student/StudentAssignments';
import PaymentStatusCard from '@/components/student/PaymentStatusCard';
import { useCachedAssignedActiveExams, useCachedAnnouncements, useCachedStudyTips } from '@/hooks/useCachedData';
import { useQuery } from '@tanstack/react-query';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Use cached data for better performance
  const { data: exams = [], isLoading: examsLoading } = useCachedAssignedActiveExams(user?.id);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900/20 via-background to-yellow-900/10">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900/10 via-background to-yellow-900/5">
      {/* Enhanced Header - Mobile Optimized */}
      <header className="border-b bg-gradient-to-r from-emerald-600/10 via-background/95 to-yellow-600/10 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-emerald-500 rounded-lg sm:rounded-xl blur animate-pulse" />
              <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 p-2 sm:p-3 rounded-lg sm:rounded-xl">
                <GraduationCap className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent truncate">
                Student Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 truncate">
                <span className="truncate">Hi, {profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0]}</span>
                <Sparkles className="w-3 h-3 text-yellow-500 flex-shrink-0" />
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="border-red-200 hover:bg-red-50 hover:text-red-600 hover:border-red-300 flex-shrink-0">
            <LogOut className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-6">
        {/* Celebration Banner - Mobile Optimized */}
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 p-3 sm:p-6 border border-emerald-400/30">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2220%22%20cy%3D%2220%22%20r%3D%223%22/%3E%3C/g%3E%3C/svg%3E')]" />
          <div className="relative flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start sm:items-center gap-3">
              <div className="bg-yellow-400/20 p-2 sm:p-3 rounded-full flex-shrink-0">
                <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm sm:text-xl font-bold text-white">
                  🎉 2025 ZIMSEC: 98.5% Pass Rate!
                </h2>
                <p className="text-xs sm:text-base text-emerald-100">300+ A grades in Computer Science!</p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => window.open('https://chat.whatsapp.com/Jqi8HmLBRbF3g5GAMXbClh?mode=hqrt2', '_blank')}
              className="bg-white text-emerald-700 hover:bg-yellow-300 font-semibold w-full sm:w-auto"
            >
              Join Group
            </Button>
          </div>
        </div>

        {/* Stats Cards - Mobile Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-200/50">
            <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-4 pb-1 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-blue-700">Total Exams</CardTitle>
              <div className="bg-blue-500/20 p-1.5 sm:p-2 rounded-lg">
                <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <div className="text-2xl sm:text-3xl font-bold text-blue-700">{stats.totalExams}</div>
              <p className="text-[10px] sm:text-xs text-blue-600/70">{stats.gradedExams} graded</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-200/50">
            <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-4 pb-1 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-emerald-700">Avg Score</CardTitle>
              <div className="bg-emerald-500/20 p-1.5 sm:p-2 rounded-lg">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-700">{stats.avgScore}%</div>
              <p className="text-[10px] sm:text-xs text-emerald-600/70">All exams</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-200/50">
            <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-4 pb-1 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-yellow-700">Available</CardTitle>
              <div className="bg-yellow-500/20 p-1.5 sm:p-2 rounded-lg">
                <Target className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <div className="text-2xl sm:text-3xl font-bold text-yellow-700">{exams.length}</div>
              <p className="text-[10px] sm:text-xs text-yellow-600/70">Ready</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-200/50">
            <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-4 pb-1 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-purple-700">Rank</CardTitle>
              <div className="bg-purple-500/20 p-1.5 sm:p-2 rounded-lg">
                <Award className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <div className="text-lg sm:text-2xl font-bold text-purple-700 flex items-center gap-1">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                Rising
              </div>
              <p className="text-[10px] sm:text-xs text-purple-600/70">Keep going!</p>
            </CardContent>
          </Card>
        </div>

        {/* Payment Status Card */}
        {user?.id && <PaymentStatusCard userId={user.id} />}

        {/* Quick Actions - Mobile */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          <Button 
            onClick={() => navigate('/submission-history')}
            variant="outline"
            size="sm"
            className="gap-1.5 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 whitespace-nowrap flex-shrink-0"
          >
            <History className="h-3.5 w-3.5 text-emerald-600" />
            <span className="hidden xs:inline">View</span> History
          </Button>
          <Button
            onClick={() => window.open('https://chat.whatsapp.com/Jqi8HmLBRbF3g5GAMXbClh?mode=hqrt2', '_blank')}
            variant="outline"
            size="sm"
            className="gap-1.5 border-green-200 hover:bg-green-50 hover:border-green-300 whitespace-nowrap flex-shrink-0"
          >
            <svg className="w-3.5 h-3.5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            WhatsApp
          </Button>
        </div>

        {/* Main Content - Scrollable Tabs */}
        <Tabs defaultValue="exams" className="space-y-3 sm:space-y-4">
          <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0">
            <TabsList className="inline-flex w-max sm:w-auto h-auto gap-1 bg-muted/50 p-1 rounded-xl">
              <TabsTrigger value="exams" className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-white rounded-lg whitespace-nowrap">
                📝 Exams
              </TabsTrigger>
              <TabsTrigger value="assignments" className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg whitespace-nowrap">
                📤 Assign
              </TabsTrigger>
              <TabsTrigger value="profile" className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white rounded-lg whitespace-nowrap">
                📊 Progress
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 data-[state=active]:bg-yellow-500 data-[state=active]:text-white rounded-lg whitespace-nowrap">
                💡 Study
              </TabsTrigger>
              <TabsTrigger value="history" className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-lg whitespace-nowrap">
                📜 History
              </TabsTrigger>
              <TabsTrigger value="announcements" className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 data-[state=active]:bg-pink-500 data-[state=active]:text-white rounded-lg whitespace-nowrap">
                📢 News
              </TabsTrigger>
              <TabsTrigger value="resources" className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 data-[state=active]:bg-teal-500 data-[state=active]:text-white rounded-lg whitespace-nowrap">
                📚 Books
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="exams" className="space-y-3">
            <Card className="border-emerald-200/50">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-lg p-3 sm:p-6">
                <CardTitle className="text-emerald-700 flex items-center gap-2 text-base sm:text-lg">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5" />
                  Available Exams
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">Tap to start</CardDescription>
              </CardHeader>
              <CardContent className="p-2 sm:p-4">
                <ScrollArea className="h-[350px] sm:h-[400px]">
                  <div className="space-y-2 sm:space-y-3">
                    {exams.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground">
                        <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No exams available</p>
                      </div>
                    ) : (
                      exams.map((exam) => (
                        <Card 
                          key={exam.id} 
                          className="cursor-pointer hover:shadow-md hover:border-emerald-300 transition-all active:scale-[0.98]"
                          onClick={() => navigate('/student-exam', { state: { examId: exam.id } })}
                        >
                          <CardHeader className="p-3 sm:p-4">
                            <div className="flex items-start justify-between gap-2">
                              <div className="space-y-0.5 min-w-0 flex-1">
                                <CardTitle className="text-sm sm:text-lg text-emerald-700 truncate">{exam.title}</CardTitle>
                                <CardDescription className="text-xs line-clamp-1">{exam.description}</CardDescription>
                              </div>
                              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px] sm:text-xs flex-shrink-0">{exam.subject}</Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="p-3 sm:p-4 pt-0">
                            <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                              <div className="flex items-center gap-1 bg-blue-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md">
                                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                                <span className="text-blue-700">{exam.duration_minutes}m</span>
                              </div>
                              <div className="flex items-center gap-1 bg-yellow-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md">
                                <Award className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                                <span className="text-yellow-700">{exam.total_marks}pts</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-4">
            <StudentAssignments />
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <StudentProfile studentEmail={user?.email || ''} />
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            <StudyRecommendations studentEmail={user?.email || ''} />
          </TabsContent>

          <TabsContent value="history" className="space-y-3">
            <Card className="border-orange-200/50">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-t-lg p-3 sm:p-6">
                <CardTitle className="text-orange-700 flex items-center gap-2 text-base sm:text-lg">
                  <History className="w-4 h-4 sm:w-5 sm:h-5" />
                  Exam History
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">Past submissions</CardDescription>
              </CardHeader>
              <CardContent className="p-2 sm:p-4">
                <ScrollArea className="h-[350px] sm:h-[400px]">
                  <div className="space-y-2 sm:space-y-3">
                    {submissions.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground">
                        <History className="w-10 h-10 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No submissions yet</p>
                      </div>
                    ) : (
                      submissions.map((submission) => (
                        <Card key={submission.id} className="hover:shadow-sm transition-shadow">
                          <CardHeader className="p-3 sm:p-4">
                            <div className="flex items-start justify-between gap-2">
                              <div className="space-y-0.5 min-w-0 flex-1">
                                <CardTitle className="text-sm sm:text-base truncate">
                                  {submission.exams?.title || 'Exam'}
                                </CardTitle>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(submission.submitted_at).toLocaleDateString()}
                                </div>
                              </div>
                              {submission.graded ? (
                                <Badge 
                                  className={`text-[10px] sm:text-xs flex-shrink-0 ${submission.total_score / submission.max_score >= 0.5 
                                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                                    : 'bg-red-100 text-red-700 border-red-200'
                                  }`}
                                >
                                  {submission.total_score}/{submission.max_score}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-[10px] sm:text-xs flex-shrink-0">
                                  Pending
                                </Badge>
                              )}
                            </div>
                          </CardHeader>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="announcements" className="space-y-3">
            <Card className="border-pink-200/50">
              <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-t-lg p-3 sm:p-6">
                <CardTitle className="text-pink-700 flex items-center gap-2 text-base sm:text-lg">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                  Announcements
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">Latest updates</CardDescription>
              </CardHeader>
              <CardContent className="p-2 sm:p-4">
                <ScrollArea className="h-[350px] sm:h-[400px]">
                  <div className="space-y-2 sm:space-y-3">
                    {announcements.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground">
                        <Sparkles className="w-10 h-10 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No announcements yet</p>
                      </div>
                    ) : (
                      announcements.map((announcement) => (
                        <Card key={announcement.id} className="hover:shadow-sm transition-shadow border-pink-100">
                          <CardHeader className="p-3 sm:p-4 pb-1 sm:pb-2">
                            <CardTitle className="text-sm sm:text-base text-pink-700">{announcement.title}</CardTitle>
                            <CardDescription className="text-xs">
                              {new Date(announcement.created_at).toLocaleDateString()}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="p-3 sm:p-4 pt-0">
                            <p className="text-xs sm:text-sm line-clamp-3">{announcement.content}</p>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <Card className="border-teal-200/50">
                <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-t-lg p-3 sm:p-6">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-teal-600" />
                    <CardTitle className="text-teal-700 text-base sm:text-lg">Study Tips</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-2 sm:p-4">
                  <ScrollArea className="h-[200px] sm:h-[250px]">
                    <div className="space-y-2">
                      {tips.map((tip) => (
                        <Card key={tip.id} className="border-teal-100">
                          <CardHeader className="p-2 sm:p-3 pb-1">
                            <CardTitle className="text-xs sm:text-sm text-teal-700">{tip.title}</CardTitle>
                            <Badge variant="outline" className="w-fit bg-teal-50 text-teal-600 border-teal-200 text-[10px]">
                              {tip.category}
                            </Badge>
                          </CardHeader>
                          <CardContent className="p-2 sm:p-3 pt-0">
                            <p className="text-xs text-muted-foreground line-clamp-2">{tip.content}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card className="border-indigo-200/50">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg p-3 sm:p-6">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                    <CardTitle className="text-indigo-700 text-base sm:text-lg">Books</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-2 sm:p-4">
                  <ScrollArea className="h-[200px] sm:h-[250px]">
                    <div className="space-y-1.5">
                      {books.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground">
                          <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No materials yet</p>
                        </div>
                      ) : (
                        books.map((book) => (
                          <Button 
                            key={book.name} 
                            variant="outline" 
                            size="sm"
                            className="w-full justify-start text-xs sm:text-sm border-indigo-100 hover:bg-indigo-50"
                            onClick={async () => {
                              const { data } = await supabase.storage
                                .from('books')
                                .createSignedUrl(book.name, 60);
                              if (data) window.open(data.signedUrl, '_blank');
                            }}
                          >
                            <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-indigo-600 flex-shrink-0" />
                            <span className="truncate">{book.name}</span>
                          </Button>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* WhatsApp Community Promotion */}
        <div className="mt-4 sm:mt-8">
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