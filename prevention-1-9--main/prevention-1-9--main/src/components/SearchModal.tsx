import React, { useState } from 'react';
import { Search, X, ChevronRight, BookOpen } from 'lucide-react';
import { LECTURES_DATA } from '../data/lecturesData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLecture: (id: number) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectLecture,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const results = Object.values(LECTURES_DATA).filter((lec) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      lec.meta.title.toLowerCase().includes(term) ||
      lec.meta.arabicTitle.includes(term) ||
      lec.meta.summary.toLowerCase().includes(term) ||
      lec.meta.keyTopics.some(t => t.toLowerCase().includes(term)) ||
      lec.clinicalPearls.some(p => p.title.toLowerCase().includes(term) || p.description.toLowerCase().includes(term))
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1F4D]/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#FAF8F3] rounded-2xl shadow-2xl border border-[#E6E8EC] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Search Input Bar */}
        <div className="p-4 bg-white border-b border-[#E6E8EC] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#1B3A8C] shrink-0" />
          <input
            type="text"
            placeholder="Search keywords (e.g. Stephan curve, Bis-GMA, CPP-ACP, Fluorosis, Vipeholm, Implants)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-[#0B1F4D] placeholder-slate-400 focus:outline-hidden font-sans font-medium"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-[#E6E8EC]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {results.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              No matching clinical topics found. Try another search term.
            </div>
          ) : (
            results.map((lec) => (
              <div
                key={lec.meta.id}
                onClick={() => {
                  onSelectLecture(lec.meta.id);
                  onClose();
                }}
                className="p-3.5 rounded-xl bg-white hover:bg-[#FAF8F3] border border-[#E6E8EC] hover:border-[#C9A24B]/40 cursor-pointer transition-all group flex items-start justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#0B1F4D] text-[#C9A24B] font-bold text-xs shrink-0 mt-0.5">
                    {lec.meta.id}
                  </span>
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs sm:text-sm text-[#0B1F4D] group-hover:text-[#1B3A8C] truncate">
                      {lec.meta.title}
                    </h4>
                    <p className="text-[11px] text-[#1B3A8C] font-arabic truncate mt-0.5">
                      {lec.meta.arabicTitle}
                    </p>
                    <p className="text-[11px] text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                      {lec.meta.summary}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#C9A24B] shrink-0 self-center transition-colors" />
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-white border-t border-[#E6E8EC] text-[11px] text-slate-500 flex justify-between items-center">
          <span>Click any lecture to jump straight into its 3D & 2D suite</span>
          <span className="font-semibold text-[#1B3A8C]">{results.length} Lectures Found</span>
        </div>
      </div>
    </div>
  );
};
