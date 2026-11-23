import * as THREE from 'three';

/**
 * Builds a multi-part cutaway 3D tooth (enamel crown, dentin root, cementum sheath,
 * internal pulp/canal space, and optional lateral/apical foramen curvature).
 */
export function buildCutawayToothGroup(options?: {
  curved?: boolean;
  openApex?: boolean;
  resorption?: boolean;
  dentinTexture?: THREE.Texture;
}): {
  group: THREE.Group;
  enamelMesh: THREE.Mesh;
  dentinMesh: THREE.Mesh;
  cementumMesh: THREE.Mesh;
  canalMesh: THREE.Mesh;
  canalCurve: THREE.CatmullRomCurve3;
} {
  const group = new THREE.Group();

  // Outer tooth profile (Lathe cutaway: phiLength = 1.25 * PI to reveal internal canal)
  const phiStart = Math.PI * 0.25;
  const phiLen = Math.PI * 1.48;

  // 1. Enamel crown cap (y: 0.7 to 2.2)
  const enamelPts: THREE.Vector2[] = [
    new THREE.Vector2(0.01, 2.25),
    new THREE.Vector2(0.62, 2.2),
    new THREE.Vector2(0.88, 1.95),
    new THREE.Vector2(0.92, 1.45),
    new THREE.Vector2(0.82, 0.9),
    new THREE.Vector2(0.68, 0.68),
    new THREE.Vector2(0.55, 0.7),
    new THREE.Vector2(0.64, 1.2),
    new THREE.Vector2(0.56, 1.8),
    new THREE.Vector2(0.01, 1.92),
  ];
  const enamelGeo = new THREE.LatheGeometry(enamelPts, 40, phiStart, phiLen);
  const enamelMat = new THREE.MeshPhysicalMaterial({
    color: 0xf4f1e6,
    roughness: 0.16,
    metalness: 0.0,
    clearcoat: 0.9,
    clearcoatRoughness: 0.12,
    side: THREE.DoubleSide,
  });
  const enamelMesh = new THREE.Mesh(enamelGeo, enamelMat);
  enamelMesh.castShadow = true;
  enamelMesh.receiveShadow = true;
  group.add(enamelMesh);

  // 2. Dentin core + root (y: -2.35 to 1.92)
  const apexRadius = options?.openApex ? 0.28 : options?.resorption ? 0.22 : 0.11;
  const dentinPts: THREE.Vector2[] = [
    new THREE.Vector2(0.02, 1.92),
    new THREE.Vector2(0.56, 1.8),
    new THREE.Vector2(0.64, 1.2),
    new THREE.Vector2(0.66, 0.68),
    new THREE.Vector2(0.58, 0.1),
    new THREE.Vector2(0.46, -0.8),
    new THREE.Vector2(0.32, -1.65),
    new THREE.Vector2(apexRadius, options?.resorption ? -2.08 : -2.32),
  ];
  const dentinGeo = new THREE.LatheGeometry(dentinPts, 40, phiStart, phiLen);
  const dentinMat = new THREE.MeshStandardMaterial({
    color: 0xe6cf9e,
    map: options?.dentinTexture ?? null,
    roughness: 0.58,
    metalness: 0.0,
    side: THREE.DoubleSide,
  });
  const dentinMesh = new THREE.Mesh(dentinGeo, dentinMat);
  dentinMesh.castShadow = true;
  dentinMesh.receiveShadow = true;
  group.add(dentinMesh);

  // 3. Thin outer cementum sheath along the root
  const cemPts: THREE.Vector2[] = [
    new THREE.Vector2(0.67, 0.68),
    new THREE.Vector2(0.59, 0.1),
    new THREE.Vector2(0.47, -0.8),
    new THREE.Vector2(0.34, -1.65),
    new THREE.Vector2(apexRadius + 0.03, options?.resorption ? -2.08 : -2.35),
  ];
  const cemGeo = new THREE.LatheGeometry(cemPts, 40, phiStart, phiLen);
  const cemMat = new THREE.MeshStandardMaterial({
    color: 0xd1b379,
    roughness: 0.72,
    metalness: 0.0,
    side: THREE.DoubleSide,
  });
  const cementumMesh = new THREE.Mesh(cemGeo, cemMat);
  group.add(cementumMesh);

  // 4. Internal canal lumen curve
  const canalCurve = options?.curved
    ? new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 1.55, 0),
        new THREE.Vector3(0, 0.65, 0),
        new THREE.Vector3(0.03, -0.45, 0),
        new THREE.Vector3(0.18, -1.35, 0),
        new THREE.Vector3(0.42, -2.18, 0),
      ])
    : new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 1.55, 0),
        new THREE.Vector3(0, 0.65, 0),
        new THREE.Vector3(0, -0.5, 0),
        new THREE.Vector3(0.02, -1.6, 0),
        new THREE.Vector3(0.12, options?.resorption ? -2.05 : -2.28, 0),
      ]);

  const canalGeo = new THREE.TubeGeometry(
    canalCurve,
    40,
    options?.openApex ? 0.18 : 0.09,
    16,
    false
  );
  const canalMat = new THREE.MeshStandardMaterial({
    color: 0x7c1f2e,
    roughness: 0.4,
    metalness: 0.05,
    transparent: true,
    opacity: 0.85,
  });
  const canalMesh = new THREE.Mesh(canalGeo, canalMat);
  group.add(canalMesh);

  return { group, enamelMesh, dentinMesh, cementumMesh, canalMesh, canalCurve };
}

export type CrossSectionShapeType =
  | 'square'
  | 'triangle'
  | 'rhomboid'
  | 'hfile'
  | 'sfile'
  | 'broach'
  | 'ushape'
  | 'convexTriangle'
  | 'offsetRect';

/**
 * Builds an articulated multi-part endodontic file (handle + ISO color collar + shaft + helical working blade + tip).
 */
export function buildEndodonticFileGroup(options: {
  handleColor?: number;
  metalColor?: number;
  crossSection?: CrossSectionShapeType;
  nonCuttingTip?: boolean;
  helixTightness?: number;
  length?: number;
  taper?: number;
}): THREE.Group {
  const group = new THREE.Group();
  const totalBladeLen = options.length ?? 2.8;
  const handleColor = options.handleColor ?? 0xdc2626; // Red #25 ISO default
  const metalColor = options.metalColor ?? 0xcfd6e2;

  // 1. Ergonomic fluted handle
  const handleGeo = new THREE.CylinderGeometry(0.17, 0.13, 0.72, 16);
  const handleMat = new THREE.MeshStandardMaterial({
    color: handleColor,
    roughness: 0.35,
    metalness: 0.08,
  });
  const handle = new THREE.Mesh(handleGeo, handleMat);
  handle.position.y = totalBladeLen * 0.5 + 0.52;
  handle.castShadow = true;
  group.add(handle);

  // 2. Gold/metallic collar ring
  const collarGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.12, 16);
  const collarMat = new THREE.MeshStandardMaterial({
    color: 0xc9a24b,
    roughness: 0.25,
    metalness: 0.88,
  });
  const collar = new THREE.Mesh(collarGeo, collarMat);
  collar.position.y = totalBladeLen * 0.5 + 0.12;
  group.add(collar);

  // 3. Smooth shank
  const shankLen = 0.45;
  const shankGeo = new THREE.CylinderGeometry(0.055, 0.055, shankLen, 12);
  const metalMat = new THREE.MeshStandardMaterial({
    color: metalColor,
    roughness: 0.22,
    metalness: 0.92,
  });
  const shank = new THREE.Mesh(shankGeo, metalMat);
  shank.position.y = totalBladeLen * 0.5 - shankLen * 0.35;
  group.add(shank);

  // 4. Helical fluted working section built from stacked twisted profile slices or custom BufferGeometry
  const bladeLen = totalBladeLen - 0.3;
  const segments = 56;
  const radialPts = getCrossSectionProfile(options.crossSection ?? 'square');
  const radialCount = radialPts.length;
  const taper = options.taper ?? 0.04;
  const twistRate = options.helixTightness ?? 7.5;

  const positions: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments; // 0 = tip, 1 = coronal
    const y = -totalBladeLen * 0.5 + 0.12 + t * bladeLen;
    const scale = 0.028 + t * taper * 1.45;
    const offset = options.crossSection === 'offsetRect' ? scale * 0.28 : 0;
    const angleOffset =
      options.crossSection === 'broach' ? 0 : t * Math.PI * 2 * twistRate;

    for (let j = 0; j < radialCount; j++) {
      const p = radialPts[j];
      const rx = p.x * scale + offset;
      const rz = p.y * scale;
      const cosA = Math.cos(angleOffset);
      const sinA = Math.sin(angleOffset);
      positions.push(rx * cosA - rz * sinA, y, rx * sinA + rz * cosA);
    }
  }

  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < radialCount; j++) {
      const nextJ = (j + 1) % radialCount;
      const a = i * radialCount + j;
      const b = i * radialCount + nextJ;
      const c = (i + 1) * radialCount + j;
      const d = (i + 1) * radialCount + nextJ;
      indices.push(a, c, b, b, c, d);
    }
  }

  const bladeGeo = new THREE.BufferGeometry();
  bladeGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  bladeGeo.setIndex(indices);
  bladeGeo.computeVertexNormals();

  const bladeMat = new THREE.MeshStandardMaterial({
    color: metalColor,
    roughness: 0.22,
    metalness: 0.92,
    side: THREE.DoubleSide,
  });
  const bladeMesh = new THREE.Mesh(bladeGeo, bladeMat);
  bladeMesh.castShadow = true;
  group.add(bladeMesh);

  // Optional barbs for Barbed Broach
  if (options.crossSection === 'broach') {
    const barbGeo = new THREE.ConeGeometry(0.018, 0.075, 6);
    for (let b = 0; b < 14; b++) {
      const t = 0.15 + (b / 14) * 0.78;
      const y = -totalBladeLen * 0.5 + 0.12 + t * bladeLen;
      const angle = b * 1.65;
      const r = 0.032 + t * 0.045;
      const barb = new THREE.Mesh(barbGeo, metalMat);
      barb.position.set(Math.cos(angle) * r, y, Math.sin(angle) * r);
      barb.rotation.z = -Math.PI * 0.35;
      barb.rotation.y = angle;
      group.add(barb);
    }
  }

  // 5. Tip geometry (Rounded non-cutting Batt/Flex-R vs Sharp Pyramid)
  const tipY = -totalBladeLen * 0.5 + 0.11;
  const tipGeo = options.nonCuttingTip
    ? new THREE.SphereGeometry(0.032, 16, 12)
    : new THREE.ConeGeometry(0.034, 0.11, 4);
  const tipMesh = new THREE.Mesh(tipGeo, metalMat);
  tipMesh.position.y = options.nonCuttingTip ? tipY : tipY - 0.04;
  if (!options.nonCuttingTip) {
    tipMesh.rotation.z = Math.PI;
  }
  group.add(tipMesh);

  return group;
}

function getCrossSectionProfile(type: CrossSectionShapeType): THREE.Vector2[] {
  switch (type) {
    case 'square':
      return [
        new THREE.Vector2(1, 0),
        new THREE.Vector2(0.72, 0.72),
        new THREE.Vector2(0, 1),
        new THREE.Vector2(-0.72, 0.72),
        new THREE.Vector2(-1, 0),
        new THREE.Vector2(-0.72, -0.72),
        new THREE.Vector2(0, -1),
        new THREE.Vector2(0.72, -0.72),
      ];
    case 'triangle':
      return [
        new THREE.Vector2(0, 1.05),
        new THREE.Vector2(0.45, 0.25),
        new THREE.Vector2(0.9, -0.55),
        new THREE.Vector2(0, -0.45),
        new THREE.Vector2(-0.9, -0.55),
        new THREE.Vector2(-0.45, 0.25),
      ];
    case 'convexTriangle':
      return [
        new THREE.Vector2(0, 1.05),
        new THREE.Vector2(0.65, 0.42),
        new THREE.Vector2(0.95, -0.52),
        new THREE.Vector2(0, -0.68),
        new THREE.Vector2(-0.95, -0.52),
        new THREE.Vector2(-0.65, 0.42),
      ];
    case 'rhomboid':
      return [
        new THREE.Vector2(0, 1.25),
        new THREE.Vector2(0.52, 0),
        new THREE.Vector2(0, -1.25),
        new THREE.Vector2(-0.52, 0),
      ];
    case 'hfile':
      return [
        new THREE.Vector2(1.05, 0),
        new THREE.Vector2(0.55, 0.4),
        new THREE.Vector2(-0.2, 0.85),
        new THREE.Vector2(-0.75, 0.2),
        new THREE.Vector2(-0.85, -0.55),
        new THREE.Vector2(0.25, -0.75),
      ];
    case 'sfile':
      return [
        new THREE.Vector2(0.95, 0.35),
        new THREE.Vector2(0.35, 0.9),
        new THREE.Vector2(-0.4, 0.3),
        new THREE.Vector2(-0.95, -0.35),
        new THREE.Vector2(-0.35, -0.9),
        new THREE.Vector2(0.4, -0.3),
      ];
    case 'ushape':
      return [
        new THREE.Vector2(0.95, 0.45),
        new THREE.Vector2(0.5, 0.45),
        new THREE.Vector2(0.35, 0.85),
        new THREE.Vector2(-0.35, 0.85),
        new THREE.Vector2(-0.5, 0.45),
        new THREE.Vector2(-0.95, 0.45),
        new THREE.Vector2(-0.85, -0.55),
        new THREE.Vector2(0, -0.95),
        new THREE.Vector2(0.85, -0.55),
      ];
    case 'offsetRect':
      return [
        new THREE.Vector2(0.95, 0.55),
        new THREE.Vector2(-0.95, 0.55),
        new THREE.Vector2(-0.95, -0.55),
        new THREE.Vector2(0.95, -0.55),
      ];
    case 'broach':
    default: {
      const pts: THREE.Vector2[] = [];
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        pts.push(new THREE.Vector2(Math.cos(a) * 0.72, Math.sin(a) * 0.72));
      }
      return pts;
    }
  }
}

/**
 * Builds a sleek 2D axial cross-section prism for close-up inspection.
 */
export function buildCrossSectionDisc(type: CrossSectionShapeType, color = 0xc9a24b): THREE.Mesh {
  const pts = getCrossSectionProfile(type);
  const shape = new THREE.Shape();
  pts.forEach((p, idx) => {
    if (idx === 0) shape.moveTo(p.x * 0.65, p.y * 0.65);
    else shape.lineTo(p.x * 0.65, p.y * 0.65);
  });
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.16,
    bevelEnabled: true,
    bevelSize: 0.03,
    bevelThickness: 0.03,
    bevelSegments: 2,
  });
  geo.center();
  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.25,
    metalness: 0.85,
  });
  return new THREE.Mesh(geo, mat);
}
