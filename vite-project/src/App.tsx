import { useState, useCallback } from 'react';
import { ProgressProvider } from './context/ProgressContext';
import { MasteryProvider } from './context/MasteryContext';
import { Sidebar } from './components/Sidebar';
import { HomePage } from './components/Homepage';
import { TopicPage } from './components/Topicpage';
import { LessonQuizPage } from './components/Lessonquizpage';
import { COURSE } from './data/course';
import './index.css';

type View =
  | { type: 'home' }
  | { type: 'topic';       lessonId: string; topicId: string }
  | { type: 'lessonQuiz';  lessonId: string };

export default function App() {
  const [view, setView] = useState<View>({ type: 'home' });

  const handleSelectTopic = useCallback((lessonId: string, topicId: string) => {
    setView({ type: 'topic', lessonId, topicId });
  }, []);

  const handleSelectLessonQuiz = useCallback((lessonId: string) => {
    setView({ type: 'lessonQuiz', lessonId });
  }, []);

  const handleGoHome = useCallback(() => {
    setView({ type: 'home' });
  }, []);

  const handleNextLesson = useCallback((lessonId: string) => {
    const lesson = COURSE.find((l) => l.id === lessonId);
    if (lesson?.topics[0]) {
      setView({ type: 'topic', lessonId, topicId: lesson.topics[0].id });
    } else {
      setView({ type: 'home' });
    }
  }, []);

  const activeTopic      = view.type === 'topic'      ? view.topicId  : null;
  const activeLessonQuiz = view.type === 'lessonQuiz' ? view.lessonId : null;

  return (
    <ProgressProvider>
      <MasteryProvider>
        <div className="layout">
          <Sidebar
            activeTopic={activeTopic}
            activeLessonQuiz={activeLessonQuiz}
            onSelectTopic={handleSelectTopic}
            onSelectLessonQuiz={handleSelectLessonQuiz}
            onGoHome={handleGoHome}
          />

          {view.type === 'home' && (
            <HomePage
              onSelectTopic={handleSelectTopic}
              onSelectLessonQuiz={handleSelectLessonQuiz}
            />
          )}

          {view.type === 'topic' && (
            <TopicPage
              lessonId={view.lessonId}
              topicId={view.topicId}
              onBack={handleGoHome}
              onNavigate={handleSelectTopic}
            />
          )}

          {view.type === 'lessonQuiz' && (
            <LessonQuizPage
              lessonId={view.lessonId}
              onBack={handleGoHome}
              onNextLesson={handleNextLesson}
            />
          )}
        </div>
      </MasteryProvider>
    </ProgressProvider>
  );
}