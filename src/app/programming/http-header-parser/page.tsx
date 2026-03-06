"use client"

import { useState, useMemo } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { parseHttpHeaders } from '@/lib/programming';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Globe, Copy, Trash2, Braces, Terminal, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function HttpHeaderParserPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [input, setInput] = useState('Content-Type: application/json\nCache-Control: no-cache\nAuthorization: Bearer example_token');

  const headers = useMemo(() => parseHttpHeaders(input), [input]);
  const jsonOutput = useMemo(() => JSON.stringify(headers, null, 2), [headers]);

  const copyToClipboard = () => {
    if (jsonOutput === '{}') return;
    navigator.clipboard.writeText(jsonOutput);
    toast({ title: t('common.copied') });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <Terminal className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">{t('tools.http_header_parser.name')}</h1>
          <p className="text-muted-foreground">{t('tools.http_header_parser.description')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border shadow-lg h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Raw Headers
              </CardTitle>
              <CardDescription>Paste headers from your browser DevTools</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              <Textarea
                placeholder="Key: Value..."
                className="font-code flex-1 min-h-[300px] bg-secondary/30 text-xs"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button variant="outline" className="w-full" onClick={() => setInput('')}>
                <Trash2 className="h-4 w-4 mr-2" />
                {t('common.clear')}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <Card className="border-border shadow-lg bg-secondary/5 h-full flex flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-background border-b py-3">
              <div className="flex items-center gap-2">
                <Braces className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Parsed JSON</CardTitle>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={copyToClipboard} 
                disabled={jsonOutput === '{}'}
              >
                <Copy className="h-4 w-4 mr-2" />
                {t('common.copy')} JSON
              </Button>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-auto">
              <pre className="font-code text-xs p-6 leading-relaxed bg-[#fafafa] dark:bg-[#0f1115] h-full overflow-auto">
                {Object.keys(headers).length > 0 ? (
                  <code className="text-primary">{jsonOutput}</code>
                ) : (
                  <span className="text-muted-foreground italic">No valid headers detected.</span>
                )}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
