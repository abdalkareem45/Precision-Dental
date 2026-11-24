import { Award, Moon, Sun } from 'lucide-react';
import type { SceneId } from '../types/prosthodontics';

interface TopNavProps {
  activeScene: SceneId;
  isDark: boolean;
  onToggleDark: () => void;
  onSelectScene: (scene: SceneId) => void;
  onOpenProgress: () => void;
}

const SCENE_LINKS: { id: SceneId; label: string }[] = [
  { id: 'scene-1', label: 'Overview' },
  { id: 'scene-2', label: 'Concepts' },
  { id: 'scene-3', label: '3D & 2D Lab' },
  { id: 'scene-4', label: 'Cases' },
  { id: 'scene-5', label: 'Assessment' },
  { id: 'scene-6', label: 'Review' },
];

export function TopNav({ activeScene, isDark, onToggleDark, onSelectScene, onOpenProgress }: TopNavProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-white in-[.prostho-studio[data-theme=dark]]:bg-[#0B1F4D] border-b border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/40">
      <nav aria-label="Within this lecture" className="flex flex-1 gap-3 overflow-x-auto text-sm no-scrollbar">
        {SCENE_LINKS.map(({ id, label }) => (
          <button key={id} type="button" onClick={() => onSelectScene(id)}
            aria-current={activeScene === id ? 'step' : undefined}
            className={`shrink-0 cursor-pointer rounded px-2 py-2 ${activeScene === id ? 'bg-[#1B3A8C] text-white' : 'hover:bg-[#C9A24B]/20'}`}>
            {label}
          </button>
        ))}
      </nav>
      <button type="button" onClick={onOpenProgress} className="inline-flex items-center gap-2 cursor-pointer rounded px-3 py-2 text-sm border border-[#C9A24B]">
        <Award className="w-4 h-4" aria-hidden="true" /> Progress
      </button>
      <button type="button" onClick={onToggleDark} aria-label="Toggle studio dark theme" aria-pressed={isDark}
        className="cursor-pointer rounded p-2 border border-[#C9A24B]">
        {isDark ? <Sun className="w-4 h-4" aria-hidden="true" /> : <Moon className="w-4 h-4" aria-hidden="true" />}
      </button>
    </div>
  );
}
