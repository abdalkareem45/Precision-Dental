import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { DiseaseId } from '../../types';
import { DISEASES_DATA } from '../../data/lectureData';
import { 
  Eye, 
  Layers, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Sparkles, 
  Info, 
  X, 
  Droplet,
  Split,
  Maximize2,
  Check
} from 'lucide-react';

interface OralCavity3DProps {
  selectedDisease?: DiseaseId | null;
  onSelectDisease?: (diseaseId: DiseaseId) => void;
  showComparison?: boolean;
  comparisonDisease?: DiseaseId | null;
  severityLevel?: number; // 0 (mild) to 100 (severe)
  isInteractive?: boolean;
}

export type AnatomicalLayerType = 
  | 'all' 
  | 'dentition' 
  | 'tongue' 
  | 'palate' 
  | 'crossSection';

export interface AnatomicalStructureData {
  id: string;
  name: string;
  category: 'Dentition' | 'Periodontium' | 'Tongue & Floor' | 'Palate & Fauces' | 'Histology & Cross-Section' | 'Mucosa & Lips';
  pos: [number, number, number];
  cameraTarget: [number, number, number];
  cameraPos: [number, number, number];
  epithelium: string;
  histology: string;
  bloodSupply: string;
  innervation: string;
  clinicalSignificance: string;
  associatedDisease?: DiseaseId;
}

export const ANATOMICAL_STRUCTURES: AnatomicalStructureData[] = [
  {
    id: 'hard_palate',
    name: 'Hard Palate & Palatine Rugae',
    category: 'Palate & Fauces',
    pos: [0, 0.95, -0.25],
    cameraTarget: [0, 0.8, -0.3],
    cameraPos: [0, -0.3, 3.8],
    epithelium: 'Orthokeratinized & Parakeratinized Stratified Squamous Epithelium',
    histology: 'Dense collagenous lamina propria tightly bound to palatine processes of maxilla; transverse mucosal rugae aid bolus trituration.',
    bloodSupply: 'Greater palatine artery (branch of descending palatine / maxillary a.)',
    innervation: 'Greater palatine nerve (CN V2), Nasopalatine nerve',
    clinicalSignificance: 'Masticatory mucosa resistant to shear friction. Sparing in recurrent aphthous stomatitis; characteristic predilection site for secondary intraoral HSV lesions.',
    associatedDisease: 'coxsackie'
  },
  {
    id: 'soft_palate_uvula',
    name: 'Soft Palate & Uvula',
    category: 'Palate & Fauces',
    pos: [0, 0.68, -1.15],
    cameraTarget: [0, 0.55, -1.2],
    cameraPos: [0, -0.15, 3.2],
    epithelium: 'Non-Keratinized Stratified Squamous Epithelium (Posterior surface: Ciliated Columnar)',
    histology: 'Highly vascular, movable muscular curtain containing tensor & levator veli palatini muscles and branched mucous minor salivary glands.',
    bloodSupply: 'Lesser palatine artery, ascending palatine artery (facial a.), ascending pharyngeal a.',
    innervation: 'Lesser palatine nerves (CN V2), Pharyngeal plexus (CN IX, X)',
    clinicalSignificance: 'Classic primary anatomical site for Coxsackievirus A (Herpangina) vesicular eruption and ulceration. Spared in primary HSV gingivostomatitis.',
    associatedDisease: 'coxsackie'
  },
  {
    id: 'palatoglossal_pillar',
    name: 'Palatoglossal Arch & Palatine Tonsil',
    category: 'Palate & Fauces',
    pos: [-0.75, 0.48, -1.05],
    cameraTarget: [-0.65, 0.4, -1.1],
    cameraPos: [-0.5, 0.1, 3.2],
    epithelium: 'Non-Keratinized Stratified Squamous with Reticular Cryptic Epithelium',
    histology: 'Anterior faucial pillar formed by palatoglossus muscle. Houses lymphoid follicles of Waldeyer ring in the tonsillar fossa.',
    bloodSupply: 'Tonsillar branch of facial artery, ascending pharyngeal artery',
    innervation: 'Glossopharyngeal nerve (CN IX) & lesser palatine nerves',
    clinicalSignificance: 'Pillar margin is characteristic site for Coxsackievirus vesicles, deep CMV ulcers in immunosuppressed patients, and herpetic pharyngotonsillitis.',
    associatedDisease: 'coxsackie'
  },
  {
    id: 'tongue_dorsum',
    name: 'Dorsum of Tongue & Median Sulcus',
    category: 'Tongue & Floor',
    pos: [0, -0.06, 0.15],
    cameraTarget: [0, -0.1, 0.0],
    cameraPos: [0, 1.4, 3.6],
    epithelium: 'Specialized Mucosa: Keratinized Filiform & Non-keratinized Fungiform Papillae',
    histology: 'Interlacing bundles of intrinsic and extrinsic tongue musculature (genioglossus, hyoglossus) beneath a densely papillarized mucosa with gustatory taste buds.',
    bloodSupply: 'Dorsal lingual arteries (branches of lingual artery)',
    innervation: 'Lingual nerve (CN V3, general sensation), Chorda tympani (CN VII, taste), Hypoglossal (CN XII, motor)',
    clinicalSignificance: 'Sites of median rhomboid glossitis, geographic tongue, and mucosal candidiasis. Median sulcus serves as key symmetry landmark.',
  },
  {
    id: 'tongue_lateral',
    name: 'Lateral Tongue Border',
    category: 'Tongue & Floor',
    pos: [-0.82, -0.12, 0.22],
    cameraTarget: [-0.7, -0.12, 0.2],
    cameraPos: [-1.2, 0.6, 3.2],
    epithelium: 'Thin Non-Keratinized Stratified Squamous with Foliate Papillae Folds',
    histology: 'High-vascularity lateral submucosa abutting lingual neurovascular bundle. Features parallel vertical mucosal folds (foliate papillae).',
    bloodSupply: 'Deep lingual artery & sublingual artery',
    innervation: 'Lingual nerve (CN V3) & Glossopharyngeal nerve (CN IX at posterior third)',
    clinicalSignificance: 'Primary clinical predilection for Cytomegalovirus (CMV) solitary deep punched necrotic ulcers and Oral Hairy Leukoplakia (EBV).',
    associatedDisease: 'cmv'
  },
  {
    id: 'circumvallate_papillae',
    name: 'Circumvallate Papillae & Sulcus Terminalis',
    category: 'Tongue & Floor',
    pos: [0, 0.16, -0.75],
    cameraTarget: [0, 0.1, -0.8],
    cameraPos: [0, 1.1, 3.0],
    epithelium: 'Specialized Gustatory Stratified Squamous with Serous Glands of von Ebner',
    histology: '8 to 12 large dome-shaped papillae arranged in an inverted V-shape anterior to the foramen cecum; annular trenches bathed by serous saliva.',
    bloodSupply: 'Dorsal lingual arteries',
    innervation: 'Glossopharyngeal nerve (CN IX - both taste and general sensory)',
    clinicalSignificance: 'Anatomical boundary between anterior 2/3 (oral tongue) and posterior 1/3 (base of tongue / oropharynx). High viral tropism for EBV/HPV.',
  },
  {
    id: 'interdental_papilla',
    name: 'Interdental Papillae & Gingival Margin',
    category: 'Periodontium',
    pos: [0, -0.56, 0.86],
    cameraTarget: [0, -0.62, 0.84],
    cameraPos: [0, -0.35, 3.1],
    epithelium: 'Keratinized Oral Gingival Epithelium & Non-Keratinized Sulcular/Junctional Epithelium',
    histology: 'Pyramidal mucosal peak filling interproximal embrasure beneath contact area. Features dense collagen type I dentogingival fiber plexus.',
    bloodSupply: 'Interalveolar and supraperiosteal dental arterioles',
    innervation: 'Superior and inferior alveolar nerves (CN V2 / V3)',
    clinicalSignificance: 'Primary target in Necrotizing Ulcerative Gingivitis/Periodontitis (NUG/NUP): "Punched-out" necrotic inverted craters with grayish pseudomembranous slough.',
    associatedDisease: 'nug'
  },
  {
    id: 'attached_gingiva',
    name: 'Attached Gingiva & Mucogingival Junction',
    category: 'Periodontium',
    pos: [0.42, 0.88, 0.70],
    cameraTarget: [0.38, 0.82, 0.68],
    cameraPos: [0.3, 0.6, 3.2],
    epithelium: 'Orthokeratinized Stratified Squamous with Deep Rete Peg Stippling',
    histology: 'Firmly bound to underlying periosteum of alveolar bone by Sharpey fibers; orange-peel stippled appearance indicates healthy collagen tone.',
    bloodSupply: 'Supraperiosteal vessels from maxillary/mandibular alveolar network',
    innervation: 'Superior alveolar (anterior/middle/posterior) & mental/buccal nerves',
    clinicalSignificance: 'Characteristic location for Plasma Cell Stomatitis (PCS) and Desquamative Gingivitis: intense fiery-red velvety erythema with loss of stippling.',
    associatedDisease: 'pcs'
  },
  {
    id: 'tooth_enamel',
    name: 'Enamel Crown & Incisal Margin',
    category: 'Dentition',
    pos: [-0.14, -0.42, 0.92],
    cameraTarget: [-0.1, -0.46, 0.88],
    cameraPos: [-0.1, -0.25, 3.0],
    epithelium: 'Acellular Calcified Matrix (96% Hydroxyapatite Crystal Prisms)',
    histology: 'Hardest biological substance; organized into keyhole enamel rods/prisms with incremental lines of Retzius and perikymata micro-grooves.',
    bloodSupply: 'Avascular (nourished indirectly via vital pulp and dentinal tubule fluid)',
    innervation: 'Aneural (hydrodynamic fluid flow in dentin stimulates pulpal A-delta fibers)',
    clinicalSignificance: 'Protective casing of dentition. Enamel hypoplasia occurs during neonatal viral infections (e.g. congenital syphilis, maternal rubella, severe fever).',
  },
  {
    id: 'vermilion_border',
    name: 'Vermilion Border & Labial Mucosa',
    category: 'Mucosa & Lips',
    pos: [0.32, -0.65, 1.02],
    cameraTarget: [0.2, -0.62, 0.94],
    cameraPos: [0.2, -0.45, 3.2],
    epithelium: 'Thin Orthokeratinized with Eleidin / Non-keratinized inner labial mucosa',
    histology: 'Transition zone (vermilion) lacking sweat glands and hair follicles; high dermal papillae with capillary loops render classic vermilion red color.',
    bloodSupply: 'Superior and inferior labial arteries (branches of facial artery)',
    innervation: 'Infraorbital nerve (CN V2, upper lip) & Mental nerve (CN V3, lower lip)',
    clinicalSignificance: 'Hallmark target of Erythema Multiforme (EM) and SJS/TEN: hemorrhagic bloody crusted lips; also primary reactivation site for Herpes Labialis (HSV-1).',
    associatedDisease: 'em'
  },
  {
    id: 'sagittal_cross_section',
    name: 'Dental Cross-Section: Pulp, Dentin & Bone',
    category: 'Histology & Cross-Section',
    pos: [0.02, -0.30, 0.52],
    cameraTarget: [0.0, -0.32, 0.48],
    cameraPos: [1.8, -0.15, 3.4],
    epithelium: 'Multi-Tissue Cross-Section (Enamel, Dentin, Odontoblastic Zone, Pulp, PDL, Bone)',
    histology: 'Displays coronal enamel cap, dentinal tubules radiating from odontoblast layer, vascularized loose ectomesenchymal pulp core, periodontal ligament space, and trabecular alveolar bone.',
    bloodSupply: 'Dental branch of inferior/superior alveolar artery forming subodontoblastic capillary plexus of Raschkow',
    innervation: 'Myelinated A-beta & A-delta sensory fibers (sharp dentinal pain) and unmyelinated C-fibers (throbbing pulpal pain)',
    clinicalSignificance: 'Visualizes neuro-vascular latency pathways: HSV travels retrograde along sensory axons from the periphery to the trigeminal ganglion.',
  }
];

// ---------------------------------------------------------
// PROCEDURAL PBR TEXTURE GENERATION
// ---------------------------------------------------------
function createGingivaTextures() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Base Albedo: Coral pink with vascular gradients
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, '#e57283');
  grad.addColorStop(0.5, '#d35a6d');
  grad.addColorStop(1, '#c0495d');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Micro-capillary vascular branching network
  ctx.strokeStyle = '#a4283d';
  ctx.lineWidth = 1.2;
  ctx.globalAlpha = 0.35;
  for (let i = 0; i < 40; i++) {
    ctx.beginPath();
    let x = Math.random() * size;
    let y = Math.random() * size;
    ctx.moveTo(x, y);
    for (let step = 0; step < 6; step++) {
      x += (Math.random() - 0.5) * 35;
      y += (Math.random() - 0.5) * 35;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Orange-peel stippling (collagen fiber rete pegs)
  ctx.globalAlpha = 0.22;
  for (let i = 0; i < 3000; i++) {
    const px = Math.random() * size;
    const py = Math.random() * size;
    const radius = 0.8 + Math.random() * 1.6;
    ctx.fillStyle = Math.random() > 0.5 ? '#f59ca9' : '#942234';
    ctx.beginPath();
    ctx.arc(px, py, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const albedoTexture = new THREE.CanvasTexture(canvas);
  albedoTexture.wrapS = THREE.RepeatWrapping;
  albedoTexture.wrapT = THREE.RepeatWrapping;
  albedoTexture.repeat.set(4, 3);

  // Normal/Bump Map Canvas
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = 256;
  bumpCanvas.height = 256;
  const bCtx = bumpCanvas.getContext('2d')!;
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 2000; i++) {
    const bx = Math.random() * 256;
    const by = Math.random() * 256;
    bCtx.fillStyle = Math.random() > 0.5 ? '#b8b8b8' : '#484848';
    bCtx.beginPath();
    bCtx.arc(bx, by, 0.7 + Math.random() * 1.4, 0, Math.PI * 2);
    bCtx.fill();
  }
  const bumpTexture = new THREE.CanvasTexture(bumpCanvas);
  bumpTexture.wrapS = THREE.RepeatWrapping;
  bumpTexture.wrapT = THREE.RepeatWrapping;
  bumpTexture.repeat.set(4, 3);

  return { albedoTexture, bumpTexture };
}

function createTongueTextures() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Base mucosal crimson
  const grad = ctx.createRadialGradient(size / 2, size / 2, 40, size / 2, size / 2, size / 1.5);
  grad.addColorStop(0, '#c23c4d');
  grad.addColorStop(0.7, '#ab2b3c');
  grad.addColorStop(1, '#8f1c2d');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Median groove shading
  ctx.fillStyle = 'rgba(70, 10, 20, 0.4)';
  ctx.fillRect(size * 0.46, 0, size * 0.08, size);

  // Filiform papillae
  ctx.globalAlpha = 0.38;
  for (let i = 0; i < 4500; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 0.7 + Math.random() * 1.3;
    ctx.fillStyle = Math.random() > 0.3 ? '#e07d8a' : '#ff99a8';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Fungiform papillae (red vascular dots)
  ctx.globalAlpha = 0.65;
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 2.0 + Math.random() * 2.5;
    ctx.fillStyle = '#dc143c';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const albedoTexture = new THREE.CanvasTexture(canvas);
  albedoTexture.wrapS = THREE.RepeatWrapping;
  albedoTexture.wrapT = THREE.RepeatWrapping;
  albedoTexture.repeat.set(3, 3);

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = 256;
  bumpCanvas.height = 256;
  const bCtx = bumpCanvas.getContext('2d')!;
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 2500; i++) {
    const bx = Math.random() * 256;
    const by = Math.random() * 256;
    bCtx.fillStyle = Math.random() > 0.5 ? '#d0d0d0' : '#303030';
    bCtx.beginPath();
    bCtx.arc(bx, by, 0.8 + Math.random() * 1.4, 0, Math.PI * 2);
    bCtx.fill();
  }
  const bumpTexture = new THREE.CanvasTexture(bumpCanvas);
  bumpTexture.wrapS = THREE.RepeatWrapping;
  bumpTexture.wrapT = THREE.RepeatWrapping;
  bumpTexture.repeat.set(3, 3);

  return { albedoTexture, bumpTexture };
}

function createPalateTextures() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, size, 0, 0);
  grad.addColorStop(0, '#e58090'); // Hard palate anterior
  grad.addColorStop(0.5, '#c85062');
  grad.addColorStop(1, '#982536'); // Soft palate posterior
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Transverse palatine rugae ridges
  ctx.strokeStyle = '#f3a2b0';
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.globalAlpha = 0.55;
  for (let r = 0; r < 5; r++) {
    ctx.beginPath();
    const yBase = size * 0.55 + r * 38;
    ctx.moveTo(size * 0.15, yBase);
    ctx.bezierCurveTo(
      size * 0.35, yBase - 15,
      size * 0.65, yBase + 15,
      size * 0.85, yBase
    );
    ctx.stroke();
  }

  // Incisive papilla
  ctx.fillStyle = '#f5b0bc';
  ctx.beginPath();
  ctx.ellipse(size * 0.5, size * 0.9, 16, 24, 0, 0, Math.PI * 2);
  ctx.fill();

  const albedoTexture = new THREE.CanvasTexture(canvas);
  return { albedoTexture };
}

function createToothEnamelTextures() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 0, size);
  grad.addColorStop(0, '#f2ece0'); // Cervical junction
  grad.addColorStop(0.6, '#faf7f2'); // Mid-crown
  grad.addColorStop(1, '#eaf1f8'); // Incisal edge (blue-white translucency)
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Subtle perikymata lines
  ctx.strokeStyle = 'rgba(210, 200, 185, 0.22)';
  ctx.lineWidth = 1;
  for (let y = 10; y < size; y += 8) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }

  const albedoTexture = new THREE.CanvasTexture(canvas);
  return { albedoTexture };
}

function createCrossSectionTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1e080d';
  ctx.fillRect(0, 0, size, size);

  // Alveolar trabecular bone
  ctx.fillStyle = '#c4976a';
  ctx.fillRect(0, 0, size, size * 0.45);
  ctx.fillStyle = '#7a4a25';
  for (let i = 0; i < 350; i++) {
    const x = Math.random() * size;
    const y = Math.random() * (size * 0.45);
    const w = 4 + Math.random() * 8;
    const h = 3 + Math.random() * 6;
    ctx.beginPath();
    ctx.ellipse(x, y, w, h, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  // Periodontal Ligament
  ctx.fillStyle = '#d87080';
  ctx.fillRect(0, size * 0.45, size, 14);

  // Dentin layer
  ctx.fillStyle = '#e6c88f';
  ctx.fillRect(0, size * 0.47, size, size * 0.35);

  // Central pulp chamber & canal
  const pulpGrad = ctx.createLinearGradient(size * 0.35, 0, size * 0.65, 0);
  pulpGrad.addColorStop(0, '#a41628');
  pulpGrad.addColorStop(0.5, '#e02844');
  pulpGrad.addColorStop(1, '#a41628');
  ctx.fillStyle = pulpGrad;
  ctx.beginPath();
  ctx.moveTo(size * 0.4, size * 0.47);
  ctx.quadraticCurveTo(size * 0.3, size * 0.65, size * 0.42, size * 0.82);
  ctx.lineTo(size * 0.58, size * 0.82);
  ctx.quadraticCurveTo(size * 0.7, size * 0.65, size * 0.6, size * 0.47);
  ctx.closePath();
  ctx.fill();

  // Neurovascular threads
  ctx.strokeStyle = '#ffeb3b';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(size * 0.48, size * 0.82);
  ctx.bezierCurveTo(size * 0.46, size * 0.7, size * 0.52, size * 0.6, size * 0.49, size * 0.5);
  ctx.stroke();

  ctx.strokeStyle = '#2196f3';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(size * 0.45, size * 0.82);
  ctx.bezierCurveTo(size * 0.43, size * 0.7, size * 0.48, size * 0.6, size * 0.45, size * 0.5);
  ctx.stroke();

  // Enamel cap
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, size * 0.82, size, size * 0.18);

  const crossTexture = new THREE.CanvasTexture(canvas);
  return { crossTexture };
}

// ---------------------------------------------------------
// ANATOMICAL TOOTH GEOMETRY GENERATOR
// Smooth, anatomically sculpted crowns with bevels and cusps
// ---------------------------------------------------------
function createAnatomicalToothGeometry(type: 'central' | 'lateral' | 'canine' | 'premolar' | 'molar') {
  let geo: THREE.BufferGeometry;

  if (type === 'central') {
    geo = new THREE.CylinderGeometry(0.12, 0.08, 0.36, 24, 6);
    geo.scale(1.3, 1.0, 0.7);
  } else if (type === 'lateral') {
    geo = new THREE.CylinderGeometry(0.10, 0.07, 0.33, 24, 6);
    geo.scale(1.15, 1.0, 0.75);
  } else if (type === 'canine') {
    geo = new THREE.ConeGeometry(0.14, 0.40, 24, 6);
    geo.scale(1.0, 1.0, 0.9);
  } else if (type === 'premolar') {
    geo = new THREE.CylinderGeometry(0.13, 0.10, 0.28, 24, 6);
    geo.scale(1.0, 1.0, 1.2);
  } else {
    // Molar: Quadricuspid crown with broad occlusal table
    geo = new THREE.BoxGeometry(0.28, 0.26, 0.30, 8, 6, 8);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);
      if (y < 0) {
        x *= 0.88;
        z *= 0.88;
      }
      if (y > 0.1) {
        const distFromCenter = Math.hypot(x, z);
        y -= distFromCenter * 0.12;
      }
      pos.setXYZ(i, x, y, z);
    }
  }

  geo.computeVertexNormals();
  return geo;
}

export const OralCavity3D: React.FC<OralCavity3DProps> = ({
  selectedDisease = null,
  onSelectDisease,
  showComparison = false,
  comparisonDisease = 'em',
  severityLevel = 60,
  isInteractive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Groups
  const mouthGroupRef = useRef<THREE.Group | null>(null);
  const upperArchGroupRef = useRef<THREE.Group | null>(null);
  const lowerArchGroupRef = useRef<THREE.Group | null>(null);
  const tongueGroupRef = useRef<THREE.Group | null>(null);
  const palateGroupRef = useRef<THREE.Group | null>(null);
  const crossSectionGroupRef = useRef<THREE.Group | null>(null);
  const annotationsGroupRef = useRef<THREE.Group | null>(null);
  const lesionsGroupRef = useRef<THREE.Group | null>(null);
  const lipsGroupRef = useRef<THREE.Group | null>(null);

  // Materials
  const materialsRef = useRef<{
    toothMat?: THREE.MeshPhysicalMaterial;
    gingivaMat?: THREE.MeshPhysicalMaterial;
    tongueMat?: THREE.MeshPhysicalMaterial;
    palateMat?: THREE.MeshPhysicalMaterial;
    mucosaMat?: THREE.MeshPhysicalMaterial;
    crossSectionMat?: THREE.MeshPhysicalMaterial;
  }>({});

  // UI State
  const [activeLayer, setActiveLayer] = useState<AnatomicalLayerType>('all');
  const [showCrossSection, setShowCrossSection] = useState<boolean>(false);
  const [showAnnotations, setShowAnnotations] = useState<boolean>(true);
  const [salivaWetness, setSalivaWetness] = useState<number>(85);
  const [activeCameraView, setActiveCameraView] = useState<'default' | 'palate' | 'tongue' | 'gingiva' | 'fauces' | 'crossSection'>('default');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [selectedStructure, setSelectedStructure] = useState<AnatomicalStructureData | null>(null);
  const [hoveredStructureId, setHoveredStructureId] = useState<string | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);

  const [layerVisibility, setLayerVisibility] = useState({
    upperArch: true,
    lowerArch: true,
    tongue: true,
    palate: true,
    lips: true,
    lesions: true,
  });

  // Interaction refs
  const isDraggingRef = useRef(false);
  const dragStartPosRef = useRef({ x: 0, y: 0 });
  const hasDraggedRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const mouthRotationRef = useRef({ x: 0.15, y: -0.25 });
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseCoordsRef = useRef(new THREE.Vector2());

  // ---------------------------------------------------------
  // INITIALIZE THREE.JS SCENE
  // ---------------------------------------------------------
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x060911); // Clean clinical dark navy

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.45, 5.2);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Operatory Lighting
    const ambientLight = new THREE.AmbientLight(0xfff5ee, 0.95);
    scene.add(ambientLight);

    const dentalKeyLight = new THREE.DirectionalLight(0xfffaea, 2.4);
    dentalKeyLight.position.set(3, 5, 5);
    dentalKeyLight.castShadow = true;
    dentalKeyLight.shadow.mapSize.width = 2048;
    dentalKeyLight.shadow.mapSize.height = 2048;
    dentalKeyLight.shadow.bias = -0.0001;
    scene.add(dentalKeyLight);

    const intraoralProbeLight = new THREE.PointLight(0x67e8f9, 2.0, 8, 1.2);
    intraoralProbeLight.position.set(0, 0.2, 2.5);
    scene.add(intraoralProbeLight);

    const tissueFillLight = new THREE.PointLight(0xf43f5e, 1.2, 6, 1.5);
    tissueFillLight.position.set(0, -0.6, 1.0);
    scene.add(tissueFillLight);

    const rimLight = new THREE.DirectionalLight(0x818cf8, 1.1);
    rimLight.position.set(-4, -1, -3);
    scene.add(rimLight);

    // 5. High-Res Procedural PBR Textures
    const { albedoTexture: gingivaAlbedo, bumpTexture: gingivaBump } = createGingivaTextures();
    const { albedoTexture: tongueAlbedo, bumpTexture: tongueBump } = createTongueTextures();
    const { albedoTexture: palateAlbedo } = createPalateTextures();
    const { albedoTexture: toothAlbedo } = createToothEnamelTextures();
    const { crossTexture } = createCrossSectionTexture();

    // 6. MeshPhysicalMaterials
    const wetness = 0.85;
    const toothMat = new THREE.MeshPhysicalMaterial({
      map: toothAlbedo,
      color: 0xffffff,
      roughness: 0.16,
      metalness: 0.04,
      clearcoat: 0.95 * wetness,
      clearcoatRoughness: 0.06,
      reflectivity: 0.85,
      ior: 1.62,
    });

    const gingivaMat = new THREE.MeshPhysicalMaterial({
      map: gingivaAlbedo,
      bumpMap: gingivaBump,
      bumpScale: 0.04,
      color: 0xffffff,
      roughness: 0.38 - (wetness * 0.1),
      metalness: 0.02,
      clearcoat: 0.75 * wetness,
      clearcoatRoughness: 0.12,
      ior: 1.34,
    });

    const tongueMat = new THREE.MeshPhysicalMaterial({
      map: tongueAlbedo,
      bumpMap: tongueBump,
      bumpScale: 0.06,
      color: 0xffffff,
      roughness: 0.42 - (wetness * 0.12),
      metalness: 0.01,
      clearcoat: 0.70 * wetness,
      clearcoatRoughness: 0.14,
      ior: 1.34,
    });

    const palateMat = new THREE.MeshPhysicalMaterial({
      map: palateAlbedo,
      color: 0xffffff,
      roughness: 0.34,
      metalness: 0.02,
      clearcoat: 0.82 * wetness,
      clearcoatRoughness: 0.09,
      ior: 1.34,
    });

    const pharynxMat = new THREE.MeshStandardMaterial({
      color: 0x4a121e,
      roughness: 0.7,
      metalness: 0.0,
      side: THREE.BackSide,
    });

    const lipMat = new THREE.MeshPhysicalMaterial({
      color: 0xaf394a,
      roughness: 0.36,
      metalness: 0.03,
      clearcoat: 0.80 * wetness,
      clearcoatRoughness: 0.1,
    });

    const crossSectionMat = new THREE.MeshPhysicalMaterial({
      map: crossTexture,
      roughness: 0.35,
      metalness: 0.05,
      clearcoat: 0.5,
    });

    materialsRef.current = {
      toothMat,
      gingivaMat,
      tongueMat,
      palateMat,
      mucosaMat: lipMat,
      crossSectionMat,
    };

    // 7. Root Model Assembly
    const mouthGroup = new THREE.Group();
    mouthGroup.name = 'mouthGroup';
    mouthGroupRef.current = mouthGroup;
    scene.add(mouthGroup);

    // Deep Cavity Dome
    const cavityGeo = new THREE.SphereGeometry(2.4, 48, 36, 0, Math.PI * 2, 0, Math.PI * 0.78);
    const cavityMesh = new THREE.Mesh(cavityGeo, pharynxMat);
    cavityMesh.position.set(0, 0, -0.6);
    mouthGroup.add(cavityMesh);

    // Sub-groups
    const upperArchGroup = new THREE.Group();
    upperArchGroupRef.current = upperArchGroup;
    mouthGroup.add(upperArchGroup);

    const lowerArchGroup = new THREE.Group();
    lowerArchGroupRef.current = lowerArchGroup;
    mouthGroup.add(lowerArchGroup);

    const tongueGroup = new THREE.Group();
    tongueGroupRef.current = tongueGroup;
    mouthGroup.add(tongueGroup);

    const palateGroup = new THREE.Group();
    palateGroupRef.current = palateGroup;
    mouthGroup.add(palateGroup);

    const crossSectionGroup = new THREE.Group();
    crossSectionGroupRef.current = crossSectionGroup;
    crossSectionGroup.visible = false;
    mouthGroup.add(crossSectionGroup);

    const lipsGroup = new THREE.Group();
    lipsGroupRef.current = lipsGroup;
    mouthGroup.add(lipsGroup);

    const lesionsGroup = new THREE.Group();
    lesionsGroupRef.current = lesionsGroup;
    mouthGroup.add(lesionsGroup);

    const annotationsGroup = new THREE.Group();
    annotationsGroupRef.current = annotationsGroup;
    mouthGroup.add(annotationsGroup);

    // 8. Dental Arches & Gingiva
    const buildAnatomicalDentalArch = (isUpper: boolean) => {
      const arch = new THREE.Group();
      const yBase = isUpper ? 0.95 : -0.72;
      const teethTypes: ('central' | 'lateral' | 'canine' | 'premolar' | 'molar')[] = [
        'central', 'lateral', 'canine', 'premolar', 'premolar', 'molar', 'molar'
      ];
      const numTeethPerSide = teethTypes.length;

      // Gingival Arch Base with Scalloped Margin
      const gingivaCurve = new THREE.EllipseCurve(0, 0, 1.48, 1.62, 0, Math.PI, false, 0);
      const points = gingivaCurve.getPoints(48);
      const gingivaShape = new THREE.Shape(points);
      const extrudeSettings = {
        depth: 0.38,
        bevelEnabled: true,
        bevelSegments: 6,
        steps: 2,
        bevelSize: 0.12,
        bevelThickness: 0.12,
      };
      const gingivaGeo = new THREE.ExtrudeGeometry(gingivaShape, extrudeSettings);
      const gingivaMesh = new THREE.Mesh(gingivaGeo, gingivaMat);
      gingivaMesh.rotation.x = Math.PI * 0.5;
      gingivaMesh.position.set(0, isUpper ? yBase - 0.08 : yBase + 0.08, 0.48);
      gingivaMesh.castShadow = true;
      gingivaMesh.receiveShadow = true;
      arch.add(gingivaMesh);

      // Scalloped Interdental Papillae Peaks
      for (let i = -numTeethPerSide + 1; i <= numTeethPerSide - 1; i++) {
        const t = (i + numTeethPerSide) / (numTeethPerSide * 2);
        const angle = Math.PI * 0.14 + t * Math.PI * 0.72;
        const rx = 1.44;
        const rz = 1.56;
        const px = Math.cos(angle) * rx;
        const pz = Math.sin(angle) * rz - 0.68;
        const py = isUpper ? yBase - 0.18 : yBase + 0.18;

        const papillaGeo = new THREE.ConeGeometry(0.065, 0.16, 16);
        const papillaMesh = new THREE.Mesh(papillaGeo, gingivaMat);
        papillaMesh.position.set(px, py, pz);
        papillaMesh.rotation.x = isUpper ? 0 : Math.PI;
        papillaMesh.rotation.z = (Math.PI * 0.5 - angle) * 0.4;
        arch.add(papillaMesh);
      }

      // Teeth placement
      for (let side = -1; side <= 1; side += 2) {
        for (let idx = 0; idx < numTeethPerSide; idx++) {
          const toothType = teethTypes[idx];
          const toothGeo = createAnatomicalToothGeometry(toothType);
          const toothMesh = new THREE.Mesh(toothGeo, toothMat);

          const totalIndex = side === -1 ? -(idx + 1) : (idx + 1);
          const t = (totalIndex + numTeethPerSide + 0.5) / (numTeethPerSide * 2 + 1);
          const angle = Math.PI * 0.15 + t * Math.PI * 0.70;
          const radiusX = 1.38;
          const radiusZ = 1.52;
          const tx = Math.cos(angle) * radiusX;
          const tz = Math.sin(angle) * radiusZ - 0.70;

          toothMesh.position.set(tx, yBase, tz);
          toothMesh.lookAt(new THREE.Vector3(0, yBase, -0.4));
          toothMesh.rotation.y += Math.PI * 0.5;
          if (!isUpper) {
            toothMesh.rotation.z += Math.PI;
          }
          toothMesh.castShadow = true;
          toothMesh.receiveShadow = true;
          arch.add(toothMesh);
        }
      }

      return arch;
    };

    upperArchGroup.add(buildAnatomicalDentalArch(true));
    lowerArchGroup.add(buildAnatomicalDentalArch(false));

    // 9. Hard & Soft Palate, Uvula, Fauces
    const palateGeo = new THREE.CylinderGeometry(1.42, 1.74, 0.32, 48, 4, false, Math.PI * 0.14, Math.PI * 0.72);
    const palateMesh = new THREE.Mesh(palateGeo, palateMat);
    palateMesh.position.set(0, 0.98, -0.22);
    palateMesh.rotation.x = 0.22;
    palateMesh.receiveShadow = true;
    palateGroup.add(palateMesh);

    const softPalateGeo = new THREE.BoxGeometry(1.7, 0.16, 0.85, 32, 4, 16);
    const softPalateMesh = new THREE.Mesh(softPalateGeo, palateMat);
    softPalateMesh.position.set(0, 0.88, -0.78);
    softPalateMesh.rotation.x = -0.38;
    palateGroup.add(softPalateMesh);

    const uvulaGeo = new THREE.ConeGeometry(0.12, 0.52, 24);
    const uvulaMesh = new THREE.Mesh(uvulaGeo, palateMat);
    uvulaMesh.position.set(0, 0.62, -1.16);
    uvulaMesh.rotation.x = Math.PI;
    uvulaMesh.castShadow = true;
    palateGroup.add(uvulaMesh);

    const pillarGeo = new THREE.TorusGeometry(0.72, 0.095, 20, 36, Math.PI * 0.85);
    const leftPillar = new THREE.Mesh(pillarGeo, palateMat);
    leftPillar.position.set(-0.76, 0.54, -1.08);
    leftPillar.rotation.y = 0.38;
    palateGroup.add(leftPillar);

    const rightPillar = new THREE.Mesh(pillarGeo, palateMat);
    rightPillar.position.set(0.76, 0.54, -1.08);
    rightPillar.rotation.y = -0.38;
    palateGroup.add(rightPillar);

    const tonsilGeo = new THREE.SphereGeometry(0.18, 20, 20);
    tonsilGeo.scale(1.0, 1.6, 0.8);
    const tonsilMat = new THREE.MeshPhysicalMaterial({
      color: 0xbd3a4c,
      roughness: 0.55,
      clearcoat: 0.65,
    });
    const leftTonsil = new THREE.Mesh(tonsilGeo, tonsilMat);
    leftTonsil.position.set(-0.84, 0.44, -1.18);
    palateGroup.add(leftTonsil);

    const rightTonsil = new THREE.Mesh(tonsilGeo, tonsilMat);
    rightTonsil.position.set(0.84, 0.44, -1.18);
    palateGroup.add(rightTonsil);

    // 10. Smooth Subdivided Tongue
    const tongueGeo = new THREE.BoxGeometry(1.68, 0.52, 2.35, 48, 12, 48);
    const tPos = tongueGeo.attributes.position;
    for (let i = 0; i < tPos.count; i++) {
      const x = tPos.getX(i);
      const z = tPos.getZ(i);
      let y = tPos.getY(i);

      if (y > 0) {
        const normX = x / 0.84;
        const normZ = (z + 0.3) / 1.15;
        const domeHeight = Math.cos(normX * Math.PI * 0.5) * 0.24;
        y += Math.max(0, domeHeight) * (1.0 - Math.abs(normZ) * 0.15);

        if (Math.abs(x) < 0.22) {
          y -= Math.cos((x / 0.22) * Math.PI * 0.5) * 0.085;
        }

        if (z > 0.7) {
          y -= (z - 0.7) * 0.22;
        }
      }
      tPos.setY(i, y);
    }
    tongueGeo.computeVertexNormals();

    const tongueMesh = new THREE.Mesh(tongueGeo, tongueMat);
    tongueMesh.position.set(0, -0.16, -0.26);
    tongueMesh.castShadow = true;
    tongueMesh.receiveShadow = true;
    tongueGroup.add(tongueMesh);

    const circumvallateGeo = new THREE.SphereGeometry(0.045, 16, 16);
    circumvallateGeo.scale(1.2, 0.6, 1.2);
    const circumvallateMat = new THREE.MeshPhysicalMaterial({
      color: 0x9e2436,
      roughness: 0.4,
      clearcoat: 0.7,
    });
    for (let cp = -4; cp <= 4; cp++) {
      const cMesh = new THREE.Mesh(circumvallateGeo, circumvallateMat);
      const cx = cp * 0.14;
      const cz = -0.72 - Math.abs(cp) * 0.08;
      cMesh.position.set(cx, 0.12, cz);
      tongueGroup.add(cMesh);
    }

    const frenulumGeo = new THREE.CylinderGeometry(0.02, 0.04, 0.45, 16);
    const frenulumMesh = new THREE.Mesh(frenulumGeo, gingivaMat);
    frenulumMesh.position.set(0, -0.42, 0.45);
    frenulumMesh.rotation.x = 0.45;
    tongueGroup.add(frenulumMesh);

    // 11. Vermilion Border of Lips
    const lipUpperGeo = new THREE.TorusGeometry(1.68, 0.19, 24, 48, Math.PI * 0.72);
    const upperLip = new THREE.Mesh(lipUpperGeo, lipMat);
    upperLip.position.set(0, 0.88, 0.88);
    upperLip.rotation.x = 0.28;
    upperLip.castShadow = true;
    lipsGroup.add(upperLip);

    const lipLowerGeo = new THREE.TorusGeometry(1.68, 0.21, 24, 48, Math.PI * 0.72);
    const lowerLip = new THREE.Mesh(lipLowerGeo, lipMat);
    lowerLip.position.set(0, -0.68, 0.88);
    lowerLip.rotation.x = -0.28;
    lowerLip.castShadow = true;
    lipsGroup.add(lowerLip);

    // 12. Sagittal Cross-Section Cutaway Plane
    const crossPlaneGeo = new THREE.PlaneGeometry(3.6, 2.4, 32, 32);
    const crossPlaneMesh = new THREE.Mesh(crossPlaneGeo, crossSectionMat);
    crossPlaneMesh.position.set(0.02, 0.1, -0.1);
    crossPlaneMesh.rotation.y = Math.PI * 0.5;
    crossSectionGroup.add(crossPlaneMesh);

    const cutToothPulpGeo = new THREE.CylinderGeometry(0.08, 0.02, 0.65, 16);
    const cutToothPulpMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const cutToothPulp = new THREE.Mesh(cutToothPulpGeo, cutToothPulpMat);
    cutToothPulp.position.set(0.03, -0.45, 0.55);
    crossSectionGroup.add(cutToothPulp);

    // 13. Floating Anatomical Pins
    ANATOMICAL_STRUCTURES.forEach((struct) => {
      const pinGroup = new THREE.Group();
      pinGroup.position.set(struct.pos[0], struct.pos[1], struct.pos[2]);
      pinGroup.userData = { structureId: struct.id, data: struct };

      const orbGeo = new THREE.SphereGeometry(0.065, 20, 20);
      const orbMat = new THREE.MeshBasicMaterial({
        color: struct.associatedDisease ? 0x38bdf8 : 0x2dd4bf,
      });
      const orbMesh = new THREE.Mesh(orbGeo, orbMat);
      pinGroup.add(orbMesh);

      const ringGeo = new THREE.RingGeometry(0.09, 0.14, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: struct.associatedDisease ? 0x0284c7 : 0x0d9488,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.65,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.lookAt(new THREE.Vector3(0, 0, 5));
      pinGroup.add(ringMesh);

      const stemGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.12, 8);
      const stemMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8 });
      const stemMesh = new THREE.Mesh(stemGeo, stemMat);
      stemMesh.position.y = -0.09;
      pinGroup.add(stemMesh);

      annotationsGroup.add(pinGroup);
    });

    // 14. Render Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (autoRotate && !isDraggingRef.current) {
        mouthRotationRef.current.y = -0.25 + Math.sin(elapsedTime * 0.35) * 0.22;
        mouthRotationRef.current.x = 0.14 + Math.cos(elapsedTime * 0.28) * 0.08;
      }

      mouthGroup.rotation.y = mouthRotationRef.current.y;
      mouthGroup.rotation.x = mouthRotationRef.current.x;

      annotationsGroup.children.forEach((pin, idx) => {
        const ring = pin.children[1] as THREE.Mesh;
        if (ring) {
          const s = 1.0 + Math.sin(elapsedTime * 2.8 + idx * 0.7) * 0.22;
          ring.scale.set(s, s, s);
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  // ---------------------------------------------------------
  // UPDATE REALISTIC LESION PATHOLOGY MESHES
  // ---------------------------------------------------------
  useEffect(() => {
    if (!lesionsGroupRef.current || !sceneRef.current) return;
    const lesionsGroup = lesionsGroupRef.current;
    while (lesionsGroup.children.length > 0) {
      const obj = lesionsGroup.children[0];
      lesionsGroup.remove(obj);
    }

    if (!selectedDisease || !layerVisibility.lesions) return;
    const scale = (severityLevel / 100) * 1.25;

    if (selectedDisease === 'cmv') {
      const leukoGeo = new THREE.PlaneGeometry(0.85 * scale, 0.48 * scale, 16, 16);
      const leukoMat = new THREE.MeshPhysicalMaterial({
        color: 0xf8fafc,
        roughness: 0.85,
        clearcoat: 0.3,
      });
      const leukoMesh = new THREE.Mesh(leukoGeo, leukoMat);
      leukoMesh.position.set(-0.84, 0.02, 0.22);
      leukoMesh.rotation.set(0, -Math.PI * 0.48, 0.12);
      lesionsGroup.add(leukoMesh);

      const ulcerGeo = new THREE.CylinderGeometry(0.19 * scale, 0.12 * scale, 0.16 * scale, 24);
      const ulcerMat = new THREE.MeshPhysicalMaterial({
        color: 0x5a0b17,
        roughness: 0.25,
        clearcoat: 0.9,
      });
      const ulcerMesh = new THREE.Mesh(ulcerGeo, ulcerMat);
      ulcerMesh.position.set(-0.86, 0.02, 0.22);
      ulcerMesh.rotation.set(0, 0, Math.PI * 0.5);
      lesionsGroup.add(ulcerMesh);
    } else if (selectedDisease === 'coxsackie') {
      const numVesicles = Math.floor(10 + (severityLevel / 100) * 14);
      for (let i = 0; i < numVesicles; i++) {
        const isVesicle = i % 2 === 0;
        const vGeo = new THREE.SphereGeometry(isVesicle ? 0.052 : 0.075, 16, 16);
        const vMat = new THREE.MeshPhysicalMaterial({
          color: isVesicle ? 0xfef08a : 0xbe123c,
          roughness: 0.15,
          clearcoat: 0.95,
          transmission: isVesicle ? 0.35 : 0.0,
        });
        const vMesh = new THREE.Mesh(vGeo, vMat);
        const side = i % 2 === 0 ? -1 : 1;
        const xOffset = side * (0.36 + (i * 0.038));
        vMesh.position.set(xOffset, 0.68 - (i * 0.022), -0.92 - (i * 0.018));
        lesionsGroup.add(vMesh);
      }
    } else if (selectedDisease === 'nug') {
      for (let i = -3; i <= 3; i++) {
        const craterGeo = new THREE.ConeGeometry(0.095 * scale, 0.18 * scale, 16);
        const craterMat = new THREE.MeshPhysicalMaterial({
          color: 0x64748b,
          roughness: 0.75,
          clearcoat: 0.5,
        });
        const crater = new THREE.Mesh(craterGeo, craterMat);
        crater.position.set(i * 0.19, -0.58, 0.88);
        crater.rotation.x = Math.PI;
        lesionsGroup.add(crater);

        const rimGeo = new THREE.TorusGeometry(0.088 * scale, 0.025, 12, 20);
        const rimMat = new THREE.MeshPhysicalMaterial({
          color: 0x991b1b,
          roughness: 0.2,
          clearcoat: 0.9,
        });
        const rim = new THREE.Mesh(rimGeo, rimMat);
        rim.position.set(i * 0.19, -0.58, 0.89);
        lesionsGroup.add(rim);
      }
    } else if (selectedDisease === 'em') {
      const crustMat = new THREE.MeshPhysicalMaterial({
        color: 0x3b0713,
        roughness: 0.85,
        clearcoat: 0.35,
      });
      for (let i = 0; i < 20; i++) {
        const cGeo = new THREE.DodecahedronGeometry(0.075 * scale, 1);
        const cMesh = new THREE.Mesh(cGeo, crustMat);
        const angle = (i / 20) * Math.PI * 0.72 + Math.PI * 0.14;
        const tx = Math.cos(angle) * 1.68;
        const tz = Math.sin(angle) * 1.25 - 0.2;
        cMesh.position.set(tx, -0.66 + (Math.sin(i * 1.5) * 0.09), tz + 0.92);
        lesionsGroup.add(cMesh);
      }
    } else if (selectedDisease === 'sjs-ten') {
      const necroMat = new THREE.MeshPhysicalMaterial({
        color: 0x581c87,
        roughness: 0.65,
        clearcoat: 0.45,
      });
      const sloughGeo = new THREE.TorusGeometry(1.70, 0.28 * scale, 20, 48, Math.PI * 0.72);
      const sloughUpper = new THREE.Mesh(sloughGeo, necroMat);
      sloughUpper.position.set(0, 0.88, 0.89);
      sloughUpper.rotation.x = 0.28;
      lesionsGroup.add(sloughUpper);

      const sloughLower = new THREE.Mesh(sloughGeo, necroMat);
      sloughLower.position.set(0, -0.68, 0.89);
      sloughLower.rotation.x = -0.28;
      lesionsGroup.add(sloughLower);
    } else if (selectedDisease === 'pcs') {
      const pcsBandGeo = new THREE.TorusGeometry(1.42, 0.16 * scale, 16, 36, Math.PI * 0.64);
      const pcsBandMat = new THREE.MeshPhysicalMaterial({
        color: 0xdc2626,
        roughness: 0.2,
        clearcoat: 0.9,
      });
      const bandUpper = new THREE.Mesh(pcsBandGeo, pcsBandMat);
      bandUpper.position.set(0, 0.88, 0.64);
      bandUpper.rotation.x = 0.22;
      lesionsGroup.add(bandUpper);

      const bandLower = new THREE.Mesh(pcsBandGeo, pcsBandMat);
      bandLower.position.set(0, -0.62, 0.64);
      bandLower.rotation.x = -0.22;
      lesionsGroup.add(bandLower);
    }
  }, [selectedDisease, severityLevel, layerVisibility.lesions]);

  // ---------------------------------------------------------
  // SALIVA SPECULAR / WETNESS ADJUSTMENT
  // ---------------------------------------------------------
  useEffect(() => {
    const mats = materialsRef.current;
    const factor = salivaWetness / 100;

    if (mats.toothMat) {
      mats.toothMat.clearcoat = 0.95 * factor;
      mats.toothMat.roughness = 0.14 + (1 - factor) * 0.2;
      mats.toothMat.needsUpdate = true;
    }
    if (mats.gingivaMat) {
      mats.gingivaMat.clearcoat = 0.75 * factor;
      mats.gingivaMat.roughness = 0.32 + (1 - factor) * 0.25;
      mats.gingivaMat.needsUpdate = true;
    }
    if (mats.tongueMat) {
      mats.tongueMat.clearcoat = 0.70 * factor;
      mats.tongueMat.roughness = 0.36 + (1 - factor) * 0.24;
      mats.tongueMat.needsUpdate = true;
    }
    if (mats.palateMat) {
      mats.palateMat.clearcoat = 0.82 * factor;
      mats.palateMat.roughness = 0.30 + (1 - factor) * 0.22;
      mats.palateMat.needsUpdate = true;
    }
    if (mats.mucosaMat) {
      mats.mucosaMat.clearcoat = 0.80 * factor;
      mats.mucosaMat.roughness = 0.32 + (1 - factor) * 0.2;
      mats.mucosaMat.needsUpdate = true;
    }
  }, [salivaWetness]);

  // ---------------------------------------------------------
  // LAYER VISIBILITY
  // ---------------------------------------------------------
  useEffect(() => {
    if (upperArchGroupRef.current) {
      upperArchGroupRef.current.visible = 
        activeLayer === 'all' || activeLayer === 'dentition' 
          ? layerVisibility.upperArch 
          : false;
    }
    if (lowerArchGroupRef.current) {
      lowerArchGroupRef.current.visible = 
        activeLayer === 'all' || activeLayer === 'dentition' 
          ? layerVisibility.lowerArch 
          : false;
    }
    if (tongueGroupRef.current) {
      tongueGroupRef.current.visible = 
        activeLayer === 'all' || activeLayer === 'tongue' 
          ? layerVisibility.tongue 
          : false;
    }
    if (palateGroupRef.current) {
      palateGroupRef.current.visible = 
        activeLayer === 'all' || activeLayer === 'palate' 
          ? layerVisibility.palate 
          : false;
    }
    if (lipsGroupRef.current) {
      lipsGroupRef.current.visible = 
        activeLayer === 'all' 
          ? layerVisibility.lips 
          : false;
    }
    if (crossSectionGroupRef.current) {
      crossSectionGroupRef.current.visible = 
        activeLayer === 'crossSection' || showCrossSection;
    }
    if (annotationsGroupRef.current) {
      annotationsGroupRef.current.visible = showAnnotations;
    }
  }, [activeLayer, showCrossSection, showAnnotations, layerVisibility]);

  // ---------------------------------------------------------
  // CAMERA PRESETS
  // ---------------------------------------------------------
  const setCameraPreset = (preset: 'default' | 'palate' | 'tongue' | 'gingiva' | 'fauces' | 'crossSection') => {
    setActiveCameraView(preset);
    setAutoRotate(false);
    if (!cameraRef.current) return;

    if (preset === 'default') {
      cameraRef.current.position.set(0, 0.45, 5.2);
      mouthRotationRef.current = { x: 0.14, y: -0.22 };
    } else if (preset === 'palate') {
      cameraRef.current.position.set(0, -0.25, 4.0);
      mouthRotationRef.current = { x: -0.50, y: 0.0 };
    } else if (preset === 'tongue') {
      cameraRef.current.position.set(0, 1.4, 3.8);
      mouthRotationRef.current = { x: 0.52, y: 0.15 };
    } else if (preset === 'gingiva') {
      cameraRef.current.position.set(0, -0.35, 3.3);
      mouthRotationRef.current = { x: 0.10, y: 0.0 };
    } else if (preset === 'fauces') {
      cameraRef.current.position.set(0, 0.1, 3.2);
      mouthRotationRef.current = { x: -0.15, y: -0.45 };
    } else if (preset === 'crossSection') {
      setShowCrossSection(true);
      setActiveLayer('crossSection');
      cameraRef.current.position.set(1.9, -0.1, 3.5);
      mouthRotationRef.current = { x: 0.05, y: -Math.PI * 0.42 };
    }
  };

  const focusOnStructure = (struct: AnatomicalStructureData) => {
    setSelectedStructure(struct);
    setIsInspectorOpen(true);
    setAutoRotate(false);
    if (!cameraRef.current) return;
    cameraRef.current.position.set(struct.cameraPos[0], struct.cameraPos[1], struct.cameraPos[2]);
    mouthRotationRef.current = { x: 0.12, y: -0.15 };
  };

  // ---------------------------------------------------------
  // MOUSE & TOUCH EVENT HANDLERS
  // ---------------------------------------------------------
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isInteractive) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    dragStartPosRef.current = { x: e.clientX, y: e.clientY };
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    setAutoRotate(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseCoordsRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseCoordsRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    if (cameraRef.current && annotationsGroupRef.current && showAnnotations) {
      raycasterRef.current.setFromCamera(mouseCoordsRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(annotationsGroupRef.current.children, true);
      if (intersects.length > 0) {
        let root = intersects[0].object;
        while (root.parent && root.parent !== annotationsGroupRef.current) {
          root = root.parent as THREE.Mesh;
        }
        if (root.userData && root.userData.structureId) {
          setHoveredStructureId(root.userData.structureId);
        }
      } else {
        setHoveredStructureId(null);
      }
    }

    if (!isDraggingRef.current || !isInteractive) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    if (Math.hypot(e.clientX - dragStartPosRef.current.x, e.clientY - dragStartPosRef.current.y) > 4) {
      hasDraggedRef.current = true;
    }

    mouthRotationRef.current.y += deltaX * 0.0075;
    mouthRotationRef.current.x = Math.max(-0.85, Math.min(0.85, mouthRotationRef.current.x + deltaY * 0.0075));
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (hasDraggedRef.current || !containerRef.current || !cameraRef.current || !annotationsGroupRef.current) {
      return;
    }
    const rect = containerRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    raycasterRef.current.setFromCamera(mouse, cameraRef.current);
    const intersects = raycasterRef.current.intersectObjects(annotationsGroupRef.current.children, true);

    if (intersects.length > 0) {
      let root = intersects[0].object;
      while (root.parent && root.parent !== annotationsGroupRef.current) {
        root = root.parent as THREE.Mesh;
      }
      if (root.userData && root.userData.data) {
        const struct = root.userData.data as AnatomicalStructureData;
        setSelectedStructure(struct);
        setIsInspectorOpen(true);
        if (struct.associatedDisease && onSelectDisease) {
          onSelectDisease(struct.associatedDisease);
        }
      }
    }
  };

  const handleZoom = (delta: number) => {
    if (!cameraRef.current) return;
    cameraRef.current.position.z = Math.max(2.4, Math.min(8.5, cameraRef.current.position.z + delta));
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    handleZoom(e.deltaY * 0.0035);
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* ---------------- Top Clinical HUD Toolbar ---------------- */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Title Tag */}
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center gap-2.5 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse shadow-sm shadow-teal-400/50" />
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-100 tracking-tight">3D Oral Cavity Anatomical Hub</span>
              <span className="text-slate-600">·</span>
              <span className="text-teal-400 font-medium">PBR Medical Model</span>
            </div>
          </div>
        </div>

        {/* Camera Preset Toolbar */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-800 shadow-lg text-xs">
          <button
            onClick={() => setCameraPreset('default')}
            className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
              activeCameraView === 'default'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Full
          </button>
          <button
            onClick={() => setCameraPreset('palate')}
            className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
              activeCameraView === 'palate'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Palate
          </button>
          <button
            onClick={() => setCameraPreset('tongue')}
            className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
              activeCameraView === 'tongue'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Tongue
          </button>
          <button
            onClick={() => setCameraPreset('gingiva')}
            className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
              activeCameraView === 'gingiva'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Gingiva
          </button>
          <button
            onClick={() => setCameraPreset('fauces')}
            className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
              activeCameraView === 'fauces'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Fauces
          </button>
          <button
            onClick={() => setCameraPreset('crossSection')}
            className={`px-2.5 py-1 rounded-lg transition-colors font-medium flex items-center gap-1 ${
              activeCameraView === 'crossSection'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-amber-400 hover:text-amber-300 hover:bg-slate-800/60'
            }`}
          >
            <Split className="w-3.5 h-3.5" />
            <span>Cross-Section</span>
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          <button
            onClick={() => handleZoom(-0.6)}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleZoom(0.6)}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setAutoRotate(false);
              setCameraPreset('default');
            }}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
            title="Reset Orientation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ---------------- Left Interactive Layer Deck ---------------- */}
      <div className="absolute top-16 left-3 z-20 flex flex-col gap-2 pointer-events-none max-w-[210px]">
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 shadow-xl space-y-2 text-xs">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 px-1">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-teal-400" />
              <span>Anatomical Layers</span>
            </span>
          </div>

          <div className="grid grid-cols-1 gap-1">
            <button
              onClick={() => setActiveLayer('all')}
              className={`px-2 py-1 text-left rounded-lg transition-colors flex items-center justify-between ${
                activeLayer === 'all'
                  ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span>All Cavity Structures</span>
              {activeLayer === 'all' && <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />}
            </button>
            <button
              onClick={() => setActiveLayer('dentition')}
              className={`px-2 py-1 text-left rounded-lg transition-colors flex items-center justify-between ${
                activeLayer === 'dentition'
                  ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span>Dentition & Gingiva</span>
              {activeLayer === 'dentition' && <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />}
            </button>
            <button
              onClick={() => setActiveLayer('tongue')}
              className={`px-2 py-1 text-left rounded-lg transition-colors flex items-center justify-between ${
                activeLayer === 'tongue'
                  ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span>Tongue & Floor</span>
              {activeLayer === 'tongue' && <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />}
            </button>
            <button
              onClick={() => setActiveLayer('palate')}
              className={`px-2 py-1 text-left rounded-lg transition-colors flex items-center justify-between ${
                activeLayer === 'palate'
                  ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span>Palate & Fauces</span>
              {activeLayer === 'palate' && <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />}
            </button>
            <button
              onClick={() => setActiveLayer('crossSection')}
              className={`px-2 py-1 text-left rounded-lg transition-colors flex items-center justify-between ${
                activeLayer === 'crossSection'
                  ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span>Sagittal Cross-Section</span>
              {activeLayer === 'crossSection' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
            </button>
          </div>

          {/* Quick Visibility Checkboxes */}
          <div className="pt-2 border-t border-slate-800 space-y-1.5 text-[11px] text-slate-400">
            <label className="flex items-center gap-2 cursor-pointer hover:text-white">
              <input
                type="checkbox"
                checked={showAnnotations}
                onChange={(e) => setShowAnnotations(e.target.checked)}
                className="rounded border-slate-700 text-teal-500 focus:ring-0"
              />
              <span>3D Anatomical Pins</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:text-white">
              <input
                type="checkbox"
                checked={showCrossSection}
                onChange={(e) => setShowCrossSection(e.target.checked)}
                className="rounded border-slate-700 text-amber-500 focus:ring-0"
              />
              <span>Show Internal Histology</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:text-white">
              <input
                type="checkbox"
                checked={layerVisibility.lesions}
                onChange={(e) => setLayerVisibility({ ...layerVisibility, lesions: e.target.checked })}
                className="rounded border-slate-700 text-rose-500 focus:ring-0"
              />
              <span>Active Lesion Overlay</span>
            </label>
          </div>

          {/* Saliva Wetness / Specular Sheen Slider */}
          <div className="pt-2 border-t border-slate-800 space-y-1 text-[11px]">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1">
                <Droplet className="w-3 h-3 text-cyan-400" />
                <span>Saliva Sheen</span>
              </span>
              <span className="font-mono text-cyan-300">{salivaWetness}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={salivaWetness}
              onChange={(e) => setSalivaWetness(Number(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <span>Dry (Xerostomia)</span>
              <span>Glossy Hydrated</span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- 3D Canvas Mount ---------------- */}
      <div
        ref={containerRef}
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="w-full h-full min-h-[460px] cursor-grab active:cursor-grabbing select-none"
      />

      {/* Hover tooltip for 3D Pin */}
      {hoveredStructureId && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30">
          <div className="bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-teal-500/50 text-xs text-white shadow-2xl flex items-center gap-2 animate-in fade-in zoom-in-95 duration-150">
            <Sparkles className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span className="font-bold">
              {ANATOMICAL_STRUCTURES.find(s => s.id === hoveredStructureId)?.name}
            </span>
            <span className="text-[10px] text-teal-400 font-mono">Click to inspect</span>
          </div>
        </div>
      )}

      {/* ---------------- Right Educational Inspector Drawer ---------------- */}
      {isInspectorOpen && selectedStructure && (
        <div className="absolute top-3 right-3 bottom-14 z-30 w-84 sm:w-96 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right-4 duration-200">
          <div>
            <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-teal-400 font-mono">
                  {selectedStructure.category}
                </span>
                <h4 className="text-sm font-bold text-white tracking-tight mt-0.5">
                  {selectedStructure.name}
                </h4>
              </div>
              <button
                onClick={() => setIsInspectorOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 space-y-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold font-mono block">Epithelial Lining</span>
                <p className="text-slate-200 mt-0.5 font-medium">{selectedStructure.epithelium}</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold font-mono block">Microscopic Histology</span>
                <p className="text-slate-300 mt-0.5 leading-relaxed">{selectedStructure.histology}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold font-mono block">Blood Supply</span>
                  <p className="text-slate-300 text-[11px] mt-0.5">{selectedStructure.bloodSupply}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold font-mono block">Innervation</span>
                  <p className="text-slate-300 text-[11px] mt-0.5">{selectedStructure.innervation}</p>
                </div>
              </div>

              <div className="bg-teal-950/30 border border-teal-500/30 p-2.5 rounded-xl">
                <span className="text-[10px] text-teal-400 uppercase font-semibold font-mono flex items-center gap-1">
                  <Info className="w-3 h-3 text-teal-400" />
                  <span>Clinical Virology & Pathology</span>
                </span>
                <p className="text-slate-300 text-[11px] mt-1 leading-relaxed">
                  {selectedStructure.clinicalSignificance}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
            <button
              onClick={() => focusOnStructure(selectedStructure)}
              className="flex-1 py-1.5 px-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Center Camera On Site</span>
            </button>
            {selectedStructure.associatedDisease && onSelectDisease && (
              <button
                onClick={() => onSelectDisease(selectedStructure.associatedDisease!)}
                className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-xl transition-colors border border-slate-700"
              >
                View Pathology
              </button>
            )}
          </div>
        </div>
      )}

      {/* ---------------- Bottom Disease Hotspot Ribbon ---------------- */}
      <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 bg-slate-900/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-xl">
          <span className="text-[11px] text-slate-400 uppercase font-semibold px-2 font-mono">
            Clinical Lesions:
          </span>
          {(Object.keys(DISEASES_DATA) as DiseaseId[]).map((dId) => {
            const disease = DISEASES_DATA[dId];
            const isSelected = selectedDisease === dId;
            return (
              <button
                key={dId}
                onClick={() => onSelectDisease?.(dId)}
                style={{
                  borderColor: isSelected ? disease.color : 'transparent',
                  backgroundColor: isSelected ? `${disease.color}25` : 'transparent',
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: disease.color }} />
                <span>{disease.shortTitle}</span>
              </button>
            );
          })}
        </div>

        {selectedDisease && (
          <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300 shadow-xl flex items-center gap-2">
            <span className="text-slate-400">Active Lesion:</span>
            <span className="font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: DISEASES_DATA[selectedDisease].color }} />
              {DISEASES_DATA[selectedDisease].title}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
