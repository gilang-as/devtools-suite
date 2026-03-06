"use client"

import { useState } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { encodeCose } from '@/lib/advanced-security';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, Copy, Check, Braces, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CosePage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [input, setInput] = useState('{\n  "ms": 1,\n  "payload": "Sample COSE Data",\n  "protected": { "alg": -7 }\n}');
  const [output, setOutput] = useState('');

  const handleEncode = () => {
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      const result = encodeCose(parsed);
      setOutput(result);
    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: 'Invalid JSON for COSE encoding: ' + e.message,
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({ title: t('common.copied') });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">{t('tools.cose.name')}</h1>
          <p className="text-muted-foreground">{t('tools.cose.description')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="border-border shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Braces className="h-5 w-5 text-primary" />
              JSON Data Map
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setInput('')}>
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter JSON representation of the COSE structure..."
              className="font-code h-48 bg-secondary/30"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button onClick={handleEncode} className="w-full h-11">
              <Check className="h-4 w-4 mr-2" />
              Encode as COSE (Base64 Representation)
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">COSE Binary (Base64)</CardTitle>
            <Button variant="outline" size="sm" onClick={copyToClipboard} disabled={!output}>
              <Copy className="h-4 w-4 mr-2" />
              {t('common.copy')}
            </Button>
          </CardHeader>
          <CardContent>
            <Textarea
              readOnly
              className="font-code h-32 bg-secondary/10"
              value={output}
            />
            <p className="text-[10px] text-muted-foreground mt-4 italic">
              * Note: This generates a basic COSE-formatted CBOR map. Full signing requires a private key.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}