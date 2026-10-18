import React, { useState } from 'react';
import { ShieldCheck, AlertOctagon, CheckCircle2, XCircle, Volume2, Activity, Sparkles } from 'lucide-react';

export const Lec9Visuals: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<string>('steel_scaler');
  const [percussionResult, setPercussionResult] = useState<'ring' | 'dull' | null>('ring');

  const hygieneTools: Record<string, {
    name: string;
    safety: 'SAFE' | 'STRICTLY PROHIBITED';
    reason: string;
    clinicalRule: string;
  }> = {
    steel_scaler: {
      name: 'Stainless Steel Manual Scaler',
      safety: 'STRICTLY PROHIBITED',
      reason: 'Harder than titanium; gouges deep micro-grooves into the polished abutment collar, ruining the surface passivity and harboring virulent anaerobic bacteria.',
      clinicalRule: 'NEVER use bare stainless steel or ultrasonic metal scaler tips on dental implants.'
    },
    plastic_scaler: {
      name: 'Plastic / Teflon / Gold-Coated Scaler',
      safety: 'SAFE',
      reason: 'Softer than titanium; gently debrides calculus without scratching or altering the delicate micro-machined titanium surface.',
      clinicalRule: 'First choice for professional subgingival debridement around implants.'
    },
    steel_wire_brush: {
      name: 'Standard Metal-Wire Interdental Brush',
      safety: 'STRICTLY PROHIBITED',
      reason: 'The exposed sharp metal wire tip scratches the implant post during insertion, creating corrosion sites.',
      clinicalRule: 'Patients must be cautioned NEVER to use interdental brushes with bare metal wire cores.'
    },
    nylon_coated_brush: {
      name: 'Nylon-Coated Wire Interdental Brush',
      safety: 'SAFE',
      reason: 'The flexible plastic/nylon coating insulates the metal core, preventing any contact or scratching of the implant.',
      clinicalRule: 'Used with a gentle in-and-out motion between implant abutments and pontics.'
    },
    ribbon_floss: {
      name: 'Ribbon Floss in 360° Shoeshine Loop',
      safety: 'SAFE',
      reason: 'Wide braided gauze-like texture wraps 360° circumferentially around the abutment post, lifting plaque efficiently.',
      clinicalRule: 'Recommended daily self-care technique with non-abrasive paste.'
    },
    chlorhexidine_foam: {
      name: 'Foam Tip dipped in 0.12% Chlorhexidine',
      safety: 'SAFE',
      reason: 'Chemical antimicrobial irrigation reduces bleeding and gingival inflammation indices around fragile transmucosal tissues.',
      clinicalRule: 'Ideal for patients with limited dexterity or early peri-implant mucositis.'
    }
  };

  const currentTool = hygieneTools[selectedTool];

  return (
    <div className="space-y-6">
      {/* 2D Visual 1: Safe vs Prohibited Armamentarium Checker */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E6E8EC] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E6E8EC] gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0B1F4D] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#C9A24B]" />
              Implant Maintenance Armamentarium: Safe vs Prohibited Devices
            </h3>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              The Prime Directive: Regularly debride biofilm without altering or scratching the titanium surface
            </p>
          </div>
          <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-bold bg-[#FAF8F3] text-[#1B3A8C] border border-[#C9A24B]/40">
            Clinical Safety Protocol
          </span>
        </div>

        {/* Tool Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 my-4">
          {Object.entries(hygieneTools).map(([key, tool]) => {
            const isSelected = selectedTool === key;
            const isSafe = tool.safety === 'SAFE';
            return (
              <button
                key={key}
                onClick={() => setSelectedTool(key)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? isSafe
                      ? 'bg-emerald-800 text-white shadow-md border-transparent ring-2 ring-emerald-400'
                      : 'bg-red-800 text-white shadow-md border-transparent ring-2 ring-red-400'
                    : 'bg-[#FAF8F3] text-[#0B1F4D] hover:bg-[#E6E8EC] border-[#E6E8EC]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                    isSafe ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {tool.safety === 'SAFE' ? 'APPROVED' : 'FORBIDDEN'}
                  </span>
                </div>
                <span className="font-bold text-xs block leading-snug">{tool.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Tool Diagnostic Evaluation */}
        <div className={`p-4 sm:p-5 rounded-xl border space-y-2 text-xs leading-relaxed ${
          currentTool.safety === 'SAFE'
            ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
            : 'bg-red-50 text-red-950 border-red-300'
        }`}>
          <div className="flex items-center gap-2">
            {currentTool.safety === 'SAFE' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-red-700 shrink-0" />
            )}
            <h4 className="font-extrabold text-sm sm:text-base">
              {currentTool.name} — Status: {currentTool.safety}
            </h4>
          </div>

          <p className="font-sans">
            <strong>Biological Rationale:</strong> {currentTool.reason}
          </p>
          <div className="pt-2 border-t border-black/10">
            <strong className="block mb-0.5">Clinical Protocol Rule:</strong>
            {currentTool.clinicalRule}
          </div>
        </div>
      </div>

      {/* 2D Visual 2: Clinical Diagnostic Testing (Percussion Ring vs Dull & Mobility) */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E6E8EC] shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-[#E6E8EC]">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0B1F4D] flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#C9A24B]" />
              Diagnostic Evaluation at Recall: Acoustic Percussion & Mobility
            </h3>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Confirming direct structural osseointegration vs fibrous encapsulation
            </p>
          </div>
        </div>

        {/* Acoustic Percussion Test Interactive */}
        <div className="my-4 bg-[#FAF8F3] p-4 sm:p-5 rounded-xl border border-[#C9A24B]/30 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold text-[#1B3A8C] uppercase tracking-wider block">
                Acoustic Percussion Test
              </span>
              <p className="text-xs text-slate-700 mt-0.5">
                Gently tap the implant restoration with the mirror handle to assess acoustic resonance:
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setPercussionResult('ring')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  percussionResult === 'ring'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-50'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                Crisp Metallic 'Ring'
              </button>
              <button
                onClick={() => setPercussionResult('dull')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  percussionResult === 'dull'
                    ? 'bg-red-600 text-white border-red-600 shadow-xs'
                    : 'bg-white text-red-800 border-red-300 hover:bg-red-50'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                Dull Hollow 'Thud'
              </button>
            </div>
          </div>

          <div className={`p-3 rounded-lg border text-xs leading-relaxed ${
            percussionResult === 'ring'
              ? 'bg-emerald-100/70 text-emerald-950 border-emerald-300'
              : 'bg-red-100/70 text-red-950 border-red-300'
          }`}>
            {percussionResult === 'ring' ? (
              <div>
                <strong className="block font-bold mb-0.5">Diagnostic Finding: Osseointegrated!</strong>
                A characteristic high-frequency clear ringing note confirms direct, rigid structural ankylosis between titanium and healthy trabecular bone without interposing fibrous tissue.
              </div>
            ) : (
              <div>
                <strong className="block font-bold mb-0.5">Diagnostic Finding: Failed Osseointegration / Fibrous Encapsulation!</strong>
                A low-pitched, dull, soft sound indicates that the implant is enclosed by non-mineralized scar/granulation tissue rather than bone. The patient must be referred back to the implantologist immediately.
              </div>
            )}
          </div>
        </div>

        {/* Mobility Testing Guideline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-[#FAF8F3] rounded-lg border border-[#E6E8EC]">
            <strong className="text-[#0B1F4D] block mb-1">Two-Instrument Mobility Check:</strong>
            Use two rigid instrument handles (buccal & lingual). Any detectable mobility indicates loose retention screws or failed intra-bony components.
          </div>
          <div className="p-3 bg-[#FAF8F3] rounded-lg border border-[#E6E8EC]">
            <strong className="text-[#1B3A8C] block mb-1">Electronic Periotest Device:</strong>
            Utilizes an accelerated rod tapper and internal accelerometer to quantitatively calculate the damping index and stability of the implant.
          </div>
        </div>
      </div>
    </div>
  );
};
