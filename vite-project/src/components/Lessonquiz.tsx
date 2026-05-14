import { useState, useMemo, useCallback } from 'react';
import type { Question, AnswerState, TopicQuizOutcome } from '../types/quiz';
import { PASS_THRESHOLD } from '../context/MasteryContext';
import { useMastery } from '../context/MasteryContext';
import { MasteryBadge } from './Masterybadge';
import { COURSE } from '../data/course';
import styles from './LessonQuiz.module.css';


interface LessonQuizProps {
  lessonId: string;
  questions: Question[];
  onComplete: (passed: boolean, score: number, outcomes: TopicQuizOutcome[]) => void;
}

type SessionPhase = 'taking' | 'review' | 'submitted';


export function LessonQuiz({ lessonId, questions, onComplete }: LessonQuizProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers]       = useState<AnswerState[]>(() =>
    questions.map(() => ({ status: 'unanswered' as const })),
  );

  // In 'taking' phase: feedback shown immediately after answering.
  // In 'review' phase: user browses already-answered questions before submitting.
  // In 'submitted': show final summary.
  const [phase, setPhase]           = useState<SessionPhase>('taking');
  // Track which question is showing feedback right now (null = none)
  const [feedbackIdx, setFeedbackIdx] = useState<number | null>(null);

  const current       = questions[currentIdx];
  const currentAnswer = answers[currentIdx];
  const answeredCount = answers.filter((a) => a.status !== 'unanswered').length;
  const allAnswered   = answeredCount === questions.length;


  function handleSelect(optionId: string) {
    if (currentAnswer.status !== 'unanswered') return; // already answered
    const isCorrect = optionId === current.correctId;
    const newAnswers = [...answers];
    newAnswers[currentIdx] = isCorrect
      ? { status: 'correct',   chosenId: optionId }
      : { status: 'incorrect', chosenId: optionId };
    setAnswers(newAnswers);
    setFeedbackIdx(currentIdx);
  }

  
  function goTo(idx: number) {
    setCurrentIdx(idx);
    // If navigating to an already answered question in 'taking', show feedback
    if (phase === 'taking' && answers[idx].status !== 'unanswered') {
      setFeedbackIdx(idx);
    } else {
      setFeedbackIdx(null);
    }
  }

  function handleNext() {
    setFeedbackIdx(null);
    if (currentIdx < questions.length - 1) {
      const next = currentIdx + 1;
      setCurrentIdx(next);
      
      if (answers[next].status !== 'unanswered') setFeedbackIdx(next);
    }
  }

  function handlePrev() {
    setFeedbackIdx(null);
    if (currentIdx > 0) {
      const prev = currentIdx - 1;
      setCurrentIdx(prev);
      if (answers[prev].status !== 'unanswered') setFeedbackIdx(prev);
    }
  }

  
  const computeOutcomes = useCallback((): TopicQuizOutcome[] => {
    const map: Record<string, { correct: number; total: number }> = {};
    questions.forEach((q, i) => {
      if (!map[q.topicId]) map[q.topicId] = { correct: 0, total: 0 };
      map[q.topicId].total += 1;
      if (answers[i].status === 'correct') map[q.topicId].correct += 1;
    });
    return Object.entries(map).map(([topicId, v]) => ({ topicId, ...v }));
  }, [questions, answers]);

  function handleSubmit() {
    const correctCount = answers.filter((a) => a.status === 'correct').length;
    const total        = questions.length;
    const score        = Math.round((correctCount / total) * 100);
    const passed       = correctCount / total >= PASS_THRESHOLD;
    const outcomes     = computeOutcomes();
    onComplete(passed, score, outcomes);
    setPhase('submitted');
  }

  
  function optionClass(optionId: string): string {
    const showFeedback = feedbackIdx === currentIdx && currentAnswer.status !== 'unanswered';
    if (!showFeedback) {
      const isChosen =
        currentAnswer.status !== 'unanswered' &&
        (currentAnswer as { chosenId: string }).chosenId === optionId;
      return `${styles.option} ${isChosen ? styles.optionSelected : ''}`;
    }
    if (optionId === current.correctId) return `${styles.option} ${styles.optionCorrect}`;
    const chosen = (currentAnswer as { chosenId: string }).chosenId;
    if (optionId === chosen && chosen !== current.correctId) return `${styles.option} ${styles.optionWrong}`;
    return `${styles.option} ${styles.optionDim}`;
  }

  
  function getFeedback(): { positive: boolean; text: string } | null {
    if (feedbackIdx !== currentIdx) return null;
    if (currentAnswer.status === 'correct') {
      return { positive: true, text: current.correctFeedback };
    }
    if (currentAnswer.status === 'incorrect') {
      const chosenId = (currentAnswer as { chosenId: string }).chosenId;
      const opt      = current.options.find((o) => o.id === chosenId);
      const fallback = `Not quite. The correct answer is "${current.options.find(o => o.id === current.correctId)?.text}".`;
      return { positive: false, text: opt?.wrongFeedback ?? fallback };
    }
    return null;
  }

  const feedback = getFeedback();

  
  function dotStatus(i: number): string {
    const a = answers[i];
    if (i === currentIdx)           return styles.dotActive;
    if (a.status === 'correct')     return styles.dotCorrect;
    if (a.status === 'incorrect')   return styles.dotWrong;
    return styles.dotEmpty;
  }

  return (
    <div className={styles.quiz}>
      
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.quizLabel}>Lesson Mastery Quiz</span>
          <span className={styles.quizSub}>12 questions · 70% to pass · Answer carefully, you cant re-answer to questions </span>
        </div>
        <span className={styles.progress}>
          {answeredCount} / {questions.length} answered
        </span>
      </div>

      
      <div className={styles.gridNav}>
        {questions.map((_, i) => (
          <button
            key={i}
            className={`${styles.gridBtn} ${dotStatus(i)}`}
            onClick={() => goTo(i)}
            title={`Question ${i + 1}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      
      <div className={styles.questionWrap}>
        <div className={styles.questionMeta}>
          <span className={styles.questionNum}>Question {currentIdx + 1}</span>
          <span className={styles.questionTopic}>
            {COURSE.flatMap(l => l.topics).find(t => t.id === current.topicId)?.title ?? current.topicId}
          </span>
        </div>

        <p className={styles.prompt}>{current.prompt}</p>

        <div className={styles.options}>
          {current.options.map((opt) => {
            const showFeedback = feedbackIdx === currentIdx && currentAnswer.status !== 'unanswered';
            return (
              <button
                key={opt.id}
                className={optionClass(opt.id)}
                onClick={() => handleSelect(opt.id)}
                disabled={currentAnswer.status !== 'unanswered'}
              >
                <span className={styles.optionLetter}>{opt.id.toUpperCase()}</span>
                <span className={styles.optionText}>{opt.text}</span>
                {showFeedback && opt.id === current.correctId && (
                  <span className={styles.mark}>✓</span>
                )}
                {showFeedback &&
                  opt.id === (currentAnswer as { chosenId: string }).chosenId &&
                  opt.id !== current.correctId && (
                    <span className={`${styles.mark} ${styles.markWrong}`}>✕</span>
                  )}
              </button>
            );
          })}
        </div>

        
        {feedback && (
          <div className={`${styles.feedback} ${feedback.positive ? styles.feedbackPos : styles.feedbackNeg}`}>
            <span className={styles.feedbackIcon}>{feedback.positive ? '🎉' : '💡'}</span>
            <p className={styles.feedbackText}>{feedback.text}</p>
          </div>
        )}
      </div>

     
      <div className={styles.navRow}>
        <button
          className={styles.navBtn}
          onClick={handlePrev}
          disabled={currentIdx === 0}
        >
          ← Previous
        </button>

        <div className={styles.navCenter}>
          {!allAnswered && (
            <span className={styles.unansweredNote}>
              {questions.length - answeredCount} unanswered
            </span>
          )}
          {allAnswered && (
            <button className={styles.submitBtn} onClick={handleSubmit}>
              Submit Quiz →
            </button>
          )}
        </div>

        <button
          className={styles.navBtn}
          onClick={handleNext}
          disabled={currentIdx === questions.length - 1}
        >
          Next →
        </button>
      </div>
    </div>
  );
}



interface LessonQuizSummaryProps {
  lessonId: string;
  passed: boolean;
  score: number;
  outcomes: TopicQuizOutcome[];
  attempts: number;
  onRetake: () => void;
  onNextLesson?: () => void;
  hasNextLesson: boolean;
}

export function LessonQuizSummary({
  lessonId,
  passed,
  score,
  outcomes,
  attempts,
  onRetake,
  onNextLesson,
  hasNextLesson,
}: LessonQuizSummaryProps) {
  const { getMastery } = useMastery();
  const lesson = COURSE.find((l) => l.id === lessonId);

  
  const topicRows = useMemo(() => {
    return outcomes.map((o) => {
      const topic   = lesson?.topics.find((t) => t.id === o.topicId)
        ?? COURSE.flatMap(l => l.topics).find(t => t.id === o.topicId);
      const mastery = getMastery(o.topicId);
      const pct     = o.total > 0 ? Math.round((o.correct / o.total) * 100) : 0;
      return { topicId: o.topicId, title: topic?.title ?? o.topicId, mastery, correct: o.correct, total: o.total, pct };
    }).sort((a, b) => a.pct - b.pct); // weakest first
  }, [outcomes, lesson, getMastery]);

  const headline = passed
    ? score >= 90 ? 'Excellent work! 🏆' : 'Lesson Passed! 🎉'
    : attempts <= 1 ? 'Not quite yet 📚' : 'Keep going — you\'re making progress 💪';

  const sub = passed
    ? hasNextLesson
      ? 'You\'ve unlocked the next lesson. Your topic mastery has been updated.'
      : 'You\'ve completed the entire course! Outstanding work.'
    : `You need ${Math.round(PASS_THRESHOLD * 100)}% to pass. Questions will keep focusing on your weakest topics.`;

  return (
    <div className={`${styles.summary} ${passed ? styles.summaryPassed : styles.summaryFailed}`}>
      
      <div className={styles.summaryHero}>
        <div className={styles.scoreCircle} data-passed={passed}>
          <span className={styles.scoreNum}>{score}%</span>
          <span className={styles.scorePct}>score</span>
        </div>
        <div className={styles.summaryText}>
          <h2 className={styles.summaryHeadline}>{headline}</h2>
          <p className={styles.summarySub}>{sub}</p>
          {attempts > 1 && (
            <p className={styles.attempts}>Attempt {attempts}</p>
          )}
        </div>
      </div>

      
      <div className={styles.breakdown}>
        <h3 className={styles.breakdownTitle}>Topic Breakdown</h3>
        <div className={styles.breakdownRows}>
          {topicRows.map((row) => (
            <div key={row.topicId} className={styles.breakdownRow}>
              <span className={styles.rowTitle}>{row.title}</span>
              <span className={styles.rowScore}>{row.correct}/{row.total}</span>
              <div className={styles.rowBar}>
                <div
                  className={styles.rowBarFill}
                  style={{
                    width: `${row.pct}%`,
                    background: row.pct >= 70 ? '#4CAF7D' : row.pct >= 40 ? '#E8A838' : '#E05A5A',
                  }}
                />
              </div>
              <MasteryBadge level={row.mastery.level} showLabel size="sm" />
            </div>
          ))}
        </div>
      </div>

      
      <div className={styles.summaryActions}>
        <button className={styles.retakeBtn} onClick={onRetake}>
          ↺ Retake Quiz
        </button>
        {passed && hasNextLesson && onNextLesson && (
          <button className={styles.nextBtn} onClick={onNextLesson}>
            Next Lesson →
          </button>
        )}
      </div>
    </div>
  );
}