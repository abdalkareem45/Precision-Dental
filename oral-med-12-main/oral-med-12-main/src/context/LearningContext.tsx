import React, { createContext, useContext, useState, useEffect } from 'react';
import { DiseaseId, MainNavTab, UserProgress } from '../types';

interface LearningContextType {
  activeTab: MainNavTab;
  setActiveTab: (tab: MainNavTab) => void;
  activeDisease: DiseaseId;
  setActiveDisease: (id: DiseaseId) => void;
  progress: UserProgress;
  markModuleComplete: (id: DiseaseId) => void;
  recordQuizScore: (quizKey: string, score: number) => void;
  updateFlashcardStatus: (cardId: string, status: 'new' | 'learning' | 'mastered') => void;
  completeClinicalCase: (caseId: string) => void;
  unlockBadge: (badgeId: string) => void;
  selectedImageModal: {
    isOpen: boolean;
    title: string;
    description: string;
    imageType: 'cmv' | 'coxsackie' | 'nug' | 'em' | 'sjs' | 'pcs';
    hotspots: { x: number; y: number; label: string; details: string }[];
  } | null;
  openImageModal: (payload: {
    title: string;
    description: string;
    imageType: 'cmv' | 'coxsackie' | 'nug' | 'em' | 'sjs' | 'pcs';
    hotspots: { x: number; y: number; label: string; details: string }[];
  }) => void;
  closeImageModal: () => void;
  isAiModalOpen: boolean;
  setIsAiModalOpen: (open: boolean) => void;
}

const defaultProgress: UserProgress = {
  completedModules: {
    cmv: false,
    coxsackie: false,
    nug: false,
    em: false,
    'sjs-ten': false,
    pcs: false,
    hsv: false,
    vzv: false,
  },
  quizScores: {},
  unlockedBadges: [],
  flashcardMastery: {},
  casesCompleted: [],
  studyTimeSeconds: 0
};

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export const LearningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<MainNavTab>('overview');
  const [activeDisease, setActiveDisease] = useState<DiseaseId>('cmv');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [selectedImageModal, setSelectedImageModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    imageType: 'cmv' | 'coxsackie' | 'nug' | 'em' | 'sjs' | 'pcs';
    hotspots: { x: number; y: number; label: string; details: string }[];
  } | null>(null);

  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem('oral_medicine_progress_lec2');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return defaultProgress;
  });

  useEffect(() => {
    try {
      localStorage.setItem('oral_medicine_progress_lec2', JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  // Study timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => ({
        ...prev,
        studyTimeSeconds: prev.studyTimeSeconds + 1
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const markModuleComplete = (id: DiseaseId) => {
    setProgress(prev => {
      const updated = {
        ...prev,
        completedModules: {
          ...prev.completedModules,
          [id]: true
        }
      };
      // Unlock badge for this disease
      const badgeId = `badge_${id}_complete`;
      if (!updated.unlockedBadges.includes(badgeId)) {
        updated.unlockedBadges = [...updated.unlockedBadges, badgeId];
      }
      return updated;
    });
  };

  const recordQuizScore = (quizKey: string, score: number) => {
    setProgress(prev => {
      const updated = {
        ...prev,
        quizScores: {
          ...prev.quizScores,
          [quizKey]: Math.max(prev.quizScores[quizKey] || 0, score)
        }
      };
      if (score >= 80 && !updated.unlockedBadges.includes('badge_quiz_ace')) {
        updated.unlockedBadges = [...updated.unlockedBadges, 'badge_quiz_ace'];
      }
      return updated;
    });
  };

  const updateFlashcardStatus = (cardId: string, status: 'new' | 'learning' | 'mastered') => {
    setProgress(prev => ({
      ...prev,
      flashcardMastery: {
        ...prev.flashcardMastery,
        [cardId]: status
      }
    }));
  };

  const completeClinicalCase = (caseId: string) => {
    setProgress(prev => {
      if (prev.casesCompleted.includes(caseId)) return prev;
      const updatedCases = [...prev.casesCompleted, caseId];
      const badges = [...prev.unlockedBadges];
      if (updatedCases.length >= 3 && !badges.includes('badge_diagnostician')) {
        badges.push('badge_diagnostician');
      }
      if (updatedCases.length >= 6 && !badges.includes('badge_master_clinician')) {
        badges.push('badge_master_clinician');
      }
      return {
        ...prev,
        casesCompleted: updatedCases,
        unlockedBadges: badges
      };
    });
  };

  const unlockBadge = (badgeId: string) => {
    setProgress(prev => {
      if (prev.unlockedBadges.includes(badgeId)) return prev;
      return {
        ...prev,
        unlockedBadges: [...prev.unlockedBadges, badgeId]
      };
    });
  };

  const openImageModal = (payload: {
    title: string;
    description: string;
    imageType: 'cmv' | 'coxsackie' | 'nug' | 'em' | 'sjs' | 'pcs';
    hotspots: { x: number; y: number; label: string; details: string }[];
  }) => {
    setSelectedImageModal({
      isOpen: true,
      ...payload
    });
  };

  const closeImageModal = () => {
    setSelectedImageModal(null);
  };

  return (
    <LearningContext.Provider
      value={{
        activeTab,
        setActiveTab,
        activeDisease,
        setActiveDisease,
        progress,
        markModuleComplete,
        recordQuizScore,
        updateFlashcardStatus,
        completeClinicalCase,
        unlockBadge,
        selectedImageModal,
        openImageModal,
        closeImageModal,
        isAiModalOpen,
        setIsAiModalOpen
      }}
    >
      {children}
    </LearningContext.Provider>
  );
};

export const useLearning = () => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
};
