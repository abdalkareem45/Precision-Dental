import React from 'react';
import {
  Boxes,
  Stethoscope,
  Table2,
  GitCommit,
  HelpCircle,
  Award,
  GraduationCap,
  Bell,
  Sparkles,
  Activity,
  BookOpen,
  Menu,
  X,
  FileCheck2,
  Heart,
  Pill,
  Compass
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export type NavTab =
  | 'kareem_lectures'
  | 'boneloss'
  | 'furcation'
  | 'cpg_guidelines'
  | 'med_compromised'
  | 'med_compromised_1'
  | 'med_compromised_2'
  | 'mechanics'
  | 'laboratory'
  | 'sandbox'
  | 'diagnostics'
  | 'staging'
  | 'treatment'
  | 'quiz'
  | 'cases'
  | 'dashboard';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  streakDays?: number;
  remindersCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  streakDays = 5,
  remindersCount = 3
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'boneloss', label: '1. Bone Loss', icon: <Activity className="w-4 h-4 text-[#dfbe6e]" />, badge: '5th Year PDF' },
    { id: 'furcation', label: '2. Furcation I', icon: <Compass className="w-4 h-4 text-cyan-400" />, badge: 'Dr. Maha Shukri' },
    { id: 'cpg_guidelines', label: '3. CPG Guidelines', icon: <FileCheck2 className="w-4 h-4 text-[#38bdf8]" />, badge: 'Dr. Alaa Omran' },
    { id: 'med_compromised_1', label: '4. Med Comp I', icon: <Heart className="w-4 h-4 text-rose-400" />, badge: 'Dr. Maha Shukri' },
    { id: 'med_compromised_2', label: '5. Med Comp II', icon: <Pill className="w-4 h-4 text-purple-400" />, badge: 'Dr. Maha Shukri' },
    { id: 'staging', label: '6. Staging Matrix', icon: <Table2 className="w-4 h-4 text-[#C9A24B]" />, badge: '2018 EFP' },
    { id: 'treatment', label: '7. Treatment Plans', icon: <GitCommit className="w-4 h-4 text-[#38bdf8]" />, badge: 'Stage IV' },
    { id: 'mechanics', label: '8. Visual Mechanics', icon: <Sparkles className="w-4 h-4 text-[#38bdf8]" />, badge: 'Biophysics' },
    { id: 'kareem_lectures', label: 'Curriculum Hub', icon: <BookOpen className="w-4 h-4 text-[#C9A24B]" />, badge: 'Master Hub' },
    { id: 'laboratory', label: '3D Anatomy Lab', icon: <Boxes className="w-4 h-4 text-[#60a5fa]" />, badge: '32 Teeth' },
    { id: 'sandbox', label: 'Perio Sandbox', icon: <Boxes className="w-4 h-4 text-[#9aa3b2]" /> },
    { id: 'diagnostics', label: 'Clinical Exam', icon: <Stethoscope className="w-4 h-4 text-rose-400" /> },
    { id: 'quiz', label: 'Board Quiz', icon: <HelpCircle className="w-4 h-4 text-purple-400" />, badge: '20 MCQs' },
    { id: 'cases', label: 'Board Cases', icon: <Award className="w-4 h-4 text-emerald-400" /> },
    { id: 'dashboard', label: 'Student Quotas', icon: <GraduationCap className="w-4 h-4 text-[#dfbe6e]" />, badge: '5th Stage' }
  ];

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B1F4D]/95 backdrop-blur-xl border-b border-[#E6E8EC]/15 shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Official Precision Dental Brand Logo with Responsive Scaling */}
          <div className="flex items-center gap-3">
            <BrandLogo
              size="md"
              showText={true}
              showTagline={false}
              showArabic={true}
              theme="dark"
              onClick={() => onSelectTab('kareem_lectures')}
              className="hover:opacity-95 transition-opacity"
            />

            {/* Tagline for medium screens up */}
            <div className="hidden 2xl:flex flex-col border-l border-[#E6E8EC]/20 pl-3">
              <span className="text-[11px] font-bold text-[#C9A24B] tracking-wider uppercase">
                Precision in Every Smile
              </span>
              <span className="text-[9px] text-[#E6E8EC]/70">
                Advanced Dentistry for a Brighter Tomorrow
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id || (activeTab === 'med_compromised' && item.id === 'med_compromised_1');
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold font-sans transition-all flex items-center gap-2 relative ${
                    isActive
                      ? 'bg-[#1B3A8C] text-[#FAF8F3] border border-[#C9A24B]/60 shadow-md shadow-[#0B1F4D]'
                      : 'text-[#E6E8EC]/80 hover:text-[#FAF8F3] hover:bg-[#102a6b]/70 hover:border hover:border-[#C9A24B]/30'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] bg-[#071433] text-[#C9A24B] border border-[#C9A24B]/30 px-1.5 py-0.2 rounded font-mono font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Status Indicators & Companion Avatar */}
          <div className="flex items-center gap-2.5">
            {/* Daily Streak Badge */}
            <button
              onClick={() => onSelectTab('dashboard')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#071433] border border-[#E6E8EC]/20 text-xs text-[#FAF8F3] hover:border-[#C9A24B] transition-colors"
              title="Daily Study Streak"
            >
              <span className="text-[#C9A24B] font-bold">🔥</span>
              <span className="font-mono text-[#FAF8F3] font-semibold">{streakDays} Day Streak</span>
            </button>

            {/* Notifications */}
            <button
              onClick={() => onSelectTab('dashboard')}
              className="relative p-2 rounded-xl bg-[#071433] border border-[#E6E8EC]/20 text-[#E6E8EC] hover:text-[#C9A24B] hover:border-[#C9A24B]/50 transition-colors"
              title="View Study Reminders"
            >
              <Bell className="w-4 h-4 text-[#C9A24B]" />
              {remindersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center">
                  {remindersCount}
                </span>
              )}
            </button>

            {/* Profile Avatar Companion Badge */}
            <button
              onClick={() => onSelectTab('dashboard')}
              className="hidden md:flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-xl bg-[#102a6b] border border-[#C9A24B]/40 hover:border-[#C9A24B] transition"
              title="Precision Dental Companion Profile"
            >
              <BrandLogo size="xs" showText={false} showArabic={false} />
              <div className="text-left">
                <span className="block text-[11px] font-bold text-[#FAF8F3] leading-none">Senior Perio</span>
                <span className="text-[9px] text-[#C9A24B] font-mono leading-none">5th Stage</span>
              </div>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-[#071433] border border-[#E6E8EC]/20 text-[#E6E8EC] hover:text-[#FAF8F3] hover:border-[#C9A24B]/50 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#C9A24B]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Medium Screen Secondary Nav Bar */}
        <div className="hidden lg:flex xl:hidden overflow-x-auto py-2 border-t border-[#E6E8EC]/10 gap-1.5 scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#1B3A8C] text-[#FAF8F3] border border-[#C9A24B]/60'
                    : 'text-[#E6E8EC]/80 hover:text-[#FAF8F3] hover:bg-[#102a6b]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#071433] border-b border-[#E6E8EC]/20 px-4 py-4 space-y-1.5">
          <div className="pb-3 mb-2 border-b border-[#E6E8EC]/10 flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#C9A24B] uppercase tracking-wider font-sans">
              Precision in Every Smile
            </span>
            <span dir="rtl" className="text-xs font-arabic font-bold text-[#dfbe6e]">
              دقّة الأسنان
            </span>
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                  isActive
                    ? 'bg-[#1B3A8C] text-[#FAF8F3] border border-[#C9A24B]/50'
                    : 'text-[#E6E8EC]/90 hover:bg-[#102a6b]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] bg-[#0B1F4D] text-[#C9A24B] border border-[#C9A24B]/30 px-2 py-0.5 rounded font-mono font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
