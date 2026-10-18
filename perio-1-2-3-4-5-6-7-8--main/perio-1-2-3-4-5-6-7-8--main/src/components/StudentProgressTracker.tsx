import React from 'react';
import {
  Award,
  CheckCircle2,
  BookOpen,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import { getAllPermanentTeeth, PermanentToothData } from '../data/permanentTeethData';

export interface StudentProgressData {
  studiedFdis: number[];
  quizScores: Record<number, number>; // fdi -> score (0..5)
  completedLandmarks: string[]; // landmark IDs
  weakTopics: string[];
  recentActivity: {
    fdi: number;
    action: string;
    timestamp: string;
  }[];
}

interface StudentProgressTrackerProps {
  progress: StudentProgressData;
  onSelectTooth: (tooth: PermanentToothData) => void;
  onResetProgress: () => void;
}

export const StudentProgressTracker: React.FC<StudentProgressTrackerProps> = ({
  progress,
  onSelectTooth,
  onResetProgress
}) => {
  const allTeeth = getAllPermanentTeeth();
  const totalTeeth = 32;
  const studiedCount = progress.studiedFdis.length;
  const completionPercentage = Math.round((studiedCount / totalTeeth) * 100);

  // Calculate average quiz score
  const scoreEntries = Object.values(progress.quizScores);
  const avgQuizScore =
    scoreEntries.length > 0
      ? Math.round((scoreEntries.reduce((a, b) => a + b, 0) / (scoreEntries.length * 5)) * 100)
      : 0;

  return (
    <div className="flex flex-col h-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-slate-200 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Student Academic Progress</h2>
            <p className="text-[11px] text-slate-400">Senior Dental Competency Tracker</p>
          </div>
        </div>

        <button
          onClick={onResetProgress}
          title="Reset local study history"
          className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto mt-3 pr-1 space-y-3.5 custom-scrollbar text-xs">
        {/* Overall Completion Metric Card */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-xs">Permanent Dentition Mastery:</span>
            <span className="font-mono text-cyan-400 font-bold text-base">{completionPercentage}%</span>
          </div>

          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block">Teeth Studied</span>
              <strong className="text-white text-sm">{studiedCount} / {totalTeeth}</strong>
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block">Avg Quiz</span>
              <strong className="text-emerald-400 text-sm">{avgQuizScore}%</strong>
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block">Landmarks</span>
              <strong className="text-amber-400 text-sm">{progress.completedLandmarks.length}</strong>
            </div>
          </div>
        </div>

        {/* Weak Areas & Recommended Review Topics */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-300 text-[11px] flex items-center gap-1.5 uppercase tracking-wider">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Weak Areas &amp; Recommended Review
            </span>
          </div>

          {progress.weakTopics.length > 0 ? (
            <div className="space-y-1.5">
              {progress.weakTopics.map((topic, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-200 flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <span className="font-semibold">{topic}</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Recommended: Review Wheeler's Ch. 8-12 and examine the 3D model landmarks.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 text-center">
              No weak areas logged yet. Take the Anatomy Quiz to identify revision topics.
            </div>
          )}
        </div>

        {/* Recent Study Activity Log */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-2">
          <span className="font-bold text-white text-[11px] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" /> Recent Activity Log
          </span>

          {progress.recentActivity.length > 0 ? (
            <div className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
              {progress.recentActivity.slice(0, 8).map((act, i) => {
                const targetTooth = allTeeth.find((t) => t.fdi === act.fdi);
                return (
                  <button
                    key={i}
                    onClick={() => targetTooth && onSelectTooth(targetTooth)}
                    className="w-full text-left p-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-800/60 text-[11px] flex items-center justify-between transition"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-cyan-400 font-bold">#{act.fdi}</span>
                      <span className="text-slate-300 truncate">{act.action}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{act.timestamp}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-[11px] text-slate-500 text-center py-2">
              Start exploring teeth in the odontogram to record your activity.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
