
/**
 * Quiz data management and statistics tracking service
 */
import { getQuizQuestions } from "@/utils/ai/quiz/quizData";
import { QuizQuestion } from "@/types/universityPrograms";
import { QuizStats } from "@/types/quizStats";

// Local storage key for quiz stats
const QUIZ_STATS_KEY = 'mbuya-zivai-quiz-stats';

/**
 * Initialize default quiz stats
 */
export const initializeQuizStats = (): QuizStats => {
  return {
    totalQuizzesTaken: 0,
    totalQuestionsAnswered: 0,
    totalCorrectAnswers: 0,
    categoryStats: {},
    difficultyStats: {
      easy: { questionsAnswered: 0, correctAnswers: 0, averageScore: 0 },
      medium: { questionsAnswered: 0, correctAnswers: 0, averageScore: 0 },
      hard: { questionsAnswered: 0, correctAnswers: 0, averageScore: 0 }
    },
    quizHistory: [],
    improvementRate: {
      overall: 0,
      byCategory: {}
    }
  };
};

/**
 * Get quiz stats from local storage
 */
export const getQuizStats = (): QuizStats => {
  const statsString = localStorage.getItem(QUIZ_STATS_KEY);
  if (!statsString) {
    const initialStats = initializeQuizStats();
    saveQuizStats(initialStats);
    return initialStats;
  }
  
  try {
    const stats = JSON.parse(statsString);
    
    // Convert stored date strings back to Date objects
    if (stats.quizHistory && Array.isArray(stats.quizHistory)) {
      stats.quizHistory = stats.quizHistory.map((item: any) => ({
        ...item,
        date: new Date(item.date)
      }));
    }
    
    return stats;
  } catch (error) {
    console.error("Error parsing quiz stats:", error);
    const initialStats = initializeQuizStats();
    saveQuizStats(initialStats);
    return initialStats;
  }
};

/**
 * Save quiz stats to local storage
 */
export const saveQuizStats = (stats: QuizStats): void => {
  try {
    localStorage.setItem(QUIZ_STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error("Error saving quiz stats:", error);
  }
};

/**
 * Update quiz stats with new quiz results
 */
export const updateQuizStats = (
  category: string,
  questions: QuizQuestion[],
  correctAnswers: number,
  timeSpent: number
): QuizStats => {
  const stats = getQuizStats();
  const score = (correctAnswers / questions.length) * 100;
  
  // Update total stats
  stats.totalQuizzesTaken += 1;
  stats.totalQuestionsAnswered += questions.length;
  stats.totalCorrectAnswers += correctAnswers;
  
  // Update category stats
  if (!stats.categoryStats[category]) {
    stats.categoryStats[category] = {
      questionsAnswered: 0,
      correctAnswers: 0,
      averageScore: 0
    };
  }
  
  const categoryStats = stats.categoryStats[category];
  categoryStats.questionsAnswered += questions.length;
  categoryStats.correctAnswers += correctAnswers;
  categoryStats.averageScore = (categoryStats.correctAnswers / categoryStats.questionsAnswered) * 100;
  
  // Update difficulty stats
  questions.forEach((question, index) => {
    const isCorrect = index < questions.length ? 1 : 0;
    const difficulty = question.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard';
    
    stats.difficultyStats[difficulty].questionsAnswered += 1;
    stats.difficultyStats[difficulty].correctAnswers += isCorrect;
    stats.difficultyStats[difficulty].averageScore = 
      (stats.difficultyStats[difficulty].correctAnswers / stats.difficultyStats[difficulty].questionsAnswered) * 100;
  });
  
  // Add to quiz history
  stats.quizHistory.push({
    date: new Date(),
    category,
    score,
    totalQuestions: questions.length,
    timeSpent
  });
  
  // Calculate improvement rate
  if (stats.quizHistory.length > 1) {
    // Sort by date, oldest first
    const sortedHistory = [...stats.quizHistory].sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // Group by category
    const categoryHistories: {[key: string]: Array<{date: Date, score: number}>} = {};
    
    sortedHistory.forEach(entry => {
      if (!categoryHistories[entry.category]) {
        categoryHistories[entry.category] = [];
      }
      categoryHistories[entry.category].push({
        date: entry.date,
        score: entry.score
      });
    });
    
    // Calculate overall improvement (from first quiz to latest)
    const firstScore = sortedHistory[0].score;
    const latestScore = sortedHistory[sortedHistory.length - 1].score;
    stats.improvementRate.overall = latestScore - firstScore;
    
    // Calculate improvement by category
    Object.keys(categoryHistories).forEach(category => {
      const categoryHistory = categoryHistories[category];
      if (categoryHistory.length > 1) {
        const firstCategoryScore = categoryHistory[0].score;
        const latestCategoryScore = categoryHistory[categoryHistory.length - 1].score;
        stats.improvementRate.byCategory[category] = latestCategoryScore - firstCategoryScore;
      }
    });
  }
  
  // Save updated stats
  saveQuizStats(stats);
  
  return stats;
};

/**
 * Get formatted stats for display in the QuizStats component
 */
export const getFormattedQuizStats = () => {
  const stats = getQuizStats();
  
  // Format category performance data
  const categoryPerformance = Object.keys(stats.categoryStats).map(category => {
    const catStats = stats.categoryStats[category];
    return {
      name: category,
      correct: catStats.correctAnswers,
      total: catStats.questionsAnswered
    };
  });
  
  // Format history data (last 10 quizzes)
  const historyData = stats.quizHistory
    .slice(-10) // Get last 10 entries
    .map(entry => ({
      date: entry.date.toLocaleDateString(),
      score: Math.round(entry.score)
    }));
  
  // Format difficulty breakdown
  const difficultyBreakdown = [
    {
      name: 'Easy',
      value: Math.round(stats.difficultyStats.easy.averageScore),
      color: '#4CAF50'
    },
    {
      name: 'Medium',
      value: Math.round(stats.difficultyStats.medium.averageScore),
      color: '#FFA726'
    },
    {
      name: 'Hard',
      value: Math.round(stats.difficultyStats.hard.averageScore),
      color: '#EF5350'
    }
  ];
  
  return {
    totalQuizzes: stats.totalQuizzesTaken,
    totalQuestions: stats.totalQuestionsAnswered,
    correctAnswers: stats.totalCorrectAnswers,
    categoryPerformance,
    historyData,
    difficultyBreakdown
  };
};

/**
 * Reset all quiz statistics
 */
export const resetQuizStats = (): void => {
  const initialStats = initializeQuizStats();
  saveQuizStats(initialStats);
};
