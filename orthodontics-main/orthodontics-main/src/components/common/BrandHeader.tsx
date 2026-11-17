/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import type { LectureTab } from '../../types/ortho';
import { additionalLectures, tabHashes } from '../../navigation';
import { BrandLogo } from './BrandLogo';
import { ArrowLeft, Stethoscope } from 'lucide-react';

interface BrandHeaderProps {
  activeTab: LectureTab;
  onSelectTab: (tab: LectureTab) => void;
  onOpenCaseStudy: () => void;
}

export const BrandHeader: React.FC<BrandHeaderProps> = ({ activeTab, onSelectTab, onOpenCaseStudy }) => {
  const navRef = useRef<HTMLElement>(null);
  const navItems: { id: LectureTab; label: string }[] = [
    { id: 'overview', label: 'Academy Hub' },
    { id: 'lecture1_2', label: 'Lec 1 & 2: History & Exam' },
    { id: 'lecture3', label: 'Lec 3: Occlusion' },
    ...additionalLectures.map(lecture => ({ id: lecture.id, label: `Lec ${lecture.number}: ${lecture.title}` })),
    { id: '3d_lab', label: '3D & 2D Virtual Lab' },
    { id: 'cases', label: 'Clinical Cases' },
    { id: 'quiz', label: 'Board Review' },
  ];

  useEffect(() => {
    const nav = navRef.current;
    const selected = nav?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!nav || !selected) return;
    // Reveal the selected item without scrolling the document or moving focus.
    const bounds = selected.getBoundingClientRect();
    const viewport = nav.getBoundingClientRect();
    if (bounds.left < viewport.left) nav.scrollLeft -= viewport.left - bounds.left;
    else if (bounds.right > viewport.right) nav.scrollLeft += bounds.right - viewport.right;
  }, [activeTab]);

  return (
    <header className="sticky top-0 z-50 bg-[#071330]/95 backdrop-blur-xl border-b border-[#C9A24B]/20 shadow-lg">
      <div className="h-1 bg-linear-to-r from-[#0B1F4D] via-[#C9A24B] to-[#1B3A8C]" />
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 py-3">
          <a href="#" aria-label="Orthodontics academy hub" onClick={event => { event.preventDefault(); onSelectTab('overview'); }} className="rounded-lg focus-visible:outline-2 focus-visible:outline-[#C9A24B]">
            <BrandLogo size="md" inverted />
          </a>
          <div className="flex flex-wrap items-center gap-2">
            <a href="../index.html" className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-xs font-semibold text-[#DFC17B] hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#C9A24B]">
              <ArrowLeft size={14} aria-hidden="true" /> All subjects
            </a>
            <button type="button" onClick={onOpenCaseStudy} className="inline-flex items-center gap-1 rounded-lg bg-[#C9A24B] px-3 py-2 text-xs font-bold text-[#071330] hover:bg-[#DFC17B] focus-visible:outline-2 focus-visible:outline-white">
              <Stethoscope size={14} aria-hidden="true" /> Clinical cases
            </button>
          </div>
        </div>
        <nav ref={navRef} aria-label="Orthodontics lectures and tools" className="flex min-w-0 items-center gap-2 overflow-x-auto border-t border-white/10 py-3">
          {navItems.map(item => (
            <a key={item.id} href={tabHashes[item.id]} aria-current={activeTab === item.id ? 'page' : undefined}
              onClick={event => { event.preventDefault(); onSelectTab(item.id); }}
              className="shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10 aria-[current=page]:bg-[#C9A24B] aria-[current=page]:text-[#071330] focus-visible:outline-2 focus-visible:outline-[#C9A24B]">
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
};
