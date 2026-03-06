"use client"

import { useState, useEffect } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { rot13 } from '@/lib/obfuscation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Copy, Trash2, RefreshCw, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Rot13Page() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLive, setIsLive] = useState(true);

  const handleProcess = () => {
    setOutput(rot13(input));
  };

  useEffect(() => {
    if (isLive) {
      handleProcess();
    }
  }, [input, isLive]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({ title: t('common.copied') });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <RefreshCw className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">ROT13 Encode / Decode</h1>
          <p className="text-muted-foreground">{t('tools.rot13.description')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="border-border shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('common.input')}</CardTitle>
            <div className="flex items-center space-x-2">
              <Label htmlFor="live-mode" className="text-sm font-medium cursor-pointer">
                {t('common.liveMode')}
              </Label>
              <Switch id="live-mode" checked={isLive} onCheckedChange={setIsLive} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter text to rotate..."
              className="font-code min-h-[150px] bg-secondary/30"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            {!isLive && (
              <Button onClick={handleProcess} className="w-full">
                <Wand2 className="h-4 w-4 mr-2" />
                Process ROT13
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="border-border shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('common.output')}</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyToClipboard} disabled={!output}>
                <Copy className="h-4 w-4 mr-2" />
                {t('common.copy')}
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => {setInput(''); setOutput('');}}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              readOnly
              className="font-code min-h-[150px] bg-secondary/10"
              value={output}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
