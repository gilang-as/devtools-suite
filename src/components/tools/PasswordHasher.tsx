"use client"

import { useState, useEffect } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { computeBcrypt, computeArgon2, computePbkdf2 } from '@/lib/hashing';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Lock, Copy, ShieldCheck, Loader2, Info, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PasswordHasherProps {
  algorithm: 'bcrypt' | 'argon2' | 'pbkdf2';
}

export default function PasswordHasher({ algorithm }: PasswordHasherProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [password, setPassword] = useState('password123');
  const [salt, setSalt] = useState('random_salt_string');
  const [rounds, setRounds] = useState(10); // bcrypt cost
  const [iterations, setIterations] = useState(1000); // pbkdf2/argon2 time
  const [memory, setMemory] = useState(1024); // argon2 memory
  const [hash, setHash] = useState('');
  const [loading, setLoading] = useState(false);

  const handleHash = async () => {
    setLoading(true);
    try {
      let result = '';
      if (algorithm === 'bcrypt') {
        result = computeBcrypt(password, rounds);
      } else if (algorithm === 'argon2') {
        result = await computeArgon2(password, salt, rounds, memory);
      } else {
        result = computePbkdf2(password, salt, iterations);
      }
      setHash(result);
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

  useEffect(() => {
    // Initial compute
    handleHash();
  }, [algorithm]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(hash);
    toast({ title: t('common.copied') });
  };

  const KnowledgeBase = {
    bcrypt: {
      title: "Bcrypt: Adaptive Hashing",
      desc: "Bcrypt is a battle-tested algorithm that uses a configurable 'cost factor' to slow down attackers. It stores the salt and cost inside the resulting hash string.",
      note: "Standard cost is 10-12. Going too high significantly increases computation time."
    },
    argon2: {
      title: "Argon2: The Modern Winner",
      desc: "Winner of the Password Hashing Competition. It is designed to resist GPU/ASIC cracking by being 'memory-hard'.",
      note: "Argon2id is the recommended version for most use cases."
    },
    pbkdf2: {
      title: "PBKDF2: Standard Derivation",
      desc: "Password-Based Key Derivation Function 2. It applies a pseudo-random function (like HMAC-SHA256) many times to make brute-force slow.",
      note: "NIST recommends at least 600,000 iterations for PBKDF2-HMAC-SHA256."
    }
  }[algorithm];

  const InfoIcon = ({ content }: { content: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className="inline-flex text-muted-foreground hover:text-primary transition-colors">
            <Info className="h-3.5 w-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-xs">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <Lock className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">{t(`tools.${algorithm}.name`)}</h1>
          <p className="text-muted-foreground">{t(`tools.${algorithm}.description`)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Config</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>{t('common.password')}</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>

              {(algorithm === 'argon2' || algorithm === 'pbkdf2') && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label>{t('common.salt')}</Label>
                    <InfoIcon content="A unique string added to the password to prevent pre-computed rainbow table attacks." />
                  </div>
                  <Input value={salt} onChange={(e) => setSalt(e.target.value)} />
                </div>
              )}

              {algorithm === 'bcrypt' && (
                <div className="space-y-4 pt-2">
                  <div className="flex justify-between">
                    <Label>Cost Factor (Rounds)</Label>
                    <span className="text-xs font-bold text-primary">{rounds} (2^{rounds})</span>
                  </div>
                  <Slider value={[rounds]} min={4} max={15} step={1} onValueChange={([v]) => setRounds(v)} />
                </div>
              )}

              {algorithm === 'pbkdf2' && (
                <div className="space-y-2">
                  <Label>{t('common.iterations')}</Label>
                  <Input type="number" value={iterations} onChange={(e) => setIterations(parseInt(e.target.value) || 1000)} />
                </div>
              )}

              {algorithm === 'argon2' && (
                <div className="space-y-4 pt-2">
                  <div className="flex justify-between">
                    <Label>Memory (KB)</Label>
                    <span className="text-xs font-bold text-primary">{memory} KB</span>
                  </div>
                  <Slider value={[memory]} min={512} max={16384} step={512} onValueChange={([v]) => setMemory(v)} />
                </div>
              )}

              <Button onClick={handleHash} className="w-full h-11" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ShieldCheck className="h-4 w-4 mr-2" />}
                {t('common.generate')} Hash
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border bg-primary/5 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                {KnowledgeBase.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs leading-relaxed text-muted-foreground">
              <p>{KnowledgeBase.desc}</p>
              <div className="pt-2 border-t border-primary/10">
                <p className="font-bold text-primary">Best Practice</p>
                <p>{KnowledgeBase.note}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="lg:col-span-7 border-border shadow-lg bg-secondary/10 overflow-hidden h-fit">
          <CardHeader className="flex flex-row items-center justify-between pb-4 bg-background">
            <CardTitle className="text-lg">Generated Hash</CardTitle>
            <Button variant="outline" size="sm" onClick={copyToClipboard} disabled={!hash}>
              <Copy className="h-4 w-4 mr-2" />
              {t('common.copy')}
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="p-6 bg-background rounded-xl border-2 border-primary/10 shadow-inner break-all font-code text-sm leading-relaxed min-h-[120px] flex items-center">
              {hash || <span className="text-muted-foreground/50">Your hash will appear here...</span>}
            </div>
            <p className="text-[10px] text-muted-foreground mt-4 italic text-center">
              * Verification: For real apps, never trust client-side hashing alone. Perform final hashing on the server.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
