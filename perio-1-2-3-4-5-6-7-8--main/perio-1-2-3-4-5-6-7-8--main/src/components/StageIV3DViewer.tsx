import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Layers, RotateCcw, AlertTriangle, ShieldCheck, Sparkles, ArrowRight, Stethoscope } from 'lucide-react';
import { StageIVPhenotype } from '../types/periodontics';
import { createHumanIncisor, createHumanPremolar, createHumanMolar, createFullHumanArch } from '../utils/dentalAnatomy3D';

interface StageIV3DViewerProps {
  phenotype: StageIVPhenotype;
}

export const StageIV3DViewer: React.FC<StageIV3DViewerProps> = ({ phenotype }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const dynamicGroupRef = useRef<THREE.Group | null>(null);

  // Interactive state per phenotype
  const [splintActive, setSplintActive] = useState<boolean>(true); // Case Type 1
  const [orthoProgress, setOrthoProgress] = useState<number>(0); // Case Type 2: 0 (Flared) to 100 (Retracted)
  const [prostheticType, setProstheticType] = useState<'missing' | 'interim' | 'implant_bridge'>('implant_bridge'); // Case Type 3
  const [archPathway, setArchPathway] = useState<'tooth_supported' | 'implant_supported'>('tooth_supported'); // Case Type 4

  // Three.js Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 580;
    const height = container.clientHeight || 380;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 0.8, 8.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const dir = new THREE.DirectionalLight(0xffffff, 1.35);
    dir.position.set(5, 10, 6);
    scene.add(dir);

    const purpleFill = new THREE.DirectionalLight(0xa855f7, 0.65);
    purpleFill.position.set(-6, -2, -4);
    scene.add(purpleFill);

    // Grid Floor
    const grid = new THREE.GridHelper(10, 20, 0x1e293b, 0x0f172a);
    grid.position.y = -3.2;
    scene.add(grid);

    // Dynamic Group for Phenotype Model
    const dynGroup = new THREE.Group();
    dynamicGroupRef.current = dynGroup;
    scene.add(dynGroup);

    buildPhenotypeScene(dynGroup, phenotype.caseType);

    // Orbit Controls
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let spherical = { radius: 8.5, theta: 0.1, phi: Math.PI / 2.2 };

    const updateCam = () => {
      camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      camera.position.y = spherical.radius * Math.cos(spherical.phi);
      camera.position.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      camera.lookAt(0, -0.2, 0);
    };
    updateCam();

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      spherical.theta -= (e.clientX - prevMouse.x) * 0.007;
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi - (e.clientY - prevMouse.y) * 0.007));
      updateCam();
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => (isDragging = false);

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

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
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, [phenotype.caseType]);

  // Rebuild scene when interactive state updates
  useEffect(() => {
    if (dynamicGroupRef.current) {
      buildPhenotypeScene(dynamicGroupRef.current, phenotype.caseType);
    }
  }, [phenotype.caseType, splintActive, orthoProgress, prostheticType, archPathway]);

  const buildPhenotypeScene = (group: THREE.Group, caseType: number) => {
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      if ((child as THREE.Mesh).geometry) (child as THREE.Mesh).geometry.dispose();
    }

    const boneMat = new THREE.MeshStandardMaterial({ color: 0xeee8d5, roughness: 0.8, transparent: true, opacity: 0.6 });

    if (caseType === 1) {
      // CASE TYPE 1: 4 Human Lower Anterior Incisors with Lingual Fiber Splint
      const incisorX = [-1.5, -0.5, 0.5, 1.5];
      incisorX.forEach((x, i) => {
        const tooth = createHumanIncisor({ isMaxillary: false });
        tooth.position.x = x;

        // If splint inactive, show hypermobility tilt on tooth #31 & #41
        if (!splintActive && (i === 1 || i === 2)) {
          tooth.rotation.z = i === 1 ? -0.12 : 0.12;
          tooth.position.z = 0.25;
        }

        group.add(tooth);
      });

      // Reduced Alveolar Bone
      const bone = new THREE.Mesh(new THREE.BoxGeometry(4.4, 2.2, 1.8), boneMat);
      bone.position.y = -1.9;
      group.add(bone);

      // Fiber-Reinforced Composite Splint (Spanning lingual surfaces)
      if (splintActive) {
        const splintGeo = new THREE.BoxGeometry(3.6, 0.35, 0.2);
        const splintMat = new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          emissive: 0x0284c7,
          emissiveIntensity: 0.45,
          roughness: 0.2
        });
        const splint = new THREE.Mesh(splintGeo, splintMat);
        splint.position.set(0, 0.6, -0.42);
        group.add(splint);
      }
    } else if (caseType === 2) {
      // CASE TYPE 2: Flared Central Incisors with Diastema and Orthodontic Vector
      const factor = orthoProgress / 100;
      const diastemaWidth = 1.2 - factor * 0.9;
      const flareAngle = 0.25 - factor * 0.25;

      // Human Tooth #11
      const t11 = createHumanIncisor({ isMaxillary: true });
      t11.position.set(-diastemaWidth / 2 - 0.7, 0.2 + factor * 0.2, (1 - factor) * 0.6);
      t11.rotation.x = flareAngle;
      group.add(t11);

      // Human Tooth #21
      const t21 = createHumanIncisor({ isMaxillary: true });
      t21.position.set(diastemaWidth / 2 + 0.7, 0.2 + factor * 0.2, (1 - factor) * 0.6);
      t21.rotation.x = flareAngle;
      group.add(t21);

      // Animated Orthodontic Force Vector Arrows (Palatal Intrusion & Retraction)
      const arrowMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
      const arrowGeo = new THREE.ConeGeometry(0.25, 0.6, 12);
      const arrow1 = new THREE.Mesh(arrowGeo, arrowMat);
      arrow1.position.set(-1.0, 1.8, 1.4);
      arrow1.rotation.x = -Math.PI / 2;
      group.add(arrow1);

      const arrow2 = new THREE.Mesh(arrowGeo, arrowMat);
      arrow2.position.set(1.0, 1.8, 1.4);
      arrow2.rotation.x = -Math.PI / 2;
      group.add(arrow2);
    } else if (caseType === 3) {
      // CASE TYPE 3: Partial Edentulism (Abutments #14 and #17, missing #15 #16)
      const t14 = createHumanPremolar();
      t14.position.set(-2.6, 0, 0);
      group.add(t14);

      const t17 = createHumanMolar({ isMandibular: false });
      t17.position.set(2.6, 0, 0);
      group.add(t17);

      // Edentulous Bone Ridge
      const ridge = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.5, 2.4), boneMat);
      ridge.position.set(0, -0.65, 0);
      group.add(ridge);

      if (prostheticType === 'interim') {
        // Acrylic Interim Removable Partial Denture with pink base and acrylic teeth
        const acrylicBase = new THREE.Mesh(
          new THREE.BoxGeometry(3.4, 0.45, 1.8),
          new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.35 })
        );
        acrylicBase.position.set(0, 0.1, 0);
        group.add(acrylicBase);

        const interimP1 = createHumanPremolar();
        interimP1.position.set(-0.9, 0.1, 0);
        group.add(interimP1);

        const interimM1 = createHumanMolar({ isMandibular: false });
        interimM1.position.set(0.9, 0.1, 0);
        group.add(interimM1);
      } else if (prostheticType === 'implant_bridge') {
        const implantMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.92, roughness: 0.2 });
        const imp1 = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.25, 2.2, 16), implantMat);
        imp1.position.set(-0.9, -0.9, 0);
        group.add(imp1);

        const imp2 = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.25, 2.2, 16), implantMat);
        imp2.position.set(0.9, -0.9, 0);
        group.add(imp2);

        // Fixed Zirconia Pontic Crowns (#15 Premolar pontic & #16 Molar pontic)
        const pontic15 = createHumanPremolar();
        pontic15.position.set(-0.9, 0.05, 0);
        group.add(pontic15);

        const pontic16 = createHumanMolar({ isMandibular: false });
        pontic16.position.set(0.9, 0.05, 0);
        group.add(pontic16);

        // Interproximal connectors between units
        const connMat = new THREE.MeshStandardMaterial({ color: 0xfaf9f5, roughness: 0.15, metalness: 0.05 });
        const conn1 = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.85, 12), connMat);
        conn1.rotation.z = Math.PI / 2;
        conn1.position.set(-1.75, 0.8, 0);
        group.add(conn1);

        const conn2 = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.85, 12), connMat);
        conn2.rotation.z = Math.PI / 2;
        conn2.position.set(0.0, 0.8, 0);
        group.add(conn2);

        const conn3 = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.85, 12), connMat);
        conn3.rotation.z = Math.PI / 2;
        conn3.position.set(1.75, 0.8, 0);
        group.add(conn3);
      }
    } else {
      // CASE TYPE 4: Full-Arch Rehabilitation with Realistic Multi-Tooth Human Arch
      const fullArch = createFullHumanArch({
        isMaxillary: true,
        withImplantAbutments: archPathway === 'implant_supported'
      });
      fullArch.position.set(0, 0.2, 1.8);
      group.add(fullArch);
    }
  };

  return (
    <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950 px-3 py-1 rounded-full border border-purple-800">
            Human 3D Case Simulation: Case Type {phenotype.caseType}
          </span>
          <h4 className="text-sm font-bold text-white mt-1.5">{phenotype.title}</h4>
        </div>

        {/* Interactive Controls based on Case Type */}
        <div className="flex items-center gap-2">
          {phenotype.caseType === 1 && (
            <button
              onClick={() => setSplintActive(!splintActive)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                splintActive ? 'bg-cyan-600 text-white border-cyan-400 shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <span>{splintActive ? 'Splint Applied (Rigid)' : 'Unsplinted (Mobile)'}</span>
            </button>
          )}

          {phenotype.caseType === 3 && (
            <div className="flex gap-1 text-xs">
              <button
                onClick={() => setProstheticType('missing')}
                className={`px-2.5 py-1 rounded-lg border cursor-pointer ${prostheticType === 'missing' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400'}`}
              >
                Edentulous Gap
              </button>
              <button
                onClick={() => setProstheticType('interim')}
                className={`px-2.5 py-1 rounded-lg border cursor-pointer ${prostheticType === 'interim' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400'}`}
              >
                Interim RPD
              </button>
              <button
                onClick={() => setProstheticType('implant_bridge')}
                className={`px-2.5 py-1 rounded-lg border cursor-pointer ${prostheticType === 'implant_bridge' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400'}`}
              >
                Definitive Bridge
              </button>
            </div>
          )}

          {phenotype.caseType === 4 && (
            <div className="flex gap-1 text-xs">
              <button
                onClick={() => setArchPathway('tooth_supported')}
                className={`px-2.5 py-1 rounded-lg border cursor-pointer ${archPathway === 'tooth_supported' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400'}`}
              >
                Tooth-Supported Pathway
              </button>
              <button
                onClick={() => setArchPathway('implant_supported')}
                className={`px-2.5 py-1 rounded-lg border cursor-pointer ${archPathway === 'implant_supported' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400'}`}
              >
                Implant-Supported Pathway
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Case Type 2: Ortho Retraction Slider */}
      {phenotype.caseType === 2 && (
        <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-300 font-semibold">Simulate Orthodontic Retraction &amp; Intrusion:</span>
            <span className="font-mono text-cyan-400 font-bold">{orthoProgress}% Retracted</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={orthoProgress}
            onChange={(e) => setOrthoProgress(parseInt(e.target.value))}
            className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>Flared / Diastema (Pre-Ortho)</span>
            <span className="text-cyan-400">Shallow Pockets Required First!</span>
            <span>Upright Aligned (Post-Ortho)</span>
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      <div ref={mountRef} className="w-full h-[280px] cursor-grab active:cursor-grabbing rounded-2xl overflow-hidden border border-slate-900" />
    </div>
  );
};
