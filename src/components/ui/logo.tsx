import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: number;
}

/**
 * Reusable Logo component using inline SVG for high performance and reliability.
 * Matches the design of the brand asset with a muted, professional blue palette.
 */
export const Logo = ({ className, size = 24 }: LogoProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("transition-opacity hover:opacity-90", className)}
    >
      <path
        d="M16 2L29.8564 10V22L16 30L2.14359 22V10L16 2Z"
        fill="url(#logo-gradient)"
      />
      <path
        opacity="0.3"
        d="M16 2L29.8564 10L16 18L2.14359 10L16 2Z"
        fill="white"
      />
      <text
        x="50%"
        y="55%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="white"
        fontSize="16"
        fontWeight="900"
        fontFamily="system-ui, sans-serif"
        style={{ userSelect: 'none' }}
      >
        D
      </text>
      <defs>
        <linearGradient id="logo-gradient" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3b82f6" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
    </svg>
  );
};
