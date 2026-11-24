import { useCallback, useEffect, useReducer, useState } from 'react';
import { ChallengeQuizSection } from './components/ChallengeQuizSection';
import { ClinicalCasesSection } from './components/ClinicalCasesSection';
import { ConceptSection } from './components/ConceptSection';
import { HeroScene } from './components/HeroScene';
import { PrecisionLogo } from './components/PrecisionLogo';
import { ProgressModal } from './components/ProgressModal';
import { StoryboardBlueprintSection } from './components/StoryboardBlueprintSection';
import { ThreeDProsthoSandbox } from './components/ThreeDProsthoSandbox';
import { TopNav } from './components/TopNav';
import { TwoDSandboxes } from './components/TwoDSandboxes';
import { getLectureById } from './data/lectures';
import type { LectureId, SceneId } from './types/prosthodontics';
import { loadStoredProgress, loadStoredTheme, progressReducer, STORAGE_KEY, THEME_STORAGE_KEY } from './utils/progress';
import './index.css';

export interface SimulationStudioProps { lectureId: LectureId }

// Keying only the lecture view resets transient controls without losing course progress/theme.
export default function App({ lectureId }: SimulationStudioProps) {
  const [progress, dispatch] = useReducer(progressReducer, undefined, loadStoredProgress);
  const [isDark, setIsDark] = useState(loadStoredTheme);
  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch { /* Storage is optional. */ }
  }, [progress]);
  useEffect(() => {
    try { window.localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light'); } catch { /* Storage is optional. */ }
  }, [isDark]);
  return <LectureView key={lectureId} lectureId={lectureId} progress={progress} dispatch={dispatch}
    isDark={isDark} onToggleDark={() => setIsDark((value) => !value)} />;
}

function LectureView({ lectureId, progress, dispatch, isDark, onToggleDark }: SimulationStudioProps & {
  progress: import('./types/prosthodontics').ProgressMap;
  dispatch: React.Dispatch<import('./utils/progress').ProgressAction>;
  isDark: boolean;
  onToggleDark: () => void;
}) {
  const lecture = getLectureById(lectureId);
  const [activeScene, setActiveScene] = useState<SceneId>('scene-1');
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const handleSelectScene = useCallback((scene: SceneId) => {
    setActiveScene(scene);
    dispatch({ type: 'visit', lectureId, scene });
    document.getElementById('prostho-studio-' + scene)?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start',
    });
  }, [lectureId, dispatch]);
  const markSandboxCompleted = useCallback((sandboxId: string) => {
    dispatch({ type: 'sandbox', lectureId, sandboxId });
  }, [lectureId, dispatch]);
  const handleInteract3D = useCallback(() => markSandboxCompleted('sandbox-3d'), [markSandboxCompleted]);
  const handleSolveCase = useCallback((caseId: string) => dispatch({ type: 'case', lectureId, caseId }), [lectureId, dispatch]);
  const handleSubmitQuiz = useCallback((score: number) => dispatch({ type: 'quiz', lectureId, score }), [lectureId, dispatch]);
  const handleResetAllProgress = useCallback(() => dispatch({ type: 'reset' }), [dispatch]);
  const handleToggleDark = onToggleDark;
  const currentProgress = progress[lectureId];

  return (
    <div data-theme={isDark ? 'dark' : 'light'} className="prostho-studio min-h-screen flex flex-col bg-[#FAF8F3] data-[theme=dark]:bg-[#06112B] text-[#0B1F4D] data-[theme=dark]:text-[#FAF8F3] transition-colors">
      <TopNav
        activeScene={activeScene}
        isDark={isDark}
        onToggleDark={handleToggleDark}
        onSelectScene={handleSelectScene}
        onOpenProgress={() => setProgressModalOpen(true)}
      />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-14">
        {/* Scene 1: Overview & Learning Journey Map */}
        <div id="prostho-studio-scene-1">
          <HeroScene
            lecture={lecture}
            activeScene={activeScene}
            onSelectScene={handleSelectScene}
          />
        </div>

        {/* Scene 2: Concept Exploration */}
        <div id="prostho-studio-scene-2">
          <ConceptSection lecture={lecture} onSelectScene={handleSelectScene} />
        </div>

        {/* Scene 3: Lecture 3D & 2D Interactive Visuals */}
        <div id="prostho-studio-scene-3" className="space-y-8">
          <div>
            <div className="text-xs font-medium text-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B]">
              Scene 03 · Interactive 3D & 2D Simulation Studio
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3] mt-1">
              Lecture {lecture.number} 3D & 2D Interactive Visuals
            </h2>
          </div>

          <ThreeDProsthoSandbox
            lecture={lecture}
            isDark={isDark}
            onInteract={handleInteract3D}
          />

          <TwoDSandboxes
            lecture={lecture}
            completedSandboxes={currentProgress.completedSandboxes}
            onCompleteSandbox={markSandboxCompleted}
          />
        </div>

        {/* Scene 4: Tiered Clinical Cases (Beginner, Intermediate, Advanced) */}
        <div id="prostho-studio-scene-4">
          <ClinicalCasesSection
            lecture={lecture}
            solvedCases={currentProgress.solvedCases}
            onSolveCase={handleSolveCase}
          />
        </div>

        {/* Scene 5: Challenge Mode & Knowledge Assessment */}
        <div id="prostho-studio-scene-5">
          <ChallengeQuizSection
            lecture={lecture}
            bestScore={currentProgress.quizBestScore}
            onSubmitQuiz={handleSubmitQuiz}
          />
        </div>

        {/* Scene 6: Mastery Review & Complete Storyboard Blueprint */}
        <div id="prostho-studio-scene-6">
          <StoryboardBlueprintSection lecture={lecture} />
        </div>
      </div>

      <footer className="border-t border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/45 bg-white in-[.prostho-studio[data-theme=dark]]:bg-[#0B1F4D] mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <PrecisionLogo className="w-10 h-10 shrink-0" />
            <div>
              <div className="text-sm font-bold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3]">
                Precision Dental · Prosthodontics Interactive Platform
              </div>
              <div className="text-xs text-[#0B1F4D]/70 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/75">
                Advanced Dentistry For A Brighter Tomorrow · Lectures 4–10
              </div>
            </div>
          </div>

          <p className="text-xs text-[#0B1F4D]/70 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/75 max-w-xl leading-relaxed">
            Educational Use Disclaimer: All 3D models, 2D sandboxes, and clinical case simulations are illustrative dental education tools. They are not clinically validated medical devices, and quiz scores do not establish clinical competence or replace qualified faculty supervision.
          </p>
        </div>
      </footer>

      <ProgressModal
        open={progressModalOpen}
        progress={progress}
        onClose={() => setProgressModalOpen(false)}
        onResetAll={handleResetAllProgress}
      />
    </div>
  );
}
