/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  HelpCircle, 
  MapPin, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  ExternalLink,
  Target,
  Compass,
  Search,
  Stethoscope
} from 'lucide-react';

export default function ReferredPainSandbox() {
  const [selectedOrigin, setSelectedOrigin] = useState<'mand_molar' | 'max_molar' | 'max_anterior' | 'mand_premolar'>('mand_molar');
  const [activeDiagnosticTest, setActiveDiagnosticTest] = useState<'cold' | 'percussion' | 'block' | 'palpation'>('cold');
  const [testResult, setTestResult] = useState<string | null>(null);

  const performTest = () => {
    if (activeDiagnosticTest === 'cold') {
      if (selectedOrigin === 'mand_molar') {
        setTestResult('Cold test on lower molar triggers lingering sharp pain radiating into the ear! Opposing teeth test normal.');
      } else if (selectedOrigin === 'max_molar') {
        setTestResult('Cold test on upper 1st molar reproduces diffuse facial and sinus pain!');
      } else {
        setTestResult('Cold test pinpoints localized pulpal hyper-responsiveness in the offending tooth.');
      }
    } else if (activeDiagnosticTest === 'percussion') {
      setTestResult('Mild tender to percussion confirms apical periodontal ligament inflammation on the primary culprit tooth.');
    } else if (activeDiagnosticTest === 'block') {
      if (selectedOrigin === 'mand_molar') {
        setTestResult('Diagnostic IAN block completely abolishes the earache! Confirms mandibular tooth as the true etiology.');
      } else {
        setTestResult('Selective infiltration abolishes regional pain, confirming the primary odontogenic source.');
      }
    } else {
      setTestResult('Palpation reveals localized apical tenderness without swelling.');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Module Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-3 bg-purple-100 rounded-xl text-purple-700">
            <HelpCircle className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D97706]">Module 5</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1E293B]">Dental & Referred Pain Diagnostics</h2>
          </div>
        </div>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Most dental pain can be traced directly to its source. However, sensory afferents from different trigeminal divisions converge onto common second-order neurons in the subnucleus caudalis, producing <strong className="text-purple-700">referred pain</strong> across the opposite jaw, ear, eye, or sinus.
        </p>
      </div>

      {/* SANDBOX 1: TRIGEMINAL CONVERGENCE & REFERRED PAIN ANATOMICAL MAP */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-[#1E293B]">Trigeminal Convergence & Referred Pain Map Sandbox</h3>
            <p className="text-xs text-slate-500 mt-0.5">Select a primary odontogenic pain source to trace ipsilateral referral pathways across the craniofacial complex</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'mand_molar', label: 'Mandibular Molar' },
              { id: 'max_molar', label: 'Maxillary Molar' },
              { id: 'max_anterior', label: 'Maxillary Anterior' },
              { id: 'mand_premolar', label: 'Mandibular Premolar' }
            ].map(o => (
              <button
                key={o.id}
                onClick={() => {
                  setSelectedOrigin(o.id as typeof selectedOrigin);
                  setTestResult(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedOrigin === o.id 
                    ? 'bg-[#1E293B] text-white shadow ring-1 ring-purple-500' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Interactive Craniofacial Neural Map Canvas */}
          <div className="lg:col-span-7 bg-slate-950 rounded-2xl p-6 text-white min-h-85 flex flex-col justify-between shadow-inner">
            <div className="flex flex-wrap justify-between items-center gap-2 text-xs font-mono text-slate-400">
              <span>CRANIOFACIAL PROJECTION</span>
              <span className="text-purple-400 font-bold">Midline Boundary Intact (Ipsilateral)</span>
            </div>

            {/* SVG Craniofacial & Neural Convergence Map */}
            <div className="relative my-3 flex justify-center">
              <svg className="w-full h-52" viewBox="0 0 360 190">
                {/* Facial Profile Outline */}
                <path 
                  d="M130,20 Q180,15 220,40 Q250,70 240,100 L260,110 Q250,130 230,135 L235,150 Q210,180 160,180 L130,175 Q110,140 100,90 Z" 
                  fill="#0F172A" 
                  stroke="#334155" 
                  strokeWidth="2" 
                />

                {/* Trigeminal Ganglion Core */}
                <circle cx="150" cy="80" r="10" fill="#7C3AED" className="animate-pulse" />
                <text x="135" y="65" fill="#C4B5FD" fontSize="9" fontWeight="bold">Trigeminal Ganglion</text>

                {/* V1 Branch to Eye/Forehead */}
                <path d="M150,80 Q190,60 215,50" stroke="#A78BFA" strokeWidth="2.5" fill="none" strokeDasharray="3,2" />
                <circle cx="215" cy="50" r="6" fill={selectedOrigin === 'max_anterior' ? '#EF4444' : '#64748B'} />
                <text x="225" y="52" fill="#E2E8F0" fontSize="9">Periorbital / Forehead (V1)</text>

                {/* V2 Branch to Maxillary Teeth & Sinus */}
                <path d="M150,80 Q185,95 210,115" stroke="#A78BFA" strokeWidth="2.5" fill="none" />
                <circle cx="210" cy="115" r="7" fill={selectedOrigin === 'max_molar' ? '#EF4444' : '#64748B'} />
                <text x="220" y="118" fill="#E2E8F0" fontSize="9">Maxillary Arch / Sinus (V2)</text>

                {/* V3 Branch to Mandibular Teeth & Auriculotemporal */}
                <path d="M150,80 Q170,120 185,155" stroke="#A78BFA" strokeWidth="2.5" fill="none" />
                <circle cx="185" cy="155" r="7" fill={selectedOrigin === 'mand_molar' || selectedOrigin === 'mand_premolar' ? '#EF4444' : '#64748B'} />
                <text x="195" y="158" fill="#E2E8F0" fontSize="9">Mandibular Arch (V3)</text>

                {/* Ear (Auriculotemporal referral target) */}
                <path d="M150,80 Q120,80 115,85" stroke="#F43F5E" strokeWidth="2.5" fill="none" strokeDasharray={selectedOrigin === 'mand_molar' ? 'none' : '3,3'} />
                <circle cx="115" cy="85" r="7" fill={selectedOrigin === 'mand_molar' ? '#F43F5E' : '#475569'} className={selectedOrigin === 'mand_molar' ? 'animate-ping' : ''} />
                <circle cx="115" cy="85" r="5" fill="#F43F5E" />
                <text x="75" y="90" fill="#FDA4AF" fontSize="9" fontWeight="bold">Ear (Otalgia)</text>

                {/* Dynamic Referral Arrow */}
                {selectedOrigin === 'mand_molar' && (
                  <path d="M185,155 Q130,135 118,92" stroke="#F43F5E" strokeWidth="2.5" fill="none" strokeDasharray="4,2" />
                )}
                {selectedOrigin === 'max_molar' && (
                  <path d="M210,115 Q230,90 220,60" stroke="#F43F5E" strokeWidth="2.5" fill="none" strokeDasharray="4,2" />
                )}
              </svg>
            </div>

            {/* Projection Rationale Bar */}
            <div className="text-xs text-purple-200 bg-purple-950/70 border border-purple-800/50 p-3 rounded-xl">
              <strong>Clinical Referral Pattern:</strong>{' '}
              {selectedOrigin === 'mand_molar' && 'Mandibular molars frequently refer pain to the ear (otalgia via auriculotemporal nerve) and opposing maxillary quadrant. Never crosses midline!'}
              {selectedOrigin === 'max_molar' && 'Maxillary posterior pulpitis frequently mimics acute maxillary sinusitis or temporal headaches.'}
              {selectedOrigin === 'max_anterior' && 'Maxillary incisors and canines can refer pain superiorly into the periorbital and forehead regions (V1 dermatome).'}
              {selectedOrigin === 'mand_premolar' && 'Mandibular premolars can refer to the mental foramen area, lower border of the mandible, or maxillary premolars.'}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">Anatomical Rules</span>
              <h4 className="text-base font-bold text-slate-900 mt-0.5">Rules of Referred Odontogenic Pain</h4>
              <ul className="text-xs text-slate-600 mt-2 space-y-2 leading-relaxed list-disc list-inside">
                <li><strong>Strictly Ipsilateral:</strong> Referred dental pain never crosses the sagittal midline.</li>
                <li><strong>Cross-Arch Referral:</strong> Posterior teeth frequently refer to the opposing jaw on the exact same side (maxillary ↔ mandibular).</li>
                <li><strong>Non-Dental Anatomy:</strong> Pain may manifest in the ear, temple, sinus, or neck, leading patients to visit ENT or neurologists first.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* SANDBOX 2: DIFFERENTIAL DIAGNOSTIC ISOLATION BENCH */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-[#1E293B]">Differential Diagnostic Isolation Bench</h3>
          <p className="text-xs text-slate-500 mt-0.5">Apply diagnostic modalities to isolate the true culprit tooth and rule out non-odontogenic pain. Findings are scripted educational examples, not patient-specific diagnostic conclusions.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-6 text-white space-y-5 shadow-inner">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-slate-400">Diagnostic Instrument Tray</span>
              <span className="text-xs text-amber-400 font-bold">Selective Testing</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'cold', label: 'Endo-Ice Cold' },
                { id: 'percussion', label: 'Percussion Test' },
                { id: 'block', label: 'Selective Block' },
                { id: 'palpation', label: 'Apical Palpation' }
              ].map(d => (
                <button
                  key={d.id}
                  onClick={() => {
                    setActiveDiagnosticTest(d.id as typeof activeDiagnosticTest);
                    setTestResult(null);
                  }}
                  className={`p-2.5 rounded-xl text-xs font-bold transition text-center ${
                    activeDiagnosticTest === d.id ? 'bg-purple-600 text-white shadow' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            <button
              onClick={performTest}
              className="w-full py-2.5 rounded-xl bg-[#0284C7] text-white text-xs font-bold hover:bg-sky-600 transition shadow flex items-center justify-center space-x-2"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Apply {activeDiagnosticTest.toUpperCase()} to Suspected Teeth</span>
            </button>

            {testResult && (
              <div className="p-4 rounded-xl bg-purple-950/80 border border-purple-500/60 text-xs text-purple-200 flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Diagnostic Finding:</strong>
                  <p className="mt-1 leading-relaxed">{testResult}</p>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200 text-purple-950 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-800">Lecture Citation & Video</span>
              <h4 className="font-bold text-sm">References (Prof. Anas Faleh Mahdi)</h4>
              <ul className="text-xs text-slate-700 space-y-1.5 leading-relaxed">
                <li>1. Berman L H, Hargreaves K M. <em>Cohen’s Pathways of the Pulp</em>. 12th ed. 2021.</li>
                <li>2. Garg N, Garg A. <em>Textbook of Endodontics</em>. 4th ed. 2019.</li>
                <li>3. Samir et al. (2023). <em>Int J Clin Pediatr Dent</em>; 16(4): 639–644.</li>
              </ul>
              <a 
                href="https://youtu.be/oa6rvUJlg7o?si=ZwEV5M0iwaxi5PUN"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 mt-2"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Lecture Video on YouTube</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
