/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LectureTab } from '../../types/ortho';
import { BrandLogo } from './BrandLogo';
import { BookOpen, Sparkles, Box, Stethoscope, HelpCircle, GraduationCap } from 'lucide-react';

interface BrandHeaderProps {
  activeTab: LectureTab;
  onSelectTab: (tab: LectureTab) => void;
  onOpenCaseStudy: () => void;
}

export const BrandHeader: React.FC<BrandHeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenCaseStudy,
}) => {
  const navItems: { id: LectureTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Academy Hub', icon: GraduationCap },
    { id: 'lecture1_2', label: 'Lec 1 & 2: History & Exam', icon: BookOpen },
    { id: 'lecture3', label: 'Lec 3: Occlusion', icon: Sparkles },
    { id: '3d_lab', label: '3D & 2D Virtual Lab', icon: Box },
    { id: 'cases', label: 'Clinical Cases', icon: Stethoscope },
    { id: 'quiz', label: 'Board Review', icon: HelpCircle },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#071330]/90 backdrop-blur-xl border-b border-[#C9A24B]/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      {/* Top Gold Accent Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#0B1F4D] via-[#C9A24B] to-[#1B3A8C]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-20">
          {/* Zone 1: Brand Wordmark */}
          <div 
            onClick={() => onSelectTab('overview')} 
            className="cursor-pointer hover:opacity-95 transition-opacity shrink-0"
          >
            <BrandLogo size="md" inverted={true} />
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 overflow-x-auto py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#C9A24B] to-[#B8892E] text-[#071330] shadow-md font-extrabold'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#071330]' : 'text-[#DFC17B]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action CTA */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenCaseStudy}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#C9A24B] to-[#B8892E] hover:from-[#DFC17B] hover:to-[#C9A24B] text-[#071330] font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all whitespace-nowrap shrink-0 hover:scale-102"
            >
              <Stethoscope className="w-3.5 h-3.5 text-[#071330]" />
              <span className="hidden sm:inline">Clinical Case Station</span>
              <span className="sm:hidden">Case</span>
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Horizontal Scroll Bar */}
        <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto py-2.5 border-t border-white/10 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-tight whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-gradient-to-r from-[#C9A24B] to-[#B8892E] text-[#071330]'
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <Icon className={`w-3 h-3 ${isActive ? 'text-[#071330]' : 'text-[#DFC17B]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
