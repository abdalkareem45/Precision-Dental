import React, { useState, useEffect, useRef } from 'react';
import { HsvVirion3D, HsvComponentLayer, VirusKey, HighlightFocusMode, VIRUS_SPECS } from '../3d/HsvVirion3D';
import { OralLesion3D, ClinicalPresentationType } from '../3d/OralLesion3D';
import { AntiviralNodeGraph } from './AntiviralNodeGraph';
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
  Flame,
  Sun,
  ShieldAlert,
  Microscope,
  Stethoscope,
  Info,
  Play,
  Pause,
  Eye,
  ChevronRight,
  Smile,
  Thermometer,
  HeartPulse,
  Target,
  Compass
} from 'lucide-react';

export const HsvInteractiveSuite: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'slide6-phylogeny' | 'latency' | 'clinical' | 'pharma'>('slide6-phylogeny');

  // Slide 6 3D Interactive Specimen Gallery and Biological Profile state
  const [selectedLayer, setSelectedLayer] = useState<HsvComponentLayer>('all');
  const [selectedFamilySub, setSelectedFamilySub] = useState<'alpha' | 'beta' | 'gamma'>('alpha');
  const [selectedVirusBio, setSelectedVirusBio] = useState<VirusKey>('hsv1');
  const [isVirionExpanded, setIsVirionExpanded] = useState<boolean>(true);
  const [highlightFocus, setHighlightFocus] = useState<HighlightFocusMode>('none');
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'alpha' | 'beta' | 'gamma'>('all');

  // Sensory Ganglion Latency & Reactivation Simulator state
  const [trigger, setTrigger] = useState<'none' | 'scaling' | 'uv' | 'fever' | 'stress' | 'menses'>('scaling');
  const [simStep, setSimStep] = useState<number>(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const autoPlayTimerRef = useRef<number | null>(null);

  // Primary vs Recurrent Clinical 3D Comparator state
  const [clinical3DMode, setClinical3DMode] = useState<ClinicalPresentationType>('primary');
  const [selectedTissueFilter, setSelectedTissueFilter] = useState<'all' | 'keratinized' | 'non-keratinized'>('all');

  // Auto-play loop for Latency Simulator
  useEffect(() => {
    if (activeSubTab !== 'latency' || !isAutoPlaying) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    autoPlayTimerRef.current = window.setInterval(() => {
      setSimStep((prev) => (prev >= 5 ? 1 : prev + 1));
    }, 2800);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [activeSubTab, isAutoPlaying, trigger]);

  // Handle manual trigger selection with immediate visual update
  const handleTriggerSelect = (newTrigger: typeof trigger) => {
    setTrigger(newTrigger);
    if (newTrigger === 'none') {
      setSimStep(0);
      setIsAutoPlaying(false);
    } else {
      setSimStep(1);
      setIsAutoPlaying(true);
    }
  };

  // Herpesviridae Biological Catalog
  const HERPESVIRIDAE_CATALOG: Record<VirusKey, {
    name: string;
    subfamily: 'alpha' | 'beta' | 'gamma';
    subfamilyFull: string;
    genome: string;
    tegument: string;
    capsid: string;
    envelope: string;
    latency: string;
    replicationSpeed: string;
    cytopathology: string;
    oralLesions: string;
    colorHex: string;
  }> = {
    hsv1: {
      name: 'Herpes Simplex Virus 1 (HSV-1)',
      subfamily: 'alpha',
      subfamilyFull: 'Alphaherpesvirinae',
      genome: 'dsDNA ~152 kb (Linear duplex)',
      tegument: 'VP16 (transactivator), VHS (virion host shutoff protein)',
      capsid: 'T=16 Icosahedral, 162 capsomers (~125 nm)',
      envelope: 'Enveloped (~200 nm), Spikes gB, gC, gD, gH, gL',
      latency: 'Trigeminal Sensory Ganglion & Lip Epithelial Reservoir',
      replicationSpeed: 'Rapid (<18 hours replication cycle)',
      cytopathology: 'Lytic epithelial destruction, ballooning degeneration, Tzanck giant cells',
      oralLesions: 'Primary Gingivostomatitis, Recurrent Herpes Labialis, RIH (hard palate)',
      colorHex: '#f43f5e',
    },
    hsv2: {
      name: 'Herpes Simplex Virus 2 (HSV-2)',
      subfamily: 'alpha',
      subfamilyFull: 'Alphaherpesvirinae',
      genome: 'dsDNA ~154 kb (Linear duplex)',
      tegument: 'VP16, VHS homologous factors',
      capsid: 'T=16 Icosahedral, 162 capsomers (~125 nm)',
      envelope: 'Enveloped (~200 nm), Spikes gB, gD, gG-2 specific',
      latency: 'Sacral Sensory Ganglia (S2–S4) & Sensory ganglia',
      replicationSpeed: 'Rapid cycle (<18 hours)',
      cytopathology: 'Lytic syncytia formation',
      oralLesions: 'Genital Herpes, occasional primary oral-pharyngeal ulcerations',
      colorHex: '#fb7185',
    },
    vzv: {
      name: 'Varicella-Zoster Virus (VZV / HHV-3)',
      subfamily: 'alpha',
      subfamilyFull: 'Alphaherpesvirinae',
      genome: 'dsDNA ~125 kb (Smallest Alpha)',
      tegument: 'IE62 major tegument transactivator',
      capsid: 'T=16 Icosahedral, 162 capsomers',
      envelope: 'Enveloped (~180–200 nm), gE/gI glycoprotein complex',
      latency: 'Dorsal Root Ganglia & Cranial Nerve Ganglia (Trigeminal V1/V2/V3)',
      replicationSpeed: 'Moderate-Rapid; highly cell-associated',
      cytopathology: 'Intraepithelial acantholysis, vesicular fluid blisters',
      oralLesions: 'Chickenpox, Herpes Zoster (Unilateral hard palate V2 midline cutoff)',
      colorHex: '#f59e0b',
    },
    cmv: {
      name: 'Cytomegalovirus (HHV-5)',
      subfamily: 'beta',
      subfamilyFull: 'Betaherpesvirinae',
      genome: 'dsDNA ~235 kb (Largest human herpesvirus genome)',
      tegument: 'Dense pp65 and pp71 phosphoproteins',
      capsid: 'Icosahedral capsid (~130 nm)',
      envelope: 'Enveloped (~230 nm), gB, gH, gL, UL128-131 pentamer',
      latency: 'Endothelial Cells, Mononuclear Leukocytes, CD34+ bone marrow cells',
      replicationSpeed: 'Slow replication cycle (>48 hours)',
      cytopathology: 'Cytomegaly with prominent basophilic "Owl-Eye" intranuclear inclusions',
      oralLesions: 'Single persistent deep painful ulcer in AIDS / HSCT transplant recipients',
      colorHex: '#0ea5e9',
    },
    hhv6: {
      name: 'Human Herpesvirus 6 (HHV-6)',
      subfamily: 'beta',
      subfamilyFull: 'Betaherpesvirinae',
      genome: 'dsDNA ~160 kb',
      tegument: 'Structural protein complex',
      capsid: 'Icosahedral capsid (~100 nm)',
      envelope: 'Enveloped membrane with gB/gH/gL/gQ',
      latency: 'T-lymphocytes, Monocytes, Salivary Glandular Epithelium',
      replicationSpeed: 'Slow replication cycle',
      cytopathology: 'Infects and lyses CD4+ T-lymphocytes',
      oralLesions: 'Roseola Infantum; Implicated in 60% of Bell Palsy Cases (Slide 9)',
      colorHex: '#8b5cf6',
    },
    ebv: {
      name: 'Epstein-Barr Virus (HHV-4)',
      subfamily: 'gamma',
      subfamilyFull: 'Gammaherpesvirinae',
      genome: 'dsDNA ~172 kb',
      tegument: 'EBNA-1, LMP-1, LMP-2 latent membrane proteins',
      capsid: 'T=16 Icosahedral, 162 capsomers',
      envelope: 'Enveloped (~120–180 nm), gp350/220 docks CD21',
      latency: 'Resting Memory B-Lymphocytes (Lifelong episomal state)',
      replicationSpeed: 'Latent/Transforming; intermittent lytic cycle',
      cytopathology: 'B-cell immortalization, lymphoproliferative transformation',
      oralLesions: 'Infectious Mononucleosis, Oral Hairy Leukoplakia (lateral tongue), Burkitt Lymphoma',
      colorHex: '#10b981',
    },
  };

  const currentBio = HERPESVIRIDAE_CATALOG[selectedVirusBio];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Sub-navigation Menu for HSV */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          <h3 className="text-base font-bold text-white tracking-tight">
            Herpes Simplex Virus (HSV-1 & HSV-2) Clinical Workbench
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800">
            Lecture 1 · Slides 6–20
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          {[
            { id: 'slide6-phylogeny' as const, label: 'Slide 6: 3D Virion & Biological Profile' },
            { id: 'latency' as const, label: 'Latency & Trigger Simulator' },
            { id: 'clinical' as const, label: '3D Primary vs RIH Oral Map' },
            { id: 'pharma' as const, label: 'Interactive TK Action & Rx' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeSubTab === tab.id
                  ? 'bg-rose-600 text-white shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW 1: LECTURE 1 SLIDE 6 HSV-1 3D SPECIMEN GALLERY & INTERACTIVE BIOLOGICAL PROFILE */}
      {activeSubTab === 'slide6-phylogeny' && (
        <div className="space-y-6">
          {/* 3D Specimen Gallery Header & Quick Virus Filter Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-[11px] font-mono text-rose-400 font-bold uppercase tracking-wider">
                    Lecture 1 · Slide 6 Specimen Gallery
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight mt-0.5 flex items-center gap-2">
                  <span>3D Herpesviridae Virion Specimen Gallery</span>
                  <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800">
                    6 Interactive Models
                  </span>
                </h3>
              </div>

              {/* Subfamily Filter Chips */}
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
                {[
                  { id: 'all' as const, label: 'All Viruses (6)' },
                  { id: 'alpha' as const, label: 'Alpha (α) Neurotropic (3)' },
                  { id: 'beta' as const, label: 'Beta (β) Cytomegalic (2)' },
                  { id: 'gamma' as const, label: 'Gamma (γ) Lymphotropic (1)' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setGalleryFilter(f.id)}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                      galleryFilter === f.id
                        ? 'bg-rose-600 text-white shadow-sm font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Specimen Gallery Cards Carousel / Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {((Object.keys(HERPESVIRIDAE_CATALOG) as VirusKey[]).filter((k) =>
                galleryFilter === 'all' ? true : HERPESVIRIDAE_CATALOG[k].subfamily === galleryFilter
              )).map((vKey) => {
                const spec = VIRUS_SPECS[vKey];
                const bio = HERPESVIRIDAE_CATALOG[vKey];
                const isSelected = selectedVirusBio === vKey;

                return (
                  <div
                    key={vKey}
                    onClick={() => {
                      setSelectedVirusBio(vKey);
                      setSelectedFamilySub(bio.subfamily);
                      setIsVirionExpanded(true); // Triggers animated structure expansion
                    }}
                    className={`relative p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group ${
                      isSelected
                        ? 'bg-slate-800/90 border-rose-500 shadow-lg shadow-rose-950/40 ring-2 ring-rose-500/50 scale-[1.02]'
                        : 'bg-slate-950/90 border-slate-850 hover:border-slate-700 hover:bg-slate-900/90'
                    }`}
                  >
                    {/* Active Pulsing Indicator Badge */}
                    {isSelected && (
                      <span className="absolute -top-2 -right-1 px-1.5 py-0.5 rounded-full bg-rose-500 text-slate-950 text-[9px] font-mono font-extrabold uppercase shadow-sm animate-pulse">
                        Active 3D
                      </span>
                    )}

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: spec.accentColor }}
                        />
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">
                          {spec.subfamily.toUpperCase()}
                        </span>
                      </div>

                      <div className="font-bold text-white text-xs tracking-tight group-hover:text-rose-300 transition-colors">
                        {vKey.toUpperCase()}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {spec.name.split('(')[0].trim()}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-850 space-y-1 text-[10px] font-mono">
                      <div className="text-emerald-400 font-bold truncate">
                        {spec.genomeSize}
                      </div>
                      <div className="text-sky-300 truncate text-[9px]">
                        {spec.latencyTarget.split('&')[0].trim()}
                      </div>
                      <div className="text-[9px] text-rose-400 font-sans font-medium flex items-center gap-1 pt-0.5">
                        <Layers className="w-2.5 h-2.5" />
                        <span>Click to Expand</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main 3D Canvas Stage & Interactive HUD Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 3D Virion Stage (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <HsvVirion3D
                selectedLayer={selectedLayer}
                selectedVirus={selectedVirusBio}
                onSelectLayer={(l) => setSelectedLayer(l)}
                onSelectVirus={(v) => {
                  setSelectedVirusBio(v);
                  setSelectedFamilySub(HERPESVIRIDAE_CATALOG[v].subfamily);
                  setIsVirionExpanded(true);
                }}
                isExpanded={isVirionExpanded}
                onToggleExpand={() => setIsVirionExpanded(!isVirionExpanded)}
                highlightFocus={highlightFocus}
                onSelectHighlightFocus={(hf) => setHighlightFocus(hf)}
                height={420}
              />

              {/* 3D Expansion & Highlight Control Deck */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-850 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-rose-400 animate-spin-slow" />
                    <span className="text-xs font-bold text-white">3D Dynamic Exploration Actions:</span>
                  </div>
                  <span className="text-[10px] font-mono text-rose-300 font-bold">
                    Active Specimen: {currentBio.name}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {/* Trigger Expansion Button */}
                  <button
                    onClick={() => setIsVirionExpanded(!isVirionExpanded)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      isVirionExpanded
                        ? 'bg-rose-950 text-rose-200 border-rose-500 shadow-md ring-1 ring-rose-500/50'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white hover:bg-slate-850'
                    }`}
                  >
                    <Layers className="w-4 h-4 text-rose-400" />
                    <span>{isVirionExpanded ? '💥 Structure Exploded (Active)' : '🚀 Animate 3D Expansion'}</span>
                  </button>

                  {/* Highlight Genomic Trait */}
                  <button
                    onClick={() => setHighlightFocus(highlightFocus === 'genomic' ? 'none' : 'genomic')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      highlightFocus === 'genomic'
                        ? 'bg-emerald-950 text-emerald-200 border-emerald-500 shadow-md ring-1 ring-emerald-500/50'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white hover:bg-slate-850'
                    }`}
                  >
                    <Dna className="w-4 h-4 text-emerald-400" />
                    <span>{highlightFocus === 'genomic' ? '🧬 Genomic Trait (Glowing)' : '🧬 Highlight Genomic Trait'}</span>
                  </button>

                  {/* Highlight Latency Site */}
                  <button
                    onClick={() => setHighlightFocus(highlightFocus === 'latency' ? 'none' : 'latency')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      highlightFocus === 'latency'
                        ? 'bg-sky-950 text-sky-200 border-sky-500 shadow-md ring-1 ring-sky-500/50'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white hover:bg-slate-850'
                    }`}
                  >
                    <Compass className="w-4 h-4 text-sky-400" />
                    <span>{highlightFocus === 'latency' ? '🎯 Latency Beacon (Active)' : '🎯 Highlight Latency Site'}</span>
                  </button>
                </div>

                {/* Virion Micro-Architecture Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center text-[11px] font-mono">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-emerald-400 font-bold">{currentBio.genome}</div>
                    <div className="text-[10px] text-slate-400">Genome Core</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-cyan-400 font-bold">{currentBio.capsid}</div>
                    <div className="text-[10px] text-slate-400">Capsid Shell</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-purple-400 font-bold">{currentBio.tegument}</div>
                    <div className="text-[10px] text-slate-400">Tegument Layer</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-rose-400 font-bold">{currentBio.envelope}</div>
                    <div className="text-[10px] text-slate-400">Envelope Membrane</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Taxonomy, Biological Traits, & Active Specimen Profile (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Dna className="w-4 h-4 text-rose-400" />
                    <span>HSV Biological Profile & Phylogeny (Slide 6)</span>
                  </h4>
                  <span className="text-[10px] font-mono text-teal-400 font-bold">Interactive 3D Switch</span>
                </div>

                {/* Subfamily Selector Tabs */}
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  {[
                    { id: 'alpha' as const, label: 'Alpha (α)', full: 'Alphaherpesvirinae' },
                    { id: 'beta' as const, label: 'Beta (β)', full: 'Betaherpesvirinae' },
                    { id: 'gamma' as const, label: 'Gamma (γ)', full: 'Gammaherpesvirinae' },
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setSelectedFamilySub(sub.id);
                        if (sub.id === 'alpha') {
                          setSelectedVirusBio('hsv1');
                          setIsVirionExpanded(true);
                        }
                        if (sub.id === 'beta') {
                          setSelectedVirusBio('cmv');
                          setIsVirionExpanded(true);
                        }
                        if (sub.id === 'gamma') {
                          setSelectedVirusBio('ebv');
                          setIsVirionExpanded(true);
                        }
                      }}
                      className={`p-2.5 rounded-xl text-center border font-bold transition-all ${
                        selectedFamilySub === sub.id
                          ? 'bg-rose-950 border-rose-500 text-rose-200 shadow-md ring-1 ring-rose-500/50'
                          : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div>{sub.label}</div>
                      <div className="text-[9px] font-mono text-slate-500 font-normal truncate">{sub.full}</div>
                    </button>
                  ))}
                </div>

                {/* Subfamily Biological Traits Card */}
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-850 space-y-2 text-xs">
                  {selectedFamilySub === 'alpha' && (
                    <div className="space-y-1.5">
                      <span className="font-bold text-rose-300 uppercase text-[11px] block">
                        ⚡ Alphaherpesvirinae Key Biological Traits:
                      </span>
                      <p className="text-slate-300 leading-relaxed text-xs">
                        Rapid replication cycle (&lt;18 hrs), prompt destruction of infected epithelial cells (lytic vesicles and ulcers), and lifelong <strong>latency established in sensory ganglia</strong> (Trigeminal and Dorsal Root Ganglia).
                      </p>
                      <div className="text-[11px] font-mono text-teal-400 pt-1">
                        Includes: HSV-1, HSV-2, VZV (Chickenpox / Shingles).
                      </div>
                    </div>
                  )}

                  {selectedFamilySub === 'beta' && (
                    <div className="space-y-1.5">
                      <span className="font-bold text-sky-300 uppercase text-[11px] block">
                        🔬 Betaherpesvirinae Key Biological Traits:
                      </span>
                      <p className="text-slate-300 leading-relaxed text-xs">
                        Slow replication cycle (&gt;48 hrs), cytomegaly (enlarged infected cells with "owl-eye" inclusions), and latency in secretory glands, kidneys, endothelium, and mononuclear leukocytes.
                      </p>
                      <div className="text-[11px] font-mono text-teal-400 pt-1">
                        Includes: CMV (HHV-5), HHV-6 (Roseolovirus · 60% Bell palsy), HHV-7.
                      </div>
                    </div>
                  )}

                  {selectedFamilySub === 'gamma' && (
                    <div className="space-y-1.5">
                      <span className="font-bold text-emerald-300 uppercase text-[11px] block">
                        🧬 Gammaherpesvirinae Key Biological Traits:
                      </span>
                      <p className="text-slate-300 leading-relaxed text-xs">
                        Replicates in B or T-lymphocytes with profound potential for oncogenic transformation and lymphoblastoid cell immortalization.
                      </p>
                      <div className="text-[11px] font-mono text-teal-400 pt-1">
                        Includes: EBV (HHV-4 · Hairy Leukoplakia) & KSHV (HHV-8 · Kaposi Sarcoma).
                      </div>
                    </div>
                  )}
                </div>

                {/* Virus Selector Buttons (Instant 3D Update & Expansion) */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-slate-400 font-semibold">
                    Select Specific Virus to Inspect:
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                    {(Object.keys(HERPESVIRIDAE_CATALOG) as VirusKey[]).map((vKey) => (
                      <button
                        key={vKey}
                        onClick={() => {
                          setSelectedVirusBio(vKey);
                          setSelectedFamilySub(HERPESVIRIDAE_CATALOG[vKey].subfamily);
                          setIsVirionExpanded(true); // Triggers 3D structure expansion bloom
                        }}
                        className={`p-2 rounded-xl text-xs font-bold border transition-all text-center ${
                          selectedVirusBio === vKey
                            ? 'bg-rose-950 text-white border-rose-500 shadow-md ring-2 ring-rose-500/50 scale-105'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {vKey.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Virus Detailed Biological Spec Sheet */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-850 pb-1.5">
                    <span className="font-bold text-white text-xs">{currentBio.name}</span>
                    <span className="text-[10px] font-mono text-rose-400 font-bold">{currentBio.genome}</span>
                  </div>
                  <div className="space-y-1.5 text-slate-300 text-xs">
                    <div><strong>Latency Reservoir:</strong> <span className="text-teal-300">{currentBio.latency}</span></div>
                    <div><strong>Replication Speed:</strong> <span className="text-amber-300">{currentBio.replicationSpeed}</span></div>
                    <div><strong>Oral Pathology:</strong> <span className="text-rose-300">{currentBio.oralLesions}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Deep Interactive Specimen Highlights: Genomic Traits & Latency Sites */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Deep Highlight Card 1: Specific Genomic Traits */}
            <div className={`p-5 rounded-2xl border transition-all shadow-xl space-y-4 ${
              highlightFocus === 'genomic'
                ? 'bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/40'
                : 'bg-slate-900/90 border-slate-800'
            }`}>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <Dna className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Specific Genomic Architecture</h4>
                    <span className="text-[10px] font-mono text-emerald-400">Class I Double-Stranded DNA (dsDNA)</span>
                  </div>
                </div>
                <button
                  onClick={() => setHighlightFocus(highlightFocus === 'genomic' ? 'none' : 'genomic')}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700 hover:bg-emerald-900 transition-colors"
                >
                  {highlightFocus === 'genomic' ? 'Highlighting in 3D ✓' : 'Focus 3D Genome'}
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 space-y-1">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="font-semibold">Genome Size & Duplex:</span>
                    <span className="font-mono text-emerald-400 font-bold">{VIRUS_SPECS[selectedVirusBio].genomeSize}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {VIRUS_SPECS[selectedVirusBio].genomeType}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
                    Key Diagnostic & Pharmacological Genes:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {VIRUS_SPECS[selectedVirusBio].keyGenes.map((gene, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-lg bg-slate-950 border border-slate-850 text-[11px] font-mono text-slate-300 flex items-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>{gene}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-[11px] text-emerald-200 leading-relaxed">
                  <strong>Clinical Board Rule:</strong> Viral Thymidine Kinase (TK) monophosphorylates Acyclovir and Valacyclovir. Viral mutations in the TK gene cause absolute resistance, mandating second-line pyrophosphate analog Foscarnet or Cidofovir!
                </div>
              </div>
            </div>

            {/* Deep Highlight Card 2: Specific Latency Sites & Neuro-Anatomy */}
            <div className={`p-5 rounded-2xl border transition-all shadow-xl space-y-4 ${
              highlightFocus === 'latency'
                ? 'bg-slate-900 border-sky-500 ring-2 ring-sky-500/40'
                : 'bg-slate-900/90 border-slate-800'
            }`}>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-sky-400" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Specific Latency Sites & Reservoir</h4>
                    <span className="text-[10px] font-mono text-sky-400">Lifelong Quiescent Persistence</span>
                  </div>
                </div>
                <button
                  onClick={() => setHighlightFocus(highlightFocus === 'latency' ? 'none' : 'latency')}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-sky-950 text-sky-300 border border-sky-700 hover:bg-sky-900 transition-colors"
                >
                  {highlightFocus === 'latency' ? 'Highlighting in 3D ✓' : 'Focus 3D Beacon'}
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 space-y-1">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="font-semibold">Primary Anatomical Site:</span>
                    <span className="font-mono text-sky-300 font-bold truncate max-w-[200px]">
                      {VIRUS_SPECS[selectedVirusBio].latencyTarget}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {VIRUS_SPECS[selectedVirusBio].latencyDetails}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 space-y-1">
                  <span className="font-semibold text-slate-300">Oral Clinical Presentation:</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {VIRUS_SPECS[selectedVirusBio].clinicalPresentation}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-sky-950/40 border border-sky-800/60 text-[11px] text-sky-200 leading-relaxed">
                  <strong>Dental Board Distinction:</strong> In immunocompetent hosts, Recurrent Intraoral Herpes (RIH) is strictly confined to <em>keratinized mucosa bound to bone</em> (hard palate & attached gingiva). Any recurrence on movable mucosa is Aphthous Stomatitis, NOT herpes!
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: FULLY INTERACTIVE SENSORY GANGLION LATENCY & REACTIVATION SIMULATOR */}
      {activeSubTab === 'latency' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-[11px] font-mono text-rose-400 font-bold uppercase">
                  Slide 7 & 13 · Interactive Neuro-Axonal Latency & Trigger Simulator
                </span>
              </div>
              <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
                Sensory Ganglion Latency, Dental Scaling Trauma & Reactivation Cascade
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                  isAutoPlaying
                    ? 'bg-rose-500 text-slate-950 border-rose-400 shadow-md'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white'
                }`}
              >
                {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isAutoPlaying ? 'Auto-Cycle: ON' : 'Auto-Cycle: OFF'}</span>
              </button>
            </div>
          </div>

          {/* Dynamic SVG Animated Circuit representing Trigeminal Axon & Mucosa */}
          <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 relative overflow-hidden flex flex-col items-center justify-center min-h-[290px]">
            {/* Stage Callout HUD */}
            <div className="w-full flex items-center justify-between mb-3 text-xs font-mono">
              <span className="text-slate-400">Axonal State:</span>
              <span className={`px-3 py-1 rounded-lg border font-bold ${
                simStep === 0
                  ? 'bg-slate-900 text-slate-400 border-slate-800'
                  : simStep === 5
                  ? 'bg-rose-950 text-rose-300 border-rose-600 animate-pulse'
                  : 'bg-amber-950 text-amber-300 border-amber-600'
              }`}>
                {simStep === 0 && 'STAGE 0: QUIESCENT GANGLIONIC LATENCY (0% SHEDDING)'}
                {simStep === 1 && `STAGE 1: ${trigger.toUpperCase()} STIMULUS AT ORAL MUCOSA`}
                {simStep === 2 && 'STAGE 2: RETROGRADE AFFERENT NEUROGENIC SIGNALING'}
                {simStep === 3 && 'STAGE 3: TRIGEMINAL GANGLION DEREPRESSION & VIRAL REPLICATION'}
                {simStep === 4 && 'STAGE 4: ANTEROGRADE CENTRIPETAL VIRION MIGRATION'}
                {simStep === 5 && 'STAGE 5: CLUSTERED ERUPTION & 8–10% ASYMPTOMATIC SALIVARY SHEDDING'}
              </span>
            </div>

            <svg viewBox="0 0 680 200" className="w-full max-w-2xl h-48 drop-shadow-2xl">
              {/* Peripheral Mucosal Base */}
              <rect x="20" y="25" width="150" height="150" rx="10" fill="#1e1b4b" stroke="#4338ca" strokeWidth="2.5" />
              <text x="95" y="50" fill="#a5b4fc" fontSize="11" fontWeight="bold" textAnchor="middle">
                Oral Mucosa & Gingiva
              </text>
              <text x="95" y="70" fill="#c7d2fe" fontSize="9" textAnchor="middle">
                (Keratinized Tissue)
              </text>

              {/* SPECIFIC TRIGGER VISUALS */}
              {trigger === 'scaling' && simStep >= 1 && (
                <g className="animate-pulse">
                  <path d="M 40 25 L 75 95 L 65 100 Z" fill="#94a3b8" stroke="#f1f5f9" strokeWidth="1.5" />
                  <circle cx="75" cy="98" r="9" fill="#f43f5e" opacity="0.6" className="animate-ping" />
                  <text x="95" y="118" fill="#fca5a5" fontSize="8" fontWeight="bold" textAnchor="middle">
                    Ultrasonic Scaler Trauma!
                  </text>
                </g>
              )}

              {trigger === 'uv' && simStep >= 1 && (
                <g>
                  <circle cx="95" cy="15" r="9" fill="#eab308" className="animate-pulse" />
                  <line x1="95" y1="24" x2="95" y2="90" stroke="#facc15" strokeWidth="3" strokeDasharray="4 2" />
                  <line x1="75" y1="24" x2="85" y2="85" stroke="#facc15" strokeWidth="2" strokeDasharray="4 2" />
                  <line x1="115" y1="24" x2="105" y2="85" stroke="#facc15" strokeWidth="2" strokeDasharray="4 2" />
                  <text x="95" y="115" fill="#fef08a" fontSize="8" fontWeight="bold" textAnchor="middle">
                    Actinic UV Photon Flood!
                  </text>
                </g>
              )}

              {trigger === 'fever' && simStep >= 1 && (
                <g>
                  <circle cx="95" cy="95" r="22" fill="#ef4444" fillOpacity="0.3" className="animate-ping" />
                  <text x="95" y="98" fill="#fca5a5" fontSize="16" textAnchor="middle">🔥</text>
                  <text x="95" y="125" fill="#fca5a5" fontSize="8" fontWeight="bold" textAnchor="middle">
                    Pyrexia / Thermal Flare!
                  </text>
                </g>
              )}

              {trigger === 'stress' && simStep >= 1 && (
                <g>
                  <path d="M 85 80 L 105 80 L 90 98 L 105 98 L 85 115 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="1" className="animate-bounce" />
                  <text x="95" y="130" fill="#fef08a" fontSize="8" fontWeight="bold" textAnchor="middle">
                    Cortisol / Epinephrine Wave!
                  </text>
                </g>
              )}

              {trigger === 'menses' && simStep >= 1 && (
                <g>
                  <circle cx="95" cy="95" r="14" fill="#be123c" fillOpacity="0.5" className="animate-pulse" />
                  <text x="95" y="125" fill="#fda4af" fontSize="8" fontWeight="bold" textAnchor="middle">
                    Hormonal Surge!
                  </text>
                </g>
              )}

              {trigger === 'none' && (
                <g>
                  <circle cx="95" cy="95" r="12" fill="#047857" fillOpacity="0.4" />
                  <text x="95" y="100" fill="#6ee7b7" fontSize="11" textAnchor="middle">🛡️</text>
                  <text x="95" y="125" fill="#a7f3d0" fontSize="8" fontWeight="bold" textAnchor="middle">
                    Quiescent Mucosa
                  </text>
                </g>
              )}

              {/* Erupted Recrudescent Ulcers at Step 5 */}
              {simStep === 5 && (
                <g>
                  <circle cx="115" cy="95" r="5" fill="#ef4444" stroke="#fecdd3" strokeWidth="1.5" className="animate-ping" />
                  <circle cx="130" cy="110" r="4" fill="#ef4444" stroke="#fecdd3" strokeWidth="1.5" className="animate-ping" />
                  <circle cx="105" cy="115" r="4.5" fill="#ef4444" stroke="#fecdd3" strokeWidth="1.5" className="animate-ping" />
                  <text x="95" y="155" fill="#f87171" fontSize="9" fontWeight="bold" textAnchor="middle">
                    Clustered Ulcers Erupted!
                  </text>
                </g>
              )}

              {/* Trigeminal Nerve Axon Cable */}
              <path
                d="M 170 95 C 300 45, 380 45, 510 95"
                stroke={
                  simStep === 0
                    ? '#334155'
                    : simStep >= 4
                    ? '#f43f5e'
                    : simStep >= 2
                    ? '#f59e0b'
                    : '#38bdf8'
                }
                strokeWidth={simStep > 0 ? 6 : 3}
                fill="none"
                strokeDasharray={simStep > 0 ? '6 4' : 'none'}
                className="transition-all duration-300"
              />

              <text x="340" y="52" fill={simStep >= 4 ? '#fda4af' : simStep >= 2 ? '#fef08a' : '#94a3b8'} fontSize="10" fontFamily="monospace" textAnchor="middle">
                {simStep === 0 && 'Trigeminal Sensory Axon: Silent Latency'}
                {simStep === 1 && 'Peripheral Signal Generated'}
                {simStep === 2 && '⟵ Afferent Neurogenic Retrograde Signal ⟵'}
                {simStep === 3 && 'Viral Derepression Inside Sensory Neuron'}
                {simStep === 4 && '➔ Anterograde Microtubule Virion Transport ➔'}
                {simStep === 5 && '➔ Continuous Centripetal Salivary Shedding ➔'}
              </text>

              {/* Trigeminal Ganglion */}
              <circle
                cx="560"
                cy="95"
                r="45"
                fill={simStep === 0 ? '#1e293b' : simStep >= 3 ? '#881337' : '#312e81'}
                stroke={simStep === 0 ? '#475569' : simStep >= 3 ? '#f43f5e' : '#6366f1'}
                strokeWidth={simStep >= 3 ? 4 : 2}
                className="transition-colors duration-500"
              />
              <text x="560" y="88" fill="#fecdd3" fontSize="11" fontWeight="bold" textAnchor="middle">
                Trigeminal
              </text>
              <text x="560" y="103" fill="#fecdd3" fontSize="11" fontWeight="bold" textAnchor="middle">
                Ganglion
              </text>
              <text x="560" y="120" fill={simStep >= 3 ? '#fda4af' : '#94a3b8'} fontSize="8" fontFamily="monospace" textAnchor="middle">
                {simStep === 0 ? 'LAT DORMANT' : simStep >= 3 ? 'REPLICATING' : 'EXCITED'}
              </text>

              {/* Migrating Virions */}
              {(simStep === 4 || simStep === 5) && (
                <g>
                  <circle cx="470" cy="80" r="5" fill="#f43f5e" className="animate-ping" />
                  <circle cx="360" cy="65" r="5" fill="#f43f5e" className="animate-ping" />
                  <circle cx="250" cy="80" r="5" fill="#f43f5e" className="animate-ping" />
                </g>
              )}
            </svg>

            {/* Slide 13 Clinical Landmark Callout Banner */}
            {simStep === 5 && (
              <div className="mt-4 p-3.5 bg-rose-950/80 rounded-xl border border-rose-500 text-rose-200 text-xs flex flex-wrap items-center justify-between gap-3 w-full max-w-xl shadow-2xl animate-fade-in">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                  <div>
                    <strong className="text-white block">Slide 13 Clinical Landmark:</strong>
                    <span>Asymptomatic viral shedding in saliva occurs in <strong>8–10% of patients following routine dental treatment</strong>!</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-rose-900 text-rose-100 font-bold border border-rose-700 shrink-0">
                  8–10% Salivary Shedding
                </span>
              </div>
            )}
          </div>

          {/* Interactive Trigger Buttons */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">
                Click a Stimulus to Fire the Reactivation Cascade Immediately (Slide 13):
              </span>
              <button
                onClick={() => handleTriggerSelect('none')}
                className="text-xs font-mono text-teal-400 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Quiescent Latency</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {[
                { id: 'scaling' as const, label: 'Dental Scaling', icon: Activity, pearl: '1-2 days post-op pain' },
                { id: 'uv' as const, label: 'UV Sun Exposure', icon: Sun, pearl: 'Lip vermilion trigger' },
                { id: 'fever' as const, label: 'Systemic Fever', icon: Flame, pearl: 'Pyrogenic activation' },
                { id: 'stress' as const, label: 'Emotional Stress', icon: Zap, pearl: 'Cortisol surge' },
                { id: 'menses' as const, label: 'Menstruation', icon: Clock, pearl: 'Hormonal shift' },
                { id: 'none' as const, label: 'Quiescent Latency', icon: Shield, pearl: 'Resting in ganglion' },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = trigger === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTriggerSelect(item.id)}
                    className={`p-3 rounded-xl border text-left transition-all text-xs flex flex-col justify-between ${
                      isSelected
                        ? 'bg-rose-950 border-rose-500 text-white font-bold ring-2 ring-rose-500/50 shadow-lg scale-102'
                        : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <div>
                      <Icon className="w-4 h-4 mb-1.5 text-rose-400" />
                      <span className="font-bold block text-xs">{item.label}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono mt-1">{item.pearl}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: 3D CLINICAL ORAL PRESENTATION: PRIMARY VS RIH VS IMMUNOCOMPROMISED */}
      {activeSubTab === 'clinical' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 3D Interactive Oral Lesion Specimen (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <OralLesion3D
                mode={clinical3DMode}
                onSelectMode={(m) => setClinical3DMode(m)}
                height={390}
              />

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>3D Model shows real-time mucosal predilection:</span>
                </div>
                <span className="text-[10px] font-mono text-teal-400 font-bold">
                  {clinical3DMode === 'primary' && 'Both Keratinized & Non-Keratinized'}
                  {clinical3DMode === 'rih' && 'Strictly Keratinized (Hard Palate & Gingiva)'}
                  {clinical3DMode === 'immunocompromised' && 'Any Mucosal Site (Large Ulcers)'}
                </span>
              </div>
            </div>

            {/* Right Column: Comparative Clinical Cards (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              {/* Card 1: Primary Gingivostomatitis */}
              <div
                onClick={() => setClinical3DMode('primary')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  clinical3DMode === 'primary'
                    ? 'bg-slate-900 border-teal-500 ring-2 ring-teal-500/30 shadow-lg'
                    : 'bg-slate-950/70 border-slate-800 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-bold">
                    Slides 10–12
                  </span>
                  <span className="text-[10px] text-teal-400 font-bold">First Exposure</span>
                </div>
                <h4 className="text-xs font-bold text-white mb-1">1. Primary Herpetic Gingivostomatitis</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  High fever, cervical lymphadenopathy. Ulcers appear on <strong>BOTH Keratinized AND Non-Keratinized</strong> mucosa. Acute marginal erythema and gingivitis.
                </p>
              </div>

              {/* Card 2: RIH */}
              <div
                onClick={() => setClinical3DMode('rih')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  clinical3DMode === 'rih'
                    ? 'bg-slate-900 border-amber-500 ring-2 ring-amber-500/30 shadow-lg'
                    : 'bg-slate-950/70 border-slate-800 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                    Slide 14 · Board Rule
                  </span>
                  <span className="text-[10px] text-amber-400 font-bold">Healthy Host</span>
                </div>
                <h4 className="text-xs font-bold text-white mb-1">2. Recrudescent Intraoral HSV (RIH)</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Reactivation after dental scaling or trauma. <strong>STRICTLY on KERATINIZED MUCOSA</strong> (hard palate, attached gingiva). Tight 1–5 mm clusters.
                </p>
              </div>

              {/* Card 3: Immunocompromised */}
              <div
                onClick={() => setClinical3DMode('immunocompromised')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  clinical3DMode === 'immunocompromised'
                    ? 'bg-slate-900 border-rose-500 ring-2 ring-rose-500/30 shadow-lg'
                    : 'bg-slate-950/70 border-slate-800 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
                    Slide 15 · 70% in HSCT
                  </span>
                  <span className="text-[10px] text-rose-400 font-bold">Transplant / AIDS</span>
                </div>
                <h4 className="text-xs font-bold text-white mb-1">3. HSV in Immunocompromised Host</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Occurs at <strong>ANY oral site</strong> (including non-keratinized!). Deep, ragged ulcers several cm wide with diagnostic <strong>1–2 mm satellite vesicles</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: MOLECULAR ANTIVIRAL ACTION, NODE GRAPH & CLINICAL CALCULATOR (SLIDES 18–20) */}
      {activeSubTab === 'pharma' && (
        <AntiviralNodeGraph />
      )}
    </div>
  );
};
