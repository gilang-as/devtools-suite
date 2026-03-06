"use client"

import { useState } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { generateJwt } from '@/lib/advanced-security';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { KeyRound, Copy, RefreshCcw, ShieldCheck, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function JosePage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [payload, setPayload] = useState('{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}');
  const [secret, setSecret] = useState('your-256-bit-secret');
  const [jwt, setJwt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const parsedPayload = JSON.parse(payload);
      const result = await generateJwt(parsedPayload, secret);
      setJwt(result);
    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: 'Invalid JSON payload or secret: ' + e.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jwt);
    toast({ title: t('common.copied') });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <KeyRound className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">{t('tools.jose.name')}</h1>
          <p className="text-muted-foreground">{t('tools.jose.description')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-border shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Configuration</CardTitle>
            <CardDescription>Setup your JWT payload and signing secret</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Payload (JSON)</Label>
              <Textarea
                className="font-code h-48 bg-secondary/30"
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Secret Key</Label>
              <Input
                type="text"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="HMAC-SHA256 Secret"
              />
            </div>
            <Button onClick={handleGenerate} className="w-full h-11" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ShieldCheck className="h-4 w-4 mr-2" />}
              {t('common.generate')} JWT
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border shadow-lg bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Encoded Result</CardTitle>
            <Button variant="outline" size="sm" onClick={copyToClipboard} disabled={!jwt}>
              <Copy className="h-4 w-4 mr-2" />
              {t('common.copy')}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-background rounded-lg border border-primary/20 break-all font-code text-sm min-h-[200px]">
              {jwt || <span className="text-muted-foreground/50">Your encoded JWT will appear here...</span>}
            </div>
            <div className="text-xs text-muted-foreground">
              <p className="font-bold mb-1">Standard Header:</p>
              <pre className="bg-background/50 p-2 rounded">{"{\n  \"alg\": \"HS256\",\n  \"typ\": \"JWT\"\n}"}</pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}