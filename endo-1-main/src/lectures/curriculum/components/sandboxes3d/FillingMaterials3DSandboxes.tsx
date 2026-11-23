import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ThreeSandboxShell } from '../ThreeSandboxShell';
import { createDentinTubuleTexture, createStudioScene, StudioContext } from '../../three/studioEngine';
import { buildCutawayToothGroup } from '../../three/dentalGeometry';
import { LECTURES } from '../../data/lectures';

const LEC7 = LECTURES[4];

// ============================================================================
// 1. Sealer-Dentin Interface, Tubules & Bioactivity Lab (Lecture 7, Sandbox 1)
// ============================================================================
export const SealerInterfaceSandbox: React.FC<{ onInteract?: () => void }> = ({ onInteract }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);

  const [sealerType, setSealerType] = useState<'bioceramic' | 'methacrylate' | 'znoe' | 'silicone'>('bioceramic');
  const [smearRemoved, setSmearRemoved] = useState(true);
  const stateRef = useRef({ sealerType, smearRemoved });
  stateRef.current = { sealerType, smearRemoved };

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const studio = createStudioScene(el, {
      cameraPos: [0.3, 0.3, 5.8],
      target: [0, 0, 0],
    });
    if (!studio) return;
    studioRef.current = studio;

    const dentinTex = createDentinTubuleTexture(studio.maxAnisotropy);
    // Dentinal wall block (left) with open tubules
    const dentinWall = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 3.2, 1.8),
      new THREE.MeshStandardMaterial({ map: dentinTex, roughness: 0.65 })
    );
    dentinWall.position.set(-1.3, 0, 0);
    studio.scene.add(dentinWall);

    // Tubule channels (horizontal cylinders)
    const tubuleTags = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      const y = -1.1 + i * 0.44;
      const tag = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.045, 0.85, 12),
        new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 })
      );
      tag.rotation.z = Math.PI / 2;
      tag.position.set(-0.65, y, (i % 2 === 0 ? 0.25 : -0.25));
      tubuleTags.add(tag);
    }
    studio.scene.add(tubuleTags);

    // Sealer interface film (center)
    const sealerLayer = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 3.2, 1.8),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.25, transparent: true, opacity: 0.9 })
    );
    sealerLayer.position.set(-0.22, 0, 0);
    studio.scene.add(sealerLayer);

    // Core gutta-percha cone (right)
    const gpCore = new THREE.Mesh(
      new THREE.CylinderGeometry(0.52, 0.28, 3.3, 24),
      new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.42 })
    );
    gpCore.position.set(0.65, 0, 0);
    studio.scene.add(gpCore);

    // Bioactive periapical osteoblast/cementoblast induction particles (for Bioceramic)
    const bioGroup = new THREE.Group();
    for (let i = 0; i < 10; i++) {
      const cell = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x059669, emissiveIntensity: 0.4 })
      );
      cell.position.set(-0.2 + Math.cos(i) * 0.45, -1.85 - (i % 3) * 0.16, Math.sin(i) * 0.45);
      bioGroup.add(cell);
    }
    studio.scene.add(bioGroup);

    let currWidthScale = 1.0;

    studio.startLoop((dt, elapsed) => {
      const { sealerType: st, smearRemoved: sr } = stateRef.current;

      const sMat = sealerLayer.material as THREE.MeshStandardMaterial;
      let targetWidth = 1.0;
      if (st === 'bioceramic') {
        sMat.color.setHex(0xe0f2fe);
        targetWidth = 1.0; // zero shrinkage
      } else if (st === 'methacrylate') {
        sMat.color.setHex(0xc9a24b);
        targetWidth = 0.98;
      } else if (st === 'silicone') {
        sMat.color.setHex(0xf472b6);
        targetWidth = 1.12; // expands slightly on setting
      } else {
        sMat.color.setHex(0xd6d3d1);
        targetWidth = 0.78; // ZnOE shrinkage on setting
      }
      currWidthScale = THREE.MathUtils.damp(currWidthScale, targetWidth, 6, dt);
      sealerLayer.scale.x = currWidthScale;

      tubuleTags.visible = sr && (st === 'methacrylate' || st === 'bioceramic');
      tubuleTags.children.forEach((t) => {
        ((t as THREE.Mesh).material as THREE.MeshStandardMaterial).color.setHex(
          st === 'bioceramic' ? 0xe0f2fe : 0xc9a24b
        );
      });

      bioGroup.visible = st === 'bioceramic';
      bioGroup.position.y = Math.sin(elapsed * 2.2) * 0.05;
    });

    return () => {
      studio.dispose();
      studioRef.current = null;
    };
  }, []);

  const sealerNotes = {
    bioceramic: 'Bioceramic (BioRoot RCS, iRoot SP): Hydrophilic, zero shrinkage, antimicrobial, bioactive (induces cementoblasts & osteoblasts).',
    methacrylate: 'Methacrylate (EndoREZ / MetaSEAL): Forms resin tags after smear layer removal (NaOCl + EDTA) creating a monoblock seal.',
    silicone: 'Silicone (RoekoSeal / GuttaFlow): Polyvinylsiloxane that expands slightly on setting; GuttaFlow mixes GP powder in capsule.',
    znoe: 'Zinc Oxide Eugenol (Rickert/Roth): Shrinks on setting, soluble over time; Rickert silver particles stain dentin.',
  }[sealerType];

  return (
    <ThreeSandboxShell
      title={LEC7.sandboxes3d[0].title}
      metricBadge={sealerType.toUpperCase()}
      learningGoal={LEC7.sandboxes3d[0].learningGoal}
      mountRef={mountRef}
      onResetView={() =>
        studioRef.current?.flyToCamera(new THREE.Vector3(0.3, 0.3, 5.8), new THREE.Vector3(0, 0, 0))
      }
      fallbackSummary="3D dentinal wall, smear-layer tubule tags, sealer interface shrinkage/expansion, and core gutta-percha cone across Bioceramic, Methacrylate, Silicone, and ZnOE sealers."
      readout={
        <div className="rounded-lg bg-[#0B1F4D]/92 border border-[#FAF8F3]/20 px-3 py-2 text-right">
          <div className="text-[11px] font-bold text-[#C9A24B]">
            {sealerType === 'znoe' ? 'Shrinks on Setting' : sealerType === 'silicone' ? 'Slight Expansion' : 'Zero Shrinkage'}
          </div>
          <div className="text-[11px] text-[#E6E8EC]">
            Tubule Penetration: {smearRemoved ? 'Smear Layer Removed (NaOCl + EDTA)' : 'Blocked by Smear Layer'}
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
        <div className="md:col-span-2">
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                ['bioceramic', 'Bioceramic'],
                ['methacrylate', 'Methacrylate (Monoblock)'],
                ['silicone', 'Silicone (GuttaFlow)'],
                ['znoe', 'Zinc Oxide Eugenol'],
              ] as const
            ).map(([k, lbl]) => (
              <button
                key={k}
                type="button"
                onClick={() => {
                  setSealerType(k);
                  onInteract?.();
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold whitespace-nowrap shrink-0 ${
                  sealerType === k ? 'bg-[#C9A24B] text-[#0B1F4D]' : 'bg-[#1B3A8C]/70 text-[#FAF8F3]'
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[#E6E8EC]/90 mt-1.5 leading-tight">{sealerNotes}</p>
        </div>

        <div>
          <label className="inline-flex items-center gap-2 text-xs text-[#E6E8EC] cursor-pointer">
            <input
              type="checkbox"
              checked={smearRemoved}
              onChange={(e) => {
                setSmearRemoved(e.target.checked);
                onInteract?.();
              }}
              className="accent-[#C9A24B]"
            />
            <span>Smear Layer Removed (NaOCl + EDTA)</span>
          </label>
        </div>
      </div>
    </ThreeSandboxShell>
  );
};

// ============================================================================
// 2. Sealer Placement Technique Simulator (Lecture 7, Sandbox 2)
// ============================================================================
export const SealerPlacementSandbox: React.FC<{ onInteract?: () => void }> = ({ onInteract }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);

  const [method, setMethod] = useState<'cannula' | 'lentulo' | 'mastercone'>('cannula');
  const [stepProgress, setStepProgress] = useState(0.75);
  const stateRef = useRef({ method, stepProgress });
  stateRef.current = { method, stepProgress };

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const studio = createStudioScene(el, {
      cameraPos: [0.3, 0.2, 6.0],
      target: [0, -0.2, 0],
    });
    if (!studio) return;
    studioRef.current = studio;

    const { group: toothGroup } = buildCutawayToothGroup({});
    studio.scene.add(toothGroup);

    // Sealer column filling the canal
    const sealerFill = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.08, 3.0, 20),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3, transparent: true, opacity: 0.82 })
    );
    sealerFill.position.set(0, -0.35, 0);
    studio.scene.add(sealerFill);

    // Flexible capillary cannula syringe tip
    const cannula = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 2.4, 14),
      new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.4 })
    );
    studio.scene.add(cannula);

    // Lentulo spiral wire
    const lentulo = new THREE.Mesh(
      new THREE.ConeGeometry(0.08, 2.6, 8, 8, true),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.2, wireframe: true })
    );
    lentulo.rotation.x = Math.PI;
    studio.scene.add(lentulo);

    // Master GP cone
    const masterCone = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.04, 3.1, 16),
      new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.4 })
    );
    studio.scene.add(masterCone);

    studio.startLoop((_, elapsed) => {
      const { method: m, stepProgress: p } = stateRef.current;
      cannula.visible = m === 'cannula';
      lentulo.visible = m === 'lentulo';
      masterCone.visible = m === 'mastercone' || (m === 'cannula' && p > 0.72);

      if (m === 'cannula') {
        cannula.position.set(0.05, 1.3 - p * 0.9, 0);
        sealerFill.scale.y = THREE.MathUtils.clamp(p * 1.1, 0.1, 1.0);
        sealerFill.position.y = -1.7 + sealerFill.scale.y * 1.45;
        masterCone.position.set(0, 1.9 - (p - 0.72) * 7.2, 0);
      } else if (m === 'lentulo') {
        lentulo.position.set(0, 1.5 - p * 1.7, 0);
        lentulo.rotation.y = -elapsed * 10; // counter-clockwise rotation!
        sealerFill.scale.y = THREE.MathUtils.clamp(p, 0.1, 0.95);
        sealerFill.position.y = -1.7 + sealerFill.scale.y * 1.45;
      } else {
        masterCone.position.set(0, 1.6 - p * 1.85, 0);
        sealerFill.scale.y = THREE.MathUtils.clamp(p * 0.58, 0.1, 0.62); // insufficient in wide canals
        sealerFill.position.y = -1.7 + sealerFill.scale.y * 1.45;
      }
    });

    return () => {
      studio.dispose();
      studioRef.current = null;
    };
  }, []);

  const methodInfo = {
    cannula: 'Recommended for Bioceramic sealers: Purge air from flexible cannula, inject at coronal/middle third until visible at orifice, then insert master cone to WL.',
    lentulo: 'Lentulo Spiral / File: Rotate counter-clockwise manually or by rotary until sealer becomes visible at canal orifice.',
    mastercone: 'Master Cone Coating: Coat cone and slowly insert to WL — may be insufficient with voids in oval or wide canals.',
  }[method];

  return (
    <ThreeSandboxShell
      title={LEC7.sandboxes3d[1].title}
      metricBadge={method === 'cannula' ? 'Recommended Method' : method === 'lentulo' ? 'CCW Lentulo' : 'Master Cone Only'}
      learningGoal={LEC7.sandboxes3d[1].learningGoal}
      mountRef={mountRef}
      onResetView={() =>
        studioRef.current?.flyToCamera(new THREE.Vector3(0.3, 0.2, 6.0), new THREE.Vector3(0, -0.2, 0))
      }
      fallbackSummary="3D root canal sealer placement comparing flexible capillary cannula injection, counter-clockwise Lentulo spiral delivery, and master-cone coating."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
        <div>
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                ['cannula', 'Capillary Cannula (Recommended)'],
                ['lentulo', 'Lentulo Spiral (CCW)'],
                ['mastercone', 'Master Cone Coat'],
              ] as const
            ).map(([k, lbl]) => (
              <button
                key={k}
                type="button"
                onClick={() => {
                  setMethod(k);
                  onInteract?.();
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold whitespace-nowrap shrink-0 ${
                  method === k ? 'bg-[#C9A24B] text-[#0B1F4D]' : 'bg-[#1B3A8C]/70 text-[#FAF8F3]'
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[#E6E8EC]/90 mt-1.5 leading-tight">{methodInfo}</p>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#E6E8EC]">Delivery Sequence Progress</span>
            <span className="font-mono-tabular text-[#C9A24B]">{Math.round(stepProgress * 100)}%</span>
          </div>
          <input
            type="range"
            min={0.15}
            max={1.0}
            step={0.05}
            value={stepProgress}
            onChange={(e) => {
              setStepProgress(Number(e.target.value));
              onInteract?.();
            }}
            className="w-full pd-slider"
            aria-label="Sealer delivery sequence progress"
          />
        </div>
      </div>
    </ThreeSandboxShell>
  );
};

// ============================================================================
// 3. Gutta-Percha Thermal Phase & Core Composition Lab (Lecture 7, Sandbox 3)
// ============================================================================
export const GpPhaseLabSandbox: React.FC<{ onInteract?: () => void }> = ({ onInteract }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);

  const [tempC, setTempC] = useState(37);
  const [compacted, setCompacted] = useState(false);
  const stateRef = useRef({ tempC, compacted });
  stateRef.current = { tempC, compacted };

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const studio = createStudioScene(el, {
      cameraPos: [0, 0.6, 5.8],
      target: [0, 0, 0],
    });
    if (!studio) return;
    studioRef.current = studio;

    // 3D Gutta-Percha Cone inside canal mold
    const gpCone = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.14, 3.0, 28),
      new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.45 })
    );
    gpCone.position.set(-1.1, 0, 0);
    studio.scene.add(gpCone);

    // 3D Polymer Lattice Chain visualizing crystalline Beta/Alpha vs Amorphous melt
    const chainCount = 18;
    const nodeGeo = new THREE.SphereGeometry(0.11, 14, 14);
    const nodeMat = new THREE.MeshStandardMaterial({ color: 0xc9a24b, roughness: 0.3, metalness: 0.35 });
    const nodes = new THREE.InstancedMesh(nodeGeo, nodeMat, chainCount);
    nodes.frustumCulled = false;
    studio.scene.add(nodes);

    const dummy = new THREE.Object3D();

    studio.startLoop((dt, elapsed) => {
      const { tempC: T, compacted: cmp } = stateRef.current;
      // Plastic deformation / flow expansion at high temp, 1-2% cooling shrinkage unless compacted
      const soften = THREE.MathUtils.clamp((T - 44) / 22, 0, 1);
      const targetScaleXZ = cmp ? 1.12 : 1.0 + soften * 0.16;
      const targetScaleY = cmp ? 0.92 : 1.0 - soften * 0.08;
      gpCone.scale.x = THREE.MathUtils.damp(gpCone.scale.x, targetScaleXZ, 6, dt);
      gpCone.scale.z = gpCone.scale.x;
      gpCone.scale.y = THREE.MathUtils.damp(gpCone.scale.y, targetScaleY, 6, dt);

      const gpMat = gpCone.material as THREE.MeshStandardMaterial;
      gpMat.roughness = 0.5 - soften * 0.3;

      for (let i = 0; i < chainCount; i++) {
        const row = Math.floor(i / 6);
        const col = i % 6;
        const jitter = soften * 0.22;
        const x = 0.8 + col * 0.28 + Math.sin(elapsed * (2 + soften * 4) + i) * jitter;
        const y = -0.7 + row * 0.65 + Math.cos(elapsed * (2 + soften * 4) + i * 1.4) * jitter;
        const z = Math.sin(elapsed * 2 + col) * jitter;
        dummy.position.set(x, y, z);
        dummy.scale.setScalar(1);
        dummy.updateMatrix();
        nodes.setMatrixAt(i, dummy.matrix);
      }
      nodes.instanceMatrix.needsUpdate = true;
    });

    return () => {
      studio.dispose();
      studioRef.current = null;
    };
  }, []);

  const phaseLabel =
    tempC < 46
      ? 'Beta (β) Phase — Solid Processed Cone'
      : tempC < 54
      ? 'Alpha (α) Phase (~46°C) — Pliable & Flowable'
      : tempC <= 64
      ? 'Amorphous Phase (54–60°C) — Molten Transition'
      : 'Softened Cone (>64°C) — High Flow & Compaction Ready';

  return (
    <ThreeSandboxShell
      title={LEC7.sandboxes3d[2].title}
      metricBadge={`${tempC}°C`}
      learningGoal={LEC7.sandboxes3d[2].learningGoal}
      mountRef={mountRef}
      onResetView={() =>
        studioRef.current?.flyToCamera(new THREE.Vector3(0, 0.6, 5.8), new THREE.Vector3(0, 0, 0))
      }
      fallbackSummary="3D gutta-percha cone (20% GP, 60-75% ZnO, 5-10% resins/waxes/metal sulfates) demonstrating Beta (<46°C), Alpha (~46°C), Amorphous (54-60°C), and >64°C softening."
      readout={
        <div className="rounded-lg bg-[#0B1F4D]/92 border border-[#FAF8F3]/20 px-3 py-2 text-right">
          <div className="text-[11px] font-bold text-[#C9A24B]">{phaseLabel}</div>
          <div className="text-[11px] text-[#E6E8EC]">20% Gutta-Percha · 60–75% ZnO · 5–10% Additives</div>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#E6E8EC]">Gutta-Percha Temperature</span>
            <span className="font-mono-tabular text-[#C9A24B]">{tempC}°C</span>
          </div>
          <input
            type="range"
            min={25}
            max={72}
            step={1}
            value={tempC}
            onChange={(e) => {
              setTempC(Number(e.target.value));
              onInteract?.();
            }}
            className="w-full pd-slider"
            aria-label="Gutta-percha temperature in Celsius"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="inline-flex items-center gap-2 text-xs text-[#E6E8EC] cursor-pointer">
            <input
              type="checkbox"
              checked={compacted}
              onChange={(e) => {
                setCompacted(e.target.checked);
                onInteract?.();
              }}
              className="accent-[#C9A24B]"
            />
            <span>Apply Compaction (offsets 1–2% cooling shrinkage)</span>
          </label>
        </div>
      </div>
    </ThreeSandboxShell>
  );
};
