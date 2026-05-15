import { useState, useCallback } from 'react';
import type { Question, AnswerState, QuizResult } from '../types/quiz';
import { PASS_THRESHOLD } from '../context/MasteryContext';
import { useMastery } from '../context/MasteryContext';
import { MasteryBadge } from './Masterybadge';
import styles from './Quiz.module.css';

interface QuizProps {
  topicId: string;

  onComplete: (result: QuizResult) => void;
}

type Phase = 'answering' | 'feedback' | 'summary';

export function Quiz({ topicId, onComplete }: QuizProps) {
const { selectQuizQuestions, recordQuestionResult, getMastery } = useMastery();

  const [questions]           = useState<Question[]>(() => selectQuizQuestions(topicId));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<AnswerState[]>(() =>
    questions.map(() => ({ status: 'unanswered' as const })),
  );
  const [phase, setPhase]     = useState<Phase>('answering');
  const [chosen, setChosen]   = useState<string | null>(null);

  const current   = questions[currentIdx];
  const answer    = answers[currentIdx];
  const isLast    = currentIdx === questions.length - 1;

  
  function handleSelect(optionId: string) {
    if (phase !== 'answering') return;
    setChosen(optionId);
    const isCorrect = optionId === current.correctId;
    recordQuestionResult(topicId, isCorrect);
    const newAnswers = [...answers];
    newAnswers[currentIdx] = isCorrect
      ? { status: 'correct',   chosenId: optionId }
      : { status: 'incorrect', chosenId: optionId };
    setAnswers(newAnswers);
    setPhase('feedback');
  }

  function handleNext() {
    if (isLast) {
      finishQuiz();
    } else {
      setCurrentIdx((i) => i + 1);
      setChosen(null);
      setPhase('answering');
    }
  }

  const finishQuiz = useCallback(() => {
  const correctCount = answers.filter(
    (a) => a.status === 'correct'
  ).length;

  const total = questions.length;

  const score = Math.round(
    (correctCount / total) * 100
  );

  const passed =
    correctCount / total >= PASS_THRESHOLD;

  setPhase('summary');

  onComplete({
    total,
    correct: correctCount,
    score,
    passed,
  });
}, [answers, questions.length, onComplete]);

  
  const mastery = getMastery(topicId);

  function optionClass(optionId: string): string {
    if (phase !== 'feedback') {
      return `${styles.option} ${chosen === optionId ? styles.optionSelected : ''}`;
    }
    if (optionId === current.correctId) return `${styles.option} ${styles.optionCorrect}`;
    if (optionId === chosen && chosen !== current.correctId) return `${styles.option} ${styles.optionWrong}`;
    return `${styles.option} ${styles.optionDim}`;
  }


  function feedbackText(): { positive: boolean; text: string } {
    if (answer.status === 'correct') {
      return { positive: true, text: current.correctFeedback };
    }
    if (answer.status === 'incorrect') {
      const chosen = current.options.find((o) => o.id === (answer as { chosenId: string }).chosenId);
      const specific = chosen?.wrongFeedback;
      const fallback = `Not quite! The correct answer is "${current.options.find(o => o.id === current.correctId)?.text}".`;
      return { positive: false, text: specific ?? fallback };
    }
    return { positive: true, text: '' };
  }

  const feedback = phase === 'feedback' ? feedbackText() : null;

  return (
    <div className={styles.quiz}>
      
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.quizLabel}>Topic Quiz</span>
          <MasteryBadge level={mastery.level} showLabel size="sm" />
        </div>
        <span className={styles.counter}>
          {currentIdx + 1} / {questions.length}
        </span>
      </div>

      
      <div className={styles.dots}>
        {questions.map((_, i) => {
          const a = answers[i];
          const dotClass =
            a.status === 'correct'   ? styles.dotCorrect :
            a.status === 'incorrect' ? styles.dotWrong   :
            i === currentIdx          ? styles.dotActive  : styles.dotEmpty;
          return <span key={i} className={`${styles.dot} ${dotClass}`} />;
        })}
      </div>

      
      <div className={styles.questionCard}>
        <p className={styles.prompt}>{current.prompt}</p>

        <div className={styles.options}>
          {current.options.map((opt) => (
            <button
              key={opt.id}
              className={optionClass(opt.id)}
              onClick={() => handleSelect(opt.id)}
              disabled={phase !== 'answering'}
            >
              <span className={styles.optionLetter}>{opt.id.toUpperCase()}</span>
              <span className={styles.optionText}>{opt.text}</span>
              {phase === 'feedback' && opt.id === current.correctId && (
                <span className={styles.correctMark}>✓</span>
              )}
              {phase === 'feedback' && opt.id === chosen && chosen !== current.correctId && (
                <span className={styles.wrongMark}>✕</span>
              )}
            </button>
          ))}
        </div>

        
        {feedback && (
          <div className={`${styles.feedback} ${feedback.positive ? styles.feedbackPositive : styles.feedbackNegative}`}>
            <span className={styles.feedbackIcon}>{feedback.positive ? '🎉' : '💡'}</span>
            <p className={styles.feedbackText}>{feedback.text}</p>
          </div>
        )}
      </div>

      
      {phase === 'feedback' && (
        <button className={styles.nextBtn} onClick={handleNext}>
          {isLast ? 'See Results →' : 'Next Question →'}
        </button>
      )}
    </div>
  );
}


interface QuizSummaryProps {
  result: QuizResult;
  topicId: string;
  onRetake: () => void;
  onMarkComplete: () => void;
  canComplete: boolean;
}

export function QuizSummary({ result, topicId, onRetake, onMarkComplete, canComplete }: QuizSummaryProps) {
  const { getMastery } = useMastery();
  const mastery = getMastery(topicId);

  const getMessage = (): { headline: string; sub: string } => {
    if (result.passed && mastery.level === 'green') {
      return { headline: 'YAAAAY! ', sub: 'You\'ve fully mastered this topic. You can now mark it complete.' };
    }
    if (result.passed) {
      return { headline: 'Great work! ', sub: 'You passed. Keep practicing to reach full mastery and unlock completion.' };
    }
    return { headline: 'Not quite yet ', sub: 'You need 70% or higher to pass. Questions will focus on what you missed.' };
  };

  const { headline, sub } = getMessage();

  return (
    <div className={`${styles.summary} ${result.passed ? styles.summaryPassed : styles.summaryFailed}`}>
      <div className={styles.summaryScore}>
        <span className={styles.scoreNum}>{result.score}%</span>
        <span className={styles.scoreSub}>{result.correct}/{result.total} correct</span>
      </div>

      <div className={styles.summaryText}>
        <h3 className={styles.summaryHeadline}>{headline}</h3>
        <p className={styles.summarySub}>{sub}</p>
        <div className={styles.summaryMastery}>
          <span className={styles.summaryMasteryLabel}>Your mastery:</span>
          <MasteryBadge level={mastery.level} showLabel />
        </div>
      </div>

      <div className={styles.summaryActions}>
        <button className={styles.retakeBtn} onClick={onRetake}>
          ↺ Retake Quiz
        </button>
        {canComplete && (
          <button className={styles.completeBtn} onClick={onMarkComplete}>
            ✓ Mark Topic Complete
          </button>
        )}
      </div>
    </div>
  );
}