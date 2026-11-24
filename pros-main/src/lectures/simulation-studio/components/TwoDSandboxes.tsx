import { ArrowDown, ArrowUp, CheckCircle2, RotateCcw, Sliders, Stethoscope, Wrench, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  AnatomyExplorerConfig,
  AnatomyHotspot2D,
  DesignBuilderConfig,
  DiagnosticMatrixConfig,
  LectureModule,
  WorkflowSequencerConfig,
} from '../types/prosthodontics';

interface TwoDSandboxesProps {
  lecture: LectureModule;
  completedSandboxes: string[];
  onCompleteSandbox: (sandboxKey: string) => void;
}

type SandboxTab = 'anatomy' | 'builder' | 'workflow' | 'diagnostic';

export function TwoDSandboxes({
  lecture,
  completedSandboxes,
  onCompleteSandbox,
}: TwoDSandboxesProps) {
  const [activeTab, setActiveTab] = useState<SandboxTab>('anatomy');

  useEffect(() => {
    setActiveTab('anatomy');
  }, [lecture.id]);

  const tabs: { id: SandboxTab; key: string; label: string }[] = [
    { id: 'anatomy', key: '2d-anatomy', label: '01. Anatomy Visual' },
    { id: 'builder', key: '2d-builder', label: '02. Design Configurator' },
    { id: 'workflow', key: '2d-workflow', label: '03. Workflow Sequencer' },
    { id: 'diagnostic', key: '2d-diagnostic', label: '04. Diagnostic Matrix' },
  ];

  return (
    <div className="bg-white in-[.prostho-studio[data-theme=dark]]:bg-[#0B1F4D] border border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/50 rounded-xl overflow-hidden transition-colors">
      <div className="p-5 sm:p-6 border-b border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/40 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-medium text-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B]">
            Lecture {lecture.number} 2D Interactive Visuals · 4 Hands-On Modules
          </div>
          <h3 className="text-lg font-bold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3] mt-0.5">
            Explore Landmarks, Prosthesis Designs, Workflows & Diagnostics
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#FAF8F3] in-[.prostho-studio[data-theme=dark]]:bg-[#06112B] border border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/45 rounded-lg">
          {tabs.map((tab) => {
            const isSelected = activeTab === tab.id;
            const isDone = completedSandboxes.includes(tab.key);
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A24B] ${
                  isSelected
                    ? 'bg-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:bg-[#C9A24B] text-white in-[.prostho-studio[data-theme=dark]]:text-[#0B1F4D]'
                    : 'text-[#0B1F4D]/80 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/80 hover:bg-white in-[.prostho-studio[data-theme=dark]]:hover:bg-[#1B3A8C]/35 hover:text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:hover:text-[#FAF8F3]'
                }`}
              >
                <span>{tab.label}</span>
                {isDone && (
                  <span
                    className={`ml-1.5 text-[10px] ${
                      isSelected
                        ? 'text-[#C9A24B] in-[.prostho-studio[data-theme=dark]]:text-[#0B1F4D]'
                        : 'text-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B]'
                    }`}
                  >
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {activeTab === 'anatomy' && (
          <AnatomyExplorerPanel
            lectureId={lecture.id}
            config={lecture.sandbox2DAnatomy}
            onExplore={() => onCompleteSandbox('2d-anatomy')}
          />
        )}
        {activeTab === 'builder' && (
          <DesignBuilderPanel
            lectureId={lecture.id}
            config={lecture.sandbox2DBuilder}
            onPass={() => onCompleteSandbox('2d-builder')}
          />
        )}
        {activeTab === 'workflow' && (
          <WorkflowSequencerPanel
            lectureId={lecture.id}
            config={lecture.sandbox2DWorkflow}
            onPass={() => onCompleteSandbox('2d-workflow')}
          />
        )}
        {activeTab === 'diagnostic' && (
          <DiagnosticMatrixPanel
            lectureId={lecture.id}
            config={lecture.sandbox2DDiagnostic}
            onPass={() => onCompleteSandbox('2d-diagnostic')}
          />
        )}
      </div>
    </div>
  );
}

function renderDiagramBackdrop(diagramType: AnatomyExplorerConfig['diagramType']) {
  if (diagramType === 'resorption-ridge') {
    // Lecture 5: Anterior maxillary flabby zone, palatal xerostomia zone, lateral spicule, 4x resorbed mandibular ridge
    return (
      <g stroke="#1B3A8C" strokeWidth="1.2" fill="none">
        {/* Maxillary arch top-to-mid */}
        <path
          d="M 20 52 Q 20 16 50 14 Q 80 16 80 52 Q 65 56 50 54 Q 35 56 20 52 Z"
          fill="#E68B96"
          fillOpacity="0.42"
          stroke="#C9A24B"
        />
        {/* Anterior maxillary flabby fibrous zone (x=50, y=24) */}
        <path
          d="M 33 28 Q 50 17 67 28 Q 50 32 33 28 Z"
          fill="#D95368"
          fillOpacity="0.55"
          stroke="#9B2C3B"
          strokeDasharray="2.5 1.5"
        />
        {/* Dry palatal mucosa zone (x=50, y=48) */}
        <ellipse cx="50" cy="46" rx="14" ry="7" fill="#FAF8F3" fillOpacity="0.7" stroke="#C9A24B" strokeDasharray="2 2" />
        {/* Lateral spicule stress zone (x=25, y=60) */}
        <path d="M 22 60 L 29 56 L 26 65 Z" fill="#C9A24B" fillOpacity="0.8" stroke="#9B2C3B" />
        {/* Mandibular resorbed residual ridge (4x loss) (x=50, y=80) */}
        <path
          d="M 18 70 Q 32 85 50 86 Q 68 85 82 70"
          stroke="#9B2C3B"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeOpacity="0.65"
        />
        <path
          d="M 22 68 Q 36 81 50 81 Q 64 81 78 68"
          stroke="#E9E1CF"
          strokeWidth="1.6"
          strokeDasharray="3 2"
        />
        <text x="50" y="92" textAnchor="middle" fill="#C9A24B" fontSize="3.2" fontWeight="600" stroke="none">
          Mandibular Resorption (4× Maxilla)
        </text>
      </g>
    );
  }

  if (diagramType === 'denture-fracture') {
    // Lecture 6: Complete denture acrylic base with labial frenum notch fracture line + phonetic & gagging landmarks
    return (
      <g stroke="#C9A24B" strokeWidth="1.3" fill="none">
        {/* Acrylic denture silhouette */}
        <path
          d="M 18 78 Q 16 26 50 15 Q 84 26 82 78 Q 66 84 50 81 Q 34 84 18 78 Z"
          fill="#E68B96"
          fillOpacity="0.5"
        />
        {/* Sharp Labial Frenum V-notch (x=50, y=15) & Midline Fatigue Crack */}
        <path d="M 46 16 L 50 21 L 54 16" stroke="#9B2C3B" strokeWidth="1.8" />
        <path
          d="M 50 21 L 48.5 34 L 51.5 47 L 49 62 L 50 78"
          stroke="#9B2C3B"
          strokeWidth="1.5"
          strokeDasharray="2.5 1.5"
        />
        {/* Maxillary incisal arc (/f/, /v/ at y=24) */}
        <path d="M 32 27 Q 50 20 68 27" stroke="#FAF8F3" strokeWidth="2.8" strokeLinecap="round" />
        {/* Anterior palatal rugae (/s,z,t,d,n/ at y=38) */}
        <path d="M 38 35 Q 50 38 62 35" stroke="#1B3A8C" strokeWidth="1.2" />
        <path d="M 40 40 Q 50 43 60 40" stroke="#1B3A8C" strokeWidth="1.2" />
        {/* Lateral posterior dental arch (x=24, y=55) */}
        <path d="M 22 44 L 25 70" stroke="#FAF8F3" strokeWidth="4" strokeDasharray="4 2" />
        <path d="M 78 44 L 75 70" stroke="#FAF8F3" strokeWidth="4" strokeDasharray="4 2" />
        {/* Thick posterior border gagging trigger (x=50, y=78) */}
        <path d="M 22 77 Q 50 83 78 77" stroke="#C9A24B" strokeWidth="3.2" strokeOpacity="0.85" />
      </g>
    );
  }

  if (diagramType === 'flange-cross-section') {
    // Lecture 7: Sagittal alveolar bone cross-section with labial undercut & complete vs open-face flange
    return (
      <g stroke="#1B3A8C" strokeWidth="1.5" fill="none">
        {/* Alveolar bone sagittal profile with labial undercut */}
        <path
          d="M 42 85 L 42 52 Q 40 36 56 36 Q 66 36 66 56 L 68 85 Z"
          fill="#E9E1CF"
          stroke="#C9A24B"
        />
        {/* Complete flange silhouette */}
        <path
          d="M 24 26 Q 22 44 35 66 L 68 66 L 68 48 Q 52 38 40 48 Q 30 34 26 26 Z"
          fill="#E68B96"
          fillOpacity="0.58"
          stroke="#C9A24B"
        />
        {/* Artificial incisor silhouette */}
        <path d="M 28 64 Q 27 80 35 84 Q 40 78 40 65 Z" fill="#FAF8F3" stroke="#1B3A8C" />
      </g>
    );
  }

  if (diagramType === 'cast-trimming') {
    // Lecture 8: Maxillary anterior cast trimming with preserved frena/incisive papilla + Rule of Thirds socket bands
    return (
      <g stroke="#C9A24B" strokeWidth="1.4" fill="none">
        {/* Anterior stone cast outline */}
        <path
          d="M 18 82 Q 18 22 50 13 Q 82 22 82 82 Z"
          fill="#DCE6F5"
          fillOpacity="0.65"
        />
        {/* Preserved Labial Frenum notch (x=50, y=12) */}
        <path d="M 47 13 Q 50 18 53 13" stroke="#1B3A8C" strokeWidth="1.8" />
        {/* Preserved Incisive Papilla (x=50, y=28) */}
        <ellipse cx="50" cy="28" rx="3.5" ry="5" fill="#C9A24B" fillOpacity="0.65" stroke="#1B3A8C" />
        {/* Rule of Thirds socket grid */}
        <rect x="26" y="42" width="48" height="34" rx="3" fill="#FAF8F3" fillOpacity="0.45" stroke="#1B3A8C" />
        <line x1="26" y1="53" x2="74" y2="53" stroke="#1B3A8C" strokeDasharray="2 2" />
        <line x1="26" y1="64" x2="74" y2="64" stroke="#1B3A8C" strokeDasharray="2 2" />
        {/* Trimmed gingival & middle thirds highlight */}
        <rect x="28" y="43" width="44" height="20" rx="2" fill="#E68B96" fillOpacity="0.4" stroke="none" />
        <text x="50" y="88" textAnchor="middle" fill="#C9A24B" fontSize="3.1" fontWeight="600" stroke="none">
          Rule of Thirds Socket Trimming Map
        </text>
      </g>
    );
  }

  if (diagramType === 'obturator-zones') {
    // Lecture 10: Coronal palate & nasal cavity with hollow bulb and contralateral clasps
    return (
      <g stroke="#C9A24B" strokeWidth="1.4" fill="none">
        {/* Coronal palate & nasal cavity */}
        <path
          d="M 18 22 L 18 74 Q 24 76 34 72 L 34 44 L 68 44 L 68 72 L 82 74 L 82 22"
          fill="#DCE6F5"
          fillOpacity="0.35"
        />
        {/* Hollow bulb contour on left defect side */}
        <ellipse cx="30" cy="54" rx="11" ry="15" fill="#E68B96" fillOpacity="0.6" stroke="#9B2C3B" />
        <ellipse cx="30" cy="54" rx="6" ry="9" fill="#FAF8F3" fillOpacity="0.8" stroke="#1B3A8C" strokeDasharray="2 2" />
        {/* Palatal connector & contralateral tooth clasp */}
        <path d="M 30 66 Q 52 70 76 62" stroke="#C9A24B" strokeWidth="3" />
        <rect x="70" y="54" width="10" height="16" rx="2" fill="#FAF8F3" stroke="#1B3A8C" />
      </g>
    );
  }

  // Lecture 4 (palatal-seal) & Lecture 9 (aramany-arch): Maxillary palatal arch
  return (
    <g stroke="#C9A24B" strokeWidth="1.4" fill="none">
      {/* Horseshoe maxillary arch */}
      <path
        d="M 18 78 Q 16 26 50 16 Q 84 26 82 78 Q 66 86 50 82 Q 34 86 18 78 Z"
        fill="#F4D7DA"
        fillOpacity="0.55"
      />
      {/* Residual ridge crest */}
      <path
        d="M 25 75 Q 24 32 50 23 Q 76 32 75 75"
        stroke="#1B3A8C"
        strokeWidth="2"
        strokeOpacity="0.65"
      />
      {/* Mid-palatal raphe */}
      <line x1="50" y1="24" x2="50" y2="74" stroke="#1B3A8C" strokeOpacity="0.45" strokeDasharray="3 3" />
      {diagramType === 'palatal-seal' && (
        <>
          {/* Anterior Cupid's bow vibrating line */}
          <path d="M 20 75 Q 35 58 50 64 Q 65 58 80 75" stroke="#1B3A8C" strokeWidth="2.4" />
          {/* Posterior vibrating line */}
          <path d="M 18 79 Q 50 82 82 79" stroke="#C9A24B" strokeWidth="2.4" />
        </>
      )}
      {diagramType === 'aramany-arch' && (
        <>
          <path
            d="M 22 74 Q 23 36 50 28 L 50 76 Z"
            fill="#9B2C3B"
            fillOpacity="0.38"
            stroke="#9B2C3B"
          />
          <circle cx="50" cy="50" r="8" fill="#9B2C3B" fillOpacity="0.28" stroke="#9B2C3B" strokeDasharray="2 2" />
        </>
      )}
    </g>
  );
}

function AnatomyExplorerPanel({
  lectureId,
  config,
  onExplore,
}: {
  lectureId: string;
  config: AnatomyExplorerConfig;
  onExplore: () => void;
}) {
  const [selectedId, setSelectedId] = useState<string>(config.hotspots[0]?.id ?? '');
  const [inspectedIds, setInspectedIds] = useState<string[]>([]);
  const [filterCat, setFilterCat] = useState<'all' | AnatomyHotspot2D['category']>('all');

  useEffect(() => {
    setSelectedId(config.hotspots[0]?.id ?? '');
    setInspectedIds([]);
    setFilterCat('all');
  }, [lectureId, config]);

  const visibleHotspots = config.hotspots.filter(
    (h) => filterCat === 'all' || h.category === filterCat
  );
  const selected = config.hotspots.find((h) => h.id === selectedId) ?? visibleHotspots[0];

  const handlePick = (hs: AnatomyHotspot2D) => {
    setSelectedId(hs.id);
    const next = inspectedIds.includes(hs.id) ? inspectedIds : [...inspectedIds, hs.id];
    setInspectedIds(next);
    if (next.length >= Math.min(2, config.hotspots.length)) {
      onExplore();
    }
  };

  const categoryColor = (cat: AnatomyHotspot2D['category']) => {
    if (cat === 'primary') return '#1B3A8C';
    if (cat === 'secondary') return '#C9A24B';
    if (cat === 'defect') return '#9B2C3B';
    return '#0B1F4D';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-7 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h4 className="text-base font-bold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3]">
              {config.title}
            </h4>
            <p className="text-xs text-[#0B1F4D]/75 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/80">
              {config.instruction}
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs">
            {(['all', 'primary', 'secondary', 'relief', 'defect'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCat(cat)}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold capitalize cursor-pointer ${
                  filterCat === cat
                    ? 'bg-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:bg-[#C9A24B] text-white in-[.prostho-studio[data-theme=dark]]:text-[#0B1F4D]'
                    : 'bg-[#FAF8F3] in-[.prostho-studio[data-theme=dark]]:bg-[#06112B] text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC] border border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/45'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#FAF8F3] in-[.prostho-studio[data-theme=dark]]:bg-[#06112B] border border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/45 rounded-xl p-4">
          <svg
            viewBox="0 0 100 95"
            className="w-full max-h-[340px] mx-auto"
            role="img"
            aria-label={config.title}
          >
            {renderDiagramBackdrop(config.diagramType)}
            {visibleHotspots.map((hs, i) => {
              const isSelected = selected?.id === hs.id;
              const fill = categoryColor(hs.category);
              return (
                <g
                  key={hs.id}
                  onClick={() => handlePick(hs)}
                  className="cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label={hs.label}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handlePick(hs);
                    }
                  }}
                >
                  {isSelected && (
                    <circle cx={hs.x} cy={hs.y} r="6.2" fill="none" stroke="#C9A24B" strokeWidth="1.2" />
                  )}
                  <circle cx={hs.x} cy={hs.y} r="4.2" fill={fill} stroke="#FAF8F3" strokeWidth="1" />
                  <text
                    x={hs.x}
                    y={hs.y + 1.3}
                    textAnchor="middle"
                    fill="#FAF8F3"
                    fontSize="3.4"
                    fontWeight="700"
                  >
                    {i + 1}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <div className="lg:col-span-5 space-y-4">
        {selected && (
          <div className="bg-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:bg-[#06112B] text-[#FAF8F3] border border-[#1B3A8C]/50 rounded-xl p-5 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-[#C9A24B] font-semibold">
              <span className="uppercase">{selected.category} Zone</span>
              {selected.metric && <span className="font-mono tabular-nums">{selected.metric}</span>}
            </div>
            <h5 className="text-base font-bold">{selected.label}</h5>
            <p className="text-xs sm:text-sm text-[#E6E8EC]/90 leading-relaxed">
              {selected.clinicalNote}
            </p>
          </div>
        )}

        <div className="space-y-1.5">
          <div className="text-xs font-semibold text-[#0B1F4D]/70 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/75">
            All Landmarks ({inspectedIds.length}/{config.hotspots.length} inspected)
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            {config.hotspots.map((hs, idx) => (
              <button
                key={hs.id}
                type="button"
                onClick={() => handlePick(hs)}
                className={`text-left px-3 py-2 rounded-lg border text-xs font-medium flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                  selected?.id === hs.id
                    ? 'bg-[#1B3A8C]/10 in-[.prostho-studio[data-theme=dark]]:bg-[#1B3A8C]/50 border-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:border-[#C9A24B] text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3] font-semibold'
                    : 'bg-[#FAF8F3] in-[.prostho-studio[data-theme=dark]]:bg-[#06112B] border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/40 text-[#0B1F4D]/80 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/85 hover:border-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:hover:border-[#C9A24B]'
                }`}
              >
                <span>
                  <span className="font-mono text-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B] mr-2">
                    0{idx + 1}.
                  </span>
                  {hs.label}
                </span>
                {hs.metric && (
                  <span className="text-[11px] font-mono text-[#0B1F4D]/65 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/70 tabular-nums shrink-0">
                    {hs.metric}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DesignBuilderPanel({
  lectureId,
  config,
  onPass,
}: {
  lectureId: string;
  config: DesignBuilderConfig;
  onPass: () => void;
}) {
  const [selectedOptId, setSelectedOptId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setSelectedOptId(null);
    setSubmitted(false);
  }, [lectureId, config]);

  const selectedOpt = config.options.find((o) => o.id === selectedOptId);
  const isCorrect = Boolean(selectedOpt?.isRecommendedForPrompt);

  const handleEvaluate = () => {
    if (!selectedOpt) return;
    setSubmitted(true);
    if (selectedOpt.isRecommendedForPrompt) {
      onPass();
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-base font-bold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3] flex items-center gap-2">
            <Wrench className="w-4 h-4 text-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B]" aria-hidden="true" />
            <span>{config.title}</span>
          </h4>
          <p className="text-xs sm:text-sm text-[#0B1F4D]/80 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/85 mt-1">
            {config.scenarioPrompt}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setSelectedOptId(null);
            setSubmitted(false);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-[#FAF8F3] in-[.prostho-studio[data-theme=dark]]:bg-[#06112B] border border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/45 text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3] hover:border-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:hover:border-[#C9A24B] shrink-0 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Reset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {config.options.map((opt) => {
          const isPicked = selectedOptId === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                setSelectedOptId(opt.id);
                setSubmitted(false);
              }}
              className={`text-left p-4 rounded-xl border transition-colors cursor-pointer flex flex-col justify-between space-y-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A24B] ${
                isPicked
                  ? 'bg-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:bg-[#1B3A8C] border-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:border-[#C9A24B] text-white'
                  : 'bg-[#FAF8F3] in-[.prostho-studio[data-theme=dark]]:bg-[#06112B] border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/45 text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC] hover:border-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:hover:border-[#C9A24B]'
              }`}
            >
              <div className="space-y-2">
                <div className="text-sm font-bold">{opt.label}</div>
                <div
                  className={`text-xs ${
                    isPicked ? 'text-[#C9A24B]' : 'text-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B] font-medium'
                  }`}
                >
                  {opt.spec}
                </div>
                <p
                  className={`text-xs leading-relaxed ${
                    isPicked ? 'text-[#E6E8EC]' : 'text-[#0B1F4D]/75 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/80'
                  }`}
                >
                  {opt.indication}
                </p>
              </div>
              <div
                className={`pt-2 border-t text-[11px] ${
                  isPicked
                    ? 'border-white/15 text-[#E6E8EC]/85'
                    : 'border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/40 text-[#0B1F4D]/65 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/70'
                }`}
              >
                Tradeoff: {opt.tradeoff}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          disabled={!selectedOptId}
          onClick={handleEvaluate}
          className="px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:bg-[#C9A24B] text-white in-[.prostho-studio[data-theme=dark]]:text-[#0B1F4D] hover:bg-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:hover:bg-[#E0BC64] disabled:opacity-45 cursor-pointer disabled:cursor-not-allowed transition-colors"
        >
          Validate Prosthesis Configuration
        </button>

        {submitted && selectedOpt && (
          <div
            role="status"
            className={`flex items-start gap-2 text-xs sm:text-sm font-medium p-3 rounded-lg border ${
              isCorrect
                ? 'bg-[#1B3A8C]/10 in-[.prostho-studio[data-theme=dark]]:bg-[#1B3A8C]/40 border-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:border-[#C9A24B] text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3]'
                : 'bg-[#9B2C3B]/10 in-[.prostho-studio[data-theme=dark]]:bg-[#9B2C3B]/30 border-[#9B2C3B] text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3]'
            }`}
          >
            {isCorrect ? (
              <CheckCircle2
                className="w-4 h-4 text-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B] shrink-0 mt-0.5"
                aria-hidden="true"
              />
            ) : (
              <XCircle className="w-4 h-4 text-[#9B2C3B] in-[.prostho-studio[data-theme=dark]]:text-[#F48B96] shrink-0 mt-0.5" aria-hidden="true" />
            )}
            <span>
              <strong>{isCorrect ? 'Optimal Selection: ' : `${selectedOpt.ratingLabel}: `}</strong>
              {isCorrect ? config.feedbackPass : config.feedbackRetry}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function WorkflowSequencerPanel({
  lectureId,
  config,
  onPass,
}: {
  lectureId: string;
  config: WorkflowSequencerConfig;
  onPass: () => void;
}) {
  const rotateShuffled = (steps: WorkflowSequencerConfig['correctOrder']) => {
    if (steps.length <= 1) return steps;
    return [...steps.slice(1), steps[0]];
  };

  const [ordered, setOrdered] = useState(() => rotateShuffled(config.correctOrder));
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setOrdered(rotateShuffled(config.correctOrder));
    setChecked(false);
  }, [lectureId, config]);

  const moveStep = (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= ordered.length) return;
    const next = [...ordered];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    setOrdered(next);
    setChecked(false);
  };

  const isExactOrder = ordered.every((step, idx) => step.id === config.correctOrder[idx]?.id);

  const handleCheck = () => {
    setChecked(true);
    if (isExactOrder) onPass();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-base font-bold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3] flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B]" aria-hidden="true" />
            <span>{config.title}</span>
          </h4>
          <p className="text-xs sm:text-sm text-[#0B1F4D]/75 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/80 mt-1">
            {config.instruction}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setOrdered(rotateShuffled(config.correctOrder));
            setChecked(false);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-[#FAF8F3] in-[.prostho-studio[data-theme=dark]]:bg-[#06112B] border border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/45 text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3] hover:border-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:hover:border-[#C9A24B] shrink-0 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Reset Order</span>
        </button>
      </div>

      <div className="space-y-2.5">
        {ordered.map((step, idx) => {
          const matchesSlot = step.id === config.correctOrder[idx]?.id;
          return (
            <div
              key={step.id}
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                checked
                  ? matchesSlot
                    ? 'bg-[#1B3A8C]/8 in-[.prostho-studio[data-theme=dark]]:bg-[#1B3A8C]/40 border-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:border-[#C9A24B]'
                    : 'bg-[#9B2C3B]/8 in-[.prostho-studio[data-theme=dark]]:bg-[#9B2C3B]/30 border-[#9B2C3B]'
                  : 'bg-[#FAF8F3] in-[.prostho-studio[data-theme=dark]]:bg-[#06112B] border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/40'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B] tabular-nums">
                    Step 0{idx + 1}
                  </span>
                  <span className="text-sm font-bold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3]">
                    {step.title}
                  </span>
                  {checked && (
                    <span className="text-xs font-semibold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3]">
                      {matchesSlot ? '· Correct Position' : '· Out of Sequence'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#0B1F4D]/80 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/80">{step.detail}</p>
                <div className="text-[11px] font-medium text-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B]">
                  Clinical Rule: {step.criticalRule}
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => moveStep(idx, -1)}
                  disabled={idx === 0}
                  aria-label={`Move ${step.title} earlier`}
                  className="p-2 rounded-md bg-white in-[.prostho-studio[data-theme=dark]]:bg-[#0B1F4D] border border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/50 text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3] hover:border-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:hover:border-[#C9A24B] disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ArrowUp className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => moveStep(idx, 1)}
                  disabled={idx === ordered.length - 1}
                  aria-label={`Move ${step.title} later`}
                  className="p-2 rounded-md bg-white in-[.prostho-studio[data-theme=dark]]:bg-[#0B1F4D] border border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/50 text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3] hover:border-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:hover:border-[#C9A24B] disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ArrowDown className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={handleCheck}
          className="px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:bg-[#C9A24B] text-white in-[.prostho-studio[data-theme=dark]]:text-[#0B1F4D] hover:bg-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:hover:bg-[#E0BC64] cursor-pointer transition-colors"
        >
          Verify Clinical Sequence
        </button>

        {checked && (
          <div
            role="status"
            className="text-xs sm:text-sm font-semibold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3] flex items-center gap-2"
          >
            {isExactOrder ? (
              <>
                <CheckCircle2
                  className="w-4 h-4 text-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B]"
                  aria-hidden="true"
                />
                <span>Sequence verified! All clinical steps follow the textbook protocol.</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-[#9B2C3B] in-[.prostho-studio[data-theme=dark]]:text-[#F48B96]" aria-hidden="true" />
                <span>Reorder highlighted steps using the Up/Down controls and verify again.</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function DiagnosticMatrixPanel({
  lectureId,
  config,
  onPass,
}: {
  lectureId: string;
  config: DiagnosticMatrixConfig;
  onPass: () => void;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    setAnswers({});
  }, [lectureId, config]);

  const handleSelect = (itemId: string, choice: string) => {
    const next = { ...answers, [itemId]: choice };
    setAnswers(next);
    const allCorrect = config.items.every((item) => next[item.id] === item.correctDiagnosis);
    if (allCorrect) onPass();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-base font-bold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3] flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B]" aria-hidden="true" />
            <span>{config.title}</span>
          </h4>
          <p className="text-xs sm:text-sm text-[#0B1F4D]/75 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/80 mt-1">
            {config.instruction}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAnswers({})}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-[#FAF8F3] in-[.prostho-studio[data-theme=dark]]:bg-[#06112B] border border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/45 text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3] hover:border-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:hover:border-[#C9A24B] shrink-0 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Reset Matrix</span>
        </button>
      </div>

      <div className="space-y-4">
        {config.items.map((item, idx) => {
          const picked = answers[item.id];
          const isCorrect = picked === item.correctDiagnosis;
          const allChoices = [item.correctDiagnosis, ...item.distractorDiagnoses].sort();

          return (
            <div
              key={item.id}
              className="bg-[#FAF8F3] in-[.prostho-studio[data-theme=dark]]:bg-[#06112B] border border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/45 rounded-xl p-4 sm:p-5 space-y-3"
            >
              <div className="space-y-1">
                <div className="text-xs font-mono font-semibold text-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:text-[#C9A24B]">
                  Diagnostic Finding 0{idx + 1}
                </div>
                <div className="text-sm font-bold text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3]">
                  {item.finding}
                </div>
                <div className="text-xs text-[#0B1F4D]/75 in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC]/75">
                  Clinical Clue: {item.clue}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {allChoices.map((choice) => {
                  const isPicked = picked === choice;
                  return (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => handleSelect(item.id, choice)}
                      className={`px-3 py-2 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                        isPicked
                          ? isCorrect
                            ? 'bg-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:bg-[#C9A24B] border-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:border-[#C9A24B] text-white in-[.prostho-studio[data-theme=dark]]:text-[#0B1F4D]'
                            : 'bg-[#9B2C3B] border-[#9B2C3B] text-white'
                          : 'bg-white in-[.prostho-studio[data-theme=dark]]:bg-[#0B1F4D] border-[#E6E8EC] in-[.prostho-studio[data-theme=dark]]:border-[#1B3A8C]/45 text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#E6E8EC] hover:border-[#1B3A8C] in-[.prostho-studio[data-theme=dark]]:hover:border-[#C9A24B]'
                      }`}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>

              {picked && (
                <div
                  role="status"
                  className={`text-xs p-3 rounded-lg border ${
                    isCorrect
                      ? 'bg-[#1B3A8C]/8 in-[.prostho-studio[data-theme=dark]]:bg-[#1B3A8C]/40 border-[#1B3A8C]/40 in-[.prostho-studio[data-theme=dark]]:border-[#C9A24B] text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3]'
                      : 'bg-[#9B2C3B]/8 in-[.prostho-studio[data-theme=dark]]:bg-[#9B2C3B]/30 border-[#9B2C3B]/40 text-[#0B1F4D] in-[.prostho-studio[data-theme=dark]]:text-[#FAF8F3]'
                  }`}
                >
                  {isCorrect ? (
                    <span>
                      <strong>Confirmed ({item.correctDiagnosis}):</strong> {item.management}
                    </span>
                  ) : (
                    <span>
                      <strong>Re-evaluate:</strong> Review the clinical clue ({item.clue}) and etiology ({item.etiologies.join(', ')}).
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
