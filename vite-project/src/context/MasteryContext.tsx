import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import type { MasteryLevel, TopicMastery, Question } from '../types/quiz';
import { QUESTION_BANK } from '../data/quizzes';

// ── Mastery thresholds ────────────────────────────────────────────────────────
// A topic needs this many consecutive correct answers to advance a tier.
const STREAK_TO_YELLOW = 2; // red → yellow
const STREAK_TO_GREEN  = 4; // yellow → green (cumulative from yellow)

// Pass threshold for a quiz session (0-1)
export const PASS_THRESHOLD = 0.7;

// How many questions per topic quiz session
export const TOPIC_QUIZ_LENGTH = 4;

// ── Context shape ─────────────────────────────────────────────────────────────
interface MasteryContextValue {
  masteryMap: Record<string, TopicMastery>;
  getMastery: (topicId: string) => TopicMastery;
  recordQuizResult: (topicId: string, correctCount: number, total: number) => void;
  selectQuizQuestions: (topicId: string, count?: number) => Question[];
  canMarkComplete: (topicId: string) => boolean;
}

const MasteryContext = createContext<MasteryContextValue | null>(null);

const STORAGE_KEY = 'learnCSS_mastery';

function defaultMastery(topicId: string): TopicMastery {
  return { topicId, level: 'red', attempts: 0, streak: 0 };
}

function loadMasteryMap(): Record<string, TopicMastery> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, TopicMastery>;
  } catch {
    return {};
  }
}

// ── Level calculation ─────────────────────────────────────────────────────────
function calcLevel(streak: number): MasteryLevel {
  if (streak >= STREAK_TO_GREEN)  return 'green';
  if (streak >= STREAK_TO_YELLOW) return 'yellow';
  return 'red';
}

// ── ITS weighting ─────────────────────────────────────────────────────────────
// Red topics get 3× weight, yellow 2×, green 1×.
const WEIGHT: Record<MasteryLevel, number> = { red: 3, yellow: 2, green: 1 };

function weightedShuffle(questions: Question[], masteryMap: Record<string, TopicMastery>): Question[] {
  const weighted: Question[] = [];
  for (const q of questions) {
    const level = (masteryMap[q.topicId]?.level ?? 'red');
    const w = WEIGHT[level];
    for (let i = 0; i < w; i++) weighted.push(q);
  }
  // Fisher-Yates on the weighted pool, then dedupe to unique questions
  for (let i = weighted.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [weighted[i], weighted[j]] = [weighted[j], weighted[i]];
  }
  // Return unique questions in the shuffled order
  const seen = new Set<string>();
  const result: Question[] = [];
  for (const q of weighted) {
    if (!seen.has(q.id)) {
      seen.add(q.id);
      result.push(q);
    }
  }
  return result;
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function MasteryProvider({ children }: { children: ReactNode }) {
  const [masteryMap, setMasteryMap] = useState<Record<string, TopicMastery>>(loadMasteryMap);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(masteryMap)); } catch {}
  }, [masteryMap]);

  const getMastery = useCallback(
    (topicId: string): TopicMastery =>
      masteryMap[topicId] ?? defaultMastery(topicId),
    [masteryMap],
  );

  /**
   * Called after every quiz attempt.
   * correctCount / total drives streak & level update.
   */
  const recordQuizResult = useCallback(
    (topicId: string, correctCount: number, total: number) => {
      setMasteryMap((prev) => {
        const current = prev[topicId] ?? defaultMastery(topicId);
        const score = total > 0 ? correctCount / total : 0;
        // Passed (≥70%) → increase streak, failed → reset streak
        const newStreak = score >= PASS_THRESHOLD
          ? current.streak + correctCount
          : Math.max(0, current.streak - 1);
        const newLevel = calcLevel(newStreak);
        return {
          ...prev,
          [topicId]: {
            topicId,
            level: newLevel,
            attempts: current.attempts + 1,
            streak: newStreak,
          },
        };
      });
    },
    [],
  );

  /**
   * Pick `count` questions for a topic quiz, weighted by mastery.
   * Returns questions from only that topic (for the in-topic quiz).
   */
  const selectQuizQuestions = useCallback(
    (topicId: string, count: number = TOPIC_QUIZ_LENGTH): Question[] => {
      const pool = QUESTION_BANK.filter((q) => q.topicId === topicId);
      const shuffled = weightedShuffle(pool, masteryMap);
      return shuffled.slice(0, count);
    },
    [masteryMap],
  );

  /** Topic is completable only if mastery is yellow or green (streak ≥ 2) */
  const canMarkComplete = useCallback(
    (topicId: string): boolean => {
      const m = masteryMap[topicId];
      if (!m) return false;
      return m.level === 'yellow' || m.level === 'green';
    },
    [masteryMap],
  );

  return (
    <MasteryContext.Provider
      value={{ masteryMap, getMastery, recordQuizResult, selectQuizQuestions, canMarkComplete }}
    >
      {children}
    </MasteryContext.Provider>
  );
}

export function useMastery() {
  const ctx = useContext(MasteryContext);
  if (!ctx) throw new Error('useMastery must be used within MasteryProvider');
  return ctx;
}