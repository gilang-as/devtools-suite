'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export interface RelatedTool {
  name: string;
  description: string;
  href: string;
  icon?: string;
}

interface RelatedToolsProps {
  title?: string;
  description?: string;
  tools: RelatedTool[];
  className?: string;
}

export function RelatedTools({
  title = 'Related Tools',
  description,
  tools,
  className = '',
}: RelatedToolsProps) {
  if (!tools || tools.length === 0) return null;

  return (
    <section className={`py-12 md:py-16 ${className}`}>
      <div className="max-w-5xl mx-auto px-4">
        {title && (
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            {title}
          </h2>
        )}
        {description && (
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            {description}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool, index) => (
            <Link key={index} href={tool.href}>
              <Card className="h-full p-4 hover:shadow-lg hover:border-blue-500 transition-all duration-200 cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  {tool.icon && (
                    <span className="text-2xl">{tool.icon}</span>
                  )}
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {tool.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {tool.description}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
