"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/components/providers/i18n-provider';
import { encryptSymmetric, decryptSymmetric, SymmetricAlgo } from '@/lib/symmetric';
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
import { Copy, Lock, ShieldCheck, Info, RefreshCcw, ShieldAlert, Binary } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SymmetricToolProps {
  algo: SymmetricAlgo;
  type: 'encrypt' | 'decrypt';
}

export default function SymmetricTool({ algo, type }: SymmetricToolProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const pathname = usePathname();
  
  // Dynamic defaults based on algo
  const getDefaultKey = () => {
    if (algo === 'DES') return '8charKey';
    if (algo === '3DES') return '24characterKeyForTripleD';
    if (algo === 'ChaCha20') return '32characterKeyForChaCha20Encryption';
    return '1234567890123456';
  };

  const getDefaultIv = () => {
    if (algo === 'ChaCha20') return '12charNonce!';
    return '1234567890123456';
  };

  const [input, setInput] = useState('');
  const [key, setKey] = useState(getDefaultKey());
  const [iv, setIv] = useState(getDefaultIv());
  const [mode, setMode] = useState(algo === 'AES' ? 'GCM' : 'CBC');
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
        setOutput(encryptSymmetric(algo, input, key, iv, mode));
      } else {
        setOutput(decryptSymmetric(algo, input, key, iv, mode));
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
    let len = 16;
    if (algo === 'DES') len = 8;
    if (algo === '3DES') len = 24;
    if (algo === 'ChaCha20') len = 32;
    for (let i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setKey(result);
  };

  const navPrefix = algo === 'AES' ? '/security/aes' : algo === 'DES' ? '/security/des' : algo === '3DES' ? '/security/3des' : '/security/chacha20';

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <Lock className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold uppercase">
            {algo} {t(`common.${type}`)}
          </h1>
          <p className="text-muted-foreground">
            {t(`tools.${algo.toLowerCase()}_${type}.description`)}
          </p>
        </div>
      </div>

      <div className="flex p-1 bg-muted rounded-lg w-fit overflow-x-auto max-w-full shadow-sm border">
        <Link href={`${navPrefix}/encrypt`}>
          <Button 
            variant={pathname.includes('/encrypt') ? 'secondary' : 'ghost'} 
            className={cn("px-8 h-8", pathname.includes('/encrypt') && "bg-background shadow-sm")}
            size="sm"
          >
            {t('common.encrypt')}
          </Button>
        </Link>
        <Link href={`${navPrefix}/decrypt`}>
          <Button 
            variant={pathname.includes('/decrypt') ? 'secondary' : 'ghost'} 
            className={cn("px-8 h-8", pathname.includes('/decrypt') && "bg-background shadow-sm")}
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
              {algo !== 'ChaCha20' && (
                <div className="space-y-2">
                  <Label>{t('common.mode')}</Label>
                  <Select value={mode} onValueChange={setMode}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {algo === 'AES' ? (
                        <>
                          <SelectItem value="GCM">AES-GCM (Auth)</SelectItem>
                          <SelectItem value="CBC">AES-CBC (Classic)</SelectItem>
                          <SelectItem value="CTR">AES-CTR (Stream)</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="CBC">CBC (Chaining)</SelectItem>
                          <SelectItem value="ECB">ECB (Simple/Insecure)</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

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
                          <p className="text-xs">{t(`hints.${algo.toLowerCase()}_key`)}</p>
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
                  placeholder="Encryption Key"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  {algo === 'ChaCha20' ? 'Nonce' : t('common.iv')}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{t(`hints.${algo.toLowerCase()}_iv`)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input 
                  value={iv} 
                  onChange={(e) => setIv(e.target.value)} 
                  className="font-code text-xs bg-secondary/30"
                  placeholder={algo === 'ChaCha20' ? '12-char Nonce' : 'Initialization Vector'}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-primary/5 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                {t(`kb.${algo.toLowerCase()}.title`)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs leading-relaxed text-muted-foreground">
              <p>{t(`kb.${algo.toLowerCase()}.desc`)}</p>
              <p className="pt-2 border-t border-primary/10 italic">
                {t(`kb.${algo.toLowerCase()}.note`)}
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
