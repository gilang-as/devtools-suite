"use client"

import { useState } from 'react';
import bcrypt from 'bcryptjs';
import { useTranslation } from '@/components/providers/i18n-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ShieldCheck, CheckCircle2, XCircle, Loader2, KeyRound, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PasswordCompareTool() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [hash, setHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleCompare = async () => {
    if (!password || !hash) return;
    setLoading(true);
    setResult(null);
    
    try {
      // Small timeout to allow loader to show (bcrypt is CPU intensive)
      setTimeout(() => {
        try {
          const match = bcrypt.compareSync(password, hash.trim());
          setResult(match);
        } catch (e: any) {
          toast({
            variant: 'destructive',
            title: t('common.error'),
            description: 'Invalid hash format.',
          });
        } finally {
          setLoading(false);
        }
      }, 50);
    } catch (e: any) {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <KeyRound className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">{t('tools.password_compare.name')}</h1>
          <p className="text-muted-foreground">{t('tools.password_compare.description')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">{t('common.input')}</CardTitle>
              <CardDescription>Enter the values to verify matching credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>{t('common.password')}</Label>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Plaintext password..."
                    className="h-12 pr-12 font-code"
                  />
                  <button 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t('pass_tool.compare.hash_label')}</Label>
                <Textarea 
                  value={hash}
                  onChange={(e) => setHash(e.target.value)}
                  placeholder="Paste hash here (e.g., $2a$10$...)"
                  className="font-code h-24 bg-secondary/30"
                />
              </div>

              <Button onClick={handleCompare} className="w-full h-12 text-lg shadow-md" disabled={loading || !password || !hash}>
                {loading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <ShieldCheck className="h-5 w-5 mr-2" />}
                {t('common.verify')}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-center">
          {result !== null ? (
            <div className={`p-8 rounded-3xl border-2 flex flex-col items-center justify-center text-center gap-4 animate-in zoom-in-95 duration-300 ${result ? 'bg-green-500/10 border-green-500/20 text-green-600' : 'bg-destructive/10 border-destructive/20 text-destructive'}`}>
              {result ? <CheckCircle2 className="h-16 w-16" /> : <XCircle className="h-16 w-16" />}
              <div>
                <p className="font-black text-2xl mb-1">
                  {result ? t('pass_tool.compare.match') : t('pass_tool.compare.no_match')}
                </p>
                <p className="text-sm opacity-80 leading-relaxed px-4">
                  {result ? t('pass_tool.compare.valid_proof') : t('pass_tool.compare.invalid_proof')}
                </p>
              </div>
              <Button variant="outline" className="mt-2 bg-background" onClick={() => {setResult(null); setPassword(''); setHash('');}}>
                Reset Test
              </Button>
            </div>
          ) : (
            <div className="h-full min-h-[300px] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-muted-foreground opacity-30 text-center px-8">
              <ShieldCheck className="h-16 w-16 mb-4" />
              <p className="font-medium">Verification results will appear here after calculation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
