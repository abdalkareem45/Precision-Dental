import React from 'react';
import * as THREE from 'three';
import { ThreeCanvasContainer } from '../../ThreeCanvasContainer';

export const SweetenersBiofilm3D: React.FC = () => {
  const initScene = (
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer
  ) => {
    const root = new THREE.Group();
    scene.add(root);

    // 1. Streptococcus mutans Bacterial Cell (Capsular spheroid)
    const bacteriumGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const bacteriumMat = new THREE.MeshPhysicalMaterial({
      color: 0x6B7280, // Greyish / muted purple bacterial cell wall
      roughness: 0.5,
      metalness: 0.1,
      clearcoat: 0.3,
    });
    const bacterium = new THREE.Mesh(bacteriumGeo, bacteriumMat);
    bacterium.position.set(-1.2, 0, 0);
    root.add(bacterium);

    // Membrane Transport Porins / Channels
    const channelGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.3, 16);
    const channelMat = new THREE.MeshStandardMaterial({ color: 0x1B3A8C });
    for (let i = 0; i < 8; i++) {
      const channel = new THREE.Mesh(channelGeo, channelMat);
      const theta = (i / 8) * Math.PI * 2;
      channel.position.set(
        -1.2 + Math.cos(theta) * 1.15,
        Math.sin(theta) * 1.15,
        0
      );
      channel.rotation.z = theta + Math.PI / 2;
      root.add(channel);
    }

    // 2. Extracellular Sticky Glucans (Formed only with Sucrose)
    const glucansGroup = new THREE.Group();
    const glucanGeo = new THREE.TorusGeometry(0.2, 0.05, 8, 16);
    const glucanMat = new THREE.MeshStandardMaterial({
      color: 0xF59E0B, // Amber sticky glucan polymer
      roughness: 0.3,
    });
    for (let i = 0; i < 20; i++) {
      const g = new THREE.Mesh(glucanGeo, glucanMat);
      g.position.set(
        -1.2 + (Math.random() - 0.5) * 2.2,
        (Math.random() - 0.5) * 2.2,
        (Math.random() - 0.5) * 2.2
      );
      g.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      glucansGroup.add(g);
    }
    root.add(glucansGroup);

    // 3. Cariostatic Protective Shield (Cheese Casein + Calcium Film)
    const shieldGeo = new THREE.SphereGeometry(1.6, 24, 24);
    const shieldMat = new THREE.MeshPhysicalMaterial({
      color: 0xC9A24B, // Gold micellar shield
      roughness: 0.1,
      transmission: 0.85,
      transparent: true,
      opacity: 0.45,
    });
    const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    shieldMesh.position.set(1.4, 0, 0);
    root.add(shieldMesh);

    // Tooth Enamel Surface Target
    const enamelTargetGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.4, 32);
    const enamelTargetMat = new THREE.MeshPhysicalMaterial({
      color: 0xFAF8F3,
      roughness: 0.1,
      clearcoat: 1.0,
    });
    const enamelTarget = new THREE.Mesh(enamelTargetGeo, enamelTargetMat);
    enamelTarget.position.set(1.4, 0, 0);
    enamelTarget.rotation.x = Math.PI / 2;
    root.add(enamelTarget);

    // Interactive Sweetener Mode:
    // 0 = Sucrose (Fermented into massive acid & sticky glucans)
    // 1 = Sorbitol (Weakly fermented, no glucans)
    // 2 = Xylitol (Bacteriostatic futile cycle inside cell)
    // 3 = Cheese / Milk Casein Protective Shield Active!
    const setMode = (mode: number) => {
      if (mode === 0) {
        // Sucrose
        bacteriumMat.color.setHex(0xEF4444); // Angry hyperactive acid-producing bacteria
        glucansGroup.visible = true;
        shieldMesh.visible = false;
      } else if (mode === 1) {
        // Sorbitol
        bacteriumMat.color.setHex(0x3B82F6); // Neutral / minimal fermentation
        glucansGroup.visible = false;
        shieldMesh.visible = false;
      } else if (mode === 2) {
        // Xylitol
        bacteriumMat.color.setHex(0x6B7280); // Inactive / inhibited bacteriostatic
        glucansGroup.visible = false;
        shieldMesh.visible = false;
      } else if (mode >= 3) {
        // Casein Shield from cheese/milk
        bacteriumMat.color.setHex(0x6B7280);
        glucansGroup.visible = false;
        shieldMesh.visible = true;
      }
    };

    setMode(0);

    return {
      update: (delta: number) => {
        root.rotation.y += delta * 0.12;
        bacterium.rotation.z += delta * 0.2;
        glucansGroup.rotation.x += delta * 0.15;
      },
      onSliderChange: (val: number) => {
        setMode(Math.round(val));
      },
      onToggleLayer: (layerId: string) => {
        if (layerId === 'glucans') glucansGroup.visible = !glucansGroup.visible;
        if (layerId === 'shield') shieldMesh.visible = !shieldMesh.visible;
        if (layerId === 'enamel') enamelTarget.visible = !enamelTarget.visible;
      },
      resetView: () => {
        root.rotation.set(0, 0, 0);
      },
      dispose: () => {
        bacteriumGeo.dispose();
        bacteriumMat.dispose();
        glucanGeo.dispose();
        glucanMat.dispose();
        shieldGeo.dispose();
        shieldMat.dispose();
        enamelTargetGeo.dispose();
        enamelTargetMat.dispose();
      },
    };
  };

  return (
    <ThreeCanvasContainer
      title="3D Bacterial Docking: Sucrose vs Xylitol & Casein Shield"
      badge="Lecture 5 • Cariostatic Mechanisms Simulation"
      onInitScene={initScene}
      sliderLabel="Substrate: 0=Sucrose (Glucans), 1=Sorbitol, 2=Xylitol (Inhibition), 3=Cheese Casein Shield"
      sliderMin={0}
      sliderMax={3}
      sliderStep={1}
      sliderInitial={0}
      layers={[
        { id: 'glucans', label: 'Extracellular Glucans', active: true },
        { id: 'shield', label: 'Casein Protective Shield', active: false },
        { id: 'enamel', label: 'Enamel Substrate', active: true },
      ]}
      annotations={[
        { label: 'Sucrose Glucans', text: 'S. mutans synthesizes sticky water-insoluble glucans from sucrose to glue itself to enamel.' },
        { label: 'Xylitol Bacteriostatic Trap', text: 'Xylitol enters bacteria but cannot be metabolized; accumulated xylitol-5-P halts growth.' },
        { label: 'Cheese Casein Shield', text: 'Casein proteins & calcium phosphate adsorb to the tooth surface, neutralizing plaque acid instantly.' },
      ]}
    />
  );
};
