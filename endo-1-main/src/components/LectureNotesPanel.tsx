import React, { useState } from 'react';
import {
  PAIN_DIAGNOSIS_TABLE,
  SCULLY_CAWSON_CHECKLIST,
} from '../data/lectureData';
import {
  BookOpen,
  Search,
  CheckCircle,
  AlertCircle,
  FileCheck,
  Stethoscope,
  HeartPulse,
  HelpCircle,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LectureNotesPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stages' | 'pain_table' | 'scully_cawson' | 'radiographs' | 'quiz'>('pain_table');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  const filteredPainRows = PAIN_DIAGNOSIS_TABLE.filter(
    (row) =>
      row.typeOfPain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.reasonForPain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.provisionalDiagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.nerveInvolved.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const QUIZ_QUESTIONS = [
    {
      question: 'Which nerve fibers mediate sharp, momentary pain triggered by cold, and why?',
      options: [
        'C-fibers, due to deep vascular ischemic necrosis',
        'A-delta (Aδ) fibers, due to outward fluid movement in dentinal tubules (hydrodynamic)',
        'A-beta (Aβ) fibers, due to alveolar bone crest resorption',
        'Sympathetic vasoconstrictor fibers in pulp horns',
      ],
      correct: 1,
      explanation:
        'Lecture 1 Page 6: Cold causes contraction of fluid in dentinal tubules resulting in outward flow and rapid activation of peripheral Aδ myelinated nerve fibers.',
    },
    {
      question: 'Why does pain present upon RELEASE of biting force on a Tooth Slooth indicate a cracked tooth?',
      options: [
        'It stimulates periapical apical ligament proprioception',
        'The fractured tooth segments snap back together, causing sharp hydrodynamic turbulence in dentin',
        'It indicates deep necrotic gas thermal expansion',
        'It reveals loss of lamina dura on radiographs',
      ],
      correct: 1,
      explanation:
        'Lecture 1 Page 9 (Fig 7): Pain on biting indicates apical periodontitis; pain present on release of biting force indicates a cracked tooth.',
    },
    {
      question: 'What is the maximum recommended application time for thermal heat testing with heated gutta-percha?',
      options: [
        '10 seconds to allow complete pulp warming',
        '5 seconds, because prolonged heat causes biphasic stimulation of Aδ followed by C fibers',
        '15 seconds to assess contralateral control',
        '30 seconds until the patient withdraws',
      ],
      correct: 1,
      explanation:
        'Lecture 1 Page 7: Heat test should not be done for >5 s because prolonged heat causes pulpal damage and persistent C-fiber pain.',
    },
    {
      question: 'In Figure 7 of the lecture, why should a dentist NOT rely solely on a periapical radiolucency to diagnose pulp necrosis?',
      options: [
        'Radiographs cannot resolve dental structures',
        'The appearance of apical bone loss was secondary to a cementoma, while the tooth tested 100% vital!',
        'Gutta-percha cones cannot be traced in anterior teeth',
        'The patient had a systemic bleeding disorder',
      ],
      correct: 1,
      explanation:
        'Lecture 1 Page 10 (Fig 7): "Although pulp necrosis can be suspected, the tooth tested vital. In this case, the appearance of apical bone loss is secondary to a cementoma. Dentist should not rely solely on radiography without vitality testing!"',
    },
    {
      question: 'To objectively trace an intraoral or extraoral sinus tract to the offending tooth, what size gutta-percha cone is threaded into the opening?',
      options: [
        'Size #10 or #15 K-file',
        'Size #25 or #30 gutta-percha cone',
        'Size #80 master apical cone',
        'Size #60 stainless steel spreader',
      ],
      correct: 1,
      explanation:
        'Lecture 1 Page 4 (Fig 2): "To trace the sinus tract a size #25 or #30 gutta-percha cone is threaded into the opening until resistance is felt, followed by a periapical radiograph."',
    },
  ];

  const handleSelectQuiz = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correct) score++;
    });
    setQuizScore(score);
    setQuizSubmitted(true);
    if (score >= 4) {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    }
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  return (
    <div className="flex flex-col h-full bg-[#0B1F4D] border border-[#E6E8EC]/20 rounded-2xl text-[#FAF8F3] overflow-y-auto w-full shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-[#E6E8EC]/15 sticky top-0 bg-[#0B1F4D]/95 backdrop-blur-md z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#1B3A8C] border border-[#C9A24B]/40 text-[#C9A24B]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-headings">
                  Lecture 1 Master Companion
                </h2>
                <span className="font-arabic text-[10px] text-[#C9A24B] font-bold" dir="rtl">
                  دقّة الأسنان
                </span>
              </div>
              <p className="text-[10px] text-[#E6E8EC]/75 font-medium">Prof. Dr. Anas Faleh Mahdi (Endodontics - Lec 1)</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1B3A8C] text-[#C9A24B] border border-[#C9A24B]/30 font-bold shrink-0">
            Study Guide
          </span>
        </div>

        {/* Sub-nav Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar sm:grid sm:grid-cols-5 mt-3 bg-[#06112C] p-1 rounded-xl border border-[#E6E8EC]/15 text-[11px]">
          <button
            onClick={() => setActiveTab('pain_table')}
            className={`px-2.5 sm:px-1 py-1.5 rounded-lg font-headings text-[10px] font-semibold transition-all text-center shrink-0 whitespace-nowrap ${
              activeTab === 'pain_table'
                ? 'bg-[#C9A24B] text-[#0B1F4D] font-bold shadow-md'
                : 'text-[#E6E8EC]/70 hover:text-white'
            }`}
          >
            Pain Map
          </button>
          <button
            onClick={() => setActiveTab('stages')}
            className={`px-2.5 sm:px-1 py-1.5 rounded-lg font-headings text-[10px] font-semibold transition-all text-center shrink-0 whitespace-nowrap ${
              activeTab === 'stages'
                ? 'bg-[#C9A24B] text-[#0B1F4D] font-bold shadow-md'
                : 'text-[#E6E8EC]/70 hover:text-white'
            }`}
          >
            5 Stages
          </button>
          <button
            onClick={() => setActiveTab('scully_cawson')}
            className={`px-2.5 sm:px-1 py-1.5 rounded-lg font-headings text-[10px] font-semibold transition-all text-center shrink-0 whitespace-nowrap ${
              activeTab === 'scully_cawson'
                ? 'bg-[#C9A24B] text-[#0B1F4D] font-bold shadow-md'
                : 'text-[#E6E8EC]/70 hover:text-white'
            }`}
          >
            Med Hist
          </button>
          <button
            onClick={() => setActiveTab('radiographs')}
            className={`px-2.5 sm:px-1 py-1.5 rounded-lg font-headings text-[10px] font-semibold transition-all text-center shrink-0 whitespace-nowrap ${
              activeTab === 'radiographs'
                ? 'bg-[#C9A24B] text-[#0B1F4D] font-bold shadow-md'
                : 'text-[#E6E8EC]/70 hover:text-white'
            }`}
          >
            Radiology
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-2.5 sm:px-1 py-1.5 rounded-lg font-headings text-[10px] font-semibold transition-all text-center shrink-0 whitespace-nowrap ${
              activeTab === 'quiz'
                ? 'bg-[#C9A24B] text-[#0B1F4D] font-bold shadow-md'
                : 'text-[#E6E8EC]/70 hover:text-white'
            }`}
          >
            Quiz
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* TAB 1: PAIN DIAGNOSIS MATRIX (PAGE 2 OF LECTURE) */}
        {activeTab === 'pain_table' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-100 uppercase tracking-wider font-mono">
                Diagnostic Pain Differential
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Page 2 Table</span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search symptom, nerve, or diagnosis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div className="space-y-2.5">
              {filteredPainRows.map((row, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-cyan-500/40 transition-all text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-semibold">
                      {row.parameter}: {row.typeOfPain}
                    </span>
                    <span className="text-[10px] font-mono text-purple-300 font-bold">
                      {row.nerveInvolved}
                    </span>
                  </div>

                  <div className="text-slate-300 leading-snug">
                    <strong className="text-slate-400 font-mono text-[10px] block">
                      Biological Mechanism:
                    </strong>
                    {row.reasonForPain}
                  </div>

                  <div className="pt-1.5 border-t border-slate-800/70 flex items-center justify-between text-slate-200">
                    <span className="text-[10px] text-slate-400">Provisional Diagnosis:</span>
                    <span className="font-semibold text-emerald-400 text-[11px] text-right">
                      {row.provisionalDiagnosis}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: 5 STAGES OF ENDODONTIC DIAGNOSIS (PAGE 1) */}
        {activeTab === 'stages' && (
          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-cyan-500/30 text-xs space-y-2">
              <span className="font-mono text-[11px] uppercase font-bold text-cyan-400 block">
                The 5 Systematic Stages (Page 1)
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                "Information gathered is accumulated by means of an organized and systematic approach that requires considerable clinical judgment. Careful listening is paramount."
              </p>
            </div>

            <div className="space-y-2">
              {[
                {
                  stage: 1,
                  title: 'Patient Tells Reason',
                  desc: 'The patient tells the clinician the reasons for seeking advice (Chief complaint in their own words).',
                },
                {
                  stage: 2,
                  title: 'Clinician Questions Symptoms',
                  desc: 'Questions about symptoms and history that led to the visit (History of present dental illness: Quality, Location, Duration, Onset, Initiation, Relieving).',
                },
                {
                  stage: 3,
                  title: 'Objective Clinical Tests',
                  desc: 'Performs clinical tests (Palpation, Percussion, Mobility, Cold, Heat, EPT, Bite test, Transillumination, Sinus tracing, Radiographs).',
                },
                {
                  stage: 4,
                  title: 'Correlate Findings',
                  desc: 'Correlates objective findings with subjective details and creates a tentative list of differential diagnoses.',
                },
                {
                  stage: 5,
                  title: 'Definitive Diagnosis',
                  desc: 'Formulates a definitive pulpal and periapical diagnosis to institute appropriate endodontic or conservative therapy.',
                },
              ].map((s) => (
                <div
                  key={s.stage}
                  className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs flex gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    {s.stage}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-100">{s.title}</h4>
                    <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5">
              <span className="font-mono text-[10px] text-cyan-300 uppercase font-bold block">
                6 Key Pain Questions to Ask:
              </span>
              <ol className="list-decimal list-inside text-slate-300 space-y-1 text-[11px]">
                <li><strong className="text-slate-200">Quality:</strong> Dull, sharp, throbbing, constant</li>
                <li><strong className="text-slate-200">Location:</strong> Localized, diffuse, referred, radiating</li>
                <li><strong className="text-slate-200">Duration:</strong> Constant or intermittent (seconds/minutes/hours)</li>
                <li><strong className="text-slate-200">Onset:</strong> Stimulation required, intermittent, spontaneous</li>
                <li><strong className="text-slate-200">Initiation:</strong> Cold, heat, palpation, percussion</li>
                <li><strong className="text-slate-200">Relieving factors:</strong> Cold, heat, medications, sleep</li>
              </ol>
            </div>
          </div>
        )}

        {/* TAB 3: SCULLY & CAWSON CHECKLIST (PAGE 2) */}
        {activeTab === 'scully_cawson' && (
          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-cyan-500/30 text-xs space-y-1">
              <span className="font-mono text-[11px] uppercase font-bold text-cyan-400 block">
                Medical History: Scully & Cawson Checklist
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                "There are no medical conditions which specifically contraindicate endodontic treatment, but there are several which require special care."
              </p>
            </div>

            <div className="space-y-2">
              {SCULLY_CAWSON_CHECKLIST.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs flex items-start gap-2.5"
                >
                  <div className="p-1 rounded bg-slate-800 text-cyan-400 shrink-0 mt-0.5">
                    <HeartPulse className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">{item.name}</div>
                    <div className="text-slate-400 text-[11px]">{item.risk}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: RADIOGRAPHS & CEMENTOMA WARNING (PAGE 9 & 10) */}
        {activeTab === 'radiographs' && (
          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-rose-300 font-bold font-mono">
                <AlertCircle className="w-4 h-4 shrink-0" />
                CRITICAL LECTURE WARNING (Page 9 & 10)
              </div>
              <p className="text-slate-200 text-[11px] leading-relaxed">
                "Dentist should NOT rely solely on radiography to prematurely give a definitive diagnosis without using other diagnostic tests. When not coupled with proper history and clinical testing, the radiograph alone can lead to misinterpretation of normality and pathosis."
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
              <span className="font-mono text-[11px] text-cyan-300 uppercase font-bold block">
                Figure 7 Case Analysis: Periapical Cementoma
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                A mandibular lateral incisor appeared with what looked like a periapical lesion of a nonvital tooth. Although pulp necrosis was suspected based on the X-ray, the tooth tested <strong>vital</strong>! The apical bone loss was secondary to a benign cementoma. Performing a root canal on a vital cementoma is a malpractice error.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5">
              <span className="font-mono text-[11px] text-slate-300 uppercase font-bold block">
                Radiographic Limitations:
              </span>
              <ul className="list-disc list-inside text-slate-400 space-y-1 text-[11px]">
                <li>Early pulpitis does NOT show periodontal widening or periapical radiolucency.</li>
                <li>Calcified pulp chambers reduce pulp test responses, requiring multiple tests.</li>
                <li>Cortical plate must be perforated or thinned by ~30-50% before periapical radiolucency is clearly visible on standard 2D films.</li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 5: LECTURE QUIZ MODE */}
        {activeTab === 'quiz' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-100 uppercase tracking-wider font-mono">
                Endodontic Quiz
              </span>
              {quizSubmitted ? (
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Score: {quizScore} / {QUIZ_QUESTIONS.length}
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 font-mono">5 Questions</span>
              )}
            </div>

            <div className="space-y-4">
              {QUIZ_QUESTIONS.map((q, qIdx) => {
                const selectedOpt = quizAnswers[qIdx];
                return (
                  <div
                    key={qIdx}
                    className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-2.5"
                  >
                    <div className="font-semibold text-slate-200 flex gap-2">
                      <span className="font-mono text-cyan-400 font-bold">Q{qIdx + 1}.</span>
                      <span>{q.question}</span>
                    </div>

                    <div className="space-y-1.5">
                      {q.options.map((opt, optIdx) => {
                        let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';
                        if (selectedOpt === optIdx) {
                          btnStyle = 'bg-cyan-950 border-cyan-400 text-cyan-200 font-semibold';
                        }
                        if (quizSubmitted) {
                          if (optIdx === q.correct) {
                            btnStyle = 'bg-emerald-950 border-emerald-400 text-emerald-200 font-bold';
                          } else if (selectedOpt === optIdx && selectedOpt !== q.correct) {
                            btnStyle = 'bg-rose-950 border-rose-500 text-rose-300';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectQuiz(qIdx, optIdx)}
                            className={`w-full text-left p-2 rounded-xl border text-[11px] transition-all ${btnStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="p-2 rounded-xl bg-slate-900 text-[10px] text-slate-300 font-mono border border-slate-800">
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              {!quizSubmitted ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(quizAnswers).length < QUIZ_QUESTIONS.length}
                  className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition-all"
                >
                  Submit Quiz Answers
                </button>
              ) : (
                <button
                  onClick={handleResetQuiz}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs font-mono transition-all"
                >
                  Retake Quiz
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
