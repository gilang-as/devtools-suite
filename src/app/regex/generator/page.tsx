"use client"

import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/components/providers/i18n-provider';
import { generateRegex } from '@/ai/flows/generate-regex-flow';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Wand2, Copy, Loader2, SearchCode, Sparkles, Check, ArrowRight, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function RegexGeneratorPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [description, setDescription] = useState('');
  const [flavor, setFlavor] = useState('JavaScript');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ regex: string; explanation: string; samples: string[] } | null>(null);

  const handleGenerate = async () => {
    if (!description.trim()) return;
    setLoading(true);
    try {
      const output = await generateRegex({ description, flavor });
      setResult(output);
    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: e.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const copyRegex = () => {
    if (result?.regex) {
      navigator.clipboard.writeText(result.regex);
      toast({ title: t('common.copied') });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <Wand2 className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">{t('tools.regex_generator.name')}</h1>
          <p className="text-muted-foreground">{t('tools.regex_generator.description')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Prompt
              </CardTitle>
              <CardDescription>Describe the pattern you want to match in plain English</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Requirement Description</Label>
                <Textarea 
                  placeholder="e.g. A strong password containing at least 8 characters, one uppercase letter, one digit, and one special symbol."
                  className="min-h-[120px] bg-secondary/30"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Regex Flavor</Label>
                <Input 
                  value={flavor}
                  onChange={(e) => setFlavor(e.target.value)}
                  placeholder="JavaScript, Python, PCRE..."
                  className="bg-secondary/30"
                />
              </div>

              <Button onClick={handleGenerate} className="w-full h-12 shadow-md" disabled={loading || !description.trim()}>
                {loading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Wand2 className="h-5 w-5 mr-2" />}
                Generate Regex
              </Button>
            </CardContent>
          </Card>

          {result && (
            <Card className="bg-primary/5 border-primary/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Matching Samples
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {result.samples.map((sample, i) => (
                  <div key={i} className="flex items-center gap-2 bg-background p-2 rounded border border-primary/10 text-xs font-code">
                    <Check className="h-3 w-3 text-green-500" />
                    {sample}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-7 space-y-6">
          {!result && !loading ? (
            <div className="h-full min-h-[400px] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-muted-foreground opacity-30 text-center px-8">
              <Sparkles className="h-16 w-16 mb-4" />
              <p className="font-medium">AI generated regex and explanations will appear here.</p>
            </div>
          ) : loading ? (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="text-muted-foreground animate-pulse">Consulting the Regex experts...</p>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="border-border shadow-lg overflow-hidden">
                <CardHeader className="bg-muted/30 border-b flex flex-row items-center justify-between py-4">
                  <CardTitle className="text-lg">Generated Regex</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyRegex}>
                      <Copy className="h-4 w-4 mr-2" />
                      {t('common.copy')}
                    </Button>
                    <Link href={`/regex/tester?pattern=${encodeURIComponent(result!.regex)}`}>
                      <Button variant="secondary" size="sm">
                        <SearchCode className="h-4 w-4 mr-2" />
                        Test Regex
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="bg-background rounded-xl border-2 border-primary/10 p-6 font-code text-2xl font-black text-primary break-all shadow-inner">
                    {result.regex}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Explanation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {result.explanation}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
