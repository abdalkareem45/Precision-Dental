import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  Sparkles,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizItem {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  lecturePage: string;
}

export const FurcationQuizModule: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const questions: QuizItem[] = [
    {
      id: 1,
      question: 'According to Dr. Maha Shukri’s lecture, what is the primary etiological factor responsible for furcation involvement in multirooted teeth?',
      options: [
        'Occlusal trauma from heavy premature contacts',
        'Dental plaque biofilm causing destructive periodontal breakdown',
        'Cervical enamel projections extending to the furcation',
        'Root concavities and developmental fluting'
      ],
      correctIndex: 1,
      explanation: 'Page 1 explicitly states: "The primary etiological factor for furcation involvement is dental plaque biofilm which plays an important role in the etiology of gingivitis and destructive periodontal disease & the long-standing inflammation of periodontal tissues."',
      lecturePage: 'Page 1'
    },
    {
      id: 2,
      question: 'How is the height of the root trunk defined anatomically?',
      options: [
        'The distance from the incisal edge to the alveolar crest',
        'The distance between the CEJ and the separation line (furcation) between two root cones',
        'The distance from the furcation fornix to the root apex',
        'The total length of the root complex covered by cementum'
      ],
      correctIndex: 1,
      explanation: 'Page 2: "Root trunk represents the undivided region of the root. The height of the root trunk is defined as the distance between the CEJ and the separation line (furcation) between two root cones (roots)."',
      lecturePage: 'Page 2'
    },
    {
      id: 3,
      question: 'What clinical advantage do teeth with SHORT root trunks possess once furcation involvement has already occurred?',
      options: [
        'They require more attachment loss before the furcation becomes involved',
        'They are immune to Cervical Enamel Projections',
        'They may be more accessible to periodontal maintenance and facilitate surgical procedures',
        'They eliminate the need for endodontic vitality testing'
      ],
      correctIndex: 2,
      explanation: 'Page 2: "The shorter the root trunk, the less attachment needs to be lost before the furcation is involved. Once the furcation is exposed, teeth with short root trunks may be more accessible to maintenance procedures, and the short root trunks may facilitate some surgical procedures."',
      lecturePage: 'Page 2'
    },
    {
      id: 4,
      question: 'What is the precise anatomical definition of the "Furcation Fornix"?',
      options: [
        'The transitional area between the undivided and divided part of the root',
        'The roof of the furcation',
        'The interradicular bone crest septum',
        'The area where two roots fuse near the apex'
      ],
      correctIndex: 1,
      explanation: 'Page 3: "The furcation entrance is the transitional area between the undivided and the divided part of the root. The furcation fornix is the roof of the furcation (Fig. 3)."',
      lecturePage: 'Page 3'
    },
    {
      id: 5,
      question: 'According to Hamp et al. (1975), which criteria defines a Class II furcation involvement?',
      options: [
        'Horizontal loss of periodontal tissue support not exceeding 1/3 of the tooth width',
        'Horizontal loss of periodontal support exceeding 1/3 of tooth width but not encompassing the total width',
        'Horizontal through-and-through destruction of periodontal tissues in the furcation area',
        'Through-and-through destruction where the gingiva has receded to clinically expose the opening'
      ],
      correctIndex: 1,
      explanation: 'Page 7: "- Class II (partial): denotes horizontal loss of PD tissue support exceeding 1/3 of the width of the tooth but not encompassing the total width of the furcation area (cul-de-sac)."',
      lecturePage: 'Page 7'
    },
    {
      id: 6,
      question: 'Under the Masters and Hoskins (1964) classification, what characterizes a Grade II Cervical Enamel Projection (CEP)?',
      options: [
        'Extends from the CEJ towards the furcation entrance without reaching it',
        'Approaches the entrance to the furcation but does not enter it (no horizontal component)',
        'Extends horizontally into the furcation fornix',
        'Consists of a detached enamel pearl within the periodontal ligament space'
      ],
      correctIndex: 1,
      explanation: 'Page 5: "Grade II: The enamel projection approaches the entrance to the furcation but does not enter the furcation and hence has no horizontal component."',
      lecturePage: 'Page 5'
    },
    {
      id: 7,
      question: 'Why MUST the mesial furcation of maxillary molars be probed from the PALATAL aspect rather than the buccal aspect?',
      options: [
        'The buccal gingiva is too fragile and causes patient discomfort',
        'The mesial furcation entrance is located much closer to the palatal than to the buccal surface',
        'Maxillary molars only have two roots placed buccally and palatally',
        'The mesial furcation entrance is completely absent on the buccal side'
      ],
      correctIndex: 1,
      explanation: 'Page 12: "...in case of max. molars, in which the mesial furcation entrance is located much closer to the palatal than to the buccal tooth surface. Thus, the mesial furcation should be probed from the palatal aspect of the tooth (fig 9)."',
      lecturePage: 'Page 12'
    },
    {
      id: 8,
      question: 'Which anatomical feature of the mesial root of mandibular molars and mesiobuccal root of maxillary molars increases the risk of root perforation during endodontic therapy?',
      options: [
        'Enamel pearls and hypercementosis',
        'Curvature to the distal side in the apical third and deep fluting on the distal aspect',
        'Straight conical shape without any longitudinal furrows',
        'Accessory canals located solely in the coronal third'
      ],
      correctIndex: 1,
      explanation: 'Page 7: "The mesial root of most mandibular first and second molars and the mesiobuccal root of the maxillary first molar are typically curved to the distal side in the apical third. In addition, the distal aspect of this root is usually heavily fluted. The curvature and fluting may increase the potential for root perforation during endodontic therapy or complicate post placement."',
      lecturePage: 'Page 7'
    },
    {
      id: 9,
      question: 'Why are standard periapical radiographs of maxillary molars frequently limited in identifying furcation involvement?',
      options: [
        'X-rays cannot penetrate root cementum',
        'Superimposition of the large palatal root and surrounding dense bone conceals the furcation area',
        'Maxillary molars never show bone loss on radiographs',
        'The zygomatic arch always blocks the tooth crown'
      ],
      correctIndex: 1,
      explanation: 'Page 4 & 13: "Hences in maxillary molars, frequently only the buccal furca can be properly identified... localized but extensive attachment loss will not always appear in the radiograph due to the superimposition of the palatal root and of remaining bone structures."',
      lecturePage: 'Page 4 & 13'
    },
    {
      id: 10,
      question: 'If a patient presents with an isolated deep furcation radiolucency on a mandibular molar and the tooth tests NON-VITAL, what is the mandatory clinical sequence?',
      options: [
        'Perform immediate surgical root resection without endodontics',
        'Proper endodontic treatment must ALWAYS precede periodontal therapy',
        'Extract the tooth immediately as the prognosis is hopeless',
        'Administer systemic antibiotics and perform subgingival scaling without root canal therapy'
      ],
      correctIndex: 1,
      explanation: 'Page 14: "If the tooth is non-vital, the furcation involvement may have an endodontic origin. In such a case, proper endodontic treatment must always precede periodontal therapy. In fact, endodontic therapy may resolve the inflammatory lesion, soft and hard tissue healing may occur and the furcation defect will disappear (fig 12)."',
      lecturePage: 'Page 14'
    },
    {
      id: 11,
      question: 'In Trauma from Occlusion (TFO) involving a multi-rooted tooth with an interradicular radiolucency and increased mobility, what is the key clinical probing finding?',
      options: [
        'Probing reveals a through-and-through Class III furcation tunnel',
        'Probing fails to detect any involvement/pocketing of the furcation',
        'Probing confirms a Grade III Cervical Enamel Projection',
        'Probing causes sudden profuse purulent suppuration'
      ],
      correctIndex: 1,
      explanation: 'Page 14: "In such a tooth a radiolucency may be seen in the radiograph of the root complex. The tooth may exhibit increased mobility. Probing, however, fails to detect an involvement of the furcation. In this particular situation, occlusal adjustment must always precede periodontal therapy."',
      lecturePage: 'Page 14'
    },
    {
      id: 12,
      question: 'Why do furcation-involved maxillary first premolars have a POOR prognosis compared to mandibular molars?',
      options: [
        'They are single-rooted teeth with no anatomical furcation',
        'They frequently show fused roots, deep apical furcations opening mesiodistally, and root invaginations making plaque control virtually impossible',
        'They have three divergent roots that interfere with chewing',
        'They cannot be anesthetized with local lidocaine'
      ],
      correctIndex: 1,
      explanation: 'Page 15: "Maxillary first premolar often shows fusion of the roots and the furcation area may be located very much apically and also the roots are placed buccally and palatally with furcation opening in a mesiodistal direction. For these reasons, furcation involvement in maxillary first premolar has poor prognosis."',
      lecturePage: 'Page 15'
    }
  ];

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (selectedAnswers[questionId] !== undefined) return;
    const updated = { ...selectedAnswers, [questionId]: optionIndex };
    setSelectedAnswers(updated);
    setShowExplanation((prev) => ({ ...prev, [questionId]: true }));

    // Check if all answered
    if (Object.keys(updated).length === questions.length) {
      setQuizFinished(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setShowExplanation({});
    setQuizFinished(false);
  };

  const score = Object.entries(selectedAnswers).reduce((acc, [qId, ans]) => {
    const q = questions.find((item) => item.id === parseInt(qId));
    return q && q.correctIndex === ans ? acc + 1 : acc;
  }, 0);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
      {/* Quiz Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black text-sm flex items-center justify-center font-mono shadow">
              12
            </span>
            <h3 className="text-lg sm:text-2xl font-black text-white">
              Furcation Mastery Examination
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Official University of Baghdad Board-Level Questions covering Dr. Maha Shukri's Lecture Notes.
          </p>
        </div>

        {/* Score tracker */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 text-right">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Current Score:</span>
            <span className="text-lg font-black font-mono text-[#C9A24B]">
              {score} / {questions.length}
            </span>
          </div>

          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title="Reset Quiz"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quiz Completion Banner */}
      {quizFinished && (
        <div className="bg-gradient-to-r from-emerald-950/60 via-purple-950/60 to-slate-950 border border-emerald-500/50 p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-lg font-black text-white">
                Examination Completed!
              </h4>
              <p className="text-xs text-slate-300">
                You scored <strong>{score} out of {questions.length}</strong> ({Math.round((score / questions.length) * 100)}%).
                {score >= 10 ? ' Outstanding mastery of Dr. Maha Shukri’s furcation anatomy and clinical diagnostics!' : ' Review the explanations below to solidify your understanding.'}
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shrink-0"
          >
            Retake Exam
          </button>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((q, qIndex) => {
          const userAnswer = selectedAnswers[q.id];
          const isAnswered = userAnswer !== undefined;
          const isCorrect = isAnswered && userAnswer === q.correctIndex;

          return (
            <div
              key={q.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                isAnswered
                  ? isCorrect
                    ? 'bg-slate-950 border-emerald-500/40'
                    : 'bg-slate-950 border-rose-500/40'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-xs font-black text-[#C9A24B] font-mono">
                  Q{qIndex + 1} of {questions.length} • {q.lecturePage}
                </span>
                {isAnswered && (
                  <span className={`text-xs font-bold font-mono px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                    isCorrect ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}>
                    {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    {isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                )}
              </div>

              <h4 className="text-xs sm:text-sm font-bold text-white mb-3 leading-snug">
                {q.question}
              </h4>

              {/* Options */}
              <div className="grid grid-cols-1 gap-2">
                {q.options.map((opt, optIndex) => {
                  let optStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700';

                  if (isAnswered) {
                    if (optIndex === q.correctIndex) {
                      optStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold';
                    } else if (optIndex === userAnswer) {
                      optStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                    } else {
                      optStyle = 'bg-slate-900/40 border-slate-800/40 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={optIndex}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(q.id, optIndex)}
                      className={`p-3 rounded-xl border text-left text-xs transition flex items-center justify-between cursor-pointer ${optStyle}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-lg bg-slate-800 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                          {String.fromCharCode(65 + optIndex)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isAnswered && optIndex === q.correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Dropdown */}
              {showExplanation[q.id] && (
                <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-300 flex items-start gap-2 bg-slate-900/40 p-3 rounded-xl">
                  <BookOpen className="w-4 h-4 text-[#C9A24B] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#C9A24B] block mb-0.5">
                      Lecture Citation ({q.lecturePage}):
                    </span>
                    <p className="leading-relaxed text-[11px] text-slate-300">
                      {q.explanation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
