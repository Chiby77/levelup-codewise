import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Award, Users } from 'lucide-react';

interface Submission {
  total_score: number;
  max_score: number;
  graded: boolean;
}

interface ScoreAnalyticsProps {
  submissions: Submission[];
}

export function ScoreAnalytics({ submissions }: ScoreAnalyticsProps) {
  const gradedSubmissions = submissions.filter(s => s.graded && s.max_score > 0);

  // Calculate score distribution
  const scoreRanges = [
    { name: '0-20%', min: 0, max: 20, count: 0 },
    { name: '21-40%', min: 21, max: 40, count: 0 },
    { name: '41-60%', min: 41, max: 60, count: 0 },
    { name: '61-80%', min: 61, max: 80, count: 0 },
    { name: '81-100%', min: 81, max: 100, count: 0 }
  ];

  gradedSubmissions.forEach(sub => {
    const percentage = (sub.total_score / sub.max_score) * 100;
    const range = scoreRanges.find(r => percentage >= r.min && percentage <= r.max);
    if (range) range.count++;
  });

  const distributionData = scoreRanges.filter(r => r.count > 0);

  // Calculate grade distribution
  const gradeDistribution = gradedSubmissions.map(sub => {
    const percentage = (sub.total_score / sub.max_score) * 100;
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  });

  const gradeData = [
    { grade: 'A', count: gradeDistribution.filter(g => g === 'A').length },
    { grade: 'B', count: gradeDistribution.filter(g => g === 'B').length },
    { grade: 'C', count: gradeDistribution.filter(g => g === 'C').length },
    { grade: 'D', count: gradeDistribution.filter(g => g === 'D').length },
    { grade: 'F', count: gradeDistribution.filter(g => g === 'F').length }
  ].filter(g => g.count > 0);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#6b7280'];

  const averageScore = gradedSubmissions.length > 0
    ? gradedSubmissions.reduce((acc, s) => acc + (s.total_score / s.max_score) * 100, 0) / gradedSubmissions.length
    : 0;

  const highestScore = gradedSubmissions.length > 0
    ? Math.max(...gradedSubmissions.map(s => (s.total_score / s.max_score) * 100))
    : 0;

  const passRate = gradedSubmissions.length > 0
    ? (gradedSubmissions.filter(s => (s.total_score / s.max_score) * 100 >= 50).length / gradedSubmissions.length) * 100
    : 0;

  if (gradedSubmissions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Score Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No graded submissions available for analytics
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-3xl font-bold text-primary">{averageScore.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Highest Score</p>
                <p className="text-3xl font-bold text-green-600">{highestScore.toFixed(1)}%</p>
              </div>
              <Award className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pass Rate</p>
                <p className="text-3xl font-bold text-blue-600">{passRate.toFixed(1)}%</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={distributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="hsl(var(--primary))" name="Students" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={gradeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ grade, count, percent }) => `${grade}: ${count} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {gradeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
