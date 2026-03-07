import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}

export const Logo = ({ className, size = 24, ...props }: LogoProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      {...props}
    >
      {/* Outer Hexagon Frame */}
      <path
        d="M12 2L3.5 7V17L12 22L20.5 17V7L12 2Z"
        className="stroke-primary"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Perspective / Inner Facets */}
      <path
        d="M12 22V12L20.5 7"
        className="stroke-primary opacity-60"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 12L3.5 7"
        className="stroke-primary opacity-60"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 12V2"
        className="stroke-primary opacity-40"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Floating Geometric Core */}
      <path
        d="M12 15L8.5 13V9L12 7L15.5 9V13L12 15Z"
        className="fill-primary/20 stroke-primary"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="11" r="1.5" className="fill-primary" />
      {/* Decorative Nodes */}
      <circle cx="3.5" cy="7" r="0.8" className="fill-primary opacity-50" />
      <circle cx="20.5" cy="7" r="0.8" className="fill-primary opacity-50" />
      <circle cx="12" cy="22" r="0.8" className="fill-primary opacity-50" />
    </svg>
  );
};
