"use client"

import { useState, useEffect } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { getAllTimezones, convertTimezone } from '@/lib/datetime';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Clock, ArrowRight, RefreshCw, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function TimezoneConverterPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [timezones, setTimezones] = useState<string[]>([]);
  const [fromTz, setFromTz] = useState('UTC');
  const [toTz, setToTz] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [result, setResult] = useState('');

  useEffect(() => {
    setTimezones(getAllTimezones());
  }, []);

  const handleConvert = () => {
    const now = new Date();
    setResult(convertTimezone(now, toTz));
  };

  useEffect(() => {
    handleConvert();
  }, [toTz, fromTz]);

  const copy = () => {
    navigator.clipboard.writeText(result);
    toast({ title: t('common.copied') });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <Globe className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">{t('tools.timezone_converter.name')}</h1>
          <p className="text-muted-foreground">{t('tools.timezone_converter.description')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <Card className="md:col-span-12 border-border shadow-lg">
          <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-11 gap-4 items-end">
            <div className="md:col-span-5 space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Target Timezone</Label>
              <Select value={toTz} onValueChange={setToTz}>
                <SelectTrigger className="bg-background h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map(tz => (
                    <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-1 flex justify-center pb-3">
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
            </div>

            <div className="md:col-span-5 flex flex-col gap-2">
              <Button onClick={handleConvert} size="lg" className="h-12 w-full">
                <RefreshCw className="h-4 w-4 mr-2" /> Refresh Current Time
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-12 border-border shadow-2xl bg-secondary/5 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-background py-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Converted Time</CardTitle>
            </div>
            <Button variant="outline" size="sm" onClick={copy}>
              <Copy className="h-4 w-4 mr-2" /> {t('common.copy')}
            </Button>
          </CardHeader>
          <CardContent className="py-12 text-center">
            <div className="space-y-4">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-primary/60">{toTz}</p>
              <h2 className="text-4xl md:text-5xl font-headline font-black text-foreground tracking-tighter">
                {result || '...'}
              </h2>
              <div className="bg-primary/10 inline-block px-4 py-1 rounded-full text-xs font-bold text-primary">
                Live Conversion
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
