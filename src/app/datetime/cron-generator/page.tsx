"use client"

import { useState, useEffect } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarClock, Copy, RefreshCcw, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CronGeneratorPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [min, setMin] = useState('*');
  const [hour, setHour] = useState('*');
  const [dom, setDom] = useState('*');
  const [month, setMonth] = useState('*');
  const [dow, setDow] = useState('*');
  const [cron, setCron] = useState('* * * * *');

  useEffect(() => {
    setCron(`${min} ${hour} ${dom} ${month} ${dow}`);
  }, [min, hour, dom, month, dow]);

  const copy = () => {
    navigator.clipboard.writeText(cron);
    toast({ title: t('common.copied') });
  };

  const Selector = ({ label, value, onChange, options, placeholder }: any) => (
    <div className="space-y-2">
      <Label className="text-xs font-bold uppercase text-muted-foreground">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-background">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="*">Every {label}</SelectItem>
          {options.map((o: any) => (
            <SelectItem key={o.value} value={o.value.toString()}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <Wand2 className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">{t('tools.cron_generator.name')}</h1>
          <p className="text-muted-foreground">{t('tools.cron_generator.description')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8">
          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle>Build Expression</CardTitle>
              <CardDescription>Select intervals to generate your schedule</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Selector 
                label="Minute" 
                value={min} 
                onChange={setMin}
                options={Array.from({length: 60}, (_, i) => ({ label: i < 10 ? `0${i}` : i, value: i }))}
              />
              <Selector 
                label="Hour" 
                value={hour} 
                onChange={setHour}
                options={Array.from({length: 24}, (_, i) => ({ label: `${i}:00`, value: i }))}
              />
              <Selector 
                label="Day of Month" 
                value={dom} 
                onChange={setDom}
                options={Array.from({length: 31}, (_, i) => ({ label: i + 1, value: i + 1 }))}
              />
              <Selector 
                label="Month" 
                value={month} 
                onChange={setMonth}
                options={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => ({ label: m, value: i + 1 }))}
              />
              <Selector 
                label="Day of Week" 
                value={dow} 
                onChange={setDow}
                options={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => ({ label: d, value: i }))}
              />
              <div className="flex items-end">
                <Button variant="outline" className="w-full" onClick={() => {setMin('*'); setHour('*'); setDom('*'); setMonth('*'); setDow('*');}}>
                  <RefreshCcw className="h-4 w-4 mr-2" /> Reset All
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-4">
          <Card className="border-border shadow-lg bg-primary/5 h-full flex flex-col overflow-hidden">
            <CardHeader className="bg-primary/10 py-4">
              <CardTitle className="text-center text-sm font-black uppercase tracking-widest text-primary">Output</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
              <div className="bg-background border-2 border-primary/20 p-6 rounded-2xl w-full text-center">
                <p className="font-code text-2xl font-black text-foreground break-all">{cron}</p>
              </div>
              <Button onClick={copy} size="lg" className="w-full shadow-md">
                <Copy className="h-4 w-4 mr-2" />
                Copy Expression
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
