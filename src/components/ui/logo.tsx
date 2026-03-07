"use client"

import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: number;
}

/**
 * Reusable Logo component using inline SVG for high performance and reliability.
 * This represents the DevTools Suite brand identity.
 */
export const Logo = ({ className, size = 24 }: LogoProps) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-primary", className)}
      aria-hidden="true"
    >
      {/* Hexagonal Background Shell */}
      <path 
        d="M16 2L28.1244 9V23L16 30L3.87564 23V9L16 2Z" 
        fill="currentColor" 
        fillOpacity="0.1" 
        stroke="currentColor" 
        strokeWidth="1.5"
      />
      {/* Stylized 'D' for DevTools */}
      <path 
        d="M11 10V22H16C19.3137 22 22 19.3137 22 16C22 12.6863 19.3137 10 16 10H11ZM13.5 12.5H16C17.933 12.5 19.5 14.067 19.5 16C19.5 17.933 17.933 19.5 16 19.5H13.5V12.5Z" 
        fill="currentColor"
      />
      {/* Accent Detail */}
      <circle cx="16" cy="16" r="1.5" fill="currentColor" />
    </svg>
  );
};
