import React, { useState, useRef } from 'react';
import {
  Microscope,
  ZoomIn,
  ZoomOut,
  Eye,
  EyeOff,
  Layers,
  Sparkles,
  CheckCircle2,
  Move,
  Focus,
  Crosshair,
  ArrowLeftRight,
  Sliders,
  Info,
  ShieldAlert,
  Activity,
  Maximize2,
  RotateCcw,
  Target
} from 'lucide-react';

export type SpecimenId = 'normal' | 'cmv' | 'nug' | 'em' | 'sjs' | 'pcs';
export type StainType = 'he' | 'immunoperoxidase' | 'silver';
export type ViewerMode = 'single' | 'split-compare';

interface HistologicalLandmark {
  id: string;
  name: string;
  category: 'cellular' | 'vascular' | 'microbial' | 'architectural';
  coordinates: { x: number; y: number };
  micronSize: string;
  stainAffinity: string;
  description: string;
  clinicalRelevance: string;
}

interface SpecimenData {
  id: SpecimenId;
  name: string;
  tag: string;
  subtitle: string;
  condition: string;
  specimenType: 'Control' | 'Biopsy-Confirmed Viral' | 'Biopsy-Confirmed Bacterial' | 'Biopsy-Confirmed Immune';
  biopsySite: string;
  findings: string;
  pearl: string;
  boardKeyPoint: string;
  stainsAvailable: StainType[];
  landmarks: HistologicalLandmark[];
}

export const HistopathologySandbox: React.FC = () => {
  // Main Navigation & Specimen selection
  const [selectedSlide, setSelectedSlide] = useState<SpecimenId>('cmv');
  const [compareTargetSlide, setCompareTargetSlide] = useState<SpecimenId>('normal');
  const [viewerMode, setViewerMode] = useState<ViewerMode>('single');

  // Interactive 2D Zoom & Pan Engine state
  const [zoomLevel, setZoomLevel] = useState<number>(2.0); // 1.0x to 4.5x
  const [stagePan, setStagePan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Optical & Staining settings
  const [activeStain, setActiveStain] = useState<StainType>('he');
  const [focusOffset, setFocusOffset] = useState<number>(0); // 0 is tack-sharp

  // 2D Overlay Toggles
  const [showLandmarkPins, setShowLandmarkPins] = useState<boolean>(true);
  const [showZonalBoundaries, setShowZonalBoundaries] = useState<boolean>(true);
  const [showMicronScale, setShowMicronScale] = useState<boolean>(true);
  const [showCellLabels, setShowCellLabels] = useState<boolean>(true);
  const [activeLandmarkId, setActiveLandmarkId] = useState<string | null>('cmv_owl_eye');

  // HPF Cell Tally Counter
  const [cellCount, setCellCount] = useState<number>(14);

  // Full Clinical Specimen Catalog
  const SPECIMEN_CATALOG: Record<SpecimenId, SpecimenData> = {
    normal: {
      id: 'normal',
      name: 'Normal Oral Mucosa',
      tag: 'Control Specimen',
      subtitle: 'Intact Stratified Squamous Epithelium & Lamina Propria',
      condition: 'Normal Histological Architecture (Control)',
      specimenType: 'Control',
      biopsySite: 'Buccal Mucosa / Hard Palate (Healthy volunteer control)',
      findings: 'Intact non-keratinized to parakeratinized stratified squamous epithelium displaying orderly maturation from basal layer through spinous and superficial layers. Continuous, well-defined basement membrane with undulating rete ridges. The underlying lamina propria exhibits loose collagen bundles, quiescent spindle fibroblasts, and patent microcapillaries without inflammatory infiltrate.',
      pearl: 'Baseline histological benchmark: Notice the orderly cellular maturation, 1:4 nuclear-to-cytoplasmic ratio in spinous cells, and absence of nuclear inclusions or bacterial invasion.',
      boardKeyPoint: 'Normal mucosa serves as the reference control when evaluating loss of epithelial adhesion (EM/Pemphigus), viral nuclear alterations (CMV/HSV), or bacterial tissue digestion (NUG).',
      stainsAvailable: ['he'],
      landmarks: [
        {
          id: 'norm_epithelium',
          name: 'Stratified Squamous Epithelium',
          category: 'architectural',
          coordinates: { x: 250, y: 120 },
          micronSize: '~200–250 μm thick',
          stainAffinity: 'Eosinophilic cytoplasm with basophilic nuclei',
          description: 'Orderly progressive maturation from cuboidal basal cells to flattened superficial squamous keratinocytes.',
          clinicalRelevance: 'Completely intact; provides the primary mechanical and microbial permeability barrier of the oral cavity.',
        },
        {
          id: 'norm_basement',
          name: 'Dermo-Epidermal Basement Membrane',
          category: 'architectural',
          coordinates: { x: 250, y: 220 },
          micronSize: '~1–2 μm thickness',
          stainAffinity: 'PAS-positive continuous linear band',
          description: 'Undulating basement membrane lining rete pegs, anchored to type IV collagen and laminin-332.',
          clinicalRelevance: 'Continuous without clefting (rules out bullous disorders like SJS/TEN or mucous membrane pemphigoid).',
        },
        {
          id: 'norm_lamina',
          name: 'Quiescent Lamina Propria',
          category: 'cellular',
          coordinates: { x: 250, y: 340 },
          micronSize: '~400 μm depth',
          stainAffinity: 'Faint eosinophilic fibrillar collagen',
          description: 'Loose connective tissue containing quiescent fibroblasts with slender elongated nuclei, intact extracellular matrix, and sparse mast cells.',
          clinicalRelevance: 'Demonstrates normal physiological baseline; absence of acute neutrophils or chronic lymphoplasmacytic sheets.',
        },
        {
          id: 'norm_capillary',
          name: 'Patent Mucosal Microcapillary',
          category: 'vascular',
          coordinates: { x: 150, y: 380 },
          micronSize: '~8–12 μm lumen diameter',
          stainAffinity: 'Endothelial lining with intracapillary discocytes',
          description: 'Delicate endothelial cells lining patent lumen with single-file erythrocyte passage.',
          clinicalRelevance: 'Normal endothelial size (~8 μm). Contrast this directly with cytomegalic 35 μm swollen endothelium in CMV!',
        },
      ],
    },
    cmv: {
      id: 'cmv',
      name: 'CMV Endothelial Lesion',
      tag: 'Biopsy-Confirmed Viral',
      subtitle: 'Pathognomonic Owl\'s Eye Inclusions & Ischemic Ulceration',
      condition: 'Cytomegalovirus (HHV-5) Oral Microvascular Infection',
      specimenType: 'Biopsy-Confirmed Viral',
      biopsySite: 'Deep punched-out ulcer margin (Hard Palate / Buccal Mucosa in Immunocompromised Host)',
      findings: 'Markedly enlarged "cytomegalic" endothelial cells (swollen 2–4x normal dimensions, measuring 30–40 μm) within vascular walls in the deep ulcer base. The nuclei harbor massive, central, dense basophilic inclusion bodies surrounded by a distinctive clear halo ("Owl\'s Eye" appearance). Intraluminal thrombosis and erythrocyte sludging lead to microvascular occlusion and overlying ischemic coagulative mucosal necrosis.',
      pearl: 'Slide 4 / Slide 15: Endothelial CMV tropism drives microvascular thrombosis and deep, non-healing ischemic ulceration in HIV/AIDS and organ transplant recipients.',
      boardKeyPoint: 'Owl\'s eye intranuclear inclusions are pathognomonic for CMV (HHV-5). Biopsies must be taken from the deep ulcer bed (where blood vessels reside), not the superficial slough.',
      stainsAvailable: ['he', 'immunoperoxidase'],
      landmarks: [
        {
          id: 'cmv_owl_eye',
          name: 'Owl\'s Eye Intranuclear Inclusion',
          category: 'cellular',
          coordinates: { x: 240, y: 185 },
          micronSize: '~35 μm inclusion diameter',
          stainAffinity: 'Dense amphophilic/basophilic core with peripheral halo',
          description: 'Massive viral replication compartment composed of densely aggregated viral DNA and capsids, surrounded by a prominent clear halo and condensed nuclear membrane.',
          clinicalRelevance: 'Diagnostic hallmark of CMV infection. Differentiates CMV ulcers from herpes simplex (multinucleation/syncytia) or aphthous ulcers.',
        },
        {
          id: 'cmv_endothelial',
          name: 'Cytomegalic Swollen Endothelial Cell',
          category: 'vascular',
          coordinates: { x: 240, y: 190 },
          micronSize: '~40 μm total cell width',
          stainAffinity: 'Eosinophilic cytoplasm with viral granules',
          description: 'Hypertrophic endothelial cell bulging into and partially occluding the lumen of a capillary/arteriole in the deep submucosa.',
          clinicalRelevance: 'Endothelial tropism produces occlusive vasculitis, cutting off perfusion to the overlying mucosa.',
        },
        {
          id: 'cmv_thrombosis',
          name: 'Microvascular Thrombosis & Sludging',
          category: 'vascular',
          coordinates: { x: 200, y: 260 },
          micronSize: '~80 μm vascular lumen',
          stainAffinity: 'Dense red packed erythrocytes & fibrin',
          description: 'Sludged red blood cells and fibrin deposition within the occluded capillary lumen, halting microcirculation.',
          clinicalRelevance: 'Explains why CMV oral ulcers are deep, punched-out, and persistently necrotic rather than superficial blisters.',
        },
        {
          id: 'cmv_ulcer_base',
          name: 'Ischemic Coagulative Necrosis Base',
          category: 'architectural',
          coordinates: { x: 380, y: 320 },
          micronSize: 'Broad ulcer base (>500 μm)',
          stainAffinity: 'Eosinophilic smudgy necrotic ghost stroma',
          description: 'Complete loss of surface epithelium with exposed granulating connective tissue and necrotic stromal debris.',
          clinicalRelevance: 'In AIDS / transplant patients, this presents as a single large, crateriform, agonizingly painful non-healing ulcer.',
        },
      ],
    },
    nug: {
      id: 'nug',
      name: 'NUG / NUP Gingival Exudate',
      tag: 'Biopsy-Confirmed Bacterial',
      subtitle: 'Fuso-Spirochetal Necrotic Swarm & Fibrinopurulent Slough',
      condition: 'Vincent\'s Fuso-Spirochetal Complex Invasion',
      specimenType: 'Biopsy-Confirmed Bacterial',
      biopsySite: 'Interdental Papilla "Punched-Out" Necrotic Pseudomembrane',
      findings: 'Dense fibrinopurulent necrotic pseudomembrane overlying ulcerated connective tissue margins. Heavy infiltrate of degenerate polymorphonuclear neutrophils (PMNs) displaying nuclear pyknosis and karyorrhexis. High-power examination and Silver impregnation reveal an overwhelming bacterial swarm of Vincent\'s fuso-spirochetal complex: slender corkscrew-shaped Treponema spirochetes intermixed with needle-shaped Fusobacterium nucleatum rods actively invading viable, non-necrotic underlying stroma.',
      pearl: 'Slide 15: Overwhelming bacterial invasion of non-necrotized vital tissue; neutrophils show impaired chemotaxis and destruction.',
      boardKeyPoint: 'Treponema spirochetes penetrate deepest into intact, non-necrotized vital connective tissue ahead of other bacteria. Silver staining (Warthin-Starry) is optimal for visualization.',
      stainsAvailable: ['he', 'silver'],
      landmarks: [
        {
          id: 'nug_pseudomembrane',
          name: 'Necrotic Fibrinopurulent Pseudomembrane',
          category: 'architectural',
          coordinates: { x: 250, y: 80 },
          micronSize: '~150 μm thick superficial layer',
          stainAffinity: 'Smudgy gray-pink necrotic meshwork',
          description: 'Composed of dense fibrinous exudate, necrotic epithelial debris, engulfed erythrocytes, and dead leukocytes.',
          clinicalRelevance: 'Represents the gray-yellow slough characteristic of "punched-out" crater-like interdental papillae in NUG/NUP.',
        },
        {
          id: 'nug_spirochetes',
          name: 'Vincent\'s Corkscrew Spirochetes (Treponema)',
          category: 'microbial',
          coordinates: { x: 200, y: 150 },
          micronSize: '~8–14 μm length, 0.2 μm width',
          stainAffinity: 'Intensely black/dark-brown on Silver stain',
          description: 'Slender, motile, tightly coiled helical microorganisms (Treponema denticola / vincentii) swarming in dense clusters.',
          clinicalRelevance: 'Pathognomonic component of Vincent\'s angina and NUG. Highly invasive anaerobe that releases proteolytic enzymes.',
        },
        {
          id: 'nug_fusobacterium',
          name: 'Fusobacterium nucleatum Spindle Rods',
          category: 'microbial',
          coordinates: { x: 310, y: 220 },
          micronSize: '~5–10 μm length needle rods',
          stainAffinity: 'Basophilic Gram-negative bacilli',
          description: 'Pointed, cigar-shaped anaerobic rods working synergistically with Treponema spirochetes.',
          clinicalRelevance: 'Acts as a microbial bridging organism, secreting endotoxins and volatile sulfur compounds responsible for characteristic fetor oris.',
        },
        {
          id: 'nug_neutrophils',
          name: 'Degenerate Polymorphonuclear Neutrophils (PMNs)',
          category: 'cellular',
          coordinates: { x: 180, y: 340 },
          micronSize: '~12–15 μm leukocyte diameter',
          stainAffinity: 'Multilobed hyperchromatic pyknotic nuclei',
          description: 'Massive sheets of degenerate neutrophils with nuclear fragmentations (karyorrhexis) struggling against the anaerobic bacterial swarm.',
          clinicalRelevance: 'Reflects defective host neutrophil chemotaxis and intense acute purulent necrotizing inflammation.',
        },
      ],
    },
    em: {
      id: 'em',
      name: 'Erythema Multiforme Mucosal Biopsy',
      tag: 'Immune Apoptotic',
      subtitle: 'Subepithelial Clefting & Civatte Apoptotic Bodies',
      condition: 'Cell-Mediated Keratinocyte Apoptosis (Slide 22)',
      specimenType: 'Biopsy-Confirmed Immune',
      biopsySite: 'Perilesional Oral Mucosa (Labial Mucosa / Tongue)',
      findings: 'Subepithelial to intraepithelial clefting with marked hydropic degeneration and vacuolization of the basal cell layer. Scattered apoptotic keratinocytes (Civatte / colloid bodies) with pyknotic nuclei and intensely eosinophilic cytoplasm. Dense band-like perivascular lymphocytic infiltrate in the upper lamina propria.',
      pearl: 'Slide 22: HSV DNA fragments transported by CD34+ Langerhans cells trigger cytotoxic T-cell apoptosis.',
      boardKeyPoint: 'Target lesions with apoptotic Civatte bodies and basal layer liquefactive degeneration distinguish EM from pemphigus or mucous membrane pemphigoid.',
      stainsAvailable: ['he'],
      landmarks: [
        {
          id: 'em_civatte',
          name: 'Apoptotic Civatte (Colloid) Bodies',
          category: 'cellular',
          coordinates: { x: 210, y: 180 },
          micronSize: '~15–20 μm rounded corpses',
          stainAffinity: 'Intensely eosinophilic with pyknotic nucleus',
          description: 'Shriveled necrotic apoptotic keratinocytes caused by CD8+ cytotoxic T-cell perforin/granzyme release.',
          clinicalRelevance: 'Hallmark of cell-mediated cytotoxicity in Erythema Multiforme.',
        },
        {
          id: 'em_cleft',
          name: 'Subepithelial Cleavage Cavity',
          category: 'architectural',
          coordinates: { x: 250, y: 230 },
          micronSize: 'Separation plane along basement membrane',
          stainAffinity: 'Clear fluid-filled blister cavity',
          description: 'Liquefactive necrosis of the basal layer producing microbullae and detachment of epithelium.',
          clinicalRelevance: 'Explains the diffuse blood-crusted lip ulcerations and bullae seen in EM Major.',
        },
      ],
    },
    sjs: {
      id: 'sjs',
      name: 'Stevens-Johnson Syndrome / TEN Skin',
      tag: 'Immune Necrolysis',
      subtitle: 'Full-Thickness Epidermal Ghost Necrosis & Sparse Infiltrate',
      condition: 'Full-Thickness Epidermal Necrolysis (Slide 25)',
      specimenType: 'Biopsy-Confirmed Immune',
      biopsySite: 'Skin / Mucocutaneous Junction Bulla',
      findings: 'Confluent, full-thickness apoptotic necrosis of the entire epidermis with extensive separation along the dermo-epidermal junction. The underlying dermis exhibits a remarkably sparse inflammatory cell infiltrate (in stark contrast to primary inflammatory dermatoses).',
      pearl: 'Slide 25: Confluent full-thickness epidermal death with a remarkably sparse dermal inflammatory infiltrate.',
      boardKeyPoint: 'The "sparse dermal infiltrate" in the presence of massive epidermal necrolysis is the crucial diagnostic board clue distinguishing SJS/TEN from primary inflammatory dermatitides.',
      stainsAvailable: ['he'],
      landmarks: [
        {
          id: 'sjs_ghost',
          name: 'Full-Thickness Epidermal Ghost Necrosis',
          category: 'architectural',
          coordinates: { x: 250, y: 110 },
          micronSize: '~150 μm mummified layer',
          stainAffinity: 'Homogeneous pale eosinophilic ghost sheet',
          description: 'Total apoptotic death of all keratinocyte layers forming an eosinophilic mummified ghost sheet.',
          clinicalRelevance: 'Leads to extensive sheet-like flaccid skin detachment and positive Nikolsky sign.',
        },
        {
          id: 'sjs_sparse',
          name: 'Remarkably Sparse Dermal Infiltrate',
          category: 'cellular',
          coordinates: { x: 250, y: 350 },
          micronSize: 'Acellular dermal bed',
          stainAffinity: 'Acellular pale stroma',
          description: 'Connective tissue contains strikingly few inflammatory cells relative to the devastating necrosis above.',
          clinicalRelevance: 'Key board differentiator distinguishing drug-induced SJS/TEN from primary inflammatory erythema multiforme.',
        },
      ],
    },
    pcs: {
      id: 'pcs',
      name: 'Plasma Cell Stomatitis',
      tag: 'Polyclonal Infiltrate',
      subtitle: 'Solid Sheets of Plasma Cells with Clock-Face Nuclei',
      condition: 'Polyclonal Plasma Cell Infiltrate (Slide 30)',
      specimenType: 'Biopsy-Confirmed Immune',
      biopsySite: 'Attached Gingiva Biopsy (Fiery Red Gingivitis)',
      findings: 'Dense, solid sheets of mature plasma cells with "clock-face" eccentric nuclei and perinuclear halos (Hof). Abundant dilated capillaries lie close to the surface, causing fiery scarlet erythema. Eosinophils are characteristically absent.',
      pearl: 'Slide 30: Immunoperoxidase light chain stains (kappa and lambda) demonstrate polyclonal expression, ruling out multiple myeloma.',
      boardKeyPoint: 'Polyclonality on IHC kappa/lambda rules out plasmacytoma. Contact hypersensitivity to cinnamon / chewing gum flavoring is the primary etiology.',
      stainsAvailable: ['he', 'immunoperoxidase'],
      landmarks: [
        {
          id: 'pcs_clockface',
          name: 'Clock-Face (Cartwheel) Plasma Cells',
          category: 'cellular',
          coordinates: { x: 240, y: 220 },
          micronSize: '~15–20 μm cell diameter',
          stainAffinity: 'Basophilic cytoplasm with radial chromatin',
          description: 'Mature plasma cells packed in solid sheets with eccentric cartwheel chromatin and prominent perinuclear Hof (Golgi zone).',
          clinicalRelevance: 'Diagnostic of plasma cell stomatitis; must be stained for kappa/lambda to rule out extramedullary plasmacytoma.',
        },
      ],
    },
  };

  const currentSpecimen = SPECIMEN_CATALOG[selectedSlide];
  const compareSpecimen = SPECIMEN_CATALOG[compareTargetSlide];

  // Optical calculations
  const blurAmount = Math.abs(focusOffset) * 0.45;

  // Zoom manipulation
  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(4.5, Math.max(1.0, Number((prev + delta).toFixed(1)))));
  };

  const handleResetStage = () => {
    setZoomLevel(2.0);
    setStagePan({ x: 0, y: 0 });
    setFocusOffset(0);
  };

  // Drag to pan stage handler
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - stagePan.x, y: e.clientY - stagePan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setStagePan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Quick Normal vs Pathological toggle handler
  const handleToggleNormalCompare = () => {
    if (selectedSlide === 'normal') {
      setSelectedSlide(compareTargetSlide === 'normal' ? 'cmv' : compareTargetSlide);
    } else {
      setCompareTargetSlide(selectedSlide);
      setSelectedSlide('normal');
    }
  };

  // Render SVG Microscopic Tissue Slice for a given specimen
  const renderSpecimenTissue = (specimen: SpecimenData) => {
    const isSilver = activeStain === 'silver' && specimen.stainsAvailable.includes('silver');
    const isIHC = activeStain === 'immunoperoxidase' && specimen.stainsAvailable.includes('immunoperoxidase');

    return (
      <g>
        {/* Background Stained Tissue Matrix */}
        <rect
          width="500"
          height="500"
          fill={isSilver ? '#f1f5f9' : isIHC ? '#fef3c7' : '#fdf2f8'}
        />

        {/* 1. NORMAL ORAL MUCOSA SPECIMEN */}
        {specimen.id === 'normal' && (
          <g>
            {/* Stratified Squamous Epithelial Layer */}
            <path
              d="M 0,0 L 500,0 L 500,230 Q 420,200 350,235 Q 280,270 210,230 Q 140,195 70,235 Q 35,250 0,230 Z"
              fill={isIHC ? '#fde68a' : '#fbcfe8'}
              opacity="0.8"
            />

            {/* Keratinocyte nuclei in orderly layers */}
            {[...Array(60)].map((_, i) => {
              const x = 20 + (i % 12) * 40 + (Math.sin(i * 1.5) * 8);
              const y = 30 + Math.floor(i / 12) * 36;
              const isBasal = y > 180;
              return (
                <ellipse
                  key={i}
                  cx={x}
                  cy={y}
                  rx={isBasal ? 5 : 8}
                  ry={isBasal ? 7 : 5}
                  fill="#4c0519"
                  opacity={isBasal ? 0.85 : 0.65}
                />
              );
            })}

            {/* Continuous Undulating Basement Membrane */}
            <path
              d="M 0,230 Q 35,250 70,235 Q 140,195 210,230 Q 280,270 350,235 Q 420,200 500,230"
              stroke="#be185d"
              strokeWidth="4"
              fill="none"
              strokeDasharray={showZonalBoundaries ? 'none' : 'none'}
            />

            {/* Lamina Propria (Connective Tissue with Collagen & Fibroblasts) */}
            <rect x="0" y="240" width="500" height="260" fill={isIHC ? '#fef9c3' : '#fee2e2'} opacity="0.6" />

            {/* Collagen bundles & slender fibroblasts */}
            {[...Array(24)].map((_, i) => {
              const fx = 40 + (i % 6) * 75 + (i * 3);
              const fy = 270 + Math.floor(i / 6) * 55;
              return (
                <g key={i}>
                  <path
                    d={`M ${fx - 25},${fy} Q ${fx},${fy + 10} ${fx + 25},${fy}`}
                    stroke="#f472b6"
                    strokeWidth="2.5"
                    fill="none"
                    opacity="0.45"
                  />
                  {/* Spindle fibroblast nucleus */}
                  <ellipse cx={fx} cy={fy} rx="9" ry="2.5" fill="#1e1b4b" opacity="0.7" />
                </g>
              );
            })}

            {/* Patent Microvascular Capillaries */}
            <g transform="translate(150, 380)">
              <ellipse cx="0" cy="0" rx="28" ry="18" fill="#fee2e2" stroke="#dc2626" strokeWidth="2.5" />
              {/* Normal Single-file RBCs */}
              <circle cx="-10" cy="0" r="5" fill="#ef4444" />
              <circle cx="2" cy="0" r="5" fill="#ef4444" />
              <circle cx="14" cy="0" r="5" fill="#ef4444" />
              {/* Delicate endothelial nuclei */}
              <ellipse cx="0" cy="-18" rx="6" ry="2.5" fill="#172554" />
              <ellipse cx="0" cy="18" rx="6" ry="2.5" fill="#172554" />
            </g>
          </g>
        )}

        {/* 2. BIOPSY-CONFIRMED CMV SPECIMEN */}
        {specimen.id === 'cmv' && (
          <g>
            {/* Deep Ulcer Base Matrix with Necrotic Ghost Stromal Debris */}
            <rect x="0" y="0" width="500" height="500" fill={isIHC ? '#fef3c7' : '#fee2e2'} opacity="0.55" />

            {/* Ulcerated necrotic debris strands */}
            {[...Array(18)].map((_, i) => (
              <path
                key={i}
                d={`M ${20 + i * 26},${30 + (i % 4) * 20} Q ${50 + i * 26},${50} ${80 + i * 26},${35}`}
                stroke="#fda4af"
                strokeWidth="3"
                opacity="0.4"
                fill="none"
              />
            ))}

            {/* Microvascular Vessel Cross-Section with Massive Cytomegaly */}
            <g transform="translate(10, 10)">
              {/* Blood Vessel Wall (Arteriole / Venule) */}
              <ellipse cx="240" cy="240" rx="165" ry="135" fill="#ffe4e6" stroke="#b91c1c" strokeWidth="5" />

              {/* Sludged Erythrocytes (Vascular Thrombosis) */}
              {[...Array(26)].map((_, i) => (
                <circle
                  key={i}
                  cx={150 + (i % 6) * 32 + (Math.sin(i) * 6)}
                  cy={240 + Math.floor(i / 6) * 22}
                  r="8.5"
                  fill="#dc2626"
                  opacity="0.85"
                />
              ))}

              {/* CYTOMEGALIC ENDOTHELIAL CELL WITH PATHOGNOMONIC OWL'S EYE INCLUSION */}
              <g
                className="cursor-pointer transition-transform hover:scale-105"
                onClick={() => setActiveLandmarkId('cmv_owl_eye')}
              >
                {/* Massive hypertrophied endothelial cell body (~40 μm) */}
                <ellipse
                  cx="240"
                  cy="175"
                  rx="78"
                  ry="58"
                  fill={isIHC ? '#b45309' : '#f43f5e'}
                  opacity={isIHC ? 0.9 : 0.88}
                  stroke="#9f1239"
                  strokeWidth="3.5"
                />

                {/* Clear Perinuclear Halo (Unstained space) */}
                <circle
                  cx="240"
                  cy="175"
                  r="44"
                  fill={isIHC ? '#fffbeb' : '#fdf2f8'}
                  stroke="#fbcfe8"
                  strokeWidth="5"
                />

                {/* Central Dense Basophilic "Owl's Eye" Inclusion Core (~35 μm) */}
                <circle
                  cx="240"
                  cy="175"
                  r="35"
                  fill={isIHC ? '#78350f' : '#1e1b4b'}
                  stroke={isIHC ? '#451a03' : '#312e81'}
                  strokeWidth="4"
                />
                <circle cx="240" cy="175" r="22" fill={isIHC ? '#92400e' : '#4338ca'} />
                <circle cx="240" cy="175" r="11" fill={isIHC ? '#b45309' : '#172554'} />

                {/* Cytoplasmic basophilic granules (granular inclusions) */}
                <circle cx="288" cy="195" r="6.5" fill={isIHC ? '#78350f' : '#1e1b4b'} />
                <circle cx="192" cy="198" r="5.5" fill={isIHC ? '#78350f' : '#1e1b4b'} />
                <circle cx="230" cy="220" r="5" fill={isIHC ? '#78350f' : '#1e1b4b'} />
              </g>

              {/* Second smaller neighboring infected endothelial cell */}
              <g transform="translate(330, 270)">
                <ellipse cx="0" cy="0" rx="35" ry="28" fill="#fb7185" opacity="0.8" stroke="#be123c" strokeWidth="2" />
                <circle cx="0" cy="0" r="18" fill="#fdf2f8" />
                <circle cx="0" cy="0" r="14" fill="#1e1b4b" />
              </g>

              {/* Measurement Caliper around Owl's Eye Inclusion */}
              {showMicronScale && (
                <g opacity="0.9">
                  <line x1="160" y1="110" x2="320" y2="110" stroke="#0284c7" strokeWidth="2" strokeDasharray="3 3" />
                  <line x1="160" y1="104" x2="160" y2="116" stroke="#0284c7" strokeWidth="2.5" />
                  <line x1="320" y1="104" x2="320" y2="116" stroke="#0284c7" strokeWidth="2.5" />
                  <rect x="208" y="94" width="64" height="18" rx="4" fill="#0284c7" />
                  <text x="240" y="107" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                    ~35 μm inclusion
                  </text>
                </g>
              )}
            </g>
          </g>
        )}

        {/* 3. BIOPSY-CONFIRMED NUG/NUP SPECIMEN */}
        {specimen.id === 'nug' && (
          <g>
            {/* Superficial Necrotic Pseudomembrane Band */}
            <path
              d="M 0,0 L 500,0 L 500,165 Q 250,195 0,165 Z"
              fill={isSilver ? '#94a3b8' : '#64748b'}
              opacity="0.68"
            />

            {/* Dense Swarm of Vincent's Corkscrew Spirochetes (Treponema) */}
            {[...Array(48)].map((_, i) => {
              const sx = 30 + (i * 10) + (Math.sin(i * 3) * 18);
              const sy = 80 + (i % 8) * 22;
              return (
                <path
                  key={i}
                  d={`M ${sx},${sy} Q ${sx + 6},${sy - 12} ${sx + 12},${sy} T ${sx + 24},${sy}`}
                  stroke={isSilver ? '#020617' : '#1e1b4b'}
                  strokeWidth={isSilver ? '3.8' : '2.8'}
                  fill="none"
                  strokeLinecap="round"
                />
              );
            })}

            {/* Spirochetes actively invading deep viable tissue */}
            {[...Array(20)].map((_, i) => {
              const dx = 60 + i * 20;
              const dy = 240 + Math.sin(i * 2) * 50;
              return (
                <path
                  key={i}
                  d={`M ${dx},${dy} Q ${dx + 5},${dy - 10} ${dx + 10},${dy} T ${dx + 20},${dy}`}
                  stroke={isSilver ? '#0f172a' : '#881337'}
                  strokeWidth={isSilver ? '3.5' : '2.4'}
                  fill="none"
                />
              );
            })}

            {/* Fusobacterium nucleatum Spindle Rods (Pointed Cigars) */}
            {[...Array(32)].map((_, i) => {
              const fx1 = 50 + (i * 14);
              const fy1 = 170 + (Math.sin(i * 1.8) * 45);
              const fx2 = fx1 + 22;
              const fy2 = fy1 + 16;
              return (
                <line
                  key={i}
                  x1={fx1}
                  y1={fy1}
                  x2={fx2}
                  y2={fy2}
                  stroke={isSilver ? '#334155' : '#991b1b'}
                  strokeWidth="3.6"
                  strokeLinecap="round"
                />
              );
            })}

            {/* Sheets of Degenerate Polymorphonuclear Neutrophils (PMNs) */}
            {[...Array(18)].map((_, i) => {
              const nx = 60 + (i % 6) * 75;
              const ny = 330 + Math.floor(i / 6) * 50;
              return (
                <g key={i} transform={`translate(${nx}, ${ny})`}>
                  {/* Neutrophil cytoplasm */}
                  <circle cx="0" cy="0" r="16" fill="#fbcfe8" opacity="0.8" />
                  {/* Multilobed pyknotic nuclei (PMN) */}
                  <circle cx="-5" cy="-4" r="4.5" fill="#4c0519" />
                  <circle cx="5" cy="-4" r="4.5" fill="#4c0519" />
                  <circle cx="0" cy="5" r="4.5" fill="#4c0519" />
                  {/* Nuclear fragment dust (Karyorrhexis) */}
                  <circle cx="-8" cy="6" r="1.5" fill="#4c0519" />
                  <circle cx="8" cy="6" r="1.5" fill="#4c0519" />
                </g>
              );
            })}
          </g>
        )}

        {/* 4. ERYTHEMA MULTIFORME SPECIMEN */}
        {specimen.id === 'em' && (
          <g>
            <rect x="0" y="0" width="500" height="210" fill="#f43f5e" opacity="0.45" />
            <path d="M 0,205 Q 250,150 500,205 L 500,265 Q 250,310 0,265 Z" fill="#ffffff" opacity="0.95" />
            {[...Array(12)].map((_, i) => (
              <g key={i} transform={`translate(${60 + i * 36}, ${185 + Math.sin(i * 2) * 14})`}>
                <circle cx="0" cy="0" r="11" fill="#881337" stroke="#4c0519" strokeWidth="2" />
                <circle cx="0" cy="0" r="5" fill="#1c0309" />
              </g>
            ))}
            {[...Array(35)].map((_, i) => (
              <circle key={i} cx={40 + (i % 8) * 55} cy={320 + Math.floor(i / 8) * 36} r="7" fill="#1e1b4b" />
            ))}
          </g>
        )}

        {/* 5. SJS / TEN SPECIMEN */}
        {specimen.id === 'sjs' && (
          <g>
            <rect x="0" y="40" width="500" height="150" fill="#701a75" opacity="0.75" />
            <rect x="0" y="190" width="500" height="70" fill="#ffffff" opacity="0.95" />
            <rect x="0" y="260" width="500" height="240" fill="#fed7aa" opacity="0.55" />
            <text x="250" y="380" fill="#78350f" fontSize="13" textAnchor="middle" fontWeight="bold">
              Notice: Remarkably Sparse Dermal Infiltrate (Slide 25)
            </text>
          </g>
        )}

        {/* 6. PLASMA CELL STOMATITIS SPECIMEN */}
        {specimen.id === 'pcs' && (
          <g>
            {[...Array(55)].map((_, i) => {
              const cx = 40 + (i % 9) * 48 + (Math.sin(i * 2) * 8);
              const cy = 50 + Math.floor(i / 9) * 54 + (Math.cos(i * 2) * 8);
              return (
                <g key={i}>
                  <ellipse cx={cx} cy={cy} rx="18" ry="14" fill="#f43f5e" opacity="0.8" />
                  <circle cx={cx - 6} cy={cy - 4} r="8" fill="#312e81" />
                  <line x1={cx - 6} y1={cy - 10} x2={cx - 6} y2={cy + 2} stroke="#ffffff" strokeWidth="0.8" opacity="0.7" />
                  <line x1={cx - 12} y1={cy - 4} x2={cx} y2={cy - 4} stroke="#ffffff" strokeWidth="0.8" opacity="0.7" />
                  <circle cx={cx + 3} cy={cy + 1} r="4.5" fill="#fed7aa" opacity="0.85" />
                </g>
              );
            })}
          </g>
        )}

        {/* 2D INTERACTIVE LANDMARK PINS & OVERLAYS */}
        {showLandmarkPins && (
          <g>
            {specimen.landmarks.map((landmark) => {
              const isSelected = activeLandmarkId === landmark.id;
              const { x, y } = landmark.coordinates;

              return (
                <g
                  key={landmark.id}
                  className="cursor-pointer transition-transform group"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveLandmarkId(landmark.id);
                  }}
                >
                  {/* Glowing Radar Halo around landmark */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 26 : 18}
                    fill={isSelected ? '#0284c7' : '#0ea5e9'}
                    opacity={isSelected ? 0.35 : 0.18}
                    className="animate-pulse"
                  />

                  {/* Marker Pin Core */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 9 : 7}
                    fill={isSelected ? '#38bdf8' : '#0284c7'}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />

                  {/* Hotspot Target Crosshair */}
                  <line x1={x - 14} y1={y} x2={x + 14} y2={y} stroke="#38bdf8" strokeWidth="1.2" opacity="0.7" />
                  <line x1={x} y1={y - 14} x2={x} y2={y + 14} stroke="#38bdf8" strokeWidth="1.2" opacity="0.7" />

                  {/* 2D Floating Tag Label */}
                  {showCellLabels && (
                    <g transform={`translate(${x}, ${y - 14})`}>
                      <rect
                        x="-65"
                        y="-22"
                        width="130"
                        height="20"
                        rx="4"
                        fill="#020617"
                        stroke={isSelected ? '#38bdf8' : '#334155'}
                        strokeWidth="1.2"
                        opacity="0.9"
                      />
                      <text
                        x="0"
                        y="-8"
                        fill="#ffffff"
                        fontSize="9"
                        fontWeight="bold"
                        textAnchor="middle"
                        fontFamily="sans-serif"
                      >
                        {landmark.name.length > 22 ? landmark.name.slice(0, 20) + '…' : landmark.name}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        )}
      </g>
    );
  };

  // Active Landmark Data Card Finder
  const currentActiveLandmark =
    currentSpecimen.landmarks.find((l) => l.id === activeLandmarkId) || currentSpecimen.landmarks[0];

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in select-none">
      {/* Top Banner & Mode Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-teal-400 font-semibold mb-1">
            <Microscope className="w-4 h-4 text-teal-400" />
            <span>Oral Medicine Pathology Lab · Slide 4, 15, 22, 25 & 30</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <span>Histopathology Slide Viewer</span>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-800">
              Interactive 2D Zoomable Overlays
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Examine high-resolution tissue biopsy slides. Toggle instantly between <strong>Normal Oral Mucosa</strong> and biopsy-confirmed <strong>Cytomegalovirus (CMV)</strong> or <strong>NUG/NUP fuso-spirochetal</strong> lesions to inspect microvascular inclusions, bacterial swarms, and pathognomonic diagnostic landmarks.
          </p>
        </div>

        {/* Quick Normal vs Biopsy Toggle Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleNormalCompare}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 shadow-lg ${
              selectedSlide === 'normal'
                ? 'bg-rose-950 text-rose-200 border-rose-500 shadow-rose-950/40 ring-1 ring-rose-500/50'
                : 'bg-teal-950 text-teal-200 border-teal-500 shadow-teal-950/40 ring-1 ring-teal-500/50'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4 text-teal-300" />
            <span>
              {selectedSlide === 'normal'
                ? `Toggle: View Biopsy (${compareTargetSlide.toUpperCase()})`
                : 'Toggle: View Normal Oral Mucosa'}
            </span>
          </button>

          <button
            onClick={() => setViewerMode(viewerMode === 'single' ? 'split-compare' : 'single')}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              viewerMode === 'split-compare'
                ? 'bg-sky-500 text-slate-950 border-sky-400 font-extrabold shadow-md'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{viewerMode === 'split-compare' ? 'Split-View Active' : 'Split-View Compare'}</span>
          </button>
        </div>
      </div>

      {/* Primary Specimen Selector Chips */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400 font-semibold uppercase">
            Select Specimen to Inspect:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'normal' as const, label: 'Normal Oral Mucosa (Control)' },
              { id: 'cmv' as const, label: 'CMV Endothelial Biopsy (HHV-5)' },
              { id: 'nug' as const, label: 'NUG / NUP Fuso-Spirochetal' },
              { id: 'em' as const, label: 'Erythema Multiforme (Civatte)' },
              { id: 'sjs' as const, label: 'SJS / TEN Epidermal Cleavage' },
              { id: 'pcs' as const, label: 'Plasma Cell Stomatitis' },
            ].map((s) => {
              const isSelected = selectedSlide === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelectedSlide(s.id);
                    if (s.id !== 'normal') setCompareTargetSlide(s.id);
                    setStagePan({ x: 0, y: 0 });
                    setFocusOffset(0);
                    const firstL = SPECIMEN_CATALOG[s.id].landmarks[0];
                    if (firstL) setActiveLandmarkId(firstL.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all text-xs border ${
                    isSelected
                      ? 'bg-teal-500 text-slate-950 border-teal-400 font-bold shadow-md ring-1 ring-white/20'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stain Selector */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          <span className="text-slate-500 text-[10px] px-1 font-mono uppercase">Stain:</span>
          <button
            onClick={() => setActiveStain('he')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeStain === 'he'
                ? 'bg-rose-950 text-rose-300 font-semibold border border-rose-800'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            H&E Stain
          </button>
          <button
            onClick={() => setActiveStain('immunoperoxidase')}
            disabled={!currentSpecimen.stainsAvailable.includes('immunoperoxidase')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeStain === 'immunoperoxidase'
                ? 'bg-amber-950 text-amber-300 font-semibold border border-amber-800'
                : !currentSpecimen.stainsAvailable.includes('immunoperoxidase')
                ? 'text-slate-600 opacity-40 cursor-not-allowed'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            IHC / DAB
          </button>
          <button
            onClick={() => setActiveStain('silver')}
            disabled={!currentSpecimen.stainsAvailable.includes('silver')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeStain === 'silver'
                ? 'bg-slate-800 text-slate-200 font-semibold border border-slate-700'
                : !currentSpecimen.stainsAvailable.includes('silver')
                ? 'text-slate-600 opacity-40 cursor-not-allowed'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Silver Stain (Warthin-Starry)
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Stage on Left, Specimen Analysis & Overlays Deck on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 2D Zoomable Slide Stage (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col shadow-xl space-y-4">
          {/* Stage Top Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 text-xs">
            {/* Quick Magnification Presets */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <span className="text-slate-500 text-[10px] px-1 font-mono uppercase">Mag:</span>
              {[
                { label: '1x Scan', val: 1.0 },
                { label: '2x (10x HPF)', val: 2.0 },
                { label: '3x (40x HPF)', val: 3.0 },
                { label: '4.5x Oil', val: 4.5 },
              ].map((m) => (
                <button
                  key={m.label}
                  onClick={() => setZoomLevel(m.val)}
                  className={`px-2 py-0.5 rounded font-mono transition-colors ${
                    zoomLevel === m.val
                      ? 'bg-teal-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* 2D Overlay Feature Layer Toggles */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
              <button
                onClick={() => setShowLandmarkPins(!showLandmarkPins)}
                className={`px-2.5 py-1 rounded flex items-center gap-1 transition-colors ${
                  showLandmarkPins ? 'bg-sky-950 text-sky-300 font-bold' : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Toggle Landmark Pins"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>Pins</span>
              </button>

              <button
                onClick={() => setShowCellLabels(!showCellLabels)}
                className={`px-2.5 py-1 rounded flex items-center gap-1 transition-colors ${
                  showCellLabels ? 'bg-sky-950 text-sky-300 font-bold' : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Toggle Floating Labels"
              >
                <TagIcon className="w-3.5 h-3.5" />
                <span>Labels</span>
              </button>

              <button
                onClick={() => setShowMicronScale(!showMicronScale)}
                className={`px-2.5 py-1 rounded flex items-center gap-1 transition-colors ${
                  showMicronScale ? 'bg-teal-950 text-teal-300 font-bold' : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Toggle Caliper Scale Bar"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Caliper</span>
              </button>
            </div>
          </div>

          {/* Interactive 2D Zoomable Canvas Viewport */}
          <div
            className="w-full relative rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center select-none"
            style={{ height: '440px' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* If Single View Mode */}
            {viewerMode === 'single' ? (
              <svg
                viewBox="0 0 500 500"
                className="w-full h-full cursor-grab active:cursor-grabbing"
                style={{
                  filter: `blur(${blurAmount}px)`,
                }}
              >
                <g
                  transform={`scale(${zoomLevel}) translate(${(-250 * (zoomLevel - 1) + stagePan.x) / zoomLevel}, ${(-250 * (zoomLevel - 1) + stagePan.y) / zoomLevel})`}
                >
                  {renderSpecimenTissue(currentSpecimen)}
                </g>
              </svg>
            ) : (
              /* If Split-Screen Comparator Mode: Left = Normal Oral Mucosa, Right = Biopsy Lesion */
              <div className="w-full h-full grid grid-cols-2 divide-x divide-slate-800">
                {/* Left Side: Normal Oral Mucosa */}
                <div className="relative w-full h-full overflow-hidden">
                  <div className="absolute top-2 left-2 z-10 px-2.5 py-1 rounded bg-slate-900/90 border border-slate-700 text-[10px] font-mono font-bold text-teal-300">
                    Normal Oral Mucosa (Control)
                  </div>
                  <svg
                    viewBox="0 0 500 500"
                    className="w-full h-full cursor-grab active:cursor-grabbing"
                    style={{ filter: `blur(${blurAmount}px)` }}
                  >
                    <g
                      transform={`scale(${zoomLevel}) translate(${(-250 * (zoomLevel - 1) + stagePan.x) / zoomLevel}, ${(-250 * (zoomLevel - 1) + stagePan.y) / zoomLevel})`}
                    >
                      {renderSpecimenTissue(SPECIMEN_CATALOG.normal)}
                    </g>
                  </svg>
                </div>

                {/* Right Side: Biopsy Lesion (CMV or NUG) */}
                <div className="relative w-full h-full overflow-hidden">
                  <div className="absolute top-2 left-2 z-10 px-2.5 py-1 rounded bg-slate-900/90 border border-slate-700 text-[10px] font-mono font-bold text-rose-300">
                    {currentSpecimen.id === 'normal'
                      ? 'CMV Biopsy Lesion'
                      : currentSpecimen.name}
                  </div>
                  <svg
                    viewBox="0 0 500 500"
                    className="w-full h-full cursor-grab active:cursor-grabbing"
                    style={{ filter: `blur(${blurAmount}px)` }}
                  >
                    <g
                      transform={`scale(${zoomLevel}) translate(${(-250 * (zoomLevel - 1) + stagePan.x) / zoomLevel}, ${(-250 * (zoomLevel - 1) + stagePan.y) / zoomLevel})`}
                    >
                      {renderSpecimenTissue(
                        currentSpecimen.id === 'normal' ? SPECIMEN_CATALOG.cmv : currentSpecimen
                      )}
                    </g>
                  </svg>
                </div>
              </div>
            )}

            {/* Overlaid Micron Scale Bar in Corner */}
            {showMicronScale && (
              <div className="absolute bottom-3 left-3 bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-[10px] font-mono text-slate-200 pointer-events-none flex items-center gap-2 shadow-lg">
                <div
                  className="h-1.5 bg-teal-400 rounded-sm"
                  style={{ width: `${Math.round(40 * zoomLevel)}px` }}
                />
                <span>Scale: {Math.round(50 / zoomLevel)} μm</span>
                <span className="text-slate-400">·</span>
                <span className="text-emerald-400 font-bold">{Math.round(zoomLevel * 100)}% Zoom</span>
              </div>
            )}

            {/* Stage Pan Coordinate HUD */}
            <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 text-[10px] font-mono text-slate-300 pointer-events-none">
              Pan: ({stagePan.x > 0 ? `+${stagePan.x}` : stagePan.x}, {stagePan.y > 0 ? `+${stagePan.y}` : stagePan.y})
            </div>
          </div>

          {/* Microscope Controls Bar (Zoom, Pan, Fine Focus) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-950 p-3.5 rounded-xl border border-slate-800 items-center">
            {/* Zoom Slider */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300 flex items-center gap-1 text-[11px]">
                <ZoomIn className="w-3.5 h-3.5 text-teal-400" />
                <span>Zoom:</span>
              </span>
              <input
                type="range"
                min="1.0"
                max="4.5"
                step="0.1"
                value={zoomLevel}
                onChange={(e) => setZoomLevel(Number(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer"
              />
              <span className="font-mono text-teal-400 font-bold text-[11px] w-10 text-right">
                {zoomLevel}x
              </span>
            </div>

            {/* Stage Pan Arrow Controls */}
            <div className="flex items-center justify-center gap-1">
              <button
                onClick={() => setStagePan((prev) => ({ ...prev, x: prev.x - 35 }))}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-bold text-xs"
                title="Pan Left"
              >
                ←
              </button>
              <button
                onClick={() => setStagePan((prev) => ({ ...prev, x: prev.x + 35 }))}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-bold text-xs"
                title="Pan Right"
              >
                →
              </button>
              <button
                onClick={() => setStagePan((prev) => ({ ...prev, y: prev.y - 35 }))}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-bold text-xs"
                title="Pan Up"
              >
                ↑
              </button>
              <button
                onClick={() => setStagePan((prev) => ({ ...prev, y: prev.y + 35 }))}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-bold text-xs"
                title="Pan Down"
              >
                ↓
              </button>
              <button
                onClick={handleResetStage}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded text-[11px] font-mono flex items-center gap-1"
                title="Center & Reset View"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Center</span>
              </button>
            </div>

            {/* Fine Focus Knob */}
            <div className="flex items-center justify-end gap-2">
              <span className="font-semibold text-slate-300 flex items-center gap-1 text-[11px]">
                <Focus className="w-3.5 h-3.5 text-sky-400" />
                <span>Fine Focus:</span>
              </span>
              <input
                type="range"
                min="-5"
                max="5"
                step="1"
                value={focusOffset}
                onChange={(e) => setFocusOffset(Number(e.target.value))}
                className="w-20 accent-sky-400 cursor-pointer"
              />
              <button
                onClick={() => setFocusOffset(0)}
                className="px-1.5 py-0.5 bg-slate-800 text-sky-300 rounded font-mono text-[10px]"
                title="Zero Focus"
              >
                Zero
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Specimen Analysis, Landmark Callouts & Board Rules (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Specimen Summary Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800 font-bold">
                  {currentSpecimen.tag}
                </span>
                <h3 className="text-base font-bold text-white mt-1">{currentSpecimen.name}</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">{zoomLevel}x Magnification</span>
            </div>

            <div className="space-y-1.5 text-slate-300">
              <div>
                <strong className="text-slate-400">Biopsy Site:</strong>{' '}
                <span className="text-slate-200">{currentSpecimen.biopsySite}</span>
              </div>
              <div>
                <strong className="text-slate-400">Histological Findings:</strong>
                <p className="text-slate-300 text-[11px] leading-relaxed mt-0.5">
                  {currentSpecimen.findings}
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 space-y-1">
              <span className="font-bold text-amber-300 flex items-center gap-1.5 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Official Lecture Landmark:</span>
              </span>
              <p className="text-amber-200/90 text-[11px] leading-relaxed">
                {currentSpecimen.pearl}
              </p>
            </div>
          </div>

          {/* Interactive Diagnostic Landmark Cards */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-4 h-4 text-teal-400" />
                <span>Interactive Landmark Overlays</span>
              </h4>
              <span className="text-[10px] font-mono text-slate-400">
                {currentSpecimen.landmarks.length} Identified Pins
              </span>
            </div>

            <div className="space-y-2">
              {currentSpecimen.landmarks.map((landmark) => {
                const isSelected = activeLandmarkId === landmark.id;
                return (
                  <div
                    key={landmark.id}
                    onClick={() => setActiveLandmarkId(landmark.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer text-xs space-y-1 ${
                      isSelected
                        ? 'bg-slate-850 border-teal-500 shadow-lg ring-1 ring-teal-500/50'
                        : 'bg-slate-950 border-slate-850 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{landmark.name}</span>
                      <span className="text-[10px] font-mono text-teal-400">{landmark.micronSize}</span>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {landmark.description}
                    </p>

                    {isSelected && (
                      <div className="pt-2 border-t border-slate-800 space-y-1 text-[11px]">
                        <div className="text-sky-300">
                          <strong>Stain Affinity:</strong> {landmark.stainAffinity}
                        </div>
                        <div className="text-emerald-300">
                          <strong>Diagnostic Relevance:</strong> {landmark.clinicalRelevance}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Clinical Board Distinction Alert */}
          <div className="p-4 bg-teal-950/40 border border-teal-800/60 rounded-2xl text-xs space-y-1.5">
            <span className="font-bold text-teal-300 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-teal-400" />
              <span>Oral Medicine Board Examination Distinction:</span>
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {currentSpecimen.boardKeyPoint}
            </p>
          </div>

          {/* High Power Field (HPF) Cell Density Tally Counter */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-white block">Cell Density Tally (HPF):</span>
              <span className="text-[11px] text-slate-400">Target cells counted per 40x field</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCellCount((c) => Math.max(0, c - 1))}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm"
              >
                -
              </button>
              <span className="font-mono text-base font-bold text-teal-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                {cellCount}
              </span>
              <button
                onClick={() => setCellCount((c) => c + 1)}
                className="w-8 h-8 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function TagIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
      <path d="M7 7h.01" />
    </svg>
  );
}
