import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RotateCcw,
  Stethoscope,
} from 'lucide-react';
import { ClinicalCaseConfig, LectureId } from '../../types/lecture';
import { useLabStore } from '../../store/useLabStore';

interface ClinicalCaseSandboxProps {
  lectureId: LectureId;
  config: ClinicalCaseConfig;
}

export const ClinicalCaseSandbox: React.FC<ClinicalCaseSandboxProps> = ({
  lectureId,
  config,
}) => {
  const markSandboxCompleted = useLabStore((s) => s.markSandboxCompleted);
  const [selections, setSelections] = useState<Record<string, string>>({});

  useEffect(() => {
    setSelections({});
  }, [config]);

  const handleSelectOption = (stageId: string, optionId: string) => {
    const next = { ...selections, [stageId]: optionId };
    setSelections(next);
    const allAnswered = config.stages.every((st) => Boolean(next[st.id]));
    if (allAnswered) {
      markSandboxCompleted(`${lectureId}-case`);
    }
  };

  const statusMeta = {
    optimal: {
      label: 'Recommended Clinical Choice',
      box: 'border-emerald-300 bg-emerald-50 text-emerald-950',
      Icon: CheckCircle2,
      iconColor: 'text-emerald-700',
    },
    caution: {
      label: 'Suboptimal / Caution',
      box: 'border-amber-300 bg-amber-50 text-amber-950',
      Icon: AlertTriangle,
      iconColor: 'text-amber-700',
    },
    contraindicated: {
      label: 'Contraindicated / High Failure Risk',
      box: 'border-red-300 bg-red-50 text-red-950',
      Icon: XCircle,
      iconColor: 'text-red-700',
    },
  };

  return (
    <section
      aria-labelledby="clinical-case-heading"
      className="rounded-2xl border border-marble bg-white p-5 sm:p-6 shadow-sm space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-royal">
            2D Sandbox 02 · Clinical Case Decision Simulator
          </span>
          <h3 id="clinical-case-heading" className="text-lg font-bold text-navy mt-0.5">
            {config.title}
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setSelections({})}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-marble text-xs font-semibold text-navy hover:border-royal cursor-pointer shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Reset Case</span>
        </button>
      </div>

      {/* Patient Intake Grid */}
      <div className="rounded-xl border border-marble bg-ivory/70 p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy">
          <Stethoscope className="w-4 h-4 text-royal" aria-hidden="true" />
          <span>Patient Diagnostic Record · {config.patientProfile.ageSex}</span>
        </div>
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div>
            <dt className="font-semibold text-navy/60">Chief Complaint</dt>
            <dd className="text-navy font-medium mt-0.5">{config.patientProfile.chiefComplaint}</dd>
          </div>
          <div>
            <dt className="font-semibold text-navy/60">Dental History</dt>
            <dd className="text-navy font-medium mt-0.5">{config.patientProfile.history}</dd>
          </div>
          <div>
            <dt className="font-semibold text-navy/60">Tooth &amp; Periodontal Status</dt>
            <dd className="text-navy font-medium mt-0.5">{config.patientProfile.toothCondition}</dd>
          </div>
          <div>
            <dt className="font-semibold text-navy/60">Radiographic Findings</dt>
            <dd className="text-navy font-medium mt-0.5">{config.patientProfile.radiographicFinding}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="font-semibold text-navy/60">Occlusal &amp; Functional Context</dt>
            <dd className="text-navy font-medium mt-0.5">{config.patientProfile.occlusalFactor}</dd>
          </div>
        </dl>
      </div>

      {/* Decision Stages */}
      <div className="space-y-4">
        {config.stages.map((stage, sIdx) => {
          const pickedId = selections[stage.id];
          const pickedOption = stage.options.find((o) => o.id === pickedId);
          return (
            <div
              key={stage.id}
              className="rounded-xl border border-marble p-4 space-y-3 bg-white"
            >
              <div className="text-sm font-bold text-navy">
                <span className="font-mono text-royal mr-2">Decision {sIdx + 1}.</span>
                {stage.prompt}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {stage.options.map((opt) => {
                  const selected = pickedId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(stage.id, opt.id)}
                      aria-pressed={selected}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold transition-colors cursor-pointer ${
                        selected
                          ? 'border-royal bg-royal text-ivory shadow-sm'
                          : 'border-marble bg-ivory/60 text-navy hover:border-royal/50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              {pickedOption && (
                <div
                  aria-live="polite"
                  className={`rounded-xl border p-3.5 text-xs space-y-1.5 ${
                    statusMeta[pickedOption.outcomeStatus].box
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold">
                    {React.createElement(statusMeta[pickedOption.outcomeStatus].Icon, {
                      className: `w-4 h-4 shrink-0 ${statusMeta[pickedOption.outcomeStatus].iconColor}`,
                      'aria-hidden': true,
                    })}
                    <span>
                      {statusMeta[pickedOption.outcomeStatus].label}: {pickedOption.outcomeTitle}
                    </span>
                  </div>
                  <p className="leading-relaxed">{pickedOption.rationale}</p>
                  <p className="font-mono text-[11px] pt-1 border-t border-current/15">
                    Effect: {pickedOption.biomechanicalEffect}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-navy/65 border-t border-marble pt-3">
        Educational Simulation Notice: {config.educationalDisclaimer}
      </p>
    </section>
  );
};
