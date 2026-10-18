import React, { useState } from 'react';
import { soundFx } from '../../utils/audio';
import { ShieldCheck, AlertCircle, Pill, Scale, CheckCircle2, XCircle } from 'lucide-react';

export const AhaProphylaxisCalculator: React.FC = () => {
  const [weightKg, setWeightKg] = useState<number>(20);
  const [isPenicillinAllergic, setIsPenicillinAllergic] = useState<boolean>(false);
  const [canTakeOral, setCanTakeOral] = useState<boolean>(true);
  const [selectedProcedure, setSelectedProcedure] = useState<string>('extraction');

  const procedures = [
    { id: 'cleaning', name: 'Dental Cleaning / Scaling (Gingival Bleeding)', requires: true },
    { id: 'extraction', name: 'Surgical Extraction / Flap', requires: true },
    { id: 'distal_shoe', name: 'Distal Shoe Space Maintainer Placement', requires: true },
    { id: 'intraligamentary', name: 'Intraligamentary Injection', requires: true },
    { id: 'incision_drainage', name: 'Incision & Drainage / Endodontic instrumentation', requires: true },
    { id: 'restoration_matrix', name: 'Occlusal Composite / No Bleeding', requires: false },
    { id: 'impression', name: 'Impression Taking / Diagnostic Models', requires: false },
    { id: 'suture_removal', name: 'Suture Removal', requires: false },
  ];

  // Calculations
  // Oral Amoxicillin: 50 mg/kg, max 2g (2000mg)
  const amoxDose = Math.min(weightKg * 50, 2000);
  // Cephalexin: 50 mg/kg, max 2g
  const cephDose = Math.min(weightKg * 50, 2000);
  // Clindamycin: 20 mg/kg, max 600mg
  const clindaDose = Math.min(weightKg * 20, 600);
  // Azithromycin: 15 mg/kg, max 500mg
  const azithroDose = Math.min(weightKg * 15, 500);
  // Ampicillin IV/IM: 50 mg/kg, max 2g
  const ampiDose = Math.min(weightKg * 50, 2000);
  // Cefazolin IV/IM: 50 mg/kg, max 1g
  const cefazDose = Math.min(weightKg * 50, 1000);

  const currentProc = procedures.find((p) => p.id === selectedProcedure);
  const isRequired = currentProc?.requires ?? true;

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#C9A24B]/30 shadow-md">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#1B3A8C]/10 text-[#1B3A8C]">
            <Pill className="w-5 h-5 text-[#1B3A8C]" />
          </div>
          <div>
            <h3 className="font-montserrat font-bold text-base text-[#0B1F4D]">
              AHA Pediatric Antibiotic Prophylaxis Calculator
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              Infective Endocarditis (IE) Prevention Protocol (Lec 3 A.M. p.6)
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-[#C9A24B] bg-[#C9A24B]/10 px-2.5 py-1 rounded-full">
          Single Dose 30-60 min Pre-Op
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Weight Selector */}
        <div className="bg-[#FAF8F3] p-3.5 rounded-xl border border-amber-200/50">
          <label className="text-xs font-bold text-gray-700 flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-[#C9A24B]" />
              Child Weight:
            </span>
            <span className="text-[#1B3A8C] font-extrabold text-sm">{weightKg} kg</span>
          </label>
          <input
            type="range"
            min="5"
            max="60"
            step="1"
            value={weightKg}
            onChange={(e) => {
              setWeightKg(Number(e.target.value));
              soundFx.playClick();
            }}
            className="w-full accent-[#1B3A8C] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-semibold">
            <span>5 kg (Infant)</span>
            <span>20 kg (~5-6 yrs)</span>
            <span>60 kg (Adult cap)</span>
          </div>
        </div>

        {/* Allergy Toggle */}
        <div className="bg-[#FAF8F3] p-3.5 rounded-xl border border-amber-200/50 flex flex-col justify-between">
          <label className="text-xs font-bold text-gray-700 mb-1.5">
            Penicillin / Ampicillin Allergy:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                soundFx.playClick();
                setIsPenicillinAllergic(false);
              }}
              className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                !isPenicillinAllergic
                  ? 'bg-[#1B3A8C] text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              No Allergy
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setIsPenicillinAllergic(true);
              }}
              className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                isPenicillinAllergic
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              Allergic!
            </button>
          </div>
        </div>

        {/* Route Selector */}
        <div className="bg-[#FAF8F3] p-3.5 rounded-xl border border-amber-200/50 flex flex-col justify-between">
          <label className="text-xs font-bold text-gray-700 mb-1.5">
            Administration Route:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                soundFx.playClick();
                setCanTakeOral(true);
              }}
              className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                canTakeOral
                  ? 'bg-[#1B3A8C] text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              Oral (PO)
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setCanTakeOral(false);
              }}
              className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                !canTakeOral
                  ? 'bg-[#1B3A8C] text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              IV / IM
            </button>
          </div>
        </div>
      </div>

      {/* Procedure Risk Checklist */}
      <div className="mb-4">
        <label className="text-xs font-bold text-gray-700 block mb-1.5">
          Select Planned Pediatric Dental Procedure:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {procedures.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                soundFx.playClick();
                setSelectedProcedure(p.id);
              }}
              className={`p-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between border transition-all ${
                selectedProcedure === p.id
                  ? 'border-[#1B3A8C] bg-[#1B3A8C]/5 text-[#0B1F4D] ring-1 ring-[#1B3A8C]'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="truncate pr-2">{p.name}</span>
              {p.requires ? (
                <span className="flex-shrink-0 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Requires Prophylaxis
                </span>
              ) : (
                <span className="flex-shrink-0 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Not Required
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Prescribing Output Box */}
      <div className={`p-4 rounded-xl border ${isRequired ? 'bg-amber-50/60 border-amber-300' : 'bg-green-50/60 border-green-200'}`}>
        {isRequired ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-[#1B3A8C]" />
              <h4 className="font-montserrat font-bold text-sm text-[#0B1F4D]">
                Recommended AHA Prophylactic Prescription:
              </h4>
            </div>

            {!isPenicillinAllergic && canTakeOral && (
              <div className="bg-white p-3 rounded-lg border border-amber-200 shadow-sm">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-extrabold text-[#1B3A8C] text-sm">
                    Amoxicillin (50 mg/kg)
                  </span>
                  <span className="text-lg font-black text-[#C9A24B]">
                    {amoxDose} mg
                  </span>
                </div>
                <p className="text-xs text-gray-600 font-medium">
                  Take single dose of <strong>{amoxDose} mg</strong> orally 30 to 60 minutes before procedure. (Maximum adult cap: 2000 mg).
                </p>
              </div>
            )}

            {isPenicillinAllergic && canTakeOral && (
              <div className="space-y-2">
                <div className="bg-white p-2.5 rounded-lg border border-amber-200">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="font-bold text-[#1B3A8C] text-xs">Option 1: Cephalexin (50 mg/kg)</span>
                    <span className="font-black text-[#C9A24B] text-sm">{cephDose} mg</span>
                  </div>
                  <p className="text-[11px] text-gray-500">Max 2000 mg. (Avoid if anaphylaxis/urticaria to penicillins).</p>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-amber-200">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="font-bold text-[#1B3A8C] text-xs">Option 2: Clindamycin (20 mg/kg)</span>
                    <span className="font-black text-[#C9A24B] text-sm">{clindaDose} mg</span>
                  </div>
                  <p className="text-[11px] text-gray-500">Max 600 mg single oral dose 30-60 min pre-op.</p>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-amber-200">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="font-bold text-[#1B3A8C] text-xs">Option 3: Azithromycin / Clarithromycin (15 mg/kg)</span>
                    <span className="font-black text-[#C9A24B] text-sm">{azithroDose} mg</span>
                  </div>
                  <p className="text-[11px] text-gray-500">Max 500 mg single oral dose 30-60 min pre-op.</p>
                </div>
              </div>
            )}

            {!canTakeOral && !isPenicillinAllergic && (
              <div className="bg-white p-3 rounded-lg border border-amber-200">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-bold text-[#1B3A8C] text-sm">Ampicillin (50 mg/kg IM/IV)</span>
                  <span className="text-lg font-black text-[#C9A24B]">{ampiDose} mg</span>
                </div>
                <p className="text-xs text-gray-600">Administered IM or IV within 30 min before procedure. (Max 2g).</p>
              </div>
            )}

            {!canTakeOral && isPenicillinAllergic && (
              <div className="bg-white p-3 rounded-lg border border-amber-200">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-bold text-[#1B3A8C] text-sm">Cefazolin / Ceftriaxone (50 mg/kg IM/IV)</span>
                  <span className="text-lg font-black text-[#C9A24B]">{cefazDose} mg</span>
                </div>
                <p className="text-xs text-gray-600">Max 1000 mg IM or IV, or Clindamycin 20 mg/kg (max 600 mg IV).</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="font-bold text-xs">No Prophylactic Antibiotic Required for this procedure</p>
              <p className="text-[11px] text-emerald-700">
                Prophylaxis is only recommended for invasive procedures that induce gingival or mucosal bleeding, dental extractions, distal shoe retainers, or intraligamentary injections.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
