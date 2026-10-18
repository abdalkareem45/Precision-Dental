import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  BookmarkCheck,
  CheckCircle2,
  AlertTriangle,
  Award,
  Hash,
  Scale,
  Brain,
  Layers,
  Search
} from 'lucide-react';

interface HighYieldFact {
  id: number;
  category: 'Must-Know Numbers' | 'Classifications' | 'Mechanisms' | 'AI Facts' | 'Clinical Rules';
  title: string;
  badge: string;
  badgeColor: string;
  summary: string;
  pdfPage: number;
}

const HIGH_YIELD_FACTS: HighYieldFact[] = [
  {
    id: 1,
    category: 'Must-Know Numbers',
    title: 'Radius of Action: 1.5 mm to 2.5 mm',
    badge: 'Page & Schroeder',
    badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-800',
    summary:
      'Bacterial biofilm can induce bone loss within 1.5–2.5 mm. Angular defects form ONLY in spaces >2.5 mm; spaces <2.5 mm result in horizontal loss.',
    pdfPage: 5
  },
  {
    id: 2,
    category: 'Must-Know Numbers',
    title: 'Löe Bone Loss Progression Rates: 8% / 81% / 11%',
    badge: 'Natural History',
    badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
    summary:
      '8% rapid progression (0.1–1.0 mm/yr); 81% moderate progression (0.05–0.5 mm/yr); 11% minimal progression (0.05–0.09 mm/yr).',
    pdfPage: 6
  },
  {
    id: 3,
    category: 'Must-Know Numbers',
    title: 'Osseous Craters: 35.2% & 62% Mandibular',
    badge: 'Epidemiology',
    badgeColor: 'bg-amber-950 text-amber-300 border-amber-800',
    summary:
      'Craters comprise 35.2% of all defects and 62% of mandibular defects. 2x more common in posterior. Crest heights identical in 85% of cases.',
    pdfPage: 13
  },
  {
    id: 4,
    category: 'Must-Know Numbers',
    title: 'Palatal Exostoses: 40% Human Skulls',
    badge: 'Anatomy',
    badgeColor: 'bg-purple-950 text-purple-300 border-purple-800',
    summary:
      'Palatal exostoses occur in 40% of human skulls. Can be nodules, ridges, or spikes.',
    pdfPage: 9
  },
  {
    id: 5,
    category: 'Must-Know Numbers',
    title: 'Ochsenbein Crater Depths: 1–2mm / 3–4mm / 5+mm',
    badge: 'Classification',
    badgeColor: 'bg-rose-950 text-rose-300 border-rose-800',
    summary:
      'Shallow crater: 1–2 mm. Medium crater: 3–4 mm. Deep crater: 5 mm or more.',
    pdfPage: 13
  },
  {
    id: 6,
    category: 'Clinical Rules',
    title: 'Existing Bone Level = Consequence of Past Episodes',
    badge: 'Clinical Principle',
    badgeColor: 'bg-blue-950 text-blue-300 border-blue-800',
    summary:
      'Bone level reflects past pathologic destruction, not current pocket depth or suppuration. A reduced periodontium can be currently healthy post-treatment.',
    pdfPage: 1
  },
  {
    id: 7,
    category: 'Clinical Rules',
    title: 'Living Bone, NOT Bone Necrosis',
    badge: 'Histology',
    badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
    summary:
      'Bone destruction involves living cells along viable bone. Exception: NUP and BRONJ. Analogy: Bone runs away from infection as host protection.',
    pdfPage: 5
  },
  {
    id: 8,
    category: 'Clinical Rules',
    title: 'TFO: Angular Defects WITHOUT Pockets',
    badge: 'Occlusion',
    badgeColor: 'bg-amber-950 text-amber-300 border-amber-800',
    summary:
      'Without plaque, trauma from occlusion causes reversible angular defects WITHOUT pocket formation. With periodontitis, it causes bizarre bone patterns.',
    pdfPage: 7
  },
  {
    id: 9,
    category: 'Classifications',
    title: 'Vertical Defects: 3-Wall, 2-Wall, 1-Wall (Hemiseptum)',
    badge: 'Residual Walls',
    badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-800',
    summary:
      '3-wall (intrabony, mesial of molars, best regeneration). 2-wall (buccal & lingual intact). 1-wall (hemiseptum). Combined (3-wall apical, 2-wall occlusal). Circumferential (trough-like).',
    pdfPage: 11
  },
  {
    id: 10,
    category: 'Classifications',
    title: 'Furcation Involvements: Mandibular 1st Molar Most Common',
    badge: 'Glickman I–IV',
    badgeColor: 'bg-purple-950 text-purple-300 border-purple-800',
    summary:
      'Mandibular 1st molar = most common; Maxillary premolars = least common. Probing with Nabers probe. Grade I (incipient), II (cul-de-sac), III (through-and-through covered), IV (exposed).',
    pdfPage: 14
  },
  {
    id: 11,
    category: 'Classifications',
    title: 'Reversed Architecture (Inconsistent Bony Margin)',
    badge: 'Maxilla > Mandible',
    badgeColor: 'bg-rose-950 text-rose-300 border-rose-800',
    summary:
      'Interdental bone crest sits apical to midfacial/midlingual margins without concomitant radicular bone loss. More common in Maxilla.',
    pdfPage: 14
  },
  {
    id: 12,
    category: 'Mechanisms',
    title: 'Inflammatory Mediators Causing Bone Resorption',
    badge: 'Biochemistry',
    badgeColor: 'bg-blue-950 text-blue-300 border-blue-800',
    summary:
      'Prostaglandins (PGE2) & precursors, Interleukin-1α (IL-1α), Interleukin-1β (IL-1β), and Tumor Necrosis Factor alpha (TNF-α). Direct osteoblast inhibition.',
    pdfPage: 7
  },
  {
    id: 13,
    category: 'AI Facts',
    title: 'Rana et al. 2017: 405–450 nm Porphyrin Fluorescence',
    badge: 'Machine Learning',
    badgeColor: 'bg-pink-950 text-pink-300 border-pink-800',
    summary:
      'Wavelength 405–450 nm. Plaque displayed in shades of yellow and orange; inflamed gums displayed in shades of magenta and red.',
    pdfPage: 2
  },
  {
    id: 14,
    category: 'AI Facts',
    title: 'Miller et al. 2023: 99% Staging Accuracy on Periapicals',
    badge: 'Deep Learning',
    badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
    summary:
      'Panoramic RBL accuracy: 63%–94%. Periapical: precision 25% for mild disease, high accuracy 99% for staging of RBL.',
    pdfPage: 6
  },
  {
    id: 15,
    category: 'AI Facts',
    title: 'Allahverdi & Akcan 2019: Fuzzy Logic & Genetic Algorithms',
    badge: 'Treatment Planning',
    badgeColor: 'bg-indigo-950 text-indigo-300 border-indigo-800',
    summary:
      'Decision support system using fuzzy logic and genetic algorithms to optimize treatment planning based on patient preferences and measurements.',
    pdfPage: 19
  }
];

export const RapidReview: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredFacts = HIGH_YIELD_FACTS.filter((fact) => {
    const matchesCategory = filterCategory === 'all' || fact.category === filterCategory;
    const matchesSearch =
      fact.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fact.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
            High-Yield Exam Cram • 15 Essential Lecture Pillars
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-amber-400" />
          Rapid Review &amp; Board Exam Memorization Sheet
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
          Quick review of every crucial definition, exact numerical threshold, study citation, and clinical pearl for 5th-year periodontal exams.
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2 justify-between items-center bg-slate-900 p-2 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['all', 'Must-Know Numbers', 'Classifications', 'Mechanisms', 'Clinical Rules', 'AI Facts'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                filterCategory === cat
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat === 'all' ? 'All Facts' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search high-yield facts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Fact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredFacts.map((fact) => (
          <div
            key={fact.id}
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 rounded border ${fact.badgeColor}`}>
                  {fact.badge}
                </span>
                <span className="text-[10px] font-mono text-slate-500">PDF Page {fact.pdfPage}</span>
              </div>
              <h4 className="font-bold text-sm text-white leading-tight">{fact.title}</h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">{fact.summary}</p>
            </div>
            <div className="pt-2 border-t border-slate-900 text-[10px] text-amber-400/80 font-mono font-semibold">
              Category: {fact.category}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
