import React from 'react';
import * as THREE from 'three';
import { ThreeCanvasContainer } from '../../ThreeCanvasContainer';

export const FluorideCrystal3D: React.FC = () => {
  const initScene = (
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer
  ) => {
    const root = new THREE.Group();
    scene.add(root);

    // 1. Crystal Lattice Structure: Hydroxyapatite / Fluorapatite Unit Cell
    // Hexagonal prism wireframe cage
    const hexCageGeo = new THREE.CylinderGeometry(1.6, 1.6, 2.2, 6, 1, true);
    const hexCageMat = new THREE.MeshBasicMaterial({
      color: 0x0B1F4D,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const hexCage = new THREE.Mesh(hexCageGeo, hexCageMat);
    root.add(hexCage);

    // Calcium (Ca2+) Ions (Silver / Grey Spheres)
    const caGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const caMat = new THREE.MeshStandardMaterial({
      color: 0x94A3B8,
      metalness: 0.5,
      roughness: 0.2,
    });
    for (let i = 0; i < 12; i++) {
      const angle = (i / 6) * Math.PI;
      const y = (i < 6 ? 0.9 : -0.9);
      const ca = new THREE.Mesh(caGeo, caMat);
      ca.position.set(Math.cos(angle) * 1.5, y, Math.sin(angle) * 1.5);
      root.add(ca);
    }

    // Phosphate (PO43-) Clusters (Golden Tetrahedral Spheres)
    const po4Geo = new THREE.SphereGeometry(0.18, 16, 16);
    const po4Mat = new THREE.MeshStandardMaterial({
      color: 0xC9A24B, // Gold phosphate
      metalness: 0.3,
      roughness: 0.3,
    });
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + Math.PI / 6;
      const po4 = new THREE.Mesh(po4Geo, po4Mat);
      po4.position.set(Math.cos(angle) * 0.9, 0, Math.sin(angle) * 0.9);
      root.add(po4);
    }

    // Central Column: OH- Hydroxyl vs F- Fluoride Ion
    // Hydroxyl (OH-) represented by Red/White dual sphere
    const ohGroup = new THREE.Group();
    const oGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const oMat = new THREE.MeshStandardMaterial({ color: 0xEF4444 });
    const hGeo = new THREE.SphereGeometry(0.1, 12, 12);
    const hMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
    const oAtom = new THREE.Mesh(oGeo, oMat);
    const hAtom = new THREE.Mesh(hGeo, hMat);
    hAtom.position.set(0, 0.2, 0);
    ohGroup.add(oAtom, hAtom);
    ohGroup.position.set(0, 0, 0);
    root.add(ohGroup);

    // Fluoride Ion (F-) (Vibrant Cyan / Teal Fluoride)
    const fGeo = new THREE.SphereGeometry(0.22, 24, 24);
    const fMat = new THREE.MeshPhysicalMaterial({
      color: 0x06B6D4, // Cyan / electric teal
      roughness: 0.1,
      metalness: 0.2,
      clearcoat: 1.0,
      emissive: 0x0891B2,
      emissiveIntensity: 0.3,
    });
    const fAtom = new THREE.Mesh(fGeo, fMat);
    fAtom.position.set(0, 0, 0);
    fAtom.visible = false;
    root.add(fAtom);

    // 2. Calcium Fluoride (CaF2) Globular Reservoir on Enamel Surface
    const caf2Group = new THREE.Group();
    const globuleGeo = new THREE.SphereGeometry(0.14, 16, 16);
    const globuleMat = new THREE.MeshPhysicalMaterial({
      color: 0x38BDF8, // Light sky blue CaF2 globules
      roughness: 0.2,
      transmission: 0.5,
      transparent: true,
      opacity: 0.85,
    });
    for (let i = 0; i < 24; i++) {
      const globule = new THREE.Mesh(globuleGeo, globuleMat);
      const angle = Math.random() * Math.PI * 2;
      const r = 0.4 + Math.random() * 1.8;
      globule.position.set(Math.cos(angle) * r, 1.4 + Math.random() * 0.4, Math.sin(angle) * r);
      caf2Group.add(globule);
    }
    caf2Group.position.y = 0.2;
    caf2Group.visible = false;
    root.add(caf2Group);

    // Update Lattice Substitution Mode
    const setFluorideMode = (mode: number) => {
      // 0 = Pure Hydroxyapatite [Ca10(PO4)6(OH)2] - Critical pH: 5.5
      // 1 = Fluorapatite Substitution [Ca10(PO4)6F2] - Critical pH: 4.5!
      // 2 = CaF2 Surface Reservoir Layer (Erosion protection)
      if (mode === 0) {
        ohGroup.visible = true;
        fAtom.visible = false;
        caf2Group.visible = false;
      } else if (mode === 1) {
        ohGroup.visible = false;
        fAtom.visible = true;
        caf2Group.visible = false;
      } else if (mode >= 2) {
        ohGroup.visible = false;
        fAtom.visible = true;
        caf2Group.visible = true;
      }
    };

    setFluorideMode(0);

    return {
      update: (delta: number) => {
        root.rotation.y += delta * 0.18;
        fAtom.rotation.x += delta * 0.5;
        ohGroup.rotation.z += delta * 0.4;
      },
      onSliderChange: (val: number) => {
        setFluorideMode(Math.round(val));
      },
      onToggleLayer: (layerId: string) => {
        if (layerId === 'cage') hexCage.visible = !hexCage.visible;
        if (layerId === 'caf2') caf2Group.visible = !caf2Group.visible;
      },
      resetView: () => {
        root.rotation.set(0, 0, 0);
      },
      dispose: () => {
        hexCageGeo.dispose();
        hexCageMat.dispose();
        caGeo.dispose();
        caMat.dispose();
        po4Geo.dispose();
        po4Mat.dispose();
        oGeo.dispose();
        oMat.dispose();
        hGeo.dispose();
        hMat.dispose();
        fGeo.dispose();
        fMat.dispose();
        globuleGeo.dispose();
        globuleMat.dispose();
      },
    };
  };

  return (
    <ThreeCanvasContainer
      title="3D Hydroxyapatite to Fluorapatite Crystal Lattice & CaF2 Shield"
      badge="Lecture 6 • Crystallographic Fluoride Exchange"
      onInitScene={initScene}
      sliderLabel="Mineral State: 0=Hydroxyapatite (pH 5.5), 1=Fluorapatite (pH 4.5), 2=CaF2 Erosion Shield"
      sliderMin={0}
      sliderMax={2}
      sliderStep={1}
      sliderInitial={0}
      layers={[
        { id: 'cage', label: 'Hexagonal Prism Cage', active: true },
        { id: 'caf2', label: 'CaF2 Surface Reservoirs', active: false },
      ]}
      annotations={[
        { label: 'OH- Substitution', text: 'Fluoride replaces the larger hydroxyl (OH-) group, creating a denser, more acid-resistant crystal.' },
        { label: 'Critical pH: 4.5', text: 'Fluorapatite dissolves only below pH 4.5 (compared to pH 5.5 for normal enamel hydroxyapatite)!' },
        { label: 'CaF2 Reservoir', text: 'Topical fluorides form calcium fluoride globules that dissolve first during acid attacks, sparing enamel.' },
      ]}
    />
  );
};
