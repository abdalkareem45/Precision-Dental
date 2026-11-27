import * as THREE from 'three';
import type { Sandbox3DConfig } from '@/src/types/lecture';

export interface SceneBuildHandle {
  root: THREE.Group;
  structureMeshes: Map<string, THREE.Object3D[]>;
  updateStage: (stageIdx: number, elapsed: number, toolIdx?: number) => void;
}

function makeMat(color: string, opts?: Partial<THREE.MeshPhysicalMaterialParameters>) {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    roughness: 0.38,
    metalness: 0.05,
    clearcoat: 0.25,
    clearcoatRoughness: 0.25,
    transparent: true,
    opacity: 1,
    ...opts,
  });
}

function tagMesh(
  obj: THREE.Object3D,
  structureId: string | undefined,
  map: Map<string, THREE.Object3D[]>
) {
  if (!structureId) return;
  obj.traverse((child) => {
    child.userData.structureId = structureId;
    if ((child as THREE.Mesh).isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  const list = map.get(structureId) || [];
  list.push(obj);
  map.set(structureId, list);
}

/**
 * Generates genuinely distinct, multi-part procedural 3D anatomical, pathological,
 * and clinical-exam assemblies specific to each of the 30 sandboxes (10 lectures x 3 slots).
 * Guarantees every configured structure ID maps to interactive 3D geometry.
 */
export function buildClinical3DScene(config: Sandbox3DConfig): SceneBuildHandle {
  const root = new THREE.Group();
  const structureMeshes = new Map<string, THREE.Object3D[]>();
  const key = config.sceneKey;
  const sIds = config.structures.map((s) => s.id);
  const sColor = (idx: number, fallback: string) => config.structures[idx]?.color || fallback;

  // Base clinical turntable pedestal
  const pedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(1.75, 1.85, 0.1, 48),
    new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.55, metalness: 0.25 })
  );
  pedestal.position.y = -1.25;
  pedestal.receiveShadow = true;
  root.add(pedestal);

  const ringAccent = new THREE.Mesh(
    new THREE.TorusGeometry(1.78, 0.02, 12, 64),
    new THREE.MeshStandardMaterial({ color: 0xc9a24b, roughness: 0.25, metalness: 0.85 })
  );
  ringAccent.rotation.x = Math.PI / 2;
  ringAccent.position.y = -1.2;
  root.add(ringAccent);

  const animRefs: Record<string, THREE.Object3D> = {};

  if (key.startsWith('l6-')) {
    // TMJ Anatomical, Derangement & Exam Assembly
    const fossaGroup = new THREE.Group();
    const eminence = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.45, 0.9, 16, 24),
      makeMat('#E5DEC9', { roughness: 0.45 })
    );
    eminence.rotation.z = Math.PI / 2;
    eminence.position.set(-0.45, 0.72, 0);
    const glenoid = new THREE.Mesh(
      new THREE.TorusGeometry(0.65, 0.16, 16, 36, Math.PI),
      makeMat('#E5DEC9', { roughness: 0.45 })
    );
    glenoid.position.set(0.25, 0.65, 0);
    fossaGroup.add(eminence, glenoid);
    root.add(fossaGroup);

    const condyleGroup = new THREE.Group();
    const ramus = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.34, 1.35, 24),
      makeMat(sColor(0, '#E5DEC9'), { roughness: 0.48 })
    );
    ramus.position.y = -0.55;
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.36, 28, 24),
      makeMat(sColor(0, '#EFE8D4'), { roughness: 0.4 })
    );
    head.scale.set(1.1, 0.88, 1.25);
    head.position.y = 0.12;
    condyleGroup.add(ramus, head);
    condyleGroup.position.set(0.25, -0.05, 0);
    root.add(condyleGroup);
    animRefs.condyle = condyleGroup;

    const discMesh = new THREE.Mesh(
      new THREE.TorusGeometry(0.36, 0.1, 16, 32),
      makeMat(sColor(1, '#3B82F6'), { clearcoat: 0.6, roughness: 0.25 })
    );
    discMesh.rotation.x = Math.PI / 2;
    discMesh.scale.set(1.15, 1.0, 0.55);
    discMesh.position.set(0.22, 0.44, 0);
    root.add(discMesh);
    animRefs.disc = discMesh;

    const retroPad = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 16, 16),
      makeMat(sColor(2, '#DC2626'))
    );
    retroPad.position.set(0.68, 0.44, 0);
    root.add(retroPad);

    const dmlCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.55, 0.44, 0),
      new THREE.Vector3(0.95, 0.56, 0.25),
      new THREE.Vector3(1.25, 0.62, 0.45),
    ]);
    const dmlTube = new THREE.Mesh(
      new THREE.TubeGeometry(dmlCurve, 20, 0.045, 10, false),
      makeMat(sColor(3, '#C9A24B'))
    );
    root.add(dmlTube);

    if (key === 'l6-tmj-anatomy') {
      tagMesh(condyleGroup, sIds[0], structureMeshes);
      tagMesh(discMesh, sIds[1], structureMeshes);
      tagMesh(retroPad, sIds[2], structureMeshes);
      tagMesh(dmlTube, sIds[3], structureMeshes);
      tagMesh(fossaGroup, sIds[0], structureMeshes);
    } else if (key === 'l6-tmj-derangement') {
      tagMesh(discMesh, sIds[0], structureMeshes);
      tagMesh(fossaGroup, sIds[1], structureMeshes);
      tagMesh(condyleGroup, sIds[1] || sIds[0], structureMeshes);
    } else {
      // l6-tmj-exam
      tagMesh(condyleGroup, sIds[0], structureMeshes);
      tagMesh(retroPad, sIds[1] || sIds[0], structureMeshes);
      tagMesh(fossaGroup, sIds[1] || sIds[0], structureMeshes);
    }
  } else if (key.startsWith('l7-')) {
    // Cranial Nerve Trigeminal / Vascular / Temporal Artery Assembly
    const skullCore = new THREE.Mesh(
      new THREE.SphereGeometry(0.92, 32, 24),
      makeMat('#94A3B8', { opacity: 0.22, depthWrite: false, roughness: 0.25 })
    );
    skullCore.scale.set(1.05, 1.15, 0.95);
    root.add(skullCore);

    const ganglion = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 24, 24),
      makeMat(sColor(0, '#14B8A6'), { emissive: new THREE.Color('#0D9488'), emissiveIntensity: 0.3 })
    );
    ganglion.scale.set(1.3, 0.85, 0.8);
    ganglion.position.set(-0.35, 0.15, 0.5);
    root.add(ganglion);
    tagMesh(ganglion, sIds[0], structureMeshes);

    const branchDefs = [
      { pts: [[-0.3, 0.2, 0.5], [0.2, 0.55, 0.72], [0.75, 0.82, 0.58]], color: sColor(0, '#14B8A6'), idx: 0 },
      { pts: [[-0.3, 0.12, 0.5], [0.3, 0.18, 0.82], [0.9, 0.12, 0.58]], color: sColor(1, '#3B82F6'), idx: 1 },
      { pts: [[-0.3, 0.05, 0.5], [0.2, -0.4, 0.72], [0.8, -0.7, 0.45]], color: sColor(1, '#3B82F6'), idx: 1 },
    ];
    branchDefs.forEach((b, i) => {
      const curve = new THREE.CatmullRomCurve3(b.pts.map((p) => new THREE.Vector3(p[0], p[1], p[2])));
      const tube = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 32, 0.048, 12, false),
        makeMat(b.color, { emissive: new THREE.Color(b.color), emissiveIntensity: 0.25 })
      );
      root.add(tube);
      animRefs[`nerve_${i}`] = tube;
      tagMesh(tube, sIds[b.idx] || sIds[0], structureMeshes);
    });

    const arteryCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.75, 0.4, 0.25),
      new THREE.Vector3(-0.36, 0.22, 0.48),
      new THREE.Vector3(-0.15, -0.25, 0.35),
    ]);
    const artery = new THREE.Mesh(
      new THREE.TubeGeometry(arteryCurve, 28, 0.065, 12, false),
      makeMat(sColor(2, '#EF4444'))
    );
    root.add(artery);
    animRefs.artery = artery;
    tagMesh(artery, sIds[2] || sIds[1] || sIds[0], structureMeshes);

    if (sIds[3]) {
      const cn9Curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.45, -0.35, 0.2),
        new THREE.Vector3(0.05, -0.58, 0.35),
        new THREE.Vector3(0.55, -0.72, 0.12),
      ]);
      const cn9 = new THREE.Mesh(
        new THREE.TubeGeometry(cn9Curve, 24, 0.042, 10, false),
        makeMat(sColor(3, '#C9A24B'))
      );
      root.add(cn9);
      tagMesh(cn9, sIds[3], structureMeshes);
    }
  } else if (key.startsWith('l8-')) {
    // Salivary Glands & Ductal System
    const parotidGroup = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      const lobe = new THREE.Mesh(new THREE.SphereGeometry(0.24, 18, 18), makeMat(sColor(0, '#F4A29E')));
      lobe.position.set(-0.65 + (i % 2) * 0.2, 0.35 - Math.floor(i / 2) * 0.22, (i % 3) * 0.12 - 0.1);
      parotidGroup.add(lobe);
    }
    const stensenCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.45, 0.2, 0.2),
      new THREE.Vector3(0.15, 0.25, 0.45),
      new THREE.Vector3(0.8, 0.2, 0.35),
    ]);
    const stensen = new THREE.Mesh(new THREE.TubeGeometry(stensenCurve, 24, 0.042, 10, false), makeMat('#FB7185'));
    parotidGroup.add(stensen);
    root.add(parotidGroup);
    animRefs.parotid = parotidGroup;
    tagMesh(parotidGroup, sIds[0], structureMeshes);

    const submandGroup = new THREE.Group();
    const smGland = new THREE.Mesh(new THREE.SphereGeometry(0.32, 22, 22), makeMat(sColor(1, '#F59E0B')));
    smGland.scale.set(1.25, 0.85, 0.9);
    smGland.position.set(-0.15, -0.55, 0.15);
    const whartonCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.1, -0.5, 0.22),
      new THREE.Vector3(0.42, -0.38, 0.42),
      new THREE.Vector3(0.88, -0.25, 0.32),
    ]);
    const wharton = new THREE.Mesh(new THREE.TubeGeometry(whartonCurve, 24, 0.04, 10, false), makeMat('#FBBF24'));
    const stone = new THREE.Mesh(new THREE.DodecahedronGeometry(0.12, 1), makeMat('#FEF08A', { roughness: 0.65 }));
    stone.position.set(0.45, -0.37, 0.42);
    submandGroup.add(smGland, wharton, stone);
    root.add(submandGroup);
    animRefs.stone = stone;
    tagMesh(submandGroup, sIds[1] || sIds[0], structureMeshes);

    const sublingual = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.15, 0.38, 12, 18),
      makeMat(sColor(2, '#38BDF8'))
    );
    sublingual.rotation.z = Math.PI / 2.2;
    sublingual.position.set(0.55, -0.48, 0.28);
    root.add(sublingual);
    tagMesh(sublingual, sIds[2] || sIds[1] || sIds[0], structureMeshes);
  } else if (key.startsWith('l9-') || key.startsWith('l10-')) {
    // Stratified Mucosa / Desmosome / Hemidesmosome / Blister Split Plane
    const lamina = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.48, 1.5),
      makeMat(sColor(3, '#FBCFE8'), { roughness: 0.55 })
    );
    lamina.position.y = -0.65;
    root.add(lamina);
    tagMesh(lamina, sIds[3] || sIds[sIds.length - 1], structureMeshes);

    const bmz = new THREE.Mesh(
      new THREE.BoxGeometry(2.42, 0.09, 1.52),
      makeMat(sColor(2, '#C9A24B'), { metalness: 0.2 })
    );
    bmz.position.y = -0.37;
    root.add(bmz);
    animRefs.bmz = bmz;
    tagMesh(bmz, sIds[2] || sIds[sIds.length - 1], structureMeshes);

    const basalGroup = new THREE.Group();
    for (let x = -4; x <= 4; x++) {
      const cell = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.11, 0.16, 8, 14),
        makeMat(sColor(1, '#FB7185'))
      );
      cell.position.set(x * 0.24, -0.18, 0.25);
      basalGroup.add(cell);
    }
    root.add(basalGroup);
    animRefs.basal = basalGroup;
    tagMesh(basalGroup, sIds[1] || sIds[0], structureMeshes);

    const upperEpi = new THREE.Mesh(
      new THREE.BoxGeometry(2.38, 0.56, 1.48),
      makeMat(sColor(0, '#F4A29E'), { roughness: 0.35 })
    );
    upperEpi.position.y = 0.28;
    root.add(upperEpi);
    animRefs.upperEpi = upperEpi;
    tagMesh(upperEpi, sIds[0], structureMeshes);

    const bulla = new THREE.Mesh(
      new THREE.SphereGeometry(0.45, 28, 20),
      makeMat(key.startsWith('l10-') ? '#38BDF8' : '#DC2626', {
        opacity: 0.68,
        depthWrite: false,
        roughness: 0.18,
      })
    );
    bulla.scale.set(1.2, 0.55, 1.0);
    bulla.position.set(0, 0.62, 0.15);
    root.add(bulla);
    animRefs.bulla = bulla;
    tagMesh(bulla, sIds[1] || sIds[0], structureMeshes);
  } else if (key.startsWith('l5-')) {
    // Intravascular Hematology: Vessel Wall, RBCs, WBCs, Platelets, Fibrin
    const vessel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.95, 0.95, 2.7, 36, 1, true),
      makeMat('#7F1D1D', { opacity: 0.25, depthWrite: false, side: THREE.DoubleSide, roughness: 0.4 })
    );
    vessel.rotation.z = Math.PI / 2;
    root.add(vessel);

    const rbcGroup = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      const rbc = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.085, 14, 28), makeMat(sColor(0, '#DC2626')));
      rbc.position.set(-0.9 + i * 0.36, Math.sin(i * 1.4) * 0.28, Math.cos(i) * 0.28);
      rbc.rotation.set(i * 0.6, i * 0.4, 0.3);
      rbcGroup.add(rbc);
    }
    root.add(rbcGroup);
    animRefs.rbc = rbcGroup;
    tagMesh(rbcGroup, sIds[0], structureMeshes);

    const wbc = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.26, 2),
      makeMat(sColor(1, '#E2E8F0'), { roughness: 0.45 })
    );
    wbc.position.set(-0.25, 0.32, 0.18);
    root.add(wbc);
    animRefs.wbc = wbc;
    tagMesh(wbc, sIds[1] || sIds[0], structureMeshes);

    const platelets = new THREE.Group();
    for (let p = 0; p < 5; p++) {
      const plt = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.09, 0),
        makeMat(sColor(2, '#F59E0B'))
      );
      plt.position.set(-0.1 + p * 0.15, -0.35 + (p % 2) * 0.12, 0.22);
      platelets.add(plt);
    }
    root.add(platelets);
    tagMesh(platelets, sIds[2] || sIds[1] || sIds[0], structureMeshes);

    const fibrinGroup = new THREE.Group();
    for (let j = 0; j < 5; j++) {
      const strand = new THREE.Mesh(
        new THREE.CylinderGeometry(0.022, 0.022, 1.1, 8),
        makeMat(sColor(3, '#C9A24B'), { metalness: 0.35 })
      );
      strand.position.set(0.55, 0, (j - 2) * 0.12);
      strand.rotation.set(0.5 * j, 0.4, Math.PI / 3 + j * 0.25);
      fibrinGroup.add(strand);
    }
    root.add(fibrinGroup);
    animRefs.fibrin = fibrinGroup;
    tagMesh(fibrinGroup, sIds[3] || sIds[sIds.length - 1], structureMeshes);
  } else if (key.startsWith('l4-')) {
    // Thyroid, Liver, Kidney / Specimen Tubes
    const thyroid = new THREE.Group();
    const lLobe = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 0.38, 10, 16), makeMat(sColor(0, '#38BDF8')));
    lLobe.position.set(-0.35, 0.65, 0.25);
    const rLobe = lLobe.clone();
    rLobe.position.x = 0.05;
    thyroid.add(lLobe, rLobe);
    root.add(thyroid);
    tagMesh(thyroid, sIds[0], structureMeshes);

    const liver = new THREE.Mesh(
      new THREE.ConeGeometry(0.7, 1.25, 24),
      makeMat(sColor(1, '#9A3412'), { roughness: 0.42 })
    );
    liver.rotation.z = -Math.PI / 2.3;
    liver.position.set(-0.32, 0.02, 0);
    root.add(liver);
    animRefs.liver = liver;
    tagMesh(liver, sIds[1] || sIds[0], structureMeshes);

    const kidney = new THREE.Mesh(
      new THREE.TorusGeometry(0.28, 0.14, 16, 28, Math.PI * 1.4),
      makeMat(sColor(2, '#DC2626'))
    );
    kidney.position.set(0.72, -0.3, 0.15);
    root.add(kidney);
    tagMesh(kidney, sIds[2] || sIds[1] || sIds[0], structureMeshes);
  } else if (key.startsWith('l2-')) {
    // Cervical Lymphatic Chains, Jugular Chain, Virchow Node & Thyroid/Orbit
    const neckAxis = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.58, 1.8, 28),
      makeMat('#E2E8F0', { opacity: 0.24, depthWrite: false, roughness: 0.3 })
    );
    root.add(neckAxis);

    // Submental & Submandibular nodes (sIds[0])
    const subNodes = new THREE.Group();
    [
      [0, 0.62, 0.52],
      [-0.42, 0.45, 0.42],
      [0.42, 0.45, 0.42],
    ].forEach((c) => {
      const node = new THREE.Mesh(new THREE.SphereGeometry(0.15, 18, 18), makeMat(sColor(0, '#14B8A6')));
      node.scale.set(1.2, 0.9, 0.85);
      node.position.set(c[0], c[1], c[2]);
      subNodes.add(node);
    });
    root.add(subNodes);
    tagMesh(subNodes, sIds[0], structureMeshes);

    // Jugular chain (sIds[1])
    const jugNodes = new THREE.Group();
    [
      [-0.55, 0.05, 0.25],
      [0.55, 0.05, 0.25],
      [-0.58, -0.35, 0.2],
      [0.58, -0.35, 0.2],
    ].forEach((c) => {
      const node = new THREE.Mesh(new THREE.SphereGeometry(0.14, 18, 18), makeMat(sColor(1, '#3B82F6')));
      node.position.set(c[0], c[1], c[2]);
      jugNodes.add(node);
    });
    root.add(jugNodes);
    animRefs.nodes = jugNodes;
    tagMesh(jugNodes, sIds[1] || sIds[0], structureMeshes);

    // Virchow supraclavicular node (sIds[2])
    const virchow = new THREE.Mesh(new THREE.SphereGeometry(0.21, 20, 20), makeMat(sColor(2, '#DC2626')));
    virchow.position.set(0.62, -0.72, 0.42);
    root.add(virchow);
    animRefs.virchow = virchow;
    tagMesh(virchow, sIds[2] || sIds[1] || sIds[0], structureMeshes);

    // Thyroid butterfly (sIds[3])
    const thyroid = new THREE.Mesh(
      new THREE.TorusGeometry(0.26, 0.11, 14, 28, Math.PI * 1.25),
      makeMat(sColor(3, '#F59E0B'))
    );
    thyroid.rotation.z = Math.PI * 0.88;
    thyroid.position.set(0, -0.25, 0.56);
    root.add(thyroid);
    tagMesh(thyroid, sIds[3] || sIds[1] || sIds[0], structureMeshes);
  } else {
    // Lectures 1 & 3: Oral Arch, Palate, Tongue & Neurologic Model
    const tongue = new THREE.Mesh(
      new THREE.SphereGeometry(0.62, 28, 22),
      makeMat(sColor(0, '#E07A7A'), { roughness: 0.48 })
    );
    tongue.scale.set(0.95, 0.38, 1.35);
    tongue.position.set(0, -0.15, 0.15);
    root.add(tongue);
    animRefs.tongue = tongue;
    tagMesh(tongue, sIds[0], structureMeshes);

    const palate = new THREE.Mesh(
      new THREE.CylinderGeometry(0.72, 0.72, 0.12, 32, 1, false, 0, Math.PI),
      makeMat(sColor(1, '#D99B7E'))
    );
    palate.rotation.y = -Math.PI / 2;
    palate.position.set(0, 0.56, 0.1);
    root.add(palate);
    tagMesh(palate, sIds[1] || sIds[0], structureMeshes);

    const neuroStrand = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.28, 0.045, 64, 10, 2, 3),
      makeMat(sColor(2, '#14B8A6'), { emissive: new THREE.Color('#0F766E'), emissiveIntensity: 0.25 })
    );
    neuroStrand.position.set(0, -0.58, 0.25);
    root.add(neuroStrand);
    animRefs.neuro = neuroStrand;
    tagMesh(neuroStrand, sIds[2] || sIds[1] || sIds[0], structureMeshes);

    const archGroup = new THREE.Group();
    const upperArch = new THREE.Mesh(
      new THREE.TorusGeometry(0.85, 0.15, 16, 40, Math.PI),
      makeMat(sColor(3, '#F5E6D3'), { roughness: 0.3 })
    );
    upperArch.rotation.x = Math.PI / 2;
    upperArch.position.set(0, 0.42, 0);
    const lowerArch = upperArch.clone();
    lowerArch.position.set(0, -0.35, 0);
    archGroup.add(upperArch, lowerArch);
    root.add(archGroup);
    tagMesh(archGroup, sIds[3] || sIds[sIds.length - 1] || sIds[0], structureMeshes);
  }

  // Clinical exam probe/beacon visible in 'exam' slot when tools are toggled
  let examProbe: THREE.Mesh | null = null;
  if (config.slot === 'exam') {
    examProbe = new THREE.Mesh(
      new THREE.ConeGeometry(0.1, 0.42, 16),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.45, metalness: 0.5, roughness: 0.2 })
    );
    examProbe.rotation.x = Math.PI;
    examProbe.position.set(0, 0.95, 0.55);
    root.add(examProbe);
  }

  const updateStage = (stageIdx: number, elapsed: number, toolIdx = 0) => {
    const pulse = Math.sin(elapsed * 2.2) * 0.04;
    if (examProbe) {
      const xPos = toolIdx === 0 ? -0.45 : toolIdx === 1 ? 0.45 : 0;
      examProbe.position.set(xPos, 0.88 + pulse * 1.4, 0.55);
    }
    if (animRefs.condyle && animRefs.disc) {
      if (key === 'l6-tmj-anatomy') {
        const t = stageIdx === 0 ? 0 : stageIdx === 1 ? 0.35 : 0.95;
        animRefs.condyle.position.set(0.25 - t * 0.75, -0.05 - t * 0.25, 0);
        animRefs.condyle.rotation.z = t * 0.42;
        animRefs.disc.position.set(0.22 - t * 0.72, 0.44 - t * 0.14, 0);
      } else {
        if (stageIdx === 0) {
          animRefs.disc.position.set(-0.22 + pulse, 0.38, 0);
          animRefs.condyle.position.set(0.15, -0.05, 0);
        } else if (stageIdx === 1) {
          animRefs.disc.position.set(-0.55, 0.28, 0);
          animRefs.condyle.position.set(0.22, -0.1, 0);
        } else {
          animRefs.disc.position.set(0.15, 0.42, 0);
          animRefs.condyle.position.set(-0.92, 0.18, 0);
        }
      }
    }
    if (animRefs.upperEpi && animRefs.bulla) {
      const lift = stageIdx === 0 ? 0 : stageIdx === 1 ? 0.24 : 0.46;
      animRefs.upperEpi.position.y = 0.28 + lift + pulse * 0.3;
      animRefs.bulla.scale.set(1.2 + lift * 0.6, 0.45 + lift * 1.1, 1.0 + lift * 0.4);
    }
    if (animRefs.tongue) {
      if (key === 'l3-cn12-palsy') {
        const dev = stageIdx === 0 ? 0 : stageIdx === 1 ? 0.32 : -0.32;
        animRefs.tongue.rotation.y = dev;
        animRefs.tongue.position.z = 0.28 + pulse;
      } else {
        animRefs.tongue.position.y = -0.15 + pulse * 0.4;
      }
    }
    if (animRefs.rbc) {
      animRefs.rbc.children.forEach((c, idx) => {
        c.position.x = -0.9 + ((idx * 0.36 + elapsed * (stageIdx === 2 ? 0.08 : 0.35)) % 2.1);
        c.scale.setScalar(stageIdx === 2 ? 0.85 : 1);
        if (stageIdx === 2) c.scale.x = 1.65;
      });
    }
    if (animRefs.virchow) {
      const s = stageIdx === 0 ? 0.75 : stageIdx === 1 ? 1.15 : 1.45;
      animRefs.virchow.scale.setScalar(s + pulse * 0.3);
    }
    if (animRefs.artery) {
      const s = stageIdx === 2 ? 1.45 : 1.0;
      animRefs.artery.scale.setScalar(s + pulse * 0.25);
    }
  };

  return { root, structureMeshes, updateStage };
}
