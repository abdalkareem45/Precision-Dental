import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ThreeSandboxShell } from '../ThreeSandboxShell';
import {
  createDentinTubuleTexture,
  createRulerTexture,
  createStudioScene,
  createTrabecularBoneTexture,
  StudioContext,
} from '../../three/studioEngine';
import { buildCutawayToothGroup, buildEndodonticFileGroup } from '../../three/dentalGeometry';
import { LECTURES } from '../../data/lectures';

const LEC3 = LECTURES[0];

// ============================================================================
// 1. Apical Anatomy & Working Length Stop Explorer (Lecture 3, Sandbox 1)
// ============================================================================
export const ApicalAnatomySandbox: React.FC<{ onInteract?: () => void }> = ({ onInteract }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);

  const [insertionMm, setInsertionMm] = useState(20.0); // 20.0 mm = optimal apical constriction (21.0 mm anatomic apex)
  const [selectedLandmark, setSelectedLandmark] = useState<
    'constriction' | 'foramen' | 'cdj' | 'anatomic' | 'radiographic'
  >('constriction');
  const [explodeLayer, setExplodeLayer] = useState(0);

  const stateRef = useRef({ insertionMm, selectedLandmark, explodeLayer });
  stateRef.current = { insertionMm, selectedLandmark, explodeLayer };

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const studio = createStudioScene(el, {
      cameraPos: [0.4, -0.5, 6.4],
      target: [0, -0.4, 0],
    });
    if (!studio) return;
    studioRef.current = studio;

    const dentinTex = createDentinTubuleTexture(studio.maxAnisotropy);
    const { group: toothGroup, enamelMesh, cementumMesh } = buildCutawayToothGroup({
      dentinTexture: dentinTex,
    });
    toothGroup.position.y = 0.2;
    studio.scene.add(toothGroup);

    // Coronal Reference Point Ring at occlusal edge
    const refRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.45, 0.045, 16, 36),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.25, metalness: 0.5 })
    );
    refRing.rotation.x = Math.PI / 2;
    refRing.position.set(0, 2.22, 0);
    toothGroup.add(refRing);

    // 5 Apical Landmarks (color + distinct geometry markers)
    const makeMarker = (color: number, radius = 0.085) =>
      new THREE.Mesh(
        new THREE.SphereGeometry(radius, 20, 20),
        new THREE.MeshStandardMaterial({
          color,
          emissive: color,
          emissiveIntensity: 0.45,
          roughness: 0.25,
        })
      );

    // 1. Apical Constriction (0.5-1.0 mm short of foramen, narrowest)
    const mConstriction = makeMarker(0x10b981, 0.095);
    mConstriction.position.set(0.02, -1.78, 0.06);

    // 2. Apical Foramen (lateral offset exit)
    const mForamen = makeMarker(0xf59e0b, 0.09);
    mForamen.position.set(0.14, -2.14, 0.14);

    // 3. Cementodentinal Junction (CDJ)
    const mCdj = makeMarker(0x60a5fa, 0.085);
    mCdj.position.set(-0.08, -1.86, 0.16);

    // 4. Anatomic Apex (end of root anatomically)
    const mAnatomic = makeMarker(0xc9a24b, 0.09);
    mAnatomic.position.set(0.0, -2.35, 0.0);

    // 5. Radiographic Apex (projected lateral-most tip)
    const mRadiographic = makeMarker(0xf43f5e, 0.085);
    mRadiographic.position.set(0.18, -2.31, -0.04);

    toothGroup.add(mConstriction, mForamen, mCdj, mAnatomic, mRadiographic);

    // Highlight halo ring around active landmark
    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(0.17, 0.022, 12, 32),
      new THREE.MeshBasicMaterial({ color: 0xfaf8f3 })
    );
    toothGroup.add(halo);

    // Endodontic exploring file + rubber stopper
    const fileGroup = buildEndodonticFileGroup({
      handleColor: 0x1b3a8c,
      crossSection: 'square',
      length: 3.9,
      taper: 0.02,
    });
    const stopper = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.14, 0.09, 20),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.45 })
    );
    stopper.position.y = 1.65;
    fileGroup.add(stopper);
    studio.scene.add(fileGroup);

    const landmarkPositions: Record<string, THREE.Vector3> = {
      constriction: mConstriction.position,
      foramen: mForamen.position,
      cdj: mCdj.position,
      anatomic: mAnatomic.position,
      radiographic: mRadiographic.position,
    };

    let currentFileY = 0.4;
    let currentExplode = 0;

    studio.startLoop((dt, elapsed) => {
      const { insertionMm: mm, selectedLandmark: lm, explodeLayer: exp } = stateRef.current;
      // Map 16..23 mm -> file tip position relative to apical constriction (-1.78 + 0.2 toothGroup offset)
      // At mm = 20.0, file tip sits right at -1.58 world y (apical constriction)
      const targetFileY = 0.42 - (mm - 20.0) * 0.34;
      currentFileY = THREE.MathUtils.damp(currentFileY, targetFileY, 8, dt);
      fileGroup.position.y = currentFileY;
      fileGroup.position.x = 0.015;

      // Explode enamel & cementum slightly outward along X
      currentExplode = THREE.MathUtils.damp(currentExplode, exp, 6, dt);
      enamelMesh.position.y = currentExplode * 0.45;
      cementumMesh.position.x = -currentExplode * 0.35;

      // Halo tracks selected landmark
      const targetPos = landmarkPositions[lm];
      halo.position.copy(targetPos);
      halo.rotation.y = elapsed * 1.4;
      halo.rotation.x = Math.sin(elapsed * 1.6) * 0.3;
    });

    return () => {
      studio.dispose();
      studioRef.current = null;
    };
  }, []);

  const status =
    insertionMm < 19.3
      ? { label: 'SHORT WORKING LENGTH', tone: 'text-amber-300', desc: 'Incomplete cleaning, underfilling, incomplete apical seal, persistent discomfort.' }
      : insertionMm <= 20.4
      ? { label: 'OPTIMAL APICAL STOP', tone: 'text-emerald-300', desc: 'Terminates at apical constriction (0.5–1.0 mm short of apical foramen center).' }
      : { label: 'OVER-EXTENDED LENGTH', tone: 'text-rose-300', desc: 'Perforation through constriction, overfilling, post-op pain, prolonged healing.' };

  const landmarkInfo: Record<string, string> = {
    constriction: '1. Apical Constriction — Narrowest canal diameter, 0.5–1.0 mm short of apical foramen center.',
    foramen: '2. Apical Foramen — Main apical opening; often off-center or on the lateral root surface.',
    cdj: '5. Cementodentinal Junction (CDJ) — Junction where dentin meets cementum near the apex.',
    anatomic: '4. Anatomic Apex — Morphologic tip/end of the root determined anatomically.',
    radiographic: '3. Radiographic Apex — End of the root as projected on a 2D radiograph.',
  };

  return (
    <ThreeSandboxShell
      title={LEC3.sandboxes3d[0].title}
      metricBadge={`${insertionMm.toFixed(1)} mm`}
      learningGoal={LEC3.sandboxes3d[0].learningGoal}
      mountRef={mountRef}
      onResetView={() =>
        studioRef.current?.flyToCamera(new THREE.Vector3(0.4, -0.5, 6.4), new THREE.Vector3(0, -0.4, 0))
      }
      fallbackSummary="Cutaway 3D tooth apex showing Coronal Reference Point, Apical Constriction (0.5–1.0 mm short of foramen), CDJ, Apical Foramen, Anatomic Apex, and Radiographic Apex."
      readout={
        <div className="rounded-lg bg-[#0B1F4D]/92 border border-[#FAF8F3]/20 px-3 py-2 text-right">
          <div className={`text-[11px] font-bold ${status.tone}`}>{status.label}</div>
          <div className="text-xs font-mono-tabular text-[#FAF8F3]">{insertionMm.toFixed(1)} mm WL</div>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium text-[#E6E8EC]">File Insertion Depth</span>
            <span className="font-mono-tabular text-[#C9A24B]">{insertionMm.toFixed(1)} mm</span>
          </div>
          <input
            type="range"
            min={17.5}
            max={22.0}
            step={0.1}
            value={insertionMm}
            onChange={(e) => {
              setInsertionMm(Number(e.target.value));
              onInteract?.();
            }}
            className="w-full pd-slider"
            aria-label="File insertion depth in millimeters"
          />
          <p className="text-[11px] text-[#E6E8EC]/85 mt-1 leading-tight">{status.desc}</p>
        </div>

        <div>
          <div className="text-xs font-medium text-[#E6E8EC] mb-1.5">Inspect Apical Landmark</div>
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                ['constriction', 'Constriction'],
                ['foramen', 'Foramen'],
                ['cdj', 'CDJ'],
                ['anatomic', 'Anatomic'],
                ['radiographic', 'Radiographic'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setSelectedLandmark(key);
                  onInteract?.();
                  studioRef.current?.flyToCamera(
                    new THREE.Vector3(0.5, -1.65, 3.6),
                    new THREE.Vector3(0, -1.75, 0)
                  );
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  selectedLandmark === key
                    ? 'bg-[#C9A24B] text-[#0B1F4D]'
                    : 'bg-[#1B3A8C]/70 text-[#FAF8F3] hover:bg-[#1B3A8C]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[#E6E8EC]/85 mt-1.5 leading-tight">
            {landmarkInfo[selectedLandmark]}
          </p>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium text-[#E6E8EC]">Exploded Tissue Separation</span>
            <span className="font-mono-tabular text-[#C9A24B]">{Math.round(explodeLayer * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={explodeLayer}
            onChange={(e) => {
              setExplodeLayer(Number(e.target.value));
              onInteract?.();
            }}
            className="w-full pd-slider"
            aria-label="Exploded tissue layer separation"
          />
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => {
                setInsertionMm(20.0);
                setExplodeLayer(0);
                onInteract?.();
              }}
              className="px-3 py-1 rounded bg-[#1B3A8C] text-[11px] font-semibold text-[#FAF8F3] hover:bg-[#C9A24B] hover:text-[#0B1F4D] transition-colors whitespace-nowrap shrink-0"
            >
              Snap to Optimal (20.0 mm)
            </button>
          </div>
        </div>
      </div>
    </ThreeSandboxShell>
  );
};

// ============================================================================
// 2. Electronic Apex Locator & Ohm's Law Circuit Lab (Lecture 3, Sandbox 2)
// ============================================================================
export const ApexLocatorSandbox: React.FC<{ onInteract?: () => void }> = ({ onInteract }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);

  const [fileDepth, setFileDepth] = useState(0.75); // 0 to 1.15 (0.85 = constriction 650 ohms = '0')
  const [canalFluid, setCanalFluid] = useState<'dry' | 'blood_naocl' | 'partial'>('blood_naocl');
  const [generation, setGeneration] = useState<1 | 2 | 3 | 4 | 5 | 6>(6);
  const [metallicCrown, setMetallicCrown] = useState(false);
  const [pacemakerWarning, setPacemakerWarning] = useState(false);

  const stateRef = useRef({ fileDepth, canalFluid, generation, metallicCrown, pacemakerWarning });
  stateRef.current = { fileDepth, canalFluid, generation, metallicCrown, pacemakerWarning };

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const studio = createStudioScene(el, {
      cameraPos: [1.5, 0.4, 6.8],
      target: [0.3, -0.2, 0],
    });
    if (!studio) return;
    studioRef.current = studio;

    const boneTex = createTrabecularBoneTexture(studio.maxAnisotropy);
    // Alveolar socket block
    const socketGeo = new THREE.BoxGeometry(2.6, 2.3, 1.8);
    const socketMat = new THREE.MeshStandardMaterial({
      map: boneTex,
      roughness: 0.85,
      transparent: true,
      opacity: 0.48,
    });
    const socket = new THREE.Mesh(socketGeo, socketMat);
    socket.position.set(-0.6, -1.35, 0);
    studio.scene.add(socket);

    const { group: toothGroup } = buildCutawayToothGroup({});
    toothGroup.position.set(-0.6, 0.25, 0);
    studio.scene.add(toothGroup);

    // Metallic crown collar (optional interference)
    const metalCrownMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.95, 0.84, 1.25, 28, 1, true, Math.PI * 0.25, Math.PI * 1.48),
      new THREE.MeshStandardMaterial({
        color: 0xd4d8df,
        metalness: 0.94,
        roughness: 0.16,
        side: THREE.DoubleSide,
      })
    );
    metalCrownMesh.position.set(-0.6, 1.55, 0);
    studio.scene.add(metalCrownMesh);

    // File + Electrode clip
    const fileGroup = buildEndodonticFileGroup({
      handleColor: 0x059669,
      crossSection: 'triangle',
      length: 3.7,
    });
    const clipMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.14, 0.18),
      new THREE.MeshStandardMaterial({ color: 0x1b3a8c, roughness: 0.4 })
    );
    clipMesh.position.set(0.14, 1.55, 0);
    fileGroup.add(clipMesh);
    studio.scene.add(fileGroup);

    // Lip hook on oral mucosa
    const mucosa = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.32, 1.1, 8, 16),
      new THREE.MeshStandardMaterial({ color: 0xc96b78, roughness: 0.65 })
    );
    mucosa.rotation.z = Math.PI / 2;
    mucosa.position.set(1.3, -1.2, 0.4);
    studio.scene.add(mucosa);

    const lipHook = new THREE.Mesh(
      new THREE.TorusGeometry(0.18, 0.032, 10, 24, Math.PI * 1.3),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.2 })
    );
    lipHook.position.set(1.45, -1.02, 0.4);
    studio.scene.add(lipHook);

    // Apex locator body + screen
    const unitGroup = new THREE.Group();
    unitGroup.position.set(2.15, 0.55, 0);
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 1.75, 0.42),
      new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.35 })
    );
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x0b1f4d });
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.08, 0.95), screenMat);
    screen.position.set(0, 0.2, 0.22);
    const barMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const barMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.82, 0.16), barMat);
    barMesh.position.set(0, -0.05, 0.23);
    unitGroup.add(body, screen, barMesh);
    studio.scene.add(unitGroup);

    // Circuit wire connecting file clip -> unit -> lip hook
    const wireCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.45, 2.2, 0),
      new THREE.Vector3(0.8, 2.55, 0.2),
      new THREE.Vector3(2.15, 1.4, 0.1),
      new THREE.Vector3(2.15, -0.35, 0.1),
      new THREE.Vector3(1.5, -0.95, 0.4),
    ]);
    const wireMesh = new THREE.Mesh(
      new THREE.TubeGeometry(wireCurve, 40, 0.025, 8, false),
      new THREE.MeshStandardMaterial({ color: 0xc9a24b, roughness: 0.4, metalness: 0.5 })
    );
    studio.scene.add(wireMesh);

    // Current pulse sphere traveling along circuit
    const pulseSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.075, 14, 14),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    studio.scene.add(pulseSphere);

    let animY = 0.7;
    const tmpVec = new THREE.Vector3();

    studio.startLoop((dt, elapsed) => {
      const { fileDepth: d, metallicCrown: mc, pacemakerWarning: pm } = stateRef.current;
      metalCrownMesh.visible = mc;

      // Advance file with alternating 1/4-turn watch-winding motion
      const targetY = 1.45 - d * 1.45;
      animY = THREE.MathUtils.damp(animY, targetY, 7, dt);
      fileGroup.position.set(-0.6, animY, 0);
      fileGroup.rotation.y = Math.sin(elapsed * 4.5) * (Math.PI * 0.25);

      // Update Ohm's law bar indicator (contraindicated / short-circuit -> warning red)
      const nearZero = Math.abs(d - 0.85) < 0.08;
      barMat.color.setHex(pm || mc ? 0xf43f5e : d > 0.94 ? 0xf43f5e : nearZero ? 0x10b981 : 0x38bdf8);
      barMesh.scale.x = pm ? 0.15 : THREE.MathUtils.clamp(d / 1.0, 0.15, 1.15);

      // Pulse particle along circuit
      const u = (elapsed * 0.45) % 1;
      wireCurve.getPointAt(u, tmpVec);
      pulseSphere.position.copy(tmpVec);
    });

    return () => {
      studio.dispose();
      studioRef.current = null;
    };
  }, []);

  // Compute physically faithful EAL reading per generation and canal condition from Lecture 3
  const computeEalTelemetry = () => {
    if (pacemakerWarning) {
      return {
        reading: 'CONTRAINDICATED',
        ohms: '---',
        note: 'Do NOT use electronic apex locators in patients with cardiac pacemakers.',
        valid: false,
      };
    }
    if (metallicCrown) {
      return {
        reading: 'SHORT-CIRCUIT',
        ohms: '< 150 Ω',
        note: 'Metallic crown/amalgam shunts current. Remove coronal metal before measuring.',
        valid: false,
      };
    }

    const genInvalid =
      (generation === 1 && canalFluid === 'blood_naocl') ||
      (generation === 2 && canalFluid !== 'partial') ||
      (generation === 4 && canalFluid === 'blood_naocl') ||
      (generation === 5 && canalFluid === 'dry');

    if (genInvalid) {
      return {
        reading: 'ERRATIC READING',
        ohms: 'Unstable',
        note:
          generation === 1
            ? '1st Gen resistance meters fail in strong electrolytes (NaOCl, blood, pus).'
            : generation === 2
            ? '2nd Gen impedance units give inaccurate readings in wet electrolytes or dry canals.'
            : generation === 4
            ? '4th Gen (400 Hz / 8 kHz) becomes inapplicable in heavy blood or exudate.'
            : '5th Gen experiences severe errors in dry canals; insert conductive liquid.',
        valid: false,
      };
    }

    const distFromConstriction = 0.85 - fileDepth; // positive = coronal to constriction
    const ohms = Math.max(220, Math.round(650 + distFromConstriction * 1400));
    const displayVal =
      Math.abs(distFromConstriction) < 0.05
        ? '0.0 (APICAL CONSTRICTION)'
        : distFromConstriction > 0
        ? `+${(distFromConstriction * 4.5).toFixed(1)} mm CORONAL`
        : 'APEX / OVER-EXTENDED';

    return {
      reading: displayVal,
      ohms: `${ohms} Ω`,
      note:
        generation === 6
          ? '6th Gen adaptive locator maintains precision across dry canals, blood, and NaOCl.'
          : `Gen ${generation} stable under current canal condition. Confirm 3× and verify radiographically.`,
      valid: true,
    };
  };

  const telemetry = computeEalTelemetry();

  return (
    <ThreeSandboxShell
      title={LEC3.sandboxes3d[1].title}
      metricBadge={telemetry.ohms}
      learningGoal={LEC3.sandboxes3d[1].learningGoal}
      mountRef={mountRef}
      onResetView={() =>
        studioRef.current?.flyToCamera(new THREE.Vector3(1.5, 0.4, 6.8), new THREE.Vector3(0.3, -0.2, 0))
      }
      fallbackSummary="3D EAL circuit showing damp mucosa lip hook, K-file electrode clip advancing via watch-winding motion, 650 ohm constriction target, and metallic/pacemaker precautions."
      readout={
        <div className="rounded-lg bg-[#0B1F4D]/92 border border-[#FAF8F3]/20 px-3 py-2 text-right">
          <div className={`text-[11px] font-bold ${telemetry.valid ? 'text-emerald-300' : 'text-rose-300'}`}>
            {telemetry.reading}
          </div>
          <div className="text-xs font-mono-tabular text-[#C9A24B]">R = V / I · {telemetry.ohms}</div>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium text-[#E6E8EC]">Watch-Winding Depth</span>
            <span className="font-mono-tabular text-[#C9A24B]">{Math.round(fileDepth * 100)}%</span>
          </div>
          <input
            type="range"
            min={0.2}
            max={1.08}
            step={0.01}
            value={fileDepth}
            onChange={(e) => {
              setFileDepth(Number(e.target.value));
              onInteract?.();
            }}
            className="w-full pd-slider"
            aria-label="Electronic apex locator file advancement"
          />
          <p className="text-[11px] text-[#E6E8EC]/85 mt-1 leading-tight">{telemetry.note}</p>
        </div>

        <div>
          <div className="text-xs font-medium text-[#E6E8EC] mb-1">Canal Condition & Device Gen</div>
          <div className="flex flex-wrap gap-1 mb-1.5">
            {(
              [
                ['dry', 'Dry'],
                ['partial', 'Partially Dried'],
                ['blood_naocl', 'Blood / NaOCl'],
              ] as const
            ).map(([id, lbl]) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setCanalFluid(id);
                  onInteract?.();
                }}
                className={`px-2 py-1 rounded text-[11px] font-medium whitespace-nowrap shrink-0 ${
                  canalFluid === id ? 'bg-[#C9A24B] text-[#0B1F4D]' : 'bg-[#1B3A8C]/70 text-[#FAF8F3]'
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1">
            {([1, 2, 3, 4, 5, 6] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => {
                  setGeneration(g);
                  onInteract?.();
                }}
                className={`px-2 py-1 rounded text-[11px] font-mono-tabular whitespace-nowrap shrink-0 ${
                  generation === g ? 'bg-[#FAF8F3] text-[#0B1F4D] font-bold' : 'bg-[#1B3A8C]/70 text-[#FAF8F3]'
                }`}
              >
                Gen {g}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="text-xs font-medium text-[#E6E8EC]">Clinical Precautions</div>
          <label className="inline-flex items-center gap-2 text-xs text-[#E6E8EC] cursor-pointer">
            <input
              type="checkbox"
              checked={metallicCrown}
              onChange={(e) => {
                setMetallicCrown(e.target.checked);
                onInteract?.();
              }}
              className="accent-[#C9A24B]"
            />
            <span>Simulate Unremoved Metallic Crown</span>
          </label>
          <label className="inline-flex items-center gap-2 text-xs text-[#E6E8EC] cursor-pointer">
            <input
              type="checkbox"
              checked={pacemakerWarning}
              onChange={(e) => {
                setPacemakerWarning(e.target.checked);
                onInteract?.();
              }}
              className="accent-rose-500"
            />
            <span>Patient Has Cardiac Pacemaker</span>
          </label>
        </div>
      </div>
    </ThreeSandboxShell>
  );
};

// ============================================================================
// 3. Radiographic Working Length & Resorption Lab (Lecture 3, Sandbox 3)
// ============================================================================
export const RadiographicRulerSandbox: React.FC<{ onInteract?: () => void }> = ({ onInteract }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);

  const [preopMm, setPreopMm] = useState(21.0);
  const [radGapMm, setRadGapMm] = useState(0.5); // distance from file tip to radiographic apex (+ = short)
  const [hasResorption, setHasResorption] = useState(false);

  const initialPlaceMm = preopMm - 1.0;
  const adjustedLengthMm = initialPlaceMm + radGapMm;
  const subtractionMm = hasResorption ? 2.0 : 1.0;
  const correctedWlMm = Number((adjustedLengthMm - subtractionMm).toFixed(1));

  const stateRef = useRef({ preopMm, radGapMm, hasResorption, correctedWlMm });
  stateRef.current = { preopMm, radGapMm, hasResorption, correctedWlMm };

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const studio = createStudioScene(el, {
      cameraPos: [0, 0.2, 6.8],
      target: [0, 0, 0],
    });
    if (!studio) return;
    studioRef.current = studio;

    const { group: toothGroup } = buildCutawayToothGroup({ resorption: false });
    toothGroup.position.set(-1.35, 0.1, 0);
    studio.scene.add(toothGroup);

    const fileGroup = buildEndodonticFileGroup({
      handleColor: 0xc9a24b,
      crossSection: 'square',
      length: 3.7,
    });
    const rubberStop = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 0.1, 20),
      new THREE.MeshStandardMaterial({ color: 0x1b3a8c, roughness: 0.4 })
    );
    rubberStop.position.y = 1.6;
    fileGroup.add(rubberStop);
    studio.scene.add(fileGroup);

    // Endodontic Millimeter Ruler
    const rulerTex = createRulerTexture(studio.maxAnisotropy);
    const ruler = new THREE.Mesh(
      new THREE.BoxGeometry(3.8, 0.85, 0.12),
      new THREE.MeshStandardMaterial({ map: rulerTex, roughness: 0.35 })
    );
    ruler.position.set(1.5, -0.35, 0);
    studio.scene.add(ruler);

    // Slider indicator pin on ruler
    const markerPin = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.96, 0.2),
      new THREE.MeshStandardMaterial({ color: 0xc9a24b, metalness: 0.7, roughness: 0.25 })
    );
    markerPin.position.set(1.5, -0.35, 0.08);
    studio.scene.add(markerPin);

    let currFileY = 0.3;
    let currPinX = 1.5;

    studio.startLoop((dt) => {
      const { correctedWlMm: wl, hasResorption: res } = stateRef.current;
      const targetY = 0.55 - (wl - 19.0) * 0.22;
      currFileY = THREE.MathUtils.damp(currFileY, targetY, 8, dt);
      fileGroup.position.set(-1.35, currFileY, 0);

      // Subtle apical shortening scale when resorption active
      const targetScaleY = res ? 0.92 : 1.0;
      toothGroup.scale.y = THREE.MathUtils.damp(toothGroup.scale.y, targetScaleY, 6, dt);

      // Align marker pin with 0-30 mm printed ruler texture scale
      const targetPinX = -0.22 + THREE.MathUtils.clamp(wl / 30, 0, 1) * 3.44;
      currPinX = THREE.MathUtils.damp(currPinX, targetPinX, 8, dt);
      markerPin.position.x = currPinX;
    });

    return () => {
      studio.dispose();
      studioRef.current = null;
    };
  }, []);

  return (
    <ThreeSandboxShell
      title={LEC3.sandboxes3d[2].title}
      metricBadge={`Final WL: ${correctedWlMm.toFixed(1)} mm`}
      learningGoal={LEC3.sandboxes3d[2].learningGoal}
      mountRef={mountRef}
      onResetView={() =>
        studioRef.current?.flyToCamera(new THREE.Vector3(0, 0.2, 6.8), new THREE.Vector3(0, 0, 0))
      }
      fallbackSummary="3D Endodontic Millimeter Ruler and rubber-stopper calibration showing preoperative measurement, initial -1.0 mm trial file, radiographic discrepancy adjustment, and -1.0 mm vs -2.0 mm resorption subtraction."
      readout={
        <div className="rounded-lg bg-[#0B1F4D]/92 border border-[#FAF8F3]/20 px-3 py-2 text-right font-mono-tabular">
          <div className="text-[11px] text-[#C9A24B]">Corrected Working Length</div>
          <div className="text-sm font-bold text-[#FAF8F3]">{correctedWlMm.toFixed(1)} mm</div>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#E6E8EC]">Pre-op Radiograph Length</span>
            <span className="font-mono-tabular text-[#C9A24B]">{preopMm.toFixed(1)} mm</span>
          </div>
          <input
            type="range"
            min={17}
            max={26}
            step={0.5}
            value={preopMm}
            onChange={(e) => {
              setPreopMm(Number(e.target.value));
              onInteract?.();
            }}
            className="w-full pd-slider"
            aria-label="Preoperative radiograph length in mm"
          />
          <div className="text-[11px] text-[#E6E8EC]/80 mt-1 font-mono-tabular">
            Trial File Placement (-1.0 mm): {initialPlaceMm.toFixed(1)} mm
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#E6E8EC]">File Tip to Radiographic Apex (Δ)</span>
            <span className="font-mono-tabular text-[#C9A24B]">
              {radGapMm >= 0 ? `+${radGapMm.toFixed(1)}` : radGapMm.toFixed(1)} mm
            </span>
          </div>
          <input
            type="range"
            min={-1.5}
            max={3.0}
            step={0.5}
            value={radGapMm}
            onChange={(e) => {
              setRadGapMm(Number(e.target.value));
              onInteract?.();
            }}
            className="w-full pd-slider"
            aria-label="Radiograph discrepancy from apex in mm"
          />
          <div className="text-[11px] text-[#E6E8EC]/80 mt-1 font-mono-tabular">
            Adjusted Tooth Length: {adjustedLengthMm.toFixed(1)} mm
          </div>
        </div>

        <div>
          <label className="inline-flex items-center gap-2 text-xs font-medium text-[#FAF8F3] cursor-pointer">
            <input
              type="checkbox"
              checked={hasResorption}
              onChange={(e) => {
                setHasResorption(e.target.checked);
                onInteract?.();
              }}
              className="accent-[#C9A24B]"
            />
            <span>External Root Resorption Present (-2.0 mm)</span>
          </label>
          <div className="text-[11px] text-[#E6E8EC]/85 mt-1.5 font-mono-tabular">
            {adjustedLengthMm.toFixed(1)} mm − {subtractionMm.toFixed(1)} mm ={' '}
            <strong className="text-[#C9A24B]">{correctedWlMm.toFixed(1)} mm</strong>
          </div>
        </div>
      </div>
    </ThreeSandboxShell>
  );
};
