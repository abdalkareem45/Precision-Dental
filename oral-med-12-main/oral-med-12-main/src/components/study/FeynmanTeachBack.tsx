import React, { useState } from 'react';
import { BookOpen, Sparkles, CheckCircle2, AlertCircle, Award } from 'lucide-react';

export const FeynmanTeachBack: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<number>(0);
  const [userExplanation, setUserExplanation] = useState<string>('');
  const [evaluation, setEvaluation] = useState<{
    score: number;
    foundKeywords: string[];
    missingKeywords: string[];
    feedback: string;
  } | null>(null);

  const topics = [
    {
      title: 'CMV Endothelial Latency & Oral Ulceration',
      prompt: 'Explain to a 2nd-year dental student why Cytomegalovirus (CMV) causes single large persistent ulcers in AIDS patients and how Valganciclovir works.',
      keywords: ['endothelial', 'latency', 'vasculopathy', 'thrombosis', 'retinitis', 'prodrug', 'bioavailability'],
      expertExplanation:
        'CMV establishes lifelong latency in connective tissue and endothelial cells of blood vessels. In severe AIDS (CD4 <100), reactivation produces viral vasculopathy and thrombosis, leading to localized ischemic necrosis and large, solitary, deep, persistent ulcers. Valganciclovir is an oral L-valyl ester prodrug with ~10-fold higher oral bioavailability than oral ganciclovir, achieving therapeutic IV-equivalent serum levels to treat oral lesions and prevent blinding CMV retinitis.',
    },
    {
      title: 'Herpangina Anatomical Landmarks & Serotypes',
      prompt: 'Explain how you distinguish Herpangina from Primary Herpetic Gingivostomatitis based on lesion location and etiology.',
      keywords: ['posterior', 'soft palate', 'tonsillar', 'spared', 'coxsackie', 'self-limiting'],
      expertExplanation:
        'Herpangina (caused by Coxsackievirus A serotypes 1–10, 16, 22) is characterized by small 2–4 mm vesicles and ulcers strictly localized to the posterior oropharynx, soft palate, uvula, and anterior tonsillar pillars. Crucially, the anterior mouth (attached gingiva, lips, anterior tongue) is completely spared. In contrast, Primary Herpetic Gingivostomatitis (HSV-1) characteristically causes diffuse, severe anterior marginal and attached gingival erythema and lip ulcerations.',
    },
    {
      title: 'Progression from NUG to Noma (Cancrum Oris)',
      prompt: 'Explain how acute necrotizing ulcerative gingivitis can progress to facial gangrene (Noma) in malnourished individuals.',
      keywords: ['treponema', 'fusobacterium', 'chemotaxis', 'dermonecrotic', 'cone-shaped', 'bone sequestration'],
      expertExplanation:
        'NUG begins as an acute fuso-spirochetal infection (Treponema species, Prevotella intermedia, Fusobacterium nucleatum) triggering cratered punched-out interdental papillae due to impaired neutrophil chemotaxis. In severely malnourished or immunosuppressed children, Fusobacterium necrophorum invades deep facial fascial planes, producing dermonecrotic toxins, hemolysins, and proteases. This creates an aggressive cone-shaped gangrenous lesion with its base in the mouth and apex perforating facial skin, causing massive bone sequestration and 70–90% mortality if untreated.',
    },
  ];

  const currentTopic = topics[selectedTopic];

  const handleEvaluate = () => {
    if (!userExplanation.trim()) return;

    const lower = userExplanation.toLowerCase();
    const found = currentTopic.keywords.filter((kw) => lower.includes(kw.toLowerCase()));
    const missing = currentTopic.keywords.filter((kw) => !lower.includes(kw.toLowerCase()));

    const score = Math.round((found.length / currentTopic.keywords.length) * 100);

    let feedback = '';
    if (score >= 80) {
      feedback = 'Outstanding pedagogical explanation! You captured the essential cellular mechanisms and clinical landmarks clearly.';
    } else if (score >= 50) {
      feedback = 'Good foundation! You grasped the broad concepts, but remember to emphasize key physiological mechanisms such as cellular tropism or prodrug pharmacology.';
    } else {
      feedback = 'A bit brief or missing key lecture landmarks. Review the expert model answer below to sharpen your clinical precision.';
    }

    setEvaluation({
      score,
      foundKeywords: found,
      missingKeywords: missing,
      feedback,
    });
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-teal-400 font-semibold mb-1">
            <span>Feynman Active Learning Technique</span>
            <span>·</span>
            <span>Teach-Back Mode</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Teach-Back Pedagogical Sandbox</h1>
          <p className="text-xs text-slate-400 mt-1">
            Solidify complex pathophysiology by explaining concepts in plain, accessible language and receiving instant rubric feedback.
          </p>
        </div>
      </div>

      {/* Topic Switcher */}
      <div className="flex flex-wrap gap-2">
        {topics.map((t, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSelectedTopic(idx);
              setUserExplanation('');
              setEvaluation(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-medium border transition-colors ${
              selectedTopic === idx
                ? 'bg-teal-500 text-slate-950 font-bold border-teal-400 shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {t.title}
          </button>
        ))}
      </div>

      {/* Exercise Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-[11px] uppercase font-mono text-teal-400 font-semibold block mb-1">
              Clinical Challenge Prompt:
            </span>
            <p className="text-sm text-slate-100 font-medium leading-relaxed">{currentTopic.prompt}</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-medium block">
              Your Teach-Back Explanation (Use your own words):
            </label>
            <textarea
              rows={6}
              value={userExplanation}
              onChange={(e) => setUserExplanation(e.target.value)}
              placeholder="Start explaining the etiology, mechanism, and clinical relevance as if teaching a peer..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 leading-relaxed"
            />
          </div>

          <button
            disabled={!userExplanation.trim()}
            onClick={handleEvaluate}
            className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 disabled:opacity-40 text-slate-950 font-bold rounded-lg text-xs transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Evaluate My Explanation</span>
          </button>
        </div>

        {/* Evaluation Output Deck */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-teal-400" />
            <span>Rubric & Conceptual Assessment</span>
          </h3>

          {evaluation ? (
            <div className="space-y-4 text-xs leading-relaxed animate-fade-in">
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400 font-medium">Conceptual Precision Score:</span>
                <span className="font-mono text-lg font-bold text-teal-400">{evaluation.score}%</span>
              </div>

              <div className="space-y-2">
                <span className="font-semibold text-slate-300 block">Keyword Landmark Analysis:</span>
                <div className="flex flex-wrap gap-1.5">
                  {evaluation.foundKeywords.map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 rounded text-[11px] font-mono">
                      ✓ {kw}
                    </span>
                  ))}
                  {evaluation.missingKeywords.map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-950 text-slate-500 border border-slate-800 rounded text-[11px] font-mono">
                      ○ {kw}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800">
                {evaluation.feedback}
              </p>

              <div className="p-3.5 bg-teal-950/30 rounded-xl border border-teal-800/50 space-y-1.5">
                <span className="font-bold text-teal-300 block text-[11px] uppercase tracking-wider">
                  Expert Faculty Model Answer:
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">{currentTopic.expertExplanation}</p>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-500 text-xs">
              <BookOpen className="w-8 h-8 mb-2 opacity-50" />
              <span>Type your teach-back explanation on the left and click Evaluate to analyze conceptual mastery.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
