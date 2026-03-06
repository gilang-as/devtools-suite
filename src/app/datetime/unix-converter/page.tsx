"use client"

import { useState, useEffect } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { unixToDate, dateToUnix } from '@/lib/datetime';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Clock, ArrowRightLeft, Calendar, Copy, Trash2, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function UnixConverterPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [timestamp, setTimestamp] = useState('');
  const [isMs, setIsMs] = useState(false);
  const [result, setResult] = useState<Date | null>(null);

  const handleConvert = () => {
    const val = parseInt(timestamp);
    if (isNaN(val)) {
      setResult(null);
      return;
    }
    setResult(unixToDate(val, isMs));
  };

  useEffect(() => {
    handleConvert();
  }, [timestamp, isMs]);

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(result.toString());
      toast({ title: t('common.copied') });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <Clock className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">{t('tools.unix_timestamp_converter.name')}</h1>
          <p className="text-muted-foreground">{t('tools.unix_timestamp_converter.description')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-border shadow-lg">
          <CardHeader>
            <CardTitle>{t('common.input')}</CardTitle>
            <CardDescription>Enter Unix timestamp to decode</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Timestamp</Label>
              <Input 
                type="number" 
                placeholder="e.g. 1708560000" 
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                className="font-code text-lg h-12"
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
              <Label htmlFor="ms-mode" className="cursor-pointer">Use Milliseconds</Label>
              <Switch id="ms-mode" checked={isMs} onCheckedChange={setIsMs} />
            </div>
            <Button variant="outline" className="w-full" onClick={() => setTimestamp(Math.floor(Date.now() / (isMs ? 1 : 1000)).toString())}>
              Set to Now
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border shadow-lg bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Human Readable</CardTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={copyResult} disabled={!result}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => {setTimestamp(''); setResult(null);}}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {!result ? (
              <div className="h-32 flex items-center justify-center text-muted-foreground italic border-2 border-dashed rounded-lg">
                Waiting for input...
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="p-4 bg-background rounded-lg border border-primary/20 shadow-sm">
                  <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Local Time</p>
                  <p className="font-semibold text-lg">{result.toString()}</p>
                </div>
                <div className="p-4 bg-background rounded-lg border border-primary/20 shadow-sm">
                  <p className="text-xs font-bold text-muted-foreground uppercase mb-1">UTC Time</p>
                  <p className="font-semibold text-lg">{result.toUTCString()}</p>
                </div>
                <div className="p-4 bg-background rounded-lg border border-primary/20 shadow-sm">
                  <p className="text-xs font-bold text-muted-foreground uppercase mb-1">ISO 8601</p>
                  <p className="font-code text-sm">{result.toISOString()}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
