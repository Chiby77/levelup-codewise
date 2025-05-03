
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
  student_life?: string;
}

export interface DegreeProgram {
  [university: string]: UniversityDetail;
}

export interface UniversityPrograms {
  [program: string]: DegreeProgram;
}

export interface ComputerScienceTopic {
  topic: string;
  explanation: string;
  example?: string;
  components?: string[];
  code_sample?: {
    python?: string;
    visualBasic?: string;
    javascript?: string;
    java?: string;
    pseudocode?: string;
  };
}

export interface DataStructureTopic {
  name: string;
  description: string;
  advantages: string[];
  disadvantages: string[];
  operations: string[];
  examples: string[];
  use_cases: string[];
  complexity?: {
    time?: string;
    space?: string;
  };
}

export interface EnterpriseKnowledge {
  topic: string;
  description: string;
  key_concepts: string[];
  best_practices: string[];
  resources?: string[];
}
