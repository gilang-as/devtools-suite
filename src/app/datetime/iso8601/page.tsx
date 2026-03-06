"use client"

import { useState, useEffect } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { formatISO } from '@/lib/datetime';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Copy, Hash, Clock, FileText, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ISO8601Page() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [date, setDate] = useState(new Date());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formats = [
    { id: 'extended', label: 'Extended (Complete)', val: date.toISOString() },
    { id: 'basic', label: 'Basic (No separators)', val: date.toISOString().replace(/[:-]/g, '').split('.')[0] + 'Z' },
    { id: 'date', label: 'Date only', val: date.toISOString().split('T')[0] },
    { id: 'utc', label: 'UTC String', val: date.toUTCString() },
    { id: 'local', label: 'Local ISO', val: formatISO(date, 'extended') },
  ];

  const copy = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopiedId(id);
    toast({ title: t('common.copied') });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <FileText className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">{t('tools.iso8601_formatter.name')}</h1>
          <p className="text-muted-foreground">{t('tools.iso8601_formatter.description')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {formats.map((f) => (
          <Card key={f.id} className="border-border shadow-md hover:border-primary/30 transition-colors group">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center">
                <div className="bg-muted/30 p-4 sm:w-48 border-b sm:border-b-0 sm:border-r flex items-center gap-3">
                  <div className="p-2 bg-background rounded-lg text-primary shadow-sm">
                    {f.id === 'date' ? <Calendar className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-tight text-muted-foreground">{f.label}</span>
                </div>
                <div className="flex-1 p-4 font-code text-lg font-bold text-foreground break-all">
                  {f.val}
                </div>
                <div className="p-4 sm:border-l flex items-center justify-center">
                  <Button 
                    variant={copiedId === f.id ? "secondary" : "ghost"}
                    size="sm" 
                    className="w-full sm:w-auto"
                    onClick={() => copy(f.val, f.id)}
                  >
                    {copiedId === f.id ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copiedId === f.id ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border bg-primary/5">
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Hash className="h-4 w-4 text-primary" />
            ISO 8601 Standard
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground leading-relaxed">
          ISO 8601 is an international standard covering the worldwide exchange and communication of date and time-related data. The primary purpose of this standard is to provide an unambiguous and well-defined method of representing dates and times, so as to avoid misinterpretation of numeric representations of dates and times.
        </CardContent>
      </Card>
    </div>
  );
}
