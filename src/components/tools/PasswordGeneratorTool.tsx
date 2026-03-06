"use client"

import { useState, useEffect } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { generatePassword, PasswordOptions } from '@/lib/passwords';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Copy, RefreshCcw, ShieldCheck, Lock, Info, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function PasswordGeneratorTool() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    upper: true,
    lower: true,
    number: true,
    special: true,
    avoidSimilar: false
  });

  const handleGenerate = () => {
    const newPass = generatePassword(options);
    setPassword(newPass);
    setCopied(false);
  };

  useEffect(() => {
    handleGenerate();
  }, [options]);

  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    toast({ title: t('common.copied') });
    setTimeout(() => setCopied(false), 2000);
  };

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
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <Lock className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">{t('tools.password_generator.name')}</h1>
          <p className="text-muted-foreground">{t('tools.password_generator.description')}</p>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="border-border shadow-lg overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Input 
                  readOnly 
                  value={password} 
                  className="font-code text-xl h-14 bg-secondary/30 pr-12 text-center sm:text-left"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-12 w-12 hover:bg-transparent"
                  onClick={copyToClipboard}
                >
                  {copied ? <Check className="h-6 w-6 text-green-500" /> : <Copy className="h-6 w-6" />}
                </Button>
              </div>
              <Button onClick={handleGenerate} className="h-14 px-8 shadow-md" size="lg">
                <RefreshCcw className="h-5 w-5 mr-2" />
                {t('common.generate')}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <Card className="md:col-span-7 border-border shadow-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                {t('pass_tool.generator.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-bold">{t('common.length')}</Label>
                  <span className="text-lg font-black text-primary font-code">{options.length}</span>
                </div>
                <Slider 
                  value={[options.length]} 
                  min={4} 
                  max={64} 
                  step={1} 
                  onValueChange={([v]) => setOptions({ ...options, length: v })} 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                  <div className="flex items-center gap-2">
                    <Label className="cursor-pointer">{t('pass_tool.generator.upper')}</Label>
                    <InfoIcon content={t('hints.pass_gen_upper')} />
                  </div>
                  <Switch 
                    checked={options.upper} 
                    onCheckedChange={(v) => setOptions({ ...options, upper: v })} 
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                  <div className="flex items-center gap-2">
                    <Label className="cursor-pointer">{t('pass_tool.generator.lower')}</Label>
                    <InfoIcon content={t('hints.pass_gen_lower')} />
                  </div>
                  <Switch 
                    checked={options.lower} 
                    onCheckedChange={(v) => setOptions({ ...options, lower: v })} 
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                  <div className="flex items-center gap-2">
                    <Label className="cursor-pointer">{t('pass_tool.generator.number')}</Label>
                    <InfoIcon content={t('hints.pass_gen_number')} />
                  </div>
                  <Switch 
                    checked={options.number} 
                    onCheckedChange={(v) => setOptions({ ...options, number: v })} 
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                  <div className="flex items-center gap-2">
                    <Label className="cursor-pointer">{t('pass_tool.generator.special')}</Label>
                    <InfoIcon content={t('hints.pass_gen_special')} />
                  </div>
                  <Switch 
                    checked={options.special} 
                    onCheckedChange={(v) => setOptions({ ...options, special: v })} 
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border bg-primary/5 border-primary/10">
                <div className="flex items-center gap-2">
                  <Label className="cursor-pointer font-bold text-primary">{t('pass_tool.generator.similar')}</Label>
                  <InfoIcon content={t('hints.pass_gen_similar')} />
                </div>
                <Switch 
                  checked={options.avoidSimilar} 
                  onCheckedChange={(v) => setOptions({ ...options, avoidSimilar: v })} 
                />
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-5 border-border bg-secondary/5 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                {t('common.best_practice')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs leading-relaxed text-muted-foreground">
              <p>Strong passwords should be long (12+ characters) and contain a mix of different character types.</p>
              <p className="p-3 bg-background rounded border italic">
                Entropy: Cryptographically secure random passwords generated locally are extremely difficult to crack via brute-force.
              </p>
              <p className="pt-2 border-t">
                Privacy: All generation happens via the Web Crypto API in your browser. Nothing is ever transmitted.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
