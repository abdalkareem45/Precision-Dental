import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: number;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '', size = 52 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 drop-shadow-sm ${className}`}
      aria-label="Precision Dental Logo"
    >
      <defs>
        {/* Luxury Gold Linear Gradients */}
        <linearGradient id="goldGradient" x1="10" y1="10" x2="150" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F5DF9E" />
          <stop offset="25%" stopColor="#DFBE72" />
          <stop offset="50%" stopColor="#C9A24B" />
          <stop offset="75%" stopColor="#A88126" />
          <stop offset="100%" stopColor="#7F5F14" />
        </linearGradient>

        <linearGradient id="goldShine" x1="0" y1="0" x2="160" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#B38B2E" />
          <stop offset="50%" stopColor="#F7E6AF" />
          <stop offset="100%" stopColor="#9C7721" />
        </linearGradient>

        {/* Royal Blue Inner Gradient */}
        <linearGradient id="royalBlueGradient" x1="40" y1="30" x2="130" y2="140" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1B3A8C" />
          <stop offset="60%" stopColor="#132B6B" />
          <stop offset="100%" stopColor="#0B1F4D" />
        </linearGradient>

        {/* Arrow Blue Gradient */}
        <linearGradient id="arrowBlueGradient" x1="60" y1="120" x2="140" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1B3A8C" />
          <stop offset="50%" stopColor="#2554B8" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>

        {/* Shadow filter */}
        <filter id="logoShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0B1F4D" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Main Tooth Group */}
      <g filter="url(#logoShadow)">
        {/* Royal Blue Inner Fill Body */}
        <path
          d="M48 46 C48 30, 68 28, 80 40 C92 28, 112 30, 112 46 C112 72, 126 100, 118 128 C114 140, 96 136, 90 114 C86 102, 74 102, 70 114 C64 136, 46 140, 42 128 C34 100, 48 72, 48 46 Z"
          fill="url(#royalBlueGradient)"
        />

        {/* Golden Tooth Perimeter & Outer Contours */}
        <path
          d="M48 42 C48 24, 68 22, 80 34 C92 22, 112 24, 112 42 C112 70, 128 98, 120 130 C115 145, 95 141, 88 116 C85 106, 75 106, 72 116 C65 141, 45 145, 40 130 C32 98, 48 70, 48 42 Z"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Ascending Blue & Gold Precision Arrow (from brand logo) */}
        <path
          d="M62 108 L110 44"
          stroke="url(#arrowBlueGradient)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Arrow head */}
        <polygon
          points="114,36 122,54 100,48"
          fill="#1B3A8C"
          stroke="url(#goldGradient)"
          strokeWidth="2.5"
        />

        {/* Decorative Golden Ribbon / Sash across bottom left tooth */}
        <path
          d="M26 108 C36 122, 60 128, 92 100 C116 78, 134 76, 142 82"
          fill="none"
          stroke="url(#goldShine)"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Small gold sparkle dots / spheres from brand image */}
        <circle cx="128" cy="28" r="4.5" fill="url(#goldGradient)" />
        <circle cx="140" cy="50" r="2.5" fill="#C9A24B" />
        <circle cx="34" cy="75" r="2" fill="#C9A24B" />
      </g>
    </svg>
  );
};
