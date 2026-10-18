import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RotateCcw,
  Sparkles,
  Award,
  ChevronRight,
  ShieldCheck,
  Plus,
  Trash2
} from 'lucide-react';

interface ProcedureItem {
  id: string;
  name: string;
  category: 'Step 1' | 'Step 2' | 'Re-Evaluation' | 'Step 3 / Surgery' | 'Rehabilitation' | 'Step 4 SPC';
  idealPhase: 'month_0' | 'month_1_2' | 'month_3' | 'month_4_6' | 'month_6_plus';
}

const ALL_PROCEDURES: ProcedureItem[] = [
  { id: 'p1', name: 'Supragingival Biofilm Control & OHI', category: 'Step 1', idealPhase: 'month_0' },
  { id: 'p2', name: 'PMPR & Risk Factor Counseling (Smoking/Diabetes)', category: 'Step 1', idealPhase: 'month_0' },
  { id: 'p3', name: 'Temporary Splinting (for Mobility Class 2-3 Fremitus)', category: 'Step 1', idealPhase: 'month_0' },
  { id: 'p4', name: 'Subgingival Instrumentation (Quadrants SRP)', category: 'Step 2', idealPhase: 'month_1_2' },
  { id: 'p5', name: 'Adjunctive Local/Systemic Antimicrobials', category: 'Step 2', idealPhase: 'month_1_2' },
  { id: 'p6', name: 'Periodontal Re-Evaluation (Check Endpoints PD ≤4mm)', category: 'Re-Evaluation', idealPhase: 'month_3' },
  { id: 'p7', name: 'Access Flap / Regenerative Surgery for Residual Pockets', category: 'Step 3 / Surgery', idealPhase: 'month_4_6' },
  { id: 'p8', name: 'Orthodontic Tooth Retraction (After Pocket Control)', category: 'Rehabilitation', idealPhase: 'month_4_6' },
  { id: 'p9', name: 'Definitive Dental Implants / Prosthetic Bridges', category: 'Rehabilitation', idealPhase: 'month_4_6' },
  { id: 'p10', name: 'Supportive Periodontal Care (SPC) at 3-Month Interval', category: 'Step 4 SPC', idealPhase: 'month_6_plus' }
];

export const InteractiveTimelinePlanner: React.FC = () => {
  // Mapping of Phase to array of procedure IDs
  const [phaseAssignments, setPhaseAssignments] = useState<Record<string, string[]>>({
    month_0: ['p1', 'p2', 'p3'],
    month_1_2: ['p4', 'p5'],
    month_3: ['p6'],
    month_4_6: ['p7', 'p8', 'p9'],
    month_6_plus: ['p10']
  });

  const [auditResult, setAuditResult] = useState<{
    score: number;
    errors: string[];
    passed: boolean;
    audited: boolean;
  }>({ score: 100, errors: [], passed: true, audited: false });

  const PHASES: { id: string; title: string; subtitle: string; color: string }[] = [
    { id: 'month_0', title: 'Month 0 (Step 1)', subtitle: 'Exam, OHI, PMPR, Splinting', color: 'border-blue-500 bg-blue-950/30 text-blue-400' },
    { id: 'month_1_2', title: 'Month 1–2 (Step 2)', subtitle: 'Subgingival Debridement', color: 'border-cyan-500 bg-cyan-950/30 text-cyan-400' },
    { id: 'month_3', title: 'Month 3 (Milestone)', subtitle: 'Periodontal Re-Evaluation', color: 'border-amber-500 bg-amber-950/30 text-amber-400' },
    { id: 'month_4_6', title: 'Month 4–6 (Step 3 & Rehab)', subtitle: 'Surgery, Ortho & Implants', color: 'border-purple-500 bg-purple-950/30 text-purple-400' },
    { id: 'month_6_plus', title: 'Month 6+ (Step 4 Lifelong)', subtitle: 'Supportive Care 3-Mo Recalls', color: 'border-emerald-500 bg-emerald-950/30 text-emerald-400' }
  ];

  const moveProcedure = (procId: string, targetPhase: string) => {
    const next: Record<string, string[]> = { ...phaseAssignments };
    // Remove from current phase
    Object.keys(next).forEach((phase) => {
      next[phase] = next[phase].filter((id) => id !== procId);
    });
    // Add to target phase
    next[targetPhase] = [...(next[targetPhase] || []), procId];
    setPhaseAssignments(next);
    setAuditResult({ ...auditResult, audited: false });
  };

  const runAudit = () => {
    const errors: string[] = [];
    let correctCount = 0;

    ALL_PROCEDURES.forEach((proc) => {
      const assignedPhase = Object.keys(phaseAssignments).find((phase) =>
        phaseAssignments[phase].includes(proc.id)
      );

      if (!assignedPhase) {
        errors.push(`Missing: "${proc.name}" has not been scheduled in any visit.`);
      } else if (assignedPhase === proc.idealPhase) {
        correctCount++;
      } else {
        // Clinical reasoning for error
        if (proc.id === 'p8' && (assignedPhase === 'month_0' || assignedPhase === 'month_1_2' || assignedPhase === 'month_3')) {
          errors.push(`Clinical Violation: Moving teeth with orthodontics before achieving shallow maintainable pockets (Step 2 re-eval) causes catastrophic bone destruction!`);
        } else if (proc.id === 'p7' && (assignedPhase === 'month_0' || assignedPhase === 'month_1_2')) {
          errors.push(`Clinical Violation: Periodontal surgery should never precede cause-related subgingival instrumentation (Step 2).`);
        } else if (proc.id === 'p9' && assignedPhase !== 'month_4_6') {
          errors.push(`Timing Error: Definitive dental implants must be placed after successful completion of active periodontal therapy.`);
        } else {
          errors.push(`Sequencing Suboptimal: "${proc.name}" is scheduled in ${assignedPhase.replace('_', ' ')} instead of ${proc.idealPhase.replace('_', ' ')}.`);
        }
      }
    });

    const score = Math.round((correctCount / ALL_PROCEDURES.length) * 100);
    setAuditResult({
      score,
      errors,
      passed: score >= 80,
      audited: true
    });
  };

  const resetTimeline = () => {
    setPhaseAssignments({
      month_0: ['p1', 'p2', 'p3'],
      month_1_2: ['p4', 'p5'],
      month_3: ['p6'],
      month_4_6: ['p7', 'p8', 'p9'],
      month_6_plus: ['p10']
    });
    setAuditResult({ score: 100, errors: [], passed: true, audited: false });
  };

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 shadow-2xl space-y-6">
      <div className="border-b border-slate-800 pb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            Interactive Clinical Visit Scheduling &amp; Milestone Auditor
          </h3>
          <p className="text-xs text-slate-400">
            Schedule procedures across multi-month phases and run the EFP S3 Guideline Compliance Auditor.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetTimeline}
            className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 hover:text-white text-xs font-semibold transition"
          >
            Reset Template
          </button>
          <button
            onClick={runAudit}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-200" />
            <span>Audit Clinical Schedule</span>
          </button>
        </div>
      </div>

      {/* Audit Banner if Audited */}
      {auditResult.audited && (
        <div
          className={`p-4 rounded-2xl border text-xs space-y-2 animate-in fade-in ${
            auditResult.passed
              ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/70 border-rose-500/50 text-rose-200'
          }`}
        >
          <div className="flex items-center justify-between font-bold text-sm">
            <span className="flex items-center gap-2">
              {auditResult.passed ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-rose-400" />}
              {auditResult.passed ? 'EFP S3 Clinical Guidelines Compliant!' : 'Sequencing Violations Detected!'}
            </span>
            <span className="font-mono text-base">{auditResult.score}% Compliance</span>
          </div>

          {auditResult.errors.length > 0 && (
            <ul className="list-disc list-inside space-y-1 text-[11px] pt-1 border-t border-slate-800/80">
              {auditResult.errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Timeline Phases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
        {PHASES.map((phase) => {
          const procsInPhase = (phaseAssignments[phase.id] || [])
            .map((id) => ALL_PROCEDURES.find((p) => p.id === id))
            .filter(Boolean) as ProcedureItem[];

          return (
            <div
              key={phase.id}
              className={`p-4 rounded-2xl border flex flex-col justify-between min-h-[300px] ${phase.color}`}
            >
              <div className="space-y-2">
                <div className="border-b border-slate-800/60 pb-2">
                  <span className="text-xs font-mono font-bold block">{phase.title}</span>
                  <span className="text-[10px] text-slate-400">{phase.subtitle}</span>
                </div>

                {/* Procedure Cards in this phase */}
                <div className="space-y-2 pt-1">
                  {procsInPhase.map((proc) => (
                    <div
                      key={proc.id}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1 shadow-md hover:border-slate-700 transition"
                    >
                      <div className="font-semibold text-white text-[11px] leading-snug">
                        {proc.name}
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1 border-t border-slate-900">
                        <span className="font-mono text-cyan-300">{proc.category}</span>
                        {/* Quick Move Select */}
                        <select
                          value={phase.id}
                          onChange={(e) => moveProcedure(proc.id, e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded px-1 py-0.5 text-[9px] text-slate-300"
                        >
                          <option value="month_0">M0</option>
                          <option value="month_1_2">M1-2</option>
                          <option value="month_3">M3</option>
                          <option value="month_4_6">M4-6</option>
                          <option value="month_6_plus">M6+</option>
                        </select>
                      </div>
                    </div>
                  ))}

                  {procsInPhase.length === 0 && (
                    <div className="p-4 text-center text-[11px] text-slate-500 border border-dashed border-slate-800 rounded-xl">
                      No procedures assigned to this visit
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
