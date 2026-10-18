/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Smile, Shield, BookOpen, Layers, Award, RefreshCw, ChevronRight, Menu, X, 
  CheckCircle2, XCircle, AlertTriangle, HelpCircle, Activity, Stethoscope, 
  Sparkles, RotateCcw, ArrowRight, Eye, Play, Sliders, Info, Zap
} from 'lucide-react';

/* ============================================================================
   DATA & LECTURE CONTENT
   ============================================================================ */

const LECTURES = [
  { id: 'lec1', title: 'Lecture 1: Crown & Bridge Fundamentals', subtitle: 'Prosthodontics branches, crowns, bridges, terminology, and consequences of tooth loss' },
  { id: 'lec2', title: 'Lecture 2: Evaluation of Abutment Teeth', subtitle: 'Crown form, length, axial tilt, root configuration, and Jespen root surface areas' },
  { id: 'lec3', title: 'Lecture 3: Periodontal Support & Ante\'s Law', subtitle: 'Gingivo-periodontal complex, PDL stress, Ante\'s Law calculator, and clinical cases' },
];

// Lecture 1 Sub-sections
const LEC1_SECTIONS = [
  { id: 'overview', label: '1. Overview & Branches' },
  { id: 'restorations', label: '2. Extracoronal vs Intracoronal' },
  { id: 'crowns', label: '3. Crowns & Materials' },
  { id: 'bridges', label: '4. Bridges & Components' },
  { id: 'terminology', label: '5. Terminology' },
  { id: 'consequences', label: '6. Tooth Loss & Collapse' },
  { id: 'quiz1', label: '7. Lecture 1 Quiz' },
];

// Lecture 2 Sub-sections
const LEC2_SECTIONS = [
  { id: 'intro', label: '1. Abutment Evaluation' },
  { id: 'crown_factors', label: '2. Crown Form & Length' },
  { id: 'axial_tilt', label: '3. Axial Tilt Simulator' },
  { id: 'root_config', label: '4. Root Configuration' },
  { id: 'jespen_data', label: '5. Jespen Root Surface Areas' },
  { id: 'quiz2', label: '6. Lecture 2 Quiz' },
];

// Lecture 3 Sub-sections
const LEC3_SECTIONS = [
  { id: 'perio_complex', label: '1. Gingivo-Periodontal Complex' },
  { id: 'pdl_stress', label: '2. PDL Stress Visualizer' },
  { id: 'antes_law', label: '3. Ante\'s Law Calculator' },
  { id: 'clinical_sim', label: '4. Clinical Scenarios' },
  { id: 'quiz3', label: '5. Comprehensive Quiz' },
];

// Data definitions
const branchesData = [
  { title: 'Fixed Prosthodontics (FPDs)', desc: 'Crown & bridge prosthodontics permanently cemented in place.' },
  { title: 'Removable Prosthodontics', desc: 'Complete dentures & Removable Partial Dentures (RPDs).' },
  { title: 'Implant Prosthodontics', desc: 'Osseo-integrated implants replacing missing roots and crowns.' },
  { title: 'Maxillofacial Prosthodontics', desc: 'Replacement of missing parts of the mouth and jaw due to trauma or surgery.' },
];

const crownMaterialData = [
  { type: 'Metal Crowns', examples: 'Gold alloy and alternatives', desc: 'Maximum strength, excellent marginal fit, poor aesthetics.' },
  { type: 'Non-Metal Crowns', examples: 'Acrylic resin, Zirconium, Porcelain jacket crown', desc: 'Superior aesthetics, used extensively in anterior regions.' },
  { type: 'Combination (PFM)', examples: 'Porcelain-Fused-to-Metal', desc: 'Combines metal strength with porcelain aesthetics.' },
];

const terminologyData = [
  { term: 'Abutment', def: 'A tooth to which a bridge is attached.' },
  { term: 'Span', def: 'The space between natural teeth that is to be filled by pontics.' },
  { term: 'Saddle', def: 'An area of the edentulous ridge over which the pontic lies.' },
  { term: 'Pier', def: 'An abutment standing between two abutments & supporting two pontics.' },
  { term: 'Unit', def: 'When applied to bridgework, means either a retainer or a pontic (e.g. 3-unit bridge = 2 retainers + 1 pontic).' },
  { term: 'Path of Insertion', def: 'An imaginary line along which the restoration can be inserted and removed without interferences.' },
];

const consequencesData = [
  { title: 'Super eruption of opposing tooth', detail: 'Loss of antagonist leads to over-eruption, gingival recession, and traumatic occlusion.' },
  { title: 'Loss of function', detail: 'Diffuse atrophy, heavy plaque accumulation, gingivitis, and periodontal breakdown.' },
  { title: 'Tilting & drifting of neighbours', detail: 'Loss of proximal contact causes adjacent teeth to lean into the space.' },
  { title: 'Posterior bite collapse', detail: 'Loss of posterior vertical height causes the face to close down and anterior teeth to splay forward.' },
];

const jespenMaxillary = [
  { name: '1st Molar', area: 433 },
  { name: '2nd Molar', area: 431 },
  { name: 'Canine', area: 273 },
  { name: '1st Premolar', area: 234 },
  { name: '2nd Premolar', area: 220 },
  { name: 'Central Incisor', area: 204 },
  { name: 'Lateral Incisor', area: 179 },
];

const jespenMandibular = [
  { name: '1st Molar', area: 431 },
  { name: '2nd Molar', area: 426 },
  { name: 'Canine', area: 268 },
  { name: '2nd Premolar', area: 207 },
  { name: '1st Premolar', area: 180 },
  { name: 'Lateral Incisor', area: 168 },
  { name: 'Central Incisor', area: 154 },
];

/* ============================================================================
   MAIN COMPONENT
   ============================================================================ */

export default function App() {
  const [activeLecture, setActiveLecture] = useState('lec1');
  const [activeSubSection, setActiveSubSection] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');

  // Switch lecture resets sub-section
  const handleLectureChange = (lecId: string) => {
    setActiveLecture(lecId);
    if (lecId === 'lec1') setActiveSubSection('overview');
    else if (lecId === 'lec2') setActiveSubSection('intro');
    else if (lecId === 'lec3') setActiveSubSection('perio_complex');
    setMobileMenuOpen(false);
  };

  const currentSections = activeLecture === 'lec1' ? LEC1_SECTIONS 
    : activeLecture === 'lec2' ? LEC2_SECTIONS 
    : LEC3_SECTIONS;

  return (
    <div className={`min-h-screen font-sans transition-colors duration-200 ${themeMode === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-[#FAF8F3] text-[#0B1F4D]'}`}>
      
      {/* TOP HEADER */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md ${themeMode === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-[#E6E8EC]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1B3A8C] to-[#0B1F4D] flex items-center justify-center text-[#C9A24B] shadow-md font-black text-lg">
                🦷
              </div>
              <div>
                <h1 className="font-extrabold text-sm sm:text-base tracking-tight">Fixed Partial Dentures</h1>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${themeMode === 'dark' ? 'text-amber-400' : 'text-[#C9A24B]'}`}>Comprehensive Study Companion</p>
              </div>
            </div>

            {/* Desktop Lecture Tabs */}
            <div className="hidden md:flex items-center gap-2">
              {LECTURES.map(lec => (
                <button
                  key={lec.id}
                  onClick={() => handleLectureChange(lec.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    activeLecture === lec.id
                      ? 'bg-[#1B3A8C] text-white shadow-md'
                      : themeMode === 'dark' ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {lec.title.split(':')[0]}
                </button>
              ))}
              <button
                onClick={() => setThemeMode(m => m === 'light' ? 'dark' : 'light')}
                className={`p-2.5 rounded-xl border transition ml-2 ${themeMode === 'dark' ? 'border-slate-700 bg-slate-800 text-amber-300' : 'border-[#E6E8EC] bg-white text-slate-700'}`}
                title="Toggle Theme"
              >
                {themeMode === 'dark' ? '☀️' : '🌙'}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setThemeMode(m => m === 'light' ? 'dark' : 'light')}
                className={`p-2 rounded-xl border ${themeMode === 'dark' ? 'border-slate-700 bg-slate-800 text-amber-300' : 'border-[#E6E8EC] bg-white text-slate-700'}`}
              >
                {themeMode === 'dark' ? '☀️' : '🌙'}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-xl border ${themeMode === 'dark' ? 'border-slate-700 bg-slate-800 text-white' : 'border-[#E6E8EC] bg-white text-slate-800'}`}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-b p-4 space-y-2 animate-fadeIn ${themeMode === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#E6E8EC]'}`}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">Select Lecture</p>
            {LECTURES.map(lec => (
              <button
                key={lec.id}
                onClick={() => handleLectureChange(lec.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeLecture === lec.id
                    ? 'bg-[#1B3A8C] text-white'
                    : themeMode === 'dark' ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {lec.title}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* SUB-HEADER & SUB-NAVIGATION */}
      <div className={`border-b ${themeMode === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-[#E6E8EC]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="font-extrabold text-lg sm:text-xl">
                {LECTURES.find(l => l.id === activeLecture)?.title}
              </h2>
              <p className={`text-xs mt-0.5 ${themeMode === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                {LECTURES.find(l => l.id === activeLecture)?.subtitle}
              </p>
            </div>

            {/* Sub-section pills */}
            <div className="flex overflow-x-auto thin-scroll gap-1.5 pb-1 sm:pb-0">
              {currentSections.map(sec => (
                <button
                  key={sec.id}
                  onClick={() => setActiveSubSection(sec.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    activeSubSection === sec.id
                      ? 'bg-[#C9A24B] text-slate-950 font-bold shadow-sm'
                      : themeMode === 'dark' ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {sec.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="animate-fadeIn">
          {activeLecture === 'lec1' && <Lecture1View section={activeSubSection} themeMode={themeMode} />}
          {activeLecture === 'lec2' && <Lecture2View section={activeSubSection} themeMode={themeMode} />}
          {activeLecture === 'lec3' && <Lecture3View section={activeSubSection} themeMode={themeMode} />}
        </div>
      </main>
    </div>
  );
}

/* ============================================================================
   LECTURE 1 VIEWS
   ============================================================================ */

function Lecture1View({ section, themeMode }: { section: string; themeMode: string }) {
  const cardBg = themeMode === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-[#E6E8EC] text-[#0B1F4D]';

  switch (section) {
    case 'overview':
      return (
        <div className="space-y-6">
          <div className={`p-6 rounded-3xl border shadow-card ${cardBg}`}>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A24B]">Lecture 1 · Introduction</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold mt-1">Prosthodontics & Its Branches</h3>
            <p className="mt-3 text-sm sm:text-base leading-relaxed opacity-85">
              Prosthodontics (prosthetic dentistry or prosthodontia) is the dental specialty concerned with restoring and maintaining oral functions, comfort, appearance & health of the patients by making artificial replacements for missing parts of the mouth and jaw.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {branchesData.map((b, idx) => (
              <div key={idx} className={`p-5 rounded-2xl border shadow-card flex flex-col justify-between ${cardBg}`}>
                <div>
                  <span className="w-8 h-8 rounded-xl bg-[#1B3A8C]/10 text-[#1B3A8C] font-black text-xs flex items-center justify-center mb-3">
                    0{idx + 1}
                  </span>
                  <h4 className="font-bold text-base mb-2">{b.title}</h4>
                  <p className="text-xs opacity-80 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'restorations':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-3xl border shadow-card ${cardBg}`}>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/15 text-cyan-400">1) Extracoronal</span>
            <h3 className="text-2xl font-extrabold mt-3">Seats OVER the tooth</h3>
            <p className="mt-2 text-sm opacity-85 leading-relaxed">
              Involves all restorations that seat over the tooth structure.
            </p>
            <ul className="mt-4 space-y-2 text-xs font-medium opacity-80">
              <li>• All types of crown restorations</li>
              <li>• Full metal crown</li>
              <li>• Partial crown & PFM</li>
              <li>• All ceramic crown</li>
              <li>• Direct or indirect veneer restoration</li>
            </ul>
          </div>

          <div className={`p-6 rounded-3xl border shadow-card ${cardBg}`}>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/15 text-purple-400">2) Intracoronal</span>
            <h3 className="text-2xl font-extrabold mt-3">Seats INSIDE the tooth</h3>
            <p className="mt-2 text-sm opacity-85 leading-relaxed">
              Involves all restorations that seat inside the prepared coronal portion of the tooth.
            </p>
            <ul className="mt-4 space-y-2 text-xs font-medium opacity-80">
              <li>• Inlay (conservative restoration within cusps)</li>
              <li>• Onlay (covering one or more cusps)</li>
              <li>• Pinlage (retained by pins in dentin)</li>
            </ul>
          </div>
        </div>
      );

    case 'crowns':
      return (
        <div className="space-y-6">
          <div className={`p-6 rounded-3xl border shadow-card ${cardBg}`}>
            <h3 className="text-xl font-bold">The Crown</h3>
            <p className="mt-2 text-sm opacity-85 leading-relaxed">
              A fixed extracoronal artificial restoration for the coronal portion of a natural tooth. It must restore morphology, function & contour and protect remaining tooth structure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {crownMaterialData.map((cm, i) => (
              <div key={i} className={`p-6 rounded-3xl border shadow-card flex flex-col justify-between ${cardBg}`}>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A24B]">Classification B</span>
                  <h4 className="text-lg font-bold mt-1">{cm.type}</h4>
                  <p className="text-xs font-semibold text-cyan-400 mt-1">{cm.examples}</p>
                  <p className="text-xs opacity-80 mt-3 leading-relaxed">{cm.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'bridges':
      return (
        <div className="space-y-6">
          <div className={`p-6 rounded-3xl border shadow-card ${cardBg}`}>
            <h3 className="text-xl font-bold">Fixed Partial Denture (Bridge)</h3>
            <p className="mt-2 text-sm opacity-85 leading-relaxed">
              A fixed dental prosthesis which replaces and restores function and aesthetics of one or more missing natural teeth. Cemented permanently in place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-3xl border shadow-card ${cardBg}`}>
              <h4 className="font-bold text-base text-cyan-400">1. Retainer</h4>
              <p className="text-xs opacity-85 mt-2 leading-relaxed">
                The part that seats over (on or in) the abutment tooth, connecting the pontic to the abutment (crown, inlay, post & core).
              </p>
            </div>
            <div className={`p-6 rounded-3xl border shadow-card ${cardBg}`}>
              <h4 className="font-bold text-base text-amber-400">2. Pontic</h4>
              <p className="text-xs opacity-85 mt-2 leading-relaxed">
                The suspended member of a fixed partial denture that replaces the missing natural tooth position.
              </p>
            </div>
            <div className={`p-6 rounded-3xl border shadow-card ${cardBg}`}>
              <h4 className="font-bold text-base text-purple-400">3. Connector</h4>
              <p className="text-xs opacity-85 mt-2 leading-relaxed">
                Joins components together. Can be fixed (rigid) or movable (flexible).
              </p>
            </div>
          </div>
        </div>
      );

    case 'terminology':
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {terminologyData.map((t, idx) => (
            <div key={idx} className={`p-5 rounded-2xl border shadow-card ${cardBg}`}>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A24B]">Term {idx + 1}</span>
              <h4 className="font-extrabold text-base mt-1">{t.term}</h4>
              <p className="text-xs opacity-80 mt-2 leading-relaxed">{t.def}</p>
            </div>
          ))}
        </div>
      );

    case 'consequences':
      return (
        <div className="space-y-6">
          <div className={`p-6 rounded-3xl border shadow-card ${cardBg}`}>
            <h3 className="text-xl font-bold">Consequences of Untreated Tooth Loss</h3>
            <p className="mt-2 text-sm opacity-85 leading-relaxed">
              Stability depends on balance between adjacent teeth, opposing teeth, supporting tissues and cheek/lip/tongue muscles. Missing teeth disrupt this balance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {consequencesData.map((c, i) => (
              <div key={i} className={`p-5 rounded-2xl border shadow-card ${cardBg}`}>
                <span className="w-7 h-7 rounded-lg bg-rose-500/15 text-rose-400 font-bold text-xs flex items-center justify-center mb-2">
                  {i + 1}
                </span>
                <h4 className="font-bold text-base mb-1">{c.title}</h4>
                <p className="text-xs opacity-85 leading-relaxed">{c.detail}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case 'quiz1':
      return <MiniQuizSection lectureTitle="Lecture 1 Quiz" themeMode={themeMode} />;

    default:
      return null;
  }
}

/* ============================================================================
   LECTURE 2 VIEWS
   ============================================================================ */

function Lecture2View({ section, themeMode }: { section: string; themeMode: string }) {
  const cardBg = themeMode === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-[#E6E8EC] text-[#0B1F4D]';
  const [tiltAngle, setTiltAngle] = useState(0);
  const [crownLength, setCrownLength] = useState(5);
  const [rootLength, setRootLength] = useState(10);

  const crRatio = (crownLength / rootLength).toFixed(2);

  switch (section) {
    case 'intro':
      return (
        <div className="space-y-6">
          <div className={`p-6 rounded-3xl border shadow-card ${cardBg}`}>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A24B]">Lecture 2 · Abutment Evaluation</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold mt-1">Evaluation of Abutment Teeth</h3>
            <p className="mt-3 text-sm sm:text-base leading-relaxed opacity-85">
              Successful fixed prosthodontics depends heavily on the biological and mechanical soundness of the abutment teeth. We evaluate crown form, crown-to-root ratio, root configuration, and periodontal health.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-6 rounded-3xl border shadow-card ${cardBg}`}>
              <h4 className="font-bold text-lg mb-2">Crown-to-Root Ratio</h4>
              <p className="text-xs opacity-80 leading-relaxed">
                The ratio of the length of tooth crown clinically visible to the length of root embedded in alveolar bone. Optimum is 2:3. Minimum acceptable is 1:1.
              </p>
            </div>
            <div className={`p-6 rounded-3xl border shadow-card ${cardBg}`}>
              <h4 className="font-bold text-lg mb-2">Root Configuration</h4>
              <p className="text-xs opacity-80 leading-relaxed">
                Roots wider labiolingually than mesiodistally, and multi-rooted teeth with separated roots provide superior periodontal support.
              </p>
            </div>
          </div>
        </div>
      );

    case 'crown_factors':
      return (
        <div className="space-y-6">
          <div className={`p-6 rounded-3xl border shadow-card ${cardBg}`}>
            <h3 className="text-xl font-bold">Crown Form & Length</h3>
            <p className="mt-2 text-sm opacity-85 leading-relaxed">
              Adjust crown length and root length to test the Crown-to-Root ratio interactively:
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold block mb-1">Crown Length: {crownLength} mm</label>
                <input 
                  type="range" min="3" max="12" step="1" 
                  value={crownLength} onChange={e => setCrownLength(Number(e.target.value))}
                  className="w-full accent-[#C9A24B]"
                />
              </div>
              <div>
                <label className="text-xs font-bold block mb-1">Root Length: {rootLength} mm</label>
                <input 
                  type="range" min="5" max="15" step="1" 
                  value={rootLength} onChange={e => setRootLength(Number(e.target.value))}
                  className="w-full accent-[#C9A24B]"
                />
              </div>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-[#1B3A8C]/10 border border-[#1B3A8C]/20 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#1B3A8C]">Calculated C:R Ratio</p>
                <p className="text-2xl font-black mt-0.5">1 : {crRatio}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                Number(crRatio) <= 0.66 ? 'bg-emerald-500/20 text-emerald-400' : Number(crRatio) <= 1 ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {Number(crRatio) <= 0.66 ? 'Optimum (2:3)' : Number(crRatio) <= 1 ? 'Minimum Acceptable (1:1)' : 'Unfavourable (>1:1)'}
              </span>
            </div>
          </div>
        </div>
      );

    case 'axial_tilt':
      return (
        <div className={`p-6 rounded-3xl border shadow-card ${cardBg}`}>
          <h3 className="text-xl font-bold">Axial Tilt Simulator</h3>
          <p className="mt-2 text-sm opacity-85 leading-relaxed">
            Tilt angle: <span className="font-bold text-[#C9A24B]">{tiltAngle}°</span>
          </p>
          <div className="mt-4">
            <input 
              type="range" min="-30" max="30" step="2"
              value={tiltAngle} onChange={e => setTiltAngle(Number(e.target.value))}
              className="w-full accent-[#C9A24B]"
            />
          </div>
          <div className="mt-6 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs leading-relaxed opacity-85">
            {Math.abs(tiltAngle) < 10 ? 'Favourable alignment. Minimal risk of pulpal exposure during path of insertion.' 
              : Math.abs(tiltAngle) < 20 ? 'Moderate tilt. Preparation must be carefully aligned to avoid undercuts and pulpal horn violation.' 
              : 'Severe angulation. High risk of endodontic exposure or inadequate retention form. Orthodontic uprighting or crown lengthening may be required.'}
          </div>
        </div>
      );

    case 'root_config':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-3xl border shadow-card ${cardBg}`}>
            <h4 className="font-bold text-lg text-[#C9A24B]">Cross-Sectional Shape</h4>
            <p className="mt-2 text-xs opacity-85 leading-relaxed">
              Roots wider labiolingually than mesiodistally with an elliptic cross-section offer better periodontal support against rotation than circular roots.
            </p>
          </div>
          <div className={`p-6 rounded-3xl border shadow-card ${cardBg}`}>
            <h4 className="font-bold text-lg text-cyan-400">Multi-rooted Teeth</h4>
            <p className="mt-2 text-xs opacity-85 leading-relaxed">
              Teeth with separated roots provide greater stability than conjoined roots. Root divergence is also favourable.
            </p>
          </div>
        </div>
      );

    case 'jespen_data':
      return (
        <div className={`p-6 rounded-3xl border shadow-card ${cardBg}`}>
          <h3 className="text-xl font-bold mb-4">Jespen (1963) Root Surface Area Data</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-sm text-[#C9A24B] mb-2">Maxillary Arch (mm²)</h4>
              <div className="space-y-2">
                {jespenMaxillary.map((t, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                    <span className="font-semibold">{t.name}</span>
                    <span className="font-mono font-bold text-[#C9A24B]">{t.area} mm²</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-sm text-cyan-400 mb-2">Mandibular Arch (mm²)</h4>
              <div className="space-y-2">
                {jespenMandibular.map((t, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                    <span className="font-semibold">{t.name}</span>
                    <span className="font-mono font-bold text-cyan-400">{t.area} mm²</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );

    case 'quiz2':
      return <MiniQuizSection lectureTitle="Lecture 2 Quiz" themeMode={themeMode} />;

    default:
      return null;
  }
}

/* ============================================================================
   LECTURE 3 VIEWS
   ============================================================================ */

function Lecture3View({ section, themeMode }: { section: string; themeMode: string }) {
  const cardBg = themeMode === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-[#E6E8EC] text-[#0B1F4D]';
  const [abutmentArea, setAbutmentArea] = useState(400);
  const [ponticArea, setPonticArea] = useState(300);
  const [loadStress, setLoadStress] = useState(50);

  const ratio = (abutmentArea / (ponticArea || 1)).toFixed(2);
  const antesPass = Number(ratio) >= 1.0;

  switch (section) {
    case 'perio_complex':
      return (
        <div className="space-y-6">
          <div className={`p-6 rounded-3xl border shadow-card ${cardBg}`}>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A24B]">Lecture 3 · Periodontal Support & Ante's Law</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold mt-1">Gingivo-Periodontal Complex</h3>
            <p className="mt-3 text-sm sm:text-base leading-relaxed opacity-85">
              The periodontium (gingiva, periodontal ligament, cementum, and alveolar bone) must be healthy and capable of supporting increased occlusal loads before an abutment can be selected.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-6 rounded-3xl border shadow-card ${cardBg}`}>
              <h4 className="font-bold text-lg text-emerald-400 mb-2">Healthy Periodontium</h4>
              <p className="text-xs opacity-85 leading-relaxed">
                Firm stippled gingiva, absence of pocketing (&gt;3mm), no bleeding on probing, and no clinical tooth mobility.
              </p>
            </div>
            <div className={`p-6 rounded-3xl border shadow-card ${cardBg}`}>
              <h4 className="font-bold text-lg text-rose-400 mb-2">Compromised Periodontium</h4>
              <p className="text-xs opacity-85 leading-relaxed">
                Active periodontal disease, attachment loss, and mobility are absolute contraindications for fixed partial dentures until successfully treated.
              </p>
            </div>
          </div>
        </div>
      );

    case 'pdl_stress':
      return (
        <div className={`p-6 rounded-3xl border shadow-card ${cardBg}`}>
          <h3 className="text-xl font-bold">PDL Stress Visualizer</h3>
          <p className="mt-2 text-sm opacity-85 leading-relaxed">
            Simulate occlusal load and observe PDL stress response:
          </p>

          <div className="mt-6 max-w-md">
            <label className="text-xs font-bold block mb-1">Occlusal Load: {loadStress}%</label>
            <input 
              type="range" min="10" max="100" step="5"
              value={loadStress} onChange={e => setLoadStress(Number(e.target.value))}
              className="w-full accent-[#C9A24B]"
            />
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Stress Level</p>
              <p className="text-xl font-extrabold mt-0.5" style={{ color: loadStress > 70 ? '#ef4444' : loadStress > 40 ? '#f59e0b' : '#10b981' }}>
                {loadStress > 70 ? 'High Stress / Overload' : loadStress > 40 ? 'Moderate Load' : 'Normal Physiological Limit'}
              </p>
            </div>
          </div>
        </div>
      );

    case 'antes_law':
      return (
        <div className={`p-6 rounded-3xl border shadow-card ${cardBg}`}>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C9A24B]">Core Principle</span>
          <h3 className="text-2xl font-extrabold mt-1">Ante's Law Calculator</h3>
          <p className="mt-2 text-sm opacity-85 leading-relaxed">
            "The root surface area of the abutment teeth must be equal to or greater than the root surface area of the tooth or teeth to be replaced."
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold block mb-1">Abutment Root Surface Area: {abutmentArea} mm²</label>
              <input 
                type="range" min="150" max="900" step="20"
                value={abutmentArea} onChange={e => setAbutmentArea(Number(e.target.value))}
                className="w-full accent-[#1B3A8C]"
              />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">Pontic Root Surface Area (Missing): {ponticArea} mm²</label>
              <input 
                type="range" min="100" max="700" step="20"
                value={ponticArea} onChange={e => setPonticArea(Number(e.target.value))}
                className="w-full accent-[#C9A24B]"
              />
            </div>
          </div>

          <div className="mt-6 p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-800">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider opacity-70">Ratio (Abutment : Pontic)</p>
              <p className="text-3xl font-black mt-1">{ratio} : 1</p>
            </div>
            <div className={`px-4 py-2 rounded-xl text-xs font-bold ${antesPass ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
              {antesPass ? '✓ Ante\'s Law Satisfied (>= 1.0)' : '✕ Ante\'s Law NOT Satisfied (< 1.0)'}
            </div>
          </div>
        </div>
      );

    case 'clinical_sim':
      return <ClinicalScenariosView cardBg={cardBg} />;

    case 'quiz3':
      return <MiniQuizSection lectureTitle="Comprehensive Quiz" themeMode={themeMode} />;

    default:
      return null;
  }
}

/* ============================================================================
   CLINICAL SCENARIOS COMPONENT
   ============================================================================ */

const scenariosList = [
  {
    title: 'Case A: Tilted Molar Abutment',
    patient: '35-year-old patient missing lower 1st molar.',
    desc: 'The 2nd molar is significantly mesially tilted into the space. Can it serve as a straightforward FPD abutment?',
    options: [
      'Yes, cement a standard full crown directly without preparation.',
      'No, the severe tilt requires endodontic treatment, sectional preparation, or orthodontic uprighting to establish a common path of insertion.',
      'Use a cantilever bridge off the premolar instead.'
    ],
    answer: 1,
    explanation: 'A severely tilted tooth cannot share a common path of insertion with anterior abutments without extreme reduction that would expose the pulp. Orthodontic uprighting or fixed-mobile/telescopic designs are indicated.'
  },
  {
    title: 'Case B: Three Missing Posterior Teeth',
    patient: '50-year-old patient missing upper 1st molar and both premolars.',
    desc: 'Patient requests a fixed bridge anchored on the canine and 2nd molar. Does this satisfy Ante\'s Law?',
    options: [
      'Yes, canine and 2nd molar are strong enough.',
      'No, replacing three posterior teeth exceeds the root surface area of the abutments and violates Ante\'s Law (high risk of failure).',
      'Yes, provided a rigid connector is used.'
    ],
    answer: 1,
    explanation: 'Replacing three missing posterior teeth (1st molar and two premolars) exceeds the root surface area of the abutment teeth. This is a high-risk / unacceptable situation for an FPD.'
  }
];

function ClinicalScenariosView({ cardBg }: { cardBg: string }) {
  const [selectedOpt, setSelectedOpt] = useState<{ [key: number]: number }>({});
  const [showRationale, setShowRationale] = useState<{ [key: number]: boolean }>({});

  return (
    <div className="space-y-6">
      <div className={`p-6 rounded-3xl border shadow-card ${cardBg}`}>
        <h3 className="text-xl font-bold">Clinical Case Simulator</h3>
        <p className="mt-2 text-sm opacity-85 leading-relaxed">
          Test your diagnostic judgment on real-world prosthodontic dilemmas.
        </p>
      </div>

      <div className="space-y-6">
        {scenariosList.map((sc, idx) => {
          const picked = selectedOpt[idx];
          const revealed = showRationale[idx];
          const isCorrect = picked === sc.answer;

          return (
            <div key={idx} className={`p-6 rounded-3xl border shadow-card ${cardBg}`}>
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400">Case Study {idx + 1}</span>
                <span className="text-xs font-semibold opacity-70">{sc.patient}</span>
              </div>
              <h4 className="text-lg font-extrabold mt-2">{sc.title}</h4>
              <p className="mt-2 text-sm opacity-85 leading-relaxed">{sc.desc}</p>

              <div className="mt-4 space-y-2">
                {sc.options.map((opt, oIdx) => {
                  let btnStyle = themeModeDarkOrLight(cardBg, oIdx === picked);
                  if (revealed) {
                    if (oIdx === sc.answer) btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                    else if (oIdx === picked) btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300';
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => !revealed && setSelectedOpt(s => ({ ...s, [idx]: oIdx }))}
                      className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm transition ${btnStyle}`}
                    >
                      {String.fromCharCode(65 + oIdx)}. {opt}
                    </button>
                  );
                })}
              </div>

              {!revealed ? (
                <button
                  disabled={picked === undefined}
                  onClick={() => setShowRationale(s => ({ ...s, [idx]: true }))}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-[#C9A24B] text-slate-950 text-xs font-bold uppercase tracking-wider disabled:opacity-40 transition"
                >
                  Check Answer
                </button>
              ) : (
                <div className={`mt-4 p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${isCorrect ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'}`}>
                  <p className="font-bold mb-1">{isCorrect ? '✓ Correct!' : '✕ Incorrect.'}</p>
                  <p>{sc.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function themeModeDarkOrLight(cardBg: string, isSelected: boolean) {
  if (isSelected) return 'bg-[#1B3A8C] border-[#1B3A8C] text-white font-bold';
  return cardBg.includes('slate-900') ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 hover:bg-slate-100';
}

/* ============================================================================
   QUIZ COMPONENT
   ============================================================================ */

const quizItems = [
  {
    q: 'Prosthodontics is the dental specialty concerned with:',
    options: [
      'Only extracting and replacing missing teeth',
      'Restoring & maintaining oral functions, comfort, appearance & health by making artificial replacements for missing parts of mouth and jaw',
      'Treating periodontal disease exclusively',
      'Orthodontic tooth alignment'
    ],
    answer: 1,
    explain: 'Lecture 1 definition: Prosthodontics is concerned with restoring and maintaining oral functions, comfort, appearance & health by making artificial replacements for missing parts of the mouth and jaw.'
  },
  {
    q: 'An inlay, onlay, or pinlage is classified as:',
    options: [
      'Extracoronal restoration',
      'Intracoronal restoration',
      'A complete crown',
      'A post crown'
    ],
    answer: 1,
    explain: 'Intracoronal restorations (inlay, onlay, pinlage) seat inside the prepared coronal portion of the tooth, whereas extracoronal seat over the tooth.'
  },
  {
    q: 'According to Ante\'s Law, the root surface area of the abutment teeth must be:',
    options: [
      'Less than the root surface area of teeth to be replaced',
      'Equal to or greater than the root surface area of teeth to be replaced',
      'Exactly half of the pontic area',
      'Irrelevant if the patient is under 30'
    ],
    answer: 1,
    explain: 'Ante\'s Law states that the combined root surface area of the abutment teeth must equal or exceed that of the teeth being replaced with pontics.'
  },
  {
    q: 'Which crown-to-root ratio is considered the OPTIMUM for an FPD abutment?',
    options: ['1 : 1', '2 : 3', '1 : 2', '3 : 1'],
    answer: 1,
    explain: '2:3 is the optimum crown-to-root ratio, while 1:1 is the minimum acceptable ratio.'
  },
  {
    q: 'Which tooth has the greatest root surface area in the maxillary arch according to Jespen (1963)?',
    options: ['Canine', '1st Molar', '2nd Molar', 'Central Incisor'],
    answer: 1,
    explain: 'The maxillary 1st molar has the largest surface area (433 mm²), closely followed by the 2nd molar (431 mm²).'
  }
];

function MiniQuizSection({ lectureTitle, themeMode }: { lectureTitle: string; themeMode: string }) {
  const cardBg = themeMode === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-[#E6E8EC] text-[#0B1F4D]';
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const qData = quizItems[currentQ];

  const handleAnswer = (idx: number) => {
    if (showExplanation) return;
    setSelectedChoice(idx);
    setShowExplanation(true);
    if (idx === qData.answer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ + 1 < quizItems.length) {
      setCurrentQ(c => c + 1);
      setSelectedChoice(null);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQ(0);
    setSelectedChoice(null);
    setScore(0);
    setShowExplanation(false);
    setQuizFinished(false);
  };

  if (quizFinished) {
    return (
      <div className={`p-8 rounded-3xl border shadow-card text-center space-y-4 ${cardBg}`}>
        <span className="text-4xl">🏆</span>
        <h3 className="text-2xl font-extrabold">{lectureTitle} Completed!</h3>
        <p className="text-base font-semibold">Your Score: <span className="text-[#C9A24B]">{score}</span> / {quizItems.length}</p>
        <p className="text-xs opacity-75 max-w-md mx-auto">
          {score === quizItems.length ? 'Outstanding! You have mastered the lecture material.' : 'Good effort! Review the lecture slides and try again to perfect your score.'}
        </p>
        <button
          onClick={restartQuiz}
          className="mt-4 px-6 py-3 rounded-xl bg-[#1B3A8C] text-white font-bold text-xs uppercase tracking-wider hover:bg-navy transition shadow-md"
        >
          Restart Quiz
        </button>
      </div>
    );
  }

  return (
    <div className={`p-6 sm:p-8 rounded-3xl border shadow-card space-y-6 ${cardBg}`}>
      <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-800">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C9A24B]">{lectureTitle}</span>
        <span className="text-xs font-mono font-bold opacity-70">Question {currentQ + 1} of {quizItems.length}</span>
      </div>

      <h4 className="text-lg sm:text-xl font-extrabold leading-snug">{qData.q}</h4>

      <div className="space-y-3">
        {qData.options.map((opt, oIdx) => {
          let btnStyle = themeMode === 'dark' ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 hover:bg-slate-100';
          if (showExplanation) {
            if (oIdx === qData.answer) btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
            else if (oIdx === selectedChoice) btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300';
          } else if (selectedChoice === oIdx) {
            btnStyle = 'bg-[#1B3A8C] border-[#1B3A8C] text-white font-bold';
          }

          return (
            <button
              key={oIdx}
              onClick={() => handleAnswer(oIdx)}
              disabled={showExplanation}
              className={`w-full text-left p-4 rounded-2xl border text-sm sm:text-base transition ${btnStyle}`}
            >
              <span className="font-mono font-bold mr-3 opacity-60">{String.fromCharCode(65 + oIdx)}.</span>
              {opt}
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div className="space-y-4 pt-2 animate-fadeIn">
          <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${selectedChoice === qData.answer ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'}`}>
            <p className="font-bold mb-1">{selectedChoice === qData.answer ? '✓ Correct!' : '✕ Incorrect.'}</p>
            <p>{qData.explain}</p>
          </div>

          <button
            onClick={handleNext}
            className="px-6 py-3 rounded-xl bg-[#C9A24B] text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition shadow-md"
          >
            {currentQ + 1 < quizItems.length ? 'Next Question →' : 'View Final Score →'}
          </button>
        </div>
      )}
    </div>
  );
}
