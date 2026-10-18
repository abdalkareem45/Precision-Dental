import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Lecture1 } from './components/Lecture1';
import { Lecture2 } from './components/Lecture2';
import { Logomark } from './components/UI';

const MAIN_TABS = [
  { id: 'lec1', label: 'Lecture 1: Facial Fractures & ATLS', num: '01' },
  { id: 'lec2', label: 'Lecture 2: Fractures of the Mandible', num: '02' },
];

export default function App() {
  const [tab, setTab] = useState('lec1');
  const [visited, setVisited] = useState<Record<string, boolean>>({});
  const [xp, setXp] = useState(0);
  const [awarded, setAwarded] = useState<Record<string, boolean>>({});
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!visited[tab]) {
      setVisited((v) => ({ ...v, [tab]: true }));
      setXp((x) => x + 25);
    }
    if (mainRef.current) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tab]); // eslint-disable-line

  const giveXp = useCallback((key: string, amount: number) => {
    setAwarded((prev) => {
      if (prev[key]) return prev;
      setXp((x) => x + amount);
      return { ...prev, [key]: true };
    });
  }, []);

  const level = Math.floor(xp / 100) + 1;
  const levelProgress = ((xp % 100) / 100) * 100;

  return (
    <div className="min-h-screen bg-[#FAF8F3] font-sans">
      <header className="sticky top-0 z-50 bg-[#0B1F4D] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between gap-4 py-3">
            <div className="flex items-center gap-3 min-w-0">
              <Logomark className="w-10 h-10 shrink-0" />
              <div className="min-w-0">
                <div className="font-extrabold tracking-[0.14em] text-[15px] md:text-[17px] leading-none whitespace-nowrap">
                  PRECISION <span className="text-[#C9A24B]">DENTAL</span>
                </div>
                <div className="font-ar text-[#C9A24B] text-[13px] md:text-[15px] leading-tight mt-0.5">دقة الأسنان</div>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden sm:block text-right">
                <div className="text-[10px] font-bold tracking-[0.18em] text-white/50 uppercase">Level {level}</div>
                <div className="text-[13px] font-extrabold text-[#C9A24B]">{xp} XP</div>
                <div className="mt-1 w-24 h-1.5 rounded-full bg-white/15 overflow-hidden">
                  <div className="h-full bg-[#C9A24B] rounded-full transition-all duration-500" style={{ width: `${levelProgress}%` }} />
                </div>
              </div>
              <div className="sm:hidden px-3 py-1.5 rounded-lg bg-[#C9A24B]/20 border border-[#C9A24B]/40 text-[#C9A24B] text-[12px] font-extrabold">
                {xp} XP
              </div>
            </div>
          </div>

          {/* Main Lecture Tabs */}
          <div className="flex gap-2 overflow-x-auto thin-scroll pb-3 pt-1">
            {MAIN_TABS.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold tracking-wide transition-all whitespace-nowrap flex items-center gap-2 ${
                    active ? 'bg-[#C9A24B] text-white shadow-lg scale-[1.02]' : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <span className="w-5 h-5 rounded-md bg-black/20 flex items-center justify-center text-[10px]">{t.num}</span>
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main ref={mainRef} className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10">
        {tab === 'lec1' && <Lecture1 />}
        {tab === 'lec2' && <Lecture2 giveXp={giveXp} />}

        <div className="mt-12 flex items-center justify-between gap-4 border-t border-[#E6E8EC] pt-6">
          {tab === 'lec1' ? (
            <>
              <span />
              <button onClick={() => setTab('lec2')} className="px-6 py-3 rounded-xl bg-[#1B3A8C] text-white font-bold text-sm shadow-md hover:bg-[#0B1F4D] transition-colors">
                Proceed to Lecture 2: Fractures of the Mandible →
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setTab('lec1')} className="px-6 py-3 rounded-xl border border-[#E6E8EC] bg-white text-[#0B1F4D] font-bold text-sm hover:border-[#C9A24B] transition-colors">
                ← Back to Lecture 1: Facial Fractures
              </button>
              <span />
            </>
          )}
        </div>
      </main>

      <footer className="bg-[#0B1F4D] text-white/70 mt-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Logomark className="w-9 h-9" />
              <div>
                <div className="font-extrabold tracking-[0.14em] text-[13px] text-white">
                  PRECISION <span className="text-[#C9A24B]">DENTAL</span>
                </div>
                <div className="font-ar text-[#C9A24B] text-[13px]">دقة الأسنان</div>
              </div>
            </div>
            <div className="text-[12px] leading-relaxed md:text-right">
              <p className="text-white/80 font-semibold">Oral Surgery · Preliminary Management of Facial Fractures &amp; Fractures of the Mandible</p>
              <p className="mt-0.5">Fifth Stage · Dr Mohammed Najim · Dr. Cube Dentistry | 2026 Edition</p>
              <p className="mt-2 text-[#C9A24B]/80 font-semibold">Advanced dentistry for a brighter tomorrow.</p>
            </div>
          </div>
          <div className="mt-6 pt-5 border-t border-white/10 text-[11px] text-white/40">
            Educational tool for 5th-year dental students. Always follow your local clinical guidelines and consultant advice.
          </div>
        </div>
      </footer>
    </div>
  );
}
