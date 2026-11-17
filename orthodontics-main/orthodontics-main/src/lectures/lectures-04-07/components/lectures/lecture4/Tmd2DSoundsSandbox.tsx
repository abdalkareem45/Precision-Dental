import { useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2 } from 'lucide-react';
import { SandboxShell } from '../../common/SandboxShell';

type SoundMode = 'normal' | 'click' | 'crepitation';

const SOUND_DATA: Record<
  SoundMode,
  {
    label: string;
    acousticPattern: string;
    pathology: string;
    description: string;
  }
> = {
  normal: {
    label: 'Normal Silent Joint',
    acousticPattern: 'Smooth, continuous glide',
    pathology: 'Intact disc-condyle complex',
    description:
      'Biconcave disc remains centered between condyle and articular eminence throughout opening and closing with zero audible noise.',
  },
  click: {
    label: 'Joint Click',
    acousticPattern: 'Single sound of short duration',
    pathology: 'Disc reduction / displacement',
    description:
      'A distinct, single short-duration acoustic impulse occurring when the condyle snaps onto or off an anteriorly displaced disc.',
  },
  crepitation: {
    label: 'Crepitation',
    acousticPattern: 'Multiple, gravel-like grating sound',
    pathology: 'Osteoarthritic articular changes',
    description:
      'Continuous, complicated, rough gravel-like crunching produced by bone-on-bone friction or degenerated fibrous articular surfaces.',
  },
};

export function Tmd2DSoundsSandbox() {
  const [mode, setMode] = useState<SoundMode>('click');
  const [cyclePct, setCyclePct] = useState(38);
  const [playing, setPlaying] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!playing) return;
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setPlaying(false);
      return;
    }
    const id = window.setInterval(() => {
      setCyclePct((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 55);
    return () => window.clearInterval(id);
  }, [playing]);

  useEffect(() => {
    return () => {
      audioCtxRef.current?.close().catch(() => {});
      audioCtxRef.current = null;
    };
  }, []);

  const playAcousticDemo = () => {
    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new Ctx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        void ctx.resume().catch(() => {});
      }
      const now = ctx.currentTime;

      if (mode === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(620, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.045);
        gain.gain.setValueAtTime(0.32, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(gain).connect(ctx.destination);
        osc.onended = () => {
          osc.disconnect();
          gain.disconnect();
        };
        osc.start(now);
        osc.stop(now + 0.055);
      } else if (mode === 'crepitation') {
        // Multiple short gravel-like micro-pulses
        for (let i = 0; i < 8; i++) {
          const offset = i * 0.048;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(180 + (i % 3) * 95, now + offset);
          gain.gain.setValueAtTime(0.14, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.032);
          osc.connect(gain).connect(ctx.destination);
          osc.onended = () => {
            osc.disconnect();
            gain.disconnect();
          };
          osc.start(now + offset);
          osc.stop(now + offset + 0.035);
        }
      }
      // Normal joint mode is intentionally silent.
    } catch {
      // AudioContext unavailable in restricted environments
    }
  };

  const handleReset = () => {
    setPlaying(false);
    setMode('click');
    setCyclePct(38);
  };

  // Cycle mapping: 0-50 opening, 50-100 closing
  const openRatio = cyclePct <= 50 ? cyclePct / 50 : (100 - cyclePct) / 50;
  const condyleX = 115 + openRatio * 85;
  const condyleY = 104 + openRatio * 24;
  const discDisplaced = mode === 'click' && openRatio < 0.45;
  const discX = discDisplaced ? condyleX + 26 : condyleX + 4;
  const discY = discDisplaced ? condyleY - 4 : condyleY - 19;

  const isClickSpike = mode === 'click' && ((cyclePct >= 20 && cyclePct <= 26) || (cyclePct >= 74 && cyclePct <= 80));

  return (
    <SandboxShell
      id="lec4-2d-sounds"
      kind="2D Sandbox"
      title="TMJ Joint Sounds: Single Click vs. Osteoarthritic Crepitation"
      instruction="Switch sound type, scrub the opening/closing cycle, and compare acoustic signatures"
      onReset={handleReset}
    >
      <div className="space-y-4">
        {/* Top Mode Selector + Audio Cue */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(SOUND_DATA) as SoundMode[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setMode(key)}
                aria-pressed={mode === key}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                  mode === key
                    ? 'bg-[#1B3A8C] border-[#1B3A8C] text-white'
                    : 'bg-[#FAF8F3] border-[#E6E8EC] text-[#0B1F4D] hover:border-[#1B3A8C]'
                }`}
              >
                {SOUND_DATA[key].label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-pressed={playing}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-[#0B1F4D] text-white hover:bg-[#1B3A8C] transition-colors cursor-pointer"
            >
              {playing ? <Pause className="w-3.5 h-3.5" aria-hidden="true" /> : <Play className="w-3.5 h-3.5" aria-hidden="true" />}
              <span>{playing ? 'Pause Cycle' : 'Animate Cycle'}</span>
            </button>
            <button
              type="button"
              onClick={playAcousticDemo}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-[#FAF8F3] border border-[#C9A24B] text-[#0B1F4D] hover:bg-[#C9A24B]/15 transition-colors cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#8A691B]" aria-hidden="true" />
              <span>{mode === 'normal' ? 'Normal Joint: Silent' : 'Preview Sound'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Joint Motion Schematic */}
          <div className="lg:col-span-5 bg-[#FAF8F3] border border-[#E6E8EC] rounded-xl p-4 flex flex-col justify-between">
            <svg viewBox="0 0 320 190" className="w-full h-44" role="img" aria-label="Sagittal TMJ condyle and articular disc position schematic">
              {/* Glenoid fossa & articular eminence */}
              <path
                d="M40,42 L280,42 L280,84 Q240,86 210,104 Q182,118 152,82 Q122,48 92,84 L40,84 Z"
                fill="#FFFFFF"
                stroke="#0B1F4D"
                strokeWidth="2"
              />
              {/* Articular eminence rough zone in OA */}
              {mode === 'crepitation' && (
                <path
                  d="M142,84 L152,90 L162,85 L172,94 L182,91 L192,102 L202,99 L212,104"
                  fill="none"
                  stroke="#D97706"
                  strokeWidth="2.5"
                />
              )}

              {/* Articular disc */}
              <ellipse
                cx={discX}
                cy={discY}
                rx="22"
                ry="6"
                transform={`rotate(${discDisplaced ? 24 : 10} ${discX} ${discY})`}
                fill={mode === 'crepitation' ? '#D97706' : '#1B3A8C'}
                opacity="0.85"
              />

              {/* Condylar head */}
              <path
                d={`M${condyleX - 18},${condyleY + 62} L${condyleX - 15},${condyleY + 12} C${condyleX - 15},${condyleY - 14} ${condyleX + 15},${condyleY - 14} ${condyleX + 15},${condyleY + 12} L${condyleX + 20},${condyleY + 62} Z`}
                fill="#E6E8EC"
                stroke="#0B1F4D"
                strokeWidth="2"
              />

              {isClickSpike && (
                <circle cx={condyleX + 8} cy={condyleY - 10} r="14" fill="none" stroke="#C9A24B" strokeWidth="2.5" />
              )}

              <text x="16" y="24" fontSize="11" fontWeight="700" fill="#0B1F4D">
                {cyclePct <= 50 ? 'Phase: Jaw Opening' : 'Phase: Jaw Closing'} ({Math.round(openRatio * 45)} mm)
              </text>
            </svg>
            <p className="text-xs text-[#475569] mt-2">{SOUND_DATA[mode].description}</p>
          </div>

          {/* Acoustic Waveform Plot */}
          <div className="lg:col-span-7 bg-[#0B1F4D] rounded-xl p-4 text-white flex flex-col justify-between">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-[#C9A24B]">
                Acoustic Waveform · {SOUND_DATA[mode].acousticPattern}
              </span>
              <span className="font-mono text-[11px] text-[#E6E8EC]">
                {SOUND_DATA[mode].pathology}
              </span>
            </div>

            <svg viewBox="0 0 500 130" className="w-full h-36" role="img" aria-label="TMJ joint acoustic waveform">
              <line x1="20" y1="65" x2="480" y2="65" stroke="#334155" strokeWidth="1" />
              <text x="20" y="122" fontSize="10" fill="#94A3B8">0% Closed</text>
              <text x="220" y="122" fontSize="10" fill="#94A3B8">50% Max Open</text>
              <text x="425" y="122" fontSize="10" fill="#94A3B8">100% Closed</text>

              {mode === 'normal' && (
                <path d="M20,65 L480,65" stroke="#10B981" strokeWidth="2.5" />
              )}

              {mode === 'click' && (
                <path
                  d="M20,65 L120,65 L125,18 L130,108 L135,52 L140,65 L350,65 L355,34 L360,92 L365,65 L480,65"
                  fill="none"
                  stroke="#C9A24B"
                  strokeWidth="2.5"
                />
              )}

              {mode === 'crepitation' && (
                <path
                  d="M20,65 L60,65 L68,42 L75,86 L82,36 L90,94 L98,46 L106,82 L114,34 L122,96 L130,44 L138,86 L146,40 L154,90 L162,48 L170,84 L178,38 L186,92 L194,45 L202,85 L210,48 L218,80 L226,65 L280,65 L288,46 L296,86 L304,38 L312,94 L320,42 L328,88 L336,36 L344,92 L352,48 L360,82 L368,40 L376,90 L384,46 L392,84 L400,65 L480,65"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="2"
                />
              )}

              {/* Playhead */}
              <line
                x1={20 + (cyclePct / 100) * 460}
                y1="10"
                x2={20 + (cyclePct / 100) * 460}
                y2="110"
                stroke="#FAF8F3"
                strokeWidth="2"
                strokeDasharray="3 3"
              />
            </svg>

            <div className="mt-2 flex items-center gap-3">
              <label htmlFor="sound-cycle-slider" className="text-xs font-semibold text-[#E6E8EC] whitespace-nowrap">
                Cycle Scrubber
              </label>
              <input
                id="sound-cycle-slider"
                type="range"
                min={0}
                max={100}
                value={cyclePct}
                onChange={(e) => {
                  setPlaying(false);
                  setCyclePct(Number(e.target.value));
                }}
                className="w-full accent-[#C9A24B] cursor-pointer"
              />
              <span className="font-mono text-xs text-[#C9A24B] tabular-nums w-12 text-right">
                {cyclePct}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </SandboxShell>
  );
}
