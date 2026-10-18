import React, { useState } from 'react';
import { Activity, Flame, Clock, Droplet, Coffee, Apple, Cookie, ShieldCheck } from 'lucide-react';

export const Lec4Visuals: React.FC = () => {
  const [selectedFood, setSelectedFood] = useState<string>('toffee');
  const [isXerostomic, setIsXerostomic] = useState<boolean>(false);
  const [studyTab, setStudyTab] = useState<'vipeholm' | 'hopewood'>('vipeholm');

  // Food profiles and their impact on the Stephan curve
  const foodProfiles: Record<string, {
    name: string;
    icon: any;
    minPH: number;
    dropTime: number; // minutes
    recoveryTimeNormal: number; // minutes
    recoveryTimeXero: number;
    retentionTime: string;
    risk: 'High' | 'Moderate' | 'Safe' | 'Protective';
    notes: string;
  }> = {
    toffee: {
      name: 'Sticky Toffee / Caramel',
      icon: Cookie,
      minPH: 4.6,
      dropTime: 3,
      recoveryTimeNormal: 50,
      recoveryTimeXero: 110,
      retentionTime: '30 - 45 mins',
      risk: 'High',
      notes: 'High sucrose content + sticky oral retention creates a severe, prolonged acid attack deep within the plaque.'
    },
    soda: {
      name: 'Carbonated Sugary Soda',
      icon: Coffee,
      minPH: 4.8,
      dropTime: 2,
      recoveryTimeNormal: 35,
      recoveryTimeXero: 80,
      retentionTime: '5 mins',
      risk: 'High',
      notes: 'Clears quickly from liquid phase, but intrinsic carbonic and phosphoric acids double the erosive challenge.'
    },
    apple: {
      name: 'Fresh Whole Apple',
      icon: Apple,
      minPH: 5.6,
      dropTime: 5,
      recoveryTimeNormal: 20,
      recoveryTimeXero: 45,
      retentionTime: '8 mins',
      risk: 'Moderate',
      notes: 'Contains intrinsic fructose; chewing vigorously stimulates copious salivary flow and bicarbonate buffering.'
    },
    bread: {
      name: 'Cooked Starch (White Bread)',
      icon: Cookie,
      minPH: 5.3,
      dropTime: 8,
      recoveryTimeNormal: 38,
      recoveryTimeXero: 75,
      retentionTime: '15 - 20 mins',
      risk: 'Moderate',
      notes: 'Salivary amylase breaks starch into maltose & glucose; when combined with sugar, plaque stickiness is heightened.'
    },
    peanuts: {
      name: 'Roasted Peanuts',
      icon: Flame,
      minPH: 6.6,
      dropTime: 5,
      recoveryTimeNormal: 10,
      recoveryTimeXero: 20,
      retentionTime: '10 mins',
      risk: 'Safe',
      notes: 'Negligible fermentable carbohydrate. Rich in fats and proteins that stimulate salivary flow without acid production.'
    },
    cheese: {
      name: 'Aged Cheddar Cheese',
      icon: ShieldCheck,
      minPH: 6.9,
      dropTime: 0,
      recoveryTimeNormal: 5,
      recoveryTimeXero: 10,
      retentionTime: '5 mins',
      risk: 'Protective',
      notes: 'Consuming cheese after sugar halts the pH drop! Rich in casein, calcium, and phosphate that saturate plaque.'
    }
  };

  const currentFood = foodProfiles[selectedFood];
  const recoveryTime = isXerostomic ? currentFood.recoveryTimeXero : currentFood.recoveryTimeNormal;
  const isDemineralizing = currentFood.minPH < 5.5;

  // Generate SVG coordinates for Stephan curve (X: 0 to 60 mins -> 40 to 380 px, Y: pH 4.0 to 7.0 -> 180 to 20 px)
  const mapTimeToX = (m: number) => 40 + (m / 60) * 340;
  const mapPHToY = (ph: number) => 20 + ((7.0 - ph) / (7.0 - 4.0)) * 160;

  const startPt = { x: mapTimeToX(0), y: mapPHToY(6.8) };
  const minPt = { x: mapTimeToX(currentFood.dropTime), y: mapPHToY(currentFood.minPH) };
  const endPt = { x: mapTimeToX(Math.min(60, recoveryTime)), y: mapPHToY(6.8) };

  const curveD = `M ${startPt.x},${startPt.y} Q ${minPt.x},${minPt.y} ${minPt.x + 15},${minPt.y} T ${endPt.x},${endPt.y} ${endPt.x < 380 ? `L 380,${mapPHToY(6.8)}` : ''}`;

  return (
    <div className="space-y-6">
      {/* 2D Visual 1: Interactive Stephan Curve Simulator */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E6E8EC] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E6E8EC] gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0B1F4D] flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#C9A24B]" />
              The Stephan Curve: Real-Time Plaque pH & Demineralization Simulator
            </h3>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Critical threshold pH 5.5: Enamel dissolves whenever the curve stays in the shaded danger zone!
            </p>
          </div>

          {/* Saliva Flow Toggle */}
          <button
            onClick={() => setIsXerostomic(!isXerostomic)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              isXerostomic
                ? 'bg-red-600 text-white border-red-600 shadow-sm'
                : 'bg-[#FAF8F3] text-[#0B1F4D] border-[#E6E8EC] hover:bg-[#E6E8EC]'
            }`}
          >
            <Droplet className={`w-3.5 h-3.5 ${isXerostomic ? 'text-white' : 'text-blue-500'}`} />
            <span>{isXerostomic ? 'Xerostomia / Dry Mouth (Compromised)' : 'Normal Salivary Flow'}</span>
          </button>
        </div>

        {/* Food Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 my-4">
          {Object.entries(foodProfiles).map(([key, item]) => {
            const Icon = item.icon;
            const isSelected = selectedFood === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedFood(key)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-[#0B1F4D] text-white shadow-md border-transparent ring-2 ring-[#C9A24B]'
                    : 'bg-[#FAF8F3] text-slate-700 hover:bg-[#E6E8EC] border-[#E6E8EC]'
                }`}
              >
                <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-[#C9A24B]' : 'text-[#1B3A8C]'}`} />
                <p className="text-xs font-bold truncate leading-snug">{item.name}</p>
                <span className={`text-[10px] font-semibold mt-0.5 block ${
                  item.risk === 'High' ? 'text-red-400' : item.risk === 'Protective' ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {item.risk} Risk
                </span>
              </button>
            );
          })}
        </div>

        {/* The Plotted Stephan Graph SVG */}
        <div className="bg-[#FAF8F3] p-4 rounded-xl border border-[#C9A24B]/30 relative overflow-x-auto">
          <svg viewBox="0 0 420 220" className="w-full max-w-xl mx-auto overflow-visible">
            {/* Grid Lines */}
            {[7.0, 6.5, 6.0, 5.5, 5.0, 4.5].map(ph => (
              <g key={ph}>
                <line x1="40" y1={mapPHToY(ph)} x2="390" y2={mapPHToY(ph)} stroke="#E2E8F0" strokeWidth="1" strokeDasharray={ph === 5.5 ? '4 2' : 'none'} />
                <text x="32" y={mapPHToY(ph) + 4} fontSize="9" textAnchor="end" fill="#64748B" fontWeight="600">
                  {ph.toFixed(1)}
                </text>
              </g>
            ))}

            {/* Critical pH 5.5 Line (Red dashed) & Danger Shaded Zone */}
            <rect x="40" y={mapPHToY(5.5)} width="350" height={mapPHToY(4.0) - mapPHToY(5.5)} fill="rgba(239, 68, 68, 0.08)" />
            <line x1="40" y1={mapPHToY(5.5)} x2="390" y2={mapPHToY(5.5)} stroke="#EF4444" strokeWidth="2" strokeDasharray="5 3" />
            <text x="385" y={mapPHToY(5.5) - 4} fontSize="9" textAnchor="end" fill="#EF4444" fontWeight="bold">
              CRITICAL pH 5.5 (Demineralization Zone)
            </text>

            {/* Time Axis Labels */}
            {[0, 10, 20, 30, 40, 50, 60].map(m => (
              <g key={m}>
                <line x1={mapTimeToX(m)} y1="180" x2={mapTimeToX(m)} y2="185" stroke="#94A3B8" strokeWidth="1" />
                <text x={mapTimeToX(m)} y="198" fontSize="9" textAnchor="middle" fill="#64748B">
                  {m}m
                </text>
              </g>
            ))}

            {/* Plotted Stephan Curve */}
            <path
              d={curveD}
              fill="none"
              stroke={currentFood.risk === 'High' ? '#DC2626' : currentFood.risk === 'Protective' ? '#10B981' : '#D97706'}
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Lowest pH dot */}
            <circle cx={minPt.x} cy={minPt.y} r="5" fill="#0B1F4D" stroke="#C9A24B" strokeWidth="2" />
            <text x={minPt.x} y={minPt.y - 8} fontSize="9" textAnchor="middle" fill="#0B1F4D" fontWeight="bold">
              Min pH: {currentFood.minPH}
            </text>
          </svg>

          {/* Quick Metrics Bar below Graph */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-3 border-t border-[#E6E8EC] text-xs">
            <div className="p-2.5 bg-white rounded-lg border border-[#E6E8EC]">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Minimum Plaque pH</span>
              <span className={`text-base font-extrabold font-mono ${isDemineralizing ? 'text-red-600' : 'text-emerald-600'}`}>
                pH {currentFood.minPH}
              </span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-[#E6E8EC]">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Acid Attack Duration</span>
              <span className="text-base font-extrabold font-mono text-[#0B1F4D]">
                {recoveryTime} Minutes
              </span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-[#E6E8EC]">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Oral Retention Time</span>
              <span className="text-base font-extrabold font-mono text-[#1B3A8C]">
                {currentFood.retentionTime}
              </span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-[#E6E8EC]">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Enamel Outcome</span>
              <span className={`text-xs font-extrabold block mt-1 ${isDemineralizing ? 'text-red-600' : 'text-emerald-700'}`}>
                {isDemineralizing ? 'Active Demineralization!' : 'Enamel Intact / Saturated'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2D Visual 2: Landmark Studies Comparator (Vipeholm vs Hopewood House) */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E6E8EC] shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-[#E6E8EC]">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0B1F4D] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#C9A24B]" />
              Landmark Dietary Clinical Trials: Vipeholm & Hopewood House
            </h3>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              The foundational epidemiological evidence establishing carbohydrate cariogenicity
            </p>
          </div>
        </div>

        {/* Study Tabs */}
        <div className="flex rounded-xl bg-[#E6E8EC] p-1 max-w-md my-4">
          <button
            onClick={() => setStudyTab('vipeholm')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              studyTab === 'vipeholm' ? 'bg-[#0B1F4D] text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            The Vipeholm Study (Sweden, 1945-1953)
          </button>
          <button
            onClick={() => setStudyTab('hopewood')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              studyTab === 'hopewood' ? 'bg-[#C9A24B] text-[#0B1F4D] shadow-xs' : 'text-slate-600'
            }`}
          >
            Hopewood House (Australia)
          </button>
        </div>

        {studyTab === 'vipeholm' ? (
          <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#C9A24B]/30 space-y-3 animate-in fade-in">
            <h4 className="font-bold text-sm text-[#0B1F4D]">
              Vipeholm Mental Hospital Clinical Investigation: Frequency vs Form
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-[#E6E8EC]">
                <strong className="text-emerald-700 block mb-1">Finding 1: Mealtime Sugars</strong>
                Sugar ingested even in large amounts at meals (up to 4 times a day) produced only small increases in caries increment.
              </div>
              <div className="p-3 bg-white rounded-lg border border-red-200">
                <strong className="text-red-700 block mb-1">Finding 2: Between-Meal Sticky Sweets</strong>
                Consuming sticky toffees between meals caused a dramatic, steep surge in decayed surfaces.
              </div>
              <div className="p-3 bg-white rounded-lg border border-[#E6E8EC]">
                <strong className="text-blue-700 block mb-1">Finding 3: Reversibility</strong>
                Upon withdrawal of sticky between-meal sweets, caries activity dropped immediately back to baseline.
              </div>
              <div className="p-3 bg-white rounded-lg border border-[#E6E8EC]">
                <strong className="text-[#C9A24B] block mb-1">Finding 4: Individual Variation</strong>
                Wide variance observed in individual host saliva buffering and oral clearance rates.
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#C9A24B]/30 space-y-3 animate-in fade-in">
            <h4 className="font-bold text-sm text-[#0B1F4D]">
              Hopewood House Orphanage (Australia): Sugar Deprivation & Teeth Immunity Myth
            </h4>
            <div className="p-3 bg-white rounded-lg border border-[#E6E8EC] text-xs text-slate-700 space-y-2">
              <p>
                <strong>The Experiment:</strong> Children residing in Hopewood House were fed a strict vegetarian diet excluding refined sugar and refined white flour from birth through age 11.
              </p>
              <p>
                <strong>Childhood Findings:</strong> Dental surveys of children aged 5-11 showed near-zero DMFT compared to Australian state school peers who consumed ordinary western diets.
              </p>
              <p className="p-2.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 font-medium">
                <strong>Crucial Discovery:</strong> When children grew old enough (age 12+) to leave the orphanage and earn wages, they adopted typical commercial sugary foods. Their DMFT shot up steeply, demonstrating that <strong>teeth did NOT acquire any permanent structural immunity</strong> against dental caries!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
