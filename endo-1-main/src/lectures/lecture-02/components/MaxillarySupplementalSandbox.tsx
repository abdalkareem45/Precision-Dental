/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Syringe, 
  Clock, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Play, 
  RotateCcw,
  Sparkles,
  Gauge
} from 'lucide-react';

export default function MaxillarySupplementalSandbox() {
  // Sandbox 1: Infiltration timeline
  const [selectedToothGroup, setSelectedToothGroup] = useState<'anterior' | 'premolar' | 'molar'>('anterior');
  const [procedureTime, setProcedureTime] = useState<number>(20); // Minutes into procedure

  // Sandbox 2: Supplemental Technique
  const [suppTech, setSuppTech] = useState<'io' | 'pdl' | 'ip'>('io');
  const [ioStep, setIoStep] = useState<'drill' | 'inject'>('drill');

  // Use the upper end of the displayed 3–5 minute onset window.
  const isOnsetPending = procedureTime < 5;
  const maxDuration = selectedToothGroup === 'anterior' ? 30 : selectedToothGroup === 'premolar' ? 45 : 40;
  const pulpalRemaining = isOnsetPending ? 0 : Math.max(0, maxDuration - procedureTime);
  const isDeclined = procedureTime >= maxDuration;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Module Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-3 bg-amber-100 rounded-xl text-[#D97706]">
            <Syringe className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D97706]">Module 4</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1E293B]">Maxillary & Supplemental Injection Techniques</h2>
          </div>
        </div>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          The maxilla features thin, porous cortical bone allowing high infiltration success (87%–92% in 3–5 min), but pulpal duration is notoriously short. When standard techniques fail (e.g., mandibular hot teeth), supplemental techniques (PDL, Stabident IO, and Intrapulpal) are lifesaving adjuncts.
        </p>
      </div>

      {/* SANDBOX 1: MAXILLARY INFILTRATION DURATION & DECAY TIMELINE */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-[#1E293B]">Maxillary Infiltration Duration & Pharmacokinetics Sandbox</h3>
            <p className="text-xs text-slate-500 mt-0.5">Explore rapid porous bone onset vs short pulpal duration across anterior and posterior tooth groups. Educational timeline: onset is shown at 5 minutes and duration uses the displayed upper estimates measured from injection; individual success is not predicted.</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'anterior', label: 'Anterior Teeth (~30 min)' },
              { id: 'premolar', label: 'Premolars (40–45 min)' },
              { id: 'molar', label: 'Molars (~35–40 min)' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedToothGroup(t.id as typeof selectedToothGroup)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedToothGroup === t.id 
                    ? 'bg-[#1E293B] text-white shadow ring-1 ring-[#D97706]' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Interactive Procedure Timeline Canvas */}
          <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-6 text-white space-y-6 shadow-inner">
            <div className="flex flex-wrap justify-between items-center gap-2 text-xs font-mono text-slate-400">
              <span className="flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                <span>PROCEDURE ELAPSED TIME</span>
              </span>
              <span className={`px-2.5 py-0.5 rounded font-bold ${isOnsetPending ? 'bg-amber-600 text-white' : isDeclined ? 'bg-red-500 text-white' : 'bg-emerald-600 text-white'}`}>
                {procedureTime} min elapsed
              </span>
            </div>

            <div className="space-y-2">
              <input 
                type="range"
                aria-label="Procedure elapsed time in minutes"
                min="0" 
                max="60" 
                step="1" 
                value={procedureTime}
                onChange={(e) => setProcedureTime(Number(e.target.value))}
                className="w-full accent-[#D97706]" 
              />
              <div className="flex flex-wrap justify-between gap-2 text-[11px] text-slate-400 font-mono">
                <span>0m (Injection)</span>
                <span>3-5m (Onset 87-92%)</span>
                <span>30m (Anteriors Drop)</span>
                <span>45m (Premolars Drop)</span>
                <span>60m (Exhausted)</span>
              </div>
            </div>

            {/* Remaining Pulpal Anesthesia Gauge */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex flex-wrap justify-between gap-2 text-xs font-mono">
                <span>Illustrative Pulpal Anesthesia Status:</span>
                <span className={isOnsetPending ? "text-amber-400 font-bold" : pulpalRemaining > 0 ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                  {isOnsetPending ? 'ONSET PENDING (3–5 min)' : pulpalRemaining > 0 ? `${pulpalRemaining} minutes remaining` : 'EXPIRED - Sensation Returning!'}
                </span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${pulpalRemaining > 10 ? 'bg-emerald-500' : pulpalRemaining > 0 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${(pulpalRemaining / maxDuration) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Clinical Warning */}
            <div className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start space-x-3 ${
              isOnsetPending
                ? 'bg-amber-950/80 border-amber-500/60 text-amber-200'
                : isDeclined
                ? 'bg-red-950/80 border-red-500/60 text-red-200' 
                : 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200'
            }`}>
              {isOnsetPending ? (
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              ) : isDeclined ? (
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div>
                <strong>{isOnsetPending ? 'ONSET PENDING — ANESTHESIA NOT YET CONFIRMED' : isDeclined ? 'RE-INJECTION REQUIRED (Pulpal Duration Declining)' : 'WITHIN ILLUSTRATIVE PULPAL ANESTHESIA WINDOW'}</strong>
                <p className="mt-1">
                  {isOnsetPending
                    ? `At ${procedureTime} minutes after injection, the displayed 3–5 minute onset window has not yet elapsed. This timeline does not confirm pulpal anesthesia.`
                    : isDeclined
                    ? `At ${procedureTime} minutes, pulpal anesthesia for ${selectedToothGroup} teeth has declined. As emphasized in lecture, additional local anesthetic must be administered depending on procedure duration.` 
                    : `Infiltration with 1 cartridge 2% lidocaine w/ 1:100,000 epi provides high initial pulpal success (87%–92%) within 3–5 minutes. This simplified timeline does not confirm an individual patient's pulpal anesthesia; confirm clinically before instrumentation.`}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#D97706]">Maxillary Block Status</span>
              <h4 className="text-base font-bold text-slate-900 mt-0.5">Are Maxillary Nerve Blocks Needed?</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Block anesthesia for maxillary teeth (PSA, AMSA, P-ASA, Infraorbital, 2nd division) is <strong>NOT required</strong> for routine restorative and endodontic procedures. Simple buccal supraperiosteal infiltration is the standard of care.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
              <span className="font-bold">Bone Porosity Advantage:</span>
              <p>The thin cribriform and porous nature of maxillary alveolar bone facilitates rapid trans-cortical diffusion directly to root apices.</p>
            </div>
          </div>
        </div>
      </div>

      {/* SANDBOX 2: SUPPLEMENTAL INJECTION TECHNIQUE SIMULATOR (STABIDENT IO, PDL, INTRAPULPAL) */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-[#1E293B]">Supplemental Injection Simulator (IO, PDL, Intrapulpal)</h3>
          <p className="text-xs text-slate-500 mt-0.5">Interactive simulation of adjunct techniques when IAN block fails on irreversible pulpitis ('hot teeth')</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { id: 'io', label: '1. Stabident Intraosseous (IO)', sub: 'Perforator drill + 27G ultrashort needle' },
            { id: 'pdl', label: '2. Periodontal Ligament (PDL)', sub: '0.2 mL/root under high pressure' },
            { id: 'ip', label: '3. Intrapulpal (IP)', sub: 'Heavy backpressure into exposed pulp' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => {
                setSuppTech(t.id as typeof suppTech);
                setIoStep('drill');
              }}
              className={`p-3 rounded-xl border text-left transition-all flex-1 basis-50 min-w-0 ${
                suppTech === t.id 
                  ? 'bg-[#1E293B] text-white border-[#0284C7] shadow' 
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="font-bold text-xs">{t.label}</div>
              <div className="text-[10px] opacity-75 mt-0.5">{t.sub}</div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Interactive Technique Visualizer Canvas */}
          <div className="lg:col-span-7 bg-slate-950 rounded-2xl p-6 text-white min-h-85 flex flex-col justify-between shadow-inner">
            <div className="flex flex-wrap justify-between items-center gap-2 text-xs font-mono text-slate-400">
              <span>TECHNIQUE SIMULATOR: {suppTech.toUpperCase()}</span>
              <span className="text-emerald-400 font-bold">{suppTech === 'io' && ioStep === 'drill' ? 'Awaiting Delivery' : 'Immediate Onset After Delivery'}</span>
            </div>

            {/* Visual SVG representation */}
            <div className="relative my-4 flex justify-center">
              <svg className="w-full h-48" viewBox="0 0 340 160">
                {/* Tooth Roots */}
                <path d="M110,20 Q115,80 120,130 Q130,130 135,90 Q145,130 155,130 Q160,80 165,20 Z" fill="#F8FAFC" stroke="#64748B" strokeWidth="2" />
                
                {/* Pulp Chamber */}
                <path d="M125,30 Q128,70 125,120 Q133,80 137,40 Q141,80 148,120 Q145,70 148,30 Z" fill="#EF4444" />

                {/* PDL Space */}
                <path d="M106,25 Q111,80 116,133" stroke="#FBBF24" strokeWidth="2.5" fill="none" strokeDasharray="2,2" />
                <path d="M169,25 Q164,80 159,133" stroke="#FBBF24" strokeWidth="2.5" fill="none" strokeDasharray="2,2" />

                {/* Cancellous Medullary Bone */}
                <rect x="20" y="50" width="80" height="90" fill="#334155" rx="6" />
                <text x="60" y="100" fill="#94A3B8" fontSize="9" textAnchor="middle">Cancellous Bone</text>

                {/* Cortical Plate */}
                <rect x="95" y="45" width="8" height="100" fill="#64748B" />

                {/* Technique-specific active elements */}
                {suppTech === 'io' && (
                  <g>
                    {ioStep === 'drill' ? (
                      <g>
                        {/* Perforator Drill */}
                        <line x1="40" y1="75" x2="98" y2="75" stroke="#38BDF8" strokeWidth="4" />
                        <polygon points="98,75 90,70 90,80" fill="#38BDF8" />
                        <text x="60" y="65" fill="#38BDF8" fontSize="9" fontWeight="bold">27G Beveled Perforator</text>
                      </g>
                    ) : (
                      <g>
                        {/* 27G Needle in Perforation */}
                        <circle cx="99" cy="75" r="4" fill="#10B981" />
                        <line x1="30" y1="75" x2="99" y2="75" stroke="#10B981" strokeWidth="2.5" />
                        <circle cx="50" cy="75" r="14" fill="#10B981" opacity="0.3" className="animate-ping" />
                        <text x="60" y="65" fill="#10B981" fontSize="9" fontWeight="bold">27G Ultrashort Needle</text>
                      </g>
                    )}
                  </g>
                )}

                {suppTech === 'pdl' && (
                  <g>
                    {/* PDL Needle wedged into PDL space */}
                    <line x1="90" y1="10" x2="108" y2="45" stroke="#38BDF8" strokeWidth="2.5" />
                    <polygon points="108,45 104,38 111,40" fill="#38BDF8" />
                    <circle cx="109" cy="48" r="8" fill="#38BDF8" opacity="0.4" className="animate-ping" />
                    <text x="80" y="8" fill="#38BDF8" fontSize="9" fontWeight="bold">Bevel toward root (0.2 mL/root)</text>
                  </g>
                )}

                {suppTech === 'ip' && (
                  <g>
                    {/* Bent needle inside pulp horn */}
                    <path d="M110,5 L135,25 L135,45" stroke="#EF4444" strokeWidth="2.5" fill="none" />
                    <polygon points="135,45 131,38 139,38" fill="#EF4444" />
                    <circle cx="135" cy="45" r="10" fill="#EF4444" opacity="0.5" className="animate-ping" />
                    <text x="140" y="15" fill="#F87171" fontSize="9" fontWeight="bold">Bent needle wedged under backpressure</text>
                  </g>
                )}
              </svg>
            </div>

            {/* Interactive Step Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              {suppTech === 'io' && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setIoStep('drill')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${ioStep === 'drill' ? 'bg-[#0284C7] text-white' : 'bg-slate-800 text-slate-300'}`}
                  >
                    Step 1: Perforate Cortical Plate
                  </button>
                  <button
                    onClick={() => setIoStep('inject')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${ioStep === 'inject' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'}`}
                  >
                    Step 2: Deliver into Cancellous Bone
                  </button>
                </div>
              )}

              {suppTech === 'pdl' && (
                <div className="text-xs text-slate-300">
                  <span>High Pressure Delivery: Peripress Pen, Ligmaject, or computer-controlled STA.</span>
                </div>
              )}

              {suppTech === 'ip' && (
                <div className="text-xs text-red-300 font-semibold">
                  ⚠️ Severe pain during delivery! Lasts 15–20 minutes. Extirpate pulp immediately!
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0284C7]">Technical Specifications</span>
              <h4 className="text-base font-bold text-slate-900 mt-0.5">
                {suppTech === 'io' && 'Stabident IO System (Fairfax Dental)'}
                {suppTech === 'pdl' && 'Periodontal Ligament Injection'}
                {suppTech === 'ip' && 'Intrapulpal Injection'}
              </h4>
              <div className="text-xs text-slate-600 mt-2 space-y-2 leading-relaxed">
                {suppTech === 'io' && (
                  <>
                    <p>• <strong>Components:</strong> Handpiece-driven solid 27G beveled wire perforator + 27G ultrashort needle.</p>
                    <p>• <strong>Mechanism:</strong> Drills small hole through cortical bone; solution is deposited into cancellous medullary bone.</p>
                    <p>• <strong>Primary Indication:</strong> Mandibular second molars when standard IAN block fails.</p>
                  </>
                )}
                {suppTech === 'pdl' && (
                  <>
                    <p>• <strong>Dosage:</strong> Exactly 0.2 mL placed per root.</p>
                    <p>• <strong>Needle Orientation:</strong> Bevel directed towards the root surface under high backpressure.</p>
                    <p>• <strong>Devices:</strong> Peripress Pen (Panadent), Ligmaject (Henke-Sass Wolf), or STA (Milestone Scientific).</p>
                  </>
                )}
                {suppTech === 'ip' && (
                  <>
                    <p>• <strong>Dual Mechanism:</strong> Controls pain by both mechanical backpressure and pharmacologic LA block.</p>
                    <p>• <strong>Duration:</strong> Very short (15 to 20 minutes).</p>
                    <p>• <strong>Clinical Mandate:</strong> Pulpal tissue must be removed quickly and completely to avoid recurrence of pain during instrumentation.</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
