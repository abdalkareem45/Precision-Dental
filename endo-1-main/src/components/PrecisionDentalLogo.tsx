import React from 'react';

interface PrecisionDentalLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'avatar';
  showText?: boolean;
  showArabic?: boolean;
  showTagline?: boolean;
  className?: string;
}

export const PrecisionDentalLogo: React.FC<PrecisionDentalLogoProps> = ({
  size = 'md',
  showText = true,
  showArabic = true,
  showTagline = true,
  className = '',
}) => {
  const getIconDimensions = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8';
      case 'avatar':
        return 'w-10 h-10';
      case 'lg':
        return 'w-14 h-14';
      case 'md':
      default:
        return 'w-10 h-10';
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Official Precision Dental Emblem */}
      <div className={`relative shrink-0 ${getIconDimensions()}`}>
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_4px_12px_rgba(201,162,75,0.35)]"
        >
          {/* Outer Geometric Frame Accent */}
          <rect
            x="4"
            y="4"
            width="112"
            height="112"
            rx="28"
            fill="url(#deepNavyBg)"
            stroke="url(#precisionGoldGrad)"
            strokeWidth="3.5"
          />

          {/* Luxury Geometric Diamond Lattice Background */}
          <g opacity="0.18">
            <path
              d="M60 12 L108 60 L60 108 L12 60 Z"
              stroke="url(#precisionGoldGrad)"
              strokeWidth="1.5"
              fill="none"
            />
            <circle cx="60" cy="60" r="38" stroke="#C9A24B" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="60" y1="12" x2="60" y2="108" stroke="#C9A24B" strokeWidth="0.8" />
            <line x1="12" y1="60" x2="108" y2="60" stroke="#C9A24B" strokeWidth="0.8" />
          </g>

          {/* Royal Blue Anatomical Tooth Base with Gold Perimeter */}
          <path
            d="M38 34 C38 24 50 25 60 30 C70 25 82 24 82 34 C82 46 80 58 75 75 C72 85 68 96 64 96 C61 96 59 86 57 78 C55 86 53 96 50 96 C46 96 42 85 39 75 C34 58 38 46 38 34 Z"
            fill="url(#royalBlueToothGrad)"
            stroke="url(#precisionGoldGrad)"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />

          {/* Internal Tooth Pulp/Enamel Contour */}
          <path
            d="M48 38 C52 35 57 37 60 40 C63 37 68 35 72 38 C74 46 72 55 69 66 C67 74 65 83 63 83 C61 83 59 75 58 70 C57 75 55 83 53 83 C51 83 49 74 47 66 C44 55 46 46 48 38 Z"
            fill="#0B1F4D"
            opacity="0.65"
          />

          {/* Gold Ascending Arrow Trajectory (Symbol of Progress & Precision) */}
          <g>
            <path
              d="M26 84 C38 72 52 56 76 38"
              stroke="url(#precisionGoldGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Arrow Head */}
            <path
              d="M66 36 L78 37 L77 49"
              stroke="url(#precisionGoldGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Micro Sparkle Node */}
            <circle cx="78" cy="37" r="3.5" fill="#FAF8F3" />
          </g>

          {/* Small Geometric Gold Stars / Precision Marks */}
          <circle cx="36" cy="36" r="2" fill="#C9A24B" />
          <circle cx="84" cy="36" r="2" fill="#C9A24B" />

          {/* Gradients */}
          <defs>
            <linearGradient id="deepNavyBg" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0B1F4D" />
              <stop offset="1" stopColor="#061230" />
            </linearGradient>

            <linearGradient id="royalBlueToothGrad" x1="38" y1="24" x2="82" y2="96" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2854BF" />
              <stop offset="0.6" stopColor="#1B3A8C" />
              <stop offset="1" stopColor="#102563" />
            </linearGradient>

            <linearGradient id="precisionGoldGrad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F4E7C5" />
              <stop offset="0.35" stopColor="#C9A24B" />
              <stop offset="0.8" stopColor="#DFBA67" />
              <stop offset="1" stopColor="#A58234" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Typography & Brand Slogans */}
      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-headings font-extrabold tracking-tight text-white text-base leading-none">
              PRECISION <span className="text-[#C9A24B]">DENTAL</span>
            </span>

            {/* Arabic Secondary Element */}
            {showArabic && (
              <span
                dir="rtl"
                className="font-arabic font-bold text-xs px-2 py-0.5 rounded-md bg-[#1B3A8C]/50 text-[#C9A24B] border border-[#C9A24B]/30 tracking-normal"
              >
                دقّة الأسنان
              </span>
            )}
          </div>

          {/* Brand Taglines */}
          {showTagline && (
            <p className="text-[10px] text-[#E6E8EC]/85 font-medium tracking-wide mt-0.5 flex items-center gap-1.5 whitespace-nowrap">
              <span>Precision in Every Smile</span>
              <span className="text-[#C9A24B] hidden xl:inline">•</span>
              <span className="text-slate-300 hidden xl:inline">Advanced Dentistry for a Brighter Tomorrow</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
};
