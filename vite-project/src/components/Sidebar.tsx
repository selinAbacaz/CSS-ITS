import { useState } from 'react';
import { COURSE } from '../data/course';
import { useProgress } from '../context/ProgressContext';
import { useMastery } from '../context/MasteryContext';
import { MasteryBadge } from './Masterybadge';
import type { Lesson, Topic } from '../types/course';
import styles from './Sidebar.module.css';

interface SidebarProps {
  activeTopic:      string | null;
  activeLessonQuiz: string | null;
  onSelectTopic:      (lessonId: string, topicId: string) => void;
  onSelectLessonQuiz: (lessonId: string) => void;
  onGoHome: () => void;
}

export function Sidebar({
  activeTopic,
  activeLessonQuiz,
  onSelectTopic,
  onSelectLessonQuiz,
  onGoHome,
}: SidebarProps) {
  const { isOpened, isCompleted, completedCount } = useProgress();
  const { getMastery, getLessonQuizRecord, isLessonUnlocked } = useMastery();

  const totalTopics = COURSE.flatMap((l) => l.topics).length;
  const overallPct  = totalTopics ? Math.round((completedCount / totalTopics) * 100) : 0;

  // Auto-expand whichever lesson is active
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    if (activeLessonQuiz) return new Set([activeLessonQuiz]);
    const lesson = COURSE.find((l) => l.topics.some((t) => t.id === activeTopic));
    return new Set(lesson ? [lesson.id] : []);
  });

  function toggleLesson(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function lessonProgress(lesson: Lesson) {
    const total = lesson.topics.length;
    const done  = lesson.topics.filter((t) => isCompleted(t.id)).length;
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  }

  return (
    <aside className={styles.sidebar}>
      <button className={styles.brand} onClick={onGoHome} aria-label="Course home">
        <span className={styles.brandDot} />
        <span className={styles.brandName}>LearnCSS</span>
      </button>
      <p className={styles.brandSub}>Interactive Web Course</p>

      <div className={styles.progressBox}>
        <div className={styles.progressLabel}>
          <span>Course Progress</span>
          <span className={styles.progressPct}>{overallPct}%</span>
        </div>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${overallPct}%` }} />
        </div>
        <p className={styles.progressSub}>{completedCount} / {totalTopics} topics complete</p>
      </div>

      <nav className={styles.nav} aria-label="Course navigation">
        {COURSE.map((lesson) => {
          const prog     = lessonProgress(lesson);
          const isOpen   = expanded.has(lesson.id);
          const allDone  = prog.done === prog.total && prog.total > 0;
          const unlocked = isLessonUnlocked(lesson.id);
          const quizRec  = getLessonQuizRecord(lesson.id);

          return (
            <div key={lesson.id} className={styles.lessonGroup}>
              <button
                className={`${styles.lessonBtn} ${allDone ? styles.lessonDone : ''} ${!unlocked ? styles.lessonLocked : ''}`}
                onClick={() => unlocked && toggleLesson(lesson.id)}
                aria-expanded={isOpen}
                disabled={!unlocked}
                title={!unlocked ? 'Pass the previous lesson\'s mastery quiz to unlock' : undefined}
              >
                <span className={styles.lessonIndicator} style={{ background: unlocked ? lesson.color : '#C0C0C0' }}>
                  {!unlocked ? <LockIcon /> : allDone ? <CheckIcon /> : lesson.id.replace('L', '')}
                </span>

                <span className={styles.lessonText}>
                  <span className={styles.lessonSub}>{lesson.subtitle}</span>
                  <span className={styles.lessonTitle}>{lesson.title}</span>
                </span>

                <span className={styles.lessonMeta}>
                  {unlocked && (
                    <span className={styles.lessonCount}>{prog.done}/{prog.total}</span>
                  )}
                  {!unlocked
                    ? <span className={styles.lockedLabel}>Locked</span>
                    : <ChevronIcon open={isOpen} />
                  }
                </span>
              </button>

              <div className={`${styles.topicList} ${isOpen && unlocked ? styles.topicListOpen : ''}`} aria-hidden={!isOpen}>
                {/* Topic entries */}
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

                {/* ── Mastery Quiz entry ── */}
                <button
                  className={`${styles.masteryQuizBtn} ${activeLessonQuiz === lesson.id ? styles.masteryQuizActive : ''} ${quizRec?.passed ? styles.masteryQuizPassed : ''}`}
                  onClick={() => onSelectLessonQuiz(lesson.id)}
                >
                  <span className={`${styles.masteryQuizIcon} ${quizRec?.passed ? styles.masteryQuizIconPassed : ''}`}>
                    {quizRec?.passed ? '✓' : '★'}
                  </span>
                  <span className={styles.masteryQuizText}>
                    <span className={styles.masteryQuizTitle}>Mastery Quiz</span>
                    {quizRec && (
                      <span className={styles.masteryQuizScore}>
                        {quizRec.passed ? `Passed · ${quizRec.score}%` : `Last: ${quizRec.score}%`}
                      </span>
                    )}
                  </span>
                  {!quizRec && <span className={styles.masteryQuizNew}>Start</span>}
                </button>
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
  const dotClass = isCompleted ? styles.dotDone : isOpened ? styles.dotOpened : '';
  return (
    <button
      className={`${styles.topicBtn} ${isActive ? styles.topicActive : ''} ${isCompleted ? styles.topicDone : ''}`}
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
      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" width="11" height="11">
      <rect x="2" y="5" width="8" height="6" rx="1.5" fill="white" opacity="0.9"/>
      <path d="M4 5V3.5a2 2 0 014 0V5" stroke="white" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" width="14" height="14"
      style={{ transition: 'transform 0.25s ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', color: 'var(--text-muted)', flexShrink: 0 }}>
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}