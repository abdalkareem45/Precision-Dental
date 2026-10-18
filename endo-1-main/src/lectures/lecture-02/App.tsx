/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Brain, 
  Activity, 
  ShieldAlert, 
  Zap, 
  Syringe, 
  MapPin, 
  Award, 
  HelpCircle,
  Menu,
  X,
  Stethoscope,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ExternalLink
} from 'lucide-react';

import NeurophysiologySandbox from './components/NeurophysiologySandbox';
import PharmacologySandbox from './components/PharmacologySandbox';
import MandibularSandbox from './components/MandibularSandbox';
import MaxillarySupplementalSandbox from './components/MaxillarySupplementalSandbox';
import ReferredPainSandbox from './components/ReferredPainSandbox';
import GrandVisualizerSandbox from './components/GrandVisualizerSandbox';

const CLINICAL_SCENARIOS = [
  {
    id: 1,
    title: "Scenario 1: Severe Trismus & Mandibular Molar",
    patient: "24-year-old male presenting with acute pericoronitis and severe trismus (limited mouth opening < 20mm), requiring emergency endodontic access on mandibular left 2nd molar.",
    challenge: "Standard IAN block is difficult due to restricted landmarks, and patient cannot wide-open for Gow-Gates.",
    options: [
      {
        choice: "Akinosi-Vazirani Closed-Mouth V3 Block",
        correct: true,
        explanation: "Correct! The Akinosi-Vazirani technique is specifically designed for patients with limited mouth opening. Injection is at the height of the mucogingival junction of the maxillary 3rd molar near the maxillary tuberosity with teeth in occlusion."
      },
      {
        choice: "Gow-Gates V3 Block",
        correct: false,
        explanation: "Incorrect. Gow-Gates requires the patient's mouth to be open wide to position the barrel near the condylar neck. In trismus patients with restricted opening, this is contraindicated or impractical."
      },
      {
        choice: "Standard 1.8mL IAN Block",
        correct: false,
        explanation: "Incorrect. Standard IAN block requires visualizing the coronoid notch and pterymandibular raphe, which is extremely difficult and traumatic when the patient cannot open adequately."
      }
    ]
  },
  {
    id: 2,
    title: "Scenario 2: The 'Hot Tooth' Failure",
    patient: "35-year-old female with irreversible pulpitis on mandibular right 1st molar. After two cartridges of 2% lidocaine IAN block and profound lip numbness, cold test and bur touch still elicit severe pain.",
    challenge: "Inflamed pulpal tissue has upregulated tetrodotoxin-resistant sodium channels and lowered tissue pH/hyperalgesia, resisting standard block.",
    options: [
      {
        choice: "Wait another 30 minutes for IAN block to take deeper effect",
        correct: false,
        explanation: "Waiting will not overcome severe pulpal hyperalgesia and inflammatory mediator upregulation in irreversible pulpitis."
      },
      {
        choice: "Stabident Intraosseous (IO) or PDL / Intrapulpal Supplemental Injection",
        correct: true,
        explanation: "Correct! When full anesthesia is not gained by IAN block, supplemental techniques like Stabident IO into cancellous bone, high-pressure PDL injection, or direct Intrapulpal injection provide immediate profound anesthesia."
      },
      {
        choice: "Administer systemic IV general anesthesia",
        correct: false,
        explanation: "Unnecessary and hazardous in a dental clinic setting when local supplemental techniques (IO, PDL, IP) are highly effective."
      }
    ]
  },
  {
    id: 3,
    title: "Scenario 3: Acute Vestibular Abscess",
    patient: "42-year-old male with acute dentoalveolar abscess associated with maxillary lateral incisor, prominent fluctuant swelling and severe pain.",
    challenge: "Local tissue pH in the infected area is 5.0. Direct local infiltration into the pus/abscess site fails to produce anesthesia.",
    options: [
      {
        choice: "Inject 2mL of lidocaine directly into the center of the purulent abscess swelling",
        correct: false,
        explanation: "Dangerous! Direct injection into an active infection site can spread the infection into deeper tissue spaces, and low pH (5-6) prevents anesthetic ionization to the free base."
      },
      {
        choice: "Use distant nerve block techniques (e.g. Infraorbital or regional block) and avoid injecting into inflamed tissue",
        correct: true,
        explanation: "Correct! Avoiding direct injection into infected tissue prevents spreading infection. Utilizing distant blocks or regional techniques bypasses the low pH barrier."
      },
      {
        choice: "Perform endodontic access without any anesthesia",
        correct: false,
        explanation: "Cruel and unnecessary when regional blocks or supplemental options are available."
      }
    ]
  }
];

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Which nerve fibers are 3 times more numerous in the dental pulp and transmit dull, burning, and aching pain?",
    options: [
      "Aδ (Delta) fibers",
      "C fibers",
      "Beta-myelinated fibers",
      "Sympathetic vasomotor fibers"
    ],
    correct: 1,
    rationale: "C-fibers are unmyelinated, smaller in diameter, and distributed within the pulp with a concentration roughly 3 times higher than Aδ fibers. They transmit burning and aching pain."
  },
  {
    id: 2,
    question: "Why does local anesthesia have a delayed or failed onset when injected directly into an acutely infected area?",
    options: [
      "The local anesthetic is immediately metabolized by bacteria.",
      "Lower tissue pH (5-6) inhibits the conversion to the lipid-soluble free-base form needed to cross the nerve sheath.",
      "Infection causes immediate precipitation of vasoconstrictors.",
      "Edema washes away all anesthetic molecules before binding."
    ],
    correct: 1,
    rationale: "The inflammatory process in an infection lowers extracellular pH to 5-6 or lower. This low pH inhibits anesthetic action because little of the free-base form is allowed to cross into the nerve sheath."
  },
  {
    id: 3,
    question: "What is the recommended volume of 2% lidocaine with 1:100,000 epinephrine for a conventional Inferior Alveolar Nerve (IAN) block in asymptomatic patients to minimize missed blocks?",
    options: [
      "0.9 mL (half cartridge)",
      "1.8 mL (one cartridge)",
      "3.6 mL (two cartridges)",
      "5.4 mL (three cartridges)"
    ],
    correct: 2,
    rationale: "Research cited in the lecture notes found that administration of a two-cartridge volume (3.6 mL) was significantly better for avoiding a missed block than a one-cartridge volume in asymptomatic subjects."
  },
  {
    id: 4,
    question: "Which supplemental injection technique is particularly useful for achieving rapid onset in a 'hot tooth' (irreversible pulpitis) when standard IAN block fails, utilizing a slow-speed perforator and 27-gauge ultrashort needle into cancellous bone?",
    options: [
      "Gow-Gates V3 block",
      "Periodontal Ligament (PDL) injection",
      "Intraosseous (Stabident IO) anesthesia",
      "Mental nerve block"
    ],
    correct: 2,
    rationale: "The Stabident IO system utilizes a handpiece-driven perforator to drill a small hole through the cortical plate and delivers anesthetic directly into the cancellous bone surrounding the tooth."
  },
  {
    id: 5,
    question: "What is the definitive, gold-standard method to confirm true pulpal anesthesia prior to beginning endodontic access cavity preparation?",
    options: [
      "Asking the patient if their lip feels numb",
      "Probing the marginal gingiva with a sharp explorer",
      "Electric pulp testing (EPT) or cold testing showing a negative response",
      "Observing patient facial expression during rubber dam placement"
    ],
    correct: 2,
    rationale: "Soft tissue signs (lip numbness) only confirm soft tissue anesthesia (e.g., mental/inferior alveolar nerve trunk), not pulpal anesthesia. A negative response to EPT or cold testing is required to confirm pulpal anesthesia."
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'neuro' | 'pharmacology' | 'mandibular' | 'maxillary' | 'referred' | 'visualizer' | 'simulator' | 'quiz'>('neuro');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Simulator state
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(0);
  const [simulatorChoice, setSimulatorChoice] = useState<number | null>(null);
  const [simulatorSubmitted, setSimulatorSubmitted] = useState<boolean>(false);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  const handleQuizAnswer = (questionId: number, optionIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const submitQuiz = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach(q => {
      if (quizAnswers[q.id] === q.correct) score += 1;
    });
    setQuizScore(score);
    setQuizSubmitted(true);
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      
      {/* TOP HEADER */}
      <header className="bg-[#1E293B] text-white shadow-xl sticky top-0 z-50 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-20 py-3 flex items-center justify-between gap-3">
          
          <div className="flex min-w-0 items-center space-x-3">
            <div className="hidden sm:flex shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-[#0284C7] to-[#1E293B] border-2 border-[#D97706] items-center justify-center shadow-lg">
              <Brain className="w-7 h-7 text-[#D97706]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-serif">
                  EndoPain Clinical Pro
                </h1>
                <span className="text-xs bg-[#D97706] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Lecture 2
                </span>
              </div>
              <p className="text-xs text-slate-300 hidden sm:block">
                Pain Control in Endodontics • Prof. Anas Faleh Mahdi • 5th-Year Dental Study Suite
              </p>
            </div>
          </div>

          {/* DESKTOP NAV TABS */}
          <nav aria-label="Lecture 2 topics" className="hidden xl:flex flex-wrap items-center justify-end gap-1">
            {[
              { id: 'neuro', label: '1. Neurophysiology', icon: Activity },
              { id: 'pharmacology', label: '2. Pharmacology', icon: ShieldAlert },
              { id: 'mandibular', label: '3. Mandibular', icon: MapPin },
              { id: 'maxillary', label: '4. Maxillary & Supp', icon: Syringe },
              { id: 'referred', label: '5. Referred Pain', icon: HelpCircle },
              { id: 'visualizer', label: 'Fiber Visualizer', icon: Zap },
              { id: 'simulator', label: 'Clinical Sims', icon: Stethoscope },
              { id: 'quiz', label: 'Quiz Engine', icon: Award },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'bg-[#0284C7] text-white shadow-md' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#D97706]'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* MOBILE MENU TOGGLE */}
          <div className="flex items-center xl:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Lecture 2 topics"
              aria-expanded={mobileMenuOpen}
              aria-controls="lecture-2-mobile-topics"
              className="p-2 rounded-lg bg-slate-800 text-slate-200 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* MOBILE MENU DROPDOWN */}
        {mobileMenuOpen && (
          <div id="lecture-2-mobile-topics" className="xl:hidden bg-[#1E293B] border-t border-slate-700 px-4 pt-2 pb-4 space-y-1">
            {[
              { id: 'neuro', label: '1. Pulpal Neurophysiology', icon: Activity },
              { id: 'pharmacology', label: '2. Local Anesthesia Pharmacology', icon: ShieldAlert },
              { id: 'mandibular', label: '3. Mandibular Anesthesia Techniques', icon: MapPin },
              { id: 'maxillary', label: '4. Maxillary & Supplemental Tech', icon: Syringe },
              { id: 'referred', label: '5. Referred Pain & Diagnostics', icon: HelpCircle },
              { id: 'visualizer', label: 'Fiber & Stimulus Response Simulator', icon: Zap },
              { id: 'simulator', label: 'Clinical Anesthesia Simulator', icon: Stethoscope },
              { id: 'quiz', label: 'Knowledge Check Quiz Engine', icon: Award },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as typeof activeTab);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive ? 'bg-[#0284C7] text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#D97706]'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* MAIN CONTENT ROUTE */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* 1. Pulpal Neurophysiology */}
        {activeTab === 'neuro' && <NeurophysiologySandbox />}

        {/* 2. Local Anesthesia Pharmacology */}
        {activeTab === 'pharmacology' && <PharmacologySandbox />}

        {/* 3. Mandibular Anesthesia */}
        {activeTab === 'mandibular' && <MandibularSandbox />}

        {/* 4. Maxillary & Supplemental */}
        {activeTab === 'maxillary' && <MaxillarySupplementalSandbox />}

        {/* 5. Referred Pain */}
        {activeTab === 'referred' && <ReferredPainSandbox />}

        {/* 6. Fiber & Stimulus Response Simulator */}
        {activeTab === 'visualizer' && <GrandVisualizerSandbox />}

        {/* 7. Clinical Anesthesia Simulator */}
        {activeTab === 'simulator' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-3 bg-sky-100 rounded-xl text-[#0284C7]">
                  <Stethoscope className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D97706]">Clinical Simulator</span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#1E293B]">Clinical Anesthesia Decision Scenarios</h2>
                </div>
              </div>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Test your management of complex endodontic pain presentations derived directly from lecture case studies (Trismus, Hot Teeth, and Low pH Abscesses).
              </p>
            </div>

            {/* Scenario Switcher */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {CLINICAL_SCENARIOS.map((scen, idx) => (
                <button
                  key={scen.id}
                  onClick={() => {
                    setSelectedScenarioIndex(idx);
                    setSimulatorChoice(null);
                    setSimulatorSubmitted(false);
                  }}
                  className={`p-4 rounded-xl text-left transition-all border ${
                    selectedScenarioIndex === idx 
                      ? 'bg-[#1E293B] text-white border-[#0284C7] shadow' 
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D97706]">Case 0{scen.id}</span>
                  <h4 className="font-bold text-sm mt-1">{scen.title.split(':')[1]}</h4>
                </button>
              ))}
            </div>

            {/* Active Scenario Card */}
            {(() => {
              const currentScen = CLINICAL_SCENARIOS[selectedScenarioIndex];
              return (
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
                  <div>
                    <span className="text-xs bg-sky-100 text-[#0284C7] px-3 py-1 rounded-full font-bold">Clinical Case Profile</span>
                    <h3 className="text-xl font-bold text-[#1E293B] mt-2">{currentScen.title}</h3>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                    <p className="text-sm text-slate-800"><strong>Patient Presentation:</strong> {currentScen.patient}</p>
                    <p className="text-sm text-slate-800"><strong>Clinical Challenge:</strong> {currentScen.challenge}</p>
                  </div>

                  <h4 className="font-bold text-sm text-[#1E293B]">Select the appropriate clinical management action:</h4>
                  
                  <div className="space-y-3">
                    {currentScen.options.map((opt, oIdx) => {
                      const isSelected = simulatorChoice === oIdx;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => {
                            if (!simulatorSubmitted) setSimulatorChoice(oIdx);
                          }}
                          disabled={simulatorSubmitted}
                          className={`w-full text-left p-4 rounded-xl text-sm font-medium transition-all border ${
                            simulatorSubmitted
                              ? opt.correct 
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold' 
                                : isSelected 
                                  ? 'bg-red-50 border-red-500 text-red-900' 
                                  : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                              : isSelected
                                ? 'bg-sky-50 border-[#0284C7] text-[#1E293B] ring-2 ring-[#0284C7]'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <span className="font-bold text-xs shrink-0 mt-0.5">[{oIdx + 1}]</span>
                            <span>{opt.choice}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {!simulatorSubmitted ? (
                    <button
                      onClick={() => {
                        if (simulatorChoice !== null) setSimulatorSubmitted(true);
                      }}
                      disabled={simulatorChoice === null}
                      className="bg-[#0284C7] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-sky-700 transition disabled:opacity-50 shadow"
                    >
                      Submit Clinical Decision
                    </button>
                  ) : (
                    <div className={`p-5 rounded-xl border ${
                      currentScen.options[simulatorChoice!].correct 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                        : 'bg-red-50 border-red-200 text-red-900'
                    }`}>
                      <h4 className="font-bold mb-1 flex items-center space-x-2">
                        {currentScen.options[simulatorChoice!].correct ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            <span>Correct Clinical Protocol!</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5 text-red-600" />
                            <span>Incorrect Management Strategy</span>
                          </>
                        )}
                      </h4>
                      <p className="text-xs leading-relaxed mt-2">
                        {currentScen.options[simulatorChoice!].explanation}
                      </p>
                      <button
                        onClick={() => {
                          setSimulatorChoice(null);
                          setSimulatorSubmitted(false);
                        }}
                        className="mt-4 inline-flex items-center space-x-2 bg-[#1E293B] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-800"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Try Again</span>
                      </button>
                    </div>
                  )}

                </div>
              );
            })()}
          </div>
        )}

        {/* 8. Knowledge Check Quiz Engine */}
        {activeTab === 'quiz' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#D97706]">End-of-Module Exam</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1E293B]">Knowledge Check Quiz Engine</h2>
                <p className="text-slate-600 text-sm mt-1">
                  Test your mastery of Prof. Anas Faleh Mahdi's Lecture 2 on Pain Control in Endodontics.
                </p>
              </div>
              {quizSubmitted && (
                <div className="bg-amber-100 border border-[#D97706] text-[#D97706] px-6 py-3 rounded-2xl text-center shadow">
                  <div className="text-xs uppercase font-bold">Your Score</div>
                  <div className="text-2xl font-black">{quizScore} / {QUIZ_QUESTIONS.length}</div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {QUIZ_QUESTIONS.map((q, qIndex) => {
                const selectedOpt = quizAnswers[q.id];
                const isCorrect = selectedOpt === q.correct;
                return (
                  <div key={q.id} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
                    <div className="flex items-start justify-between">
                      <span className="text-xs bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded-full">
                        Question 0{qIndex + 1}
                      </span>
                      {quizSubmitted && (
                        isCorrect ? (
                          <span className="inline-flex items-center space-x-1 text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Correct</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-xs bg-red-100 text-red-800 font-bold px-3 py-1 rounded-full">
                            <XCircle className="w-4 h-4 text-red-600" />
                            <span>Incorrect</span>
                          </span>
                        )
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[#1E293B]">
                      {q.question}
                    </h3>

                    <div className="space-y-2">
                      {q.options.map((opt, oIndex) => {
                        const isChosen = selectedOpt === oIndex;
                        const isTheCorrectOne = oIndex === q.correct;
                        let btnStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';
                        
                        if (quizSubmitted) {
                          if (isTheCorrectOne) {
                            btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                          } else if (isChosen && !isTheCorrectOne) {
                            btnStyle = 'bg-red-50 border-red-500 text-red-900';
                          } else {
                            btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                          }
                        } else if (isChosen) {
                          btnStyle = 'bg-sky-50 border-[#0284C7] text-[#1E293B] ring-2 ring-[#0284C7] font-semibold';
                        }

                        return (
                          <button
                            key={oIndex}
                            onClick={() => handleQuizAnswer(q.id, oIndex)}
                            disabled={quizSubmitted}
                            className={`w-full text-left p-3.5 rounded-xl text-sm transition-all border flex items-center space-x-3 ${btnStyle}`}
                          >
                            <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                              {String.fromCharCode(65 + oIndex)}
                            </span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-[#D97706]/30 text-xs text-amber-900 space-y-1">
                        <strong className="text-[#D97706]">Rationale (Gold Alloy Feedback):</strong>
                        <p>{q.rationale}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center pb-12">
              {!quizSubmitted ? (
                <button
                  onClick={submitQuiz}
                  disabled={Object.keys(quizAnswers).length < QUIZ_QUESTIONS.length}
                  className="bg-[#1E293B] text-white px-8 py-4 rounded-2xl font-bold text-base hover:bg-slate-800 transition shadow-xl disabled:opacity-50"
                >
                  Submit Exam & View Rationale
                </button>
              ) : (
                <button
                  onClick={resetQuiz}
                  className="bg-[#0284C7] text-white px-8 py-4 rounded-2xl font-bold text-base hover:bg-sky-700 transition shadow-xl inline-flex items-center space-x-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Retake Knowledge Check</span>
                </button>
              )}
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-[#1E293B] text-white py-8 border-t border-slate-700 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 space-y-4 sm:space-y-0">
          <div>
            <p className="font-semibold text-white">EndoPain Clinical Pro</p>
            <p>Based on Prof. Anas Faleh Mahdi • Lecture 2 (Pain Control in Endodontics)</p>
          </div>
          <div className="flex items-center space-x-4">
            <span>Cohen's Pathways 12th Ed.</span>
            <span>•</span>
            <span>Samir et al. (2023)</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
