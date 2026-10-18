import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { LectureId, LectureTab } from '../../types';
import { soundFx } from '../../utils/audio';
import {
  Volume2,
  VolumeX,
  Menu,
  X,
  BookOpen,
  Award,
  Sparkles,
  Search,
} from 'lucide-react';

interface BrandHeaderProps {
  tabs: LectureTab[];
  activeTab: LectureId;
  onSelectTab: (id: LectureId) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const BrandHeader: React.FC<BrandHeaderProps> = ({
  tabs,
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const toggleSound = () => {
    soundFx.enabled = isMuted;
    setIsMuted(!isMuted);
    if (!isMuted) {
      // mute
    } else {
      soundFx.playClick();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0B1F4D] border-b border-[#C9A24B]/30 shadow-lg">
      {/* Top Gold Accent Bar */}
      <div className="h-1 bg-gradient-to-r from-[#C9A24B] via-[#FAF8F3] to-[#C9A24B]" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Brand Identity */}
          <BrandLogo size="md" theme="dark" showSubtitle={true} />

          {/* Right Header Actions: Search, Audio Toggle, Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Input (Hidden on tiny screens) */}
            <div className="relative hidden md:block w-48 lg:w-64">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search topics, trauma, drugs..."
                className="w-full bg-[#1B3A8C]/50 border border-[#C9A24B]/30 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#C9A24B]"
              />
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className="p-2 rounded-xl bg-[#1B3A8C]/70 hover:bg-[#1B3A8C] text-[#C9A24B] border border-[#C9A24B]/30 transition-all text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              title={isMuted ? 'Unmute procedural sound effects' : 'Mute sound effects'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-gray-400" /> : <Volume2 className="w-4 h-4 text-[#C9A24B]" />}
              <span className="hidden sm:inline text-[11px] text-gray-200">
                {isMuted ? 'Muted' : 'Audio On'}
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#1B3A8C]/70 text-white border border-[#C9A24B]/30 transition-all"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop / Tablet Scrollable Tabs Bar */}
        <div className="hidden lg:flex items-center gap-1.5 mt-3 pt-2 border-t border-white/10 overflow-x-auto pb-1 scrollbar-thin">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundFx.playClick();
                  onSelectTab(tab.id);
                }}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#C9A24B] text-[#0B1F4D] shadow-md font-extrabold scale-[1.02]'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{tab.badge}</span>
                <span className="opacity-90 font-medium">| {tab.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0B1F4D] border-t border-white/10 px-4 py-3 space-y-2 animate-in slide-in-from-top-2 duration-200">
          {/* Mobile Search */}
          <div className="relative mb-3">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search pedodontic lectures..."
              className="w-full bg-[#1B3A8C]/50 border border-[#C9A24B]/30 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-gray-400 focus:outline-none"
            />
          </div>

          <div className="text-[10px] uppercase font-bold tracking-wider text-[#C9A24B] mb-1">
            Lectures &amp; Modules:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-[60vh] overflow-y-auto">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    soundFx.playClick();
                    onSelectTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2.5 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-[#C9A24B] text-[#0B1F4D] shadow-md font-black'
                      : 'bg-[#1B3A8C]/40 text-gray-200 hover:bg-[#1B3A8C]'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] opacity-80 uppercase tracking-wide">
                      {tab.badge}
                    </span>
                    <span>{tab.title}</span>
                  </div>
                  <span className="font-tajawal text-xs opacity-75">{tab.arabicTitle}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
