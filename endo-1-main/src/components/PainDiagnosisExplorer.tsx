import React, { useState, useMemo } from 'react';
import { ExtendedPainDiagnosisRow, ClinicalTestType } from '../types/endodontics';
import { EXTENDED_PAIN_DIAGNOSIS_DATA, NERVES_INFO } from '../data/lectureData';
import {
  PARAMETER_MNEMONICS,
  NERVE_MNEMONICS,
  DIAGNOSIS_MNEMONICS,
  getNerveTooltip,
  getParameterTooltip,
  getDiagnosisTooltip,
  TooltipMnemonicData,
} from '../data/painMnemonics';
import {
  HeartPulse,
  Zap,
  Flame,
  Snowflake,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Activity,
  Layers,
  Sparkles,
  ArrowRight,
  BookOpen,
  Award,
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  HelpCircle,
  ShieldCheck,
  Stethoscope,
  GitBranch,
  Play,
  RotateCcw,
  Box,
  Compass,
  Lightbulb,
  Check,
  Info,
  X,
  Eye,
  Sliders,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { HydrodynamicTubuleLab } from './HydrodynamicTubuleLab';
import { IntrapulpalPressureChamber } from './IntrapulpalPressureChamber';

interface PainDiagnosisExplorerProps {
  onSimulateIn3D?: (testType: ClinicalTestType) => void;
}

function mapTestNameToType(testName: string): ClinicalTestType {
  const lower = testName.toLowerCase();
  if (lower.includes('cold')) return 'cold';
  if (lower.includes('heat')) return 'heat';
  if (lower.includes('bite') || lower.includes('slooth')) return 'bite_test';
  if (lower.includes('percussion') || lower.includes('tap')) return 'percussion_vertical';
  if (lower.includes('electric') || lower.includes('ept')) return 'ept';
  if (lower.includes('transillumination')) return 'transillumination';
  if (lower.includes('sinus')) return 'sinus_tracing';
  if (lower.includes('anesthesia')) return 'selective_anesthesia';
  if (lower.includes('probing') || lower.includes('mobility')) return 'mobility';
  return 'cold';
}

interface ClinicalTooltipProps {
  title?: string;
  badge?: string;
  badgeColor?: string;
  mnemonic?: string;
  clinicalContext?: string;
  keyRule?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top' | 'bottom';
  children: React.ReactNode;
  className?: string;
}

export const ClinicalTooltip: React.FC<ClinicalTooltipProps> = ({
  children,
  className = '',
}) => {
  return <div className={`inline-flex items-center ${className}`}>{children}</div>;
};

export const PainDiagnosisExplorer: React.FC<PainDiagnosisExplorerProps> = ({
  onSimulateIn3D,
}) => {
  // Navigation tabs inside the Pain & Diagnosis Matrix
  const [activeSubTab, setActiveSubTab] = useState<'matrix' | 'tree' | 'mechanisms' | 'nerves' | 'table' | 'trainer'>('matrix');
  const [activeMechanismView, setActiveMechanismView] = useState<'tubule' | 'pressure' | 'cards'>('tubule');
  const [isNerveRaceRunning, setIsNerveRaceRunning] = useState<boolean>(false);
  const [nerveRaceProgress, setNerveRaceProgress] = useState<number>(0);
  const [selectedParameter, setSelectedParameter] = useState<string>('all');
  const [selectedNerveFilter, setSelectedNerveFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedCardId, setExpandedCardId] = useState<string | null>('stim_cold');
  const [alwaysShowMnemonics, setAlwaysShowMnemonics] = useState<boolean>(false);
  const [isMnemonicModalOpen, setIsMnemonicModalOpen] = useState<boolean>(false);

  // Decision Tree State
  const [treeStep, setTreeStep] = useState<number>(1);
  const [treeLocation, setTreeLocation] = useState<'localized' | 'diffuse' | null>(null);
  const [treeDuration, setTreeDuration] = useState<'momentary' | 'lingering' | 'spontaneous' | null>(null);
  const [treeStimulus, setTreeStimulus] = useState<'cold' | 'heat' | 'mastication' | 'sweet' | 'night' | null>(null);

  // Trainer state
  const [trainerIndex, setTrainerIndex] = useState<number>(0);
  const [trainerSelectedReason, setTrainerSelectedReason] = useState<string | null>(null);
  const [trainerSelectedDiag, setTrainerSelectedDiag] = useState<string | null>(null);
  const [trainerSubmitted, setTrainerSubmitted] = useState<boolean>(false);
  const [trainerScore, setTrainerScore] = useState<number>(0);

  // Nerve Conduction Animation Effect
  React.useEffect(() => {
    let animTimer: ReturnType<typeof setInterval>;
    if (isNerveRaceRunning) {
      animTimer = setInterval(() => {
        setNerveRaceProgress((prev) => {
          if (prev >= 100) {
            setIsNerveRaceRunning(false);
            return 100;
          }
          return prev + 2;
        });
      }, 30);
    }
    return () => clearInterval(animTimer);
  }, [isNerveRaceRunning]);

  // Filter items
  const filteredItems = EXTENDED_PAIN_DIAGNOSIS_DATA.filter((item) => {
    const matchesParam =
      selectedParameter === 'all' || item.parameter.toLowerCase() === selectedParameter.toLowerCase();
    const matchesNerve =
      selectedNerveFilter === 'all' || item.nerveInvolved.toLowerCase().includes(selectedNerveFilter.toLowerCase());
    const matchesSearch =
      item.typeOfPain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.reasonForPain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.provisionalDiagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.patientQuote.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.mnemonicTip && item.mnemonicTip.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesParam && matchesNerve && matchesSearch;
  });

  const currentTrainerScenario = EXTENDED_PAIN_DIAGNOSIS_DATA[trainerIndex % EXTENDED_PAIN_DIAGNOSIS_DATA.length];

  const trainerReasonOptions = useMemo(() => {
    const correct = currentTrainerScenario.reasonForPain;
    const pool = [
      'Vasodilatation caused by thermal expansion stimulating deep C-fibers',
      'Presence of proprioceptive A-β fibers present in periodontal ligament',
      'Transient outward dentinal fluid flow during stimulus only',
      'Intrapulpal pressure elevation exceeding capillary perfusion pressure',
      'Cephalic blood pressure elevation in horizontal position expanding congested pulpal tissue',
    ].filter((r) => r !== correct);

    const distractor1 = pool[trainerIndex % pool.length];
    const distractor2 = pool[(trainerIndex + 2) % pool.length];
    const combined = [correct, distractor1, distractor2].filter((v, i, a) => a.indexOf(v) === i);
    return combined.sort((a, b) => a.localeCompare(b));
  }, [trainerIndex, currentTrainerScenario.reasonForPain]);

  const trainerDiagOptions = useMemo(() => {
    const correct = currentTrainerScenario.provisionalDiagnosis;
    const pool = [
      'Reversible pulpitis',
      'Irreversible pulpitis',
      'Periodontal pain / Apical periodontitis',
      'Cracked tooth syndrome',
      'Partial necrosis',
      'Dentin hypersensitivity',
    ].filter((d) => d !== correct);

    const distractors = [pool[trainerIndex % pool.length], pool[(trainerIndex + 1) % pool.length], pool[(trainerIndex + 3) % pool.length]];
    const combined = [correct, ...distractors].filter((v, i, a) => a.indexOf(v) === i);
    return combined.sort((a, b) => a.localeCompare(b));
  }, [trainerIndex, currentTrainerScenario.provisionalDiagnosis]);

  const handleTrainerSubmit = () => {
    if (!trainerSelectedReason || !trainerSelectedDiag) return;
    const isReasonCorrect = trainerSelectedReason === currentTrainerScenario.reasonForPain;
    const isDiagCorrect = trainerSelectedDiag === currentTrainerScenario.provisionalDiagnosis;

    if (isReasonCorrect && isDiagCorrect) {
      setTrainerScore((prev) => prev + 1);
      confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } });
    }
    setTrainerSubmitted(true);
  };

  const handleNextTrainer = () => {
    setTrainerIndex((prev) => prev + 1);
    setTrainerSelectedReason(null);
    setTrainerSelectedDiag(null);
    setTrainerSubmitted(false);
  };

  const resetDecisionTree = () => {
    setTreeStep(1);
    setTreeLocation(null);
    setTreeDuration(null);
    setTreeStimulus(null);
  };

  // Determine decision tree matched diagnosis
  const getTreeDiagnosis = () => {
    if (treeLocation === 'localized') {
      return EXTENDED_PAIN_DIAGNOSIS_DATA.find((d) => d.id === 'loc_pdl_localized');
    }
    if (treeStimulus === 'mastication') {
      return EXTENDED_PAIN_DIAGNOSIS_DATA.find((d) => d.id === 'nat_mastication_rebound');
    }
    if (treeStimulus === 'night') {
      return EXTENDED_PAIN_DIAGNOSIS_DATA.find((d) => d.id === 'stim_lying_down_night');
    }
    if (treeStimulus === 'sweet') {
      return EXTENDED_PAIN_DIAGNOSIS_DATA.find((d) => d.id === 'stim_sweet_sour');
    }
    if (treeDuration === 'momentary' || treeStimulus === 'cold') {
      return EXTENDED_PAIN_DIAGNOSIS_DATA.find((d) => d.id === 'dur_momentary');
    }
    if (treeDuration === 'spontaneous' || treeDuration === 'lingering' || treeStimulus === 'heat') {
      return EXTENDED_PAIN_DIAGNOSIS_DATA.find((d) => d.id === 'stim_heat');
    }
    return EXTENDED_PAIN_DIAGNOSIS_DATA.find((d) => d.id === 'loc_pulp_diffuse');
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-100 overflow-y-auto">
      {/* Explorer Top Banner */}
      <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 sticky top-0 z-20 backdrop-blur-md shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 p-[1.5px] shadow-lg shadow-rose-500/25">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-rose-400">
                <HeartPulse className="w-6 h-6 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-extrabold tracking-wide font-mono text-slate-100">
                  The Symptom (Type of Pain) • The Biology (Reason for Pain) • Provisional Diagnosis
                </h2>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-rose-950/90 text-rose-300 border border-rose-800 font-bold uppercase shadow-sm">
                  Lecture 1 • Page 2 Core
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Interactive correlator: <strong className="text-cyan-400">The Symptom</strong> (Type of Pain) ➔ <strong className="text-amber-400">The Biology</strong> (Reason for Pain) ➔ <strong className="text-emerald-400">Provisional Diagnosis</strong>
              </p>
            </div>
          </div>

          {/* Quick Actions & Cheat-Sheet */}
          <div className="flex flex-wrap items-center gap-2 max-w-full">
            <button
              onClick={() => setIsMnemonicModalOpen(true)}
              className="px-3 py-2 rounded-xl text-xs font-mono font-bold bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-600/60 transition-all flex items-center gap-1.5 shadow-sm hover:shadow-amber-500/20 shrink-0"
            >
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Mnemonics Cheat-Sheet</span>
            </button>

            {/* Sub-Navigation Tabs */}
            <div className="flex items-center gap-1 bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800 text-xs shadow-inner overflow-x-auto max-w-full">
              <button
                onClick={() => setActiveSubTab('matrix')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl font-semibold transition-all shrink-0 whitespace-nowrap ${
                  activeSubTab === 'matrix'
                    ? 'bg-gradient-to-r from-rose-500 to-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>3-Column Flow Matrix</span>
              </button>

              <button
                onClick={() => setActiveSubTab('tree')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl font-semibold transition-all shrink-0 whitespace-nowrap ${
                  activeSubTab === 'tree'
                    ? 'bg-gradient-to-r from-rose-500 to-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <GitBranch className="w-4 h-4" />
                <span>Interactive Decision Tree</span>
              </button>

              <button
                onClick={() => setActiveSubTab('mechanisms')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl font-semibold transition-all shrink-0 whitespace-nowrap ${
                  activeSubTab === 'mechanisms'
                    ? 'bg-gradient-to-r from-rose-500 to-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Biophysical Labs &amp; Mechanisms</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                  2 Labs
                </span>
              </button>

              <button
                onClick={() => setActiveSubTab('nerves')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl font-semibold transition-all shrink-0 whitespace-nowrap ${
                  activeSubTab === 'nerves'
                    ? 'bg-gradient-to-r from-rose-500 to-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>Nerve Fibers (Aδ / C / Aβ)</span>
              </button>

              <button
                onClick={() => setActiveSubTab('table')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl font-semibold transition-all shrink-0 whitespace-nowrap ${
                  activeSubTab === 'table'
                    ? 'bg-gradient-to-r from-rose-500 to-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Slide Table</span>
              </button>

              <button
                onClick={() => setActiveSubTab('trainer')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl font-semibold transition-all shrink-0 whitespace-nowrap ${
                  activeSubTab === 'trainer'
                    ? 'bg-gradient-to-r from-rose-500 to-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Trainer &amp; Drill</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar for Matrix & Table */}
        {(activeSubTab === 'matrix' || activeSubTab === 'table') && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
            {/* Search Input */}
            <div className="relative min-w-[280px]">
              <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search symptom, fluid, diagnosis, nerve, mnemonic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            {/* Parameter Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold mr-1">
                Parameter:
              </span>
              {['all', 'location', 'duration', 'nature', 'stimulus'].map((param) => (
                <button
                  key={param}
                  onClick={() => setSelectedParameter(param)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs uppercase font-semibold transition-all ${
                    selectedParameter === param
                      ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {param}
                </button>
              ))}
            </div>

            {/* Nerve Filters */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold mr-1">
                Nerve:
              </span>
              {[
                { id: 'all', label: 'All Nerves' },
                { id: 'delta', label: 'A-delta (Aδ)', color: 'text-cyan-400' },
                { id: 'c-fiber', label: 'C-Fibers', color: 'text-rose-400' },
                { id: 'beta', label: 'A-beta (PDL)', color: 'text-purple-400' },
              ].map((n) => (
                <button
                  key={n.id}
                  onClick={() => setSelectedNerveFilter(n.id)}
                  className={`px-2.5 py-1.5 rounded-xl font-mono text-xs font-semibold transition-all ${
                    selectedNerveFilter === n.id
                      ? 'bg-rose-500 text-slate-950 shadow-sm font-bold'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {n.label}
                </button>
              ))}
            </div>

            {/* Always Show Mnemonics Toggle */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800 text-xs font-mono text-slate-300">
              <button
                onClick={() => setAlwaysShowMnemonics(!alwaysShowMnemonics)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all text-xs ${
                  alwaysShowMnemonics
                    ? 'bg-amber-950/80 border-amber-500/80 text-amber-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Lightbulb className={`w-3.5 h-3.5 ${alwaysShowMnemonics ? 'text-amber-400 fill-amber-400' : ''}`} />
                <span>Pin Mnemonics</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main View Area */}
      <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* ========================================================================= */}
        {/* SUB-TAB 1: 3-COLUMN FLOW MATRIX (TYPE OF PAIN → REASON → PROVISIONAL DIAGNOSIS) */}
        {/* ========================================================================= */}
        {activeSubTab === 'matrix' && (
          <div className="space-y-6">
            {/* Visual Guide Header */}
            <div className="p-4 rounded-3xl bg-slate-900/80 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-2xl bg-cyan-950/80 text-cyan-400 border border-cyan-800">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                    <span>The 3 Pillars of Endodontic Pain Diagnosis (Lecture 1)</span>
                    <span className="text-[10px] text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-800 font-normal">
                      Click cards for live biophysics
                    </span>
                  </h4>
                  <p className="text-xs text-slate-300">
                    Click any card to expand deep biophysical simulations, test recommendations, and treatment protocols. Open <strong className="text-slate-100">Mnemonics Cheat-Sheet</strong> or toggle <strong className="text-slate-100">Pin Mnemonics</strong> for quick reference.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Type of Pain
                <span className="text-slate-600">➔</span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Reason for Pain
                <span className="text-slate-600">➔</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Provisional Diagnosis
              </div>
            </div>

            {/* List of 3-Column Interactive Cards */}
            <div className="space-y-4">
              {filteredItems.map((item) => {
                const isExpanded = expandedCardId === item.id;
                const isADelta = item.nerveInvolved.includes('A-delta');
                const isCFiber = item.nerveInvolved.includes('C-fiber');
                const isABeta = item.nerveInvolved.includes('A-beta');

                const paramTooltip = getParameterTooltip(item.parameter);
                const nerveTooltip = getNerveTooltip(item.nerveInvolved);
                const diagTooltip = getDiagnosisTooltip(item.provisionalDiagnosis);

                return (
                  <div
                    key={item.id}
                    className={`rounded-3xl border transition-all ${
                      isExpanded
                        ? 'bg-slate-900/95 border-cyan-500/70 shadow-2xl ring-1 ring-cyan-500/40'
                        : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80'
                    }`}
                  >
                    {/* Main 3-Column Row Container */}
                    <div
                      onClick={() => setExpandedCardId(isExpanded ? null : item.id)}
                      className="p-5 cursor-pointer select-none grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                    >
                      {/* Column 1: TYPE OF PAIN (4 cols) */}
                      <div className="md:col-span-4 space-y-2 border-b md:border-b-0 md:border-r border-slate-800/80 pb-3 md:pb-0 md:pr-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Parameter */}
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 uppercase font-semibold border border-slate-700/60 flex items-center gap-1">
                            {item.parameter}
                          </span>

                          {/* Nerve involved */}
                          <span
                            className={`text-[10px] font-mono px-2.5 py-0.5 rounded-md font-bold border flex items-center gap-1 shadow-sm ${
                              isADelta
                                ? 'bg-cyan-950 text-cyan-300 border-cyan-800/80'
                                : isCFiber
                                  ? 'bg-rose-950 text-rose-300 border-rose-800/80'
                                  : 'bg-purple-950 text-purple-300 border-purple-800/80'
                            }`}
                          >
                            <Zap className="w-2.5 h-2.5 opacity-80" />
                            <span>{item.nerveInvolved}</span>
                          </span>
                        </div>

                        {/* Title */}
                        <div className="flex items-start gap-1.5">
                          <h3 className="text-sm font-bold text-slate-100 leading-snug group-hover:text-cyan-300 transition-colors">
                            {item.typeOfPain}
                          </h3>
                        </div>

                        {/* Patient Voice Quote */}
                        <p className="text-[11px] text-slate-400 italic line-clamp-1">
                          “{item.patientQuote}”
                        </p>

                        {/* Persistent Mnemonic Banner (If toggled on) */}
                        {alwaysShowMnemonics && item.mnemonicTip && (
                          <div className="p-2 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-[10px] flex items-center gap-1.5 font-sans">
                            <Lightbulb className="w-3 h-3 text-amber-400 shrink-0" />
                            <span><strong>Mnemonic:</strong> {item.mnemonicTip}</span>
                          </div>
                        )}
                      </div>

                      {/* Column 2: REASON FOR PAIN (5 cols) */}
                      <div className="md:col-span-5 space-y-1.5 border-b md:border-b-0 md:border-r border-slate-800/80 pb-3 md:pb-0 md:pr-4">
                        <span className="text-[10px] font-mono text-amber-400 uppercase font-bold flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          Biological Reason:
                        </span>
                        <p className="text-xs text-slate-200 leading-relaxed font-medium">
                          {item.reasonForPain}
                        </p>
                        {item.clinicalTip && (
                          <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                            <span className="text-cyan-400 font-bold">🩺 Tip:</span>
                            <span className="line-clamp-1">{item.clinicalTip}</span>
                          </div>
                        )}
                      </div>

                      {/* Column 3: PROVISIONAL DIAGNOSIS (3 cols) */}
                      <div className="md:col-span-3 flex flex-col justify-between space-y-2">
                        <div>
                          <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block mb-1">
                            Provisional Diagnosis:
                          </span>
                          <div className="text-xs font-mono font-extrabold text-emerald-400 px-3 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-800/60 shadow-sm leading-tight inline-flex items-center gap-1.5">
                            <span>{item.provisionalDiagnosis}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] font-mono text-slate-400">
                            {isExpanded ? 'Hide Deep Dive' : 'Expand Deep Dive'}
                          </span>
                          <div className="p-1 rounded-lg bg-slate-800 text-slate-300">
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* EXPANDED MASTERCLASS BREAKDOWN & LIVE ANIMATION */}
                    {isExpanded && (
                      <div className="p-5 border-t border-slate-800/80 bg-slate-950/70 space-y-4 animate-fadeIn rounded-b-3xl">
                        {/* Dedicated Mnemonic Card */}
                        {item.mnemonicTip && (
                          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/80 via-slate-950 to-slate-950 border border-amber-500/50 flex items-start gap-3 shadow-md">
                            <div className="p-2 rounded-xl bg-amber-900/60 text-amber-300 shrink-0 border border-amber-600/40">
                              <Lightbulb className="w-5 h-5 text-amber-400" />
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
                                Quick Clinical Mnemonic &amp; Diagnostic Pearl:
                              </span>
                              <div className="text-xs font-bold text-amber-100">
                                “{item.mnemonicTip}”
                              </div>
                              <p className="text-[11px] text-slate-300 mt-1">
                                {item.clinicalTip || item.reasonForPain}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Interactive Animation Box */}
                        <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-2.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-mono font-bold text-cyan-300 flex items-center gap-1.5 uppercase text-[10px]">
                              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                              Simulated Neuro-Biophysical Process:
                            </span>
                            <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">
                              Live Dynamic Simulation
                            </span>
                          </div>

                          {/* Dynamic SVG / Canvas Animation */}
                          <div className="h-32 w-full bg-slate-900/90 rounded-2xl border border-slate-800 relative overflow-hidden flex items-center justify-center p-3">
                            {item.animationType === 'cold_fluid' && (
                              <div className="relative w-full h-full flex flex-col justify-center items-center">
                                <div className="text-[11px] font-mono text-cyan-400 mb-2 font-bold">
                                  ❄️ Brännström Hydrodynamic Contraction: Rapid Outward Stream (2-3 mm/s)
                                </div>
                                <div className="w-full flex items-center justify-between px-6">
                                  <div className="text-[10px] font-mono text-slate-400">Pulp Core (Aδ)</div>
                                  <div className="flex-1 mx-4 h-4 bg-slate-950 rounded-full overflow-hidden relative border border-cyan-500/40">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400 to-transparent w-1/3 animate-[pulse_1s_infinite] translate-x-full" />
                                    <div className="flex justify-around items-center h-full text-[9px] font-mono text-cyan-200">
                                      ← ← Outward Dentinal Stream ← ←
                                    </div>
                                  </div>
                                  <div className="text-[10px] font-mono text-cyan-300 font-bold">Cold Surface</div>
                                </div>
                              </div>
                            )}

                            {item.animationType === 'heat_expansion' && (
                              <div className="relative w-full h-full flex flex-col justify-center items-center">
                                <div className="text-[11px] font-mono text-rose-400 mb-2 font-bold">
                                  🔥 Thermal Expansion in Rigid Low-Compliance Chamber → C-Fiber Ischemia
                                </div>
                                <div className="w-full flex items-center justify-between px-6">
                                  <div className="w-12 h-12 rounded-full bg-rose-950/80 border-2 border-rose-500 animate-ping flex items-center justify-center text-xs font-mono text-rose-300">
                                    🔥
                                  </div>
                                  <div className="flex-1 mx-4 text-center">
                                    <div className="text-[11px] font-mono font-bold text-rose-300">
                                      Intrapulpal Tissue Pressure &gt; 35 mmHg
                                    </div>
                                    <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden mt-1 border border-rose-500/40">
                                      <div className="h-full bg-rose-500 animate-pulse w-4/5" />
                                    </div>
                                  </div>
                                  <div className="text-[10px] font-mono text-rose-400 text-right font-bold">
                                    Deep C-Fibers Aching
                                  </div>
                                </div>
                              </div>
                            )}

                            {item.animationType === 'crack_flexion' && (
                              <div className="relative w-full h-full flex flex-col justify-center items-center">
                                <div className="text-[11px] font-mono text-amber-400 mb-2 font-bold">
                                  🦷 Fractured Cusp Flexion &amp; Sudden Rebound Turbulence on Release
                                </div>
                                <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
                                  <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700">
                                    Biting Down: Cusp Separates
                                  </span>
                                  <span className="text-cyan-400 font-bold animate-pulse text-base">➔</span>
                                  <span className="px-3 py-1.5 rounded-xl bg-rose-950 border border-rose-500 text-rose-300 font-bold">
                                    RELEASE: Sudden Rebound Shock!
                                  </span>
                                </div>
                              </div>
                            )}

                            {item.animationType === 'pdl_pressure' && (
                              <div className="relative w-full h-full flex flex-col justify-center items-center">
                                <div className="text-[11px] font-mono text-purple-400 mb-2 font-bold">
                                  🎯 A-beta (Aβ) Periodontal Mechanoreceptors Localizing Point
                                </div>
                                <div className="flex items-center gap-6">
                                  <div className="w-12 h-12 rounded-full border-2 border-purple-500 animate-spin flex items-center justify-center font-bold text-purple-300">
                                    Aβ
                                  </div>
                                  <div className="text-xs font-mono text-slate-300">
                                    Hydrodynamic shockwave in PDL space provides exact pinpoint tooth coordinates!
                                  </div>
                                </div>
                              </div>
                            )}

                            {item.animationType === 'night_cephalic' && (
                              <div className="relative w-full h-full flex flex-col justify-center items-center">
                                <div className="text-[11px] font-mono text-indigo-400 mb-2 font-bold">
                                  🌙 Supine Gravity Loss: Cephalic Blood Pressure Surge (+10–15 mmHg)
                                </div>
                                <div className="flex items-center gap-4 text-xs font-mono text-indigo-300">
                                  <span>Standing (Venous Drainage Assisted)</span>
                                  <span className="font-bold text-rose-400">➔ Laying Down:</span>
                                  <span className="font-bold text-rose-300 animate-pulse bg-rose-950 px-2.5 py-1 rounded-xl border border-rose-800">
                                    Severe Night Throbbing
                                  </span>
                                </div>
                              </div>
                            )}

                            {item.animationType === 'diffuse_pulp' && (
                              <div className="relative w-full h-full flex flex-col justify-center items-center">
                                <div className="text-[11px] font-mono text-slate-400 mb-2 font-bold">
                                  🧠 Trigeminal Nucleus Convergence: Zero Mechanoreceptors in Pulp Core
                                </div>
                                <div className="text-xs font-mono text-slate-300 text-center">
                                  Sensory signals from multiple upper/lower quadrant teeth project into same subnucleus zone
                                </div>
                              </div>
                            )}

                            {item.animationType === 'osmotic_sour' && (
                              <div className="relative w-full h-full flex flex-col justify-center items-center">
                                <div className="text-[11px] font-mono text-amber-400 mb-2 font-bold">
                                  🍋 Osmotic Hypertonic Gradient Across Exposed Odontoblastic Tubules
                                </div>
                                <div className="text-xs font-mono text-slate-300 text-center">
                                  Sugar/Acid draws dentinal water outward instantly across exposed CEJ tubules
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Detailed Biological Mechanism */}
                        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                          <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block">
                            Full Clinical Physiology Explanation:
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">
                            {item.mechanismDetail}
                          </p>
                        </div>

                        {/* Tests to Confirm & Treatment Action */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                              Diagnostic Tests to Confirm (Lecture 1):
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {item.recommendedTests.map((t, i) => {
                                const targetTestType = mapTestNameToType(t);
                                return (
                                  <button
                                    key={i}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (onSimulateIn3D) onSimulateIn3D(targetTestType);
                                    }}
                                    className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-cyan-950 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/60 text-slate-200 transition-colors flex items-center gap-1.5"
                                  >
                                    <Play className="w-3 h-3 text-cyan-400" />
                                    <span>{t}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                            <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block">
                              Recommended Clinical Action / Pathway:
                            </span>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {item.treatmentPathway}
                            </p>
                            {onSimulateIn3D && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const targetTestType = mapTestNameToType(item.recommendedTests[0] || 'cold');
                                  onSimulateIn3D(targetTestType);
                                }}
                                className="mt-2 w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                              >
                                <Box className="w-3.5 h-3.5" />
                                Simulate Primary Test in 3D Blueprint
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-TAB 2: INTERACTIVE DIAGNOSTIC DECISION TREE (STEP-BY-STEP FLOWCHART) */}
        {/* ========================================================================= */}
        {activeSubTab === 'tree' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-cyan-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-cyan-950 text-cyan-400 border border-cyan-800">
                  <GitBranch className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 font-mono text-sm">
                    Interactive Endodontic Decision Tree
                  </h3>
                  <p className="text-xs text-slate-400">
                    Follow clinical reasoning step-by-step to arrive at the provisional diagnosis
                  </p>
                </div>
              </div>
              <button
                onClick={resetDecisionTree}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Tree
              </button>
            </div>

            {/* Step 1: Location */}
            <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 font-mono font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h4 className="text-sm font-bold text-slate-100 font-mono uppercase">
                  Where is the pain located?
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setTreeLocation('localized');
                    setTreeStep(2);
                  }}
                  className={`w-full p-4 rounded-2xl border text-left transition-all ${
                    treeLocation === 'localized'
                      ? 'bg-purple-950/80 border-purple-500 text-purple-200 ring-1 ring-purple-500'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs text-purple-300 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Localized (Patient points to single tooth)
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Direct involvement of periodontal ligament A-beta (Aβ) proprioceptors.
                  </p>
                </button>

                <button
                  onClick={() => {
                    setTreeLocation('diffuse');
                    setTreeStep(2);
                  }}
                  className={`w-full p-4 rounded-2xl border text-left transition-all ${
                    treeLocation === 'diffuse'
                      ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 ring-1 ring-cyan-500'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs text-cyan-300 flex items-center gap-2">
                    <Compass className="w-4 h-4" /> Diffuse / Unlocalized (Entire jaw quadrant)
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Pulpal origin lacking proprioceptive fibers, projecting into trigeminal nucleus.
                  </p>
                </button>
              </div>
            </div>

            {/* Step 2: Duration */}
            {treeLocation && (
              <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 font-mono font-bold text-xs flex items-center justify-center">
                    2
                  </span>
                  <h4 className="text-sm font-bold text-slate-100 font-mono uppercase">
                    What is the duration of the pain episode?
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'momentary',
                      label: 'Momentary on stimulus only',
                      desc: 'Vanishes immediately when trigger is removed (<2-3s).',
                      mnemonic: 'Momentary = Mild/Reversible',
                    },
                    {
                      id: 'lingering',
                      label: 'Lingering dull ache (>15-30s)',
                      desc: 'Persists long after the thermal stimulus is removed.',
                      mnemonic: 'Lingering = Lethal/Irreversible',
                    },
                    {
                      id: 'spontaneous',
                      label: 'Spontaneous continuous pain',
                      desc: 'Starts without any external trigger, lasting hours.',
                      mnemonic: 'Spontaneous = RCT Needed',
                    },
                  ].map((dur) => (
                    <button
                      key={dur.id}
                      onClick={() => {
                        setTreeDuration(dur.id as any);
                        setTreeStep(3);
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        treeDuration === dur.id
                          ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-xs text-slate-200 flex items-center justify-between">
                        <span>{dur.label}</span>
                        <span className="text-[10px] text-amber-400 font-mono font-normal">💡</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{dur.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Stimulus */}
            {treeDuration && (
              <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 font-mono font-bold text-xs flex items-center justify-center">
                    3
                  </span>
                  <h4 className="text-sm font-bold text-slate-100 font-mono uppercase">
                    What specific stimulus triggers or relieves the pain?
                  </h4>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { id: 'cold', label: '❄️ Cold drinks / air', sub: 'Hydrodynamic contraction' },
                    { id: 'heat', label: '🔥 Hot coffee / soup', sub: 'Thermal gas/fluid expansion' },
                    { id: 'mastication', label: '🦷 Biting & Release', sub: 'Tooth Slooth cuspal flexion' },
                    { id: 'sweet', label: '🍬 Sweet & Sour', sub: 'Osmotic displacement' },
                    { id: 'night', label: '🌙 Lying down at night', sub: 'Cephalic blood pressure surge' },
                  ].map((stim) => (
                    <button
                      key={stim.id}
                      onClick={() => setTreeStimulus(stim.id as any)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        treeStimulus === stim.id
                          ? 'bg-amber-950/80 border-amber-400 text-amber-200 ring-1 ring-amber-400'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-xs">{stim.label}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{stim.sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tree Resulting Diagnosis Card */}
            {treeStimulus && (
              <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-2 border-emerald-500/80 shadow-2xl space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-extrabold uppercase px-3 py-1 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Provisional Diagnosis Reached:
                  </span>
                  <span className="text-xs font-mono text-cyan-300 font-bold">
                    {getTreeDiagnosis()?.nerveInvolved}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-slate-100 font-mono">
                    {getTreeDiagnosis()?.provisionalDiagnosis}
                  </h3>
                  <p className="text-xs text-slate-300 italic">
                    “{getTreeDiagnosis()?.patientQuote}”
                  </p>
                </div>

                {getTreeDiagnosis()?.mnemonicTip && (
                  <div className="p-3 rounded-2xl bg-amber-950/70 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <strong className="text-amber-400 font-mono text-[10px] block uppercase">
                        Clinical Mnemonic:
                      </strong>
                      <span>“{getTreeDiagnosis()?.mnemonicTip}”</span>
                    </div>
                  </div>
                )}

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block">
                    Underlying Reason for Pain:
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {getTreeDiagnosis()?.reasonForPain}
                  </p>
                  <p className="text-[11px] text-slate-400 leading-relaxed pt-1 border-t border-slate-800">
                    {getTreeDiagnosis()?.mechanismDetail}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                      Confirm With:
                    </span>
                    <div className="flex gap-1.5">
                      {getTreeDiagnosis()?.recommendedTests.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-200"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {onSimulateIn3D && (
                    <button
                      onClick={() => {
                        const targetTest = mapTestNameToType(getTreeDiagnosis()?.recommendedTests[0] || 'cold');
                        onSimulateIn3D(targetTest);
                      }}
                      className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-2"
                    >
                      <Box className="w-3.5 h-3.5" />
                      Test in 3D Blueprint
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-TAB 3: BIOPHYSICAL LABS & ANIMATED MECHANISMS (PAGE 2 CORE) */}
        {/* ========================================================================= */}
        {activeSubTab === 'mechanisms' && (
          <div className="space-y-6">
            {/* View Switcher Bar */}
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xl">
              <div>
                <h3 className="text-sm font-bold text-slate-100 font-mono flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Biophysical Laboratories &amp; Pain Mechanisms (Lecture 1 Page 2)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Explore dental pain etiology via real-time fluid dynamics, low-compliance chamber hemodynamics, and posture physics.
                </p>
              </div>

              {/* Lab Selector Toggle */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0">
                <button
                  onClick={() => setActiveMechanismView('tubule')}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeMechanismView === 'tubule'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Snowflake className="w-3.5 h-3.5" />
                  <span>1. Brännström Tubule Lab</span>
                </button>

                <button
                  onClick={() => setActiveMechanismView('pressure')}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeMechanismView === 'pressure'
                      ? 'bg-rose-500 text-slate-950 font-bold shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <HeartPulse className="w-3.5 h-3.5" />
                  <span>2. Pulp Pressure &amp; Posture</span>
                </button>

                <button
                  onClick={() => setActiveMechanismView('cards')}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeMechanismView === 'cards'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>3. Hallmark Demos</span>
                </button>
              </div>
            </div>

            {/* View 1: Brännström Hydrodynamic Tubule Lab */}
            {activeMechanismView === 'tubule' && (
              <HydrodynamicTubuleLab onSimulateIn3D={onSimulateIn3D} />
            )}

            {/* View 2: Van Hassel & Kim Low-Compliance Pulp Chamber Lab */}
            {activeMechanismView === 'pressure' && (
              <IntrapulpalPressureChamber onSimulateIn3D={onSimulateIn3D} />
            )}

            {/* View 3: 4 Hallmark Lecture Mechanism Cards */}
            {activeMechanismView === 'cards' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Mechanism 1: Cold Hydrodynamic Flow */}
                <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                      <Snowflake className="w-4 h-4" /> Cold Stimulus • Brännström Theory
                    </span>
                    <ClinicalTooltip {...NERVE_MNEMONICS.a_delta} position="bottom-right">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 cursor-default">
                        Aδ Fast Fibers
                      </span>
                    </ClinicalTooltip>
                  </div>
                  <div className="h-32 bg-slate-950 rounded-2xl border border-cyan-500/30 p-4 flex flex-col justify-center items-center relative overflow-hidden">
                    <div className="w-full flex items-center justify-between text-xs font-mono px-4">
                      <span className="text-slate-400">Pulp Nociceptors</span>
                      <div className="flex-1 mx-3 h-3 bg-slate-900 rounded-full border border-cyan-500/50 relative overflow-hidden">
                        <div className="h-full bg-cyan-400 animate-pulse w-2/3" />
                      </div>
                      <span className="text-cyan-300">Ice Pellet</span>
                    </div>
                    <div className="text-[11px] font-mono text-cyan-300 mt-3 text-center">
                      Rapid outward fluid movement (2-3 mm/s) mechanically deforms odontoblast processes
                    </div>
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed">
                    <strong>Lecture Key Rule:</strong> Sudden cold causes thermal contraction of tubular fluid, pulling fluid outward. If the pain vanishes immediately, pulp is reversible; if lingering &gt;15s, irreversible!
                  </div>
                </div>

                {/* Mechanism 2: Thermal Heat Expansion & Ischemia */}
                <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1.5">
                      <Flame className="w-4 h-4" /> Heat Sensitivity • Low Compliance System
                    </span>
                    <ClinicalTooltip {...NERVE_MNEMONICS.c_fibers} position="bottom-right">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 cursor-default">
                        C-Fibers (Ischemia)
                      </span>
                    </ClinicalTooltip>
                  </div>
                  <div className="h-32 bg-slate-950 rounded-2xl border border-rose-500/30 p-4 flex flex-col justify-center items-center relative overflow-hidden">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full border-2 border-rose-500 flex items-center justify-center animate-ping text-rose-400 font-bold">
                        &gt;35
                      </div>
                      <div className="text-xs font-mono text-rose-200">
                        <div>Intrapulpal Tissue Pressure</div>
                        <div className="text-[10px] text-slate-400">Exceeds capillary perfusion pressure</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed">
                    <strong>Lecture Key Rule:</strong> The pulp is enclosed in rigid dentin walls. Heat causes thermal fluid/gas expansion, producing microvascular collapse and deep C-fiber throbbing.
                  </div>
                </div>

                {/* Mechanism 3: Cracked Tooth Rebound Pain */}
                <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
                      <Activity className="w-4 h-4" /> Tooth Slooth • Rebound Pain on Release
                    </span>
                    <ClinicalTooltip {...DIAGNOSIS_MNEMONICS.cracked_tooth} position="bottom-right">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 cursor-default">
                        Aδ Cusp Flexion
                      </span>
                    </ClinicalTooltip>
                  </div>
                  <div className="h-32 bg-slate-950 rounded-2xl border border-amber-500/30 p-4 flex flex-col justify-center items-center text-center space-y-2">
                    <div className="flex items-center gap-3 text-xs font-mono text-slate-300">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700">1. Biting: Crack Opens</span>
                      <span className="text-cyan-400 font-bold">➔</span>
                      <span className="px-2.5 py-1 rounded-lg bg-rose-950 border border-rose-600 text-rose-300 font-bold animate-pulse">
                        2. RELEASE: Snap Shock!
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-amber-300">
                      Violent hydrodynamic fluid turbulence upon cuspal elastic rebound
                    </div>
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed">
                    <strong>Lecture Key Rule:</strong> Biting is often painless; the hallmark pathognomonic symptom of a cracked tooth is acute sharp pain upon <em>releasing</em> the masticatory load.
                  </div>
                </div>

                {/* Mechanism 4: PDL Mechanoreceptor Pinpoint Localization */}
                <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-purple-400 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" /> Localized PDL vs Diffuse Pulpal Pain
                    </span>
                    <ClinicalTooltip {...NERVE_MNEMONICS.a_beta} position="bottom-right">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 cursor-default">
                        Aβ Proprioceptors
                      </span>
                    </ClinicalTooltip>
                  </div>
                  <div className="h-32 bg-slate-950 rounded-2xl border border-purple-500/30 p-4 flex items-center justify-around">
                    <div className="text-center space-y-1">
                      <div className="w-10 h-10 mx-auto rounded-full bg-slate-900 border border-cyan-500/40 flex items-center justify-center font-bold text-xs text-cyan-300">
                        Pulp
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">0 Mechanoreceptors</div>
                      <div className="text-[10px] font-bold text-rose-400">Diffuse / Unlocalized</div>
                    </div>
                    <div className="text-slate-600 font-mono text-lg">VS</div>
                    <div className="text-center space-y-1">
                      <div className="w-10 h-10 mx-auto rounded-full bg-purple-950 border border-purple-500 flex items-center justify-center font-bold text-xs text-purple-300">
                        PDL
                      </div>
                      <div className="text-[10px] font-mono text-purple-300">Rich Aβ Fibers</div>
                      <div className="text-[10px] font-bold text-emerald-400">Pinpoint Accuracy!</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed">
                    <strong>Lecture Key Rule:</strong> The dental pulp has no proprioceptors. Once infection breaches the apical foramen into the periodontal ligament, percussion localizes the culprit tooth immediately!
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-TAB 4: NERVE FIBER ARCHITECTURE COMPARISON */}
        {/* ========================================================================= */}
        {activeSubTab === 'nerves' && (
          <div className="space-y-6">
            <div className="p-4 rounded-3xl bg-slate-900/80 border border-cyan-500/30 space-y-2">
              <h3 className="text-sm font-bold text-slate-100 font-mono flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                The Three Peripheral Sensory Pathways of Dental Pain
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Understanding dental pain requires differentiating the three distinct nerve populations innervating the dentin-pulp complex and periodontal attachment. Each nerve fiber possesses unique conduction velocities, myelination, anatomical distribution, and pain characteristics.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {Object.values(NERVES_INFO).map((nerve) => {
                const nerveKey = nerve.id === 'a_delta' ? 'a_delta' : nerve.id === 'c_fibers' ? 'c_fibers' : 'a_beta';
                const mnemonicData = NERVE_MNEMONICS[nerveKey];

                return (
                  <div
                    key={nerve.id}
                    className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-xl flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <ClinicalTooltip {...mnemonicData} position="bottom-left">
                          <span
                            className="text-xs font-mono font-extrabold px-3 py-1 rounded-xl cursor-default"
                            style={{ backgroundColor: `${nerve.color}20`, color: nerve.color }}
                          >
                            {nerve.name}
                          </span>
                        </ClinicalTooltip>
                        <span className="text-[10px] font-mono text-slate-400">{nerve.conductionSpeed}</span>
                      </div>

                      {/* Animated Fiber Indicator */}
                      <div className="h-24 rounded-2xl bg-slate-950 p-3 border border-slate-800 flex flex-col justify-center items-center relative overflow-hidden">
                        <div
                          className="w-12 h-12 rounded-full animate-ping opacity-30 absolute"
                          style={{ backgroundColor: nerve.color }}
                        />
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs font-mono shadow-lg relative z-10 text-slate-950"
                          style={{ backgroundColor: nerve.color }}
                        >
                          {nerve.id === 'a_delta' ? 'Aδ' : nerve.id === 'c_fibers' ? 'C' : 'Aβ'}
                        </div>
                        <div className="text-[10px] font-mono text-slate-300 mt-2 z-10">
                          {nerve.myelination}
                        </div>
                      </div>

                      {/* Mnemonic Badge */}
                      <div className="p-2.5 rounded-xl bg-amber-950/50 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="font-semibold text-[11px]">“{mnemonicData.mnemonic}”</span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                            Anatomical Location:
                          </span>
                          <span className="text-slate-200 font-medium">{nerve.location}</span>
                        </div>

                        <div>
                          <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                            Pain Characteristic:
                          </span>
                          <span className="text-slate-200 font-medium">{nerve.painType}</span>
                        </div>

                        <div>
                          <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                            Activation Trigger:
                          </span>
                          <span className="text-slate-200 font-medium">{nerve.stimulation}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-300 leading-snug">
                      <strong className="text-slate-400 font-mono text-[10px] block uppercase mb-1">
                        Clinical Significance:
                      </strong>
                      {nerve.significance}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Interactive Conduction Velocity & First vs Second Pain Race Simulator */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Interactive Nerve Conduction Race: "First Pain" vs "Second Pain" (Lecture 1 Core)</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Simulate how different axon diameters and myelin sheaths determine how quickly nociceptive action potentials reach the sensory cortex.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setNerveRaceProgress(0);
                    setIsNerveRaceRunning(true);
                  }}
                  disabled={isNerveRaceRunning}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-mono font-bold text-xs shadow-lg transition-all disabled:opacity-50 flex items-center gap-2 self-start"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isNerveRaceRunning ? 'Transmitting Spikes...' : 'Fire Test Stimulus'}</span>
                </button>
              </div>

              {/* Race Tracks */}
              <div className="space-y-4">
                {/* Track 1: A-beta Fibers */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-purple-400 font-bold flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> A&beta; Proprioceptive (PDL) &bull; 30&ndash;70 m/s
                    </span>
                    <span className="text-[11px] text-purple-300 font-bold">
                      {nerveRaceProgress > 0 ? (nerveRaceProgress >= 25 ? '15 ms (REACHED CORTEX!)' : 'Traveling...') : 'Idle (Waiting)'}
                    </span>
                  </div>
                  <div className="h-3 bg-slate-900 rounded-full border border-purple-500/30 overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-75"
                      style={{ width: `${Math.min(100, nerveRaceProgress * 4)}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 flex justify-between">
                    <span>Heavily Myelinated (6&ndash;12 &mu;m)</span>
                    <span className="text-emerald-400 font-semibold">Immediate Pinpoint Localization (Occlusal contact / Percussion)</span>
                  </div>
                </div>

                {/* Track 2: A-delta Fibers */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                      <Snowflake className="w-3.5 h-3.5" /> A&delta; Fast Nociceptor (Pulp Border) &bull; 12&ndash;30 m/s
                    </span>
                    <span className="text-[11px] text-cyan-300 font-bold">
                      {nerveRaceProgress > 0 ? (nerveRaceProgress >= 50 ? '45 ms (REACHED CORTEX!)' : 'Traveling...') : 'Idle (Waiting)'}
                    </span>
                  </div>
                  <div className="h-3 bg-slate-900 rounded-full border border-cyan-500/30 overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 transition-all duration-75"
                      style={{ width: `${Math.min(100, nerveRaceProgress * 2)}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 flex justify-between">
                    <span>Thin Myelin (1&ndash;5 &mu;m) &bull; Saltatory Conduction</span>
                    <span className="text-cyan-300 font-semibold">"First Pain": Sharp, pricking, lancinating twinge</span>
                  </div>
                </div>

                {/* Track 3: C-Fibers */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-rose-400 font-bold flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5" /> C-Fibers Slow Polymodal (Pulp Core) &bull; 0.5&ndash;2 m/s
                    </span>
                    <span className="text-[11px] text-rose-300 font-bold">
                      {nerveRaceProgress > 0 ? (nerveRaceProgress >= 100 ? '900 ms (REACHED CORTEX!)' : 'Slow unmyelinated crawl...') : 'Idle (Waiting)'}
                    </span>
                  </div>
                  <div className="h-3 bg-slate-900 rounded-full border border-rose-500/30 overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-rose-600 to-rose-400 transition-all duration-75"
                      style={{ width: `${nerveRaceProgress}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 flex justify-between">
                    <span>Unmyelinated (0.4&ndash;1.2 &mu;m) &bull; Continuous Conduction</span>
                    <span className="text-rose-400 font-semibold">"Second Pain": Agonizing, dull, burning, deep throbbing ache</span>
                  </div>
                </div>
              </div>

              {/* Clinical Takeaway Box */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-mono text-xs font-bold text-amber-300 uppercase">
                    Double Pain Phenomenon (Lecture 1 Page 2 Clinical Pearl):
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Why does a cold stimulus cause an immediate sharp jab, followed in irreversible pulpitis by a lingering, dull, sickening throb? Fast myelinated <strong>A&delta; fibers</strong> fire instantaneously (&sim;45 ms), producing the alert reflex. Unmyelinated <strong>C-fibers</strong> conduct over 15&times; slower (&sim;900 ms), initiating prolonged deep ischemic pain mediated by substance P and calcitonin gene-related peptide (CGRP).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-TAB 5: LECTURE 1 SLIDE TABLE (PAGE 2 MATRIX VERBATIM) */}
        {/* ========================================================================= */}
        {activeSubTab === 'table' && (
          <div className="space-y-4">
            <div className="p-4 rounded-3xl bg-slate-900/80 border border-cyan-500/30 text-xs text-slate-300 leading-relaxed flex items-center justify-between gap-4">
              <div>
                <span className="font-mono text-cyan-300 font-bold uppercase text-[11px] block mb-1">
                  Lecture 1 Slide Reference Matrix (Page 2):
                </span>
                This table correlates the exact subjective pain parameters with underlying biological causes and provisional diagnoses. Click any parameter, diagnosis, or nerve tag for mnemonic tips and biophysical details!
              </div>
              <button
                onClick={() => setIsMnemonicModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-950/80 text-amber-300 border border-amber-600/50 text-xs font-mono font-bold shrink-0 flex items-center gap-1.5"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>View All Mnemonics</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/60 shadow-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/80 font-mono text-slate-400 text-[11px] uppercase">
                    <th className="py-3 px-4">Parameter</th>
                    <th className="py-3 px-4">Type of Pain</th>
                    <th className="py-3 px-4">Reason for Pain</th>
                    <th className="py-3 px-4">Provisional Diagnosis</th>
                    <th className="py-3 px-4 text-right">Nerve</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredItems.map((row) => {
                    const paramTooltip = getParameterTooltip(row.parameter);
                    const nerveTooltip = getNerveTooltip(row.nerveInvolved);
                    const diagTooltip = getDiagnosisTooltip(row.provisionalDiagnosis);

                    return (
                      <tr
                        key={row.id}
                        onClick={() => {
                          setActiveSubTab('matrix');
                          setExpandedCardId(row.id);
                        }}
                        className="hover:bg-slate-800/50 cursor-pointer transition-colors group/row"
                      >
                        <td className="py-3 px-4 font-mono font-bold text-slate-400 text-[10px]">
                          {row.parameter}
                        </td>

                        <td className="py-3 px-4 font-semibold text-slate-100 max-w-[200px]">
                          <span className="group-hover/row:text-cyan-300 transition-colors">
                            {row.typeOfPain}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-slate-300 max-w-[280px] leading-relaxed">
                          {row.reasonForPain}
                        </td>

                        <td className="py-3 px-4 font-bold text-emerald-400">
                          {row.provisionalDiagnosis}
                        </td>

                        <td className="py-3 px-4 text-right font-mono font-bold text-cyan-300 text-[11px]">
                          <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                            {row.nerveInvolved}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-TAB 6: INTERACTIVE DIAGNOSTIC TRAINER & FLASHCARD DRILL */}
        {/* ========================================================================= */}
        {activeSubTab === 'trainer' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between p-4 rounded-3xl bg-slate-900/90 border border-cyan-500/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 font-mono text-sm">
                    Pain Mechanism Trainer
                  </h3>
                  <p className="text-xs text-slate-400">Master the Page 2 Diagnostic Table</p>
                </div>
              </div>
              <div className="font-mono text-xs px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-bold">
                Score: {trainerScore}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5 shadow-2xl">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
                  Question #{trainerIndex + 1} • {currentTrainerScenario.parameter}
                </span>
                <h4 className="text-base font-extrabold text-slate-100">
                  Patient presents with: “{currentTrainerScenario.typeOfPain}”
                </h4>
                <div className="italic text-xs text-slate-300 bg-slate-950/60 p-3 rounded-2xl border border-slate-800 mt-2">
                  {currentTrainerScenario.patientQuote}
                </div>
              </div>

              {/* Step 1: Select the Underlying Reason */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold uppercase text-cyan-400 block">
                  1. What is the physiological reason for this pain?
                </label>
                <div className="space-y-2">
                  {trainerReasonOptions.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => !trainerSubmitted && setTrainerSelectedReason(opt)}
                      className={`w-full text-left p-3 rounded-2xl border text-xs transition-all ${
                        trainerSelectedReason === opt
                          ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 font-semibold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Select the Provisional Diagnosis */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold uppercase text-rose-400 block">
                  2. What is the provisional diagnosis?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {trainerDiagOptions.map((diag, idx) => (
                    <button
                      key={idx}
                      onClick={() => !trainerSubmitted && setTrainerSelectedDiag(diag)}
                      className={`p-3 rounded-2xl border text-xs text-left transition-all ${
                        trainerSelectedDiag === diag
                          ? 'bg-rose-950/80 border-rose-400 text-rose-200 font-semibold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {diag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit or Next Button */}
              {!trainerSubmitted ? (
                <button
                  onClick={handleTrainerSubmit}
                  disabled={!trainerSelectedReason || !trainerSelectedDiag}
                  className="w-full py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-lg"
                >
                  Verify Diagnosis
                </button>
              ) : (
                <div className="space-y-3 pt-2">
                  <div
                    className={`p-4 rounded-2xl border text-xs space-y-2 ${
                      trainerSelectedReason === currentTrainerScenario.reasonForPain &&
                      trainerSelectedDiag === currentTrainerScenario.provisionalDiagnosis
                        ? 'bg-emerald-950/50 border-emerald-400 text-emerald-200'
                        : 'bg-rose-950/50 border-rose-400 text-rose-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold font-mono">
                      {trainerSelectedReason === currentTrainerScenario.reasonForPain &&
                      trainerSelectedDiag === currentTrainerScenario.provisionalDiagnosis ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          CORRECT CLINICAL CORRELATION!
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-rose-400" />
                          REVIEW LECTURE MECHANISM:
                        </>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-300 leading-relaxed">
                      <strong>Correct Reason:</strong> {currentTrainerScenario.reasonForPain}
                    </div>
                    <div className="text-[11px] text-slate-300 leading-relaxed">
                      <strong>Correct Provisional Diagnosis:</strong>{' '}
                      {currentTrainerScenario.provisionalDiagnosis} ({currentTrainerScenario.nerveInvolved})
                    </div>
                    {currentTrainerScenario.mnemonicTip && (
                      <div className="mt-2 p-2 rounded-xl bg-amber-950/80 border border-amber-500/50 text-amber-200 text-[11px] font-sans">
                        💡 <strong>Mnemonic to remember:</strong> “{currentTrainerScenario.mnemonicTip}”
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleNextTrainer}
                    className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                  >
                    Next Patient Scenario <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MNEMONICS CHEAT-SHEET MODAL */}
      {/* ========================================================================= */}
      {isMnemonicModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-950 text-amber-400 border border-amber-800/80">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-100 font-mono text-base">
                    Endodontic Pain Diagnosis Mnemonics Catalog
                  </h3>
                  <p className="text-xs text-slate-400">
                    High-yield mental models for distinguishing Aδ vs C fibers, parameters, and diagnoses
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMnemonicModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Section 1: The Three Nerves Comparison */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase font-bold text-cyan-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                1. Nerve Fibers Mnemonic Comparison (Aδ vs C vs Aβ)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {Object.values(NERVE_MNEMONICS).map((n, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-200">{n.title}</span>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${n.badgeColor}`}>
                        {n.badge}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs font-semibold leading-snug">
                      💡 “{n.mnemonic}”
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {n.clinicalContext}
                    </p>
                    <div className="text-[10px] font-mono text-cyan-300 bg-cyan-950/50 p-1.5 rounded-lg border border-cyan-800/60">
                      ⚡ {n.keyRule}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: The 4 Subjective Parameters */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-mono uppercase font-bold text-amber-400 flex items-center gap-1.5">
                <Compass className="w-4 h-4" />
                2. Subjective Parameters Mnemonics (Location, Duration, Nature, Stimulus)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.values(PARAMETER_MNEMONICS).map((p, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-100">{p.title}</span>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${p.badgeColor}`}>
                        {p.badge}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs font-semibold">
                      💡 “{p.mnemonic}”
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">{p.clinicalContext}</p>
                    <div className="text-[10px] text-cyan-300 font-mono">
                      ⚡ <strong>Rule:</strong> {p.keyRule}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Key Provisional Diagnoses */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-mono uppercase font-bold text-emerald-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4" />
                3. Provisional Diagnoses Mnemonics
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.values(DIAGNOSIS_MNEMONICS).map((d, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-emerald-300">{d.title}</span>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${d.badgeColor}`}>
                        {d.badge}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs font-semibold">
                      💡 “{d.mnemonic}”
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">{d.clinicalContext}</p>
                    <div className="text-[10px] text-cyan-300 font-mono">
                      ⚡ <strong>Threshold:</strong> {d.keyRule}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsMnemonicModalOpen(false)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-cyan-500 hover:opacity-95 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition-opacity shadow-lg"
            >
              Back to Matrix Explorer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
