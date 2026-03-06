"use client"

import { useState, useEffect } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { computeHash, HashType } from '@/lib/hashing';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Copy, Fingerprint, RefreshCcw, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface HashGeneratorProps {
  type: HashType;
}

export default function HashGenerator({ type }: HashGeneratorProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLive, setIsLive] = useState(true);

  const handleCompute = () => {
    setOutput(computeHash(input, type));
  };

  useEffect(() => {
    if (isLive) {
      handleCompute();
    }
  }, [input, isLive, type]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({ title: t('common.copied') });
  };

  const KnowledgeBase = {
    md5: "MD5 produces a 128-bit hash. It's fast but cryptographically broken. Use only for integrity checks, never for security or passwords.",
    sha1: "SHA-1 produces a 160-bit hash. It's now considered weak and susceptible to collision attacks. Primarily used for legacy system compatibility.",
    sha256: "SHA-256 is part of the SHA-2 family. It's widely used in security protocols (SSL/TLS) and blockchain technology. Currently considered highly secure.",
    sha512: "SHA-512 offers a larger 512-bit digest. It provides extremely high security and is often faster on 64-bit architectures than SHA-256.",
    sha3: "SHA-3 is the latest NIST standard. It uses a completely different internal structure (Sponge construction) than SHA-2, providing extra safety against current SHA-2 weaknesses."
  }[type];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <Fingerprint className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">{t(`tools.${type}.name`)}</h1>
          <p className="text-muted-foreground">{t(`tools.${type}.description`)}</p>
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
              placeholder="Enter text to hash..."
              className="font-code min-h-[120px] bg-secondary/30"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            {!isLive && (
              <Button onClick={handleCompute} className="w-full">
                {t('common.hash')}
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="border-border shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('common.output')}</CardTitle>
            <Button variant="outline" size="sm" onClick={copyToClipboard} disabled={!output}>
              <Copy className="h-4 w-4 mr-2" />
              {t('common.copy')}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-background rounded-lg border font-code text-sm break-all min-h-[60px] flex items-center">
              {output || <span className="text-muted-foreground/50">Result will appear here...</span>}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/10">
          <CardContent className="pt-6 flex gap-3 items-start">
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="text-sm leading-relaxed text-muted-foreground">
              <strong>Security Note:</strong> {KnowledgeBase}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
