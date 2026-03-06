"use client"

import { useState, useEffect } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, RefreshCw, Copy, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function UnixGeneratorPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = Math.floor(now.getTime() / 1000);
  const milliseconds = now.getTime();

  const copy = (val: number) => {
    navigator.clipboard.writeText(val.toString());
    toast({ title: t('common.copied') });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <Zap className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">{t('tools.unix_timestamp_generator.name')}</h1>
          <p className="text-muted-foreground">{t('tools.unix_timestamp_generator.description')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border shadow-lg overflow-hidden group">
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Seconds</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 text-center space-y-4">
            <div className="text-5xl font-code font-black text-primary tracking-tighter">
              {seconds}
            </div>
            <Button onClick={() => copy(seconds)} size="lg" className="w-full">
              <Copy className="h-4 w-4 mr-2" />
              Copy Timestamp
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border shadow-lg overflow-hidden group">
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Milliseconds</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 text-center space-y-4">
            <div className="text-5xl font-code font-black text-primary tracking-tighter">
              {milliseconds}
            </div>
            <Button onClick={() => copy(milliseconds)} size="lg" className="w-full" variant="secondary">
              <Copy className="h-4 w-4 mr-2" />
              Copy Milliseconds
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-secondary/10">
        <CardContent className="py-10 text-center space-y-4">
          <div className="flex items-center justify-center gap-3 text-muted-foreground">
            <Clock className="h-5 w-5 animate-pulse" />
            <span className="font-medium">Current System Time:</span>
            <span className="font-bold text-foreground">{now.toLocaleString()}</span>
          </div>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Unix time is the number of seconds that have elapsed since January 1, 1970 (midnight UTC/GMT), not counting leap seconds.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
