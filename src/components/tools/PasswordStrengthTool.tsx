"use client"

import { useState, useMemo } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { checkPasswordStrength } from '@/lib/passwords';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ShieldCheck, Info, CheckCircle2, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PasswordStrengthTool() {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const result = useMemo(() => checkPasswordStrength(password), [password]);

  const scoreColor = cn(
    result.score === 0 ? "bg-destructive" :
    result.score === 1 ? "bg-orange-500" :
    result.score === 2 ? "bg-yellow-500" :
    result.score === 3 ? "bg-green-500" :
    "bg-primary"
  );

  const scoreText = cn(
    result.score === 0 ? "text-destructive" :
    result.score === 1 ? "text-orange-500" :
    result.score === 2 ? "text-yellow-500" :
    result.score === 3 ? "text-green-500" :
    "text-primary"
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">{t('tools.password_strength.name')}</h1>
          <p className="text-muted-foreground">{t('tools.password_strength.description')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-7 space-y-6">
          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">{t('common.input')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>{t('common.password')}</Label>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password to test..."
                    className="h-12 text-lg pr-12 font-code"
                  />
                  <button 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {password && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex justify-between items-end mb-1">
                    <span className={cn("text-xl font-black uppercase tracking-tighter", scoreText)}>
                      {t(`pass_tool.strength.${result.label}`)}
                    </span>
                    <span className="text-xs font-bold text-muted-foreground">
                      {t('pass_tool.strength.entropy')}: {result.entropy} {t('pass_tool.strength.bits')}
                    </span>
                  </div>
                  <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full transition-all duration-500", scoreColor)}
                      style={{ width: `${(result.score + 1) * 20}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                {t('pass_tool.strength.tips')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.feedback.length > 0 ? (
                <ul className="space-y-2">
                  {result.feedback.map((f, i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted-foreground items-start">
                      <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                      {t(f)}
                    </li>
                  ))}
                </ul>
              ) : password ? (
                <div className="flex gap-2 text-sm text-green-600 items-center font-bold">
                  <CheckCircle2 className="h-4 w-4" />
                  Great job! This is a solid password.
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">Input a password to see suggestions.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-5 space-y-6">
          <Card className="border-border bg-primary/5 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-bold">What is Entropy?</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-3 leading-relaxed text-muted-foreground">
              <p>
                Entropy is a measure of password randomness. Higher entropy means it's harder for computers to guess your password.
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li><strong>&lt; 28 bits:</strong> Very weak</li>
                <li><strong>28-35 bits:</strong> Weak</li>
                <li><strong>36-59 bits:</strong> Fair</li>
                <li><strong>60-127 bits:</strong> Strong</li>
                <li><strong>128+ bits:</strong> Very strong</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
