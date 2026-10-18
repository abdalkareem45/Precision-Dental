import React, { useState, useEffect } from 'react';
import { LECTURES_DATA } from './data/lecturesData';
import { BrandHeader } from './components/BrandHeader';
import { SearchModal } from './components/SearchModal';
import { ClinicalPearlsModal } from './components/ClinicalPearlsModal';
import { LectureQuiz } from './components/LectureQuiz';

// 3D Visuals
import { HealthDimensions3D } from './components/visuals/3d/HealthDimensions3D';
import { SealantProcedure3D } from './components/visuals/3d/SealantProcedure3D';
import { MinimalInvasive3D } from './components/visuals/3d/MinimalInvasive3D';
import { BiofilmStephan3D } from './components/visuals/3d/BiofilmStephan3D';
import { SweetenersBiofilm3D } from './components/visuals/3d/SweetenersBiofilm3D';
import { FluorideCrystal3D } from './components/visuals/3d/FluorideCrystal3D';
import { Organogenesis3D } from './components/visuals/3d/Organogenesis3D';
import { PeriodontalPocket3D } from './components/visuals/3d/PeriodontalPocket3D';
import { DentalImplant3D } from './components/visuals/3d/DentalImplant3D';

// 2D Visuals
import { Lec1Visuals } from './components/visuals/2d/Lec1Visuals';
import { Lec2Visuals } from './components/visuals/2d/Lec2Visuals';
import { Lec3Visuals } from './components/visuals/2d/Lec3Visuals';
import { Lec4Visuals } from './components/visuals/2d/Lec4Visuals';
import { Lec5Visuals } from './components/visuals/2d/Lec5Visuals';
import { Lec6Visuals } from './components/visuals/2d/Lec6Visuals';
import { Lec7Visuals } from './components/visuals/2d/Lec7Visuals';
import { Lec8Visuals } from './components/visuals/2d/Lec8Visuals';
import { Lec9Visuals } from './components/visuals/2d/Lec9Visuals';

import { 
  Sparkles, 
  BookOpen, 
  Boxes, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight, 
  GraduationCap, 
  ShieldCheck, 
  AlertTriangle,
  FileText
} from 'lucide-react';

export default function App() {
  const [activeLectureId, setActiveLectureId] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'3d' | '2d' | 'notes' | 'quiz'>('3d');
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [pearlsModalOpen, setPearlsModalOpen] = useState<boolean>(false);

  const currentLecture = LECTURES_DATA[activeLectureId];

  // Scroll to top when changing lecture
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeLectureId]);

  const handlePrevLecture = () => {
    if (activeLectureId > 1) {
      setActiveLectureId(activeLectureId - 1);
    }
  };

  const handleNextLecture = () => {
    if (activeLectureId < 9) {
      setActiveLectureId(activeLectureId + 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-[#0B1F4D] flex flex-col font-sans selection:bg-[#C9A24B]/30 selection:text-[#0B1F4D]">
      {/* Precision Dental Brand Header */}
      <BrandHeader
        activeLectureId={activeLectureId}
        onSelectLecture={(id) => setActiveLectureId(id)}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenClinicalPearls={() => setPearlsModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Lecture Hero Banner */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-[#E6E8EC] shadow-sm relative overflow-hidden">
          {/* Subtle decorative gold ribbon background */}
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-gradient-to-br from-[#C9A24B]/15 to-transparent blur-2xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 relative z-10">
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#0B1F4D] text-[#C9A24B] shadow-xs">
                  LECTURE {currentLecture.meta.id} OF 9
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF8F3] text-[#1B3A8C] border border-[#E6E8EC]">
                  {currentLecture.meta.readTime}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {currentLecture.meta.professor}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#0B1F4D] tracking-tight leading-tight">
                {currentLecture.meta.title}
              </h1>

              <p className="text-base sm:text-lg font-arabic font-bold text-[#1B3A8C] leading-snug">
                {currentLecture.meta.arabicTitle}
              </p>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans pt-1">
                {currentLecture.meta.summary}
              </p>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2 self-start shrink-0 bg-[#FAF8F3] p-1.5 rounded-2xl border border-[#E6E8EC]">
              <button
                onClick={handlePrevLecture}
                disabled={activeLectureId === 1}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-[#0B1F4D] hover:bg-[#E6E8EC] disabled:opacity-40 transition-colors"
                title="Previous Lecture"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Lec {activeLectureId - 1}</span>
              </button>
              <span className="text-xs font-mono font-extrabold text-[#FAF8F3] bg-[#0B1F4D] px-3 py-1.5 rounded-xl shadow-2xs">
                {activeLectureId} / 9
              </span>
              <button
                onClick={handleNextLecture}
                disabled={activeLectureId === 9}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold bg-[#0B1F4D] text-[#FAF8F3] hover:bg-[#1B3A8C] disabled:opacity-40 transition-colors shadow-xs"
                title="Next Lecture"
              >
                <span className="hidden sm:inline">{activeLectureId < 9 ? `Lec ${activeLectureId + 1}` : 'Complete'}</span>
                <ChevronRight className="w-4 h-4 text-[#C9A24B]" />
              </button>
            </div>
          </div>

          {/* All 9 Lectures Quick Jump Strip directly in Hero on Mobile/Tablet */}
          <div className="mt-5 pt-4 border-t border-[#E6E8EC] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <span className="text-xs font-bold text-[#0B1F4D] flex items-center gap-1.5 shrink-0">
              <Sparkles className="w-4 h-4 text-[#C9A24B]" />
              Quick Lecture Jump (1 to 9):
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
                const isCurrent = num === activeLectureId;
                return (
                  <button
                    key={num}
                    onClick={() => setActiveLectureId(num)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 border ${
                      isCurrent
                        ? 'bg-[#0B1F4D] text-[#C9A24B] border-[#0B1F4D] ring-2 ring-[#C9A24B] shadow-xs'
                        : 'bg-[#FAF8F3] text-slate-700 hover:bg-[#E6E8EC] border-[#E6E8EC]'
                    }`}
                  >
                    <span>L{num}</span>
                    <span className="hidden lg:inline text-[10px] opacity-75 font-normal">
                      {num === 9 ? '(Implants)' : num === 2 ? '(Sealants)' : num === 4 ? '(Stephan)' : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Clinical Pearls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#E6E8EC]">
            {currentLecture.clinicalPearls.map((pearl, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-xs ${
                  pearl.significance === 'warning'
                    ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                    : pearl.significance === 'crucial'
                    ? 'bg-blue-50/80 border-blue-200 text-blue-950'
                    : 'bg-[#FAF8F3] border-[#E6E8EC] text-slate-800'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  {pearl.significance === 'warning' ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  ) : (
                    <ShieldCheck className="w-3.5 h-3.5 text-[#1B3A8C] shrink-0" />
                  )}
                  <span>{pearl.title}</span>
                </div>
                <p className="text-[11px] leading-relaxed opacity-90">{pearl.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Workspace Mode Tabs (3D Visuals / 2D Visuals / Detailed Notes / Knowledge Check) */}
        <div className="flex items-center justify-between border-b border-[#E6E8EC] pb-2">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('3d')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === '3d'
                  ? 'bg-[#0B1F4D] text-[#FAF8F3] shadow-xs'
                  : 'text-[#0B1F4D]/75 hover:bg-[#E6E8EC]/60 hover:text-[#0B1F4D]'
              }`}
            >
              <Boxes className={`w-4 h-4 ${activeTab === '3d' ? 'text-[#C9A24B]' : 'text-[#1B3A8C]'}`} />
              <span>3D Interactive Simulation</span>
            </button>

            <button
              onClick={() => setActiveTab('2d')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === '2d'
                  ? 'bg-[#0B1F4D] text-[#FAF8F3] shadow-xs'
                  : 'text-[#0B1F4D]/75 hover:bg-[#E6E8EC]/60 hover:text-[#0B1F4D]'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${activeTab === '2d' ? 'text-[#C9A24B]' : 'text-[#1B3A8C]'}`} />
              <span>2D Interactive Diagrams</span>
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'notes'
                  ? 'bg-[#0B1F4D] text-[#FAF8F3] shadow-xs'
                  : 'text-[#0B1F4D]/75 hover:bg-[#E6E8EC]/60 hover:text-[#0B1F4D]'
              }`}
            >
              <BookOpen className={`w-4 h-4 ${activeTab === 'notes' ? 'text-[#C9A24B]' : 'text-[#1B3A8C]'}`} />
              <span>Lecture Syllabus Notes</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'quiz'
                  ? 'bg-[#0B1F4D] text-[#FAF8F3] shadow-xs'
                  : 'text-[#0B1F4D]/75 hover:bg-[#E6E8EC]/60 hover:text-[#0B1F4D]'
              }`}
            >
              <HelpCircle className={`w-4 h-4 ${activeTab === 'quiz' ? 'text-[#C9A24B]' : 'text-[#1B3A8C]'}`} />
              <span>Knowledge Check</span>
            </button>
          </div>
        </div>

        {/* TAB 1: 3D INTERACTIVE SIMULATION */}
        {activeTab === '3d' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {activeLectureId === 1 && <HealthDimensions3D />}
            {activeLectureId === 2 && <SealantProcedure3D />}
            {activeLectureId === 3 && <MinimalInvasive3D />}
            {activeLectureId === 4 && <BiofilmStephan3D />}
            {activeLectureId === 5 && <SweetenersBiofilm3D />}
            {activeLectureId === 6 && <FluorideCrystal3D />}
            {activeLectureId === 7 && <Organogenesis3D />}
            {activeLectureId === 8 && <PeriodontalPocket3D />}
            {activeLectureId === 9 && <DentalImplant3D />}
          </div>
        )}

        {/* TAB 2: 2D INTERACTIVE DIAGRAMS & SIMULATORS */}
        {activeTab === '2d' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {activeLectureId === 1 && <Lec1Visuals />}
            {activeLectureId === 2 && <Lec2Visuals />}
            {activeLectureId === 3 && <Lec3Visuals />}
            {activeLectureId === 4 && <Lec4Visuals />}
            {activeLectureId === 5 && <Lec5Visuals />}
            {activeLectureId === 6 && <Lec6Visuals />}
            {activeLectureId === 7 && <Lec7Visuals />}
            {activeLectureId === 8 && <Lec8Visuals />}
            {activeLectureId === 9 && <Lec9Visuals />}
          </div>
        )}

        {/* TAB 3: COMPLETE LECTURE SYLLABUS NOTES */}
        {activeTab === 'notes' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E6E8EC] shadow-sm space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#E6E8EC]">
              <div>
                <span className="text-xs font-bold text-[#C9A24B] uppercase tracking-wider block">
                  Curriculum Transcript
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#0B1F4D]">
                  {currentLecture.meta.title}
                </h2>
                <p className="text-xs text-slate-500 font-sans mt-0.5">
                  Authorized Academic Text • {currentLecture.meta.professor} • College of Dentistry, University of Baghdad
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {currentLecture.detailedSections.map((sec, sIdx) => (
                <div key={sIdx} className="space-y-3">
                  <h3 className="font-extrabold text-sm sm:text-base text-[#0B1F4D] border-l-3 border-[#C9A24B] pl-3">
                    {sec.title}
                  </h3>
                  <div className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                    {sec.content.map((p, pIdx) => (
                      <p key={pIdx}>{p}</p>
                    ))}
                  </div>

                  {sec.subsections && sec.subsections.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {sec.subsections.map((sub, subIdx) => (
                        <div key={subIdx} className="p-4 rounded-xl bg-[#FAF8F3] border border-[#E6E8EC] space-y-2">
                          <h4 className="font-bold text-xs sm:text-sm text-[#1B3A8C]">{sub.title}</h4>
                          <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                            {sub.items.map((item, itemIdx) => (
                              <li key={itemIdx} className="leading-relaxed">{item}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: KNOWLEDGE CHECK QUIZ */}
        {activeTab === 'quiz' && (
          <div className="animate-in fade-in duration-200">
            <LectureQuiz
              lectureId={currentLecture.meta.id}
              lectureTitle={currentLecture.meta.title}
              questions={currentLecture.quiz}
            />
          </div>
        )}

        {/* Bottom Pagination Bar */}
        <div className="bg-white rounded-2xl p-4 border border-[#E6E8EC] flex items-center justify-between shadow-2xs">
          <button
            onClick={handlePrevLecture}
            disabled={activeLectureId === 1}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-[#0B1F4D] hover:bg-[#FAF8F3] disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous Lecture</span>
          </button>

          <div className="text-center">
            <span className="text-[11px] font-bold text-[#1B3A8C] uppercase tracking-wider block">
              Curriculum Navigation
            </span>
            <span className="text-xs font-bold text-[#0B1F4D]">
              Lecture {activeLectureId} of 9
            </span>
          </div>

          <button
            onClick={handleNextLecture}
            disabled={activeLectureId === 9}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#0B1F4D] text-[#FAF8F3] hover:bg-[#1B3A8C] disabled:opacity-40 transition-colors shadow-xs"
          >
            <span className="hidden sm:inline">Next Lecture</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Global Modals */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectLecture={(id) => setActiveLectureId(id)}
      />

      <ClinicalPearlsModal
        isOpen={pearlsModalOpen}
        onClose={() => setPearlsModalOpen(false)}
        onSelectLecture={(id) => setActiveLectureId(id)}
      />

      {/* Persistent Mobile & Tablet Bottom Lecture Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#0B1F4D]/95 backdrop-blur-md border-t border-[#C9A24B]/40 px-3 py-2 flex md:hidden items-center justify-between shadow-2xl">
        <button
          onClick={handlePrevLecture}
          disabled={activeLectureId === 1}
          className="p-1.5 rounded-lg bg-white/10 text-white disabled:opacity-30 shrink-0"
          title="Previous"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none px-1 py-0.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
            const isCurrent = num === activeLectureId;
            return (
              <button
                key={num}
                onClick={() => setActiveLectureId(num)}
                className={`flex items-center justify-center w-7 h-7 rounded-md font-bold text-xs transition-all shrink-0 ${
                  isCurrent
                    ? 'bg-[#C9A24B] text-[#0B1F4D] ring-2 ring-white shadow-xs font-extrabold'
                    : 'bg-white/15 text-white/90 hover:bg-white/25'
                }`}
              >
                {num}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNextLecture}
          disabled={activeLectureId === 9}
          className="p-1.5 rounded-lg bg-[#C9A24B] text-[#0B1F4D] disabled:opacity-30 disabled:bg-white/10 disabled:text-white shrink-0 font-bold"
          title="Next"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#E6E8EC] bg-white py-6 mt-12 mb-12 md:mb-0 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans">
            Precision Dental • دقة الأسنان — Advanced Dentistry for a Brighter Tomorrow
          </p>
          <p className="text-[11px] text-[#1B3A8C] font-semibold">
            Prof. Dr. Ban Sahib & Assist Prof Alhan Ahmed • College of Dentistry, University of Baghdad
          </p>
        </div>
      </footer>
    </div>
  );
}
