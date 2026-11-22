import React, { useEffect, useState } from 'react';
import {
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  RotateCcw,
  GripVertical,
} from 'lucide-react';
import { LectureId, ProcedureFlowConfig, ProcedureStep } from '../../types/lecture';
import { useLabStore } from '../../store/useLabStore';

interface ProcedureFlowSandboxProps {
  lectureId: LectureId;
  config: ProcedureFlowConfig;
}

function deterministicScramble(steps: ProcedureStep[]): ProcedureStep[] {
  if (steps.length < 2) return steps;
  if (steps.length === 2) return [steps[1], steps[0]];
  const copy = [...steps];
  const rotated = [...copy.slice(2), copy[1], copy[0]];
  const alreadySorted = rotated.every((s, idx) => s.id === steps[idx].id);
  return alreadySorted ? [...copy].reverse() : rotated;
}

export const ProcedureFlowSandbox: React.FC<ProcedureFlowSandboxProps> = ({
  lectureId,
  config,
}) => {
  const markSandboxCompleted = useLabStore((s) => s.markSandboxCompleted);

  const [ordered, setOrdered] = useState<ProcedureStep[]>(() =>
    deterministicScramble(config.steps)
  );
  const [checked, setChecked] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  useEffect(() => {
    setOrdered(deterministicScramble(config.steps));
    setChecked(false);
    setShowHints(false);
    setDragIdx(null);
  }, [config]);

  const correctCount = ordered.reduce(
    (acc, step, idx) => acc + (step.id === config.steps[idx]?.id ? 1 : 0),
    0
  );
  const allCorrect = correctCount === config.steps.length;

  const moveStep = (from: number, to: number) => {
    if (to < 0 || to >= ordered.length || from === to) return;
    setOrdered((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setChecked(false);
  };

  const handleCheck = () => {
    setChecked(true);
    if (correctCount === config.steps.length) {
      markSandboxCompleted(`${lectureId}-flow`);
    }
  };

  const handleReset = () => {
    setOrdered(deterministicScramble(config.steps));
    setChecked(false);
    setShowHints(false);
  };

  return (
    <section
      aria-labelledby="proc-flow-heading"
      className="rounded-2xl border border-marble bg-white p-5 sm:p-6 shadow-sm space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-royal">
            2D Sandbox 01 · Procedure Sequencing
          </span>
          <h3 id="proc-flow-heading" className="text-lg font-bold text-navy mt-0.5">
            {config.title}
          </h3>
          <p className="text-sm text-navy/75 mt-1">{config.clinicalContext}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowHints((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-marble text-xs font-semibold text-navy hover:border-royal cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
            <span>{showHints ? 'Hide Hints' : 'Show Hints'}</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-marble text-xs font-semibold text-navy hover:border-royal cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Reorderable Step List */}
      <ol className="space-y-2.5">
        {ordered.map((step, idx) => {
          const isMatch = checked && step.id === config.steps[idx]?.id;
          const isMismatch = checked && !isMatch;
          return (
            <li
              key={step.id}
              draggable
              onDragStart={() => setDragIdx(idx)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragIdx !== null) moveStep(dragIdx, idx);
                setDragIdx(null);
              }}
              className={`flex items-start gap-3 rounded-xl border p-3.5 transition-colors ${
                isMatch
                  ? 'border-emerald-300 bg-emerald-50/70'
                  : isMismatch
                  ? 'border-red-300 bg-red-50/60'
                  : 'border-marble bg-ivory/60 hover:border-royal/40'
              }`}
            >
              <div className="flex items-center gap-2 pt-0.5 shrink-0">
                <GripVertical className="w-4 h-4 text-navy/35 hidden sm:block" aria-hidden="true" />
                <span className="w-6 h-6 rounded-md bg-navy text-ivory font-mono text-xs font-bold flex items-center justify-center tabular-nums">
                  {idx + 1}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-navy">{step.title}</span>
                  {isMatch && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" aria-label="Correct position" />
                  )}
                  {isMismatch && (
                    <AlertCircle className="w-4 h-4 text-red-700 shrink-0" aria-label="Incorrect position" />
                  )}
                </div>
                <p className="text-xs text-navy/75 mt-1 leading-relaxed">{step.detail}</p>
                {showHints && (
                  <p className="mt-1.5 text-xs font-medium text-royal">Hint: {step.hint}</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-1 shrink-0">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveStep(idx, idx - 1)}
                  aria-label={`Move "${step.title}" up`}
                  className="w-8 h-8 rounded-lg border border-marble bg-white flex items-center justify-center text-navy hover:border-royal disabled:opacity-35 cursor-pointer"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={idx === ordered.length - 1}
                  onClick={() => moveStep(idx, idx + 1)}
                  aria-label={`Move "${step.title}" down`}
                  className="w-8 h-8 rounded-lg border border-marble bg-white flex items-center justify-center text-navy hover:border-royal disabled:opacity-35 cursor-pointer"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-marble/70">
        <div aria-live="polite" className="text-xs font-semibold">
          {checked ? (
            allCorrect ? (
              <span className="text-emerald-800">
                Sequence Verified: {correctCount}/{config.steps.length} steps in optimal clinical order.
              </span>
            ) : (
              <span className="text-red-800">
                Score: {correctCount}/{config.steps.length} steps matched. Adjust highlighted steps and re-check.
              </span>
            )
          ) : (
            <span className="text-navy/65">
              Drag rows or use Up/Down buttons to arrange the clinical sequence.
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleCheck}
          className="px-4 py-2 rounded-lg bg-royal hover:bg-navy text-ivory text-xs font-semibold transition-colors cursor-pointer shrink-0"
        >
          Check Sequence
        </button>
      </div>
    </section>
  );
};
