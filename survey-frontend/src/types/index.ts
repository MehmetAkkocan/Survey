export interface QuestionTiming {
  questionId: number;
  startTime: Date;
  endTime: Date;
  duration: number; // in milliseconds
}

export interface Survey {
  _id?: string;
  name: string;
  surname: string;
  totalTime: number;
  startTime: Date;
  endTime?: Date;
  questionTimings: QuestionTiming[];
  answers: Record<string, string>;
  completed: boolean;
  createdAt?: Date;
}

export interface Question {
  id: number;
  text: string;
  type: 'text' | 'radio' | 'checkbox' | 'textarea';
  options?: string[];
}