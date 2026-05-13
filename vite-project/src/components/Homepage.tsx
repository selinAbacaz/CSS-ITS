import { COURSE } from '../data/course';
import { useProgress } from '../context/ProgressContext';
import { useMastery } from '../context/MasteryContext';
import { MasteryBadge } from './Masterybadge';
import type { Lesson } from '../types/course';
import styles from './HomePage.module.css';

interface HomePageProps {
  onSelectTopic: (lessonId: string, topicId: string) => void;
}

export function HomePage({ onSelectTopic }: HomePageProps) {
  const { isOpened, isCompleted, completedCount } = useProgress();
  const { getMastery } = useMastery();
  const totalTopics = COURSE.flatMap((l) => l.topics).length;

  function lessonProgress(lesson: Lesson) {
    const total = lesson.topics.length;
    const done = lesson.topics.filter((t) => isCompleted(t.id)).length;
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  }

  return (
    <main className={styles.main}>
      {/* Hero */}
      <section className={styles.hero}>
        <span className={styles.heroTag}>Start Learning</span>
        <h1 className={styles.heroTitle}>
          Master CSS<br />
          <em>from scratch.</em>
        </h1>
        <p className={styles.heroDesc}>
          A structured, hands-on course covering everything from formatting to
          complex animations. Pick a topic below to begin.
        </p>
        <div className={styles.stats}>
          <Stat value={COURSE.length} label="Lessons" />
          <Stat value={totalTopics} label="Topics" />
          <Stat value={completedCount} label="Completed" />
        </div>
      </section>

      {/* Lesson cards */}
      <div className={styles.cardList}>
        {COURSE.map((lesson) => {
          const prog = lessonProgress(lesson);
          return (
            <div key={lesson.id} className={styles.card}>
              <div className={styles.cardAccent} style={{ background: lesson.color }} />
              <div className={styles.cardBody}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardTag}>{lesson.subtitle}</span>
                  <span className={styles.cardDifficulty}>{lesson.difficulty}</span>
                </div>
                <h2 className={styles.cardTitle}>{lesson.title}</h2>
                <div className={styles.cardMeta}>
                  <span>⏱ {lesson.duration}</span>
                  <span>{lesson.topics.length} topics</span>
                </div>

                {/* Progress bar */}
                <div className={styles.progressRow}>
                  <div className={styles.progressTrack}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${prog.pct}%`, background: lesson.color }}
                    />
                  </div>
                  <span className={styles.progressLabel}>
                    {prog.done}/{prog.total} done
                  </span>
                </div>

                {/* Topic pills */}
                <div className={styles.topicPills}>
                  {lesson.topics.map((topic) => {
                    const done   = isCompleted(topic.id);
                    const opened = isOpened(topic.id);
                    const mastery = getMastery(topic.id);
                    return (
                      <button
                        key={topic.id}
                        className={`${styles.pill} ${done ? styles.pillDone : opened ? styles.pillOpened : ''}`}
                        onClick={() => onSelectTopic(lesson.id, topic.id)}
                      >
                        <span className={`${styles.pillDot} ${done ? styles.pillDotDone : opened ? styles.pillDotOpened : ''}`} />
                        {topic.title}
                        <MasteryBadge level={mastery.level} size="sm" />
                      </button>
                    );
                  })}
                </div>
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