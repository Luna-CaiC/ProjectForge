export type Role = 
  | 'AI Engineer'
  | 'Full-stack SDE'
  | 'Back-end SDE'
  | 'Front-end SDE'
  | 'Machine Learning Engineer'
  | 'Data Engineer'
  | 'Data Scientist'
  | 'Data Analyst'
  | 'Prompt Engineer'
  | 'DevOps Engineer'
  | 'Mobile Developer';

export type Difficulty = 'Low' | 'Medium' | 'High';

export interface ProjectRequest {
  role: Role;
  industry: string;
  difficulties: Difficulty[];
}

export type ProjectType = 'Practical' | 'Creative';

export interface ProjectIdea {
  id: string;
  title: string;
  tagline: string;
  type: ProjectType;
  difficulty: Difficulty; // Added to track which level this project belongs to
  description: string;
  keyTech: string[];
  estimatedHours: number;
}

export interface ProjectBlueprint {
  projectId: string;
  title: string;
  overview: string;
  techStack: {
    category: string;
    tools: string[];
  }[];
  architecture: string;
  coreFeatures: string[];
  implementationSteps: {
    phase: string;
    description: string;
  }[];
  challengesAndSolutions: {
    challenge: string;
    solution: string;
  }[];
}

export interface InterviewQA {
  question: string;
  answer: string;
  category: 'Technical' | 'Behavioral' | 'Project-Specific';
  keyPoints: string[];
}

export interface InterviewPrep {
  projectId: string;
  questions: InterviewQA[];
}