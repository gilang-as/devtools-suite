"use client"

import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: number;
}

/**
 * Reusable inline SVG Logo component.
 * This component contains the vector data directly, eliminating path errors
 * and ensuring high-performance rendering across the header and footer.
 */
export const Logo = ({ className, size = 32 }: LogoProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("select-none transition-transform active:scale-95", className)}
    >
      {/* Background Hexagon - Muted contrast */}
      <path
        d="M50 5L93.3013 30V70L50 95L6.69873 70V30L50 5Z"
        fill="currentColor"
        className="text-primary/10"
      />
      {/* Outline Hexagon */}
      <path
        d="M50 15L80.3109 32.5V67.5L50 85L19.6891 67.5V32.5L50 15Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary/20"
      />
      {/* Brand Letter 'D' */}
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="42"
        fontWeight="900"
        fill="currentColor"
        className="text-primary font-headline"
        style={{ letterSpacing: "-0.05em" }}
        dy=".12em"
      >
        D
      </text>
      {/* Decorative pulse dot */}
      <circle cx="80" cy="32" r="4" fill="currentColor" className="text-primary/40" />
    </svg>
  );
};
