import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { soundFx } from '../../utils/audio';
import { QuizCase } from '../../types';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Award,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const GrandRoundsQuiz: React.FC = () => {
  const cases: QuizCase[] = [
    {
      id: 'case1',
      title: 'Emergency Avulsion with Open Apex',
      patientAge: '8-Year-Old Boy',
      presentation: 'Maxillary right permanent central incisor completely avulsed playing soccer 25 minutes ago. Stored in a cup of cold pasteurized milk. Radiograph shows wide blunderbuss canal with open divergent apex.',
      question: 'According to Baghdad College Pedodontics trauma protocols, what is the correct immediate management?',
      options: [
        {
          id: 'a',
          text: 'Perform immediate extraoral pulpectomy and obturate canal with gutta-percha before replanting.',
          isCorrect: false,
          explanation: 'Incorrect. In an immature open-apex tooth with short extraoral time (<60 min), pulpectomy should NOT be performed immediately because spontaneous revascularization is possible!',
        },
        {
          id: 'b',
          text: 'Rinse gently with sterile saline, replant slowly with digital pressure, apply flexible splint for 7-14 days, and monitor for spontaneous pulp revascularization.',
          isCorrect: true,
          explanation: 'Correct! The tooth has an open apex and short extraoral time in physiological cold milk. Replant gently, apply a passive flexible splint for 7-14 days, and monitor closely for revascularization without immediate pulpectomy.',
        },
        {
          id: 'c',
          text: 'Soak the root in 2% sodium fluoride for 20 minutes, perform apexification, and apply a rigid splint.',
          isCorrect: false,
          explanation: 'Incorrect. 2% NaF soaking is reserved for delayed replantation (>60 min dry time) with necrotic PDL cells. Rigid splints promote ankylosis and are detrimental in avulsion.',
        },
        {
          id: 'd',
          text: 'Do not replant because replantation of avulsed teeth in children always results in rapid ankylosis.',
          isCorrect: false,
          explanation: 'Incorrect. Permanent teeth must always be replanted unless severe medical contraindications exist. Only deciduous primary teeth are never replanted.',
        },
      ],
    },
    {
      id: 'case2',
      title: 'Hemophilia A Anesthesia Hazard',
      patientAge: '7-Year-Old Male',
      presentation: 'Diagnosed with severe Hemophilia A (Factor VIII deficiency <1%). Deep occlusal dentin caries on mandibular left second primary molar requiring restorative therapy.',
      question: 'Which local anesthesia technique is STRICTLY CONTRAINDICATED without factor replacement therapy, and why?',
      options: [
        {
          id: 'a',
          text: 'Local infiltration because it causes rapid bone necrosis.',
          isCorrect: false,
          explanation: 'Incorrect. Infiltration anesthesia is generally safe and can be administered without factor concentrate replacement.',
        },
        {
          id: 'b',
          text: 'Periodontal ligament (PDL) injection because it damages the gingival margin.',
          isCorrect: false,
          explanation: 'Incorrect. PDL intraligamentary injections are safe and recommended when factor replacement is unavailable.',
        },
        {
          id: 'c',
          text: 'Inferior Alveolar Nerve Block because loose vascular tissue in the pterygomandibular space can develop a dissecting hematoma causing fatal airway asphyxia.',
          isCorrect: true,
          explanation: 'Correct! (Lec 3 A.M. p.8 & Lec 4 A.M. p.2) Block anesthesia into the loose, highly vascular pterygomandibular tissue is predisposed to dissecting hematomas that can compress the airway and cause life-threatening asphyxiation!',
        },
        {
          id: 'd',
          text: 'Topical benzocaine gel because of methemoglobinemia risk in factor VIII deficiency.',
          isCorrect: false,
          explanation: 'Incorrect. Topical anesthetics are entirely safe in hemophilia.',
        },
      ],
    },
    {
      id: 'case3',
      title: 'Primary Tooth Intrusion Dilemma',
      patientAge: '2.5-Year-Old Toddler',
      presentation: 'Fell against a wooden coffee table. The maxillary primary central incisor is intruded deep into the alveolar socket. A lateral extraoral radiograph demonstrates that the intruded primary root apex is displaced lingually into the follicle of the unerupted permanent central incisor.',
      question: 'What is the mandatory clinical action?',
      options: [
        {
          id: 'a',
          text: 'Wait and watch for 3 to 4 weeks for spontaneous re-eruption.',
          isCorrect: false,
          explanation: 'Incorrect. While spontaneous re-eruption is the standard approach for primary intrusion, encroachment upon the developing permanent tooth germ is the critical absolute exception!',
        },
        {
          id: 'b',
          text: 'Extract the intruded primary incisor immediately to prevent permanent successor hypoplasia or dilaceration.',
          isCorrect: true,
          explanation: 'Correct! (Lec 10 p.1) If the primary root is displaced lingually/palatally into or encroaching upon the developing permanent tooth bud, it must be removed immediately to protect the successor from irreversible hypoplasia or dilaceration!',
        },
        {
          id: 'c',
          text: 'Reposition the primary tooth with forceps and apply a rigid wire splint for 4 weeks.',
          isCorrect: false,
          explanation: 'Incorrect. Splinting is almost impossible and contraindicated in a 2.5-year-old with primary intrusion.',
        },
        {
          id: 'd',
          text: 'Perform immediate pulpotomy through the incisal edge while the tooth is submerged.',
          isCorrect: false,
          explanation: 'Incorrect. Pulpotomy on an intruded primary tooth encroaching on a permanent germ is improper.',
        },
      ],
    },
    {
      id: 'case4',
      title: 'Complicated Crown Fracture in Immature Tooth',
      patientAge: '9-Year-Old Girl',
      presentation: 'Bicycle accident 3 hours ago. Fractured maxillary permanent central incisor with a 1.5 mm vital bleeding pulp exposure. Root development is incomplete with wide open apex (Stage 3).',
      question: 'What is the procedure of choice to achieve apexogenesis?',
      options: [
        {
          id: 'a',
          text: 'Immediate conventional root canal filling with gutta-percha and sealer.',
          isCorrect: false,
          explanation: 'Incorrect. Gutta-percha condensation is impossible in an open blunderbuss canal and would arrest physiological root lengthening.',
        },
        {
          id: 'b',
          text: 'Cvek Shallow Pulpotomy (amputate 1-2 mm of coronal pulp, achieve hemostasis, cover with MTA or Ca(OH)₂).',
          isCorrect: true,
          explanation: 'Correct! (Lec 8 p.2) In young permanent teeth with open apices, a Cvek shallow pulpotomy removes only the superficial 1-2 mm inflamed pulp, preserving the vital radicular pulp to continue normal root development and apical closure (Apexogenesis).',
        },
        {
          id: 'c',
          text: 'Direct pulp capping with zinc oxide-eugenol cement.',
          isCorrect: false,
          explanation: 'Incorrect. ZOE causes cytotoxic pulp necrosis when placed directly on exposed pulp tissue.',
        },
        {
          id: 'd',
          text: 'Complete extraction and replacement with a dental implant.',
          isCorrect: false,
          explanation: 'Incorrect. Dental implants are strictly contraindicated in growing children.',
        },
      ],
    },
    {
      id: 'case5',
      title: 'Infective Endocarditis Prophylaxis Dosing',
      patientAge: '6-Year-Old Boy',
      presentation: 'Patient has a history of repaired Tetralogy of Fallot with residual defect. Weighs 20 kg. Needs dental extraction of an abscessed primary first molar. No drug allergies.',
      question: 'What is the correct prophylactic antibiotic agent and dose according to AHA guidelines?',
      options: [
        {
          id: 'a',
          text: 'Amoxicillin 250 mg orally 2 hours after procedure.',
          isCorrect: false,
          explanation: 'Incorrect. The dose is 50 mg/kg (1000 mg for 20 kg), administered 30 to 60 minutes BEFORE the procedure.',
        },
        {
          id: 'b',
          text: 'Amoxicillin 1000 mg (1.0 g) orally as a single dose 30 to 60 minutes before the procedure.',
          isCorrect: true,
          explanation: 'Correct! (Lec 3 A.M. p.6) AHA guideline is Amoxicillin 50 mg/kg single oral dose 30-60 minutes prior. For a 20 kg child: 20 × 50 mg = 1000 mg (1.0 g).',
        },
        {
          id: 'c',
          text: 'Clindamycin 600 mg orally.',
          isCorrect: false,
          explanation: 'Incorrect. Clindamycin is for penicillin-allergic patients (20 mg/kg = 400 mg for 20 kg).',
        },
        {
          id: 'd',
          text: 'No antibiotic prophylaxis is needed for deciduous tooth extractions.',
          isCorrect: false,
          explanation: 'Incorrect. Extractions induce significant bacteremia and mandate prophylaxis in high-risk cardiac patients.',
        },
      ],
    },
    {
      id: 'case6',
      title: 'Acute Leukemia Platelet Threshold',
      patientAge: '5-Year-Old Patient',
      presentation: 'Currently undergoing chemotherapy for Acute Lymphoblastic Leukemia (ALL). The morning complete blood count reveals a platelet level of 18,000 / mm³. The child complains of an aching tooth.',
      question: 'How should dental treatment be managed according to pedodontic leukemia protocols?',
      options: [
        {
          id: 'a',
          text: 'Proceed with routine restorative cavity preparation and inferior alveolar block.',
          isCorrect: false,
          explanation: 'Incorrect. At <20,000 platelets, spontaneous hemorrhaging is imminent; blocks are dangerous.',
        },
        {
          id: 'b',
          text: 'Perform immediate pulpotomy with formocresol on the primary tooth.',
          isCorrect: false,
          explanation: 'Incorrect. Pulp therapy on primary teeth is strictly contraindicated in all leukemia patients due to severe chronic infection risks.',
        },
        {
          id: 'c',
          text: 'No dental treatment should be performed without a preceding prophylactic platelet transfusion; substitute toothbrushing with moist gauze wipes.',
          isCorrect: true,
          explanation: 'Correct! (Lec 4 A.M. p.9) If platelet count is <20,000/mm³, spontaneous hemorrhaging occurs. No dental procedures can be done without a prophylactic platelet transfusion. Discontinue toothbrushing and use moist gauze wipes.',
        },
        {
          id: 'd',
          text: 'Prescribe high-dose aspirin for pain and reschedule in 2 days.',
          isCorrect: false,
          explanation: 'Incorrect. Aspirin is strictly contraindicated because it impairs platelet function.',
        },
      ],
    },
  ];

  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const currentCase = cases[currentIdx];

  const handleSelectOption = (optId: string) => {
    if (selectedOption !== null) return;
    setSelectedOption(optId);

    const opt = currentCase.options.find((o) => o.id === optId);
    if (opt?.isCorrect) {
      soundFx.playSuccess();
      setScore((prev) => prev + 1);
    } else {
      soundFx.playError();
    }
  };

  const handleNext = () => {
    soundFx.playClick();
    if (currentIdx + 1 < cases.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleRestart = () => {
    soundFx.playClick();
    setCurrentIdx(0);
    setSelectedOption(null);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="space-y-6">
      {/* Quiz Header */}
      <div className="bg-gradient-to-r from-[#0B1F4D] to-[#1B3A8C] rounded-2xl p-6 text-white shadow-xl border border-[#C9A24B]/30 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <span className="bg-[#C9A24B] text-[#0B1F4D] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            Pediatric Dental Grand Rounds • Case Simulator
          </span>
          <span className="text-xs font-bold text-amber-200">
            Cases: {cases.length} Total Clinical Scenarios
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold font-montserrat tracking-tight mb-2">
          Interactive Pedodontic Clinical Grand Rounds
        </h2>
        <p className="text-sm text-gray-200 max-w-3xl leading-relaxed">
          Test your clinical decision-making across emergency trauma protocols, dental luxation, medical emergencies, systemic disease contraindications, and pediatric dosages.
        </p>
      </div>

      {!isFinished ? (
        <div className="bg-white rounded-2xl p-6 border border-[#C9A24B]/30 shadow-md">
          {/* Progress bar */}
          <div className="flex items-center justify-between mb-4 text-xs font-bold text-gray-500">
            <span>
              Case {currentIdx + 1} of {cases.length}: {currentCase.title}
            </span>
            <span className="text-[#1B3A8C] font-extrabold">
              Current Score: {score} / {currentIdx}
            </span>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-2 mb-6 overflow-hidden">
            <div
              className="bg-[#C9A24B] h-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / cases.length) * 100}%` }}
            />
          </div>

          {/* Patient Card */}
          <div className="bg-[#FAF8F3] p-4 rounded-xl border border-amber-200/50 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-[#1B3A8C] bg-white px-2.5 py-1 rounded-lg border border-gray-200">
                Patient: {currentCase.patientAge}
              </span>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed font-medium">
              {currentCase.presentation}
            </p>
          </div>

          {/* Question */}
          <h3 className="font-extrabold text-sm sm:text-base text-[#0B1F4D] mb-4">
            {currentCase.question}
          </h3>

          {/* Options */}
          <div className="space-y-2.5 mb-6">
            {currentCase.options.map((opt) => {
              const isChosen = selectedOption === opt.id;
              const hasAnswered = selectedOption !== null;

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  disabled={hasAnswered}
                  className={`w-full p-3.5 rounded-xl text-left text-xs font-semibold border transition-all flex items-start gap-3 ${
                    !hasAnswered
                      ? 'border-gray-200 hover:border-[#1B3A8C] hover:bg-gray-50 text-gray-700'
                      : opt.isCorrect
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500'
                      : isChosen
                      ? 'border-red-500 bg-red-50 text-red-950 ring-2 ring-red-500'
                      : 'border-gray-200 opacity-50 text-gray-500'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 uppercase ${
                      !hasAnswered
                        ? 'bg-gray-100 text-gray-700'
                        : opt.isCorrect
                        ? 'bg-emerald-600 text-white'
                        : isChosen
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {opt.id}
                  </span>
                  <div className="flex-1">
                    <span>{opt.text}</span>
                    {hasAnswered && isChosen && (
                      <p className="mt-2 text-[11px] pt-2 border-t border-black/10 leading-relaxed">
                        {opt.explanation}
                      </p>
                    )}
                    {hasAnswered && !isChosen && opt.isCorrect && (
                      <p className="mt-2 text-[11px] pt-2 border-t border-emerald-200 text-emerald-800 leading-relaxed">
                        {opt.explanation}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          {selectedOption !== null && (
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="bg-[#1B3A8C] hover:bg-[#0B1F4D] text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all"
              >
                {currentIdx + 1 < cases.length ? (
                  <>
                    Next Case <ArrowRight className="w-4 h-4 text-[#C9A24B]" />
                  </>
                ) : (
                  <>
                    Complete Grand Rounds <Award className="w-4 h-4 text-[#C9A24B]" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 border border-[#C9A24B]/30 shadow-xl text-center space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#C9A24B]/20 text-[#C9A24B] flex items-center justify-center mx-auto mb-2">
            <Award className="w-9 h-9 text-[#C9A24B]" />
          </div>

          <h3 className="font-extrabold text-2xl text-[#0B1F4D]">Grand Rounds Completed!</h3>
          <p className="text-xs text-gray-600">
            You scored <strong>{score} out of {cases.length}</strong> on the 5th-year pediatric dentistry clinical cases.
          </p>

          <div className="p-4 rounded-xl bg-[#FAF8F3] border border-amber-200 text-xs text-gray-700 leading-relaxed">
            {score === cases.length
              ? '🌟 Outstanding! You have mastered all pediatric dental trauma, behavioral guidance, and systemic disease management guidelines from Baghdad College of Dentistry!'
              : 'Great effort! Review the 3D trauma simulations and systemic calculator tabs to reinforce specific management protocols.'}
          </div>

          <button
            onClick={handleRestart}
            className="bg-[#1B3A8C] hover:bg-[#0B1F4D] text-white px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-md transition-all"
          >
            <RotateCcw className="w-4 h-4 text-[#C9A24B]" /> Retake Grand Rounds
          </button>
        </div>
      )}
    </div>
  );
};
