"use client"

import { useState, useEffect } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { sortLines } from '@/lib/programming';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ListOrdered, Copy, Trash2, ArrowDownAZ, ArrowUpZA, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LineSorterPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    setOutput(sortLines(input, order));
  }, [input, order]);

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast({ title: t('common.copied') });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <ListOrdered className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">{t('tools.line_sorter.name')}</h1>
          <p className="text-muted-foreground">{t('tools.line_sorter.description')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Sort Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>{t('common.sort')}</Label>
                <Select value={order} onValueChange={(v: any) => setOrder(v)}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">
                      <div className="flex items-center gap-2">
                        <ArrowDownAZ className="h-4 w-4" />
                        {t('common.asc')} (A-Z)
                      </div>
                    </SelectItem>
                    <SelectItem value="desc">
                      <div className="flex items-center gap-2">
                        <ArrowUpZA className="h-4 w-4" />
                        {t('common.desc')} (Z-A)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" className="w-full" onClick={() => setInput('')}>
                <Trash2 className="h-4 w-4 mr-2" />
                {t('common.clear')}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">{t('common.input')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your lines here to sort them..."
                className="font-code min-h-[200px] bg-secondary/30 text-sm leading-relaxed"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </CardContent>
          </Card>

          <Card className="border-border shadow-lg bg-secondary/5 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-background border-b py-3">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">{t('common.output')}</CardTitle>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={copyToClipboard} 
                disabled={!output}
              >
                <Copy className="h-4 w-4 mr-2" />
                {t('common.copy')}
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Textarea
                readOnly
                className="font-code min-h-[300px] bg-transparent border-none focus-visible:ring-0 resize-none p-6 text-sm leading-relaxed"
                value={output}
                placeholder={t('common.placeholder_results')}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
