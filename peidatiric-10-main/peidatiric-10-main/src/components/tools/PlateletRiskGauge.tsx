import React, { useState } from 'react';
import { soundFx } from '../../utils/audio';
import { Activity, AlertTriangle, ShieldCheck, CheckCircle2, ShieldAlert } from 'lucide-react';

export const PlateletRiskGauge: React.FC = () => {
  const [platelets, setPlatelets] = useState<number>(75000);

  const getTier = (count: number) => {
    if (count >= 100000) {
      return {
        level: 'safe',
        title: 'Adequate for All Dental Procedures',
        badge: '>100,000 / mm³',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        barColor: 'bg-emerald-500',
        summary:
          'Routine and invasive dental treatments (restorations, extractions, minor surgery) can be completed without special hematologic premedication.',
      };
    } else if (count >= 50000) {
      return {
        level: 'moderate',
        title: 'Routine Restorative & Non-Block Injections Permitted',
        badge: '50,000 - 100,000 / mm³',
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        barColor: 'bg-amber-500',
        summary:
          'Routine preventive and restorative dental care is safe. Infiltrations, intraligamentary injections, and soft tissue restorations allowed. AVOID deep nerve blocks if possible.',
      };
    } else if (count >= 20000) {
      return {
        level: 'urgent_only',
        title: 'Strict Caution: Limited Emergency Care Only',
        badge: '20,000 - 50,000 / mm³',
        color: 'text-orange-700 bg-orange-50 border-orange-200',
        barColor: 'bg-orange-500',
        summary:
          'Consult hematologist immediately. Elective procedures deferred. Emergency pain relief with extreme local hemostasis (pressure, oxidized cellulose, antifibrinolytics).',
      };
    } else {
      return {
        level: 'danger',
        title: 'High Risk: Spontaneous Hemorrhage',
        badge: '<20,000 / mm³',
        color: 'text-red-700 bg-red-50 border-red-200',
        barColor: 'bg-red-600',
        summary:
          'CRITICAL: Spontaneous oral mucosal bleeding, petechiae, ecchymosis. NO DENTAL TREATMENT without preceding prophylactic platelet transfusion! Stop toothbrushing; use moist gauze wipes with saline.',
      };
    }
  };

  const tier = getTier(platelets);

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#C9A24B]/30 shadow-md">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-red-50 text-red-600">
            <Activity className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-montserrat font-bold text-base text-[#0B1F4D]">
              Pediatric Platelet Count Clearance Gauge
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              Leukemia & Bleeding Diathesis Protocols (Lec 4 A.M. p.9)
            </p>
          </div>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${tier.color}`}>
          {tier.badge}
        </span>
      </div>

      {/* Platelet Slider */}
      <div className="bg-[#FAF8F3] p-4 rounded-xl border border-amber-200/50 mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-bold text-gray-700">
            Patient Platelet Level (mm³):
          </label>
          <span className="font-black text-base text-[#1B3A8C]">
            {platelets.toLocaleString()} / mm³
          </span>
        </div>

        <input
          type="range"
          min="10000"
          max="150000"
          step="5000"
          value={platelets}
          onChange={(e) => {
            setPlatelets(Number(e.target.value));
            soundFx.playClick();
          }}
          className="w-full accent-[#1B3A8C] cursor-pointer"
        />

        {/* Milestone Tick Marks */}
        <div className="flex justify-between text-[10px] text-gray-500 mt-1 font-semibold">
          <span className="text-red-600 font-bold">20,000 (Spontaneous Bleeding)</span>
          <span className="text-amber-600 font-bold">50,000 (Non-Block / Routine)</span>
          <span className="text-emerald-600 font-bold">&gt;100,000 (Fully Safe)</span>
        </div>
      </div>

      {/* Result Card */}
      <div className={`p-4 rounded-xl border ${tier.color} transition-all`}>
        <div className="flex items-center gap-2 mb-1.5">
          {tier.level === 'safe' && <ShieldCheck className="w-5 h-5 text-emerald-600" />}
          {tier.level === 'moderate' && <CheckCircle2 className="w-5 h-5 text-amber-600" />}
          {tier.level === 'urgent_only' && <AlertTriangle className="w-5 h-5 text-orange-600" />}
          {tier.level === 'danger' && <ShieldAlert className="w-5 h-5 text-red-600 animate-pulse" />}
          <h4 className="font-montserrat font-bold text-sm">{tier.title}</h4>
        </div>
        <p className="text-xs leading-relaxed opacity-90">{tier.summary}</p>

        <div className="mt-2.5 pt-2 border-t border-black/10 flex items-center justify-between text-[11px] font-semibold">
          <span>Pulp therapy in primary teeth:</span>
          <span className="text-red-700 bg-red-100 px-2 py-0.5 rounded font-black">
            STRICTLY CONTRAINDICATED IN LEUKEMIA
          </span>
        </div>
      </div>
    </div>
  );
};
