import React, { useState } from 'react';
import {
  Compass,
  Boxes,
  Ruler,
  UserCheck,
  HelpCircle,
  BookOpen,
  Sparkles,
  Layers,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  Info,
  TrendingDown
} from 'lucide-react';
import { Furcation3DViewer } from './Furcation3DViewer';
import { FurcationAnatomy2D } from './FurcationAnatomy2D';
import { FurcationCases } from './FurcationCases';
import { FurcationQuizModule } from './FurcationQuizModule';

type FurcationSubTab =
  | '3d_viewer'
  | '2d_calculators'
  | 'clinical_cases'
  | 'board_quiz'
  | 'lecture_notes';

export const FurcationMaster: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<FurcationSubTab>('3d_viewer');

  return (
    <div className="space-y-6">
      {/* Top Academic Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1e4a] via-[#091536] to-[#060c1d] border border-cyan-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C9A24B]/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-[#C9A24B] text-slate-950 uppercase tracking-wider shadow-md">
                Lecture 2 of 8
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600/30 text-blue-300 border border-blue-500/30">
                د. مها شكري (Dr. Maha Shukri)
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                University of Baghdad • Dept of Periodontics
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Lecture 2: Furcation Involvement <span className="text-cyan-400">— Part I Anatomy, Probing &amp; Diagnosis</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Comprehensive 5th-year clinical curriculum exploring multi-rooted tooth anatomy, root trunk lengths, Hamp et al. (1975) degrees I–IV, Masters &amp; Hoskins (1964) cervical enamel projections, curved Nabers probing mechanics, and differential diagnosis with pulpal pathosis &amp; occlusal trauma.
            </p>
          </div>

          {/* Quick High-Yield Rules Card */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shrink-0 flex flex-col gap-2 min-w-[280px] shadow-xl text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-300">
              <span className="font-semibold text-white">Mesial Maxillary Furca:</span>
              <span className="font-mono font-bold text-[#C9A24B]">Probe from PALATAL aspect!</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Primary Etiology:</span>
              <span className="font-mono font-bold text-cyan-400">Dental Plaque Biofilm</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Hamp Class II Cutoff:</span>
              <span className="font-mono font-bold text-orange-400">&gt; 1/3 tooth width (cul-de-sac)</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>CEP Prevalence:</span>
              <span className="font-mono font-bold text-purple-400">~15% of molars</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Differential Rule:</span>
              <span className="font-mono font-bold text-rose-400">Vitality test (-) = RCT first!</span>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="relative z-10 flex items-center gap-1.5 overflow-x-auto pt-6 mt-6 border-t border-slate-800/80 scrollbar-thin">
          <button
            onClick={() => setActiveSubTab('3d_viewer')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
              activeSubTab === '3d_viewer'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Boxes className="w-4 h-4 text-cyan-300" />
            <span>3D Interactive Simulator</span>
          </button>

          <button
            onClick={() => setActiveSubTab('2d_calculators')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
              activeSubTab === '2d_calculators'
                ? 'bg-[#C9A24B] text-slate-950 shadow-lg shadow-[#C9A24B]/30'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Compass className="w-4 h-4 text-[#C9A24B]" />
            <span>2D Anatomy &amp; Calipers</span>
          </button>

          <button
            onClick={() => setActiveSubTab('clinical_cases')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'clinical_cases'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Virtual Patient Cases (4)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('board_quiz')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'board_quiz'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-purple-300" />
            <span>Board Examination (12 MCQs)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('lecture_notes')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'lecture_notes'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 font-black'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-300" />
            <span>Full Lecture Syllabus</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab 1: 3D Simulator */}
      {activeSubTab === '3d_viewer' && (
        <Furcation3DViewer />
      )}

      {/* Sub-Tab 2: 2D Calculators & Caliper */}
      {activeSubTab === '2d_calculators' && (
        <FurcationAnatomy2D />
      )}

      {/* Sub-Tab 3: Clinical Cases */}
      {activeSubTab === 'clinical_cases' && (
        <FurcationCases />
      )}

      {/* Sub-Tab 4: Board Quiz */}
      {activeSubTab === 'board_quiz' && (
        <FurcationQuizModule />
      )}

      {/* Sub-Tab 5: Full Lecture Notes */}
      {activeSubTab === 'lecture_notes' && (
        <div className="bg-[#0b1736] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-xs sm:text-sm text-slate-300">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <BookOpen className="w-7 h-7 text-[#C9A24B]" />
            <div>
              <h3 className="text-lg font-black text-white">
                Comprehensive Syllabus: Furcation Involvement (Part I)
              </h3>
              <span className="text-xs text-[#C9A24B]">
                Dr. Maha Shukri • College of Dentistry, University of Baghdad
              </span>
            </div>
          </div>

          <div className="space-y-5">
            <section className="space-y-2">
              <h4 className="text-base font-black text-cyan-400">1. Terminology &amp; Fundamentals</h4>
              <p>
                <strong>Furcation involvement</strong> refers to the invasion of the bifurcation and/or trifurcation of multirooted teeth by periodontal disease.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Primary Etiology:</strong> Dental plaque biofilm. Biofilm spreads not only vertically along root surfaces, but horizontally into the interradicular space.</li>
                <li><strong>Root Complex:</strong> The portion of a tooth located apical to the CEJ covered by root cementum. Divided into <strong>root trunk</strong> and <strong>root cones</strong>.</li>
                <li><strong>Root Trunk:</strong> The undivided region of the root from the CEJ to the separation line between two root cones.</li>
                <li><strong>Furcation Fornix:</strong> The roof of the furcation.</li>
                <li><strong>Furcation Entrance:</strong> The transitional area between the undivided and divided parts of the root.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h4 className="text-base font-black text-[#C9A24B]">2. Anatomical Variations Affecting Treatment</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Root Trunk Length:</strong> Short trunks allow early furcation invasion with minimal bone loss, but provide easier access for therapy. Long trunks protect the furcation longer, but once involved, instrumentation is difficult.</li>
                <li><strong>Interradicular Dimension:</strong> Widely separated roots offer better prognosis and more treatment options. Fused roots have poor prognosis.</li>
                <li><strong>Cervical Enamel Projections (CEP):</strong> Occur in ~15% of molars (Masters &amp; Hoskins: Grade I, II, III). Grade III enters the furcation horizontally. Must be removed by odontoplasty to allow healing.</li>
                <li><strong>Accessory Pulp Canals:</strong> Present in the furcation fornix, creating endo-perio communications.</li>
                <li><strong>Root Curvature &amp; Fluting:</strong> Distal aspect of the mesial root of mandibular molars and MB root of maxillary molars are heavily fluted, creating a risk for strip perforation during endodontics.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h4 className="text-base font-black text-purple-400">3. Classification (Hamp et al. 1975)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <strong className="text-amber-400 block">Class I (Initial):</strong>
                  Horizontal tissue loss not exceeding 1/3 of the width of the tooth (&lt;3 mm).
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <strong className="text-orange-400 block">Class II (Partial):</strong>
                  Horizontal tissue loss exceeding 1/3 of tooth width, but not encompassing the total width (cul-de-sac).
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <strong className="text-rose-400 block">Class III (Total):</strong>
                  Horizontal "through-and-through" destruction across the interradicular space.
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <strong className="text-purple-400 block">Class IV:</strong>
                  Class III where gingival tissue has receded apically so the furcation tunnel is clinically visible.
                </div>
              </div>
            </section>

            <section className="space-y-2">
              <h4 className="text-base font-black text-rose-400">4. Diagnostic Probing Rules &amp; Differential Diagnosis</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Nabers Probe:</strong> Curved, graduated probe designed specifically to measure horizontal penetration into the furcation.</li>
                <li><strong>The Palatal Probing Rule:</strong> Mesial furcation of maxillary molars MUST be probed from the <strong>palatal aspect</strong> because its entrance is located two-thirds toward the palate.</li>
                <li><strong>Radiographic Superimposition:</strong> Palatal roots frequently mask extensive furcation bone loss on periapical radiographs.</li>
                <li><strong>Differential Diagnosis - Pulpal Pathosis:</strong> Vitality testing is mandatory. If non-vital (-), endodontic treatment must precede periodontal therapy. Sealing the canal often resolves the furcation radiolucency.</li>
                <li><strong>Differential Diagnosis - Trauma from Occlusion (TFO):</strong> Can cause interradicular radiolucency and mobility, but <em>probing fails to detect any pocket</em> into the furcation. Occlusal adjustment is required.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h4 className="text-base font-black text-emerald-400">5. Prognosis Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                <div className="bg-emerald-950/40 border border-emerald-500/40 p-3 rounded-xl">
                  <strong className="text-emerald-400 block">Mandibular Molars: GOOD</strong>
                  2 divergent roots with buccal/lingual access. Accessible for maintenance, hemisection, or tunnel prep.
                </div>
                <div className="bg-amber-950/40 border border-amber-500/40 p-3 rounded-xl">
                  <strong className="text-amber-400 block">Maxillary Molars: GUARDED</strong>
                  3 roots with proximal entrances that are difficult to access for patient cleaning and clinical instrumentation.
                </div>
                <div className="bg-rose-950/40 border border-rose-500/40 p-3 rounded-xl">
                  <strong className="text-rose-400 block">Maxillary 1st Premolars: POOR</strong>
                  Deep apical furcation opening mesiodistally, root fusions, and developmental invaginations.
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};
