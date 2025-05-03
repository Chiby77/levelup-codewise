
/**
 * Quiz statistics and analytics definitions
 */

export interface QuizStats {
  // Total stats
  totalQuizzesTaken: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  
  // Performance by category
  categoryStats: {
    [category: string]: {
      questionsAnswered: number;
      correctAnswers: number;
      averageScore: number;
    }
  };
  
  // Performance by difficulty
  difficultyStats: {
    easy: {
      questionsAnswered: number;
      correctAnswers: number;
      averageScore: number;
    },
    medium: {
      questionsAnswered: number;
      correctAnswers: number;
      averageScore: number;
    },
    hard: {
      questionsAnswered: number;
      correctAnswers: number;
      averageScore: number;
    }
  };
  
  // Historical performance
  quizHistory: Array<{
    date: Date;
    category: string;
    score: number;
    totalQuestions: number;
    timeSpent: number; // in seconds
  }>;
  
  // Improvement metrics
  improvementRate: {
    overall: number; // percentage improvement
    byCategory: {
      [category: string]: number;
    }
  };
}
