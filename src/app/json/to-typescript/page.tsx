"use client"

import { useState, useMemo } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { jsonToTs } from '@/lib/json-to-ts';
import { 
  Braces, 
  Copy, 
  Trash2, 
  FileCode, 
  ArrowRightLeft, 
  Check, 
  Code2,
  Settings2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const highlightTs = (code: string) => {
  if (!code) return null;
  const tokens = code.split(/(\b(?:interface|type|string|number|boolean|any|export|readonly)\b|[{}?:;=])/g);
  return tokens.map((token, i) => {
    if (!token) return null;
    if (/^(interface|type|export|readonly)$/.test(token)) {
      return <span key={i} className="text-purple-600 dark:text-purple-400 font-semibold">{token}</span>;
    }
    if (/^(string|number|boolean|any)$/.test(token)) {
      return <span key={i} className="text-blue-600 dark:text-blue-400">{token}</span>;
    }
    if (/[{}?:;=]/.test(token)) {
      return <span key={i} className="text-muted-foreground">{token}</span>;
    }
    return <span key={i}>{token}</span>;
  });
};

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

export default function JsonToTypescriptPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [rootName, setRootName] = useState('Root');
  const [useInterface, setUseInterface] = useState(true);
  const [optionalFields, setOptionalFields] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = () => {
    if (!input.trim()) return;
    const result = jsonToTs(input, { rootName, useInterface, optionalFields });
    if (result.startsWith('// Error')) {
      setError(result);
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: result,
      });
    } else {
      setOutput(result);
      setError(null);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({
      title: t('common.copied'),
    });
  };

  const highlightedOutput = useMemo(() => highlightTs(output), [output]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <Code2 className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">{t('tools.json_to_ts.name')}</h1>
          <p className="text-muted-foreground">{t('tools.json_to_ts.description')}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-stretch gap-4">
        <Card className="flex-1 border-border shadow-lg flex flex-col overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Braces className="h-5 w-5 text-primary" />
              JSON {t('common.input')}
            </CardTitle>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8" 
              onClick={handleClear} 
              title={t('common.clear')}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            <div className="flex flex-1 min-h-[450px] border-t bg-secondary/10 overflow-hidden">
              <LineNumbers text={input} />
              <div className="flex-1 overflow-auto">
                <Textarea
                  placeholder='{ "example": "json" }'
                  className={cn(
                    "font-code w-full min-h-full border-none focus-visible:ring-0 bg-transparent resize-none leading-6 rounded-none py-2.5 shadow-none whitespace-pre overflow-x-auto"
                  )}
                  wrap="off"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-row lg:flex-col justify-center items-center gap-4 py-4 lg:py-0 min-w-[240px]">
          <div className="w-full space-y-4 px-2">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                <Settings2 className="h-3 w-3" />
                Root Type Name
              </Label>
              <Input 
                value={rootName}
                onChange={(e) => setRootName(e.target.value)}
                placeholder="Root"
                className="h-9 bg-background"
              />
            </div>

            <div className="flex items-center justify-between px-1">
              <Label htmlFor="use-interface" className="text-xs font-medium cursor-pointer">
                Use Interface
              </Label>
              <Switch 
                id="use-interface" 
                checked={useInterface} 
                onCheckedChange={setUseInterface} 
              />
            </div>

            <div className="flex items-center justify-between px-1">
              <Label htmlFor="optional-fields" className="text-xs font-medium cursor-pointer">
                Optional Fields (?)
              </Label>
              <Switch 
                id="optional-fields" 
                checked={optionalFields} 
                onCheckedChange={setOptionalFields} 
              />
            </div>
          </div>
          
          <Button 
            onClick={handleConvert} 
            className="flex-1 lg:flex-none lg:w-full shadow-md bg-primary hover:bg-primary/90"
            size="lg"
          >
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
              <FileCode className="h-5 w-5 text-primary" />
              TypeScript {t('common.output')}
            </CardTitle>
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
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            <div className="flex flex-1 min-h-[450px] border-t bg-secondary/10 overflow-hidden">
              <LineNumbers text={output} />
              <div className="flex-1 overflow-auto bg-[#fafafa] dark:bg-[#0f1115]">
                <div className="font-code w-full min-h-full leading-6 py-2.5 px-3 whitespace-pre overflow-x-auto">
                  {highlightedOutput || <span className="text-muted-foreground/50">TypeScript definitions will appear here...</span>}
                </div>
              </div>
            </div>
            {error && (
              <div className="p-2 border-t border-destructive/20 bg-destructive/5">
                <p className="text-xs text-destructive font-code whitespace-pre-wrap">
                  {error}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
