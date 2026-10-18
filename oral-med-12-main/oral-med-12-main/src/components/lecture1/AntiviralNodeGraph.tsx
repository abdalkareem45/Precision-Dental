import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  Activity,
  Dna,
  Shield,
  Sparkles,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Pill,
  Zap,
  RotateCcw,
  Clock,
  ArrowRight,
  ShieldAlert,
  Play,
  Pause,
  Eye,
  Maximize2,
  Minimize2,
  Info,
  ZoomIn,
  ZoomOut,
  Target
} from 'lucide-react';

export type PathwaySimulationMode = 'wild-type-acv' | 'tk-mutant-resistant' | 'foscarnet-bypass' | 'valacyclovir-boost';

interface NodeData {
  id: string;
  name: string;
  shortLabel: string;
  category: 'drug' | 'enzyme' | 'metabolite' | 'checkpoint' | 'outcome';
  x: number;
  y: number;
  status: 'active' | 'blocked' | 'bypassed' | 'inhibited' | 'normal';
  details: {
    chemicalFormula: string;
    enzymeRole: string;
    molecularMechanism: string;
    resistanceRisk: string;
    boardPearl: string;
  };
}

export const AntiviralNodeGraph: React.FC = () => {
  // Pathway Simulation Mode
  const [simulationMode, setSimulationMode] = useState<PathwaySimulationMode>('wild-type-acv');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('viral_tk');
  const [activeStep, setActiveStep] = useState<number>(3); // 1 to 5
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [viewTab, setViewTab] = useState<'node-graph' | '3d-termination' | 'calculator'>('node-graph');

  // Pediatric dosing calculator state
  const [patientWeightKg, setPatientWeightKg] = useState<number>(20);
  const [creatinineClearance, setCreatinineClearance] = useState<number>(85); // mL/min

  // Three.js 3D Molecular Canvas References
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const dnaGroupRef = useRef<THREE.Group | null>(null);
  const polymeraseMeshRef = useRef<THREE.Mesh | null>(null);
  const drugMoleculeRef = useRef<THREE.Group | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Auto-step simulation timer
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev >= 5 ? 1 : prev + 1));
    }, 2800);
    return () => clearInterval(timer);
  }, [isPlaying, simulationMode]);

  // Node Definitions for the Metabolic Network Graph
  const NODES: Record<string, NodeData> = {
    prodrug_input: {
      id: 'prodrug_input',
      name: simulationMode === 'valacyclovir-boost' ? 'Valacyclovir HCl Prodrug' : 'Acyclovir (ACV)',
      shortLabel: simulationMode === 'valacyclovir-boost' ? 'Valacyclovir (55–70%)' : 'Acyclovir (15–20%)',
      category: 'drug',
      x: 80,
      y: 140,
      status: 'active',
      details: {
        chemicalFormula: '9-[(2-hydroxyethoxy)methyl]guanine (Acyclic guanosine analog)',
        enzymeRole: 'Inert prodrug with no intrinsic affinity for human host DNA polymerases.',
        molecularMechanism: 'Enters host cells via nucleoside transporters. Lacks 3\'-hydroxyl on its acyclic side chain.',
        resistanceRisk: 'Zero direct resistance; inert prior to initial phosphorylation.',
        boardPearl: 'Valacyclovir is the L-valyl ester prodrug delivering 3–5x higher systemic bioavailability via intestinal PEPT1 transporter (Slide 18).',
      },
    },
    cellular_influx: {
      id: 'cellular_influx',
      name: 'Cellular Uptake & Intracellular Pool',
      shortLabel: 'Host Cell Influx',
      category: 'metabolite',
      x: 230,
      y: 140,
      status: 'active',
      details: {
        chemicalFormula: 'Unphosphorylated ACV in cytoplasm',
        enzymeRole: 'Equilibrates across epithelial cell membrane via facilitated equilibrative nucleoside transporters (ENTs).',
        molecularMechanism: 'Diffuses freely without cellular toxicity; harmless to uninfected cells because host kinases cannot phosphorylate acyclovir!',
        resistanceRisk: 'Transport mutations are exceptionally rare.',
        boardPearl: 'Acyclovir has a remarkable therapeutic safety index (>100:1) because uninfected host cells lack the viral kinase required for initial activation (Slide 19).',
      },
    },
    viral_tk: {
      id: 'viral_tk',
      name: 'Viral Thymidine Kinase (TK / UL23)',
      shortLabel: simulationMode === 'tk-mutant-resistant' ? 'MUTANT TK (BLOCKED ❌)' : 'Viral TK (UL23 / ORF36)',
      category: 'enzyme',
      x: 390,
      y: 140,
      status: simulationMode === 'tk-mutant-resistant' ? 'blocked' : 'active',
      details: {
        chemicalFormula: 'Deoxythymidine Kinase (HSV-1 UL23 / VZV ORF36)',
        enzymeRole: 'The obligate, rate-limiting first phosphorylation gatekeeper: ACV ➔ ACV-Monophosphate (ACV-MP).',
        molecularMechanism: 'Viral TK monophosphorylates acyclovir ~1,000,000 times faster than host cellular kinases. Commits the drug to intracellular trapping.',
        resistanceRisk: 'MUTATIONS HERE ACCOUNT FOR >95% OF ALL ACYCLOVIR RESISTANCE (TK-deficient or TK-altered strains, Slide 20)!',
        boardPearl: 'Acyclovir-resistant HSV strains arise almost exclusively from viral thymidine kinase mutations, most commonly in severely immunocompromised (HSCT / AIDS) patients.',
      },
    },
    foscarnet_bypass: {
      id: 'foscarnet_bypass',
      name: 'Foscarnet (PFA) Bypass Node',
      shortLabel: 'Foscarnet (Pyrophosphate Bypass)',
      category: 'drug',
      x: 390,
      y: 280,
      status: simulationMode === 'foscarnet-bypass' ? 'active' : 'bypassed',
      details: {
        chemicalFormula: 'Phosphonoformic acid trisodium (PFA)',
        enzymeRole: 'Inorganic pyrophosphate analog that bypasses viral thymidine kinase completely.',
        molecularMechanism: 'Docks directly into the pyrophosphate-binding pocket of viral DNA polymerase, preventing cleavage of pyrophosphate from dNTPs.',
        resistanceRisk: 'Direct polymerase mutations (UL30 point mutations) can cause Foscarnet resistance, but TK-negative mutants remain fully susceptible!',
        boardPearl: 'Slide 20 Board Rule: In acyclovir-resistant HSV/VZV due to TK mutations, the mandatory 2nd-line rescue is Foscarnet IV or Cidofovir IV!',
      },
    },
    host_kinases: {
      id: 'host_kinases',
      name: 'Host Cellular Kinases (GMPK & PGK)',
      shortLabel: 'Host Cellular Kinases',
      category: 'enzyme',
      x: 550,
      y: 140,
      status: simulationMode === 'tk-mutant-resistant' ? 'inhibited' : 'active',
      details: {
        chemicalFormula: 'Guanylate Kinase (GMPK) + Phosphoglycerate Kinase (PGK)',
        enzymeRole: 'Conversion of ACV-Monophosphate (ACV-MP) ➔ ACV-Diphosphate (ACV-DP) ➔ ACV-Triphosphate (ACV-TP).',
        molecularMechanism: 'Normal host cellular nucleotide kinases add the second and third phosphate groups, generating the fully activated triphosphate species.',
        resistanceRisk: 'Host cellular enzymes do not mutate; kinetics are stable.',
        boardPearl: 'Notice that host kinases are completely incapable of performing the initial first phosphorylation on acyclovir (Slide 19).',
      },
    },
    active_tp_pool: {
      id: 'active_tp_pool',
      name: 'Acyclovir Triphosphate (ACV-TP)',
      shortLabel: 'Active ACV-TP (Competitor)',
      category: 'metabolite',
      x: 700,
      y: 140,
      status: simulationMode === 'tk-mutant-resistant' ? 'inhibited' : 'active',
      details: {
        chemicalFormula: 'ACV-TP (Guanosine-5\'-triphosphate mimic without 3\'-OH)',
        enzymeRole: 'Potent competitive inhibitor of natural deoxyguanosine triphosphate (dGTP).',
        molecularMechanism: 'Selectively concentrates inside herpesvirus-infected cells to high levels (>50-fold higher than in uninfected tissue).',
        resistanceRisk: 'Competes directly with dGTP at the nucleotide-binding pocket of viral DNA polymerase.',
        boardPearl: 'ACV-TP has a 100-fold higher binding affinity for viral DNA polymerase (UL30) than for human host DNA polymerase alpha (Slide 19).',
      },
    },
    dna_polymerase: {
      id: 'dna_polymerase',
      name: 'Viral DNA Polymerase (UL30 / ORF28)',
      shortLabel: 'Viral DNA Polymerase',
      category: 'enzyme',
      x: 840,
      y: 140,
      status: simulationMode === 'tk-mutant-resistant' ? 'blocked' : 'active',
      details: {
        chemicalFormula: 'HSV-1 UL30 / VZV ORF28 Catalytic Subunit',
        enzymeRole: 'Replicates viral genomic DNA duplex during lytic replication cycle.',
        molecularMechanism: 'Incorporates ACV-TP into the growing nascent viral DNA daughter strand in place of natural dGTP.',
        resistanceRisk: 'Polymerase point mutations can cause cross-resistance to ACV and Foscarnet (<5% of clinical isolates).',
        boardPearl: 'Once ACV-TP is inserted, the enzyme becomes irreversibly trapped on the terminated DNA template (suicide enzyme inactivation, Slide 19).',
      },
    },
    chain_termination: {
      id: 'chain_termination',
      name: 'Obligate DNA Chain Termination',
      shortLabel: 'Chain Termination (No 3\'-OH)',
      category: 'checkpoint',
      x: 990,
      y: 140,
      status: simulationMode === 'tk-mutant-resistant' ? 'inhibited' : 'active',
      details: {
        chemicalFormula: 'Frozen 3\'-terminus: -O-CH2-CH2-O-CH2-Guanine',
        enzymeRole: 'Immediate arrest of viral elongation.',
        molecularMechanism: 'Because acyclovir has an acyclic aliphatic side chain lacking a 3\'-hydroxyl (-OH) group, no phosphodiester bond can form with the next incoming dNTP.',
        resistanceRisk: 'Complete biochemical standstill of replication fork progression.',
        boardPearl: 'Lack of a 3\'-OH group is the quintessential molecular mechanism of action for acyclovir chain termination on dental board examinations (Slide 19)!',
      },
    },
    replication_outcome: {
      id: 'replication_outcome',
      name: simulationMode === 'tk-mutant-resistant' ? 'Unchecked Viral Replication Cycle ❌' : 'Viral Replication Cycle Arrested ✅',
      shortLabel: simulationMode === 'tk-mutant-resistant' ? 'Lytic Cycle Continues (100% Assembly)' : '0% Virion Assembly (Cycle Arrested)',
      category: 'outcome',
      x: 1140,
      y: 140,
      status: simulationMode === 'tk-mutant-resistant' ? 'blocked' : 'active',
      details: {
        chemicalFormula: simulationMode === 'tk-mutant-resistant' ? 'Uncontrolled dsDNA concatemers' : 'Truncated abortive viral fragments',
        enzymeRole: 'Clinical therapeutic endpoint.',
        molecularMechanism: simulationMode === 'tk-mutant-resistant'
          ? 'Viral replication continues unabated; virions package DNA, lyse epithelial cells, and produce progressive necrotic ulcers.'
          : 'Halt of viral progeny packaging, prompt cessation of epithelial cell lysis, and reduction in clinical ulcer duration and viral shedding.',
        resistanceRisk: simulationMode === 'tk-mutant-resistant' ? 'Severe progressive chronic mucocutaneous herpes.' : 'Therapeutic cure.',
        boardPearl: 'Slide 18 & 20: Early initiation within 72 hours of symptom onset is vital because antivirals only halt ACTIVE viral replication, not latent ganglia episomes.',
      },
    },
  };

  const selectedNode = NODES[selectedNodeId] || NODES.viral_tk;

  // 3D Three.js Molecular Termination Visualizer
  useEffect(() => {
    if (viewTab !== '3d-termination' || !mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 500;
    const height = 380;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x38bdf8, 3.5);
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xf43f5e, 2.5);
    rimLight.position.set(-5, -3, -4);
    scene.add(rimLight);

    // 1. DNA Double Helix Group
    const dnaGroup = new THREE.Group();
    dnaGroupRef.current = dnaGroup;
    scene.add(dnaGroup);

    // Strand 1: Template strand (Cyan)
    const points1: THREE.Vector3[] = [];
    const points2: THREE.Vector3[] = [];
    const helixTurns = 3.5;
    const helixRadius = 1.1;
    const helixHeight = 5.0;

    for (let i = 0; i < 90; i++) {
      const t = (i / 90) * (Math.PI * 2 * helixTurns);
      const y = ((i / 90) - 0.5) * helixHeight;
      points1.push(new THREE.Vector3(Math.cos(t) * helixRadius, y, Math.sin(t) * helixRadius));
      points2.push(new THREE.Vector3(Math.cos(t + Math.PI) * helixRadius, y, Math.sin(t + Math.PI) * helixRadius));
    }

    const curve1 = new THREE.CatmullRomCurve3(points1);
    const tube1 = new THREE.Mesh(
      new THREE.TubeGeometry(curve1, 70, 0.08, 8, false),
      new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x0891b2, emissiveIntensity: 0.6, roughness: 0.2 })
    );
    dnaGroup.add(tube1);

    // Strand 2: Growing daughter strand (Emerald / truncated with ACV)
    const daughterPoints = points2.slice(0, simulationMode === 'wild-type-acv' ? 55 : 85);
    const curve2 = new THREE.CatmullRomCurve3(daughterPoints);
    const tube2 = new THREE.Mesh(
      new THREE.TubeGeometry(curve2, 50, 0.08, 8, false),
      new THREE.MeshStandardMaterial({
        color: simulationMode === 'wild-type-acv' ? 0xf43f5e : 0x10b981,
        emissive: simulationMode === 'wild-type-acv' ? 0xe11d48 : 0x059669,
        emissiveIntensity: 0.8,
        roughness: 0.2,
      })
    );
    dnaGroup.add(tube2);

    // Base pair ladder rungs
    const barGeo = new THREE.CylinderGeometry(0.025, 0.025, helixRadius * 1.9, 6);
    const barMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.3 });
    for (let i = 0; i < 28; i++) {
      const bar = new THREE.Mesh(barGeo, barMat);
      const angle = (i / 28) * Math.PI * 2 * helixTurns;
      bar.position.set(0, ((i / 28) - 0.5) * helixHeight, 0);
      bar.rotation.z = Math.PI / 2;
      bar.rotation.y = angle;
      dnaGroup.add(bar);
    }

    // 2. Viral DNA Polymerase Protein Clamp (Translucent Violet Shell)
    const polGeo = new THREE.SphereGeometry(1.6, 24, 24);
    const polMat = new THREE.MeshStandardMaterial({
      color: 0x7c3aed,
      emissive: 0x5b21b6,
      emissiveIntensity: 0.35,
      transparent: true,
      opacity: 0.45,
      roughness: 0.4,
    });
    const polMesh = new THREE.Mesh(polGeo, polMat);
    polMesh.position.set(0, 0.2, 0);
    polymeraseMeshRef.current = polMesh;
    dnaGroup.add(polMesh);

    // 3. Drug Molecule (Acyclovir Triphosphate or Foscarnet)
    const drugGroup = new THREE.Group();
    drugMoleculeRef.current = drugGroup;
    dnaGroup.add(drugGroup);

    if (simulationMode === 'wild-type-acv') {
      // ACV molecule locked at termination point
      const termHead = new THREE.Mesh(
        new THREE.SphereGeometry(0.24, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0xf43f5e, emissiveIntensity: 1.2 })
      );
      termHead.position.set(0.6, 0.2, 0.6);
      drugGroup.add(termHead);

      const halo = new THREE.Mesh(
        new THREE.TorusGeometry(0.38, 0.03, 8, 24),
        new THREE.MeshBasicMaterial({ color: 0xfb7185, wireframe: true })
      );
      halo.position.set(0.6, 0.2, 0.6);
      drugGroup.add(halo);
    } else if (simulationMode === 'foscarnet-bypass') {
      // Foscarnet wedge inside catalytic pyrophosphate pocket
      const pfaWedge = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.35, 0.35),
        new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xd97706, emissiveIntensity: 1.0 })
      );
      pfaWedge.position.set(0.1, 0.2, 0.5);
      drugGroup.add(pfaWedge);
    }

    // Animation Loop
    const clock = new THREE.Clock();
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (!isDraggingRef.current && dnaGroupRef.current) {
        dnaGroupRef.current.rotation.y = elapsed * 0.4;
      }

      if (polMesh) {
        polMesh.scale.setScalar(1.0 + Math.sin(elapsed * 3) * 0.03);
      }

      if (drugGroup) {
        drugGroup.rotation.z += 0.02;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Mouse Listeners
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !dnaGroupRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;
      dnaGroupRef.current.rotation.y += deltaX * 0.008;
      dnaGroupRef.current.rotation.x += deltaY * 0.008;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    let touchDist: number | null = null;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        touchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        return;
      }
      if (e.touches.length === 0) return;
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && touchDist !== null && cameraRef.current) {
        const curDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const diff = touchDist - curDist;
        cameraRef.current.position.z = Math.max(3.0, Math.min(10.0, cameraRef.current.position.z + diff * 0.01));
        touchDist = curDist;
        return;
      }
      if (!isDraggingRef.current || !dnaGroupRef.current || e.touches.length === 0) return;
      const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
      const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

      dnaGroupRef.current.rotation.y += deltaX * 0.008;
      dnaGroupRef.current.rotation.x += deltaY * 0.008;

      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
      touchDist = null;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      const newZ = cameraRef.current.position.z + e.deltaY * 0.005;
      cameraRef.current.position.z = Math.max(3.0, Math.min(10.0, newZ));
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('wheel', handleWheel);
      if (rendererRef.current) rendererRef.current.dispose();
    };
  }, [viewTab, simulationMode]);

  // Pediatric Calculations (Slide 18)
  const singleDoseMg = patientWeightKg * 15; // 15 mg/kg per dose
  const totalDailyDoseMg = singleDoseMg * 5; // 5 times daily
  const liquidDoseMl = (singleDoseMg / 200) * 5; // 200 mg / 5 mL concentration

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-[11px] font-mono text-teal-400 font-bold uppercase tracking-wider">
              Slides 18–20 · Molecular Antiviral Action & Clinical Calculator
            </span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight mt-0.5 flex items-center gap-2">
            <span>Viral Thymidine Kinase (TK) Activation Cascade & Replication Network</span>
            <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-800">
              Node-Based Metabolic Graph
            </span>
          </h3>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setViewTab('node-graph')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              viewTab === 'node-graph'
                ? 'bg-teal-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Node Network Graph</span>
          </button>

          <button
            onClick={() => setViewTab('3d-termination')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              viewTab === '3d-termination'
                ? 'bg-rose-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Dna className="w-3.5 h-3.5" />
            <span>3D Chain Termination</span>
          </button>

          <button
            onClick={() => setViewTab('calculator')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              viewTab === 'calculator'
                ? 'bg-sky-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            <span>Clinical Rx Calculator</span>
          </button>
        </div>
      </div>

      {/* Pathway Simulation Mode Selector Bar */}
      <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400 font-semibold uppercase">
            Simulate Antiviral Scenario:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              {
                id: 'wild-type-acv' as const,
                label: '🟢 Wild-Type HSV + Acyclovir',
                badge: 'Selective Chain Termination',
              },
              {
                id: 'tk-mutant-resistant' as const,
                label: '🔴 Mutant TK (ACV-Resistant)',
                badge: 'Phosphorylation Blocked',
              },
              {
                id: 'foscarnet-bypass' as const,
                label: '🟡 2nd-Line Foscarnet PFA Bypass',
                badge: 'Direct Pyrophosphate Block',
              },
              {
                id: 'valacyclovir-boost' as const,
                label: '🟣 Valacyclovir PEPT1 Absorption',
                badge: '3–5x High Serum AUC',
              },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setSimulationMode(m.id)}
                className={`px-3 py-1.5 rounded-lg font-bold border transition-all text-xs ${
                  simulationMode === m.id
                    ? 'bg-slate-800 text-white border-teal-400 shadow-md ring-1 ring-teal-400/50'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-mono text-xs flex items-center gap-1"
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isPlaying ? 'Auto-Cycle ON' : 'Paused'}</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: INTERACTIVE NODE-BASED NETWORK GRAPH */}
      {viewTab === 'node-graph' && (
        <div className="space-y-4">
          {/* Node Graph Canvas */}
          <div className="relative w-full bg-slate-950 rounded-2xl border border-slate-800 p-6 overflow-x-auto">
            <svg viewBox="0 0 1260 360" className="w-full min-w-[980px] h-80 select-none">
              <defs>
                {/* Arrow markers */}
                <marker id="arrow-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#14b8a6" />
                </marker>
                <marker id="arrow-blocked" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
                </marker>
                <marker id="arrow-bypass" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
                </marker>
              </defs>

              {/* Host Epithelial Cell Enclosure Boundary */}
              <rect
                x="180"
                y="30"
                width="1060"
                height="300"
                rx="16"
                fill="#030712"
                stroke="#1e293b"
                strokeWidth="2.5"
                strokeDasharray="6 4"
              />
              <text x="200" y="55" fill="#475569" fontSize="11" fontFamily="monospace" fontWeight="bold">
                HERPES-INFECTED HOST EPITHELIAL CELL INTERIOR
              </text>

              {/* Connecting Metabolic Edges */}
              {/* Edge 1: Prodrug -> Influx */}
              <path
                d="M 140 140 L 175 140"
                stroke="#14b8a6"
                strokeWidth="3.5"
                markerEnd="url(#arrow-active)"
              />

              {/* Edge 2: Influx -> Viral TK */}
              <path
                d="M 285 140 L 330 140"
                stroke="#14b8a6"
                strokeWidth="3.5"
                markerEnd="url(#arrow-active)"
              />

              {/* Edge 3: Viral TK -> Host Kinases */}
              <path
                d="M 450 140 L 495 140"
                stroke={simulationMode === 'tk-mutant-resistant' ? '#f43f5e' : '#14b8a6'}
                strokeWidth="3.5"
                strokeDasharray={simulationMode === 'tk-mutant-resistant' ? '4 4' : 'none'}
                markerEnd={simulationMode === 'tk-mutant-resistant' ? 'url(#arrow-blocked)' : 'url(#arrow-active)'}
              />

              {/* Edge 4: Host Kinases -> ACV-TP */}
              <path
                d="M 610 140 L 645 140"
                stroke={simulationMode === 'tk-mutant-resistant' ? '#334155' : '#14b8a6'}
                strokeWidth="3.5"
                markerEnd={simulationMode === 'tk-mutant-resistant' ? '' : 'url(#arrow-active)'}
              />

              {/* Edge 5: ACV-TP -> Viral DNA Polymerase */}
              <path
                d="M 760 140 L 785 140"
                stroke={simulationMode === 'tk-mutant-resistant' ? '#334155' : '#14b8a6'}
                strokeWidth="3.5"
                markerEnd={simulationMode === 'tk-mutant-resistant' ? '' : 'url(#arrow-active)'}
              />

              {/* Edge 6: Polymerase -> Chain Termination */}
              <path
                d="M 900 140 L 935 140"
                stroke={simulationMode === 'tk-mutant-resistant' ? '#334155' : '#14b8a6'}
                strokeWidth="3.5"
                markerEnd={simulationMode === 'tk-mutant-resistant' ? '' : 'url(#arrow-active)'}
              />

              {/* Edge 7: Chain Termination -> Outcome */}
              <path
                d="M 1050 140 L 1085 140"
                stroke={simulationMode === 'tk-mutant-resistant' ? '#f43f5e' : '#14b8a6'}
                strokeWidth="3.5"
                markerEnd={simulationMode === 'tk-mutant-resistant' ? 'url(#arrow-blocked)' : 'url(#arrow-active)'}
              />

              {/* Foscarnet Bypass Edge (Arches directly from Foscarnet to Viral DNA Polymerase!) */}
              <path
                d="M 455 280 C 650 310, 750 240, 840 185"
                stroke={simulationMode === 'foscarnet-bypass' ? '#f59e0b' : '#334155'}
                strokeWidth={simulationMode === 'foscarnet-bypass' ? 4 : 2}
                strokeDasharray="6 3"
                fill="none"
                markerEnd="url(#arrow-bypass)"
              />
              {simulationMode === 'foscarnet-bypass' && (
                <text x="640" y="275" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  ⚡ DIRECT PYROPHOSPHATE POCKET BYPASS (BYPASSES TK!)
                </text>
              )}

              {/* Render Nodes */}
              {Object.values(NODES).map((node) => {
                const isSelected = selectedNodeId === node.id;
                const isTKBlocked = node.id === 'viral_tk' && simulationMode === 'tk-mutant-resistant';
                const isFoscarnetActive = node.id === 'foscarnet_bypass' && simulationMode === 'foscarnet-bypass';

                return (
                  <g
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className="cursor-pointer transition-transform group"
                    transform={`translate(${node.x}, ${node.y})`}
                  >
                    {/* Node Background Pill */}
                    <rect
                      x="-55"
                      y="-30"
                      width="110"
                      height="60"
                      rx="12"
                      fill={
                        isTKBlocked
                          ? '#881337'
                          : isFoscarnetActive
                          ? '#78350f'
                          : isSelected
                          ? '#0f766e'
                          : '#0f172a'
                      }
                      stroke={
                        isTKBlocked
                          ? '#f43f5e'
                          : isFoscarnetActive
                          ? '#f59e0b'
                          : isSelected
                          ? '#2dd4bf'
                          : '#334155'
                      }
                      strokeWidth={isSelected || isTKBlocked || isFoscarnetActive ? 2.5 : 1.5}
                      className="transition-colors shadow-lg"
                    />

                    {/* Node Label Text */}
                    <text
                      x="0"
                      y="-8"
                      fill="#ffffff"
                      fontSize="9.5"
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="sans-serif"
                    >
                      {node.shortLabel.split('(')[0].trim()}
                    </text>
                    <text
                      x="0"
                      y="10"
                      fill={isTKBlocked ? '#fecdd3' : '#94a3b8'}
                      fontSize="8"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {node.category.toUpperCase()}
                    </text>

                    {/* Active Step Indicator Pulse */}
                    {isSelected && (
                      <circle cx="0" cy="24" r="3.5" fill="#2dd4bf" className="animate-ping" />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Node Deep-Dive Inspector Card */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-850 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-teal-400" />
                <h4 className="text-sm font-bold text-white">
                  Node Inspector: {selectedNode.name}
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-teal-300">
                  {selectedNode.category.toUpperCase()}
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Formula: {selectedNode.details.chemicalFormula}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="font-bold text-teal-300 block">Enzymatic / Cellular Role:</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {selectedNode.details.enzymeRole}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="font-bold text-sky-300 block">Molecular Action:</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {selectedNode.details.molecularMechanism}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="font-bold text-rose-300 block">Resistance / Clinical Risk:</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {selectedNode.details.resistanceRisk}
                </p>
              </div>
            </div>

            {/* Board Examination Pearl Callout */}
            <div className="p-3.5 rounded-xl bg-teal-950/40 border border-teal-800/60 text-xs text-teal-200 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <strong>Board Examination Rubric (Slide 19–20):</strong>{' '}
                <span>{selectedNode.details.boardPearl}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: 3D MOLECULAR CHAIN TERMINATION & POLYMERASE REPLICATION FORK */}
      {viewTab === '3d-termination' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 3D Canvas Mount (7 cols) */}
          <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-slate-850 pb-2">
              <div className="flex items-center gap-2">
                <Dna className="w-4 h-4 text-rose-400" />
                <span className="font-bold text-white">3D Viral DNA Polymerase (UL30) Active Pocket</span>
              </div>
              <span className="text-[10px] font-mono text-rose-300 font-bold">
                {simulationMode === 'wild-type-acv' ? 'Acyclovir Incorporated (Terminated)' : simulationMode === 'foscarnet-bypass' ? 'Foscarnet Pocket Wedge' : 'Replication Active'}
              </span>
            </div>

            <div
              ref={mountRef}
              className="w-full rounded-xl overflow-hidden cursor-grab active:cursor-grabbing border border-slate-800"
              style={{ height: '380px' }}
            />

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Drag to orbit 3D polymerase complex · Scroll to zoom</span>
              <span className="text-teal-400 font-mono font-bold">Cyan = Template · Magenta = Terminated Daughter</span>
            </div>
          </div>

          {/* 3D Mechanics Explanatory Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs leading-relaxed">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Obligate Chain Termination Mechanism (Slide 19)</span>
              </h4>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 font-mono text-[11px]">
                <div className="text-emerald-400">Natural dGTP: Guanine + Deoxyribose (Has 3'-OH)</div>
                <div className="text-rose-400">Acyclovir: Guanine + Acyclic Aliphatic Chain (NO 3'-OH!)</div>
              </div>

              <p className="text-slate-300 text-xs leading-relaxed">
                During viral DNA replication, viral DNA polymerase (UL30) mistake-incorporates ACV-TP. Because the acyclic ether moiety lacks a 3'-hydroxyl group, no incoming deoxynucleoside triphosphate can form a 3',5'-phosphodiester bond.
              </p>

              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200 text-xs">
                <strong>Suicide Enzyme Inactivation:</strong> Once acyclovir is incorporated, the viral DNA polymerase becomes irreversibly trapped on the terminated template strand, permanently inactivating the enzyme!
              </div>
            </div>

            {/* Foscarnet Direct Rescue Box */}
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/50 space-y-2 text-xs">
              <span className="font-bold text-amber-300 block">Foscarnet Direct Binding (Slide 20):</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Foscarnet is a simple pyrophosphate mimetic. It binds directly to the pyrophosphate-exchange pocket of viral DNA polymerase, halting pyrophosphate release and completely bypassing viral thymidine kinase.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: CLINICAL CALCULATOR & PHARMACOKINETICS */}
      {viewTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Pediatric Dosing Calculator (6 cols) */}
          <div className="lg:col-span-6 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-850 pb-2">
              <span className="font-bold text-white text-sm">Pediatric Primary Gingivostomatitis Dosing (Slide 18)</span>
              <span className="text-[10px] font-mono text-teal-400 font-bold">15 mg/kg per dose</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-semibold">Child Weight (kg):</span>
                <span className="font-mono text-teal-400 font-bold text-sm">{patientWeightKg} kg</span>
              </div>
              <input
                type="range"
                min="8"
                max="45"
                value={patientWeightKg}
                onChange={(e) => setPatientWeightKg(parseInt(e.target.value))}
                className="w-full accent-teal-500 cursor-pointer"
              />
            </div>

            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Single Dose (15 mg/kg):</span>
                <span className="font-bold text-teal-300">{singleDoseMg} mg PO</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Oral Suspension (200 mg / 5 mL):</span>
                <span className="font-bold text-teal-300">{liquidDoseMl.toFixed(1)} mL per dose</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Frequency:</span>
                <span className="text-teal-300">5 times daily (q4h while awake) x 7 days</span>
              </div>
              <div className="flex justify-between text-slate-400 pt-1.5 border-t border-slate-800">
                <span>Total Daily Dose:</span>
                <span className="font-bold text-white">{totalDailyDoseMg} mg / day</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-teal-950/40 border border-teal-800 text-[11px] text-teal-200">
              💡 <strong>Board Protocol:</strong> Initiate within 72 hours of fever/blister onset for maximum efficacy. Provide adequate oral hydration to prevent dehydration in pediatrics!
            </div>
          </div>

          {/* Bioavailability & Renal Safety (6 cols) */}
          <div className="lg:col-span-6 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
            <span className="font-bold text-white text-sm block border-b border-slate-850 pb-2">
              Valacyclovir vs Acyclovir Pharmacokinetics (Slide 18)
            </span>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Oral Acyclovir Bioavailability:</span>
                  <span className="font-mono text-slate-300">~15–20%</span>
                </div>
                <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div className="w-[18%] h-full bg-slate-500 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-teal-300 font-bold">Valacyclovir Prodrug Bioavailability:</span>
                  <span className="font-mono text-teal-300 font-bold">~55–70% (3 to 5-fold higher!)</span>
                </div>
                <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div className="w-[65%] h-full bg-teal-400 rounded-full" />
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">
              Valacyclovir is the L-valyl ester prodrug. It utilizes intestinal peptide transporters (PEPT1), resulting in serum levels equivalent to intravenous acyclovir, allowing convenient 1g BID dosing for Herpes Zoster.
            </p>

            {/* Renal Crystal Nephropathy Warning */}
            <div className="p-3.5 bg-rose-950/40 border border-rose-800/60 rounded-xl space-y-1.5">
              <span className="font-bold text-rose-300 flex items-center gap-1.5 text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Renal Safety Warning (Slide 18):</span>
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Intravenous acyclovir can crystallize in renal collecting ducts, causing acute crystalline nephropathy. Always ensure aggressive IV hydration before and during infusion!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
