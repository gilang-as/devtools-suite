"use client"

import { useState, useEffect } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { computeCrc32, computeAdler32 } from '@/lib/generators';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Copy, Fingerprint, Info, FileSearch, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChecksumGeneratorProps {
  algorithm: 'crc32' | 'adler32';
}

export default function ChecksumGenerator({ algorithm }: ChecksumGeneratorProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLive, setIsLive] = useState(true);

  const handleCompute = () => {
    if (!input) {
      setOutput('');
      return;
    }
    const result = algorithm === 'crc32' ? computeCrc32(input) : computeAdler32(input);
    setOutput(result);
  };

  useEffect(() => {
    if (isLive) {
      handleCompute();
    }
  }, [input, isLive, algorithm]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({ title: t('common.copied') });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <FileSearch className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold uppercase">{algorithm} Checksum</h1>
          <p className="text-muted-foreground">{t(`tools.${algorithm}.description`)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="border-border shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('common.input')}</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="live-mode" className="text-xs font-medium cursor-pointer">
                  {t('common.liveMode')}
                </Label>
                <Switch id="live-mode" checked={isLive} onCheckedChange={setIsLive} />
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setInput('')}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste text to generate checksum..."
              className="font-code min-h-[150px] bg-secondary/30"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            {!isLive && (
              <Button onClick={handleCompute} className="w-full">
                Compute {algorithm.toUpperCase()}
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="border-border shadow-lg bg-secondary/5 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-background border-b py-3">
            <CardTitle className="text-lg">Result</CardTitle>
            <Button variant="outline" size="sm" onClick={copyToClipboard} disabled={!output}>
              <Copy className="h-4 w-4 mr-2" />
              {t('common.copy')}
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="p-6 bg-background rounded-xl border-2 border-primary/10 shadow-inner flex flex-col items-center justify-center gap-2">
              <span className="text-4xl font-code font-black text-primary tracking-widest">
                {output || '00000000'}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                {algorithm} Hex Representation
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/10">
          <CardContent className="pt-6 flex gap-3 items-start">
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="text-sm leading-relaxed text-muted-foreground">
              <strong>About {algorithm.toUpperCase()}:</strong> {t(`kb.${algorithm}`)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
