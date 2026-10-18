import React, { useState } from 'react';
import { soundFx } from '../../utils/audio';
import { SystemicPatient3D, SystemicConditionKey } from '../3d/SystemicPatient3D';
import { AhaProphylaxisCalculator } from '../tools/AhaProphylaxisCalculator';
import { PlateletRiskGauge } from '../tools/PlateletRiskGauge';
import {
  Heart,
  Activity,
  AlertTriangle,
  Brain,
  ShieldAlert,
  Flame,
  Pill,
  Droplets,
  Zap,
  CheckCircle2,
  Stethoscope,
} from 'lucide-react';

export const LecSystemicSpecialNeeds: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'3d_navigator' | 'aha_calc' | 'platelet_gauge' | 'conditions_directory'>('3d_navigator');
  const [selectedCondition, setSelectedCondition] = useState<SystemicConditionKey>('heart');

  return (
    <div className="space-y-6">
      {/* Lecture Title Hero */}
      <div className="bg-gradient-to-r from-[#0B1F4D] to-[#1B3A8C] rounded-2xl p-6 text-white shadow-xl border border-[#C9A24B]/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A24B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <span className="bg-[#C9A24B] text-[#0B1F4D] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              Lectures 3, 4 &amp; 5 (A.M.) • Pedodontics 5th Year
            </span>
            <span className="text-xs font-semibold text-gray-300">
              Baghdad College of Dentistry • Prof. Dr. Aseel Haidar
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-montserrat tracking-tight mb-2">
            Dental Problems of Children with Special Health Care Needs &amp; Systemic Diseases
          </h2>
          <p className="text-sm text-gray-200 max-w-3xl leading-relaxed">
            Essential clinical protocols: Infective Endocarditis AHA prophylaxis, Hemophilia bleeding risks (never give block anesthesia!), Leukemia platelet counts, Sickle Cell, Asthma, Epilepsy, Diabetes, and Renal Dialysis precautions.
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {(
          [
            ['3d_navigator', '1. 3D Systemic Patient Navigator', Activity],
            ['aha_calc', '2. AHA Antibiotic Prophylaxis Tool', Pill],
            ['platelet_gauge', '3. Platelet Count Clearance Tool', Droplets],
            ['conditions_directory', '4. Complete Systemic Protocols Guide', Stethoscope],
          ] as const
        ).map(([tabId, label, Icon]) => (
          <button
            key={tabId}
            onClick={() => {
              soundFx.playClick();
              setActiveTab(tabId);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === tabId
                ? 'bg-[#1B3A8C] text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Icon className="w-4 h-4 text-[#C9A24B]" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab 1: 3D Systemic Navigator */}
      {activeTab === '3d_navigator' && (
        <div className="space-y-4">
          <SystemicPatient3D
            initialCondition={selectedCondition}
            onConditionSelect={setSelectedCondition}
          />
        </div>
      )}

      {/* Tab 2: AHA Prophylaxis Calculator */}
      {activeTab === 'aha_calc' && (
        <div className="space-y-4">
          <AhaProphylaxisCalculator />
        </div>
      )}

      {/* Tab 3: Platelet Risk Gauge */}
      {activeTab === 'platelet_gauge' && (
        <div className="space-y-4">
          <PlateletRiskGauge />
        </div>
      )}

      {/* Tab 4: Conditions Directory */}
      {activeTab === 'conditions_directory' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Hemophilia & Bleeding */}
          <div className="bg-white p-5 rounded-2xl border border-red-200 shadow-sm space-y-3 text-xs leading-relaxed">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-red-900 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                Hemophilia A, B, C &amp; von Willebrand (Lec 3 &amp; 4 A.M.)
              </span>
              <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                Fatal Anesthesia Risk!
              </span>
            </div>
            <p className="text-gray-700">
              • <strong>Hemophilia A:</strong> Factor VIII deficiency (classic, X-linked recessive, 1 in 5000 males).
              <br />
              • <strong>Hemophilia B:</strong> Factor IX deficiency (Christmas disease, X-linked recessive).
              <br />
              • <strong>Hemophilia C:</strong> Factor XI deficiency (Rosenthal's, autosomal recessive).
              <br />
              • <strong className="text-red-700">CRITICAL RULE:</strong> NEVER administer an <strong>Inferior Alveolar Nerve Block</strong> without factor replacement (&gt;30-40%)! The non-fibrous loose connective vascular tissue in the pterygomandibular space is predisposed to a <strong>dissecting hematoma causing airway obstruction and fatal asphyxia</strong>!
              <br />
              • <strong>Safe local anesthesia:</strong> Local infiltration or Periodontal Ligament (PDL) injections.
              <br />
              • <strong>Avoid Aspirin &amp; NSAIDs:</strong> Strongly inhibit platelet aggregation. Use Acetaminophen (Tylenol) or narcotics.
              <br />
              • <strong>Antifibrinolytic agents:</strong> Tranexamic acid or ε-aminocaproic acid (EACA) prevent local clot lysis in the mouth.
            </p>
          </div>

          {/* Card 2: Infective Endocarditis & Heart */}
          <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-sm space-y-3 text-xs leading-relaxed">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-blue-900 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-blue-600" />
                Congenital Heart Disease &amp; Infective Endocarditis (Lec 3 A.M.)
              </span>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                Cardiac Protocol
              </span>
            </div>
            <p className="text-gray-700">
              • Susceptible children: Congenital heart defects, prosthetic cardiac valves, prior history of endocarditis, or rheumatic heart disease.
              <br />
              • <strong>Prophylaxis:</strong> Amoxicillin 50 mg/kg single oral dose 30-60 min before procedure (max 2g).
              <br />
              • <strong className="text-blue-900">Primary Tooth Pulp Therapy Rule:</strong> Pulp therapy is <strong>NOT recommended for primary teeth with poor prognosis</strong> due to the high incidence of associated chronic odontogenic bacteremia! <strong>Extraction with appropriate fixed space maintainer is preferred!</strong>
            </p>
          </div>

          {/* Card 3: Epilepsy & Seizures */}
          <div className="bg-white p-5 rounded-2xl border border-purple-200 shadow-sm space-y-3 text-xs leading-relaxed">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-purple-900 flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-purple-600" />
                Epilepsy Management &amp; Emergency Seizure Protocol (Lec 3 A.M.)
              </span>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                &gt;3 Min EMS Rule
              </span>
            </div>
            <p className="text-gray-700">
              • Schedule appointments during time of day when seizures are least likely.
              <br />
              • Keep bright light out of child's eyes (allow dark sunglasses). Position patient in upright chair. Low water &amp; high volume suction.
              <br />
              • <strong>Seizure Management:</strong> Remove all dental instruments from the mouth immediately. Clear the area around dental chair. Monitor airway.
              <br />
              • <strong>Emergency Timing:</strong> Note the exact time the seizure began; if seizure continues <strong>&gt; 3 minutes, call EMS immediately</strong>!
              <br />
              • <strong>Oral side effect:</strong> Phenytoin (Dilantin) causes severe <strong>medication-induced gingival hyperplasia</strong>.
            </p>
          </div>

          {/* Card 4: Asthma (Reactive Airway Disease) */}
          <div className="bg-white p-5 rounded-2xl border border-cyan-200 shadow-sm space-y-3 text-xs leading-relaxed">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-cyan-900 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-cyan-600" />
                Asthma &amp; Reactive Airway Disease (Lec 3 A.M.)
              </span>
              <span className="text-[10px] font-bold text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded-full">
                Inhaler Chairside
              </span>
            </div>
            <p className="text-gray-700">
              • Patient must bring rescue bronchodilator inhaler to chairside and take a prophylactic puff before appointment.
              <br />
              • Position in upright chair. Nitrous oxide-oxygen analgesia is safe and beneficial to reduce stress.
              <br />
              • <strong className="text-red-700">CONTRAINDICATED:</strong> <strong>Aspirin and NSAIDs</strong> (approx 4% of asthma patients experience acute bronchospasms), barbiturates and narcotics (potential for histamine release triggering bronchospasm).
            </p>
          </div>

          {/* Card 5: Sickle Cell Anemia */}
          <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-3 text-xs leading-relaxed">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-amber-900 flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-amber-600" />
                Sickle Cell Anemia (SCD) (Lec 4 A.M.)
              </span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                Aplastic Crisis
              </span>
            </div>
            <p className="text-gray-700">
              • Hemoglobin S (HbS) replaces normal HbA, leading to red cell sickling under acidosis, hypoxia, dehydration, hypothermia, or stress.
              <br />
              • <strong>Crisis protocol:</strong> NEVER initiate dental treatment during an active sickle cell crisis.
              <br />
              • <strong>Pre-surgical check:</strong> The level of Hemoglobin S should be investigated before extraction; <strong>HbS should be &lt;30%</strong>!
              <br />
              • Local anesthetics with vasoconstrictor and nitrous oxide are safe, but prevent diffusion hypoxia at completion.
            </p>
          </div>

          {/* Card 6: Viral Hepatitis & HIV / AIDS */}
          <div className="bg-white p-5 rounded-2xl border border-red-200 shadow-sm space-y-3 text-xs leading-relaxed">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-red-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                Viral Hepatitis &amp; HIV Infection Risk to Dental Staff (Lec 4 A.M.)
              </span>
              <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                Needle Stick Risk
              </span>
            </div>
            <p className="text-gray-700">
              • <strong>Accidental Needle Stick Seroconversion Risk:</strong>
              <br />
              - <strong>Hepatitis B (HBV): 30%</strong> (Dentists assume 10x greater risk than general public!). Mandatory HBV vaccine for all dental staff.
              <br />
              - <strong>Hepatitis C (HCV): 3%</strong>
              <br />
              - <strong>HIV: 0.3%</strong>
              <br />
              • <strong>Sterilization:</strong> HIV is inactivated by autoclaving at <strong>121°C for 15 min at 1 atm</strong>, dry heat at 170°C, 0.2% sodium hypochlorite, or 2% glutaraldehyde.
              <br />
              • <strong>Needle Safety:</strong> NEVER recap, bend, or break needles by hand. Dispose immediately into rigid puncture-resistant sharps container.
            </p>
          </div>

          {/* Card 7: Diabetes Mellitus */}
          <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-3 text-xs leading-relaxed">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Diabetes Mellitus Dental Management (Lec 5 A.M.)
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Morning Appointment
              </span>
            </div>
            <p className="text-gray-700">
              • Schedule morning appointments that do not coincide with peak insulin activity. Ensure patient ate breakfast and took normal insulin dose.
              <br />
              • Check blood glucose before treatment: if <strong>&lt; 70 mg/dL</strong>, provide oral fast-acting glucose to avert acute hypoglycemia.
              <br />
              • <strong className="text-red-700">Avoid Aspirin:</strong> Salicylates increase insulin secretion and sensitivity, precipitating hypoglycemia.
              <br />
              • Higher risk of xerostomia, periodontitis, burning tongue, delayed healing, and acetone breath smell.
            </p>
          </div>

          {/* Card 8: Renal Disease & Dialysis */}
          <div className="bg-white p-5 rounded-2xl border border-violet-200 shadow-sm space-y-3 text-xs leading-relaxed">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-violet-900 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-violet-600" />
                Renal Disorders &amp; Dialysis Protocol (Lec 5 A.M.)
              </span>
              <span className="text-[10px] font-bold text-violet-700 bg-violet-100 px-2 py-0.5 rounded-full">
                AV Shunt Precaution
              </span>
            </div>
            <p className="text-gray-700">
              • <strong>AV Shunt Protection:</strong> NEVER measure blood pressure or place IV lines in the arm containing an arteriovenous shunt/fistula!
              <br />
              • <strong>Appointment Timing:</strong> Provide dental treatment on the <strong>day AFTER hemodialysis</strong> (heparin is cleared, metabolic state is optimal).
              <br />
              • <strong className="text-red-700">Nephrotoxic Drugs to Strictly Avoid:</strong> Tetracyclines, Streptomycin, Gentamicin, Vancomycin, Aspirin, NSAIDs, Phenacetin.
              <br />
              • <strong>Safe Antibiotics:</strong> Cloxacillin, Erythromycin, Minocycline.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
