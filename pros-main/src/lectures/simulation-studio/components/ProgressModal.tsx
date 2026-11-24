import { Award, RotateCcw, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { ACHIEVEMENT_BADGES, LECTURES } from '../data/lectures';
import { ProgressMap } from '../types/prosthodontics';

interface ProgressModalProps {
  open: boolean;
  progress: ProgressMap;
  onClose: () => void;

  onResetAll: () => void;
}

export function ProgressModal({
  open,
  progress,
  onClose,

  onResetAll,
}: ProgressModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    closeBtnRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const unlockedCount = ACHIEVEMENT_BADGES.filter((b) => b.isUnlocked(progress)).length;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0B1F4D]/75 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="progress-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white in-[.prostho-studio[data-theme=dark]]:bg-[#0B1F4D] border border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/60 rounded-xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/45 pb-4">
          <div>
            <h2 id="progress-modal-title" className="text-lg font-bold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3]">
              Prosthodontics Mastery & Achievement Badges
            </h2>
            <p className="text-xs text-[#0B1F4D]/70 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/75 mt-1 tabular-nums">
              {unlockedCount} of {ACHIEVEMENT_BADGES.length} badges unlocked · Progress saved locally in browser storage
            </p>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close progress dialog"
            className="p-2 rounded-lg text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3] hover:bg-[#FAF8F3] in-[.prostho-studio[data-theme=dark]]:hover:bg-[#1B3A8C]/40 cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Achievement Badges */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3]">
            Achievement Badges
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ACHIEVEMENT_BADGES.map((badge) => {
              const unlocked = badge.isUnlocked(progress);
              return (
                <div
                  key={badge.id}
                  className={`p-3.5 rounded-lg border flex items-start gap-3 ${
                    unlocked
                      ? 'bg-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:bg-[#1B3A8C] border-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:border-[#C9A24B] text-white'
                      : 'bg-[#FAF8F3] in-[.prostho-studio[data-theme=dark]]:bg-[#06112B] border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/45 text-[#0B1F4D]/75 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/80'
                  }`}
                >
                  <Award
                    className={`w-5 h-5 shrink-0 mt-0.5 ${
                      unlocked ? 'text-[#C9A24B]' : 'text-[#0B1F4D]/35 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/35'
                    }`}
                    aria-hidden="true"
                  />
                  <div>
                    <div className="text-xs font-bold">
                      {badge.title} {unlocked ? '· Unlocked' : '· Locked'}
                    </div>
                    <div className={`text-[11px] mt-0.5 ${unlocked ? 'text-[#E6E8EC]/85' : ''}`}>
                      {badge.criteria}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lecture-by-Lecture Completion Matrix */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3]">
            Lectures 4–10 Completion
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {LECTURES.map((lec) => {
              const lp = progress[lec.id];
              return (
                <div
                  key={lec.id}
                  className="p-3 rounded-lg bg-[#FAF8F3] in-[.prostho-studio[data-theme=dark]]:bg-[#06112B] border border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/45 text-left transition-colors"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3]">
                    <span>
                      Lecture {lec.number}: {lec.shortTitle}
                    </span>
                    <span className="font-mono text-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B] tabular-nums">
                      {lp?.quizBestScore !== null && lp?.quizBestScore !== undefined
                        ? `${lp.quizBestScore}%`
                        : '—'}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#0B1F4D]/70 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/70 mt-1 tabular-nums">
                    Sandboxes: {lp?.completedSandboxes.length ?? 0}/5 · Cases: {lp?.solvedCases.length ?? 0}/3
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/45">
          <button
            type="button"
            onClick={onResetAll}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#9B2C3B] in-[.prostho-studio[data-theme=dark]]:text-[#F48B96] border border-[#9B2C3B]/35 hover:bg-[#9B2C3B]/10 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset All Progress</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:bg-[#C9A24B] text-white in-[.prostho-studio[data-theme=dark]]:text-[#0B1F4D] hover:bg-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:hover:bg-[#E0BC64] cursor-pointer"
          >
            Continue Learning
          </button>
        </div>
      </div>
    </div>
  );
}
