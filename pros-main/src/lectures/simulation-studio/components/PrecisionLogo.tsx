interface PrecisionLogoProps {
  className?: string;
}

export function PrecisionLogo({ className = 'w-12 h-12' }: PrecisionLogoProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="pdGoldGrad" x1="12" y1="10" x2="84" y2="86" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E6C87B" />
          <stop offset="50%" stopColor="#C9A24B" />
          <stop offset="100%" stopColor="#9A7624" />
        </linearGradient>
        <linearGradient id="pdBlueGrad" x1="20" y1="22" x2="78" y2="78" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1B3A8C" />
          <stop offset="100%" stopColor="#0B1F4D" />
        </linearGradient>
      </defs>
      {/* Anatomical tooth silhouette in Precision Gold */}
      <path
        d="M27 18C18 18 14 27 16 40C18 53 23 73 29 82C33 87 38 83 41 72C43 64 46 61 48 61C50 61 53 64 55 72C58 83 63 87 67 82C73 73 78 53 80 40C82 27 78 18 69 18C61 18 55 23 48 23C41 23 35 18 27 18Z"
        stroke="url(#pdGoldGrad)"
        strokeWidth="4.5"
        strokeLinejoin="round"
        fill="#FAF8F3"
      />
      {/* Inner Royal Blue root & crown body */}
      <path
        d="M28 28C23 28 21 35 23 44C25 53 28 67 31 73C33 76 35 73 38 64C40 57 44 54 48 54C52 54 56 57 58 64C61 73 63 76 65 73C68 67 71 53 73 44C75 35 73 28 68 28C61 28 55 32 48 32C41 32 35 28 28 28Z"
        fill="url(#pdBlueGrad)"
      />
      {/* Sweeping upward Precision arrow */}
      <path
        d="M16 54C36 53 56 41 71 21L64 17L82 12L79 30L73 25C58 46 37 59 14 60L16 54Z"
        fill="url(#pdBlueGrad)"
        stroke="url(#pdGoldGrad)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle cx="84" cy="11" r="3.5" fill="url(#pdGoldGrad)" />
    </svg>
  );
}
