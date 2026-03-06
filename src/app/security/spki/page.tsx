"use client"

import { useState } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { formatSpki } from '@/lib/advanced-security';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Fingerprint, Copy, Check, FileKey, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SpkiPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleFormat = () => {
    try {
      if (!input.trim()) return;
      const result = formatSpki(input);
      setOutput(result);
    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: e.message,
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
          <Fingerprint className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">{t('tools.spki.name')}</h1>
          <p className="text-muted-foreground">{t('tools.spki.description')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="border-border shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileKey className="h-5 w-5 text-primary" />
              Public Key PEM
            </CardTitle>
            <CardDescription>Input your RSA/EC Public Key in PEM format</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="-----BEGIN PUBLIC KEY-----..."
              className="font-code h-48 bg-secondary/30"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={handleFormat} className="flex-1 h-11">
                <Check className="h-4 w-4 mr-2" />
                Format as SPKI Base64
              </Button>
              <Button variant="outline" size="icon" onClick={() => setInput('')} className="h-11 w-11">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-lg bg-secondary/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">SPKI Result (Base64)</CardTitle>
            <Button variant="outline" size="sm" onClick={copyToClipboard} disabled={!output}>
              <Copy className="h-4 w-4 mr-2" />
              {t('common.copy')}
            </Button>
          </CardHeader>
          <CardContent>
            <Textarea
              readOnly
              className="font-code h-32 bg-background border-primary/10"
              value={output}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}