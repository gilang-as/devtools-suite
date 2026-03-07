"use client"

import { useState, useMemo } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { removeDuplicateLines } from '@/lib/programming';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Rows, Copy, Trash2, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { ToolSEOContent } from '@/components/tools/ToolSEOContent';

export default function DuplicateRemoverPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [input, setInput] = useState('');

  const { result, count } = useMemo(() => removeDuplicateLines(input), [input]);

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    toast({ title: t('common.copied') });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <Rows className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">{t('tools.duplicate_remover.name')}</h1>
          <p className="text-muted-foreground">{t('tools.duplicate_remover.description')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-6">
          <Card className="border-border shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg">Source List</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setInput('')} disabled={!input}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste a list with possible duplicates here..."
                className="font-code min-h-[400px] bg-secondary/30 text-sm"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <Card className="border-border shadow-lg bg-secondary/5 flex flex-col h-full overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-background border-b py-3">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Clean List</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                {count > 0 && (
                  <Badge variant="secondary" className="font-bold text-primary">
                    {count} Duplicates Removed
                  </Badge>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={copyToClipboard} 
                  disabled={!result}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {t('common.copy')}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <Textarea
                readOnly
                className="font-code h-full min-h-[400px] bg-transparent border-none focus-visible:ring-0 resize-none p-6 text-sm"
                value={result}
                placeholder="Unique items will appear here..."
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <ToolSEOContent 
        title="Duplicate Line Removal"
        sections={[
          {
            title: "What is a Duplicate Remover?",
            content: "A Duplicate Remover is a utility designed to scan a list of text and strip away any repeating lines, leaving only unique entries. This is essential for cleaning up mailing lists, processing logs, or organizing large sets of data where redundancy is not desired."
          },
          {
            title: "Preserving Order",
            content: "Our tool uses a 'stable' removal algorithm. This means that when a duplicate is found, it preserves the very first instance of that line and removes all subsequent ones, maintaining the original chronological or logical sequence of your data."
          },
          {
            title: "Common Use Cases",
            content: "Developers use this to clean up CSS selector lists, remove redundant entries from environment variable files, or filter unique IDs from a database dump. It's also great for general tasks like cleaning up a messy list of names or items copied from multiple sources."
          },
          {
            title: "Performance & Privacy",
            content: "The processing is done locally in your browser (RAM), allowing it to handle thousands of lines almost instantly without ever sending your data over the internet. This makes it safe for sensitive information like logs or internal spreadsheets."
          }
        ]}
      />
    </div>
  );
}
