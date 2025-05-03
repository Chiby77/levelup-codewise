
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Book, Brain, Trophy, BarChart as BarChartIcon, PieChart as PieChartIcon, LineChart as LineChartIcon } from 'lucide-react';

interface QuizStatsProps {
  stats: {
    totalQuizzes: number;
    totalQuestions: number;
    correctAnswers: number;
    categoryPerformance: {
      name: string;
      correct: number;
      total: number;
    }[];
    historyData: {
      date: string;
      score: number;
    }[];
    difficultyBreakdown: {
      name: string;
      value: number;
      color: string;
    }[];
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function QuizStats({ stats }: QuizStatsProps) {
  const overallPercentage = Math.round((stats.correctAnswers / stats.totalQuestions) * 100) || 0;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          Quiz Performance Stats
        </CardTitle>
        <CardDescription>
          Track your learning progress and knowledge improvement
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted/40 p-4 rounded-lg">
            <div className="text-muted-foreground text-sm font-medium mb-2">Total Quizzes</div>
            <div className="text-3xl font-bold">{stats.totalQuizzes}</div>
          </div>
          
          <div className="bg-muted/40 p-4 rounded-lg">
            <div className="text-muted-foreground text-sm font-medium mb-2">Questions Answered</div>
            <div className="text-3xl font-bold">{stats.totalQuestions}</div>
          </div>
          
          <div className="bg-muted/40 p-4 rounded-lg">
            <div className="text-muted-foreground text-sm font-medium mb-2">Overall Score</div>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold">{overallPercentage}%</div>
              <Badge variant={overallPercentage >= 80 ? "secondary" : overallPercentage >= 60 ? "default" : "destructive"} className="ml-2">
                {overallPercentage >= 80 ? "Excellent" : overallPercentage >= 60 ? "Good" : "Needs Improvement"}
              </Badge>
            </div>
            <Progress 
              value={overallPercentage} 
              className={`h-2 mt-2 ${overallPercentage >= 80 ? "bg-green-500" : overallPercentage >= 60 ? "bg-blue-500" : "bg-red-500"}`} 
            />
          </div>
        </div>
        
        {/* Detailed Stats with Tabs */}
        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="categories" className="flex items-center gap-1">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">Categories</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-1">
              <LineChartIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Progress</span>
            </TabsTrigger>
            <TabsTrigger value="difficulty" className="flex items-center gap-1">
              <PieChartIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Difficulty</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-4">
            <h4 className="font-medium text-lg flex items-center gap-2">
              <Book className="h-4 w-4" />
              Category Performance
            </h4>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={stats.categoryPerformance}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [`${value}%`, 'Score']}
                />
                <Bar 
                  dataKey={(entry) => Math.round((entry.correct / entry.total) * 100)} 
                  name="Score" 
                  fill="#8884d8" 
                />
              </BarChart>
            </ResponsiveContainer>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-4">
              {stats.categoryPerformance.map((category, index) => {
                const percentage = Math.round((category.correct / category.total) * 100);
                return (
                  <div key={index} className="flex justify-between items-center p-2 border rounded-md">
                    <div className="font-medium">{category.name}</div>
                    <Badge variant={percentage >= 80 ? "secondary" : percentage >= 60 ? "default" : "destructive"}>
                      {percentage}% ({category.correct}/{category.total})
                    </Badge>
                  </div>
                );
              })}
            </div>
          </TabsContent>
          
          {/* Progress Tab */}
          <TabsContent value="progress">
            <h4 className="font-medium text-lg flex items-center gap-2 mb-4">
              <LineChartIcon className="h-4 w-4" />
              Performance Over Time
            </h4>
            
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={stats.historyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
            
            {stats.historyData.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No quiz history available. Take quizzes to see your progress!
              </div>
            )}
          </TabsContent>
          
          {/* Difficulty Tab */}
          <TabsContent value="difficulty">
            <h4 className="font-medium text-lg flex items-center gap-2 mb-4">
              <BarChartIcon className="h-4 w-4" />
              Difficulty Breakdown
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={stats.difficultyBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={(entry) => `${entry.name}: ${entry.value}%`}
                  >
                    {stats.difficultyBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="flex flex-col justify-center space-y-4">
                {stats.difficultyBreakdown.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <Progress value={item.value} className="h-2" />
                    </div>
                    <div className="font-medium">{item.value}%</div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
