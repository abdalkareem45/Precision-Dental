import React, { useState } from 'react';
import {
  BookOpen,
  Activity,
  Layers,
  Boxes,
  Split,
  Compass,
  Brain,
  HelpCircle,
  Zap,
  Scale,
  Sparkles,
  ArrowRight,
  ChevronRight,
  ShieldAlert,
  Flame,
  CheckCircle2,
  Clock,
  Ruler,
  AlertTriangle,
  Stethoscope,
  Info,
  RotateCcw,
  GitCommit,
  TrendingDown,
  ChevronDown
} from 'lucide-react';
import { BoneLoss3DCanvas } from './boneLoss/BoneLoss3DCanvas';
import { BoneDefect3DType } from './boneLoss/types';

interface PeriodonticsByKareemTabProps {
  onNavigateTab?: (tab: string) => void;
}

export const PeriodonticsByKareemTab: React.FC<PeriodonticsByKareemTabProps> = ({ onNavigateTab }) => {
  const [selectedLecture, setSelectedLecture] = useState<'all' | 'lec1' | 'lec2' | 'lec3' | 'lec4'>('all');

  // ==========================================
  // LECTURE 1 STATE: EQUILIBRIUM & CAL/PD
  // ==========================================
  const [formationResorptionBalance, setFormationResorptionBalance] = useState<number>(75);
  const [gingivalMarginOffset, setGingivalMarginOffset] = useState<number>(0); // mm from CEJ (+ coronal, - apical)
  const [pocketBaseDepth, setPocketBaseDepth] = useState<number>(5); // mm from CEJ
  const [selectedCasePreset, setSelectedCasePreset] = useState<string>('periodontitis');
  const [selectedHistologyHotspot, setSelectedHistologyHotspot] = useState<string>('osteoclast');

  const cal = Math.max(0, pocketBaseDepth);
  const pd = Math.max(0, cal + gingivalMarginOffset);
  const clinicalRecession = -gingivalMarginOffset;

  const handleApplyPreset = (preset: 'healthy' | 'enlargement' | 'recession' | 'periodontitis') => {
    setSelectedCasePreset(preset);
    if (preset === 'healthy') {
      setGingivalMarginOffset(1);
      setPocketBaseDepth(1);
    } else if (preset === 'enlargement') {
      setGingivalMarginOffset(4);
      setPocketBaseDepth(1);
    } else if (preset === 'recession') {
      setGingivalMarginOffset(-3);
      setPocketBaseDepth(4);
    } else if (preset === 'periodontitis') {
      setGingivalMarginOffset(0);
      setPocketBaseDepth(6);
    }
  };

  // SVG coordinate calculations for CAL/PD tooth model
  const SVG_HEIGHT = 420;
  const CEJ_Y = 160;
  const MM_PX = 16;
  const gmY = CEJ_Y - (gingivalMarginOffset * MM_PX);
  const pbY = CEJ_Y + (pocketBaseDepth * MM_PX);
  const boneY = Math.min(380, pbY + 1.8 * MM_PX);

  // ==========================================
  // LECTURE 2 STATE: PATHWAYS, RADIUS & RATE
  // ==========================================
  const [activePathway, setActivePathway] = useState<'interproximal' | 'facial' | 'lingual'>('interproximal');
  const [selectedCytokine, setSelectedCytokine] = useState<'lps' | 'il1' | 'tnf' | 'pge2'>('lps');
  const [interdentalWidth, setInterdentalWidth] = useState<number>(2.2); // mm
  const [simulatedYears, setSimulatedYears] = useState<number>(10);
  const [selectedLoeGroup, setSelectedLoeGroup] = useState<'rapid' | 'moderate' | 'none'>('moderate');

  // ==========================================
  // LECTURE 3 STATE: DEFECT SIMULATOR & CRATERS
  // ==========================================
  const [activeDefect3D, setActiveDefect3D] = useState<BoneDefect3DType>('two_wall');
  const [selectedCraterDepth, setSelectedCraterDepth] = useState<'shallow' | 'medium' | 'deep'>('medium');
  const [selectedMorphologyCard, setSelectedMorphologyCard] = useState<string>('crater');

  // ==========================================
  // LECTURE 4 STATE: FURCATION, TFO & AI
  // ==========================================
  const [furcationGrade, setFurcationGrade] = useState<'grade1' | 'grade2' | 'grade3' | 'grade4'>('grade2');
  const [tfoPlaqueState, setTfoPlaqueState] = useState<'tfo_only' | 'tfo_plus_plaque'>('tfo_plus_plaque');
  const [aiScanConfidence, setAiScanConfidence] = useState<number>(94);
  const [aiSelectedZone, setAiSelectedZone] = useState<'crest' | 'cej' | 'furcation' | 'calculus'>('crest');

  return (
    <div className="w-full flex flex-col gap-8 pb-16 font-sans text-slate-100">
      {/* Flagship Hero Banner with Precision Dental Identity */}
      <section className="bg-gradient-to-r from-[#071433] via-[#0B1F4D] to-[#1B3A8C] border border-[#E6E8EC]/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-80 h-80 bg-[#C9A24B]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#1B3A8C] text-[#FAF8F3] border border-[#C9A24B]/40 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A24B]" /> Precision Dental Platform
            </span>
            <span dir="rtl" className="px-3 py-1 rounded-full text-xs font-bold font-arabic bg-[#0B1F4D] text-[#dfbe6e] border border-[#C9A24B]/50">
              دقّة الأسنان
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-[#071433] text-[#C9A24B] border border-[#C9A24B]/40">
              Lectures 1, 2, 3, 4
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FAF8F3]/10 text-[#FAF8F3] border border-[#E6E8EC]/30">
              5th-Year Dental Surgery Curriculum
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-xs sm:text-sm font-bold tracking-widest text-[#C9A24B] uppercase font-sans">
              "Precision in Every Smile" • Advanced Dentistry for a Brighter Tomorrow
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#FAF8F3] tracking-tight font-sans">
              Precision Dental <span className="text-[#C9A24B]">— Periodontics by Kareem</span>
            </h1>
          </div>

          <p className="text-sm sm:text-base text-[#FAF8F3]/85 leading-relaxed max-w-3xl">
            A complete, interactive digital syllabus transforming complex periodontics into deterministic biomechanics, 
            3D anatomical simulations, histologic cellular cascades, and evidence-based clinical diagnostics.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-[#071433]/85 border border-[#E6E8EC]/15 rounded-2xl p-3 shadow-md">
              <span className="text-xs text-[#E6E8EC]/70 block font-medium">Lectures Covered</span>
              <span className="text-lg font-black text-[#C9A24B]">1, 2, 3, 4</span>
            </div>
            <div className="bg-[#071433]/85 border border-[#E6E8EC]/15 rounded-2xl p-3 shadow-md">
              <span className="text-xs text-[#E6E8EC]/70 block font-medium">3D Osseous Models</span>
              <span className="text-lg font-black text-emerald-400">12 Interactive</span>
            </div>
            <div className="bg-[#071433]/85 border border-[#E6E8EC]/15 rounded-2xl p-3 shadow-md">
              <span className="text-xs text-[#E6E8EC]/70 block font-medium">Biomechanical Simulators</span>
              <span className="text-lg font-black text-[#dfbe6e]">CAL / Radius / Balance</span>
            </div>
            <div className="bg-[#071433]/85 border border-[#E6E8EC]/15 rounded-2xl p-3 shadow-md">
              <span className="text-xs text-[#E6E8EC]/70 block font-medium">Clinical Staging</span>
              <span className="text-lg font-black text-purple-300">EFP 2018 / S3 Guide</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Lecture Navigator Pills */}
      <div className="sticky top-16 z-40 bg-slate-950/90 backdrop-blur-xl border border-slate-800 p-2 rounded-2xl shadow-xl flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          <button
            onClick={() => setSelectedLecture('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              selectedLecture === 'all'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>All Lectures (Master Index)</span>
          </button>

          <button
            onClick={() => setSelectedLecture('lec1')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              selectedLecture === 'lec1'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-cyan-300" />
            <span>Lecture 1: Fundamentals &amp; CAL vs PD</span>
          </button>

          <button
            onClick={() => setSelectedLecture('lec2')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              selectedLecture === 'lec2'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-300" />
            <span>Lecture 2: Pathways, Mediators &amp; Radius</span>
          </button>

          <button
            onClick={() => setSelectedLecture('lec3')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              selectedLecture === 'lec3'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-purple-300" />
            <span>Lecture 3: Defect Patterns &amp; Craters</span>
          </button>

          <button
            onClick={() => setSelectedLecture('lec4')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              selectedLecture === 'lec4'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-amber-300" />
            <span>Lecture 4: Furcations, Occlusion &amp; AI</span>
          </button>
        </div>

        {onNavigateTab && (
          <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-800">
            <button
              onClick={() => onNavigateTab('laboratory')}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-semibold text-cyan-400 flex items-center gap-1"
            >
              <Boxes className="w-3 h-3" />
              <span>3D Lab</span>
            </button>
            <button
              onClick={() => onNavigateTab('quiz')}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-semibold text-amber-400 flex items-center gap-1"
            >
              <HelpCircle className="w-3 h-3" />
              <span>Quiz Mode</span>
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* CURRICULUM OVERVIEW (WHEN 'ALL' IS ACTIVE) */}
      {/* ========================================================================= */}
      {selectedLecture === 'all' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              Lectures 1, 2, 3, 4 Roadmap
            </h2>
            <span className="text-xs text-slate-400">Click any card to launch that lecture module</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Lecture 1 Card */}
            <div
              onClick={() => setSelectedLecture('lec1')}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 transition cursor-pointer group space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                  LECTURE 1
                </span>
                <span className="text-xs text-slate-500 group-hover:text-cyan-400 transition flex items-center gap-1">
                  Open Lecture <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition">
                Bone Loss Fundamentals, Equilibrium &amp; CAL vs PD Biomechanics
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Bone formation vs. resorption equilibrium, the episodic scar principle, why bone height doesn't directly correlate with pocket depth or suppuration, plus the interactive CAL vs. PD Anatomy Simulator.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] text-slate-400">
                <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">Formation ↔ Resorption</span>
                <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">CAL vs PD Simulator</span>
                <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">Howship's Lacunae</span>
              </div>
            </div>

            {/* Lecture 2 Card */}
            <div
              onClick={() => setSelectedLecture('lec2')}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 transition cursor-pointer group space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                  LECTURE 2
                </span>
                <span className="text-xs text-slate-500 group-hover:text-emerald-400 transition flex items-center gap-1">
                  Open Lecture <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition">
                Pathways of Inflammation, Cellular Cascades &amp; Radius of Action
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Interproximal vs. Facial/Lingual anatomical pathways of inflammatory spread, cytokines (IL-1, TNF-α, PGE2, RANKL), the 1.5–2.5mm radius rule, and the Löe longitudinal destruction rates.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] text-slate-400">
                <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">3 Anatomical Pathways</span>
                <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">1.5–2.5mm Radius Rule</span>
                <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">Löe Sri Lanka Rates</span>
              </div>
            </div>

            {/* Lecture 3 Card */}
            <div
              onClick={() => setSelectedLecture('lec3')}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-850 transition cursor-pointer group space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-purple-950 text-purple-300 border border-purple-800">
                  LECTURE 3
                </span>
                <span className="text-xs text-slate-500 group-hover:text-purple-400 transition flex items-center gap-1">
                  Open Lecture <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition">
                Bone Loss Patterns, 1/2/3-Wall Defect Classifications &amp; Craters
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Horizontal vs. vertical bone loss, Goldman &amp; Cohen defect classification (3-wall, 2-wall, 1-wall/hemiseptum, combined, circumferential), osseous craters (35.2%), bulbous contours, and buttressing bone.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] text-slate-400">
                <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">Horizontal vs Vertical</span>
                <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">1, 2, 3-Wall Defects</span>
                <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">Osseous Craters 35.2%</span>
              </div>
            </div>

            {/* Lecture 4 Card */}
            <div
              onClick={() => setSelectedLecture('lec4')}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-850 transition cursor-pointer group space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-amber-950 text-amber-300 border border-amber-800">
                  LECTURE 4
                </span>
                <span className="text-xs text-slate-500 group-hover:text-amber-400 transition flex items-center gap-1">
                  Open Lecture <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition">
                Furcation Involvement, Occlusal Trauma, Systemic Links &amp; AI
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Glickman furcation Grades I–IV with Nabers probe probing, Primary vs. Secondary trauma from occlusion, Glickman codestruction vs. Waerhaug, systemic osteoporosis, and Deep Learning AI radiographic analysis.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] text-slate-400">
                <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">Glickman Grades I–IV</span>
                <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">Codestructive Theory</span>
                <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">AI Deep Learning 95%</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* LECTURE 1 MODULE */}
      {/* ========================================================================= */}
      {(selectedLecture === 'all' || selectedLecture === 'lec1') && (
        <section className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                  LECTURE 1
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Bone Loss Fundamentals, Equilibrium &amp; CAL vs PD Biomechanics
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Alveolar bone equilibrium, the episodic scar principle, and the biological difference between probing depth and attachment loss.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Topic Focus:</span>
              <span className="text-xs font-mono font-bold text-cyan-400 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
                Biomechanical Coupling
              </span>
            </div>
          </div>

          {/* Subpart 1A: Equilibrium Interactive Simulator */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5">
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">
                  1A. Bone Formation ↔ Resorption Equilibrium
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                In health, alveolar bone is in a dynamic equilibrium between formation (osteoblasts) and resorption (osteoclasts). In periodontitis, inflammatory factors tilt this balance: <strong className="text-rose-400">Resorption &gt; Formation = Net Bone Loss</strong>.
              </p>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-emerald-400">Formation (Osteoblasts)</span>
                  <span className="text-rose-400">Resorption (Osteoclasts)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formationResorptionBalance}
                  onChange={(e) => setFormationResorptionBalance(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>Balance: {100 - formationResorptionBalance}% vs {formationResorptionBalance}%</span>
                  <span className={formationResorptionBalance > 50 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {formationResorptionBalance > 50 ? 'Net Bone Loss Occurring' : 'Physiological Coupling'}
                  </span>
                </div>
              </div>

              {/* Episodic Scar Rule Callout */}
              <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-3 text-xs text-amber-200/90 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-amber-300">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> The Episodic Scar Principle (Lecture Fact)
                </span>
                <p className="text-[11px] leading-relaxed">
                  Existing bone loss represents the cumulative scars of <em>past episodic destruction</em>. It does <strong>NOT</strong> correlate directly with:
                </p>
                <ul className="list-disc list-inside text-[11px] space-y-0.5 text-amber-100">
                  <li>Probing pocket depth (which changes with tissue tone/edema)</li>
                  <li>Ulceration of the pocket wall (reversible micro-trauma)</li>
                  <li>Suppuration (indicates acute neutrophil influx, not net loss magnitude)</li>
                </ul>
              </div>
            </div>

            {/* Subpart 1B: Interactive CAL vs PD Anatomy Simulator */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    1B. CAL vs. PD Interactive Simulator
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Drag the soft tissue margin &amp; pocket base to see why CAL is the immutable truth.
                  </span>
                </div>
                <div className="flex gap-1">
                  {(['healthy', 'enlargement', 'recession', 'periodontitis'] as const).map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handleApplyPreset(preset)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition capitalize ${
                        selectedCasePreset === preset
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                          : 'bg-slate-800/80 text-slate-400 hover:text-white'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulator SVG and Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-6 bg-slate-950 border border-slate-800 rounded-xl p-2 flex justify-center">
                  <svg width="220" height={SVG_HEIGHT} viewBox="0 0 220 420" className="overflow-visible select-none">
                    {/* Tooth Root & Crown */}
                    <path
                      d="M 70 30 Q 110 20 150 30 L 140 160 Q 120 320 110 390 Q 100 320 80 160 Z"
                      fill="#e2e8f0"
                      stroke="#94a3b8"
                      strokeWidth="2"
                    />
                    {/* CEJ Anatomical Marker */}
                    <line x1="60" y1={CEJ_Y} x2="160" y2={CEJ_Y} stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 2" />
                    <text x="165" y={CEJ_Y + 4} fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">CEJ</text>

                    {/* Alveolar Bone Crest */}
                    <rect x="20" y={boneY} width="55" height={420 - boneY} fill="#475569" opacity="0.8" rx="4" />
                    <rect x="145" y={boneY} width="55" height={420 - boneY} fill="#475569" opacity="0.8" rx="4" />
                    <text x="25" y={boneY + 14} fill="#cbd5e1" fontSize="9" fontWeight="bold">BONE</text>

                    {/* Gingiva Soft Tissue */}
                    <path
                      d={`M 20 ${gmY} Q 50 ${gmY - 4} 70 ${gmY} L 75 ${pbY} L 20 ${pbY} Z`}
                      fill="#f43f5e"
                      opacity="0.4"
                    />
                    <line x1="20" y1={gmY} x2="70" y2={gmY} stroke="#f43f5e" strokeWidth="2.5" />
                    <text x="25" y={gmY - 6} fill="#fb7185" fontSize="10" fontWeight="bold">Gingival Margin</text>

                    {/* Pocket Base */}
                    <line x1="40" y1={pbY} x2="80" y2={pbY} stroke="#eab308" strokeWidth="2" strokeDasharray="2 2" />
                    <text x="15" y={pbY + 12} fill="#fde047" fontSize="9" fontWeight="bold">Pocket Base</text>

                    {/* Caliper: CAL (CEJ to Pocket Base) */}
                    <line x1="180" y1={CEJ_Y} x2="180" y2={pbY} stroke="#10b981" strokeWidth="3" />
                    <text x="185" y={(CEJ_Y + pbY) / 2 + 4} fill="#34d399" fontSize="11" fontWeight="bold">
                      CAL: {cal}mm
                    </text>

                    {/* Caliper: PD (Gingival Margin to Pocket Base) */}
                    <line x1="12" y1={gmY} x2="12" y2={pbY} stroke="#f59e0b" strokeWidth="3" />
                    <text x="16" y={(gmY + pbY) / 2 + 4} fill="#fbbf24" fontSize="10" fontWeight="bold">
                      PD: {pd}mm
                    </text>
                  </svg>
                </div>

                <div className="sm:col-span-6 space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">Gingival Margin Offset (relative to CEJ):</span>
                      <span className="font-mono text-cyan-400 font-bold">{gingivalMarginOffset > 0 ? `+${gingivalMarginOffset}mm (Coronal)` : `${gingivalMarginOffset}mm (Recession)`}</span>
                    </div>
                    <input
                      type="range"
                      min="-5"
                      max="5"
                      value={gingivalMarginOffset}
                      onChange={(e) => setGingivalMarginOffset(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">Pocket Base Depth from CEJ:</span>
                      <span className="font-mono text-amber-400 font-bold">{pocketBaseDepth} mm</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={pocketBaseDepth}
                      onChange={(e) => setPocketBaseDepth(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Probing Depth</span>
                      <span className="text-xl font-mono font-black text-amber-400">{pd} mm</span>
                      <span className="text-[9px] text-slate-500 block">GM to Pocket Base</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-emerald-900/50 text-center">
                      <span className="text-[10px] text-emerald-400 uppercase tracking-wider block">Clinical Attachment Loss</span>
                      <span className="text-xl font-mono font-black text-emerald-400">{cal} mm</span>
                      <span className="text-[9px] text-slate-500 block">CEJ to Pocket Base</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
                    <strong>Clinical Takeaway:</strong> In gingival enlargement, PD can be 5mm while CAL is 0mm (Pseudopocket). In recession, PD may be only 2mm while CAL is 5mm! Never rely solely on PD.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* LECTURE 2 MODULE */}
      {/* ========================================================================= */}
      {(selectedLecture === 'all' || selectedLecture === 'lec2') && (
        <section className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                  LECTURE 2
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Pathways of Inflammation, Cellular Mediators &amp; Radius of Action
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                The 3 anatomical routes of inflammatory spread, biochemical cytokine activation, the 1.5–2.5mm geometry rule, and Löe longitudinal rates.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Topic Focus:</span>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
                Spatial Histopathology
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pathway Selector */}
            <div className="space-y-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400" />
                2A. Three Anatomical Pathways of Spread
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Inflammation travels along neurovascular channels in loose connective tissue:
              </p>

              <div className="space-y-2">
                {[
                  { id: 'interproximal', label: 'Interproximal Pathway', desc: 'Gingiva → Vessel bundle → Bone marrow spaces → PDL' },
                  { id: 'facial', label: 'Facial (Labial/Buccal)', desc: 'Gingiva → Outer periosteum → Cortical plate → PDL' },
                  { id: 'lingual', label: 'Lingual / Palatal', desc: 'Gingiva → Periosteum → Dense lingual cortical bone' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActivePathway(item.id as any)}
                    className={`w-full text-left p-3 rounded-xl border transition ${
                      activePathway === item.id
                        ? 'bg-emerald-950/40 border-emerald-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between">
                      <span>{item.label}</span>
                      {activePathway === item.id && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{item.desc}</p>
                  </button>
                ))}
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300">
                <strong className="text-emerald-400">Key Fact:</strong> Inflammation enters bone marrow spaces <em>first</em> in interproximal areas because transseptal fiber bundles resist direct penetration. Entrance into the PDL occurs secondarily.
              </div>
            </div>

            {/* Radius of Action Simulator */}
            <div className="space-y-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Ruler className="w-4 h-4 text-amber-400" />
                2B. The Radius of Action (1.5mm – 2.5mm Rule)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Bacterial biofilm induces bone resorption strictly within a direct radius of <strong className="text-amber-400">1.5 mm to 2.5 mm</strong>. Beyond 2.5 mm, no bone resorption is induced!
              </p>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Interdental Septum Width:</span>
                  <span className="text-amber-400 font-mono font-bold">{interdentalWidth.toFixed(1)} mm</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="4.0"
                  step="0.1"
                  value={interdentalWidth}
                  onChange={(e) => setInterdentalWidth(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* Dynamic Geometry Output */}
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Resulting Bone Loss Pattern</span>
                {interdentalWidth <= 2.5 ? (
                  <div className="text-xs space-y-1">
                    <span className="text-rose-400 font-bold flex items-center gap-1.5">
                      <TrendingDown className="w-4 h-4" /> Horizontal Bone Loss
                    </span>
                    <p className="text-[11px] text-slate-400">
                      The interdental space is &le; 2.5 mm. The inflammatory radii from both adjacent tooth surfaces overlap completely across the narrow septum, destroying the entire bone width evenly.
                    </p>
                  </div>
                ) : (
                  <div className="text-xs space-y-1">
                    <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                      <Layers className="w-4 h-4" /> Vertical / Angular Defect
                    </span>
                    <p className="text-[11px] text-slate-400">
                      The space is &gt; 2.5 mm wide. The radius of action does NOT reach the center of the interdental septum. Bone resorbs adjacent to the root while central/opposite bone persists, forming an angular defect!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Rates of Destruction: Löe Study */}
            <div className="space-y-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                2C. Rates of Bone Loss (Löe 1986 Study)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                In untreated periodontitis (tea workers in Sri Lanka), progression was NOT uniform across all individuals:
              </p>

              <div className="space-y-2">
                {[
                  { id: 'rapid', percent: '8%', label: 'Rapid Progression (RP)', desc: 'Loss of 0.1 to 1.0 mm/year. Severe early tooth loss.' },
                  { id: 'moderate', percent: '81%', label: 'Moderate Progression (MP)', desc: 'Loss of 0.05 to 0.5 mm/year. Most typical cohort.' },
                  { id: 'none', percent: '11%', label: 'No Progression (NP)', desc: 'Loss of 0.05 to 0.09 mm/year. Minimal or no bone loss despite plaque.' }
                ].map((grp) => (
                  <div
                    key={grp.id}
                    onClick={() => setSelectedLoeGroup(grp.id as any)}
                    className={`p-2.5 rounded-xl border transition cursor-pointer ${
                      selectedLoeGroup === grp.id
                        ? 'bg-purple-950/40 border-purple-500'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-white">{grp.label}</span>
                      <span className="font-mono text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                        {grp.percent}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{grp.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* LECTURE 3 MODULE */}
      {/* ========================================================================= */}
      {(selectedLecture === 'all' || selectedLecture === 'lec3') && (
        <section className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold font-mono bg-purple-950 text-purple-300 border border-purple-800">
                  LECTURE 3
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Bone Loss Patterns, 1/2/3-Wall Defect Classifications &amp; Craters
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Goldman &amp; Cohen classification, osseous craters (35.2%), reverse architecture, ledging, and buttressing bone.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Topic Focus:</span>
              <span className="text-xs font-mono font-bold text-purple-400 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
                3D Osseous Morphology
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Defect Classification Selector */}
            <div className="lg:col-span-5 space-y-3 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                3A. Osseous Defect Classifications (Goldman &amp; Cohen)
              </h3>
              <p className="text-xs text-slate-300">
                Select a defect to inspect the remaining bony walls and regenerative prognosis:
              </p>

              <div className="space-y-2">
                {[
                  { id: 'three_wall', name: 'Three-Wall Defect (Intrabony)', walls: 3, regen: 'Excellent', notes: 'Surrounded by 3 osseous walls. Ideal for bone grafting and GTR.' },
                  { id: 'two_wall', name: 'Two-Wall Defect (Osseous Crater)', walls: 2, regen: 'Moderate', notes: 'Most common (35.2% of all defects, 62% in post. mandible). Concavity between buccal and lingual walls.' },
                  { id: 'one_wall', name: 'One-Wall Defect (Hemiseptum)', walls: 1, regen: 'Poor', notes: 'Only 1 wall remains (usually proximal). Resective osseous contouring frequently needed.' },
                  { id: 'combined', name: 'Combined Osseous Defect', walls: 'Mixed', regen: 'Variable', notes: '3-wall at apical base, transitions to 1- or 2-wall coronally.' },
                  { id: 'circumferential', name: 'Circumferential Defect', walls: 'Moat', regen: 'Guarded', notes: 'Continuous trough-like defect wrapping around 2+ tooth surfaces.' }
                ].map((def) => (
                  <button
                    key={def.id}
                    onClick={() => setActiveDefect3D(def.id as any)}
                    className={`w-full text-left p-3 rounded-xl border transition ${
                      activeDefect3D === def.id
                        ? 'bg-purple-950/40 border-purple-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-white">{def.name}</span>
                      <span className="font-mono text-purple-300 text-[10px] bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                        {def.walls} {typeof def.walls === 'number' ? 'Walls' : ''}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{def.notes}</p>
                    <span className="text-[10px] text-emerald-400 font-semibold block mt-1">
                      Regenerative Potential: {def.regen}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Embedded 3D Canvas */}
            <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Boxes className="w-4 h-4 text-purple-400" />
                  Real-time 3D Osseous Defect Inspection
                </span>
                <span className="text-[11px] font-mono text-slate-400">Drag to rotate • Pinch to zoom</span>
              </div>

              <div className="h-80 w-full rounded-xl overflow-hidden my-2 bg-slate-900">
                <BoneLoss3DCanvas
                  defectType={activeDefect3D}
                  height="320px"
                  showControls={true}
                  highlightWalls={true}
                />
              </div>

              {/* Numerical Facts Callout from Lecture */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
                <div className="bg-slate-900 p-2 rounded-xl">
                  <span className="text-[9px] text-slate-400 block font-medium">Crater Frequency</span>
                  <span className="text-sm font-black text-purple-400">35.2%</span>
                  <span className="text-[8px] text-slate-500">Of all defects</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-xl">
                  <span className="text-[9px] text-slate-400 block font-medium">Mandibular Involvement</span>
                  <span className="text-sm font-black text-cyan-400">62.0%</span>
                  <span className="text-[8px] text-slate-500">Twice as common</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-xl">
                  <span className="text-[9px] text-slate-400 block font-medium">Posterior vs Anterior</span>
                  <span className="text-sm font-black text-emerald-400">2 : 1 Ratio</span>
                  <span className="text-[8px] text-slate-500">Posterior dominates</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* LECTURE 4 MODULE */}
      {/* ========================================================================= */}
      {(selectedLecture === 'all' || selectedLecture === 'lec4') && (
        <section className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold font-mono bg-amber-950 text-amber-300 border border-amber-800">
                  LECTURE 4
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Furcation Involvement, Occlusal Trauma, Systemic Links &amp; AI
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Glickman furcation classification with Nabers probe, primary vs. secondary TFO &amp; codestruction, systemic modifiers, and Deep Learning AI.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Topic Focus:</span>
              <span className="text-xs font-mono font-bold text-amber-400 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
                Advanced Clinical &amp; Machine Learning
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Furcation Simulator */}
            <div className="space-y-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400" />
                4A. Glickman Furcation Classification
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Examined with curved <strong className="text-emerald-400">Nabers Probe #2</strong> on multi-rooted molars and maxillary premolars:
              </p>

              <div className="space-y-2">
                {[
                  { id: 'grade1', grade: 'Grade I', label: 'Incipient', desc: 'Flute engagement; suprabony pocket, catch of probe flute.' },
                  { id: 'grade2', grade: 'Grade II', label: 'Cul-de-sac', desc: 'Horizontal penetration into furcation, but NOT through-and-through.' },
                  { id: 'grade3', grade: 'Grade III', label: 'Through-and-Through', desc: 'Complete subgingival through-and-through communication covered by gingiva.' },
                  { id: 'grade4', grade: 'Grade IV', label: 'Clinically Open', desc: 'Through-and-through tunnel clearly visible due to gingival recession.' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setFurcationGrade(item.id as any)}
                    className={`w-full text-left p-2.5 rounded-xl border transition ${
                      furcationGrade === item.id
                        ? 'bg-emerald-950/40 border-emerald-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-white">{item.grade}: {item.label}</span>
                      {furcationGrade === item.id && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Occlusal Trauma & Codestruction */}
            <div className="space-y-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-400" />
                4B. Trauma From Occlusion &amp; Codestruction
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Distinction between pure TFO vs. TFO in the presence of bacterial plaque:
              </p>

              <div className="space-y-2">
                <button
                  onClick={() => setTfoPlaqueState('tfo_only')}
                  className={`w-full text-left p-3 rounded-xl border transition ${
                    tfoPlaqueState === 'tfo_only'
                      ? 'bg-blue-950/40 border-blue-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="font-bold text-xs text-white block">TFO Alone (No Plaque)</span>
                  <span className="text-[11px] text-slate-400 block mt-1">
                    Widened PDL, tooth mobility, buttressing bone. Does <strong>NOT</strong> cause pocket formation or attachment loss!
                  </span>
                </button>

                <button
                  onClick={() => setTfoPlaqueState('tfo_plus_plaque')}
                  className={`w-full text-left p-3 rounded-xl border transition ${
                    tfoPlaqueState === 'tfo_plus_plaque'
                      ? 'bg-rose-950/40 border-rose-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="font-bold text-xs text-white block">Glickman's Codestructive Factor (+ Plaque)</span>
                  <span className="text-[11px] text-slate-400 block mt-1">
                    Zone of irritation meets Zone of codestruction. Inflammation is directed straight into PDL &rarr; Rapid vertical defects.
                  </span>
                </button>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300">
                <strong className="text-rose-400">Primary vs Secondary TFO:</strong> Primary = excessive occlusal forces on healthy support. Secondary = normal or excessive forces on <em>reduced</em> periodontal support.
              </div>
            </div>

            {/* AI in Periodontology Deep Learning */}
            <div className="space-y-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Brain className="w-4 h-4 text-cyan-400" />
                4C. AI in Periodontal Diagnosis
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Convolutional Neural Networks (CNNs) trained on periapical &amp; bitewing radiographs:
              </p>

              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-semibold">Model Segmentation IoU:</span>
                  <span className="font-mono text-cyan-400 font-bold">{aiScanConfidence}% Accuracy</span>
                </div>

                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full" style={{ width: `${aiScanConfidence}%` }} />
                </div>

                <div className="space-y-1.5 pt-1 text-[11px] text-slate-300">
                  <div className="flex justify-between">
                    <span>Automated CEJ Identification:</span>
                    <span className="text-emerald-400 font-bold">96.2% Precision</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bone Level Crest Measurement:</span>
                    <span className="text-cyan-400 font-bold">&plusmn;0.25 mm Error</span>
                  </div>
                  <div className="flex justify-between">
                    <span>EFP Stage III/IV Recommendation:</span>
                    <span className="text-purple-400 font-bold">92.8% Agreement</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <strong className="text-cyan-300">Clinical Decision Support:</strong> AI augments the clinician by standardizing bone loss percent calculation across quadrants, but cannot replace manual probing for BOP, mobility, or furcation catch!
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Bottom Action Footer for Students */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white">Periodontics by Kareem • Comprehensive Study Complete</h4>
          <p className="text-xs text-slate-400">Ready to test your knowledge or explore 3D tooth models?</p>
        </div>
        {onNavigateTab && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('laboratory')}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-600/20 transition"
            >
              <Boxes className="w-4 h-4" />
              <span>Launch 3D Laboratory</span>
            </button>
            <button
              onClick={() => onNavigateTab('quiz')}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-600/20 transition"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Take Board Exam Quiz</span>
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
