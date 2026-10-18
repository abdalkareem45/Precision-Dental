import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Activity,
  FileCheck2,
  Heart,
  Pill,
  Table2,
  GitCommit,
  Sparkles,
  ChevronRight,
  GraduationCap,
  ArrowUpDown,
  Search,
  Filter,
  Layers,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Eye,
  SlidersHorizontal,
  Compass,
  X
} from 'lucide-react';
import { NavTab } from './Navbar';

export type LectureCategory =
  | 'bone_destruction'
  | 'furcation_involvement'
  | 'cpg_guidelines'
  | 'med_compromised'
  | 'staging_diagnostics'
  | 'treatment_rehab'
  | 'biophysics';

export interface NumberedLecture {
  number: number;
  id: NavTab;
  part?: 'part1' | 'part2';
  title: string;
  shortTitle: string;
  subtitle: string;
  instructor: string;
  university: string;
  category: LectureCategory;
  categoryLabel: string;
  icon: React.ReactNode;
  color: string;
  topics: string[];
  simulators: string[];
  mcqCount: number;
}

export const NUMBERED_LECTURES: NumberedLecture[] = [
  {
    number: 1,
    id: 'boneloss',
    title: 'Lecture 1: Bone Loss and Patterns of Bone Destruction',
    shortTitle: 'Lec 1: Bone Loss & Destruction',
    subtitle: 'Mechanisms, Horizontal & Vertical Defect Morphology, Craters',
    instructor: '5th-Year Periodontology Curriculum',
    university: 'College of Dentistry',
    category: 'bone_destruction',
    categoryLabel: 'Bone Biology & Defects',
    icon: <Activity className="w-4 h-4 text-[#dfbe6e]" />,
    color: 'from-amber-500/20 to-amber-600/10 border-amber-500/40 text-amber-300',
    topics: ['Equilibrium Dynamics', 'Pathways of Inflammation', 'Radius of Action (1.5–2.5mm)', '1-, 2-, 3-Wall Infrabony Defects', 'Interdental Osseous Craters (35.2% & 62%)', 'Glickman Furcation I–IV'],
    simulators: ['3D Tissue Cross-Section', '3D Bone Defect Simulator', 'Split Comparison Mode (Horiz vs Vert)', 'AI Periodontology'],
    mcqCount: 24
  },
  {
    number: 2,
    id: 'furcation',
    title: 'Lecture 2: Furcation Involvement — Part I Anatomy, Probing & Diagnosis',
    shortTitle: 'Lec 2: Furcation Part I',
    subtitle: 'Anatomy, Root Trunks, Hamp I–IV, Masters & Hoskins CEPs, Nabers Probing',
    instructor: 'Dr. Maha Shukri',
    university: 'University of Baghdad (Dept of Periodontics)',
    category: 'furcation_involvement',
    categoryLabel: 'Furcation & Anatomy',
    icon: <Compass className="w-4 h-4 text-cyan-400" />,
    color: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/40 text-cyan-300',
    topics: ['Root Complex: Trunk vs Cones', 'Hamp et al. (1975) Classes I–IV', 'Masters & Hoskins (1964) CEP Grades I–III & Enamel Pearls', 'Palatal Probing Rule for Mesial Maxillary Furca', 'Accessory Furcation Canals & Endo-Perio', 'Trauma from Occlusion (TFO) Differential', 'Tooth Type Prognosis (Mandibular vs Maxillary)'],
    simulators: ['3D Multi-Rooted Furcation Engine', '2D Palatal Probing Angle Simulator', 'Hamp Classification Caliper', 'Differential Diagnosis Wizard'],
    mcqCount: 12
  },
  {
    number: 3,
    id: 'cpg_guidelines',
    title: 'Lecture 3: Clinical Practice Guideline (CPG) for Periodontitis Treatment',
    shortTitle: 'Lec 3: CPG Guidelines (S3 Level)',
    subtitle: 'EFP S3 Stepwise Treatment, 4 Steps, Re-eval Endpoints, Cases 1 & 2',
    instructor: 'Dr. Alaa Omran',
    university: 'University of Baghdad (5th Class)',
    category: 'cpg_guidelines',
    categoryLabel: 'Clinical Practice Guidelines',
    icon: <FileCheck2 className="w-4 h-4 text-[#38bdf8]" />,
    color: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/40 text-cyan-300',
    topics: ['CPG Definition & Grading (A–D)', 'Step 1: Biofilm & Risk Factors', 'Step 2: Subgingival Instrumentation (SRP)', 'Step 3: Access Flap & Regenerative Surgery', 'Step 4: Supportive Care (SPC)', 'Endpoints (Pockets ≤4mm, no BOP)'],
    simulators: ['3D 4-Step Surgical Modality Viewer', '2D Interactive EFP Algorithm Tree', '2D Pocket Depth Cross-Section', 'Walkthrough Cases 1 & 2'],
    mcqCount: 10
  },
  {
    number: 4,
    id: 'med_compromised',
    part: 'part1',
    title: 'Lecture 4: Periodontal Management of Medically Compromised Patients (Part I)',
    shortTitle: 'Lec 4: Med Compromised I (Cardio/Renal)',
    subtitle: 'Cardio, LA Epinephrine Limits, Endocarditis Prophylaxis, Dialysis, Chemo',
    instructor: 'Dr. Maha Shukri',
    university: 'University of Baghdad (Periodontic Dept)',
    category: 'med_compromised',
    categoryLabel: 'Medical Compromise (Cardio/Renal)',
    icon: <Heart className="w-4 h-4 text-rose-400" />,
    color: 'from-rose-500/20 to-rose-600/10 border-rose-500/40 text-rose-300',
    topics: ['Hypertension BP Cutoffs', 'Safe LA Epinephrine (0.04mg max)', 'Angina & Intraop Nitroglycerin', 'Post-MI 6-Month Waiting Period', 'Infective Endocarditis 2g Amoxicillin', 'Hemodialysis Scheduling & AV Fistula', 'Chemo Absolute Neutrophil Count'],
    simulators: ['3D Cardiac & LA Epinephrine Engine', 'Infective Endocarditis Valve 3D', '2D Epinephrine Cartridge Calculator', 'Emergency Nitroglycerin Flowchart'],
    mcqCount: 10
  },
  {
    number: 5,
    id: 'med_compromised',
    part: 'part2',
    title: 'Lecture 5: Periodontal Management of Medically Compromised Patients (Part II)',
    shortTitle: 'Lec 5: Med Compromised II (Endo/Bleed)',
    subtitle: 'Diabetes & HbA1c, Steroid Rule, Pregnancy Left Tilt, Bleeding, Aerosols',
    instructor: 'Dr. Maha Shukri',
    university: 'University of Baghdad (Periodontic Dept)',
    category: 'med_compromised',
    categoryLabel: 'Medical Compromise (Endo/Hematology)',
    icon: <Pill className="w-4 h-4 text-purple-400" />,
    color: 'from-purple-500/20 to-purple-600/10 border-purple-500/40 text-purple-300',
    topics: ['Diabetes Diagnostic (FBG ≥126 / HbA1c ≥6.5%)', 'Morning Appointments & Glucose Timing', 'Adrenal Crisis & Steroid 20-Rule', 'Pregnancy 2nd Trimester & Supine Left Tilt', 'Aspirin Withdrawal (7–10 Days)', 'Platelet Thresholds (≥50k for Surgery)', 'Hepatitis & HIV Precautions'],
    simulators: ['3D Diabetic Microangiopathy & HbA1c Engine', '2D Steroid Rule Calculator', 'Bleeding Disorder Gatekeeper', 'Antigen Profile Matrix'],
    mcqCount: 14
  },
  {
    number: 6,
    id: 'staging',
    title: 'Lecture 6: 2018 Classification: Staging and Grading Matrix',
    shortTitle: 'Lec 6: 2018 Staging & Grading',
    subtitle: 'EFP/AAP Tonetti & Kornman Stage I–IV & Grade A–C Modifiers',
    instructor: 'EFP / AAP 2018 World Workshop',
    university: 'International Periodontal Consensus',
    category: 'staging_diagnostics',
    categoryLabel: 'Staging & Diagnosis',
    icon: <Table2 className="w-4 h-4 text-[#C9A24B]" />,
    color: 'from-[#C9A24B]/20 to-[#C9A24B]/10 border-[#C9A24B]/40 text-[#C9A24B]',
    topics: ['Severity: Interdental CAL (1–2mm, 3–4mm, ≥5mm)', 'Radiographic Bone Loss (% vs Age)', 'Tooth Loss Due to Periodontitis', 'Complexity Factors (Furcation II/III, Vertical Defects)', 'Grade A–C Progression Rates', 'Smoking & HbA1c Risk Modifiers'],
    simulators: ['Dynamic Diagnostic Formulation Card', 'Interactive Slider Calculator', 'Complexity Factor Toggles', 'Instant Staging Diagnostic Matrix'],
    mcqCount: 15
  },
  {
    number: 7,
    id: 'treatment',
    title: 'Lecture 7: Stepwise Treatment Planning and Stage IV Rehabilitation',
    shortTitle: 'Lec 7: Stepwise Therapy & Stage IV',
    subtitle: 'Interdisciplinary Phenotypes, Case Types 1–4 Protocol',
    instructor: 'EFP S3 Clinical Protocol',
    university: 'European Federation of Periodontology',
    category: 'treatment_rehab',
    categoryLabel: 'Treatment Sequences & Rehab',
    icon: <GitCommit className="w-4 h-4 text-blue-400" />,
    color: 'from-blue-500/20 to-blue-600/10 border-blue-500/40 text-blue-300',
    topics: ['Step 1: Cause-Related Therapy & Splinting', 'Step 2: SRP & Antimicrobial Adjuncts', 'Re-evaluation Endpoints (6–12 weeks)', 'Step 3: Surgical Access & Regeneration', 'Step 4: Supportive Periodontal Care (SPC)', 'Stage IV Case Types 1–4 (Trauma, Migration, Collapse)'],
    simulators: ['Interactive Treatment Steps Checklist', 'Re-evaluation Endpoints Simulator', 'Stage IV 3D Phenotype Visualizer', 'Timeline Planner'],
    mcqCount: 12
  },
  {
    number: 8,
    id: 'mechanics',
    title: 'Lecture 8: Visual Mechanics and Periodontics Biophysics',
    shortTitle: 'Lec 8: Visual Mechanics & Physics',
    subtitle: 'Tissue Resistance, Probing Mechanics, Periodontal Physics',
    instructor: 'Periodontics Mechanics Notes',
    university: 'Biophysical Dentistry Consortium',
    category: 'biophysics',
    categoryLabel: 'Biophysics & Micro-Mechanics',
    icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
    color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/40 text-emerald-300',
    topics: ['CAL vs PD Mechanical Derivation', 'Soft Tissue Resistance vs Probe Penetration', 'Gingival Margin Coronal/Apical Shifts', 'Bleeding on Probing (BOP) Micro-Cascade', 'Miller Mobility Classes 1–3 Physics', 'Furcation Entrance Biomechanics'],
    simulators: ['Interactive CAL vs PD Tooth SVG Simulator', 'Probe Caliper Dimension Engine', 'Cellular Mechanism Cascades', 'Micro-Anatomy Cross-Section'],
    mcqCount: 20
  }
];

type SortMode = 'number_asc' | 'number_desc' | 'faculty' | 'category';

interface NumberedLectureBarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab, part?: 'part1' | 'part2') => void;
  activePart?: 'part1' | 'part2';
}

export const NumberedLectureBar: React.FC<NumberedLectureBarProps> = ({
  activeTab,
  onSelectTab,
  activePart = 'part1'
}) => {
  const [sortMode, setSortMode] = useState<SortMode>('number_asc');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCurriculumExpanded, setIsCurriculumExpanded] = useState<boolean>(false);

  // Sorting and Filtering logic
  const processedLectures = useMemo(() => {
    let list = [...NUMBERED_LECTURES];

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((lec) => {
        return (
          lec.title.toLowerCase().includes(q) ||
          lec.subtitle.toLowerCase().includes(q) ||
          lec.instructor.toLowerCase().includes(q) ||
          lec.university.toLowerCase().includes(q) ||
          lec.topics.some((t) => t.toLowerCase().includes(q)) ||
          lec.simulators.some((s) => s.toLowerCase().includes(q))
        );
      });
    }

    // Filter by Category
    if (selectedFilterCategory !== 'all') {
      list = list.filter((lec) => lec.category === selectedFilterCategory);
    }

    // Apply Sorting
    if (sortMode === 'number_asc') {
      list.sort((a, b) => a.number - b.number);
    } else if (sortMode === 'number_desc') {
      list.sort((a, b) => b.number - a.number);
    } else if (sortMode === 'faculty') {
      list.sort((a, b) => a.instructor.localeCompare(b.instructor));
    } else if (sortMode === 'category') {
      list.sort((a, b) => a.categoryLabel.localeCompare(b.categoryLabel));
    }

    return list;
  }, [sortMode, selectedFilterCategory, searchQuery]);

  // Determine current active lecture number
  const currentActiveLecture = NUMBERED_LECTURES.find((lec) => {
    if (activeTab === 'furcation') return lec.number === 2;
    if (activeTab === 'cpg_guidelines') return lec.number === 3;
    if (activeTab === 'med_compromised_1') return lec.number === 4;
    if (activeTab === 'med_compromised_2') return lec.number === 5;
    if (activeTab === 'med_compromised') {
      return activePart === 'part1' ? lec.number === 4 : lec.number === 5;
    }
    return activeTab === lec.id;
  });

  return (
    <div className="w-full bg-[#07132e]/95 border border-[#C9A24B]/35 rounded-3xl p-3 sm:p-5 shadow-2xl backdrop-blur-xl transition-all">
      {/* Top Banner / Heading with Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#dfbe6e] to-[#C9A24B] text-slate-950 font-black text-sm flex items-center justify-center shadow-lg font-mono">
              8
            </span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950 animate-pulse" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <span>Numbered Curriculum Hub</span>
                <span className="text-[10px] text-[#C9A24B] font-mono font-bold bg-[#C9A24B]/10 px-2 py-0.5 rounded-full border border-[#C9A24B]/30">
                  Lectures 1 to 8 Sorted
                </span>
              </h3>
              {currentActiveLecture && (
                <span className="hidden sm:inline-flex text-[10px] bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full font-semibold">
                  Currently Viewing: Lecture {currentActiveLecture.number}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              Chronologically ordered 5th-year periodontology syllabus with direct navigation, 2D &amp; 3D simulations, and board question banks.
            </p>
          </div>
        </div>

        {/* Toolbar: Sort Mode, Search & Drawer Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-48 md:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lectures (e.g. furcation, CEP)..."
              className="w-full bg-slate-900/90 text-xs text-white placeholder-slate-400 pl-8 pr-7 py-1.5 rounded-xl border border-slate-700 focus:outline-none focus:border-[#C9A24B] transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Sort Order Selector */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-[11px]">
            <ArrowUpDown className="w-3 h-3 text-[#C9A24B] ml-1 mr-0.5" />
            <button
              onClick={() => setSortMode('number_asc')}
              className={`px-2 py-1 rounded-lg font-bold transition ${
                sortMode === 'number_asc'
                  ? 'bg-[#C9A24B] text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Sort 1 to 8 (Sequential Order)"
            >
              1 → 8
            </button>
            <button
              onClick={() => setSortMode('number_desc')}
              className={`px-2 py-1 rounded-lg font-bold transition ${
                sortMode === 'number_desc'
                  ? 'bg-[#C9A24B] text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Sort 8 to 1 (Reverse Order)"
            >
              8 → 1
            </button>
            <button
              onClick={() => setSortMode('faculty')}
              className={`px-2 py-1 rounded-lg font-bold transition hidden sm:block ${
                sortMode === 'faculty'
                  ? 'bg-[#C9A24B] text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Group by Professor / Source"
            >
              Faculty
            </button>
          </div>

          {/* Expand Full Syllabus Table Button */}
          <button
            onClick={() => setIsCurriculumExpanded(!isCurriculumExpanded)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
              isCurriculumExpanded
                ? 'bg-[#18357a] text-white border-[#C9A24B]'
                : 'bg-slate-900 text-slate-300 hover:text-white border-slate-800'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#C9A24B]" />
            <span className="hidden sm:inline">Detailed Syllabus</span>
            <span className="sm:hidden">Syllabus</span>
            {isCurriculumExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 text-xs scrollbar-none">
        <span className="text-[10px] text-slate-400 uppercase font-mono font-bold shrink-0 flex items-center gap-1 mr-1">
          <Filter className="w-3 h-3 text-[#C9A24B]" /> Filter:
        </span>
        {[
          { id: 'all', label: 'All 8 Lectures' },
          { id: 'bone_destruction', label: '1. Bone Loss' },
          { id: 'furcation_involvement', label: '2. Furcation I' },
          { id: 'cpg_guidelines', label: '3. CPG Guidelines' },
          { id: 'med_compromised', label: '4 & 5. Med Compromised' },
          { id: 'staging_diagnostics', label: '6. Staging & Matrix' },
          { id: 'treatment_rehab', label: '7. Stepwise & Stage IV' },
          { id: 'biophysics', label: '8. Visual Mechanics' }
        ].map((chip) => (
          <button
            key={chip.id}
            onClick={() => setSelectedFilterCategory(chip.id)}
            className={`px-2.5 py-1 rounded-lg text-[11px] whitespace-nowrap transition font-semibold cursor-pointer ${
              selectedFilterCategory === chip.id
                ? 'bg-blue-600 text-white font-bold shadow'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Numbered Lecture Horizontal Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {processedLectures.map((lec) => {
          let isActive = false;
          if (lec.number === 2) {
            isActive = activeTab === 'furcation';
          } else if (lec.number === 3) {
            isActive = activeTab === 'cpg_guidelines';
          } else if (lec.number === 4) {
            isActive = activeTab === 'med_compromised_1' || (activeTab === 'med_compromised' && activePart === 'part1');
          } else if (lec.number === 5) {
            isActive = activeTab === 'med_compromised_2' || (activeTab === 'med_compromised' && activePart === 'part2');
          } else {
            isActive = activeTab === lec.id;
          }

          return (
            <button
              key={`${lec.number}_${lec.id}_${lec.part || ''}`}
              onClick={() => onSelectTab(lec.id, lec.part)}
              className={`p-2.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between group cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-b from-[#18357a] to-[#0d2253] border-[#C9A24B] ring-2 ring-[#C9A24B]/70 shadow-xl shadow-[#0B1F4D]'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-800/90'
              }`}
            >
              {/* Badge Number and Icon */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`w-6 h-6 rounded-lg font-mono font-black text-xs flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-[#C9A24B] text-slate-950 shadow-md font-black'
                      : 'bg-slate-800 text-slate-300 group-hover:bg-[#C9A24B]/20 group-hover:text-[#C9A24B]'
                  }`}
                >
                  {lec.number}
                </span>

                <div className="p-1 rounded-lg bg-slate-800/60 border border-slate-700/50">
                  {lec.icon}
                </div>
              </div>

              {/* Title & Instructor */}
              <div>
                <div
                  className={`text-xs font-bold leading-snug line-clamp-2 ${
                    isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'
                  }`}
                >
                  {lec.shortTitle}
                </div>

                <div className="text-[10px] text-[#C9A24B] font-medium mt-1 truncate">
                  {lec.instructor}
                </div>

                <div className="text-[9px] text-slate-400 truncate mt-0.5">
                  {lec.categoryLabel}
                </div>
              </div>

              {/* Interactive Visuals count pill */}
              <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[9px] text-slate-400">
                <span className="flex items-center gap-1 text-cyan-400 font-mono">
                  <Eye className="w-2.5 h-2.5" /> 2D/3D
                </span>
                <span className="text-amber-400 font-mono font-bold">
                  {lec.mcqCount} MCQs
                </span>
              </div>

              {/* Active Bottom Glow Line */}
              {isActive && (
                <div className="absolute bottom-0 left-2 right-2 h-1 bg-[#C9A24B] rounded-full shadow-glow" />
              )}
            </button>
          );
        })}
      </div>

      {processedLectures.length === 0 && (
        <div className="p-6 text-center text-slate-400 text-xs bg-slate-900/50 rounded-2xl border border-slate-800">
          No lectures match the filter "{searchQuery}". Try searching for "furcation", "CEP", "diabetes", "bone", "Alaa", or "Maha".
        </div>
      )}

      {/* Expandable Comprehensive Curriculum Syllabus Drawer */}
      {isCurriculumExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-800/90 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#C9A24B]" />
              <span>Complete 5th-Year Periodontology Curriculum Matrix (Lectures 1–8)</span>
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">
              University of Baghdad / EFP &amp; AAP Accredited
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {NUMBERED_LECTURES.map((lec) => (
              <div
                key={lec.number}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-2.5 hover:border-slate-700 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#C9A24B] text-slate-950 font-black text-xs flex items-center justify-center font-mono shrink-0">
                      {lec.number}
                    </span>
                    <div>
                      <h5 className="text-xs font-black text-white leading-tight">
                        {lec.title}
                      </h5>
                      <span className="text-[10px] text-[#C9A24B] font-semibold">
                        {lec.instructor} • {lec.university}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0">{lec.icon}</div>
                </div>

                {/* Key Topics List */}
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">
                    Core Board Examination Topics:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {lec.topics.slice(0, 4).map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700/60"
                      >
                        {t}
                      </span>
                    ))}
                    {lec.topics.length > 4 && (
                      <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                        +{lec.topics.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* 2D & 3D Interactive Simulators */}
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold text-cyan-400 tracking-wider block flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> Interactive 2D &amp; 3D Visualizers:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {lec.simulators.map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] bg-cyan-950/50 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-800/40"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Launch Action Button */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 font-bold">
                    {lec.mcqCount} Board MCQs
                  </span>
                  <button
                    onClick={() => {
                      onSelectTab(lec.id, lec.part);
                      setIsCurriculumExpanded(false);
                    }}
                    className="px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold flex items-center gap-1 transition shadow-sm cursor-pointer"
                  >
                    <span>Launch Lec {lec.number}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
