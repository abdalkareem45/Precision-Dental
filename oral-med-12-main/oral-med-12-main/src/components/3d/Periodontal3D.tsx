import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Periodontal3DProps {
  progressionStage?: 'healthy' | 'nug' | 'nup' | 'noma';
  onStageChange?: (stage: 'healthy' | 'nug' | 'nup' | 'noma') => void;
}

export const Periodontal3D: React.FC<Periodontal3DProps> = ({
  progressionStage = 'nug',
  onStageChange,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);

  const [activeLayers, setActiveLayers] = useState({
    gingiva: true,
    bone: true,
    pdl: true,
    biofilm: true,
  });

  const [currentStage, setCurrentStage] = useState<'healthy' | 'nug' | 'nup' | 'noma'>(progressionStage);

  useEffect(() => {
    setCurrentStage(progressionStage);
  }, [progressionStage]);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 380;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0e1a);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.3);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight.position.set(4, 5, 5);
    scene.add(dirLight);

    const modelGroup = new THREE.Group();
    modelGroupRef.current = modelGroup;
    scene.add(modelGroup);

    // --- BUILD ANATOMICAL PERIODONTAL CROSS SECTION ---
    // 1. Two adjacent anterior mandibular teeth (Crown & Root)
    const toothMat = new THREE.MeshStandardMaterial({
      color: 0xfafafa,
      roughness: 0.2,
      metalness: 0.05,
    });
    const rootMat = new THREE.MeshStandardMaterial({
      color: 0xead9c2, // Cementum yellowish-beige
      roughness: 0.5,
    });

    [-0.75, 0.75].forEach((xPos) => {
      // Crown
      const crownGeo = new THREE.BoxGeometry(1.1, 1.3, 0.7);
      const crown = new THREE.Mesh(crownGeo, toothMat);
      crown.position.set(xPos, 1.1, 0);
      modelGroup.add(crown);

      // Root (Cementum)
      const rootGeo = new THREE.ConeGeometry(0.5, 2.2, 16);
      const root = new THREE.Mesh(rootGeo, rootMat);
      root.position.set(xPos, -0.6, 0);
      root.rotation.x = Math.PI;
      modelGroup.add(root);
    });

    // 2. Alveolar Bone Crest
    const boneGeo = new THREE.BoxGeometry(2.8, 1.8, 0.9);
    const boneMat = new THREE.MeshStandardMaterial({
      color: 0xf1e5c9, // Alveolar trabecular bone
      roughness: 0.65,
    });
    const boneMesh = new THREE.Mesh(boneGeo, boneMat);
    boneMesh.name = 'bone';
    boneMesh.position.set(0, -1.0, 0);
    modelGroup.add(boneMesh);

    // 3. Periodontal Ligament (PDL space lining roots)
    const pdlGeo = new THREE.CylinderGeometry(0.55, 0.15, 2.0, 16, 1, true);
    const pdlMat = new THREE.MeshStandardMaterial({
      color: 0xd97706, // Collagenous PDL fibers
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
    });
    [-0.75, 0.75].forEach((xPos) => {
      const pdlMesh = new THREE.Mesh(pdlGeo, pdlMat);
      pdlMesh.name = 'pdl';
      pdlMesh.position.set(xPos, -0.6, 0);
      modelGroup.add(pdlMesh);
    });

    // 4. Interdental Gingival Papilla & Marginal Gingiva
    const gingivaMat = new THREE.MeshStandardMaterial({
      color: 0xe11d48, // Coral pink to inflamed red
      roughness: 0.4,
    });
    const gingivaGeo = new THREE.ConeGeometry(0.7, 1.4, 16);
    const gingivaMesh = new THREE.Mesh(gingivaGeo, gingivaMat);
    gingivaMesh.name = 'gingiva';
    gingivaMesh.position.set(0, 0.35, 0.25);
    modelGroup.add(gingivaMesh);

    // 5. Necrotic Crater / Slough / Pseudomembrane
    const pseudoMat = new THREE.MeshStandardMaterial({
      color: 0x64748b, // Grayish necrotic pseudomembrane
      roughness: 0.9,
    });
    const pseudoGeo = new THREE.SphereGeometry(0.35, 12, 12);
    const pseudoMesh = new THREE.Mesh(pseudoGeo, pseudoMat);
    pseudoMesh.name = 'pseudomembrane';
    pseudoMesh.position.set(0, 0.4, 0.3);
    pseudoMesh.visible = false;
    modelGroup.add(pseudoMesh);

    // 6. Bacterial Biofilm / Spirochetal Infiltration
    const biofilmMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.2,
      wireframe: true,
    });
    const biofilmGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.4, 16, 1, true);
    const biofilmMesh = new THREE.Mesh(biofilmGeo, biofilmMat);
    biofilmMesh.name = 'biofilm';
    biofilmMesh.position.set(0, 0.45, 0.2);
    modelGroup.add(biofilmMesh);

    // INTERACTIVE ORBIT CONTROLS
    let isDragging = false;
    let prevPos = { x: 0, y: 0 };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevPos = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !modelGroupRef.current) return;
      const deltaX = e.clientX - prevPos.x;
      const deltaY = e.clientY - prevPos.y;
      modelGroupRef.current.rotation.y += deltaX * 0.008;
      modelGroupRef.current.rotation.x = Math.max(-0.6, Math.min(0.6, modelGroupRef.current.rotation.x + deltaY * 0.008));
      prevPos = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      isDragging = true;
      prevPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length === 0 || !modelGroupRef.current) return;
      const deltaX = e.touches[0].clientX - prevPos.x;
      const deltaY = e.touches[0].clientY - prevPos.y;
      modelGroupRef.current.rotation.y += deltaX * 0.008;
      modelGroupRef.current.rotation.x = Math.max(-0.6, Math.min(0.6, modelGroupRef.current.rotation.x + deltaY * 0.008));
      prevPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = () => {
      isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      const newZ = cameraRef.current.position.z + e.deltaY * 0.005;
      cameraRef.current.position.z = Math.max(2.2, Math.min(7.0, newZ));
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('wheel', handleWheel, { passive: false });

    // RENDER LOOP
    let clock = new THREE.Clock();
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      if (!isDragging) {
        modelGroup.rotation.y += 0.004;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('wheel', handleWheel);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  // UPDATE MODEL ACCORDING TO CURRENT STAGE AND ACTIVE LAYERS
  useEffect(() => {
    if (!modelGroupRef.current) return;
    const group = modelGroupRef.current;

    const bone = group.getObjectByName('bone') as THREE.Mesh;
    const pdl = group.getObjectByName('pdl') as THREE.Mesh;
    const gingiva = group.getObjectByName('gingiva') as THREE.Mesh;
    const pseudo = group.getObjectByName('pseudomembrane') as THREE.Mesh;
    const biofilm = group.getObjectByName('biofilm') as THREE.Mesh;

    if (bone) bone.visible = activeLayers.bone;
    if (pdl) pdl.visible = activeLayers.pdl;
    if (gingiva) gingiva.visible = activeLayers.gingiva;
    if (biofilm) biofilm.visible = activeLayers.biofilm;

    if (currentStage === 'healthy') {
      if (gingiva) {
        (gingiva.material as THREE.MeshStandardMaterial).color.setHex(0xf472b6); // Healthy pink
        gingiva.scale.set(1, 1, 1);
        gingiva.position.set(0, 0.45, 0.25);
      }
      if (bone) bone.scale.set(1, 1, 1);
      if (pseudo) pseudo.visible = false;
      if (biofilm) biofilm.visible = false;
    } else if (currentStage === 'nug') {
      // Punched-out cratering of papilla + grayish pseudomembrane
      if (gingiva) {
        (gingiva.material as THREE.MeshStandardMaterial).color.setHex(0xb91c1c); // Erythematous bleeding
        gingiva.scale.set(1.1, 0.65, 1.1); // Punched-out crater depression
        gingiva.position.set(0, 0.2, 0.25);
      }
      if (bone) bone.scale.set(1, 1, 1); // Bone intact in NUG
      if (pseudo) {
        pseudo.visible = true;
        pseudo.scale.set(0.9, 0.5, 0.9);
      }
      if (biofilm) {
        biofilm.visible = true;
        (biofilm.material as THREE.MeshStandardMaterial).color.setHex(0xf59e0b);
      }
    } else if (currentStage === 'nup') {
      // Attachment loss + bone resorption + osteonecrosis
      if (gingiva) {
        (gingiva.material as THREE.MeshStandardMaterial).color.setHex(0x7f1d1d);
        gingiva.scale.set(1.2, 0.45, 1.2);
        gingiva.position.set(0, -0.05, 0.25);
      }
      if (bone) {
        // Alveolar bone resorption (bone loss)
        bone.scale.set(1, 0.65, 1);
        bone.position.set(0, -1.3, 0);
        (bone.material as THREE.MeshStandardMaterial).color.setHex(0xd1d5db); // Exposed necrotic bone
      }
      if (pseudo) {
        pseudo.visible = true;
        pseudo.scale.set(1.4, 0.8, 1.4);
      }
      if (biofilm) biofilm.visible = true;
    } else if (currentStage === 'noma') {
      // Severe facial gangrene, cone-shaped deep necrotic destruction
      if (gingiva) {
        (gingiva.material as THREE.MeshStandardMaterial).color.setHex(0x1e1e24); // Black gangrenous slough
        gingiva.scale.set(1.5, 0.25, 1.5);
      }
      if (bone) {
        bone.scale.set(0.8, 0.4, 0.8);
        (bone.material as THREE.MeshStandardMaterial).color.setHex(0x475569); // Bone sequestration
      }
      if (pseudo) {
        pseudo.visible = true;
        pseudo.scale.set(2.0, 1.2, 2.0);
        (pseudo.material as THREE.MeshStandardMaterial).color.setHex(0x1e293b);
      }
      if (biofilm) biofilm.visible = true;
    }
  }, [currentStage, activeLayers]);

  const handleStageSelect = (stage: 'healthy' | 'nug' | 'nup' | 'noma') => {
    setCurrentStage(stage);
    onStageChange?.(stage);
  };

  return (
    <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Stage Controller */}
      <div className="p-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <h3 className="text-sm font-semibold text-slate-100">3D Periodontal Destruction Explorer</h3>
        </div>
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => handleStageSelect('healthy')}
            className={`px-2.5 py-1 rounded transition-colors ${currentStage === 'healthy' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
          >
            Healthy
          </button>
          <button
            onClick={() => handleStageSelect('nug')}
            className={`px-2.5 py-1 rounded transition-colors ${currentStage === 'nug' ? 'bg-amber-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
          >
            NUG (Punched-Out)
          </button>
          <button
            onClick={() => handleStageSelect('nup')}
            className={`px-2.5 py-1 rounded transition-colors ${currentStage === 'nup' ? 'bg-rose-700 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
          >
            NUP (Bone Loss)
          </button>
          <button
            onClick={() => handleStageSelect('noma')}
            className={`px-2.5 py-1 rounded transition-colors ${currentStage === 'noma' ? 'bg-purple-800 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
          >
            Noma (Gangrene)
          </button>
        </div>
      </div>

      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-72 cursor-grab active:cursor-grabbing relative" />

      {/* Stage Description & Microbe Tracker */}
      <div className="p-3 bg-slate-950/90 border-t border-slate-800 text-xs flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-amber-400 text-sm">
            {currentStage === 'healthy' && 'Normal Gingival & Periodontal Architecture'}
            {currentStage === 'nug' && 'Acute Necrotizing Ulcerative Gingivitis (NUG)'}
            {currentStage === 'nup' && 'Necrotizing Ulcerative Periodontitis (NUP) with Osteonecrosis'}
            {currentStage === 'noma' && 'Cancrum Oris / Noma (Cone-Shaped Orofacial Gangrene)'}
          </span>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={activeLayers.bone}
                onChange={(e) => setActiveLayers({ ...activeLayers, bone: e.target.checked })}
                className="rounded accent-amber-500"
              />
              Bone
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={activeLayers.pdl}
                onChange={(e) => setActiveLayers({ ...activeLayers, pdl: e.target.checked })}
                className="rounded accent-amber-500"
              />
              PDL
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={activeLayers.biofilm}
                onChange={(e) => setActiveLayers({ ...activeLayers, biofilm: e.target.checked })}
                className="rounded accent-amber-500"
              />
              Biofilm
            </label>
          </div>
        </div>

        <p className="text-slate-300 leading-relaxed">
          {currentStage === 'healthy' &&
            'Normal interdental papilla fills the embrasure space; knife-edged gingival margin with stippling. Intact alveolar crest 1.5–2 mm apical to cementoenamel junction.'}
          {currentStage === 'nug' &&
            'Rapid necrosis and punched-out cratering of the interdental papillae covered by a grayish pseudomembrane. Sialorrhea, metallic taste, and severe pain preventing brushing. Caused by Treponema species, Prevotella intermedia, and Fusobacterium nucleatum.'}
          {currentStage === 'nup' &&
            'Rapid attachment and alveolar bone loss. Strongly predictive of CD4 < 200 cells/mm³ in AIDS patients (6% prevalence), leading to osteonecrosis and tooth sequestration.'}
          {currentStage === 'noma' &&
            'Cone-shaped facial destruction (base in oral cavity, apex at skin). Fusobacterium necrophorum produces dermonecrotic toxin, hemolysin, leukotoxin, and proteases. 70–90% mortality without aggressive nutritional and antibiotic therapy.'}
        </p>
      </div>
    </div>
  );
};
