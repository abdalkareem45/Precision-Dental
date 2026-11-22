import * as THREE from 'three';
import { LectureId } from '../../types/lecture';
import {
  createArrowGroup,
  createDentalMaterials,
  createIncisorToothGroup,
  createMolarToothGroup,
  createPreparedAbutmentGeometry,
  DentalMaterialSet,
  disposeObject3D,
} from './dentalGeometry';

export interface SceneLabelAnchor {
  id: string;
  text: string;
  subtext?: string;
  anchor: THREE.Object3D;
  layerId: string;
}

export interface SceneUpdateParams {
  primaryMode: string;
  secondaryMode: string;
  sliderValue: number;
  toggleActive: boolean;
  explodeFactor: number;
  visibleLayers: Record<string, boolean>;
  animate: boolean;
  elapsed: number;
  reducedMotion: boolean;
  liveReadout?: (summary: string) => void;
}

interface LectureSceneContent {
  rootGroup: THREE.Group;
  labels: SceneLabelAnchor[];
  updateState: (params: SceneUpdateParams) => void;
}

export interface BuiltLectureScene extends LectureSceneContent {
  dispose: () => void;
}

function makeLayer(name: string): THREE.Group {
  const g = new THREE.Group();
  g.name = name;
  return g;
}

function makeAnchor(
  parent: THREE.Object3D,
  x: number,
  y: number,
  z: number
): THREE.Object3D {
  const a = new THREE.Object3D();
  a.position.set(x, y, z);
  parent.add(a);
  return a;
}

export function buildLectureScene(lectureId: LectureId): BuiltLectureScene {
  const mats = createDentalMaterials();

  const builders: Record<LectureId, (materials: DentalMaterialSet) => LectureSceneContent> = {
    'lec-04': buildLec04Scene,
    'lec-05': buildLec05Scene,
    'lec-06': buildLec06Scene,
    'lec-07a': buildLec07aScene,
    'lec-07b': buildLec07bScene,
    'lec-10a': buildLec10aScene,
    'lec-10b': buildLec10bScene,
    'lec-11': buildLec11Scene,
    'lec-12': buildLec12Scene,
  };
  const built = builders[lectureId](mats);
  let disposed = false;
  return {
    ...built,
    dispose: () => {
      if (disposed) return;
      disposed = true;
      disposeObject3D(built.rootGroup, Object.values(mats));
    },
  };
}

/* =========================================================================
   LECTURE 04: FPD SPAN DEFLECTION, PIER ABUTMENT & ARCH LEVER ARM
   ========================================================================= */
function buildLec04Scene(mats: DentalMaterialSet): LectureSceneContent {
  const root = new THREE.Group();
  const restorationLayer = makeLayer('restoration');
  const abutmentsLayer = makeLayer('abutments');
  const periodontiumLayer = makeLayer('periodontium');
  const stressLayer = makeLayer('stress');
  root.add(periodontiumLayer, abutmentsLayer, restorationLayer, stressLayer);

  const ridgeMesh = new THREE.Mesh(new THREE.BoxGeometry(6.8, 1.3, 1.5), mats.bone);
  ridgeMesh.position.set(0, -0.65, 0);
  ridgeMesh.receiveShadow = true;
  periodontiumLayer.add(ridgeMesh);

  const mucosaMesh = new THREE.Mesh(new THREE.BoxGeometry(6.85, 0.24, 1.56), mats.gingiva);
  mucosaMesh.position.set(0, 0.08, 0);
  mucosaMesh.receiveShadow = true;
  periodontiumLayer.add(mucosaMesh);

  const leftAbut = createMolarToothGroup(mats.dentin, mats.dentin, 0.95, true);
  leftAbut.position.set(-2.3, 0.2, 0);
  const rightAbut = createMolarToothGroup(mats.dentin, mats.dentin, 1.0, true);
  rightAbut.position.set(2.3, 0.2, 0);
  const pierAbut = createMolarToothGroup(mats.dentin, mats.dentin, 0.85, true);
  pierAbut.position.set(0, 0.2, 0);
  abutmentsLayer.add(leftAbut, rightAbut, pierAbut);

  const retLeft = createMolarToothGroup(mats.porcelain, mats.porcelain, 1.0, false);
  retLeft.position.set(-2.3, 0.25, 0);
  const retRight = createMolarToothGroup(mats.porcelain, mats.porcelain, 1.05, false);
  retRight.position.set(2.3, 0.25, 0);
  const retPier = createMolarToothGroup(mats.gold, mats.gold, 0.9, false);
  retPier.position.set(0, 0.25, 0);
  restorationLayer.add(retLeft, retRight, retPier);

  const pontics: THREE.Group[] = [-1.15, 0, 1.15].map((x) => {
    const p = createMolarToothGroup(mats.porcelain, mats.porcelain, 0.88, false);
    p.position.set(x, 0.35, 0);
    restorationLayer.add(p);
    return p;
  });

  const beamMat = mats.gold.clone();
  const beamBar = new THREE.Mesh(new THREE.BoxGeometry(4.7, 0.26, 0.42), beamMat);
  beamBar.position.set(0, 0.72, 0);
  restorationLayer.add(beamBar);

  const keywayBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.36, 0.34),
    new THREE.MeshStandardMaterial({ color: 0x1b3a8c, metalness: 0.7, roughness: 0.25 })
  );
  keywayBox.position.set(0.46, 0.72, 0);
  restorationLayer.add(keywayBox);

  const leverArcGroup = new THREE.Group();
  for (let i = -1.5; i <= 1.5; i += 1) {
    const inc = createIncisorToothGroup(mats.porcelain, mats.porcelain, 0.78, false);
    inc.position.set(i * 0.68, 0.42, 0.85 - Math.abs(i) * 0.22);
    leverArcGroup.add(inc);
  }
  const fulcrumLine = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 4.6, 10),
    new THREE.MeshStandardMaterial({ color: 0xc9a24b })
  );
  fulcrumLine.rotation.z = Math.PI / 2;
  fulcrumLine.position.set(0, 0.28, 0);
  leverArcGroup.add(fulcrumLine);
  restorationLayer.add(leverArcGroup);

  const mainArrow = createArrowGroup(0xdc2626, 0.9, 0.05);
  mainArrow.position.set(0, 1.95, 0);
  const leftShearArrow = createArrowGroup(0xc9a24b, 0.7, 0.04);
  leftShearArrow.position.set(-2.3, 1.65, 0);
  const rightShearArrow = createArrowGroup(0xc9a24b, 0.7, 0.04);
  rightShearArrow.position.set(2.3, 1.65, 0);
  stressLayer.add(mainArrow, leftShearArrow, rightShearArrow);

  const labels: SceneLabelAnchor[] = [
    { id: 'l1', text: 'Pontic Span (L³)', subtext: '1x → 8x → 27x flexure', anchor: makeAnchor(beamBar, 0, 0.75, 0), layerId: 'restoration' },
    { id: 'l2', text: 'Pier Keyway (Distal)', subtext: 'Breaks fulcrum torque', anchor: makeAnchor(keywayBox, 0.1, 0.45, 0.35), layerId: 'restoration' },
    { id: 'l3', text: 'Terminal Abutment', subtext: 'Resists tensile lift', anchor: makeAnchor(retLeft, 0, 1.2, 0), layerId: 'abutments' },
  ];

  let lastMsg = '';

  const updateState = (params: SceneUpdateParams) => {
    restorationLayer.visible = params.visibleLayers.restoration !== false;
    abutmentsLayer.visible = params.visibleLayers.abutments !== false;
    periodontiumLayer.visible = params.visibleLayers.periodontium !== false;
    stressLayer.visible = params.visibleLayers.stress !== false;

    const spanCount =
      params.primaryMode === '1-pontic'
        ? 1
        : params.primaryMode === '2-pontic'
        ? 2
        : params.primaryMode === '3-pontic'
        ? 3
        : 2;

    const isPier = params.primaryMode === 'pier';
    const halfOG = params.secondaryMode === 'half-og';
    const loadRatio = params.sliderValue / 600;
    const pulse = params.animate && !params.reducedMotion ? 0.85 + 0.15 * Math.sin(params.elapsed * 3.2) : 1;

    const halfSpan = spanCount === 1 ? 1.2 : spanCount === 2 ? 1.85 : 2.45;
    leftAbut.position.x = -halfSpan;
    retLeft.position.x = -halfSpan;
    rightAbut.position.x = halfSpan;
    retRight.position.x = halfSpan;
    leftShearArrow.position.x = -halfSpan;
    rightShearArrow.position.x = halfSpan;

    pierAbut.visible = isPier;
    retPier.visible = isPier;
    keywayBox.visible = isPier;

    if (spanCount === 1) {
      pontics[0].visible = false;
      pontics[1].visible = true;
      pontics[1].position.x = 0;
      pontics[2].visible = false;
    } else if (spanCount === 2 && !isPier) {
      pontics[0].visible = true;
      pontics[0].position.x = -0.62;
      pontics[1].visible = false;
      pontics[2].visible = true;
      pontics[2].position.x = 0.62;
    } else if (isPier) {
      pontics[0].visible = true;
      pontics[0].position.x = -0.95;
      pontics[1].visible = false;
      pontics[2].visible = true;
      pontics[2].position.x = 0.95;
    } else {
      pontics[0].visible = true;
      pontics[0].position.x = -1.2;
      pontics[1].visible = true;
      pontics[1].position.x = 0;
      pontics[2].visible = true;
      pontics[2].position.x = 1.2;
    }

    const lengthMultiplier = isPier ? 1.35 : Math.pow(spanCount, 3);
    const thicknessMultiplier = halfOG ? 8 : 1;
    const totalFlexMultiplier = lengthMultiplier * thicknessMultiplier;
    const visualSag = Math.min(0.32, (totalFlexMultiplier / 54) * loadRatio * pulse * 0.42);

    beamBar.scale.set(halfSpan / 2.35, halfOG ? 0.5 : 1.0, 1);
    beamBar.position.y = 0.72 + params.explodeFactor * 0.75 - visualSag;
    keywayBox.position.y = 0.72 + params.explodeFactor * 0.75 - visualSag * 0.4;
    pontics.forEach((p, idx) => {
      const centerWeight = idx === 1 ? 1.0 : 0.72;
      p.position.y = 0.35 + params.explodeFactor * 0.75 - visualSag * centerWeight;
    });

    if (totalFlexMultiplier >= 16) {
      beamMat.color.setHex(0xdc2626);
    } else if (totalFlexMultiplier >= 8) {
      beamMat.color.setHex(0xc9a24b);
    } else {
      beamMat.color.setHex(0xd4ad4b);
    }

    retLeft.position.y = 0.25 + params.explodeFactor * 0.75;
    retRight.position.y = 0.25 + params.explodeFactor * 0.75;
    retPier.position.y = 0.25 + params.explodeFactor * 0.75;
    periodontiumLayer.position.y = -params.explodeFactor * 0.45;

    leverArcGroup.visible = params.toggleActive;
    leverArcGroup.position.y = params.explodeFactor * 0.5;
    mainArrow.position.set(0, (params.toggleActive ? 1.95 : 1.95 - visualSag), params.toggleActive ? 0.85 : 0);

    const arrowBounce = params.animate && !params.reducedMotion ? Math.sin(params.elapsed * 3.2) * 0.08 : 0;
    mainArrow.position.y += arrowBounce;
    mainArrow.scale.setScalar(0.75 + loadRatio * 0.55);
    leftShearArrow.scale.setScalar(0.7 + loadRatio * 0.35);
    rightShearArrow.scale.setScalar(0.7 + loadRatio * 0.35);

    const msg = isPier
      ? `Pier Abutment + Distal Keyway · Load ${params.sliderValue} N${params.toggleActive ? ' · Anterior Lever Active' : ''}`
      : `Relative Deflection: ${totalFlexMultiplier}x baseline · Load ${params.sliderValue} N${halfOG ? ' (0.5x height = 8x flex)' : ''}`;
    if (msg !== lastMsg && params.liveReadout) {
      lastMsg = msg;
      params.liveReadout(msg);
    }
  };

  return { rootGroup: root, labels, updateState };
}

/* =========================================================================
   LECTURE 05: CROWN PREPARATION, TAPER ANGLE & FINISH LINE GEOMETRY
   ========================================================================= */
function buildLec05Scene(mats: DentalMaterialSet): LectureSceneContent {
  const root = new THREE.Group();
  const crownLayer = makeLayer('crown');
  const prepLayer = makeLayer('prep');
  const pulpLayer = makeLayer('pulp');
  const gingivaLayer = makeLayer('gingiva');
  root.add(gingivaLayer, pulpLayer, prepLayer, crownLayer);

  const gingivaRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.68, 0.16, 16, 36, Math.PI * 1.45),
    mats.gingiva
  );
  gingivaRing.rotation.x = Math.PI / 2;
  gingivaRing.rotation.z = -Math.PI * 0.22;
  gingivaLayer.add(gingivaRing);

  const rootBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.56, 0.36, 0.95, 28),
    mats.bone
  );
  rootBase.position.y = -0.5;
  gingivaLayer.add(rootBase);

  const pulpMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.22, 0.65, 20),
    mats.pulp
  );
  pulpMesh.position.y = 0.35;
  pulpLayer.add(pulpMesh);

  let currentMargin = 'chamfer';
  let currentTaper = 6;
  let currentCut = false;
  let lastSecondaryMode = '';
  let lastMatTransparency: boolean | null = null;
  let lastMsg = '';

  const prepMat = mats.dentin.clone();
  prepMat.side = THREE.DoubleSide;
  const prepMesh = new THREE.Mesh(
    createPreparedAbutmentGeometry(currentTaper, currentMargin, currentCut),
    prepMat
  );
  prepMesh.castShadow = true;
  prepMesh.receiveShadow = true;
  prepLayer.add(prepMesh);

  const crownGroup = createMolarToothGroup(mats.porcelain, mats.porcelain, 1.18, false);
  crownGroup.position.set(0, 0.12, 0);
  crownLayer.add(crownGroup);

  const buccalWindow = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.68, 0.22),
    mats.enamel
  );
  buccalWindow.position.set(0, 0.48, 0.44);
  crownLayer.add(buccalWindow);

  const labels: SceneLabelAnchor[] = [
    { id: 'c5-1', text: 'Convergence Taper', subtext: 'Ideal 5°–6°', anchor: makeAnchor(prepLayer, 0.55, 0.72, 0), layerId: 'prep' },
    { id: 'c5-2', text: 'Finish Line Collar', subtext: 'Supragingival preferred', anchor: makeAnchor(gingivaLayer, -0.68, 0.08, 0.2), layerId: 'gingiva' },
    { id: 'c5-3', text: 'Retainer Shell', subtext: '1.0–1.5 mm occlusal', anchor: makeAnchor(crownLayer, 0, 1.25, 0), layerId: 'crown' },
  ];

  const updateState = (params: SceneUpdateParams) => {
    crownLayer.visible = params.visibleLayers.crown !== false;
    prepLayer.visible = params.visibleLayers.prep !== false;
    pulpLayer.visible = params.visibleLayers.pulp !== false;
    gingivaLayer.visible = params.visibleLayers.gingiva !== false;

    const cut = params.toggleActive;
    if (
      params.primaryMode !== currentMargin ||
      params.sliderValue !== currentTaper ||
      cut !== currentCut
    ) {
      currentMargin = params.primaryMode;
      currentTaper = params.sliderValue;
      currentCut = cut;
      prepMesh.geometry.dispose();
      prepMesh.geometry = createPreparedAbutmentGeometry(currentTaper, currentMargin, currentCut);
    }

    const isThreeQuarter = params.secondaryMode === 'three-quarter';
    buccalWindow.visible = isThreeQuarter;
    if (params.secondaryMode !== lastSecondaryMode) {
      lastSecondaryMode = params.secondaryMode;
      crownGroup.traverse((obj) => {
        const m = obj as THREE.Mesh;
        if (!m.isMesh || m === buccalWindow) return;
        if (params.secondaryMode === 'full-metal') m.material = mats.gold;
        else if (params.secondaryMode === 'pfm') m.material = mats.porcelain;
        else if (params.secondaryMode === 'all-ceramic') m.material = mats.zirconia;
        else m.material = mats.gold;
      });
    }

    if (cut !== lastMatTransparency) {
      lastMatTransparency = cut;
      [mats.porcelain, mats.zirconia, mats.gold].forEach((mat) => {
        mat.transparent = cut;
        mat.opacity = cut ? (mat === mats.gold ? 0.5 : 0.4) : 1.0;
        mat.depthWrite = !cut;
        mat.needsUpdate = true;
      });
    }

    const bob = params.animate && !params.reducedMotion ? 0.25 * (0.5 + 0.5 * Math.sin(params.elapsed * 2)) : 0;
    crownLayer.position.y = (cut ? 0.04 : 0.32) + params.explodeFactor * 1.1 + bob;
    gingivaLayer.position.y = -params.explodeFactor * 0.4;

    const retentionStatus =
      currentTaper <= 8 ? 'Optimal Retention (5–6° Ideal)' : currentTaper <= 16 ? 'Reduced Retention' : 'Severe Over-Taper Risk';
    const msg = `Margin: ${currentMargin.replace('-', ' ')} · Taper: ${currentTaper}° (${retentionStatus})`;
    if (msg !== lastMsg && params.liveReadout) {
      lastMsg = msg;
      params.liveReadout(msg);
    }
  };

  return { rootGroup: root, labels, updateState };
}

/* =========================================================================
   LECTURE 06: PONTIC CROSS-SECTIONS, RIDGE DEFECTS & FLOSS ACCESS
   ========================================================================= */
function buildLec06Scene(mats: DentalMaterialSet): LectureSceneContent {
  const root = new THREE.Group();
  const ponticLayer = makeLayer('pontic');
  const abutmentsLayer = makeLayer('abutments');
  const ridgeLayer = makeLayer('ridge');
  const flossLayer = makeLayer('floss');
  root.add(ridgeLayer, abutmentsLayer, ponticLayer, flossLayer);

  const abutL = createIncisorToothGroup(mats.enamel, mats.bone, 1.0, false);
  abutL.position.set(-1.1, 0.25, 0);
  const abutR = createIncisorToothGroup(mats.enamel, mats.bone, 1.0, false);
  abutR.position.set(1.1, 0.25, 0);
  abutmentsLayer.add(abutL, abutR);

  const ridgeBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.62, 0.78, 1.1, 24),
    mats.gingiva
  );
  ridgeBase.scale.set(2.4, 1, 0.85);
  ridgeBase.position.set(0, -0.32, 0);
  ridgeLayer.add(ridgeBase);

  const ponticBody = new THREE.Mesh(new THREE.SphereGeometry(0.48, 24, 20), mats.porcelain);
  ponticBody.position.set(0, 0.78, 0);
  ponticBody.castShadow = true;
  ponticLayer.add(ponticBody);

  const pinkCollar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.36, 0.32, 0.3, 20),
    mats.pinkPorcelain
  );
  pinkCollar.position.set(0, 0.34, 0.04);
  ponticLayer.add(pinkCollar);

  const connGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.65, 14);
  connGeo.rotateZ(Math.PI / 2);
  const connL = new THREE.Mesh(connGeo, mats.gold);
  connL.position.set(-0.62, 0.88, -0.1);
  const connR = new THREE.Mesh(connGeo, mats.gold);
  connR.position.set(0.62, 0.88, -0.1);
  ponticLayer.add(connL, connR);

  const flossCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.75, 0.32, 0.65),
    new THREE.Vector3(-0.32, 0.24, 0.15),
    new THREE.Vector3(0, 0.22, 0),
    new THREE.Vector3(0.32, 0.24, -0.15),
    new THREE.Vector3(0.75, 0.32, -0.65),
  ]);
  const flossMesh = new THREE.Mesh(
    new THREE.TubeGeometry(flossCurve, 24, 0.025, 8, false),
    new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.3 })
  );
  flossLayer.add(flossMesh);

  const labels: SceneLabelAnchor[] = [
    { id: 'l6-1', text: 'Pontic Tissue Contour', subtext: 'Convex glazed porcelain', anchor: makeAnchor(ponticBody, 0, -0.18, 0.48), layerId: 'pontic' },
    { id: 'l6-2', text: 'Occlusal/Lingual Connector', subtext: 'Opens hygiene embrasure', anchor: makeAnchor(connL, 0, 0.22, 0), layerId: 'pontic' },
    { id: 'l6-3', text: 'Superfloss Path', subtext: 'Must slide passively', anchor: makeAnchor(flossMesh, 0.55, 0.22, 0.45), layerId: 'floss' },
  ];

  let lastMsg = '';

  const updateState = (params: SceneUpdateParams) => {
    ponticLayer.visible = params.visibleLayers.pontic !== false;
    abutmentsLayer.visible = params.visibleLayers.abutments !== false;
    ridgeLayer.visible = params.visibleLayers.ridge !== false;
    flossLayer.visible = params.visibleLayers.floss !== false;

    const widthScale = params.sliderValue / 100;
    pinkCollar.visible = params.toggleActive;

    if (params.secondaryMode === 'siebert-1') {
      ridgeBase.scale.set(2.4, 1.0, 0.46);
    } else if (params.secondaryMode === 'siebert-2') {
      ridgeBase.scale.set(2.4, 0.62, 0.85);
    } else if (params.secondaryMode === 'siebert-3') {
      ridgeBase.scale.set(2.4, 0.58, 0.46);
    } else {
      ridgeBase.scale.set(2.4, 1.0, 0.88);
    }

    if (params.primaryMode === 'hygienic') {
      ponticBody.scale.set(0.95, 0.65, widthScale * 0.85);
      ponticBody.position.y = 0.96;
      flossMesh.position.y = 0.2;
    } else if (params.primaryMode === 'conical') {
      ponticBody.scale.set(0.75, 1.15, widthScale * 0.72);
      ponticBody.position.y = 0.64;
      flossMesh.position.y = 0.0;
    } else if (params.primaryMode === 'ovate') {
      ponticBody.scale.set(0.92, 1.25, widthScale * 0.95);
      ponticBody.position.y = 0.58;
      flossMesh.position.y = -0.04;
    } else if (params.primaryMode === 'modified-ovate') {
      ponticBody.scale.set(0.92, 1.2, widthScale * 0.82);
      ponticBody.position.set(0, 0.62, 0.08);
      flossMesh.position.y = 0.0;
    } else if (params.primaryMode === 'saddle') {
      ponticBody.scale.set(1.05, 1.32, 1.28);
      ponticBody.position.y = 0.54;
      flossMesh.position.y = -0.1;
    } else {
      ponticBody.scale.set(0.92, 1.18, widthScale * 0.85);
      ponticBody.position.set(0, 0.64, 0.06);
      flossMesh.position.y = 0.0;
    }

    const slide = params.animate && !params.reducedMotion ? Math.sin(params.elapsed * 2.5) * 0.14 : 0;
    flossMesh.position.z = slide;
    ponticLayer.position.y = params.explodeFactor * 0.85;
    ridgeLayer.position.y = -params.explodeFactor * 0.35;

    const warning = params.primaryMode === 'saddle' ? ' · CONTRAINDICATED (traps plaque)' : '';
    const msg = `Pontic: ${params.primaryMode} · Table Width: ${params.sliderValue}%${warning}`;
    if (msg !== lastMsg && params.liveReadout) {
      lastMsg = msg;
      params.liveReadout(msg);
    }
  };

  return { rootGroup: root, labels, updateState };
}

/* =========================================================================
   LECTURE 07A: BIOLOGICAL WIDTH & GINGIVAL SULCUS RETRACTION (CUTAWAY)
   ========================================================================= */
function buildLec07aScene(mats: DentalMaterialSet): LectureSceneContent {
  const root = new THREE.Group();
  const toothLayer = makeLayer('tooth');
  const gingivaLayer = makeLayer('gingiva');
  const boneLayer = makeLayer('bone');
  const cordsLayer = makeLayer('cords');
  root.add(boneLayer, gingivaLayer, toothLayer, cordsLayer);

  const toothBody = createIncisorToothGroup(mats.dentin, mats.bone, 1.1, true);
  toothBody.position.set(0, 0.55, 0);
  toothLayer.add(toothBody);

  const marginRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.42, 0.032, 12, 32),
    mats.gold
  );
  marginRing.rotation.x = Math.PI / 2;
  marginRing.position.set(0, 0.62, 0);
  toothLayer.add(marginRing);

  // Open-front cutaway collars so Biological Width layers & cords are clearly exposed
  const cutStart = Math.PI * 0.68;
  const cutLen = Math.PI * 1.32;

  const boneMat = mats.bone.clone();
  boneMat.side = THREE.DoubleSide;
  const boneCollar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.88, 0.94, 0.6, 28, 1, false, cutStart, cutLen),
    boneMat
  );
  boneCollar.position.y = -0.35;
  boneLayer.add(boneCollar);

  const ctMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.6, side: THREE.DoubleSide });
  const ctBand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.76, 0.84, 0.34, 28, 1, false, cutStart, cutLen),
    ctMat
  );
  ctBand.position.y = 0.12;
  boneLayer.add(ctBand);

  const jeMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.5, side: THREE.DoubleSide });
  const jeBand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.68, 0.74, 0.32, 28, 1, false, cutStart, cutLen),
    jeMat
  );
  jeBand.position.y = 0.44;
  gingivaLayer.add(jeBand);

  const freeGingiva = new THREE.Mesh(
    new THREE.TorusGeometry(0.56, 0.16, 16, 36, cutLen),
    mats.gingiva
  );
  freeGingiva.rotation.x = Math.PI / 2;
  freeGingiva.rotation.z = -Math.PI * 0.16;
  freeGingiva.position.y = 0.68;
  gingivaLayer.add(freeGingiva);

  const primaryCord = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.042, 12, 36), mats.cordPrimary);
  primaryCord.rotation.x = Math.PI / 2;
  primaryCord.position.y = 0.52;

  const secondaryCord = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.06, 12, 36), mats.cordSecondary);
  secondaryCord.rotation.x = Math.PI / 2;
  secondaryCord.position.y = 0.64;

  const foamRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.52, 0.11, 14, 36, cutLen),
    new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.38 })
  );
  foamRing.rotation.x = Math.PI / 2;
  foamRing.rotation.z = -Math.PI * 0.16;
  foamRing.position.y = 0.68;

  cordsLayer.add(primaryCord, secondaryCord, foamRing);

  const labels: SceneLabelAnchor[] = [
    { id: 'l7a-1', text: 'Finish Line Margin', subtext: 'Target ≤0.5 mm intrasulcular', anchor: makeAnchor(marginRing, 0.48, 0, 0.1), layerId: 'tooth' },
    { id: 'l7a-2', text: 'JE (0.97 mm) + CT (1.07 mm)', subtext: '2.04 mm Biologic Width', anchor: makeAnchor(boneLayer, -0.78, 0.28, 0), layerId: 'bone' },
    { id: 'l7a-3', text: 'Retraction Cord', subtext: 'Lateral displacement', anchor: makeAnchor(cordsLayer, 0.54, 0.56, 0.3), layerId: 'cords' },
  ];

  let lastMsg = '';

  const updateState = (params: SceneUpdateParams) => {
    toothLayer.visible = params.visibleLayers.tooth !== false;
    gingivaLayer.visible = params.visibleLayers.gingiva !== false;
    boneLayer.visible = params.visibleLayers.bone !== false;
    cordsLayer.visible = params.visibleLayers.cords !== false;

    const depthMm = params.sliderValue;
    marginRing.position.y = 0.72 - depthMm * 0.24;

    const expandPulse = params.animate && !params.reducedMotion ? 0.04 * (0.5 + 0.5 * Math.sin(params.elapsed * 2.5)) : 0;

    let lateralShift = 1.0;
    primaryCord.visible = false;
    secondaryCord.visible = false;
    foamRing.visible = false;

    if (params.primaryMode === 'single-cord') {
      primaryCord.visible = !params.toggleActive;
      lateralShift = 1.15 + expandPulse;
    } else if (params.primaryMode === 'double-cord') {
      primaryCord.visible = true;
      secondaryCord.visible = !params.toggleActive;
      lateralShift = params.toggleActive ? 1.18 : 1.24 + expandPulse;
    } else if (params.primaryMode === 'cordless-paste') {
      foamRing.visible = true;
      foamRing.scale.setScalar(1.0 + expandPulse * 2.2);
      lateralShift = 1.16 + expandPulse;
    }

    freeGingiva.scale.set(lateralShift, lateralShift, 1.0);
    mats.cordPrimary.color.setHex(params.secondaryMode === 'knitted' ? 0xffffff : 0xd1fae5);

    const violation = depthMm > 1.0;
    jeMat.emissive.setHex(violation ? 0x991b1b : 0x000000);
    jeMat.emissiveIntensity = violation ? 0.55 : 0;

    cordsLayer.position.y = params.explodeFactor * 0.65;
    gingivaLayer.position.z = params.explodeFactor * 0.35;
    boneLayer.position.y = -params.explodeFactor * 0.35;

    const msg = `Margin Depth: ${depthMm.toFixed(2)} mm · ${
      violation ? 'WARNING: Impinges 2.04 mm Biologic Width' : 'Preserves ≥ 3 mm bone-to-margin clearance'
    }`;
    if (msg !== lastMsg && params.liveReadout) {
      lastMsg = msg;
      params.liveReadout(msg);
    }
  };

  return { rootGroup: root, labels, updateState };
}

/* =========================================================================
   LECTURE 07B: ELASTOMERIC TRAY SEATING, SPACER & POST-CANAL WIRE
   ========================================================================= */
function buildLec07bScene(mats: DentalMaterialSet): LectureSceneContent {
  const root = new THREE.Group();
  const trayLayer = makeLayer('tray');
  const heavyLayer = makeLayer('heavy');
  const lightLayer = makeLayer('light');
  const prepLayer = makeLayer('prep');
  root.add(prepLayer, lightLayer, heavyLayer, trayLayer);

  const prepTooth = createMolarToothGroup(mats.dentin, mats.bone, 0.95, true);
  prepTooth.position.set(0, 0.1, 0);
  prepLayer.add(prepTooth);

  const postWire = new THREE.Mesh(
    new THREE.CylinderGeometry(0.055, 0.04, 1.45, 14),
    mats.chrome
  );
  postWire.position.set(0, 0.22, 0);
  prepLayer.add(postWire);

  // Half-cutaway light wash & heavy putty so internal prep + post wire stay visible
  const cutStart = Math.PI * 0.65;
  const cutLen = Math.PI * 1.35;
  mats.lightElastomer.side = THREE.DoubleSide;
  const lightWash = new THREE.Mesh(
    new THREE.CylinderGeometry(0.74, 0.8, 1.0, 28, 1, false, cutStart, cutLen),
    mats.lightElastomer
  );
  lightWash.position.set(0, 0.72, 0);
  lightLayer.add(lightWash);

  mats.heavyElastomer.side = THREE.DoubleSide;
  const heavyBody = new THREE.Mesh(
    new THREE.CylinderGeometry(1.06, 1.1, 1.15, 28, 1, false, cutStart, cutLen),
    mats.heavyElastomer
  );
  heavyBody.position.set(0, 0.92, 0);
  heavyLayer.add(heavyBody);

  mats.tray.side = THREE.DoubleSide;
  const trayShell = new THREE.Mesh(
    new THREE.CylinderGeometry(1.24, 1.28, 1.25, 28, 1, false, cutStart, cutLen),
    mats.tray
  );
  trayShell.position.set(0, 1.05, 0);
  const trayHandle = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.22, 1.1),
    mats.tray
  );
  trayHandle.position.set(0, 1.5, -1.55);
  trayLayer.add(trayShell, trayHandle);

  const labels: SceneLabelAnchor[] = [
    { id: 'l7b-1', text: 'Special Tray Shell', subtext: 'Rigid thin elastomer control', anchor: makeAnchor(trayLayer, 0, 1.75, -0.6), layerId: 'tray' },
    { id: 'l7b-2', text: 'Light-Body Wash', subtext: 'Captures finish line detail', anchor: makeAnchor(lightLayer, 0.82, 0.72, 0), layerId: 'light' },
    { id: 'l7b-3', text: 'Post-Space Wire', subtext: 'Prevents canal tear', anchor: makeAnchor(prepLayer, -0.35, 0.2, 0.35), layerId: 'prep' },
  ];

  let lastMsg = '';

  const updateState = (params: SceneUpdateParams) => {
    trayLayer.visible = params.visibleLayers.tray !== false && params.toggleActive;
    heavyLayer.visible = params.visibleLayers.heavy !== false;
    lightLayer.visible = params.visibleLayers.light !== false;
    prepLayer.visible = params.visibleLayers.prep !== false;

    if (params.secondaryMode === 'vps') {
      mats.heavyElastomer.color.setHex(0x6d28d9);
      mats.lightElastomer.color.setHex(0x06b6d4);
    } else if (params.secondaryMode === 'polyether') {
      mats.heavyElastomer.color.setHex(0x4c1d95);
      mats.lightElastomer.color.setHex(0x7c3aed);
    } else {
      mats.heavyElastomer.color.setHex(0x92400e);
      mats.lightElastomer.color.setHex(0xd97706);
    }

    postWire.visible = params.primaryMode === 'post-canal';
    const washScale = 0.82 + (params.sliderValue / 4.0) * 0.35;
    lightWash.scale.set(washScale, 1, washScale);
    heavyLayer.visible = params.visibleLayers.heavy !== false && params.primaryMode !== 'monophase';

    const lift =
      (params.animate && !params.reducedMotion ? 0.35 * (0.5 - 0.5 * Math.cos(params.elapsed * 2)) : 0) +
      params.explodeFactor * 0.9;
    trayLayer.position.y = lift * 1.15;
    heavyLayer.position.y = lift * 0.72;
    lightLayer.position.y = lift * 0.38;

    const msg = `Technique: ${params.primaryMode} · Material: ${params.secondaryMode.toUpperCase()} · Spacer: ${params.sliderValue.toFixed(1)} mm`;
    if (msg !== lastMsg && params.liveReadout) {
      lastMsg = msg;
      params.liveReadout(msg);
    }
  };

  return { rootGroup: root, labels, updateState };
}

/* =========================================================================
   LECTURE 10A: PROVISIONAL MATRIX, EXOTHERM & POST-CROWN WIRE (+4 MM)
   ========================================================================= */
function buildLec10aScene(mats: DentalMaterialSet): LectureSceneContent {
  const root = new THREE.Group();
  const matrixLayer = makeLayer('matrix');
  const provLayer = makeLayer('provisional');
  const abutLayer = makeLayer('abutment');
  const pulpLayer = makeLayer('pulp');
  root.add(abutLayer, pulpLayer, provLayer, matrixLayer);

  const stoneCast = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.55, 1.7), mats.bone);
  stoneCast.position.y = -0.28;
  const abutPrep = createIncisorToothGroup(mats.dentin, mats.bone, 0.95, false);
  abutPrep.position.set(0, 0.02, 0);
  const postPin = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 1.15, 12), mats.chrome);
  postPin.position.set(0, 0.55, 0);
  abutLayer.add(stoneCast, abutPrep, postPin);

  const pulpHeat = new THREE.Mesh(new THREE.SphereGeometry(0.24, 20, 16), mats.pulp);
  pulpHeat.position.set(0, 0.45, 0);
  pulpLayer.add(pulpHeat);

  const provCrown = createIncisorToothGroup(mats.enamel, mats.enamel, 1.14, false);
  provCrown.position.set(0, 0.06, 0);
  provLayer.add(provCrown);

  const matrixShell = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 1.4, 1.15),
    mats.vacuumShell
  );
  matrixShell.position.set(0, 0.72, 0);
  matrixLayer.add(matrixShell);

  const labels: SceneLabelAnchor[] = [
    { id: 'l10a-1', text: 'Matrix / Vacuum Shell', subtext: '0.025" sheet or over-impression', anchor: makeAnchor(matrixLayer, 0, 1.55, 0), layerId: 'matrix' },
    { id: 'l10a-2', text: 'Provisional Shell', subtext: 'Remove early if direct PMMA', anchor: makeAnchor(provLayer, 0.55, 0.82, 0.35), layerId: 'provisional' },
    { id: 'l10a-3', text: 'Pulpal Exotherm Zone', subtext: 'Protected in Indirect/CAD', anchor: makeAnchor(pulpLayer, -0.48, 0.45, 0.2), layerId: 'pulp' },
  ];

  let lastMsg = '';

  const updateState = (params: SceneUpdateParams) => {
    matrixLayer.visible = params.visibleLayers.matrix !== false && params.toggleActive;
    provLayer.visible = params.visibleLayers.provisional !== false;
    abutLayer.visible = params.visibleLayers.abutment !== false;
    pulpLayer.visible = params.visibleLayers.pulp !== false;

    const isIndirect = params.primaryMode === 'indirect-cast';
    const isPost = params.primaryMode === 'post-temp';
    const isPMMA = params.secondaryMode === 'pmma';
    const isCAD = params.secondaryMode === 'cadcam';
    const cure = params.sliderValue / 100;

    stoneCast.material = isIndirect ? mats.bone : mats.gingiva;
    postPin.visible = isPost;

    const shrinkFactor = isCAD ? 1.0 : isPMMA ? 1 - cure * 0.08 : 1 - cure * 0.02;
    provCrown.scale.setScalar(1.14 * shrinkFactor);

    const exothermLevel = !isIndirect && isPMMA && !isCAD ? cure : cure * 0.15;
    mats.pulp.emissiveIntensity = 0.2 + exothermLevel * 1.3;
    pulpHeat.scale.setScalar(0.85 + exothermLevel * 0.55);

    const autoLift =
      params.animate && !params.reducedMotion ? 0.28 * (0.5 + 0.5 * Math.sin(params.elapsed * 2)) : 0;
    matrixLayer.position.y = params.explodeFactor * 1.15 + autoLift;
    provLayer.position.y = params.explodeFactor * 0.55 + (params.primaryMode === 'direct-over' && cure > 0.7 ? 0.35 : 0);

    const msg =
      !isIndirect && isPMMA && cure >= 0.7
        ? 'REMOVE NOW: Peak PMMA Exotherm & ~8% Shrinkage!'
        : isCAD
        ? 'CAD/CAM Blank: ~1% Monomer · 0% Shrinkage'
        : `Cure ${params.sliderValue}% · ${isIndirect ? 'Stone-Restrained Safe' : 'Monitor Exotherm'}`;
    if (msg !== lastMsg && params.liveReadout) {
      lastMsg = msg;
      params.liveReadout(msg);
    }
  };

  return { rootGroup: root, labels, updateState };
}

/* =========================================================================
   LECTURE 10B: MANDIBULAR KINEMATICS, HINGE AXIS & ARCON ARTICULATOR
   ========================================================================= */
function buildLec10bScene(mats: DentalMaterialSet): LectureSceneContent {
  const root = new THREE.Group();
  const mandLayer = makeLayer('mandible');
  const maxLayer = makeLayer('maxilla');
  const axesLayer = makeLayer('axes');
  const recordLayer = makeLayer('record');
  root.add(maxLayer, mandLayer, axesLayer, recordLayer);

  const upperBar = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.18, 2.2), mats.chrome);
  upperBar.position.set(0, 1.85, -0.3);
  const maxArch = new THREE.Mesh(new THREE.TorusGeometry(0.92, 0.22, 12, 24, Math.PI), mats.enamel);
  maxArch.rotation.x = Math.PI / 2;
  maxArch.rotation.z = Math.PI;
  maxArch.position.set(0, 1.08, 0.55);
  maxLayer.add(upperBar, maxArch);

  const condyleBallL = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 14), mats.gold);
  const condyleBallR = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 14), mats.gold);
  const fossaCupL = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.14, 0.55), mats.tray);
  const fossaCupR = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.14, 0.55), mats.tray);

  const mandiblePivot = new THREE.Group();
  mandiblePivot.position.set(0, 1.35, -1.05);

  const lowerBar = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.18, 2.2), mats.chrome);
  lowerBar.position.set(0, -1.25, 0.75);
  const ramusL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.35, 12), mats.chrome);
  ramusL.position.set(-1.35, -0.62, 0);
  const ramusR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.35, 12), mats.chrome);
  ramusR.position.set(1.35, -0.62, 0);

  const mandArch = new THREE.Mesh(new THREE.TorusGeometry(0.88, 0.2, 12, 24, Math.PI), mats.porcelain);
  mandArch.rotation.x = Math.PI / 2;
  mandArch.rotation.z = Math.PI;
  mandArch.position.set(0, -0.62, 1.6);

  mandiblePivot.add(lowerBar, ramusL, ramusR, mandArch, condyleBallL, condyleBallR);
  mandLayer.add(mandiblePivot);
  maxLayer.add(fossaCupL, fossaCupR);

  const hingeRod = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 3.6, 12),
    new THREE.MeshStandardMaterial({ color: 0x1b3a8c })
  );
  hingeRod.rotation.z = Math.PI / 2;
  hingeRod.position.set(0, 1.35, -1.05);

  const vertRodR = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.025, 1.4, 12),
    new THREE.MeshStandardMaterial({ color: 0xc9a24b })
  );
  vertRodR.position.set(1.35, 1.35, -1.05);
  axesLayer.add(hingeRod, vertRodR);

  const jigMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 0.26, 0.42),
    new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.3 })
  );
  jigMesh.position.set(0, 0.88, 1.45);
  recordLayer.add(jigMesh);

  const labels: SceneLabelAnchor[] = [
    { id: 'l10b-1', text: 'Terminal Hinge Axis', subtext: 'Pure rotation ≤ 12 mm', anchor: makeAnchor(axesLayer, -1.45, 1.55, -1.05), layerId: 'axes' },
    { id: 'l10b-2', text: 'Anterior Jig Stop', subtext: 'Separates posteriors for CR', anchor: makeAnchor(recordLayer, 0, 0.95, 1.72), layerId: 'record' },
    { id: 'l10b-3', text: 'Mandibular Arch', subtext: 'Excursion kinematics', anchor: makeAnchor(mandArch, 0.6, 0.2, 0.1), layerId: 'mandible' },
  ];

  let lastMsg = '';

  const updateState = (params: SceneUpdateParams) => {
    mandLayer.visible = params.visibleLayers.mandible !== false;
    maxLayer.visible = params.visibleLayers.maxilla !== false;
    axesLayer.visible = params.visibleLayers.axes !== false;
    recordLayer.visible = params.visibleLayers.record !== false && params.toggleActive;

    const isArcon = params.secondaryMode === 'arcon';
    condyleBallL.position.set(-1.35, isArcon ? 0.0 : 0.28, 0);
    condyleBallR.position.set(1.35, isArcon ? 0.0 : 0.28, 0);
    fossaCupL.position.set(-1.35, isArcon ? 1.52 : 1.2, -1.05);
    fossaCupR.position.set(1.35, isArcon ? 1.52 : 1.2, -1.05);

    const osc = params.animate && !params.reducedMotion ? 0.5 + 0.5 * Math.sin(params.elapsed * 2.1) : 1;
    const t = (params.sliderValue / 100) * osc;

    mandiblePivot.position.set(0, 1.35, -1.05);
    mandiblePivot.rotation.set(0, 0, 0);

    if (params.primaryMode === 'hinge-open') {
      const rot = Math.min(0.32, t * 0.45);
      const trans = t > 0.5 ? (t - 0.5) * 0.65 : 0;
      mandiblePivot.rotation.x = rot;
      mandiblePivot.position.z = -1.05 + trans;
      mandiblePivot.position.y = 1.35 - trans * 0.35;
    } else if (params.primaryMode === 'protrusive') {
      mandiblePivot.position.z = -1.05 + t * 0.55;
      mandiblePivot.position.y = 1.35 - t * 0.24;
    } else {
      mandiblePivot.rotation.y = -t * 0.22;
      mandiblePivot.position.x = t * 0.25;
      mandiblePivot.position.y = 1.35 - t * 0.1;
    }

    maxLayer.position.y = params.explodeFactor * 0.75;

    const mmOpen = Math.round((params.sliderValue / 100) * 24);
    const msg = `${isArcon ? 'ARCON' : 'NON-ARCON'} · Mode: ${params.primaryMode} · ${
      params.primaryMode === 'hinge-open'
        ? mmOpen <= 12
          ? `Pure Hinge Rotation (~${mmOpen} mm ≤ 12 mm)`
          : `Hinge + Condylar Translation (~${mmOpen} mm)`
        : `Excursion ${params.sliderValue}%`
    }`;
    if (msg !== lastMsg && params.liveReadout) {
      lastMsg = msg;
      params.liveReadout(msg);
    }
  };

  return { rootGroup: root, labels, updateState };
}

/* =========================================================================
   LECTURE 11: OPTICAL TOOTH SHADE, OPALESCENCE & METAMERISM LAB
   ========================================================================= */
function buildLec11Scene(mats: DentalMaterialSet): LectureSceneContent {
  const root = new THREE.Group();
  const toothLayer = makeLayer('tooth');
  const tabLayer = makeLayer('tab');
  const haloLayer = makeLayer('halo');
  const probeLayer = makeLayer('probe');
  root.add(toothLayer, tabLayer, haloLayer, probeLayer);

  const toothMat = mats.enamel.clone();
  const targetTooth = createIncisorToothGroup(toothMat, mats.bone, 1.25, false);
  targetTooth.position.set(-0.62, 0.25, 0);
  toothLayer.add(targetTooth);

  const tabMat = mats.porcelain.clone();
  const shadeTab = createIncisorToothGroup(tabMat, mats.chrome, 1.15, false);
  shadeTab.position.set(0.65, 0.25, 0);
  const tabHolder = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.9, 12), mats.chrome);
  tabHolder.position.set(0.65, -0.35, 0);
  tabLayer.add(shadeTab, tabHolder);

  const haloMat = new THREE.MeshStandardMaterial({
    color: 0x93c5fd,
    emissive: 0x1d4ed8,
    emissiveIntensity: 0.2,
    transparent: true,
    opacity: 0.45,
    roughness: 0.14,
  });
  const opalescentBand = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.22, 0.34), haloMat);
  opalescentBand.position.set(-0.62, 1.44, 0.02);
  haloLayer.add(opalescentBand);

  const neutralMask = new THREE.Mesh(
    new THREE.BoxGeometry(2.6, 0.48, 0.42),
    new THREE.MeshStandardMaterial({ color: 0x9ca3af, roughness: 0.7 })
  );
  neutralMask.position.set(0, 0.02, 0.05);
  toothLayer.add(neutralMask);

  const probeBody = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 1.1, 14), mats.tray);
  probeBody.rotation.x = Math.PI / 2;
  probeBody.position.set(-0.62, 0.85, 0.88);
  const probeTip = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.16, 14), mats.chrome);
  probeTip.rotation.x = Math.PI / 2;
  probeTip.position.set(-0.62, 0.85, 0.32);
  probeLayer.add(probeBody, probeTip);

  const labels: SceneLabelAnchor[] = [
    { id: 'l11-1', text: 'Incisal Opalescence', subtext: 'Reflects blue, transmits orange', anchor: makeAnchor(haloLayer, -0.62, 1.72, 0.1), layerId: 'halo' },
    { id: 'l11-2', text: 'Edge-to-Edge Shade Tab', subtext: 'Same facial plane', anchor: makeAnchor(tabLayer, 0.65, 1.5, 0.1), layerId: 'tab' },
    { id: 'l11-3', text: 'Spectrophotometer', subtext: 'Perpendicular 3-zone read', anchor: makeAnchor(probeBody, 0, 0.15, 0.32), layerId: 'probe' },
  ];

  // Pre-allocated Color scratch buffers (zero per-frame allocations)
  const cTooth = new THREE.Color();
  const cTab = new THREE.Color();
  const cWhite = new THREE.Color(0xffffff);
  const cIncandTooth = new THREE.Color(1.0, 0.92, 0.72);
  const cIncandTab = new THREE.Color(1.0, 0.88, 0.62);
  const cFluorTooth = new THREE.Color(0.84, 0.94, 1.0);
  const cFluorTab = new THREE.Color(0.76, 0.9, 1.0);

  let lastMsg = '';

  const updateState = (params: SceneUpdateParams) => {
    toothLayer.visible = params.visibleLayers.tooth !== false;
    tabLayer.visible = params.visibleLayers.tab !== false;
    haloLayer.visible = params.visibleLayers.halo !== false;
    probeLayer.visible = params.visibleLayers.probe !== false;

    neutralMask.visible = params.toggleActive;
    toothMat.roughness = params.toggleActive ? 0.08 : 0.38;
    toothMat.metalness = params.toggleActive ? 0.08 : 0.0;

    const valNorm = (params.sliderValue - 4) / 4;
    const baseHex =
      params.secondaryMode === 'vita-2m1'
        ? 0xf7f3e6
        : params.secondaryMode === 'vita-3m2'
        ? 0xecdcb9
        : params.secondaryMode === 'vita-3l25'
        ? 0xe8d094
        : 0xd8b18a;

    cTooth.setHex(baseHex).lerp(cWhite, valNorm * 0.25);
    cTab.setHex(baseHex);

    if (params.primaryMode === 'incandescent') {
      cTooth.multiply(cIncandTooth);
      cTab.multiply(cIncandTab);
    } else if (params.primaryMode === 'fluorescent') {
      cTooth.multiply(cFluorTooth);
      cTab.multiply(cFluorTab);
    } else if (params.primaryMode === 'chair-light') {
      cTooth.lerp(cWhite, 0.45);
    }

    toothMat.color.copy(cTooth);
    tabMat.color.copy(cTab);

    const scanY = params.animate && !params.reducedMotion ? 0.85 + Math.sin(params.elapsed * 2) * 0.35 : 0.85;
    probeBody.position.y = scanY;
    probeTip.position.y = scanY;

    tabLayer.position.x = params.explodeFactor * 0.55;
    probeLayer.position.z = params.explodeFactor * 0.65;

    const msg = `Light: ${params.primaryMode} · Target: ${params.secondaryMode.toUpperCase()} · Munsell Value ${params.sliderValue}/10 · ${
      params.toggleActive ? 'Wet + Neutral Mask' : 'Dry Enamel (Falsely Lighter)'
    }`;
    if (msg !== lastMsg && params.liveReadout) {
      lastMsg = msg;
      params.liveReadout(msg);
    }
  };

  return { rootGroup: root, labels, updateState };
}

/* =========================================================================
   LECTURE 12: CROWN TRY-IN, 2-DIRECTION EXPLORER & ADHESIVE BONDING
   ========================================================================= */
function buildLec12Scene(mats: DentalMaterialSet): LectureSceneContent {
  const root = new THREE.Group();
  const crownLayer = makeLayer('crown');
  const cementLayer = makeLayer('cement');
  const toothLayer = makeLayer('tooth');
  const probeLayer = makeLayer('probe');
  root.add(toothLayer, cementLayer, crownLayer, probeLayer);

  const prepTooth = new THREE.Mesh(
    createPreparedAbutmentGeometry(6, 'chamfer', false),
    mats.dentin
  );
  prepTooth.castShadow = true;
  toothLayer.add(prepTooth);

  const marginLine = new THREE.Mesh(
    new THREE.TorusGeometry(0.61, 0.024, 12, 32),
    mats.gold
  );
  marginLine.rotation.x = Math.PI / 2;
  marginLine.position.y = 0.02;
  toothLayer.add(marginLine);

  const cementFilm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.56, 0.61, 0.84, 28, 1, true),
    new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.55, side: THREE.DoubleSide })
  );
  cementFilm.position.y = 0.45;
  cementLayer.add(cementFilm);

  const pipSpot = new THREE.Mesh(
    new THREE.SphereGeometry(0.11, 14, 12),
    new THREE.MeshStandardMaterial({ color: 0xdc2626, emissive: 0x7f1d1d, emissiveIntensity: 0.4 })
  );
  pipSpot.position.set(0.45, 0.55, 0);
  cementLayer.add(pipSpot);

  const crown = createMolarToothGroup(mats.zirconia, mats.zirconia, 1.24, false);
  crown.position.set(0, 0.06, 0);
  crownLayer.add(crown);

  const explorerGroup = new THREE.Group();
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 1.35, 14), mats.chrome);
  handle.rotation.z = -Math.PI / 3;
  handle.position.set(1.22, 0.36, 0);
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.028, 0.32, 12), mats.chrome);
  tip.rotation.z = Math.PI / 2;
  tip.position.set(0.75, 0.08, 0);
  explorerGroup.add(handle, tip);
  probeLayer.add(explorerGroup);

  const labels: SceneLabelAnchor[] = [
    { id: 'l12-1', text: '2-Direction Explorer', subtext: 'Catches Short (R→T) / Long (T→R)', anchor: makeAnchor(explorerGroup, 1.1, 0.25, 0.25), layerId: 'probe' },
    { id: 'l12-2', text: 'Luting Film ≤ 25 µm', subtext: 'HF+Silane vs. 10-MDP', anchor: makeAnchor(cementLayer, -0.7, 0.52, 0), layerId: 'cement' },
    { id: 'l12-3', text: 'Crown Margin Collar', subtext: 'Check 360° adaptation', anchor: makeAnchor(crownLayer, 0, 1.32, 0), layerId: 'crown' },
  ];

  let lastSecondaryMode = '';
  let lastMsg = '';

  const updateState = (params: SceneUpdateParams) => {
    crownLayer.visible = params.visibleLayers.crown !== false;
    cementLayer.visible = params.visibleLayers.cement !== false;
    toothLayer.visible = params.visibleLayers.tooth !== false;
    probeLayer.visible = params.visibleLayers.probe !== false && params.toggleActive;

    const seatingProgress = params.sliderValue / 100;
    let defectLift = 0;
    let scaleRadial = 1.24;

    if (params.primaryMode === 'short-margin') {
      defectLift = 0.16;
    } else if (params.primaryMode === 'long-margin') {
      defectLift = -0.1;
      scaleRadial = 1.3;
    } else if (params.primaryMode === 'open-margin') {
      scaleRadial = 1.34;
    } else if (params.primaryMode === 'overcontoured') {
      scaleRadial = 1.44;
    }

    crown.scale.set(scaleRadial, 1.24, scaleRadial);
    const unseatedOffset = (1 - seatingProgress) * 0.85;
    crownLayer.position.y = unseatedOffset + defectLift + params.explodeFactor * 0.95;

    if (params.secondaryMode !== lastSecondaryMode) {
      lastSecondaryMode = params.secondaryMode;
      crown.traverse((obj) => {
        const m = obj as THREE.Mesh;
        if (!m.isMesh) return;
        if (params.secondaryMode === 'pfm-zpc') m.material = mats.gold;
        else if (params.secondaryMode === 'zirconia-mdp') m.material = mats.zirconia;
        else m.material = mats.porcelain;
      });
    }

    pipSpot.visible = params.toggleActive && seatingProgress < 0.95;

    const sweepY =
      params.animate && !params.reducedMotion ? 0.08 + Math.sin(params.elapsed * 2.8) * 0.24 : 0.08;
    explorerGroup.position.y = sweepY;

    const bondLabel =
      params.secondaryMode === 'etchable-emax'
        ? '5% HF (20s) + Silane (60s) + Resin'
        : params.secondaryMode === 'zirconia-mdp'
        ? 'Al2O3 Grit-Blast + 10-MDP'
        : 'ZPC / GIC / RMGI Conventional';
    const msg = `Margin: ${params.primaryMode} · Seated ${params.sliderValue}% · Protocol: ${bondLabel}`;
    if (msg !== lastMsg && params.liveReadout) {
      lastMsg = msg;
      params.liveReadout(msg);
    }
  };

  return { rootGroup: root, labels, updateState };
}
