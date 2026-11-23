import { useEffect, useId, useRef } from 'react';
import { X, RotateCcw, CheckCircle2 } from 'lucide-react';
import type { CourseProgressMap } from '../types/lecture';
import { LECTURES } from '../data/lectures';
import { LECTURE_CASES } from '../data/quizzesAndCases';
import { isLectureComplete } from '../progress';

interface ProgressOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: CourseProgressMap;
  onResetAll: () => void;
}

export function ProgressOverviewModal({ isOpen, onClose, progress, onResetAll }: ProgressOverviewModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => {
      dialog?.close();
      if (previous?.isConnected) previous.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;
  const total3d = LECTURES.reduce((n, l) => n + progress[l.id].explored3dIds.length, 0);
  const total2d = LECTURES.reduce((n, l) => n + progress[l.id].completed2dIds.length, 0);
  const totalCases = LECTURES.reduce((n, l) => n + progress[l.id].completedCaseIds.length, 0);
  const totalScore = LECTURES.reduce((n, l) => n + (progress[l.id].quizBestScore ?? 0), 0);
  const totalQuestions = LECTURES.reduce((n, l) => n + progress[l.id].quizTotalQuestions, 0);

  return (
    <dialog ref={dialogRef} aria-labelledby={titleId}
      className="endo-curriculum-dialog fixed inset-0 m-auto max-w-3xl rounded-2xl bg-[var(--pd-surface)] text-[var(--pd-text)] border border-[var(--pd-border)] p-0 shadow-xl overflow-y-auto"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
      }}>
      <div className="flex items-center justify-between gap-3 p-4 bg-[var(--pd-navy)] text-[#FAF8F3]">
        <div>
          <h2 id={titleId} className="text-lg font-bold">Curriculum Progress</h2>
          <p className="text-xs text-[#E6E8EC]">Saved on this device · Educational practice, not clinical certification</p>
        </div>
        <button type="button" autoFocus onClick={onClose} aria-label="Close progress dashboard" className="p-2 rounded-lg hover:bg-[#1B3A8C]"><X size={20} /></button>
      </div>
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono-tabular" aria-label="Curriculum totals">
          <div>3D Labs: <strong>{total3d}/21</strong></div>
          <div>2D Studios: <strong>{total2d}/14</strong></div>
          <div>Cases: <strong>{totalCases}/{LECTURES.reduce((n, l) => n + LECTURE_CASES[l.id].length, 0)}</strong></div>
          <div>Quiz Points: <strong>{totalScore}/{totalQuestions}</strong></div>
        </div>
        <ul className="space-y-2">
          {LECTURES.map((lecture) => {
            const p = progress[lecture.id];
            const complete = isLectureComplete(lecture.id, progress);
            return <li key={lecture.id} className="rounded-xl border border-[var(--pd-border)] bg-[var(--pd-surface-inset)] p-3">
              <div className="flex items-center gap-2 text-sm font-bold">
                {lecture.lectureNumberLabel}: {lecture.title}
                {complete && <CheckCircle2 size={16} className="shrink-0 text-emerald-500" aria-label="All activities complete with a full quiz score" />}
              </div>
              <div className="text-xs font-mono-tabular text-[var(--pd-text-muted)] mt-1">
                3D {p.explored3dIds.length}/3 · 2D {p.completed2dIds.length}/{lecture.sandboxes2d.length} · Cases {p.completedCaseIds.length}/{LECTURE_CASES[lecture.id].length} · Quiz {p.quizBestScore === null ? 'Not attempted' : `${p.quizBestScore}/${p.quizTotalQuestions}`}
              </div>
            </li>;
          })}
        </ul>
        <p className="text-xs text-[var(--pd-text-muted)]">Use the app’s lecture navigation to change lectures. Labs and studios count only after interaction; cases require the optimal decision. A completion check requires all activities and a full quiz score.</p>
        <button type="button" onClick={onResetAll} className="inline-flex items-center gap-2 rounded-lg border border-rose-400 p-2 text-xs font-semibold text-[var(--pd-text)]"><RotateCcw size={16} /> Reset Curriculum Progress</button>
      </div>
    </dialog>
  );
}
