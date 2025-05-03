
export interface UniversityProgram {
  name: string;
  universities: {
    [key: string]: UniversityDetail;
  };
}

export interface UniversityDetail {
  description: string;
  entry_requirements: string;
  duration: string;
  key_courses: string[];
  career_paths: string[];
  fees?: string;
  contact?: string;
  notable_alumni?: string;
  location?: string;
  campus_facilities?: string[];
  international_options?: string;
  scholarships?: string;
  research_areas?: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}
