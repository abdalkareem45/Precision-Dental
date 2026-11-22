import React, { useEffect, useRef } from 'react';
import { X, RotateCcw, CheckCircle2, Circle, Award } from 'lucide-react';
import { LECTURES } from '../data/lectures';
import { useLabStore } from '../store/useLabStore';
import { LectureId } from '../types/lecture';
import { getLectureProgress, SANDBOX_KINDS } from '../store/progress';

interface ProgressDashboardProps {
  open: boolean;
  onClose: () => void;
  onJumpToLecture: (id: LectureId) => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  open,
  onClose,
  onJumpToLecture,
}) => {
  const completed3D = useLabStore((s) => s.completed3D);
  const completedSandboxes = useLabStore((s) => s.completedSandboxes);
  const visitedVisuals = useLabStore((s) => s.visitedVisuals);
  const quizScores = useLabStore((s) => s.quizScores);
  const resetAllProgress = useLabStore((s) => s.resetAllProgress);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    closeBtnRef.current?.focus();
    return () => {
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), [tabindex="0"]');
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && (document.activeElement === first || !dialogRef.current?.contains(document.activeElement))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (document.activeElement === last || !dialogRef.current?.contains(document.activeElement))) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const totalLectures = LECTURES.length;
  const total3D = LECTURES.filter((l) => completed3D[l.id]).length;
  const totalSandboxesPossible = totalLectures * SANDBOX_KINDS.length;
  const totalSandboxesDone = LECTURES.reduce((acc, l) => {
    return acc + getLectureProgress({ completed3D, completedSandboxes, visitedVisuals, quizScores }, l.id).sandboxCount;
  }, 0);
  const totalQuizzesTaken = LECTURES.filter((l) => Boolean(quizScores[l.id])).length;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="progress-dashboard-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-4xl max-h-[88vh] flex flex-col rounded-2xl border border-marble bg-ivory shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 bg-navy text-ivory border-b border-royal/40">
          <div>
            <h2 id="progress-dashboard-title" className="text-lg font-bold tracking-tight">
              Precision Dental · Virtual Lab Progress Summary
            </h2>
            <p className="text-xs text-ivory/75 mt-0.5">
              Self-paced browser-persisted tracking across 9 Crown &amp; Bridge modules (does not establish clinical competence)
            </p>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close progress overview"
            className="w-10 h-10 rounded-lg border border-ivory/20 flex items-center justify-center hover:bg-ivory/10 cursor-pointer focus-visible:outline-2 focus-visible:outline-gold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-6 py-4 bg-white border-b border-marble">
          <div className="p-3 rounded-xl border border-marble bg-ivory/60">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-navy/60">
              3D Sandboxes
            </div>
            <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-royal">
              {total3D}/{totalLectures}
            </div>
          </div>
          <div className="p-3 rounded-xl border border-marble bg-ivory/60">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-navy/60">
              2D Sandboxes
            </div>
            <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-royal">
              {totalSandboxesDone}/{totalSandboxesPossible}
            </div>
          </div>
          <div className="p-3 rounded-xl border border-marble bg-ivory/60">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-navy/60">
              Visual Libraries
            </div>
            <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-royal">
              {LECTURES.filter((l) => visitedVisuals[l.id]).length}/{totalLectures}
            </div>
          </div>
          <div className="p-3 rounded-xl border border-marble bg-ivory/60">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-navy/60">
              Quizzes Recorded
            </div>
            <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-royal">
              {totalQuizzesTaken}/{totalLectures}
            </div>
          </div>
        </div>

        {/* Per-lecture breakdown */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2.5">
          {LECTURES.map((lec) => {
            const d3 = Boolean(completed3D[lec.id]);
            const sbCount = getLectureProgress({ completed3D, completedSandboxes, visitedVisuals, quizScores }, lec.id).sandboxCount;
            const vis = Boolean(visitedVisuals[lec.id]);
            const q = quizScores[lec.id];

            return (
              <div
                key={lec.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-marble bg-white"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold text-royal">
                    <span>{lec.numberLabel}</span>
                    <span className="text-navy/30">·</span>
                    <span className="text-navy/70 font-sans font-medium truncate">
                      {lec.lecturer}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-navy mt-0.5 truncate">{lec.title}</div>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0 text-xs">
                  <span className="inline-flex items-center gap-1 font-medium text-navy">
                    {d3 ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-navy/30" aria-hidden="true" />
                    )}
                    3D
                  </span>
                  <span className="font-mono tabular-nums text-navy/80">
                    2D: {sbCount}/{SANDBOX_KINDS.length}
                  </span>
                  <span className="inline-flex items-center gap-1 font-medium text-navy">
                    {vis ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-navy/30" aria-hidden="true" />
                    )}
                    Visuals
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono tabular-nums font-semibold text-royal">
                    <Award className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
                    {q ? `${q.score}/${q.total}` : '—'}
                  </span>
                  <button
                    type="button"
                    aria-label={`Open ${lec.numberLabel}: ${lec.title}`}
                    onClick={() => {
                      onJumpToLecture(lec.id);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg border border-royal/30 text-royal hover:bg-royal hover:text-ivory font-semibold transition-colors cursor-pointer"
                  >
                    Open
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-3.5 border-t border-marble bg-white">
          <span className="text-xs text-navy/65">
            Stored locally in your browser under Precision Dental Lab preferences.
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={resetAllProgress}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-red-300 text-red-700 hover:bg-red-50 text-xs font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              Reset All Progress
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-navy text-ivory text-xs font-semibold hover:bg-royal cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
