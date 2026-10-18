import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Droplet, RotateCcw, Compass, CheckCircle2, Info } from 'lucide-react';
import { createHumanIncisor, createHumanMolar, createDentalMaterials } from '../utils/dentalAnatomy3D';

interface ToothBopData {
  fdi: number;
  name: string;
  type: 'incisor' | 'molar';
  sites: {
    id: string;
    name: string;
    short: string;
    bleeding: boolean;
    pocketDepth: number;
    pos: [number, number, number]; // 3D coordinates on tooth
  }[];
}

interface ThreeBopViewerProps {
  tooth: ToothBopData;
  onToggleSite: (siteId: string) => void;
}

export const ThreeBopViewer: React.FC<ThreeBopViewerProps> = ({ tooth, onToggleSite }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const markersGroupRef = useRef<THREE.Group | null>(null);
  const toothMeshGroupRef = useRef<THREE.Group | null>(null);

  // Initialize Three.js scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 340;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0.6, 6.8);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.95));
    const dir = new THREE.DirectionalLight(0xffffff, 1.35);
    dir.position.set(4, 8, 6);
    scene.add(dir);

    const blueRim = new THREE.DirectionalLight(0x38bdf8, 0.65);
    blueRim.position.set(-6, -2, -4);
    scene.add(blueRim);

    // Human Tooth Mesh Group
    const toothGroup = new THREE.Group();
    toothMeshGroupRef.current = toothGroup;
    scene.add(toothGroup);

    buildSingleHumanTooth(toothGroup, tooth.type, tooth.fdi);

    // Markers Group for 6 Probing Sites
    const markersGroup = new THREE.Group();
    markersGroupRef.current = markersGroup;
    scene.add(markersGroup);

    rebuildMarkers(markersGroup, tooth);

    // Simple Orbit Controls
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let spherical = { radius: 6.8, theta: 0.05, phi: Math.PI / 2.2 };

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
      spherical.phi = Math.max(0.2, Math.min(Math.PI - 0.2, spherical.phi - (e.clientY - prevMouse.y) * 0.008));
      updateCam();
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => (isDragging = false);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      spherical.radius = Math.max(3.5, Math.min(10, spherical.radius + e.deltaY * 0.005));
      updateCam();
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    // Click Raycaster to toggle bleeding by clicking directly on 3D site markers
    const raycaster = new THREE.Raycaster();
    const mouseCoord = new THREE.Vector2();

    const onClick = (e: MouseEvent) => {
      const rect = dom.getBoundingClientRect();
      mouseCoord.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseCoord.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouseCoord, camera);

      if (markersGroupRef.current) {
        const intersects = raycaster.intersectObjects(markersGroupRef.current.children, true);
        if (intersects.length > 0) {
          const hitObj = intersects[0].object;
          if (hitObj.userData && hitObj.userData.siteId) {
            onToggleSite(hitObj.userData.siteId);
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

      if (markersGroupRef.current) {
        const time = Date.now() * 0.004;
        markersGroupRef.current.children.forEach((child) => {
          if (child.userData.bleeding) {
            const scale = 1.0 + Math.sin(time) * 0.18;
            child.scale.set(scale, scale, scale);
          }
        });
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('mousedown', onMouseDown);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('click', onClick);
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, []);

  // Update tooth model and markers when tooth prop changes
  useEffect(() => {
    if (toothMeshGroupRef.current) {
      buildSingleHumanTooth(toothMeshGroupRef.current, tooth.type, tooth.fdi);
    }
    if (markersGroupRef.current) {
      rebuildMarkers(markersGroupRef.current, tooth);
    }
  }, [tooth]);

  const buildSingleHumanTooth = (group: THREE.Group, type: 'incisor' | 'molar', fdi: number) => {
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      if ((child as THREE.Mesh).geometry) (child as THREE.Mesh).geometry.dispose();
    }

    if (type === 'incisor') {
      const incisor = createHumanIncisor({ isMaxillary: fdi === 11 });
      group.add(incisor);
    } else {
      const isMandibular = fdi >= 30;
      const molar = createHumanMolar({ isMandibular, furcationGrade: 'Grade II' });
      group.add(molar);
    }

    // PBR Gingival Collar around CEJ with stippled texture
    const mats = createDentalMaterials('all', tooth.sites.some((s) => s.bleeding));
    const gingiva = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.6, 1.2, 28), mats.gingiva);
    gingiva.position.y = -0.55;
    group.add(gingiva);
  };

  const rebuildMarkers = (group: THREE.Group, toothData: ToothBopData) => {
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      if ((child as THREE.Mesh).geometry) (child as THREE.Mesh).geometry.dispose();
    }

    toothData.sites.forEach((site) => {
      const markerGroup = new THREE.Group();
      markerGroup.position.set(site.pos[0], site.pos[1], site.pos[2]);
      markerGroup.userData = { siteId: site.id, bleeding: site.bleeding };

      // Sphere marker
      const sphereMat = new THREE.MeshStandardMaterial({
        color: site.bleeding ? 0xe11d48 : 0x0284c7,
        emissive: site.bleeding ? 0x991b1b : 0x075985,
        emissiveIntensity: site.bleeding ? 0.85 : 0.35,
        roughness: 0.25
      });
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), sphereMat);
      sphere.userData = { siteId: site.id };
      markerGroup.add(sphere);

      // Droplet visual if bleeding
      if (site.bleeding) {
        const dropGeo = new THREE.ConeGeometry(0.12, 0.28, 12);
        const dropMat = new THREE.MeshBasicMaterial({ color: 0xff0044 });
        const drop = new THREE.Mesh(dropGeo, dropMat);
        drop.position.y = 0.22;
        drop.rotation.z = Math.PI;
        drop.userData = { siteId: site.id };
        markerGroup.add(drop);
      }

      group.add(markerGroup);
    });
  };

  const setCameraAngle = (angle: 'buccal' | 'lingual' | 'mesial' | 'distal') => {
    if (!cameraRef.current) return;
    const cam = cameraRef.current;
    if (angle === 'buccal') cam.position.set(0, 0.4, 6.8);
    else if (angle === 'lingual') cam.position.set(0, 0.4, -6.8);
    else if (angle === 'mesial') cam.position.set(-6.8, 0.4, 0);
    else if (angle === 'distal') cam.position.set(6.8, 0.4, 0);
    cam.lookAt(0, 0, 0);
  };

  return (
    <div className="relative w-full h-[360px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col">
      {/* Top View Angle Selector */}
      <div className="absolute top-2 left-2 right-2 z-10 flex items-center justify-between pointer-events-none">
        <span className="bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-700 text-xs font-bold text-white flex items-center gap-1.5 shadow pointer-events-auto">
          <Droplet className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          Human 3D Tooth: {tooth.name}
        </span>

        <div className="flex items-center gap-1 pointer-events-auto bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700 shadow text-xs">
          <button onClick={() => setCameraAngle('buccal')} className="px-2 py-0.5 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer">
            Buccal
          </button>
          <button onClick={() => setCameraAngle('lingual')} className="px-2 py-0.5 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer">
            Lingual
          </button>
          <button onClick={() => setCameraAngle('mesial')} className="px-2 py-0.5 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer">
            Mesial
          </button>
          <button onClick={() => setCameraAngle('distal')} className="px-2 py-0.5 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer">
            Distal
          </button>
        </div>
      </div>

      {/* 3D Canvas */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing flex-1" />

      {/* Bottom Probing Sites Direct Buttons */}
      <div className="bg-slate-900/95 border-t border-slate-800 p-2.5 flex items-center justify-between gap-1 overflow-x-auto">
        {tooth.sites.map((site) => (
          <button
            key={site.id}
            onClick={() => onToggleSite(site.id)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              site.bleeding
                ? 'bg-rose-950 border-rose-500 text-rose-200'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${site.bleeding ? 'bg-rose-500 animate-pulse' : 'bg-slate-600'}`}></span>
            <span>{site.short}</span>
            <span className="text-[10px] text-slate-400">({site.pocketDepth}mm)</span>
          </button>
        ))}
      </div>
    </div>
  );
};
