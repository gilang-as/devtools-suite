
"use client"

import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { SearchCode, Info, AlertCircle, CheckCircle2, List, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RegexMatch {
  index: number;
  content: string;
  groups: (string | undefined)[];
}

export default function RegexTesterPage() {
  const { t } = useTranslation();
  const [pattern, setRegexPattern] = useState('[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}');
  const [testText, setTestText] = useState('My email is test@example.com and another one is hello.world@provider.io');
  const [flags, setFlags] = useState({
    g: true,
    i: true,
    m: false,
    s: false,
    u: false,
  });

  const flagStr = useMemo(() => {
    return Object.entries(flags)
      .filter(([_, enabled]) => enabled)
      .map(([f]) => f)
      .join('');
  }, [flags]);

  const regexResult = useMemo(() => {
    if (!pattern) return { matches: [], error: null };
    try {
      const re = new RegExp(pattern, flagStr);
      const matches: RegexMatch[] = [];
      let match;

      if (flags.g) {
        while ((match = re.exec(testText)) !== null) {
          // Prevent infinite loops with zero-width matches
          if (match.index === re.lastIndex) re.lastIndex++;
          matches.push({
            index: match.index,
            content: match[0],
            groups: match.slice(1),
          });
        }
      } else {
        match = re.exec(testText);
        if (match) {
          matches.push({
            index: match.index,
            content: match[0],
            groups: match.slice(1),
          });
        }
      }

      return { matches, error: null };
    } catch (e: any) {
      return { matches: [], error: e.message };
    }
  }, [pattern, testText, flagStr, flags.g]);

  const highlightedText = useMemo(() => {
    if (!testText || regexResult.matches.length === 0) return testText;

    let lastIndex = 0;
    const parts = [];

    // Sort matches by index to handle them in order
    const sortedMatches = [...regexResult.matches].sort((a, b) => a.index - b.index);

    sortedMatches.forEach((match, i) => {
      // Avoid overlapping or out of order matches due to regex weirdness
      if (match.index < lastIndex) return;

      // Add text before match
      parts.push(testText.substring(lastIndex, match.index));
      
      // Add highlighted match
      parts.push(
        <span 
          key={i} 
          className="bg-primary/30 text-primary-foreground rounded px-0.5 border-b-2 border-primary font-bold transition-colors hover:bg-primary/50"
          title={`Match ${i + 1}`}
        >
          {match.content}
        </span>
      );
      
      lastIndex = match.index + match.content.length;
    });

    // Add remaining text
    parts.push(testText.substring(lastIndex));

    return parts;
  }, [testText, regexResult.matches]);

  const toggleFlag = (f: keyof typeof flags) => {
    setFlags(prev => ({ ...prev, [f]: !prev[f] }));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <SearchCode className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">{t('tools.regex_tester.name')}</h1>
          <p className="text-muted-foreground">{t('tools.regex_tester.description')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-primary" />
                Regex Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Expression</Label>
                <div className="flex items-center bg-secondary/30 rounded-lg overflow-hidden border focus-within:ring-2 focus-within:ring-primary transition-all">
                  <span className="pl-3 text-muted-foreground font-code">/</span>
                  <Input 
                    value={pattern}
                    onChange={(e) => setRegexPattern(e.target.value)}
                    className="border-none focus-visible:ring-0 bg-transparent font-code"
                    placeholder="[a-z]+"
                  />
                  <span className="px-3 text-muted-foreground font-code border-l bg-muted/50">/{flagStr}</span>
                </div>
                {regexResult.error && (
                  <div className="flex items-center gap-2 text-destructive text-xs mt-1 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{regexResult.error}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Flags</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(flags).map(([f, enabled]) => (
                    <div key={f} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`flag-${f}`} 
                        checked={enabled} 
                        onCheckedChange={() => toggleFlag(f as any)} 
                      />
                      <Label 
                        htmlFor={`flag-${f}`} 
                        className="cursor-pointer text-sm font-medium"
                      >
                        {f} <span className="text-[10px] text-muted-foreground opacity-60">({
                          f === 'g' ? 'global' :
                          f === 'i' ? 'insensitive' :
                          f === 'm' ? 'multiline' :
                          f === 's' ? 'dotall' :
                          'unicode'
                        })</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/10 shadow-sm">
            <CardContent className="pt-6 space-y-4">
              <div className="flex gap-3 items-start">
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-sm leading-relaxed text-muted-foreground">
                  <strong>Cheat Sheet:</strong>
                  <ul className="mt-2 space-y-1 text-xs">
                    <li><code className="text-primary font-bold">.</code> - Any character except newline</li>
                    <li><code className="text-primary font-bold">\d</code> - Any digit</li>
                    <li><code className="text-primary font-bold">\w</code> - Any word character</li>
                    <li><code className="text-primary font-bold">+</code> - 1 or more</li>
                    <li><code className="text-primary font-bold">*</code> - 0 or more</li>
                    <li><code className="text-primary font-bold">?</code> - 0 or 1</li>
                    <li><code className="text-primary font-bold">^</code> - Start of string</li>
                    <li><code className="text-primary font-bold">$</code> - End of string</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <Card className="border-border shadow-lg flex flex-col min-h-[500px]">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <div>
                <CardTitle className="text-lg">Test Text</CardTitle>
                <CardDescription>Matches will be highlighted below</CardDescription>
              </div>
              <Badge variant="secondary" className="font-bold">
                {regexResult.matches.length} Matches
              </Badge>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col">
              <div className="relative flex-1">
                {/* Mirrored background for highlights */}
                <div className="absolute inset-0 p-6 font-code text-sm pointer-events-none whitespace-pre-wrap break-all leading-relaxed text-transparent overflow-auto">
                  {highlightedText}
                </div>
                {/* Interactive Textarea */}
                <Textarea
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  className="absolute inset-0 w-full h-full p-6 font-code text-sm bg-transparent border-none focus-visible:ring-0 resize-none leading-relaxed caret-foreground"
                  placeholder="Paste text to test your regex against..."
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-md bg-secondary/5">
            <CardHeader className="py-3 px-4 bg-background border-b flex flex-row items-center gap-2">
              <List className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-bold uppercase tracking-widest">Match Information</CardTitle>
            </CardHeader>
            <CardContent className="p-0 max-h-[300px] overflow-auto">
              {regexResult.matches.length > 0 ? (
                <div className="divide-y divide-border">
                  {regexResult.matches.map((match, i) => (
                    <div key={i} className="p-4 hover:bg-primary/5 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-black text-muted-foreground bg-muted px-1.5 py-0.5 rounded"># {i + 1}</span>
                        <span className="text-[10px] font-mono text-muted-foreground">Index: {match.index}..{match.index + match.content.length}</span>
                      </div>
                      <p className="font-code text-sm text-foreground break-all bg-background p-2 rounded border border-primary/10 mb-2">
                        {match.content}
                      </p>
                      {match.groups.length > 0 && (
                        <div className="space-y-1 pl-4 border-l-2 border-primary/20">
                          {match.groups.map((group, gi) => (
                            <div key={gi} className="flex gap-2 items-center">
                              <span className="text-[9px] font-bold text-primary/60 uppercase">Group {gi + 1}:</span>
                              <span className="text-xs font-mono text-muted-foreground">{group || <span className="italic opacity-40">null</span>}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground italic text-sm">
                  {pattern ? 'No matches found' : 'Enter an expression to see results'}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
