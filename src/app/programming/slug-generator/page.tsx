"use client"

import { useState, useEffect } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { toSlug } from '@/lib/text-case';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Link2, Copy, Trash2, ArrowRightLeft, Check, Settings2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function SlugGeneratorPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [separator, setSeparator] = useState<'-' | '_'>('-');
  const [lowercase, setLowercase] = useState(true);
  const [removeNumbers, setRemoveNumbers] = useState(false);

  useEffect(() => {
    setOutput(toSlug(input, { separator, lowercase, removeNumbers }));
  }, [input, separator, lowercase, removeNumbers]);

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast({ title: t('common.copied') });
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <Link2 className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">{t('tools.slug_generator.name')}</h1>
          <p className="text-muted-foreground">{t('tools.slug_generator.description')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-primary" />
                {t('common.options')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>{t('common.separator')}</Label>
                <Select value={separator} onValueChange={(v: any) => setSeparator(v)}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-">Hyphen (-)</SelectItem>
                    <SelectItem value="_">Underscore (_)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                <Label htmlFor="lowercase-toggle" className="cursor-pointer font-medium">
                  {t('common.lowercase')}
                </Label>
                <Switch 
                  id="lowercase-toggle" 
                  checked={lowercase} 
                  onCheckedChange={setLowercase} 
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                <Label htmlFor="numbers-toggle" className="cursor-pointer font-medium">
                  {t('common.remove_numbers')}
                </Label>
                <Switch 
                  id="numbers-toggle" 
                  checked={removeNumbers} 
                  onCheckedChange={setRemoveNumbers} 
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <Card className="border-border shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{t('common.input')}</CardTitle>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleClear}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter title or text to slugify..."
                className="font-code min-h-[120px] bg-secondary/30 text-lg"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </CardContent>
          </Card>

          <Card className="border-border shadow-lg bg-secondary/5 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-background border-b py-3">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">{t('common.output')}</CardTitle>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={copyToClipboard} 
                disabled={!output}
              >
                <Copy className="h-4 w-4 mr-2" />
                {t('common.copy')}
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="p-6 bg-background rounded-xl border-2 border-primary/10 shadow-inner break-all font-code text-xl font-bold text-primary min-h-[100px] flex items-center">
                {output || <span className="text-muted-foreground/50 italic font-normal text-base">{t('common.placeholder_results')}</span>}
              </div>
              {output && (
                <p className="mt-4 text-[10px] text-muted-foreground uppercase tracking-widest font-black text-center">
                  URL Friendly Slug
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
