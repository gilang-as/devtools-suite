"use client"

import { useState, useRef } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Braces, Copy, Trash2, Upload, FileJson, ArrowRightLeft, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function JsonFormatterPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBeautify = () => {
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
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

  const handleMinify = () => {
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInput(content);
      try {
        const parsed = JSON.parse(content);
        setOutput(JSON.stringify(parsed, null, 2));
        setError(null);
      } catch (err) {
        // Just set input if it's not valid JSON yet
      }
    };
    reader.readAsText(file);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({
      title: t('common.copied'),
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <Braces className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">{t('tools.json_formatter.name')}</h1>
          <p className="text-muted-foreground">{t('tools.json_formatter.description')}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-stretch gap-4">
        {/* Input Section */}
        <Card className="flex-1 border-border shadow-lg flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileJson className="h-5 w-5 text-primary" />
              {t('common.input')}
            </CardTitle>
            <div className="flex gap-2">
              <input
                type="file"
                accept=".json"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fileInputRef.current?.click()}
                title={t('common.upload')}
              >
                <Upload className="h-4 w-4 mr-2" />
                {t('common.upload')}
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8" 
                onClick={handleClear} 
                title={t('common.clear')}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col space-y-2">
            <Textarea
              placeholder="Paste your JSON here..."
              className="font-code flex-1 min-h-[400px] bg-secondary/30 resize-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            {error && (
              <p className="text-xs text-destructive mt-2 bg-destructive/10 p-2 rounded border border-destructive/20 font-code">
                {error}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons (Middle) */}
        <div className="flex flex-row lg:flex-col justify-center items-center gap-3 py-4 lg:py-0 min-w-[120px]">
          <Button 
            onClick={handleBeautify} 
            className="flex-1 lg:flex-none lg:w-full shadow-md"
            size="lg"
          >
            <Check className="h-4 w-4 mr-2" />
            {t('common.beautify')}
          </Button>
          <div className="hidden lg:flex items-center justify-center text-muted-foreground/30">
            <ArrowRightLeft className="h-6 w-6" />
          </div>
          <Button 
            onClick={handleMinify} 
            variant="secondary" 
            className="flex-1 lg:flex-none lg:w-full shadow-sm"
            size="lg"
          >
            <Braces className="h-4 w-4 mr-2" />
            {t('common.minify')}
          </Button>
        </div>

        {/* Output Section */}
        <Card className="flex-1 border-border shadow-lg flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg">{t('common.output')}</CardTitle>
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
          <CardContent className="flex-1 flex flex-col">
            <Textarea
              readOnly
              placeholder="Formatted results will appear here..."
              className="font-code flex-1 min-h-[400px] bg-secondary/30 resize-none"
              value={output}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
