import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: number;
}

/**
 * Reusable Logo component that pulls the brand asset from /public/svg/icon.svg.
 * Uses a standard <img> tag for maximum compatibility with SVG assets.
 */
export const Logo = ({ className, size = 24 }: LogoProps) => {
  return (
    <div 
      className={cn("relative flex items-center justify-center transition-opacity hover:opacity-90", className)} 
      style={{ width: size, height: size }}
    >
      <img
        src="/svg/icon.svg"
        alt="DevTools Suite Logo"
        width={size}
        height={size}
        className="object-contain"
      />
    </div>
  );
};
