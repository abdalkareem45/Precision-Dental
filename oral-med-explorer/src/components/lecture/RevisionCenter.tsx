import React, { useEffect, useState } from 'react';
import {
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  FlipHorizontal,
  Lightbulb,
  Shuffle,
  Sparkles,
  Square,
} from 'lucide-react';
import type { LectureData } from '@/src/types/lecture';

interface RevisionCenterProps {
  lectureId: string;
  revision: LectureData['revision'];
}

export const RevisionCenter: React.FC<RevisionCenterProps> = ({ lectureId, revision }) => {
  const [cards, setCards] = useState(revision.flashcards);
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setCards(revision.flashcards);
    setCardIdx(0);
    setFlipped(false);
    setCheckedItems({});
  }, [lectureId, revision.flashcards]);

  const currentCard = cards[cardIdx] || cards[0];

  const shuffleCards = () => {
    const copy = [...cards];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    setCards(copy);
    setCardIdx(0);
    setFlipped(false);
  };

  return (
    <section
      id="section-revision"
      aria-labelledby="revision-heading"
      className="rounded-2xl border border-[#E6E8EC] dark:border-[#1F2937] bg-white dark:bg-[#111827] p-5 sm:p-6 space-y-6"
    >
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-[#1B3A8C] dark:text-[#3B82F6]">
          Section 09 • Quick Revision Center
        </div>
        <h2 id="revision-heading" className="font-display text-xl sm:text-2xl font-bold text-[#0B1F4D] dark:text-white">
          High-Yield Flashcards, Mnemonics & Mastery Checklist
        </h2>
      </div>

      <div className="grid lg:grid-cols-12 gap-5 items-start">
        {/* Interactive Flip Flashcards */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Recall Flashcards ({cardIdx + 1} / {cards.length})
            </span>
            <button
              type="button"
              onClick={shuffleCards}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#E6E8EC] dark:border-[#1F2937] text-xs font-medium text-[#0B1F4D] dark:text-slate-200 hover:border-[#C9A24B] cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
              Shuffle
            </button>
          </div>

          {currentCard && (
            <button
              type="button"
              onClick={() => setFlipped((f) => !f)}
              aria-pressed={flipped}
              className="w-full min-h-[210px] rounded-2xl border-2 border-[#1B3A8C]/35 dark:border-[#3B82F6]/40 bg-gradient-to-br from-[#0B1F4D] to-[#1B3A8C] dark:from-[#0B1220] dark:to-[#1E3A8A] p-6 text-left text-white flex flex-col justify-between gap-4 shadow-md hover:border-[#C9A24B] transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-mono px-2.5 py-0.5 rounded bg-white/15 text-[#E4C16E]">
                  {currentCard.tag}
                </span>
                <span className="inline-flex items-center gap-1 font-mono text-slate-200">
                  <FlipHorizontal className="w-3.5 h-3.5" />
                  {flipped ? 'ANSWER' : 'PROMPT (Click to flip)'}
                </span>
              </div>
              <div className="text-base sm:text-lg font-display font-bold leading-snug">
                {flipped ? currentCard.back : currentCard.front}
              </div>
              <div className="text-[11px] text-slate-300 font-mono">
                {flipped ? 'Click to return to prompt' : 'Test recall before revealing answer'}
              </div>
            </button>
          )}

          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                setCardIdx((i) => (i - 1 + cards.length) % cards.length);
                setFlipped(false);
              }}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-[#E6E8EC] dark:border-[#1F2937] bg-[#FAF8F3] dark:bg-[#0B1220] text-xs font-semibold cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              type="button"
              onClick={() => {
                setCardIdx((i) => (i + 1) % cards.length);
                setFlipped(false);
              }}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-[#1B3A8C] dark:bg-[#3B82F6] text-white text-xs font-semibold cursor-pointer"
            >
              Next Card
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mnemonics & High-Yield Pearls */}
        <div className="lg:col-span-6 space-y-4">
          {revision.mnemonics.map((mn) => (
            <div
              key={mn.id}
              className="rounded-xl border border-[#C9A24B]/45 bg-[#FAF8F3] dark:bg-[#0B1220] p-4 space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-sm font-extrabold tracking-widest px-2.5 py-1 rounded-md bg-[#C9A24B] text-[#0B1F4D]">
                  {mn.acronym}
                </span>
                <span className="text-xs font-semibold text-[#0B1F4D] dark:text-white">
                  {mn.title}
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-1.5 text-xs">
                {mn.breakdown.map((row, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="font-mono font-bold text-[#1B3A8C] dark:text-[#38BDF8] shrink-0">
                      {row.letter}
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">{row.meaning}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="rounded-xl border border-[#E6E8EC] dark:border-[#1F2937] bg-[#FAF8F3] dark:bg-[#0B1220] p-4 space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-[#1B3A8C] dark:text-[#38BDF8]">
              <Lightbulb className="w-3.5 h-3.5 text-[#C9A24B]" />
              High-Yield Clinical Pearls
            </div>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              {revision.highYieldPearls.map((p, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A24B] shrink-0 mt-1" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Interactive Mastery Checklist */}
      <div className="rounded-xl border border-[#E6E8EC] dark:border-[#1F2937] bg-[#FAF8F3] dark:bg-[#0B1220] p-4 space-y-2.5">
        <div className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Self-Verification Checklist
        </div>
        <div className="grid sm:grid-cols-3 gap-2">
          {revision.summaryChecklist.map((item, idx) => {
            const checked = Boolean(checkedItems[idx]);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                className={`text-left p-3 rounded-lg border text-xs flex items-start gap-2 transition-colors cursor-pointer ${
                  checked
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-[#0B1F4D] dark:text-emerald-200'
                    : 'border-[#E6E8EC] dark:border-[#1F2937] bg-white dark:bg-[#111827] text-slate-700 dark:text-slate-300'
                }`}
              >
                {checked ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                )}
                <span>{item}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
