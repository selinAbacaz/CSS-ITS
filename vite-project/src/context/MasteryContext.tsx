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


export const PASS_THRESHOLD      = 0.7;
export const TOPIC_QUIZ_LENGTH   = 5;
export const LESSON_QUIZ_LENGTH  = 12;


interface MasteryContextValue {
  masteryMap:     Record<string, TopicMastery>;
  lessonQuizMap:  Record<string, LessonQuizRecord>;

  getMastery:     (topicId: string) => TopicMastery;
  canMarkComplete:(topicId: string) => boolean;

  recordQuizResult:(topicId: string, correctCount: number, total: number) => void;
  selectQuizQuestions:(topicId: string, count?: number) => Question[];

  selectLessonQuizQuestions:(lessonId: string, count?: number) => Question[];
  recordLessonQuizResult:(lessonId: string, outcomes: TopicQuizOutcome[], passed: boolean, score: number) => void;
  getLessonQuizRecord:(lessonId: string) => LessonQuizRecord | null;
  isLessonUnlocked:(lessonId: string) => boolean;
}

const MasteryContext = createContext<MasteryContextValue | null>(null);

const MASTERY_KEY     = 'learnCSS_mastery';
const LESSON_QUIZ_KEY = 'learnCSS_lessonQuiz';


function updateKnowledge(pKnown: number, correct: boolean): number {
const SLIP = 0.05;
const GUESS = 0.15;
const LEARN = 0.08;

  let posterior;

  if (correct) {
    posterior =
      (pKnown * (1 - SLIP)) /
      (pKnown * (1 - SLIP) + (1 - pKnown) * GUESS);
  } else {
    posterior =
      (pKnown * SLIP) /
      (pKnown * SLIP + (1 - pKnown) * (1 - GUESS));
  }

  
  posterior = posterior + LEARN * (1 - posterior);

  return Math.max(0, Math.min(1, posterior));
}


function defaultMastery(topicId: string): TopicMastery {
  return {
    topicId,
    pKnown: 0.2,
    level: 'red',
    attempts: 0,
    correct: 0,
  };
}



function calcLevel(pKnown: number): MasteryLevel {
  if (pKnown >= 0.8) return 'green';
  if (pKnown >= 0.25) return 'yellow';
  return 'red';
}

function loadJSON<T>(key: string): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return {} as T;
    return JSON.parse(raw) as T;
  } catch { return {} as T; }
}

function weightedPick(
  questions: Question[],
  masteryMap: Record<string, TopicMastery>,
  count: number,
): Question[] {
  const weighted: Question[] = [];

  
  for (const q of questions) {
    const mastery = masteryMap[q.topicId];
    const pKnown = mastery?.pKnown ?? 0.2;

    
    const w = Math.max(1, Math.round((1 - pKnown) * 5));

    for (let i = 0; i < w; i++) {
      weighted.push(q);
    }
  }

  
  for (let i = weighted.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [weighted[i], weighted[j]] = [weighted[j], weighted[i]];
  }

  
  const seen = new Set<string>();
  const result: Question[] = [];

  for (const q of weighted) {
    if (!seen.has(q.id)) {
      seen.add(q.id);
      result.push(q);
    }

    if (result.length >= count) break;
  }

  return result;
}


export function MasteryProvider({ children }: { children: ReactNode }) {
  const [masteryMap,    setMasteryMap]    = useState<Record<string, TopicMastery>>(() => loadJSON(MASTERY_KEY));
  const [lessonQuizMap, setLessonQuizMap] = useState<Record<string, LessonQuizRecord>>(() => loadJSON(LESSON_QUIZ_KEY));

  useEffect(() => {
    try { localStorage.setItem(MASTERY_KEY,     JSON.stringify(masteryMap));    } catch {}
  }, [masteryMap]);

  useEffect(() => {
    try { localStorage.setItem(LESSON_QUIZ_KEY, JSON.stringify(lessonQuizMap)); } catch {}
  }, [lessonQuizMap]);



  const getMastery = useCallback(
    (topicId: string): TopicMastery => masteryMap[topicId] ?? defaultMastery(topicId),
    [masteryMap],
  );

  const canMarkComplete = useCallback(
    (topicId: string): boolean => {
      const m = masteryMap[topicId];
      return !!m && m.pKnown >= 0.6;
    },
    [masteryMap],
  );

  const applyTopicResult = useCallback(
  (prev: Record<string, TopicMastery>, topicId: string, correctCount: number, total: number) => {

    const current = prev[topicId] ?? defaultMastery(topicId);

    let pKnown = current.pKnown;

    for (let i = 0; i < total; i++) {
      const correct = i < correctCount;
      pKnown = updateKnowledge(pKnown, correct);
    }

    return {
      ...prev,
      [topicId]: {
        topicId,
        pKnown,
        level: calcLevel(pKnown),
        attempts: current.attempts + 1,
        correct: current.correct + correctCount,
      },
    };
  },
  [],
);

 
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

      
      const currentCount = Math.round(count * 0.7);
      const prevCount    = count - currentCount;

      const currentPicked = weightedPick(currentPool, masteryMap, currentCount);
      const prevPicked    = weightedPick(prevPool,    masteryMap, prevCount);

      
      const merged = [...currentPicked, ...prevPicked];
      for (let i = merged.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [merged[i], merged[j]] = [merged[j], merged[i]];
      }

      return merged.slice(0, count);
    },
    [masteryMap],
  );

  const recordLessonQuizResult = useCallback(
  (lessonId: string, outcomes: TopicQuizOutcome[], passed: boolean, score: number) => {

    
    setMasteryMap((prev) => {
      let next = { ...prev };

      for (const o of outcomes) {
        next = applyTopicResult(
          next,
          o.topicId,
          o.correct,
          o.total
        );
      }

      
      if (passed) {
        const lesson = COURSE.find((l) => l.id === lessonId);

        if (lesson) {
          for (const topic of lesson.topics) {
            const m = next[topic.id] ?? defaultMastery(topic.id);

            const MIN_KNOWLEDGE = 0.5;

            if (m.pKnown < MIN_KNOWLEDGE) {
              next[topic.id] = {
                ...m,
                pKnown: MIN_KNOWLEDGE,
                level: calcLevel(MIN_KNOWLEDGE),
              };
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
          passed: passed || (current?.passed ?? false),
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