import React from 'react';
import * as THREE from 'three';
import { ThreeCanvasContainer } from '../../ThreeCanvasContainer';

export const HealthDimensions3D: React.FC = () => {
  const initScene = (
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer
  ) => {
    const group = new THREE.Group();
    scene.add(group);

    // 1. Central "Individual" Sphere (Core of well-being)
    const coreGeo = new THREE.IcosahedronGeometry(0.8, 3);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x1B3A8C, // Royal Blue
      roughness: 0.2,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transmission: 0.35,
      thickness: 1.2,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.castShadow = true;
    group.add(coreMesh);

    // Inner glowing core
    const innerGeo = new THREE.SphereGeometry(0.5, 24, 24);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xC9A24B, // Gold
      wireframe: true,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreMesh.add(innerMesh);

    // 2. The 5 Dimensions (Physical, Mental, Social, Spiritual, Emotional)
    const dimensionNodes: { name: string; color: number; angle: number; mesh?: THREE.Group }[] = [
      { name: 'Physical', color: 0x22C55E, angle: (0 * 2 * Math.PI) / 5 }, // Green Somatic
      { name: 'Mental', color: 0x3B82F6, angle: (1 * 2 * Math.PI) / 5 },   // Blue Cognitive
      { name: 'Spiritual', color: 0xA855F7, angle: (2 * 2 * Math.PI) / 5 },// Purple Purpose
      { name: 'Social', color: 0xF59E0B, angle: (3 * 2 * Math.PI) / 5 },   // Amber Community
      { name: 'Emotional', color: 0xEC4899, angle: (4 * 2 * Math.PI) / 5 },// Pink Coping
    ];

    const radius = 2.4;
    const nodeGroups: THREE.Group[] = [];
    const connectingTubes: THREE.Line[] = [];

    // Pentagon perimeter points
    const perimeterPoints: THREE.Vector3[] = [];

    dimensionNodes.forEach((node) => {
      const nodeGroup = new THREE.Group();
      const x = Math.sin(node.angle) * radius;
      const y = Math.cos(node.angle) * radius * 0.85;
      const z = (Math.sin(node.angle * 2) * 0.4);
      nodeGroup.position.set(x, y, z);

      // Node mesh
      const sphereGeo = new THREE.SphereGeometry(0.35, 24, 24);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: node.color,
        roughness: 0.25,
        metalness: 0.7,
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.castShadow = true;
      nodeGroup.add(sphere);

      // Gold orbital ring
      const ringGeo = new THREE.TorusGeometry(0.5, 0.02, 16, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xC9A24B });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 3;
      nodeGroup.add(ring);

      group.add(nodeGroup);
      nodeGroups.push(nodeGroup);
      perimeterPoints.push(new THREE.Vector3(x, y, z));

      // Spoke line from center to node
      const spokeGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(x, y, z),
      ]);
      const spokeMat = new THREE.LineBasicMaterial({
        color: 0xC9A24B,
        transparent: true,
        opacity: 0.45,
      });
      const spokeLine = new THREE.Line(spokeGeo, spokeMat);
      group.add(spokeLine);
    });

    // Close the pentagon
    perimeterPoints.push(perimeterPoints[0].clone());
    const perimeterGeo = new THREE.BufferGeometry().setFromPoints(perimeterPoints);
    const perimeterMat = new THREE.LineBasicMaterial({
      color: 0x0B1F4D,
      transparent: true,
      opacity: 0.6,
      linewidth: 2,
    });
    const perimeterLine = new THREE.Line(perimeterGeo, perimeterMat);
    group.add(perimeterLine);

    // Orbiting particulate energy field
    const particleCount = 75;
    const particleGeo = new THREE.BufferGeometry();
    const posArr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 1.2 + Math.random() * 1.6;
      posArr[i] = r * Math.sin(phi) * Math.cos(theta);
      posArr[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      posArr[i + 2] = r * Math.cos(phi);
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xC9A24B,
      size: 0.06,
      transparent: true,
      opacity: 0.8,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    group.add(particles);

    let expansionFactor = 1.0;

    return {
      update: (delta: number) => {
        group.rotation.y += delta * 0.25;
        coreMesh.rotation.x += delta * 0.4;
        coreMesh.rotation.z += delta * 0.2;
        particles.rotation.y -= delta * 0.15;

        // Subtle node breathing
        nodeGroups.forEach((ng, i) => {
          const t = performance.now() * 0.002 + i;
          ng.position.y += Math.sin(t) * 0.0015;
        });
      },
      onSliderChange: (value: number) => {
        // value 0 to 100: expansion of dimensions
        expansionFactor = 0.6 + (value / 100) * 1.0;
        nodeGroups.forEach((ng, i) => {
          const origAngle = dimensionNodes[i].angle;
          const origX = Math.sin(origAngle) * radius * expansionFactor;
          const origY = Math.cos(origAngle) * radius * 0.85 * expansionFactor;
          const origZ = Math.sin(origAngle * 2) * 0.4 * expansionFactor;
          ng.position.set(origX, origY, origZ);
        });
      },
      onToggleLayer: (layerId: string) => {
        if (layerId === 'core') coreMesh.visible = !coreMesh.visible;
        if (layerId === 'network') perimeterLine.visible = !perimeterLine.visible;
        if (layerId === 'particles') particles.visible = !particles.visible;
      },
      resetView: () => {
        group.rotation.set(0, 0, 0);
      },
      dispose: () => {
        coreGeo.dispose();
        coreMat.dispose();
        innerGeo.dispose();
        innerMat.dispose();
        perimeterGeo.dispose();
        perimeterMat.dispose();
        particleGeo.dispose();
        particleMat.dispose();
      },
    };
  };

  return (
    <ThreeCanvasContainer
      title="WHO 5-Dimensional Health Equilibrium Model"
      badge="Lecture 1 • 3D Biopsychosocial Model"
      onInitScene={initScene}
      sliderLabel="Equilibrium Expansion"
      sliderMin={0}
      sliderMax={100}
      sliderInitial={50}
      layers={[
        { id: 'core', label: 'Central Individual', active: true },
        { id: 'network', label: 'Pentagon Mesh', active: true },
        { id: 'particles', label: 'Vital Field', active: true },
      ]}
      annotations={[
        { label: 'Physical', text: 'Somatic vitality, intact dental enamel, periodontal integrity, and masticatory capacity.' },
        { label: 'Mental', text: 'Oral health literacy, understanding preventive protocols, cognitive adherence.' },
        { label: 'Social', text: 'Community water fluoridation, socioeconomic support, dental healthcare access.' },
        { label: 'Emotional', text: 'Managing dental fear/anxiety, pain perception, and self-esteem from aesthetics.' },
        { label: 'Spiritual', text: 'Core values, ethical stewardship of bodily health, purpose, and quality of life.' },
      ]}
    />
  );
};
