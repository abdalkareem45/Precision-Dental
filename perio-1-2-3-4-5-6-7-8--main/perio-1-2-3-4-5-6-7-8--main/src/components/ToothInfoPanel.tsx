import React, { useState } from 'react';
import { PermanentToothData, AnatomicalLandmark } from '../data/permanentTeethData';
import {
  FileText,
  Calendar,
  Layers,
  MapPin,
  CheckCircle2,
  Stethoscope,
  ChevronRight,
  Eye,
  AlertTriangle,
  Compass,
  Activity,
  Award
} from 'lucide-react';

interface ToothInfoPanelProps {
  tooth: PermanentToothData;
  onSelectLandmark: (landmark: AnatomicalLandmark) => void;
  activeLandmarkId?: string;
}

export const ToothInfoPanel: React.FC<ToothInfoPanelProps> = ({
  tooth,
  onSelectLandmark,
  activeLandmarkId
}) => {
  const [activeSection, setActiveSection] = useState<'all' | 'morphology' | 'landmarks' | 'clinical'>('all');

  return (
    <div className="flex flex-col h-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-slate-200 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-300">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Anatomical &amp; Clinical Dossier</h2>
            <p className="text-[11px] text-slate-400">Wheeler's Dental Anatomy &amp; EFP Standards</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-950 text-cyan-300 border border-blue-800">
            FDI #{tooth.fdi}
          </span>
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
            Univ #{tooth.universal}
          </span>
        </div>
      </div>

      {/* Filter / Quick Jump Navigation */}
      <div className="flex items-center gap-1 mt-2.5 pb-1 border-b border-slate-800/80 overflow-x-auto custom-scrollbar shrink-0 text-[11px]">
        {(
          [
            { id: 'all', label: 'All Details' },
            { id: 'morphology', label: 'Morphology' },
            { id: 'landmarks', label: `Landmarks (${tooth.landmarks.length})` },
            { id: 'clinical', label: 'Clinical & Endo' }
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition ${
              activeSection === tab.id
                ? 'bg-blue-600/30 text-cyan-300 border border-blue-500/50 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Scrollable Information Body */}
      <div className="flex-1 overflow-y-auto mt-2.5 pr-1 space-y-3 custom-scrollbar text-xs">
        {/* Core Taxonomic Identity Card */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Official Nomenclature:</span>
            <span className="font-bold text-white text-right">{tooth.name}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80 text-[11px]">
            <div>
              <span className="text-slate-400 block">FDI Notation:</span>
              <strong className="text-cyan-400 font-mono text-sm">#{tooth.fdi}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Universal System:</span>
              <strong className="text-indigo-400 font-mono text-sm">#{tooth.universal}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Arch:</span>
              <strong className="text-white">{tooth.arch} Arch</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Side &amp; Quadrant:</span>
              <strong className="text-white">{tooth.side} ({tooth.quadrantName})</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Classification:</span>
              <strong className="text-amber-400">{tooth.category} ({tooth.subCategory})</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Eruption Timeline:</span>
              <strong className="text-emerald-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {tooth.eruptionAge}
              </strong>
            </div>
          </div>
        </div>

        {/* Anatomical Dimensions */}
        {(activeSection === 'all' || activeSection === 'morphology') && (
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1.5">
            <span className="font-bold text-cyan-300 text-[11px] block uppercase tracking-wider">
              Average Dimensions (mm)
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-1 font-mono">
              <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Crown Length</span>
                <span className="font-bold text-white text-xs">{tooth.crownDimensions.lengthMm} mm</span>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Root Length</span>
                <span className="font-bold text-amber-400 text-xs">{tooth.crownDimensions.rootLengthMm} mm</span>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Mesiodistal</span>
                <span className="font-bold text-white text-xs">{tooth.crownDimensions.mesiodistalMm} mm</span>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Buccolingual</span>
                <span className="font-bold text-white text-xs">{tooth.crownDimensions.buccolingualMm} mm</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Identifying Features (Exam Keys) */}
        {(activeSection === 'all' || activeSection === 'morphology') && (
          <div className="bg-slate-950/70 p-3 rounded-xl border border-blue-900/40 space-y-2">
            <span className="font-bold text-cyan-300 text-[11px] block flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Key Identifying Features (Board High-Yield)
            </span>
            <ul className="space-y-1.5 pl-0.5">
              {tooth.identifyingFeatures.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[11px] text-slate-300 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Crown & Root Morphology Details */}
        {(activeSection === 'all' || activeSection === 'morphology') && (
          <div className="space-y-2.5">
            {/* Crown Characteristics */}
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="font-bold text-white text-[11px] block flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" /> Crown Morphology
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {tooth.crownMorphology}
              </p>
            </div>

            {/* Root Characteristics */}
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="font-bold text-white text-[11px] block flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" /> Root Morphology &amp; Apical Curvature
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {tooth.rootMorphology}
              </p>
              <div className="pt-1 text-[10px] text-slate-400 font-mono flex items-center gap-3">
                <span>Roots: <strong className="text-white">{tooth.expectedRoots}</strong></span>
                <span>•</span>
                <span>Canals: <strong className="text-red-400">{tooth.expectedCanals}</strong></span>
                <span>•</span>
                <span>Vertucci: <strong className="text-cyan-300">{tooth.vertucciClass}</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* Main Anatomical Landmarks (Click to focus in 3D) */}
        {(activeSection === 'all' || activeSection === 'landmarks') && (
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-[11px] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Anatomical Landmarks ({tooth.landmarks.length})
              </span>
              <span className="text-[10px] text-slate-500">Click to focus in 3D</span>
            </div>

            <div className="space-y-1">
              {tooth.landmarks.map((landmark) => {
                const isSelected = activeLandmarkId === landmark.id;
                return (
                  <button
                    key={landmark.id}
                    onClick={() => onSelectLandmark(landmark)}
                    className={`w-full text-left p-2 rounded-lg flex items-center justify-between transition ${
                      isSelected
                        ? 'bg-cyan-600/30 border border-cyan-400 text-white font-semibold'
                        : 'bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          landmark.category === 'crown'
                            ? 'bg-cyan-400'
                            : landmark.category === 'root'
                            ? 'bg-amber-400'
                            : landmark.category === 'internal'
                            ? 'bg-red-400'
                            : 'bg-emerald-400'
                        }`}
                      />
                      <span className="text-[11px]">{landmark.name}</span>
                    </div>
                    <Eye className="w-3 h-3 text-slate-400 hover:text-white" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Endodontic Canal Systems & Variations */}
        {(activeSection === 'all' || activeSection === 'clinical') && (
          <div className="bg-gradient-to-r from-red-950/40 via-slate-950 to-slate-950 p-3 rounded-xl border border-red-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-red-300 text-[11px] flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-red-400" />
                Endodontic Canal Anatomy &amp; Classification
              </span>
              <span className="font-mono text-[10px] bg-red-950 text-red-300 px-1.5 py-0.5 rounded border border-red-800">
                Vertucci {tooth.vertucciClass}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-red-900/30">
              <div>
                <span className="text-slate-400 block text-[10px]">Expected Roots:</span>
                <span className="font-bold text-white">{tooth.expectedRoots} Root{tooth.expectedRoots > 1 ? 's' : ''}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Expected Canals:</span>
                <span className="font-bold text-red-300">{tooth.expectedCanals}</span>
              </div>
            </div>

            {/* Anatomical Variations */}
            <div className="pt-1.5">
              <span className="text-[10px] text-amber-300 font-bold block mb-1">
                Recognized Anatomical Variations:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {tooth.anatomicalVariations.map((v, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-amber-950/50 border border-amber-800/60 text-amber-200 text-[10px]"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Clinical Relevance Pillars across Specialties */}
        {(activeSection === 'all' || activeSection === 'clinical') && (
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-amber-300 text-[11px] block flex items-center gap-1.5 uppercase tracking-wider">
              <Stethoscope className="w-3.5 h-3.5 text-amber-400" /> Clinical Considerations
            </span>

            <div className="space-y-2 text-[11px]">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <strong className="text-red-400 block">Endodontics:</strong>
                <p className="text-slate-300 leading-relaxed">{tooth.clinicalRelevance.endodontics}</p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <strong className="text-blue-400 block">Prosthodontics &amp; Restorative:</strong>
                <p className="text-slate-300 leading-relaxed">{tooth.clinicalRelevance.prosthodontics}</p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <strong className="text-emerald-400 block">Periodontics:</strong>
                <p className="text-slate-300 leading-relaxed">{tooth.clinicalRelevance.periodontics}</p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <strong className="text-amber-400 block">Oral Surgery &amp; Exodontia:</strong>
                <p className="text-slate-300 leading-relaxed">{tooth.clinicalRelevance.surgery}</p>
              </div>
            </div>
          </div>
        )}

        {/* Academic Educational Disclaimer */}
        <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60 text-[10px] text-slate-500 leading-relaxed">
          <strong>Academic Note:</strong> This laboratory dossier is calibrated for fifth-year dental students as a preclinical morphology guide. It does not substitute clinical radiographic examination, cone-beam CT (CBCT), or clinical diagnosis.
        </div>
      </div>
    </div>
  );
};
