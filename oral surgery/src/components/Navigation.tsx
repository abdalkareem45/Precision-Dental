import React from 'react';

interface NavigationProps {
  tab: string;
  setTab: (tab: string) => void;
  tabs: { id: string; label: string; num: string }[];
}

export const Navigation: React.FC<NavigationProps> = ({ tab, setTab, tabs }) => {
  return (
    <nav className="flex gap-1 overflow-x-auto thin-scroll pb-2 -mx-1 px-1">
      {tabs.map((t) => {
        const active = tab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`shrink-0 px-3.5 py-2 rounded-xl text-[12.5px] font-bold transition-all whitespace-nowrap ${
              active ? 'bg-[#C9A24B] text-white shadow-[0_6px_24px_-8px_rgba(11,31,77,0.18)]' : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className={`mr-1.5 text-[10px] ${active ? 'text-white/80' : 'text-[#C9A24B]/80'}`}>
              {t.num}
            </span>
            {t.label}
          </button>
        );
      })}
    </nav>
  );
};
