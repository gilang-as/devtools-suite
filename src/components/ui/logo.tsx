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
      {/* Background Shape */}
      <path
        d="M12 2L3 7V17L12 22L21 17V7L12 2Z"
        className="fill-primary/20 stroke-primary"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Inner Geometric Pattern */}
      <path
        d="M12 22V12L21 7"
        className="stroke-primary"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 12L3 7"
        className="stroke-primary"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 4.5L16.5 9.5"
        className="stroke-primary"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M7.5 19.5L16.5 14.5"
        className="stroke-primary"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* Center Detail */}
      <circle cx="12" cy="12" r="2" className="fill-primary" />
    </svg>
  );
};
