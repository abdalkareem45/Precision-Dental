import * as THREE from 'three';

/**
 * Procedural PBR Texture Generator & Anatomical Geometry Engine for Human Teeth & Periodontium
 * Features:
 * - Human Enamel: Perikymata micro-striations, Hunter-Schreger bands, incisal opalescent halo, cervical dentin warm show-through, hydroxyapatite IOR (1.63), saliva clearcoat.
 * - Human Cementum: Fibrous Sharpey's fibers insertion grooves, longitudinal cemental lamellae, warm ochre root tinting.
 * - Anatomical Gingiva: Stippled "orange-peel" attached gingiva micropores, capillary vascular blushing, knife-edge marginal collar, inflamed erythematous state.
 * - Alveolar Bone: Trabecular osteon architecture, cortical plate microporosity, crestal lamina dura.
 * - Plaque & Calculus: Supragingival biofilm and mineralized nodular calculus.
 * - Realistic Sculpted Tooth Meshes: Central Incisor (#11, #31), Premolars (#14, #15), Maxillary Molar (#16, #26 with 4 cusps, Carabelli & Oblique Ridge, 3 diverging roots), Mandibular Molar (#46, #36 with 5 cusps & 2 roots with furcation vault).
 */

// Cached procedural PBR textures to optimize memory & performance
let cachedEnamelColorMap: THREE.CanvasTexture | null = null;
let cachedEnamelNormalMap: THREE.CanvasTexture | null = null;
let cachedEnamelRoughnessMap: THREE.CanvasTexture | null = null;

let cachedCementumColorMap: THREE.CanvasTexture | null = null;
let cachedCementumNormalMap: THREE.CanvasTexture | null = null;
let cachedCementumRoughnessMap: THREE.CanvasTexture | null = null;

let cachedGingivaHealthyMap: THREE.CanvasTexture | null = null;
let cachedGingivaInflamedMap: THREE.CanvasTexture | null = null;
let cachedGingivaNormalMap: THREE.CanvasTexture | null = null;

let cachedBoneColorMap: THREE.CanvasTexture | null = null;
let cachedBoneNormalMap: THREE.CanvasTexture | null = null;

let cachedPlaqueColorMap: THREE.CanvasTexture | null = null;
let cachedPlaqueNormalMap: THREE.CanvasTexture | null = null;

// ==========================================
// 1. PROCEDURAL PBR TEXTURE GENERATORS
// ==========================================

export const getEnamelTextures = () => {
  if (cachedEnamelColorMap && cachedEnamelNormalMap && cachedEnamelRoughnessMap) {
    return {
      colorMap: cachedEnamelColorMap,
      normalMap: cachedEnamelNormalMap,
      roughnessMap: cachedEnamelRoughnessMap
    };
  }

  // 1. Enamel Color Map (512x512)
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Multi-stop vertical gradient reflecting human tooth chromatic progression:
  // Cervical third: Warm yellow-amber dentin show-through where enamel is thin (~0.5mm)
  // Middle third: Creamy pearlescent ivory body enamel
  // Incisal third: Natural opalescent translucent bluish-white halo
  const grad = ctx.createLinearGradient(0, 512, 0, 0);
  grad.addColorStop(0.0, '#e5c478'); // Cervical CEJ margin (warm amber dentin)
  grad.addColorStop(0.18, '#f4e2b0'); // Cervical third
  grad.addColorStop(0.45, '#faf5e8'); // Mid-crown body enamel
  grad.addColorStop(0.78, '#ffffff'); // Upper body enamel
  grad.addColorStop(0.92, '#f0f5fa'); // Incisal edge transition
  grad.addColorStop(1.0, '#dce7f2'); // Incisal translucent edge with bluish opalescence
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Micro-perikymata lines (Pickerill growth lines on human enamel surface)
  ctx.fillStyle = 'rgba(195, 175, 140, 0.09)';
  for (let y = 80; y < 490; y += 4) {
    ctx.fillRect(0, y, 512, 1.4);
  }

  // Subtle developmental lobe highlights (Mesial, Central, Distal lobes)
  const lobeGrad = ctx.createLinearGradient(0, 0, 512, 0);
  lobeGrad.addColorStop(0.0, 'rgba(255,255,255,0.0)');
  lobeGrad.addColorStop(0.2, 'rgba(255,255,255,0.14)');
  lobeGrad.addColorStop(0.35, 'rgba(230,220,195,0.06)');
  lobeGrad.addColorStop(0.5, 'rgba(255,255,255,0.16)');
  lobeGrad.addColorStop(0.65, 'rgba(230,220,195,0.06)');
  lobeGrad.addColorStop(0.8, 'rgba(255,255,255,0.14)');
  lobeGrad.addColorStop(1.0, 'rgba(255,255,255,0.0)');
  ctx.fillStyle = lobeGrad;
  ctx.fillRect(0, 0, 512, 512);

  // Subtle natural enamel craze/micro-crack lines (infinitesimal craquelure)
  ctx.strokeStyle = 'rgba(175, 150, 110, 0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(180, 20);
  ctx.lineTo(185, 340);
  ctx.moveTo(340, 60);
  ctx.lineTo(336, 400);
  ctx.stroke();

  cachedEnamelColorMap = new THREE.CanvasTexture(canvas);
  cachedEnamelColorMap.colorSpace = THREE.SRGBColorSpace;
  cachedEnamelColorMap.wrapS = THREE.RepeatWrapping;
  cachedEnamelColorMap.wrapT = THREE.RepeatWrapping;

  // 2. Enamel Normal Map (Perikymata micro-surface displacement)
  const normCanvas = document.createElement('canvas');
  normCanvas.width = 256;
  normCanvas.height = 256;
  const nctx = normCanvas.getContext('2d')!;
  nctx.fillStyle = '#8080ff'; // Flat normal vector (0, 0, 1)
  nctx.fillRect(0, 0, 256, 256);

  // Micro horizontal ripples for perikymata waves
  for (let y = 0; y < 256; y += 4) {
    const intensity = Math.sin((y / 256) * Math.PI * 36) * 14;
    nctx.fillStyle = `rgb(${128 + intensity}, ${128}, 255)`;
    nctx.fillRect(0, y, 256, 2);
  }
  cachedEnamelNormalMap = new THREE.CanvasTexture(normCanvas);
  cachedEnamelNormalMap.wrapS = THREE.RepeatWrapping;
  cachedEnamelNormalMap.wrapT = THREE.RepeatWrapping;

  // 3. Enamel Roughness Map
  const rCanvas = document.createElement('canvas');
  rCanvas.width = 256;
  rCanvas.height = 256;
  const rctx = rCanvas.getContext('2d')!;
  const rgrad = rctx.createLinearGradient(0, 256, 0, 0);
  rgrad.addColorStop(0.0, '#424242'); // Slightly rougher near CEJ cervical margin
  rgrad.addColorStop(0.4, '#1e1e1e'); // Ultra-smooth saliva-polished mid-crown
  rgrad.addColorStop(0.85, '#181818');
  rgrad.addColorStop(1.0, '#262626'); // Incisal edge contact facet
  rctx.fillStyle = rgrad;
  rctx.fillRect(0, 0, 256, 256);

  cachedEnamelRoughnessMap = new THREE.CanvasTexture(rCanvas);
  cachedEnamelRoughnessMap.wrapS = THREE.RepeatWrapping;
  cachedEnamelRoughnessMap.wrapT = THREE.RepeatWrapping;

  return {
    colorMap: cachedEnamelColorMap,
    normalMap: cachedEnamelNormalMap,
    roughnessMap: cachedEnamelRoughnessMap
  };
};

export const getCementumTextures = () => {
  if (cachedCementumColorMap && cachedCementumNormalMap && cachedCementumRoughnessMap) {
    return {
      colorMap: cachedCementumColorMap,
      normalMap: cachedCementumNormalMap,
      roughnessMap: cachedCementumRoughnessMap
    };
  }

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Anatomical cementum root gradient: Neck to Apex
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0.0, '#d8b97d'); // CEJ neck transition
  grad.addColorStop(0.35, '#c59f5a'); // Mid-root
  grad.addColorStop(0.75, '#b08a42'); // Apical third
  grad.addColorStop(1.0, '#8f6828'); // Apical foramen zone
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 512);

  // Longitudinal fibrous striations (Sharpey's fibers insertion grooves in cementum)
  ctx.fillStyle = 'rgba(105, 78, 35, 0.16)';
  for (let x = 0; x < 256; x += 3) {
    if (Math.random() > 0.35) {
      ctx.fillRect(x, 0, 1.6, 512);
    }
  }

  // Micro root fluting shadows
  const flutingGrad = ctx.createLinearGradient(0, 0, 256, 0);
  flutingGrad.addColorStop(0.0, 'rgba(0,0,0,0.12)');
  flutingGrad.addColorStop(0.5, 'rgba(255,255,255,0.08)');
  flutingGrad.addColorStop(1.0, 'rgba(0,0,0,0.12)');
  ctx.fillStyle = flutingGrad;
  ctx.fillRect(0, 0, 256, 512);

  cachedCementumColorMap = new THREE.CanvasTexture(canvas);
  cachedCementumColorMap.colorSpace = THREE.SRGBColorSpace;

  // Cementum Normal Map with longitudinal fibrous grooves
  const normCanvas = document.createElement('canvas');
  normCanvas.width = 256;
  normCanvas.height = 256;
  const nctx = normCanvas.getContext('2d')!;
  nctx.fillStyle = '#8080ff';
  nctx.fillRect(0, 0, 256, 256);
  for (let x = 0; x < 256; x += 4) {
    const val = 128 + Math.sin(x * 0.45) * 18;
    nctx.fillStyle = `rgb(${val}, 128, 255)`;
    nctx.fillRect(x, 0, 2, 256);
  }
  cachedCementumNormalMap = new THREE.CanvasTexture(normCanvas);

  // Cementum Roughness Map
  const rCanvas = document.createElement('canvas');
  rCanvas.width = 256;
  rCanvas.height = 256;
  const rctx = rCanvas.getContext('2d')!;
  rctx.fillStyle = '#9e9e9e'; // 0.62 - 0.70 matte fibrous finish
  rctx.fillRect(0, 0, 256, 256);
  cachedCementumRoughnessMap = new THREE.CanvasTexture(rCanvas);

  return {
    colorMap: cachedCementumColorMap,
    normalMap: cachedCementumNormalMap,
    roughnessMap: cachedCementumRoughnessMap
  };
};

export const getGingivaTextures = (isInflamed: boolean = false) => {
  if (isInflamed && cachedGingivaInflamedMap && cachedGingivaNormalMap) {
    return { colorMap: cachedGingivaInflamedMap, normalMap: cachedGingivaNormalMap };
  }
  if (!isInflamed && cachedGingivaHealthyMap && cachedGingivaNormalMap) {
    return { colorMap: cachedGingivaHealthyMap, normalMap: cachedGingivaNormalMap };
  }

  // 1. Healthy Gingiva: Coral pink with genuine stippling ("orange peel" micropores)
  const hCanvas = document.createElement('canvas');
  hCanvas.width = 256;
  hCanvas.height = 256;
  const hctx = hCanvas.getContext('2d')!;
  const hgrad = hctx.createLinearGradient(0, 0, 0, 256);
  hgrad.addColorStop(0.0, '#f9a8d4'); // Pale pink marginal collar
  hgrad.addColorStop(0.4, '#f472b6'); // Attached gingiva
  hgrad.addColorStop(1.0, '#e11d48'); // Alveolar mucosa (deep red, non-keratinized)
  hctx.fillStyle = hgrad;
  hctx.fillRect(0, 0, 256, 256);

  // Stippled micropores
  hctx.fillStyle = 'rgba(219, 39, 119, 0.22)';
  for (let i = 0; i < 700; i++) {
    const px = Math.random() * 256;
    const py = 60 + Math.random() * 140; // Dense in attached gingiva zone
    hctx.beginPath();
    hctx.arc(px, py, 1.2, 0, Math.PI * 2);
    hctx.fill();
  }
  cachedGingivaHealthyMap = new THREE.CanvasTexture(hCanvas);
  cachedGingivaHealthyMap.colorSpace = THREE.SRGBColorSpace;
  cachedGingivaHealthyMap.wrapS = THREE.RepeatWrapping;
  cachedGingivaHealthyMap.wrapT = THREE.RepeatWrapping;

  // 2. Inflamed Gingiva: Edematous fiery crimson, loss of stippling, engorged capillaries
  const iCanvas = document.createElement('canvas');
  iCanvas.width = 256;
  iCanvas.height = 256;
  const ictx = iCanvas.getContext('2d')!;
  ictx.fillStyle = '#be123c';
  ictx.fillRect(0, 0, 256, 256);
  ictx.fillStyle = 'rgba(244, 63, 94, 0.45)';
  for (let i = 0; i < 500; i++) {
    ictx.beginPath();
    ictx.arc(Math.random() * 256, Math.random() * 256, 2.8, 0, Math.PI * 2);
    ictx.fill();
  }
  cachedGingivaInflamedMap = new THREE.CanvasTexture(iCanvas);
  cachedGingivaInflamedMap.colorSpace = THREE.SRGBColorSpace;

  // 3. Stippling Normal Map
  const nCanvas = document.createElement('canvas');
  nCanvas.width = 256;
  nCanvas.height = 256;
  const nctx = nCanvas.getContext('2d')!;
  nctx.fillStyle = '#8080ff';
  nctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 600; i++) {
    const px = Math.random() * 256;
    const py = Math.random() * 256;
    nctx.fillStyle = 'rgb(142, 118, 240)';
    nctx.beginPath();
    nctx.arc(px, py, 1.6, 0, Math.PI * 2);
    nctx.fill();
  }
  cachedGingivaNormalMap = new THREE.CanvasTexture(nCanvas);
  cachedGingivaNormalMap.wrapS = THREE.RepeatWrapping;
  cachedGingivaNormalMap.wrapT = THREE.RepeatWrapping;

  return {
    colorMap: isInflamed ? cachedGingivaInflamedMap : cachedGingivaHealthyMap,
    normalMap: cachedGingivaNormalMap
  };
};

export const getBoneTextures = () => {
  if (cachedBoneColorMap && cachedBoneNormalMap) {
    return { colorMap: cachedBoneColorMap, normalMap: cachedBoneNormalMap };
  }

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#eee6d3';
  ctx.fillRect(0, 0, 256, 256);

  // Trabecular osteon microporosity
  ctx.fillStyle = 'rgba(168, 148, 116, 0.25)';
  for (let i = 0; i < 900; i++) {
    const px = Math.random() * 256;
    const py = Math.random() * 256;
    ctx.beginPath();
    ctx.arc(px, py, Math.random() * 1.8 + 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  cachedBoneColorMap = new THREE.CanvasTexture(canvas);
  cachedBoneColorMap.colorSpace = THREE.SRGBColorSpace;

  const nCanvas = document.createElement('canvas');
  nCanvas.width = 256;
  nCanvas.height = 256;
  const nctx = nCanvas.getContext('2d')!;
  nctx.fillStyle = '#8080ff';
  nctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 500; i++) {
    const px = Math.random() * 256;
    const py = Math.random() * 256;
    nctx.fillStyle = 'rgb(120, 120, 245)';
    nctx.beginPath();
    nctx.arc(px, py, 1.5, 0, Math.PI * 2);
    nctx.fill();
  }
  cachedBoneNormalMap = new THREE.CanvasTexture(nCanvas);

  return { colorMap: cachedBoneColorMap, normalMap: cachedBoneNormalMap };
};

export const getPlaqueTextures = () => {
  if (cachedPlaqueColorMap && cachedPlaqueNormalMap) {
    return { colorMap: cachedPlaqueColorMap, normalMap: cachedPlaqueNormalMap };
  }

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#fef08a'; // Soft yellowish-white biofilm
  ctx.fillRect(0, 0, 256, 256);

  // Micro-granular bacterial colonies
  ctx.fillStyle = 'rgba(202, 138, 4, 0.35)';
  for (let i = 0; i < 500; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * 256, Math.random() * 256, Math.random() * 3 + 1, 0, Math.PI * 2);
    ctx.fill();
  }
  cachedPlaqueColorMap = new THREE.CanvasTexture(canvas);
  cachedPlaqueColorMap.colorSpace = THREE.SRGBColorSpace;

  const nCanvas = document.createElement('canvas');
  nCanvas.width = 256;
  nCanvas.height = 256;
  const nctx = nCanvas.getContext('2d')!;
  nctx.fillStyle = '#8080ff';
  nctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 400; i++) {
    nctx.fillStyle = 'rgb(135, 120, 245)';
    nctx.beginPath();
    nctx.arc(Math.random() * 256, Math.random() * 256, 2, 0, Math.PI * 2);
    nctx.fill();
  }
  cachedPlaqueNormalMap = new THREE.CanvasTexture(nCanvas);

  return { colorMap: cachedPlaqueColorMap, normalMap: cachedPlaqueNormalMap };
};

// ==========================================
// 2. HIGH-FIDELITY PBR MATERIALS FACTORY
// ==========================================

export const createDentalMaterials = (layerMode: string = 'all', isInflamed: boolean = false) => {
  const isXray = layerMode === 'xray';
  const enamelTex = getEnamelTextures();
  const cementumTex = getCementumTextures();
  const gingivaTex = getGingivaTextures(isInflamed);
  const boneTex = getBoneTextures();
  const plaqueTex = getPlaqueTextures();

  // 1. Human Enamel: MeshPhysicalMaterial with genuine optical translucency, hydroxyapatite IOR 1.63, salivary clearcoat
  const enamel = new THREE.MeshPhysicalMaterial({
    map: enamelTex.colorMap,
    normalMap: enamelTex.normalMap,
    normalScale: new THREE.Vector2(0.28, 0.28),
    roughnessMap: enamelTex.roughnessMap,
    roughness: 0.16,
    metalness: 0.02,
    transmission: 0.30, // Real enamel optical transmission
    thickness: 1.25,
    ior: 1.63, // Hydroxyapatite index of refraction
    clearcoat: 0.88, // Salivary pellicle glossy glaze
    clearcoatRoughness: 0.09,
    sheen: 0.35,
    sheenColor: new THREE.Color(0xfffdf5),
    attenuationColor: new THREE.Color(0xf6e8ca),
    attenuationDistance: 1.1,
    wireframe: isXray
  });

  // 2. Human Dentin: Warm creamy amber-gold inner core
  const dentin = new THREE.MeshStandardMaterial({
    color: 0xf3d078,
    roughness: 0.45,
    metalness: 0.02,
    wireframe: isXray
  });

  // 3. Human Cementum: Fibrous root coating with Sharpey's fibers insertion normal map
  const cementum = new THREE.MeshStandardMaterial({
    map: cementumTex.colorMap,
    normalMap: cementumTex.normalMap,
    normalScale: new THREE.Vector2(0.45, 0.45),
    roughnessMap: cementumTex.roughnessMap,
    roughness: 0.65,
    metalness: 0.03,
    wireframe: isXray
  });

  // 4. Pulp Tissue: Vascular reddish neurovascular bundle
  const pulp = new THREE.MeshStandardMaterial({
    color: 0xdc2626,
    roughness: 0.25,
    emissive: 0x991b1b,
    emissiveIntensity: 0.55
  });

  // 5. Gingiva: Stippled attached and marginal gingiva
  const gingiva = new THREE.MeshStandardMaterial({
    map: gingivaTex.colorMap,
    normalMap: gingivaTex.normalMap,
    normalScale: new THREE.Vector2(0.4, 0.4),
    roughness: isInflamed ? 0.35 : 0.65,
    metalness: 0.02,
    transparent: layerMode === 'translucent_gingiva' || layerMode === 'bone_pdl_only' || isXray,
    opacity: layerMode === 'bone_pdl_only' ? 0.0 : layerMode === 'translucent_gingiva' ? 0.32 : isXray ? 0.15 : 0.98,
    wireframe: isXray
  });

  // 6. Periodontal Ligament (PDL): Vascular collagenous anchoring membrane
  const pdl = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.6,
    transparent: true,
    opacity: layerMode === 'bone_pdl_only' ? 0.85 : 0.55
  });

  // 7. Alveolar Bone: Cortical plate & trabecular osteon architecture
  const bone = new THREE.MeshStandardMaterial({
    map: boneTex.colorMap,
    normalMap: boneTex.normalMap,
    normalScale: new THREE.Vector2(0.35, 0.35),
    roughness: 0.78,
    metalness: 0.03,
    wireframe: isXray,
    transparent: isXray,
    opacity: isXray ? 0.25 : 1.0
  });

  // 8. Dental Plaque Biofilm
  const plaque = new THREE.MeshStandardMaterial({
    map: plaqueTex.colorMap,
    normalMap: plaqueTex.normalMap,
    roughness: 0.8,
    emissive: 0x854d0e,
    emissiveIntensity: 0.25
  });

  return { enamel, dentin, cementum, pulp, gingiva, pdl, bone, plaque };
};

// ==========================================
// 3. ANATOMICALLY CORRECT TOOTH GEOMETRIES
// ==========================================

/**
 * 1. HUMAN CENTRAL INCISOR (#11 Maxillary / #31 Mandibular)
 * Anatomically authentic sculpted human tooth:
 * - Labial surface: Convex cervical 1/3, flatter middle/incisal 2/3, with 3 distinct developmental lobes and 2 shallow developmental depressions.
 * - Palatal/Lingual surface: Prominent smooth Cingulum, triangular Lingual Fossa bounded by Mesial and Distal Marginal Ridges!
 * - Incisal edge: Sharp 90° mesio-incisal angle, rounded disto-incisal angle, slight lingual slope.
 * - CEJ: Realistic scalloped curvature (peaks coronally on interproximal sides, dips apically on facial/lingual).
 * - Root: Single conical root tapering with distal apical curvature and shallow mesial developmental depression.
 */
export const createHumanIncisor = (options: {
  isMaxillary?: boolean;
  layerMode?: string;
  isCut?: boolean;
} = {}) => {
  const toothGroup = new THREE.Group();
  const { isMaxillary = true, isCut = false, layerMode = 'all' } = options;
  const mats = createDentalMaterials(layerMode);

  const crownHeight = isMaxillary ? 2.25 : 1.95;
  const crownRadialSegments = 36;
  const crownHeightSegments = 24;

  // Sculpted Crown Mesh
  const crownGeo = new THREE.CylinderGeometry(0.92, 0.70, crownHeight, crownRadialSegments, crownHeightSegments, false);
  const pos = crownGeo.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    // Height ratio h: 0 at CEJ neck, 1 at incisal edge
    const h = (y + crownHeight / 2) / crownHeight;

    // 1. Chisel flattening labio-lingually (thinning toward incisal edge)
    let newZ = z * (1.0 - h * 0.62);

    // 2. Palatal / Lingual features (z < 0):
    if (z < 0) {
      if (h < 0.32) {
        // Prominent cervical Cingulum bulge
        newZ *= 1.25;
      } else {
        // Lingual Fossa concavity between mesial & distal marginal ridges
        const distFromCenter = Math.abs(x);
        if (distFromCenter < 0.55) {
          newZ *= 0.68; // Fossa concavity
        } else {
          newZ *= 1.05; // Marginal ridges
        }
      }
    } else {
      // 3. Labial features (z > 0): 3 developmental lobes
      const lobeWave = Math.cos(x * 4.2) * 0.04;
      newZ = (newZ + lobeWave) * (h < 0.3 ? 1.15 : 1.04);
    }

    // 4. Mesio-distal flare toward incisal edge
    let newX = x * (0.82 + h * 0.38);

    // 5. Incisal angles: Sharp 90° mesio-incisal angle (x < -0.5), distinctly rounded disto-incisal angle (x > 0.5)
    if (newX > 0.52 && h > 0.78) {
      newX -= 0.16 * (h - 0.78);
      newZ *= 0.92;
    }

    // 6. Realistic CEJ Scalloping: CEJ rises coronally on mesial and distal sides
    let adjustedY = y;
    if (h < 0.25) {
      const proxPeak = Math.sin(Math.abs(x) * Math.PI) * 0.22;
      adjustedY += proxPeak * (1 - h / 0.25);
    }

    pos.setXYZ(i, newX, adjustedY, newZ);
  }
  crownGeo.computeVertexNormals();

  const crownMesh = new THREE.Mesh(crownGeo, mats.enamel);
  crownMesh.position.y = crownHeight / 2;
  crownMesh.castShadow = true;
  crownMesh.receiveShadow = true;
  crownMesh.userData = { part: 'crown', type: 'incisor' };
  toothGroup.add(crownMesh);

  // Smooth Incisal Edge Bevel
  const edgeWidth = isMaxillary ? 1.72 : 1.35;
  const edgeGeo = new THREE.BoxGeometry(edgeWidth, 0.08, 0.32, 12, 2, 4);
  const ePos = edgeGeo.attributes.position;
  for (let i = 0; i < ePos.count; i++) {
    const ex = ePos.getX(i);
    const ey = ePos.getY(i);
    const ez = ePos.getZ(i);
    // Round the distal corner
    let nEx = ex;
    if (ex > 0.55) nEx -= 0.12;
    ePos.setXYZ(i, nEx, ey, ez);
  }
  edgeGeo.computeVertexNormals();
  const edgeMesh = new THREE.Mesh(edgeGeo, mats.enamel);
  edgeMesh.position.y = crownHeight;
  toothGroup.add(edgeMesh);

  // CEJ Hard Tissue Reference (Green ring)
  const cejRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.74, 0.028, 12, 32),
    new THREE.MeshBasicMaterial({ color: 0x22c55e })
  );
  cejRing.rotation.x = Math.PI / 2;
  cejRing.position.y = 0.02;
  toothGroup.add(cejRing);

  // --- ROOT GEOMETRY ---
  const rootLength = isMaxillary ? 3.4 : 3.0;
  const rootGeo = new THREE.CylinderGeometry(0.70, 0.14, rootLength, 24, 16);
  const rpos = rootGeo.attributes.position;

  for (let i = 0; i < rpos.count; i++) {
    const rx = rpos.getX(i);
    const ry = rpos.getY(i);
    const rz = rpos.getZ(i);

    const t = (-ry + rootLength / 2) / rootLength; // 0 at neck, 1 at apex
    const distalCurve = t * t * 0.28; // Subtle distal apical curvature
    const triangularX = rx * (1.0 - t * 0.16);
    const roundedZ = rz * (1.0 - t * 0.24);

    // Mesial root longitudinal groove
    let mesialMod = 1.0;
    if (rx < -0.2 && t > 0.2 && t < 0.8) {
      mesialMod = 0.88;
    }

    rpos.setXYZ(i, (triangularX * mesialMod) + distalCurve, ry, roundedZ);
  }
  rootGeo.computeVertexNormals();

  const rootMesh = new THREE.Mesh(rootGeo, mats.cementum);
  rootMesh.position.y = -rootLength / 2;
  rootMesh.castShadow = true;
  rootMesh.userData = { part: 'root' };
  toothGroup.add(rootMesh);

  // Smooth rounded root apex
  const apex = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 12), mats.cementum);
  apex.position.set(0.28, -rootLength, 0);
  toothGroup.add(apex);

  // Periodontal Ligament (PDL) sheath
  const pdlGeo = new THREE.CylinderGeometry(0.73, 0.17, rootLength - 0.2, 20, 8);
  const pdlMesh = new THREE.Mesh(pdlGeo, mats.pdl);
  pdlMesh.position.y = -rootLength / 2 - 0.1;
  toothGroup.add(pdlMesh);

  // Pulp Canal (if cross section cut)
  if (isCut) {
    const pulpCrown = new THREE.Mesh(new THREE.ConeGeometry(0.25, 1.45, 12), mats.pulp);
    pulpCrown.position.y = 1.1;
    toothGroup.add(pulpCrown);

    const pulpCanal = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.02, rootLength * 0.85, 8), mats.pulp);
    pulpCanal.position.y = -rootLength / 2;
    toothGroup.add(pulpCanal);
  }

  return toothGroup;
};

/**
 * 2. HUMAN CANINE (#13, #23 Maxillary / #33, #43 Mandibular)
 * Anatomically authentic sculpted human cuspid:
 * - Pentagonal facial outline with prominent labial ridge running from cusp tip to cervical line.
 * - Sharp cusp tip with mesial cusp slope shorter than distal cusp slope (Maxillary).
 * - Massive palatal cingulum and central lingual ridge dividing lingual surface into mesial and distal fossae.
 * - Longest root in the human dentition (17mm+), tapering with gentle distal apical tilt.
 */
export const createHumanCanine = (options: {
  isMaxillary?: boolean;
  layerMode?: string;
  isCut?: boolean;
} = {}) => {
  const toothGroup = new THREE.Group();
  const { isMaxillary = true, isCut = false, layerMode = 'all' } = options;
  const mats = createDentalMaterials(layerMode);

  const crownHeight = isMaxillary ? 2.35 : 2.45;
  const crownGeo = new THREE.CylinderGeometry(0.96, 0.76, crownHeight, 36, 24);
  const pos = crownGeo.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    const h = (y + crownHeight / 2) / crownHeight;

    // Tapering to a pointed cusp tip
    let newX = x * (0.85 + h * 0.28);
    let newZ = z * (0.88 + h * 0.22);
    let newY = y;

    // 1. Labial Ridge (z > 0): Prominent central convexity
    if (z > 0) {
      const labialRidge = Math.max(0, 1.0 - Math.abs(x) * 2.1) * 0.24 * (1.0 - h * 0.3);
      newZ += labialRidge;
    }

    // 2. Palatal Cingulum & Ridge (z < 0)
    if (z < 0) {
      if (h < 0.35) {
        // Heavy, pointed cingulum
        newZ *= 1.35;
      } else {
        // Lingual ridge splitting into 2 shallow fossae
        const lingualRidge = Math.max(0, 1.0 - Math.abs(x) * 2.8) * 0.15;
        newZ = newZ * 0.85 - lingualRidge;
      }
    }

    // 3. Asymmetric Cusp Slopes: Mesial slope shorter than distal slope
    if (h > 0.75) {
      const cuspFactor = (h - 0.75) / 0.25;
      // Peak cusp tip at center
      const distFromCenter = Math.hypot(x, z);
      newY += Math.max(0, 1.0 - distFromCenter * 1.6) * 0.45 * cuspFactor;
      // Mesial slope (x < 0) shorter and less steep
      if (x < 0) {
        newY += 0.08 * cuspFactor;
      }
    }

    pos.setXYZ(i, newX, newY, newZ);
  }
  crownGeo.computeVertexNormals();

  const crownMesh = new THREE.Mesh(crownGeo, mats.enamel);
  crownMesh.position.y = crownHeight / 2;
  crownMesh.castShadow = true;
  toothGroup.add(crownMesh);

  // CEJ Line
  const cej = new THREE.Mesh(
    new THREE.TorusGeometry(0.76, 0.028, 12, 32),
    new THREE.MeshBasicMaterial({ color: 0x22c55e })
  );
  cej.rotation.x = Math.PI / 2;
  cej.position.y = 0.02;
  toothGroup.add(cej);

  // Massive Long Root
  const rootLength = isMaxillary ? 3.8 : 3.5;
  const rootGeo = new THREE.CylinderGeometry(0.74, 0.16, rootLength, 24, 20);
  const rpos = rootGeo.attributes.position;
  for (let i = 0; i < rpos.count; i++) {
    let rx = rpos.getX(i);
    const ry = rpos.getY(i);
    let rz = rpos.getZ(i);

    const t = (-ry + rootLength / 2) / rootLength;
    const distalTilt = t * t * 0.32; // Distal curvature of root apex
    // Labiolingual thickness vs mesiodistal flattening
    rx *= (1.0 - t * 0.28);
    rz *= (1.0 - t * 0.18);
    rpos.setXYZ(i, rx + distalTilt, ry, rz);
  }
  rootGeo.computeVertexNormals();

  const rootMesh = new THREE.Mesh(rootGeo, mats.cementum);
  rootMesh.position.y = -rootLength / 2;
  rootMesh.castShadow = true;
  toothGroup.add(rootMesh);

  // PDL Sheath
  const pdl = new THREE.Mesh(new THREE.CylinderGeometry(0.77, 0.19, rootLength - 0.2, 20), mats.pdl);
  pdl.position.y = -rootLength / 2 - 0.1;
  toothGroup.add(pdl);

  if (isCut) {
    const pulp = new THREE.Mesh(new THREE.ConeGeometry(0.24, 1.8, 12), mats.pulp);
    pulp.position.y = 0.9;
    toothGroup.add(pulp);
  }

  return toothGroup;
};

/**
 * 3. HUMAN MAXILLARY PREMOLAR (#14 / #15)
 * Anatomically authentic bicuspid:
 * - Ovoid/hexagonal occlusal table.
 * - Continuous, sculpted Buccal Cusp (sharp, prominent buccal ridge) and Lingual/Palatal Cusp (rounded, slightly shorter).
 * - Central developmental groove, mesial & distal triangular fossae.
 * - Root with mesial longitudinal concavity.
 */
export const createHumanPremolar = (options: {
  layerMode?: string;
  isCut?: boolean;
} = {}) => {
  const toothGroup = new THREE.Group();
  const { isCut = false, layerMode = 'all' } = options;
  const mats = createDentalMaterials(layerMode);

  const crownHeight = 1.95;
  const crownGeo = new THREE.CylinderGeometry(0.96, 0.72, crownHeight, 36, 20);
  const pos = crownGeo.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    const h = (y + crownHeight / 2) / crownHeight;

    // Occlusal flare
    let newX = x * (0.86 + h * 0.28);
    let newZ = z * (0.84 + h * 0.32);

    // Sculpt two authentic cusps on the occlusal table (h > 0.65)
    let newY = y;
    if (h > 0.65) {
      const occlusalH = (h - 0.65) / 0.35;
      // Buccal Cusp (z > 0.1): Sharp, prominent
      if (newZ > 0.1) {
        const cuspFactor = Math.max(0, 1.0 - Math.hypot(newX, newZ - 0.42) * 1.5);
        newY += cuspFactor * 0.52 * occlusalH;
      }
      // Palatal Cusp (z < -0.1): Slightly shorter, rounded
      else if (newZ < -0.1) {
        const cuspFactor = Math.max(0, 1.0 - Math.hypot(newX, newZ + 0.38) * 1.6);
        newY += cuspFactor * 0.44 * occlusalH;
      }
      // Central developmental groove (near z = 0): concavity
      else {
        newY -= 0.12 * occlusalH;
      }
    }

    // Buccal ridge prominence (z > 0)
    if (z > 0 && h < 0.8) {
      const ridge = Math.max(0, 1.0 - Math.abs(x) * 1.8) * 0.14;
      newZ += ridge;
    }

    pos.setXYZ(i, newX, newY, newZ);
  }
  crownGeo.computeVertexNormals();

  const crownMesh = new THREE.Mesh(crownGeo, mats.enamel);
  crownMesh.position.y = crownHeight / 2;
  crownMesh.castShadow = true;
  toothGroup.add(crownMesh);

  // CEJ Hard Tissue Ring
  const cej = new THREE.Mesh(
    new THREE.TorusGeometry(0.73, 0.028, 12, 32),
    new THREE.MeshBasicMaterial({ color: 0x22c55e })
  );
  cej.rotation.x = Math.PI / 2;
  cej.position.y = 0.02;
  toothGroup.add(cej);

  // Root with deep mesial longitudinal sulcus
  const rootLength = 3.2;
  const rootGeo = new THREE.CylinderGeometry(0.68, 0.15, rootLength, 24, 16);
  const rpos = rootGeo.attributes.position;
  for (let i = 0; i < rpos.count; i++) {
    let rx = rpos.getX(i);
    const ry = rpos.getY(i);
    const rz = rpos.getZ(i);

    const t = (-ry + rootLength / 2) / rootLength;
    // Mesial groove indentation (rx < -0.1)
    if (rx < -0.1 && t > 0.15 && t < 0.85) {
      rx *= 0.82;
    }
    rpos.setXYZ(i, rx, ry, rz);
  }
  rootGeo.computeVertexNormals();

  const rootMesh = new THREE.Mesh(rootGeo, mats.cementum);
  rootMesh.position.y = -rootLength / 2;
  rootMesh.castShadow = true;
  toothGroup.add(rootMesh);

  // PDL Sheath
  const pdl = new THREE.Mesh(new THREE.CylinderGeometry(0.71, 0.18, rootLength - 0.2, 20), mats.pdl);
  pdl.position.y = -rootLength / 2 - 0.1;
  toothGroup.add(pdl);

  if (isCut) {
    const pulp = new THREE.Mesh(new THREE.ConeGeometry(0.28, 1.6, 12), mats.pulp);
    pulp.position.y = 0.8;
    toothGroup.add(pulp);
  }

  return toothGroup;
};

/**
 * 3. HUMAN 1ST MOLAR (Maxillary #16 or Mandibular #46)
 * Anatomically authentic multirooted molar:
 * - Maxillary Molar (#16): 4 sculpted cusps (MB, DB, MP - largest, DP) + Cusp of Carabelli + Oblique Ridge + 3 diverging roots (Palatal, MB, DB).
 * - Mandibular Molar (#46): 5 sculpted cusps (MB, DB, Distal, ML, DL) with authentic Y-groove pattern + 2 broad roots (Mesial & Distal) with furcation vault.
 */
export const createHumanMolar = (options: {
  isMandibular?: boolean;
  furcationGrade?: 'None' | 'Grade I' | 'Grade II' | 'Grade III' | 'Grade IV';
  layerMode?: string;
  isCut?: boolean;
} = {}) => {
  const toothGroup = new THREE.Group();
  const { isMandibular = true, furcationGrade = 'None', isCut = false, layerMode = 'all' } = options;
  const mats = createDentalMaterials(layerMode);

  // --- SCULPTED CROWN GEOMETRY ---
  const crownHeight = 2.0;
  const crownRadialSegments = 40;
  const crownHeightSegments = 24;

  const crownGeo = new THREE.CylinderGeometry(1.36, 1.08, crownHeight, crownRadialSegments, crownHeightSegments);
  const pos = crownGeo.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    const h = (y + crownHeight / 2) / crownHeight;

    // Buccal cervical height of contour (cervical bulge in lower 1/3)
    let bMod = 1.0;
    if (z > 0 && h > 0.12 && h < 0.45) {
      bMod = 1.15;
    }

    let newX = x * (0.88 + h * 0.22) * bMod;
    let newZ = z * (0.88 + h * 0.22) * bMod;
    let newY = y;

    // Sculpt authentic occlusal table anatomy (h > 0.6)
    if (h > 0.6) {
      const occlH = (h - 0.6) / 0.4;

      if (isMandibular) {
        // Mandibular 1st Molar: 5 anatomical cusps
        // 1. MB Cusp (x < -0.2, z > 0.15)
        const mb = Math.max(0, 1.0 - Math.hypot(newX + 0.52, newZ - 0.48) * 1.8) * 0.48;
        // 2. DB Cusp (x >= -0.2 && x < 0.4, z > 0.15)
        const db = Math.max(0, 1.0 - Math.hypot(newX - 0.15, newZ - 0.50) * 1.9) * 0.46;
        // 3. Distal Cusp (x >= 0.4, z > 0.05)
        const d = Math.max(0, 1.0 - Math.hypot(newX - 0.65, newZ - 0.32) * 2.2) * 0.38;
        // 4. ML Cusp (x < 0, z < -0.15) - Tall, sharp
        const ml = Math.max(0, 1.0 - Math.hypot(newX + 0.48, newZ + 0.46) * 1.8) * 0.55;
        // 5. DL Cusp (x >= 0, z < -0.15) - Tall, sharp
        const dl = Math.max(0, 1.0 - Math.hypot(newX - 0.40, newZ + 0.46) * 1.8) * 0.52;

        const maxCusp = Math.max(mb, db, d, ml, dl);
        if (maxCusp > 0.02) {
          newY += maxCusp * occlH;
        } else {
          // Central Fossa & Y-groove depression
          newY -= 0.14 * occlH;
        }
      } else {
        // Maxillary 1st Molar: 4 cusps + Oblique Ridge + Carabelli
        // 1. MB Cusp (x < 0, z > 0.1)
        const mb = Math.max(0, 1.0 - Math.hypot(newX + 0.52, newZ - 0.46) * 1.8) * 0.48;
        // 2. DB Cusp (x >= 0, z > 0.1)
        const db = Math.max(0, 1.0 - Math.hypot(newX - 0.46, newZ - 0.44) * 1.9) * 0.44;
        // 3. MP Cusp (x < 0.1, z < -0.1) - Largest cusp
        const mp = Math.max(0, 1.0 - Math.hypot(newX + 0.46, newZ + 0.48) * 1.7) * 0.58;
        // 4. DP Cusp (x >= 0.1, z < -0.1) - Smallest cusp
        const dp = Math.max(0, 1.0 - Math.hypot(newX - 0.50, newZ + 0.42) * 2.0) * 0.38;

        // Oblique Ridge (connecting MP cusp to DB cusp)
        const distToOblique = Math.abs((newX + 0.46) * 0.7 - (newZ + 0.48) * 0.7);
        const obliqueBoost = distToOblique < 0.35 ? (0.35 - distToOblique) * 0.45 : 0;

        const maxCusp = Math.max(mb, db, mp + obliqueBoost, dp);
        if (maxCusp > 0.02) {
          newY += maxCusp * occlH;
        } else {
          newY -= 0.12 * occlH;
        }

        // Cusp of Carabelli on lingual of MP cusp
        if (newX < -0.35 && newZ < -0.45 && h > 0.4 && h < 0.85) {
          newZ -= 0.12 * Math.sin((h - 0.4) / 0.45 * Math.PI);
        }
      }
    }

    pos.setXYZ(i, newX, newY, newZ);
  }
  crownGeo.computeVertexNormals();

  const crownMesh = new THREE.Mesh(crownGeo, mats.enamel);
  crownMesh.position.y = crownHeight / 2 + 0.1;
  crownMesh.castShadow = true;
  toothGroup.add(crownMesh);

  // CEJ Line Ring
  const cej = new THREE.Mesh(
    new THREE.TorusGeometry(1.10, 0.032, 12, 36),
    new THREE.MeshBasicMaterial({ color: 0x22c55e })
  );
  cej.rotation.x = Math.PI / 2;
  cej.position.y = 0.05;
  toothGroup.add(cej);

  // Root Trunk (cervical ~0.9 units before bifurcation / trifurcation)
  const rootTrunk = new THREE.Mesh(new THREE.CylinderGeometry(1.06, 0.98, 0.88, 30), mats.cementum);
  rootTrunk.position.y = -0.44;
  toothGroup.add(rootTrunk);

  // --- DIVERGING ROOTS & FURCATION VAULT ---
  if (isMandibular) {
    // Mandibular: 2 broad roots (Mesial & Distal) with open furcation vault
    const mRootGeo = new THREE.CylinderGeometry(0.46, 0.18, 2.9, 18, 12);
    const mPos = mRootGeo.attributes.position;
    for (let i = 0; i < mPos.count; i++) {
      const rx = mPos.getX(i);
      const ry = mPos.getY(i);
      const rz = mPos.getZ(i);
      const t = (-ry + 1.45) / 2.9;
      // Mesial curvature and bucco-lingual ribbon flattening
      const curX = -t * 0.38 + t * t * 0.16;
      mPos.setXYZ(i, rx + curX, ry, rz * 1.35);
    }
    mRootGeo.computeVertexNormals();
    const mesialRoot = new THREE.Mesh(mRootGeo, mats.cementum);
    mesialRoot.position.set(-0.38, -1.88, 0);
    mesialRoot.castShadow = true;
    toothGroup.add(mesialRoot);

    const dRootGeo = new THREE.CylinderGeometry(0.42, 0.16, 2.8, 18, 12);
    const dPos = dRootGeo.attributes.position;
    for (let i = 0; i < dPos.count; i++) {
      const rx = dPos.getX(i);
      const ry = dPos.getY(i);
      const rz = dPos.getZ(i);
      const t = (-ry + 1.4) / 2.8;
      dPos.setXYZ(i, rx + t * 0.42, ry, rz * 1.15);
    }
    dRootGeo.computeVertexNormals();
    const distalRoot = new THREE.Mesh(dRootGeo, mats.cementum);
    distalRoot.position.set(0.38, -1.84, 0);
    distalRoot.castShadow = true;
    toothGroup.add(distalRoot);
  } else {
    // Maxillary: 3 diverging roots (Palatal, Mesiobuccal, Distobuccal)
    // 1. Palatal Root (Largest, curving palatally)
    const pRootGeo = new THREE.CylinderGeometry(0.50, 0.19, 3.3, 18, 12);
    const pPos = pRootGeo.attributes.position;
    for (let i = 0; i < pPos.count; i++) {
      const rx = pPos.getX(i);
      const ry = pPos.getY(i);
      const rz = pPos.getZ(i);
      const t = (-ry + 1.65) / 3.3;
      pPos.setXYZ(i, rx, ry, rz - t * 0.48);
    }
    pRootGeo.computeVertexNormals();
    const palatalRoot = new THREE.Mesh(pRootGeo, mats.cementum);
    palatalRoot.position.set(0, -1.98, -0.38);
    toothGroup.add(palatalRoot);

    // 2. Mesiobuccal Root
    const mbRoot = new THREE.Mesh(new THREE.CylinderGeometry(0.40, 0.15, 2.8, 16), mats.cementum);
    mbRoot.position.set(-0.48, -1.82, 0.38);
    mbRoot.rotation.z = 0.14;
    toothGroup.add(mbRoot);

    // 3. Distobuccal Root
    const dbRoot = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.14, 2.7, 16), mats.cementum);
    dbRoot.position.set(0.48, -1.78, 0.38);
    dbRoot.rotation.z = -0.14;
    toothGroup.add(dbRoot);
  }

  // Furcation Defect rendering in bone/soft tissue
  if (furcationGrade === 'Grade II') {
    const culDeSac = new THREE.Mesh(
      new THREE.SphereGeometry(0.26, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.85 })
    );
    culDeSac.position.set(0, -1.06, 0.28);
    toothGroup.add(culDeSac);
  } else if (furcationGrade === 'Grade III' || furcationGrade === 'Grade IV') {
    const tunnel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.30, 0.30, 1.5, 16),
      new THREE.MeshStandardMaterial({ color: 0x450a0a, roughness: 0.9 })
    );
    tunnel.rotation.x = Math.PI / 2;
    tunnel.position.set(0, -1.08, 0);
    toothGroup.add(tunnel);
  }

  if (isCut) {
    const pulpChamber = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.95, 0.55), mats.pulp);
    pulpChamber.position.y = 0.85;
    toothGroup.add(pulpChamber);
  }

  return toothGroup;
};

// ==========================================
// 4. ANATOMICAL SCALLOPED GINGIVA
// ==========================================

export const createAnatomicalGingiva = (options: {
  toothPositions: number[];
  recessionLevel?: number;
  isInflamed?: boolean;
  layerMode?: string;
}) => {
  const { toothPositions, recessionLevel = 0, isInflamed = false, layerMode = 'all' } = options;
  const mats = createDentalMaterials(layerMode, isInflamed);
  const gingivaGroup = new THREE.Group();

  const width = Math.abs(toothPositions[toothPositions.length - 1] - toothPositions[0]) + 4.0;
  const centerX = (toothPositions[0] + toothPositions[toothPositions.length - 1]) / 2;

  const shape = new THREE.Shape();
  const leftX = centerX - width / 2;
  const rightX = centerX + width / 2;
  const baseY = -3.0;

  shape.moveTo(leftX, baseY);
  shape.lineTo(leftX, 0.1 - recessionLevel * 0.3);

  // Scalloped marginal contour with realistic triangular interdental papillae
  toothPositions.forEach((tx, idx) => {
    if (idx > 0) {
      const prevX = toothPositions[idx - 1];
      const midX = (prevX + tx) / 2;
      const papillaPeakY = 0.50 - recessionLevel * 0.28;
      shape.lineTo(midX, papillaPeakY);
    }
    const marginY = 0.16 - recessionLevel * 0.42;
    shape.lineTo(tx - 0.72, marginY);
    shape.lineTo(tx, marginY - 0.06);
    shape.lineTo(tx + 0.72, marginY);
  });

  shape.lineTo(rightX, 0.1 - recessionLevel * 0.3);
  shape.lineTo(rightX, baseY);
  shape.closePath();

  const extrudeSettings = {
    steps: 3,
    depth: 3.0,
    bevelEnabled: true,
    bevelThickness: 0.18,
    bevelSize: 0.18,
    bevelSegments: 5
  };

  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geo.center();
  const mesh = new THREE.Mesh(geo, mats.gingiva);
  mesh.position.set(centerX, -1.25 - recessionLevel * 0.2, 0);
  gingivaGroup.add(mesh);

  return gingivaGroup;
};

// ==========================================
// 5. ANATOMICAL ALVEOLAR BONE ARCH SEGMENT
// ==========================================

export const createAnatomicalAlveolarBone = (options: {
  toothPositions: number[];
  defectType?: string;
  layerMode?: string;
}) => {
  const { toothPositions, defectType = 'healthy', layerMode = 'all' } = options;
  const mats = createDentalMaterials(layerMode);
  const boneGroup = new THREE.Group();

  let crestY = -0.35;
  if (defectType === 'mild_horizontal') crestY = -0.75;
  else if (defectType === 'moderate_horizontal') crestY = -1.25;
  else if (defectType === 'severe_horizontal' || defectType === 'furcation_class3') crestY = -1.95;
  else if (defectType === 'vertical_angular_mesial' || defectType === 'interdental_crater') crestY = -0.85;

  const width = Math.abs(toothPositions[toothPositions.length - 1] - toothPositions[0]) + 3.8;
  const centerX = (toothPositions[0] + toothPositions[toothPositions.length - 1]) / 2;
  const boneHeight = 3.5;

  const boneGeo = new THREE.BoxGeometry(width, boneHeight, 3.0, 20, 8, 8);
  const bpos = boneGeo.attributes.position;
  for (let i = 0; i < bpos.count; i++) {
    const x = bpos.getX(i);
    const y = bpos.getY(i);
    const z = bpos.getZ(i);
    const taper = (y + boneHeight / 2) / boneHeight;
    bpos.setXYZ(i, x, y, z * (0.84 + taper * 0.22));
  }
  boneGeo.computeVertexNormals();

  const boneMesh = new THREE.Mesh(boneGeo, mats.bone);
  boneMesh.position.set(centerX, crestY - boneHeight / 2, 0);
  boneMesh.receiveShadow = true;
  boneGroup.add(boneMesh);

  // Infrabony Defects:
  if (defectType === 'vertical_angular_mesial') {
    const angularDefect = new THREE.Mesh(
      new THREE.ConeGeometry(0.7, 1.85, 16),
      new THREE.MeshStandardMaterial({ color: 0x881337, roughness: 0.85 })
    );
    angularDefect.position.set(-1.15, -1.25, 0.35);
    angularDefect.rotation.z = -0.22;
    boneGroup.add(angularDefect);
  }

  if (defectType === 'interdental_crater') {
    const crater = new THREE.Mesh(
      new THREE.CylinderGeometry(0.65, 0.42, 1.6, 16),
      new THREE.MeshStandardMaterial({ color: 0x7f1d1d, roughness: 0.9 })
    );
    crater.position.set(-1.3, -1.1, 0);
    boneGroup.add(crater);
  }

  return boneGroup;
};

// ==========================================
// 6. FULL HUMAN DENTAL ARCH GENERATOR
// ==========================================

export const createFullHumanArch = (options: {
  isMaxillary?: boolean;
  withImplantAbutments?: boolean;
  layerMode?: string;
} = {}) => {
  const archGroup = new THREE.Group();
  const { isMaxillary = true, withImplantAbutments = false, layerMode = 'all' } = options;
  const mats = createDentalMaterials(layerMode);

  // Elliptical arch parameterization (rX: width, rZ: depth)
  const rX = 3.6;
  const rZ = 4.2;
  const toothAngles = [
    { type: 'molar', angle: -1.35, fdi: 17 },
    { type: 'molar', angle: -1.05, fdi: 16 },
    { type: 'premolar', angle: -0.75, fdi: 15 },
    { type: 'premolar', angle: -0.48, fdi: 14 },
    { type: 'incisor', angle: -0.22, fdi: 12 },
    { type: 'incisor', angle: -0.07, fdi: 11 },
    { type: 'incisor', angle: 0.07, fdi: 21 },
    { type: 'incisor', angle: 0.22, fdi: 22 },
    { type: 'premolar', angle: 0.48, fdi: 24 },
    { type: 'premolar', angle: 0.75, fdi: 25 },
    { type: 'molar', angle: 1.05, fdi: 26 },
    { type: 'molar', angle: 1.35, fdi: 27 },
  ];

  toothAngles.forEach((t) => {
    let tooth: THREE.Group;
    if (t.type === 'incisor') {
      tooth = createHumanIncisor({ isMaxillary, layerMode });
      tooth.scale.set(0.85, 0.85, 0.85);
    } else if (t.type === 'premolar') {
      tooth = createHumanPremolar({ layerMode });
      tooth.scale.set(0.85, 0.85, 0.85);
    } else {
      tooth = createHumanMolar({ isMandibular: !isMaxillary, layerMode });
      tooth.scale.set(0.85, 0.85, 0.85);
    }

    const posX = rX * Math.sin(t.angle);
    const posZ = rZ * (Math.cos(t.angle) - 1.0);
    tooth.position.set(posX, 0, posZ);
    tooth.rotation.y = -t.angle;
    archGroup.add(tooth);

    if (withImplantAbutments && (t.fdi === 16 || t.fdi === 14 || t.fdi === 24 || t.fdi === 26)) {
      const impGeo = new THREE.CylinderGeometry(0.35, 0.25, 2.4, 16);
      const impMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.92, roughness: 0.18 });
      const imp = new THREE.Mesh(impGeo, impMat);
      imp.position.set(posX, -1.8, posZ);
      archGroup.add(imp);
    }
  });

  // Alveolar Ridge Horseshoe
  const ridgeGeo = new THREE.TorusGeometry(3.6, 0.95, 12, 36, Math.PI);
  const ridgeMesh = new THREE.Mesh(ridgeGeo, mats.bone);
  ridgeMesh.rotation.x = Math.PI / 2;
  ridgeMesh.position.set(0, -1.5, -4.2);
  archGroup.add(ridgeMesh);

  return archGroup;
};

// ==========================================
// 7. INTERACTIVE 3D TOOTH VIEWER MODEL
// ==========================================

export type AnatomyLearningMode =
  | 'external'
  | 'internal'
  | 'layers'
  | 'root_canal'
  | 'transparent'
  | 'exploded'
  | 'section';

export interface InteractiveToothViewerOptions {
  category: 'Incisor' | 'Canine' | 'Premolar' | 'Molar';
  subCategory?: string;
  isMaxillary?: boolean;
  isMandibular?: boolean;
  learningMode: AnatomyLearningMode;
  showLandmarks?: boolean;
  activeLandmarkId?: string;
  landmarks?: Array<{
    id: string;
    name: string;
    category: 'crown' | 'root' | 'internal' | 'margin';
    position: [number, number, number];
    normal?: [number, number, number];
  }>;
}

export const createInteractiveToothViewerModel = (options: InteractiveToothViewerOptions): THREE.Group => {
  const rootGroup = new THREE.Group();
  const {
    category,
    isMaxillary = true,
    learningMode,
    showLandmarks = false,
    activeLandmarkId,
    landmarks = []
  } = options;

  const isCut = learningMode === 'section' || learningMode === 'internal';
  const isExploded = learningMode === 'exploded';
  const isTransparent = learningMode === 'transparent' || learningMode === 'root_canal';
  const isInternal = learningMode === 'internal';

  // 1. Build Base Tooth Model
  let baseTooth: THREE.Group;
  if (category === 'Incisor') {
    baseTooth = createHumanIncisor({ isMaxillary, isCut });
  } else if (category === 'Canine') {
    baseTooth = createHumanCanine({ isMaxillary, isCut });
  } else if (category === 'Premolar') {
    baseTooth = createHumanPremolar({ isCut });
  } else {
    baseTooth = createHumanMolar({ isMandibular: !isMaxillary, isCut });
  }

  // 2. Adjust Materials & Positions Based on Learning Mode
  const mats = createDentalMaterials(learningMode === 'transparent' ? 'xray' : 'all');

  baseTooth.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;

      // Internal & Root Canal mode transparency
      if (isInternal || learningMode === 'root_canal') {
        if (child.material && !(child.material instanceof Array)) {
          const mat = child.material as THREE.MeshStandardMaterial;
          if (mat.name !== 'pulp') {
            mat.transparent = true;
            mat.opacity = learningMode === 'root_canal' ? 0.18 : 0.35;
            mat.roughness = 0.2;
            mat.depthWrite = false;
          }
        }
      } else if (learningMode === 'transparent') {
        if (child.material && !(child.material instanceof Array)) {
          const mat = child.material as THREE.MeshStandardMaterial;
          mat.transparent = true;
          mat.opacity = 0.22;
          mat.depthWrite = false;
        }
      }

      // Exploded View: Translate meshes along Y or X to expose internal stratigraphy
      if (isExploded) {
        if (child.position.y > 0.5) {
          // Crown lifts up
          child.position.y += 1.35;
        } else if (child.position.y < -0.5) {
          // Roots shift down
          child.position.y -= 1.1;
        }
      }

      // Section Cutaway View: Slice away anterior/buccal half
      if (learningMode === 'section') {
        const mat = child.material as THREE.MeshStandardMaterial;
        if (mat) {
          mat.clipShadows = true;
        }
      }
    }
  });

  rootGroup.add(baseTooth);

  // 3. Add Dedicated Realistic Pulp Chamber & Root Canal Geometry for Internal / Root Canal / Exploded Modes
  if (isInternal || learningMode === 'root_canal' || isExploded) {
    const pulpGroup = new THREE.Group();
    pulpGroup.name = 'pulpSystem';

    const pulpGlowMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xdc2626,
      emissiveIntensity: 0.85,
      roughness: 0.25,
      metalness: 0.1
    });

    if (category === 'Incisor' || category === 'Canine') {
      // Single canal & coronal pulp horn
      const horn = new THREE.Mesh(new THREE.ConeGeometry(0.22, 1.35, 16), pulpGlowMat);
      horn.position.y = isExploded ? 1.9 : 1.15;
      pulpGroup.add(horn);

      const canal = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.03, 3.2, 16), pulpGlowMat);
      canal.position.y = isExploded ? -1.8 : -1.6;
      pulpGroup.add(canal);

      // Apical foramen constriction
      const foramen = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), pulpGlowMat);
      foramen.position.set(0.18, isExploded ? -3.4 : -3.2, 0);
      pulpGroup.add(foramen);
    } else if (category === 'Premolar') {
      // Coronal chamber with 2 horns + 2 root canals
      const chamber = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.95, 0.44), pulpGlowMat);
      chamber.position.y = isExploded ? 1.8 : 0.95;
      pulpGroup.add(chamber);

      const bCanal = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.025, 3.0, 12), pulpGlowMat);
      bCanal.position.set(0, isExploded ? -1.8 : -1.5, 0.25);
      pulpGroup.add(bCanal);

      const pCanal = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.03, 3.0, 12), pulpGlowMat);
      pCanal.position.set(0, isExploded ? -1.8 : -1.5, -0.25);
      pulpGroup.add(pCanal);
    } else {
      // Molar Pulp: Large chamber with 4-5 pulp horns + multiple curved canals
      const chamber = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.8, 0.75), pulpGlowMat);
      chamber.position.y = isExploded ? 2.0 : 0.95;
      pulpGroup.add(chamber);

      // Mesial Canals (MB + ML)
      const mbCanal = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.025, 2.8, 12), pulpGlowMat);
      mbCanal.position.set(-0.35, isExploded ? -2.0 : -1.8, 0.25);
      mbCanal.rotation.z = 0.08;
      pulpGroup.add(mbCanal);

      const mlCanal = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.025, 2.8, 12), pulpGlowMat);
      mlCanal.position.set(-0.35, isExploded ? -2.0 : -1.8, -0.25);
      mlCanal.rotation.z = 0.08;
      pulpGroup.add(mlCanal);

      // Distal Canal
      const dCanal = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.035, 2.7, 12), pulpGlowMat);
      dCanal.position.set(0.35, isExploded ? -1.9 : -1.75, 0);
      dCanal.rotation.z = -0.08;
      pulpGroup.add(dCanal);

      // Palatal Canal (if Maxillary Molar)
      if (isMaxillary) {
        const palCanal = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.04, 3.1, 14), pulpGlowMat);
        palCanal.position.set(0, isExploded ? -2.1 : -1.9, -0.45);
        pulpGroup.add(palCanal);
      }
    }

    rootGroup.add(pulpGroup);
  }

  // 4. Interactive 3D Anatomical Landmark Pins
  if (showLandmarks && landmarks.length > 0) {
    const pinsGroup = new THREE.Group();
    pinsGroup.name = 'landmarkPins';

    landmarks.forEach((landmark) => {
      const isActive = activeLandmarkId === landmark.id;
      const markerGroup = new THREE.Group();
      markerGroup.userData = {
        isLandmark: true,
        landmarkId: landmark.id,
        landmarkName: landmark.name,
        category: landmark.category
      };

      // Determine pin color based on landmark category
      let pinColor = 0x06b6d4; // Cyan for crown
      if (landmark.category === 'margin') pinColor = 0x22c55e; // Emerald for CEJ
      if (landmark.category === 'root') pinColor = 0xf59e0b; // Amber for root
      if (landmark.category === 'internal') pinColor = 0xef4444; // Rose for pulp/canals
      if (isActive) pinColor = 0xec4899; // Bright pink for active

      // 3D Pin Head Sphere
      const sphereGeo = new THREE.SphereGeometry(isActive ? 0.12 : 0.08, 16, 16);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: pinColor,
        emissive: pinColor,
        emissiveIntensity: isActive ? 0.9 : 0.45,
        roughness: 0.2
      });
      const pinHead = new THREE.Mesh(sphereGeo, sphereMat);
      pinHead.position.set(...landmark.position);
      markerGroup.add(pinHead);

      // Delicate Pin Stem
      const normal = landmark.normal || [0, 0, 1];
      const stemLength = 0.24;
      const stemGeo = new THREE.CylinderGeometry(0.015, 0.015, stemLength, 8);
      const stemMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.set(
        landmark.position[0] + normal[0] * (stemLength / 2),
        landmark.position[1] + normal[1] * (stemLength / 2),
        landmark.position[2] + normal[2] * (stemLength / 2)
      );
      markerGroup.add(stem);

      // Pulsing outer halo for active pin
      if (isActive) {
        const haloGeo = new THREE.RingGeometry(0.14, 0.20, 24);
        const haloMat = new THREE.MeshBasicMaterial({
          color: 0xec4899,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.8
        });
        const halo = new THREE.Mesh(haloGeo, haloMat);
        halo.position.set(...landmark.position);
        markerGroup.add(halo);
      }

      pinsGroup.add(markerGroup);
    });

    rootGroup.add(pinsGroup);
  }

  return rootGroup;
};

