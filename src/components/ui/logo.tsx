
"use client"

import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: number;
}

/**
 * Reusable Logo component that references the brand asset at /icon.svg.
 * This ensures consistency across the application.
 */
export const Logo = ({ className, size = 24 }: LogoProps) => {
  return (
    <div 
      className={cn("relative flex items-center justify-center overflow-hidden", className)}
      style={{ width: size, height: size }}
    >
      <img 
        src="/icon.svg" 
        alt="DevTools Suite Logo" 
        className="w-full h-full object-contain"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};
