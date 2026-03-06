"use client"

import { useState } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { parseCron } from '@/lib/datetime';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CalendarClock, Info, Search, Trash2, ArrowRight } from 'lucide-react';

export default function CronParserPage() {
  const { t } = useTranslation();
  const [input, setInput] = useState('*/5 * * * *');
  const [description, setDescription] = useState(parseCron('*/5 * * * *'));

  const handleParse = () => {
    setDescription(parseCron(input));
  };

  const presets = [
    { label: 'Every minute', val: '* * * * *' },
    { label: 'Every 5 mins', val: '*/5 * * * *' },
    { label: 'Every hour', val: '0 * * * *' },
    { label: 'Every day at midnight', val: '0 0 * * *' },
    { label: 'Every Sunday', val: '0 0 * * 0' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <CalendarClock className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">{t('tools.cron_parser.name')}</h1>
          <p className="text-muted-foreground">{t('tools.cron_parser.description')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 space-y-6">
          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle>Cron String</CardTitle>
              <CardDescription>Input your 5-part cron expression</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Expression</Label>
                <div className="flex gap-2">
                  <Input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="font-code text-lg"
                    placeholder="* * * * *"
                  />
                  <Button size="icon" onClick={handleParse}><Search className="h-4 w-4" /></Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase">Presets</Label>
                <div className="flex flex-wrap gap-2">
                  {presets.map((p) => (
                    <Button 
                      key={p.val} 
                      variant="outline" 
                      size="sm" 
                      className="text-[10px] h-7"
                      onClick={() => { setInput(p.val); setDescription(parseCron(p.val)); }}
                    >
                      {p.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-primary/5">
            <CardContent className="pt-6 text-xs text-muted-foreground space-y-2">
              <p className="font-bold flex items-center gap-2"><Info className="h-3 w-3" /> Quick Format Reference:</p>
              <pre className="font-code bg-background/50 p-2 rounded leading-tight">
                * * * * *<br/>
                │ │ │ │ │<br/>
                │ │ │ │ └── day of week (0-6)<br/>
                │ │ │ └──── month (1-12)<br/>
                │ │ └────── day of month (1-31)<br/>
                │ └──────── hour (0-23)<br/>
                └────────── minute (0-59)
              </pre>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-7">
          <Card className="border-border shadow-lg h-full bg-secondary/5 flex flex-col">
            <CardHeader className="bg-background border-b py-4">
              <CardTitle className="text-lg">Natural Language Explanation</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center p-8">
              <div className="text-center space-y-4">
                <div className="bg-primary/10 inline-flex p-4 rounded-full text-primary mb-2">
                  <ArrowRight className="h-10 w-10" />
                </div>
                <p className="text-2xl font-headline font-bold text-foreground leading-relaxed">
                  "{description}"
                </p>
                <p className="text-sm text-muted-foreground italic">
                  * Basic description for standard Posix cron format.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
