
export interface UniversityDetail {
  description: string;
  entry_requirements: string;
  duration: string;
  key_courses: string[];
  career_paths: string[];
  fees?: string;
  contact?: string;
  notable_alumni?: string;
}

export interface DegreeProgram {
  [university: string]: UniversityDetail;
}

export interface UniversityPrograms {
  [program: string]: DegreeProgram;
}
