import React from 'react';
import { X, Sparkles, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { LECTURES_DATA } from '../data/lecturesData';

interface ClinicalPearlsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLecture: (id: number) => void;
}

export const ClinicalPearlsModal: React.FC<ClinicalPearlsModalProps> = ({
  isOpen,
  onClose,
  onSelectLecture,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1F4D]/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-[#FAF8F3] rounded-2xl shadow-2xl border border-[#E6E8EC] overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#E6E8EC] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#C9A24B]" />
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-[#0B1F4D]">
                Precision Dental: High-Yield Clinical Pearls & Golden Rules
              </h3>
              <p className="text-[11px] text-slate-500 font-sans">
                Quick diagnostic and procedural guidelines from the 5th-grade Preventive Curriculum
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-[#E6E8EC]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pearls List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {Object.values(LECTURES_DATA).map((lec) => (
            <div key={lec.meta.id} className="p-4 rounded-xl bg-white border border-[#E6E8EC] shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E6E8EC]/80">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-md bg-[#0B1F4D] text-[#C9A24B] text-[10px] font-bold">
                    {lec.meta.id}
                  </span>
                  <span className="font-bold text-xs text-[#0B1F4D] truncate">
                    {lec.meta.title}
                  </span>
                </div>
                <button
                  onClick={() => {
                    onSelectLecture(lec.meta.id);
                    onClose();
                  }}
                  className="text-[10px] font-bold text-[#1B3A8C] hover:underline"
                >
                  Open Tab →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                {lec.clinicalPearls.map((pearl, pIdx) => {
                  return (
                    <div
                      key={pIdx}
                      className={`p-3 rounded-lg border text-xs flex flex-col justify-between ${
                        pearl.significance === 'warning'
                          ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                          : pearl.significance === 'crucial'
                          ? 'bg-blue-50/70 border-blue-200 text-blue-950'
                          : 'bg-[#FAF8F3] border-[#E6E8EC] text-slate-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5 mb-1 font-bold">
                          {pearl.significance === 'warning' ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          ) : pearl.significance === 'crucial' ? (
                            <ShieldCheck className="w-3.5 h-3.5 text-[#1B3A8C] shrink-0" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5 text-[#C9A24B] shrink-0" />
                          )}
                          <span className="truncate">{pearl.title}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed opacity-90">{pearl.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-white border-t border-[#E6E8EC] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#0B1F4D] text-white text-xs font-bold hover:bg-[#1B3A8C] transition-colors"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
