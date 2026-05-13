import { useState } from 'react';
import { COURSE } from '../data/course';
import { useProgress } from '../context/ProgressContext';
import { useMastery } from '../context/MasteryContext';
import { MasteryBadge } from './Masterybadge';
import type { Lesson, Topic } from '../types/course';
import styles from './Sidebar.module.css';

interface SidebarProps {
  activeTopic: string | null;
  onSelectTopic: (lessonId: string, topicId: string) => void;
  onGoHome: () => void;
}

export function Sidebar({ activeTopic, onSelectTopic, onGoHome }: SidebarProps) {
  const { isOpened, isCompleted, completedCount } = useProgress();
  const { getMastery } = useMastery();
  const totalTopics = COURSE.flatMap((l) => l.topics).length;
  const overallPct = totalTopics ? Math.round((completedCount / totalTopics) * 100) : 0;

  // Which lesson panels are expanded
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    // Auto-expand the lesson containing the active topic
    const lesson = COURSE.find((l) => l.topics.some((t) => t.id === activeTopic));
    return new Set(lesson ? [lesson.id] : []);
  });

  function toggleLesson(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function lessonProgress(lesson: Lesson) {
    const total = lesson.topics.length;
    const done = lesson.topics.filter((t) => isCompleted(t.id)).length;
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  }

  return (
    <aside className={styles.sidebar}>
      {/* Brand */}
      <button className={styles.brand} onClick={onGoHome} aria-label="Go to course home">
        <span className={styles.brandDot} />
        <span className={styles.brandName}>LearnCSS</span>
      </button>
      <p className={styles.brandSub}>Interactive Web Course</p>

      {/* Overall progress */}
      <div className={styles.progressBox}>
        <div className={styles.progressLabel}>
          <span>Course Progress</span>
          <span className={styles.progressPct}>{overallPct}%</span>
        </div>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${overallPct}%` }} />
        </div>
        <p className={styles.progressSub}>
          {completedCount} / {totalTopics} topics complete
        </p>
      </div>

      {/* Lesson nav */}
      <nav className={styles.nav} aria-label="Course navigation">
        {COURSE.map((lesson) => {
          const prog = lessonProgress(lesson);
          const isOpen = expanded.has(lesson.id);
          const allDone = prog.done === prog.total && prog.total > 0;

          return (
            <div key={lesson.id} className={styles.lessonGroup}>
              {/* Lesson toggle button */}
              <button
                className={`${styles.lessonBtn} ${allDone ? styles.lessonDone : ''}`}
                onClick={() => toggleLesson(lesson.id)}
                aria-expanded={isOpen}
              >
                <span
                  className={styles.lessonIndicator}
                  style={{ background: lesson.color }}
                >
                  {allDone ? <CheckIcon /> : lesson.id.replace('L', '')}
                </span>

                <span className={styles.lessonText}>
                  <span className={styles.lessonSub}>{lesson.subtitle}</span>
                  <span className={styles.lessonTitle}>{lesson.title}</span>
                </span>

                <span className={styles.lessonMeta}>
                  <span className={styles.lessonCount}>
                    {prog.done}/{prog.total}
                  </span>
                  <ChevronIcon open={isOpen} />
                </span>
              </button>

              {/* Topic dropdown */}
              <div
                className={`${styles.topicList} ${isOpen ? styles.topicListOpen : ''}`}
                aria-hidden={!isOpen}
              >
                {lesson.topics.map((topic) => (
                  <TopicButton
                    key={topic.id}
                    topic={topic}
                    lessonId={lesson.id}
                    isActive={activeTopic === topic.id}
                    isOpened={isOpened(topic.id)}
                    isCompleted={isCompleted(topic.id)}
                    masteryLevel={getMastery(topic.id).level}
                    onSelect={onSelectTopic}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

interface TopicButtonProps {
  topic: Topic;
  lessonId: string;
  isActive: boolean;
  isOpened: boolean;
  isCompleted: boolean;
  masteryLevel: import('../types/quiz').MasteryLevel;
  onSelect: (lessonId: string, topicId: string) => void;
}

function TopicButton({ topic, lessonId, isActive, isOpened, isCompleted, masteryLevel, onSelect }: TopicButtonProps) {
  const dotClass = isCompleted
    ? styles.dotDone
    : isOpened
    ? styles.dotOpened
    : '';

  return (
    <button
      className={`${styles.topicBtn} ${isActive ? styles.topicActive : ''} ${
        isCompleted ? styles.topicDone : ''
      }`}
      onClick={() => onSelect(lessonId, topic.id)}
    >
      <span className={`${styles.dot} ${dotClass}`} />
      <span className={styles.topicTitle}>{topic.title}</span>
      <MasteryBadge level={masteryLevel} size="sm" />
    </button>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" width="12" height="12">
      <path
        d="M2 6l3 3 5-5"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      width="14"
      height="14"
      style={{
        transition: 'transform 0.25s ease',
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        color: 'var(--text-muted)',
        flexShrink: 0,
      }}
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}