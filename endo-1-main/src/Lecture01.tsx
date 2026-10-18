import React, { useState, useCallback } from 'react';
import {
  AnatomicalLayer,
  ClinicalCase,
  ClinicalTestType,
  VisualTheme,
  ViewMode,
} from './types/endodontics';
import { DEFAULT_LAYERS, CLINICAL_CASES } from './data/lectureData';
import { ThreeCanvas } from './components/ThreeCanvas';
import { LayerControls } from './components/LayerControls';
import { ClinicalTestStation } from './components/ClinicalTestStation';
import { LectureNotesPanel } from './components/LectureNotesPanel';
import { CaseSimulator } from './components/CaseSimulator';
import { PainDiagnosisExplorer } from './components/PainDiagnosisExplorer';
import { ClinicalExamExplorer } from './components/ClinicalExamExplorer';
import { CrackedToothDetectives } from './components/CrackedToothDetectives';
import { PrecisionDentalLogo } from './components/PrecisionDentalLogo';
import {
  Box,
  Layers,
  HeartPulse,
  BookOpen,
  Stethoscope,
  Sparkles,
  Info,
  ChevronLeft,
  ChevronRight,
  Search,
  Disc,
  Menu,
  X,
  Sliders,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

export default function App() {
  // Navigation View: 3D Explorer | Symptom & Biology Matrix | Clinical Exam | Cracked Tooth Detectives | Clinical Cases | Lecture Notes
  const [activeMainTab, setActiveMainTab] = useState<
    'explorer' | 'symptom_biology' | 'clinical_exam' | 'cracked_tooth' | 'cases' | 'notes'
  >('explorer');

  // Blueprint & Layer State
  const [layers, setLayers] = useState<AnatomicalLayer[]>(DEFAULT_LAYERS);
  const [visualTheme, setVisualTheme] = useState<VisualTheme>('blueprint');
  const [viewMode, setViewMode] = useState<ViewMode>('orbit');
  const [clipOffset, setClipOffset] = useState<number>(0.0);
  const [clipAxis, setClipAxis] = useState<'x' | 'y' | 'z'>('x');
  const [explodedFactor, setExplodedFactor] = useState<number>(0.0);

  // Selected Hotspot
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);

  // Clinical Test Station State
  const [activeTest, setActiveTest] = useState<ClinicalTestType>('cold');
  const [isTestExecuting, setIsTestExecuting] = useState<boolean>(false);

  // Case Simulator State
  const [currentCaseIndex, setCurrentCaseIndex] = useState<number>(0);
  const currentCase = CLINICAL_CASES[currentCaseIndex];
  const [performedCaseTests, setPerformedCaseTests] = useState<Record<string, boolean>>({});

  // UI Panels Toggles (Desktop sidebars)
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );
  const [isRightPanelOpen, setIsRightPanelOpen] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1280 : false
  );
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  // Responsive Mobile & Tablet State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [mobileDrawer, setMobileDrawer] = useState<'none' | 'layers' | 'tests'>('none');

  // Layer toggling
  const handleToggleLayer = useCallback((id: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l))
    );
  }, []);

  const handleChangeOpacity = useCallback((id: string, opacity: number) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, opacity } : l))
    );
  }, []);

  const handleSetPreset = useCallback((preset: 'all' | 'pulp_nerves' | 'bones_pdl' | 'caries_fracture') => {
    setLayers((prev) =>
      prev.map((l) => {
        if (preset === 'all') {
          return {
            ...l,
            visible: true,
            opacity: l.id === 'enamel' ? 0.75 : l.id === 'alveolar_bone' ? 0.65 : 0.95,
          };
        }
        if (preset === 'pulp_nerves') {
          return {
            ...l,
            visible: ['pulp', 'adelta_fibers', 'c_fibers', 'enamel'].includes(l.id),
            opacity: ['pulp', 'adelta_fibers', 'c_fibers'].includes(l.id) ? 1.0 : 0.2,
          };
        }
        if (preset === 'bones_pdl') {
          return {
            ...l,
            visible: ['pdl', 'alveolar_bone', 'dentin'].includes(l.id),
            opacity: 0.9,
          };
        }
        if (preset === 'caries_fracture') {
          return {
            ...l,
            visible: ['sinus_tract', 'gutta_percha_tracer', 'crack_line', 'periapical_lesion', 'enamel', 'pulp'].includes(l.id),
            opacity: 0.95,
          };
        }
        return l;
      })
    );
  }, []);

  // Toggle 3D clinical test execution
  const handleToggleTest = useCallback(() => {
    setIsTestExecuting((prev) => !prev);
  }, []);

  // Run test from within a clinical case
  const handleRunCaseTest = useCallback((test: ClinicalTestType) => {
    setActiveTest(test);
    setPerformedCaseTests((prev) => ({ ...prev, [test]: true }));
    setIsTestExecuting(true);
  }, []);

  // Handle case selection
  const handleSelectCase = useCallback((caseId: string) => {
    const idx = CLINICAL_CASES.findIndex((c) => c.id === caseId);
    if (idx !== -1) {
      setCurrentCaseIndex(idx);
      setPerformedCaseTests({});
    }
  }, []);

  // Jump from Pain Matrix directly into 3D Blueprint with active test
  const handleSimulateIn3D = useCallback((testType: ClinicalTestType) => {
    setActiveTest(testType);
    setIsTestExecuting(true);
    setIsRightPanelOpen(true);
    setActiveMainTab('explorer');
  }, []);

  // Active pathology states driven by current case or manual selection
  const hasSinusTract = currentCase.id === 'case_sinus_mandibular' || currentCase.id === 'case_premolar_gp_tracing';
  const hasApicalLesion =
    currentCase.id === 'case_sinus_mandibular' ||
    currentCase.id === 'case_premolar_gp_tracing' ||
    currentCase.id === 'case_cementoma_pseudolesion';
  const hasCrackLine = currentCase.id === 'case_cracked_tooth';
  const isCementoma = currentCase.id === 'case_cementoma_pseudolesion';

  // Count active layers for badge
  const visibleLayersCount = layers.filter((l) => l.visible).length;

  return (
    <div className="flex flex-col h-full min-h-0 w-full overflow-hidden bg-deep-navy text-ivory-white font-sans select-none">
      {/* Top Application Bar with Precision Dental Luxury Theme */}
      <header className="h-16 border-b border-marble-grey/20 bg-deep-navy px-3 sm:px-4 flex items-center justify-between z-20 shrink-0 shadow-xl">
        {/* Official Precision Dental Brand Logo, Slogans & Lecture 1 Badge */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <PrecisionDentalLogo
            size="md"
            showText={true}
            showArabic={true}
            showTagline={true}
            className="hidden sm:flex"
          />
          {/* Compact logo on tiny mobile screens */}
          <PrecisionDentalLogo
            size="sm"
            showText={true}
            showArabic={true}
            showTagline={false}
            className="flex sm:hidden"
          />

          {/* Official Lecture 1 Badge */}
          <div className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full bg-[#06112C] border border-precision-gold/50 text-precision-gold shadow-inner font-mono shrink-0">
            <span className="w-2 h-2 rounded-full bg-precision-gold animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase">Lecture 1</span>
            <span className="text-[10px] text-marble-grey/80 font-medium hidden lg:inline">| Diagnostics</span>
          </div>
        </div>

        {/* Primary View Switcher (Desktop & Tablet) */}
        <div className="hidden md:flex items-center bg-[#06112C] p-1.5 rounded-2xl border border-marble-grey/20 text-xs overflow-x-auto no-scrollbar max-w-full shadow-inner gap-1">
          <button
            onClick={() => setActiveMainTab('explorer')}
            className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-xl font-headings text-xs font-semibold transition-all whitespace-nowrap ${
              activeMainTab === 'explorer'
                ? 'bg-precision-gold text-deep-navy shadow-md font-bold'
                : 'text-marble-grey/80 hover:text-precision-gold hover:bg-royal-blue/40'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D Blueprint</span>
          </button>

          <button
            onClick={() => setActiveMainTab('symptom_biology')}
            className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-xl font-headings text-xs font-semibold transition-all whitespace-nowrap ${
              activeMainTab === 'symptom_biology'
                ? 'bg-precision-gold text-deep-navy shadow-md font-bold'
                : 'text-marble-grey/80 hover:text-precision-gold hover:bg-royal-blue/40'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
            <span>Symptom • Biology</span>
            <span className="hidden xl:inline text-[9px] font-mono px-1 py-0.2 rounded-full bg-royal-blue text-precision-gold border border-precision-gold/30 font-bold">
              Pg 2
            </span>
          </button>

          <button
            onClick={() => setActiveMainTab('clinical_exam')}
            className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-xl font-headings text-xs font-semibold transition-all whitespace-nowrap ${
              activeMainTab === 'clinical_exam'
                ? 'bg-precision-gold text-deep-navy shadow-md font-bold'
                : 'text-marble-grey/80 hover:text-precision-gold hover:bg-royal-blue/40'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
            <span>Extra &amp; Intraoral</span>
            <span className="hidden xl:inline text-[9px] font-mono px-1 py-0.2 rounded-full bg-royal-blue text-precision-gold border border-precision-gold/30 font-bold">
              Fig 1&amp;2
            </span>
          </button>

          <button
            onClick={() => setActiveMainTab('cracked_tooth')}
            className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-xl font-headings text-xs font-semibold transition-all whitespace-nowrap ${
              activeMainTab === 'cracked_tooth'
                ? 'bg-precision-gold text-deep-navy shadow-md font-bold'
                : 'text-marble-grey/80 hover:text-precision-gold hover:bg-royal-blue/40'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-amber-400" />
            <span>Cracked Tooth</span>
            <span className="hidden xl:inline text-[9px] font-mono px-1 py-0.2 rounded-full bg-royal-blue text-precision-gold border border-precision-gold/30 font-bold">
              Fig 7
            </span>
          </button>

          <button
            onClick={() => setActiveMainTab('cases')}
            className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-xl font-headings text-xs font-semibold transition-all whitespace-nowrap ${
              activeMainTab === 'cases'
                ? 'bg-precision-gold text-deep-navy shadow-md font-bold'
                : 'text-marble-grey/80 hover:text-precision-gold hover:bg-royal-blue/40'
            }`}
          >
            <Disc className="w-3.5 h-3.5 text-purple-400" />
            <span>Cases ({CLINICAL_CASES.length})</span>
          </button>

          <button
            onClick={() => setActiveMainTab('notes')}
            className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-xl font-headings text-xs font-semibold transition-all whitespace-nowrap ${
              activeMainTab === 'notes'
                ? 'bg-precision-gold text-deep-navy shadow-md font-bold'
                : 'text-marble-grey/80 hover:text-precision-gold hover:bg-royal-blue/40'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Lecture Notes</span>
          </button>
        </div>

        {/* Quick Actions & Brand Companion Badge */}
        <div className="flex items-center gap-2">
          {/* Theme Mode Toggle */}
          <button
            onClick={() =>
              setVisualTheme(
                visualTheme === 'blueprint'
                  ? 'anatomical'
                  : visualTheme === 'anatomical'
                  ? 'radiograph'
                  : 'blueprint'
              )
            }
            aria-label="Toggle Visual Shading"
            className="px-2.5 py-1.5 rounded-xl text-xs font-mono bg-royal-blue hover:bg-royal-blue-hover text-precision-gold border border-precision-gold/30 transition-all flex items-center gap-1.5 shadow-sm font-bold"
          >
            <Sparkles className="w-3.5 h-3.5 text-precision-gold" />
            <span className="capitalize hidden sm:inline">{visualTheme}</span>
          </button>

          {/* User Profile / Academic Companion Avatar Badge (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-marble-grey/20">
            <div className="relative">
              <PrecisionDentalLogo size="avatar" showText={false} />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-deep-navy" />
            </div>
            <div className="text-left text-[10px] leading-tight font-headings">
              <span className="font-bold text-white block">Precision Dental</span>
              <span className="text-precision-gold font-mono">Academic Suite</span>
            </div>
          </div>

          {/* Help Button */}
          <button
            onClick={() => setIsHelpOpen(true)}
            className="p-2 rounded-xl text-marble-grey/80 hover:text-white hover:bg-royal-blue/40 transition-colors"
            aria-label="How to use & 3D shortcuts"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Mobile Menu Hamburger Toggle (Visible on Mobile) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-precision-gold hover:text-white bg-royal-blue/60 border border-precision-gold/30 transition-colors"
            aria-label="Open Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Studio Viewport */}
      <div className="flex-1 flex overflow-hidden relative pb-16 md:pb-0">
        {activeMainTab === 'symptom_biology' ? (
          <div className="flex-1 h-full w-full overflow-hidden flex flex-col">
            <PainDiagnosisExplorer onSimulateIn3D={handleSimulateIn3D} />
          </div>
        ) : activeMainTab === 'clinical_exam' ? (
          <div className="flex-1 h-full w-full overflow-hidden flex flex-col">
            <ClinicalExamExplorer onSimulateIn3D={handleSimulateIn3D} />
          </div>
        ) : activeMainTab === 'cracked_tooth' ? (
          <div className="flex-1 h-full w-full overflow-hidden flex flex-col">
            <CrackedToothDetectives onSimulateIn3D={handleSimulateIn3D} />
          </div>
        ) : activeMainTab === 'cases' ? (
          <div className="flex-1 h-full w-full overflow-y-auto flex flex-col p-2 sm:p-4 max-w-6xl mx-auto">
            <CaseSimulator
              currentCase={currentCase}
              onSelectCase={handleSelectCase}
              onRunTestForCase={handleRunCaseTest}
              performedTests={performedCaseTests}
            />
          </div>
        ) : activeMainTab === 'notes' ? (
          <div className="flex-1 h-full w-full overflow-y-auto flex flex-col p-2 sm:p-4 max-w-5xl mx-auto">
            <LectureNotesPanel />
          </div>
        ) : (
          /* ========================================================================= */
          /* 3D BLUEPRINT EXPLORER MODE */
          /* ========================================================================= */
          <div className="flex-1 flex h-full w-full overflow-hidden relative">
            {/* Desktop Left Drawer: Layer Controls */}
            <div
              className={`hidden lg:flex transition-all duration-300 relative ${
                isLeftPanelOpen ? 'w-80' : 'w-0'
              }`}
            >
              {isLeftPanelOpen && (
                <div className="w-80 h-full">
                  <LayerControls
                    layers={layers}
                    onToggleLayer={handleToggleLayer}
                    onChangeOpacity={handleChangeOpacity}
                    onSetPreset={handleSetPreset}
                    visualTheme={visualTheme}
                    onChangeVisualTheme={setVisualTheme}
                    viewMode={viewMode}
                    onChangeViewMode={setViewMode}
                    clipOffset={clipOffset}
                    onChangeClipOffset={setClipOffset}
                    clipAxis={clipAxis}
                    onChangeClipAxis={setClipAxis}
                    explodedFactor={explodedFactor}
                    onChangeExplodedFactor={setExplodedFactor}
                    selectedHotspot={selectedHotspot}
                    onSelectHotspot={setSelectedHotspot}
                  />
                </div>
              )}

              {/* Left collapse toggle button */}
              <button
                onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
                className="absolute top-4 -right-3.5 z-30 w-7 h-7 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-precision-gold hover:border-precision-gold shadow-xl flex items-center justify-center transition-colors"
                aria-label={isLeftPanelOpen ? 'Collapse Left Panel' : 'Expand Left Panel'}
              >
                {isLeftPanelOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>

            {/* Center 3D Three.js Interactive Canvas (Full View on Mobile/Tablet/Desktop) */}
            <main className="flex-1 h-full w-full relative overflow-hidden">
              <ThreeCanvas
                layers={layers}
                visualTheme={visualTheme}
                viewMode={viewMode}
                clipOffset={clipOffset}
                clipAxis={clipAxis}
                explodedFactor={explodedFactor}
                activeTest={activeTest}
                testExecuting={isTestExecuting}
                onSelectHotspot={setSelectedHotspot}
                selectedHotspot={selectedHotspot}
                hasSinusTract={hasSinusTract}
                hasApicalLesion={hasApicalLesion}
                hasCrackLine={hasCrackLine}
                isCementoma={isCementoma}
              />

              {/* Mobile / Tablet Floating Action Bar on the 3D Canvas */}
              <div className="lg:hidden absolute bottom-3 inset-x-3 z-20 flex items-center justify-center gap-2 pointer-events-none">
                <button
                  onClick={() => setMobileDrawer('layers')}
                  className="pointer-events-auto px-3.5 py-2 rounded-2xl bg-deep-navy/95 text-precision-gold border border-precision-gold/50 shadow-2xl backdrop-blur-md text-xs font-mono font-bold flex items-center gap-1.5 active:scale-95 transition-transform"
                >
                  <Layers className="w-4 h-4 text-precision-gold" />
                  <span>Layers ({visibleLayersCount})</span>
                </button>

                <button
                  onClick={() => setMobileDrawer('tests')}
                  className="pointer-events-auto px-3.5 py-2 rounded-2xl bg-royal-blue/95 text-white border border-precision-gold/60 shadow-2xl backdrop-blur-md text-xs font-mono font-bold flex items-center gap-1.5 active:scale-95 transition-transform"
                >
                  <Sparkles className="w-4 h-4 text-precision-gold" />
                  <span>Test: {activeTest.replace('_', ' ')}</span>
                  {isTestExecuting && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </button>

                <button
                  onClick={() => handleToggleTest()}
                  className={`pointer-events-auto px-3 py-2 rounded-2xl shadow-2xl backdrop-blur-md text-xs font-mono font-bold flex items-center gap-1 active:scale-95 transition-transform ${
                    isTestExecuting
                      ? 'bg-rose-600 text-white border border-rose-400'
                      : 'bg-precision-gold text-deep-navy border border-white/30'
                  }`}
                >
                  {isTestExecuting ? 'Stop Test' : 'Run Test'}
                </button>
              </div>
            </main>

            {/* Desktop Right Drawer: Clinical Test Station */}
            <div
              className={`hidden lg:flex transition-all duration-300 relative ${
                isRightPanelOpen ? 'w-96' : 'w-0'
              }`}
            >
              {/* Right collapse toggle button */}
              <button
                onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
                className="absolute top-4 -left-3.5 z-30 w-7 h-7 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-precision-gold hover:border-precision-gold shadow-xl flex items-center justify-center transition-colors"
                aria-label={isRightPanelOpen ? 'Collapse Right Panel' : 'Expand Right Panel'}
              >
                {isRightPanelOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>

              {isRightPanelOpen && (
                <div className="w-96 h-full">
                  <ClinicalTestStation
                    activeTest={activeTest}
                    onSelectTest={setActiveTest}
                    onToggleExecution={handleToggleTest}
                    isExecuting={isTestExecuting}
                    activeCaseResult={currentCase?.testResponses?.[activeTest]}
                  />
                </div>
              )}
            </div>

            {/* Mobile & Tablet Slide-Over Drawer: Layer Controls */}
            {mobileDrawer === 'layers' && (
              <div className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex justify-start animate-fadeIn">
                <div className="w-full max-w-sm sm:max-w-md h-full bg-deep-navy border-r border-precision-gold/40 flex flex-col shadow-2xl relative">
                  <div className="p-3 bg-[#06112C] border-b border-marble-grey/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-precision-gold" />
                      <span className="text-xs font-bold text-white font-headings">Anatomy Layers &amp; Slice</span>
                    </div>
                    <button
                      onClick={() => setMobileDrawer('none')}
                      className="px-3 py-1 rounded-xl bg-royal-blue text-precision-gold text-xs font-mono font-bold border border-precision-gold/30 hover:bg-royal-blue-hover"
                    >
                      ✕ Close &amp; View Tooth
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <LayerControls
                      layers={layers}
                      onToggleLayer={handleToggleLayer}
                      onChangeOpacity={handleChangeOpacity}
                      onSetPreset={handleSetPreset}
                      visualTheme={visualTheme}
                      onChangeVisualTheme={setVisualTheme}
                      viewMode={viewMode}
                      onChangeViewMode={setViewMode}
                      clipOffset={clipOffset}
                      onChangeClipOffset={setClipOffset}
                      clipAxis={clipAxis}
                      onChangeClipAxis={setClipAxis}
                      explodedFactor={explodedFactor}
                      onChangeExplodedFactor={setExplodedFactor}
                      selectedHotspot={selectedHotspot}
                      onSelectHotspot={setSelectedHotspot}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Mobile & Tablet Slide-Over Drawer: Clinical Test Station */}
            {mobileDrawer === 'tests' && (
              <div className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex justify-end animate-fadeIn">
                <div className="w-full max-w-sm sm:max-w-md h-full bg-deep-navy border-l border-precision-gold/40 flex flex-col shadow-2xl relative">
                  <div className="p-3 bg-[#06112C] border-b border-marble-grey/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-precision-gold" />
                      <span className="text-xs font-bold text-white font-headings">Clinical Test Station</span>
                    </div>
                    <button
                      onClick={() => setMobileDrawer('none')}
                      className="px-3 py-1 rounded-xl bg-royal-blue text-precision-gold text-xs font-mono font-bold border border-precision-gold/30 hover:bg-royal-blue-hover"
                    >
                      ✕ Close &amp; View Tooth
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <ClinicalTestStation
                      activeTest={activeTest}
                      onSelectTest={setActiveTest}
                      onToggleExecution={handleToggleTest}
                      isExecuting={isTestExecuting}
                      activeCaseResult={currentCase?.testResponses?.[activeTest]}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation Bar (Persistent on Mobile < md) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 h-16 bg-[#06112C]/95 backdrop-blur-xl border-t border-marble-grey/20 z-30 flex items-center justify-around px-2 shadow-2xl">
        <button
          onClick={() => setActiveMainTab('explorer')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            activeMainTab === 'explorer'
              ? 'text-precision-gold scale-105'
              : 'text-marble-grey/60 hover:text-white'
          }`}
        >
          <Box className="w-5 h-5" />
          <span className="text-[10px] font-headings font-bold mt-0.5">3D Model</span>
        </button>

        <button
          onClick={() => setActiveMainTab('symptom_biology')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            activeMainTab === 'symptom_biology'
              ? 'text-precision-gold scale-105'
              : 'text-marble-grey/60 hover:text-white'
          }`}
        >
          <HeartPulse className="w-5 h-5 text-rose-400" />
          <span className="text-[10px] font-headings font-bold mt-0.5">Symptom</span>
        </button>

        <button
          onClick={() => setActiveMainTab('clinical_exam')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            activeMainTab === 'clinical_exam'
              ? 'text-precision-gold scale-105'
              : 'text-marble-grey/60 hover:text-white'
          }`}
        >
          <Stethoscope className="w-5 h-5 text-cyan-400" />
          <span className="text-[10px] font-headings font-bold mt-0.5">Exam</span>
        </button>

        <button
          onClick={() => setActiveMainTab('cracked_tooth')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            activeMainTab === 'cracked_tooth'
              ? 'text-precision-gold scale-105'
              : 'text-marble-grey/60 hover:text-white'
          }`}
        >
          <Search className="w-5 h-5 text-amber-400" />
          <span className="text-[10px] font-headings font-bold mt-0.5">Cracked</span>
        </button>

        <button
          onClick={() => setActiveMainTab('cases')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            activeMainTab === 'cases'
              ? 'text-precision-gold scale-105'
              : 'text-marble-grey/60 hover:text-white'
          }`}
        >
          <Disc className="w-5 h-5 text-purple-400" />
          <span className="text-[10px] font-headings font-bold mt-0.5">Cases</span>
        </button>

        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-marble-grey/60 hover:text-white transition-all"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] font-headings font-bold mt-0.5">Menu</span>
        </button>
      </nav>

      {/* Full-Screen Mobile Navigation Overlay Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-deep-navy/98 backdrop-blur-2xl flex flex-col p-4 sm:p-6 overflow-y-auto animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-marble-grey/20">
            <PrecisionDentalLogo size="md" showText={true} showArabic={true} showTagline={true} />
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-xl bg-[#06112C] text-precision-gold border border-precision-gold/30 hover:bg-royal-blue transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Module Links */}
          <div className="mt-5 space-y-2.5 flex-1">
            <div className="flex items-center justify-between pb-1">
              <p className="text-[10px] font-mono text-precision-gold font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-precision-gold animate-pulse" />
                Lecture 1 • Diagnostic Curriculum
              </p>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-royal-blue text-ivory-white border border-precision-gold/30 font-bold">
                Prof. Dr. Anas Faleh
              </span>
            </div>

            <button
              onClick={() => {
                setActiveMainTab('explorer');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                activeMainTab === 'explorer'
                  ? 'bg-royal-blue border-precision-gold text-white shadow-lg'
                  : 'bg-[#06112C] border-marble-grey/15 text-marble-grey/85 hover:bg-royal-blue/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-deep-navy border border-precision-gold/40 flex items-center justify-center text-precision-gold">
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold font-headings text-white">3D Blueprint Architecture</h4>
                  <p className="text-[11px] text-marble-grey/70">Tooth root canal layers, sectioning &amp; 12 clinical tests</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-precision-gold" />
            </button>

            <button
              onClick={() => {
                setActiveMainTab('symptom_biology');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                activeMainTab === 'symptom_biology'
                  ? 'bg-royal-blue border-precision-gold text-white shadow-lg'
                  : 'bg-[#06112C] border-marble-grey/15 text-marble-grey/85 hover:bg-royal-blue/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-deep-navy border border-rose-500/40 flex items-center justify-center text-rose-400">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold font-headings text-white">Symptom • Biology • Diagnosis</h4>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-royal-blue text-precision-gold font-bold">
                      Pg 2
                    </span>
                  </div>
                  <p className="text-[11px] text-marble-grey/70">Hydrodynamic tubule lab, pressure chamber &amp; nerve race</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-precision-gold" />
            </button>

            <button
              onClick={() => {
                setActiveMainTab('clinical_exam');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                activeMainTab === 'clinical_exam'
                  ? 'bg-royal-blue border-precision-gold text-white shadow-lg'
                  : 'bg-[#06112C] border-marble-grey/15 text-marble-grey/85 hover:bg-royal-blue/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-deep-navy border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold font-headings text-white">Extraoral &amp; Intraoral Exam</h4>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-royal-blue text-precision-gold font-bold">
                      Fig 1&amp;2
                    </span>
                  </div>
                  <p className="text-[11px] text-marble-grey/70">Lymph node palpation, chin sinus tracing, transillumination</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-precision-gold" />
            </button>

            <button
              onClick={() => {
                setActiveMainTab('cracked_tooth');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                activeMainTab === 'cracked_tooth'
                  ? 'bg-royal-blue border-precision-gold text-white shadow-lg'
                  : 'bg-[#06112C] border-marble-grey/15 text-marble-grey/85 hover:bg-royal-blue/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-deep-navy border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold font-headings text-white">Cracked Tooth Detectives</h4>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-royal-blue text-precision-gold font-bold">
                      Fig 7
                    </span>
                  </div>
                  <p className="text-[11px] text-marble-grey/70">Tooth Slooth bite rebound release, methylene blue &amp; lights</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-precision-gold" />
            </button>

            <button
              onClick={() => {
                setActiveMainTab('cases');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                activeMainTab === 'cases'
                  ? 'bg-royal-blue border-precision-gold text-white shadow-lg'
                  : 'bg-[#06112C] border-marble-grey/15 text-marble-grey/85 hover:bg-royal-blue/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-deep-navy border border-purple-500/40 flex items-center justify-center text-purple-400">
                  <Disc className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold font-headings text-white">Clinical Patient Cases (5)</h4>
                  <p className="text-[11px] text-marble-grey/70">Diagnostic workup, clinical notes &amp; chart history</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-precision-gold" />
            </button>

            <button
              onClick={() => {
                setActiveMainTab('notes');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                activeMainTab === 'notes'
                  ? 'bg-royal-blue border-precision-gold text-white shadow-lg'
                  : 'bg-[#06112C] border-marble-grey/15 text-marble-grey/85 hover:bg-royal-blue/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-deep-navy border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold font-headings text-white">Lecture Notes &amp; Board Quiz</h4>
                  <p className="text-[11px] text-marble-grey/70">Scully &amp; Cawson checklist &amp; Prof. Dr. Anas Faleh guide</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-precision-gold" />
            </button>
          </div>

          {/* Quick Settings in Mobile Drawer */}
          <div className="mt-6 pt-4 border-t border-marble-grey/20 flex items-center justify-between">
            <button
              onClick={() => {
                setVisualTheme(
                  visualTheme === 'blueprint'
                    ? 'anatomical'
                    : visualTheme === 'anatomical'
                    ? 'radiograph'
                    : 'blueprint'
                );
              }}
              className="px-3.5 py-2 rounded-xl bg-[#06112C] text-precision-gold border border-precision-gold/30 text-xs font-mono font-bold flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-precision-gold" />
              <span>Theme: {visualTheme}</span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsHelpOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-royal-blue text-white border border-precision-gold/30 text-xs font-headings font-bold flex items-center gap-2"
            >
              <Info className="w-4 h-4 text-precision-gold" />
              <span>User Guide</span>
            </button>
          </div>
        </div>
      )}

      {/* Help & 3D Navigation Guide Modal */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 bg-deep-navy/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-deep-navy border border-precision-gold/50 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-marble-grey/20">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-royal-blue border border-precision-gold/40 text-precision-gold">
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white font-headings">Precision Dental Guide</h3>
                  <p className="text-xs text-marble-grey/80">Mobile, Tablet &amp; Laptop Controls</p>
                </div>
              </div>
              <button
                onClick={() => setIsHelpOpen(false)}
                className="text-slate-400 hover:text-white p-1 hover:bg-royal-blue rounded-lg text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-marble-grey/90">
              <div className="p-3.5 rounded-2xl bg-[#06112C] border border-marble-grey/15 space-y-1.5">
                <span className="font-mono text-precision-gold font-bold block uppercase text-[10px]">
                  3D View &amp; Touch Controls:
                </span>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Touch Drag / Orbit:</strong> Swipe 1 finger to rotate the 3D tooth in 360 degrees.</li>
                  <li><strong>Pinch to Zoom:</strong> Pinch in/out with 2 fingers to zoom into the dentinal tubules or pulp chamber.</li>
                  <li><strong>Pan View:</strong> Two-finger drag (or right-click) to pan the blueprint camera.</li>
                  <li><strong>Responsive Drawers:</strong> On phones and tablets, tap bottom pills (Layers / Tests) to open full overlay controls!</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#06112C] border border-marble-grey/15 space-y-1.5">
                <span className="font-mono text-precision-gold font-bold block uppercase text-[10px]">
                  Lecture 1 Features Included:
                </span>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>12 Clinical Tests:</strong> Cold, Heat, EPT, Vertical &amp; Horizontal Percussion, Mobility, Tooth Slooth bite release, Transillumination, and Sinus Tracing.</li>
                  <li><strong>Diagnostic Pain Table:</strong> Complete matrix from Page 2 comparing Aδ, C, and Aβ nerve fibers with provisional diagnoses.</li>
                  <li><strong>Scully &amp; Cawson Checklist:</strong> Full 12-item systemic medical evaluation.</li>
                  <li><strong>5 Patient Cases:</strong> Cutaneous chin fistula (Fig 1), GP cone tracing in premolar (Fig 2), Cracked tooth syndrome (Fig 7), and Cementoma warning (Fig 7b).</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setIsHelpOpen(false)}
              className="w-full py-2.5 rounded-xl bg-precision-gold hover:bg-precision-gold-hover text-deep-navy font-bold text-xs font-headings uppercase tracking-wider shadow-lg"
            >
              Start Exploring
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
