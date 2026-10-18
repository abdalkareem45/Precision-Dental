import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import * as THREE from 'three';

export type VirionComponentId = 'all' | 'genome' | 'capsid' | 'tegument' | 'envelope' | 'spikes' | 'tropism';
export type VirionInteractionMode = 'highlight' | 'isolate' | 'expand';
export type VirusType = 'cmv' | 'coxsackie';

export interface ComponentMetadata {
  id: VirionComponentId;
  name: string;
  subheading: string;
  description: string;
  clinicalSignificance: string;
  visualAction: string;
  colorHex: number;
  badgeClass: string;
  cameraDistance: number;
  particleMode: string;
  particleTitle: string;
  particleDynamics: string;
}

export interface MeshTransformTargets {
  scale: number;
  opacity: number;
  emissiveIntensity: number;
  wireframe: boolean;
  visible: boolean;
}

interface RegisteredMeshEntry {
  id: VirionComponentId;
  object: THREE.Object3D;
  initialMaterialProps?: {
    color?: THREE.Color;
    opacity?: number;
    transparent?: boolean;
    emissive?: THREE.Color;
    emissiveIntensity?: number;
    wireframe?: boolean;
  };
}

interface VirionSceneContextType {
  virusType: VirusType;
  setVirusType: (type: VirusType) => void;
  selectedComponent: VirionComponentId;
  interactionMode: VirionInteractionMode;
  selectComponent: (id: VirionComponentId, mode?: VirionInteractionMode) => void;
  setInteractionMode: (mode: VirionInteractionMode) => void;
  resetScene: () => void;
  activeMetadata: ComponentMetadata;
  getComponentMetadata: (id: VirionComponentId) => ComponentMetadata;
  // Mesh Registry for direct Three.js scene synchronization
  registerMesh: (id: VirionComponentId, object: THREE.Object3D) => void;
  unregisterMesh: (id: VirionComponentId) => void;
  getTransformTargets: (id: VirionComponentId) => MeshTransformTargets;
  cameraTargetDistance: number;
  // Particle Effect System state
  particlesEnabled: boolean;
  setParticlesEnabled: (enabled: boolean) => void;
  particleSpeed: 'slow' | 'normal' | 'fast';
  setParticleSpeed: (speed: 'slow' | 'normal' | 'fast') => void;
}

const METADATA_DICTIONARY: Record<VirusType, Record<VirionComponentId, ComponentMetadata>> = {
  cmv: {
    all: {
      id: 'all',
      name: 'Intact Cytomegalovirus (HHV-5)',
      subheading: '~200 nm Enveloped Double-Stranded DNA Herpesvirus',
      description: 'Concentric intact architecture: Outer envelope studded with glycoprotein spikes, internal proteinaceous tegument, icosahedral capsid shell, and linear double-stranded DNA core.',
      clinicalSignificance: 'Exposure risk: intimate contact with body fluids, blood products, and donor organs. 90% seroprevalence in AIDS; pneumonia in transplant recipients (within 120 days); linked to Guillain-Barré.',
      visualAction: 'All concentric layers visible and intact. Select Genome, Capsid, Tegument, or Spikes to isolate or expand specific mesh components.',
      colorHex: 0x14b8a6,
      badgeClass: 'border-teal-500 text-teal-300 bg-teal-950/60',
      cameraDistance: 4.2,
      particleMode: 'ambient-halo',
      particleTitle: 'Ambient Physiological Solvation Halo',
      particleDynamics: 'Brownian suspension particles (~220 molecular ions) gently hovering around virion periphery in physiological fluid.',
    },
    genome: {
      id: 'genome',
      name: 'Double-Stranded DNA Genome (~235 kb)',
      subheading: 'Linear dsDNA Core (Largest Human Herpesvirus Genome)',
      description: 'Encodes over 200 open reading frames dedicated to viral replication, immune evasion, microvascular disruption, and lifelong persistence. Replicates inside host nucleus.',
      clinicalSignificance: 'Slide 4: Real-time quantitative PCR detects viral DNA in blood and tissue. Primary target for Ganciclovir/Valganciclovir DNA polymerase inhibition.',
      visualAction: 'dsDNA core dynamically targeted. Capsid shell rendered transparent wireframe; glowing magenta double-helix highlighted in sharp focus.',
      colorHex: 0xf43f5e,
      badgeClass: 'border-rose-500 text-rose-300 bg-rose-950/60',
      cameraDistance: 4.2,
      particleMode: 'genome-pulses',
      particleTitle: 'Replicative Nucleotide Glowing Pulses',
      particleDynamics: 'Luminous magenta nucleotide spark particles accelerating along the 235-kb double-helix with high-frequency glowing wave pulses (8 Hz), demonstrating active DNA polymerase transcription.',
    },
    capsid: {
      id: 'capsid',
      name: 'Icosahedral Nucleocapsid (T=16 Shell)',
      subheading: '162 Capsomers Assembled into Rigid Geometric Cage',
      description: 'Composed of major capsid protein (MCP/UL86) and minor triplexes packaging viral DNA under high internal pressure. Docks at host nuclear pores.',
      clinicalSignificance: 'Slide 4: Assembled in host nucleus; nuclear inclusion bodies produce the pathognomonic "owl\'s eye" appearance on tissue biopsy.',
      visualAction: 'T=16 icosahedron isolated in 3D scene. Outer envelope and tegument stripped away; facets illuminated with sharp cyan brilliance.',
      colorHex: 0x0284c7,
      badgeClass: 'border-blue-500 text-blue-300 bg-blue-950/60',
      cameraDistance: 4.2,
      particleMode: 'capsid-resonance',
      particleTitle: 'Icosahedral Facet Shield Resonance',
      particleDynamics: 'Electric cyan lattice sparkles pulsating along the 20 triangular facet boundaries, illustrating rigid protective packaging under high internal capsid pressure.',
    },
    tegument: {
      id: 'tegument',
      name: 'Proteinaceous Tegument Matrix',
      subheading: 'Amorphous Matrix Layer (pp65, pp71, UL97 Kinase)',
      description: 'Dense intervening protein matrix between envelope and capsid. Contains viral phosphotransferase UL97 and essential immune evasion factors.',
      clinicalSignificance: 'Slide 5: Viral UL97 kinase monophosphorylates Ganciclovir into active antiviral; UL97 mutations confer clinical ganciclovir resistance.',
      visualAction: 'Outer lipid envelope peeled away to reveal dense violet tegument matrix surrounding the nucleocapsid.',
      colorHex: 0x8b5cf6,
      badgeClass: 'border-purple-500 text-purple-300 bg-purple-950/60',
      cameraDistance: 4.2,
      particleMode: 'tegument-expansion',
      particleTitle: 'Rhythmic Kinase Phosphorylation Expansion',
      particleDynamics: 'Swirling cloud of pp65/pp71 and UL97 kinase particles rhythmically expanding and contracting in an organelle-like breathing cycle (3.5 Hz), demonstrating active viral phosphotransferase dynamics.',
    },
    envelope: {
      id: 'envelope',
      name: 'Host-Derived Lipid Bilayer Envelope',
      subheading: 'Fragile Outer Membrane (180–200 nm)',
      description: 'Acquired during viral budding from host inner nuclear and cytoplasmic organelle membranes. Protects inner nucleocapsid during fluid transmission.',
      clinicalSignificance: 'Slide 4: Fragile lipid envelope is inactivated readily by soap, alcohol, and ambient drying. Requires intimate fluid and WBC transfer.',
      visualAction: 'Lipid bilayer envelope highlighted with vivid cyan membrane opacity; outer glycoprotein spikes in sharp focus.',
      colorHex: 0x0ea5e9,
      badgeClass: 'border-sky-500 text-sky-300 bg-sky-950/60',
      cameraDistance: 4.2,
      particleMode: 'envelope-drift',
      particleTitle: 'Fluid Mosaic Lipid Bilayer Drift',
      particleDynamics: 'Amphipathic lipid nanoparticles swirling in smooth tangential orbital currents along the host-derived bilayer envelope, demonstrating membrane fluidity.',
    },
    spikes: {
      id: 'spikes',
      name: 'Glycoprotein Spikes (gB, gH/gL/gO Complexes)',
      subheading: 'Cellular Fusion & Endothelial Tropism Ligands',
      description: 'Multimeric viral glycoprotein spikes embedded in lipid envelope. Glycoprotein B (gB) mediates fusion; gH/gL/gO complexes determine vascular tropism.',
      clinicalSignificance: 'Slide 5: Primary target for neutralizing antibodies and future prophylactic CMV vaccines (expected in 5–10 years).',
      visualAction: 'Outer spikes illuminated with high emissive neon amber radiance; surrounding lipid membrane set to translucent context.',
      colorHex: 0xf59e0b,
      badgeClass: 'border-amber-500 text-amber-300 bg-amber-950/60',
      cameraDistance: 4.2,
      particleMode: 'spike-beacons',
      particleTitle: 'Receptor-Binding Radiating Beacon Jets',
      particleDynamics: 'Molten gold particle jets shooting outward from glycoprotein B & gH/gL/gO spike tips along radial vectors, simulating cellular integrin search and docking affinity.',
    },
    tropism: {
      id: 'tropism',
      name: 'Vascular Endothelial Cell Tropism',
      subheading: 'Microvascular Latency & End-Organ Occlusion',
      description: 'CMV docks onto host endothelial cells of blood vessels, mononuclear leukocytes, and bone marrow stem cells.',
      clinicalSignificance: 'Slide 4: Endothelial swelling and reactivation cause microvascular inflammation, thrombosis, and deep ischemic mucosal ulcerations.',
      visualAction: 'Virion positioned on host cell membrane showing receptor engagement and docking interface.',
      colorHex: 0x10b981,
      badgeClass: 'border-emerald-500 text-emerald-300 bg-emerald-950/60',
      cameraDistance: 4.2,
      particleMode: 'tropism-stream',
      particleTitle: 'Endothelial Docking Translocation Flux',
      particleDynamics: 'Directed stream of dual-radiance docking flux particles cascading between viral spikes and host endothelial membrane receptors.',
    },
  },
  coxsackie: {
    all: {
      id: 'all',
      name: 'Intact Coxsackievirus Virion',
      subheading: '~30 nm Non-Enveloped Positive-Sense Single-Stranded RNA',
      description: 'Compact acid-stable icosahedron built from 60 protomers of structural proteins VP1, VP2, VP3, and VP4 enclosing a positive-sense single-stranded RNA core.',
      clinicalSignificance: 'Causes Hand-Foot-and-Mouth disease (CVA16/EV71), Herpangina (CVA1-10, 16, 22), and Lymphonodular pharyngitis (CVA10). Self-limiting course.',
      visualAction: 'Complete non-enveloped virion intact. Select Genome, Capsid, or Spikes to isolate or expand specific mesh components.',
      colorHex: 0x0d9488,
      badgeClass: 'border-teal-500 text-teal-300 bg-teal-950/60',
      cameraDistance: 4.2,
      particleMode: 'ambient-halo',
      particleTitle: 'Ambient Enteric Acid-Stable Solvation Halo',
      particleDynamics: 'Ambient enteric suspension particles demonstrating extreme stability across gastric and intestinal physiological pH ranges (pH 3–9).',
    },
    genome: {
      id: 'genome',
      name: 'Positive-Sense Single-Stranded RNA (+ssRNA)',
      subheading: '~7.4 kb Infectious Messenger RNA Core',
      description: 'Functions directly as mRNA in host cytoplasm upon infection, translated into a polyprotein cleaved by viral proteases 2A and 3C.',
      clinicalSignificance: 'Slide 10: Real-time RT-PCR targets 5\' UTR and VP1 genes for definitive typing of CVA16, CVA6 (onychomadesis), and CVA10.',
      visualAction: 'Capsid shell rendered transparent wireframe; glowing emerald green +ssRNA core strand visible in high detail.',
      colorHex: 0x10b981,
      badgeClass: 'border-emerald-500 text-emerald-300 bg-emerald-950/60',
      cameraDistance: 4.2,
      particleMode: 'genome-pulses',
      particleTitle: '+ssRNA Messenger Core Glowing Pulses',
      particleDynamics: 'Vibrant emerald green nucleotide wave pulses surging through the +ssRNA genome strand, showing direct ribosomal translation into viral polyprotein.',
    },
    capsid: {
      id: 'capsid',
      name: 'Non-Enveloped 60-Protomer Capsid Shell',
      subheading: 'VP1, VP2, VP3, and VP4 Structural Proteins (~30 nm)',
      description: 'Rigid icosahedron built from 60 copies of four structural proteins. Lacks a lipid envelope.',
      clinicalSignificance: 'Slide 6: Extreme stability in gastric acid and bile enables fecal-oral transmission and extensive replication in lower GI tract.',
      visualAction: '60-protomer icosahedral capsid isolated in high contrast with sharp teal facets.',
      colorHex: 0x0d9488,
      badgeClass: 'border-teal-500 text-teal-300 bg-teal-950/60',
      cameraDistance: 4.2,
      particleMode: 'capsid-resonance',
      particleTitle: '60-Protomer Acid-Stable Icosahedral Resonance',
      particleDynamics: 'Resonant teal crystalline sparkles racing across the 60-protomer shell, illustrating resistance to gastric acid, bile, and lipid detergents.',
    },
    tegument: {
      id: 'tegument',
      name: 'Internal VP4 Sub-Capsid Polypeptide Cage',
      subheading: 'Myristoylated Internal Structural Protein',
      description: 'Coxsackievirus is a non-enveloped enterovirus and lacks an envelope tegument; VP4 lines the internal capsid surface anchoring the RNA core.',
      clinicalSignificance: 'Slide 6: Lacks lipid envelope; completely impervious to standard alcohol hand sanitizers. Strict soap and water handwashing required.',
      visualAction: 'Internal VP4 sub-capsid structural cage isolated in 3D.',
      colorHex: 0x6366f1,
      badgeClass: 'border-indigo-500 text-indigo-300 bg-indigo-950/60',
      cameraDistance: 4.2,
      particleMode: 'tegument-expansion',
      particleTitle: 'Internal VP4 Peptide Cage Rhythmic Breathing',
      particleDynamics: 'Internal myristoylated VP4 matrix particles rhythmically pulsating and breathing against the internal capsid wall in synchrony.',
    },
    envelope: {
      id: 'envelope',
      name: 'Non-Enveloped Enterovirus (Lacks Lipid Membrane)',
      subheading: 'Naked Icosahedral Nucleocapsid',
      description: 'Picornaviruses are non-enveloped viruses. They do not possess a host lipid membrane.',
      clinicalSignificance: 'Extreme environmental resistance, acid stability (pH 3–9), and resistance to lipid detergents.',
      visualAction: 'Naked capsid shell displayed; non-enveloped morphology verified.',
      colorHex: 0x0ea5e9,
      badgeClass: 'border-sky-500 text-sky-300 bg-sky-950/60',
      cameraDistance: 4.2,
      particleMode: 'envelope-drift',
      particleTitle: 'Naked Hydrophobic Surface Shield',
      particleDynamics: 'Naked capsid protective particles demonstrating absence of lipid bilayer and total imperviousness to lipid solvents and alcohol gels.',
    },
    spikes: {
      id: 'spikes',
      name: 'VP1 Canyon Surface Receptors',
      subheading: 'Receptor Binding Depressions (CAR & DAF / CD55)',
      description: 'Depressions on the surface of VP1 capsomers that bind cellular receptors on gastrointestinal and oropharyngeal mucosal cells.',
      clinicalSignificance: 'Slide 6: High epidemic attack rates in summer among children <10 years; transmits through saliva and stool.',
      visualAction: 'VP1 canyon receptor capsomers illuminated in glowing turquoise radiance.',
      colorHex: 0x2dd4bf,
      badgeClass: 'border-cyan-500 text-cyan-300 bg-cyan-950/60',
      cameraDistance: 4.2,
      particleMode: 'spike-beacons',
      particleTitle: 'VP1 Canyon Receptor Radiating Beacons',
      particleDynamics: 'Turquoise receptor-binding particles radiating from VP1 surface canyon depressions targeting CAR & DAF (CD55) host receptors.',
    },
    tropism: {
      id: 'tropism',
      name: 'Lower GI Tract & Oropharyngeal Mucosa',
      subheading: 'Peyer\'s Patches Replication & Enteric Shedding',
      description: 'Replicates extensively in the lower gastrointestinal tract with secondary shedding in oropharynx.',
      clinicalSignificance: 'Slide 6: Fecal-oral transmission dominates daycare outbreaks. Shed in feces for weeks after oral lesions heal.',
      visualAction: 'Virion positioned at epithelial host cell entry interface.',
      colorHex: 0x10b981,
      badgeClass: 'border-emerald-500 text-emerald-300 bg-emerald-950/60',
      cameraDistance: 4.2,
      particleMode: 'tropism-stream',
      particleTitle: 'Oropharyngeal & Enteric Docking Flux',
      particleDynamics: 'High-density docking flux particles streaming into oral mucosal and gastrointestinal epithelial receptors.',
    },
  },
};

const VirionSceneContext = createContext<VirionSceneContextType | null>(null);

export const VirionSceneProvider: React.FC<{ children: React.ReactNode; initialVirus?: VirusType }> = ({
  children,
  initialVirus = 'cmv',
}) => {
  const [virusType, setVirusType] = useState<VirusType>(initialVirus);
  const [selectedComponent, setSelectedComponent] = useState<VirionComponentId>('all');
  const [interactionMode, setInteractionMode] = useState<VirionInteractionMode>('highlight');
  const [particlesEnabled, setParticlesEnabled] = useState<boolean>(true);
  const [particleSpeed, setParticleSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');

  // Registry of Three.js Object3D references
  const registryRef = useRef<Map<VirionComponentId, RegisteredMeshEntry>>(new Map());

  const registerMesh = useCallback((id: VirionComponentId, object: THREE.Object3D) => {
    registryRef.current.set(id, { id, object });
  }, []);

  const unregisterMesh = useCallback((id: VirionComponentId) => {
    registryRef.current.delete(id);
  }, []);

  const selectComponent = useCallback((id: VirionComponentId, mode?: VirionInteractionMode) => {
    setSelectedComponent(id);
    if (mode) setInteractionMode(mode);
  }, []);

  const resetScene = useCallback(() => {
    setSelectedComponent('all');
    setInteractionMode('highlight');
  }, []);

  const getComponentMetadata = useCallback(
    (id: VirionComponentId) => {
      const typeDict = METADATA_DICTIONARY[virusType] || METADATA_DICTIONARY.cmv;
      return typeDict[id] || typeDict.all;
    },
    [virusType]
  );

  const activeMetadata = getComponentMetadata(selectedComponent);

  // Computes exact scale, opacity, emissive, and visibility targets for any mesh given central state
  const getTransformTargets = useCallback(
    (id: VirionComponentId): MeshTransformTargets => {
      // Default baseline for intact virion
      if (selectedComponent === 'all') {
        return {
          scale: 1.0,
          opacity: id === 'genome' ? 1.0 : id === 'capsid' ? 0.9 : id === 'tegument' ? 0.35 : id === 'envelope' ? 0.35 : 1.0,
          emissiveIntensity: id === 'genome' ? 0.8 : id === 'spikes' ? 0.5 : 0.0,
          wireframe: false,
          visible: true,
        };
      }

      const isSelected = selectedComponent === id;

      if (interactionMode === 'isolate') {
        // Pure isolation: only the selected component is visible
        if (isSelected) {
          return {
            scale: 1.35,
            opacity: 1.0,
            emissiveIntensity: 1.4,
            wireframe: false,
            visible: true,
          };
        } else {
          return {
            scale: 1.0,
            opacity: 0.0,
            emissiveIntensity: 0.0,
            wireframe: false,
            visible: false,
          };
        }
      } else if (interactionMode === 'expand') {
        // Expansion mode: selected component expands dramatically outwards
        if (isSelected) {
          return {
            scale: 1.55,
            opacity: 1.0,
            emissiveIntensity: 1.2,
            wireframe: false,
            visible: true,
          };
        } else {
          // Surrounding components shrink or stay translucent context
          return {
            scale: id === 'genome' ? 0.8 : 1.1,
            opacity: 0.15,
            emissiveIntensity: 0.1,
            wireframe: id === 'capsid',
            visible: true,
          };
        }
      } else {
        // Highlight mode (Default): selected component glows with high radiance while context dims
        if (isSelected) {
          return {
            scale: 1.02,
            opacity: 1.0,
            emissiveIntensity: 1.4,
            wireframe: false,
            visible: true,
          };
        } else {
          return {
            scale: 1.0,
            opacity: id === 'capsid' && selectedComponent === 'genome' ? 0.25 : 0.12,
            emissiveIntensity: 0.1,
            wireframe: id === 'capsid' && selectedComponent === 'genome',
            visible: true,
          };
        }
      }
    },
    [selectedComponent, interactionMode]
  );

  return (
    <VirionSceneContext.Provider
      value={{
        virusType,
        setVirusType,
        selectedComponent,
        interactionMode,
        selectComponent,
        setInteractionMode,
        resetScene,
        activeMetadata,
        getComponentMetadata,
        registerMesh,
        unregisterMesh,
        getTransformTargets,
        cameraTargetDistance: activeMetadata.cameraDistance,
        particlesEnabled,
        setParticlesEnabled,
        particleSpeed,
        setParticleSpeed,
      }}
    >
      {children}
    </VirionSceneContext.Provider>
  );
};

export const useVirionScene = () => {
  const context = useContext(VirionSceneContext);
  if (!context) {
    throw new Error('useVirionScene must be used within a VirionSceneProvider');
  }
  return context;
};
