import { useState, useCallback, useEffect } from 'react';
import { COURSE } from '../data/course';
import { useMastery } from '../context/MasteryContext';
import { LessonQuiz, LessonQuizSummary } from './Lessonquiz';
import { MasteryBadge } from './Masterybadge';
import type { TopicQuizOutcome } from '../types/quiz';
import styles from './Lessonquizpage.module.css';

interface LessonQuizPageProps {
  lessonId: string;
  onBack: () => void;
  
  onNextLesson: (lessonId: string) => void;
}

type PagePhase = 'intro' | 'quiz' | 'summary';

export function LessonQuizPage({ lessonId, onBack, onNextLesson }: LessonQuizPageProps) {
  const {
    selectLessonQuizQuestions,
    recordLessonQuizResult,
    getLessonQuizRecord,
    getMastery,
    
  } = useMastery();

  const lesson       = COURSE.find((l) => l.id === lessonId);
  const lessonIdx    = COURSE.findIndex((l) => l.id === lessonId);
  const nextLesson   = COURSE[lessonIdx + 1] ?? null;

  const [phase,     setPhase]     = useState<PagePhase>('intro');
  const [quizKey,   setQuizKey]   = useState(0);
  const [questions, setQuestions] = useState(() => selectLessonQuizQuestions(lessonId));
  const [result,    setResult]    = useState<{ passed: boolean; score: number; outcomes: TopicQuizOutcome[] } | null>(null);

  useEffect(() => { window.scrollTo(0, 0); }, [phase]);

  const handleStart = useCallback(() => {
    setQuestions(selectLessonQuizQuestions(lessonId));
    setPhase('quiz');
  }, [lessonId, selectLessonQuizQuestions]);

  const handleQuizComplete = useCallback(
    (passed: boolean, score: number, outcomes: TopicQuizOutcome[]) => {
      recordLessonQuizResult(lessonId, outcomes, passed, score);
      setResult({ passed, score, outcomes });
      setPhase('summary');
    },
    [lessonId, recordLessonQuizResult],
  );

  const handleRetake = useCallback(() => {
    setResult(null);
    setQuizKey((k) => k + 1);
    setQuestions(selectLessonQuizQuestions(lessonId));
    setPhase('quiz');
  }, [lessonId, selectLessonQuizQuestions]);

  const handleNextLesson = useCallback(() => {
    if (nextLesson) onNextLesson(nextLesson.id);
  }, [nextLesson, onNextLesson]);

  if (!lesson) return null;

  const record = getLessonQuizRecord(lessonId);

  return (
    <main className={styles.main}>
      <button className={styles.backBtn} onClick={onBack}>
        ← Back to Course
      </button>

      
      <section className={styles.hero}>
        <div className={styles.heroAccent} style={{ background: lesson.color }} />
        <div className={styles.heroBody}>
          <p className={styles.heroTag} style={{ color: lesson.color }}>
            {lesson.subtitle} · End-of-Lesson
          </p>
          <h1 className={styles.heroTitle}>Mastery Quiz</h1>
          <p className={styles.heroDesc}>
            12 questions drawn from <strong>{lesson.title}</strong> topics,
            plus a few from earlier lessons to reinforce your foundations.
            You need <strong>70%</strong> to pass and unlock the next lesson.
          </p>

          
          <div className={styles.topicMasteries}>
            {lesson.topics.map((t) => (
              <div key={t.id} className={styles.topicMasteryItem}>
                <span className={styles.topicMasteryName}>{t.title}</span>
                <MasteryBadge level={getMastery(t.id).level} showLabel size="sm" />
              </div>
            ))}
          </div>

          
          {record && (
            <div className={`${styles.prevRecord} ${record.passed ? styles.prevPassed : styles.prevFailed}`}>
              {record.passed
                ? `✓ Previously passed with ${record.score}% (${record.attempts} attempt${record.attempts > 1 ? 's' : ''})`
                : `Last attempt: ${record.score}% — ${record.attempts} attempt${record.attempts > 1 ? 's' : ''}`}
            </div>
          )}
        </div>
      </section>

      
      {phase === 'intro' && (
        <div className={styles.introSection}>
          <div className={styles.introRules}>
            <div className={styles.ruleItem}>
              <span className={styles.ruleIcon}>📋</span>
              <div>
                <p className={styles.ruleTitle}>12 Questions</p>
                <p className={styles.ruleSub}>~70% from this lesson, ~30% from earlier lessons based on your mastery</p>
              </div>
            </div>
            <div className={styles.ruleItem}>
              <span className={styles.ruleIcon}></span>
              <div>
                <p className={styles.ruleTitle}>Navigate freely</p>
                <p className={styles.ruleSub}>Go back and review previous answers before you submit</p>
              </div>
            </div>
            <div className={styles.ruleItem}>
              <span className={styles.ruleIcon}></span>
              <div>
                <p className={styles.ruleTitle}>Mastery updates</p>
                <p className={styles.ruleSub}>Each answer affects your mastery for that specific topic</p>
              </div>
            </div>
            <div className={styles.ruleItem}>
              <span className={styles.ruleIcon}>🔓</span>
              <div>
                <p className={styles.ruleTitle}>Unlock the next lesson</p>
                <p className={styles.ruleSub}>Pass with 70%+ to continue{nextLesson ? ` to ${nextLesson.title}` : ''}</p>
              </div>
            </div>
          </div>
          <button className={styles.startBtn} onClick={handleStart}>
            {record ? 'Retake Quiz' : 'Start Quiz'} →
          </button>
        </div>
      )}

      {phase === 'quiz' && (
        <LessonQuiz
          key={quizKey}
          lessonId={lessonId}
          questions={questions}
          onComplete={handleQuizComplete}
        />
      )}

      {phase === 'summary' && result && (
        <LessonQuizSummary
          lessonId={lessonId}
          passed={result.passed}
          score={result.score}
          outcomes={result.outcomes}
          attempts={record?.attempts ?? 1}
          onRetake={handleRetake}
          onNextLesson={handleNextLesson}
          hasNextLesson={!!nextLesson}
        />
      )}
    </main>
  );
}
