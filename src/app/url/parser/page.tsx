
"use client"

import { useState, useMemo } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { parseUrl, ParsedUrl } from '@/lib/url';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link as LinkIcon, Search, Trash2, Globe, Braces, Info, Key, ListFilter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function UrlParserPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [input, setInput] = useState('https://example.com:8080/path/to/page?user=dev&id=123#section-1');

  const result = useMemo(() => parseUrl(input), [input]);

  const handleClear = () => {
    setInput('');
  };

  const PartCard = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col gap-1 p-3 bg-background rounded-lg border shadow-sm">
      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className="font-code text-sm break-all font-bold text-primary">{value || <span className="opacity-20 font-normal">n/a</span>}</span>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <Globe className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">{t('tools.url_parser.name')}</h1>
          <p className="text-muted-foreground">{t('tools.url_parser.description')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg">URL Input</CardTitle>
              <Button variant="ghost" size="icon" onClick={handleClear} disabled={!input}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your URL here..."
                className="font-code min-h-[120px] bg-secondary/30 text-sm leading-relaxed"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <div className="mt-4 flex gap-2 items-start text-xs text-muted-foreground bg-primary/5 p-3 rounded-lg border border-primary/10">
                <Info className="h-4 w-4 text-primary shrink-0" />
                <p>Supports full URLs with protocols, subdomains, and ports.</p>
              </div>
            </CardContent>
          </Card>

          {result && (
            <Card className="border-border shadow-md bg-secondary/5">
              <CardHeader className="py-3 px-4 border-b bg-background">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <ListFilter className="h-4 w-4 text-primary" />
                  Query Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[400px] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="text-[10px] font-black uppercase">Key</TableHead>
                        <TableHead className="text-[10px] font-black uppercase">Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(result.params).length > 0 ? (
                        Object.entries(result.params).map(([key, val]) => (
                          <TableRow key={key}>
                            <TableCell className="font-code text-xs font-bold">{key}</TableCell>
                            <TableCell className="font-code text-xs text-muted-foreground break-all">{val}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={2} className="text-center py-8 text-muted-foreground italic text-xs">
                            No parameters found in URL.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-7">
          {!result ? (
            <div className="h-full min-h-[400px] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-muted-foreground opacity-30 text-center px-8">
              <Search className="h-16 w-16 mb-4" />
              <p className="font-medium">Enter a valid URL to see the decomposition.</p>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PartCard label="Protocol" value={result.protocol} />
                <PartCard label="Hostname" value={result.hostname} />
                <PartCard label="Port" value={result.port || '80 / 443'} />
                <PartCard label="Path" value={result.pathname} />
                <PartCard label="Hash / Anchor" value={result.hash} />
                <PartCard label="Query String" value={result.search} />
              </div>

              <Card className="border-border shadow-lg overflow-hidden">
                <CardHeader className="bg-primary/5 py-3 border-b">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Braces className="h-4 w-4 text-primary" />
                    Structured JSON
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <pre className="font-code text-xs p-6 bg-[#fafafa] dark:bg-[#0f1115] overflow-auto max-h-[300px]">
                    <code>{JSON.stringify(result, null, 2)}</code>
                  </pre>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
