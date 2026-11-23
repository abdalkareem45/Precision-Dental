import React, { Suspense, lazy, useState } from 'react';
import {
  Box,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  Layers,
  ShieldAlert,
} from 'lucide-react';
import type { LectureDefinition, LectureId, LectureProgress } from '../types/lecture';
import { Lecture2DSandboxes } from './sandboxes2d/Lecture2DSandboxes';
import { QuizAndCaseModule } from './sandboxes2d/QuizAndCaseModule';

const ApicalAnatomySandbox = lazy(() =>
  import('./sandboxes3d/WorkingLength3DSandboxes').then((m) => ({ default: m.ApicalAnatomySandbox }))
);
const ApexLocatorSandbox = lazy(() =>
  import('./sandboxes3d/WorkingLength3DSandboxes').then((m) => ({ default: m.ApexLocatorSandbox }))
);
const RadiographicRulerSandbox = lazy(() =>
  import('./sandboxes3d/WorkingLength3DSandboxes').then((m) => ({ default: m.RadiographicRulerSandbox }))
);

const BisectingParallelingSandbox = lazy(() =>
  import('./sandboxes3d/Radiography3DSandboxes').then((m) => ({ default: m.BisectingParallelingSandbox }))
);
const SlobRuleSandbox = lazy(() =>
  import('./sandboxes3d/Radiography3DSandboxes').then((m) => ({ default: m.SlobRuleSandbox }))
);
const CbctScannerSandbox = lazy(() =>
  import('./sandboxes3d/Radiography3DSandboxes').then((m) => ({ default: m.CbctScannerSandbox }))
);

const HandFileCrossSectionSandbox = lazy(() =>
  import('./sandboxes3d/InstrumentsI3DSandboxes').then((m) => ({ default: m.HandFileCrossSectionSandbox }))
);
const TipRakeHelixSandbox = lazy(() =>
  import('./sandboxes3d/InstrumentsI3DSandboxes').then((m) => ({ default: m.TipRakeHelixSandbox }))
);
const IsoTaperCoronalSandbox = lazy(() =>
  import('./sandboxes3d/InstrumentsI3DSandboxes').then((m) => ({ default: m.IsoTaperCoronalSandbox }))
);

const RotarySystemsSandbox = lazy(() =>
  import('./sandboxes3d/InstrumentsII3DSandboxes').then((m) => ({ default: m.RotarySystemsSandbox }))
);
const SafLatticeSandbox = lazy(() =>
  import('./sandboxes3d/InstrumentsII3DSandboxes').then((m) => ({ default: m.SafLatticeSandbox }))
);
const UltrasonicWaveSandbox = lazy(() =>
  import('./sandboxes3d/InstrumentsII3DSandboxes').then((m) => ({ default: m.UltrasonicWaveSandbox }))
);

const SealerInterfaceSandbox = lazy(() =>
  import('./sandboxes3d/FillingMaterials3DSandboxes').then((m) => ({ default: m.SealerInterfaceSandbox }))
);
const SealerPlacementSandbox = lazy(() =>
  import('./sandboxes3d/FillingMaterials3DSandboxes').then((m) => ({ default: m.SealerPlacementSandbox }))
);
const GpPhaseLabSandbox = lazy(() =>
  import('./sandboxes3d/FillingMaterials3DSandboxes').then((m) => ({ default: m.GpPhaseLabSandbox }))
);

const ContinuousWaveSandbox = lazy(() =>
  import('./sandboxes3d/Obturation3DSandboxes').then((m) => ({ default: m.ContinuousWaveSandbox }))
);
const ThermoplasticCarrierSandbox = lazy(() =>
  import('./sandboxes3d/Obturation3DSandboxes').then((m) => ({ default: m.ThermoplasticCarrierSandbox }))
);
const ApicalBarrierSandbox = lazy(() =>
  import('./sandboxes3d/Obturation3DSandboxes').then((m) => ({ default: m.ApicalBarrierSandbox }))
);

const InflammationCascadeSandbox = lazy(() =>
  import('./sandboxes3d/Emergencies3DSandboxes').then((m) => ({ default: m.InflammationCascadeSandbox }))
);
const CrackedToothSandbox = lazy(() =>
  import('./sandboxes3d/Emergencies3DSandboxes').then((m) => ({ default: m.CrackedToothSandbox }))
);
const NaoclOverextensionSandbox = lazy(() =>
  import('./sandboxes3d/Emergencies3DSandboxes').then((m) => ({ default: m.NaoclOverextensionSandbox }))
);

interface LectureWorkspaceProps {
  lecture: LectureDefinition;
  progress: LectureProgress;
  onExplore3D: (lectureId: LectureId, sandboxId: string) => void;
  onComplete2D: (lectureId: LectureId, sandboxId: string) => void;
  onCompleteCase: (lectureId: LectureId, caseId: string) => void;
  onCompleteQuiz: (lectureId: LectureId, score: number, total: number) => void;
}

export const LectureWorkspace: React.FC<LectureWorkspaceProps> = ({
  lecture,
  progress,
  onExplore3D,
  onComplete2D,
  onCompleteCase,
  onCompleteQuiz,
}) => {
  const [active3DIndex, setActive3DIndex] = useState<0 | 1 | 2>(0);
  const [showObjectives, setShowObjectives] = useState(false);

  const activeSandbox = lecture.sandboxes3d[active3DIndex];

  const renderActive3DSandbox = () => {
    const mark = () => onExplore3D(lecture.id, activeSandbox.id);
    let node: React.ReactNode;
    switch (lecture.id) {
      case 'lecture-3':
        if (active3DIndex === 0) node = <ApicalAnatomySandbox onInteract={mark} />;
        else if (active3DIndex === 1) node = <ApexLocatorSandbox onInteract={mark} />;
        else node = <RadiographicRulerSandbox onInteract={mark} />;
        break;
      case 'lecture-4':
        if (active3DIndex === 0) node = <BisectingParallelingSandbox onInteract={mark} />;
        else if (active3DIndex === 1) node = <SlobRuleSandbox onInteract={mark} />;
        else node = <CbctScannerSandbox onInteract={mark} />;
        break;
      case 'lecture-4b':
        if (active3DIndex === 0) node = <HandFileCrossSectionSandbox onInteract={mark} />;
        else if (active3DIndex === 1) node = <TipRakeHelixSandbox onInteract={mark} />;
        else node = <IsoTaperCoronalSandbox onInteract={mark} />;
        break;
      case 'lecture-5':
        if (active3DIndex === 0) node = <RotarySystemsSandbox onInteract={mark} />;
        else if (active3DIndex === 1) node = <SafLatticeSandbox onInteract={mark} />;
        else node = <UltrasonicWaveSandbox onInteract={mark} />;
        break;
      case 'lecture-7':
        if (active3DIndex === 0) node = <SealerInterfaceSandbox onInteract={mark} />;
        else if (active3DIndex === 1) node = <SealerPlacementSandbox onInteract={mark} />;
        else node = <GpPhaseLabSandbox onInteract={mark} />;
        break;
      case 'lecture-8':
        if (active3DIndex === 0) node = <ContinuousWaveSandbox onInteract={mark} />;
        else if (active3DIndex === 1) node = <ThermoplasticCarrierSandbox onInteract={mark} />;
        else node = <ApicalBarrierSandbox onInteract={mark} />;
        break;
      case 'lecture-9':
        if (active3DIndex === 0) node = <InflammationCascadeSandbox onInteract={mark} />;
        else if (active3DIndex === 1) node = <CrackedToothSandbox onInteract={mark} />;
        else node = <NaoclOverextensionSandbox onInteract={mark} />;
        break;
    }

    return (
      <Suspense
        fallback={
          <div className="w-full h-[460px] sm:h-[520px] lg:h-[560px] rounded-2xl bg-[var(--pd-navy)] border border-[var(--pd-gold)]/30 flex items-center justify-center text-sm font-medium text-[#FAF8F3]">
            Loading 3D Endodontic Simulation...
          </div>
        }
      >
        {node}
      </Suspense>
    );
  };

  const explored3dCount = progress.explored3dIds.length;
  const completed2dCount = progress.completed2dIds.length;

  return (
    <div className="space-y-8">
      {/* Compact Lecture Header Strip */}
      <section className="rounded-2xl bg-[var(--pd-surface)] border border-[var(--pd-border)] p-5 sm:p-6 transition-colors duration-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">


          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="rounded-xl bg-[var(--pd-surface-inset)] border border-[var(--pd-border)] px-3.5 py-2 text-xs font-mono-tabular">
              <div className="text-[var(--pd-text-muted)]">Module Progress</div>
              <div className="font-bold text-[var(--pd-text)]">
                3D: {explored3dCount}/3 · 2D: {completed2dCount}/{lecture.sandboxes2d.length} · Cases: {progress.completedCaseIds.length}/1
                {progress.quizBestScore !== null && ` · Quiz: ${progress.quizBestScore}/${progress.quizTotalQuestions}`}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowObjectives((s) => !s)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[var(--pd-surface-inset)] border border-[var(--pd-border)] text-xs font-semibold text-[var(--pd-text)] hover:border-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:hover:border-[var(--pd-gold)] transition-colors whitespace-nowrap shrink-0"
              aria-expanded={showObjectives}
            >
              <span>Learning Objectives</span>
              {showObjectives ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <a
              href={lecture.sourcePdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#1B3A8C] text-xs font-semibold text-white border border-transparent [.endo-curriculum[data-endo-theme=dark]_&]:border-[var(--pd-gold)]/45 hover:bg-[#0B1F4D] [.endo-curriculum[data-endo-theme=dark]_&]:hover:border-[var(--pd-gold)] transition-colors whitespace-nowrap shrink-0"
            >
              <FileText className="w-4 h-4 text-[var(--pd-gold)]" />
              <span>Source PDF</span>
            </a>
          </div>
        </div>

        {showObjectives && (
          <div className="mt-4 pt-4 border-t border-[var(--pd-border)] grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[var(--pd-text)]/90">
            {lecture.objectives.map((obj, idx) => (
              <div key={obj} className="flex items-start gap-2">
                <span className="font-mono-tabular font-bold text-[var(--pd-gold)]">0{idx + 1}.</span>
                <span className="leading-relaxed">{obj}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 70% PRIMARY 3D INTERACTIVE LAB STAGE */}
      <section data-curriculum-section="lab-3d" className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:text-[var(--pd-gold)]">
              <Box className="w-4 h-4 text-[var(--pd-gold)]" />
              <span>3D Interactive Simulation Stage (3 Sandboxes)</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--pd-text)] mt-0.5">
              Explore {lecture.lectureNumberLabel} in Real-Time 3D
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {lecture.sandboxes3d.map((sb, idx) => {
              const i = idx as 0 | 1 | 2;
              const isActive = active3DIndex === i;
              const explored = progress.explored3dIds.includes(sb.id);
              return (
                <button
                  key={sb.id}
                  type="button"
                  onClick={() => {
                    setActive3DIndex(i);

                  }}
                  className={`px-3 py-2 rounded-xl border text-left transition-colors ${
                    isActive
                      ? 'bg-[var(--pd-navy)] border-[var(--pd-navy)] text-white [.endo-curriculum[data-endo-theme=dark]_&]:bg-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:border-[var(--pd-gold)]'
                      : 'bg-[var(--pd-surface)] border-[var(--pd-border)] text-[var(--pd-text)] hover:border-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:hover:border-[var(--pd-gold)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-[11px] font-mono-tabular">
                    <span className={isActive ? 'text-[var(--pd-gold)]' : 'text-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:text-[var(--pd-gold)]'}>
                      3D Lab 0{idx + 1}
                    </span>
                    {explored && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 [.endo-curriculum[data-endo-theme=dark]_&]:text-emerald-400 shrink-0" />}
                  </div>
                  <div className="text-xs font-semibold max-w-[210px] mt-0.5">
                    {sb.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {renderActive3DSandbox()}
      </section>

      {/* 20% SUPPORTING 2D INTERACTIVE STUDIOS */}
      <section data-curriculum-section="lab-2d" className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#1B3A8C] [.endo-curriculum[data-endo-theme=dark]_&]:text-[var(--pd-gold)]">
          <Layers className="w-4 h-4 text-[var(--pd-gold)]" />
          <span>2D Interactive Diagrams, Workflows & Clinical Matrices</span>
        </div>
        <Lecture2DSandboxes
          key={`2d-${lecture.id}`}
          lectureId={lecture.id}
          completedIds={progress.completed2dIds}
          onComplete={(id) => onComplete2D(lecture.id, id)}
        />
      </section>

      {/* CLINICAL CASE & EMBEDDED KNOWLEDGE QUIZ */}
      <section data-curriculum-section="assessment" className="space-y-3">
        <QuizAndCaseModule
          key={`quiz-${lecture.id}`}
          lectureId={lecture.id}
          bestScore={progress.quizBestScore}
          completedCaseIds={progress.completedCaseIds}
          onQuizComplete={(score, total) => onCompleteQuiz(lecture.id, score, total)}
          onCaseComplete={(caseId) => onCompleteCase(lecture.id, caseId)}
        />
      </section>

      {/* 10% CONCISE SUMMARY, REFERENCES & CLINICAL DISCLAIMER */}
      <section className="rounded-2xl bg-[var(--pd-surface)] border border-[var(--pd-border)] p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 transition-colors duration-200">
        <div className="lg:col-span-2 space-y-2">
          <h3 className="text-sm font-bold text-[var(--pd-text)]">Key Clinical Takeaways</h3>
          <ul className="space-y-1.5 text-xs text-[var(--pd-text)]/90">
            {lecture.keyTakeaways.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-[var(--pd-gold)] font-bold">·</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
          <div className="pt-2 text-[11px] text-[var(--pd-text-muted)]">
            <strong>Source Material:</strong> {lecture.references.join(' · ')}
          </div>
        </div>

        <div className="rounded-xl bg-[var(--pd-surface-inset)] border border-[var(--pd-border)] p-4 text-xs text-[var(--pd-text)]/85 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-[var(--pd-text)]">
            <ShieldAlert className="w-4 h-4 text-[var(--pd-gold)]" />
            <span>Educational Use Disclaimer</span>
          </div>
          <p className="leading-relaxed text-[11px]">
            These 3D models and 2D workflows are illustrative educational simulations derived from the uploaded undergraduate Endodontics lectures. They are not clinically validated diagnostic tools and do not replace qualified clinical supervision or patient-specific examination.
          </p>
        </div>
      </section>
    </div>
  );
};
