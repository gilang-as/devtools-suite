'use client';

import Link from 'next/link';
import { generateBreadcrumbSchema } from '@/lib/seo';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  name: string;
  path: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const breadcrumbs = [{ name: 'Home', path: '/' }, ...items];
  const schema = generateBreadcrumbSchema(breadcrumbs);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6 ${className}`}
      >
        {breadcrumbs.map((item, index) => (
          <div key={item.path} className="flex items-center gap-2">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400" aria-hidden="true" />
            )}
            {index === breadcrumbs.length - 1 ? (
              <span className="text-gray-900 dark:text-gray-100 font-medium" aria-current="page">
                {item.name}
              </span>
            ) : (
              <Link
                href={item.path}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </>
  );
}
