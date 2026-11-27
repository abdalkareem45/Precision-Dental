import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Compass,
  Play,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';
import type { HeroAnimationType, LectureData, LectureSectionKey } from '@/src/types/lecture';

interface InteractiveHeroProps {
  lecture: LectureData;
  completionPct: number;
  onJumpSection: (section: LectureSectionKey) => void;
  onStartTour: () => void;
  onAskTutor: () => void;
}

const TopicAnimatedGraphic: React.FC<{ type: HeroAnimationType }> = ({ type }) => {
  switch (type) {
    case 'tmj':
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full" aria-hidden="true">
          <defs>
            <linearGradient id="tmjBone" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E4C16E" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#C9A24B" stopOpacity="0.55" />
            </linearGradient>
          </defs>
          {/* Glenoid fossa & articular eminence */}
          <path
            d="M 40 65 Q 95 25 145 72 Q 175 96 225 60 L 250 40 L 40 40 Z"
            fill="url(#tmjBone)"
            stroke="#FDE68A"
            strokeWidth="1.5"
          />
          {/* Animated Condylar Head + Articular Disc translation path */}
          <motion.g
            animate={{
              x: [0, 34, 62, 34, 0],
              y: [0, 18, 22, 18, 0],
              rotate: [0, 12, 24, 12, 0],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '105px 120px' }}
          >
            {/* Biconcave Disc */}
            <path
              d="M 76 80 Q 105 90 132 76 Q 112 66 76 80 Z"
              fill="#14B8A6"
              fillOpacity="0.78"
              stroke="#5EEAD4"
              strokeWidth="1.4"
            />
            {/* Condyle + Ramus */}
            <path
              d="M 85 112 C 85 90, 125 90, 126 112 L 138 175 L 74 175 Z"
              fill="#3B82F6"
              fillOpacity="0.45"
              stroke="#93C5FD"
              strokeWidth="2"
            />
            <circle cx="105" cy="108" r="6" fill="#E4C16E" />
          </motion.g>
          <path
            d="M 105 108 Q 140 128 167 130"
            fill="none"
            stroke="#5EEAD4"
            strokeDasharray="4 4"
            strokeWidth="1.5"
          />
          <text x="20" y="188" fill="#CBD5E1" fontSize="10" fontFamily="monospace">
            CONDYLAR ROTATION + TRANSLATION KINEMATICS
          </text>
        </svg>
      );

    case 'neuralgia':
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full" aria-hidden="true">
          <circle cx="66" cy="98" r="24" fill="#C9A24B" fillOpacity="0.35" stroke="#E4C16E" strokeWidth="2" />
          <text x="53" y="102" fill="#FEF3C7" fontSize="11" fontFamily="monospace" fontWeight="bold">TG</text>
          {[
            { d: 'M 90 88 Q 160 36 276 42', label: 'V1 Ophthalmic', color: '#38BDF8', delay: 0 },
            { d: 'M 90 98 Q 175 94 282 96', label: 'V2 Maxillary', color: '#14B8A6', delay: 0.7 },
            { d: 'M 90 108 Q 170 155 274 156', label: 'V3 Mandibular', color: '#F59E0B', delay: 1.4 },
          ].map((branch) => (
            <g key={branch.label}>
              <path d={branch.d} fill="none" stroke={branch.color} strokeWidth="2.5" strokeOpacity="0.45" />
              <motion.path
                d={branch.d}
                fill="none"
                stroke={branch.color}
                strokeWidth="3.5"
                strokeDasharray="18 140"
                animate={{ strokeDashoffset: [158, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, delay: branch.delay, ease: 'linear' }}
              />
              <text x="195" y={branch.delay === 0 ? 34 : branch.delay === 0.7 ? 86 : 172} fill="#E2E8F0" fontSize="10" fontFamily="monospace">
                {branch.label}
              </text>
            </g>
          ))}
        </svg>
      );

    case 'salivary':
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full" aria-hidden="true">
          {/* Acinar cluster */}
          {[
            [72, 65],
            [52, 95],
            [72, 128],
            [102, 76],
            [102, 118],
          ].map(([cx, cy], i) => (
            <motion.circle
              key={i}
              cx={cx}
              cy={cy}
              r="20"
              fill="#14B8A6"
              fillOpacity="0.32"
              stroke="#5EEAD4"
              strokeWidth="1.6"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.25 }}
            />
          ))}
          {/* Striated & Excretory Duct */}
          <path d="M 116 90 L 280 90 L 280 108 L 116 108 Z" fill="#1B3A8C" fillOpacity="0.65" stroke="#93C5FD" strokeWidth="1.5" />
          {/* Flowing saliva droplets */}
          {[0, 1, 2, 3].map((i) => (
            <motion.circle
              key={i}
              cy="99"
              r="5"
              fill="#38BDF8"
              animate={{ cx: [118, 285], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.7, ease: 'easeInOut' }}
            />
          ))}
          <text x="145" y="76" fill="#CBD5E1" fontSize="10" fontFamily="monospace">
            ACINAR SECRETION → DUCTAL FLOW
          </text>
        </svg>
      );

    case 'hematology':
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full" aria-hidden="true">
          <rect x="20" y="54" width="280" height="92" rx="46" fill="#7F1D1D" fillOpacity="0.32" stroke="#FCA5A5" strokeOpacity="0.4" strokeWidth="2" />
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.g
              key={i}
              animate={{ x: [-20, 290] }}
              transition={{ duration: 5.5, repeat: Infinity, delay: i * 1.1, ease: 'linear' }}
            >
              <ellipse cx="20" cy={80 + (i % 3) * 20} rx="14" ry="9" fill="#EF4444" stroke="#FCA5A5" strokeWidth="1.5" />
            </motion.g>
          ))}
          {[0, 1].map((i) => (
            <motion.circle
              key={`wbc-${i}`}
              cy={100 + i * 14}
              r="11"
              fill="#E2E8F0"
              fillOpacity="0.85"
              stroke="#3B82F6"
              strokeWidth="2"
              animate={{ cx: [10, 300] }}
              transition={{ duration: 7.5, repeat: Infinity, delay: i * 3.5, ease: 'linear' }}
            />
          ))}
          <text x="26" y="172" fill="#E2E8F0" fontSize="10" fontFamily="monospace">
            MICROVASCULAR HEMOSTASIS & CELLULAR INDICES
          </text>
        </svg>
      );

    case 'lymphatic':
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full" aria-hidden="true">
          <path d="M 70 40 L 145 85 L 140 165" fill="none" stroke="#14B8A6" strokeWidth="3" strokeOpacity="0.55" />
          <path d="M 225 45 L 145 85 L 220 150" fill="none" stroke="#38BDF8" strokeWidth="3" strokeOpacity="0.55" />
          {[
            { cx: 78, cy: 48, lbl: 'Submental' },
            { cx: 145, cy: 85, lbl: 'Submandibular' },
            { cx: 222, cy: 52, lbl: 'Upper Jugular' },
            { cx: 142, cy: 148, lbl: 'Mid Jugular' },
            { cx: 215, cy: 148, lbl: 'Supraclavicular' },
          ].map((n, idx) => (
            <g key={n.lbl}>
              <motion.circle
                cx={n.cx}
                cy={n.cy}
                r="13"
                fill="#14B8A6"
                fillOpacity="0.45"
                stroke="#5EEAD4"
                strokeWidth="2"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2.8, repeat: Infinity, delay: idx * 0.35 }}
              />
              <text x={n.cx - 22} y={n.cy + 24} fill="#E2E8F0" fontSize="9" fontFamily="monospace">
                {n.lbl}
              </text>
            </g>
          ))}
        </svg>
      );

    case 'mucosa':
    case 'vesiculobullous':
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full" aria-hidden="true">
          {/* Basement Membrane Zone */}
          <path d="M 24 134 Q 80 122 140 134 T 296 134" fill="none" stroke="#C9A24B" strokeWidth="3" />
          {/* Basal / Suprabasal Epithelial Cells */}
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <motion.rect
              key={i}
              x={34 + i * 38}
              y={88}
              width="30"
              height="36"
              rx="6"
              fill={type === 'vesiculobullous' && i >= 2 && i <= 4 ? '#F59E0B' : '#3B82F6'}
              fillOpacity="0.4"
              stroke="#93C5FD"
              strokeWidth="1.5"
              animate={
                type === 'vesiculobullous' && i >= 2 && i <= 4
                  ? { y: [88, 70, 88] }
                  : { opacity: [0.65, 1, 0.65] }
              }
              transition={{ duration: 3.4, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
          <text x="28" y="166" fill="#CBD5E1" fontSize="10" fontFamily="monospace">
            {type === 'vesiculobullous'
              ? 'DESMOSOMAL vs HEMIDESMOSOMAL CLEAVAGE PLANE'
              : 'EPITHELIAL STRATIFICATION & DYSPLASIA GRADIENT'}
          </text>
        </svg>
      );

    case 'laboratory':
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full" aria-hidden="true">
          {[42, 76, 110, 144].map((y, idx) => (
            <g key={y}>
              <rect x="34" y={y} width="248" height="20" rx="6" fill="#1E293B" stroke="#334155" />
              <motion.rect
                x="36"
                y={y + 2}
                height="16"
                rx="4"
                fill={idx === 2 ? '#F59E0B' : '#14B8A6'}
                animate={{ width: [40, 110 + idx * 32, 85 + idx * 28] }}
                transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse', delay: idx * 0.3 }}
              />
            </g>
          ))}
          <text x="34" y="182" fill="#E2E8F0" fontSize="10" fontFamily="monospace">
            BIOMARKER THRESHOLDS & SEROLOGY MATRIX
          </text>
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <motion.circle
              key={i}
              cx={68 + i * 62}
              cy="96"
              r="22"
              fill="#3B82F6"
              fillOpacity="0.28"
              stroke="#C9A24B"
              strokeWidth="2"
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
            />
          ))}
          <path d="M 90 96 L 108 96 M 152 96 L 170 96 M 214 96 L 232 96" stroke="#5EEAD4" strokeWidth="2.5" />
          <text x="40" y="156" fill="#E2E8F0" fontSize="10" fontFamily="monospace">
            STRUCTURED CLINICAL DIAGNOSTIC WORKFLOW
          </text>
        </svg>
      );
  }
};

export const InteractiveHero: React.FC<InteractiveHeroProps> = ({
  lecture,
  completionPct,
  onJumpSection,
  onStartTour,
  onAskTutor,
}) => {
  return (
    <section
      id="section-hero"
      className="relative overflow-hidden rounded-2xl border border-[#E6E8EC] dark:border-[#1F2937] bg-[#0B1F4D] text-white shadow-xl"
    >
      {/* Background image + gradient veil */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-22 pointer-events-none"
        style={{ backgroundImage: `url(${lecture.heroImage})` }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#0B1F4D] via-[#0B1F4D]/92 to-[#0B1220]/95 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative p-6 sm:p-8 lg:p-10 space-y-6">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Left column: Metadata, title, objectives, actions */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-mono font-bold px-2.5 py-1 rounded-md bg-[#C9A24B] text-[#0B1F4D]">
                LECTURE {String(lecture.number).padStart(2, '0')}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/12 text-slate-100 font-medium">
                {lecture.specialty}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/12 text-[#99F6E4] font-medium">
                {lecture.difficulty}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/12 font-mono text-slate-200 tabular-nums">
                <Clock className="w-3.5 h-3.5 text-[#E4C16E]" />
                {lecture.estimatedMinutes} min
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white">
                {lecture.title}
              </h1>
              <p className="text-xs font-mono text-slate-300">
                Source Grounding: {lecture.sourceAttribution}
              </p>
            </div>

            {/* Learning Objectives */}
            <div className="rounded-xl bg-white/8 border border-white/15 p-4 space-y-2.5">
              <div className="text-xs font-mono uppercase tracking-wider text-[#E4C16E]">
                Clinical Learning Objectives
              </div>
              <ul className="grid sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-100">
                {lecture.learningObjectives.map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2DD4BF] shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Progress bar + Action CTAs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Module Mastery Progress</span>
                <span className="font-mono font-bold text-[#E4C16E] tabular-nums">{completionPct}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/15 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#38BDF8] via-[#14B8A6] to-[#C9A24B] transition-all duration-500"
                  style={{ width: `${Math.max(4, completionPct)}%` }}
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onJumpSection('knowledge-map')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C9A24B] hover:bg-[#B89038] text-[#0B1F4D] font-display font-bold text-sm transition-colors cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Continue Learning
                </button>
                <button
                  type="button"
                  onClick={onStartTour}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/12 hover:bg-white/20 border border-white/25 text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-[#38BDF8]" />
                  Start Interactive Tour
                </button>
                <button
                  type="button"
                  onClick={onAskTutor}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#14B8A6]/20 hover:bg-[#14B8A6]/30 border border-[#14B8A6]/40 text-[#99F6E4] text-sm font-semibold transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  AI Tutor
                </button>
              </div>
            </div>
          </div>

          {/* Right column: Animated topic-specific clinical visualizer */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-[#C9A24B]/35 bg-[#0B1220]/85 p-4 space-y-3 shadow-inner">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono uppercase tracking-wider text-[#E4C16E]">
                  Live Mechanism Preview
                </span>
                <button
                  type="button"
                  onClick={() => onJumpSection('lab-3d')}
                  className="inline-flex items-center gap-1 text-[#38BDF8] hover:underline font-medium cursor-pointer"
                >
                  Open 3D Lab
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="h-48 sm:h-56 rounded-xl bg-[#070D18] border border-white/10 p-2 overflow-hidden">
                <TopicAnimatedGraphic type={lecture.heroAnimation} />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                <div className="rounded-lg bg-white/5 py-1.5 px-2">
                  <div className="font-mono font-bold text-white tabular-nums">{lecture.sandboxes3D.length}</div>
                  <div className="text-slate-400">3D Sandboxes</div>
                </div>
                <div className="rounded-lg bg-white/5 py-1.5 px-2">
                  <div className="font-mono font-bold text-[#38BDF8] tabular-nums">4</div>
                  <div className="text-slate-400">2D Clinical Labs</div>
                </div>
                <div className="rounded-lg bg-white/5 py-1.5 px-2">
                  <div className="font-mono font-bold text-[#2DD4BF] tabular-nums">{lecture.clinicalCases.length}</div>
                  <div className="text-slate-400">Patient Cases</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Notice / Educational Scope Callout */}
        <div
          role="note"
          className="rounded-xl border border-amber-400/35 bg-amber-950/35 px-4 py-3 flex items-start gap-3 text-xs text-amber-100"
        >
          <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{lecture.clinicalNotice}</p>
        </div>
      </div>
    </section>
  );
};
