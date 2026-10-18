import React, { useState } from 'react';
import { DiseaseId } from '../../types';
import { DISEASES_DATA } from '../../data/lectureData';
import { useLearning } from '../../context/LearningContext';
import { Periodontal3D } from '../3d/Periodontal3D';
import { SkinTarget3D } from '../3d/SkinTarget3D';
import { OralCavity3D } from '../3d/OralCavity3D';
import { NugDebridementSimulator } from '../procedures/NugDebridementSimulator';
import { SjsScortenCalculator } from '../procedures/SjsScortenCalculator';
import { PatchTestSimulator } from '../procedures/PatchTestSimulator';
import { CoxsackieDiagnosticDecisionTree } from '../procedures/CoxsackieDiagnosticDecisionTree';
import { CmvDiagnosticDecisionTree } from '../procedures/CmvDiagnosticDecisionTree';
import { Virion3DModuleExplorer } from './Virion3DModuleExplorer';
import {
  CheckCircle,
  AlertTriangle,
  Pill,
  Microscope,
  Stethoscope,
  ShieldAlert,
  ChevronRight,
  Sparkles,
  BookOpen,
  ArrowRight,
  Activity,
  Layers,
  Award,
  Zap,
  Info
} from 'lucide-react';

interface DiseaseModuleViewProps {
  diseaseId: DiseaseId;
  onNavigateTab?: (tab: any) => void;
}

export const DiseaseModuleView: React.FC<DiseaseModuleViewProps> = ({ diseaseId, onNavigateTab }) => {
  const { markModuleComplete, progress, openImageModal } = useLearning();
  const disease = DISEASES_DATA[diseaseId];

  const [activeSection, setActiveSection] = useState<
    'overview' | '3d-explorer' | 'pathogenesis' | 'clinical' | 'diagnostic' | 'treatment' | 'challenge'
  >('overview');

  // Interactive Parameters
  const [immuneStatus, setImmuneStatus] = useState<number>(30); // 0 (severely immunocompromised) to 100 (competent)
  const [cmvTropism, setCmvTropism] = useState<'endothelium' | 'mononuclear' | 'wbc'>('endothelium');
  const [patientWeightKg, setPatientWeightKg] = useState<number>(70);
  const [challengeAnswer, setChallengeAnswer] = useState<number | null>(null);

  // Embedded visual hotspot state
  const [activeVisualHotspot, setActiveVisualHotspot] = useState<number | null>(0);

  const isCompleted = progress.completedModules[diseaseId];

  // Weight-based dosing formulas from lecture
  const ganciclovirDose = patientWeightKg * 5; // 5 mg/kg IV BID
  const valganciclovirDose = 900; // 900 mg PO BID fixed dose

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Module Title & Hero Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div
          className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ backgroundColor: disease.color }}
        />
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>Oral Medicine Lecture 2</span>
              <span>·</span>
              <span className="font-semibold text-teal-400">{disease.category}</span>
              <span>·</span>
              <span>Slides {disease.slidesReferenced.join(', ')}</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <span>{disease.title}</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => markModuleComplete(diseaseId)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                isCompleted
                  ? 'bg-emerald-950 border border-emerald-700/60 text-emerald-300'
                  : 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-md'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isCompleted ? 'Module Mastered' : 'Mark as Complete'}</span>
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800 overflow-x-auto text-xs">
          {[
            { id: 'overview', label: '1. Overview', icon: BookOpen },
            { id: '3d-explorer', label: '2. 3D Anatomy Explorer', icon: Layers },
            { id: 'pathogenesis', label: '3. Pathogenesis Simulator', icon: Activity },
            { id: 'clinical', label: '4. Clinical Inspection Gallery', icon: Stethoscope },
            { id: 'diagnostic', label: '5. Diagnostic Decision Tree', icon: Microscope },
            { id: 'treatment', label: '6. Treatment & Procedure Lab', icon: Pill },
            { id: 'challenge', label: '7. Knowledge Check', icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                  isActive
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: OVERVIEW */}
      {activeSection === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
              <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-teal-400" />
                <span>Etiology & Epidemiological Core</span>
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">{disease.etiology}</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
              <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                <span>Pathogenesis & Cellular Mechanisms</span>
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">{disease.pathogenesis}</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
              <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-rose-400" />
                <span>Oral Manifestations</span>
              </h2>
              <ul className="space-y-2.5 text-sm text-slate-300">
                {disease.oralManifestations.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Pearl & Systemic */}
          <div className="space-y-6">
            <div className="bg-amber-950/30 border border-amber-800/60 rounded-xl p-5 shadow-lg">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Board Exam Clinical Pearl</span>
              </div>
              <p className="text-xs text-amber-200/90 leading-relaxed">{disease.clinicalPearl}</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
              <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-sky-400" />
                <span>Systemic & Population Findings</span>
              </h2>
              <ul className="space-y-2 text-xs text-slate-300">
                {disease.systemicFindings.map((sys, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                    <span>{sys}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: 3D ANATOMY EXPLORER */}
      {activeSection === '3d-explorer' && (
        <>
          {(diseaseId === 'cmv' || diseaseId === 'coxsackie') ? (
            <Virion3DModuleExplorer
              virusType={diseaseId}
              cmvTropism={cmvTropism}
              onSetCmvTropism={setCmvTropism}
              onNext={() => setActiveSection('pathogenesis')}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
              <div className="lg:col-span-8">
                {diseaseId === 'nug' && <Periodontal3D progressionStage="nug" />}
                {diseaseId === 'em' && <SkinTarget3D lesionType="classic-target" />}
                {diseaseId === 'sjs-ten' && <SkinTarget3D lesionType="atypical-purpuric" />}
                {diseaseId === 'pcs' && (
                  <OralCavity3D selectedDisease="pcs" severityLevel={80} isInteractive={true} />
                )}
              </div>

              <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-lg">
                <div>
                  <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-teal-400" />
                    <span>3D Anatomical Navigation</span>
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Rotate, pan, and zoom the 3D specimen to inspect pathological alterations at high resolution.
                  </p>
                </div>

                <button
                  onClick={() => setActiveSection('pathogenesis')}
                  className="w-full mt-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold rounded-lg text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Next: Pathogenesis Simulator</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* SECTION 3: PATHOGENESIS SIMULATOR */}
      {activeSection === 'pathogenesis' && (
        <div className="space-y-6 animate-fade-in">
          {/* If SJS/TEN, show the SCORTEN calculator here */}
          {diseaseId === 'sjs-ten' && <SjsScortenCalculator />}

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
            <div>
              <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-400" />
                <span>Interactive Pathogenesis & Immune Simulator</span>
              </h2>
              <p className="text-xs text-slate-400">
                Adjust host immune status to model cellular tissue destruction and disease kinetics.
              </p>
            </div>

            {/* Immune Slider */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">Patient Immune Competency Status:</span>
                <span className="font-mono text-teal-400 font-bold">
                  {immuneStatus < 30 ? 'Severely Immunocompromised (CD4 <200 / Graft Recipient)' : immuneStatus < 70 ? 'Moderate Immune Suppression' : 'Immunocompetent Host'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={immuneStatus}
                onChange={(e) => setImmuneStatus(Number(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Severe Deficiency</span>
                <span>Moderate Exhaustion</span>
                <span>Normal Defense</span>
              </div>
            </div>

            {/* Pathogenesis Narrative */}
            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-xs leading-relaxed space-y-2">
              {diseaseId === 'cmv' && (
                <>
                  <div className="font-semibold text-teal-400">Microvascular Infarction Mechanism (Slides 2 & 4):</div>
                  <p className="text-slate-300">
                    {immuneStatus < 40
                      ? 'CMV replicates in vascular endothelial cells, causing severe endothelial swelling, vasculopathy, and thrombosis. Microvascular infarction causes extensive tissue necrosis, resulting in solitary large persistent non-healing ulcers lasting weeks to months in AIDS and post-transplant hosts.'
                      : 'In immunocompetent patients, primary CMV infection is either completely asymptomatic or causes an infectious mononucleosis-like syndrome with marked lymphocytosis, but with little lymphadenopathy or splenomegaly.'}
                  </p>
                </>
              )}

              {diseaseId === 'coxsackie' && (
                <>
                  <div className="font-semibold text-teal-400">Enterovirus GI Replication & Shedding (Slide 6):</div>
                  <p className="text-slate-300">
                    Replication is extensive in lower GI lymphoid tissue and less in oropharynx. Viral shedding in feces persists for weeks. Summer epidemics in children &lt;10 years cause acute viremia seeding oral mucosa and extremities.
                  </p>
                </>
              )}

              {diseaseId === 'nug' && (
                <>
                  <div className="font-semibold text-teal-400">Neutrophil Chemotaxis Defect & Biofilm Invasion (Slide 12):</div>
                  <p className="text-slate-300">
                    {immuneStatus < 40
                      ? 'Severe neutrophil failure permits Fusobacterium necrophorum to release dermonecrotic toxins, hemolysins, and proteases, causing rapid progression to Noma (cancrum oris) with cone-shaped facial gangrene and 70–90% untreated mortality.'
                      : 'Endotoxins produced by Treponema species, Prevotella intermedia, and Fusobacterium nucleatum destroy interdental papillae, producing pathognomonic punched-out necrotic craters.'}
                  </p>
                </>
              )}

              {diseaseId === 'em' && (
                <>
                  <div className="font-semibold text-teal-400">CD34+ Langerhans HSV DNA Dissemination (Slide 18):</div>
                  <p className="text-slate-300">
                    1–3 weeks following an HSV cold sore, CD34+ Langerhans cell precursors transport HSV DNA fragments to peripheral skin. Recruited cytotoxic CD8+ T cells and NK cells trigger apoptosis of basal keratinocytes, producing classic concentric iris targets on palms and crusted bleeding lips.
                  </p>
                </>
              )}

              {diseaseId === 'sjs-ten' && (
                <>
                  <div className="font-semibold text-teal-400">Epidermal Keratinocyte Apoptosis (Slide 24):</div>
                  <p className="text-slate-300">
                    Medication metabolites bind HLA molecules on keratinocytes. Cytotoxic granulysin and Fas-FasL trigger full-thickness epidermal necrosis and detachment at the dermo-epidermal junction with remarkably little dermal inflammation.
                  </p>
                </>
              )}

              {diseaseId === 'pcs' && (
                <>
                  <div className="font-semibold text-teal-400">B-Cell Polyclonal Infiltration (Slide 27):</div>
                  <p className="text-slate-300">
                    Contactants like cinnamaldehyde in chewing gum incite intense B-cell proliferation. Dense sheets of polyclonal plasma cells and dilated superficial capillaries expand the lamina propria, producing the fiery red attached gingival band.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: CLINICAL INSPECTION GALLERY (EMBEDDED VISUALS + ANNOTATIONS) */}
      {activeSection === 'clinical' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6 animate-fade-in">
          <div>
            <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-rose-400" />
              <span>Interactive Clinical Examination & Image Annotations</span>
            </h2>
            <p className="text-xs text-slate-400">
              Interactive high-resolution clinical presentation diagrams with live hotspot annotations.
            </p>
          </div>

          {/* Embedded Visual Inspection Canvas */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center relative min-h-[300px]">
              {/* Graphic for this disease */}
              {diseaseId === 'cmv' && (
                <svg viewBox="0 0 500 300" className="w-full h-auto rounded-lg">
                  <rect width="500" height="300" fill="#0f172a" />
                  {/* Tongue Lateral Border */}
                  <path d="M 80,70 C 160,40 400,50 440,160 C 420,260 180,270 80,220 Z" fill="#b91c1c" />
                  {/* Hairy Leukoplakia Plaque */}
                  <path d="M 140,80 C 220,60 360,70 390,140 C 360,180 230,170 140,140 Z" fill="#e2e8f0" opacity="0.9" />
                  {/* Solitary CMV Ulcer Crater */}
                  <ellipse cx="270" cy="150" rx="60" ry="38" fill="#450a0a" stroke="#7f1d1d" strokeWidth="4" />
                  <ellipse cx="270" cy="150" rx="42" ry="24" fill="#1c0309" />
                  {/* Hotspot 1 Pin */}
                  <circle cx="270" cy="150" r="10" fill="#0284c7" stroke="#ffffff" strokeWidth="2" className="cursor-pointer" onClick={() => setActiveVisualHotspot(0)} />
                  <text x="270" y="154" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">1</text>
                  {/* Hotspot 2 Pin */}
                  <circle cx="200" cy="100" r="10" fill="#0284c7" stroke="#ffffff" strokeWidth="2" className="cursor-pointer" onClick={() => setActiveVisualHotspot(1)} />
                  <text x="200" y="104" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">2</text>
                </svg>
              )}

              {diseaseId === 'coxsackie' && (
                <svg viewBox="0 0 500 300" className="w-full h-auto rounded-lg">
                  <rect width="500" height="300" fill="#090d16" />
                  {/* Soft Palate & Tonsillar Arch */}
                  <path d="M 80,60 Q 250,30 420,60 C 440,160 440,240 420,280 Q 250,300 80,280 Z" fill="#831843" />
                  {/* Uvula */}
                  <path d="M 235,60 Q 250,130 265,60 Z" fill="#9d174d" stroke="#701a75" />
                  {/* Herpangina 2-4mm Ulcers */}
                  {[
                    { x: 160, y: 110 }, { x: 340, y: 115 }, { x: 190, y: 160 }, { x: 310, y: 170 }, { x: 220, y: 80 }
                  ].map((pt, i) => (
                    <g key={i}>
                      <circle cx={pt.x} cy={pt.y} r="12" fill="#b91c1c" stroke="#f43f5e" strokeWidth="2" />
                      <circle cx={pt.x} cy={pt.y} r="5" fill="#fef08a" />
                    </g>
                  ))}
                  <circle cx="160" cy="110" r="12" fill="#0d9488" stroke="#ffffff" strokeWidth="2" className="cursor-pointer" onClick={() => setActiveVisualHotspot(0)} />
                  <text x="160" y="114" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">1</text>
                  <circle cx="340" cy="115" r="12" fill="#0d9488" stroke="#ffffff" strokeWidth="2" className="cursor-pointer" onClick={() => setActiveVisualHotspot(1)} />
                  <text x="340" y="119" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">2</text>
                </svg>
              )}

              {diseaseId === 'nug' && (
                <svg viewBox="0 0 500 300" className="w-full h-auto rounded-lg">
                  <rect width="500" height="300" fill="#090d16" />
                  {/* Teeth */}
                  {[140, 210, 280, 350].map((tx, i) => (
                    <rect key={i} x={tx} y={60} width={45} height={80} rx="6" fill="#fefce8" stroke="#cbd5e1" strokeWidth="2" />
                  ))}
                  {/* Punched-out papillae */}
                  <path d="M 100,120 C 200,110 300,110 400,120 L 400,260 L 100,260 Z" fill="#991b1b" />
                  {[185, 255, 325].map((cx, i) => (
                    <g key={i}>
                      <path d={`M ${cx - 14},120 Q ${cx},160 ${cx + 14},120 Z`} fill="#334155" stroke="#7f1d1d" strokeWidth="3" />
                      <ellipse cx={cx} cy={135} rx="9" ry="6" fill="#64748b" />
                    </g>
                  ))}
                  <circle cx="255" cy="135" r="12" fill="#d97706" stroke="#ffffff" strokeWidth="2" className="cursor-pointer" onClick={() => setActiveVisualHotspot(0)} />
                  <text x="255" y="139" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">1</text>
                </svg>
              )}

              {diseaseId === 'em' && (
                <svg viewBox="0 0 500 300" className="w-full h-auto rounded-lg">
                  <rect width="500" height="300" fill="#090d16" />
                  {/* Palmar Concentric Target Lesion */}
                  <circle cx="160" cy="150" r="70" fill="#e11d48" opacity="0.85" />
                  <circle cx="160" cy="150" r="44" fill="#fecdd3" />
                  <circle cx="160" cy="150" r="22" fill="#4c0519" />
                  {/* Hemorrhagic Lips */}
                  <ellipse cx="360" cy="150" rx="90" ry="45" fill="#4c0519" stroke="#9f1239" strokeWidth="3" />
                  <ellipse cx="360" cy="150" rx="65" ry="18" fill="#1c0309" />
                  <circle cx="160" cy="150" r="12" fill="#e11d48" stroke="#ffffff" strokeWidth="2" className="cursor-pointer" onClick={() => setActiveVisualHotspot(0)} />
                  <text x="160" y="154" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">1</text>
                  <circle cx="360" cy="150" r="12" fill="#e11d48" stroke="#ffffff" strokeWidth="2" className="cursor-pointer" onClick={() => setActiveVisualHotspot(1)} />
                  <text x="360" y="154" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">2</text>
                </svg>
              )}

              {diseaseId === 'sjs-ten' && (
                <svg viewBox="0 0 500 300" className="w-full h-auto rounded-lg">
                  <rect width="500" height="300" fill="#090d16" />
                  <path d="M 120,40 L 380,40 L 420,270 L 80,270 Z" fill="#581c87" opacity="0.7" />
                  {/* Flaccid detachment sheet */}
                  <path d="M 160,80 Q 250,60 340,90 Q 310,210 180,200 Z" fill="#3b0764" stroke="#c084fc" strokeWidth="3" />
                  <circle cx="250" cy="130" r="12" fill="#9333ea" stroke="#ffffff" strokeWidth="2" className="cursor-pointer" onClick={() => setActiveVisualHotspot(0)} />
                  <text x="250" y="134" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">1</text>
                </svg>
              )}

              {diseaseId === 'pcs' && (
                <svg viewBox="0 0 500 300" className="w-full h-auto rounded-lg">
                  <rect width="500" height="300" fill="#090d16" />
                  {/* Teeth */}
                  {[120, 185, 250, 315, 380].map((tx, i) => (
                    <rect key={i} x={tx} y={110} width={42} height={70} rx="6" fill="#fefce8" stroke="#cbd5e1" strokeWidth="2" />
                  ))}
                  {/* Fiery scarlet attached gingiva */}
                  <path d="M 80,40 C 200,20 300,20 420,40 L 420,110 C 300,105 200,105 80,110 Z" fill="#dc2626" />
                  <path d="M 80,180 C 200,185 300,185 420,180 L 420,250 C 300,265 200,265 80,250 Z" fill="#dc2626" />
                  <circle cx="250" cy="75" r="12" fill="#059669" stroke="#ffffff" strokeWidth="2" className="cursor-pointer" onClick={() => setActiveVisualHotspot(0)} />
                  <text x="250" y="79" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">1</text>
                </svg>
              )}
            </div>

            {/* Hotspot Description Card */}
            <div className="lg:col-span-5 bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[11px] font-mono uppercase text-teal-400 font-semibold block mb-1">
                  Pathognomonic Inspection Landmark
                </span>
                <h3 className="text-sm font-bold text-white mb-2">
                  {diseaseId === 'cmv' && 'Solitary Deep Ulcer Over Oral Hairy Leukoplakia (Slide 5)'}
                  {diseaseId === 'coxsackie' && 'Herpangina Vesicular Eruptions (Slide 9)'}
                  {diseaseId === 'nug' && 'Punched-Out Cratered Interdental Papillae (Slide 15)'}
                  {diseaseId === 'em' && 'Target Iris Lesions & Crusted Lips (Slide 21)'}
                  {diseaseId === 'sjs-ten' && 'Chest Atypical Targets & Epidermal Detachment (Slide 25)'}
                  {diseaseId === 'pcs' && 'Vivid Fiery Red Desquamative Gingivitis (Slide 29)'}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {diseaseId === 'cmv' &&
                    'Notice the rolled, indurated margins of the deep ulcer base on the lateral tongue. EBV-driven oral hairy leukoplakia provides the classic vertical corrugated white background in AIDS patients.'}
                  {diseaseId === 'coxsackie' &&
                    'Small 2–4 mm vesicles erupting strictly on the soft palate, tonsillar pillars, and uvula. The anterior gingiva and lips are completely normal and uninvolved.'}
                  {diseaseId === 'nug' &&
                    'Necrotic pseudomembrane with cratering between teeth. Spontaneous bleeding upon touch and fetid metallic odor. Severe pain prevents brushing, creating abundant plaque.'}
                  {diseaseId === 'em' &&
                    'Pathognomonic 3-zone target with dark central necrotic bulla, pale edematous ring, and outer erythematous halo. Lips display thick, blackish-brown hemorrhagic crusts.'}
                  {diseaseId === 'sjs-ten' &&
                    'Arises primarily on the CHEST as purpuric macules with sheet-like flaccid detachment (positive Nikolsky sign). Multi-mucosal denudation of mouth, eyes, and genitalia.'}
                  {diseaseId === 'pcs' &&
                    'Brightly erythematous, granular attached gingival collar with engorged superficial capillaries and bilateral angular cheilitis. Eosinophils absent; dense polyclonal plasma cells.'}
                </p>
              </div>

              <button
                onClick={() => {
                  openImageModal({
                    title: disease.title,
                    description: disease.clinicalPearl,
                    imageType: diseaseId as any,
                    hotspots: [
                      { x: 50, y: 50, label: 'Primary Pathognomonic Lesion', details: disease.oralManifestations[0] },
                      { x: 30, y: 30, label: 'Adjacent Tissue / Systemic Landmark', details: disease.systemicFindings[0] }
                    ]
                  });
                }}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold rounded-lg text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
              >
                <span>Launch Full-Screen Zoom Viewer</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: DIAGNOSTIC DECISION TREE */}
      {activeSection === 'diagnostic' && (
        <div className="space-y-6 animate-fade-in">
          {/* If CMV, embed the CMV Decision Tree simulator */}
          {diseaseId === 'cmv' && <CmvDiagnosticDecisionTree />}

          {/* If Coxsackie, embed the Decision Tree simulator directly here! */}
          {diseaseId === 'coxsackie' && <CoxsackieDiagnosticDecisionTree />}

          {/* If SJS/TEN, embed SCORTEN prognostic calculator */}
          {diseaseId === 'sjs-ten' && <SjsScortenCalculator />}

          {/* If PCS, embed the Patch Test simulator directly here! */}
          {diseaseId === 'pcs' && <PatchTestSimulator />}

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
            <div>
              <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <Microscope className="w-4 h-4 text-sky-400" />
                <span>Diagnostic Workup & Decision Tree</span>
              </h2>
              <p className="text-xs text-slate-400">
                Order evidence-based laboratory, histopathologic, and molecular tests.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {disease.keyDiagnostics.map((diag, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[11px] font-mono text-teal-400 font-semibold mb-1 block">
                      Diagnostic Step {idx + 1}
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">{diag}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: TREATMENT & PROCEDURES */}
      {activeSection === 'treatment' && (
        <div className="space-y-6 animate-fade-in">
          {/* If NUG, embed the Debridement simulator directly here! */}
          {diseaseId === 'nug' && <NugDebridementSimulator />}

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
            <div>
              <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <Pill className="w-4 h-4 text-emerald-400" />
                <span>Evidence-Based Pharmacology & Management Protocols</span>
              </h2>
              <p className="text-xs text-slate-400">
                Weight-based calculators, drug mechanisms, and clinical resolution times.
              </p>
            </div>

            {diseaseId === 'cmv' && (
              <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">
                    Weight-Based Antiviral Calculator (Slide 5):
                  </span>
                  <span className="font-mono text-xs text-teal-400 font-bold">{patientWeightKg} kg</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="120"
                  value={patientWeightKg}
                  onChange={(e) => setPatientWeightKg(Number(e.target.value))}
                  className="w-full accent-teal-400 cursor-pointer"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-3.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[11px] text-slate-400 block mb-1">IV Ganciclovir (5 mg/kg IV BID)</span>
                    <span className="font-mono text-xl font-bold text-teal-400">{ganciclovirDose} mg</span>
                    <span className="text-xs text-slate-400"> IV every 12 hours</span>
                  </div>
                  <div className="p-3.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[11px] text-slate-400 block mb-1">Oral Valganciclovir Prodrug (Slide 5)</span>
                    <span className="font-mono text-xl font-bold text-sky-400">{valganciclovirDose} mg</span>
                    <span className="text-xs text-slate-400"> PO BID (~10-fold oral bioavailability)</span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Management Guidelines:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {disease.management.map((mgmt, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span className="text-slate-300 leading-relaxed">{mgmt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 7: KNOWLEDGE CHECK */}
      {activeSection === 'challenge' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6 animate-fade-in">
          <div>
            <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Module Knowledge Check</span>
            </h2>
            <p className="text-xs text-slate-400">
              Apply your knowledge to verify mastery and earn your module badge.
            </p>
          </div>

          <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
            <p className="text-sm text-slate-100 font-medium leading-relaxed">
              {diseaseId === 'cmv' && 'What is the characteristic presentation of oral CMV in an immunocompromised host?'}
              {diseaseId === 'coxsackie' && 'Where are lesions strictly confined in Herpangina, distinguishing it from primary herpetic gingivostomatitis?'}
              {diseaseId === 'nug' && 'Which mouthrinse produces clinical resolution in over 90% of acute NUG cases when combined with gentle debridement?'}
              {diseaseId === 'em' && 'What continuous antiviral regimen is proven to prevent recurrent attacks in HSV-associated Erythema Multiforme?'}
              {diseaseId === 'sjs-ten' && 'Which BSA detachment cutoff formally separates Stevens-Johnson Syndrome from Toxic Epidermal Necrolysis (TEN)?'}
              {diseaseId === 'pcs' && 'What is the most definitive microscopic hallmark seen on biopsy of the gingiva in Plasma Cell Stomatitis?'}
            </p>

            <div className="space-y-2">
              {[
                diseaseId === 'cmv'
                  ? ['Multiple 1mm crops on hard palate', 'A single large, painful, persistent ulcer (weeks to months)', 'White reticulated striae', 'Desquamative gingivitis collar']
                  : diseaseId === 'coxsackie'
                  ? ['Anterior attached gingiva and lips', 'Posterior oropharynx, soft palate, and tonsillar pillars', 'Lateral tongue border exclusively', 'Floor of the mouth']
                  : diseaseId === 'nug'
                  ? ['0.12% Chlorhexidine gluconate mouthrinse', 'Hydrogen peroxide 3% monotherapy', 'Povidone iodine 10%', 'Sodium hypochlorite 0.5%']
                  : diseaseId === 'em'
                  ? ['Oral Nystatin 500,000 units QID', 'Continuous Acyclovir 400 mg BID (or Valacyclovir 500 mg BID)', 'Oral Metronidazole 500 mg TID', 'High-dose systemic Prednisone lifelong']
                  : diseaseId === 'sjs-ten'
                  ? ['SJS is <10% BSA, Overlap is 10-30%, TEN is >30% BSA', 'SJS is 50% BSA, TEN is 100% BSA', 'BSA is not used; based solely on oral ulcers', 'TEN is defined by mucosal involvement only']
                  : ['Monoclonal light-chain restricted myeloma infiltrate', 'Dense sheets of polyclonal plasma cells in lamina propria with dilated capillaries', 'Abundant eosinophils and acantholysis', 'Spirochetes invading into trabecular bone']
              ][0].map((opt, idx) => {
                const isSelected = challengeAnswer === idx;
                const isCorrect = idx === (diseaseId === 'cmv' ? 1 : diseaseId === 'coxsackie' ? 1 : diseaseId === 'nug' ? 0 : diseaseId === 'em' ? 1 : diseaseId === 'sjs-ten' ? 0 : 1);
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setChallengeAnswer(idx);
                      if (isCorrect) markModuleComplete(diseaseId);
                    }}
                    className={`w-full p-3.5 rounded-lg text-left text-xs transition-all border ${
                      isSelected
                        ? isCorrect
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold'
                          : 'bg-rose-950/80 border-rose-500 text-rose-200'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                    }`}
                  >
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {challengeAnswer !== null && (
              <div
                className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                  challengeAnswer === (diseaseId === 'cmv' ? 1 : diseaseId === 'coxsackie' ? 1 : diseaseId === 'nug' ? 0 : diseaseId === 'em' ? 1 : diseaseId === 'sjs-ten' ? 0 : 1)
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-rose-950 text-rose-300 border border-rose-800'
                }`}
              >
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>
                  {challengeAnswer === (diseaseId === 'cmv' ? 1 : diseaseId === 'coxsackie' ? 1 : diseaseId === 'nug' ? 0 : diseaseId === 'em' ? 1 : diseaseId === 'sjs-ten' ? 0 : 1)
                    ? 'Mastery Confirmed! Module achievement badge awarded to your profile.'
                    : 'Review the lecture notes above and try again.'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
