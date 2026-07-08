import React from "react";

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 32, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Glow filter */}
        <filter id="logoGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Orb Gradient */}
        <radialGradient id="orbGradient" cx="50%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#c5b7ff" />
          <stop offset="75%" stopColor="#7c5cff" />
          <stop offset="100%" stopColor="#4c30c2" />
        </radialGradient>

        {/* Anchor Linear Gradient */}
        <linearGradient id="anchorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3a3945" />
          <stop offset="100%" stopColor="#1c1b22" />
        </linearGradient>

        {/* Border Gradient */}
        <linearGradient id="borderGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7c5cff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#7c5cff" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Glowing Orb (Sphere) */}
      <circle cx="50" cy="27" r="13" fill="url(#orbGradient)" filter="url(#logoGlow)" />
      {/* Crisp inner sphere overlay */}
      <circle cx="50" cy="27" r="13" fill="url(#orbGradient)" opacity="0.9" />

      {/* Unified Anchor Path */}
      <path
        d="M 18,52 
           H 26 
           A 24,24 0 0 0 46,75.66 
           V 62 
           H 40 
           L 50,49 
           L 60,62 
           H 54 
           V 75.66 
           A 24,24 0 0 0 74,52 
           H 82 
           A 32,32 0 0 1 18,52 Z"
        fill="url(#anchorGradient)"
        stroke="url(#borderGradient)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
