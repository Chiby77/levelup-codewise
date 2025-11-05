import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { 
  BookOpen, 
  Target, 
  TrendingDown, 
  Lightbulb,
  AlertCircle,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface WeakArea {
  category: string;
  type: 'subject' | 'question_type';
  averageScore: number;
  attemptCount: number;
  recommendations: string[];
}

interface StudyMaterial {
  title: string;
  category: string;
  content: string;
}

export const StudyRecommendations = ({ studentEmail }: { studentEmail: string }) => {
  const [weakAreas, setWeakAreas] = useState<WeakArea[]>([]);
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyzeWeakAreas();
    fetchStudyMaterials();
  }, [studentEmail]);

  const analyzeWeakAreas = async () => {
    try {
      const { data: submissions, error } = await supabase
        .from('student_submissions')
        .select(`
          *,
          exams (
            id,
            title,
            subject
          )
        `)
        .eq('student_email', studentEmail)
        .eq('graded', true);

      if (error) throw error;

      const subjectPerformance: Record<string, { total: number; count: number; attempts: number }> = {};
      const questionTypePerformance: Record<string, { total: number; count: number; attempts: number }> = {};

      // Analyze each submission
      for (const submission of submissions || []) {
        if (!submission.max_score || submission.max_score === 0) continue;

        const percentage = ((submission.total_score || 0) / submission.max_score) * 100;
        const subject = submission.exams?.subject || 'Unknown';

        // Track subject performance
        if (!subjectPerformance[subject]) {
          subjectPerformance[subject] = { total: 0, count: 0, attempts: 0 };
        }
        subjectPerformance[subject].total += percentage;
        subjectPerformance[subject].count += 1;
        subjectPerformance[subject].attempts += 1;

        // Analyze grade details for question types
        if (submission.grade_details) {
          const gradeDetails = submission.grade_details as Record<string, any>;
          
          // Fetch questions to get their types
          const { data: questions } = await supabase
            .from('questions')
            .select('id, question_type')
            .eq('exam_id', submission.exam_id);

          if (questions) {
            for (const question of questions) {
              const questionGrade = gradeDetails[question.id];
              if (questionGrade && questionGrade.maxScore > 0) {
                const qType = question.question_type;
                const qScore = ((questionGrade.score || 0) / questionGrade.maxScore) * 100;

                if (!questionTypePerformance[qType]) {
                  questionTypePerformance[qType] = { total: 0, count: 0, attempts: 0 };
                }
                questionTypePerformance[qType].total += qScore;
                questionTypePerformance[qType].count += 1;
                questionTypePerformance[qType].attempts += 1;
              }
            }
          }
        }
      }

      // Identify weak areas (below 70%)
      const areas: WeakArea[] = [];

      // Add weak subjects
      for (const [subject, stats] of Object.entries(subjectPerformance)) {
        const avg = stats.total / stats.count;
        if (avg < 70 && stats.count >= 2) {
          areas.push({
            category: subject,
            type: 'subject',
            averageScore: avg,
            attemptCount: stats.attempts,
            recommendations: getSubjectRecommendations(subject, avg),
          });
        }
      }

      // Add weak question types
      for (const [qType, stats] of Object.entries(questionTypePerformance)) {
        const avg = stats.total / stats.count;
        if (avg < 70 && stats.count >= 2) {
          areas.push({
            category: qType,
            type: 'question_type',
            averageScore: avg,
            attemptCount: stats.attempts,
            recommendations: getQuestionTypeRecommendations(qType, avg),
          });
        }
      }

      // Sort by lowest score first
      areas.sort((a, b) => a.averageScore - b.averageScore);
      setWeakAreas(areas);

    } catch (error) {
      console.error('Error analyzing weak areas:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudyMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('study_tips')
        .select('title, category, content')
        .eq('is_active', true);

      if (error) throw error;
      setStudyMaterials(data || []);
    } catch (error) {
      console.error('Error fetching study materials:', error);
    }
  };

  const getSubjectRecommendations = (subject: string, score: number): string[] => {
    const baseRecs = [
      `Review core ${subject} concepts and fundamentals`,
      `Practice more ${subject} problems regularly`,
      `Create summary notes for ${subject} topics`,
      `Join study groups focused on ${subject}`,
    ];

    if (score < 50) {
      return [
        `Start with ${subject} basics - build a strong foundation`,
        `Watch tutorial videos on ${subject} fundamentals`,
        ...baseRecs,
      ];
    } else if (score < 60) {
      return [
        `Focus on intermediate ${subject} concepts`,
        ...baseRecs,
        `Work on past exam papers for ${subject}`,
      ];
    } else {
      return [
        ...baseRecs,
        `Fine-tune your understanding of advanced ${subject} topics`,
      ];
    }
  };

  const getQuestionTypeRecommendations = (questionType: string, score: number): string[] => {
    const typeMap: Record<string, string[]> = {
      'multiple_choice': [
        'Practice eliminating wrong answers first',
        'Read questions carefully - watch for keywords like "NOT", "EXCEPT"',
        'Review common tricks in multiple choice questions',
        'Time yourself on practice MCQs',
      ],
      'coding': [
        'Practice writing code by hand first',
        'Focus on proper syntax and structure',
        'Learn common algorithms and patterns',
        'Debug code examples regularly',
        'Use online coding platforms for practice (HackerRank, LeetCode)',
        'Review sample solutions and understand different approaches',
      ],
      'short_answer': [
        'Practice writing clear, concise explanations',
        'Use bullet points to organize your thoughts',
        'Include examples to support your answers',
        'Review marking schemes to understand what examiners look for',
        'Practice explaining concepts to others',
      ],
      'flowchart': [
        'Study flowchart symbols and their meanings',
        'Practice converting algorithms to flowcharts',
        'Ensure proper flow with clear start and end points',
        'Review common flowchart patterns (loops, decisions)',
        'Practice drawing flowcharts for everyday processes',
      ],
    };

    const recs = typeMap[questionType] || ['Practice this question type more often'];

    if (score < 50) {
      return [
        `Start with basic ${questionType} exercises`,
        `Watch tutorials on how to approach ${questionType} questions`,
        ...recs,
      ];
    }

    return recs;
  };

  const getRelevantStudyMaterials = (area: WeakArea) => {
    return studyMaterials.filter(material => 
      material.category.toLowerCase().includes(area.category.toLowerCase()) ||
      material.title.toLowerCase().includes(area.category.toLowerCase())
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 bg-green-50';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getPriorityIcon = (score: number) => {
    if (score < 50) return <AlertCircle className="h-5 w-5 text-red-500" />;
    if (score < 60) return <TrendingDown className="h-5 w-5 text-yellow-500" />;
    return <Target className="h-5 w-5 text-blue-500" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p>Analyzing your performance...</p>
      </div>
    );
  }

  if (weakAreas.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            <CardTitle>Excellent Performance!</CardTitle>
          </div>
          <CardDescription>
            You're performing well across all areas. Keep up the great work!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              💡 Continue practicing regularly to maintain your strong performance.
              Challenge yourself with harder exam difficulty levels!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-yellow-500" />
            <CardTitle>Personalized Study Recommendations</CardTitle>
          </div>
          <CardDescription>
            Based on your exam performance, here are areas where you can improve
          </CardDescription>
        </CardHeader>
      </Card>

      <ScrollArea className="h-[600px]">
        <div className="space-y-4">
          {weakAreas.map((area, index) => {
            const relevantMaterials = getRelevantStudyMaterials(area);
            
            return (
              <Card key={index} className="border-l-4 border-l-orange-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getPriorityIcon(area.averageScore)}
                      <div>
                        <CardTitle className="text-lg">
                          {area.type === 'subject' ? area.category : 
                           area.category.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        </CardTitle>
                        <CardDescription>
                          {area.type === 'subject' ? 'Subject' : 'Question Type'} • {area.attemptCount} attempts
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getScoreColor(area.averageScore)}>
                      {area.averageScore.toFixed(1)}% avg
                    </Badge>
                  </div>
                  <Progress value={area.averageScore} className="h-2 mt-2" />
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Priority Level */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-orange-900">
                          {area.averageScore < 50 ? 'High Priority - Needs Immediate Attention' :
                           area.averageScore < 60 ? 'Medium Priority - Room for Improvement' :
                           'Low Priority - Fine-tuning Needed'}
                        </p>
                        <p className="text-xs text-orange-700 mt-1">
                          Focus on this area to significantly improve your overall performance
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Action Steps
                    </h4>
                    <ul className="space-y-2">
                      {area.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Relevant Study Materials */}
                  {relevantMaterials.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Recommended Study Materials
                      </h4>
                      <div className="space-y-2">
                        {relevantMaterials.map((material, idx) => (
                          <Card key={idx} className="bg-blue-50/50">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm">{material.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-xs text-muted-foreground">{material.content}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Practice Suggestion */}
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                    <p className="text-sm text-primary font-medium">
                      💪 Practice Tip: Try taking practice exams focusing on {area.category} to build confidence
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};