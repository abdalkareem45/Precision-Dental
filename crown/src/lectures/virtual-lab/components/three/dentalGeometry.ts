import * as THREE from 'three';

export interface DentalMaterialSet {
  enamel: THREE.MeshStandardMaterial;
  dentin: THREE.MeshStandardMaterial;
  pulp: THREE.MeshStandardMaterial;
  gingiva: THREE.MeshStandardMaterial;
  bone: THREE.MeshStandardMaterial;
  porcelain: THREE.MeshStandardMaterial;
  zirconia: THREE.MeshStandardMaterial;
  gold: THREE.MeshStandardMaterial;
  chrome: THREE.MeshStandardMaterial;
  pinkPorcelain: THREE.MeshStandardMaterial;
  tray: THREE.MeshStandardMaterial;
  heavyElastomer: THREE.MeshStandardMaterial;
  lightElastomer: THREE.MeshStandardMaterial;
  cordPrimary: THREE.MeshStandardMaterial;
  cordSecondary: THREE.MeshStandardMaterial;
  stressLow: THREE.MeshStandardMaterial;
  stressMid: THREE.MeshStandardMaterial;
  stressHigh: THREE.MeshStandardMaterial;
  vacuumShell: THREE.MeshStandardMaterial;
}

export function createKnittedCordTexture(baseHex: string, stripeHex: string): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, 64, 32);
    ctx.strokeStyle = stripeHex;
    ctx.lineWidth = 2.5;
    for (let x = -8; x < 72; x += 8) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 8, 16);
      ctx.lineTo(x, 32);
      ctx.stroke();
    }
  }
  if (!ctx) return null;
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(8, 1);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createDentalMaterials(): DentalMaterialSet {
  const cordTexA = createKnittedCordTexture('#4C1D95', '#A78BFA');
  const cordTexB = createKnittedCordTexture('#1D4ED8', '#93C5FD');

  return {
    enamel: new THREE.MeshStandardMaterial({
      color: 0xf4efe2,
      roughness: 0.18,
      metalness: 0.04,
      envMapIntensity: 0.9,
    }),
    dentin: new THREE.MeshStandardMaterial({
      color: 0xe3c284,
      roughness: 0.5,
      metalness: 0.02,
    }),
    pulp: new THREE.MeshStandardMaterial({
      color: 0xc93b4b,
      emissive: 0x3b0910,
      emissiveIntensity: 0.35,
      roughness: 0.35,
      transparent: true,
      opacity: 0.9,
    }),
    gingiva: new THREE.MeshStandardMaterial({
      color: 0xde828e,
      roughness: 0.48,
      metalness: 0.02,
    }),
    bone: new THREE.MeshStandardMaterial({
      color: 0xe7dec7,
      roughness: 0.76,
      metalness: 0.0,
    }),
    porcelain: new THREE.MeshStandardMaterial({
      color: 0xf7f3e8,
      roughness: 0.14,
      metalness: 0.05,
      envMapIntensity: 1.0,
    }),
    zirconia: new THREE.MeshStandardMaterial({
      color: 0xfbf9f4,
      roughness: 0.18,
      metalness: 0.04,
      envMapIntensity: 0.95,
    }),
    gold: new THREE.MeshStandardMaterial({
      color: 0xd4ad4b,
      roughness: 0.22,
      metalness: 0.92,
      envMapIntensity: 1.1,
    }),
    chrome: new THREE.MeshStandardMaterial({
      color: 0x9aa4b4,
      roughness: 0.24,
      metalness: 0.9,
      envMapIntensity: 1.1,
    }),
    pinkPorcelain: new THREE.MeshStandardMaterial({
      color: 0xd97382,
      roughness: 0.22,
      metalness: 0.04,
    }),
    tray: new THREE.MeshStandardMaterial({
      color: 0x1b3a8c,
      roughness: 0.28,
      metalness: 0.08,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
    }),
    heavyElastomer: new THREE.MeshStandardMaterial({
      color: 0x6d28d9,
      roughness: 0.42,
      metalness: 0.0,
    }),
    lightElastomer: new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      roughness: 0.32,
      metalness: 0.0,
    }),
    cordPrimary: new THREE.MeshStandardMaterial(
      cordTexA ? { map: cordTexA, roughness: 0.72 } : { color: 0x4c1d95, roughness: 0.72 }
    ),
    cordSecondary: new THREE.MeshStandardMaterial(
      cordTexB ? { map: cordTexB, roughness: 0.72 } : { color: 0x1d4ed8, roughness: 0.72 }
    ),
    stressLow: new THREE.MeshStandardMaterial({
      color: 0x1b3a8c,
      roughness: 0.35,
    }),
    stressMid: new THREE.MeshStandardMaterial({
      color: 0xc9a24b,
      roughness: 0.3,
    }),
    stressHigh: new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      emissive: 0x7f1d1d,
      emissiveIntensity: 0.3,
      roughness: 0.28,
    }),
    vacuumShell: new THREE.MeshStandardMaterial({
      color: 0xdbeafe,
      roughness: 0.14,
      metalness: 0.1,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
    }),
  };
}

/**
 * Sculpted anatomical molar crown + two roots (lightweight GPU-friendly tessellation).
 */
export function createMolarToothGroup(
  crownMat: THREE.Material,
  rootMat: THREE.Material,
  scale = 1,
  withRoots = true
): THREE.Group {
  const group = new THREE.Group();

  // Cervical collar + coronal body via LatheGeometry (20 radial segments)
  const pts: THREE.Vector2[] = [
    new THREE.Vector2(0.01, 0.0),
    new THREE.Vector2(0.42, 0.04),
    new THREE.Vector2(0.52, 0.28),
    new THREE.Vector2(0.54, 0.62),
    new THREE.Vector2(0.47, 0.88),
    new THREE.Vector2(0.28, 0.82),
    new THREE.Vector2(0.01, 0.78),
  ];
  const crownGeo = new THREE.LatheGeometry(pts, 20);
  crownGeo.scale(1.08, 1.0, 0.94);
  const crownMesh = new THREE.Mesh(crownGeo, crownMat);
  group.add(crownMesh);

  // 4 sculpted cusps on occlusal rim (shared cusp geometry across the 4 cusps on this tooth)
  const cuspOffsets: [number, number][] = [
    [-0.25, -0.22],
    [0.25, -0.22],
    [-0.24, 0.22],
    [0.24, 0.22],
  ];
  const cuspGeo = new THREE.SphereGeometry(0.22, 12, 8);
  cuspGeo.scale(1.1, 0.65, 0.95);
  cuspOffsets.forEach(([x, z]) => {
    const cusp = new THREE.Mesh(cuspGeo, crownMat);
    cusp.position.set(x, 0.84, z);
    group.add(cusp);
  });

  if (withRoots) {
    const rootCurveL = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.22, 0.06, 0),
      new THREE.Vector3(-0.25, -0.52, 0.04),
      new THREE.Vector3(-0.18, -1.08, 0.08),
    ]);
    const rootCurveR = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.22, 0.06, 0),
      new THREE.Vector3(0.24, -0.54, -0.02),
      new THREE.Vector3(0.16, -1.08, 0.04),
    ]);
    const rGeoL = new THREE.TubeGeometry(rootCurveL, 8, 0.14, 8, false);
    const rGeoR = new THREE.TubeGeometry(rootCurveR, 8, 0.14, 8, false);
    const rL = new THREE.Mesh(rGeoL, rootMat);
    const rR = new THREE.Mesh(rGeoR, rootMat);
    group.add(rL, rR);
  }

  group.scale.setScalar(scale);
  return group;
}

/**
 * Sculpted maxillary central incisor crown + conical root (optimized triangle count).
 */
export function createIncisorToothGroup(
  crownMat: THREE.Material,
  rootMat: THREE.Material,
  scale = 1,
  withRoot = true
): THREE.Group {
  const group = new THREE.Group();

  const shape = new THREE.Shape();
  shape.moveTo(-0.32, 0);
  shape.quadraticCurveTo(-0.42, 0.5, -0.38, 1.05);
  shape.lineTo(0.38, 1.05);
  shape.quadraticCurveTo(0.42, 0.5, 0.32, 0);
  shape.closePath();

  const extrudeGeo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.24,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.08,
    bevelThickness: 0.09,
    curveSegments: 8,
  });
  extrudeGeo.translate(0, 0, -0.12);
  const crown = new THREE.Mesh(extrudeGeo, crownMat);
  group.add(crown);

  // Palatal cingulum convexity
  const cingulumGeo = new THREE.SphereGeometry(0.24, 12, 8);
  cingulumGeo.scale(1.1, 0.9, 0.65);
  const cingulum = new THREE.Mesh(cingulumGeo, crownMat);
  cingulum.position.set(0, 0.28, -0.16);
  group.add(cingulum);

  if (withRoot) {
    const rootGeo = new THREE.ConeGeometry(0.24, 1.25, 14);
    rootGeo.rotateX(Math.PI);
    const root = new THREE.Mesh(rootGeo, rootMat);
    root.position.set(0, -0.62, 0);
    group.add(root);
  }

  group.scale.setScalar(scale);
  return group;
}

/**
 * Prepared abutment cone with dynamic convergence angle & finish line margin profile.
 */
export function createPreparedAbutmentGeometry(
  taperDegrees: number,
  marginType: string,
  cutHalf = false
): THREE.LatheGeometry {
  const baseRadius = 0.56;
  const height = 0.92;
  const halfAngleRad = THREE.MathUtils.degToRad(Math.max(1, taperDegrees) / 2);
  const topRadius = Math.max(0.18, baseRadius - Math.tan(halfAngleRad) * height);

  const pts: THREE.Vector2[] = [new THREE.Vector2(0.001, -0.06)];

  if (marginType === 'shoulder') {
    pts.push(new THREE.Vector2(baseRadius + 0.09, -0.06));
    pts.push(new THREE.Vector2(baseRadius + 0.09, 0.04));
    pts.push(new THREE.Vector2(baseRadius - 0.03, 0.04));
  } else if (marginType === 'beveled-shoulder') {
    pts.push(new THREE.Vector2(baseRadius + 0.1, -0.09));
    pts.push(new THREE.Vector2(baseRadius + 0.07, 0.03));
    pts.push(new THREE.Vector2(baseRadius - 0.03, 0.04));
  } else if (marginType === 'heavy-chamfer') {
    pts.push(new THREE.Vector2(baseRadius + 0.09, -0.05));
    pts.push(new THREE.Vector2(baseRadius + 0.05, 0.02));
    pts.push(new THREE.Vector2(baseRadius - 0.02, 0.07));
  } else if (marginType === 'knife-edge') {
    pts.push(new THREE.Vector2(baseRadius + 0.04, -0.06));
    pts.push(new THREE.Vector2(baseRadius + 0.01, 0.04));
  } else {
    // chamfer default
    pts.push(new THREE.Vector2(baseRadius + 0.06, -0.05));
    pts.push(new THREE.Vector2(baseRadius + 0.03, 0.02));
    pts.push(new THREE.Vector2(baseRadius - 0.01, 0.06));
  }

  pts.push(new THREE.Vector2(topRadius + 0.04, height * 0.65));
  pts.push(new THREE.Vector2(topRadius, height));
  pts.push(new THREE.Vector2(topRadius * 0.45, height - 0.05));
  pts.push(new THREE.Vector2(0.001, height - 0.02));

  const phiLength = cutHalf ? Math.PI : Math.PI * 2;
  return new THREE.LatheGeometry(pts, 24, 0, phiLength);
}

export function createArrowGroup(
  color: number,
  length = 0.75,
  shaftRadius = 0.04
): THREE.Group {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.3,
    metalness: 0.15,
  });
  const shaftGeo = new THREE.CylinderGeometry(shaftRadius, shaftRadius, length, 10);
  const shaft = new THREE.Mesh(shaftGeo, mat);
  shaft.position.y = length / 2;

  const headGeo = new THREE.ConeGeometry(shaftRadius * 2.4, length * 0.34, 10);
  const head = new THREE.Mesh(headGeo, mat);
  head.position.y = -length * 0.12;
  head.rotation.x = Math.PI;

  g.add(shaft, head);
  return g;
}

export function disposeObject3D(root: THREE.Object3D, extraMaterials: THREE.Material[] = []): void {
  const disposedGeos = new Set<THREE.BufferGeometry>();
  const disposedMats = new Set<THREE.Material>();
  const disposedTextures = new Set<THREE.Texture>();
  const disposeMaterial = (material: THREE.Material) => {
    if (disposedMats.has(material)) return;
    disposedMats.add(material);
    Object.values(material).forEach((value: unknown) => {
      if (value instanceof THREE.Texture && !disposedTextures.has(value)) {
        disposedTextures.add(value);
        value.dispose();
      }
    });
    material.dispose();
  };
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.geometry && !disposedGeos.has(mesh.geometry)) {
      disposedGeos.add(mesh.geometry);
      mesh.geometry.dispose();
    }
    const mat = mesh.material;
    if (Array.isArray(mat)) {
      mat.forEach(disposeMaterial);
    } else if (mat) {
      disposeMaterial(mat);
    }
  });
  // Include materials temporarily detached by a material/variant switch.
  extraMaterials.forEach(disposeMaterial);
}
