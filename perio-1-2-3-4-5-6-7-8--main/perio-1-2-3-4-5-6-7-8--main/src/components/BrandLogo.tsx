import React from 'react';

export interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'avatar';
  showText?: boolean;
  showTagline?: boolean;
  showArabic?: boolean;
  theme?: 'dark' | 'light' | 'gold';
  className?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  showTagline = false,
  showArabic = true,
  theme = 'dark',
  className = '',
  onClick
}) => {
  // Dimension mapping
  const sizeMap = {
    xs: { icon: 26, viewBox: 100, text: 'text-xs', arabic: 'text-[9px]', sub: 'text-[8px]' },
    sm: { icon: 34, viewBox: 100, text: 'text-sm', arabic: 'text-[10px]', sub: 'text-[9px]' },
    md: { icon: 44, viewBox: 100, text: 'text-lg', arabic: 'text-xs', sub: 'text-[10px]' },
    lg: { icon: 60, viewBox: 100, text: 'text-2xl', arabic: 'text-sm', sub: 'text-xs' },
    xl: { icon: 84, viewBox: 100, text: 'text-3xl', arabic: 'text-base', sub: 'text-sm' },
    avatar: { icon: 48, viewBox: 100, text: 'text-base', arabic: 'text-xs', sub: 'text-[10px]' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Official Precision Dental Icon Badge */}
      <div
        className={`relative flex items-center justify-center shrink-0 rounded-2xl p-1 transition-transform duration-300 ${
          size === 'avatar'
            ? 'rounded-full ring-2 ring-[#C9A24B] shadow-lg shadow-[#0B1F4D]/50 bg-gradient-to-br from-[#0B1F4D] to-[#1B3A8C]'
            : 'rounded-2xl shadow-md'
        }`}
        style={{
          width: currentSize.icon + 8,
          height: currentSize.icon + 8,
          background:
            theme === 'light'
              ? 'linear-gradient(135deg, #FAF8F3 0%, #E6E8EC 100%)'
              : 'linear-gradient(135deg, #0B1F4D 0%, #1B3A8C 100%)',
          border: '1.5px solid #C9A24B'
        }}
        title="Precision Dental — Precision in Every Smile"
      >
        <svg
          width={currentSize.icon}
          height={currentSize.icon}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
        >
          <defs>
            {/* Royal Blue Linear Fill */}
            <linearGradient id="pdToothFill" x1="20" y1="15" x2="80" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2449ab" />
              <stop offset="60%" stopColor="#1B3A8C" />
              <stop offset="100%" stopColor="#0B1F4D" />
            </linearGradient>

            {/* Precision Gold Stroke */}
            <linearGradient id="pdGoldStroke" x1="15" y1="10" x2="85" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#dfbe6e" />
              <stop offset="50%" stopColor="#C9A24B" />
              <stop offset="100%" stopColor="#b48e3a" />
            </linearGradient>

            {/* Trajectory Arrow Gradient */}
            <linearGradient id="pdArrowGrad" x1="10" y1="85" x2="88" y2="20" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FAF8F3" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#C9A24B" />
              <stop offset="100%" stopColor="#FFDE82" />
            </linearGradient>

            {/* Drop Shadow for Gold Trajectory */}
            <filter id="pdGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#C9A24B" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Geometric Accent Pattern: Precision Crosshairs & Alignment Marks */}
          <g opacity="0.4" stroke="#C9A24B" strokeWidth="0.75" strokeDasharray="1.5 2">
            {/* Concentric / Isometric precision ticks */}
            <circle cx="50" cy="50" r="44" strokeWidth="0.5" />
            <line x1="50" y1="3" x2="50" y2="15" />
            <line x1="50" y1="85" x2="50" y2="97" />
            <line x1="3" y1="50" x2="15" y2="50" />
            <line x1="85" y1="50" x2="97" y2="50" />
            {/* Diamond corner accents */}
            <path d="M 50 6 L 53 9 L 50 12 L 47 9 Z" fill="#C9A24B" />
          </g>

          {/* 1. Gold-Bordered Royal Blue Tooth (Official Stylized Tooth Anatomy) */}
          <path
            d="M 50 16 
               C 62 16, 73 21, 74 34 
               C 75 42, 70 48, 66 54 
               C 62 60, 60 70, 64 84 
               C 64.5 86, 61 88, 59 86 
               C 56 83, 53 74, 50 67 
               C 47 74, 44 83, 41 86 
               C 39 88, 35.5 86, 36 84 
               C 40 70, 38 60, 34 54 
               C 30 48, 25 42, 26 34 
               C 27 21, 38 16, 50 16 Z"
            fill="url(#pdToothFill)"
            stroke="url(#pdGoldStroke)"
            strokeWidth="3.2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Inner Tooth Facet / Geometric Accent (Subtle Enamel Crest) */}
          <path
            d="M 37 32 
               C 42 27, 47 26, 50 26 
               C 53 26, 58 27, 63 32 
               C 59 36, 53 38, 50 38 
               C 47 38, 41 36, 37 32 Z"
            fill="#FAF8F3"
            opacity="0.22"
          />

          {/* 2. Precision Gold Dynamic Arrow Trajectory (Trajectory of Excellence & Advance) */}
          <path
            d="M 16 76 
               C 26 84, 44 82, 60 70 
               C 74 59, 82 42, 85 24"
            fill="none"
            stroke="url(#pdArrowGrad)"
            strokeWidth="3.6"
            strokeLinecap="round"
            filter="url(#pdGlow)"
          />

          {/* Trajectory Arrow Head (Precision Direction Upward Right) */}
          <path
            d="M 85 24 L 75 25 L 82 32 Z"
            fill="#FFDE82"
            stroke="#C9A24B"
            strokeWidth="1.2"
            filter="url(#pdGlow)"
          />

          {/* Spark of Precision (Gold Star / Dot at trajectory apex) */}
          <circle cx="85" cy="24" r="2.5" fill="#FAF8F3" />
        </svg>
      </div>

      {/* Typography & Brand Labels */}
      {showText && (
        <div className="flex flex-col justify-center leading-tight">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`font-black tracking-tight font-sans ${currentSize.text} ${
                theme === 'light' ? 'text-[#0B1F4D]' : 'text-[#FAF8F3]'
              }`}
            >
              Precision <span className="text-[#C9A24B]">Dental</span>
            </span>

            {/* Arabic Branding Subheading (دقّة الأسنان) */}
            {showArabic && (
              <span
                dir="rtl"
                className={`font-bold font-arabic px-2 py-0.5 rounded-md border ${currentSize.arabic} ${
                  theme === 'light'
                    ? 'bg-[#E6E8EC]/80 text-[#1B3A8C] border-[#1B3A8C]/30'
                    : 'bg-[#0B1F4D]/90 text-[#dfbe6e] border-[#C9A24B]/40'
                }`}
                title="دقّة الأسنان"
              >
                دقّة الأسنان
              </span>
            )}
          </div>

          {/* Official Tagline */}
          {showTagline && (
            <p
              className={`text-slate-400 font-sans tracking-wide mt-0.5 ${currentSize.sub} ${
                theme === 'light' ? 'text-slate-600' : 'text-[#E6E8EC]/80'
              }`}
            >
              Precision in Every Smile • Advanced Dentistry for a Brighter Tomorrow
            </p>
          )}
        </div>
      )}
    </div>
  );
};
