import React, { useState } from 'react';
import { FLASHCARDS_DATA } from '../../data/flashcardsData';
import { useLearning } from '../../context/LearningContext';
import { DiseaseId } from '../../types';
import { RotateCw, Check, Brain, ChevronLeft, ChevronRight, Sparkles, Filter } from 'lucide-react';

export const FlashcardsViewer: React.FC = () => {
  const { progress, updateFlashcardStatus } = useLearning();
  const [selectedDisease, setSelectedDisease] = useState<DiseaseId | 'all'>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const filteredCards = selectedDisease === 'all'
    ? FLASHCARDS_DATA
    : FLASHCARDS_DATA.filter((c) => c.diseaseId === selectedDisease);

  const currentCard = filteredCards[currentIndex] || filteredCards[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const handleRate = (status: 'learning' | 'mastered') => {
    if (currentCard) {
      updateFlashcardStatus(currentCard.id, status);
    }
    handleNext();
  };

  const masteredCount = Object.values(progress.flashcardMastery).filter((s) => s === 'mastered').length;

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-teal-400 font-semibold mb-1">
            <span>Spaced Repetition Engine</span>
            <span>·</span>
            <span>Leitner System</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Active Recall Flashcards Deck</h1>
          <p className="text-xs text-slate-400 mt-1">
            Strengthen diagnostic recall, pharmacologic doses, and etiologies with active recall.
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="bg-slate-950 px-3.5 py-1.5 rounded-lg border border-slate-800 text-slate-300">
            <span>Mastered: </span>
            <span className="font-bold text-emerald-400">{masteredCount}</span>
            <span className="text-slate-500"> / {FLASHCARDS_DATA.length}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-slate-900/80 border border-slate-800 p-2 rounded-xl flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-slate-500 px-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>
        <button
          onClick={() => { setSelectedDisease('all'); setCurrentIndex(0); setIsFlipped(false); }}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            selectedDisease === 'all' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          All Cards ({FLASHCARDS_DATA.length})
        </button>
        {(['cmv', 'coxsackie', 'nug', 'em', 'sjs-ten', 'pcs'] as DiseaseId[]).map((dId) => (
          <button
            key={dId}
            onClick={() => { setSelectedDisease(dId); setCurrentIndex(0); setIsFlipped(false); }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              selectedDisease === dId ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            {dId.toUpperCase()}
          </button>
        ))}
      </div>

      {/* 3D Flashcard Mount */}
      <div className="flex flex-col items-center justify-center py-4">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="relative w-full max-w-2xl min-h-[300px] cursor-pointer perspective-1000 select-none group"
        >
          <div
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="w-full h-full min-h-[300px] relative rounded-2xl shadow-2xl"
          >
            {/* Front Side */}
            <div
              style={{ backfaceVisibility: 'hidden' }}
              className="absolute inset-0 bg-slate-900 border-2 border-slate-800 hover:border-teal-500/60 rounded-2xl p-8 flex flex-col justify-between shadow-xl transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-teal-400 font-semibold tracking-wider">
                  {currentCard.category} · {currentCard.diseaseId.toUpperCase()}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Card {currentIndex + 1} of {filteredCards.length}
                </span>
              </div>

              <div className="my-auto py-6">
                <p className="text-lg lg:text-xl font-medium text-slate-100 text-center leading-relaxed">
                  {currentCard.front}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-500 group-hover:text-teal-400 transition-colors">
                <RotateCw className="w-3.5 h-3.5" />
                <span>Click to Flip Card</span>
              </div>
            </div>

            {/* Back Side */}
            <div
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
              className="absolute inset-0 bg-slate-950 border-2 border-teal-800/80 rounded-2xl p-8 flex flex-col justify-between shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-emerald-400 font-semibold">
                  Definitive Answer
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Card {currentIndex + 1} of {filteredCards.length}
                </span>
              </div>

              <div className="my-auto py-4 space-y-4">
                <p className="text-base lg:text-lg text-slate-100 leading-relaxed font-medium">
                  {currentCard.back}
                </p>
                <div className="p-3 bg-teal-950/40 rounded-xl border border-teal-800/50 text-xs text-teal-200">
                  <span className="font-bold text-teal-300">Clinical Pearl: </span>
                  {currentCard.pearl}
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <RotateCw className="w-3.5 h-3.5" />
                <span>Click to Flip Back</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Carousel & Confidence Rating Controls */}
        <div className="w-full max-w-2xl mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleRate('learning')}
              className="px-4 py-2 bg-amber-950/60 border border-amber-700/60 hover:bg-amber-900/60 text-amber-200 rounded-lg text-xs font-semibold transition-colors"
            >
              Still Reviewing
            </button>
            <button
              onClick={() => handleRate('mastered')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md"
            >
              <Check className="w-4 h-4" />
              <span>Mark as Mastered</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
