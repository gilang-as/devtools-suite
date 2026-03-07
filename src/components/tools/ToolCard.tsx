"use client"

import Link from 'next/link';
import { Tool } from '@/tools/config';
import { useTranslation } from '@/components/providers/i18n-provider';
import { logEvent } from 'firebase/analytics';
import { useAnalytics } from '@/firebase/provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Hash, KeyRound, ChevronRight, Fingerprint, Braces, Terminal, CodeXml, LayoutPanelLeft, Palette, ScrollText, Code2, Link as LinkIcon, Binary, Hexagon, ShieldCheck, FileKey, Lock, ShieldAlert, Zap, FileBadge, Type, Network, Globe2 } from 'lucide-react';

const iconMap: Record<string, any> = {
  Hash, KeyRound, Fingerprint, Braces, Terminal, CodeXml, LayoutPanelLeft, Palette, ScrollText, Code2, LinkIcon, Binary, Hexagon, ShieldCheck, FileKey, Lock, ShieldAlert, Zap, FileBadge, Type, Network, Globe2
};

export default function ToolCard({ tool }: { tool: Tool }) {
  const { t } = useTranslation();
  const analytics = useAnalytics();
  const IconComponent = iconMap[tool.icon] || Hash;

  const handleClick = () => {
    if (analytics) {
      logEvent(analytics, 'select_item', {
        item_list_id: 'tool_list',
        item_list_name: 'Main Tools Grid',
        items: [
          {
            item_id: tool.id,
            item_name: t(tool.nameKey),
            item_category: tool.category
          }
        ]
      });
    }
  };

  return (
    <Link href={tool.href} className="block transition-transform duration-200 hover:-translate-y-1" onClick={handleClick}>
      <Card className="h-full hover:border-primary/50 group bg-card border-border shadow-md">
        <CardHeader className="flex flex-row items-center space-y-0 gap-4">
          <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <IconComponent className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {t(tool.nameKey)}
            </CardTitle>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
              {tool.category}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm leading-relaxed mb-4">
            {t(tool.descriptionKey)}
          </CardDescription>
          <div className="flex items-center text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity uppercase">
            {t('common.try_tool')} <ChevronRight className="h-3 w-3 ml-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
