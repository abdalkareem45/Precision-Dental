import React, { useState } from 'react';
import {
  Activity,
  Droplet,
  MoveHorizontal,
  Split,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
  Layers,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { ThreeBopViewer } from './ThreeBopViewer';
import { ThreeMobilitySimulator } from './ThreeMobilitySimulator';
import { ThreeFurcationSimulator } from './ThreeFurcationSimulator';
import { ThreePlaqueViewer } from './ThreePlaqueViewer';
import { InteractivePanoramicCorrelator } from './InteractivePanoramicCorrelator';
import { BoneDefectType } from './MultiToothSandbox';

interface ToothSite {
  id: string;
  name: string;
  short: string;
  bleeding: boolean;
  pocketDepth: number;
  pos: [number, number, number];
}

interface ArchTooth {
  number: number;
  fdi: number;
  name: string;
  type: 'incisor' | 'molar';
  mobility: 0 | 1 | 2 | 3;
  furcation?: 'None' | 'Grade I' | 'Grade II' | 'Grade III' | 'Grade IV';
  surfaces: { buccal: boolean; lingual: boolean; mesial: boolean; distal: boolean };
  sites: ToothSite[];
}

interface ClinicalExamSimulatorProps {
  onLoadDefectToSandbox?: (defect: BoneDefectType) => void;
}

export const ClinicalExamSimulator: React.FC<ClinicalExamSimulatorProps> = ({
  onLoadDefectToSandbox
}) => {
  const [activeSubModule, setActiveSubModule] = useState<'bop' | 'mobility' | 'furcation' | 'plaque' | 'panoramic'>('bop');
  const [selectedBopToothIdx, setSelectedBopToothIdx] = useState<number>(0);

  // 6 Key Diagnostic Teeth across quadrants
  const [teeth, setTeeth] = useState<ArchTooth[]>([
    {
      number: 8,
      fdi: 11,
      name: 'Maxillary Right Central Incisor (#11)',
      type: 'incisor',
      mobility: 2,
      furcation: 'None',
      surfaces: { buccal: true, lingual: true, mesial: false, distal: true },
      sites: [
        { id: '11-df', name: 'Distofacial', short: 'DF', bleeding: true, pocketDepth: 4, pos: [0.65, 0.05, 0.45] },
        { id: '11-f', name: 'Mid-facial', short: 'F', bleeding: false, pocketDepth: 2, pos: [0.0, 0.05, 0.55] },
        { id: '11-mf', name: 'Mesiofacial', short: 'MF', bleeding: false, pocketDepth: 3, pos: [-0.65, 0.05, 0.45] },
        { id: '11-dl', name: 'Distopalatal', short: 'DP', bleeding: true, pocketDepth: 4, pos: [0.65, 0.05, -0.45] },
        { id: '11-l', name: 'Mid-palatal', short: 'P', bleeding: false, pocketDepth: 2, pos: [0.0, 0.05, -0.55] },
        { id: '11-ml', name: 'Mesiopalatal', short: 'MP', bleeding: false, pocketDepth: 3, pos: [-0.65, 0.05, -0.45] }
      ]
    },
    {
      number: 3,
      fdi: 16,
      name: 'Maxillary Right 1st Molar (#16)',
      type: 'molar',
      mobility: 1,
      furcation: 'Grade II',
      surfaces: { buccal: true, lingual: false, mesial: true, distal: true },
      sites: [
        { id: '16-db', name: 'Distobuccal', short: 'DB', bleeding: true, pocketDepth: 5, pos: [0.85, 0.05, 0.75] },
        { id: '16-b', name: 'Mid-buccal', short: 'B', bleeding: false, pocketDepth: 3, pos: [0.0, 0.05, 0.95] },
        { id: '16-mb', name: 'Mesiobuccal', short: 'MB', bleeding: true, pocketDepth: 6, pos: [-0.85, 0.05, 0.75] },
        { id: '16-dl', name: 'Distolingual', short: 'DL', bleeding: false, pocketDepth: 4, pos: [0.85, 0.05, -0.75] },
        { id: '16-l', name: 'Mid-lingual', short: 'L', bleeding: false, pocketDepth: 3, pos: [0.0, 0.05, -0.95] },
        { id: '16-ml', name: 'Mesiolingual', short: 'ML', bleeding: true, pocketDepth: 5, pos: [-0.85, 0.05, -0.75] }
      ]
    },
    {
      number: 14,
      fdi: 26,
      name: 'Maxillary Left 1st Molar (#26)',
      type: 'molar',
      mobility: 0,
      furcation: 'Grade I',
      surfaces: { buccal: false, lingual: true, mesial: false, distal: false },
      sites: [
        { id: '26-mb', name: 'Mesiobuccal', short: 'MB', bleeding: false, pocketDepth: 3, pos: [-0.85, 0.05, 0.75] },
        { id: '26-b', name: 'Mid-buccal', short: 'B', bleeding: false, pocketDepth: 2, pos: [0.0, 0.05, 0.95] },
        { id: '26-db', name: 'Distobuccal', short: 'DB', bleeding: true, pocketDepth: 4, pos: [0.85, 0.05, 0.75] },
        { id: '26-ml', name: 'Mesiolingual', short: 'ML', bleeding: false, pocketDepth: 3, pos: [-0.85, 0.05, -0.75] },
        { id: '26-l', name: 'Mid-lingual', short: 'L', bleeding: false, pocketDepth: 2, pos: [0.0, 0.05, -0.95] },
        { id: '26-dl', name: 'Distolingual', short: 'DL', bleeding: false, pocketDepth: 3, pos: [0.85, 0.05, -0.75] }
      ]
    },
    {
      number: 19,
      fdi: 36,
      name: 'Mandibular Left 1st Molar (#36)',
      type: 'molar',
      mobility: 1,
      furcation: 'Grade II',
      surfaces: { buccal: true, lingual: true, mesial: true, distal: true },
      sites: [
        { id: '36-mb', name: 'Mesiobuccal', short: 'MB', bleeding: true, pocketDepth: 6, pos: [-0.85, 0.05, 0.75] },
        { id: '36-b', name: 'Mid-buccal', short: 'B', bleeding: true, pocketDepth: 4, pos: [0.0, 0.05, 0.95] },
        { id: '36-db', name: 'Distobuccal', short: 'DB', bleeding: true, pocketDepth: 5, pos: [0.85, 0.05, 0.75] },
        { id: '36-ml', name: 'Mesiolingual', short: 'ML', bleeding: false, pocketDepth: 3, pos: [-0.85, 0.05, -0.75] },
        { id: '36-l', name: 'Mid-lingual', short: 'L', bleeding: false, pocketDepth: 2, pos: [0.0, 0.05, -0.95] },
        { id: '36-dl', name: 'Distolingual', short: 'DL', bleeding: true, pocketDepth: 5, pos: [0.85, 0.05, -0.75] }
      ]
    },
    {
      number: 24,
      fdi: 31,
      name: 'Mandibular Left Central Incisor (#31)',
      type: 'incisor',
      mobility: 0,
      furcation: 'None',
      surfaces: { buccal: false, lingual: false, mesial: false, distal: false },
      sites: [
        { id: '31-mf', name: 'Mesiofacial', short: 'MF', bleeding: false, pocketDepth: 2, pos: [-0.65, 0.05, 0.45] },
        { id: '31-f', name: 'Mid-facial', short: 'F', bleeding: false, pocketDepth: 2, pos: [0.0, 0.05, 0.55] },
        { id: '31-df', name: 'Distofacial', short: 'DF', bleeding: false, pocketDepth: 2, pos: [0.65, 0.05, 0.45] },
        { id: '31-ml', name: 'Mesiolingual', short: 'ML', bleeding: false, pocketDepth: 2, pos: [-0.65, 0.05, -0.45] },
        { id: '31-l', name: 'Mid-lingual', short: 'L', bleeding: false, pocketDepth: 1, pos: [0.0, 0.05, -0.55] },
        { id: '31-dl', name: 'Distolingual', short: 'DL', bleeding: false, pocketDepth: 2, pos: [0.65, 0.05, -0.45] }
      ]
    },
    {
      number: 30,
      fdi: 46,
      name: 'Mandibular Right 1st Molar (#46)',
      type: 'molar',
      mobility: 1,
      furcation: 'Grade II',
      surfaces: { buccal: true, lingual: true, mesial: false, distal: true },
      sites: [
        { id: '46-mb', name: 'Mesiobuccal', short: 'MB', bleeding: true, pocketDepth: 5, pos: [-0.85, 0.05, 0.75] },
        { id: '46-b', name: 'Mid-buccal', short: 'B', bleeding: false, pocketDepth: 3, pos: [0.0, 0.05, 0.95] },
        { id: '46-db', name: 'Distobuccal', short: 'DB', bleeding: true, pocketDepth: 5, pos: [0.85, 0.05, 0.75] },
        { id: '46-ml', name: 'Mesiolingual', short: 'ML', bleeding: false, pocketDepth: 3, pos: [-0.85, 0.05, -0.75] },
        { id: '46-l', name: 'Mid-lingual', short: 'L', bleeding: false, pocketDepth: 3, pos: [0.0, 0.05, -0.95] },
        { id: '46-dl', name: 'Distolingual', short: 'DL', bleeding: true, pocketDepth: 6, pos: [0.85, 0.05, -0.75] }
      ]
    }
  ]);

  // BOP Score Calculation
  const totalSites = teeth.reduce((acc, t) => acc + t.sites.length, 0);
  const bleedingSites = teeth.reduce((acc, t) => acc + t.sites.filter((s) => s.bleeding).length, 0);
  const bopPercentage = totalSites > 0 ? Math.round((bleedingSites / totalSites) * 100) : 0;

  const getBopCategory = (score: number) => {
    if (score < 10) {
      return {
        label: 'Clinical Periodontal Health (or Stability in treated patient)',
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-950/60 border-emerald-500/40',
        status: 'Healthy (<10%)'
      };
    } else if (score >= 10 && score <= 30) {
      return {
        label: 'Localized Gingival Inflammation / Localized Gingivitis',
        color: 'text-amber-400',
        bgColor: 'bg-amber-950/60 border-amber-500/40',
        status: 'Localized (10% – 30%)'
      };
    } else {
      return {
        label: 'Generalized Gingival Inflammation / Generalized Gingivitis',
        color: 'text-rose-400',
        bgColor: 'bg-rose-950/60 border-rose-500/40',
        status: 'Generalized (>30%)'
      };
    }
  };

  const bopCategory = getBopCategory(bopPercentage);

  const toggleSiteBleedingById = (siteId: string) => {
    const updated = teeth.map((tooth) => {
      const siteExists = tooth.sites.some((s) => s.id === siteId);
      if (!siteExists) return tooth;
      return {
        ...tooth,
        sites: tooth.sites.map((s) => (s.id === siteId ? { ...s, bleeding: !s.bleeding } : s))
      };
    });
    setTeeth(updated);
  };

  const togglePlaqueSurface = (toothIdx: number, surface: 'buccal' | 'lingual' | 'mesial' | 'distal') => {
    const updated = [...teeth];
    updated[toothIdx].surfaces[surface] = !updated[toothIdx].surfaces[surface];
    setTeeth(updated);
  };

  const loadPresetBop = (type: 'healthy' | 'localized' | 'generalized') => {
    const updated = teeth.map((tooth, tIdx) => {
      const newSites = tooth.sites.map((site, sIdx) => {
        let isBleeding = false;
        if (type === 'healthy') isBleeding = tIdx === 0 && sIdx === 0;
        else if (type === 'localized') isBleeding = sIdx < 2 && tIdx < 3;
        else if (type === 'generalized') isBleeding = (sIdx + tIdx) % 2 === 0;
        return { ...site, bleeding: isBleeding };
      });
      return { ...tooth, sites: newSites };
    });
    setTeeth(updated);
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      {/* Sub-module Navigation Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-2.5 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
          <button
            onClick={() => setActiveSubModule('bop')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition cursor-pointer ${
              activeSubModule === 'bop'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Droplet className="w-4 h-4 text-rose-300" />
            BOP 3D 6-Site Mapping
          </button>

          <button
            onClick={() => setActiveSubModule('mobility')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition cursor-pointer ${
              activeSubModule === 'mobility'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <MoveHorizontal className="w-4 h-4 text-blue-300" />
            Miller 3D Mobility Physics
          </button>

          <button
            onClick={() => setActiveSubModule('furcation')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition cursor-pointer ${
              activeSubModule === 'furcation'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Split className="w-4 h-4 text-purple-300" />
            3D Nabers Furcation (Grades I–IV)
          </button>

          <button
            onClick={() => setActiveSubModule('plaque')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition cursor-pointer ${
              activeSubModule === 'plaque'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-300" />
            3D 4-Surface Plaque Index
          </button>

          <button
            onClick={() => setActiveSubModule('panoramic')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition cursor-pointer ${
              activeSubModule === 'panoramic'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4 text-cyan-300" />
            Interactive Panoramic (OPG)
          </button>
        </div>

        <div className="text-xs font-mono text-slate-400 pr-2 hidden sm:block">
          Iraqi Dental Board Diagnostic Suite
        </div>
      </div>

      {/* 1. BOP 3D 6-SITE MAPPING WITH 3D TOOTH VIEWER */}
      {activeSubModule === 'bop' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 3D Visual Tooth Viewer for Selected Tooth (2 Columns) */}
            <div className="lg:col-span-2 space-y-4">
              <ThreeBopViewer
                tooth={teeth[selectedBopToothIdx]}
                onToggleSite={toggleSiteBleedingById}
              />

              {/* Tooth Selector Tabs */}
              <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                  Select Tooth to View in 3D:
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {teeth.map((t, idx) => {
                    const bleedCount = t.sites.filter((s) => s.bleeding).length;
                    return (
                      <button
                        key={t.fdi}
                        onClick={() => setSelectedBopToothIdx(idx)}
                        className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                          selectedBopToothIdx === idx
                            ? 'bg-rose-950/80 border-rose-500 text-white shadow-lg'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="font-mono font-bold text-xs">#{t.fdi}</div>
                        <div className="text-[10px] text-rose-400 font-mono">
                          {bleedCount} / 6 BOP
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Diagnostic Readout & Presets (1 Column) */}
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-2xl flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-rose-400" />
                    BOP Diagnostic Scorecard
                  </h3>
                </div>

                {/* Score Widget */}
                <div className={`p-4 rounded-2xl border text-center space-y-2 ${bopCategory.bgColor}`}>
                  <div className="text-xs text-slate-300 font-medium">Full Mouth BOP Score</div>
                  <div className={`text-4xl font-black font-mono ${bopCategory.color}`}>
                    {bopPercentage}%
                  </div>
                  <div className="text-xs text-slate-400">
                    {bleedingSites} bleeding sites out of {totalSites} sites
                  </div>
                  <div className={`text-xs font-bold px-3 py-1 rounded-full inline-block ${bopCategory.color} bg-slate-900/60 border border-slate-700`}>
                    {bopCategory.status}
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-xs font-semibold text-slate-300">Load Educational Preset:</span>
                  <div className="grid grid-cols-3 gap-1.5 text-xs">
                    <button
                      onClick={() => loadPresetBop('healthy')}
                      className="py-1.5 px-2 bg-emerald-950 border border-emerald-700 text-emerald-300 rounded-xl hover:bg-emerald-900 transition"
                    >
                      &lt;10% Health
                    </button>
                    <button
                      onClick={() => loadPresetBop('localized')}
                      className="py-1.5 px-2 bg-amber-950 border border-amber-700 text-amber-300 rounded-xl hover:bg-amber-900 transition"
                    >
                      10-30% Local
                    </button>
                    <button
                      onClick={() => loadPresetBop('generalized')}
                      className="py-1.5 px-2 bg-rose-950 border border-rose-700 text-rose-300 rounded-xl hover:bg-rose-900 transition"
                    >
                      &gt;30% General
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-blue-950/40 p-3.5 rounded-2xl border border-blue-800/40 text-[11px] text-blue-200 space-y-1">
                <span className="font-bold text-white flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  Clinical Rule:
                </span>
                <p className="leading-relaxed">
                  "Presence of BOP indicates current gingival inflammation, but <strong>absence of BOP is an excellent predictor (~98%) of periodontal stability</strong>."
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MILLER TOOTH MOBILITY 3D PHYSICS SIMULATOR */}
      {activeSubModule === 'mobility' && <ThreeMobilitySimulator />}

      {/* 3. GLICKMAN FURCATION INVOLVEMENT 3D NABERS PROBE SIMULATOR */}
      {activeSubModule === 'furcation' && <ThreeFurcationSimulator />}

      {/* 4. 4-SURFACE PLAQUE INDEX 3D TOOTH INSPECTION */}
      {activeSubModule === 'plaque' && (
        <ThreePlaqueViewer
          teeth={teeth}
          selectedToothIdx={selectedBopToothIdx}
          onSelectToothIdx={setSelectedBopToothIdx}
          onToggleSurface={togglePlaqueSurface}
        />
      )}

      {/* 5. PANORAMIC RADIOGRAPH (OPG) CORRELATOR */}
      {activeSubModule === 'panoramic' && (
        <InteractivePanoramicCorrelator onLoadInto3DSandbox={onLoadDefectToSandbox} />
      )}
    </div>
  );
};
