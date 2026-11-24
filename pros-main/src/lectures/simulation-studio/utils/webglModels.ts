import * as THREE from 'three';
import { Hotspot3D, LectureId } from '../types/prosthodontics';
import { createResourceDisposer } from './resources';

export interface BuiltLectureScene {
  root: THREE.Group;
  hotspotMeshes: THREE.Mesh[];
  updateSimulation: (param: number, variantId: string, explodeTarget: number, delta: number) => void;
  setLayerVisibility: (layers: Record<string, boolean>) => void;
  dispose: () => void;
}

function createArchShape(outerRadiusX: number, outerRadiusZ: number, innerRadiusX: number, innerRadiusZ: number): THREE.Shape {
  const shape = new THREE.Shape();
  const steps = 32;
  for (let i = 0; i <= steps; i++) {
    const t = -Math.PI * 0.1 + (i / steps) * Math.PI * 1.2;
    const x = Math.cos(t) * outerRadiusX;
    const y = Math.sin(t) * outerRadiusZ;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  for (let i = steps; i >= 0; i--) {
    const t = -Math.PI * 0.1 + (i / steps) * Math.PI * 1.2;
    const x = Math.cos(t) * innerRadiusX;
    const y = Math.sin(t) * innerRadiusZ;
    shape.lineTo(x, y);
  }
  shape.closePath();
  return shape;
}

function createPalateBaseShape(radiusX: number, radiusZ: number): THREE.Shape {
  const shape = new THREE.Shape();
  const steps = 36;
  for (let i = 0; i <= steps; i++) {
    const t = -Math.PI * 0.08 + (i / steps) * Math.PI * 1.16;
    const x = Math.cos(t) * radiusX;
    const y = Math.sin(t) * radiusZ;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.quadraticCurveTo(0, -radiusZ * 0.36, Math.cos(-Math.PI * 0.08) * radiusX, Math.sin(-Math.PI * 0.08) * radiusZ);
  shape.closePath();
  return shape;
}

function createToothRow(
  count: number,
  radiusX: number,
  radiusZ: number,
  yPos: number,
  material: THREE.Material,
  layerId: string,
  skipIndices: number[] = []
): THREE.Group {
  const group = new THREE.Group();
  group.userData.layerId = layerId;
  const toothGeo = new THREE.CapsuleGeometry(0.11, 0.14, 6, 12);

  for (let i = 0; i < count; i++) {
    if (skipIndices.includes(i)) continue;
    const frac = i / (count - 1);
    const angle = -Math.PI * 0.02 + frac * Math.PI * 1.04;
    const x = Math.cos(angle) * radiusX;
    const z = Math.sin(angle) * radiusZ;
    const isAnterior = frac > 0.3 && frac < 0.7;
    const mesh = new THREE.Mesh(toothGeo, material);
    mesh.position.set(x, yPos, z);
    mesh.rotation.y = -angle + Math.PI / 2;
    mesh.scale.set(isAnterior ? 0.92 : 1.18, isAnterior ? 1.15 : 0.9, isAnterior ? 0.72 : 1.08);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.layerId = layerId;
    mesh.userData.toothIndex = i;
    group.add(mesh);
  }
  return group;
}

export function buildLecture3DModel(lectureId: LectureId, hotspots: Hotspot3D[]): BuiltLectureScene {
  const root = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];
  const hotspotMeshes: THREE.Mesh[] = [];

  // Materials calibrated for PBR studio lighting
  const boneMat = new THREE.MeshStandardMaterial({
    color: 0xe9e1cf,
    roughness: 0.72,
    metalness: 0.04,
  });
  const mucosaMat = new THREE.MeshPhysicalMaterial({
    color: 0xd97d82,
    roughness: 0.42,
    metalness: 0.02,
    clearcoat: 0.45,
    clearcoatRoughness: 0.35,
  });
  const acrylicMat = new THREE.MeshPhysicalMaterial({
    color: 0xe68b96,
    roughness: 0.24,
    metalness: 0.02,
    clearcoat: 0.85,
    clearcoatRoughness: 0.14,
    transparent: true,
    opacity: 0.92,
  });
  const clearSplintMat = new THREE.MeshPhysicalMaterial({
    color: 0xd9ecff,
    roughness: 0.14,
    metalness: 0.05,
    transparent: true,
    opacity: 0.48,
    depthWrite: false,
  });
  const toothMat = new THREE.MeshPhysicalMaterial({
    color: 0xf6f1e4,
    roughness: 0.16,
    metalness: 0.02,
    clearcoat: 0.9,
    clearcoatRoughness: 0.1,
  });
  const metalMat = new THREE.MeshStandardMaterial({
    color: 0xc8d0da,
    roughness: 0.2,
    metalness: 0.92,
  });
  const goldAccentMat = new THREE.MeshStandardMaterial({
    color: 0xc9a24b,
    roughness: 0.26,
    metalness: 0.86,
  });
  const royalBlueAccentMat = new THREE.MeshStandardMaterial({
    color: 0x1b3a8c,
    roughness: 0.35,
    metalness: 0.25,
  });
  const defectMat = new THREE.MeshStandardMaterial({
    color: 0x9b2c3b,
    roughness: 0.55,
    metalness: 0.05,
    transparent: true,
    opacity: 0.78,
  });
  const linerMat = new THREE.MeshStandardMaterial({
    color: 0xf4c4ca,
    roughness: 0.62,
    metalness: 0.02,
  });

  disposables.push(
    boneMat,
    mucosaMat,
    acrylicMat,
    clearSplintMat,
    toothMat,
    metalMat,
    goldAccentMat,
    royalBlueAccentMat,
    defectMat,
    linerMat
  );

  // Shared extruded base geometries
  const upperRidgeShape = createArchShape(1.36, 1.38, 0.95, 0.96);
  const upperRidgeGeo = new THREE.ExtrudeGeometry(upperRidgeShape, {
    depth: 0.34,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.07,
    bevelThickness: 0.07,
  });
  upperRidgeGeo.rotateX(Math.PI / 2);

  const palateShape = createPalateBaseShape(1.32, 1.34);
  const palateGeo = new THREE.ExtrudeGeometry(palateShape, {
    depth: 0.12,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.04,
    bevelThickness: 0.04,
  });
  palateGeo.rotateX(Math.PI / 2);

  const lowerRidgeShape = createArchShape(1.26, 1.28, 0.88, 0.9);
  const lowerRidgeGeo = new THREE.ExtrudeGeometry(lowerRidgeShape, {
    depth: 0.28,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.06,
    bevelThickness: 0.06,
  });
  lowerRidgeGeo.rotateX(Math.PI / 2);

  disposables.push(upperRidgeGeo, palateGeo, lowerRidgeGeo);

  // Layer groups for exploded view & visibility toggling
  const boneGroup = new THREE.Group();
  boneGroup.userData.layerId = 'bone';
  const mucosaGroup = new THREE.Group();
  mucosaGroup.userData.layerId = 'mucosa';
  const prosthesisGroup = new THREE.Group();
  prosthesisGroup.userData.layerId = 'prosthesis';
  const teethGroup = new THREE.Group();
  teethGroup.userData.layerId = 'teeth';

  root.add(boneGroup, mucosaGroup, prosthesisGroup, teethGroup);

  // Dynamic part references for per-lecture simulations
  let upperBoneMesh: THREE.Mesh | null = null;
  let lowerBoneMesh: THREE.Mesh | null = null;
  let lowerMucosaMesh: THREE.Mesh | null = null;
  let dentureBaseMesh: THREE.Mesh | null = null;
  let softPalateMesh: THREE.Mesh | null = null;
  let ppsBeadTube: THREE.Mesh | null = null;
  let flabbyRidgeMesh: THREE.Mesh | null = null;
  let fractureLineMesh: THREE.Mesh | null = null;
  let linerShellMesh: THREE.Mesh | null = null;
  let flangeMesh: THREE.Mesh | null = null;
  let undercutBulgeMesh: THREE.Mesh | null = null;
  let splintMesh: THREE.Mesh | null = null;
  let hopelessTeethRow: THREE.Group | null = null;
  let trimmedRidgeMesh: THREE.Mesh | null = null;
  let defectBlockMesh: THREE.Mesh | null = null;
  let hollowBulbMesh: THREE.Mesh | null = null;
  let claspGroup: THREE.Group | null = null;
  let implantGroup: THREE.Group | null = null;
  let upperTeethRow: THREE.Group | null = null;

  // Build lecture-specific anatomical & prosthetic assemblies (Lectures 4–10)
  if (lectureId === 'lecture-4') {
    // Lecture 4 setup continues below
    // Posterior Palatal Seal (Maxillary Hard Palate + Soft Palate Curtain + Vibrating Lines + PPS Bead)
    upperBoneMesh = new THREE.Mesh(upperRidgeGeo, boneMat);
    upperBoneMesh.position.set(0, 0.62, 0.15);
    upperBoneMesh.castShadow = true;
    boneGroup.add(upperBoneMesh);

    const hardPalate = new THREE.Mesh(palateGeo, mucosaMat);
    hardPalate.position.set(0, 0.56, 0.15);
    hardPalate.castShadow = true;
    boneGroup.add(hardPalate);

    // Movable soft palate posterior curtain (pivots by House Class I, II, III)
    const softPalateShape = new THREE.Shape();
    softPalateShape.moveTo(-1.26, 0);
    softPalateShape.quadraticCurveTo(0, 0.16, 1.26, 0);
    softPalateShape.lineTo(1.1, -0.82);
    softPalateShape.quadraticCurveTo(0, -0.95, -1.1, -0.82);
    softPalateShape.closePath();
    const softGeo = new THREE.ExtrudeGeometry(softPalateShape, {
      depth: 0.09,
      bevelEnabled: true,
      bevelSize: 0.03,
      bevelThickness: 0.03,
      bevelSegments: 3,
    });
    softGeo.rotateX(Math.PI / 2);
    disposables.push(softGeo);

    softPalateMesh = new THREE.Mesh(softGeo, defectMat);
    softPalateMesh.position.set(0, 0.52, -0.52);
    mucosaGroup.add(softPalateMesh);

    // Anterior Vibrating Line (Cupid's Bow) + Posterior Vibrating Line + Fovea Palatina
    const avlCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.12, 0.57, -0.68),
      new THREE.Vector3(-0.55, 0.6, -0.45),
      new THREE.Vector3(0, 0.59, -0.56),
      new THREE.Vector3(0.55, 0.6, -0.45),
      new THREE.Vector3(1.12, 0.57, -0.68),
    ]);
    const avlGeo = new THREE.TubeGeometry(avlCurve, 36, 0.024, 8, false);
    const pvlCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.12, 0.53, -0.85),
      new THREE.Vector3(-0.5, 0.54, -0.88),
      new THREE.Vector3(0, 0.53, -0.9),
      new THREE.Vector3(0.5, 0.54, -0.88),
      new THREE.Vector3(1.12, 0.53, -0.85),
    ]);
    const pvlGeo = new THREE.TubeGeometry(pvlCurve, 32, 0.022, 8, false);
    const foveaGeo = new THREE.SphereGeometry(0.045, 14, 12);
    disposables.push(avlGeo, pvlGeo, foveaGeo);

    mucosaGroup.add(new THREE.Mesh(avlGeo, royalBlueAccentMat));
    mucosaGroup.add(new THREE.Mesh(pvlGeo, goldAccentMat));
    for (const side of [-1, 1]) {
      const fov = new THREE.Mesh(foveaGeo, goldAccentMat);
      fov.position.set(side * 0.12, 0.55, -0.76);
      mucosaGroup.add(fov);
    }

    // Translucent denture base + dynamic PPS raised bead
    dentureBaseMesh = new THREE.Mesh(palateGeo, clearSplintMat);
    dentureBaseMesh.position.set(0, 0.25, 0.15);
    dentureBaseMesh.scale.set(1.03, 1.0, 1.08);
    prosthesisGroup.add(dentureBaseMesh);

    const beadCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.12, 0.22, -0.78),
      new THREE.Vector3(-0.55, 0.22, -0.62),
      new THREE.Vector3(0, 0.22, -0.72),
      new THREE.Vector3(0.55, 0.22, -0.62),
      new THREE.Vector3(1.12, 0.22, -0.78),
    ]);
    const beadGeo = new THREE.TubeGeometry(beadCurve, 36, 0.045, 10, false);
    disposables.push(beadGeo);
    ppsBeadTube = new THREE.Mesh(beadGeo, goldAccentMat);
    prosthesisGroup.add(ppsBeadTube);
  } else if (lectureId === 'lecture-5') {
    upperBoneMesh = new THREE.Mesh(upperRidgeGeo, boneMat);
    upperBoneMesh.position.set(0, 0.6, 0);
    boneGroup.add(upperBoneMesh);

    lowerBoneMesh = new THREE.Mesh(lowerRidgeGeo, boneMat);
    lowerBoneMesh.position.set(0, -0.35, 0);
    boneGroup.add(lowerBoneMesh);

    // Fibrous anterior flabby ridge cushion
    const flabbyGeo = new THREE.CylinderGeometry(0.16, 0.2, 1.05, 18);
    flabbyGeo.rotateZ(Math.PI / 2);
    disposables.push(flabbyGeo);
    flabbyRidgeMesh = new THREE.Mesh(flabbyGeo, defectMat);
    flabbyRidgeMesh.position.set(0, 0.38, 1.12);
    flabbyRidgeMesh.scale.set(1.0, 0.7, 0.65);
    mucosaGroup.add(flabbyRidgeMesh);

    lowerMucosaMesh = new THREE.Mesh(lowerRidgeGeo, mucosaMat);
    lowerMucosaMesh.position.set(0, -0.25, 0);
    lowerMucosaMesh.scale.set(1.03, 0.45, 1.03);
    mucosaGroup.add(lowerMucosaMesh);

    dentureBaseMesh = new THREE.Mesh(lowerRidgeGeo, clearSplintMat);
    dentureBaseMesh.position.set(0, -0.1, 0);
    dentureBaseMesh.scale.set(1.04, 0.9, 1.04);
    prosthesisGroup.add(dentureBaseMesh);
  } else if (lectureId === 'lecture-6') {
    dentureBaseMesh = new THREE.Mesh(palateGeo, acrylicMat);
    dentureBaseMesh.position.set(0, 0.32, 0);
    prosthesisGroup.add(dentureBaseMesh);

    upperTeethRow = createToothRow(14, 1.15, 1.16, 0.1, toothMat, 'teeth');
    teethGroup.add(upperTeethRow);

    // Midline fatigue crack line (~3 yrs)
    const crackGeo = new THREE.BoxGeometry(0.035, 0.18, 1.15);
    disposables.push(crackGeo);
    fractureLineMesh = new THREE.Mesh(crackGeo, defectMat);
    fractureLineMesh.position.set(0, 0.34, 0.62);
    prosthesisGroup.add(fractureLineMesh);

    // Intaglio liner / soft liner cushion
    linerShellMesh = new THREE.Mesh(palateGeo, linerMat);
    linerShellMesh.position.set(0, 0.46, 0);
    linerShellMesh.scale.set(0.98, 0.75, 0.98);
    mucosaGroup.add(linerShellMesh);
  } else if (lectureId === 'lecture-7') {
    upperBoneMesh = new THREE.Mesh(upperRidgeGeo, boneMat);
    upperBoneMesh.position.set(0, 0.56, 0);
    boneGroup.add(upperBoneMesh);

    // Adjustable labial undercut prominence
    const undercutGeo = new THREE.SphereGeometry(0.42, 22, 16);
    disposables.push(undercutGeo);
    undercutBulgeMesh = new THREE.Mesh(undercutGeo, mucosaMat);
    undercutBulgeMesh.position.set(0, 0.4, 1.2);
    undercutBulgeMesh.scale.set(1.6, 0.6, 0.55);
    mucosaGroup.add(undercutBulgeMesh);

    dentureBaseMesh = new THREE.Mesh(palateGeo, acrylicMat);
    dentureBaseMesh.position.set(0, 0.2, 0);
    prosthesisGroup.add(dentureBaseMesh);

    // Adjustable labial flange
    const flangeGeo = new THREE.CylinderGeometry(1.36, 1.38, 0.36, 28, 1, true, -Math.PI * 0.32, Math.PI * 0.64);
    disposables.push(flangeGeo);
    flangeMesh = new THREE.Mesh(flangeGeo, acrylicMat);
    flangeMesh.position.set(0, 0.32, 0);
    flangeMesh.material = acrylicMat.clone();
    (flangeMesh.material as THREE.MeshPhysicalMaterial).side = THREE.DoubleSide;
    disposables.push(flangeMesh.material);
    prosthesisGroup.add(flangeMesh);

    upperTeethRow = createToothRow(14, 1.15, 1.16, -0.02, toothMat, 'teeth');
    prosthesisGroup.add(upperTeethRow);
  } else if (lectureId === 'lecture-8') {
    // Master cast + hopeless teeth vs trimmed ridge + clear surgical splint
    upperBoneMesh = new THREE.Mesh(palateGeo, boneMat);
    upperBoneMesh.position.set(0, 0.45, 0);
    upperBoneMesh.scale.set(1.06, 2.2, 1.06);
    boneGroup.add(upperBoneMesh);

    const rimStone = new THREE.Mesh(upperRidgeGeo, boneMat);
    rimStone.position.set(0, 0.58, 0);
    boneGroup.add(rimStone);

    // Place the six anterior teeth directly; do not allocate then discard a full row.
    hopelessTeethRow = new THREE.Group();
    hopelessTeethRow.userData.layerId = 'teeth';
    const tGeo = new THREE.CapsuleGeometry(0.11, 0.16, 6, 12);
    disposables.push(tGeo);
    for (let i = 0; i < 6; i++) {
      const angle = Math.PI * 0.28 + (i / 5) * Math.PI * 0.44;
      const tm = new THREE.Mesh(tGeo, toothMat);
      tm.position.set(Math.cos(angle) * 1.14, 0.26, Math.sin(angle) * 1.16);
      tm.rotation.y = -angle + Math.PI / 2;
      hopelessTeethRow.add(tm);
    }
    teethGroup.add(hopelessTeethRow);

    const trimGeo = new THREE.TorusGeometry(1.13, 0.13, 12, 24, Math.PI * 0.52);
    trimGeo.rotateX(Math.PI / 2);
    trimGeo.rotateZ(-Math.PI * 0.24);
    disposables.push(trimGeo);
    trimmedRidgeMesh = new THREE.Mesh(trimGeo, mucosaMat);
    trimmedRidgeMesh.position.set(0, 0.36, 0);
    teethGroup.add(trimmedRidgeMesh);

    splintMesh = new THREE.Mesh(palateGeo, clearSplintMat);
    splintMesh.position.set(0, 0.18, 0);
    splintMesh.scale.set(1.06, 1.4, 1.06);
    prosthesisGroup.add(splintMesh);
  } else if (lectureId === 'lecture-9') {
    upperBoneMesh = new THREE.Mesh(upperRidgeGeo, boneMat);
    upperBoneMesh.position.set(0, 0.52, 0);
    boneGroup.add(upperBoneMesh);

    const palBase = new THREE.Mesh(palateGeo, boneMat);
    palBase.position.set(0, 0.52, 0);
    boneGroup.add(palBase);

    const defectGeo = new THREE.BoxGeometry(1.15, 0.44, 1.35);
    disposables.push(defectGeo);
    defectBlockMesh = new THREE.Mesh(defectGeo, defectMat);
    defectBlockMesh.position.set(-0.55, 0.46, 0.05);
    mucosaGroup.add(defectBlockMesh);

    dentureBaseMesh = new THREE.Mesh(palateGeo, acrylicMat);
    dentureBaseMesh.position.set(0, 0.24, 0);
    prosthesisGroup.add(dentureBaseMesh);

    upperTeethRow = createToothRow(12, 1.14, 1.14, 0.08, toothMat, 'prosthesis');
    prosthesisGroup.add(upperTeethRow);
  } else {
    // Lecture 10: Obturator Bulb + Cast Clasps + Implants
    upperBoneMesh = new THREE.Mesh(upperRidgeGeo, boneMat);
    upperBoneMesh.position.set(0, 0.54, 0);
    boneGroup.add(upperBoneMesh);

    const bulbGeo = new THREE.SphereGeometry(0.55, 24, 18);
    disposables.push(bulbGeo);
    hollowBulbMesh = new THREE.Mesh(bulbGeo, acrylicMat);
    hollowBulbMesh.position.set(-0.65, 0.58, -0.1);
    hollowBulbMesh.scale.set(0.95, 0.78, 1.25);
    prosthesisGroup.add(hollowBulbMesh);

    dentureBaseMesh = new THREE.Mesh(palateGeo, acrylicMat);
    dentureBaseMesh.position.set(0, 0.26, 0);
    prosthesisGroup.add(dentureBaseMesh);

    claspGroup = new THREE.Group();
    const claspGeo = new THREE.TorusGeometry(0.16, 0.025, 8, 20, Math.PI * 1.4);
    claspGeo.rotateX(Math.PI / 2);
    disposables.push(claspGeo);
    for (const zPos of [-0.5, 0.35]) {
      const clasp = new THREE.Mesh(claspGeo, metalMat);
      clasp.position.set(1.05, 0.22, zPos);
      claspGroup.add(clasp);
    }
    teethGroup.add(claspGroup);

    implantGroup = new THREE.Group();
    const impGeo = new THREE.CylinderGeometry(0.07, 0.06, 0.42, 16);
    disposables.push(impGeo);
    for (const zPos of [-0.25, 0.45]) {
      const imp = new THREE.Mesh(impGeo, goldAccentMat);
      imp.position.set(-0.62, 0.35, zPos);
      implantGroup.add(imp);
    }
    teethGroup.add(implantGroup);
  }

  // Interactive 3D Hotspot Markers on Layer 1
  const pinGeo = new THREE.SphereGeometry(0.095, 16, 14);
  const ringGeo = new THREE.RingGeometry(0.12, 0.165, 24);
  ringGeo.rotateX(-Math.PI / 2);
  disposables.push(pinGeo, ringGeo);

  hotspots.forEach((hs) => {
    const pinMat = new THREE.MeshStandardMaterial({
      color: 0xc9a24b,
      emissive: 0x6b4e11,
      emissiveIntensity: 0.45,
      roughness: 0.25,
      metalness: 0.75,
    });
    disposables.push(pinMat);
    const pin = new THREE.Mesh(pinGeo, pinMat);
    pin.position.set(hs.position[0], hs.position[1], hs.position[2]);
    pin.layers.enable(1);
    pin.userData.hotspot = hs;
    pin.userData.baseColor = 0xc9a24b;

    const ring = new THREE.Mesh(ringGeo, royalBlueAccentMat);
    ring.position.set(0, -0.04, 0);
    pin.add(ring);

    root.add(pin);
    hotspotMeshes.push(pin);
  });

  // Grounding contact shadow disc
  const shadowPlaneGeo = new THREE.CircleGeometry(2.6, 48);
  shadowPlaneGeo.rotateX(-Math.PI / 2);
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 128;
  shadowCanvas.height = 128;
  const ctx = shadowCanvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(64, 64, 8, 64, 64, 62);
    grad.addColorStop(0, 'rgba(11, 31, 77, 0.24)');
    grad.addColorStop(1, 'rgba(11, 31, 77, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
  }
  const shadowTex = new THREE.CanvasTexture(shadowCanvas);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    depthWrite: false,
  });
  const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowMat);
  shadowPlane.position.y = -0.95;
  root.add(shadowPlane);
  disposables.push(shadowPlaneGeo, shadowTex, shadowMat);

  let currentExplode = 0;

  const updateSimulation = (param: number, variantId: string, explodeTarget: number, delta: number) => {
    currentExplode = THREE.MathUtils.damp(currentExplode, explodeTarget, 8, delta || 0.016);

    boneGroup.position.y = currentExplode * 0.55;
    mucosaGroup.position.y = currentExplode * 0.15;
    prosthesisGroup.position.y = -currentExplode * 0.45;
    teethGroup.position.y = -currentExplode * 0.72;

    if (lectureId === 'lecture-4') {
      if (softPalateMesh) {
        const angle = variantId === 'house-1' ? 0.18 : variantId === 'house-2' ? 0.45 : 0.85;
        softPalateMesh.rotation.x = angle;
      }
      if (ppsBeadTube) {
        const s = 0.45 + param * 0.75;
        ppsBeadTube.scale.set(1, s, 1);
      }
    } else if (lectureId === 'lecture-5') {
      const lossRatio = param / 10;
      if (upperBoneMesh) upperBoneMesh.scale.y = 1 - lossRatio * 0.22;
      if (lowerBoneMesh) lowerBoneMesh.scale.y = 1 - lossRatio * 0.68;
      if (flabbyRidgeMesh) flabbyRidgeMesh.visible = variantId === 'combination' || lossRatio > 0.3;
      if (lowerMucosaMesh) {
        (lowerMucosaMesh.material as THREE.MeshPhysicalMaterial).color.setHex(
          variantId === 'xerostomia' ? 0xb8374a : 0xd97d82
        );
      }
    } else if (lectureId === 'lecture-6') {
      const stressRatio = (param - 50) / 300;
      if (fractureLineMesh) {
        fractureLineMesh.scale.set(1 + stressRatio * 2.2, 1, 0.35 + stressRatio * 0.75);
        fractureLineMesh.visible = variantId === 'midline-stress' || stressRatio > 0.45;
      }
      if (linerShellMesh) {
        linerShellMesh.visible = variantId !== 'midline-stress';
        (linerShellMesh.material as THREE.MeshStandardMaterial).color.setHex(
          variantId === 'soft-liner' ? 0xf5d0d5 : 0xd4def7
        );
      }
    } else if (lectureId === 'lecture-7') {
      if (undercutBulgeMesh) {
        undercutBulgeMesh.scale.z = 0.3 + param * 0.18;
      }
      if (flangeMesh) {
        if (variantId === 'open-face') {
          flangeMesh.visible = false;
        } else if (variantId === 'partial-flange') {
          flangeMesh.visible = true;
          flangeMesh.scale.y = 0.45;
        } else {
          flangeMesh.visible = true;
          flangeMesh.scale.y = 1.0;
        }
      }
    } else if (lectureId === 'lecture-8') {
      const stage = Math.round(param);
      if (hopelessTeethRow) hopelessTeethRow.visible = stage === 0;
      if (trimmedRidgeMesh) {
        trimmedRidgeMesh.visible = stage >= 1;
        trimmedRidgeMesh.scale.y = variantId === 'over-trimmed' ? 0.55 : 1.0;
      }
      if (splintMesh) {
        splintMesh.visible = stage >= 2;
        splintMesh.material = stage === 3 ? acrylicMat : clearSplintMat;
      }
    } else if (lectureId === 'lecture-9') {
      if (defectBlockMesh) {
        const cls = Math.round(param);
        if (variantId === 'cantor-1') {
          defectBlockMesh.position.set(0.75, 0.55, 0);
          defectBlockMesh.scale.set(0.65, 0.5, 0.9);
        } else if (variantId === 'cantor-2') {
          defectBlockMesh.position.set(0.75, 0.35, -0.1);
          defectBlockMesh.scale.set(0.85, 1.25, 1.15);
        } else if (cls === 3) {
          defectBlockMesh.position.set(0, 0.5, -0.1);
          defectBlockMesh.scale.set(0.7, 0.85, 0.75);
        } else if (cls === 4) {
          defectBlockMesh.position.set(-0.25, 0.46, 0.25);
          defectBlockMesh.scale.set(1.35, 0.95, 1.1);
        } else if (cls === 5) {
          defectBlockMesh.position.set(0, 0.46, -0.55);
          defectBlockMesh.scale.set(2.1, 0.9, 0.75);
        } else if (cls === 6) {
          defectBlockMesh.position.set(0, 0.46, 0.85);
          defectBlockMesh.scale.set(1.5, 0.9, 0.65);
        } else if (cls === 2) {
          defectBlockMesh.position.set(-0.7, 0.46, -0.45);
          defectBlockMesh.scale.set(0.95, 0.9, 0.85);
        } else {
          defectBlockMesh.position.set(-0.62, 0.46, 0.05);
          defectBlockMesh.scale.set(1.0, 0.95, 1.2);
        }
      }
    } else if (lectureId === 'lecture-10') {
      const healScale = 0.75 + (param / 100) * 0.35;
      if (hollowBulbMesh) {
        hollowBulbMesh.visible = variantId !== 'surgical';
        hollowBulbMesh.scale.set(0.95 * healScale, 0.78, 1.25 * healScale);
        (hollowBulbMesh.material as THREE.MeshPhysicalMaterial).opacity = variantId === 'interim' ? 0.68 : 0.94;
      }
      if (claspGroup) claspGroup.visible = variantId !== 'surgical';
      if (implantGroup) implantGroup.visible = variantId === 'definitive';
    }
  };

  const setLayerVisibility = (layers: Record<string, boolean>) => {
    boneGroup.visible = layers['bone'] ?? true;
    mucosaGroup.visible = layers['mucosa'] ?? true;
    prosthesisGroup.visible = layers['prosthesis'] ?? true;
    teethGroup.visible = layers['teeth'] ?? true;
  };

  const dispose = createResourceDisposer(root, disposables);

  return { root, hotspotMeshes, updateSimulation, setLayerVisibility, dispose };
}
