"use client"

import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: number;
}

/**
 * Reusable Logo component that displays the brand asset from /public/icon.svg.
 * Ensure your asset is located at /public/icon.svg.
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
