export interface Question {
  id: string;
  question: string;
  type: 'multiple-choice' | 'fill-in-blank' | 'short-answer';
  options?: string[]; // For multiple choice questions
  correctAnswer: string;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  keywords: string[];
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdAt: Date;
  sourceText: string;
  settings: QuizSettings;
}

export interface QuizSettings {
  numQuestions: number;
  difficulty: 'easy' | 'medium' | 'hard';
  questionTypes: {
    fillInBlank: boolean;
    multipleChoice: boolean;
    shortAnswer: boolean;
  };
}