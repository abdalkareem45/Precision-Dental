/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  inverted?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  inverted = false,
}) => {
  const iconDimensions = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
  }[size];

  const titleSize = {
    sm: 'text-sm',
    md: 'text-base font-bold tracking-wider',
    lg: 'text-2xl font-bold tracking-widest',
  }[size];

  return (
    <div className="flex items-center gap-3 select-none">
      {/* SVG Emblem recreated faithfully from brand guidelines */}
      <div className={`relative shrink-0 ${iconDimensions}`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DFBF7A" />
              <stop offset="40%" stopColor="#C9A24B" />
              <stop offset="85%" stopColor="#967425" />
              <stop offset="100%" stopColor="#E2C785" />
            </linearGradient>
            <linearGradient id="blueGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0B1F4D" />
              <stop offset="50%" stopColor="#1B3A8C" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#C9A24B" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Golden Stylized Tooth Outline */}
          <path
            d="M 22 36 C 22 20, 36 14, 48 24 C 54 18, 70 14, 76 28 C 82 40, 78 58, 72 76 C 68 88, 60 84, 56 68 C 53 58, 47 58, 44 68 C 40 82, 32 86, 28 74 C 22 58, 22 46, 22 36 Z"
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#goldGlow)"
          />

          {/* Inner Tooth Ridge Texture */}
          <path
            d="M 28 38 C 30 26, 40 22, 47 28 C 53 22, 65 24, 70 34"
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Rising Dynamic Royal Blue Arrow with Gold border */}
          <path
            d="M 16 66 C 26 62, 40 50, 52 38 L 56 46 L 78 18 L 48 24 L 54 30 C 42 42, 30 52, 16 66 Z"
            fill="url(#blueGradient)"
            stroke="url(#goldGradient)"
            strokeWidth="1.5"
          />

          {/* Precision Gold Sphere above Arrow Apex */}
          <circle cx="86" cy="14" r="5" fill="url(#goldGradient)" filter="url(#goldGlow)" />
        </svg>
      </div>

      {/* Brand Typographic Lockup */}
      <div className="flex flex-col">
        <div className="flex items-baseline gap-2">
          <span
            className={`${titleSize} font-extrabold uppercase font-sans ${
              inverted ? 'text-white' : 'text-[#0B1F4D]'
            }`}
          >
            PRECISION <span className="text-[#C9A24B]">DENTAL</span>
          </span>
          <span className="font-arabic font-bold text-sm text-[#C9A24B] hidden sm:inline">
            دقة الأسنان
          </span>
        </div>
        {showSubtitle && (
          <span
            className={`text-[10px] tracking-wider uppercase font-medium ${
              inverted ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            Department of Orthodontics · Precision Dental Academy
          </span>
        )}
      </div>
    </div>
  );
};
