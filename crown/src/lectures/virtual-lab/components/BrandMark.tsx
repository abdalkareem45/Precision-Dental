import React from 'react';

interface BrandMarkProps {
  compact?: boolean;
}

export const BrandMark: React.FC<BrandMarkProps> = ({ compact = false }) => {
  return (
    <div className="flex items-center gap-3 shrink-0 select-none">
      <svg
        width={compact ? 32 : 38}
        height={compact ? 32 : 38}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="pdGoldGrad" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#DFBA67" />
            <stop offset="55%" stopColor="#C9A24B" />
            <stop offset="100%" stopColor="#9A7629" />
          </linearGradient>
          <linearGradient id="pdRoyalGrad" x1="12" y1="10" x2="36" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1B3A8C" />
            <stop offset="100%" stopColor="#0B1F4D" />
          </linearGradient>
        </defs>
        <path
          d="M14.5 9C10.5 9 7.5 13 8.2 19.2C8.9 25.5 11.4 31.8 13.7 37.3C14.7 39.7 17.8 39.7 18.8 37.3L22.2 29.2C22.9 27.6 25.1 27.6 25.8 29.2L29.2 37.3C30.2 39.7 33.3 39.7 34.3 37.3C36.6 31.8 39.1 25.5 39.8 19.2C40.5 13 37.5 9 33.5 9C30.2 9 27.3 11 24 11C20.7 11 17.8 9 14.5 9Z"
          fill="url(#pdRoyalGrad)"
          stroke="url(#pdGoldGrad)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M6.5 23.5C14.5 28.5 28.5 24 38.5 11.5"
          stroke="url(#pdGoldGrad)"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path
          d="M33.2 11.2L39.8 9.8L38.2 16.4"
          stroke="url(#pdGoldGrad)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="41.5" cy="7.5" r="2.2" fill="#C9A24B" />
      </svg>
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-1.5">
          <span className="font-bold tracking-tight text-navy text-base sm:text-lg whitespace-nowrap">
            PRECISION DENTAL
          </span>
        </div>
        <span className="text-[11px] font-medium tracking-wide text-gold uppercase mt-0.5 whitespace-nowrap">
          Crown &amp; Bridge Simulation Lab
        </span>
      </div>
    </div>
  );
};
