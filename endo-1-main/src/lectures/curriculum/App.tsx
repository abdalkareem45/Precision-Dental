import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { BarChart3, Moon, Sun } from 'lucide-react';
import type { LectureId } from './types/lecture';
import { LECTURES } from './data/lectures';
import { LectureWorkspace } from './components/LectureWorkspace';
import { ProgressOverviewModal } from './components/ProgressOverviewModal';
import { loadProgress, loadTheme, saveProgress, saveTheme, updateProgress } from './progress';
import './curriculum.css';

export interface CurriculumAppProps {
  lectureId: LectureId;
}

export default function App({ lectureId }: CurriculumAppProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [progress, dispatch] = useReducer(updateProgress, undefined, () => loadProgress());
  const [theme, setTheme] = useState(loadTheme);
  const [progressOpen, setProgressOpen] = useState(false);
  const [resetVersion, setResetVersion] = useState(0);
  const closeProgress = useCallback(() => setProgressOpen(false), []);
  const lecture = LECTURES.find((item) => item.id === lectureId);

  useEffect(() => saveProgress(progress), [progress]);
  useEffect(() => saveTheme(theme), [theme]);
  useEffect(() => setProgressOpen(false), [lectureId]);

  return (
    <div ref={rootRef} className="endo-curriculum" data-endo-theme={theme}>
      <header className="endo-curriculum-toolbar" aria-label="Curriculum study tools">
        <nav aria-label="Within this lecture">
          {([['lab-3d', '3D Labs'], ['lab-2d', '2D Studios'], ['assessment', 'Cases & Quiz']] as const).map(([section, label]) => (
            <button key={section} type="button" onClick={() => {
              const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
              rootRef.current?.querySelector(`[data-curriculum-section="${section}"]`)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
            }}>{label}</button>
          ))}
        </nav>
        <div>
          <button type="button" aria-label={`Switch curriculum to ${theme === 'light' ? 'dark' : 'light'} theme`} aria-pressed={theme === 'dark'} onClick={() => setTheme((t) => t === 'light' ? 'dark' : 'light')}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />} Theme
          </button>
          <button type="button" onClick={() => setProgressOpen(true)}><BarChart3 size={16} /> Progress</button>
        </div>
      </header>
      <div className="endo-curriculum-workspace">
        {lecture ? <LectureWorkspace
          key={`${lecture.id}:${resetVersion}`}
          lecture={lecture}
          progress={progress[lecture.id]}
          onExplore3D={(id, sandboxId) => dispatch({ type: 'explore3d', lectureId: id, id: sandboxId })}
          onComplete2D={(id, sandboxId) => dispatch({ type: 'complete2d', lectureId: id, id: sandboxId })}
          onCompleteCase={(id, caseId) => dispatch({ type: 'completeCase', lectureId: id, id: caseId })}
          onCompleteQuiz={(id, score) => dispatch({ type: 'quiz', lectureId: id, score })}
        /> : <p role="alert">This curriculum lecture is not available.</p>}
      </div>
      <ProgressOverviewModal isOpen={progressOpen} onClose={closeProgress} progress={progress} onResetAll={() => {
        if (!window.confirm('Reset progress for all seven curriculum lectures? Older lectures are not affected.')) return;
        dispatch({ type: 'reset' });
        setResetVersion((v) => v + 1);
      }} />
    </div>
  );
}
