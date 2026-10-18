import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white border border-[#E6E8EC] rounded-2xl shadow-[0_6px_24px_-8px_rgba(11,31,77,0.18)] ${className}`}>
    {children}
  </div>
);

export const SectionTitle: React.FC<{ eyebrow?: string; title: string; subtitle?: string }> = ({ eyebrow, title, subtitle }) => (
  <div className="mb-6">
    {eyebrow && <div className="text-[11px] font-bold tracking-[0.22em] text-[#C9A24B] uppercase mb-1.5">{eyebrow}</div>}
    <h2 className="font-extrabold text-2xl md:text-[28px] leading-tight text-[#0B1F4D]">{title}</h2>
    {subtitle && <p className="text-slate-600 mt-2 text-sm md:text-[15px] leading-relaxed">{subtitle}</p>}
  </div>
);

export const Pill: React.FC<{ children: React.ReactNode; tone?: 'grey' | 'gold' | 'blue' | 'green' | 'red' }> = ({ children, tone = 'grey' }) => {
  const tones = {
    gold: 'bg-[#C9A24B]/15 text-[#8a6c25] border-[#C9A24B]/40',
    blue: 'bg-[#1B3A8C]/10 text-[#1B3A8C] border-[#1B3A8C]/25',
    grey: 'bg-[#E6E8EC] text-slate-600 border-slate-300',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    red: 'bg-rose-50 text-rose-700 border-rose-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-bold tracking-wide ${tones[tone]}`}>
      {children}
    </span>
  );
};

export const Logomark: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="pdGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#EBD79B"/><stop offset="45%" stopColor="#C9A24B"/><stop offset="100%" stopColor="#9E7C2C"/>
      </linearGradient>
      <linearGradient id="pdBlue" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#2A53B8"/><stop offset="100%" stopColor="#0B1F4D"/>
      </linearGradient>
    </defs>
    <path d="M20 6c-6 0-10 4-10 10 0 8 3 13 5 21 1 6 2 15 5 15s4-8 5-13c1-4 3-6 7-6s6 2 7 6c1 5 2 13 5 13s4-9 5-15c2-8 5-13 5-21 0-6-4-10-10-10-5 0-8 3-12 3s-7-3-12-3z" fill="url(#pdBlue)"/>
    <path d="M20 6c-6 0-10 4-10 10 0 8 3 13 5 21 1 6 2 15 5 15s4-8 5-13c1-4 3-6 7-6s6 2 7 6c1 5 2 13 5 13s4-9 5-15c2-8 5-13 5-21 0-6-4-10-10-10-5 0-8 3-12 3s-7-3-12-3z" fill="none" stroke="url(#pdGold)" strokeWidth="3.2" strokeLinejoin="round"/>
    <path d="M14 20c6-5 14-7 22-4" fill="none" stroke="url(#pdGold)" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="52" cy="10" r="3.4" fill="url(#pdGold)"/>
  </svg>
);
