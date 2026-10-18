import React, { useState } from 'react';
import { soundFx } from '../../utils/audio';
import { Clock, Droplets, AlertTriangle, CheckCircle2, ShieldCheck, Flame } from 'lucide-react';

export const AvulsionEmergencyTimer: React.FC = () => {
  const [dryMinutes, setDryMinutes] = useState<number>(20);
  const [selectedMedium, setSelectedMedium] = useState<string>('milk');
  const [apexState, setApexState] = useState<'closed' | 'open'>('closed');

  const media = [
    {
      id: 'hbss',
      name: "Hank's Balanced Salt Solution (HBSS)",
      rating: 'Best Medium ⭐⭐⭐⭐⭐',
      color: 'bg-emerald-500',
      description: 'Ideal osmolality and pH. Preserves PDL cell viability for up to 24 hours.',
      factor: 0.95,
    },
    {
      id: 'milk',
      name: 'Cold Pasteurized Bovine Milk',
      rating: 'Excellent ⭐⭐⭐⭐',
      color: 'bg-blue-500',
      description: 'Favorable pH & osmolality, low bacterial count. Maintains PDL cells for ~3 hours.',
      factor: 0.85,
    },
    {
      id: 'egg_white',
      name: 'Egg White / Egg Albumin',
      rating: 'Very Good ⭐⭐⭐⭐',
      color: 'bg-amber-500',
      description: 'High protein & nutrients, pH 8.6-9.3. Studies show better cell viability than milk for 6-10 hrs (Lec 10 p.8)!',
      factor: 0.88,
    },
    {
      id: 'saliva',
      name: 'Buccal Saliva / Vestibule',
      rating: 'Fair ⭐⭐⭐',
      color: 'bg-indigo-400',
      description: 'Allows storage for ~2 hours, but is hypotonic and contains oral bacteria.',
      factor: 0.65,
    },
    {
      id: 'saline',
      name: 'Physiologic Saline (0.9%)',
      rating: 'Acceptable ⭐⭐⭐',
      color: 'bg-cyan-500',
      description: 'Isotonic with compatible pH, prevents dehydration for up to 2 hours.',
      factor: 0.7,
    },
    {
      id: 'tap_water',
      name: 'Tap Water (Dangerous)',
      rating: 'Harmful ⚠️',
      color: 'bg-red-500',
      description: 'Hypotonicity causes rapid cell lysis! Considered as harmful as dry storage (Lec 10 p.8).',
      factor: 0.15,
    },
    {
      id: 'dry',
      name: 'Dry Storage (Air / Tissue)',
      rating: 'Critical ❌',
      color: 'bg-gray-700',
      description: 'Desiccation irreversibly kills PDL cells within 30-60 minutes.',
      factor: 0.05,
    },
  ];

  const currentMedium = media.find((m) => m.id === selectedMedium) || media[0];

  // Calculate PDL Viability & Ankylosis Risk
  const dryTimePenalty = Math.max(0, 1 - dryMinutes / 60);
  const viabilityPercent =
    selectedMedium === 'dry'
      ? Math.round(dryTimePenalty * 100)
      : Math.round(currentMedium.factor * 100 * Math.max(0.2, 1 - dryMinutes / 180));

  const ankylosisRisk = 100 - viabilityPercent;
  const isDelayedReplantation = dryMinutes > 60 || selectedMedium === 'dry' && dryMinutes > 30;

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#C9A24B]/30 shadow-md">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-montserrat font-bold text-base text-[#0B1F4D]">
              Avulsion Extraoral Time & Storage Medium Viability Matrix
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              PDL Cell Preservation & Prognosis Predictor (Lec 10 & Lec 15)
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
          Permanent Teeth Only
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Extraoral Dry Time Slider */}
        <div className="bg-[#FAF8F3] p-4 rounded-xl border border-amber-200/50">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#C9A24B]" />
              Extraoral Dry Time:
            </label>
            <span
              className={`font-black text-sm px-2 py-0.5 rounded ${
                dryMinutes <= 30
                  ? 'bg-green-100 text-green-800'
                  : dryMinutes <= 60
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {dryMinutes} Minutes
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="120"
            step="5"
            value={dryMinutes}
            onChange={(e) => {
              setDryMinutes(Number(e.target.value));
              soundFx.playClick();
            }}
            className="w-full accent-[#1B3A8C] cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-semibold">
            <span>0 min (Immediate)</span>
            <span className="text-amber-600 font-bold">&lt;60 min (Critical cutoff)</span>
            <span className="text-red-600 font-bold">&gt;60 min (Necrotic cells)</span>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-gray-200">
            <span className="font-semibold text-gray-600">Apical Foramen Status:</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setApexState('closed');
                }}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                  apexState === 'closed' ? 'bg-[#1B3A8C] text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                Closed Apex (Mature)
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setApexState('open');
                }}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                  apexState === 'open' ? 'bg-[#1B3A8C] text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                Open Apex (Immature)
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Viability Meters */}
        <div className="bg-[#FAF8F3] p-4 rounded-xl border border-amber-200/50 flex flex-col justify-around">
          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="font-bold text-gray-700">Estimated PDL Cell Viability:</span>
              <span
                className={`font-black text-sm ${
                  viabilityPercent >= 70
                    ? 'text-green-600'
                    : viabilityPercent >= 40
                    ? 'text-amber-600'
                    : 'text-red-600'
                }`}
              >
                {viabilityPercent}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  viabilityPercent >= 70
                    ? 'bg-green-500'
                    : viabilityPercent >= 40
                    ? 'bg-amber-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${viabilityPercent}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="font-bold text-gray-700">Risk of Replacement Resorption (Ankylosis):</span>
              <span
                className={`font-black text-sm ${
                  ankylosisRisk <= 30
                    ? 'text-green-600'
                    : ankylosisRisk <= 60
                    ? 'text-amber-600'
                    : 'text-red-600'
                }`}
              >
                {ankylosisRisk}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  ankylosisRisk <= 30
                    ? 'bg-green-500'
                    : ankylosisRisk <= 60
                    ? 'bg-amber-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${ankylosisRisk}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Storage Media Selector */}
      <div className="mb-4">
        <label className="text-xs font-bold text-gray-700 block mb-1.5 flex items-center gap-1.5">
          <Droplets className="w-3.5 h-3.5 text-[#1B3A8C]" />
          Select Transport Storage Medium:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {media.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                soundFx.playClick();
                setSelectedMedium(m.id);
              }}
              className={`p-2.5 rounded-xl text-left border transition-all ${
                selectedMedium === m.id
                  ? 'border-[#1B3A8C] bg-[#1B3A8C]/5 ring-2 ring-[#1B3A8C]'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-[#0B1F4D] truncate">{m.name.split('(')[0]}</span>
              </div>
              <span className="text-[10px] font-semibold text-amber-700 block mb-1">{m.rating}</span>
              <p className="text-[10px] text-gray-500 line-clamp-2">{m.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Clinical Protocol Recommendation */}
      <div
        className={`p-4 rounded-xl border ${
          isDelayedReplantation ? 'bg-red-50/70 border-red-300' : 'bg-emerald-50/70 border-emerald-300'
        }`}
      >
        <div className="flex items-center gap-2 mb-1.5">
          {isDelayedReplantation ? (
            <AlertTriangle className="w-5 h-5 text-red-600" />
          ) : (
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          )}
          <h4 className="font-montserrat font-bold text-sm text-[#0B1F4D]">
            {isDelayedReplantation
              ? 'Protocol: Delayed Replantation (>60 min dry time / non-viable PDL)'
              : 'Protocol: Immediate / Favorable Replantation (<60 min dry time)'}
          </h4>
        </div>

        <div className="text-xs text-gray-700 space-y-1.5 pl-7">
          {isDelayedReplantation ? (
            <>
              <p>
                • <strong>Tooth Root Preparation:</strong> Remove non-viable PDL tissue. Soak root in <strong>2% Sodium Fluoride (NaF) solution for 20 minutes</strong> to slow osseous replacement resorption!
              </p>
              <p>
                • <strong>Endodontic Therapy:</strong> Can be performed extraorally prior to replantation or 7-10 days later.
              </p>
              <p>
                • <strong>Splinting:</strong> Flexible splint for <strong>4 weeks</strong>. Eventual ankylosis is expected; prepare for potential decoronation in adolescents if infraposition &gt;1 mm occurs.
              </p>
            </>
          ) : (
            <>
              <p>
                • <strong>Root Surface Care:</strong> Clean gently with a stream of saline. <strong>DO NOT scrape</strong> root surface!
              </p>
              <p>
                • <strong>Replantation &amp; Splinting:</strong> Replant slowly with digital pressure. Apply <strong>flexible splint for 7 to 14 days</strong>.
              </p>
              <p>
                • <strong>Endodontics ({apexState === 'closed' ? 'Closed Apex' : 'Open Apex'}):</strong>{' '}
                {apexState === 'closed'
                  ? 'Initiate root canal therapy within 7 to 10 days (before splint removal) using Ca(OH)2 to arrest inflammatory resorption.'
                  : 'Delay endodontic therapy. Monitor clinical & radiographic signs of spontaneous pulp revascularization!'}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
