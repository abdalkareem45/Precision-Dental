import React, { useState } from 'react';
import {
  Stethoscope,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Layers,
  Sparkles,
  ArrowRight,
  Info,
  Navigation,
  Compass,
  MapPin,
  Play,
  RotateCcw,
  Box,
  ShieldAlert,
  Flame,
  UserCheck,
  Search,
  BookOpen,
  Sliders,
  Zap,
  Gauge,
  Lightbulb,
  ChevronRight,
} from 'lucide-react';
import { ClinicalTestType } from '../types/endodontics';

interface ClinicalExamExplorerProps {
  onSimulateIn3D?: (testType: ClinicalTestType) => void;
}

type ExtraoralHotspot =
  | 'submandibular'
  | 'submental'
  | 'canine_space'
  | 'buccal_space'
  | 'chin_fistula'
  | 'ludwigs_angina';

type DiscolorationType = 'pink_spot' | 'gray_brown' | 'yellow_opaque' | 'chalky_white' | 'normal';

type ProbingCaseType = 'vrf' | 'periodontitis' | 'healthy' | 'endo_perio';

export const ClinicalExamExplorer: React.FC<ClinicalExamExplorerProps> = ({
  onSimulateIn3D,
}) => {
  const [activeExamSection, setActiveExamSection] = useState<
    'extraoral' | 'intraoral' | 'sinus_tracer' | 'probing_mobility'
  >('extraoral');

  // Extraoral Palpation Simulator State
  const [selectedExtraoralSpot, setSelectedExtraoralSpot] =
    useState<ExtraoralHotspot>('chin_fistula');
  const [palpationPressure, setPalpationPressure] = useState<number>(35); // grams of pressure
  const [lymphNodeCondition, setLymphNodeCondition] = useState<
    'healthy' | 'acute_odontogenic' | 'malignant'
  >('acute_odontogenic');

  // Intraoral Discoloration & Transillumination State
  const [selectedDiscoloration, setSelectedDiscoloration] =
    useState<DiscolorationType>('gray_brown');
  const [isTransilluminationActive, setIsTransilluminationActive] = useState<boolean>(true);
  const [lightPosition, setLightPosition] = useState<'buccal' | 'lingual'>('lingual');

  // Sinus Tracer Simulation State
  const [gpInsertionDepth, setGpInsertionDepth] = useState<number>(18);
  const [isXrayTaken, setIsXrayTaken] = useState<boolean>(false);

  // Probing Simulation State
  const [probingCase, setProbingCase] = useState<ProbingCaseType>('vrf');
  const [activeProbingSiteIndex, setActiveProbingSiteIndex] = useState<number>(1); // 0: MB, 1: B, 2: DB, 3: ML, 4: L, 5: DL

  // Mobility Simulation State
  const [testedMobilityGrade, setTestedMobilityGrade] = useState<number>(1);
  const [isVerticalDepressible, setIsVerticalDepressible] = useState<boolean>(false);

  // 6-Point Probing Profiles
  const PROBING_SITES = ['Mesio-Buccal (MB)', 'Mid-Buccal (B)', 'Disto-Buccal (DB)', 'Mesio-Lingual (ML)', 'Mid-Lingual (L)', 'Disto-Lingual (DL)'];

  const getProbingDepths = () => {
    switch (probingCase) {
      case 'vrf':
        return [3, 9, 3, 3, 2, 3]; // Isolated 9mm narrow drop on Mid-Buccal!
      case 'periodontitis':
        return [6, 5, 7, 6, 6, 7]; // Generalized broad conical defect
      case 'endo_perio':
        return [7, 8, 9, 7, 8, 8]; // Combined deep attachment loss
      case 'healthy':
      default:
        return [2, 2, 3, 2, 2, 2];
    }
  };

  const currentDepths = getProbingDepths();
  const currentDepth = currentDepths[activeProbingSiteIndex];

  return (
    <div className="flex flex-col h-full w-full bg-[#0B1F4D] text-[#FAF8F3] overflow-y-auto font-sans">
      {/* Top Banner with Precision Dental Luxury Theme */}
      <div className="p-5 border-b border-[#E6E8EC]/20 bg-gradient-to-r from-[#06112C] via-[#0B1F4D] to-[#1B3A8C]/90 sticky top-0 z-20 backdrop-blur-md shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#C9A24B] via-[#DFBA67] to-[#1B3A8C] p-[2px] shadow-lg shadow-[#C9A24B]/20">
              <div className="w-full h-full bg-[#0B1F4D] rounded-[14px] flex items-center justify-center text-[#C9A24B]">
                <Stethoscope className="w-6 h-6" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-base font-extrabold tracking-wide font-headings text-white">
                  Extraoral &amp; Intraoral Clinical Examination
                </h2>
                <span className="font-arabic text-xs text-[#C9A24B] font-bold" dir="rtl">
                  دقّة الأسنان
                </span>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#1B3A8C] text-[#C9A24B] border border-[#C9A24B]/40 font-bold uppercase shadow-sm">
                  Lecture 1 • Stages 2 &amp; 3
                </span>
              </div>
              <p className="text-xs text-[#E6E8EC]/80 mt-0.5">
                Comprehensive objective diagnostics: facial asymmetry, lymph node palpation, stoma GP tracing, spectrophotometry, and periodontal probing.
              </p>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-1 bg-[#06112C] p-1.5 rounded-2xl border border-[#E6E8EC]/20 text-xs shadow-inner overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveExamSection('extraoral')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-headings text-xs font-semibold transition-all shrink-0 whitespace-nowrap ${
                activeExamSection === 'extraoral'
                  ? 'bg-[#C9A24B] text-[#0B1F4D] font-bold shadow-md'
                  : 'text-[#E6E8EC]/70 hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Extraoral Palpation</span>
            </button>

            <button
              onClick={() => setActiveExamSection('intraoral')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-headings text-xs font-semibold transition-all shrink-0 whitespace-nowrap ${
                activeExamSection === 'intraoral'
                  ? 'bg-[#C9A24B] text-[#0B1F4D] font-bold shadow-md'
                  : 'text-[#E6E8EC]/70 hover:text-white'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Intraoral &amp; Crown Color</span>
            </button>

            <button
              onClick={() => setActiveExamSection('sinus_tracer')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-headings text-xs font-semibold transition-all shrink-0 whitespace-nowrap ${
                activeExamSection === 'sinus_tracer'
                  ? 'bg-[#C9A24B] text-[#0B1F4D] font-bold shadow-md'
                  : 'text-[#E6E8EC]/70 hover:text-white'
              }`}
            >
              <Navigation className="w-4 h-4" />
              <span>GP Sinus Tracing (Fig 1 &amp; 2)</span>
            </button>

            <button
              onClick={() => setActiveExamSection('probing_mobility')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-headings text-xs font-semibold transition-all shrink-0 whitespace-nowrap ${
                activeExamSection === 'probing_mobility'
                  ? 'bg-[#C9A24B] text-[#0B1F4D] font-bold shadow-md'
                  : 'text-[#E6E8EC]/70 hover:text-white'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Probing &amp; Mobility</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-3 sm:p-5 md:p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* ========================================================================= */}
        {/* SECTION 1: EXTRAORAL PALPATION & LYMPHADENOPATHY SIMULATOR */}
        {/* ========================================================================= */}
        {activeExamSection === 'extraoral' && (
          <div className="space-y-6">
            <div className="p-4 rounded-3xl bg-[#06112C] border border-[#C9A24B]/30 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#1B3A8C] text-[#C9A24B] border border-[#C9A24B]/30">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-headings font-bold uppercase tracking-wider text-[#C9A24B]">
                    Stage 2: Extraoral Clinical Inspection &amp; Palpation Station (Lecture 1)
                  </h4>
                  <p className="text-xs text-[#E6E8EC]/85 mt-0.5">
                    Click anatomical regions on the head &amp; neck diagram to simulate bimanual tactile palpation and differentiate lymphadenitis from fascial space infections.
                  </p>
                </div>
              </div>

              {onSimulateIn3D && (
                <button
                  onClick={() => onSimulateIn3D('palpation')}
                  className="px-3.5 py-1.5 rounded-xl bg-[#C9A24B] hover:bg-[#DFBA67] text-[#0B1F4D] font-headings font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 self-start shrink-0 shadow-md"
                >
                  <Box className="w-4 h-4" />
                  <span>View Anatomy in 3D</span>
                </button>
              )}
            </div>

            {/* Interactive Anatomical Palpation Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Visual Anatomical Map (7 cols) */}
              <div className="lg:col-span-7 p-6 rounded-3xl bg-[#06112C] border border-[#E6E8EC]/15 space-y-5 shadow-2xl">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#C9A24B] font-bold flex items-center gap-1.5">
                    <Compass className="w-4 h-4" /> Interactive Anatomical Target Zones:
                  </span>
                  <span className="text-[#E6E8EC]/60">Select target zone to palpate</span>
                </div>

                {/* SVG Anatomical Head & Neck Palpation Schematic */}
                <div className="relative h-72 rounded-2xl bg-gradient-to-b from-[#0B1F4D] to-[#06112C] border border-[#E6E8EC]/20 p-4 flex items-center justify-center overflow-hidden">
                  <svg
                    viewBox="0 0 360 260"
                    className="w-full h-full max-w-sm filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
                  >
                    {/* Head & Neck Silhouette */}
                    <path
                      d="M180 20 C130 20 110 60 110 110 C110 145 125 175 145 195 C145 220 135 240 120 250 L240 250 C225 240 215 220 215 195 C235 175 250 145 250 110 C250 60 230 20 180 20 Z"
                      fill="#122760"
                      stroke="#C9A24B"
                      strokeWidth="2"
                      opacity="0.85"
                    />

                    {/* Mandible Outline */}
                    <path
                      d="M135 140 C145 175 170 190 180 190 C190 190 215 175 225 140"
                      fill="none"
                      stroke="#FAF8F3"
                      strokeWidth="2"
                      strokeDasharray="4 3"
                    />

                    {/* Mentalis Muscle / Chin Area (Lecture Fig 1 Fistula) */}
                    <circle
                      cx="180"
                      cy="185"
                      r="14"
                      className={`cursor-pointer transition-all ${
                        selectedExtraoralSpot === 'chin_fistula'
                          ? 'fill-rose-500 stroke-[#FAF8F3] stroke-2 animate-pulse'
                          : 'fill-rose-950/80 stroke-rose-400 stroke-1'
                      }`}
                      onClick={() => setSelectedExtraoralSpot('chin_fistula')}
                    />
                    <text x="180" y="188" textAnchor="middle" fill="#FAF8F3" fontSize="8" fontWeight="bold">
                      Chin
                    </text>

                    {/* Submandibular Nodes (Bilateral) */}
                    <circle
                      cx="145"
                      cy="165"
                      r="13"
                      className={`cursor-pointer transition-all ${
                        selectedExtraoralSpot === 'submandibular'
                          ? 'fill-[#C9A24B] stroke-white stroke-2 animate-ping'
                          : 'fill-[#1B3A8C] stroke-[#C9A24B] stroke-1'
                      }`}
                      onClick={() => setSelectedExtraoralSpot('submandibular')}
                    />
                    <circle
                      cx="145"
                      cy="165"
                      r="10"
                      className="cursor-pointer fill-[#C9A24B]"
                      onClick={() => setSelectedExtraoralSpot('submandibular')}
                    />
                    <text x="145" y="168" textAnchor="middle" fill="#0B1F4D" fontSize="7" fontWeight="bold">
                      SubM
                    </text>

                    <circle
                      cx="215"
                      cy="165"
                      r="10"
                      className="cursor-pointer fill-[#C9A24B]"
                      onClick={() => setSelectedExtraoralSpot('submandibular')}
                    />

                    {/* Submental Nodes */}
                    <circle
                      cx="180"
                      cy="208"
                      r="9"
                      className={`cursor-pointer transition-all ${
                        selectedExtraoralSpot === 'submental'
                          ? 'fill-[#C9A24B] stroke-white stroke-2'
                          : 'fill-[#1B3A8C] stroke-[#C9A24B]'
                      }`}
                      onClick={() => setSelectedExtraoralSpot('submental')}
                    />
                    <text x="180" y="211" textAnchor="middle" fill="#FAF8F3" fontSize="7">
                      SubMent
                    </text>

                    {/* Canine Space / Nasolabial Groove */}
                    <circle
                      cx="160"
                      cy="115"
                      r="10"
                      className={`cursor-pointer transition-all ${
                        selectedExtraoralSpot === 'canine_space'
                          ? 'fill-amber-500 stroke-white stroke-2'
                          : 'fill-amber-950 stroke-amber-400'
                      }`}
                      onClick={() => setSelectedExtraoralSpot('canine_space')}
                    />
                    <text x="160" y="118" textAnchor="middle" fill="#FAF8F3" fontSize="7">
                      Canine
                    </text>

                    {/* Buccal Space */}
                    <circle
                      cx="130"
                      cy="130"
                      r="10"
                      className={`cursor-pointer transition-all ${
                        selectedExtraoralSpot === 'buccal_space'
                          ? 'fill-cyan-500 stroke-white stroke-2'
                          : 'fill-cyan-950 stroke-cyan-400'
                      }`}
                      onClick={() => setSelectedExtraoralSpot('buccal_space')}
                    />
                    <text x="130" y="133" textAnchor="middle" fill="#FAF8F3" fontSize="7">
                      Buccal
                    </text>

                    {/* Deep Submandibular / Ludwig's Angina Region */}
                    <rect
                      x="145"
                      y="222"
                      width="70"
                      height="18"
                      rx="8"
                      className={`cursor-pointer transition-all ${
                        selectedExtraoralSpot === 'ludwigs_angina'
                          ? 'fill-rose-600 stroke-white stroke-2 animate-pulse'
                          : 'fill-rose-950/70 stroke-rose-500'
                      }`}
                      onClick={() => setSelectedExtraoralSpot('ludwigs_angina')}
                    />
                    <text x="180" y="234" textAnchor="middle" fill="#FAF8F3" fontSize="7" fontWeight="bold">
                      ⚠ Ludwig&apos;s Airway
                    </text>
                  </svg>
                </div>

                {/* Tactile Pressure Gauge */}
                <div className="p-4 rounded-2xl bg-[#0B1F4D] border border-[#E6E8EC]/15 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#C9A24B] font-bold flex items-center gap-1.5">
                      <Gauge className="w-4 h-4" /> Tactile Finger Palpation Force:
                    </span>
                    <span className="text-white font-bold">{palpationPressure} grams (Standard: 20–40g)</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={80}
                    value={palpationPressure}
                    onChange={(e) => setPalpationPressure(Number(e.target.value))}
                    className="w-full accent-[#C9A24B] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#E6E8EC]/60 font-mono">
                    <span>10g (Gentle Touch)</span>
                    <span>35g (Optimal Clinical Sounding)</span>
                    <span>80g (Excessive Force / Discomfort)</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Finding Explanation & Differential (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                {/* Finding 1: Cutaneous Chin Fistula */}
                {selectedExtraoralSpot === 'chin_fistula' && (
                  <div className="p-5 rounded-3xl bg-[#06112C] border border-rose-500/70 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-700 font-bold uppercase">
                        Lecture Fig 1 Core Classic
                      </span>
                      <span className="text-xs text-rose-400 font-mono font-bold">Cutaneous Sinus</span>
                    </div>

                    <h3 className="font-headings font-bold text-sm text-white">
                      Extraoral Chin Sinus Tract (Cutaneous Fistula)
                    </h3>
                    <p className="text-xs text-[#E6E8EC] leading-relaxed">
                      Chronic periapical infection from mandibular anterior teeth perforates the thin labial cortical bone <strong>beneath the mentalis muscle insertion</strong>, creating an external draining stoma on the chin.
                    </p>

                    <div className="p-3 rounded-2xl bg-amber-950/60 border border-amber-500/50 text-amber-200 text-xs space-y-1">
                      <strong className="block text-amber-300 font-headings">⚠️ Major Diagnostic Trap:</strong>
                      <p className="text-[11px] leading-relaxed">
                        Frequently misdiagnosed as a sebaceous cyst, furuncle, or basal cell carcinoma! Patients endure multiple unsuccessful dermatological excisions until an observant dentist exposes a periapical radiograph and treats the necrotic incisor.
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#0B1F4D] border border-[#E6E8EC]/15 text-xs text-[#E6E8EC]">
                      <strong className="text-[#C9A24B] font-mono block uppercase text-[10px] mb-0.5">
                        Clinical Action:
                      </strong>
                      Thread a size #25 gutta-percha cone through the cutaneous aperture and take a radiograph to track the sinus to the offending root apex.
                    </div>
                  </div>
                )}

                {/* Finding 2: Submandibular Lymph Nodes */}
                {selectedExtraoralSpot === 'submandibular' && (
                  <div className="p-5 rounded-3xl bg-[#06112C] border border-[#C9A24B]/70 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1B3A8C] text-[#C9A24B] border border-[#C9A24B]/40 font-bold uppercase">
                        Lymphatic Inspection
                      </span>
                      <span className="text-xs text-[#C9A24B] font-mono font-bold">Bimanual Palpation</span>
                    </div>

                    <h3 className="font-headings font-bold text-sm text-white">
                      Submandibular &amp; Cervical Lymphadenopathy
                    </h3>

                    {/* Condition Toggle */}
                    <div className="flex gap-1.5 p-1 bg-[#0B1F4D] rounded-xl border border-[#E6E8EC]/15 text-xs">
                      <button
                        onClick={() => setLymphNodeCondition('acute_odontogenic')}
                        className={`flex-1 py-1 rounded-lg font-mono text-[10px] font-bold ${
                          lymphNodeCondition === 'acute_odontogenic'
                            ? 'bg-[#C9A24B] text-[#0B1F4D]'
                            : 'text-[#E6E8EC]/70'
                        }`}
                      >
                        Acute Infection
                      </button>
                      <button
                        onClick={() => setLymphNodeCondition('healthy')}
                        className={`flex-1 py-1 rounded-lg font-mono text-[10px] font-bold ${
                          lymphNodeCondition === 'healthy'
                            ? 'bg-[#C9A24B] text-[#0B1F4D]'
                            : 'text-[#E6E8EC]/70'
                        }`}
                      >
                        Normal
                      </button>
                      <button
                        onClick={() => setLymphNodeCondition('malignant')}
                        className={`flex-1 py-1 rounded-lg font-mono text-[10px] font-bold ${
                          lymphNodeCondition === 'malignant'
                            ? 'bg-rose-500 text-white'
                            : 'text-[#E6E8EC]/70'
                        }`}
                      >
                        Malignancy
                      </button>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#0B1F4D] border border-[#E6E8EC]/15 text-xs space-y-2">
                      {lymphNodeCondition === 'acute_odontogenic' && (
                        <>
                          <div className="flex items-center gap-1.5 text-emerald-400 font-bold font-mono">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Acute Inflammatory Lymphadenitis:</span>
                          </div>
                          <p className="text-[#E6E8EC] leading-relaxed text-[11px]">
                            Nodes are <strong>enlarged, firm, tender, and freely mobile</strong>. They roll easily under fingertips against the inner cortex of the mandible, proving an active regional immune barrier against acute odontogenic bacteria.
                          </p>
                        </>
                      )}
                      {lymphNodeCondition === 'healthy' && (
                        <>
                          <div className="flex items-center gap-1.5 text-[#C9A24B] font-bold font-mono">
                            <span>Physiological Resting State:</span>
                          </div>
                          <p className="text-[#E6E8EC] leading-relaxed text-[11px]">
                            Nodes are small (&lt;1 cm), soft, non-tender, and impalpable or easily compressible.
                          </p>
                        </>
                      )}
                      {lymphNodeCondition === 'malignant' && (
                        <>
                          <div className="flex items-center gap-1.5 text-rose-400 font-bold font-mono">
                            <AlertTriangle className="w-4 h-4" />
                            <span>Malignant Metastasis Red Flag:</span>
                          </div>
                          <p className="text-[#E6E8EC] leading-relaxed text-[11px]">
                            Nodes are <strong>stony-hard, painless, and fixed/matted</strong> to surrounding fascia. Immediate biopsy and oncology referral required!
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Finding 3: Ludwig's Angina Airway Alert */}
                {selectedExtraoralSpot === 'ludwigs_angina' && (
                  <div className="p-5 rounded-3xl bg-[#06112C] border border-rose-500 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-600 font-bold uppercase animate-pulse">
                        EMERGENCY AIRWAY ALERT
                      </span>
                      <span className="text-xs text-rose-400 font-mono font-bold">Fascial Spaces</span>
                    </div>

                    <h3 className="font-headings font-bold text-sm text-white">
                      Ludwig&apos;s Angina (Submandibular &amp; Sublingual Cellulitis)
                    </h3>
                    <p className="text-xs text-[#E6E8EC] leading-relaxed">
                      Rapidly spreading bilateral gangrenous cellulitis involving the submandibular, submental, and sublingual fascial spaces. Typically originates from necrotic mandibular 2nd or 3rd molars whose roots extend <strong>below the mylohyoid ridge</strong>.
                    </p>

                    <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-500/60 text-xs text-rose-200 space-y-1">
                      <strong>🚨 Life-Threatening Triad:</strong>
                      <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                        <li>Brawny woody bilateral floor-of-mouth induration</li>
                        <li>Elevation &amp; posterior displacement of tongue</li>
                        <li>Trismus (&lt;20mm mouth opening), stridor, dysphagia &bull; Risk: Asphyxiation</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Finding 4: Canine Space Swelling */}
                {(selectedExtraoralSpot === 'canine_space' ||
                  selectedExtraoralSpot === 'buccal_space' ||
                  selectedExtraoralSpot === 'submental') && (
                  <div className="p-5 rounded-3xl bg-[#06112C] border border-[#C9A24B]/40 space-y-3 shadow-xl">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1B3A8C] text-[#C9A24B] border border-[#C9A24B]/30 font-bold uppercase">
                      Fascial Plane Spread
                    </span>
                    <h3 className="font-headings font-bold text-sm text-white">
                      {selectedExtraoralSpot === 'canine_space'
                        ? 'Canine Space Cellulitis'
                        : selectedExtraoralSpot === 'buccal_space'
                        ? 'Buccal Space Infection'
                        : 'Submental Space Drainage'}
                    </h3>
                    <p className="text-xs text-[#E6E8EC] leading-relaxed">
                      {selectedExtraoralSpot === 'canine_space' &&
                        'Originates from maxillary canine or 1st premolar apex above the levator anguli oris. Causes obliteration of the nasolabial groove, lower eyelid edema, and risk of retrograde spread via the angular vein into the cavernous sinus.'}
                      {selectedExtraoralSpot === 'buccal_space' &&
                        'Determined by the buccinator muscle attachment. Infection breaking through bone above the maxillary buccinator attachment or below the mandibular attachment spreads into the facial buccal space.'}
                      {selectedExtraoralSpot === 'submental' &&
                        'Suppuration from mandibular incisors breaching below the mentalis insertion, spreading into the triangle between the anterior bellies of the digastric muscles.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 2: INTRAORAL HARD TISSUE & TOOTH DISCOLORATION LAB */}
        {/* ========================================================================= */}
        {activeExamSection === 'intraoral' && (
          <div className="space-y-6">
            <div className="p-4 rounded-3xl bg-[#06112C] border border-[#C9A24B]/30 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#1B3A8C] text-[#C9A24B] border border-[#C9A24B]/30">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-headings font-bold uppercase tracking-wider text-[#C9A24B]">
                    Stage 3: Intraoral Hard Tissue &amp; Tooth Discoloration Spectrophotometry Lab
                  </h4>
                  <p className="text-xs text-[#E6E8EC]/85 mt-0.5">
                    Test the 4 diagnostic crown color shifts from Lecture 1 and simulate fiber-optic transillumination beam tests.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsTransilluminationActive(!isTransilluminationActive)}
                  className={`px-3 py-1.5 rounded-xl font-headings text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
                    isTransilluminationActive
                      ? 'bg-[#C9A24B] text-[#0B1F4D]'
                      : 'bg-[#1B3A8C] text-white border border-[#E6E8EC]/20'
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>{isTransilluminationActive ? 'Fiber-Optic Beam ON' : 'Turn Light Beam ON'}</span>
                </button>
              </div>
            </div>

            {/* Interactive Crown Visualizer & Diagnostic Selector */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Crown Rendering Area (6 cols) */}
              <div className="lg:col-span-6 p-6 rounded-3xl bg-[#06112C] border border-[#E6E8EC]/15 space-y-4 shadow-2xl flex flex-col items-center justify-center">
                <div className="w-full flex items-center justify-between text-xs font-mono">
                  <span className="text-[#C9A24B] font-bold">5000K Operatory Light Simulation</span>
                  <span className="text-[#E6E8EC]/70">Crown Shade: {selectedDiscoloration.replace('_', ' ').toUpperCase()}</span>
                </div>

                {/* SVG Tooth Crown with Dynamic Shading & Transillumination */}
                <div className="relative w-64 h-72 rounded-2xl bg-gradient-to-b from-[#0B1F4D] to-[#06112C] border border-[#E6E8EC]/20 flex items-center justify-center overflow-hidden shadow-inner">
                  <svg viewBox="0 0 200 240" className="w-full h-full p-4">
                    {/* Fiber-Optic Light Source Beam */}
                    {isTransilluminationActive && (
                      <g>
                        <circle
                          cx={lightPosition === 'lingual' ? 100 : 30}
                          cy="160"
                          r="18"
                          fill="#FAF8F3"
                          className="animate-pulse opacity-90 filter drop-shadow-[0_0_24px_rgba(255,255,255,1)]"
                        />
                        <path
                          d={
                            lightPosition === 'lingual'
                              ? 'M80 160 L40 60 L160 60 Z'
                              : 'M30 160 L90 50 L110 120 Z'
                          }
                          fill="url(#transillumBeamGrad)"
                          opacity="0.45"
                        />
                      </g>
                    )}

                    {/* Tooth Root & Crown Contour */}
                    <path
                      d="M60 40 C60 20 140 20 140 40 C145 70 150 110 135 150 C125 180 120 220 100 220 C80 220 75 180 65 150 C50 110 55 70 60 40 Z"
                      fill={
                        selectedDiscoloration === 'pink_spot'
                          ? 'url(#pinkSpotGrad)'
                          : selectedDiscoloration === 'gray_brown'
                          ? 'url(#grayBrownGrad)'
                          : selectedDiscoloration === 'yellow_opaque'
                          ? 'url(#yellowOpaqueGrad)'
                          : selectedDiscoloration === 'chalky_white'
                          ? '#E8ECEF'
                          : 'url(#healthyEnamelGrad)'
                      }
                      stroke="#C9A24B"
                      strokeWidth="2.5"
                      className="filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
                    />

                    {/* Internal Pulp Chamber Indicator */}
                    <path
                      d="M85 60 C85 45 115 45 115 60 C115 90 110 130 100 170 C90 130 85 90 85 60 Z"
                      fill={
                        selectedDiscoloration === 'pink_spot'
                          ? '#E11D48'
                          : selectedDiscoloration === 'gray_brown'
                          ? '#1E293B'
                          : selectedDiscoloration === 'yellow_opaque'
                          ? '#D97706'
                          : '#991B1B'
                      }
                      opacity={selectedDiscoloration === 'yellow_opaque' ? 0.3 : 0.8}
                    />

                    {/* Gradients */}
                    <defs>
                      <linearGradient id="transillumBeamGrad" x1="0" y1="1" x2="0" y2="0">
                        <stop stopColor="#FAF8F3" stopOpacity="0.8" />
                        <stop offset="1" stopColor="#FAF8F3" stopOpacity="0" />
                      </linearGradient>

                      <radialGradient id="pinkSpotGrad" cx="50%" cy="40%" r="45%">
                        <stop offset="20%" stopColor="#FB7185" />
                        <stop offset="60%" stopColor="#FDA4AF" />
                        <stop offset="100%" stopColor="#E2E8F0" />
                      </radialGradient>

                      <linearGradient id="grayBrownGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#475569" />
                        <stop offset="60%" stopColor="#334155" />
                        <stop offset="100%" stopColor="#1E293B" />
                      </linearGradient>

                      <linearGradient id="yellowOpaqueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FDE68A" />
                        <stop offset="60%" stopColor="#F59E0B" />
                        <stop offset="100%" stopColor="#D97706" />
                      </linearGradient>

                      <linearGradient id="healthyEnamelGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FAF8F3" />
                        <stop offset="70%" stopColor="#F1F5F9" />
                        <stop offset="100%" stopColor="#E2E8F0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Transillumination controls */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setLightPosition('lingual')}
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-semibold ${
                      lightPosition === 'lingual'
                        ? 'bg-[#C9A24B] text-[#0B1F4D]'
                        : 'bg-[#0B1F4D] text-[#E6E8EC]/70'
                    }`}
                  >
                    Lingual Beam Position
                  </button>
                  <button
                    onClick={() => setLightPosition('buccal')}
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-semibold ${
                      lightPosition === 'buccal'
                        ? 'bg-[#C9A24B] text-[#0B1F4D]'
                        : 'bg-[#0B1F4D] text-[#E6E8EC]/70'
                    }`}
                  >
                    Buccal Beam Position
                  </button>
                </div>
              </div>

              {/* Shading Options & Pathology Clinical Pearls (6 cols) */}
              <div className="lg:col-span-6 space-y-3.5">
                <span className="font-headings font-bold text-xs uppercase tracking-wider text-[#C9A24B] block">
                  Select Diagnostic Crown Color Shift:
                </span>

                <div className="grid grid-cols-2 gap-3">
                  {/* Pink Spot */}
                  <button
                    onClick={() => setSelectedDiscoloration('pink_spot')}
                    className={`p-3.5 rounded-2xl border text-left transition-all space-y-1 ${
                      selectedDiscoloration === 'pink_spot'
                        ? 'bg-[#06112C] border-rose-400 ring-1 ring-rose-400'
                        : 'bg-[#06112C]/70 border-[#E6E8EC]/15 hover:border-[#C9A24B]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-pink-500 border border-white" />
                      <strong className="text-xs text-pink-300 font-headings">Pink Spot of Mummery</strong>
                    </div>
                    <p className="text-[10px] text-[#E6E8EC]/80 leading-snug">
                      Internal Root Resorption vascular granulation destroying coronal dentin.
                    </p>
                  </button>

                  {/* Gray / Brown */}
                  <button
                    onClick={() => setSelectedDiscoloration('gray_brown')}
                    className={`p-3.5 rounded-2xl border text-left transition-all space-y-1 ${
                      selectedDiscoloration === 'gray_brown'
                        ? 'bg-[#06112C] border-[#C9A24B] ring-1 ring-[#C9A24B]'
                        : 'bg-[#06112C]/70 border-[#E6E8EC]/15 hover:border-[#C9A24B]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-slate-600 border border-white" />
                      <strong className="text-xs text-slate-200 font-headings">Dark Gray / Brown</strong>
                    </div>
                    <p className="text-[10px] text-[#E6E8EC]/80 leading-snug">
                      Pulp Necrosis erythrocyte hemolysis &amp; iron sulfides in tubules.
                    </p>
                  </button>

                  {/* Yellow Opaque */}
                  <button
                    onClick={() => setSelectedDiscoloration('yellow_opaque')}
                    className={`p-3.5 rounded-2xl border text-left transition-all space-y-1 ${
                      selectedDiscoloration === 'yellow_opaque'
                        ? 'bg-[#06112C] border-amber-400 ring-1 ring-amber-400'
                        : 'bg-[#06112C]/70 border-[#E6E8EC]/15 hover:border-[#C9A24B]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-white" />
                      <strong className="text-xs text-amber-300 font-headings">Yellow Opaque</strong>
                    </div>
                    <p className="text-[10px] text-[#E6E8EC]/80 leading-snug">
                      Pulp Canal Obliteration / Calcific Metamorphosis (tertiary dentin).
                    </p>
                  </button>

                  {/* Normal Crystalline */}
                  <button
                    onClick={() => setSelectedDiscoloration('normal')}
                    className={`p-3.5 rounded-2xl border text-left transition-all space-y-1 ${
                      selectedDiscoloration === 'normal'
                        ? 'bg-[#06112C] border-emerald-400 ring-1 ring-emerald-400'
                        : 'bg-[#06112C]/70 border-[#E6E8EC]/15 hover:border-[#C9A24B]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-slate-100 border border-emerald-500" />
                      <strong className="text-xs text-emerald-300 font-headings">Normal Vital Tooth</strong>
                    </div>
                    <p className="text-[10px] text-[#E6E8EC]/80 leading-snug">
                      Translucent crystalline enamel reflecting healthy pulp vitality.
                    </p>
                  </button>
                </div>

                {/* Explanatory Clinical Box */}
                <div className="p-4 rounded-2xl bg-[#06112C] border border-[#C9A24B]/30 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C9A24B] shrink-0" />
                    <span className="font-headings font-bold text-xs uppercase text-[#C9A24B]">
                      Lecture 1 Transillumination Rule:
                    </span>
                  </div>
                  <p className="text-[#FAF8F3] text-[11px] leading-relaxed">
                    A healthy tooth transmits fiber-optic beam light completely across the crown. However, in a <strong>cracked tooth</strong>, light stops abruptly at the fracture margin because the air-gap within the crack plane cannot conduct light rays!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 3: INTERACTIVE GUTTA-PERCHA SINUS TRACER LAB (FIG 1 & 2) */}
        {/* ========================================================================= */}
        {activeExamSection === 'sinus_tracer' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="p-5 rounded-3xl bg-[#06112C] border border-[#C9A24B]/40 flex items-center justify-between shadow-xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-[#1B3A8C] text-[#C9A24B] border border-[#C9A24B]/30">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white font-headings text-sm">
                    Interactive Gutta-Percha Sinus Tract Tracing Lab
                  </h3>
                  <p className="text-xs text-[#E6E8EC]/80">
                    Lecture 1 (Page 4, Fig 1 &amp; 2): Trace a flexible radiopaque #25 GP cone through the fistulous stoma to identify the culprit root.
                  </p>
                </div>
              </div>
              {onSimulateIn3D && (
                <button
                  onClick={() => onSimulateIn3D('sinus_tracing')}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#C9A24B] hover:bg-[#DFBA67] text-[#0B1F4D] font-headings font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
                >
                  <Box className="w-4 h-4" />
                  <span>Simulate in 3D</span>
                </button>
              )}
            </div>

            {/* Interactive Tracing Canvas / Control Box */}
            <div className="p-6 rounded-3xl bg-[#06112C] border border-[#E6E8EC]/15 space-y-6 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Visual Simulation Display */}
                <div className="h-64 rounded-2xl bg-[#0B1F4D] border border-[#C9A24B]/30 p-4 relative overflow-hidden flex flex-col justify-between shadow-inner">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#E6E8EC]/80">Patient Stoma: Vestibular Gingiva</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isXrayTaken
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                          : 'bg-[#1B3A8C] text-[#C9A24B]'
                      }`}
                    >
                      {isXrayTaken ? 'Radiograph Exposed' : 'Clinical View'}
                    </span>
                  </div>

                  {/* Simulated Tooth & Cone Graphic */}
                  <div className="relative w-full flex-1 flex items-center justify-center">
                    <div className="relative w-64 h-40 border border-[#E6E8EC]/20 rounded-xl bg-[#06112C]/90 p-3 overflow-hidden shadow-md">
                      {/* Three Teeth Representations */}
                      <div className="flex justify-around items-end h-full">
                        <div className="w-14 text-center">
                          <div className="text-[10px] font-mono text-[#E6E8EC]/70">#4 (Premolar)</div>
                          <div className="h-20 w-8 mx-auto bg-[#1B3A8C]/40 rounded-t-lg border border-[#1B3A8C] relative">
                            <span className="text-[8px] text-emerald-400 font-mono block pt-1">Vital</span>
                          </div>
                        </div>

                        <div className="w-14 text-center">
                          <div className="text-[10px] font-mono text-rose-400 font-bold">#5 (Culprit)</div>
                          <div className="h-24 w-10 mx-auto bg-rose-950/40 rounded-t-xl border border-rose-500 relative">
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#0B1F4D] border border-dashed border-rose-500/80 animate-pulse" />
                            <span className="text-[8px] text-rose-300 font-mono block pt-1">Necrotic</span>
                          </div>
                        </div>

                        <div className="w-14 text-center">
                          <div className="text-[10px] font-mono text-[#E6E8EC]/70">#6 (Canine)</div>
                          <div className="h-22 w-8 mx-auto bg-[#1B3A8C]/40 rounded-t-lg border border-[#1B3A8C] relative">
                            <span className="text-[8px] text-emerald-400 font-mono block pt-1">Vital</span>
                          </div>
                        </div>
                      </div>

                      {/* Gutta-Percha Cone Visual Path */}
                      <div
                        className="absolute bottom-2 left-6 h-1.5 bg-gradient-to-r from-pink-500 to-rose-400 rounded-full transition-all duration-300 shadow-md shadow-pink-500/50"
                        style={{ width: `${(gpInsertionDepth / 25) * 65}%` }}
                      >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white border border-pink-600 animate-ping" />
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] font-mono text-[#C9A24B] text-center">
                    {gpInsertionDepth >= 20 ? (
                      <span className="text-emerald-400 font-bold">🎯 Tip engaged at root apex of #5!</span>
                    ) : (
                      <span>Snaking GP cone through fistulous tract ({gpInsertionDepth} mm depth)...</span>
                    )}
                  </div>
                </div>

                {/* Controls & Clinical Workflow */}
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-headings text-xs font-bold uppercase text-[#C9A24B] block mb-1.5">
                      1. Thread Gutta-Percha Cone #25 (Depth: {gpInsertionDepth} mm):
                    </label>
                    <input
                      type="range"
                      min={5}
                      max={25}
                      value={gpInsertionDepth}
                      onChange={(e) => setGpInsertionDepth(Number(e.target.value))}
                      className="w-full accent-[#C9A24B] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-[#E6E8EC]/60 mt-1">
                      <span>5 mm (Stoma Entrance)</span>
                      <span>25 mm (Full Apical Depth)</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="font-headings text-xs font-bold uppercase text-[#C9A24B] block">
                      2. Radiographic Diagnostic Exposure:
                    </label>
                    <button
                      onClick={() => setIsXrayTaken(true)}
                      className={`w-full py-2.5 rounded-xl font-headings text-xs font-bold uppercase tracking-wider transition-all shadow-md ${
                        isXrayTaken
                          ? 'bg-emerald-950 border border-emerald-500 text-emerald-300'
                          : 'bg-[#C9A24B] hover:bg-[#DFBA67] text-[#0B1F4D]'
                      }`}
                    >
                      {isXrayTaken ? '✓ Radiograph Recorded (Cone in situ)' : '📷 Expose Periapical Radiograph'}
                    </button>
                  </div>

                  {isXrayTaken && (
                    <div className="p-3.5 rounded-2xl bg-[#0B1F4D] border border-emerald-500/50 space-y-2 animate-fadeIn shadow-lg">
                      <div className="flex items-center gap-2 font-bold font-headings text-emerald-300 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Fistula Trace Result (Lecture Fig 2):</span>
                      </div>
                      <p className="text-[11px] text-[#FAF8F3] leading-relaxed">
                        Even though the stoma opened adjacent to the premolar #4, the flexible #25 GP cone traced through the cancellous bone straight to the necrotic apex of tooth #5! Never assume the tooth closest to a stoma is the culprit without tracing.
                      </p>
                      <button
                        onClick={() => {
                          setGpInsertionDepth(18);
                          setIsXrayTaken(false);
                        }}
                        className="text-[10px] font-mono text-[#C9A24B] hover:underline"
                      >
                        Reset Simulation
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 4: 6-POINT PROBING & MILLER MOBILITY SIMULATOR */}
        {/* ========================================================================= */}
        {activeExamSection === 'probing_mobility' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="p-5 rounded-3xl bg-[#06112C] border border-[#C9A24B]/30 flex items-center justify-between shadow-xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-[#1B3A8C] text-[#C9A24B] border border-[#C9A24B]/30">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white font-headings text-sm">
                    Interactive 6-Point Periodontal Probing &amp; Mobility Grading
                  </h3>
                  <p className="text-xs text-[#E6E8EC]/80">
                    Walk the periodontal probe around the root circumference to detect narrow Vertical Root Fracture (VRF) defects vs generalized periodontitis.
                  </p>
                </div>
              </div>
            </div>

            {/* Probing Simulation Canvas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Probing Depth Visualizer (Left) */}
              <div className="p-6 rounded-3xl bg-[#06112C] border border-[#E6E8EC]/15 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-headings font-bold text-[#C9A24B]">
                    6-Point Sulcular Walking
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1B3A8C] text-[#FAF8F3]">
                    Site: {PROBING_SITES[activeProbingSiteIndex]}
                  </span>
                </div>

                {/* Scenario Selector */}
                <div className="flex gap-1.5 p-1 bg-[#0B1F4D] rounded-xl border border-[#E6E8EC]/15 text-xs">
                  <button
                    onClick={() => setProbingCase('vrf')}
                    className={`flex-1 py-1 rounded-lg font-mono text-[10px] font-bold ${
                      probingCase === 'vrf'
                        ? 'bg-rose-500 text-white'
                        : 'text-[#E6E8EC]/70 hover:text-white'
                    }`}
                  >
                    VRF Fracture
                  </button>
                  <button
                    onClick={() => setProbingCase('periodontitis')}
                    className={`flex-1 py-1 rounded-lg font-mono text-[10px] font-bold ${
                      probingCase === 'periodontitis'
                        ? 'bg-[#C9A24B] text-[#0B1F4D]'
                        : 'text-[#E6E8EC]/70 hover:text-white'
                    }`}
                  >
                    Periodontitis
                  </button>
                  <button
                    onClick={() => setProbingCase('healthy')}
                    className={`flex-1 py-1 rounded-lg font-mono text-[10px] font-bold ${
                      probingCase === 'healthy'
                        ? 'bg-emerald-500 text-white'
                        : 'text-[#E6E8EC]/70 hover:text-white'
                    }`}
                  >
                    Healthy Sulcus
                  </button>
                </div>

                {/* Probe Visual Graphic */}
                <div className="h-44 rounded-2xl bg-[#0B1F4D] border border-[#E6E8EC]/15 p-4 flex flex-col justify-between items-center relative overflow-hidden">
                  <div className="w-full flex justify-between text-xs font-mono">
                    <span className="text-[#E6E8EC]/70">Gingival Crest</span>
                    <span
                      className={`font-bold ${
                        currentDepth >= 7 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      Depth: {currentDepth} mm {currentDepth >= 7 ? '(PATHOLOGICAL!)' : '(Normal)'}
                    </span>
                  </div>

                  {/* Probe Millimeter Graphic */}
                  <div className="w-24 h-28 bg-[#06112C] rounded-xl border border-[#E6E8EC]/20 relative flex items-center justify-center">
                    <div
                      className="w-3 bg-gradient-to-b from-slate-300 via-slate-400 to-slate-200 rounded-b-sm border border-slate-600 transition-all duration-300 relative shadow-md"
                      style={{ height: `${Math.min(100, currentDepth * 10)}%` }}
                    >
                      {/* UNC-15 Color Bands */}
                      <div className="absolute top-4 left-0 w-full h-2 bg-slate-900" />
                      <div className="absolute top-9 left-0 w-full h-2 bg-slate-900" />
                    </div>
                  </div>

                  <div className="text-[10px] font-mono text-[#C9A24B] text-center">
                    {probingCase === 'vrf' && activeProbingSiteIndex === 1 ? (
                      <span className="text-rose-400 font-bold">
                        ⚠️ Isolated narrow 9mm drop: Pathognomonic for Vertical Root Fracture!
                      </span>
                    ) : (
                      <span>Walking probe around 6 circumferential line angles...</span>
                    )}
                  </div>
                </div>

                {/* 6 Anatomical Sites Selector Buttons */}
                <div className="grid grid-cols-3 gap-1.5">
                  {PROBING_SITES.map((site, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveProbingSiteIndex(idx)}
                      className={`p-2 rounded-xl text-center font-mono text-[10px] font-bold border transition-all ${
                        activeProbingSiteIndex === idx
                          ? 'bg-[#C9A24B] text-[#0B1F4D] border-[#C9A24B] shadow-md'
                          : 'bg-[#0B1F4D] border-[#E6E8EC]/15 text-[#E6E8EC] hover:border-[#C9A24B]'
                      }`}
                    >
                      <div>{site.split(' ')[0]}</div>
                      <div
                        className={`text-[9px] ${
                          currentDepths[idx] >= 7 ? 'text-rose-400 font-extrabold' : 'text-[#E6E8EC]/60'
                        }`}
                      >
                        {currentDepths[idx]} mm
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Miller Mobility Simulator (Right) */}
              <div className="p-6 rounded-3xl bg-[#06112C] border border-[#E6E8EC]/15 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-headings font-bold text-[#C9A24B]">
                    Miller Tooth Mobility Classification
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1B3A8C] text-[#FAF8F3]">
                    Grade {testedMobilityGrade}
                  </span>
                </div>

                {/* Mobility Grade Buttons */}
                <div className="space-y-2 text-xs">
                  {[
                    { grade: 0, label: 'Grade 0: Physiological (<0.2 mm)', desc: 'Normal healthy PDL cushion', color: 'emerald' },
                    { grade: 1, label: 'Grade I: Horizontal ≤ 1 mm', desc: 'Mild horizontal deflection between two mirror handles', color: 'cyan' },
                    { grade: 2, label: 'Grade II: Horizontal > 1 mm', desc: 'Moderate horizontal movement in any direction', color: 'amber' },
                    { grade: 3, label: 'Grade III: Horizontal + Vertical Axial', desc: 'Severe movement with axial depressibility into socket (Hopeless)', color: 'rose' },
                  ].map((m) => (
                    <button
                      key={m.grade}
                      onClick={() => {
                        setTestedMobilityGrade(m.grade);
                        setIsVerticalDepressible(m.grade === 3);
                      }}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                        testedMobilityGrade === m.grade
                          ? 'bg-[#0B1F4D] border-[#C9A24B] ring-1 ring-[#C9A24B]'
                          : 'bg-[#0B1F4D]/50 border-[#E6E8EC]/15 hover:border-[#C9A24B]/40'
                      }`}
                    >
                      <div>
                        <strong className="text-xs text-white block font-headings">{m.label}</strong>
                        <span className="text-[10px] text-[#E6E8EC]/70">{m.desc}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#C9A24B]" />
                    </button>
                  ))}
                </div>

                {/* Tactile Testing Pearl */}
                <div className="p-3.5 rounded-2xl bg-[#0B1F4D] border border-[#E6E8EC]/15 text-xs space-y-1.5">
                  <strong className="text-[#C9A24B] font-headings text-xs block">
                    Lecture Clinical Technique Rule:
                  </strong>
                  <p className="text-[11px] text-[#E6E8EC] leading-relaxed">
                    Always place the metallic handles of <strong>two mouth mirrors</strong> against the buccal and lingual tooth surfaces. Never use finger pads because soft tissue cushions yield and give false tactile displacement!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
