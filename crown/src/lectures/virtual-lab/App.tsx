import React, { Suspense, lazy, startTransition, useMemo } from 'react';
import './index.css';
import { getLectureProgress } from './store/progress';
import { MotionConfig } from 'motion/react';
import {
  Box,
  SlidersHorizontal,
  LayoutGrid,
  ClipboardCheck,
  BookOpen,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { ProgressDashboard } from './components/ProgressDashboard';
import { ProcedureFlowSandbox } from './components/sandboxes/ProcedureFlowSandbox';
import { ClinicalCaseSandbox } from './components/sandboxes/ClinicalCaseSandbox';
import { MaterialComparisonSandbox } from './components/sandboxes/MaterialComparisonSandbox';
import { DiagnosticPlannerSandbox } from './components/sandboxes/DiagnosticPlannerSandbox';
import { VisualLearningGridSkeleton } from './components/visuals/VisualLearningGridSkeleton';
import { LectureQuizSkeleton } from './components/quiz/LectureQuizSkeleton';
import { LECTURES, getLectureById } from './data/lectures';
import { useLabStore } from './store/useLabStore';
import { LectureId, WorkspaceSection } from './types/lecture';

const Dental3DSandbox = lazy(() =>
  import('./components/three/Dental3DSandbox').then((m) => ({
    default: m.Dental3DSandbox,
  }))
);

const VisualLearningGrid = lazy(() =>
  import('./components/visuals/VisualLearningGrid').then((m) => ({
    default: m.VisualLearningGrid,
  }))
);

const LectureQuizModule = lazy(() =>
  import('./components/quiz/LectureQuizModule').then((m) => ({
    default: m.LectureQuizModule,
  }))
);

const SECTION_TABS: {
  id: WorkspaceSection;
  label: string;
  countLabel: string;
  Icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'lab3d', label: '3D Interactive Lab', countLabel: '1 Model', Icon: Box },
  { id: 'sandboxes', label: '2D Sandboxes', countLabel: '4 Labs', Icon: SlidersHorizontal },
  { id: 'visuals', label: 'Visual Library', countLabel: '10 Modules', Icon: LayoutGrid },
  { id: 'assessment', label: 'Quiz Assessment', countLabel: '4 Questions', Icon: ClipboardCheck },
];

export interface VirtualLabProps {
  lectureId: LectureId;
  onSelectLecture: (id: LectureId) => void;
}

export default function VirtualLab({ lectureId, onSelectLecture }: VirtualLabProps) {
  const activeSection = useLabStore((s) => s.activeSection);
  const showDashboard = useLabStore((s) => s.showDashboard);
  const completed3D = useLabStore((s) => s.completed3D);
  const completedSandboxes = useLabStore((s) => s.completedSandboxes);
  const quizScores = useLabStore((s) => s.quizScores);
  const visitedVisuals = useLabStore((s) => s.visitedVisuals);
  const setActiveSection = useLabStore((s) => s.setActiveSection);
  const setShowDashboard = useLabStore((s) => s.setShowDashboard);

  const lecture = getLectureById(lectureId);
  const currentIdx = LECTURES.findIndex((l) => l.id === lecture.id);

  const completedLecturesCount = useMemo(
    () =>
      LECTURES.filter((l) => {
        return getLectureProgress({ completed3D, completedSandboxes, visitedVisuals, quizScores }, l.id).complete;
      }).length,
    [completed3D, completedSandboxes, visitedVisuals, quizScores]
  );

  const handleSelectLecture = (id: LectureId) => {
    startTransition(() => {
      onSelectLecture(id);
    });
  };

  const handleSelectSection = (sec: WorkspaceSection) => {
    startTransition(() => {
      setActiveSection(sec);
    });
  };

  const handleStepLecture = (delta: number) => {
    const nextIdx = (currentIdx + delta + LECTURES.length) % LECTURES.length;
    handleSelectLecture(LECTURES[nextIdx].id);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="crown-virtual-lab min-h-screen flex flex-col bg-ivory text-navy">
        <div className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <div className="flex justify-end">
            <button type="button" onClick={() => setShowDashboard(true)}
              className="rounded-lg bg-royal px-4 py-2 text-sm font-semibold text-ivory focus-visible:outline-2 focus-visible:outline-gold">
              Open progress dashboard · {completedLecturesCount}/{LECTURES.length} lectures complete
            </button>
          </div>
          {/* Lecture Hero + Learning Objectives */}
          <section
            aria-labelledby="virtual-lab-lecture-title"
            className="rounded-2xl border border-marble bg-white p-5 sm:p-6 shadow-sm space-y-4"
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="space-y-1.5 max-w-4xl">
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-navy/70">
                  <span className="font-mono font-bold text-royal">{lecture.numberLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>Crown &amp; Bridge Prosthodontics</span>
                  <span aria-hidden="true">·</span>
                  <span>{lecture.lecturer}</span>
                </div>
                <h2
                  id="virtual-lab-lecture-title"
                  className="text-xl sm:text-2xl font-bold text-navy tracking-tight leading-snug"
                >
                  {lecture.title}
                </h2>
                <p className="text-sm text-navy/80 leading-relaxed">{lecture.summary}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-start">
                <button
                  type="button"
                  onClick={() => handleStepLecture(-1)}
                  aria-label="Previous lecture"
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-marble bg-ivory/70 text-xs font-semibold text-navy hover:border-royal cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                  <span>Prev</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleStepLecture(1)}
                  aria-label="Next lecture"
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-marble bg-ivory/70 text-xs font-semibold text-navy hover:border-royal cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Learning Objectives Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-marble/70">
              {lecture.objectives.map((obj, idx) => (
                <div
                  key={obj.id}
                  className="rounded-xl border border-marble bg-ivory/60 p-3 text-xs space-y-1"
                >
                  <div className="font-mono font-bold text-royal">
                    Objective {idx + 1} · {obj.bloomLevel}
                  </div>
                  <p className="text-navy/85 leading-relaxed">{obj.text}</p>
                </div>
              ))}
            </div>

            {/* Section Workspace Switcher */}
            <div
              role="tablist"
              aria-label="Lecture learning modules"
              className="grid grid-cols-2 lg:grid-cols-4 gap-2 pt-2"
            >
              {SECTION_TABS.map(({ id, label, countLabel, Icon }) => {
                const active = activeSection === id;
                return (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    id={`virtual-lab-tab-${id}`}
                    aria-selected={active}
                    aria-controls={`virtual-lab-panel-${id}`}
                    tabIndex={active ? 0 : -1}
                    onClick={() => handleSelectSection(id)}
                    onKeyDown={(event) => {
                      const current = SECTION_TABS.findIndex((tab) => tab.id === id);
                      const next = event.key === 'ArrowRight' ? (current + 1) % SECTION_TABS.length
                        : event.key === 'ArrowLeft' ? (current - 1 + SECTION_TABS.length) % SECTION_TABS.length
                        : event.key === 'Home' ? 0 : event.key === 'End' ? SECTION_TABS.length - 1 : -1;
                      if (next < 0) return;
                      event.preventDefault();
                      const nextId = SECTION_TABS[next].id;
                      handleSelectSection(nextId);
                      event.currentTarget.parentElement?.querySelector<HTMLButtonElement>(`#virtual-lab-tab-${nextId}`)?.focus();
                    }}
                    className={`flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                      active
                        ? 'border-royal bg-royal text-ivory shadow-sm'
                        : 'border-marble bg-ivory/70 text-navy hover:border-royal/50'
                    }`}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-gold' : 'text-royal'}`} />
                      <span className="text-xs font-bold truncate">{label}</span>
                    </span>
                    <span
                      className={`font-mono text-[11px] tabular-nums shrink-0 ${
                        active ? 'text-ivory/85' : 'text-navy/60'
                      }`}
                    >
                      {id === 'visuals' ? `${lecture.visualComponents.length} Modules` : id === 'assessment' ? `${lecture.quiz.length} Questions` : countLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Active Workspace Content */}
          <div role="tabpanel" id={`virtual-lab-panel-${activeSection}`}
            aria-labelledby={`virtual-lab-tab-${activeSection}`} tabIndex={0} className="space-y-6">
            {activeSection === 'lab3d' && (
              <Suspense
                fallback={
                  <div className="h-[520px] rounded-2xl border border-marble bg-white flex items-center justify-center text-sm font-semibold text-royal">
                    Loading 3D Dental Simulation Stage...
                  </div>
                }
              >
                <Dental3DSandbox key={lecture.id} lecture={lecture} />
              </Suspense>
            )}

            {activeSection === 'sandboxes' && (
              <div className="space-y-6">
                <ProcedureFlowSandbox
                  key={`${lecture.id}-flow`}
                  lectureId={lecture.id}
                  config={lecture.procedureFlow}
                />
                <ClinicalCaseSandbox
                  key={`${lecture.id}-case`}
                  lectureId={lecture.id}
                  config={lecture.clinicalCase}
                />
                <MaterialComparisonSandbox
                  key={`${lecture.id}-material`}
                  lectureId={lecture.id}
                  config={lecture.materialComparison}
                />
                <DiagnosticPlannerSandbox
                  key={`${lecture.id}-diag`}
                  lectureId={lecture.id}
                  config={lecture.diagnosticPlanner}
                />
              </div>
            )}

            {activeSection === 'visuals' && (
              <Suspense
                fallback={
                  <VisualLearningGridSkeleton cardCount={lecture.visualComponents.length || 6} />
                }
              >
                <VisualLearningGrid
                  key={`${lecture.id}-visuals`}
                  lectureId={lecture.id}
                  items={lecture.visualComponents}
                />
              </Suspense>
            )}

            {activeSection === 'assessment' && (
              <Suspense
                fallback={
                  <LectureQuizSkeleton questionCount={lecture.quiz.length || 4} />
                }
              >
                <LectureQuizModule
                  key={`${lecture.id}-quiz`}
                  lectureId={lecture.id}
                  questions={lecture.quiz}
                />
              </Suspense>
            )}
          </div>

          {/* References, Clinical Safeguards & Limitations Footer */}
          <footer className="rounded-2xl border border-marble bg-white p-5 sm:p-6 shadow-sm space-y-4 text-xs text-navy/80">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-navy">
                  <BookOpen className="w-4 h-4 text-royal" aria-hidden="true" />
                  <span>Lecture Source Material</span>
                </div>
                <a href={lecture.sourcePdf} target="_blank" rel="noopener noreferrer"
                  className="inline-block text-royal underline underline-offset-2">
                  Open source lecture PDF (new tab)
                </a>
                <ul className="space-y-1 pl-5 list-disc">
                  {lecture.referencesAndLimitations.sources.map((src, idx) => (
                    <li key={idx}>{src}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-navy">
                  <ShieldAlert className="w-4 h-4 text-gold" aria-hidden="true" />
                  <span>Clinical Review Flags &amp; Educational Scope</span>
                </div>
                <ul className="space-y-1 pl-5 list-disc">
                  {lecture.referencesAndLimitations.clinicalReviewFlags.map((flag, idx) => (
                    <li key={idx}>{flag}</li>
                  ))}
                  <li>
                    Precision Dental Simulation Lab is an educational visualization platform for dental students and does not substitute for supervised clinical judgment or patient-specific diagnostic records.
                  </li>
                </ul>
              </div>
            </div>
          </footer>
        </div>

        <ProgressDashboard
          open={showDashboard}
          onClose={() => setShowDashboard(false)}
          onJumpToLecture={handleSelectLecture}
        />
      </div>
    </MotionConfig>
  );
}
