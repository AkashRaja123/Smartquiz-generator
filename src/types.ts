
export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  difficulty: Difficulty;
  topic: string;
  explanation: string;
}

export interface UserAttempt {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  responseTime: number;
  difficulty: Difficulty;
  timestamp: number;
}

export interface StudyMaterial {
  text?: string;
  file?: {
    data: string;
    mimeType: string;
  };
}

export interface QuizConfig {
  count: number;
  initialDifficulty: Difficulty;
}

export interface UserAccount {
  email: string;
  name: string;
}
