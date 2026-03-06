
"use client"

import { useState, useMemo } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { diffLines, Change } from 'diff';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Diff, 
  Copy, 
  Trash2, 
  ArrowRightLeft, 
  Check, 
  FileText,
  Plus,
  Minus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function DiffCheckerPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [oldText, setOldText] = useState('');
  const [newText, setNewText] = useState('');
  const [diffResult, setDiffResult] = useState<Change[]>([]);

  const handleCompare = () => {
    const changes = diffLines(oldText, newText);
    setDiffResult(changes);
  };

  const handleClear = () => {
    setOldText('');
    setNewText('');
    setDiffResult([]);
  };

  const handleSwap = () => {
    const temp = oldText;
    setOldText(newText);
    setNewText(temp);
    if (diffResult.length > 0) {
      handleCompare();
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(newText);
    toast({ title: t('common.copied') });
  };

  const diffLinesWithNumbers = useMemo(() => {
    let oldLineNum = 1;
    let newLineNum = 1;
    const result: any[] = [];

    diffResult.forEach((part, partIndex) => {
      const lines = part.value.split(/\r?\n/);
      
      // If the part ends with a newline, split results in an extra empty string.
      // We only want to pop it if it's not the very last part of the diff.
      const shouldPop = part.value.endsWith('\n') || partIndex < diffResult.length - 1;
      const linesToRender = (shouldPop && lines[lines.length - 1] === '') ? lines.slice(0, -1) : lines;

      linesToRender.forEach((line, lineIndex) => {
        const isAdded = part.added;
        const isRemoved = part.removed;
        
        const currentOldNum = isAdded ? null : oldLineNum++;
        const currentNewNum = isRemoved ? null : newLineNum++;

        result.push({
          key: `${partIndex}-${lineIndex}`,
          line,
          isAdded,
          isRemoved,
          oldNum: currentOldNum,
          newNum: currentNewNum
        });
      });
    });
    return result;
  }, [diffResult]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <Diff className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">
            {t('tools.text_diff.name')}
            <span className="text-muted-foreground/40 font-normal text-xl ml-3 hidden sm:inline">
              (Text Compare)
            </span>
          </h1>
          <p className="text-muted-foreground">{t('tools.text_diff.description')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Minus className="h-4 w-4 text-destructive" />
              Original Text
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste the original version here..."
              className="font-code min-h-[250px] bg-secondary/20 resize-y"
              value={oldText}
              onChange={(e) => setOldText(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card className="border-border shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Plus className="h-4 w-4 text-green-500" />
              Modified Text
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste the modified version here..."
              className="font-code min-h-[250px] bg-secondary/20 resize-y"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button onClick={handleCompare} size="lg" className="px-12 shadow-lg h-12">
          <Check className="h-5 w-5 mr-2" />
          {t('common.compare')}
        </Button>
        <Button variant="outline" onClick={handleSwap} size="lg" className="h-12">
          <ArrowRightLeft className="h-5 w-5 mr-2" />
          {t('common.swap')}
        </Button>
        <Button variant="ghost" onClick={handleClear} size="lg" className="h-12 text-muted-foreground">
          <Trash2 className="h-5 w-5 mr-2" />
          {t('common.clear')}
        </Button>
      </div>

      {diffResult.length > 0 && (
        <Card className="border-border shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="bg-muted/30 border-b flex flex-row items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Difference Result</CardTitle>
            </div>
            <Button variant="outline" size="sm" onClick={copyResult}>
              <Copy className="h-4 w-4 mr-2" />
              {t('common.copy')} Modified
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="font-code text-sm overflow-x-auto bg-[#fafafa] dark:bg-[#0f1115]">
              <div className="min-w-full">
                {diffLinesWithNumbers.map((row) => (
                  <div 
                    key={row.key} 
                    className={cn(
                      "flex whitespace-pre group transition-colors",
                      row.isAdded ? "bg-green-500/10 text-green-700 dark:text-green-400" : 
                      row.isRemoved ? "bg-destructive/10 text-destructive" : "hover:bg-muted/30"
                    )}
                  >
                    <div className="flex w-24 shrink-0 bg-muted/20 border-r text-[10px] text-muted-foreground/40 select-none font-mono">
                      <div className="w-1/2 text-right pr-2 py-1 border-r border-muted-foreground/10">{row.oldNum || ''}</div>
                      <div className="w-1/2 text-right pr-2 py-1">{row.newNum || ''}</div>
                    </div>
                    <div className={cn(
                      "w-6 py-1 flex justify-center shrink-0",
                      row.isAdded ? "text-green-500" : row.isRemoved ? "text-destructive" : "opacity-10"
                    )}>
                      {row.isAdded ? <Plus className="h-3 w-3" /> : row.isRemoved ? <Minus className="h-3 w-3" /> : null}
                    </div>
                    <div className="px-2 py-1 flex-1 break-all leading-normal">
                      {row.line || ' '}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {diffResult.length === 0 && oldText && newText && oldText === newText && (
        <div className="p-12 text-center border-2 border-dashed rounded-3xl bg-primary/5 text-primary font-bold">
          <Check className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No differences found. Both texts are identical.</p>
        </div>
      )}
    </div>
  );
}
