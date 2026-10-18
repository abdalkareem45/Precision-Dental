import React, { useState } from 'react';
import { Layers, Activity, Eye, ArrowRight, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { BoneDefectType } from './MultiToothSandbox';

interface OpgSiteData {
  id: string;
  toothNumber: string;
  name: string;
  quadrant: string;
  rblPercent: number;
  rblDepth: 'Coronal Third (<15%)' | 'Coronal Third (15%-33%)' | 'Middle Third' | 'Apical Third' | 'Intact Alveolar Crest';
  stage: 'Stage I' | 'Stage II' | 'Stage III' | 'Stage IV' | 'Health / Gingivitis';
  calMm: number;
  boneDefectType: BoneDefectType;
  boneLossAgeRatio: number;
  grade: 'Grade A' | 'Grade B' | 'Grade C' | 'N/A';
  xRayAppearance: string;
  clinicalSignificance: string;
  hotspotPos: { top: string; left: string };
}

interface InteractivePanoramicCorrelatorProps {
  onLoadInto3DSandbox?: (defect: BoneDefectType) => void;
}

export const InteractivePanoramicCorrelator: React.FC<InteractivePanoramicCorrelatorProps> = ({
  onLoadInto3DSandbox
}) => {
  const sites: OpgSiteData[] = [
    {
      id: 'site-16',
      toothNumber: '#16',
      name: 'Maxillary Right 1st Molar',
      quadrant: 'Upper Right (Q1)',
      rblPercent: 42,
      rblDepth: 'Middle Third',
      stage: 'Stage III',
      calMm: 6.0,
      boneDefectType: 'moderate_horizontal',
      boneLossAgeRatio: 0.88,
      grade: 'Grade B',
      xRayAppearance: 'Horizontal bone resorption extending to middle third of mesial and distal roots. Blunting of alveolar crest.',
      clinicalSignificance: 'Interproximal CAL ≥5mm and bone loss into middle third defines Stage III periodontitis.',
      hotspotPos: { top: '38%', left: '22%' }
    },
    {
      id: 'site-11',
      toothNumber: '#11',
      name: 'Maxillary Right Central Incisor',
      quadrant: 'Upper Anterior',
      rblPercent: 26,
      rblDepth: 'Coronal Third (15%-33%)',
      stage: 'Stage II',
      calMm: 4.0,
      boneDefectType: 'mild_horizontal',
      boneLossAgeRatio: 0.54,
      grade: 'Grade B',
      xRayAppearance: 'Crestal lamina dura loss, bone level 3mm apical to CEJ confined to coronal third.',
      clinicalSignificance: 'Coronal third bone loss (15%-33%) with CAL 3-4mm without tooth loss qualifies as Stage II.',
      hotspotPos: { top: '32%', left: '46%' }
    },
    {
      id: 'site-26',
      toothNumber: '#26',
      name: 'Maxillary Left 1st Molar',
      quadrant: 'Upper Left (Q2)',
      rblPercent: 12,
      rblDepth: 'Coronal Third (<15%)',
      stage: 'Stage I',
      calMm: 2.0,
      boneDefectType: 'mild_horizontal',
      boneLossAgeRatio: 0.24,
      grade: 'Grade A',
      xRayAppearance: 'Mild crestal radiolucency <15% of root length, intact interdental septa.',
      clinicalSignificance: 'Initial/mild periodontitis with <15% RBL and CAL 1-2mm.',
      hotspotPos: { top: '38%', left: '76%' }
    },
    {
      id: 'site-36',
      toothNumber: '#36',
      name: 'Mandibular Left 1st Molar',
      quadrant: 'Lower Left (Q3)',
      rblPercent: 58,
      rblDepth: 'Apical Third',
      stage: 'Stage IV',
      calMm: 8.5,
      boneDefectType: 'severe_horizontal',
      boneLossAgeRatio: 1.25,
      grade: 'Grade C',
      xRayAppearance: 'Severe angular vertical defect on mesial root extending into apical third. Deep infrabony crater.',
      clinicalSignificance: 'Severe bone loss to apical third, RBL/age ratio >1.0 indicative of rapid progression (Grade C).',
      hotspotPos: { top: '68%', left: '78%' }
    },
    {
      id: 'site-31',
      toothNumber: '#31',
      name: 'Mandibular Left Central Incisor',
      quadrant: 'Lower Anterior',
      rblPercent: 0,
      rblDepth: 'Intact Alveolar Crest',
      stage: 'Health / Gingivitis',
      calMm: 0,
      boneDefectType: 'healthy',
      boneLossAgeRatio: 0,
      grade: 'N/A',
      xRayAppearance: 'Sharp, well-corticated crestal lamina dura 1.5mm apical to CEJ.',
      clinicalSignificance: 'Intact periodontium; no radiographic bone loss.',
      hotspotPos: { top: '65%', left: '52%' }
    },
    {
      id: 'site-46',
      toothNumber: '#46',
      name: 'Mandibular Right 1st Molar',
      quadrant: 'Lower Right (Q4)',
      rblPercent: 48,
      rblDepth: 'Middle Third',
      stage: 'Stage III',
      calMm: 6.5,
      boneDefectType: 'furcation_class2',
      boneLossAgeRatio: 0.96,
      grade: 'Grade B',
      xRayAppearance: 'Triangular radiolucency in furcation fornix indicating Grade II furcation invasion. Interproximal bone loss.',
      clinicalSignificance: 'Furcation involvement Grade II/III adds complexity, elevating staging to Stage III.',
      hotspotPos: { top: '68%', left: '20%' }
    }
  ];

  const [selectedSiteId, setSelectedSiteId] = useState<string>('site-36');
  const activeSite = sites.find((s) => s.id === selectedSiteId) || sites[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
      {/* Interactive Simulated Panoramic X-Ray Display (2 Columns) */}
      <div className="lg:col-span-2 bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-2xl flex flex-col justify-between space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              Simulated Dental Panoramic Tomogram (OPG)
            </h3>
            <p className="text-xs text-slate-400">
              Click any hotspot on the radiograph to correlate radiographic bone loss with periodontal staging.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-300 bg-cyan-950 px-2.5 py-1 rounded-lg border border-cyan-800">
            J. Clin. Med. 2020 Standard
          </span>
        </div>

        {/* Realistic Simulated Panoramic Radiograph Graphic */}
        <div className="relative w-full h-[320px] bg-slate-950 rounded-2xl border-2 border-slate-800 overflow-hidden shadow-inner flex flex-col justify-between p-4 select-none">
          {/* Panoramic Film Background with Anatomical Arches & Radiopaque Contours */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-700 via-slate-950 to-black pointer-events-none"></div>

          {/* Maxillary & Mandibular Curvature Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" viewBox="0 0 800 320">
            {/* Maxillary Arch Curve */}
            <path d="M 120 130 Q 400 90 680 130" stroke="#94a3b8" strokeWidth="3" fill="none" strokeDasharray="6,6" />
            {/* Occlusal Plane Curve of Spee */}
            <path d="M 100 170 Q 400 160 700 170" stroke="#38bdf8" strokeWidth="2" fill="none" />
            {/* Mandibular Arch Curve */}
            <path d="M 120 210 Q 400 240 680 210" stroke="#94a3b8" strokeWidth="3" fill="none" strokeDasharray="6,6" />
            {/* Maxillary Sinuses */}
            <ellipse cx="230" cy="115" rx="75" ry="35" fill="none" stroke="#64748b" strokeWidth="2" />
            <ellipse cx="570" cy="115" rx="75" ry="35" fill="none" stroke="#64748b" strokeWidth="2" />
          </svg>

          {/* Top Film Header */}
          <div className="relative z-10 flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase tracking-widest border-b border-slate-800/80 pb-1.5">
            <span>R (PATIENT RIGHT)</span>
            <span>DIGITAL OPG • 70 kVp / 10 mA • ALVEOLAR BONE MAPPING</span>
            <span>L (PATIENT LEFT)</span>
          </div>

          {/* Hotspots Positioned Anatomically */}
          <div className="relative z-10 flex-1 my-auto">
            {sites.map((site) => {
              const isSelected = selectedSiteId === site.id;
              return (
                <button
                  key={site.id}
                  onClick={() => setSelectedSiteId(site.id)}
                  style={{ top: site.hotspotPos.top, left: site.hotspotPos.left }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-2xl border transition flex flex-col items-center gap-0.5 cursor-pointer shadow-xl ${
                    isSelected
                      ? 'bg-cyan-600/90 border-cyan-300 ring-4 ring-cyan-500/40 scale-110 z-20'
                      : 'bg-slate-900/80 border-slate-700 hover:bg-slate-800 hover:scale-105 z-10'
                  }`}
                >
                  <span className="font-mono font-black text-xs text-white">{site.toothNumber}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                    site.stage === 'Stage IV' ? 'bg-rose-950 text-rose-300' :
                    site.stage === 'Stage III' ? 'bg-amber-950 text-amber-300' :
                    site.stage === 'Stage II' ? 'bg-orange-950 text-orange-300' :
                    site.stage === 'Stage I' ? 'bg-blue-950 text-blue-300' : 'bg-emerald-950 text-emerald-300'
                  }`}>
                    {site.stage}
                  </span>
                  <span className="text-[8px] text-slate-400 font-mono">{site.rblPercent}% RBL</span>
                </button>
              );
            })}
          </div>

          {/* Bottom Film Legend */}
          <div className="relative z-10 flex justify-between items-center text-[10px] text-slate-500 font-mono pt-1.5 border-t border-slate-800/80">
            <span>RBL % = (Bone loss distance from CEJ / Total root length) × 100</span>
            <span className="text-cyan-400 font-semibold">Click any tooth marker to inspect correlation</span>
          </div>
        </div>

        {/* Selected Radiographic Finding Overview */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-bold text-white text-sm">
              {activeSite.name} ({activeSite.toothNumber})
            </span>
            <span className="text-[11px] font-mono text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {activeSite.quadrant}
            </span>
          </div>

          <div className="text-slate-300 leading-relaxed text-[11px]">
            <strong className="text-slate-200">Radiographic Appearance:</strong> {activeSite.xRayAppearance}
          </div>

          <div className="text-cyan-300 leading-relaxed text-[11px]">
            <strong className="text-cyan-200">Clinical Correlation:</strong> {activeSite.clinicalSignificance}
          </div>
        </div>
      </div>

      {/* Right Column: Staging Correlation & 3D Synchronization Card */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-2xl flex flex-col justify-between space-y-5">
        <div className="space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Radiographic Staging Correlation
            </h4>
            <p className="text-xs text-slate-400">
              Direct mapping from 2D X-ray to 2018 World Workshop staging.
            </p>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <div className="text-[10px] text-slate-400">Bone Loss Depth</div>
              <div className="text-base font-black text-cyan-400 font-mono mt-0.5">
                {activeSite.rblPercent}%
              </div>
              <div className="text-[9px] text-slate-500">{activeSite.rblDepth}</div>
            </div>

            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <div className="text-[10px] text-slate-400">Disease Severity</div>
              <div className="text-base font-black text-amber-400 font-mono mt-0.5">
                {activeSite.stage}
              </div>
              <div className="text-[9px] text-slate-500">CAL {activeSite.calMm} mm</div>
            </div>
          </div>

          {/* Bone loss / Age ratio card */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-white">RBL / Age Progression Rate:</span>
              <span className="font-mono text-cyan-400 font-bold">
                {activeSite.boneLossAgeRatio > 0 ? activeSite.boneLossAgeRatio : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-400">
              <span>Implied Grade:</span>
              <span className="font-mono font-bold text-rose-400">{activeSite.grade}</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-900">
              &lt;0.25 (Grade A) • 0.25–1.0 (Grade B) • &gt;1.0 (Grade C)
            </div>
          </div>
        </div>

        {/* Action: Sync into 3D Sandbox */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <button
            onClick={() => onLoadInto3DSandbox && onLoadInto3DSandbox(activeSite.boneDefectType)}
            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>Load Defect into 3D Sandbox</span>
          </button>
        </div>
      </div>
    </div>
  );
};
