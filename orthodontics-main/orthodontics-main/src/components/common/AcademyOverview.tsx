/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LectureTab } from '../../types/ortho';
import {
  BookOpen,
  Sparkles,
  Box,
  Stethoscope,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Compass,
  Ruler
} from 'lucide-react';

interface AcademyOverviewProps {
  onSelectTab: (tab: LectureTab) => void;
}

export const AcademyOverview: React.FC<AcademyOverviewProps> = ({ onSelectTab }) => {
  return (
    <div className="space-y-10">
      {/* Hero Presentation */}
      <div className="relative rounded-3xl overflow-hidden glass-panel p-8 sm:p-12 shadow-2xl border-2 border-[#C9A24B]/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#C9A24B]/20 via-[#1B3A8C]/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-xs font-bold text-[#DFC17B] uppercase tracking-wider">
            <span>Precision Orthodontics Academy</span>
            <span>·</span>
            <span>5th Year Curriculum</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-sans leading-tight">
            Precision Orthodontics <br />
            <span className="gold-gradient-text">Interactive 3D & 2D Suite</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
            A next-generation clinical education system engineered to master orthodontic examination in three dimensions,
            diagnostic problem lists, gold-standard occlusion definitions, and Andrews' six keys through photorealistic 3D dental morphs and live 2D calipers.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onSelectTab('lecture1_2')}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#C9A24B] to-[#B8892E] hover:from-[#DFC17B] hover:to-[#C9A24B] text-[#071330] font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all"
            >
              <BookOpen className="w-4 h-4 text-[#071330]" />
              <span>Explore Lectures 1 & 2</span>
            </button>
            <button
              onClick={() => onSelectTab('3d_lab')}
              className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-white/20 transition-all backdrop-blur-sm"
            >
              <Box className="w-4 h-4 text-[#DFC17B]" />
              <span>Launch 3D Virtual Lab</span>
            </button>
          </div>
        </div>
      </div>


      {/* Curriculum Module Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Module 1: Lecture 1 & 2 */}
        <div
          onClick={() => onSelectTab('lecture1_2')}
          className="glass-panel glass-card-hover rounded-2xl border border-[#C9A24B]/30 p-6 shadow-xl cursor-pointer flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#DFC17B]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#DFC17B] uppercase tracking-wider block">Lecture 1 & 2</span>
              <h3 className="text-lg font-bold text-white group-hover:text-[#DFC17B] transition-colors">
                Orthodontic History & Clinical Examination
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Detailed case history collection, chief complaint, medical/dental precautions, Sheldon body build,
              and 3D clinical assessment (Zero Meridian, Rule of Thirds & Fifths, A/B point palpation, Cephalometric Calipers, and smile design).
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs font-bold text-[#DFC17B]">
            <span>Explore 7 Interactive Clinical Modules</span>
            <ArrowRight className="w-4 h-4 text-[#C9A24B]" />
          </div>
        </div>

        {/* Module 2: Lecture 3 */}
        <div
          onClick={() => onSelectTab('lecture3')}
          className="glass-panel glass-card-hover rounded-2xl border border-[#C9A24B]/30 p-6 shadow-xl cursor-pointer flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#DFC17B]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#DFC17B] uppercase tracking-wider block">Lecture 3</span>
              <h3 className="text-lg font-bold text-white group-hover:text-[#DFC17B] transition-colors">
                Occlusion Concepts & Andrews' Six Keys
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Gnathological gold standards (Centric Relation vs Centric Occlusion), Angle's Normal & Classes I/II/III,
              Andrews' Six Keys system, Mutually Protected Occlusion, and 2D BSI Incisor Simulator.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs font-bold text-[#DFC17B]">
            <span>Explore 3D Arch & TMJ Engine</span>
            <ArrowRight className="w-4 h-4 text-[#C9A24B]" />
          </div>
        </div>

        {/* Module 3: 3D Simulation Lab */}
        <div
          onClick={() => onSelectTab('3d_lab')}
          className="glass-panel glass-card-hover rounded-2xl border border-[#C9A24B]/30 p-6 shadow-xl cursor-pointer flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#DFC17B]">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#DFC17B] uppercase tracking-wider block">Interactive Sandbox</span>
              <h3 className="text-lg font-bold text-white group-hover:text-[#DFC17B] transition-colors">
                3D & 2D Virtual Simulation Laboratory
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Directly manipulate full procedural dental arches with color bracket ligatures, articulated TMJ condyle-fossa movements,
              live 2D cephalometric calipers, BSI incisor cross-sections, and smile arc analyzers.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs font-bold text-[#DFC17B]">
            <span>Open All 6 Interactive Simulators</span>
            <ArrowRight className="w-4 h-4 text-[#C9A24B]" />
          </div>
        </div>

        {/* Module 4: Clinical Cases & Exam */}
        <div
          onClick={() => onSelectTab('cases')}
          className="glass-panel glass-card-hover rounded-2xl border border-[#C9A24B]/30 p-6 shadow-xl cursor-pointer flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#DFC17B]">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#DFC17B] uppercase tracking-wider block">Clinical Application</span>
              <h3 className="text-lg font-bold text-white group-hover:text-[#DFC17B] transition-colors">
                Virtual Patient Cases & Board Review Quiz
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Step into the virtual clinic to diagnose 3 full orthodontic patient cases, calculate overjet/overbite,
              evaluate Gillick competence, and test your exam mastery with 10 curriculum questions.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs font-bold text-[#DFC17B]">
            <span>Diagnose Virtual Patients</span>
            <ArrowRight className="w-4 h-4 text-[#C9A24B]" />
          </div>
        </div>
      </div>
    </div>
  );
};
