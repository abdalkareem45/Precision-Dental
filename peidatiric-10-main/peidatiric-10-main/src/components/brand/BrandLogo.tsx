import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  theme?: 'dark' | 'light';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
  theme = 'light',
}) => {
  const iconDimensions = {
    sm: { w: 32, h: 32 },
    md: { w: 46, h: 46 },
    lg: { w: 60, h: 60 },
    xl: { w: 84, h: 84 },
  }[size];

  const textColor = theme === 'dark' ? 'text-white' : 'text-[#0B1F4D]';
  const subColor = theme === 'dark' ? 'text-[#C9A24B]' : 'text-[#C9A24B]';

  return (
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
      {/* Precision Dental 3D Gold & Royal Blue Emblem */}
      <div
        className="relative flex-shrink-0 drop-shadow-md"
        style={{ width: iconDimensions.w, height: iconDimensions.h }}
      >
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="pdGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DFBF6D" />
              <stop offset="45%" stopColor="#C9A24B" />
              <stop offset="75%" stopColor="#8F6E22" />
              <stop offset="100%" stopColor="#B38930" />
            </linearGradient>

            <linearGradient id="pdBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2554C7" />
              <stop offset="50%" stopColor="#1B3A8C" />
              <stop offset="100%" stopColor="#0B1F4D" />
            </linearGradient>

            <filter id="pdGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#C9A24B" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Golden Tooth Outline & Body */}
          <path
            d="M 32 28 C 32 16, 45 14, 58 24 C 62 27, 68 27, 72 24 C 85 14, 98 16, 98 28 C 98 42, 94 62, 88 88 C 85 99, 78 102, 72 96 C 67 90, 64 68, 60 68 C 56 68, 53 90, 48 96 C 42 102, 35 99, 32 88 C 26 62, 22 42, 32 28 Z"
            fill="url(#pdBlueGrad)"
            stroke="url(#pdGoldGrad)"
            strokeWidth="5"
            strokeLinejoin="round"
            filter="url(#pdGlow)"
          />

          {/* Dynamic Golden Accent Ribbon */}
          <path
            d="M 18 64 C 28 72, 45 74, 62 60 C 78 48, 92 38, 98 24"
            fill="none"
            stroke="url(#pdGoldGrad)"
            strokeWidth="4.5"
            strokeLinecap="round"
          />

          {/* Upward Royal Blue & Gold Arrow Through the Tooth */}
          <path
            d="M 40 76 L 76 34 L 68 33 L 88 26 L 86 46 L 79 38 L 46 80 Z"
            fill="url(#pdGoldGrad)"
          />
          <path
            d="M 42 74 L 74 38 L 68 37 L 84 31 L 82 47 L 76 41 L 47 77 Z"
            fill="url(#pdBlueGrad)"
          />

          {/* Precision Star / Dot at Top-Right */}
          <circle cx="94" cy="18" r="4.5" fill="url(#pdGoldGrad)" />
          <circle cx="94" cy="18" r="2.5" fill="#FAF8F3" />
        </svg>
      </div>

      {/* Typography with English & Arabic from user brand guidelines */}
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline gap-2">
          <span
            className={`font-montserrat font-extrabold tracking-wider ${textColor} uppercase ${
              size === 'sm'
                ? 'text-sm tracking-normal'
                : size === 'md'
                ? 'text-base sm:text-lg tracking-wider'
                : size === 'lg'
                ? 'text-xl sm:text-2xl tracking-widest'
                : 'text-2xl sm:text-3xl'
            }`}
          >
            PRECISION <span className="text-[#C9A24B]">DENTAL</span>
          </span>
          <span
            className={`font-tajawal font-bold text-[#1B3A8C] ${
              size === 'sm'
                ? 'text-xs'
                : size === 'md'
                ? 'text-sm sm:text-base'
                : size === 'lg'
                ? 'text-lg sm:text-xl'
                : 'text-xl sm:text-2xl'
            }`}
            dir="rtl"
          >
            دقة الأسنان
          </span>
        </div>

        {showSubtitle && size !== 'sm' && (
          <p className={`font-montserrat text-[10px] sm:text-xs font-semibold tracking-wider ${subColor} uppercase -mt-0.5`}>
            Advanced Pediatric Dentistry & Trauma Atlas
          </p>
        )}
      </div>
    </div>
  );
};
