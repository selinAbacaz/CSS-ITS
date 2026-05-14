
export type MasteryLevel = 'red' | 'yellow' | 'green';

export interface TopicMastery {
  topicId: string;

  pKnown: number;

  level: MasteryLevel;

  attempts: number;

  correct: number;
}



export interface AnswerOption {
  id: string;      
  text: string;
 
  wrongFeedback?: string;
}

export interface MultipleChoiceQuestion {
  id: string;
  type: 'mcq';
  topicId: string;   
  prompt: string;
  options: AnswerOption[];
  correctId: string;

  correctFeedback: string;
}

export type Question = MultipleChoiceQuestion;


export type AnswerState =
  | { status: 'unanswered' }
  | { status: 'correct';   chosenId: string }
  | { status: 'incorrect'; chosenId: string };

export interface QuizSession {
  questions: Question[];
  current: number;       
  answers: AnswerState[];
  finished: boolean;
  passed: boolean;
}


export interface QuizResult {
  total: number;
  correct: number;
  passed: boolean;
  score: number;
}



export interface LessonQuizRecord {
  lessonId: string;
  passed: boolean;
  score: number;
  attempts: number;
}

export interface TopicQuizOutcome {
  topicId: string;
  correct: number;
  total: number;
}