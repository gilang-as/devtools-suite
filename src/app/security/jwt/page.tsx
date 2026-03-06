
"use client"

import { useState } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { jwtDecode, jwtHeader, jwtSign, jwtVerify } from '@/lib/jwt';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, ShieldCheck, FileJson, Copy, CheckCircle2, XCircle, Braces } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function JwtPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('decode');
  
  const [token, setToken] = useState('');
  const [secret, setSecret] = useState('your-256-bit-secret');
  const [payload, setPayload] = useState('{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}');
  
  const [decodedHeader, setDecodedHeader] = useState<any>(null);
  const [decodedPayload, setDecodedPayload] = useState<any>(null);
  const [generatedToken, setGeneratedToken] = useState('');
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);

  const handleAction = async () => {
    try {
      if (activeTab === 'decode') {
        setDecodedHeader(jwtHeader(token));
        setDecodedPayload(jwtDecode(token));
      } else if (activeTab === 'encode') {
        const tok = await jwtSign(JSON.parse(payload), secret);
        setGeneratedToken(tok);
      } else if (activeTab === 'verify') {
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

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <KeyRound className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">JWT Tools</h1>
          <p className="text-muted-foreground">JSON Web Token generation, decoding, and verification.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full h-12 bg-muted/50 p-1">
          <TabsTrigger value="decode">Decode</TabsTrigger>
          <TabsTrigger value="encode">Encode / Sign</TabsTrigger>
          <TabsTrigger value="verify">Verify</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-border shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Input Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {(activeTab === 'decode' || activeTab === 'verify') && (
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
                
                {(activeTab === 'encode' || activeTab === 'verify') && (
                  <div className="space-y-2">
                    <Label>Secret Key (HMAC)</Label>
                    <Input 
                      value={secret} 
                      onChange={(e) => setSecret(e.target.value)} 
                      className="bg-secondary/30"
                    />
                  </div>
                )}

                {activeTab === 'encode' && (
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
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} JWT
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
                {activeTab === 'decode' && decodedPayload && (
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

                {activeTab === 'encode' && generatedToken && (
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

                {activeTab === 'verify' && verificationResult !== null && (
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
      </Tabs>
    </div>
  );
}
