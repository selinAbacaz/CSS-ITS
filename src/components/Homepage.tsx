import { COURSE } from '../data/course';
import { useProgress } from '../context/ProgressContext';
import { useMastery } from '../context/MasteryContext';
import { MasteryBadge } from './Masterybadge';
import type { Lesson } from '../types/course';
import styles from './HomePage.module.css';

interface HomePageProps {
  onSelectTopic:      (lessonId: string, topicId: string) => void;
  onSelectLessonQuiz: (lessonId: string) => void;
}

export function HomePage({ onSelectTopic, onSelectLessonQuiz }: HomePageProps) {
  const { isOpened, isCompleted, completedCount } = useProgress();
  const { getMastery, getLessonQuizRecord, isLessonUnlocked } = useMastery();
  const totalTopics = COURSE.flatMap((l) => l.topics).length;

  function lessonProgress(lesson: Lesson) {
    const total = lesson.topics.length;
    const done  = lesson.topics.filter((t) => isCompleted(t.id)).length;
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  }

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <span className={styles.heroTag}>Start Learning</span>
        <h1 className={styles.heroTitle}>
          Master CSS<br /><em>from scratch.</em>
        </h1>
        <p className={styles.heroDesc}>
          A structured, hands-on course covering everything from formatting to complex
          animations. Complete each lesson's mastery quiz to unlock the next.
        </p>
        <div className={styles.stats}>
          <Stat value={COURSE.length} label="Lessons" />
          <Stat value={totalTopics} label="Topics" />
          <Stat value={completedCount} label="Completed" />
        </div>
      </section>

      <div className={styles.cardList}>
        {COURSE.map((lesson) => {
          const prog     = lessonProgress(lesson);
          const unlocked = isLessonUnlocked(lesson.id);
          const quizRec  = getLessonQuizRecord(lesson.id);

          return (
            <div
              key={lesson.id}
              className={`${styles.card} ${!unlocked ? styles.cardLocked : ''}`}
            >
              <div className={styles.cardAccent} style={{ background: unlocked ? lesson.color : '#C8C8C8' }} />
              <div className={styles.cardBody}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardTag}>{lesson.subtitle}</span>
                  <span className={styles.cardDifficulty}>{lesson.difficulty}</span>
                  {!unlocked && (
                    <span className={styles.cardLockedBadge}>🔒 Locked</span>
                  )}
                  {quizRec?.passed && (
                    <span className={styles.cardPassedBadge}>✓ Quiz Passed</span>
                  )}
                </div>

                <h2 className={styles.cardTitle}>{lesson.title}</h2>
                <div className={styles.cardMeta}>
                  <span>⏱ {lesson.duration}</span>
                  <span>{lesson.topics.length} topics</span>
                </div>

                <div className={styles.progressRow}>
                  <div className={styles.progressTrack}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${prog.pct}%`, background: unlocked ? lesson.color : '#C8C8C8' }}
                    />
                  </div>
                  <span className={styles.progressLabel}>{prog.done}/{prog.total} done</span>
                </div>

              
                <div className={styles.topicPills}>
                  {lesson.topics.map((topic) => {
                    const done   = isCompleted(topic.id);
                    const opened = isOpened(topic.id);
                    const mastery = getMastery(topic.id);
                    return (
                      <button
                        key={topic.id}
                        className={`${styles.pill} ${done ? styles.pillDone : opened ? styles.pillOpened : ''} ${!unlocked ? styles.pillDisabled : ''}`}
                        onClick={() => unlocked && onSelectTopic(lesson.id, topic.id)}
                        disabled={!unlocked}
                      >
                        <span className={`${styles.pillDot} ${done ? styles.pillDotDone : opened ? styles.pillDotOpened : ''}`} />
                        {topic.title}
                        {unlocked && <MasteryBadge level={mastery.level} size="sm" />}
                      </button>
                    );
                  })}

                  <button
                    className={`${styles.pill} ${styles.pillQuiz} ${quizRec?.passed ? styles.pillQuizPassed : ''} ${!unlocked ? styles.pillDisabled : ''}`}
                    onClick={() => unlocked && onSelectLessonQuiz(lesson.id)}
                    disabled={!unlocked}
                  >
                    <span className={styles.pillQuizIcon}>{quizRec?.passed ? '✓' : '★'}</span>
                    Mastery Quiz
                    {quizRec && (
                      <span className={styles.pillQuizScore}>{quizRec.score}%</span>
                    )}
                  </button>
                </div>

                {!unlocked && (
                  <p className={styles.lockedHint}>
                    Pass the <strong>Mastery Quiz</strong> in {COURSE[COURSE.findIndex(l => l.id === lesson.id) - 1]?.subtitle} to unlock.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className={styles.stat}>
      <span className={styles.statNum}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}