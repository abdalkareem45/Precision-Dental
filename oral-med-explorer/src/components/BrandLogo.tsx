import React from 'react';

interface BrandLogoProps {
  compact?: boolean;
  showArabic?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ compact = false, showArabic = false }) => {
  return (
    <div className="inline-flex items-center gap-2.5 select-none">
      <svg
        width={compact ? 32 : 40}
        height={compact ? 32 : 40}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="pd-gold-grad" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E4C16E" />
            <stop offset="50%" stopColor="#C9A24B" />
            <stop offset="100%" stopColor="#9B7526" />
          </linearGradient>
          <linearGradient id="pd-blue-grad" x1="12" y1="50" x2="54" y2="12" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0B1F4D" />
            <stop offset="55%" stopColor="#1B3A8C" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
        {/* Stylized Precision Dental tooth silhouette */}
        <path
          d="M21 12C14.5 12 10 17.2 10 24.2C10 31.8 13.8 39.2 15.6 47.4C16.7 52.3 18.7 55 21.3 55C24.2 55 25.5 48.2 28.4 42.6C29.7 40.1 34.3 40.1 35.6 42.6C38.5 48.2 39.8 55 42.7 55C45.3 55 47.3 52.3 48.4 47.4C50.2 39.2 54 31.8 54 24.2C54 17.2 49.5 12 43 12C38.2 12 35.4 14.3 32 14.3C28.6 14.3 25.8 12 21 12Z"
          fill="url(#pd-blue-grad)"
          stroke="url(#pd-gold-grad)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Rising Precision Gold & Royal Blue diagnostic arc arrow */}
        <path
          d="M9 36.5C19 42.5 34.5 34.5 47.5 16.5"
          stroke="url(#pd-gold-grad)"
          strokeWidth="4.2"
          strokeLinecap="round"
        />
        <path
          d="M40.5 16.5L50.5 13L48.5 23.2L44.8 19.6L40.5 16.5Z"
          fill="url(#pd-gold-grad)"
        />
        <circle cx="54.5" cy="9.5" r="2.8" fill="url(#pd-gold-grad)" />
      </svg>

      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-1.5">
          <span className="font-display font-extrabold tracking-tight text-sm sm:text-base text-[#0B1F4D] dark:text-[#F9FAFB]">
            PRECISION
          </span>
          <span className="font-display font-bold tracking-wider text-xs sm:text-sm text-[#C9A24B]">
            DENTAL
          </span>
        </div>
        {showArabic ? (
          <span className="font-arabic text-xs text-[#1B3A8C] dark:text-[#93C5FD] mt-0.5" dir="rtl">
            دقة الأسنان • مستكشف طب الفم
          </span>
        ) : (
          <span className="text-[11px] font-medium tracking-wide text-[#0B1F4D]/70 dark:text-slate-400">
            Oral Medicine Explorer
          </span>
        )}
      </div>
    </div>
  );
};
