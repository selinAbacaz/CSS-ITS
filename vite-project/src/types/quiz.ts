// ── Mastery ──────────────────────────────────────────────────────────────────

export type MasteryLevel = 'red' | 'yellow' | 'green';

export interface TopicMastery {
  topicId: string;
  level: MasteryLevel;
  /** Number of times this topic's quiz has been attempted */
  attempts: number;
  /** Consecutive correct answers on the last run */
  streak: number;
}

// ── Questions ─────────────────────────────────────────────────────────────────

export interface AnswerOption {
  id: string;       // 'a' | 'b' | 'c' | 'd'
  text: string;
  /** Shown only when THIS wrong answer is chosen */
  wrongFeedback?: string;
}

export interface MultipleChoiceQuestion {
  id: string;
  type: 'mcq';
  topicId: string;   // which topic this question tests
  prompt: string;
  options: AnswerOption[];
  correctId: string;
  /** Shown when the correct answer is chosen */
  correctFeedback: string;
}

export type Question = MultipleChoiceQuestion;

// ── Quiz session ──────────────────────────────────────────────────────────────

export type AnswerState =
  | { status: 'unanswered' }
  | { status: 'correct';   chosenId: string }
  | { status: 'incorrect'; chosenId: string };

export interface QuizSession {
  questions: Question[];
  current: number;         // index into questions[]
  answers: AnswerState[];
  finished: boolean;
  passed: boolean;
}

// ── Result summary ────────────────────────────────────────────────────────────

export interface QuizResult {
  total: number;
  correct: number;
  passed: boolean;
  /** score 0-100 */
  score: number;
}