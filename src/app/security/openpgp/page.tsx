"use client"

import { useState } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { generatePgpKey } from '@/lib/advanced-security';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Lock, User, Mail, ShieldCheck, Copy, Loader2, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function OpenPgpPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [name, setName] = useState('Alice Doe');
  const [email, setEmail] = useState('alice@example.com');
  const [keys, setKeys] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generatePgpKey(name, email);
      setKeys(result);
    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: e.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: t('common.copied') });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <Lock className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">{t('tools.openpgp.name')}</h1>
          <p className="text-muted-foreground">{t('tools.openpgp.description')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-4 h-fit border-border shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Identity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button onClick={handleGenerate} className="w-full h-11" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ShieldCheck className="h-4 w-4 mr-2" />}
              {t('common.generate')} PGP Pair
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-8 space-y-6">
          {!keys ? (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-muted/20 text-muted-foreground">
              <Lock className="h-16 w-16 mb-4 opacity-20" />
              <p>Generate keys to view the PGP block result</p>
            </div>
          ) : (
            <>
              <Card className="border-border shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between py-3">
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary">Public Key</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(keys.publicKey)}>
                    <Copy className="h-3.5 w-3.5 mr-1.5" />
                    {t('common.copy')}
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <Textarea readOnly className="font-code text-xs h-48 bg-secondary/20 border-none resize-none" value={keys.publicKey} />
                </CardContent>
              </Card>

              <Card className="border-border shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between py-3">
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-orange-500">Private Key</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(keys.privateKey)}>
                    <Copy className="h-3.5 w-3.5 mr-1.5" />
                    {t('common.copy')}
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <Textarea readOnly className="font-code text-xs h-48 bg-secondary/20 border-none resize-none" value={keys.privateKey} />
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}