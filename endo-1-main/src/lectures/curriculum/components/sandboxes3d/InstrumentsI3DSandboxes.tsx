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

const LEC4B = LECTURES[2];

const FILE_SPECS: Record<
  string,
  {
    name: string;
    shape: CrossSectionShapeType;
    summary: string;
    motion: string;
    nonCutting: boolean;
  }
> = {
  kfile: {
    name: 'K-File / K-Reamer',
    shape: 'square',
    summary: 'Twisted square/triangular SS wire. File has more flutes/unit length than reamer.',
    motion: 'Reaming causes less apical transportation than filing.',
    nonCutting: false,
  },
  kflex: {
    name: 'K-Flex File',
    shape: 'rhomboid',
    summary: 'Rhomboid cross-section: 2 acute cutting edges + 2 obtuse debris-removal edges.',
    motion: 'Higher cutting efficiency & flexibility than standard K-file.',
    nonCutting: false,
  },
  flexo: {
    name: 'Flex-O / Flex-R File',
    shape: 'triangle',
    summary: 'Triangular cross-section (60°) with smooth rounded non-cutting tip.',
    motion: 'Eliminates apical ledge formation; Flex-R cuts efficiently anti-clockwise.',
    nonCutting: true,
  },
  hfile: {
    name: 'Hedström (H-File)',
    shape: 'hfile',
    summary: 'Ground single continuous flute; positive rake angle cuts ONLY on pulling stroke.',
    motion: 'Bending creates higher stress concentration & crack propagation risk.',
    nonCutting: false,
  },
  sfile: {
    name: 'S-File (Uni-File)',
    shape: 'sfile',
    summary: 'Ground S-shaped cross-section; stiffer than Hedström file.',
    motion: 'Used in either filing or reaming cutting action.',
    nonCutting: false,
  },
  broach: {
    name: 'Barbed Broach',
    shape: 'broach',
    summary: 'Round tapered wire hacked with sharp barbs; removes pulp/cotton, does NOT cut dentin.',
    motion: 'Must enter canal without bending or engaging dentin walls.',
    nonCutting: false,
  },
};

// ============================================================================
// 1. Hand File Cross-Section & Cutting Motion Studio (Lecture 4B, Sandbox 1)
// ============================================================================
export const HandFileCrossSectionSandbox: React.FC<{ onInteract?: () => void }> = ({ onInteract }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const rootGroupRef = useRef<THREE.Group | null>(null);

  const [selectedFile, setSelectedFile] = useState<keyof typeof FILE_SPECS>('kflex');
  const [motionMode, setMotionMode] = useState<'reaming' | 'pulling' | 'filing'>('reaming');

  const stateRef = useRef({ motionMode });
  stateRef.current = { motionMode };

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const studio = createStudioScene(el, {
      cameraPos: [0.4, 0.4, 5.8],
      target: [0, 0, 0],
    });
    if (!studio) return;
    studioRef.current = studio;

    const container = new THREE.Group();
    rootGroupRef.current = container;
    studio.scene.add(container);

    studio.startLoop((_, elapsed) => {
      const fileObj = container.getObjectByName('active-file');
      const discObj = container.getObjectByName('active-disc');
      const mode = stateRef.current.motionMode;
      if (fileObj) {
        if (mode === 'reaming') {
          fileObj.rotation.y = elapsed * 2.2;
          fileObj.position.y = -0.2;
        } else if (mode === 'pulling') {
          fileObj.rotation.y = 0.4;
          fileObj.position.y = -0.2 + Math.sin(elapsed * 3.0) * 0.35;
        } else {
          fileObj.rotation.y = Math.sin(elapsed * 2.0) * 0.35;
          fileObj.position.y = -0.2 + Math.sin(elapsed * 4.2) * 0.25;
        }
      }
      if (discObj) {
        discObj.rotation.z = elapsed * 0.7;
      }
    });

    return () => {
      studio.dispose();
      studioRef.current = null;
      rootGroupRef.current = null;
    };
  }, []);

  // Rebuild active 3D file & cross-section disc whenever selectedFile changes
  useEffect(() => {
    const container = rootGroupRef.current;
    if (!container || !mountRef.current) return;

    while (container.children.length > 0) {
      const child = container.children[0];
      container.remove(child);
      disposeObject3D(child);
    }

    const spec = FILE_SPECS[selectedFile];
    const file = buildEndodonticFileGroup({
      handleColor: selectedFile === 'hfile' ? 0x16a34a : selectedFile === 'kflex' ? 0x1b3a8c : 0xdc2626,
      crossSection: spec.shape,
      nonCuttingTip: spec.nonCutting,
      length: 3.1,
      helixTightness: selectedFile === 'hfile' ? 11 : 7,
    });
    file.name = 'active-file';
    file.position.set(-1.1, -0.2, 0);
    container.add(file);

    const disc = buildCrossSectionDisc(spec.shape, 0xc9a24b);
    disc.name = 'active-disc';
    disc.position.set(1.45, 0.2, 0);
    disc.scale.setScalar(1.35);
    container.add(disc);
  }, [selectedFile]);

  const spec = FILE_SPECS[selectedFile];

  return (
    <ThreeSandboxShell
      title={LEC4B.sandboxes3d[0].title}
      metricBadge={spec.name}
      learningGoal={LEC4B.sandboxes3d[0].learningGoal}
      mountRef={mountRef}
      onResetView={() =>
        studioRef.current?.flyToCamera(new THREE.Vector3(0.4, 0.4, 5.8), new THREE.Vector3(0, 0, 0))
      }
      fallbackSummary="3D comparison of endodontic hand instruments and axial cross-sections: Square K-file, Rhomboid K-Flex, Triangular Flex-O/Flex-R, Ground Hedström, S-File, and Barbed Broach."
      readout={
        <div className="rounded-lg bg-[#0B1F4D]/92 border border-[#FAF8F3]/20 px-3 py-2 text-right max-w-xs">
          <div className="text-[11px] font-bold text-[#C9A24B]">{spec.name}</div>
          <div className="text-[11px] text-[#E6E8EC]">{spec.motion}</div>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
        <div>
          <div className="text-xs font-medium text-[#E6E8EC] mb-1.5">Instrument Geometry</div>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(FILE_SPECS).map(([key, item]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setSelectedFile(key as keyof typeof FILE_SPECS);
                  onInteract?.();
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold whitespace-nowrap shrink-0 ${
                  selectedFile === key
                    ? 'bg-[#C9A24B] text-[#0B1F4D]'
                    : 'bg-[#1B3A8C]/70 text-[#FAF8F3] hover:bg-[#1B3A8C]'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[#E6E8EC]/85 mt-1.5 leading-tight">{spec.summary}</p>
        </div>

        <div>
          <div className="text-xs font-medium text-[#E6E8EC] mb-1.5">Kinematics Motion</div>
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                ['reaming', 'Reaming (Rotation)'],
                ['pulling', 'Pulling Stroke (H-file)'],
                ['filing', 'Filing Push-Pull'],
              ] as const
            ).map(([m, lbl]) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMotionMode(m);
                  onInteract?.();
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold whitespace-nowrap shrink-0 ${
                  motionMode === m ? 'bg-[#FAF8F3] text-[#0B1F4D]' : 'bg-[#1B3A8C]/70 text-[#FAF8F3]'
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>
      </div>
    </ThreeSandboxShell>
  );
};

// ============================================================================
// 2. Tip Design, Radial Land, Rake & Helical Angle Lab (Lecture 4B, Sandbox 2)
// ============================================================================
export const TipRakeHelixSandbox: React.FC<{ onInteract?: () => void }> = ({ onInteract }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);

  const [tipType, setTipType] = useState<'batt' | 'cutting'>('batt');
  const [rakeMode, setRakeMode] = useState<'positive' | 'neutral' | 'negative'>('positive');
  const [radialLand, setRadialLand] = useState(true);

  const stateRef = useRef({ tipType, rakeMode, radialLand });
  stateRef.current = { tipType, rakeMode, radialLand };

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const studio = createStudioScene(el, {
      cameraPos: [0.6, -0.3, 6.2],
      target: [0, -0.4, 0],
    });
    if (!studio) return;
    studioRef.current = studio;

    const { group: toothGroup } = buildCutawayToothGroup({ curved: true });
    studio.scene.add(toothGroup);

    // File advancing along curved canal
    const safeFile = buildEndodonticFileGroup({
      handleColor: 0x10b981,
      crossSection: 'triangle',
      nonCuttingTip: true,
      length: 3.3,
    });
    const sharpFile = buildEndodonticFileGroup({
      handleColor: 0xf43f5e,
      crossSection: 'square',
      nonCuttingTip: false,
      length: 3.3,
    });
    studio.scene.add(safeFile, sharpFile);

    // Ledge defect indicator on outer curve when cutting tip is selected
    const ledgeMesh = new THREE.Mesh(
      new THREE.ConeGeometry(0.16, 0.35, 16),
      new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0xbe123c, emissiveIntensity: 0.45 })
    );
    ledgeMesh.position.set(0.32, -1.5, 0.08);
    ledgeMesh.rotation.z = -Math.PI * 0.35;
    studio.scene.add(ledgeMesh);

    // Radial land / rake blade magnified ring
    const bladeRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.45, 0.04, 10, 28),
      new THREE.MeshStandardMaterial({ color: 0xc9a24b, metalness: 0.85, roughness: 0.2 })
    );
    bladeRing.position.set(1.65, 0.4, 0);
    studio.scene.add(bladeRing);

    const bladeTooth = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.14, 0.14),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.7, roughness: 0.25 })
    );
    bladeTooth.position.set(1.65, 0.85, 0);
    studio.scene.add(bladeTooth);

    studio.startLoop((_, elapsed) => {
      const { tipType: tt, rakeMode: rm, radialLand: rl } = stateRef.current;
      safeFile.visible = tt === 'batt';
      sharpFile.visible = tt === 'cutting';
      ledgeMesh.visible = tt === 'cutting';

      const osc = Math.sin(elapsed * 2.2) * 0.25;
      safeFile.position.set(0.05, 0.05 + osc, 0);
      safeFile.rotation.z = -0.11;
      sharpFile.position.set(0.08, 0.05 + osc, 0);
      sharpFile.rotation.z = -0.02;

      bladeRing.rotation.z = elapsed * 0.8;
      bladeTooth.rotation.z = rm === 'positive' ? 0.38 : rm === 'neutral' ? 0 : -0.38;
      bladeRing.scale.setScalar(rl ? 1.1 : 0.92);
    });

    return () => {
      studio.dispose();
      studioRef.current = null;
    };
  }, []);

  return (
    <ThreeSandboxShell
      title={LEC4B.sandboxes3d[1].title}
      metricBadge={tipType === 'batt' ? 'Batt Safe Tip' : 'Sharp Cutting Tip'}
      learningGoal={LEC4B.sandboxes3d[1].learningGoal}
      mountRef={mountRef}
      onResetView={() =>
        studioRef.current?.flyToCamera(new THREE.Vector3(0.6, -0.3, 6.2), new THREE.Vector3(0, -0.4, 0))
      }
      fallbackSummary="3D curved canal comparing rounded non-cutting Batt/Flex-R tip guidance vs sharp pyramid cutting tip ledging, plus rake angle and radial land visualization."
      readout={
        <div className="rounded-lg bg-[#0B1F4D]/92 border border-[#FAF8F3]/20 px-3 py-2 text-right">
          <div className={`text-[11px] font-bold ${tipType === 'batt' ? 'text-emerald-300' : 'text-rose-300'}`}>
            {tipType === 'batt' ? 'Guides Smoothly Around Curve' : 'Risk: Outer Wall Ledge / Transportation'}
          </div>
          <div className="text-[11px] text-[#E6E8EC]">
            Rake: {rakeMode === 'positive' ? 'Positive (Cutting)' : rakeMode === 'neutral' ? 'Neutral (90°)' : 'Negative (Scraping)'}
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
        <div>
          <div className="text-xs font-medium text-[#E6E8EC] mb-1">Tip Geometry in Curved Canal</div>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => {
                setTipType('batt');
                onInteract?.();
              }}
              className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap shrink-0 ${
                tipType === 'batt' ? 'bg-emerald-400 text-[#0B1F4D]' : 'bg-[#1B3A8C]/70 text-[#FAF8F3]'
              }`}
            >
              Non-Cutting Batt Tip
            </button>
            <button
              type="button"
              onClick={() => {
                setTipType('cutting');
                onInteract?.();
              }}
              className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap shrink-0 ${
                tipType === 'cutting' ? 'bg-rose-400 text-[#0B1F4D]' : 'bg-[#1B3A8C]/70 text-[#FAF8F3]'
              }`}
            >
              Cutting Pyramid Tip
            </button>
          </div>
        </div>

        <div>
          <div className="text-xs font-medium text-[#E6E8EC] mb-1">Rake Angle</div>
          <div className="flex gap-1.5">
            {(
              [
                ['positive', 'Positive (>90°)'],
                ['neutral', 'Neutral (90°)'],
                ['negative', 'Negative (<90°)'],
              ] as const
            ).map(([k, lbl]) => (
              <button
                key={k}
                type="button"
                onClick={() => {
                  setRakeMode(k);
                  onInteract?.();
                }}
                className={`px-2 py-1 rounded text-[11px] font-semibold whitespace-nowrap shrink-0 ${
                  rakeMode === k ? 'bg-[#C9A24B] text-[#0B1F4D]' : 'bg-[#1B3A8C]/70 text-[#FAF8F3]'
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="inline-flex items-center gap-2 text-xs text-[#E6E8EC] cursor-pointer">
            <input
              type="checkbox"
              checked={radialLand}
              onChange={(e) => {
                setRadialLand(e.target.checked);
                onInteract?.();
              }}
              className="accent-[#C9A24B]"
            />
            <span>Include Radial Land (prevents threading)</span>
          </label>
          <p className="text-[11px] text-[#E6E8EC]/80 mt-1 leading-tight">
            Relief reduces frictional resistance of radial lands against dentin.
          </p>
        </div>
      </div>
    </ThreeSandboxShell>
  );
};

// ============================================================================
// 3. ISO Taper Caliper & Gates-Glidden / Peeso Coronal Lab (Lecture 4B, Sandbox 3)
// ============================================================================
export const IsoTaperCoronalSandbox: React.FC<{ onInteract?: () => void }> = ({ onInteract }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);

  const [isoSize, setIsoSize] = useState(25);
  const [taper, setTaper] = useState<0.02 | 0.04 | 0.06>(0.02);
  const [burDepth, setBurDepth] = useState(0.4); // > 0.65 enters curvature -> perforation risk!

  const d0 = isoSize / 100;
  const d1 = d0 + taper * 1;
  const d2 = d0 + taper * 2;
  const d3 = d0 + taper * 3;
  const d14 = d0 + taper * 14;

  const stateRef = useRef({ taper, burDepth });
  stateRef.current = { taper, burDepth };

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const studio = createStudioScene(el, {
      cameraPos: [0, 0.2, 6.6],
      target: [0, 0, 0],
    });
    if (!studio) return;
    studioRef.current = studio;

    // Left: Graduated ISO Taper Cone + Caliper Rings at D0..D3
    const taperCone = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.1, 3.2, 24),
      new THREE.MeshStandardMaterial({ color: 0xc9a24b, metalness: 0.85, roughness: 0.22 })
    );
    taperCone.position.set(-1.6, 0, 0);
    studio.scene.add(taperCone);

    const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    [-1.5, -0.9, -0.3, 0.3].forEach((y) => {
      const r = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.02, 8, 24), ringMat);
      r.rotation.x = Math.PI / 2;
      r.position.set(-1.6, y, 0);
      studio.scene.add(r);
    });

    // Right: Curved tooth + Gates-Glidden flame-shaped low-speed bur
    const { group: toothGroup } = buildCutawayToothGroup({ curved: true });
    toothGroup.position.set(1.3, 0, 0);
    studio.scene.add(toothGroup);

    const ggBur = new THREE.Group();
    const ggShaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.038, 0.038, 2.5, 12),
      new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.92, roughness: 0.18 })
    );
    const ggHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.92, roughness: 0.18 })
    );
    ggHead.scale.set(1, 1.85, 1);
    ggHead.position.y = -1.25;
    ggBur.add(ggShaft, ggHead);
    studio.scene.add(ggBur);

    const perfAlert = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xf43f5e, transparent: true, opacity: 0.75 })
    );
    perfAlert.position.set(1.5, -0.75, 0.15);
    studio.scene.add(perfAlert);

    let currBurY = 1.6;
    studio.startLoop((dt, elapsed) => {
      const { taper: tp, burDepth: bd } = stateRef.current;
      const topScale = 0.7 + tp * 14;
      taperCone.scale.x = THREE.MathUtils.damp(taperCone.scale.x, topScale, 7, dt);
      taperCone.scale.z = taperCone.scale.x;

      const targetBurY = 2.0 - bd * 1.65;
      currBurY = THREE.MathUtils.damp(currBurY, targetBurY, 7, dt);
      ggBur.position.set(1.3, currBurY, 0);
      ggBur.rotation.y = elapsed * 8;

      perfAlert.visible = bd > 0.65;
      perfAlert.scale.setScalar(1 + Math.sin(elapsed * 7) * 0.15);
    });

    return () => {
      studio.dispose();
      studioRef.current = null;
    };
  }, []);

  return (
    <ThreeSandboxShell
      title={LEC4B.sandboxes3d[2].title}
      metricBadge={`#${isoSize} / .0${Math.round(taper * 100)}`}
      learningGoal={LEC4B.sandboxes3d[2].learningGoal}
      mountRef={mountRef}
      onResetView={() =>
        studioRef.current?.flyToCamera(new THREE.Vector3(0, 0.2, 6.6), new THREE.Vector3(0, 0, 0))
      }
      fallbackSummary="3D ISO taper diameter progression (D0 to D14) alongside Gates-Glidden coronal flaring showing straight-line access limits and lateral perforation hazard in canal curvature."
      readout={
        <div className="rounded-lg bg-[#0B1F4D]/92 border border-[#FAF8F3]/20 px-3 py-2 text-right font-mono-tabular">
          <div className="text-[11px] text-[#C9A24B]">
            D0={d0.toFixed(2)} · D1={d1.toFixed(2)} · D2={d2.toFixed(2)} · D3={d3.toFixed(2)} mm
          </div>
          <div className={`text-[11px] font-bold ${burDepth > 0.65 ? 'text-rose-300' : 'text-emerald-300'}`}>
            {burDepth > 0.65 ? 'PERFORATION RISK IN CURVE' : 'Safe Straight Coronal Third'}
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#E6E8EC]">ISO Tip Size (D0)</span>
            <span className="font-mono-tabular text-[#C9A24B]">#{isoSize} ({d0.toFixed(2)} mm)</span>
          </div>
          <input
            type="range"
            min={15}
            max={45}
            step={5}
            value={isoSize}
            onChange={(e) => {
              setIsoSize(Number(e.target.value));
              onInteract?.();
            }}
            className="w-full pd-slider"
            aria-label="ISO file tip size"
          />
        </div>

        <div>
          <div className="text-xs font-medium text-[#E6E8EC] mb-1">Constant Taper</div>
          <div className="flex gap-1.5">
            {([0.02, 0.04, 0.06] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTaper(t);
                  onInteract?.();
                }}
                className={`px-2.5 py-1 rounded text-xs font-mono-tabular font-semibold whitespace-nowrap shrink-0 ${
                  taper === t ? 'bg-[#C9A24B] text-[#0B1F4D]' : 'bg-[#1B3A8C]/70 text-[#FAF8F3]'
                }`}
              >
                .{String(Math.round(t * 100)).padStart(2, '0')}
              </button>
            ))}
          </div>
          <div className="text-[11px] font-mono-tabular text-[#E6E8EC]/80 mt-1">
            D14 = {d14.toFixed(2)} mm
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#E6E8EC]">Gates-Glidden Depth</span>
            <span className="font-mono-tabular text-[#C9A24B]">{Math.round(burDepth * 100)}%</span>
          </div>
          <input
            type="range"
            min={0.15}
            max={0.9}
            step={0.05}
            value={burDepth}
            onChange={(e) => {
              setBurDepth(Number(e.target.value));
              onInteract?.();
            }}
            className="w-full pd-slider"
            aria-label="Gates-Glidden coronal insertion depth"
          />
          <p className="text-[11px] text-[#E6E8EC]/80 mt-1">
            Never use GG burs or Peeso reamers past the initial point of curvature.
          </p>
        </div>
      </div>
    </ThreeSandboxShell>
  );
};
