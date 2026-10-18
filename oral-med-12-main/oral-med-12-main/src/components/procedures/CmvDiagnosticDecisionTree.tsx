import React, { useState } from 'react';
import { GitBranch, CheckCircle2, AlertTriangle, Microscope, Dna, ShieldAlert, Sparkles, Activity } from 'lucide-react';

export const CmvDiagnosticDecisionTree: React.FC = () => {
  const [patientStatus, setPatientStatus] = useState<'aids' | 'transplant' | 'immunocompetent'>('aids');
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<'biopsy' | 'qpcr' | 'culture' | 'coinfection'>('biopsy');
  const [hasCoinfectionCheck, setHasCoinfectionCheck] = useState<boolean>(true);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-teal-400 font-semibold mb-1">
            <GitBranch className="w-4 h-4" />
            <span>CMV Clinical Diagnostic Decision Tree & Co-Infection Radar</span>
            <span>·</span>
            <span>Slide 4</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            CMV Diagnostic Workup & Branching Clinical Algorithm
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Branching flowchart from initial presentation of persistent oral ulceration through histopathology, qPCR, and co-infection screening.
          </p>
        </div>

        {/* Patient Demographic Selector */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-500 font-mono text-[10px] px-1">Host Status:</span>
          {[
            { id: 'aids', label: 'AIDS (CD4 <50)' },
            { id: 'transplant', label: 'Solid Organ Transplant' },
            { id: 'immunocompetent', label: 'Immunocompetent' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setPatientStatus(st.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                patientStatus === st.id ? 'bg-teal-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Decision Workup Nodes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {[
          { id: 'biopsy', label: '1. Incisional Biopsy', tag: 'Gold Standard Histology', icon: Microscope },
          { id: 'qpcr', label: '2. Real-Time qPCR', tag: 'Plasma & Tissue Viral Load', icon: Dna },
          { id: 'culture', label: '3. Shell Vial Culture', tag: 'Rapid Immunofluorescence', icon: Activity },
          { id: 'coinfection', label: '4. Co-Infection Screen', tag: '1/3 HSV/VZV Coinfected', icon: ShieldAlert },
        ].map((node) => {
          const isSelected = selectedDiagnostic === node.id;
          const Icon = node.icon;
          return (
            <button
              key={node.id}
              onClick={() => setSelectedDiagnostic(node.id as any)}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-850 border-teal-500 text-white shadow-lg ring-1 ring-teal-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Icon className="w-4 h-4 text-teal-400" />
                    <span>{node.label}</span>
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-400" />}
                </div>
                <span className="text-[11px] font-mono text-slate-400">{node.tag}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Diagnostic Station Display */}
      <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-4 text-xs">
        {selectedDiagnostic === 'biopsy' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="space-y-3">
              <span className="text-sm font-bold text-white block">Incisional Biopsy of Ulcer Base:</span>
              <p className="text-slate-300 leading-relaxed">
                Biopsy must sample the deep ulcer margin and vascular connective tissue bed, not just superficial slough.
              </p>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                <span className="font-bold text-teal-300 block">Microscopic Hallmark (Slide 4):</span>
                <p className="text-slate-200">
                  Cytomegalic endothelial cells enlarged 2–4 fold displaying large, basophilic intranuclear inclusion bodies surrounded by a clear halo ("owl's eye" appearance).
                </p>
              </div>
            </div>

            {/* SVG Biopsy Visual */}
            <div className="h-44 bg-slate-900 rounded-xl p-3 border border-slate-800 flex items-center justify-center">
              <svg viewBox="0 0 240 140" className="w-full h-full">
                <rect width="240" height="140" fill="#1e1b4b" opacity="0.3" rx="10" />
                <ellipse cx="120" cy="70" rx="45" ry="32" fill="#f43f5e" opacity="0.85" />
                <circle cx="120" cy="68" r="22" fill="none" stroke="#fbcfe8" strokeWidth="4" />
                <circle cx="120" cy="68" r="18" fill="#1e1b4b" />
                <circle cx="120" cy="68" r="10" fill="#4338ca" />
                <text x="120" y="125" fill="#fbcfe8" fontSize="10" fontWeight="bold" textAnchor="middle">
                  Owl's Eye Inclusion Confirmed
                </text>
              </svg>
            </div>
          </div>
        )}

        {selectedDiagnostic === 'qpcr' && (
          <div className="space-y-3">
            <span className="text-sm font-bold text-white block">Real-Time Quantitative PCR (qPCR):</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-400 block mb-1">Target Gene:</span>
                <strong className="text-white">UL83 (pp65) / UL54 (DNA Pol)</strong>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-400 block mb-1">Viral Copynumber:</span>
                <strong className="font-mono text-rose-400">
                  {patientStatus === 'aids' ? '124,000 copies/mL (High)' : patientStatus === 'transplant' ? '45,000 copies/mL (Active)' : '< 200 copies/mL (Latent)'}
                </strong>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-400 block mb-1">Clinical Indication:</span>
                <strong className="text-teal-300">Guides Antiviral Dosing & Response</strong>
              </div>
            </div>
          </div>
        )}

        {selectedDiagnostic === 'culture' && (
          <div className="space-y-2 text-slate-300">
            <span className="text-sm font-bold text-white block">Shell Vial Rapid Culture:</span>
            <p className="leading-relaxed">
              Standard viral culture is slow (requires 2–4 weeks); shell vial centrifugation enhances viral entry into human diploid fibroblasts, allowing early antigen (IEA pp72) detection within 24–48 hours by indirect immunofluorescence.
            </p>
          </div>
        )}

        {selectedDiagnostic === 'coinfection' && (
          <div className="p-4 bg-amber-950/40 rounded-xl border border-amber-800/80 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Critical Board Exam Alert: Co-Infection with HSV / VZV (Slide 4)</span>
            </div>
            <p className="text-amber-100/90 leading-relaxed text-xs">
              "Biopsy: look for coinfection; <strong>up to 1/3 of CMV oral ulcers</strong> are coinfected with HSV or VZV!"
            </p>
            <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 text-slate-200 text-xs">
              <span className="font-bold text-white block mb-1">Clinical Action Required:</span>
              If a persistent deep oral ulcer in an HIV/AIDS or transplant patient is diagnosed with CMV, always order multiplex PCR or dual IHC stains for Herpes Simplex Virus (HSV) and Varicella-Zoster Virus (VZV). Co-infected lesions require simultaneous coverage with Ganciclovir and Acyclovir/Valacyclovir.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
