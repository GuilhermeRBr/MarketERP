interface LogoProps {
  className?: string;
  /** Controls the width. Height is auto-calculated via viewBox. */
  width?: number | string;
  /** Color for the "Market" text. Defaults to #111f35. */
  marketColor?: string;
}

export function Logo({ className, width = 180, marketColor = "#111f35" }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 300"
      width={width}
      height="auto"
      className={className}
      aria-label="MarketERP logo"
      role="img"
    >
      <defs>
        <linearGradient id="logo-icon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0062FF" />
          <stop offset="100%" stopColor="#00D270" />
        </linearGradient>
        <linearGradient id="logo-text-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0a8e63" />
          <stop offset="100%" stopColor="#02d072" />
        </linearGradient>
      </defs>

      {/* Cart icon background */}
      <rect x="50" y="50" width="200" height="200" rx="55" ry="55" fill="url(#logo-icon-grad)" />

      {/* Cart shape */}
      <path
        d="M 75 105 H 95 L 120 175 H 195 L 215 120 H 101"
        fill="none"
        stroke="#ffffff"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="130" cy="205" r="13" fill="#ffffff" />
      <circle cx="185" cy="205" r="13" fill="#ffffff" />

      {/* Logotype */}
      <text
        x="280"
        y="185"
        fontFamily="'Montserrat', 'Poppins', 'Segoe UI', 'Helvetica Neue', sans-serif"
        fontWeight="700"
        fontSize="115"
        letterSpacing="-1"
      >
        <tspan fill={marketColor}>Market</tspan>
        <tspan fill="url(#logo-text-grad)">ERP</tspan>
      </text>
    </svg>
  );
}
