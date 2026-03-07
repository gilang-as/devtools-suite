import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: number;
}

/**
 * Reusable Logo component that pulls the brand asset from /public/svg/icon.svg.
 * Optimized for a natural fit within the site's theme.
 */
export const Logo = ({ className, size = 24 }: LogoProps) => {
  return (
    <div 
      className={cn("relative flex items-center justify-center transition-opacity hover:opacity-90", className)} 
      style={{ width: size, height: size }}
    >
      <Image
        src="/svg/icon.svg"
        alt="DevTools Suite Logo"
        width={size}
        height={size}
        className="object-contain"
        priority
      />
    </div>
  );
};
