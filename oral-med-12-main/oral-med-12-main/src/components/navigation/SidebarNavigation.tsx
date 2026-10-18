import React from 'react';
import { useLearning } from '../../context/LearningContext';
import { MainNavTab, DiseaseId } from '../../types';
import { DISEASES_DATA } from '../../data/lectureData';
import { PrecisionDentalLogo } from '../brand/PrecisionDentalLogo';
import {
  Activity,
  Layers,
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
  GraduationCap,
  X,
  CheckCircle2,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface SidebarNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ isOpen, onClose }) => {
  const {
    activeTab,
    setActiveTab,
    activeDisease,
    setActiveDisease,
    progress,
    setIsAiModalOpen,
  } = useLearning();

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  const handleSelectDisease = (dId: DiseaseId) => {
    setActiveDisease(dId);
    setActiveTab('disease-module');
    onClose();
  };

  const handleSelectTab = (tab: MainNavTab) => {
    setActiveTab(tab);
    onClose();
  };

  const completedModulesCount = Object.values(progress.completedModules).filter(Boolean).length;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden animate-fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-brand-blue/30 flex items-center justify-between bg-brand-navy">
          <button
            onClick={() => handleSelectTab('overview')}
            className="flex items-center gap-3 text-left group"
          >
            <PrecisionDentalLogo />
          </button>

          <button
            onClick={onClose}
            className="brand-focus p-1.5 rounded-lg bg-white/10 text-white/70 hover:text-white lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Navigation Menu */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Group 1: Core Navigation */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold px-3">
              Overview & Matrix
            </span>
            {/* Lecture 1 Premier Tab */}
            <button
              onClick={() => handleSelectTab('lecture-1')}
              className={`w-full px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                activeTab === 'lecture-1'
                  ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Lecture 1: Morphology & Viral</span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                Lec 1
              </span>
            </button>

            <button
              onClick={() => handleSelectTab('overview')}
              className={`w-full px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center gap-2.5 ${
                activeTab === 'overview'
                  ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Activity className="w-4 h-4 text-teal-400" />
              <span>Dashboard & 3D Hub (Lec 2)</span>
            </button>
            <button
              onClick={() => handleSelectTab('study-matrix')}
              className={`w-full px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center gap-2.5 ${
                activeTab === 'study-matrix'
                  ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <SplitSquareVertical className="w-4 h-4 text-teal-400" />
              <span>Differential Matrix</span>
            </button>
          </div>

          {/* Group 2: Disease Modules (6) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-3 mb-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold">
                Disease Modules (6)
              </span>
              <span className="text-[10px] font-mono text-teal-400 font-semibold">
                {completedModulesCount}/6
              </span>
            </div>

            {(Object.keys(DISEASES_DATA) as DiseaseId[]).map((dId) => {
              const d = DISEASES_DATA[dId];
              const isSelected = activeTab === 'disease-module' && activeDisease === dId;
              const isMastered = progress.completedModules[dId];

              return (
                <button
                  key={dId}
                  onClick={() => handleSelectDisease(dId)}
                  className={`w-full px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-900 text-white font-semibold border border-slate-700/80 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: d.color }}
                    />
                    <span className="truncate">{d.shortTitle}</span>
                  </div>
                  {isMastered ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 opacity-30 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Group 3: Clinical Labs & Sandboxes */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold px-3">
              Clinical Labs (5)
            </span>

            {[
              { tab: 'sandbox-oral-3d' as MainNavTab, label: '3D Cavity Simulator', icon: Stethoscope },
              { tab: 'sandbox-diagnostic' as MainNavTab, label: 'Diagnostic Lab', icon: Brain },
              { tab: 'sandbox-treatment' as MainNavTab, label: 'Rx & Pharmacology', icon: Pill },
              { tab: 'sandbox-histo' as MainNavTab, label: 'Virtual Microscope', icon: Microscope },
              { tab: 'sandbox-microbio' as MainNavTab, label: 'Microbiology Workbench', icon: Disc },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => handleSelectTab(item.tab)}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center gap-2.5 ${
                    isActive
                      ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 text-teal-400 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Group 4: Study & Assessment */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold px-3">
              Assessment Suite
            </span>

            {[
              { tab: 'study-quiz' as MainNavTab, label: 'Active Recall Quiz (15 Qs)', icon: Award },
              { tab: 'study-cards' as MainNavTab, label: 'Spaced Flashcards', icon: BookOpen },
              { tab: 'study-feynman' as MainNavTab, label: 'Teach-Back Studio', icon: GraduationCap },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => handleSelectTab(item.tab)}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center gap-2.5 ${
                    isActive
                      ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer Deck */}
        <div className="p-4 border-t border-brand-blue/30 bg-brand-navy space-y-3">
          {/* AI Study Mentor Button */}
          <button
            onClick={() => {
              setIsAiModalOpen(true);
              onClose();
            }}
            className="brand-primary-button brand-focus w-full py-2.5 px-3 border border-brand-gold/70 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md group"
          >
            <Sparkles className="w-4 h-4 text-brand-navy group-hover:scale-110 transition-transform" />
            <span>Precision AI Mentor</span>
          </button>

          {/* Study Metrics Readout */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1 pt-1">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{formatTime(progress.studyTimeSeconds)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>{progress.unlockedBadges.length} Badges</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
