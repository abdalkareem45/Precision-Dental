import React, { useState, useRef, useEffect } from 'react';
import { useLearning } from '../../context/LearningContext';
import { MainNavTab, DiseaseId } from '../../types';
import { DISEASES_DATA } from '../../data/lectureData';
import {
  Activity,
  Layers,
  ChevronDown,
  Sparkles,
  Award,
  Clock,
  BookOpen,
  Stethoscope,
  Microscope,
  Pill,
  Disc,
  Brain,
  SplitSquareVertical,
  GraduationCap
} from 'lucide-react';

export const TopNavigation: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    activeDisease,
    setActiveDisease,
    progress,
    setIsAiModalOpen,
  } = useLearning();

  const [isDiseaseMenuOpen, setIsDiseaseMenuOpen] = useState(false);
  const [isSandboxMenuOpen, setIsSandboxMenuOpen] = useState(false);
  const [isStudyMenuOpen, setIsStudyMenuOpen] = useState(false);

  const diseaseMenuRef = useRef<HTMLDivElement>(null);
  const sandboxMenuRef = useRef<HTMLDivElement>(null);
  const studyMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (diseaseMenuRef.current && !diseaseMenuRef.current.contains(e.target as Node)) {
        setIsDiseaseMenuOpen(false);
      }
      if (sandboxMenuRef.current && !sandboxMenuRef.current.contains(e.target as Node)) {
        setIsSandboxMenuOpen(false);
      }
      if (studyMenuRef.current && !studyMenuRef.current.contains(e.target as Node)) {
        setIsStudyMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  const handleSelectDisease = (dId: DiseaseId) => {
    setActiveDisease(dId);
    setActiveTab('disease-module');
    setIsDiseaseMenuOpen(false);
  };

  const handleSelectTab = (tab: MainNavTab) => {
    setActiveTab(tab);
    setIsSandboxMenuOpen(false);
    setIsStudyMenuOpen(false);
  };

  const isSandboxActive = [
    'sandbox-oral-3d',
    'sandbox-diagnostic',
    'sandbox-treatment',
    'sandbox-histo',
    'sandbox-microbio',
  ].includes(activeTab);

  const isStudyActive = ['study-cards', 'study-quiz', 'study-feynman'].includes(activeTab);

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-lg">
      {/* Zone 1: Clean Brand Element */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab('overview')}
          className="flex items-center gap-2.5 text-left group transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
            <Activity className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <span className="text-sm font-bold text-white tracking-tight block">Oral Medicine 3D</span>
            <span className="text-[10px] text-slate-400 font-mono block">Lecture 2 · Vesiculobullous</span>
          </div>
        </button>
      </div>

      {/* Zone 2: Single-Line Primary Navigation (Unified Menu) */}
      <nav className="hidden lg:flex items-center gap-1.5 text-xs font-medium">
        {/* 1. Dashboard */}
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-slate-800 text-teal-400 font-semibold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          Dashboard & 3D Hub
        </button>

        {/* 2. Disease Modules Dropdown */}
        <div ref={diseaseMenuRef} className="relative">
          <button
            onClick={() => setIsDiseaseMenuOpen(!isDiseaseMenuOpen)}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'disease-module'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <span>Disease Modules</span>
            {activeTab === 'disease-module' && (
              <span className="text-teal-400 font-mono">({DISEASES_DATA[activeDisease].shortTitle})</span>
            )}
            <ChevronDown className="w-3.5 h-3.5 opacity-70" />
          </button>

          {isDiseaseMenuOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 animate-fade-in space-y-0.5">
              {(Object.keys(DISEASES_DATA) as DiseaseId[]).map((dId) => {
                const d = DISEASES_DATA[dId];
                const isSelected = activeTab === 'disease-module' && activeDisease === dId;
                const isCompleted = progress.completedModules[dId];
                return (
                  <button
                    key={dId}
                    onClick={() => handleSelectDisease(dId)}
                    className={`w-full p-2 rounded-lg text-left text-xs transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-teal-950 text-teal-300 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                      <span>{d.shortTitle}</span>
                    </div>
                    {isCompleted && (
                      <span className="text-[10px] text-emerald-400 font-mono">Mastered</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. Clinical Sandboxes Dropdown */}
        <div ref={sandboxMenuRef} className="relative">
          <button
            onClick={() => setIsSandboxMenuOpen(!isSandboxMenuOpen)}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              isSandboxActive
                ? 'bg-slate-800 text-teal-400 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Clinical Sandboxes (5)</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-70" />
          </button>

          {isSandboxMenuOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 animate-fade-in space-y-1">
              {[
                { tab: 'sandbox-oral-3d' as MainNavTab, label: '3D Cavity Disease Simulator', desc: 'Timeline progression & comparison', icon: Stethoscope },
                { tab: 'sandbox-diagnostic' as MainNavTab, label: 'Diagnostic Reasoning Lab', desc: '6 clinical patient cases', icon: Brain },
                { tab: 'sandbox-treatment' as MainNavTab, label: 'Rx & Pharmacology Simulator', desc: 'Dose calculator & interactions', icon: Pill },
                { tab: 'sandbox-histo' as MainNavTab, label: '3D Virtual Microscope', desc: '4x to 100x histopathology slides', icon: Microscope },
                { tab: 'sandbox-microbio' as MainNavTab, label: 'Microbiology Workbench', desc: 'Kirby-Bauer disc diffusion & PCR', icon: Disc },
              ].map((sb) => {
                const Icon = sb.icon;
                const isSelected = activeTab === sb.tab;
                return (
                  <button
                    key={sb.tab}
                    onClick={() => handleSelectTab(sb.tab)}
                    className={`w-full p-2.5 rounded-lg text-left transition-colors flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-teal-950 text-teal-300 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold">{sb.label}</div>
                      <div className="text-[11px] text-slate-400">{sb.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. Differential Matrix */}
        <button
          onClick={() => setActiveTab('study-matrix')}
          className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'study-matrix'
              ? 'bg-slate-800 text-teal-400 font-semibold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          <SplitSquareVertical className="w-3.5 h-3.5" />
          <span>Differential Matrix</span>
        </button>

        {/* 5. Study Suite Dropdown */}
        <div ref={studyMenuRef} className="relative">
          <button
            onClick={() => setIsStudyMenuOpen(!isStudyMenuOpen)}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              isStudyActive
                ? 'bg-slate-800 text-teal-400 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Study Suite</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-70" />
          </button>

          {isStudyMenuOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-60 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 animate-fade-in space-y-0.5">
              <button
                onClick={() => handleSelectTab('study-quiz')}
                className={`w-full p-2.5 rounded-lg text-left text-xs transition-colors flex items-center gap-2 ${
                  activeTab === 'study-quiz' ? 'bg-teal-950 text-teal-300 font-semibold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>Active Recall Quiz (15 Qs)</span>
              </button>
              <button
                onClick={() => handleSelectTab('study-cards')}
                className={`w-full p-2.5 rounded-lg text-left text-xs transition-colors flex items-center gap-2 ${
                  activeTab === 'study-cards' ? 'bg-teal-950 text-teal-300 font-semibold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4 text-teal-400" />
                <span>Flashcards (Leitner)</span>
              </button>
              <button
                onClick={() => handleSelectTab('study-feynman')}
                className={`w-full p-2.5 rounded-lg text-left text-xs transition-colors flex items-center gap-2 ${
                  activeTab === 'study-feynman' ? 'bg-teal-950 text-teal-300 font-semibold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Brain className="w-4 h-4 text-purple-400" />
                <span>Teach-Back (Feynman)</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Zone 3: Actions & Progress Badge */}
      <div className="flex items-center gap-2.5">
        {/* Unboxed Metadata (Time + Badges) */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-mono">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>{formatTime(progress.studyTimeSeconds)}</span>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>{progress.unlockedBadges.length} Badges</span>
        </div>

        {/* AI Study Mentor Action */}
        <button
          onClick={() => setIsAiModalOpen(true)}
          className="px-3 py-1.5 text-xs font-semibold text-teal-300 bg-teal-950/80 border border-teal-700/60 rounded-lg hover:bg-teal-900 transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span>AI Mentor</span>
        </button>

        {/* Mobile quick menu */}
        <div className="lg:hidden flex items-center gap-1">
          <button
            onClick={() => setActiveTab('overview')}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300"
          >
            Hub
          </button>
          <button
            onClick={() => setActiveTab('study-matrix')}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300"
          >
            Matrix
          </button>
        </div>
      </div>
    </header>
  );
};
