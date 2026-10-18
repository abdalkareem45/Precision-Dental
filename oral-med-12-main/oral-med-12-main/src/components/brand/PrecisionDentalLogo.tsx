import React from 'react';

interface PrecisionDentalLogoProps {
  compact?: boolean;
  showTagline?: boolean;
  className?: string;
}

export const PrecisionDentalLogo: React.FC<PrecisionDentalLogoProps> = ({
  compact = false,
  showTagline = true,
  className = '',
}) => (
  <div className={`flex items-center gap-2.5 ${className}`}>
    <svg
      viewBox="0 0 64 64"
      aria-label="Precision Dental logo"
      role="img"
      className={`${compact ? 'h-9 w-9' : 'h-11 w-11'} shrink-0`}
    >
      <rect x="2" y="2" width="60" height="60" rx="15" fill="#1B3A8C" stroke="#C9A24B" strokeWidth="3" />
      <path d="M17 17h8v8h-8zM39 17h8v8h-8zM17 39h8v8h-8z" fill="#FAF8F3" opacity=".92" />
      <path d="M32 15c-7 0-12 5-12 13 0 7 4 10 6 14 2 4 1 8 5 8s3-8 7-8 3 8 7 8 3-4 5-8c2-4 6-7 6-14 0-8-5-13-12-13-3 0-5 2-7 2s-4-2-5-2Z" transform="translate(-3 0) scale(.96 1)" fill="#FAF8F3" stroke="#C9A24B" strokeWidth="2" />
      <path d="M13 34c12-2 22-7 34-17" fill="none" stroke="#C9A24B" strokeWidth="2.5" strokeLinecap="round" />
      <path d="m43 14 5 2-4 4" fill="none" stroke="#C9A24B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="51" cy="45" r="2" fill="#C9A24B" />
      <circle cx="45" cy="51" r="1.5" fill="#C9A24B" />
    </svg>
    {!compact && (
      <div className="min-w-0">
        <span className="block truncate font-display text-sm font-bold tracking-tight text-white">Precision Dental</span>
        {showTagline && <span className="block truncate text-[10px] font-medium text-[#C9A24B]">Precision in Every Smile</span>}
        <span lang="ar" dir="rtl" className="block text-[9px] font-arabic font-bold text-white/60">دقّة الأسنان</span>
      </div>
    )}
  </div>
);