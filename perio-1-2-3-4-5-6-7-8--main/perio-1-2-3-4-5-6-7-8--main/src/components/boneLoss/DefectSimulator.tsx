import React, { useState } from 'react';
import { BoneDefect3DType } from './types';
import { BoneLoss3DCanvas } from './BoneLoss3DCanvas';
import {
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  Award,
  ToggleLeft,
  ToggleRight,
  Eye,
  Sliders,
  Flame,
  ArrowRight
} from 'lucide-react';

interface DefectSpec {
  id: BoneDefect3DType;
  title: string;
  badge: string;
  badgeColor: string;
  wallsRemaining: string;
  distalWall: boolean;
  lingualWall: boolean;
  facialWall: boolean;
  primaryLossArea: string;
  lossDepthMm: string;
  pdfDescription: string;
  regenerationPrognosis: string;
  commonLocation: string;
  keyExamFact: string;
  availableLossAreas: { id: string; label: string; description: string; depth: string }[];
}

const DEFECT_SPECS: DefectSpec[] = [
  {
    id: 'three_wall',
    title: 'Three-Wall Bony Defect (Intrabony Defect)',
    badge: 'Best Regeneration',
    badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
    wallsRemaining: '3 Walls (Distal, Lingual, Facial)',
    distalWall: true,
    lingualWall: true,
    facialWall: true,
    primaryLossArea: 'total_cavity',
    lossDepthMm: '4.5 mm',
    pdfDescription:
      'Bordered by one tooth surface and three bony surfaces. Originally called "intra bony defect". It may be difficult to visualize this defect on the radiograph. It yields the best results with periodontal regeneration!',
    regenerationPrognosis: 'Highest success rate (the 3 vascular bony walls contain biomaterials and provide osteogenic cells).',
    commonLocation: 'Frequently observed on the mesial surfaces of the molars.',
    keyExamFact: 'Originally designated as "intrabony defect". Mesial molar surfaces are the classical textbook location.',
    availableLossAreas: [
      {
        id: 'total_cavity',
        label: 'Intrabony Resorption Well (Trough)',
        description: 'Deep cuneiform angular well bounded by 3 living bone walls and the tooth root.',
        depth: '-4.5 mm below crest'
      },
      {
        id: 'infrabony_base',
        label: 'Infrabony Defect Floor / Base',
        description: 'The apical bottom of the pocket located apical to the alveolar crest.',
        depth: '-5.2 mm'
      },
      {
        id: 'facial_wall',
        label: 'Facial Cortical Wall (Intact Boundary)',
        description: 'Living buccal bone boundary that contains blood supply and grafts.',
        depth: 'Coronal height preserved'
      },
      {
        id: 'lingual_wall',
        label: 'Lingual / Palatal Wall (Intact Boundary)',
        description: 'Lingual cortical plate serving as the third containment wall.',
        depth: 'Coronal height preserved'
      }
    ]
  },
  {
    id: 'two_wall',
    title: 'Two-Wall Bony Defect',
    badge: 'Interdental Loss',
    badgeColor: 'bg-blue-950 text-blue-300 border-blue-800',
    wallsRemaining: '2 Walls (Buccal and Palatal/Lingual)',
    distalWall: false,
    lingualWall: true,
    facialWall: true,
    primaryLossArea: 'interdental_septum',
    lossDepthMm: '4.0 mm',
    pdfDescription:
      'Enclosed by two tooth surfaces and two osseous surfaces (buccal and palatal/lingual). The cortical bone is generally intact. It may be difficult to visualize this defect on the radiograph.',
    regenerationPrognosis: 'Moderate regenerative capacity; requires regenerative membranes or bone graft containment.',
    commonLocation: 'Located between adjoining posterior teeth.',
    keyExamFact: 'Enclosed by 2 tooth surfaces and 2 osseous surfaces. Cortical plates are generally intact.',
    availableLossAreas: [
      {
        id: 'interdental_septum',
        label: 'Lost Interdental Septum (Proximal Loss)',
        description: 'The proximal wall between adjoining teeth is completely resorbed and open.',
        depth: '-4.0 mm interdental drop'
      },
      {
        id: 'total_cavity',
        label: 'Full 2-Wall Defect Void',
        description: 'Interdental space with missing mesial/distal bone plate.',
        depth: '-4.2 mm'
      },
      {
        id: 'infrabony_base',
        label: 'Defect Base / Infrabony Floor',
        description: 'Base of the crater-like interproximal loss.',
        depth: '-4.8 mm'
      },
      {
        id: 'facial_wall',
        label: 'Intact Facial Cortical Plate',
        description: 'Buccal wall intact, helping retain barrier membrane.',
        depth: 'Preserved'
      }
    ]
  },
  {
    id: 'one_wall',
    title: 'One-Wall Bony Defect / Hemiseptum',
    badge: 'Severe Loss',
    badgeColor: 'bg-rose-950 text-rose-300 border-rose-800',
    wallsRemaining: '1 Solitary Wall Remaining',
    distalWall: true,
    lingualWall: false,
    facialWall: false,
    primaryLossArea: 'facial_wall',
    lossDepthMm: '5.5 mm',
    pdfDescription:
      'Only one bony wall remains facing the involved tooth surface. It occurs generally when considerable amount of interdental septum is lost.',
    regenerationPrognosis: 'Unpredictable regeneration; frequently treated with resective osseous surgery (osteoplasty/ostectomy).',
    commonLocation: 'Interdental septum where proximal bone has broken down severely.',
    keyExamFact: 'Synonym: "Hemiseptum". Reflects extensive destruction of interdental septum.',
    availableLossAreas: [
      {
        id: 'facial_wall',
        label: 'Resorbed Facial Plate (Missing Wall)',
        description: 'Buccal plate has melted away completely, leaving root exposed.',
        depth: '-5.5 mm resorbed plate'
      },
      {
        id: 'lingual_wall',
        label: 'Resorbed Lingual Plate (Missing Wall)',
        description: 'Lingual cortical bone destroyed by extensive inflammation.',
        depth: '-5.2 mm resorbed plate'
      },
      {
        id: 'total_cavity',
        label: 'Total Hemiseptum Resorption Void',
        description: 'Severe collapse of interdental septum and cortical plates.',
        depth: '-5.8 mm void'
      },
      {
        id: 'distal_wall',
        label: 'Solitary Remaining Wall (Hemiseptum)',
        description: 'The only surviving bone plate facing the involved tooth surface.',
        depth: 'Residual bone spine'
      }
    ]
  },
  {
    id: 'combined',
    title: 'Combined Bony Defect (Combination Osseous)',
    badge: 'Multi-Level Architecture',
    badgeColor: 'bg-purple-950 text-purple-300 border-purple-800',
    wallsRemaining: '3 walls apically, 2 walls occlusally',
    distalWall: true,
    lingualWall: true,
    facialWall: true, // partial height
    primaryLossArea: 'coronal_loss',
    lossDepthMm: '5.0 mm',
    pdfDescription:
      'The number of bony walls apically at the level of the base of the vertical defect can be more than at the occlusal aspect. For example: because the facial wall is half the height of distal and lingual walls, this is an osseous defect with three walls in its apical half and two walls in its occlusal half.',
    regenerationPrognosis: 'Favorable at the apical 3-wall base; variable at the 2-wall occlusal coronal zone.',
    commonLocation: 'Posterior teeth with partial cortical wall resorption.',
    keyExamFact: 'Number of residual walls changes from occlusal to apical levels.',
    availableLossAreas: [
      {
        id: 'coronal_loss',
        label: 'Occlusal Half Loss (2-Wall Zone)',
        description: 'Facial wall is half the height of distal and lingual walls due to coronal resorption.',
        depth: '-2.5 mm shelf loss'
      },
      {
        id: 'infrabony_base',
        label: 'Apical Half Base (3-Wall Zone)',
        description: 'Deep apical base where all three walls remain intact.',
        depth: '-5.0 mm apical base'
      },
      {
        id: 'total_cavity',
        label: 'Complete Stepped Combination Defect',
        description: 'Two-tiered osseous architecture with changing wall count.',
        depth: '-5.2 mm overall'
      }
    ]
  },
  {
    id: 'circumferential',
    title: 'Circumferential Defect',
    badge: 'Trough-Like Presentation',
    badgeColor: 'bg-amber-950 text-amber-300 border-amber-800',
    wallsRemaining: 'Continuous moat around multiple surfaces',
    distalWall: false,
    lingualWall: false,
    facialWall: false,
    primaryLossArea: 'total_cavity',
    lossDepthMm: '4.8 mm',
    pdfDescription:
      'Continuous defects that involve more than one surface of a tooth, in a shape that is similar to a trough or moat.',
    regenerationPrognosis: 'Demanding defect geometry; high risk of ongoing breakdown if debridement is incomplete.',
    commonLocation: 'Single-rooted or multi-rooted teeth with multi-surface bone loss.',
    keyExamFact: 'Characterized in the PDF as a "continuous defect in a shape similar to a trough".',
    availableLossAreas: [
      {
        id: 'total_cavity',
        label: '360° Circular Moat / Trough Loss',
        description: 'Continuous moat-like bone loss wrapping around the root circumference.',
        depth: '-4.8 mm continuous moat'
      },
      {
        id: 'infrabony_base',
        label: 'Moat Floor / Infrabony Base',
        description: 'Trough floor below the surrounding residual crest.',
        depth: '-5.2 mm base'
      }
    ]
  }
];

export const DefectSimulator: React.FC = () => {
  const [selectedDefectId, setSelectedDefectId] = useState<BoneDefect3DType>('three_wall');
  const [highlightWalls, setHighlightWalls] = useState<boolean>(true);
  const [selectedLossArea, setSelectedLossArea] = useState<string>('total_cavity');

  // Manual interactive wall statuses
  const [activeDistal, setActiveDistal] = useState<boolean>(true);
  const [activeLingual, setActiveLingual] = useState<boolean>(true);
  const [activeFacial, setActiveFacial] = useState<boolean>(true);

  const currentSpec = DEFECT_SPECS.find((s) => s.id === selectedDefectId) || DEFECT_SPECS[0];

  const handleSelectPreset = (spec: DefectSpec) => {
    setSelectedDefectId(spec.id);
    setActiveDistal(spec.distalWall);
    setActiveLingual(spec.lingualWall);
    setActiveFacial(spec.facialWall);
    setSelectedLossArea(spec.primaryLossArea);
  };

  const handleSelectLoss = (lossId: string) => {
    setSelectedLossArea(lossId);
  };

  const activeLossInfo =
    currentSpec.availableLossAreas.find((a) => a.id === selectedLossArea) ||
    currentSpec.availableLossAreas[0];

  return (
    <div className="space-y-6 text-[#FAF8F3] font-sans">
      {/* Header with Precision Dental Brand Identity */}
      <div className="bg-[#071433] border border-[#E6E8EC]/20 rounded-3xl p-5 sm:p-7 space-y-2 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C9A24B] animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#C9A24B] font-bold">
              3D Defect Simulator &amp; Wall Analysis • PDF Pages 11 &amp; 12
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span dir="rtl" className="text-xs font-arabic font-bold text-[#dfbe6e] px-2 py-0.5 rounded bg-[#0B1F4D] border border-[#C9A24B]/30">
              دقّة الأسنان
            </span>
            <button
              onClick={() => setHighlightWalls(!highlightWalls)}
              className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition border ${
                highlightWalls
                  ? 'bg-[#1B3A8C] text-[#FAF8F3] border-[#C9A24B]/60'
                  : 'bg-[#0B1F4D] text-[#E6E8EC]/70 border-[#E6E8EC]/20'
              }`}
            >
              {highlightWalls ? 'Residual Wall Colors: ON' : 'Residual Wall Colors: OFF'}
            </button>
          </div>
        </div>
        <div className="space-y-0.5">
          <div className="text-xs font-bold text-[#C9A24B] uppercase tracking-wider">
            "Precision in Every Smile" • High-Definition 3D Defect Visualization
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#FAF8F3]">
            Vertical / Angular Defect 3D Anatomy Simulator
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#E6E8EC]/85 max-w-3xl">
          Classified by the number of residual bony walls. Click on any bone loss preset or wall below to <strong>highlight the exact 3D area where bone loss is happening</strong> in real-time.
        </p>
      </div>

      {/* Preset Defect Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {DEFECT_SPECS.map((spec) => {
          const isSelected = selectedDefectId === spec.id;
          return (
            <button
              key={spec.id}
              onClick={() => handleSelectPreset(spec)}
              className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#1B3A8C] border-[#C9A24B] ring-2 ring-[#C9A24B]/50 shadow-lg text-white'
                  : 'bg-[#071433] border-[#E6E8EC]/20 hover:border-[#C9A24B]/40 text-[#E6E8EC]/80'
              }`}
            >
              <div>
                <span className={`text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 rounded border inline-block mb-1 ${
                  isSelected ? 'bg-[#0B1F4D] text-[#C9A24B] border-[#C9A24B]' : spec.badgeColor
                }`}>
                  {spec.badge}
                </span>
                <div className="font-bold text-xs text-[#FAF8F3] leading-tight">
                  {spec.title.split(' ')[0]} {spec.title.split(' ')[1]}
                </div>
              </div>
              <div className="text-[10px] text-[#C9A24B] font-mono mt-2 truncate">
                {spec.wallsRemaining}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main 3D Canvas + Interactive Wall & Loss Area Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 3D Canvas (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <BoneLoss3DCanvas
            defectType={selectedDefectId}
            highlightWalls={highlightWalls}
            highlightedLossZone={selectedLossArea}
            height="520px"
          />

          {/* Active Highlight Info Bar */}
          <div className="p-3 rounded-2xl bg-[#071433] border border-[#E6E8EC]/20 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C9A24B] animate-ping" />
              <span className="text-[#E6E8EC]/70">Active 3D Highlight:</span>
              <strong className="text-[#C9A24B]">{activeLossInfo.label}</strong>
            </div>
            <span className="text-[#dfbe6e] font-bold">{activeLossInfo.depth}</span>
          </div>
        </div>

        {/* Interactive Wall Matrix & Bone Loss Highlighter (5 cols) */}
        <div className="lg:col-span-5 bg-[#071433] border border-[#E6E8EC]/20 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
          <div className="border-b border-[#E6E8EC]/15 pb-3">
            <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border inline-block mb-1 ${currentSpec.badgeColor}`}>
              {currentSpec.badge}
            </span>
            <h3 className="text-lg font-bold text-[#FAF8F3] font-sans">{currentSpec.title}</h3>
            <div className="text-xs text-[#C9A24B] font-mono mt-0.5">{currentSpec.wallsRemaining}</div>
          </div>

          {/* Clickable Bone Loss Areas to Highlight in 3D */}
          <div className="p-4 rounded-2xl bg-[#0B1F4D] border border-[#E6E8EC]/20 space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#FAF8F3] uppercase tracking-wider flex items-center gap-1.5 font-sans">
                <Flame className="w-3.5 h-3.5 text-[#C9A24B]" />
                Click Loss Area to Highlight in 3D:
              </span>
              <span className="text-[10px] font-mono text-[#C9A24B]">Interactive 3D Pins</span>
            </div>

            <div className="space-y-1.5">
              {currentSpec.availableLossAreas.map((loss) => {
                const isCurrent = selectedLossArea === loss.id;
                return (
                  <button
                    key={loss.id}
                    onClick={() => handleSelectLoss(loss.id)}
                    className={`w-full p-2.5 rounded-xl text-left border transition flex items-center justify-between gap-2 ${
                      isCurrent
                        ? 'bg-[#1B3A8C] border-[#C9A24B] text-[#FAF8F3] shadow-md ring-1 ring-[#C9A24B]/50'
                        : 'bg-[#071433] border-[#E6E8EC]/15 text-[#E6E8EC]/80 hover:border-[#C9A24B]/40 hover:text-white'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold flex items-center gap-1.5">
                        <Eye className={`w-3.5 h-3.5 ${isCurrent ? 'text-[#C9A24B]' : 'text-slate-400'}`} />
                        <span>{loss.label}</span>
                      </div>
                      <p className="text-[10px] text-[#E6E8EC]/60">{loss.description}</p>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#C9A24B] shrink-0">
                      {loss.depth}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive 2D Wall Architecture Schematic with Clickable Status */}
          <div className="p-4 rounded-2xl bg-[#0B1F4D] border border-[#E6E8EC]/20 space-y-3 shadow-sm">
            <span className="text-xs font-bold text-[#FAF8F3] uppercase tracking-wider block font-sans">
              Remaining vs Resorbed Bony Walls (Click to Highlight):
            </span>

            <div className="grid grid-cols-3 gap-2 font-mono text-center text-xs">
              <button
                onClick={() => handleSelectLoss('distal_wall')}
                className={`p-2.5 rounded-xl border text-center transition ${
                  activeDistal
                    ? 'bg-blue-950/60 border-cyan-500 text-cyan-300 font-bold hover:bg-blue-900/50'
                    : 'bg-rose-950/40 border-rose-800 text-rose-300 font-bold hover:bg-rose-900/50'
                }`}
                title="Click to highlight in 3D"
              >
                <span>Distal Wall</span>
                <span className="block text-[10px] mt-0.5">
                  {activeDistal ? '✓ INTACT' : '✗ RESORBED'}
                </span>
              </button>

              <button
                onClick={() => handleSelectLoss('lingual_wall')}
                className={`p-2.5 rounded-xl border text-center transition ${
                  activeLingual
                    ? 'bg-purple-950/60 border-purple-500 text-purple-300 font-bold hover:bg-purple-900/50'
                    : 'bg-rose-950/40 border-rose-800 text-rose-300 font-bold hover:bg-rose-900/50'
                }`}
                title="Click to highlight in 3D"
              >
                <span>Lingual Wall</span>
                <span className="block text-[10px] mt-0.5">
                  {activeLingual ? '✓ INTACT' : '✗ RESORBED'}
                </span>
              </button>

              <button
                onClick={() => handleSelectLoss('facial_wall')}
                className={`p-2.5 rounded-xl border text-center transition ${
                  activeFacial
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold hover:bg-emerald-900/50'
                    : 'bg-rose-950/40 border-rose-800 text-rose-300 font-bold hover:bg-rose-900/50'
                }`}
                title="Click to highlight in 3D"
              >
                <span>Facial Wall</span>
                <span className="block text-[10px] mt-0.5">
                  {activeFacial ? '✓ INTACT' : '✗ RESORBED'}
                </span>
              </button>
            </div>

            <p className="text-[11px] text-slate-400 leading-snug">
              Tooth root acts as the 4th boundary. In a 3-wall defect, the combination of 3 living bone walls + root surface forms a self-contained biological well.
            </p>
          </div>

          {/* Clinical Specifications */}
          <div className="space-y-2.5 text-xs leading-relaxed">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <strong className="text-slate-200 block text-xs">PDF Textbook Definition:</strong>
              <p className="text-slate-300">{currentSpec.pdfDescription}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-900/60 space-y-1">
              <strong className="text-emerald-300 block text-xs flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                Regenerative Therapy Outcome:
              </strong>
              <p className="text-emerald-100/90">{currentSpec.regenerationPrognosis}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-900/60 space-y-1">
              <strong className="text-cyan-300 block text-xs">Classic Anatomical Site:</strong>
              <p className="text-cyan-100/90">{currentSpec.commonLocation}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
