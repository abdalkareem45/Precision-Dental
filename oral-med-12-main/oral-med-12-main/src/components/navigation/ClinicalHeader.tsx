import React from 'react';
import { useLearning } from '../../context/LearningContext';
import { DISEASES_DATA } from '../../data/lectureData';
import {
  Menu,
  Sparkles,
  Award,
  Clock,
  ChevronRight,
  Stethoscope,
  Activity
} from 'lucide-react';
import { PrecisionDentalLogo } from '../brand/PrecisionDentalLogo';

interface ClinicalHeaderProps {
  onOpenSidebar: () => void;
}

export const ClinicalHeader: React.FC<ClinicalHeaderProps> = ({ onOpenSidebar }) => {
  const {
    activeTab,
    setActiveTab,
    activeDisease,
    progress,
    setIsAiModalOpen,
  } = useLearning();

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'lecture-1':
        return 'Oral Medicine Lecture 1 · Clinical Morphology, HSV & VZV';
      case 'overview':
        return 'Course Overview & 3D Anatomy Hub';
      case 'disease-module':
        return `Disease Module · ${DISEASES_DATA[activeDisease].title}`;
      case 'sandbox-oral-3d':
        return 'Clinical Lab 1 · 3D Oral Cavity Disease Simulator';
      case 'sandbox-diagnostic':
        return 'Clinical Lab 2 · Diagnostic Reasoning & Patient Cases';
      case 'sandbox-treatment':
        return 'Clinical Lab 3 · Treatment Planning & Rx Simulator';
      case 'sandbox-histo':
        return 'Clinical Lab 4 · 3D Virtual Microscope & Histopathology';
      case 'sandbox-microbio':
        return 'Clinical Lab 5 · Oral Microbiology & Antibiotic Sensitivity';
      case 'study-cards':
        return 'Assessment · Spaced Repetition Flashcards';
      case 'study-quiz':
        return 'Assessment · Active Recall Clinical Board Examination';
      case 'study-feynman':
        return 'Assessment · Feynman Teach-Back Pedagogical Studio';
      case 'study-matrix':
        return 'Clinical Reference · Differential Diagnosis Matrix';
      default:
        return 'Clinical Workstation';
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-brand-ivory/95 backdrop-blur-md border-b border-brand-marble px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="brand-focus p-2 rounded-xl bg-brand-navy border border-brand-blue text-white hover:bg-brand-blue lg:hidden transition-colors"
          title="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <PrecisionDentalLogo compact />
          <ChevronRight className="w-3.5 h-3.5 text-brand-gold hidden sm:inline" />
          <span className="font-sans font-bold text-brand-navy text-xs sm:text-sm truncate">
            {getBreadcrumbTitle()}
          </span>
        </div>
      </div>

      {/* Right: Quick Action Controls */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => setActiveTab('sandbox-diagnostic')}
          className="brand-blue-button brand-focus hidden sm:flex px-3 py-1.5 rounded-lg border border-brand-blue text-xs font-semibold items-center gap-1.5 transition-colors"
        >
          <Stethoscope className="w-3.5 h-3.5 text-brand-gold" />
          <span>Solve Patient Case</span>
        </button>

        <button
          onClick={() => setIsAiModalOpen(true)}
          className="brand-primary-button brand-focus px-2 sm:px-3.5 py-2 sm:py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
          title="Open AI Mentor"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">AI Mentor</span>
        </button>
      </div>
    </header>
  );
};
