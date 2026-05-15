import { useEffect, useState, useCallback } from 'react';
import { COURSE } from '../data/course';
import { useProgress } from '../context/ProgressContext';
import { useMastery } from '../context/MasteryContext';
import { Quiz, QuizSummary } from './Quiz';
import { MasteryBadge } from './Masterybadge';
import type { QuizResult } from '../types/quiz';
import styles from './Topicpage.module.css';

interface TopicPageProps {
  lessonId: string;
  topicId: string;
  onBack: () => void;
  onNavigate: (lessonId: string, topicId: string) => void;
}

export function TopicPage({ lessonId, topicId, onBack, onNavigate }: TopicPageProps) {
  const { markOpened, isCompleted, toggleCompleted } = useProgress();
  const { getMastery, canMarkComplete } = useMastery();

  const lesson     = COURSE.find((l) => l.id === lessonId);
  const topicIndex = lesson?.topics.findIndex((t) => t.id === topicId) ?? -1;
  const topic      = lesson?.topics[topicIndex];
  const prevTopic  = topicIndex > 0 ? lesson?.topics[topicIndex - 1] : null;
  const nextTopic  = lesson && topicIndex < lesson.topics.length - 1
    ? lesson.topics[topicIndex + 1] : null;

  const [quizKey,    setQuizKey]    = useState(0);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [showQuiz,   setShowQuiz]   = useState(true);

  useEffect(() => {
    markOpened(topicId);
    window.scrollTo(0, 0);
    setQuizKey(0);
    setQuizResult(null);
    setShowQuiz(true);
  }, [topicId, markOpened]);

  const handleQuizComplete = useCallback((result: QuizResult) => {
    setQuizResult(result);
    setShowQuiz(false);
  }, []);

  const handleRetake = useCallback(() => {
    setQuizResult(null);
    setShowQuiz(true);
    setQuizKey((k) => k + 1);
  }, []);

  const handleMarkComplete = useCallback(() => {
    toggleCompleted(topicId);
  }, [topicId, toggleCompleted]);

  if (!lesson || !topic) {
    return (
      <main className={styles.main}>
        <p>Topic not found.</p>
        <button onClick={onBack}>← Back</button>
      </main>
    );
  }

  const done        = isCompleted(topicId);
  const mastery     = getMastery(topicId);
  const canComplete = canMarkComplete(topicId);

  return (
    <main className={styles.main}>
      <button className={styles.backBtn} onClick={onBack}>
        ← Back to Course
      </button>

      <section className={styles.hero}>
        <p className={styles.heroTag} style={{ color: lesson.color }}>
          {lesson.subtitle} · {lesson.title}
        </p>
        <div className={styles.heroTitleRow}>
          <h1 className={styles.heroTitle}>{topic.title}</h1>
          <MasteryBadge level={mastery.level} showLabel />
        </div>
        <p
          className={styles.heroIntro}
          dangerouslySetInnerHTML={{ __html: topic.content.intro }}
        />
        <div className={styles.metaPills}>
          <span className={styles.metaPill}>⏱ {topic.duration}</span>
          <span className={`${styles.metaPill} ${done ? styles.metaPillDone : ''}`}>
            {done ? '✓ Completed' : 'In Progress'}
          </span>
        </div>
      </section>

      <div className={styles.sections}>
        {topic.content.sections.map((sec, i) => (
          <div key={i} className={styles.section} style={{ animationDelay: `${i * 0.07}s` }}>
            <h2 className={styles.sectionHeading}>{sec.heading}</h2>
            <p className={styles.sectionBody} dangerouslySetInnerHTML={{ __html: sec.body }} />
          </div>
        ))}
      </div>

      <div className={styles.codeWrapper}>
        <div className={styles.codeLabel}>Example</div>
        <pre className={styles.codeBlock}><code>{topic.content.example}</code></pre>
      </div>

      {/* Quiz section */}
      <div className={styles.quizSection}>
        <div className={styles.quizSectionHeader}>
          <h2 className={styles.quizSectionTitle}>Topic Quiz</h2>
          <p className={styles.quizSectionSub}>
            Answer correctly to raise your mastery tier. You need{' '}
            <strong>yellow or green mastery</strong> to mark this topic complete.
          </p>
        </div>

        {showQuiz && (
          <Quiz key={quizKey} topicId={topicId} onComplete={handleQuizComplete} />
        )}

        {!showQuiz && quizResult && (
          <QuizSummary
            result={quizResult}
            topicId={topicId}
            onRetake={handleRetake}
            onMarkComplete={handleMarkComplete}
            canComplete={canComplete && !done}
          />
        )}

        {done && (
          <div className={styles.completedBanner}>
            <span className={styles.completedIcon}>✓</span>
            <div>
              <p className={styles.completedTitle}>Topic Completed</p>
              <p className={styles.completedSub}>You can retake the quiz any time to improve your mastery.</p>
            </div>
            <button className={styles.undoBtn} onClick={() => toggleCompleted(topicId)}>
              Undo
            </button>
          </div>
        )}

        {!done && quizResult && !canComplete && (
          <div className={styles.lockedBanner}>
            <span>🔒</span>
            <p>Reach <strong>yellow mastery</strong> (70%+ on a quiz attempt) to unlock completion.</p>
          </div>
        )}
      </div>

      <div className={styles.navBtns}>
        {prevTopic ? (
          <button className={styles.navBtn} onClick={() => onNavigate(lessonId, prevTopic.id)}>
            ← {prevTopic.title}
          </button>
        ) : <span />}
        {nextTopic ? (
          <button className={`${styles.navBtn} ${styles.navBtnNext}`} onClick={() => onNavigate(lessonId, nextTopic.id)}>
            {nextTopic.title} →
          </button>
        ) : <span />}
      </div>
    </main>
  );
}