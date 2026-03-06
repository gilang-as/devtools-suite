"use client"

import { useState } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { obfuscateJs } from '@/lib/obfuscation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Code2, Copy, Trash2, ShieldAlert, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function JsObfuscatorPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [input, setInput] = useState('function hello() {\n  console.log("Hello, World!");\n}');
  const [output, setOutput] = useState('');

  const handleObfuscate = () => {
    setOutput(obfuscateJs(input));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({ title: t('common.copied') });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">JavaScript Obfuscator</h1>
          <p className="text-muted-foreground">{t('tools.js_obfuscator.description')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-6">
          <Card className="border-border shadow-lg h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">Source Code</CardTitle>
              <CardDescription>Paste your JavaScript here</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              <Textarea
                className="font-code flex-1 min-h-[300px] bg-secondary/30"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button onClick={handleObfuscate} className="w-full h-12 shadow-md">
                <ShieldAlert className="h-5 w-5 mr-2" />
                Obfuscate Code
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <Card className="border-border shadow-lg h-full flex flex-col bg-secondary/5">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Obfuscated Result</CardTitle>
                <CardDescription>Protected logic</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard} disabled={!output}>
                  <Copy className="h-4 w-4 mr-2" />
                  {t('common.copy')}
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setOutput('')}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              <Textarea
                readOnly
                className="font-code flex-1 min-h-[300px] bg-background border-primary/10 text-xs leading-relaxed"
                value={output}
                placeholder="Result will appear here..."
              />
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 flex gap-3 items-start">
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-[10px] text-muted-foreground leading-relaxed">
                  <strong>Note:</strong> This tool uses basic packing and Base64 wrapping. For production-grade security, use a dedicated tool like <code>javascript-obfuscator</code> with variable renaming and control flow flattening.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
