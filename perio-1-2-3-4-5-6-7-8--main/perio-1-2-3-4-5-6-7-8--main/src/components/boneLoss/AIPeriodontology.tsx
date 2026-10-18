import React, { useState } from 'react';
import {
  Cpu,
  Brain,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Scale,
  ShieldAlert,
  BarChart3,
  Search,
  Scan,
  Compass
} from 'lucide-react';

export const AIPeriodontology: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'studies' | 'workflow' | 'balance'>('studies');

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
            Curriculum Unit • PDF Pages 1, 2, 6, 16–20
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <Brain className="w-6 h-6 text-cyan-400" />
          Artificial Intelligence in Periodontology
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
          Complete syllabus coverage of machine learning models for periodontal bone loss detection, oral fluorescence segmentation, treatment planning algorithms, and ethical limitations.
        </p>
      </div>

      {/* Sub-navigation */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('studies')}
          className={`flex-1 p-3 rounded-2xl border text-left transition ${
            activeTab === 'studies'
              ? 'bg-blue-600/20 border-cyan-400 text-white shadow-lg ring-1 ring-cyan-400'
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <div className="font-bold text-xs sm:text-sm">Exact Research Studies &amp; Statistics</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Miller 2023, Rana 2017, Li 2019, Arora 2020</div>
        </button>

        <button
          onClick={() => setActiveTab('workflow')}
          className={`flex-1 p-3 rounded-2xl border text-left transition ${
            activeTab === 'workflow'
              ? 'bg-blue-600/20 border-cyan-400 text-white shadow-lg ring-1 ring-cyan-400'
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <div className="font-bold text-xs sm:text-sm">Clinical AI Decision Workflow</div>
          <div className="text-[11px] text-slate-400 mt-0.5">From patient data to CBCT implant planning</div>
        </button>

        <button
          onClick={() => setActiveTab('balance')}
          className={`flex-1 p-3 rounded-2xl border text-left transition ${
            activeTab === 'balance'
              ? 'bg-blue-600/20 border-cyan-400 text-white shadow-lg ring-1 ring-cyan-400'
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <div className="font-bold text-xs sm:text-sm">Advantages vs. Ethical Disadvantages</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Surveillance, privacy, and empathy boundaries</div>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: RESEARCH STUDIES & EXACT DATA FROM PDF
          ========================================================================= */}
      {activeTab === 'studies' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Miller et al. 2023 RBL Detection */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  PDF Pages 6 &amp; 17
                </span>
                <span className="text-xs font-mono text-slate-400">Radiographic Bone Loss (RBL)</span>
              </div>
              <h3 className="text-base font-bold text-white">Miller et al. [2023] Review</h3>
              <p className="text-xs text-slate-300">
                Reviewed the potential of AI models to detect RBL for the diagnosis of periodontal disease:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block text-[10px]">Panoramic Accuracy:</span>
                  <div className="text-cyan-300 font-bold text-base">63% – 94%</div>
                  <span className="text-[10px] text-slate-500">Mean accuracy range</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block text-[10px]">Periapical Staging:</span>
                  <div className="text-emerald-400 font-bold text-base">99% Accuracy</div>
                  <span className="text-[10px] text-amber-300">25% precision for mild</span>
                </div>
              </div>
            </div>

            {/* 2. Rana, Yauney et al. 2017 Biomarker Fluorescence */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold text-pink-400 bg-pink-950 px-2 py-0.5 rounded border border-pink-800">
                  PDF Pages 2 &amp; 17
                </span>
                <span className="text-xs font-mono text-slate-400">Oral Image Fluorescence</span>
              </div>
              <h3 className="text-base font-bold text-white">Rana, Yauney et al. in 2017</h3>
              <p className="text-xs text-slate-300">
                Machine learning classifier to distinguish between inflamed and healthy gums using an oral imaging device:
              </p>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="text-cyan-300 font-mono">
                  • Wavelength: <strong>405–450 nm</strong> light irradiation
                </div>
                <div className="text-amber-300 font-mono">
                  • Biomarker: Porphyrin fluorescence
                </div>
                <div className="grid grid-cols-2 gap-2 font-mono text-[11px] pt-1">
                  <div className="p-2 rounded bg-amber-950/40 border border-amber-800 text-amber-200">
                    Plaque: Yellow &amp; Orange
                  </div>
                  <div className="p-2 rounded bg-rose-950/40 border border-rose-800 text-rose-200">
                    Inflamed Gums: Magenta &amp; Red
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Li et al. 2019 & Arora et al. 2020 */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                  PDF Pages 17 &amp; 18
                </span>
                <span className="text-xs font-mono text-slate-400">Deep Learning CNNs</span>
              </div>
              <h3 className="text-base font-bold text-white">Li et al. (2019) &amp; Arora et al. (2020)</h3>
              <ul className="text-xs text-slate-300 space-y-2">
                <li>
                  <strong>Li et al. (2019):</strong> Developed a deep learning model that achieved high accuracy in classifying periodontal bone loss from panoramic radiographs.
                </li>
                <li>
                  <strong>Arora et al. (2020):</strong> Demonstrated the efficacy of convolutional neural networks (CNNs) in detecting gingival bleeding from intraoral images.
                </li>
              </ul>
            </div>

            {/* 4. Allahverdi & Akcan (2019) Treatment Planning */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  PDF Page 19
                </span>
                <span className="text-xs font-mono text-slate-400">Treatment Decision Support</span>
              </div>
              <h3 className="text-base font-bold text-white">Allahverdi &amp; Akcan (2019)</h3>
              <p className="text-xs text-slate-300">
                Proposed a clinical decision support system based on <strong>fuzzy logic and genetic algorithms</strong> to optimize treatment planning in periodontal therapy.
              </p>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-mono">
                Incorporates patient preferences, genetic markers, and periodontal measurements to improve long-term adherence.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: CLINICAL AI DECISION WORKFLOW
          ========================================================================= */}
      {activeTab === 'workflow' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-4">
            <h3 className="text-base font-bold text-white">
              End-to-End AI Workflow in Periodontal Practice (PDF Page 16–20)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                  1
                </span>
                <strong className="text-cyan-400 block">Patient Multimodal Data</strong>
                <p className="text-slate-300 text-[11px]">
                  Intraoral photographs, 2D panoramic/periapical radiographs, 3D CBCT scans, EHR history, and genetic markers.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="w-6 h-6 rounded-lg bg-cyan-600 text-slate-950 font-bold flex items-center justify-center text-xs">
                  2
                </span>
                <strong className="text-cyan-300 block">Deep Neural Analysis</strong>
                <p className="text-slate-300 text-[11px]">
                  CNNs segment gingival margins, detect porphyrin fluorescence, calculate RBL percentage, and identify bone defect types.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="w-6 h-6 rounded-lg bg-purple-600 text-white font-bold flex items-center justify-center text-xs">
                  3
                </span>
                <strong className="text-purple-300 block">Risk &amp; Staging Prediction</strong>
                <p className="text-slate-300 text-[11px]">
                  Automated staging of RBL (99% accuracy), prognosis estimation, and 3D implant positioning (angulation, size).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                  4
                </span>
                <strong className="text-emerald-300 block">Clinical Decision Support</strong>
                <p className="text-slate-300 text-[11px]">
                  Surgical guide generation, personalized recalls, NLP monitoring of patient-reported outcomes to prevent disease recurrence.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-blue-900/60 text-xs text-slate-300 space-y-1">
              <strong className="text-cyan-300 block">Implant Placement 2D vs. 3D CBCT Insight (PDF Page 17):</strong>
              <p className="text-[11px] leading-relaxed">
                2D radiographs (periapical &amp; panoramic) show higher distortion than 3D scans.
                Hence, current cutting-edge AI models for implant placement, surgical guides, and angulation are trained using <strong>Cone Beam Computed Tomography (CBCT)</strong> images.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: ADVANTAGES VS LIMITATIONS BALANCE
          ========================================================================= */}
      {activeTab === 'balance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Why We Need AI (Advantages) - PDF Page 2 */}
          <div className="bg-slate-900/90 border border-emerald-900/50 rounded-3xl p-5 space-y-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
              Core Advantages (PDF Page 2):
            </span>
            <ul className="text-xs text-slate-300 space-y-2.5">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>I. Gives accurate and updated information.</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>II. Streamlines automated tasks:</strong> Scheduling appointments, patient tracking, obtaining clinical data, and treatment guidance.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>III. Saves time and resources:</strong> Automates routine procedures so clinicians have more time to examine patients and identify diseases.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>IV. Assists in research:</strong> Gathers vast amounts of information from multiple distributed clinical sources.</span>
              </li>
            </ul>
          </div>

          {/* Disadvantages of AI - PDF Page 16 */}
          <div className="bg-slate-900/90 border border-rose-900/50 rounded-3xl p-5 space-y-3">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">
              Disadvantages &amp; Ethical Concerns (PDF Page 16):
            </span>
            <ul className="text-xs text-slate-300 space-y-2.5">
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span><strong>I. Needs human surveillance:</strong> Operates strictly with logical reasoning and NOT with empathy.</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span><strong>II. Overlooks social variables:</strong> May miss economic, social, and historical patient factors.</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span><strong>III. Unemployment &amp; equity:</strong> Professional job displacement concerns after years of healthcare education.</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span><strong>IV. Data limitations:</strong> Inaccuracies when training datasets lack demographic or rare disease diversity.</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span><strong>V. Privacy concerns:</strong> Unrestricted data harvesting and utilization by multinational commercial entities.</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
