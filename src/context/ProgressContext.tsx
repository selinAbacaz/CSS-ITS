import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';

interface ProgressState {
  opened: Set<string>;
  completed: Set<string>;
}

interface ProgressContextValue {
  progress: ProgressState;
  markOpened: (id: string) => void;
  toggleCompleted: (id: string) => void;
  isOpened: (id: string) => boolean;
  isCompleted: (id: string) => boolean;
  completedCount: number;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

const STORAGE_KEY = 'learnCSS_progress';

function loadFromStorage(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { opened: new Set(), completed: new Set() };
    const parsed = JSON.parse(raw) as { opened?: string[]; completed?: string[] };
    return {
      opened: new Set(parsed.opened ?? []),
      completed: new Set(parsed.completed ?? []),
    };
  } catch {
    return { opened: new Set(), completed: new Set() };
  }
}

function saveToStorage(state: ProgressState) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        opened: [...state.opened],
        completed: [...state.completed],
      })
    );
  } catch {
    
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(loadFromStorage);

  useEffect(() => {
    saveToStorage(progress);
  }, [progress]);

  const markOpened = useCallback((id: string) => {
    setProgress((prev) => {
      if (prev.opened.has(id)) return prev;
      const next = { ...prev, opened: new Set(prev.opened).add(id) };
      return next;
    });
  }, []);

  const toggleCompleted = useCallback((id: string) => {
    setProgress((prev) => {
      const next = new Set(prev.completed);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { ...prev, completed: next };
    });
  }, []);

  const isOpened = useCallback((id: string) => progress.opened.has(id), [progress]);
  const isCompleted = useCallback((id: string) => progress.completed.has(id), [progress]);

  return (
    <ProgressContext.Provider
      value={{
        progress,
        markOpened,
        toggleCompleted,
        isOpened,
        isCompleted,
        completedCount: progress.completed.size,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}