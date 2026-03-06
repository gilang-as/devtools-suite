"use client"

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/components/providers/i18n-provider';
import { rsaEncrypt, rsaDecrypt, rsaSign, rsaVerify } from '@/lib/rsa';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Lock, ShieldCheck, Key, FileText, Copy, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface RsaToolProps {
  type: 'encrypt' | 'decrypt' | 'sign' | 'verify';
}

export default function RsaTool({ type }: RsaToolProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const pathname = usePathname();
  
  const [input, setInput] = useState('');
  const [key, setKey] = useState('');
  const [signature, setSignature] = useState('');
  const [output, setOutput] = useState('');
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);

  const handleAction = () => {
    try {
      setOutput('');
      setVerificationResult(null);
      if (!input.trim() || !key.trim()) return;

      if (type === 'encrypt') {
        setOutput(rsaEncrypt(input, key));
      } else if (type === 'decrypt') {
        setOutput(rsaDecrypt(input, key));
      } else if (type === 'sign') {
        setOutput(rsaSign(input, key));
      } else if (type === 'verify') {
        const isValid = rsaVerify(input, signature, key);
        setVerificationResult(isValid);
      }
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

  const navItems = [
    { name: 'Encrypt', href: '/security/rsa/encrypt' },
    { name: 'Decrypt', href: '/security/rsa/decrypt' },
    { name: 'Sign', href: '/security/rsa/sign' },
    { name: 'Verify', href: '/security/rsa/verify' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">RSA Security Tool</h1>
          <p className="text-muted-foreground">{t(`tools.rsa_${type}.description`)}</p>
        </div>
      </div>

      <div className="flex p-1 bg-muted rounded-lg w-fit overflow-x-auto max-w-full shadow-sm border">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button 
              variant={pathname === item.href ? 'secondary' : 'ghost'} 
              className={cn("px-8 h-8 whitespace-nowrap", pathname === item.href && "bg-background shadow-sm")}
              size="sm"
            >
              {item.name}
            </Button>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Key className="h-4 w-4 text-primary" />
                {type === 'encrypt' || type === 'verify' ? 'Public Key' : 'Private Key'}
              </CardTitle>
              <CardDescription>Paste your RSA PEM key here</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                placeholder="-----BEGIN RSA PUBLIC/PRIVATE KEY-----..."
                className="font-code text-[10px] h-64 bg-secondary/30"
                value={key}
                onChange={(e) => setKey(e.target.value)}
              />
              {type === 'verify' && (
                <div className="space-y-2">
                  <Label>Signature (Base64)</Label>
                  <Textarea 
                    placeholder="Paste signature to verify..."
                    className="font-code text-[10px] h-20 bg-secondary/30"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                  />
                </div>
              )}
              <Button onClick={handleAction} className="w-full h-11" size="lg">
                <Lock className="h-4 w-4 mr-2" />
                Run Operation
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                {t('common.input')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter message here..."
                className="font-code min-h-[150px] bg-secondary/30"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </CardContent>
          </Card>

          <Card className="border-border shadow-lg bg-secondary/5 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-background border-b py-3">
              <CardTitle className="text-lg">{t('common.output')}</CardTitle>
              {output && (
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-2" />
                  {t('common.copy')}
                </Button>
              )}
            </CardHeader>
            <CardContent className="pt-6">
              {verificationResult !== null ? (
                <div className={`p-6 rounded-xl border-2 flex items-center gap-4 ${verificationResult ? 'bg-green-500/10 border-green-500/20 text-green-600' : 'bg-destructive/10 border-destructive/20 text-destructive'}`}>
                  {verificationResult ? <CheckCircle2 className="h-8 w-8" /> : <XCircle className="h-8 w-8" />}
                  <div>
                    <p className="font-bold text-lg">{verificationResult ? 'Signature Valid' : 'Signature Invalid'}</p>
                    <p className="text-sm opacity-80">{verificationResult ? 'The message integrity and authorship are confirmed.' : 'The signature does not match the message and key.'}</p>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-background rounded-xl border-2 border-primary/10 shadow-inner break-all font-code text-sm min-h-[120px] flex items-center">
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