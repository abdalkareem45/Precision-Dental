/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ThreeCraniofacialProfileScene } from '../three/ThreeCraniofacialProfileScene';
import { CephalometricCaliper } from '../tools/CephalometricCaliper';
import { SmileAestheticAnalyzer } from '../tools/SmileAestheticAnalyzer';
import { BodyBuild, LipCompetence } from '../../types/ortho';
import {
  FileText,
  User,
  Heart,
  Smile,
  ShieldAlert,
  Compass,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Info,
  Layers,
  ArrowRight,
  Maximize2,
  Ruler
} from 'lucide-react';

export const Lecture1And2View: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'flowchart' | 'history' | 'extraoral' | 'calipers' | 'smile' | 'intraoral' | 'consent'>('extraoral');
  
  // Interactive mini-simulators within Lecture 1 & 2
  const [selectedBodyBuild, setSelectedBodyBuild] = useState<BodyBuild>('mesomorphic');
  const [palpationClass, setPalpationClass] = useState<'class_i' | 'class_ii' | 'class_iii'>('class_i');
  const [selectedLipState, setSelectedLipState] = useState<LipCompetence>('competent');
  const [nasolabialAngleInput, setNasolabialAngleInput] = useState<number>(102);

  return (
    <div className="space-y-8">
      {/* Lecture Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel p-6 sm:p-10 border border-[#C9A24B]/30 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-[#DFC17B] uppercase tracking-wider">
              <span>Department of Orthodontics</span>
              <span>·</span>
              <span>5th Year Curriculum</span>
              <span>·</span>
              <span>Lectures 1 & 2</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white font-sans">
              Orthodontic History & Clinical Examination in 3D
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Master the comprehensive diagnostic database: from personal case history to 3-dimensional clinical appraisal (anteroposterior, vertical, and transverse) with live cephalometric calipers and smile design tools.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="glass-panel-subtle px-4 py-3 rounded-2xl border border-[#C9A24B]/30 text-center">
              <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Curriculum</span>
              <span className="text-base font-bold text-[#DFC17B]">16 Page Guide</span>
            </div>
            <div className="glass-panel-subtle px-4 py-3 rounded-2xl border border-[#C9A24B]/30 text-center">
              <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Anatomical</span>
              <span className="text-base font-bold text-white">3D & 2D Suite</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Pill Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
        {[
          { id: 'extraoral', label: '1. 3D Profile Simulator', icon: Compass },
          { id: 'calipers', label: '2. Cephalometric Calipers (2D)', icon: Ruler },
          { id: 'smile', label: '3. Smile Aesthetics & Ratio (2D)', icon: Smile },
          { id: 'history', label: '4. Patient Case History', icon: User },
          { id: 'flowchart', label: '5. Database Flowchart', icon: Layers },
          { id: 'intraoral', label: '6. Intraoral Examination', icon: CheckCircle2 },
          { id: 'consent', label: '7. Informed Consent & Gillick', icon: FileText },
        ].map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#C9A24B] to-[#B8892E] text-[#071330] shadow-lg font-extrabold'
                  : 'glass-panel-subtle text-slate-300 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* Section: 3D Extraoral Examination */}
      {activeSection === 'extraoral' && (
        <div className="space-y-6">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-[#DFC17B] uppercase tracking-wider">Clinical Examination in 3 Dimensions</span>
            <h2 className="text-xl font-bold text-white">Extraoral Craniofacial & Profile Appraisal</h2>
            <p className="text-xs text-slate-300">
              Assessing balance, harmony, and proportions in all three planes: Anteroposterior, Vertical, and Transverse.
            </p>
          </div>

          {/* Embedded 3D Craniofacial Profile Viewport */}
          <ThreeCraniofacialProfileScene />

          {/* Sheldon Body Build Interactive Explorer */}
          <div className="glass-panel rounded-2xl border border-[#C9A24B]/30 p-6 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white">General Appraisal & Sheldon Body Build</h3>
                <p className="text-xs text-slate-400">General examination begins when the patient enters the clinic: observing gait, posture, and physique.</p>
              </div>
              <div className="flex items-center gap-1.5 bg-[#071330]/80 p-1.5 rounded-xl border border-white/10">
                {(['ectomorphic', 'mesomorphic', 'endomorphic'] as BodyBuild[]).map((build) => (
                  <button
                    key={build}
                    onClick={() => setSelectedBodyBuild(build)}
                    className={`px-3 py-1.5 text-xs font-bold capitalize rounded-lg transition-colors ${
                      selectedBodyBuild === build
                        ? 'bg-[#C9A24B] text-[#071330]'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {build}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className={`p-4 rounded-xl border transition-all ${selectedBodyBuild === 'ectomorphic' ? 'bg-[#C9A24B]/10 border-[#C9A24B]' : 'bg-[#071330]/60 border-white/5 text-slate-400'}`}>
                <strong className="text-[#DFC17B] font-bold block mb-1">a. Ectomorphic:</strong>
                <p className="text-slate-300">Tall and thin physique. Often associated with narrow dental arches, dolichocephalic facial form, and potentially higher mandibular plane angle.</p>
              </div>
              <div className={`p-4 rounded-xl border transition-all ${selectedBodyBuild === 'mesomorphic' ? 'bg-[#C9A24B]/10 border-[#C9A24B]' : 'bg-[#071330]/60 border-white/5 text-slate-400'}`}>
                <strong className="text-[#DFC17B] font-bold block mb-1">b. Mesomorphic:</strong>
                <p className="text-slate-300">Average muscular physique. Well-proportioned craniofacial structures with harmonious vertical and transverse facial dimensions.</p>
              </div>
              <div className={`p-4 rounded-xl border transition-all ${selectedBodyBuild === 'endomorphic' ? 'bg-[#C9A24B]/10 border-[#C9A24B]' : 'bg-[#071330]/60 border-white/5 text-slate-400'}`}>
                <strong className="text-[#DFC17B] font-bold block mb-1">c. Endomorphic:</strong>
                <p className="text-slate-300">Short and obese physique. Broad arches, brachycephalic tendency, robust masticatory muscles, and lower mandibular plane angle.</p>
              </div>
            </div>
          </div>

          {/* Clinical Palpation Lab & Anteroposterior Assessment */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* A-Point and B-Point Palpation Simulator */}
            <div className="glass-panel rounded-2xl border border-[#C9A24B]/30 p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#DFC17B] uppercase tracking-wider block">Clinical Technique</span>
                  <h3 className="text-base font-bold text-white">Intraoral A & B Point Palpation</h3>
                </div>
                <div className="flex items-center gap-1 bg-[#071330]/80 p-1 rounded-lg border border-white/10">
                  {(['class_i', 'class_ii', 'class_iii'] as const).map((cls) => (
                    <button
                      key={cls}
                      onClick={() => setPalpationClass(cls)}
                      className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                        palpationClass === cls ? 'bg-[#1B3A8C] text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {cls === 'class_i' && 'Class I'}
                      {cls === 'class_ii' && 'Class II'}
                      {cls === 'class_iii' && 'Class III'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Palpation Diagram */}
              <div className="relative bg-[#071330] p-5 rounded-xl border border-white/10 flex flex-col items-center justify-center min-h-[160px]">
                <div className="w-full max-w-sm flex items-center justify-between">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Index Finger</span>
                    <div className="w-12 h-12 rounded-full bg-[#C9A24B] text-[#071330] flex items-center justify-center font-black text-sm shadow-lg mt-1">
                      A Pt
                    </div>
                    <span className="text-[11px] font-semibold text-slate-300 mt-1">Maxilla Base</span>
                  </div>

                  <div className="flex-1 px-4 flex flex-col items-center">
                    <div className="w-full h-2 bg-white/10 rounded-full relative overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          palpationClass === 'class_i'
                            ? 'bg-emerald-500 w-1/2 ml-1/4'
                            : palpationClass === 'class_ii'
                            ? 'bg-amber-500 w-3/4 ml-1/4'
                            : 'bg-rose-500 w-1/4'
                        }`}
                      />
                    </div>
                    <span className="text-xs font-bold text-white mt-2 text-center">
                      {palpationClass === 'class_i' && 'Normal: Maxilla is 2 to 3 mm anterior to Mandible'}
                      {palpationClass === 'class_ii' && 'Index finger is >4mm ahead of Middle finger'}
                      {palpationClass === 'class_iii' && 'Middle finger is ahead of Index finger (or <2mm behind)'}
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Middle Finger</span>
                    <div className="w-12 h-12 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-black text-sm shadow-lg mt-1">
                      B Pt
                    </div>
                    <span className="text-[11px] font-semibold text-slate-300 mt-1">Mandible Base</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                By placing the index finger at the maxillary A-point and middle finger at the mandibular B-point after lip retraction in centric occlusion, the clinician clinically verifies the true underlying skeletal sagittal base relationship.
              </p>
            </div>

            {/* Rule of Fifths & Transverse Symmetry */}
            <div className="glass-panel rounded-2xl border border-[#C9A24B]/30 p-6 space-y-4 shadow-xl">
              <span className="text-[10px] font-bold text-[#DFC17B] uppercase tracking-wider block">Transverse Plane</span>
              <h3 className="text-base font-bold text-white">Rule of Fifths & Facial Midline Symmetry</h3>

              <div className="grid grid-cols-5 gap-1 text-center py-4 bg-[#071330] rounded-xl border border-white/10">
                <div className="p-2 border-r border-white/10">
                  <span className="text-[10px] text-slate-400 block">1/5</span>
                  <span className="text-xs font-bold text-white">Lateral</span>
                </div>
                <div className="p-2 border-r border-white/10 bg-[#C9A24B]/10 rounded">
                  <span className="text-[10px] text-[#DFC17B] font-bold block">2/5</span>
                  <span className="text-xs font-bold text-white">R Eye</span>
                </div>
                <div className="p-2 border-r border-white/10 bg-[#C9A24B]/10 rounded">
                  <span className="text-[10px] text-[#DFC17B] font-bold block">3/5</span>
                  <span className="text-xs font-bold text-white">Intercanthal</span>
                </div>
                <div className="p-2 border-r border-white/10 bg-[#C9A24B]/10 rounded">
                  <span className="text-[10px] text-[#DFC17B] font-bold block">4/5</span>
                  <span className="text-xs font-bold text-white">L Eye</span>
                </div>
                <div className="p-2">
                  <span className="text-[10px] text-slate-400 block">5/5</span>
                  <span className="text-xs font-bold text-white">Lateral</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <p>
                  <strong>Midline Alignment:</strong> The soft tissue nasion, middle part of the upper lip at the vermillion border, and the chin point should all be aligned.
                </p>
                <p>
                  <strong>Gross Facial Asymmetry Causes:</strong>
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <span className="p-2 bg-[#071330]/60 rounded border border-white/5">i. Hemifacial hypertrophy/atrophy</span>
                  <span className="p-2 bg-[#071330]/60 rounded border border-white/5">ii. Congenital craniofacial defects</span>
                  <span className="p-2 bg-[#071330]/60 rounded border border-white/5">iii. Unilateral condylar hyperplasia</span>
                  <span className="p-2 bg-[#071330]/60 rounded border border-white/5">iv. Unilateral TMJ Ankylosis</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section: Cephalometric Calipers */}
      {activeSection === 'calipers' && (
        <CephalometricCaliper />
      )}

      {/* Section: Smile Aesthetics */}
      {activeSection === 'smile' && (
        <SmileAestheticAnalyzer />
      )}

      {/* Section: Case History */}
      {activeSection === 'history' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel rounded-2xl border border-[#C9A24B]/30 p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-[#C9A24B] text-[#071330] flex items-center justify-center text-xs font-black">
                1
              </span>
              <h3 className="text-base font-bold text-white">Personal Details of the Patient</h3>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-300">
              <div className="p-3 bg-[#071330]/70 rounded-xl border border-white/10">
                <strong className="text-[#DFC17B] block mb-1">A) Name & Communication:</strong>
                Recording the name gives a personal touch, builds rapport, and arouses familiarity when addressed by their first name, producing positive psychological comfort.
              </div>

              <div className="p-3 bg-[#071330]/70 rounded-xl border border-white/10">
                <strong className="text-[#DFC17B] block mb-1">B) Age & Date of Birth (5 Critical Reasons):</strong>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li><strong>Treatment Planning:</strong> Interceptive orthodontics for developing dentition vs comprehensive for adults.</li>
                  <li><strong>Growth & Development:</strong> Harnessing skeletal growth modification during growth spurts.</li>
                  <li><strong>Treatment Timing:</strong> Early intervention to avoid surgical complexity vs waiting until growth cessation (e.g. Class III).</li>
                  <li><strong>Treatment Duration:</strong> Developing jaws vs mature adult bone remodeling rates.</li>
                  <li><strong>Eligibility:</strong> Specific appliances carry age limitations.</li>
                </ul>
              </div>

              <div className="p-3 bg-[#071330]/70 rounded-xl border border-white/10">
                <strong className="text-[#DFC17B] block mb-1">C) Gender Differences:</strong>
                Girls mature earlier than boys (timing of pubertal growth spurts, tooth eruption). Gender also influences facial aesthetics, lip soft-tissue drape, and self-esteem considerations.
              </div>

              <div className="p-3 bg-[#071330]/70 rounded-xl border border-white/10">
                <strong className="text-[#DFC17B] block mb-1">D) Address & Occupation:</strong>
                Dictates socioeconomic status and appliance type. Long-distance patients require mechanics with fewer appointment frequencies. Physically demanding occupations require reinforced appliance comfort.
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl border border-[#C9A24B]/30 p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-[#C9A24B] text-[#071330] flex items-center justify-center text-xs font-black">
                2
              </span>
              <h3 className="text-base font-bold text-white">Chief Complaint & Health Records</h3>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-300">
              <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-500/40">
                <strong className="text-amber-300 block mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  Patient's Perception (Chief Complaint):
                </strong>
                Allow patient to speak in their own words:
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-amber-900/60 text-amber-200 font-bold rounded border border-amber-500/40">Aesthetics</span>
                  <span className="px-2 py-0.5 bg-amber-900/60 text-amber-200 font-bold rounded border border-amber-500/40">Function</span>
                  <span className="px-2 py-0.5 bg-amber-900/60 text-amber-200 font-bold rounded border border-amber-500/40">Dental Health</span>
                </div>
              </div>

              <div className="p-3 bg-[#071330]/70 rounded-xl border border-white/10">
                <strong className="text-[#DFC17B] block mb-1">Medical History Precaution:</strong>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li><strong>Cardiac anomalies:</strong> Antibiotic coverage may be required even for molar band placement or removal if adjacent gingiva is inflamed or bleeding is anticipated.</li>
                  <li><strong>Diabetes:</strong> Increased susceptibility to periodontal breakdown and intra-oral infections. Avoid orthodontic treatment in poorly controlled diabetics!</li>
                </ul>
              </div>

              <div className="p-3 bg-[#071330]/70 rounded-xl border border-white/10">
                <strong className="text-[#DFC17B] block mb-1">Habits & Root Resorption:</strong>
                Digit-sucking (duration, intensity, frequency). Nail biting is a key habit that predisposes to an increased risk of <em>root resorption</em> during active orthodontic tooth movement.
              </div>

              <div className="p-3 bg-[#071330]/70 rounded-xl border border-white/10">
                <strong className="text-[#DFC17B] block mb-1">Physical Growth Status:</strong>
                Growth modification is indicated in growing patients; orthognathic surgery or camouflage is reserved for completed growth (especially in severe skeletal Class III).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section: Database Flowchart */}
      {activeSection === 'flowchart' && (
        <div className="glass-panel rounded-2xl border border-[#C9A24B]/30 p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-[#DFC17B] uppercase tracking-wider">Foundation Principle</span>
            <h2 className="text-xl font-bold text-white">The Orthodontic Assessment Database</h2>
            <p className="text-xs text-slate-300 max-w-3xl">
              Orthodontic treatment is almost always elective. The assessment must establish sufficient information to identify features that would benefit from treatment, those that don't need change, and any risks of proposed mechanics.
            </p>
          </div>

          <div className="bg-[#071330] rounded-xl p-6 border border-white/10 flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-6">
            <div className="flex flex-col gap-4 w-full md:w-56">
              <div className="glass-panel-subtle rounded-xl p-4 text-center border border-[#1B3A8C]">
                <span className="text-[10px] font-bold text-[#60A5FA] uppercase tracking-wider block">Element 1</span>
                <span className="text-sm font-bold text-white">Questionnaire / Interview</span>
                <p className="text-[11px] text-slate-400 mt-1">Full medical, dental & habit history</p>
              </div>

              <div className="flex justify-center text-slate-400">
                <ArrowRight className="w-5 h-5 rotate-90 md:rotate-0 text-[#C9A24B]" />
              </div>

              <div className="glass-panel-subtle rounded-xl p-4 text-center border border-[#1B3A8C]">
                <span className="text-[10px] font-bold text-[#60A5FA] uppercase tracking-wider block">Element 2</span>
                <span className="text-sm font-bold text-white">Clinical Examination</span>
                <p className="text-[11px] text-slate-400 mt-1">Extraoral & intraoral in 3 planes</p>
              </div>

              <div className="flex justify-center text-slate-400">
                <ArrowRight className="w-5 h-5 rotate-90 md:rotate-0 text-[#C9A24B]" />
              </div>

              <div className="glass-panel-subtle rounded-xl p-4 text-center border border-[#1B3A8C]">
                <span className="text-[10px] font-bold text-[#60A5FA] uppercase tracking-wider block">Element 3</span>
                <span className="text-sm font-bold text-white">Diagnostic Records</span>
                <p className="text-[11px] text-slate-400 mt-1">Radiographs, study models, photos</p>
              </div>
            </div>

            <div className="flex items-center justify-center text-[#C9A24B]">
              <ArrowRight className="w-8 h-8 hidden md:block" />
              <ArrowRight className="w-8 h-8 rotate-90 md:hidden" />
            </div>

            <div className="glass-panel text-white rounded-2xl p-6 text-center shadow-lg border-2 border-[#C9A24B] max-w-xs w-full">
              <span className="text-[11px] font-bold text-[#DFC17B] uppercase tracking-widest block mb-1">Central Synthesis</span>
              <h3 className="text-lg font-black mb-2">ORTHODONTIC DATABASE</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Oral health findings, soft tissue drape, skeletal classification & dentoalveolar proportions.
              </p>
            </div>

            <div className="flex items-center justify-center text-[#C9A24B]">
              <ArrowRight className="w-8 h-8 hidden md:block" />
              <ArrowRight className="w-8 h-8 rotate-90 md:hidden" />
            </div>

            <div className="bg-emerald-950/40 border-2 border-emerald-500/60 rounded-xl p-6 text-center shadow-sm w-full md:w-60">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Primary Objective</span>
              <h4 className="text-base font-bold text-emerald-100 mt-1">Problem List & Diagnosis</h4>
              <p className="text-xs text-emerald-300/80 mt-2">
                Prioritized problem list established before selecting any appliance or mechanics.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Section: Intraoral Exam */}
      {activeSection === 'intraoral' && (
        <div className="glass-panel rounded-2xl border border-[#C9A24B]/30 p-6 sm:p-8 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white">Intraoral Examination Protocol</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
            <div className="space-y-3">
              <div className="p-3 bg-[#071330]/70 rounded-xl border border-white/10">
                <strong className="text-[#DFC17B] block mb-1">1) Assessment of Oral Health & Pathology:</strong>
                Mucosal surfaces, periodontal status, caries, and tooth vitality. Periodontal disease must be stabilized before applying orthodontic forces. Excellent oral hygiene is non-negotiable to prevent enamel decalcification ("white spot lesions") and rapid bone loss.
              </div>

              <div className="p-3 bg-[#071330]/70 rounded-xl border border-white/10">
                <strong className="text-[#DFC17B] block mb-1">2) Assessment of Individual Dental Arches:</strong>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li>Crowding vs Spacing in millimeters.</li>
                  <li>Alignment, displacements, and tooth rotations.</li>
                  <li>Inclination of labial segments (proclined, upright, retroclined).</li>
                  <li>Canine angulation (mesial, upright, distal) - key for anchorage!</li>
                  <li>Arch symmetry and depth of Curve of Spee.</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-[#071330]/70 rounded-xl border border-white/10">
                <strong className="text-[#DFC17B] block mb-1">3) Arches in Occlusion:</strong>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li><strong>Overjet:</strong> Labial surface of prominent maxillary incisor to mandibular incisor. Normal: 2–4 mm. Negative value = anterior crossbite.</li>
                  <li><strong>Overbite:</strong> Vertical overlap. Normal is one-third (33%) coverage of lower incisor crown. Complete vs incomplete, traumatic (stripping palatal/labial gingiva), or open bite.</li>
                  <li><strong>Centrelines:</strong> Upper and lower dental midlines coincident with each other and facial midline.</li>
                  <li><strong>Buccal Segments:</strong> Canine & molar classification, lateral open bites, posterior crossbites.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section: Consent */}
      {activeSection === 'consent' && (
        <div className="glass-panel rounded-2xl border border-[#C9A24B]/30 p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-[#DFC17B] uppercase tracking-wider">Ethics & Jurisprudence</span>
            <h2 className="text-xl font-bold text-white">Informed Consent & Gillick Competence</h2>
            <p className="text-xs text-slate-300">
              Orthodontic treatment requires active, prolonged compliance. Written informed consent must be established with transparent disclosure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-[#071330]/70 rounded-2xl border border-[#C9A24B]/30 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <ShieldAlert className="w-4 h-4 text-[#C9A24B]" />
                <span>The 8 Pillars of Orthodontic Informed Consent</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A24B] shrink-0 mt-0.5" />
                  <span><strong>1. Aims of treatment:</strong> Clearly formulated aesthetic and occlusal goals.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A24B] shrink-0 mt-0.5" />
                  <span><strong>2. Risks and benefits:</strong> Root resorption, decalcification, relapse, pain.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A24B] shrink-0 mt-0.5" />
                  <span><strong>3. Types of appliances:</strong> Fixed brackets, aligners, functional appliances.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A24B] shrink-0 mt-0.5" />
                  <span><strong>4. Extractions:</strong> Specific teeth required for space creation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A24B] shrink-0 mt-0.5" />
                  <span><strong>5. Commitment required:</strong> Elastics, hygiene, dietary adjustments.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A24B] shrink-0 mt-0.5" />
                  <span><strong>6. Treatment duration:</strong> Slightly overestimate to protect compliance.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A24B] shrink-0 mt-0.5" />
                  <span><strong>7. Financial implications:</strong> Complete cost breakdowns.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A24B] shrink-0 mt-0.5" />
                  <span><strong>8. Long-term retention:</strong> Lifelong retainers to avoid physiological relapse.</span>
                </li>
              </ul>
            </div>

            <div className="p-5 bg-blue-950/40 rounded-2xl border border-blue-500/40 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <FileText className="w-4 h-4 text-[#60A5FA]" />
                <span>Gillick Competence Principle</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Patients aged <strong>16 years or older</strong> are presumed to possess legal competence to give consent. Patients under 16 may give valid consent if they fully comprehend the proposed treatment, risks, and alternatives—a legal landmark known as <strong>'Gillick Competence'</strong>.
              </p>
              <div className="p-3 bg-[#071330] rounded-xl border border-blue-400/30 text-xs text-blue-200 font-medium">
                <strong>Clinical Golden Rule:</strong> If a parent desires treatment but the child does not, it is best not to proceed. Compliance will fail without patient commitment.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
