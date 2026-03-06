"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/components/providers/i18n-provider';
import { computeHmac, HmacType } from '@/lib/hashing';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Copy, ShieldCheck, Info, KeyRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface HmacGeneratorProps {
  type: HmacType;
}

export default function HmacGenerator({ type }: HmacGeneratorProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const pathname = usePathname();
  const [input, setInput] = useState('');
  const [secret, setSecret] = useState('');
  const [output, setOutput] = useState('');
  const [isLive, setIsLive] = useState(true);

  const handleCompute = () => {
    setOutput(computeHmac(input, secret, type));
  };

  useEffect(() => {
    if (isLive) {
      handleCompute();
    }
  }, [input, secret, isLive, type]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({ title: t('common.copied') });
  };

  const KnowledgeBase = {
    sha1: "HMAC-SHA1 uses the SHA-1 hash function. While SHA-1 is weak for collisions, HMAC-SHA1 is still considered mathematically strong for authentication, though modern systems prefer SHA-256.",
    sha256: "HMAC-SHA256 is the industry standard for message authentication. It's used in JWT (HS256), AWS signing, and many secure APIs.",
    sha512: "HMAC-SHA512 provides the highest level of security in the HMAC family, often used in high-security financial or military systems."
  }[type];

  const navItems = [
    { name: 'HMAC-SHA1', href: '/hashing/hmac-sha1' },
    { name: 'HMAC-SHA256', href: '/hashing/hmac-sha256' },
    { name: 'HMAC-SHA512', href: '/hashing/hmac-sha512' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <KeyRound className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold uppercase">{t(`tools.hmac_${type}.name`)}</h1>
          <p className="text-muted-foreground">{t(`tools.hmac_${type}.description`)}</p>
        </div>
      </div>

      <div className="flex p-1 bg-muted rounded-lg w-fit overflow-x-auto max-w-full">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button 
              variant={pathname === item.href ? 'secondary' : 'ghost'} 
              className={cn("px-6 h-8 whitespace-nowrap", pathname === item.href && "bg-background shadow-sm")}
              size="sm"
            >
              {item.name}
            </Button>
          </Link>
        ))}
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
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                {t('common.secret_key')}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">The private key used to sign the message.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input 
                type="text" 
                placeholder="Enter secret key..." 
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="bg-secondary/30"
              />
            </div>
            
            <div className="space-y-2">
              <Label>{t('common.input')} Data</Label>
              <Textarea
                placeholder="Enter message to sign..."
                className="font-code min-h-[120px] bg-secondary/30"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            {!isLive && (
              <Button onClick={handleCompute} className="w-full">
                Generate HMAC
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
            <div className="p-4 bg-background rounded-lg border-2 border-primary/10 font-code text-sm break-all min-h-[60px] flex items-center shadow-inner">
              {output || <span className="text-muted-foreground/50 italic">Waiting for input and secret key...</span>}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/10">
          <CardContent className="pt-6 flex gap-3 items-start">
            <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="text-sm leading-relaxed text-muted-foreground">
              <strong>Security Note:</strong> {KnowledgeBase} HMAC is superior to a simple hash for verification because even if an attacker changes the message, they cannot reproduce the HMAC without your Secret Key.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
