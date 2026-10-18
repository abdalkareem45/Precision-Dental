import React, { useState } from 'react';
import { PermanentToothData, ToothGuidedStep } from '../data/permanentTeethData';
import { CameraViewPreset } from './ToothViewer3D';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  X,
  Eye,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface GuidedLessonModalProps {
  tooth: PermanentToothData;
  isOpen: boolean;
  onClose: () => void;
  onCameraChange: (view: CameraViewPreset) => void;
  onStartQuiz: () => void;
}

export const GuidedLessonModal: React.FC<GuidedLessonModalProps> = ({
  tooth,
  isOpen,
  onClose,
  onCameraChange,
  onStartQuiz
}) => {
  if (!isOpen) return null;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Standard 9 steps
  const steps: ToothGuidedStep[] = tooth.guidedSteps && tooth.guidedSteps.length >= 5
    ? tooth.guidedSteps
    : [
        { step: 1, title: 'Tooth Identification', viewAngle: 'buccal', instruction: `Observe the overall outline and dimensions of ${tooth.name}.`, anatomicalObservation: `${tooth.category} in the ${tooth.arch} arch.` },
        { step: 2, title: 'Arch & Side Verification', viewAngle: 'buccal', instruction: 'Evaluate the proximal line angles and CEJ slope.', anatomicalObservation: `${tooth.side} quadrant (${tooth.quadrantName}).` },
        { step: 3, title: 'Facial Surface Morphology', viewAngle: 'buccal', instruction: 'Examine facial developmental lobes and contour.', anatomicalObservation: 'Height of contour and surface perikymata.' },
        { step: 4, title: 'Lingual / Palatal Surface', viewAngle: 'lingual', instruction: 'Inspect the cingulum, marginal ridges, or lingual cusps.', anatomicalObservation: 'Lingual anatomy and fossae.' },
        { step: 5, title: 'Proximal Surfaces (Mesial & Distal)', viewAngle: 'mesial', instruction: 'Analyze mesial CEJ scalloping and contact areas.', anatomicalObservation: 'Proximal curvature and contact points.' },
        { step: 6, title: 'Incisal / Occlusal Table', viewAngle: 'occlusal', instruction: 'Examine cusp morphology, developmental grooves, and fossae.', anatomicalObservation: 'Occlusal groove pattern and cusps.' },
        { step: 7, title: 'Root Morphology & Taper', viewAngle: 'buccal', instruction: 'Examine root divergence, apical curvature, and furcation.', anatomicalObservation: `${tooth.expectedRoots} root(s) with ${tooth.rootMorphology}` },
        { step: 8, title: 'Clinical Features & Pearls', viewAngle: 'lingual', instruction: 'Review the high-yield clinical relevance for 5th stage.', anatomicalObservation: `${tooth.clinicalRelevance.endodontics}` },
        { step: 9, title: 'Knowledge Check Quiz', viewAngle: 'buccal', instruction: 'Ready to test your mastery of this tooth!', anatomicalObservation: '5-question comprehensive quiz.' }
      ];

  const currentStep = steps[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      onCameraChange(steps[nextIdx].viewAngle as CameraViewPreset);
    } else {
      // Step 9: Launch quiz
      onClose();
      onStartQuiz();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      onCameraChange(steps[prevIdx].viewAngle as CameraViewPreset);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">
                Guided Clinical Anatomy Masterclass
              </h3>
              <p className="text-[11px] text-slate-400">
                {tooth.name} (FDI #{tooth.fdi} • Univ #{tooth.universal})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Stepper Bar */}
        <div className="px-5 pt-4 pb-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-cyan-300">
              Step {currentStepIndex + 1} of {steps.length}: {currentStep.title}
            </span>
            <span className="text-[10px] font-mono text-slate-400 uppercase">
              Camera: {currentStep.viewAngle} View
            </span>
          </div>

          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-full border-r border-slate-900 last:border-0 transition-colors duration-200 ${
                  i < currentStepIndex
                    ? 'bg-emerald-500'
                    : i === currentStepIndex
                    ? 'bg-cyan-400'
                    : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Body */}
        <div className="p-5 space-y-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-700 text-cyan-300 font-mono font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                {currentStepIndex + 1}
              </span>
              <div>
                <h4 className="font-bold text-white text-sm mb-1">{currentStep.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentStep.instruction}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-800/80 pt-2.5 flex items-start gap-2 text-xs">
              <span className="text-cyan-400 font-bold shrink-0">Anatomical Observation:</span>
              <span className="text-slate-300">{currentStep.anatomicalObservation}</span>
            </div>
          </div>

          <div className="bg-blue-950/30 border border-blue-800/50 p-3 rounded-xl text-[11px] text-blue-200 flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              The 3D camera has automatically oriented to the <strong>{currentStep.viewAngle}</strong> perspective. You can still orbit and inspect details manually.
            </span>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between p-4 border-t border-slate-800 bg-slate-950/80">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="px-3.5 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-lg shadow-cyan-600/20"
          >
            <span>{currentStepIndex === steps.length - 1 ? 'Start Tooth Quiz' : 'Next Step'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
