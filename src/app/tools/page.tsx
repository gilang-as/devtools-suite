import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';
import { TOOLS } from '@/tools/config';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = generateMetadata({
  title: 'All Developer Tools | DevTools Suite',
  description: 'Explore 150+ free developer tools for encoding, hashing, formatting, and cryptography. Find the perfect secure utility for your web development needs.',
  path: '/tools',
  keywords: [
    'developer tools',
    'tools directory',
    'online tools',
    'free tools',
    'web development',
    'utilities',
  ],
  generateOG: true,
  icon: '🔧',
});

export default function ToolsPage() {
  // Group tools by category
  const groupedTools = TOOLS.reduce(
    (acc, tool) => {
      if (!acc[tool.category]) {
        acc[tool.category] = [];
      }
      acc[tool.category].push(tool);
      return acc;
    },
    {} as Record<string, typeof TOOLS>
  );

  const categories = Object.entries(groupedTools).sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <>
      <Breadcrumbs items={[{ name: 'Tools', path: '/tools' }]} />

      {/* Header */}
      <section className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          All Developer Tools
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
          Explore our complete collection of {TOOLS.length}+ free online developer tools. From encoding and encryption to formatting and cryptography, find everything you need for web development.
        </p>
      </section>

      {/* Tools by Category */}
      <div className="space-y-16">
        {categories.map(([category, tools]) => (
          <section key={category}>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tools.map((tool) => (
                <Link key={tool.href} href={tool.href}>
                  <Card className="h-full p-6 hover:shadow-lg hover:border-blue-500 transition-all duration-200 cursor-pointer group">
                    <div className="flex items-start justify-between mb-3">
                      {tool.icon && (
                        <span className="text-3xl">{tool.icon}</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {tool.description}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Search/Discovery CTA */}
      <section className="mt-16 py-12 px-6 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Can't find what you're looking for?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Use our command menu to quickly search and navigate to any tool. Press{' '}
          <kbd className="px-2 py-1 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700 text-sm font-mono">
            Cmd/Ctrl + K
          </kbd>
        </p>
      </section>
    </>
  );
}
