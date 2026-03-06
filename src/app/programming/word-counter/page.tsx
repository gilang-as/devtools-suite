"use client"

import { useState, useMemo } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { getTextStats } from '@/lib/text-stats';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  FileText, 
  Trash2, 
  Clock, 
  Type, 
  AlignLeft, 
  Layers, 
  Check,
  Hash
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function WordCounterPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [input, setInput] = useState('');

  const stats = useMemo(() => getTextStats(input), [input]);

  const handleClear = () => {
    setInput('');
  };

  const StatCard = ({ label, value, icon: Icon, description }: any) => (
    <Card className="border-border shadow-md overflow-hidden group hover:border-primary/30 transition-all">
      <CardHeader className="py-3 px-4 bg-muted/30 border-b flex flex-row items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors">
          {label}
        </span>
        <Icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
      </CardHeader>
      <CardContent className="p-6 text-center">
        <p className="text-3xl font-black text-foreground tracking-tighter">
          {value}
        </p>
        {description && (
          <p className="text-[10px] text-muted-foreground mt-1 italic">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <FileText className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">{t('tools.word_counter.name')}</h1>
          <p className="text-muted-foreground">{t('tools.word_counter.description')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-border shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Text Input</CardTitle>
                <CardDescription>Paste your content to see instant analysis</CardDescription>
              </div>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleClear} disabled={!input}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Start typing or paste your text here..."
                className="font-body min-h-[400px] bg-secondary/30 text-lg leading-relaxed resize-y"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sticky top-24">
            <div className="grid grid-cols-2 gap-4 sm:col-span-2 lg:col-span-1">
              <StatCard 
                label={t('common.words')} 
                value={stats.words} 
                icon={AlignLeft} 
              />
              <StatCard 
                label={t('common.characters')} 
                value={stats.characters} 
                icon={Type} 
                description={`No spaces: ${stats.charactersNoSpaces}`}
              />
              <StatCard 
                label={t('common.lines')} 
                value={stats.lines} 
                icon={Hash} 
              />
              <StatCard 
                label={t('common.paragraphs')} 
                value={stats.paragraphs} 
                icon={Layers} 
              />
            </div>

            <Card className="border-primary/20 bg-primary/5 shadow-lg lg:mt-2">
              <CardHeader className="pb-2 text-center">
                <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-xs font-black uppercase tracking-widest text-primary">
                  {t('common.readingTime')}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-6">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-black text-primary tracking-tighter">
                    {stats.readingTime}
                  </span>
                  <span className="text-sm font-bold text-primary/60">
                    {t('common.minutes')}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-3 leading-relaxed">
                  Based on an average reading speed of 200 words per minute.
                </p>
              </CardContent>
            </Card>

            <div className="bg-muted/30 p-4 rounded-xl border border-dashed text-center">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Pro Tip</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Use the <span className="font-bold text-foreground">Case Converter</span> to quickly format your text after analyzing it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
