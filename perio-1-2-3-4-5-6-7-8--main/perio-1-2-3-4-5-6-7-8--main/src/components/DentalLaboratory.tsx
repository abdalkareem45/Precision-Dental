import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PermanentOdontogram } from './PermanentOdontogram';
import { ToothViewer3D, CameraViewPreset } from './ToothViewer3D';
import { ToothInfoPanel } from './ToothInfoPanel';
import { GuidedLessonModal } from './GuidedLessonModal';
import { ComparisonModeModal } from './ComparisonModeModal';
import { AnatomyQuizModal } from './AnatomyQuizModal';
import { StudentProgressTracker, StudentProgressData } from './StudentProgressTracker';
import {
  getAllPermanentTeeth,
  PermanentToothData,
  AnatomicalLandmark
} from '../data/permanentTeethData';
import { AnatomyLearningMode } from '../utils/dentalAnatomy3D';
import {
  Boxes,
  GraduationCap,
  FileText,
  TrendingUp,
  Compass,
  Split,
  HelpCircle,
  Eye,
  EyeOff,
  Ruler,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Contrast,
  SlidersHorizontal
} from 'lucide-react';

const PROGRESS_STORAGE_KEY = 'perio3d_student_progress_v1';

export const DentalLaboratory: React.FC = () => {
  const allTeeth = getAllPermanentTeeth();

  // Selected Tooth State (defaults to Maxillary Right Central Incisor #11)
  const [selectedTooth, setSelectedTooth] = useState<PermanentToothData>(allTeeth[7] || allTeeth[0]);

  // View & Tool States
  const [learningMode, setLearningMode] = useState<AnatomyLearningMode>('external');
  const [showLandmarks, setShowLandmarks] = useState(false);
  const [activeLandmark, setActiveLandmark] = useState<AnatomicalLandmark | null>(null);
  const [isMeasurementActive, setIsMeasurementActive] = useState(false);

  // Right Panel Tab
  const [rightPanelTab, setRightPanelTab] = useState<'info' | 'progress'>('info');

  // Modals
  const [isGuidedLessonOpen, setIsGuidedLessonOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  // High-contrast accessibility mode
  const [isHighContrast, setIsHighContrast] = useState(false);

  // Responsive mobile panel view: 'odontogram' | 'viewer' | 'details'
  const [mobileTab, setMobileTab] = useState<'odontogram' | 'viewer' | 'details'>('viewer');

  // Student Progress State (with localStorage persistence)
  const [progress, setProgress] = useState<StudentProgressData>(() => {
    try {
      const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to load progress from localStorage', e);
    }
    return {
      studiedFdis: [11],
      quizScores: {},
      completedLandmarks: [],
      weakTopics: [],
      recentActivity: [
        { fdi: 11, action: 'Opened Maxillary Right Central Incisor', timestamp: 'Just now' }
      ]
    };
  });

  // Save progress
  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.warn('Failed to save progress to localStorage', e);
    }
  }, [progress]);

  // Tooth Selection Handler
  const handleSelectTooth = useCallback((tooth: PermanentToothData) => {
    setSelectedTooth(tooth);
    setActiveLandmark(null);

    // Update progress: mark tooth studied
    setProgress((prev) => {
      const isNew = !prev.studiedFdis.includes(tooth.fdi);
      const updatedStudied = isNew ? [...prev.studiedFdis, tooth.fdi] : prev.studiedFdis;
      const updatedActivity = [
        {
          fdi: tooth.fdi,
          action: `Inspected ${tooth.name}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        ...prev.recentActivity.slice(0, 15)
      ];

      return {
        ...prev,
        studiedFdis: updatedStudied,
        recentActivity: updatedActivity
      };
    });

    // Switch mobile view to viewer
    setMobileTab('viewer');
  }, []);

  // Landmark Selection Handler
  const handleSelectLandmark = useCallback((landmark: AnatomicalLandmark | null) => {
    setActiveLandmark(landmark);
    if (landmark) {
      setShowLandmarks(true);
      setProgress((prev) => {
        if (!prev.completedLandmarks.includes(landmark.id)) {
          return {
            ...prev,
            completedLandmarks: [...prev.completedLandmarks, landmark.id]
          };
        }
        return prev;
      });
    }
  }, []);

  // Record Quiz Score
  const handleRecordQuizScore = (fdi: number, score: number, weakTopics: string[]) => {
    setProgress((prev) => {
      const newScores = { ...prev.quizScores, [fdi]: score };
      const mergedWeak = Array.from(new Set([...prev.weakTopics, ...weakTopics]));
      return {
        ...prev,
        quizScores: newScores,
        weakTopics: mergedWeak,
        recentActivity: [
          {
            fdi,
            action: `Completed Quiz (${score}/5 score)`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          },
          ...prev.recentActivity.slice(0, 15)
        ]
      };
    });
  };

  // Reset Progress Handler
  const handleResetProgress = () => {
    if (window.confirm('Reset all recorded student progress and quiz scores?')) {
      const resetData: StudentProgressData = {
        studiedFdis: [selectedTooth.fdi],
        quizScores: {},
        completedLandmarks: [],
        weakTopics: [],
        recentActivity: []
      };
      setProgress(resetData);
      localStorage.removeItem(PROGRESS_STORAGE_KEY);
    }
  };

  // Keyboard Navigation: Next/Prev tooth
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'ArrowRight') {
        const currentIdx = allTeeth.findIndex((t) => t.fdi === selectedTooth.fdi);
        const nextTooth = allTeeth[(currentIdx + 1) % allTeeth.length];
        handleSelectTooth(nextTooth);
      } else if (e.key === 'ArrowLeft') {
        const currentIdx = allTeeth.findIndex((t) => t.fdi === selectedTooth.fdi);
        const prevTooth = allTeeth[(currentIdx - 1 + allTeeth.length) % allTeeth.length];
        handleSelectTooth(prevTooth);
      } else if (e.key === 'l' || e.key === 'L') {
        setShowLandmarks((prev) => !prev);
      } else if (e.key === 'q' || e.key === 'Q') {
        setIsQuizOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [allTeeth, selectedTooth, handleSelectTooth]);

  return (
    <div
      className={`flex flex-col h-[calc(100vh-5.5rem)] w-full max-w-[1720px] mx-auto transition-colors duration-200 ${
        isHighContrast ? 'contrast-125 bg-black text-white' : 'text-slate-100'
      }`}
    >
      {/* Mobile Top Segmented View Switcher */}
      <div className="lg:hidden flex items-center justify-between bg-slate-900 border border-slate-800 p-1.5 rounded-xl mb-2 shrink-0">
        <button
          onClick={() => setMobileTab('odontogram')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
            mobileTab === 'odontogram' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400'
          }`}
        >
          Odontogram
        </button>
        <button
          onClick={() => setMobileTab('viewer')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
            mobileTab === 'viewer' ? 'bg-cyan-600 text-slate-950 font-bold shadow-xs' : 'text-slate-400'
          }`}
        >
          3D Viewer
        </button>
        <button
          onClick={() => setMobileTab('details')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
            mobileTab === 'details' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400'
          }`}
        >
          Tooth Dossier
        </button>
      </div>

      {/* Main 3-Column Workstation Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0 overflow-hidden">
        {/* Left Column: Permanent Odontogram (3 of 12 cols on desktop) */}
        <aside
          className={`lg:col-span-3 h-full overflow-hidden ${
            mobileTab === 'odontogram' ? 'block' : 'hidden lg:block'
          }`}
        >
          <PermanentOdontogram
            selectedFdi={selectedTooth.fdi}
            onSelectTooth={handleSelectTooth}
            studiedFdis={new Set(progress.studiedFdis)}
            quizScores={progress.quizScores}
          />
        </aside>

        {/* Center Column: Interactive 3D Tooth Viewer (6 of 12 cols on desktop) */}
        <section
          className={`lg:col-span-6 h-full flex flex-col gap-2 min-h-0 overflow-hidden ${
            mobileTab === 'viewer' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Main 3D Canvas */}
          <div className="flex-1 min-h-0 relative">
            <ToothViewer3D
              tooth={selectedTooth}
              learningMode={learningMode}
              onChangeLearningMode={setLearningMode}
              showLandmarks={showLandmarks}
              onToggleLandmarks={() => setShowLandmarks((prev) => !prev)}
              activeLandmarkId={activeLandmark?.id}
              onSelectLandmark={handleSelectLandmark}
              isMeasurementActive={isMeasurementActive}
              onToggleMeasurement={() => setIsMeasurementActive((prev) => !prev)}
            />
          </div>

          {/* Bottom Interactive Toolbar: Anatomy Layers, Guided Masterclass, Comparison, Quiz */}
          <div className="bg-slate-900/95 border border-slate-800 p-2 sm:p-2.5 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-2 shrink-0">
            {/* Anatomy Layer Mode Buttons */}
            <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar">
              <span className="text-[10px] text-slate-400 font-bold uppercase shrink-0 mr-1 flex items-center gap-1">
                <Layers className="w-3 h-3 text-cyan-400" /> Mode:
              </span>

              {(
                [
                  { id: 'external', label: 'External' },
                  { id: 'internal', label: 'Internal' },
                  { id: 'layers', label: 'Layers' },
                  { id: 'root_canal', label: 'Root & Canal' },
                  { id: 'transparent', label: 'Transparent' },
                  { id: 'exploded', label: 'Exploded' },
                  { id: 'section', label: 'Section' }
                ] as const
              ).map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setLearningMode(mode.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    learningMode === mode.id
                      ? 'bg-blue-600 text-white shadow-xs ring-1 ring-blue-400'
                      : 'bg-slate-950/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            {/* Action Tool Buttons: Guided Lesson, Comparison, Quiz */}
            <div className="flex items-center gap-1.5 ml-auto">
              {/* Guided Lesson Button */}
              <button
                onClick={() => setIsGuidedLessonOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
              >
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Guided Lesson</span>
              </button>

              {/* Comparison Tool Button */}
              <button
                onClick={() => setIsComparisonOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
              >
                <Split className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Compare</span>
              </button>

              {/* Quiz Mode Button */}
              <button
                onClick={() => setIsQuizOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-md shadow-purple-600/20"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Quiz Mode</span>
              </button>
            </div>
          </div>
        </section>

        {/* Right Column: Selected Tooth Info Dossier & Progress Tracker (3 of 12 cols on desktop) */}
        <aside
          className={`lg:col-span-3 h-full flex flex-col min-h-0 overflow-hidden ${
            mobileTab === 'details' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Segmented Tab Headers */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 mb-2 shrink-0">
            <button
              onClick={() => setRightPanelTab('info')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                rightPanelTab === 'info'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Anatomical Dossier</span>
            </button>

            <button
              onClick={() => setRightPanelTab('progress')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                rightPanelTab === 'progress'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Study Progress</span>
            </button>
          </div>

          {/* Active Panel Body with slide-in transition */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={rightPanelTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                {rightPanelTab === 'info' && (
                  <ToothInfoPanel
                    tooth={selectedTooth}
                    onSelectLandmark={handleSelectLandmark}
                    activeLandmarkId={activeLandmark?.id}
                  />
                )}
                {rightPanelTab === 'progress' && (
                  <StudentProgressTracker
                    progress={progress}
                    onSelectTooth={handleSelectTooth}
                    onResetProgress={handleResetProgress}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </aside>
      </div>

      {/* Modals */}
      <GuidedLessonModal
        tooth={selectedTooth}
        isOpen={isGuidedLessonOpen}
        onClose={() => setIsGuidedLessonOpen(false)}
        onCameraChange={() => {}}
        onStartQuiz={() => setIsQuizOpen(true)}
      />

      <ComparisonModeModal
        currentTooth={selectedTooth}
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        onSelectToothToCompare={(fdi) => {
          const t = allTeeth.find((x) => x.fdi === fdi);
          if (t) handleSelectTooth(t);
        }}
      />

      <AnatomyQuizModal
        currentTooth={selectedTooth}
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onRecordScore={handleRecordQuizScore}
        onSwitchToothForQuiz={handleSelectTooth}
      />
    </div>
  );
};
