import React from 'react';

export const PrecisionDentalMark: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Gold tooth outer contour */}
    <path
      d="M21 10C14 10 10 16 10 24C10 34 15 41 18 52C19.5 57 24 56 26.5 49C28.5 43.5 30 41 32 41C34 41 35.5 43.5 37.5 49C40 56 44.5 57 46 52C49 41 54 34 54 24C54 16 50 10 43 10C38 10 35 12.5 32 12.5C29 12.5 26 10 21 10Z"
      fill="#1B3A8C"
      stroke="#C9A24B"
      strokeWidth="3.2"
      strokeLinejoin="round"
    />
    {/* Upward precision royal/gold trajectory arrow */}
    <path
      d="M12 37C24 36 37 29 48 16"
      stroke="#C9A24B"
      strokeWidth="4.5"
      strokeLinecap="round"
    />
    <path d="M41 14L52 12L49 23L41 14Z" fill="#C9A24B" />
    {/* Precision Gold sphere accent */}
    <circle cx="53" cy="9" r="3" fill="#C9A24B" />
  </svg>
);
