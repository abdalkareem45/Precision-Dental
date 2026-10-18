/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PatientCase, AngleClass, BsiIncisorClass, SkeletalClass } from '../../types/ortho';
import confetti from 'canvas-confetti';
import {
  Stethoscope,
  User,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  FileText,
  ChevronRight,
  Sparkles,
  RotateCcw
} from 'lucide-react';

const PATIENT_CASES: PatientCase[] = [
  {
    id: 'case_1',
    patientName: 'Sarah M.',
    age: 14,
    gender: 'Female',
    occupation: 'Secondary School Student',
    chiefComplaint: 'My upper front teeth stick out, I get teased at school, and I find it awkward to close my lips.',
    medicalHistory: 'Fit and well. No known allergies. No cardiac or bleeding disorders.',
    dentalHistory: 'Regular check-ups. No previous orthodontic treatment. No history of dental trauma.',
    habits: 'Digit-sucking habit until age 9. No current nail biting.',
    growthStatus: 'Pubertal growth spurt actively progressing (menarche 6 months ago).',
    extraoralFindings: {
      facialConvexity: 'Increased facial convexity (Convex profile, angle 22°)',
      ruleOfThirds: 'Mild increase in lower third facial height',
      mandibularPlane: 'Slightly high mandibular plane angle (intersects slightly anterior to occiput)',
      transverseSymmetry: 'Symmetrical, midlines aligned',
      smileArc: 'Consonant smile arc parallel to lower lip',
      lipCompetence: 'potentially_competent',
      nasolabialAngle: 96,
    },
    intraoralFindings: {
      molarClass: 'Angle Class II bilateral (mandibular molar distal by 4mm)',
      canineClass: 'Class II canine bilateral',
      overjet: 9.0,
      overbite: 'Deep incomplete overbite (approx 65% overlap)',
      crowdingSpacing: 'Mild lower anterior crowding (2mm)',
      curveOfSpee: 'Exaggerated curve of Spee (3.5mm)',
    },
    correctDiagnosis: {
      molarClass: 'class_ii',
      incisorClass: 'class_ii_div1',
      skeletalClass: 'class_ii',
      keyIssues: [
        'Class II division 1 malocclusion with severe 9mm overjet',
        'Skeletal Class II base due to mandibular retrognathia',
        'Potentially competent lips obstructed by proclined upper incisors',
        'Exaggerated curve of Spee requiring leveling',
      ],
      consentConsiderations: 'Patient is 14; assess Gillick competence and obtain written parental and patient consent with realistic duration estimate.',
    },
  },
  {
    id: 'case_2',
    patientName: 'Omar K.',
    age: 19,
    gender: 'Male',
    occupation: 'Engineering University Student',
    chiefComplaint: 'My bottom teeth are biting in front of my upper teeth and I cannot chew sandwiches properly.',
    medicalHistory: 'No medical conditions. No routine medications. Non-smoker.',
    dentalHistory: 'Sound dentition, excellent oral hygiene, all third molars erupted.',
    habits: 'No abnormal oral habits.',
    growthStatus: 'Growth complete (patient is 19 years old).',
    extraoralFindings: {
      facialConvexity: 'Marked concave facial profile (angle 3°)',
      ruleOfThirds: 'Normal upper and middle thirds, prominent lower third chin projection',
      mandibularPlane: 'Average to low mandibular plane angle',
      transverseSymmetry: 'Mild right chin deviation (1.5mm)',
      smileArc: 'Reverse smile arc with reduced upper incisor display',
      lipCompetence: 'competent',
      nasolabialAngle: 108,
    },
    intraoralFindings: {
      molarClass: 'Angle Class III bilateral (mandibular molar mesial by 5mm)',
      canineClass: 'Class III canine bilateral',
      overjet: -3.0,
      overbite: 'Reduced overbite (edge-to-edge tendency, 1mm)',
      crowdingSpacing: 'Mild upper anterior crowding, spaced lower arch',
      curveOfSpee: 'Flat curve of Spee (0.5mm)',
    },
    correctDiagnosis: {
      molarClass: 'class_iii',
      incisorClass: 'class_iii',
      skeletalClass: 'class_iii',
      keyIssues: [
        'Angle Class III malocclusion with negative overjet (-3mm anterior crossbite)',
        'Skeletal Class III base (mandibular prognathism / maxillary deficiency)',
        'Reverse smile arc with poor incisal display',
        'Completed somatic growth (growth modification is no longer viable)',
      ],
      consentConsiderations: 'Full adult consent (19 years old). Discuss surgical orthodontics (orthognathic surgery) vs orthodontic camouflage.',
    },
  },
  {
    id: 'case_3',
    patientName: 'Noor H.',
    age: 12,
    gender: 'Female',
    occupation: 'Primary School Student',
    chiefComplaint: 'My teeth are very crooked and overlapping, food always gets caught between them.',
    medicalHistory: 'History of congenital mitral valve disease with mild regurgitation.',
    dentalHistory: 'High caries risk in past, currently stabilized with fluoridated varnish. Generalized mild gingival inflammation.',
    habits: 'Intermittent pencil biting.',
    growthStatus: 'Pre-pubertal growth stage.',
    extraoralFindings: {
      facialConvexity: 'Straight, harmonious orthognathic profile (angle 13°)',
      ruleOfThirds: 'Harmonious facial thirds (1:1:1)',
      mandibularPlane: 'Normal mandibular plane angle (intersects at occiput)',
      transverseSymmetry: 'Well-aligned facial midline and symmetrical transverse fifths',
      smileArc: 'Consonant smile arc',
      lipCompetence: 'competent',
      nasolabialAngle: 102,
    },
    intraoralFindings: {
      molarClass: 'Angle Class I bilateral (MB cusp in buccal groove)',
      canineClass: 'Class I canine bilateral',
      overjet: 3.0,
      overbite: 'Normal 1/3 coverage of lower incisors (2.5mm)',
      crowdingSpacing: 'Severe maxillary crowding (7.5mm arch perimeter deficiency) and moderate mandibular crowding (5mm)',
      curveOfSpee: 'Normal (1.5mm)',
    },
    correctDiagnosis: {
      molarClass: 'class_i',
      incisorClass: 'class_i',
      skeletalClass: 'class_i',
      keyIssues: [
        'Angle Class I malocclusion with severe arch length discrepancy',
        'Skeletal Class I harmonious base',
        'Cardiac anomaly requiring antibiotic prophylaxis assessment prior to band placement/extractions if bleeding anticipated',
        'Gingival inflammation must be fully stabilized before bonding fixed appliances',
      ],
      consentConsiderations: 'Age 12; parental consent required. Detailed discussion of potential premolar extractions vs non-extraction arch expansion.',
    },
  },
];

export const ClinicalCaseSimulator: React.FC = () => {
  const [selectedCaseIndex, setSelectedCaseIndex] = useState<number>(0);
  const activeCase = PATIENT_CASES[selectedCaseIndex];

  const [userMolarClass, setUserMolarClass] = useState<AngleClass | ''>('');
  const [userIncisorClass, setUserIncisorClass] = useState<BsiIncisorClass | ''>('');
  const [userSkeletalClass, setUserSkeletalClass] = useState<SkeletalClass | ''>('');
  const [hasEvaluated, setHasEvaluated] = useState<boolean>(false);

  const handleCaseChange = (idx: number) => {
    setSelectedCaseIndex(idx);
    setUserMolarClass('');
    setUserIncisorClass('');
    setUserSkeletalClass('');
    setHasEvaluated(false);
  };

  const handleEvaluate = () => {
    setHasEvaluated(true);
    const isMolarCorrect = userMolarClass === activeCase.correctDiagnosis.molarClass;
    const isIncisorCorrect = userIncisorClass === activeCase.correctDiagnosis.incisorClass;
    const isSkeletalCorrect = userSkeletalClass === activeCase.correctDiagnosis.skeletalClass;

    if (isMolarCorrect && isIncisorCorrect && isSkeletalCorrect) {
      confetti({
        particleCount: 85,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#0B1F4D', '#1B3A8C', '#C9A24B', '#DFC17B'],
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 sm:p-8 rounded-3xl border border-[#C9A24B]/30 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#DFC17B] uppercase tracking-wider">
            <Stethoscope className="w-4 h-4 text-[#C9A24B]" />
            <span>Clinical Orthodontics Case Station</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mt-1">
            Virtual Patient Diagnostic & Treatment Planning Station
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Synthesize full case records, 3-plane extraoral findings, and occlusion data to establish prioritized orthodontic problem lists.
          </p>
        </div>

        {/* Case Switcher Tabs */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          {PATIENT_CASES.map((c, i) => (
            <button
              key={c.id}
              onClick={() => handleCaseChange(i)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCaseIndex === i
                  ? 'bg-gradient-to-r from-[#C9A24B] to-[#B8892E] text-[#071330] shadow-md font-extrabold'
                  : 'glass-panel-subtle text-slate-300 hover:text-white border border-white/5'
              }`}
            >
              Case {i + 1}: {c.patientName}
            </button>
          ))}
        </div>
      </div>

      {/* Patient Dossier Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Patient Case History */}
        <div className="glass-panel rounded-2xl border border-[#C9A24B]/30 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#DFC17B]" />
              <h3 className="text-sm font-bold text-white">{activeCase.patientName}</h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {activeCase.age} yrs · {activeCase.gender}
            </span>
          </div>

          <div className="space-y-3 text-xs leading-relaxed text-slate-300">
            <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-500/40">
              <strong className="text-amber-300 block mb-1">Chief Complaint (Patient Words):</strong>
              "{activeCase.chiefComplaint}"
            </div>

            <div className="p-3 bg-[#071330]/70 rounded-xl border border-white/10">
              <strong className="text-[#DFC17B] block mb-0.5">Medical History:</strong>
              <p className="text-slate-300">{activeCase.medicalHistory}</p>
            </div>

            <div className="p-3 bg-[#071330]/70 rounded-xl border border-white/10">
              <strong className="text-[#DFC17B] block mb-0.5">Dental & Habit History:</strong>
              <p className="text-slate-300">{activeCase.dentalHistory}</p>
              <p className="text-slate-300 mt-1"><strong>Habits:</strong> {activeCase.habits}</p>
            </div>

            <div className="p-3 bg-[#071330]/70 rounded-xl border border-white/10">
              <strong className="text-[#DFC17B] block mb-0.5">Physical Growth Status:</strong>
              <p className="text-slate-300">{activeCase.growthStatus}</p>
            </div>
          </div>
        </div>

        {/* Center Column: Extraoral & Intraoral Findings */}
        <div className="glass-panel rounded-2xl border border-[#C9A24B]/30 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-white">Clinical Examination Findings</h3>
            <span className="text-[10px] font-bold text-[#DFC17B] uppercase tracking-wider">3 Planes</span>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3 bg-[#071330]/70 rounded-xl border border-white/10 space-y-1.5">
              <strong className="text-[#60A5FA] block uppercase tracking-wide text-[10px]">Extraoral Findings:</strong>
              <div><strong>Profile & Convexity:</strong> {activeCase.extraoralFindings.facialConvexity}</div>
              <div><strong>Rule of Thirds:</strong> {activeCase.extraoralFindings.ruleOfThirds}</div>
              <div><strong>Mandibular Plane:</strong> {activeCase.extraoralFindings.mandibularPlane}</div>
              <div><strong>Transverse Symmetry:</strong> {activeCase.extraoralFindings.transverseSymmetry}</div>
              <div><strong>Lip Competence:</strong> <span className="capitalize">{activeCase.extraoralFindings.lipCompetence.replace('_', ' ')}</span></div>
              <div><strong>Nasolabial Angle:</strong> {activeCase.extraoralFindings.nasolabialAngle}°</div>
            </div>

            <div className="p-3 bg-[#071330]/70 rounded-xl border border-white/10 space-y-1.5">
              <strong className="text-[#60A5FA] block uppercase tracking-wide text-[10px]">Intraoral & Occlusal Findings:</strong>
              <div><strong>Molar Relationship:</strong> {activeCase.intraoralFindings.molarClass}</div>
              <div><strong>Canine Relationship:</strong> {activeCase.intraoralFindings.canineClass}</div>
              <div className="flex justify-between bg-white/5 p-2 rounded border border-white/10 font-bold">
                <span>Overjet: <span className="text-[#DFC17B]">{activeCase.intraoralFindings.overjet} mm</span></span>
                <span>Overbite: <span className="text-cyan-400">{activeCase.intraoralFindings.overbite}</span></span>
              </div>
              <div><strong>Arch Spacing/Crowding:</strong> {activeCase.intraoralFindings.crowdingSpacing}</div>
              <div><strong>Curve of Spee:</strong> {activeCase.intraoralFindings.curveOfSpee}</div>
            </div>
          </div>
        </div>

        {/* Right Column: Diagnostic Form */}
        <div className="glass-panel rounded-2xl border-2 border-[#C9A24B] p-6 shadow-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-[#C9A24B]/30 pb-2">
              <span className="text-[10px] font-bold text-[#DFC17B] uppercase tracking-wider block">Student Diagnosis</span>
              <h3 className="text-base font-bold text-white">Formulate Clinical Classification</h3>
            </div>

            {/* Select Angle Class */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">Angle's Molar Classification:</label>
              <select
                value={userMolarClass}
                onChange={(e) => setUserMolarClass(e.target.value as AngleClass)}
                className="w-full text-xs p-2.5 rounded-xl border border-white/20 bg-[#071330] text-white font-medium"
              >
                <option value="">Select Angle Class...</option>
                <option value="class_i">Angle Class I</option>
                <option value="class_ii">Angle Class II</option>
                <option value="class_iii">Angle Class III</option>
              </select>
            </div>

            {/* Select BSI Incisor Class */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">BSI Incisor Classification:</label>
              <select
                value={userIncisorClass}
                onChange={(e) => setUserIncisorClass(e.target.value as BsiIncisorClass)}
                className="w-full text-xs p-2.5 rounded-xl border border-white/20 bg-[#071330] text-white font-medium"
              >
                <option value="">Select BSI Incisor Class...</option>
                <option value="class_i">Class I Incisor</option>
                <option value="class_ii_div1">Class II Division 1</option>
                <option value="class_ii_div2">Class II Division 2</option>
                <option value="class_iii">Class III Incisor</option>
              </select>
            </div>

            {/* Select Skeletal Class */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">Underlying Skeletal Base:</label>
              <select
                value={userSkeletalClass}
                onChange={(e) => setUserSkeletalClass(e.target.value as SkeletalClass)}
                className="w-full text-xs p-2.5 rounded-xl border border-white/20 bg-[#071330] text-white font-medium"
              >
                <option value="">Select Skeletal Class...</option>
                <option value="class_i">Skeletal Class I (Orthognathic)</option>
                <option value="class_ii">Skeletal Class II (Retrognathic Mandible)</option>
                <option value="class_iii">Skeletal Class III (Prognathic Mandible)</option>
              </select>
            </div>

            <button
              onClick={handleEvaluate}
              disabled={!userMolarClass || !userIncisorClass || !userSkeletalClass}
              className="w-full py-3 bg-gradient-to-r from-[#C9A24B] to-[#B8892E] hover:from-[#DFC17B] hover:to-[#C9A24B] disabled:opacity-40 text-[#071330] text-xs font-black uppercase tracking-wider rounded-xl shadow-lg transition-all"
            >
              Verify Diagnosis & Problem List
            </button>
          </div>

          {/* Feedback */}
          {hasEvaluated && (
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex items-center gap-2">
                {userMolarClass === activeCase.correctDiagnosis.molarClass &&
                userIncisorClass === activeCase.correctDiagnosis.incisorClass &&
                userSkeletalClass === activeCase.correctDiagnosis.skeletalClass ? (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Accurate Orthodontic Diagnosis!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span>Review Clinical Findings:</span>
                  </div>
                )}
              </div>

              <div className="p-3 bg-[#071330] rounded-xl border border-white/10 space-y-2 text-[11px] text-slate-300">
                <div>
                  <strong className="text-white">Key Diagnostic Elements:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-300">
                    {activeCase.correctDiagnosis.keyIssues.map((issue, idx) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                </div>
                <div className="pt-2 border-t border-white/5">
                  <strong className="text-[#DFC17B]">Consent Consideration:</strong>
                  <p className="text-slate-300 mt-0.5">{activeCase.correctDiagnosis.consentConsiderations}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
