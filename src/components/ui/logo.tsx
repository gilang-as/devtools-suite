"use client"

import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: number;
}

/**
 * Reusable Logo component that references the manual brand asset.
 * Uses an img tag to ensure the specific design from /icon.svg is preserved.
 * The opacity is slightly reduced to provide a more integrated, "natural" look.
 */
export const Logo = ({ className, size = 32 }: LogoProps) => {
  return (
    <img
      src="/icon.svg"
      alt="DevTools Suite Logo"
      width={size}
      height={size}
      className={cn(
        "select-none transition-all duration-200 opacity-80 hover:opacity-100 dark:brightness-110",
        className
      )}
      style={{ width: size, height: size }}
    />
  );
};
