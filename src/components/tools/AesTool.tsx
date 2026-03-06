"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/components/providers/i18n-provider';
import { encryptAes, decryptAes, AesMode } from '@/lib/symmetric';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Copy, Lock, ShieldCheck, Info, KeyRound, RefreshCcw, ShieldAlert, Binary } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AesToolProps {
  type: 'encrypt' | 'decrypt';
}

export default function AesTool({ type }: AesToolProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const pathname = usePathname();
  const [input, setInput] = useState('');
  const [key, setKey] = useState('1234567890123456'); // Default 128-bit key
  const [iv, setIv] = useState('1234567890123456');   // Default 128-bit IV
  const [mode, setMode] = useState<AesMode>('GCM');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleProcess = () => {
    try {
      setError(null);
      if (!input.trim()) {
        setOutput('');
        return;
      }

      if (type === 'encrypt') {
        setOutput(encryptAes(input, key, iv, mode));
      } else {
        setOutput(decryptAes(input, key, iv, mode));
      }
    } catch (e: any) {
      setError(e.message);
      setOutput('');
    }
  };

  useEffect(() => {
    handleProcess();
  }, [input, key, iv, mode]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({ title: t('common.copied') });
  };

  const generateRandomKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const length = mode === 'GCM' ? 12 : 16; // 12 for GCM IV, 16 for standard
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setKey(result);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <Lock className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">
            {t(`tools.aes_${type}.name`)}
          </h1>
          <p className="text-muted-foreground">
            {t(`tools.aes_${type}.description`)}
          </p>
        </div>
      </div>

      <div className="flex p-1 bg-muted rounded-lg w-fit overflow-x-auto max-w-full shadow-sm border">
        <Link href="/security/aes/encrypt">
          <Button 
            variant={pathname === '/security/aes/encrypt' ? 'secondary' : 'ghost'} 
            className={cn("px-8 h-8", pathname === '/security/aes/encrypt' && "bg-background shadow-sm")}
            size="sm"
          >
            {t('common.encrypt')}
          </Button>
        </Link>
        <Link href="/security/aes/decrypt">
          <Button 
            variant={pathname === '/security/aes/decrypt' ? 'secondary' : 'ghost'} 
            className={cn("px-8 h-8", pathname === '/security/aes/decrypt' && "bg-background shadow-sm")}
            size="sm"
          >
            {t('common.decrypt')}
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <RefreshCcw className="h-4 w-4 text-primary" />
                Config
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>{t('common.mode')}</Label>
                <Select value={mode} onValueChange={(v: AesMode) => setMode(v)}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GCM">AES-GCM (Auth)</SelectItem>
                    <SelectItem value="CBC">AES-CBC (Classic)</SelectItem>
                    <SelectItem value="CTR">AES-CTR (Stream)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-muted-foreground italic px-1">
                  {t('hints.aes_mode')}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    {t('common.key')}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">{t('hints.aes_key')}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Button variant="link" size="sm" className="h-auto p-0 text-[10px]" onClick={generateRandomKey}>
                    Generate Random
                  </Button>
                </div>
                <Input 
                  value={key} 
                  onChange={(e) => setKey(e.target.value)} 
                  className="font-code text-xs bg-secondary/30"
                  placeholder="Key (16, 24, 32 chars)"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  {t('common.iv')}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{t('hints.aes_iv')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input 
                  value={iv} 
                  onChange={(e) => setIv(e.target.value)} 
                  className="font-code text-xs bg-secondary/30"
                  placeholder="IV (usually 16 chars)"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-primary/5 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                {t('kb.aes.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs leading-relaxed text-muted-foreground">
              <p>{t('kb.aes.desc')}</p>
              <p className="pt-2 border-t border-primary/10 italic">
                {t('kb.aes.note')}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Binary className="h-5 w-5 text-primary" />
                {t('common.input')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder={type === 'encrypt' ? 'Enter text to encrypt...' : 'Enter Base64 ciphertext to decrypt...'}
                className="font-code min-h-[150px] bg-secondary/30"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </CardContent>
          </Card>

          <Card className="border-border shadow-lg bg-secondary/5 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-background border-b py-3">
              <CardTitle className="text-lg">{t('common.output')}</CardTitle>
              <Button variant="outline" size="sm" onClick={copyToClipboard} disabled={!output}>
                <Copy className="h-4 w-4 mr-2" />
                {t('common.copy')}
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              {error ? (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
                  <ShieldAlert className="h-5 w-5 text-destructive shrink-0" />
                  <p className="text-xs text-destructive font-bold">{error}</p>
                </div>
              ) : (
                <div className="p-6 bg-background rounded-xl border-2 border-primary/10 shadow-inner break-all font-code text-sm leading-relaxed min-h-[120px] flex items-center">
                  {output || <span className="text-muted-foreground/50 italic">{t('common.placeholder_results')}</span>}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
