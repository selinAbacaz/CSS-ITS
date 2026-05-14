import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import type { MasteryLevel, TopicMastery, Question, LessonQuizRecord, TopicQuizOutcome } from '../types/quiz';
import { QUESTION_BANK } from '../data/quizzes';
import { COURSE } from '../data/course';

// ── Thresholds ────────────────────────────────────────────────────────────────
const STREAK_TO_YELLOW = 2;
const STREAK_TO_GREEN  = 4;

export const PASS_THRESHOLD      = 0.7;
export const TOPIC_QUIZ_LENGTH   = 4;
export const LESSON_QUIZ_LENGTH  = 12;

// ── Weights: red=3×, yellow=2×, green=1× ─────────────────────────────────────
const WEIGHT: Record<MasteryLevel, number> = { red: 3, yellow: 2, green: 1 };

// ── Context value ─────────────────────────────────────────────────────────────
interface MasteryContextValue {
  masteryMap:     Record<string, TopicMastery>;
  lessonQuizMap:  Record<string, LessonQuizRecord>;

  getMastery:     (topicId: string) => TopicMastery;
  canMarkComplete:(topicId: string) => boolean;

  /** For per-topic quizzes */
  recordQuizResult:(topicId: string, correctCount: number, total: number) => void;
  selectQuizQuestions:(topicId: string, count?: number) => Question[];

  /** For lesson-level quizzes */
  selectLessonQuizQuestions:(lessonId: string, count?: number) => Question[];
  recordLessonQuizResult:(lessonId: string, outcomes: TopicQuizOutcome[], passed: boolean, score: number) => void;
  getLessonQuizRecord:(lessonId: string) => LessonQuizRecord | null;
  isLessonUnlocked:(lessonId: string) => boolean;
}

const MasteryContext = createContext<MasteryContextValue | null>(null);

const MASTERY_KEY     = 'learnCSS_mastery';
const LESSON_QUIZ_KEY = 'learnCSS_lessonQuiz';

// ── Helpers ───────────────────────────────────────────────────────────────────
function defaultMastery(topicId: string): TopicMastery {
  return { topicId, level: 'red', attempts: 0, streak: 0 };
}

function calcLevel(streak: number): MasteryLevel {
  if (streak >= STREAK_TO_GREEN)  return 'green';
  if (streak >= STREAK_TO_YELLOW) return 'yellow';
  return 'red';
}

function loadJSON<T>(key: string): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return {} as T;
    return JSON.parse(raw) as T;
  } catch { return {} as T; }
}

/**
 * Weighted shuffle then dedupe.
 * Questions from red topics appear up to 3×, yellow 2×, green 1×.
 */
function weightedPick(
  questions: Question[],
  masteryMap: Record<string, TopicMastery>,
  count: number,
): Question[] {
  const weighted: Question[] = [];
  for (const q of questions) {
    const level = masteryMap[q.topicId]?.level ?? 'red';
    const w = WEIGHT[level];
    for (let i = 0; i < w; i++) weighted.push(q);
  }
  // Fisher-Yates
  for (let i = weighted.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [weighted[i], weighted[j]] = [weighted[j], weighted[i]];
  }
  // Dedupe
  const seen = new Set<string>();
  const result: Question[] = [];
  for (const q of weighted) {
    if (!seen.has(q.id)) { seen.add(q.id); result.push(q); }
    if (result.length >= count) break;
  }
  return result;
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function MasteryProvider({ children }: { children: ReactNode }) {
  const [masteryMap,    setMasteryMap]    = useState<Record<string, TopicMastery>>(() => loadJSON(MASTERY_KEY));
  const [lessonQuizMap, setLessonQuizMap] = useState<Record<string, LessonQuizRecord>>(() => loadJSON(LESSON_QUIZ_KEY));

  useEffect(() => {
    try { localStorage.setItem(MASTERY_KEY,     JSON.stringify(masteryMap));    } catch {}
  }, [masteryMap]);

  useEffect(() => {
    try { localStorage.setItem(LESSON_QUIZ_KEY, JSON.stringify(lessonQuizMap)); } catch {}
  }, [lessonQuizMap]);

  // ── Per-topic mastery read ────────────────────────────────────────────────
  const getMastery = useCallback(
    (topicId: string): TopicMastery => masteryMap[topicId] ?? defaultMastery(topicId),
    [masteryMap],
  );

  const canMarkComplete = useCallback(
    (topicId: string): boolean => {
      const m = masteryMap[topicId];
      return !!m && (m.level === 'yellow' || m.level === 'green');
    },
    [masteryMap],
  );

  // ── Internal: update one topic's mastery from correct/total counts ────────
  const applyTopicResult = useCallback(
    (prev: Record<string, TopicMastery>, topicId: string, correctCount: number, total: number) => {
      const current = prev[topicId] ?? defaultMastery(topicId);
      const score   = total > 0 ? correctCount / total : 0;
      const newStreak = score >= PASS_THRESHOLD
        ? current.streak + correctCount
        : Math.max(0, current.streak - 1);
      return {
        ...prev,
        [topicId]: {
          topicId,
          level:    calcLevel(newStreak),
          attempts: current.attempts + 1,
          streak:   newStreak,
        },
      };
    },
    [],
  );

  // ── Per-topic quiz ────────────────────────────────────────────────────────
  const recordQuizResult = useCallback(
    (topicId: string, correctCount: number, total: number) => {
      setMasteryMap((prev) => applyTopicResult(prev, topicId, correctCount, total));
    },
    [applyTopicResult],
  );

  const selectQuizQuestions = useCallback(
    (topicId: string, count: number = TOPIC_QUIZ_LENGTH): Question[] => {
      const pool = QUESTION_BANK.filter((q) => q.topicId === topicId);
      return weightedPick(pool, masteryMap, count);
    },
    [masteryMap],
  );

  // ── Lesson-level quiz ─────────────────────────────────────────────────────

  /**
   * Selects `count` questions for a lesson quiz.
   *
   * Distribution:
   *   ~70% from the lesson's own topics (weighted by mastery)
   *   ~30% from previous lessons (weighted by mastery, fewer red questions from
   *         earlier lessons to keep focus on current material)
   *
   * We achieve this by building two pools, picking proportionally, then merging.
   */
  const selectLessonQuizQuestions = useCallback(
    (lessonId: string, count: number = LESSON_QUIZ_LENGTH): Question[] => {
      const lessonIdx    = COURSE.findIndex((l) => l.id === lessonId);
      const currentLesson = COURSE[lessonIdx];
      if (!currentLesson) return [];

      const currentTopicIds = new Set(currentLesson.topics.map((t) => t.id));
      const prevTopicIds    = new Set(
        COURSE.slice(0, lessonIdx).flatMap((l) => l.topics.map((t) => t.id))
      );

      const currentPool = QUESTION_BANK.filter((q) => currentTopicIds.has(q.topicId));
      const prevPool    = QUESTION_BANK.filter((q) => prevTopicIds.has(q.topicId));

      // ~70% current, ~30% previous (rounded)
      const currentCount = Math.round(count * 0.7);
      const prevCount    = count - currentCount;

      const currentPicked = weightedPick(currentPool, masteryMap, currentCount);
      const prevPicked    = weightedPick(prevPool,    masteryMap, prevCount);

      // Merge and re-shuffle
      const merged = [...currentPicked, ...prevPicked];
      for (let i = merged.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [merged[i], merged[j]] = [merged[j], merged[i]];
      }

      return merged.slice(0, count);
    },
    [masteryMap],
  );

  /**
   * After a lesson quiz ends:
   *  1. Update per-topic mastery for every topic that appeared in the quiz.
   *  2. If the overall quiz passed, guarantee all current-lesson topics reach
   *     at least yellow mastery.
   *  3. Record the lesson quiz pass/fail.
   */
  const recordLessonQuizResult = useCallback(
    (lessonId: string, outcomes: TopicQuizOutcome[], passed: boolean, score: number) => {
      setMasteryMap((prev) => {
        let next = { ...prev };
        // Apply per-topic results
        for (const o of outcomes) {
          next = applyTopicResult(next, o.topicId, o.correct, o.total);
        }
        // If passed: guarantee all this lesson's topics are at least yellow
        if (passed) {
          const lesson = COURSE.find((l) => l.id === lessonId);
          if (lesson) {
            for (const topic of lesson.topics) {
              const m = next[topic.id] ?? defaultMastery(topic.id);
              if (m.level === 'red') {
                // Bump streak to yellow minimum
                const bumpedStreak = Math.max(m.streak, STREAK_TO_YELLOW);
                next[topic.id] = { ...m, level: calcLevel(bumpedStreak), streak: bumpedStreak };
              }
            }
          }
        }
        return next;
      });

      setLessonQuizMap((prev) => {
        const current = prev[lessonId];
        return {
          ...prev,
          [lessonId]: {
            lessonId,
            passed:   passed || (current?.passed ?? false), // once passed, always passed
            score,
            attempts: (current?.attempts ?? 0) + 1,
          },
        };
      });
    },
    [applyTopicResult],
  );

  const getLessonQuizRecord = useCallback(
    (lessonId: string): LessonQuizRecord | null => lessonQuizMap[lessonId] ?? null,
    [lessonQuizMap],
  );

  /**
   * Lesson 1 (index 0) is always unlocked.
   * Any subsequent lesson is unlocked if the previous lesson's mastery quiz was passed.
   */
  const isLessonUnlocked = useCallback(
    (lessonId: string): boolean => {
      const idx = COURSE.findIndex((l) => l.id === lessonId);
      if (idx <= 0) return true; // first lesson always open
      const prevLesson = COURSE[idx - 1];
      return lessonQuizMap[prevLesson.id]?.passed === true;
    },
    [lessonQuizMap],
  );

  return (
    <MasteryContext.Provider value={{
      masteryMap,
      lessonQuizMap,
      getMastery,
      canMarkComplete,
      recordQuizResult,
      selectQuizQuestions,
      selectLessonQuizQuestions,
      recordLessonQuizResult,
      getLessonQuizRecord,
      isLessonUnlocked,
    }}>
      {children}
    </MasteryContext.Provider>
  );
}

export function useMastery() {
  const ctx = useContext(MasteryContext);
  if (!ctx) throw new Error('useMastery must be used within MasteryProvider');
  return ctx;
}