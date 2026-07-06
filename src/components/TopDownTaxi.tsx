import React from "react";

interface TopDownTaxiProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

/**
 * TopDownTaxi
 * A top-down (bird's-eye) SVG of an Indian taxi.
 * - White body, glossy dark roof
 * - Yellow rectangular "TAXI" signboard mounted on roof
 * - Black & white checkered strip along both sides
 * - Front bumper + headlights pointing DOWN
 */
const TopDownTaxi: React.FC<TopDownTaxiProps> = ({ className = "", size = 48, ...rest }) => {
  const w = size;
  const h = size * 2.15; // portrait
  return (
    <svg
      viewBox="0 0 100 215"
      width={w}
      height={h}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Top-down taxi"
      {...rest}
    >
      <defs>
        <linearGradient id="bodyShine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.5" stopColor="#f4f4f0" />
          <stop offset="1" stopColor="#ffffff" />
        </linearGradient>
        <linearGradient id="roofShine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1a1a1a" />
          <stop offset="0.5" stopColor="#2f2f2f" />
          <stop offset="1" stopColor="#1a1a1a" />
        </linearGradient>
        <linearGradient id="windshield" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a4a5c" />
          <stop offset="1" stopColor="#1e2733" />
        </linearGradient>
        <linearGradient id="rearGlass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1e2733" />
          <stop offset="1" stopColor="#3a4a5c" />
        </linearGradient>
        <pattern id="checkers" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="#ffffff" />
          <rect width="4" height="4" fill="#111111" />
          <rect x="4" y="4" width="4" height="4" fill="#111111" />
        </pattern>
      </defs>

      {/* Car body */}
      <rect x="8" y="10" width="84" height="195" rx="18" ry="22" fill="url(#bodyShine)" stroke="#c8c6bf" strokeWidth="1" />

      {/* Side checker strips */}
      <rect x="8" y="80" width="6" height="60" fill="url(#checkers)" />
      <rect x="86" y="80" width="6" height="60" fill="url(#checkers)" />

      {/* Glossy roof */}
      <rect x="18" y="55" width="64" height="100" rx="10" fill="url(#roofShine)" />

      {/* TAXI signboard on roof */}
      <g>
        <rect x="30" y="88" width="40" height="16" rx="2" fill="#111111" />
        <rect x="32" y="90" width="36" height="12" rx="1.5" fill="#F5C518" />
        <text x="50" y="99.5" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="9" fill="#111111" letterSpacing="1.5">TAXI</text>
      </g>

      {/* Roof rails / trim */}
      <rect x="18" y="55" width="64" height="3" fill="#0d0d0d" opacity="0.6" />
      <rect x="18" y="152" width="64" height="3" fill="#0d0d0d" opacity="0.6" />

      {/* Windshield (front - bottom) */}
      <path d="M 20 155 L 80 155 L 74 178 L 26 178 Z" fill="url(#windshield)" />

      {/* Rear windshield (top) */}
      <path d="M 26 32 L 74 32 L 80 55 L 20 55 Z" fill="url(#rearGlass)" />

      {/* Wing mirrors */}
      <rect x="3" y="120" width="6" height="10" rx="2" fill="#e8e6df" stroke="#a8a6a0" strokeWidth="0.5" />
      <rect x="91" y="120" width="6" height="10" rx="2" fill="#e8e6df" stroke="#a8a6a0" strokeWidth="0.5" />

      {/* Front bumper */}
      <rect x="14" y="196" width="72" height="7" rx="3" fill="#e5e3db" stroke="#b8b6af" strokeWidth="0.5" />

      {/* Headlights (front - bottom) */}
      <ellipse cx="24" cy="192" rx="6" ry="4" fill="#fff8c9" stroke="#d4b800" strokeWidth="0.7" />
      <ellipse cx="76" cy="192" rx="6" ry="4" fill="#fff8c9" stroke="#d4b800" strokeWidth="0.7" />

      {/* Tail lights (top) */}
      <rect x="18" y="14" width="12" height="4" rx="1.5" fill="#c62828" />
      <rect x="70" y="14" width="12" height="4" rx="1.5" fill="#c62828" />

      {/* Rear bumper */}
      <rect x="14" y="12" width="72" height="6" rx="3" fill="#e5e3db" opacity="0.7" />

      {/* Body highlight sheen */}
      <rect x="10" y="10" width="8" height="195" rx="18" fill="#ffffff" opacity="0.35" />
    </svg>
  );
};

export default TopDownTaxi;
