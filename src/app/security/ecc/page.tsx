
"use client"

import { useState } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { eccSign, eccVerify } from '@/lib/ecc';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Zap, ShieldCheck, Key, FileText, Copy, CheckCircle2, XCircle, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function EccPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('sign');
  
  const [input, setInput] = useState('');
  const [key, setKey] = useState('');
  const [signature, setSignature] = useState('');
  const [output, setOutput] = useState('');
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);

  const handleAction = async () => {
    try {
      setOutput('');
      setVerificationResult(null);
      if (!input.trim() || !key.trim()) return;

      if (activeTab === 'sign') {
        const sig = await eccSign(input, key);
        setOutput(sig);
      } else {
        const isValid = await eccVerify(input, signature, key);
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
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <Activity className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">ECC Identity Tools</h1>
          <p className="text-muted-foreground">Modern Elliptic Curve Cryptography for high-performance signatures.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 w-[400px] h-12 bg-muted/50 p-1">
          <TabsTrigger value="sign">Sign</TabsTrigger>
          <TabsTrigger value="verify">Verify</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-border shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Key className="h-4 w-4 text-primary" />
                  {activeTab === 'sign' ? 'Private Key (PKCS#8)' : 'Public Key (SPKI)'}
                </CardTitle>
                <CardDescription>Support for NIST P-256 (ES256) curves</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea 
                  placeholder="-----BEGIN PUBLIC/PRIVATE KEY-----..."
                  className="font-code text-[10px] h-64 bg-secondary/30"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                />
                {activeTab === 'verify' && (
                  <div className="space-y-2">
                    <Label>Compact Signature</Label>
                    <Textarea 
                      placeholder="Paste JWS compact signature..."
                      className="font-code text-[10px] h-20 bg-secondary/30"
                      value={signature}
                      onChange={(e) => setSignature(e.target.value)}
                    />
                  </div>
                )}
                <Button onClick={handleAction} className="w-full h-11" size="lg">
                  <Zap className="h-4 w-4 mr-2" />
                  {activeTab === 'sign' ? 'Generate Signature' : 'Verify Identity'}
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
                  placeholder="Message to sign or verify..."
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
                  <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(output)}>
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
                      <p className="font-bold text-lg">{verificationResult ? 'ECC Signature Valid' : 'ECC Signature Invalid'}</p>
                      <p className="text-sm opacity-80">Cryptographic proof verified successfully.</p>
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
      </Tabs>
    </div>
  );
}
