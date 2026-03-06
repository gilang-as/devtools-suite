
"use client"

import { useState } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { pgpEncrypt, pgpDecrypt, pgpSign, pgpVerify } from '@/lib/pgp';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, ShieldCheck, Key, FileText, Copy, CheckCircle2, XCircle, ShieldEllipsis } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PgpPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('encrypt');
  
  const [input, setInput] = useState('');
  const [key, setKey] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [signature, setSignature] = useState('');
  const [output, setOutput] = useState('');
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);

  const handleAction = async () => {
    try {
      setOutput('');
      setVerificationResult(null);
      if (!input.trim() || !key.trim()) return;

      if (activeTab === 'encrypt') {
        const res = await pgpEncrypt(input, key);
        setOutput(res);
      } else if (activeTab === 'decrypt') {
        const res = await pgpDecrypt(input, key, passphrase);
        setOutput(res);
      } else if (activeTab === 'sign') {
        const res = await pgpSign(input, key, passphrase);
        setOutput(res);
      } else if (activeTab === 'verify') {
        const isValid = await pgpVerify(input, signature, key);
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
          <ShieldEllipsis className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">PGP / GPG Tools</h1>
          <p className="text-muted-foreground">Standard OpenPGP encryption and signing for secure messaging.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full h-12 bg-muted/50 p-1">
          <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
          <TabsTrigger value="decrypt">Decrypt</TabsTrigger>
          <TabsTrigger value="sign">Sign</TabsTrigger>
          <TabsTrigger value="verify">Verify</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-border shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Key className="h-4 w-4 text-primary" />
                  {activeTab === 'encrypt' || activeTab === 'verify' ? 'Public Key' : 'Private Key'}
                </CardTitle>
                <CardDescription>Armored PGP key block</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea 
                  placeholder="-----BEGIN PGP PUBLIC/PRIVATE KEY BLOCK-----..."
                  className="font-code text-[10px] h-64 bg-secondary/30"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                />
                {(activeTab === 'decrypt' || activeTab === 'sign') && (
                  <div className="space-y-2">
                    <Label>Key Passphrase (if any)</Label>
                    <Input 
                      type="password"
                      value={passphrase}
                      onChange={(e) => setPassphrase(e.target.value)}
                      className="bg-secondary/30"
                    />
                  </div>
                )}
                {activeTab === 'verify' && (
                  <div className="space-y-2">
                    <Label>Armored Signature</Label>
                    <Textarea 
                      placeholder="-----BEGIN PGP SIGNATURE-----..."
                      className="font-code text-[10px] h-24 bg-secondary/30"
                      value={signature}
                      onChange={(e) => setSignature(e.target.value)}
                    />
                  </div>
                )}
                <Button onClick={handleAction} className="w-full h-11" size="lg">
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Run PGP Operation
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
                  placeholder="Enter content here..."
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
                      <p className="font-bold text-lg">{verificationResult ? 'PGP Signature Valid' : 'PGP Signature Invalid'}</p>
                      <p className="text-sm opacity-80">Message integrity confirmed by PGP.</p>
                    </div>
                  </div>
                ) : (
                  <Textarea
                    readOnly
                    className="font-code text-[10px] min-h-[250px] bg-background border-none resize-none"
                    value={output}
                    placeholder={t('common.placeholder_results')}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
