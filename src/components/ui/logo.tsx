import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: number;
}

/**
 * Reusable Logo component that pulls the brand asset from /public/icon.svg.
 * The design is optimized to look "natural" by using theme-aware colors
 * and balanced contrast.
 */
export const Logo = ({ className, size = 24 }: LogoProps) => {
  return (
    <div 
      className={cn("relative flex items-center justify-center transition-opacity hover:opacity-90", className)} 
      style={{ width: size, height: size }}
    >
      <Image
        src="/icon.svg"
        alt="DevTools Suite Logo"
        width={size}
        height={size}
        className="object-contain drop-shadow-sm"
        priority
      />
    </div>
  );
};
