import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: number;
}

/**
 * Reusable Logo component that displays the brand asset from /public/icon.svg.
 * This version uses a standard image tag to ensure compatibility with your manually added SVG.
 */
export const Logo = ({ className, size = 24 }: LogoProps) => {
  return (
    <img
      src="/icon.svg"
      alt="DevTools Suite Logo"
      width={size}
      height={size}
      className={cn("object-contain block", className)}
      style={{ width: size, height: size }}
      loading="eager"
    />
  );
};
