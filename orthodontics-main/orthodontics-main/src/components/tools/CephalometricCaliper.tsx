/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Ruler, RefreshCw, Crosshair, CheckCircle2, Info, Compass } from 'lucide-react';

interface LandmarkPoint {
  id: string;
  name: string;
  short: string;
  x: number;
  y: number;
  color: string;
  description: string;
}

export const CephalometricCaliper: React.FC = () => {
  // Draggable landmark coordinates on a 600x500 normalized canvas
  const [landmarks, setLandmarks] = useState<{ [id: string]: { x: number; y: number } }>({
    nasion: { x: 380, y: 130 },
    glabella: { x: 375, y: 95 },
    subnasale: { x: 405, y: 235 },
    pogonion: { x: 380, y: 360 },
    menton: { x: 370, y: 410 },
    porion: { x: 180, y: 200 },
    orbitale: { x: 350, y: 180 },
    occiput: { x: 140, y: 280 },
  });

  const [activePreset, setActivePreset] = useState<'normal' | 'class_ii' | 'class_iii' | 'high_angle' | 'low_angle'>('normal');
  const [selectedLandmark, setSelectedLandmark] = useState<string | null>(null);
  const [showZeroMeridian, setShowZeroMeridian] = useState<boolean>(true);
  const [showFrankfortMandibular, setShowFrankfortMandibular] = useState<boolean>(true);
  const [showConvexity, setShowConvexity] = useState<boolean>(true);

  const containerRef = useRef<SVGSVGElement>(null);
  const isDraggingRef = useRef<boolean>(false);

  // Apply preset clinical coordinates
  const applyPreset = (preset: 'normal' | 'class_ii' | 'class_iii' | 'high_angle' | 'low_angle') => {
    setActivePreset(preset);
    if (preset === 'normal') {
      setLandmarks({
        nasion: { x: 380, y: 130 },
        glabella: { x: 375, y: 95 },
        subnasale: { x: 405, y: 235 },
        pogonion: { x: 380, y: 360 },
        menton: { x: 370, y: 410 },
        porion: { x: 180, y: 200 },
        orbitale: { x: 350, y: 180 },
        occiput: { x: 140, y: 280 },
      });
    } else if (preset === 'class_ii') {
      setLandmarks({
        nasion: { x: 380, y: 130 },
        glabella: { x: 375, y: 95 },
        subnasale: { x: 415, y: 235 },
        pogonion: { x: 345, y: 365 }, // Retrognathic
        menton: { x: 335, y: 420 },
        porion: { x: 180, y: 200 },
        orbitale: { x: 350, y: 180 },
        occiput: { x: 140, y: 280 },
      });
    } else if (preset === 'class_iii') {
      setLandmarks({
        nasion: { x: 380, y: 130 },
        glabella: { x: 375, y: 95 },
        subnasale: { x: 395, y: 235 },
        pogonion: { x: 410, y: 355 }, // Prognathic
        menton: { x: 400, y: 405 },
        porion: { x: 180, y: 200 },
        orbitale: { x: 350, y: 180 },
        occiput: { x: 140, y: 280 },
      });
    } else if (preset === 'high_angle') {
      setLandmarks({
        nasion: { x: 380, y: 125 },
        glabella: { x: 375, y: 90 },
        subnasale: { x: 405, y: 230 },
        pogonion: { x: 365, y: 380 },
        menton: { x: 355, y: 440 }, // Increased lower face height
        porion: { x: 180, y: 195 },
        orbitale: { x: 350, y: 175 },
        occiput: { x: 140, y: 280 },
      });
    } else if (preset === 'low_angle') {
      setLandmarks({
        nasion: { x: 380, y: 135 },
        glabella: { x: 375, y: 100 },
        subnasale: { x: 405, y: 240 },
        pogonion: { x: 390, y: 340 },
        menton: { x: 380, y: 380 }, // Short lower face height
        porion: { x: 180, y: 205 },
        orbitale: { x: 350, y: 185 },
        occiput: { x: 140, y: 280 },
      });
    }
  };

  // Dragging event handlers supporting seamless touch and mouse dragging
  const handlePointerDown = (id: string, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedLandmark(id);
    isDraggingRef.current = true;

    const onPointerMoveWindow = (ev: PointerEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(40, Math.min(560, ((ev.clientX - rect.left) / rect.width) * 600));
      const y = Math.max(30, Math.min(470, ((ev.clientY - rect.top) / rect.height) * 500));

      setLandmarks((prev) => ({
        ...prev,
        [id]: { x: Math.round(x), y: Math.round(y) },
      }));
    };

    const onPointerUpWindow = () => {
      isDraggingRef.current = false;
      window.removeEventListener('pointermove', onPointerMoveWindow);
      window.removeEventListener('pointerup', onPointerUpWindow);
      window.removeEventListener('pointercancel', onPointerUpWindow);
    };

    window.addEventListener('pointermove', onPointerMoveWindow, { passive: false });
    window.addEventListener('pointerup', onPointerUpWindow);
    window.addEventListener('pointercancel', onPointerUpWindow);
  };

  // Mathematical computations
  // 1. Angle of Facial Convexity: Glabella -> Subnasale -> Pogonion
  const calcConvexityAngle = () => {
    const g = landmarks.glabella;
    const sn = landmarks.subnasale;
    const pog = landmarks.pogonion;

    // Vectors sn->g and sn->pog
    const v1 = { x: g.x - sn.x, y: g.y - sn.y };
    const v2 = { x: pog.x - sn.x, y: pog.y - sn.y };

    const dot = v1.x * v2.x + v1.y * v2.y;
    const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);

    if (mag1 === 0 || mag2 === 0) return 12;
    const rad = Math.acos(Math.max(-1, Math.min(1, dot / (mag1 * mag2))));
    const angleTotal = (rad * 180) / Math.PI;

    // Deviation from straight line (180 - angle)
    // Positive for convex (Class II), negative for concave (Class III)
    const deviation = Math.round(180 - angleTotal);
    // Sign depending on pog.x relative to zero-meridian dropped from Nasion
    const isConvex = pog.x < sn.x;
    return isConvex ? Math.abs(deviation) : -Math.abs(deviation);
  };

  // 2. Mandibular Plane Angle calculation
  // Frankfort line: Porion to Orbitale
  // Mandibular line: Lower jaw border (e.g. Gonion/Occiput area) to Menton
  const calcMandibularPlaneAngle = () => {
    const po = landmarks.porion;
    const or = landmarks.orbitale;
    const me = landmarks.menton;
    const occ = landmarks.occiput;

    const angleFrankfort = Math.atan2(or.y - po.y, or.x - po.x);
    const angleMandibular = Math.atan2(me.y - occ.y, me.x - occ.x);

    const diffDeg = Math.round(Math.abs((angleMandibular - angleFrankfort) * (180 / Math.PI)));
    return diffDeg;
  };

  const convexityAngle = calcConvexityAngle();
  const mandibularAngle = calcMandibularPlaneAngle();

  const landmarkSpecs: LandmarkPoint[] = [
    { id: 'glabella', name: 'Glabella', short: 'G', x: landmarks.glabella.x, y: landmarks.glabella.y, color: '#C9A24B', description: 'Most prominent anterior point in midsagittal plane of forehead' },
    { id: 'nasion', name: 'Soft Tissue Nasion', short: 'N\'', x: landmarks.nasion.x, y: landmarks.nasion.y, color: '#2563EB', description: 'Deepest depression at the concavity of the nose bridge' },
    { id: 'subnasale', name: 'Subnasale', short: 'Sn', x: landmarks.subnasale.x, y: landmarks.subnasale.y, color: '#10B981', description: 'Junction of columella of nose and upper lip' },
    { id: 'pogonion', name: 'Soft Tissue Pogonion', short: 'Pog\'', x: landmarks.pogonion.x, y: landmarks.pogonion.y, color: '#C9A24B', description: 'Most anterior prominent point of soft tissue chin' },
    { id: 'menton', name: 'Menton', short: 'Me', x: landmarks.menton.x, y: landmarks.menton.y, color: '#F59E0B', description: 'Lowest inferior point on mandibular symphysis' },
    { id: 'porion', name: 'Porion', short: 'Po', x: landmarks.porion.x, y: landmarks.porion.y, color: '#EC4899', description: 'Superior point of external acoustic meatus' },
    { id: 'orbitale', name: 'Orbitale', short: 'Or', x: landmarks.orbitale.x, y: landmarks.orbitale.y, color: '#EC4899', description: 'Lowest point on infraorbital margin' },
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6">
      {/* Title & Clinical Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#C9A24B]/20 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#DFC17B] uppercase tracking-wider">
            <Ruler className="w-4 h-4 text-[#C9A24B]" />
            <span>2D Clinical Instrument</span>
            <span>·</span>
            <span>Lecture 1 & 2 Syllabus</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Interactive Cephalometric & Profile Caliper
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Drag anatomical landmarks directly on the profile canvas. Test the Zero Meridian vertical, live Angle of Facial Convexity ($12^\circ \pm 4^\circ$), and Frankfort-to-Mandibular Plane angle intersection.
          </p>
        </div>

        {/* Clinical Presets */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#071330]/80 p-1.5 rounded-xl border border-[#C9A24B]/30">
          {[
            { id: 'normal', label: 'Class I (Orthognathic)' },
            { id: 'class_ii', label: 'Class II (Convex)' },
            { id: 'class_iii', label: 'Class III (Concave)' },
            { id: 'high_angle', label: 'High Angle (Long Face)' },
            { id: 'low_angle', label: 'Low Angle (Short Face)' },
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset.id as any)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                activePreset === preset.id
                  ? 'bg-gradient-to-r from-[#C9A24B] to-[#B8892E] text-[#071330] shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Workstation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Caliper Canvas */}
        <div className="lg:col-span-2 relative bg-[#071330] rounded-2xl border border-[#C9A24B]/30 overflow-hidden shadow-2xl">
          {/* Caliper HUD Overlay */}
          <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-2 pointer-events-none">
            <div className="glass-panel-subtle px-3 py-1.5 rounded-lg border border-[#C9A24B]/30 pointer-events-auto">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Facial Convexity Angle</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-black font-mono text-[#DFC17B]">
                  {convexityAngle > 0 ? `+${convexityAngle}°` : `${convexityAngle}°`}
                </span>
                <span className="text-[10px] font-semibold text-slate-300">
                  {convexityAngle >= 8 && convexityAngle <= 16
                    ? '(Normal Class I: 12° ± 4°)'
                    : convexityAngle > 16
                    ? '(Increased: Class II Convex)'
                    : '(Decreased: Class III Concave)'}
                </span>
              </div>
            </div>

            <div className="glass-panel-subtle px-3 py-1.5 rounded-lg border border-[#C9A24B]/30 pointer-events-auto">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Mandibular Plane Angle</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-black font-mono text-cyan-400">{mandibularAngle}°</span>
                <span className="text-[10px] font-semibold text-slate-300">
                  {mandibularAngle > 30
                    ? 'Anterior to Occiput (High Angle)'
                    : mandibularAngle < 22
                    ? 'Posterior to Occiput (Low Angle)'
                    : 'At Occiput (Normal 27°)'}
                </span>
              </div>
            </div>
          </div>

          {/* Guide Toggles (Top Right HUD) */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
            <button
              onClick={() => setShowZeroMeridian(!showZeroMeridian)}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all border ${
                showZeroMeridian
                  ? 'bg-[#1B3A8C] text-white border-blue-400'
                  : 'bg-[#071330]/80 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              Zero Meridian (N' Vertical)
            </button>
            <button
              onClick={() => setShowFrankfortMandibular(!showFrankfortMandibular)}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all border ${
                showFrankfortMandibular
                  ? 'bg-rose-900/80 text-rose-200 border-rose-500'
                  : 'bg-[#071330]/80 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              Frankfort & Mandibular Planes
            </button>
            <button
              onClick={() => setShowConvexity(!showConvexity)}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all border ${
                showConvexity
                  ? 'bg-emerald-900/80 text-emerald-200 border-emerald-500'
                  : 'bg-[#071330]/80 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              Convexity Triangle (G-Sn-Pog)
            </button>
          </div>

          {/* SVG Caliper Canvas */}
          <svg
            ref={containerRef}
            viewBox="0 0 600 500"
            className="w-full h-[360px] sm:h-[440px] md:h-[500px] select-none cursor-crosshair touch-none"
          >
            <defs>
              <linearGradient id="profileGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1B3A8C" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#C9A24B" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Anatomical Stylized Profile Silhouette Contour */}
            <path
              d={`
                M 250 40 
                C 330 40, 360 70, 375 95 
                C 380 110, 375 125, 380 130 
                C 390 145, 435 210, 420 225 
                C 415 230, 410 235, 405 235 
                C 415 250, 415 265, 400 275 
                C 390 285, 395 305, 400 320 
                C 405 340, ${landmarks.pogonion.x + 10} 350, ${landmarks.pogonion.x} 360 
                C ${landmarks.pogonion.x - 10} 380, ${landmarks.menton.x + 10} 400, ${landmarks.menton.x} 410 
                C 340 425, 260 410, 220 370 
                C 190 330, 150 310, 140 280 
                C 130 240, 160 160, 200 120 
                C 220 80, 230 40, 250 40 Z
              `}
              fill="url(#profileGlow)"
              stroke="rgba(201, 162, 75, 0.4)"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* Ear Silhouette & Porion */}
            <path
              d="M 180 180 C 165 180, 160 210, 175 225 C 185 235, 195 215, 185 195"
              fill="none"
              stroke="rgba(201, 162, 75, 0.5)"
              strokeWidth="2"
            />

            {/* Zero Meridian: True vertical dropped from Soft Tissue Nasion */}
            {showZeroMeridian && (
              <g>
                <line
                  x1={landmarks.nasion.x}
                  y1={40}
                  x2={landmarks.nasion.x}
                  y2={460}
                  stroke="#2563EB"
                  strokeWidth="2"
                  strokeDasharray="6,4"
                />
                <text
                  x={landmarks.nasion.x + 8}
                  y={60}
                  fill="#93C5FD"
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="Montserrat"
                >
                  Zero Meridian (True Vertical)
                </text>
              </g>
            )}

            {/* Frankfort Horizontal Plane (Porion to Orbitale extended) */}
            {showFrankfortMandibular && (
              <g>
                {/* Extended line Po-Or */}
                <line
                  x1={landmarks.porion.x - 80}
                  y1={landmarks.porion.y - ((landmarks.orbitale.y - landmarks.porion.y) / (landmarks.orbitale.x - landmarks.porion.x)) * 80}
                  x2={landmarks.orbitale.x + 140}
                  y2={landmarks.orbitale.y + ((landmarks.orbitale.y - landmarks.porion.y) / (landmarks.orbitale.x - landmarks.porion.x)) * 140}
                  stroke="#EF4444"
                  strokeWidth="2.5"
                />
                <text
                  x={landmarks.orbitale.x + 10}
                  y={landmarks.orbitale.y - 10}
                  fill="#F87171"
                  fontSize="10"
                  fontWeight="bold"
                >
                  Frankfort Plane (Po - Or)
                </text>

                {/* Mandibular Plane (Occiput to Menton) */}
                <line
                  x1={landmarks.occiput.x - 40}
                  y1={landmarks.occiput.y - ((landmarks.menton.y - landmarks.occiput.y) / (landmarks.menton.x - landmarks.occiput.x)) * 40}
                  x2={landmarks.menton.x + 80}
                  y2={landmarks.menton.y + ((landmarks.menton.y - landmarks.occiput.y) / (landmarks.menton.x - landmarks.occiput.x)) * 80}
                  stroke="#38BDF8"
                  strokeWidth="2.5"
                />
                <text
                  x={landmarks.menton.x - 40}
                  y={landmarks.menton.y + 25}
                  fill="#7DD3FC"
                  fontSize="10"
                  fontWeight="bold"
                >
                  Mandibular Plane (Me)
                </text>
              </g>
            )}

            {/* Facial Convexity Angle (Glabella -> Subnasale -> Pogonion) */}
            {showConvexity && (
              <g>
                <line
                  x1={landmarks.glabella.x}
                  y1={landmarks.glabella.y}
                  x2={landmarks.subnasale.x}
                  y2={landmarks.subnasale.y}
                  stroke="#10B981"
                  strokeWidth="2.5"
                />
                <line
                  x1={landmarks.subnasale.x}
                  y1={landmarks.subnasale.y}
                  x2={landmarks.pogonion.x}
                  y2={landmarks.pogonion.y}
                  stroke="#10B981"
                  strokeWidth="2.5"
                />
              </g>
            )}

            {/* Draggable Landmark Control Nodes with large touch hit area */}
            {landmarkSpecs.map((lm) => (
              <g
                key={lm.id}
                className="cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => handlePointerDown(lm.id, e)}
              >
                {/* Transparent touch hit area for mobile fingers */}
                <circle cx={lm.x} cy={lm.y} r={22} fill="transparent" />
                <circle
                  cx={lm.x}
                  cy={lm.y}
                  r={selectedLandmark === lm.id ? 12 : 8}
                  fill={lm.color}
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  filter="drop-shadow(0 2px 4px rgba(0,0,0,0.6))"
                />
                <text
                  x={lm.x + 14}
                  y={lm.y + 4}
                  fill="#FFFFFF"
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="Montserrat"
                  pointerEvents="none"
                >
                  {lm.short}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Right 1 Col: Landmark Inspector & Scientific Glossary */}
        <div className="glass-panel-subtle rounded-2xl p-5 border border-[#C9A24B]/30 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-[#DFC17B] uppercase tracking-wider block">
              Landmark Key & Clinical Rules
            </span>

            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
              {landmarkSpecs.map((lm) => (
                <div
                  key={lm.id}
                  onClick={() => setSelectedLandmark(lm.id)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedLandmark === lm.id
                      ? 'bg-[#C9A24B]/20 border-[#C9A24B] text-white'
                      : 'bg-[#071330]/60 border-white/5 text-slate-300 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: lm.color }} />
                      <span>{lm.name} ({lm.short})</span>
                    </span>
                    <span className="font-mono text-[10px] text-[#DFC17B]">
                      X:{lm.x} Y:{lm.y}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">{lm.description}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => applyPreset('normal')}
            className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-white/10"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#DFC17B]" />
            <span>Reset Landmarks to Normal Baseline</span>
          </button>
        </div>
      </div>
    </div>
  );
};
