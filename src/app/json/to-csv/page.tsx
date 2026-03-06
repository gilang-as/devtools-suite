"use client"

import { useState, useRef } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Braces, 
  Copy, 
  Trash2, 
  Download, 
  ArrowRightLeft, 
  Check, 
  Settings2,
  FileSpreadsheet
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { jsonToCsv } from '@/lib/csv';

const LineNumbers = ({ text }: { text: string }) => {
  const lines = text.split('\n');
  const lineCount = lines.length || 1;
  return (
    <div className="flex flex-col text-right pr-2 text-muted-foreground/30 font-code text-xs select-none pt-2.5 bg-muted/20 border-r w-10 shrink-0 h-full overflow-hidden">
      {Array.from({ length: Math.max(lineCount, 15) }).map((_, i) => (
        <div key={i} className="leading-6 h-6">{i + 1}</div>
      ))}
    </div>
  );
};

export default function JsonToCsvPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [delimiter, setDelimiter] = useState(',');
  const [error, setError] = useState<string | null>(null);

  const handleConvert = () => {
    if (!input.trim()) return;
    try {
      const result = jsonToCsv(input, delimiter);
      setOutput(result);
      setError(null);
    } catch (e: any) {
      setError(e.message);
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: e.message,
      });
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({ title: t('common.copied') });
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `data-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <Braces className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">{t('tools.json_to_csv.name')}</h1>
          <p className="text-muted-foreground">{t('tools.json_to_csv.description')}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-stretch gap-4">
        <Card className="flex-1 border-border shadow-lg flex flex-col overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Braces className="h-5 w-5 text-primary" />
              JSON {t('common.input')}
            </CardTitle>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleClear}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            <div className="flex flex-1 min-h-[450px] border-t bg-secondary/10 overflow-hidden">
              <LineNumbers text={input} />
              <div className="flex-1 overflow-auto">
                <Textarea
                  placeholder='[{"id":1,"name":"John"},{"id":2,"name":"Jane"}]'
                  className="font-code w-full min-h-full border-none focus-visible:ring-0 bg-transparent resize-none leading-6 rounded-none py-2.5 shadow-none whitespace-pre overflow-x-auto"
                  wrap="off"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-row lg:flex-col justify-center items-center gap-4 py-4 lg:py-0 min-w-[200px]">
          <div className="w-full space-y-4 px-2">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                <Settings2 className="h-3 w-3" />
                Delimiter
              </Label>
              <Select value={delimiter} onValueChange={setDelimiter}>
                <SelectTrigger className="h-9 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=",">Comma (,)</SelectItem>
                  <SelectItem value=";">Semicolon (;)</SelectItem>
                  <SelectItem value="&#9;">Tab (\t)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button onClick={handleConvert} className="flex-1 lg:flex-none lg:w-full shadow-md bg-primary" size="lg">
            <Check className="h-4 w-4 mr-2" />
            Convert
          </Button>

          <div className="hidden lg:flex items-center justify-center text-muted-foreground/20">
            <ArrowRightLeft className="h-6 w-6" />
          </div>
        </div>

        <Card className="flex-1 border-border shadow-lg flex flex-col overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
              CSV {t('common.output')}
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleDownload} disabled={!output}>
                <Download className="h-4 w-4 mr-2" />
                {t('common.download')}
              </Button>
              <Button variant="outline" size="sm" onClick={copyToClipboard} disabled={!output}>
                <Copy className="h-4 w-4 mr-2" />
                {t('common.copy')}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            <div className="flex flex-1 min-h-[450px] border-t bg-secondary/10 overflow-hidden">
              <LineNumbers text={output} />
              <div className="flex-1 overflow-auto bg-[#fafafa] dark:bg-[#0f1115]">
                <div className="font-code w-full min-h-full leading-6 py-2.5 px-3 whitespace-pre overflow-x-auto text-sm">
                  {output || <span className="text-muted-foreground/50">{t('common.placeholder_results')}</span>}
                </div>
              </div>
            </div>
            {error && (
              <div className="p-3 border-t border-destructive/20 bg-destructive/5 text-xs text-destructive font-code">
                {error}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
