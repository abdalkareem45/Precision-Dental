import { ArrowRight, BookOpen, Compass, Layers } from 'lucide-react';
import { useEffect, useState } from 'react';
import { LectureModule, SceneId } from '../types/prosthodontics';
import { PrecisionLogo } from './PrecisionLogo';
import { sourcePdfUrl } from '../utils/assets';

interface HeroSceneProps {
  lecture: LectureModule;
  activeScene: SceneId;
  onSelectScene: (scene: SceneId) => void;
}

const SCENE_ROADMAP: { id: SceneId; step: string; label: string }[] = [
  { id: 'scene-1', step: '01', label: 'Overview & Map' },
  { id: 'scene-2', step: '02', label: 'Core Concepts' },
  { id: 'scene-3', step: '03', label: '3D & 2D Visuals' },
  { id: 'scene-4', step: '04', label: 'Clinical Cases' },
  { id: 'scene-5', step: '05', label: 'Challenge Quiz' },
  { id: 'scene-6', step: '06', label: 'Storyboard & Review' },
];

export function HeroScene({ lecture, activeScene, onSelectScene }: HeroSceneProps) {
  const [focusedLayerId, setFocusedLayerId] = useState<string>(
    lecture.hero.animatedLayers[0]?.id ?? ''
  );

  useEffect(() => {
    setFocusedLayerId(lecture.hero.animatedLayers[0]?.id ?? '');
  }, [lecture.id, lecture.hero.animatedLayers]);

  return (
    <section className="space-y-8">
      {/* Main Hero Grid */}
      <div className="bg-white in-[.prostho-studio[data-theme=dark]]:bg-[#0B1F4D] border border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/50 rounded-xl p-6 sm:p-8 lg:p-10 transition-colors">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left 7 columns: Editorial Headline & Learning Objectives */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B]">
                <span>Lecture {lecture.number}</span>
                <span aria-hidden="true">·</span>
                <span>{lecture.lecturer}</span>
                <span aria-hidden="true">·</span>
                <a href={sourcePdfUrl(lecture.id)} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Source PDF</a>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3] leading-tight">
                {lecture.hero.headline}
              </h2>

              <p className="text-sm sm:text-base text-[#0B1F4D]/80 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/85 leading-relaxed max-w-2xl">
                {lecture.hero.subheadline}
              </p>
            </div>

            {/* Key Clinical Metrics Row (Tabular Numerals) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/40">
              {lecture.hero.keyMetrics.map((metric) => (
                <div key={metric.label} className="pt-3">
                  <div className="text-xs font-medium text-[#0B1F4D]/65 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/70">
                    {metric.label}
                  </div>
                  <div className="mt-1 text-lg font-bold text-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B] font-mono tabular-nums">
                    {metric.value}
                  </div>
                  {metric.unit && (
                    <div className="text-xs text-[#0B1F4D]/60 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/65">
                      {metric.unit}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => onSelectScene('scene-3')}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white in-[.prostho-studio[data-theme=dark]]:text-[#0B1F4D] bg-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:bg-[#C9A24B] hover:bg-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:hover:bg-[#E0BC64] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A24B]"
              >
                <span>Open Lecture {lecture.number} 3D & 2D Visuals</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onSelectScene('scene-2')}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3] bg-[#FAF8F3] in-[.prostho-studio[data-theme=dark]]:bg-[#06112B] hover:bg-[#E6E8EC]/70 in-[.prostho-studio[data-theme=dark]]:hover:bg-[#1B3A8C]/40 border border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A24B]"
              >
                <Compass className="w-4 h-4 text-[#C9A24B]" aria-hidden="true" />
                <span>Explore Concepts</span>
              </button>
            </div>
          </div>

          {/* Right 5 columns: Animated Interactive Brand & Layer Visualization */}
          <div className="lg:col-span-5 bg-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:bg-[#06112B] text-[#FAF8F3] rounded-xl p-6 border border-[#1B3A8C]/40 flex flex-col justify-between space-y-6">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <PrecisionLogo className="w-11 h-11 shrink-0" />
                <div>
                  <div className="text-sm font-bold tracking-wide text-[#FAF8F3]">
                    PRECISION DENTAL
                  </div>
                  <div className="font-arabic text-base text-[#C9A24B]" lang="ar" dir="rtl">
                    دقة الأسنان
                  </div>
                </div>
              </div>
              <div className="text-right text-xs text-[#E6E8EC]/80 tabular-nums">
                <div>{lecture.estimatedMinutes} min lab</div>
                <div>1 3D · 4 2D Modules</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#C9A24B]">
                <Layers className="w-4 h-4" aria-hidden="true" />
                <span>Lecture {lecture.number} Visual Layers</span>
              </div>
              <div className="space-y-2">
                {lecture.hero.animatedLayers.map((layer, idx) => {
                  const isFocused = focusedLayerId === layer.id || (!focusedLayerId && idx === 0);
                  return (
                    <button
                      key={layer.id}
                      type="button"
                      onClick={() => setFocusedLayerId(layer.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-all duration-150 hover:translate-x-[3px] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A24B] ${
                        isFocused
                          ? 'bg-[#1B3A8C] border-[#C9A24B] text-white'
                          : 'bg-white/5 border-white/10 text-[#E6E8EC] hover:bg-white/10'
                      }`}
                    >
                      <div className="text-xs font-semibold">
                        0{idx + 1}. {layer.label}
                      </div>
                      <div className="text-xs text-[#E6E8EC]/80 mt-0.5">{layer.detail}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="text-xs text-[#E6E8EC]/75 border-t border-white/10 pt-3">
              {lecture.sourceLabel}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive 6-Scene Storyboard Roadmap */}
      <div className="bg-white in-[.prostho-studio[data-theme=dark]]:bg-[#0B1F4D] border border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/50 rounded-xl p-5 sm:p-6 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <h2 className="text-sm font-bold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B]" aria-hidden="true" />
            <span>Lecture {lecture.number} Interactive Sequence (Scenes 1–6)</span>
          </h2>
          <span className="text-xs text-[#0B1F4D]/65 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/70">
            Jump directly to overview, 3D visuals, 2D labs, cases, quiz, or blueprint
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {SCENE_ROADMAP.map((scene) => {
            const isCurrent = activeScene === scene.id;
            return (
              <button
                key={scene.id}
                type="button"
                onClick={() => onSelectScene(scene.id)}
                className={`p-3 rounded-lg border text-left transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A24B] ${
                  isCurrent
                    ? 'bg-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:bg-[#1B3A8C] border-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:border-[#C9A24B] text-white'
                    : 'bg-[#FAF8F3] in-[.prostho-studio[data-theme=dark]]:bg-[#06112B] border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/40 text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC] hover:border-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:hover:border-[#C9A24B]'
                }`}
              >
                <div
                  className={`text-[11px] font-mono tabular-nums ${
                    isCurrent ? 'text-[#C9A24B]' : 'text-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B]'
                  }`}
                >
                  Scene {scene.step}
                </div>
                <div className="text-xs font-semibold mt-0.5 truncate">{scene.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Learning Objectives & Prerequisites Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white in-[.prostho-studio[data-theme=dark]]:bg-[#0B1F4D] border border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/50 rounded-xl p-6 space-y-4 transition-colors">
          <h2 className="text-base font-bold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3]">
            Learning Objectives — Lecture {lecture.number}
          </h2>
          <ul className="space-y-2.5 text-sm text-[#0B1F4D]/85 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/85">
            {lecture.journeyMap.objectives.map((obj, idx) => (
              <li key={obj} className="flex items-start gap-3">
                <span className="font-mono text-xs font-semibold text-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B] mt-0.5 tabular-nums">
                  0{idx + 1}.
                </span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white in-[.prostho-studio[data-theme=dark]]:bg-[#0B1F4D] border border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/50 rounded-xl p-6 space-y-4 transition-colors">
          <h2 className="text-base font-bold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3]">
            Clinical Competencies
          </h2>
          <ul className="space-y-2 text-sm text-[#0B1F4D]/80 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/80">
            {lecture.journeyMap.competencies.map((comp) => (
              <li
                key={comp}
                className="pb-2 border-b border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/40 last:border-b-0 last:pb-0"
              >
                {comp}
              </li>
            ))}
          </ul>
          <div className="pt-2">
            <div className="text-xs font-semibold text-[#0B1F4D]/65 in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B]">
              Prerequisites
            </div>
            <div className="mt-1 text-xs text-[#0B1F4D]/80 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/80">
              {lecture.journeyMap.prerequisites.join(' · ')}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
