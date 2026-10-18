import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { LECTURES_DATA } from '../data/lecturesData';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  Menu, 
  X, 
  ChevronRight, 
  ChevronLeft,
  ShieldCheck, 
  Award,
  Layers,
  HelpCircle
} from 'lucide-react';

interface BrandHeaderProps {
  activeLectureId: number;
  onSelectLecture: (id: number) => void;
  onOpenSearch: () => void;
  onOpenClinicalPearls: () => void;
}

export const BrandHeader: React.FC<BrandHeaderProps> = ({
  activeLectureId,
  onSelectLecture,
  onOpenSearch,
  onOpenClinicalPearls,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeLecture = LECTURES_DATA[activeLectureId];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F3]/95 backdrop-blur-md border-b border-[#E6E8EC] shadow-xs">
      {/* Top Brand Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Names */}
          <div className="flex items-center gap-3 sm:gap-4 cursor-pointer" onClick={() => onSelectLecture(1)}>
            <BrandLogo size={54} />
            <div>
              <div className="flex items-baseline gap-2.5">
                <span className="font-extrabold text-xl sm:text-2xl tracking-wider text-[#0B1F4D] uppercase font-sans">
                  Precision <span className="text-[#C9A24B]">Dental</span>
                </span>
                <span className="font-arabic font-bold text-lg sm:text-xl text-[#0B1F4D]">
                  دِقَّةُ الأَسْنَانِ
                </span>
              </div>
              <p className="text-[10px] sm:text-xs tracking-widest text-[#1B3A8C] font-semibold uppercase hidden sm:block">
                Advanced Dentistry for a Brighter Tomorrow • Preventive 5th Class
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#E6E8EC]/60 hover:bg-[#E6E8EC] text-[#0B1F4D] text-xs font-medium transition-colors border border-transparent hover:border-[#C9A24B]/30"
              title="Search across all lectures"
            >
              <Search className="w-4 h-4 text-[#1B3A8C]" />
              <span className="hidden md:inline">Search Lectures...</span>
            </button>

            <button
              onClick={onOpenClinicalPearls}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B1F4D] text-[#FAF8F3] hover:bg-[#1B3A8C] text-xs font-semibold transition-colors shadow-xs"
              title="High Yield Clinical Pearls"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C9A24B]" />
              <span className="hidden sm:inline">Clinical Pearls</span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#0B1F4D] hover:bg-[#E6E8EC] lg:hidden"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Universal Navigation Bar for ALL Screen Sizes (Desktop, Tablet, Mobile) */}
      <nav className="border-t border-[#E6E8EC] bg-white shadow-2xs relative">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          {/* Top Row on Mobile/Tablet: Quick Jump Numbers 1 to 9 & Dropdown */}
          <div className="flex md:hidden items-center justify-between gap-1.5 py-2 px-1 border-b border-[#E6E8EC]/60">
            {/* Direct Numbered Buttons 1 to 9 */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
                const isActive = num === activeLectureId;
                return (
                  <button
                    key={num}
                    onClick={() => onSelectLecture(num)}
                    className={`flex items-center justify-center w-8 h-8 rounded-lg font-bold text-xs transition-all shrink-0 ${
                      isActive
                        ? 'bg-[#0B1F4D] text-[#C9A24B] ring-2 ring-[#C9A24B] shadow-xs scale-105'
                        : 'bg-[#FAF8F3] text-[#0B1F4D] hover:bg-[#E6E8EC] border border-[#E6E8EC]'
                    }`}
                    aria-label={`Go to Lecture ${num}`}
                  >
                    L{num}
                  </button>
                );
              })}
            </div>

            {/* Quick Dropdown Picker */}
            <div className="shrink-0 pl-1">
              <select
                value={activeLectureId}
                onChange={(e) => onSelectLecture(Number(e.target.value))}
                className="bg-[#FAF8F3] text-[#0B1F4D] text-xs font-bold py-1.5 px-2 rounded-lg border border-[#C9A24B]/40 focus:outline-hidden focus:ring-2 focus:ring-[#0B1F4D] max-w-[130px] truncate"
              >
                {Object.values(LECTURES_DATA).map((lec) => (
                  <option key={lec.meta.id} value={lec.meta.id}>
                    Lec {lec.meta.id}: {lec.meta.title.split(':')[0]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Full Tab Bar with Left/Right Scroll Chevrons for Smooth Access to Lec 9 */}
          <div className="relative flex items-center py-1.5">
            {/* Scroll Left Button */}
            <button
              onClick={() => {
                const el = document.getElementById('lecture-tabs-container');
                if (el) el.scrollBy({ left: -200, behavior: 'smooth' });
              }}
              className="p-1.5 rounded-lg text-slate-500 hover:text-[#0B1F4D] hover:bg-[#E6E8EC] shrink-0 hidden sm:flex items-center justify-center"
              title="Scroll tabs left"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Scrollable Tabs Container */}
            <div
              id="lecture-tabs-container"
              className="flex items-center gap-1.5 overflow-x-auto scroll-smooth scrollbar-thin py-1 px-1 flex-1"
            >
              {Object.values(LECTURES_DATA).map((lecture) => {
                const isActive = lecture.meta.id === activeLectureId;
                return (
                  <button
                    key={lecture.meta.id}
                    id={`lec-tab-${lecture.meta.id}`}
                    onClick={() => {
                      onSelectLecture(lecture.meta.id);
                      const tab = document.getElementById(`lec-tab-${lecture.meta.id}`);
                      tab?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                    }}
                    className={`group flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 border ${
                      isActive
                        ? 'bg-[#0B1F4D] text-[#FAF8F3] border-[#0B1F4D] shadow-sm ring-1 ring-[#C9A24B]/50'
                        : 'bg-[#FAF8F3]/80 text-[#0B1F4D]/80 hover:text-[#0B1F4D] hover:bg-white border-[#E6E8EC]'
                    }`}
                  >
                    <span
                      className={`flex items-center justify-center w-5 h-5 rounded-md text-[10px] font-extrabold transition-colors ${
                        isActive
                          ? 'bg-[#C9A24B] text-[#0B1F4D]'
                          : 'bg-[#E6E8EC] text-[#1B3A8C] group-hover:bg-[#C9A24B]/30'
                      }`}
                    >
                      {lecture.meta.id}
                    </span>
                    <span>
                      {lecture.meta.id === 1 && '1. Foundations & Levels'}
                      {lecture.meta.id === 2 && '2. Dental Sealants'}
                      {lecture.meta.id === 3 && '3. Minimal Intervention'}
                      {lecture.meta.id === 4 && '4. Diet & Stephan Curve'}
                      {lecture.meta.id === 5 && '5. Sweeteners & Foods'}
                      {lecture.meta.id === 6 && '6. Topical Fluorides'}
                      {lecture.meta.id === 7 && '7. Nutrition & Growth'}
                      {lecture.meta.id === 8 && '8. Perio & Cancer'}
                      {lecture.meta.id === 9 && '9. Peri-Implant Diseases'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Scroll Right Button */}
            <button
              onClick={() => {
                const el = document.getElementById('lecture-tabs-container');
                if (el) el.scrollBy({ left: 200, behavior: 'smooth' });
              }}
              className="p-1.5 rounded-lg text-slate-500 hover:text-[#0B1F4D] hover:bg-[#E6E8EC] shrink-0 hidden sm:flex items-center justify-center"
              title="Scroll tabs right to Lecture 9"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation Modal */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#0B1F4D]/70 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#FAF8F3] h-full shadow-2xl flex flex-col">
            <div className="p-4 border-b border-[#E6E8EC] flex items-center justify-between bg-white">
              <div className="flex items-center gap-2.5">
                <BrandLogo size={36} />
                <div>
                  <h3 className="font-bold text-sm text-[#0B1F4D]">PRECISION DENTAL</h3>
                  <p className="text-[10px] text-[#1B3A8C] font-arabic">منهج طب الأسنان الوقائي</p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-[#E6E8EC]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <p className="text-xs font-bold tracking-wider text-[#1B3A8C] uppercase mb-2">
                All 9 Course Lectures
              </p>
              {Object.values(LECTURES_DATA).map((lec) => {
                const isActive = lec.meta.id === activeLectureId;
                return (
                  <button
                    key={lec.meta.id}
                    onClick={() => {
                      onSelectLecture(lec.meta.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl flex items-start gap-3 transition-all ${
                      isActive
                        ? 'bg-[#0B1F4D] text-[#FAF8F3] ring-2 ring-[#C9A24B]'
                        : 'bg-white text-[#0B1F4D] hover:bg-[#E6E8EC]/60 border border-[#E6E8EC]'
                    }`}
                  >
                    <span
                      className={`flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold shrink-0 ${
                        isActive
                          ? 'bg-[#C9A24B] text-[#0B1F4D]'
                          : 'bg-[#E6E8EC] text-[#1B3A8C]'
                      }`}
                    >
                      {lec.meta.id}
                    </span>
                    <div className="min-w-0">
                      <p className="font-bold text-xs leading-snug truncate">{lec.meta.title}</p>
                      <p className={`text-[11px] font-arabic truncate mt-0.5 ${isActive ? 'text-[#FAF8F3]/80' : 'text-[#1B3A8C]'}`}>
                        {lec.meta.arabicTitle}
                      </p>
                      <p className={`text-[10px] mt-1 ${isActive ? 'text-[#C9A24B]' : 'text-slate-500'}`}>
                        {lec.meta.professor} • {lec.meta.readTime}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-4 border-t border-[#E6E8EC] bg-white flex items-center justify-between">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenClinicalPearls();
                }}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#1B3A8C]"
              >
                <Sparkles className="w-4 h-4 text-[#C9A24B]" />
                Clinical Pearls
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSearch();
                }}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#0B1F4D]"
              >
                <Search className="w-4 h-4 text-[#1B3A8C]" />
                Search
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

