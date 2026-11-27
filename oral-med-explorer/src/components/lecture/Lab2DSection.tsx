import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  CheckCircle2,
  GitFork,
  RotateCcw,
  ShieldCheck,
  Table2,
  Target,
  XCircle,
} from 'lucide-react';
import type { Sandbox2DLab } from '@/src/types/lecture';

interface Lab2DSectionProps {
  lectureId: string;
  lab: Sandbox2DLab;
  completedKeys: string[];
  onMarkInteracted: (lectureId: string, key: string) => void;
}

type Tab2DKey = 'decision-tree' | 'comparison-board' | 'symptom-mapper' | 'clinical-challenge';

export const Lab2DSection: React.FC<Lab2DSectionProps> = ({
  lectureId,
  lab,
  completedKeys,
  onMarkInteracted,
}) => {
  const [activeTab, setActiveTab] = useState<Tab2DKey>('decision-tree');

  // 1. Decision Tree state
  const [history, setHistory] = useState<string[]>([lab.decisionTree.startNodeId]);
  const [lastNote, setLastNote] = useState<string | null>(null);

  // 2. Comparison Board state
  const [focusedEntityId, setFocusedEntityId] = useState<string>(
    lab.comparisonBoard.entities[0]?.id || ''
  );

  // 3. Symptom Mapper state
  const [selectedInputIds, setSelectedInputIds] = useState<string[]>([]);

  // 4. Clinical Challenge state
  const [roundIdx, setRoundIdx] = useState(0);
  const [chosenByRound, setChosenByRound] = useState<Record<string, string>>({});

  // Reset sub-states when lecture changes
  useEffect(() => {
    setHistory([lab.decisionTree.startNodeId]);
    setLastNote(null);
    setFocusedEntityId(lab.comparisonBoard.entities[0]?.id || '');
    setSelectedInputIds([]);
    setRoundIdx(0);
    setChosenByRound({});
  }, [lectureId, lab]);

  const currentTreeNode =
    lab.decisionTree.nodes[history[history.length - 1]] ||
    lab.decisionTree.nodes[lab.decisionTree.startNodeId];

  const symptomMatches = useMemo(() => {
    const selectedSet = new Set(selectedInputIds);
    return lab.symptomMapper.targets
      .map((target) => {
        const hitCount = target.matchingInputIds.filter((id) => selectedSet.has(id)).length;
        const pct =
          target.matchingInputIds.length > 0
            ? Math.round((hitCount / target.matchingInputIds.length) * 100)
            : 0;
        return { ...target, hitCount, pct };
      })
      .sort((a, b) => b.pct - a.pct);
  }, [lab.symptomMapper.targets, selectedInputIds]);

  const currentRound = lab.clinicalChallenge.rounds[roundIdx] || lab.clinicalChallenge.rounds[0];
  const challengeScore = useMemo(() => {
    return lab.clinicalChallenge.rounds.reduce((acc, r) => {
      const picked = chosenByRound[r.id];
      const opt = r.options.find((o) => o.id === picked);
      return acc + (opt?.isCorrect ? 1 : 0);
    }, 0);
  }, [lab.clinicalChallenge.rounds, chosenByRound]);

  const tabs: Array<{ key: Tab2DKey; label: string; icon: React.ReactNode }> = [
    { key: 'decision-tree', label: '1. Decision Tree', icon: <GitFork className="w-4 h-4" /> },
    { key: 'comparison-board', label: '2. Comparison Board', icon: <Table2 className="w-4 h-4" /> },
    { key: 'symptom-mapper', label: '3. Symptom Mapper', icon: <Activity className="w-4 h-4" /> },
    { key: 'clinical-challenge', label: '4. Clinical Challenge', icon: <Target className="w-4 h-4" /> },
  ];

  const handleSelectTab = (key: Tab2DKey) => {
    setActiveTab(key);
    onMarkInteracted(lectureId, key);
  };

  return (
    <section
      id="section-lab-2d"
      aria-labelledby="lab-2d-heading"
      className="rounded-2xl border border-[#E6E8EC] dark:border-[#1F2937] bg-white dark:bg-[#111827] p-5 sm:p-6 space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-[#1B3A8C] dark:text-[#3B82F6]">
            Section 05 • Interactive 2D Clinical Lab
          </div>
          <h2 id="lab-2d-heading" className="font-display text-xl sm:text-2xl font-bold text-[#0B1F4D] dark:text-white">
            Diagnostic Decision Trees, Comparisons & Symptom Mapping
          </h2>
        </div>
        <span className="font-mono text-xs px-3 py-1 rounded-lg bg-[#FAF8F3] dark:bg-[#0B1220] border border-[#E6E8EC] dark:border-[#1F2937] text-[#0B1F4D] dark:text-slate-200 tabular-nums shrink-0">
          Completed {completedKeys.length} / 4
        </span>
      </div>

      {/* 4 Lab Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2" role="tablist" aria-label="2D Clinical Labs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const isDone = completedKeys.includes(tab.key);
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => handleSelectTab(tab.key)}
              className={`flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#1B3A8C] text-white border-[#1B3A8C] dark:bg-[#3B82F6] dark:border-[#3B82F6]'
                  : 'bg-[#FAF8F3] dark:bg-[#0B1220] border-[#E6E8EC] dark:border-[#1F2937] text-[#0B1F4D] dark:text-slate-200 hover:border-[#C9A24B]'
              }`}
            >
              <span className="inline-flex items-center gap-1.5 truncate">
                {tab.icon}
                <span className="truncate">{tab.label}</span>
              </span>
              {isDone && (
                <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#5EEAD4]' : 'text-emerald-600 dark:text-emerald-400'}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* 2D SANDBOX 1: DECISION TREE */}
      {activeTab === 'decision-tree' && currentTreeNode && (
        <div className="rounded-xl border border-[#E6E8EC] dark:border-[#1F2937] bg-[#FAF8F3] dark:bg-[#0B1220] p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-display text-lg font-bold text-[#0B1F4D] dark:text-white">
                {lab.decisionTree.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">{lab.decisionTree.subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              {history.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setHistory((h) => h.slice(0, -1));
                    setLastNote(null);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-[#E6E8EC] dark:border-[#1F2937] bg-white dark:bg-[#111827] text-xs font-medium text-[#0B1F4D] dark:text-slate-200 cursor-pointer"
                >
                  Step Back
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setHistory([lab.decisionTree.startNodeId]);
                  setLastNote(null);
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E6E8EC] dark:border-[#1F2937] bg-white dark:bg-[#111827] text-xs font-medium text-[#0B1F4D] dark:text-slate-200 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restart Tree
              </button>
            </div>
          </div>

          {/* Breadcrumb path */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-slate-500 dark:text-slate-400">
            <span>Path:</span>
            {history.map((nid, i) => (
              <span key={`${nid}-${i}`} className="inline-flex items-center gap-1">
                {i > 0 && <span>→</span>}
                <span className="px-2 py-0.5 rounded bg-white dark:bg-[#111827] border border-[#E6E8EC] dark:border-[#1F2937]">
                  Step {i + 1}
                </span>
              </span>
            ))}
          </div>

          {lastNote && (
            <div className="rounded-lg bg-[#1B3A8C]/8 dark:bg-[#3B82F6]/15 border border-[#1B3A8C]/25 px-3.5 py-2 text-xs text-[#0B1F4D] dark:text-slate-200">
              <strong>Reasoning Note:</strong> {lastNote}
            </div>
          )}

          <div className="rounded-xl bg-white dark:bg-[#111827] border border-[#E6E8EC] dark:border-[#1F2937] p-4 sm:p-5 space-y-3">
            {currentTreeNode.isTerminal && currentTreeNode.outcomeBadge && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                {currentTreeNode.outcomeBadge}
              </span>
            )}
            <h4 className="font-display text-base sm:text-lg font-bold text-[#0B1F4D] dark:text-white">
              {currentTreeNode.prompt}
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentTreeNode.detail}
            </p>

            {currentTreeNode.managementSummary && (
              <div className="rounded-lg border border-teal-500/35 bg-teal-500/8 dark:bg-[#14B8A6]/12 p-3 text-xs text-slate-700 dark:text-slate-200">
                <strong className="text-teal-800 dark:text-teal-300">Clinical Action Plan:</strong>{' '}
                {currentTreeNode.managementSummary}
              </div>
            )}

            {currentTreeNode.options && currentTreeNode.options.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-2.5 pt-2">
                {currentTreeNode.options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onMarkInteracted(lectureId, 'decision-tree');
                      setLastNote(opt.clinicalNote || null);
                      setHistory((h) => [...h, opt.nextNodeId]);
                    }}
                    className="text-left p-3.5 rounded-xl border border-[#E6E8EC] dark:border-[#1F2937] bg-[#FAF8F3] dark:bg-[#0B1220] hover:border-[#1B3A8C] dark:hover:border-[#3B82F6] transition-colors cursor-pointer"
                  >
                    <div className="text-sm font-semibold text-[#0B1F4D] dark:text-white">
                      {opt.label}
                    </div>
                    {opt.clinicalNote && (
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        Select to evaluate branch
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2D SANDBOX 2: COMPARISON BOARD */}
      {activeTab === 'comparison-board' && (
        <div className="rounded-xl border border-[#E6E8EC] dark:border-[#1F2937] bg-[#FAF8F3] dark:bg-[#0B1220] p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-display text-lg font-bold text-[#0B1F4D] dark:text-white">
                {lab.comparisonBoard.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {lab.comparisonBoard.subtitle}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {lab.comparisonBoard.entities.map((ent) => (
                <button
                  key={ent.id}
                  type="button"
                  onClick={() => {
                    setFocusedEntityId(ent.id);
                    onMarkInteracted(lectureId, 'comparison-board');
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    focusedEntityId === ent.id
                      ? 'bg-[#C9A24B] text-[#0B1F4D]'
                      : 'bg-white dark:bg-[#111827] border border-[#E6E8EC] dark:border-[#1F2937] text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Highlight: {ent.name}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto clinical-scroll rounded-xl border border-[#E6E8EC] dark:border-[#1F2937] bg-white dark:bg-[#111827]">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#E6E8EC] dark:border-[#1F2937] bg-[#FAF8F3] dark:bg-[#0B1220]">
                  <th className="p-3 font-mono text-xs uppercase text-slate-500 dark:text-slate-400 min-w-[140px]">
                    Clinical Feature
                  </th>
                  {lab.comparisonBoard.entities.map((ent) => (
                    <th
                      key={ent.id}
                      className={`p-3 min-w-[180px] ${
                        focusedEntityId === ent.id
                          ? 'bg-[#1B3A8C]/8 dark:bg-[#3B82F6]/15'
                          : ''
                      }`}
                    >
                      <div className="font-display font-bold text-[#0B1F4D] dark:text-white">
                        {ent.name}
                      </div>
                      <span className="inline-block mt-0.5 text-[11px] font-mono text-[#1B3A8C] dark:text-[#38BDF8]">
                        {ent.badge}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E8EC] dark:divide-[#1F2937]">
                {lab.comparisonBoard.dimensions.map((dim) => (
                  <tr key={dim}>
                    <td className="p-3 font-semibold text-[#0B1F4D] dark:text-slate-200 align-top">
                      {dim}
                    </td>
                    {lab.comparisonBoard.entities.map((ent) => (
                      <td
                        key={`${ent.id}-${dim}`}
                        className={`p-3 text-slate-700 dark:text-slate-300 align-top leading-relaxed ${
                          focusedEntityId === ent.id
                            ? 'bg-[#1B3A8C]/5 dark:bg-[#3B82F6]/10 font-medium'
                            : ''
                        }`}
                      >
                        {ent.attributes[dim] || '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2D SANDBOX 3: SYMPTOM MAPPER */}
      {activeTab === 'symptom-mapper' && (
        <div className="rounded-xl border border-[#E6E8EC] dark:border-[#1F2937] bg-[#FAF8F3] dark:bg-[#0B1220] p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-display text-lg font-bold text-[#0B1F4D] dark:text-white">
                {lab.symptomMapper.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {lab.symptomMapper.subtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedInputIds([])}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E6E8EC] dark:border-[#1F2937] bg-white dark:bg-[#111827] text-xs font-medium text-[#0B1F4D] dark:text-slate-200 self-start sm:self-auto cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear Findings ({selectedInputIds.length})
            </button>
          </div>

          <div className="grid lg:grid-cols-12 gap-5">
            <div className="lg:col-span-5 space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Toggle Patient Findings / Symptoms
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-2">
                {lab.symptomMapper.inputs.map((inp) => {
                  const checked = selectedInputIds.includes(inp.id);
                  return (
                    <button
                      key={inp.id}
                      type="button"
                      aria-pressed={checked}
                      onClick={() => {
                        onMarkInteracted(lectureId, 'symptom-mapper');
                        setSelectedInputIds((prev) =>
                          prev.includes(inp.id)
                            ? prev.filter((x) => x !== inp.id)
                            : [...prev, inp.id]
                        );
                      }}
                      className={`text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-2 cursor-pointer ${
                        checked
                          ? 'bg-[#1B3A8C] text-white border-[#1B3A8C] dark:bg-[#3B82F6] dark:border-[#3B82F6]'
                          : 'bg-white dark:bg-[#111827] border-[#E6E8EC] dark:border-[#1F2937] text-[#0B1F4D] dark:text-slate-200 hover:border-[#C9A24B]'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-semibold leading-snug">{inp.label}</div>
                        <div className={`text-[10px] font-mono mt-0.5 ${checked ? 'text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                          {inp.category}
                        </div>
                      </div>
                      <span
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 text-[10px] font-bold ${
                          checked ? 'bg-white text-[#1B3A8C] border-white' : 'border-slate-400'
                        }`}
                      >
                        {checked ? '✓' : ''}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-7 space-y-2.5">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Ranked Differential Compatibility (Educational Pattern Match)
              </div>
              <div className="space-y-2.5">
                {symptomMatches.map((target) => (
                  <div
                    key={target.id}
                    className="rounded-xl border border-[#E6E8EC] dark:border-[#1F2937] bg-white dark:bg-[#111827] p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-display text-sm sm:text-base font-bold text-[#0B1F4D] dark:text-white">
                        {target.condition}
                      </h4>
                      <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-[#1B3A8C]/10 text-[#1B3A8C] dark:bg-[#14B8A6]/15 dark:text-[#5EEAD4] tabular-nums">
                        {target.pct}% match ({target.hitCount}/{target.matchingInputIds.length})
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-[#FAF8F3] dark:bg-[#0B1220] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#1B3A8C] to-[#14B8A6] transition-all duration-300"
                        style={{ width: `${Math.max(4, target.pct)}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{target.summary}</p>
                    <div className="text-[11px] text-[#0B1F4D] dark:text-[#E4C16E] bg-[#C9A24B]/10 rounded-lg px-2.5 py-1.5">
                      <strong>Key Discriminator:</strong> {target.discriminator}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2D SANDBOX 4: CLINICAL CHALLENGE SIMULATOR */}
      {activeTab === 'clinical-challenge' && currentRound && (
        <div className="rounded-xl border border-[#E6E8EC] dark:border-[#1F2937] bg-[#FAF8F3] dark:bg-[#0B1220] p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-display text-lg font-bold text-[#0B1F4D] dark:text-white">
                {lab.clinicalChallenge.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {lab.clinicalChallenge.subtitle}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-white dark:bg-[#111827] border border-[#E6E8EC] dark:border-[#1F2937] tabular-nums">
                Score: {challengeScore} / {lab.clinicalChallenge.rounds.length}
              </span>
              <button
                type="button"
                onClick={() => {
                  setRoundIdx(0);
                  setChosenByRound({});
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#E6E8EC] dark:border-[#1F2937] bg-white dark:bg-[#111827] text-xs font-medium cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          </div>

          {/* Round Selector */}
          <div className="flex flex-wrap gap-1.5">
            {lab.clinicalChallenge.rounds.map((r, idx) => {
              const answered = chosenByRound[r.id];
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRoundIdx(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold cursor-pointer ${
                    idx === roundIdx
                      ? 'bg-[#1B3A8C] text-white dark:bg-[#3B82F6]'
                      : answered
                        ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30'
                        : 'bg-white dark:bg-[#111827] border border-[#E6E8EC] dark:border-[#1F2937] text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Round {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="rounded-xl bg-white dark:bg-[#111827] border border-[#E6E8EC] dark:border-[#1F2937] p-4 sm:p-5 space-y-4">
            <p className="text-sm sm:text-base font-medium text-[#0B1F4D] dark:text-white leading-relaxed">
              {currentRound.vignette}
            </p>
            <div className="flex flex-wrap gap-2">
              {currentRound.clues.map((clue, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-md bg-[#FAF8F3] dark:bg-[#0B1220] border border-[#E6E8EC] dark:border-[#1F2937] text-xs font-mono text-[#1B3A8C] dark:text-[#38BDF8]"
                >
                  Clue: {clue}
                </span>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-2.5">
              {currentRound.options.map((opt) => {
                const pickedId = chosenByRound[currentRound.id];
                const isPicked = pickedId === opt.id;
                const hasAnswered = Boolean(pickedId);

                let styleCls =
                  'border-[#E6E8EC] dark:border-[#1F2937] bg-[#FAF8F3] dark:bg-[#0B1220] hover:border-[#1B3A8C]';
                if (hasAnswered) {
                  if (opt.isCorrect) {
                    styleCls = 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/15';
                  } else if (isPicked) {
                    styleCls = 'border-red-500 bg-red-500/10 dark:bg-red-500/15';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={hasAnswered}
                    onClick={() => {
                      onMarkInteracted(lectureId, 'clinical-challenge');
                      setChosenByRound((prev) => ({ ...prev, [currentRound.id]: opt.id }));
                    }}
                    className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer disabled:cursor-default ${styleCls}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-semibold text-[#0B1F4D] dark:text-white">
                        {opt.label}
                      </span>
                      {hasAnswered && opt.isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      )}
                      {hasAnswered && isPicked && !opt.isCorrect && (
                        <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                      )}
                    </div>
                    {hasAnswered && (isPicked || opt.isCorrect) && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-snug">
                        {opt.rationale}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
