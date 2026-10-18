import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FileSpreadsheet, RotateCcw, CheckCircle2, Sparkles, Info } from 'lucide-react';
import { createHumanIncisor, createHumanMolar, createDentalMaterials } from '../utils/dentalAnatomy3D';

interface ToothPlaqueState {
  fdi: number;
  name: string;
  type: 'incisor' | 'molar';
  surfaces: {
    buccal: boolean;
    lingual: boolean;
    mesial: boolean;
    distal: boolean;
  };
}

interface ThreePlaqueViewerProps {
  teeth: ToothPlaqueState[];
  selectedToothIdx: number;
  onSelectToothIdx: (idx: number) => void;
  onToggleSurface: (toothIdx: number, surface: 'buccal' | 'lingual' | 'mesial' | 'distal') => void;
}

export const ThreePlaqueViewer: React.FC<ThreePlaqueViewerProps> = ({
  teeth,
  selectedToothIdx,
  onSelectToothIdx,
  onToggleSurface
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const toothGroupRef = useRef<THREE.Group | null>(null);

  const activeTooth = teeth[selectedToothIdx] || teeth[0];

  const totalSurfaces = teeth.length * 4;
  const plaqueSurfaces = teeth.reduce(
    (acc, t) => acc + (t.surfaces.buccal ? 1 : 0) + (t.surfaces.lingual ? 1 : 0) + (t.surfaces.mesial ? 1 : 0) + (t.surfaces.distal ? 1 : 0),
    0
  );
  const olearyPercentage = Math.round((plaqueSurfaces / totalSurfaces) * 100);

  // Initialize Three.js scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 360;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 0.6, 6.8);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Studio Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.95));
    const dir = new THREE.DirectionalLight(0xffffff, 1.35);
    dir.position.set(5, 8, 6);
    scene.add(dir);

    const goldFill = new THREE.DirectionalLight(0xfbbf24, 0.45);
    goldFill.position.set(-6, -2, -4);
    scene.add(goldFill);

    // Tooth Group
    const toothGroup = new THREE.Group();
    toothGroupRef.current = toothGroup;
    scene.add(toothGroup);

    build3DHumanToothWithPlaque(toothGroup, activeTooth);

    // Orbit Controls
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let spherical = { radius: 6.8, theta: 0.08, phi: Math.PI / 2.2 };

    const updateCam = () => {
      camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      camera.position.y = spherical.radius * Math.cos(spherical.phi);
      camera.position.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      camera.lookAt(0, 0, 0);
    };
    updateCam();

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      spherical.theta -= (e.clientX - prevMouse.x) * 0.008;
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi - (e.clientY - prevMouse.y) * 0.008));
      updateCam();
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => (isDragging = false);

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Raycast click to toggle plaque on 3D surface
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const onClick = (e: MouseEvent) => {
      const rect = dom.getBoundingClientRect();
      mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVector.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouseVector, camera);

      if (toothGroupRef.current) {
        const hits = raycaster.intersectObjects(toothGroupRef.current.children, true);
        if (hits.length > 0) {
          const hit = hits[0].object;
          if (hit.userData && hit.userData.surface) {
            onToggleSurface(selectedToothIdx, hit.userData.surface);
          }
        }
      }
    };
    dom.addEventListener('click', onClick);

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('mousedown', onMouseDown);
      dom.removeEventListener('click', onClick);
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, [selectedToothIdx]);

  useEffect(() => {
    if (toothGroupRef.current) {
      build3DHumanToothWithPlaque(toothGroupRef.current, activeTooth);
    }
  }, [activeTooth]);

  const build3DHumanToothWithPlaque = (group: THREE.Group, toothData: ToothPlaqueState) => {
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      if ((child as THREE.Mesh).geometry) (child as THREE.Mesh).geometry.dispose();
    }

    if (toothData.type === 'incisor') {
      const incisor = createHumanIncisor({ isMaxillary: toothData.fdi === 11 });
      group.add(incisor);
    } else {
      const isMandibular = toothData.fdi >= 30;
      const molar = createHumanMolar({ isMandibular, furcationGrade: 'None' });
      group.add(molar);
    }

    // PBR Gingiva Collar
    const mats = createDentalMaterials('all', false);
    const gingiva = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.6, 1.2, 28), mats.gingiva);
    gingiva.position.y = -0.55;
    group.add(gingiva);

    // Plaque Biofilm PBR Material (Authentic yellowish-white sticky film with microgranules)
    const plaqueMat = mats.plaque;

    const transparentHitboxMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.08, color: 0x38bdf8 });

    // 4 Plaque Surface Patches (Buccal, Lingual, Mesial, Distal)
    // 1. Buccal
    const buccalPlaque = new THREE.Mesh(
      new THREE.CylinderGeometry(1.36, 1.36, 0.75, 16, 1, false, -Math.PI / 4, Math.PI / 2),
      toothData.surfaces.buccal ? plaqueMat : transparentHitboxMat
    );
    buccalPlaque.position.set(0, 0.5, 0.05);
    buccalPlaque.userData = { surface: 'buccal' };
    group.add(buccalPlaque);

    // 2. Lingual
    const lingualPlaque = new THREE.Mesh(
      new THREE.CylinderGeometry(1.36, 1.36, 0.75, 16, 1, false, (3 * Math.PI) / 4, Math.PI / 2),
      toothData.surfaces.lingual ? plaqueMat : transparentHitboxMat
    );
    lingualPlaque.position.set(0, 0.5, -0.05);
    lingualPlaque.userData = { surface: 'lingual' };
    group.add(lingualPlaque);

    // 3. Mesial
    const mesialPlaque = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.75, 0.95),
      toothData.surfaces.mesial ? plaqueMat : transparentHitboxMat
    );
    mesialPlaque.position.set(-1.18, 0.5, 0);
    mesialPlaque.userData = { surface: 'mesial' };
    group.add(mesialPlaque);

    // 4. Distal
    const distalPlaque = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.75, 0.95),
      toothData.surfaces.distal ? plaqueMat : transparentHitboxMat
    );
    distalPlaque.position.set(1.18, 0.5, 0);
    distalPlaque.userData = { surface: 'distal' };
    group.add(distalPlaque);
  };

  const setViewAngle = (angle: 'buccal' | 'lingual' | 'mesial' | 'distal') => {
    if (!cameraRef.current) return;
    const cam = cameraRef.current;
    if (angle === 'buccal') cam.position.set(0, 0.5, 6.8);
    else if (angle === 'lingual') cam.position.set(0, 0.5, -6.8);
    else if (angle === 'mesial') cam.position.set(-6.8, 0.5, 0);
    else if (angle === 'distal') cam.position.set(6.8, 0.5, 0);
    cam.lookAt(0, 0, 0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
      {/* 3D Tooth Plaque Inspection View (2 Columns) */}
      <div className="lg:col-span-2 bg-slate-900 rounded-3xl border border-slate-800 p-5 shadow-2xl flex flex-col justify-between relative min-h-[460px]">
        {/* Top Badges & Camera Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold bg-amber-950 text-amber-300 px-3 py-1 rounded-full border border-amber-800">
              3D Plaque Biofilm Inspection
            </span>
            <span className="text-xs text-white font-bold">{activeTooth.name}</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button onClick={() => setViewAngle('buccal')} className="px-2 py-0.5 rounded text-slate-300 hover:text-white cursor-pointer">
              Buccal
            </button>
            <button onClick={() => setViewAngle('lingual')} className="px-2 py-0.5 rounded text-slate-300 hover:text-white cursor-pointer">
              Lingual
            </button>
            <button onClick={() => setViewAngle('mesial')} className="px-2 py-0.5 rounded text-slate-300 hover:text-white cursor-pointer">
              Mesial
            </button>
            <button onClick={() => setViewAngle('distal')} className="px-2 py-0.5 rounded text-slate-300 hover:text-white cursor-pointer">
              Distal
            </button>
          </div>
        </div>

        {/* 3D Canvas */}
        <div ref={mountRef} className="w-full h-[300px] cursor-grab active:cursor-grabbing my-auto" />

        {/* Surface Toggles directly beneath 3D view */}
        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs text-slate-300 font-semibold">Click 3D surfaces or toggle below:</span>

          <div className="flex gap-2">
            {(['buccal', 'lingual', 'mesial', 'distal'] as const).map((surf) => {
              const hasPlaque = activeTooth.surfaces[surf];
              return (
                <button
                  key={surf}
                  onClick={() => onToggleSurface(selectedToothIdx, surf)}
                  className={`px-3 py-1.5 capitalize rounded-xl border text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    hasPlaque
                      ? 'bg-amber-950 border-amber-500 text-amber-200'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${hasPlaque ? 'bg-amber-400' : 'bg-slate-600'}`}></span>
                  <span>{surf}</span>
                  <span className="text-[10px]">{hasPlaque ? '(1)' : '(0)'}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tooth Arch Selector & O'Leary Scorecard (1 Column) */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 shadow-2xl flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider border-b border-slate-800 pb-3">
            O'Leary Plaque Index %
          </h3>

          {/* O'Leary Percentage Card */}
          <div className="p-4 bg-amber-950/40 rounded-2xl border border-amber-500/40 text-center space-y-1">
            <div className="text-xs text-amber-200 font-medium">Full Mouth Plaque Score</div>
            <div className="text-4xl font-black font-mono text-amber-400">{olearyPercentage}%</div>
            <div className="text-xs text-slate-400">
              {plaqueSurfaces} / {totalSurfaces} surfaces with plaque
            </div>
            <div className={`text-xs font-bold px-3 py-1 rounded-full inline-block ${olearyPercentage <= 20 ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-amber-950 text-amber-300 border border-amber-700'}`}>
              {olearyPercentage <= 20 ? 'Target Met (≤20%)' : 'Exceeds Target (>20%)'}
            </div>
          </div>

          {/* Tooth Selector Grid */}
          <div className="space-y-1.5 pt-1">
            <span className="text-xs font-semibold text-slate-300">Select Tooth to Inspect:</span>
            <div className="grid grid-cols-2 gap-2">
              {teeth.map((t, idx) => {
                const count = (t.surfaces.buccal ? 1 : 0) + (t.surfaces.lingual ? 1 : 0) + (t.surfaces.mesial ? 1 : 0) + (t.surfaces.distal ? 1 : 0);
                return (
                  <button
                    key={t.fdi}
                    onClick={() => onSelectToothIdx(idx)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                      selectedToothIdx === idx
                        ? 'bg-amber-950/80 border-amber-500 text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold">FDI #{t.fdi}</div>
                    <div className="text-[10px] text-amber-400">{count} / 4 surfaces</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs text-slate-400 flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <span className="text-[11px] leading-relaxed">
            <strong className="text-white">Step 1 Criterion:</strong> Before any periodontal surgical procedure (Step 3), the full-mouth plaque score must reach $\le 20\%$ to ensure host bacterial compliance.
          </span>
        </div>
      </div>
    </div>
  );
};
