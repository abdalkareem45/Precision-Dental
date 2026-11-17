interface BrandLogoProps {
  className?: string;
}

export function BrandLogo({ className = 'w-9 h-9' }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="pd-gold" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E6C672" />
          <stop offset="50%" stopColor="#C9A24B" />
          <stop offset="100%" stopColor="#9A7524" />
        </linearGradient>
        <linearGradient id="pd-blue" x1="16" y1="16" x2="50" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#264CB5" />
          <stop offset="100%" stopColor="#0B1F4D" />
        </linearGradient>
      </defs>
      {/* Tooth silhouette in Deep Navy / Royal Blue with Gold rim */}
      <path
        d="M17 16C11.5 16 8 21.2 9.2 27.6C10.5 34.4 13.8 47.5 17.5 52.8C19.6 55.8 22.8 55.2 24.4 51.2L29.1 40.6C30.4 37.8 33.6 37.8 34.9 40.6L39.6 51.2C41.2 55.2 44.4 55.8 46.5 52.8C50.2 47.5 53.5 34.4 54.8 27.6C56 21.2 52.5 16 47 16C42.2 16 37.6 18.4 32 18.4C26.4 18.4 21.8 16 17 16Z"
        fill="url(#pd-blue)"
        stroke="url(#pd-gold)"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      {/* Sweeping upward arrow crest inspired by Precision Dental brand mark */}
      <path
        d="M8 31.5C17 38.5 34.5 32.5 47.5 16.5"
        stroke="url(#pd-gold)"
        strokeWidth="4.2"
        strokeLinecap="round"
      />
      <path
        d="M41.5 15.5L51.5 12L49.5 22.5L46.2 18.6L41.5 15.5Z"
        fill="#1B3A8C"
        stroke="url(#pd-gold)"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="55.5" cy="9" r="2.6" fill="url(#pd-gold)" />
    </svg>
  );
}
