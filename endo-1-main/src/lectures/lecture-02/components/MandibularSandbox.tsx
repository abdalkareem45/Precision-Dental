/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  MapPin, 
  Syringe, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Layers, 
  Target,
  Maximize2,
  Minimize2,
  Award,
  HelpCircle
} from 'lucide-react';

export default function MandibularSandbox() {
  const [activeTechnique, setActiveTechnique] = useState<'ianb' | 'gowgates' | 'akinosi' | 'mental'>('ianb');
  const [cartridgeVolume, setCartridgeVolume] = useState<number>(3.6); // 1.8 mL vs 3.6 mL
  const [testedPulp, setTestedPulp] = useState<boolean>(false);
  const [coldTestResult, setColdTestResult] = useState<'negative' | 'positive' | null>(null);

  const testPulpalAnesthesia = () => {
    setTestedPulp(true);
    // Match the probabilities displayed by the volume selector below.
    const successProbability = cartridgeVolume === 3.6 ? 0.86 : 0.54;
    setColdTestResult(Math.random() < successProbability ? 'negative' : 'positive');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Module Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-3 bg-emerald-100 rounded-xl text-emerald-700">
            <MapPin className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D97706]">Module 3</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1E293B]">Mandibular Anesthesia Techniques</h2>
          </div>
        </div>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Due to the thick, non-porous cortical plate of the adult mandible, infiltration is generally ineffective for lower posterior teeth. Mandibular nerve blocks (IANB, Gow-Gates, Akinosi-Vazirani, and Mental/Incisive) are essential for successful endodontic therapy.
        </p>
      </div>

      {/* SANDBOX 1: ANATOMICAL LANDMARK & INJECTION TARGET SANDBOX */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-[#1E293B]">Mandibular Injection Target & Anatomical Landmark Sandbox</h3>
            <p className="text-xs text-slate-500 mt-0.5">Explore target trajectories, mouth opening requirements, and anatomical deposition sites</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'ianb', label: '1. IAN Block' },
              { id: 'gowgates', label: '2. Gow-Gates V3' },
              { id: 'akinosi', label: '3. Akinosi-Vazirani' },
              { id: 'mental', label: '4. Mental / Incisive' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTechnique(t.id as typeof activeTechnique);
                  setTestedPulp(false);
                  setColdTestResult(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTechnique === t.id 
                    ? 'bg-[#1E293B] text-white shadow ring-1 ring-[#0284C7]' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Interactive Anatomical SVG Diagram */}
          <div className="lg:col-span-7 bg-slate-950 rounded-2xl p-6 text-white relative min-h-85 flex flex-col justify-between shadow-inner overflow-hidden">
            <div className="flex flex-wrap justify-between items-center gap-2 text-xs font-mono text-slate-400">
              <span className="flex items-center space-x-1.5">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                <span>ANATOMICAL TARGET: {activeTechnique.toUpperCase()}</span>
              </span>
              <span className={`px-2 py-0.5 rounded font-bold ${
                activeTechnique === 'akinosi' ? 'bg-amber-900 text-amber-200' : 'bg-sky-900 text-sky-200'
              }`}>
                {activeTechnique === 'akinosi' ? 'Closed Mouth (Trismus)' : 'Mouth Wide Open'}
              </span>
            </div>

            {/* SVG Anatomy Map */}
            <div className="relative my-3 flex justify-center">
              <svg className="w-full h-56" viewBox="0 0 380 200">
                {/* Mandibular Ramus & Condyle Skeleton Contour */}
                <path 
                  d="M120,40 Q150,25 200,30 Q240,35 250,55 L250,110 Q240,160 190,175 L80,170 Q60,140 70,110 L80,70 Z" 
                  fill="#1E293B" 
                  stroke="#475569" 
                  strokeWidth="2" 
                />

                {/* Mandibular Teeth Arch representation */}
                <g fill="#CBD5E1">
                  <rect x="75" y="145" width="14" height="12" rx="2" />
                  <rect x="95" y="147" width="14" height="12" rx="2" />
                  <rect x="115" y="149" width="16" height="13" rx="2" fill={activeTechnique !== 'mental' ? '#38BDF8' : '#CBD5E1'} />
                  <rect x="135" y="151" width="18" height="14" rx="2" fill={activeTechnique !== 'mental' ? '#38BDF8' : '#CBD5E1'} />
                  <rect x="157" y="153" width="20" height="15" rx="2" fill={activeTechnique !== 'mental' ? '#38BDF8' : '#CBD5E1'} />
                </g>

                {/* Inferior Alveolar Nerve Canal */}
                <path 
                  d="M210,95 Q200,135 150,160 L90,158" 
                  stroke="#FBBF24" 
                  strokeWidth="3" 
                  fill="none" 
                  strokeDasharray={activeTechnique === 'ianb' ? 'none' : '3,3'} 
                />

                {/* Mandibular Foramen Target Point */}
                <circle cx="210" cy="95" r="7" fill={activeTechnique === 'ianb' ? '#10B981' : '#64748B'} className={activeTechnique === 'ianb' ? 'animate-ping' : ''} />
                <circle cx="210" cy="95" r="5" fill="#10B981" />
                <text x="220" y="99" fill="#94A3B8" fontSize="9" fontFamily="monospace">Mandibular Foramen</text>

                {/* Condyle Neck Target Point (Gow-Gates) */}
                <circle cx="240" cy="45" r="7" fill={activeTechnique === 'gowgates' ? '#0284C7' : '#64748B'} className={activeTechnique === 'gowgates' ? 'animate-ping' : ''} />
                <circle cx="240" cy="45" r="5" fill="#0284C7" />
                <text x="250" y="49" fill="#94A3B8" fontSize="9" fontFamily="monospace">Neck of Condyle (V3)</text>

                {/* Akinosi Tuberosity Target Point */}
                <circle cx="205" cy="65" r="7" fill={activeTechnique === 'akinosi' ? '#D97706' : '#64748B'} className={activeTechnique === 'akinosi' ? 'animate-ping' : ''} />
                <circle cx="205" cy="65" r="5" fill="#D97706" />
                <text x="215" y="69" fill="#94A3B8" fontSize="9" fontFamily="monospace">Maxillary 3rd Molar Tuberosity</text>

                {/* Mental Foramen Target Point */}
                <circle cx="105" cy="165" r="7" fill={activeTechnique === 'mental' ? '#EC4899' : '#64748B'} className={activeTechnique === 'mental' ? 'animate-ping' : ''} />
                <circle cx="105" cy="165" r="5" fill="#EC4899" />
                <text x="115" y="178" fill="#94A3B8" fontSize="9" fontFamily="monospace">Mental Foramen</text>

                {/* Interactive Needle Vector based on active technique */}
                {activeTechnique === 'ianb' && (
                  <g stroke="#EF4444" strokeWidth="2.5">
                    <line x1="80" y1="120" x2="208" y2="96" strokeDasharray="4,2" />
                    <polygon points="208,96 198,92 200,102" fill="#EF4444" />
                    <text x="100" y="115" fill="#F87171" fontSize="9" fontWeight="bold">Needle from Contralateral Premolars</text>
                  </g>
                )}

                {activeTechnique === 'gowgates' && (
                  <g stroke="#38BDF8" strokeWidth="2.5">
                    <line x1="90" y1="130" x2="238" y2="47" strokeDasharray="4,2" />
                    <polygon points="238,47 228,45 232,55" fill="#38BDF8" />
                    <text x="110" y="110" fill="#38BDF8" fontSize="9" fontWeight="bold">Extraoral Landmark: Intertragic Notch</text>
                  </g>
                )}

                {activeTechnique === 'akinosi' && (
                  <g stroke="#FBBF24" strokeWidth="2.5">
                    <line x1="70" y1="70" x2="203" y2="65" strokeDasharray="4,2" />
                    <polygon points="203,65 193,60 193,70" fill="#FBBF24" />
                    <text x="80" y="62" fill="#FBBF24" fontSize="9" fontWeight="bold">Parallel to Occlusal Plane (Teeth in Occlusion)</text>
                  </g>
                )}

                {activeTechnique === 'mental' && (
                  <g stroke="#F472B6" strokeWidth="2.5">
                    <line x1="60" y1="185" x2="103" y2="166" strokeDasharray="4,2" />
                    <polygon points="103,166 93,168 97,176" fill="#F472B6" />
                    <text x="40" y="196" fill="#F472B6" fontSize="9" fontWeight="bold">Buccal Fold between Premolars</text>
                  </g>
                )}
              </svg>
            </div>

            {/* Target Guidance Summary */}
            <div className="text-xs text-slate-300 bg-slate-900/90 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
              <span>
                {activeTechnique === 'ianb' && 'Pterygomandibular space near mandibular foramen. Anesthetizes mandibular teeth and lingual nerve (tongue/floor). Buccal mucosa requires separate block!'}
                {activeTechnique === 'gowgates' && 'High V3 block anterior to condyle neck. Anesthetizes ALL mandibular teeth, buccal & lingual soft tissue, mylohyoid, and buccal nerves.'}
                {activeTechnique === 'akinosi' && 'Closed-mouth technique for patients with trismus. Injection at mucogingival junction of maxillary 3rd molar near tuberosity.'}
                {activeTechnique === 'mental' && 'Buccal fold between mandibular premolars. Anesthetizes premolars, anteriors, lower lip, and chin skin.'}
              </span>
            </div>
          </div>

          {/* Technique Details & Clinical Nuances */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Lecture Key Points</span>
              <h4 className="text-base font-bold text-slate-900 mt-0.5">
                {activeTechnique === 'ianb' && 'Conventional IAN Block'}
                {activeTechnique === 'gowgates' && 'Gow-Gates V3 Mandibular Block'}
                {activeTechnique === 'akinosi' && 'Akinosi-Vazirani Closed-Mouth Block'}
                {activeTechnique === 'mental' && 'Mental / Incisive Nerve Block'}
              </h4>
              <div className="text-xs text-slate-600 mt-2 space-y-2 leading-relaxed">
                {activeTechnique === 'ianb' && (
                  <>
                    <p>• <strong>Onset:</strong> Pulpal anesthesia within 15 minutes, lasting ~1 hour.</p>
                    <p>• <strong>Soft Tissue Coverage:</strong> Mandibular teeth on the side of injection, lingual mucosa, anterior 2/3 of tongue. <em>Buccal gingiva of molars is NOT anesthetized</em> (requires long buccal nerve injection).</p>
                    <p>• <strong>Missed Block Prevention:</strong> Using a two-cartridge volume (3.6 mL) is significantly better than a single cartridge.</p>
                  </>
                )}
                {activeTechnique === 'gowgates' && (
                  <>
                    <p>• <strong>Position:</strong> Patient supine, mouth opened as wide as possible.</p>
                    <p>• <strong>Landmark:</strong> Barrel over contralateral premolars, aimed just anterior to the neck of the condyle in proximity to V3 exiting foramen ovale.</p>
                    <p>• <strong>Sensory Scope:</strong> Teeth, buccal/lingual soft tissues, mylohyoid, and auriculotemporal nerve.</p>
                  </>
                )}
                {activeTechnique === 'akinosi' && (
                  <>
                    <p>• <strong>Primary Indication:</strong> Limited mouth opening (severe trismus, trauma, spasm).</p>
                    <p>• <strong>Needle Position:</strong> 25G or 27G long needle advanced parallel to the maxillary occlusal plane at the level of the mucogingival junction of the maxillary 3rd molar.</p>
                    <p>• Teeth remain in light occlusion without forceful stretching.</p>
                  </>
                )}
                {activeTechnique === 'mental' && (
                  <>
                    <p>• <strong>Deposition:</strong> Between premolars near mental foramen.</p>
                    <p>• <strong>Scope:</strong> Premolars, canines, incisors, lower lip, and chin skin.</p>
                    <p>• Useful for anterior/premolar procedures without producing tongue numbness.</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SANDBOX 2: IANB CARTRIDGE VOLUME & PULPAL ANESTHESIA CONFIRMATION */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-[#1E293B]">IANB Volume Optimizer & Pulpal Confirmation Sandbox</h3>
          <p className="text-xs text-slate-500 mt-0.5">Test the clinical difference between 1 cartridge (1.8 mL) and 2 cartridges (3.6 mL) with Cold / EPT testing. Educational simulation: each test samples the displayed probability independently; it does not predict an individual patient's response.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-6 text-white space-y-5 shadow-inner">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-mono text-slate-400">Cartridge Volume Selector</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setCartridgeVolume(1.8);
                    setTestedPulp(false);
                    setColdTestResult(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    cartridgeVolume === 1.8 ? 'bg-[#0284C7] text-white shadow' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  1 Cartridge (1.8 mL)
                </button>
                <button
                  onClick={() => {
                    setCartridgeVolume(3.6);
                    setTestedPulp(false);
                    setColdTestResult(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    cartridgeVolume === 3.6 ? 'bg-emerald-600 text-white shadow' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  2 Cartridges (3.6 mL) Recommended
                </button>
              </div>
            </div>

            {/* Success Probability Meter */}
            <div className="space-y-2">
              <div className="flex flex-wrap justify-between gap-2 text-xs font-mono">
                <span>Pulpal Anesthesia Success Probability</span>
                <span className={cartridgeVolume === 3.6 ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                  {cartridgeVolume === 3.6 ? '~86% (Significantly Better)' : '~54% (Higher Missed Block Risk)'}
                </span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${cartridgeVolume === 3.6 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  style={{ width: cartridgeVolume === 3.6 ? '86%' : '54%' }}
                ></div>
              </div>
            </div>

            {/* Interactive Pulp Test Button */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-200">Confirm Pulpal Anesthesia via Cold / EPT:</span>
                <p className="text-[11px] text-slate-400">Soft tissue lip numbness is NOT confirmation of pulpal anesthesia.</p>
              </div>
              <button
                onClick={testPulpalAnesthesia}
                className="px-4 py-2 rounded-xl bg-[#D97706] text-white text-xs font-bold hover:bg-amber-600 transition shadow shrink-0 flex items-center space-x-1.5"
              >
                <Target className="w-3.5 h-3.5" />
                <span>Perform Pulp Test</span>
              </button>
            </div>

            {/* Cold Test Clinical Feedback */}
            {testedPulp && (
              <div className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start space-x-3 ${
                coldTestResult === 'negative'
                  ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200'
                  : 'bg-red-950/80 border-red-500/60 text-red-200'
              }`}>
                {coldTestResult === 'negative' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <strong>{coldTestResult === 'negative' ? 'PULPAL ANESTHESIA CONFIRMED (Negative Response)' : 'MISSED BLOCK / HYPERALGESIA (Positive Response)'}</strong>
                  <p className="mt-1">
                    {coldTestResult === 'negative'
                      ? 'The patient does NOT respond to cold/EPT stimulus. As stated in lecture notes: "The negative response means positive pulpal anesthesia." You may proceed safely with endodontic access.'
                      : 'The patient still felt the cold stimulus! Lip numbness was present, but pulpal anesthesia failed. Solution: administer supplemental injection (Intraosseous Stabident IO, PDL, or Intrapulpal).'}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Lecture Citation</span>
              <h4 className="font-bold text-sm">Two-Cartridge Volume Superiority</h4>
              <p className="text-xs leading-relaxed text-slate-700">
                "Research also found that administration of a two-cartridge volume was significantly better for avoiding a missed block than a one-cartridge volume in asymptomatic subjects."
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <span className="font-bold text-[#1E293B]">Clinical Trap to Avoid:</span>
              <p>Traditional methods (asking the patient if their lip feels numb or probing marginal gingiva) only assess soft tissue nerve trunks. Only a non-responsive pulp test verifies deep pulpal anesthesia.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
