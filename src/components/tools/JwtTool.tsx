"use client"

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/components/providers/i18n-provider';
import { jwtDecode, jwtHeader, jwtSign, jwtVerify } from '@/lib/jwt';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, ShieldCheck, Copy, CheckCircle2, XCircle, Braces } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface JwtToolProps {
  type: 'encode' | 'decode' | 'verify';
}

export default function JwtTool({ type }: JwtToolProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const pathname = usePathname();
  
  const [token, setToken] = useState('');
  const [secret, setSecret] = useState('your-256-bit-secret');
  const [payload, setPayload] = useState('{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}');
  
  const [decodedHeader, setDecodedHeader] = useState<any>(null);
  const [decodedPayload, setDecodedPayload] = useState<any>(null);
  const [generatedToken, setGeneratedToken] = useState('');
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);

  const handleAction = async () => {
    try {
      if (type === 'decode') {
        setDecodedHeader(jwtHeader(token));
        setDecodedPayload(jwtDecode(token));
      } else if (type === 'encode') {
        const tok = await jwtSign(JSON.parse(payload), secret);
        setGeneratedToken(tok);
      } else if (type === 'verify') {
        const isValid = await jwtVerify(token, secret);
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

  const navItems = [
    { name: 'Decode', href: '/security/jwt/decode' },
    { name: 'Encode', href: '/security/jwt/encode' },
    { name: 'Verify', href: '/security/jwt/verify' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <KeyRound className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">JWT Tools</h1>
          <p className="text-muted-foreground">{t(`tools.jwt_${type}.description`)}</p>
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
              <CardTitle className="text-lg">Input Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {(type === 'decode' || type === 'verify') && (
                <div className="space-y-2">
                  <Label>JWT Token</Label>
                  <Textarea 
                    placeholder="Paste JWT here (header.payload.signature)..."
                    className="font-code text-xs h-32 bg-secondary/30"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                  />
                </div>
              )}
              
              {(type === 'encode' || type === 'verify') && (
                <div className="space-y-2">
                  <Label>Secret Key (HMAC)</Label>
                  <Input 
                    value={secret} 
                    onChange={(e) => setSecret(e.target.value)} 
                    className="bg-secondary/30"
                  />
                </div>
              )}

              {type === 'encode' && (
                <div className="space-y-2">
                  <Label>Payload (JSON)</Label>
                  <Textarea 
                    className="font-code text-xs h-48 bg-secondary/30"
                    value={payload}
                    onChange={(e) => setPayload(e.target.value)}
                  />
                </div>
              )}

              <Button onClick={handleAction} className="w-full h-11" size="lg">
                <ShieldCheck className="h-4 w-4 mr-2" />
                Run JWT Operation
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <Card className="border-border shadow-lg min-h-[400px]">
            <CardHeader className="border-b bg-muted/20">
              <CardTitle className="text-lg">Result</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {type === 'decode' && decodedPayload && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Header</Label>
                    <pre className="p-4 bg-muted/50 rounded-lg font-code text-xs overflow-auto border border-primary/10">
                      {JSON.stringify(decodedHeader, null, 2)}
                    </pre>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Payload</Label>
                    <pre className="p-4 bg-muted/50 rounded-lg font-code text-xs overflow-auto border border-primary/10">
                      {JSON.stringify(decodedPayload, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {type === 'encode' && generatedToken && (
                <div className="space-y-4">
                  <div className="p-4 bg-primary/5 rounded-lg border-2 border-dashed border-primary/20 break-all font-code text-sm">
                    {generatedToken}
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => navigator.clipboard.writeText(generatedToken)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Token
                  </Button>
                </div>
              )}

              {type === 'verify' && verificationResult !== null && (
                <div className={`p-10 rounded-2xl border-2 flex flex-col items-center justify-center gap-4 text-center ${verificationResult ? 'bg-green-500/10 border-green-500/20 text-green-600' : 'bg-destructive/10 border-destructive/20 text-destructive'}`}>
                  {verificationResult ? <CheckCircle2 className="h-16 w-16" /> : <XCircle className="h-16 w-16" />}
                  <div>
                    <p className="font-black text-2xl mb-1">{verificationResult ? 'VERIFIED' : 'VERIFICATION FAILED'}</p>
                    <p className="text-sm opacity-80">{verificationResult ? 'The token signature is valid and untampered.' : 'Invalid secret or corrupted token structure.'}</p>
                  </div>
                </div>
              )}

              {(!decodedPayload && !generatedToken && verificationResult === null) && (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-30 py-20">
                  <Braces className="h-16 w-16 mb-4" />
                  <p>Processed data will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}