"use client"

import { useState, useEffect } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { 
  toLowerCase, toUpperCase, toTitleCase, toSentenceCase, 
  toCamelCase, toPascalCase, toSnakeCase, toKebabCase, toConstantCase 
} from '@/lib/text-case';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Type, Copy, Trash2, ArrowRightLeft, Check, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type CaseType = 'lower' | 'upper' | 'title' | 'sentence' | 'camel' | 'pascal' | 'snake' | 'kebab' | 'constant';

export default function CaseConverterPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLive, setIsLive] = useState(true);
  const [activeCase, setActiveCase] = useState<CaseType | null>(null);

  const applyCase = (type: CaseType) => {
    setActiveCase(type);
    let result = '';
    switch (type) {
      case 'lower': result = toLowerCase(input); break;
      case 'upper': result = toUpperCase(input); break;
      case 'title': result = toTitleCase(input); break;
      case 'sentence': result = toSentenceCase(input); break;
      case 'camel': result = toCamelCase(input); break;
      case 'pascal': result = toPascalCase(input); break;
      case 'snake': result = toSnakeCase(input); break;
      case 'kebab': result = toKebabCase(input); break;
      case 'constant': result = toConstantCase(input); break;
    }
    setOutput(result);
  };

  useEffect(() => {
    if (isLive && activeCase && input) {
      applyCase(activeCase);
    } else if (!input) {
      setOutput('');
    }
  }, [input, isLive]);

  const handleClear = () => {
    setInput('');
    setOutput('');
    setActiveCase(null);
  };

  const handleSwap = () => {
    setInput(output);
    setOutput('');
    setActiveCase(null);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({ title: t('common.copied') });
  };

  const CaseButton = ({ type, label }: { type: CaseType, label: string }) => (
    <Button 
      variant={activeCase === type ? 'default' : 'outline'}
      className={cn("h-10 text-xs font-bold px-4", activeCase === type && "shadow-lg")}
      onClick={() => applyCase(type)}
    >
      {label}
    </Button>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <Type className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">{t('tools.case_converter.name')}</h1>
          <p className="text-muted-foreground">{t('tools.case_converter.description')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12 space-y-6">
          <Card className="border-border shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t('common.input')}</CardTitle>
                <CardDescription>Enter text to transform</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="live-mode" className="text-sm font-medium cursor-pointer">
                  {t('common.liveMode')}
                </Label>
                <Switch 
                  id="live-mode" 
                  checked={isLive} 
                  onCheckedChange={setIsLive} 
                />
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your text here..."
                className="font-code min-h-[150px] bg-secondary/30 text-lg leading-relaxed"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </CardContent>
          </Card>

          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-2 px-1">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Convert To</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <CaseButton type="lower" label="lowercase" />
              <CaseButton type="upper" label="UPPERCASE" />
              <CaseButton type="title" label="Title Case" />
              <CaseButton type="sentence" label="Sentence case" />
              <div className="w-full h-px bg-border/50 my-2" />
              <CaseButton type="camel" label="camelCase" />
              <CaseButton type="pascal" label="PascalCase" />
              <CaseButton type="snake" label="snake_case" />
              <CaseButton type="kebab" label="kebab-case" />
              <CaseButton type="constant" label="CONSTANT_CASE" />
            </div>
          </div>

          <Card className="border-border shadow-lg bg-secondary/5 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-background border-b py-3">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">{t('common.output')}</CardTitle>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleSwap} disabled={!output}>
                  <ArrowRightLeft className="h-4 w-4 mr-2" />
                  {t('common.swap')}
                </Button>
                <Button variant="outline" size="sm" onClick={copyToClipboard} disabled={!output}>
                  <Copy className="h-4 w-4 mr-2" />
                  {t('common.copy')}
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleClear}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="p-6 bg-background rounded-xl border-2 border-primary/10 shadow-inner break-all font-code text-lg leading-relaxed min-h-[120px] flex items-center">
                {output || <span className="text-muted-foreground/50 italic">{t('common.placeholder_results')}</span>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
