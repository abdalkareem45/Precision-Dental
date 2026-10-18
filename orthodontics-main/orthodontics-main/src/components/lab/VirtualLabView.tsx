/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ThreeDentalArchScene } from '../three/ThreeDentalArchScene';
import { ThreeCraniofacialProfileScene } from '../three/ThreeCraniofacialProfileScene';
import { CephalometricCaliper } from '../tools/CephalometricCaliper';
import { BsiIncisorSimulator } from '../tools/BsiIncisorSimulator';
import { SmileAestheticAnalyzer } from '../tools/SmileAestheticAnalyzer';
import { Box, User, Sparkles, Layers, Ruler, Smile } from 'lucide-react';

export const VirtualLabView: React.FC = () => {
  const [labMode, setLabMode] = useState<'arches_3d' | 'profile_3d' | 'ceph_2d' | 'bsi_2d' | 'smile_2d' | 'dual_3d'>('arches_3d');

  return (
    <div className="space-y-6">
      {/* Lab Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 glass-panel p-6 sm:p-8 rounded-3xl border border-[#C9A24B]/30 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#DFC17B] uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#C9A24B]" />
            <span>Interactive Biomechanics & Diagnostic Laboratory</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mt-1">
            Orthodontic 3D & 2D Simulation Suite
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Switch between high-detail anatomical 3D dental arches with TMJ joint articulation, 3D craniofacial skeletal profiles, and interactive 2D clinical measurement calipers.
          </p>
        </div>

        {/* View Switcher Bar */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#071330]/90 p-1.5 rounded-2xl border border-[#C9A24B]/30 self-start lg:self-center">
          {[
            { id: 'arches_3d', label: '3D Arches & TMJ', icon: Box },
            { id: 'profile_3d', label: '3D Profile', icon: User },
            { id: 'ceph_2d', label: '2D Ceph Calipers', icon: Ruler },
            { id: 'bsi_2d', label: '2D BSI Incisors', icon: Layers },
            { id: 'smile_2d', label: '2D Smile Ratio', icon: Smile },
            { id: 'dual_3d', label: 'Dual Synchronized', icon: Sparkles },
          ].map((mode) => {
            const Icon = mode.icon;
            const isActive = labMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setLabMode(mode.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#C9A24B] to-[#B8892E] text-[#071330] shadow-md font-extrabold'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Sandbox Views */}
      {labMode === 'arches_3d' && (
        <ThreeDentalArchScene />
      )}

      {labMode === 'profile_3d' && (
        <ThreeCraniofacialProfileScene />
      )}

      {labMode === 'ceph_2d' && (
        <CephalometricCaliper />
      )}

      {labMode === 'bsi_2d' && (
        <BsiIncisorSimulator />
      )}

      {labMode === 'smile_2d' && (
        <SmileAestheticAnalyzer />
      )}

      {labMode === 'dual_3d' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#DFC17B] uppercase tracking-wider block">
              1. Intraoral 3D Dental Arches & Articulated TMJ
            </span>
            <ThreeDentalArchScene />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#DFC17B] uppercase tracking-wider block">
              2. Extraoral 3D Profile & Skeletal Planes
            </span>
            <ThreeCraniofacialProfileScene />
          </div>
        </div>
      )}

      {/* Clinical Guidance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="glass-panel p-4 rounded-2xl border border-white/10 shadow-lg">
          <span className="text-[#DFC17B] font-bold block mb-1">Orbit & Touch:</span>
          <p className="text-slate-300">Click and drag inside any 3D viewport to freely rotate camera angles. Scroll to zoom into the molar cusp grooves, bracket ligatures, and TMJ condylar disc.</p>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-white/10 shadow-lg">
          <span className="text-cyan-400 font-bold block mb-1">Clinical Caliper Precision:</span>
          <p className="text-slate-300">Switch to 2D Ceph Calipers to manually drag cephalometric points across soft tissue contours and verify facial convexity angles against gold standards.</p>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-white/10 shadow-lg">
          <span className="text-emerald-400 font-bold block mb-1">Dynamic Mastication:</span>
          <p className="text-slate-300">Trigger protrusive and lateral excursion to see the mandibular condyle translate along the articular eminence with simultaneous posterior disclusion.</p>
        </div>
      </div>
    </div>
  );
};
