import { useEffect } from 'react';
import { COURSE } from '../data/course';
import { useProgress } from '../context/ProgressContext';
import styles from './TopicPage.module.css';

interface TopicPageProps {
  lessonId: string;
  topicId: string;
  onBack: () => void;
  onNavigate: (lessonId: string, topicId: string) => void;
}

export function TopicPage({ lessonId, topicId, onBack, onNavigate }: TopicPageProps) {
  const { markOpened, isCompleted, toggleCompleted } = useProgress();

  const lesson = COURSE.find((l) => l.id === lessonId);
  const topicIndex = lesson?.topics.findIndex((t) => t.id === topicId) ?? -1;
  const topic = lesson?.topics[topicIndex];
  const prevTopic = topicIndex > 0 ? lesson?.topics[topicIndex - 1] : null;
  const nextTopic = lesson && topicIndex < lesson.topics.length - 1
    ? lesson.topics[topicIndex + 1]
    : null;

  useEffect(() => {
    markOpened(topicId);
    window.scrollTo(0, 0);
  }, [topicId, markOpened]);

  if (!lesson || !topic) {
    return (
      <main className={styles.main}>
        <p>Topic not found.</p>
        <button onClick={onBack}>← Back</button>
      </main>
    );
  }

  const done = isCompleted(topicId);

  return (
    <main className={styles.main}>
      {/* Back */}
      <button className={styles.backBtn} onClick={onBack}>
        ← Back to Course
      </button>

      {/* Hero */}
      <section className={styles.hero}>
        <p className={styles.heroTag} style={{ color: lesson.color }}>
          {lesson.subtitle} · {lesson.title}
        </p>
        <h1 className={styles.heroTitle}>{topic.title}</h1>
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

      {/* Content sections */}
      <div className={styles.sections}>
        {topic.content.sections.map((sec, i) => (
          <div
            key={i}
            className={styles.section}
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            <h2 className={styles.sectionHeading}>{sec.heading}</h2>
            <p
              className={styles.sectionBody}
              dangerouslySetInnerHTML={{ __html: sec.body }}
            />
          </div>
        ))}
      </div>

      {/* Code example */}
      <div className={styles.codeWrapper}>
        <div className={styles.codeLabel}>Example</div>
        <pre className={styles.codeBlock}>
          <code>{topic.content.example}</code>
        </pre>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <div className={styles.navBtns}>
          {prevTopic ? (
            <button
              className={styles.navBtn}
              onClick={() => onNavigate(lessonId, prevTopic.id)}
            >
              ← {prevTopic.title}
            </button>
          ) : (
            <span />
          )}
          {nextTopic ? (
            <button
              className={`${styles.navBtn} ${styles.navBtnNext}`}
              onClick={() => onNavigate(lessonId, nextTopic.id)}
            >
              {nextTopic.title} →
            </button>
          ) : (
            <span />
          )}
        </div>

        <button
          className={`${styles.completeBtn} ${done ? styles.completeBtnDone : ''}`}
          onClick={() => toggleCompleted(topicId)}
        >
          {done ? '✓ Completed — Click to Undo' : 'Mark as Complete'}
        </button>
      </div>
    </main>
  );
}