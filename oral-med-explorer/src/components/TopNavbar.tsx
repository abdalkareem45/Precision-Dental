import React, { useState } from 'react';
import { BookOpen, LayoutGrid, Menu, Moon, Sparkles, Sun, Timer, X } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useLearningStore } from '@/src/store/useLearningStore';
import { getLectureById } from '@/src/data/lectures';

interface TopNavbarProps {
  onNavigateHomeSection?: (anchorId: string) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onNavigateHomeSection }) => {
  const {
    theme,
    toggleTheme,
    activeLectureId,
    goHome,
    studySeconds,
    tutorOpen,
    setTutorOpen,
  } = useLearningStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeLecture = getLectureById(activeLectureId);
  const mins = Math.floor(studySeconds / 60);
  const secs = studySeconds % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const handleHomeNav = (anchorId?: string) => {
    setMobileMenuOpen(false);
    if (activeLectureId) {
      goHome();
      if (anchorId) {
        window.setTimeout(() => {
          document.getElementById(anchorId)?.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      }
    } else if (anchorId && onNavigateHomeSection) {
      onNavigateHomeSection(anchorId);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#E6E8EC] dark:border-[#1F2937] bg-[#FAF8F3]/92 dark:bg-[#0B1220]/92 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand / Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => handleHomeNav()}
            className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B3A8C] dark:focus-visible:ring-[#3B82F6] rounded-lg p-1 -ml-1 cursor-pointer"
            aria-label="Precision Dental Oral Medicine Explorer Home"
          >
            <BrandLogo compact />
          </button>
          {activeLecture && (
            <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-[#E6E8EC] dark:border-[#1F2937] min-w-0">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[#1B3A8C]/10 text-[#1B3A8C] dark:bg-[#3B82F6]/15 dark:text-[#93C5FD] shrink-0">
                LEC {String(activeLecture.number).padStart(2, '0')}
              </span>
              <span className="text-sm font-medium text-[#0B1F4D] dark:text-slate-200 truncate max-w-[260px]">
                {activeLecture.shortTitle}
              </span>
            </div>
          )}
        </div>

        {/* Zone 2: Concise single-line navigation */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
          <button
            type="button"
            onClick={() => handleHomeNav('hero-overview')}
            className="px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap text-[#0B1F4D]/80 hover:text-[#1B3A8C] hover:bg-[#E6E8EC]/60 dark:text-slate-300 dark:hover:text-white dark:hover:bg-[#1F2937] transition-colors cursor-pointer"
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => handleHomeNav('lecture-grid')}
            className="px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap text-[#0B1F4D]/80 hover:text-[#1B3A8C] hover:bg-[#E6E8EC]/60 dark:text-slate-300 dark:hover:text-white dark:hover:bg-[#1F2937] transition-colors cursor-pointer"
          >
            10 Lectures
          </button>
          <button
            type="button"
            onClick={() => handleHomeNav('progress-analytics')}
            className="px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap text-[#0B1F4D]/80 hover:text-[#1B3A8C] hover:bg-[#E6E8EC]/60 dark:text-slate-300 dark:hover:text-white dark:hover:bg-[#1F2937] transition-colors cursor-pointer"
          >
            Progress
          </button>
          <button
            type="button"
            onClick={() => setTutorOpen(!tutorOpen, activeLecture?.title || null)}
            className="px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap inline-flex items-center gap-1.5 text-[#1B3A8C] dark:text-[#14B8A6] hover:bg-[#1B3A8C]/10 dark:hover:bg-[#14B8A6]/15 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            AI Tutor
          </button>
        </nav>

        {/* Zone 3: Actions & Theme */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#E6E8EC] dark:border-[#1F2937] bg-white dark:bg-[#111827] text-xs font-mono tabular-nums text-[#0B1F4D]/80 dark:text-slate-300"
            title="Active study session timer"
          >
            <Timer className="w-3.5 h-3.5 text-[#C9A24B]" />
            <span>{formattedTime}</span>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light clinical theme' : 'Switch to dark explorer theme'}
            className="p-2 rounded-lg border border-[#E6E8EC] dark:border-[#1F2937] bg-white dark:bg-[#111827] text-[#0B1F4D] dark:text-slate-200 hover:border-[#C9A24B] transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[#C9A24B]" /> : <Moon className="w-4 h-4 text-[#1B3A8C]" />}
          </button>

          {activeLecture ? (
            <button
              type="button"
              onClick={() => handleHomeNav('lecture-grid')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap bg-[#0B1F4D] text-white hover:bg-[#1B3A8C] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] transition-colors cursor-pointer"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              All Lectures
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleHomeNav('lecture-grid')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap bg-[#1B3A8C] text-white hover:bg-[#0B1F4D] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Explore Curriculum
            </button>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            className="md:hidden p-2 rounded-lg border border-[#E6E8EC] dark:border-[#1F2937] bg-white dark:bg-[#111827] text-[#0B1F4D] dark:text-slate-200 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E6E8EC] dark:border-[#1F2937] bg-white dark:bg-[#111827] px-4 py-3 space-y-1">
          <button
            type="button"
            onClick={() => handleHomeNav('hero-overview')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[#0B1F4D] dark:text-slate-200 hover:bg-[#FAF8F3] dark:hover:bg-[#1F2937]"
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => handleHomeNav('lecture-grid')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[#0B1F4D] dark:text-slate-200 hover:bg-[#FAF8F3] dark:hover:bg-[#1F2937]"
          >
            All 10 Lectures
          </button>
          <button
            type="button"
            onClick={() => handleHomeNav('progress-analytics')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[#0B1F4D] dark:text-slate-200 hover:bg-[#FAF8F3] dark:hover:bg-[#1F2937]"
          >
            Progress Dashboard
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              setTutorOpen(true, activeLecture?.title || null);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-[#1B3A8C] dark:text-[#14B8A6] flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Open AI Clinical Tutor
          </button>
        </div>
      )}
    </header>
  );
};
