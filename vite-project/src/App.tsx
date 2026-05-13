import { useState } from 'react';
import { ProgressProvider } from './context/ProgressContext';
import { Sidebar } from './components/Sidebar';
import { HomePage } from './components/Homepage';
import { TopicPage } from './components/Topicpage';
import './index.css';

type View =
  | { type: 'home' }
  | { type: 'topic'; lessonId: string; topicId: string };

export default function App() {
  const [view, setView] = useState<View>({ type: 'home' });

  function handleSelectTopic(lessonId: string, topicId: string) {
    setView({ type: 'topic', lessonId, topicId });
  }

  function handleGoHome() {
    setView({ type: 'home' });
  }

  const activeTopic = view.type === 'topic' ? view.topicId : null;

  return (
    <ProgressProvider>
      <div className="layout">
        <Sidebar
          activeTopic={activeTopic}
          onSelectTopic={handleSelectTopic}
          onGoHome={handleGoHome}
        />

        {view.type === 'home' && (
          <HomePage onSelectTopic={handleSelectTopic} />
        )}

        {view.type === 'topic' && (
          <TopicPage
            lessonId={view.lessonId}
            topicId={view.topicId}
            onBack={handleGoHome}
            onNavigate={handleSelectTopic}
          />
        )}
      </div>
    </ProgressProvider>
  );
}