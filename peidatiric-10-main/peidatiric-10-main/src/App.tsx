import React, { useState, useMemo } from 'react';
import { LectureId, LectureTab } from './types';
import { BrandHeader } from './components/brand/BrandHeader';
import { BrandLogo } from './components/brand/BrandLogo';
import { Lec1Exam } from './components/lectures/Lec1Exam';
import { Lec2Intraoral } from './components/lectures/Lec2Intraoral';
import { Lec3Behavior } from './components/lectures/Lec3Behavior';
import { Lec7TraumaExamFractures } from './components/lectures/Lec7TraumaExamFractures';
import { Lec8VitalPulpImmature } from './components/lectures/Lec8VitalPulpImmature';
import { Lec9ReactionsToTrauma } from './components/lectures/Lec9ReactionsToTrauma';
import { Lec10LuxationAvulsion } from './components/lectures/Lec10LuxationAvulsion';
import { Lec11RootFracturesBurns } from './components/lectures/Lec11RootFracturesBurns';
import { LecSystemicSpecialNeeds } from './components/lectures/LecSystemicSpecialNeeds';
import { GrandRoundsQuiz } from './components/lectures/GrandRoundsQuiz';
import {
  BookOpen,
  Award,
  Sparkles,
  Layers,
  Activity,
  Heart,
  ShieldAlert,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<LectureId>('lec1');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const tabs: LectureTab[] = [
    {
      id: 'lec1',
      badge: 'Lec 1',
      title: 'Mouth & TMJ Exam',
      arabicTitle: 'فحص الفم والمفصل',
      iconName: 'Stethoscope',
      summary: 'History taking, parent reporting challenges, extraoral signs, TMJ opening (40-45mm), and lip competence.',
    },
    {
      id: 'lec2',
      badge: 'Lec 2',
      title: 'Intraoral & 3 C’s',
      arabicTitle: 'الأنسجة الرخوة والصلبة',
      iconName: 'Layers',
      summary: 'Soft tissue 3 C’s (Color, Contour, Consistency), high labial frenum, tongue-tie, and 6 treatment phases.',
    },
    {
      id: 'lec3',
      badge: 'Lec 3',
      title: 'Child Behavior & Triangle',
      arabicTitle: 'إدارة سلوك الأطفال',
      iconName: 'Users',
      summary: 'The Pedodontic Triangle, developmental milestones (2-5 yrs), Binet IQ, fears, clinic scheduling, and attire.',
    },
    {
      id: 'lec7',
      badge: 'Lec 7',
      title: 'Trauma 2: Exam & Reattachment',
      arabicTitle: 'إصابات الأسنان وإعادة اللصق',
      iconName: 'Wand2',
      summary: 'Methods of exam, tetanus protocol, crown craze vs fractures, and step-by-step fragment reattachment.',
    },
    {
      id: 'lec8',
      badge: 'Lec 8',
      title: 'Trauma 3: Vital Pulp & REPs',
      arabicTitle: 'اللب الحي وتجديد الأنسجة',
      iconName: 'Sparkles',
      summary: 'Cvek shallow pulpotomy, apexogenesis, blunderbuss canals, MTA apexification, and complete AAE REP protocol.',
    },
    {
      id: 'lec9',
      badge: 'Lec 9',
      title: 'Trauma 4: Reactions & Ellis-Davey',
      arabicTitle: 'استجابة السن وتصنيف إليس',
      iconName: 'Flame',
      summary: 'Hyperemia, internal hemorrhage, calcific metamorphosis, pink spot resorption, and Ellis & Davey classes I-IX.',
    },
    {
      id: 'lec10',
      badge: 'Lec 10',
      title: 'Trauma 5: Luxation & Avulsion',
      arabicTitle: 'انخلاع وانغراس الأسنان',
      iconName: 'ShieldAlert',
      summary: 'Intrusion, extrusion, lateral luxation, storage media rankings, flexible splinting, and avulsion flowchart.',
    },
    {
      id: 'lec11',
      badge: 'Lec 11',
      title: 'Trauma 6: Root Fractures & Burns',
      arabicTitle: 'كسور الجذور وحروق الفم',
      iconName: 'Activity',
      summary: 'Apical vs middle vs cervical third fractures, 4 healing types, rigid splinting, and electrical oral burns.',
    },
    {
      id: 'systemic',
      badge: 'Systemic',
      title: 'Special Needs & Systemic',
      arabicTitle: 'الأمراض الجهازية والاحتياجات',
      iconName: 'Heart',
      summary: 'IE antibiotic prophylaxis calculator, Hemophilia (no blocks!), Leukemia platelet rules, Epilepsy, and Diabetes.',
    },
    {
      id: 'quiz',
      badge: 'Grand Rounds',
      title: 'Clinical Case Simulator',
      arabicTitle: 'الحالات السريرية التفاعلية',
      iconName: 'Award',
      summary: 'Interactive clinical case scenarios testing emergency trauma diagnosis, drug dosing, and pediatric decisions.',
    },
  ];

  // Filtered tabs if search is active
  const filteredTabs = useMemo(() => {
    if (!searchQuery.trim()) return tabs;
    const q = searchQuery.toLowerCase();
    return tabs.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.summary.toLowerCase().includes(q) ||
        t.badge.toLowerCase().includes(q) ||
        t.arabicTitle.includes(q)
    );
  }, [searchQuery, tabs]);

  // Current tab index for prev/next buttons
  const currentIndex = tabs.findIndex((t) => t.id === activeTab);

  const handlePrevTab = () => {
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextTab = () => {
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-[#0B1F4D] flex flex-col font-montserrat">
      {/* Brand Header with Navigation and Search */}
      <BrandHeader
        tabs={tabs}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {/* If search query has results, show quick links */}
        {searchQuery.trim() && (
          <div className="mb-4 p-3 bg-white rounded-xl border border-[#C9A24B]/40 shadow-sm">
            <span className="text-xs font-bold text-gray-500 block mb-2">
              Found {filteredTabs.length} matching lectures:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {filteredTabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTab(t.id);
                    setSearchQuery('');
                  }}
                  className="px-3 py-1 bg-[#1B3A8C] text-white rounded-lg text-xs font-bold hover:bg-[#0B1F4D] transition-all flex items-center gap-1.5"
                >
                  <span>{t.badge}:</span>
                  <span>{t.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Lecture Tab Components */}
        {activeTab === 'lec1' && <Lec1Exam />}
        {activeTab === 'lec2' && <Lec2Intraoral />}
        {activeTab === 'lec3' && <Lec3Behavior />}
        {activeTab === 'lec7' && <Lec7TraumaExamFractures />}
        {activeTab === 'lec8' && <Lec8VitalPulpImmature />}
        {activeTab === 'lec9' && <Lec9ReactionsToTrauma />}
        {activeTab === 'lec10' && <Lec10LuxationAvulsion />}
        {activeTab === 'lec11' && <Lec11RootFracturesBurns />}
        {activeTab === 'systemic' && <LecSystemicSpecialNeeds />}
        {activeTab === 'quiz' && <GrandRoundsQuiz />}

        {/* Bottom Module Pagination */}
        <div className="mt-8 pt-4 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={handlePrevTab}
            disabled={currentIndex === 0}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
              currentIndex > 0
                ? 'bg-white text-[#1B3A8C] border border-gray-300 hover:bg-gray-50 shadow-sm'
                : 'opacity-40 bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> Previous Lecture
          </button>

          <span className="text-xs font-semibold text-gray-500 hidden sm:inline">
            Module {currentIndex + 1} of {tabs.length}
          </span>

          <button
            onClick={handleNextTab}
            disabled={currentIndex === tabs.length - 1}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
              currentIndex < tabs.length - 1
                ? 'bg-[#1B3A8C] text-white hover:bg-[#0B1F4D] shadow-sm'
                : 'opacity-40 bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Next Lecture <ChevronRight className="w-4 h-4 text-[#C9A24B]" />
          </button>
        </div>
      </main>

      {/* Brand Footer */}
      <footer className="bg-[#0B1F4D] text-white border-t border-[#C9A24B]/30 mt-12 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <BrandLogo size="md" theme="dark" showSubtitle={true} />

          <div className="text-center md:text-right text-xs text-gray-300 space-y-1">
            <p className="font-semibold text-white">
              Pedodontics &amp; Preventive Dentistry Department
            </p>
            <p>
              University of Baghdad • College of Dentistry (Fifth Year Curriculum)
            </p>
            <p className="text-[#C9A24B] font-medium text-[11px] pt-1">
              HEALTH • CONFIDENCE • BEAUTIFUL SMILES — PRECISION IN EVERY SMILE
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
