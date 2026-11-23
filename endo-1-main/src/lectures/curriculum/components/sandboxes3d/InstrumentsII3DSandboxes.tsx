import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ThreeSandboxShell } from '../ThreeSandboxShell';
import { createStudioScene, disposeObject3D, StudioContext } from '../../three/studioEngine';
import {
  buildCrossSectionDisc,
  buildCutawayToothGroup,
  buildEndodonticFileGroup,
  CrossSectionShapeType,
} from '../../three/dentalGeometry';
import { LECTURES } from '../../data/lectures';

const LEC5 = LECTURES[3];

const ROTARY_SYSTEMS = {
  profile: {
    name: 'ProFile / GT',
    shape: 'ushape' as CrossSectionShapeType,
    rpmLabel: '275–325 rpm Continuous',
    summary: 'U-shape cross-section with radial lands, 20° helix angle, neutral/negative rake, bullet noncutting tip.',
    motion: 'continuous' as const,
  },
  protaper_u: {
    name: 'ProTaper Universal',
    shape: 'convexTriangle' as CrossSectionShapeType,
    rpmLabel: '250–300 rpm + Brushing',
    summary: 'Convex triangular cross-section, no radial lands, progressive S1/S2 & regressive F1–F5 tapers.',
    motion: 'brushing' as const,
  },
  protaper_next: {
    name: 'ProTaper Next (X1–X5)',
    shape: 'offsetRect' as CrossSectionShapeType,
    rpmLabel: '300 rpm Swaggering',
    summary: 'Off-centered rectangular cross-section: 2-point dentin contact + swaggering debris augering.',
    motion: 'swagger' as const,
  },
  waveone: {
    name: 'WaveOne (M-Wire)',
    shape: 'convexTriangle' as CrossSectionShapeType,
    rpmLabel: 'Reciprocating Reverse-Cut',
    summary: 'Single-file M-Wire (4× cyclic fatigue resistance): Small 20/06, Primary 25/08, Large 40/08.',
    motion: 'reciprocate' as const,
  },
  race: {
    name: 'RaCe / BioRaCe',
    shape: 'triangle' as CrossSectionShapeType,
    rpmLabel: 'Alternating Cutting Edges',
    summary: 'Electropolished surface with alternating cutting edges to reduce screwing-in tendency.',
    motion: 'continuous' as const,
  },
  twisted: {
    name: 'Twisted File (R-Phase)',
    shape: 'triangle' as CrossSectionShapeType,
    rpmLabel: 'R-Phase Plastic Twisting',
    summary: 'Thermal transformation into R-phase allows fluted NiTi twisting without grinding micro-flaws.',
    motion: 'continuous' as const,
  },
};

// ============================================================================
// 1. NiTi Rotary Systems & Kinematics Comparator (Lecture 5, Sandbox 1)
// ============================================================================
export const RotarySystemsSandbox: React.FC<{ onInteract?: () => void }> = ({ onInteract }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const holderRef = useRef<THREE.Group | null>(null);

  const [systemKey, setSystemKey] = useState<keyof typeof ROTARY_SYSTEMS>('protaper_next');
  const [speedMult, setSpeedMult] = useState(1.0);
  const stateRef = useRef({ systemKey, speedMult });
  stateRef.current = { systemKey, speedMult };

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const studio = createStudioScene(el, {
      cameraPos: [0.4, 0.3, 5.8],
      target: [0, 0, 0],
    });
    if (!studio) return;
    studioRef.current = studio;

    const holder = new THREE.Group();
    holderRef.current = holder;
    studio.scene.add(holder);

    studio.startLoop((_, elapsed) => {
      const { systemKey: sk, speedMult: spd } = stateRef.current;
      const sys = ROTARY_SYSTEMS[sk];
      const file = holder.getObjectByName('rotary-file');
      const disc = holder.getObjectByName('rotary-disc');
      const t = elapsed * spd;

      if (file) {
        if (sys.motion === 'reciprocate') {
          // Asymmetric CCW/CW reciprocation
          file.rotation.y = Math.sin(t * 7.5) * 1.15 - t * 0.65;
          file.position.x = -1.1;
        } else if (sys.motion === 'swagger') {
          file.rotation.y = t * 5.0;
          file.position.x = -1.1 + Math.cos(t * 5.0) * 0.08;
          file.position.z = Math.sin(t * 5.0) * 0.08;
        } else if (sys.motion === 'brushing') {
          file.rotation.y = t * 4.5;
          file.position.x = -1.1 + Math.sin(t * 2.2) * 0.14;
        } else {
          file.rotation.y = t * 4.8;
          file.position.x = -1.1;
        }
      }
      if (disc) {
        disc.rotation.z = sys.motion === 'reciprocate' ? Math.sin(t * 7.5) * 1.1 : t * 1.2;
      }
    });

    return () => {
      studio.dispose();
      studioRef.current = null;
      holderRef.current = null;
    };
  }, []);

  useEffect(() => {
    const holder = holderRef.current;
    if (!holder || !mountRef.current) return;
    while (holder.children.length > 0) {
      const c = holder.children[0];
      holder.remove(c);
      disposeObject3D(c);
    }

    const sys = ROTARY_SYSTEMS[systemKey];
    const file = buildEndodonticFileGroup({
      handleColor: systemKey === 'waveone' ? 0xdc2626 : systemKey === 'protaper_next' ? 0x1b3a8c : 0xc9a24b,
      metalColor: systemKey === 'twisted' ? 0xb8c7e0 : 0xd4dbe6,
      crossSection: sys.shape,
      nonCuttingTip: true,
      length: 3.1,
      taper: 0.06,
      helixTightness: 8,
    });
    file.name = 'rotary-file';
    file.position.set(-1.1, -0.2, 0);
    holder.add(file);

    const disc = buildCrossSectionDisc(sys.shape, 0xc9a24b);
    disc.name = 'rotary-disc';
    disc.position.set(1.45, 0.25, 0);
    disc.scale.setScalar(1.35);
    holder.add(disc);
  }, [systemKey]);

  const activeSys = ROTARY_SYSTEMS[systemKey];

  return (
    <ThreeSandboxShell
      title={LEC5.sandboxes3d[0].title}
      metricBadge={activeSys.rpmLabel}
      learningGoal={LEC5.sandboxes3d[0].learningGoal}
      mountRef={mountRef}
      onResetView={() =>
        studioRef.current?.flyToCamera(new THREE.Vector3(0.4, 0.3, 5.8), new THREE.Vector3(0, 0, 0))
      }
      fallbackSummary="3D NiTi rotary instrumentation viewer comparing ProFile U-shape, ProTaper Universal convex triangle, ProTaper Next off-centered swagger, WaveOne reciprocation, RaCe, and Twisted File."
      readout={
        <div className="rounded-lg bg-[#0B1F4D]/92 border border-[#FAF8F3]/20 px-3 py-2 text-right">
          <div className="text-[11px] font-bold text-[#C9A24B]">{activeSys.name}</div>
          <div className="text-[11px] font-mono-tabular text-[#FAF8F3]">{activeSys.rpmLabel}</div>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
        <div className="md:col-span-2">
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(ROTARY_SYSTEMS).map(([k, s]) => (
              <button
                key={k}
                type="button"
                onClick={() => {
                  setSystemKey(k as keyof typeof ROTARY_SYSTEMS);
                  onInteract?.();
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold whitespace-nowrap shrink-0 ${
                  systemKey === k ? 'bg-[#C9A24B] text-[#0B1F4D]' : 'bg-[#1B3A8C]/70 text-[#FAF8F3]'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[#E6E8EC]/90 mt-1.5 leading-tight">{activeSys.summary}</p>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#E6E8EC]">Motion Speed</span>
            <span className="font-mono-tabular text-[#C9A24B]">{speedMult.toFixed(1)}×</span>
          </div>
          <input
            type="range"
            min={0.2}
            max={2.0}
            step={0.1}
            value={speedMult}
            onChange={(e) => {
              setSpeedMult(Number(e.target.value));
              onInteract?.();
            }}
            className="w-full pd-slider"
            aria-label="Rotary instrument animation speed"
          />
        </div>
      </div>
    </ThreeSandboxShell>
  );
};

// ============================================================================
// 2. Self-Adjusting File (SAF) 3D Lattice & Oval Canal Lab (Lecture 5, Sandbox 2)
// ============================================================================
export const SafLatticeSandbox: React.FC<{ onInteract?: () => void }> = ({ onInteract }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);

  const [isCompressed, setIsCompressed] = useState(true);
  const [irrigantFlow, setIrrigantFlow] = useState(true);
  const stateRef = useRef({ isCompressed, irrigantFlow });
  stateRef.current = { isCompressed, irrigantFlow };

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const studio = createStudioScene(el, {
      cameraPos: [0.8, 0.4, 5.8],
      target: [0, -0.2, 0],
    });
    if (!studio) return;
    studioRef.current = studio;

    // Translucent oval/flattened root canal cutaway
    const ovalOuter = new THREE.Mesh(
      new THREE.CylinderGeometry(0.95, 0.58, 3.6, 32, 1, true, Math.PI * 0.25, Math.PI * 1.45),
      new THREE.MeshStandardMaterial({
        color: 0xe6cf9e,
        roughness: 0.5,
        side: THREE.DoubleSide,
      })
    );
    ovalOuter.scale.set(1.35, 1, 0.72); // Flattened oval morphology!
    studio.scene.add(ovalOuter);

    // Hollow NiTi SAF lattice cylinder (wireframe + axial struts)
    const safGroup = new THREE.Group();
    const latticeGeo = new THREE.CylinderGeometry(0.45, 0.3, 3.2, 12, 16, true);
    const latticeMat = new THREE.MeshStandardMaterial({
      color: 0xdbeafe,
      metalness: 0.88,
      roughness: 0.25,
      wireframe: true,
    });
    const latticeMesh = new THREE.Mesh(latticeGeo, latticeMat);
    safGroup.add(latticeMesh);
    studio.scene.add(safGroup);

    // Continuous irrigant flow particles inside hollow lattice
    const particleCount = 36;
    const pGeo = new THREE.SphereGeometry(0.036, 8, 8);
    const pMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const particles = new THREE.InstancedMesh(pGeo, pMat, particleCount);
    particles.frustumCulled = false;
    studio.scene.add(particles);

    const dummy = new THREE.Object3D();

    studio.startLoop((dt, elapsed) => {
      const { isCompressed: comp, irrigantFlow: flow } = stateRef.current;
      // Compresses from 1.5 mm circular -> adapts to oval canal (#20 glidepath)
      const targetScaleX = comp ? 1.15 : 1.55;
      const targetScaleZ = comp ? 0.55 : 1.55;
      safGroup.scale.x = THREE.MathUtils.damp(safGroup.scale.x, targetScaleX, 6, dt);
      safGroup.scale.z = THREE.MathUtils.damp(safGroup.scale.z, targetScaleZ, 6, dt);

      // 5000 vpm / 0.4 mm in-and-out vertical oscillation
      safGroup.position.y = Math.sin(elapsed * 18) * 0.12;

      particles.visible = flow;
      if (flow) {
        for (let i = 0; i < particleCount; i++) {
          const phase = ((elapsed * 0.85 + i / particleCount) % 1);
          const y = 1.6 - phase * 3.2;
          const angle = i * 1.9 + elapsed * 3;
          const r = 0.22 + phase * 0.14;
          dummy.position.set(Math.cos(angle) * r * safGroup.scale.x, y, Math.sin(angle) * r * safGroup.scale.z);
          dummy.scale.setScalar(1);
          dummy.updateMatrix();
          particles.setMatrixAt(i, dummy.matrix);
        }
        particles.instanceMatrix.needsUpdate = true;
      }
    });

    return () => {
      studio.dispose();
      studioRef.current = null;
    };
  }, []);

  return (
    <ThreeSandboxShell
      title={LEC5.sandboxes3d[1].title}
      metricBadge="5,000 vpm · 0.4 mm"
      learningGoal={LEC5.sandboxes3d[1].learningGoal}
      mountRef={mountRef}
      onResetView={() =>
        studioRef.current?.flyToCamera(new THREE.Vector3(0.8, 0.4, 5.8), new THREE.Vector3(0, -0.2, 0))
      }
      fallbackSummary="3D hollow thin-walled NiTi Self-Adjusting File lattice compressing from 1.5 mm into an oval #20 K-file glidepath with 5,000 vpm oscillation and continuous irrigant flushing."
      readout={
        <div className="rounded-lg bg-[#0B1F4D]/92 border border-[#FAF8F3]/20 px-3 py-2 text-right">
          <div className="text-[11px] font-bold text-[#C9A24B]">
            {isCompressed ? 'Compressed Into Oval Canal' : 'Uncompressed (1.5 mm Cylinder)'}
          </div>
          <div className="text-[11px] text-[#E6E8EC]">Glidepath: #20 K-file · Irrigant: {irrigantFlow ? 'Active' : 'Paused'}</div>
        </div>
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setIsCompressed(true);
              onInteract?.();
            }}
            className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap shrink-0 ${
              isCompressed ? 'bg-[#C9A24B] text-[#0B1F4D]' : 'bg-[#1B3A8C] text-[#FAF8F3]'
            }`}
          >
            Adapt to Oval Canal (#25 equiv.)
          </button>
          <button
            type="button"
            onClick={() => {
              setIsCompressed(false);
              onInteract?.();
            }}
            className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap shrink-0 ${
              !isCompressed ? 'bg-[#C9A24B] text-[#0B1F4D]' : 'bg-[#1B3A8C] text-[#FAF8F3]'
            }`}
          >
            Expand Free Diameter (1.5 mm)
          </button>
        </div>

        <label className="inline-flex items-center gap-2 text-xs text-[#E6E8EC] cursor-pointer">
          <input
            type="checkbox"
            checked={irrigantFlow}
            onChange={(e) => {
              setIrrigantFlow(e.target.checked);
              onInteract?.();
            }}
            className="accent-[#C9A24B]"
          />
          <span>Continuous Irrigant Flushing</span>
        </label>
      </div>
    </ThreeSandboxShell>
  );
};

// ============================================================================
// 3. Ultrasonic Standing Wave, Cavitation & Acoustic Streaming (Lecture 5, Sandbox 3)
// ============================================================================
export const UltrasonicWaveSandbox: React.FC<{ onInteract?: () => void }> = ({ onInteract }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);

  const [unitType, setUnitType] = useState<'piezo' | 'magneto' | 'sonic'>('piezo');
  const [powerLevel, setPowerLevel] = useState(0.65);
  const stateRef = useRef({ unitType, powerLevel });
  stateRef.current = { unitType, powerLevel };

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const studio = createStudioScene(el, {
      cameraPos: [0.2, 0.2, 5.8],
      target: [0, -0.2, 0],
    });
    if (!studio) return;
    studioRef.current = studio;

    const { group: toothGroup } = buildCutawayToothGroup({});
    studio.scene.add(toothGroup);

    // Segmented oscillating ultrasonic file inside canal
    const segCount = 26;
    const segGeo = new THREE.CylinderGeometry(0.036, 0.038, 0.14, 10);
    const segMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.18 });
    const fileSegs = new THREE.InstancedMesh(segGeo, segMat, segCount);
    fileSegs.frustumCulled = false;
    studio.scene.add(fileSegs);

    // Cavitation micro-implosion bubbles & acoustic streaming orbits
    const bubbleCount = 28;
    const bubbleGeo = new THREE.SphereGeometry(0.042, 10, 10);
    const bubbleMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.78 });
    const bubbles = new THREE.InstancedMesh(bubbleGeo, bubbleMat, bubbleCount);
    bubbles.frustumCulled = false;
    studio.scene.add(bubbles);

    // Node & Antinode marker rings
    const antinodeTip = new THREE.Mesh(
      new THREE.TorusGeometry(0.14, 0.018, 8, 24),
      new THREE.MeshBasicMaterial({ color: 0xc9a24b })
    );
    antinodeTip.rotation.x = Math.PI / 2;
    antinodeTip.position.set(0, -1.65, 0);
    studio.scene.add(antinodeTip);

    const dummy = new THREE.Object3D();

    studio.startLoop((_, elapsed) => {
      const { unitType: ut, powerLevel: pwr } = stateRef.current;
      const freq = ut === 'sonic' ? 12 : 28;
      const amp = (ut === 'sonic' ? 0.14 : 0.09) * pwr;

      for (let i = 0; i < segCount; i++) {
        const t = i / (segCount - 1); // 0 top, 1 tip (antinode)
        const y = 1.4 - t * 3.05;
        // Standing wave envelope: sin/cos with maximal displacement at tip (t=1)
        const envelope = Math.cos(t * Math.PI * 2.5);
        const dx = envelope * Math.sin(elapsed * freq) * amp;
        dummy.position.set(dx, y, 0);
        dummy.scale.setScalar(1 - t * 0.35);
        dummy.updateMatrix();
        fileSegs.setMatrixAt(i, dummy.matrix);
      }
      fileSegs.instanceMatrix.needsUpdate = true;

      // Cavitation + acoustic streaming bubbles
      for (let b = 0; b < bubbleCount; b++) {
        const t = (b / bubbleCount);
        const y = 1.1 - t * 2.7;
        const spin = elapsed * (ut === 'sonic' ? 2.5 : 6.0) + b * 1.3;
        const r = 0.08 + ((elapsed * 1.5 + b * 0.2) % 0.16);
        dummy.position.set(Math.cos(spin) * r, y, Math.sin(spin) * r);
        const popScale = ut === 'sonic' ? 0.55 : 0.4 + Math.abs(Math.sin(elapsed * 8 + b)) * 0.8 * pwr;
        dummy.scale.setScalar(popScale);
        dummy.updateMatrix();
        bubbles.setMatrixAt(b, dummy.matrix);
      }
      bubbles.instanceMatrix.needsUpdate = true;
    });

    return () => {
      studio.dispose();
      studioRef.current = null;
    };
  }, []);

  const unitSpecs = {
    piezo: {
      label: 'Piezoelectric (Enac · 25–30 kHz)',
      heat: 'Generates little heat — no handpiece cooling needed.',
      files: 'Uses regular K-files passively in fluid.',
    },
    magneto: {
      label: 'Magnetostrictive (Cavi-endo · 25–30 kHz)',
      heat: 'Generates considerable heat — special handpiece cooling required.',
      files: 'Uses regular K-files passively in fluid.',
    },
    sonic: {
      label: 'Sonic (Sonic Air MM 1500 · 2–3 kHz)',
      heat: 'Air-driven low heat.',
      files: 'Special files: Rispi-Sonic, Shaper-Sonic, Trio-Sonic, Heli-Sonic.',
    },
  }[unitType];

  return (
    <ThreeSandboxShell
      title={LEC5.sandboxes3d[2].title}
      metricBadge={unitType === 'sonic' ? '2–3 kHz Sonic' : '25–30 kHz Ultrasonic'}
      learningGoal={LEC5.sandboxes3d[2].learningGoal}
      mountRef={mountRef}
      onResetView={() =>
        studioRef.current?.flyToCamera(new THREE.Vector3(0.2, 0.2, 5.8), new THREE.Vector3(0, -0.2, 0))
      }
      fallbackSummary="3D standing wave visualization inside an irrigant-filled root canal showing nodes, tip antinode displacement, cavitation implosions, and circular acoustic streaming."
      readout={
        <div className="rounded-lg bg-[#0B1F4D]/92 border border-[#FAF8F3]/20 px-3 py-2 text-right">
          <div className="text-[11px] font-bold text-[#C9A24B]">{unitSpecs.label}</div>
          <div className="text-[11px] text-[#E6E8EC]">{unitSpecs.heat}</div>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
        <div>
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                ['piezo', 'Piezoelectric (30 kHz)'],
                ['magneto', 'Magnetostrictive (30 kHz)'],
                ['sonic', 'Sonic (2–3 kHz)'],
              ] as const
            ).map(([k, lbl]) => (
              <button
                key={k}
                type="button"
                onClick={() => {
                  setUnitType(k);
                  onInteract?.();
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold whitespace-nowrap shrink-0 ${
                  unitType === k ? 'bg-[#C9A24B] text-[#0B1F4D]' : 'bg-[#1B3A8C]/70 text-[#FAF8F3]'
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[#E6E8EC]/85 mt-1.5 leading-tight">{unitSpecs.files}</p>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#E6E8EC]">Controlled Power Level (Keep Passive)</span>
            <span className="font-mono-tabular text-[#C9A24B]">{Math.round(powerLevel * 100)}%</span>
          </div>
          <input
            type="range"
            min={0.2}
            max={1.0}
            step={0.05}
            value={powerLevel}
            onChange={(e) => {
              setPowerLevel(Number(e.target.value));
              onInteract?.();
            }}
            className="w-full pd-slider"
            aria-label="Ultrasonic power control"
          />
        </div>
      </div>
    </ThreeSandboxShell>
  );
};
