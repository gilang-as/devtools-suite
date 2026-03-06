"use client"

import { useState, useMemo } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { diffLines, Change } from 'diff';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  Diff, 
  Copy, 
  Trash2, 
  ArrowRightLeft, 
  Check, 
  FileText,
  AlertCircle,
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
              <div className="min-w-full divide-y divide-border/30">
                {diffResult.map((part, index) => {
                  const colorClass = part.added 
                    ? 'bg-green-500/10 text-green-700 dark:text-green-400' 
                    : part.removed 
                    ? 'bg-destructive/10 text-destructive' 
                    : 'text-muted-foreground opacity-70';
                  
                  const icon = part.added ? <Plus className="h-3 w-3 shrink-0" /> : part.removed ? <Minus className="h-3 w-3 shrink-0" /> : null;

                  return (
                    <div 
                      key={index} 
                      className={cn("px-6 py-1 flex gap-4 whitespace-pre-wrap break-all items-start", colorClass)}
                    >
                      <div className="w-4 pt-1 flex justify-center opacity-50">
                        {icon}
                      </div>
                      <div className="flex-1">
                        {part.value}
                      </div>
                    </div>
                  );
                })}
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
