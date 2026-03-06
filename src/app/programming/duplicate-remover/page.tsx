"use client"

import { useState, useMemo } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { removeDuplicateLines } from '@/lib/programming';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Rows, Copy, Trash2, Check, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

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
    </div>
  );
}
