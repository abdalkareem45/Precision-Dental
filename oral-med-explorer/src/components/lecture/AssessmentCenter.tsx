import React, { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Award,
  CheckCircle2,
  RotateCcw,
  ShieldAlert,
  XCircle,
} from 'lucide-react';
import type { AssessmentItem } from '@/src/types/lecture';

interface AssessmentCenterProps {
  lectureId: string;
  assessments: AssessmentItem[];
  savedScore: number | null;
  savedTotal: number | null;
  onRecordScore: (lectureId: string, score: number, total: number) => void;
}

function createInitialOrders(items: AssessmentItem[]): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const item of items) {
    if (item.type === 'ordering' && item.sequenceSteps) {
      // Deterministic reversed/rotated starting order so student actively reorders steps
      const ids = item.sequenceSteps.map((s) => s.id);
      map[item.id] = ids.length > 1 ? [...ids.slice(1), ids[0]] : ids;
    }
  }
  return map;
}

export const AssessmentCenter: React.FC<AssessmentCenterProps> = ({
  lectureId,
  assessments,
  savedScore,
  savedTotal,
  onRecordScore,
}) => {
  const [singleAnswers, setSingleAnswers] = useState<Record<string, string>>({});
  const [matchAnswers, setMatchAnswers] = useState<Record<string, Record<string, string>>>({});
  const [orderAnswers, setOrderAnswers] = useState<Record<string, string[]>>(() =>
    createInitialOrders(assessments)
  );
  const [submitted, setSubmitted] = useState(false);
  const [scoreResult, setScoreResult] = useState<{ score: number; total: number } | null>(null);

  useEffect(() => {
    setSingleAnswers({});
    setMatchAnswers({});
    setOrderAnswers(createInitialOrders(assessments));
    setSubmitted(false);
    setScoreResult(null);
  }, [lectureId, assessments]);

  const isItemCorrect = (item: AssessmentItem): boolean => {
    if (item.type === 'matching' && item.pairs) {
      const mapping = matchAnswers[item.id] || {};
      return item.pairs.every((p) => mapping[p.id] === p.right);
    }
    if (item.type === 'ordering' && item.correctOrderIds) {
      const current = orderAnswers[item.id] || [];
      return (
        current.length === item.correctOrderIds.length &&
        current.every((id, idx) => id === item.correctOrderIds?.[idx])
      );
    }
    return singleAnswers[item.id] === item.correctOptionId;
  };

  const handleSubmitAll = () => {
    const total = assessments.length;
    const score = assessments.reduce((acc, item) => acc + (isItemCorrect(item) ? 1 : 0), 0);
    setSubmitted(true);
    setScoreResult({ score, total });
    onRecordScore(lectureId, score, total);
  };

  const handleReset = () => {
    setSingleAnswers({});
    setMatchAnswers({});
    setOrderAnswers(createInitialOrders(assessments));
    setSubmitted(false);
    setScoreResult(null);
  };

  const moveOrderStep = (itemId: string, idx: number, dir: -1 | 1) => {
    if (submitted) return;
    setOrderAnswers((prev) => {
      const arr = [...(prev[itemId] || [])];
      const nextIdx = idx + dir;
      if (nextIdx < 0 || nextIdx >= arr.length) return prev;
      [arr[idx], arr[nextIdx]] = [arr[nextIdx], arr[idx]];
      return { ...prev, [itemId]: arr };
    });
  };

  const answeredCount = assessments.filter((item) => {
    if (item.type === 'matching' && item.pairs) {
      const mapping = matchAnswers[item.id] || {};
      return item.pairs.every((p) => Boolean(mapping[p.id]));
    }
    if (item.type === 'ordering') return true;
    return Boolean(singleAnswers[item.id]);
  }).length;

  return (
    <section
      id="section-assessment"
      aria-labelledby="assessment-heading"
      className="rounded-2xl border border-[#E6E8EC] dark:border-[#1F2937] bg-white dark:bg-[#111827] p-5 sm:p-6 space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-[#1B3A8C] dark:text-[#3B82F6]">
            Section 10 • Interactive Assessment Center (5 Formats)
          </div>
          <h2 id="assessment-heading" className="font-display text-xl sm:text-2xl font-bold text-[#0B1F4D] dark:text-white">
            Labeling, Identification, Matching, Ordering & Reasoning
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {savedScore !== null && savedTotal !== null && (
            <span className="inline-flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 rounded-lg bg-[#C9A24B]/15 text-[#0B1F4D] dark:text-[#E4C16E] font-bold tabular-nums">
              <Award className="w-3.5 h-3.5 text-[#C9A24B]" />
              Best Recorded: {savedScore}/{savedTotal} ({Math.round((savedScore / Math.max(1, savedTotal)) * 100)}%)
            </span>
          )}
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E6E8EC] dark:border-[#1F2937] bg-[#FAF8F3] dark:bg-[#0B1220] text-xs font-semibold text-[#0B1F4D] dark:text-slate-200 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Quiz
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {assessments.map((item, qIdx) => {
          const correct = submitted ? isItemCorrect(item) : false;
          const rightPool = item.pairs ? [...item.pairs.map((p) => p.right)].sort() : [];

          return (
            <article
              key={item.id}
              className={`rounded-xl border p-4 sm:p-5 space-y-3 ${
                submitted
                  ? correct
                    ? 'border-emerald-500/50 bg-emerald-500/5'
                    : 'border-red-500/45 bg-red-500/5'
                  : 'border-[#E6E8EC] dark:border-[#1F2937] bg-[#FAF8F3] dark:bg-[#0B1220]'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-[#1B3A8C]/12 text-[#1B3A8C] dark:bg-[#3B82F6]/20 dark:text-[#93C5FD] uppercase">
                  Q{qIdx + 1} • {item.type}
                </span>
                {submitted && (
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-bold ${
                      correct ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {correct ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    {correct ? 'Correct' : 'Needs Review'}
                  </span>
                )}
              </div>

              {item.visualCue && (
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  Visual Cue: {item.visualCue}
                </div>
              )}
              <h3 className="font-display text-sm sm:text-base font-bold text-[#0B1F4D] dark:text-white">
                {item.prompt}
              </h3>

              {/* Single-select (Labeling, Identification, Reasoning) */}
              {item.options && (
                <div className="grid sm:grid-cols-2 gap-2">
                  {item.options.map((opt) => {
                    const selected = singleAnswers[item.id] === opt.id;
                    const isKey = opt.id === item.correctOptionId;
                    let cls =
                      'border-[#E6E8EC] dark:border-[#1F2937] bg-white dark:bg-[#111827] hover:border-[#1B3A8C]';
                    if (submitted) {
                      if (isKey) cls = 'border-emerald-500 bg-emerald-500/15';
                      else if (selected) cls = 'border-red-500 bg-red-500/15';
                    } else if (selected) {
                      cls = 'border-[#1B3A8C] ring-2 ring-[#1B3A8C]/30 bg-white dark:bg-[#1E3A8A]/40';
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={submitted}
                        onClick={() =>
                          setSingleAnswers((prev) => ({ ...prev, [item.id]: opt.id }))
                        }
                        className={`text-left p-3 rounded-xl border text-xs sm:text-sm font-medium text-[#0B1F4D] dark:text-slate-100 transition-all cursor-pointer disabled:cursor-default ${cls}`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Matching */}
              {item.type === 'matching' && item.pairs && (
                <div className="space-y-2">
                  {item.pairs.map((pair) => {
                    const chosen = matchAnswers[item.id]?.[pair.id] || '';
                    return (
                      <div
                        key={pair.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-white dark:bg-[#111827] border border-[#E6E8EC] dark:border-[#1F2937]"
                      >
                        <span className="text-xs sm:text-sm font-semibold text-[#0B1F4D] dark:text-white">
                          {pair.left}
                        </span>
                        <select
                          aria-label={`Match for ${pair.left}`}
                          disabled={submitted}
                          value={chosen}
                          onChange={(e) =>
                            setMatchAnswers((prev) => ({
                              ...prev,
                              [item.id]: {
                                ...(prev[item.id] || {}),
                                [pair.id]: e.target.value,
                              },
                            }))
                          }
                          className="px-3 py-1.5 rounded-lg border border-[#E6E8EC] dark:border-[#1F2937] bg-[#FAF8F3] dark:bg-[#0B1220] text-xs sm:text-sm text-[#0B1F4D] dark:text-slate-100"
                        >
                          <option value="">Select clinical match…</option>
                          {rightPool.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Ordering */}
              {item.type === 'ordering' && item.sequenceSteps && (
                <div className="space-y-1.5">
                  {(orderAnswers[item.id] || []).map((stepId, idx, arr) => {
                    const stepObj = item.sequenceSteps?.find((s) => s.id === stepId);
                    if (!stepObj) return null;
                    return (
                      <div
                        key={stepId}
                        className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-white dark:bg-[#111827] border border-[#E6E8EC] dark:border-[#1F2937]"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="font-mono text-xs font-bold w-6 h-6 rounded bg-[#1B3A8C]/10 text-[#1B3A8C] dark:bg-[#3B82F6]/20 dark:text-[#93C5FD] flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-xs sm:text-sm font-medium text-[#0B1F4D] dark:text-white">
                            {stepObj.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            disabled={submitted || idx === 0}
                            onClick={() => moveOrderStep(item.id, idx, -1)}
                            aria-label={`Move ${stepObj.label} up`}
                            className="p-1.5 rounded border border-[#E6E8EC] dark:border-[#1F2937] disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={submitted || idx === arr.length - 1}
                            onClick={() => moveOrderStep(item.id, idx, 1)}
                            aria-label={`Move ${stepObj.label} down`}
                            className="p-1.5 rounded border border-[#E6E8EC] dark:border-[#1F2937] disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {submitted && (
                <div className="rounded-lg bg-white dark:bg-[#111827] border border-[#E6E8EC] dark:border-[#1F2937] p-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="text-[#0B1F4D] dark:text-white">Explanation:</strong> {item.explanation}
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Submit & Score Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#E6E8EC] dark:border-[#1F2937]">
        <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#C9A24B] shrink-0" />
          <span>
            Formative self-check ({answeredCount}/{assessments.length} completed). Quiz scores support revision only and do not certify clinical competence.
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {scoreResult && (
            <span className="font-mono text-sm font-bold px-3 py-2 rounded-xl bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 tabular-nums">
              Score: {scoreResult.score} / {scoreResult.total} (
              {Math.round((scoreResult.score / Math.max(1, scoreResult.total)) * 100)}%)
            </span>
          )}
          {!submitted ? (
            <button
              type="button"
              onClick={handleSubmitAll}
              className="px-5 py-2.5 rounded-xl bg-[#1B3A8C] hover:bg-[#0B1F4D] dark:bg-[#3B82F6] text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer"
            >
              Submit Assessment
            </button>
          ) : (
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl bg-[#C9A24B] hover:bg-[#B89038] text-[#0B1F4D] text-xs sm:text-sm font-bold transition-colors cursor-pointer"
            >
              Retry Assessment
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
