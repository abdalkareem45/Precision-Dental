import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Compass,
  Sparkles,
  X,
} from 'lucide-react';
import { LECTURES } from '@/src/data/lectures';
import { calculateLectureCompletion, useLearningStore } from '@/src/store/useLearningStore';
import type { LectureData, LectureSectionKey } from '@/src/types/lecture';
import { InteractiveHero } from './InteractiveHero';
import { KnowledgeMap } from './KnowledgeMap';
import { VisualModulesSection } from './VisualModulesSection';
import { Lab3DSection } from './Lab3DSection';
import { Lab2DSection } from './Lab2DSection';
import { ClinicalCasesSection } from './ClinicalCasesSection';
import { HistopathologyLab } from './HistopathologyLab';
import { RevisionCenter } from './RevisionCenter';
import { AssessmentCenter } from './AssessmentCenter';

interface LectureWorkspaceProps {
  lecture: LectureData;
}

const SECTION_NAV: Array<{ key: LectureSectionKey; label: string; tourTip: string }> = [
  { key: 'hero', label: '1. Overview', tourTip: 'Review learning objectives and live physiological preview.' },
  { key: 'knowledge-map', label: '2. Knowledge Map', tourTip: 'Pan & zoom the interactive concept network to orient yourself.' },
  { key: 'visual-modules', label: '3. Visuals', tourTip: 'Step through interactive clinical timelines and flowcharts.' },
  { key: 'lab-3d', label: '4. 3D Lab (×3)', tourTip: 'Manipulate 3D anatomy, disease stages, and virtual exam tools.' },
  { key: 'lab-2d', label: '5. 2D Lab (×4)', tourTip: 'Test diagnostic decision trees, comparison boards, and symptom mapping.' },
  { key: 'clinical-cases', label: '6. Cases', tourTip: 'Solve virtual patient vignettes from history through treatment.' },
  { key: 'histopathology', label: '7. Histology & Imaging', tourTip: 'Inspect annotated microscopic and imaging landmarks.' },
  { key: 'revision', label: '9. Revision', tourTip: 'Drill flashcards, mnemonics, and clinical pearls.' },
  { key: 'assessment', label: '10. Assessment', tourTip: 'Complete all 5 interactive question types to test mastery.' },
];

export const LectureWorkspace: React.FC<LectureWorkspaceProps> = ({ lecture }) => {
  const {
    activeSection,
    progressByLecture,
    openLecture,
    goHome,
    setActiveSection,
    markSectionVisited,
    mark3DInteracted,
    mark2DInteracted,
    markCaseCompleted,
    recordAssessmentScore,
    setTutorOpen,
  } = useLearningStore();

  const [tourStepIdx, setTourStepIdx] = useState<number | null>(null);

  const record = progressByLecture[lecture.id];
  const completionPct = calculateLectureCompletion(record);

  const lectureIndex = LECTURES.findIndex((l) => l.id === lecture.id);
  const prevLecture = lectureIndex > 0 ? LECTURES[lectureIndex - 1] : null;
  const nextLecture = lectureIndex >= 0 && lectureIndex < LECTURES.length - 1 ? LECTURES[lectureIndex + 1] : null;

  const jumpToSection = (section: LectureSectionKey) => {
    setActiveSection(section);
    markSectionVisited(lecture.id, section);
    const el = document.getElementById(`section-${section}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Scroll to requested section when opening a lecture from search or hash
  useEffect(() => {
    setTourStepIdx(null);
    if (activeSection && activeSection !== 'hero') {
      const timer = window.setTimeout(() => {
        const el = document.getElementById(`section-${activeSection}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
      return () => window.clearTimeout(timer);
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [lecture.id]);

  // Track section visits on scroll via IntersectionObserver
  useEffect(() => {
    const ids: LectureSectionKey[] = SECTION_NAV.map((s) => s.key);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const key = entry.target.id.replace('section-', '') as LectureSectionKey;
            markSectionVisited(lecture.id, key);
          }
        }
      },
      { threshold: 0.2 }
    );

    for (const key of ids) {
      const el = document.getElementById(`section-${key}`);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [lecture.id, markSectionVisited]);

  const startTour = () => {
    setTourStepIdx(0);
    jumpToSection(SECTION_NAV[0].key);
  };

  const advanceTour = (delta: 1 | -1) => {
    if (tourStepIdx === null) return;
    const next = tourStepIdx + delta;
    if (next < 0 || next >= SECTION_NAV.length) {
      setTourStepIdx(null);
      return;
    }
    setTourStepIdx(next);
    jumpToSection(SECTION_NAV[next].key);
  };

  return (
    <div className="pb-20">
      {/* Sticky Lecture Section Sub-Navigation */}
      <div className="sticky top-16 z-30 border-b border-[#E6E8EC] dark:border-[#1F2937] bg-white/94 dark:bg-[#0B1220]/94 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-2 overflow-x-auto clinical-scroll">
          <button
            type="button"
            onClick={goHome}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#E6E8EC] dark:border-[#1F2937] text-xs font-semibold text-[#0B1F4D] dark:text-slate-200 hover:border-[#1B3A8C] shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Dashboard
          </button>

          <div className="flex items-center gap-1">
            {SECTION_NAV.map((sec) => {
              const visited = record?.visitedSections.includes(sec.key);
              const active = activeSection === sec.key;
              return (
                <button
                  key={sec.key}
                  type="button"
                  onClick={() => jumpToSection(sec.key)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#1B3A8C] text-white dark:bg-[#3B82F6]'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-[#FAF8F3] dark:hover:bg-[#1F2937]'
                  }`}
                >
                  {visited && !active && (
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  )}
                  <span>{sec.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Guided Interactive Tour Banner */}
        {tourStepIdx !== null && (
          <div className="border-t border-[#C9A24B]/40 bg-[#0B1F4D] text-white px-4 sm:px-6 py-2.5">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#E4C16E] shrink-0" />
                <span>
                  <strong className="text-[#E4C16E]">
                    Guided Tour ({tourStepIdx + 1}/{SECTION_NAV.length} — {SECTION_NAV[tourStepIdx].label}):
                  </strong>{' '}
                  {SECTION_NAV[tourStepIdx].tourTip}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  disabled={tourStepIdx === 0}
                  onClick={() => advanceTour(-1)}
                  className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 disabled:opacity-40 cursor-pointer"
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() => advanceTour(1)}
                  className="px-3 py-1 rounded bg-[#C9A24B] text-[#0B1F4D] font-bold cursor-pointer"
                >
                  {tourStepIdx === SECTION_NAV.length - 1 ? 'Finish Tour' : 'Next Step →'}
                </button>
                <button
                  type="button"
                  onClick={() => setTourStepIdx(null)}
                  aria-label="Close guided tour"
                  className="p-1 rounded hover:bg-white/15 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Lecture Stack (Sections 1-10) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-8">
        <InteractiveHero
          lecture={lecture}
          completionPct={completionPct}
          onJumpSection={jumpToSection}
          onStartTour={startTour}
          onAskTutor={() => setTutorOpen(true, lecture.title)}
        />

        <KnowledgeMap
          nodes={lecture.knowledgeMap}
          onNavigateSection={jumpToSection}
        />

        <VisualModulesSection modules={lecture.visualModules} />

        <Lab3DSection
          lectureId={lecture.id}
          sandboxes={lecture.sandboxes3D}
          completedIds={record?.completed3D || []}
          onMarkInteracted={mark3DInteracted}
        />

        <Lab2DSection
          lectureId={lecture.id}
          lab={lecture.sandboxes2D}
          completedKeys={record?.completed2D || []}
          onMarkInteracted={mark2DInteracted}
        />

        <ClinicalCasesSection
          lectureId={lecture.id}
          cases={lecture.clinicalCases}
          completedCaseIds={record?.completedCases || []}
          onMarkCaseCompleted={markCaseCompleted}
        />

        <HistopathologyLab slides={lecture.histopathSlides} />

        {/* Section 8 Inline Banner pointing to Persistent Floating AI Tutor */}
        <section
          aria-label="AI Clinical Tutor callout"
          className="rounded-2xl border border-[#C9A24B]/45 bg-gradient-to-r from-[#0B1F4D] to-[#1B3A8C] text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#E4C16E]">
              <Sparkles className="w-3.5 h-3.5" />
              Section 08 • AI Clinical Tutor
            </div>
            <h2 className="font-display text-lg sm:text-xl font-bold">
              Need an instant breakdown, extra flashcards, or a bedside mini-case for {lecture.shortTitle}?
            </h2>
            <p className="text-xs sm:text-sm text-slate-200">
              Launch the slide-over AI Clinical Tutor grounded in this lecture&apos;s exact objectives and clinical concepts.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setTutorOpen(true, lecture.title)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#C9A24B] hover:bg-[#B89038] text-[#0B1F4D] font-display font-bold text-sm shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            Launch AI Tutor
          </button>
        </section>

        <RevisionCenter lectureId={lecture.id} revision={lecture.revision} />

        <AssessmentCenter
          lectureId={lecture.id}
          assessments={lecture.assessments}
          savedScore={record?.assessmentScore ?? null}
          savedTotal={record?.assessmentTotal ?? null}
          onRecordScore={recordAssessmentScore}
        />

        {/* Prev / Next Lecture Navigation */}
        <nav
          aria-label="Lecture sequence navigation"
          className="rounded-2xl border border-[#E6E8EC] dark:border-[#1F2937] bg-white dark:bg-[#111827] p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3"
        >
          {prevLecture ? (
            <button
              type="button"
              onClick={() => openLecture(prevLecture.id)}
              className="flex items-center gap-3 p-3 rounded-xl border border-[#E6E8EC] dark:border-[#1F2937] hover:border-[#1B3A8C] text-left cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#1B3A8C] dark:text-[#3B82F6] shrink-0" />
              <div>
                <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  PREVIOUS LECTURE
                </div>
                <div className="text-sm font-bold text-[#0B1F4D] dark:text-white">
                  Lec {String(prevLecture.number).padStart(2, '0')}: {prevLecture.shortTitle}
                </div>
              </div>
            </button>
          ) : (
            <div />
          )}

          {nextLecture && (
            <button
              type="button"
              onClick={() => openLecture(nextLecture.id)}
              className="flex items-center justify-end gap-3 p-3 rounded-xl border border-[#E6E8EC] dark:border-[#1F2937] hover:border-[#1B3A8C] text-right cursor-pointer"
            >
              <div>
                <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  NEXT LECTURE
                </div>
                <div className="text-sm font-bold text-[#0B1F4D] dark:text-white">
                  Lec {String(nextLecture.number).padStart(2, '0')}: {nextLecture.shortTitle}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#1B3A8C] dark:text-[#3B82F6] shrink-0" />
            </button>
          )}
        </nav>
      </div>
    </div>
  );
};
