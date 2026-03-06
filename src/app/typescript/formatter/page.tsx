"use client"

import { useState, useRef, useMemo } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  FileCode, 
  Copy, 
  Trash2, 
  Upload, 
  ArrowRightLeft, 
  Check, 
  WrapText,
  Braces,
  Code2,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { beautifyJs, minifyJs } from '@/lib/javascript';

const highlightTs = (code: string) => {
  if (!code) return null;
  const tokens = code.split(/(\b(?:const|let|var|function|return|if|else|for|while|import|export|from|class|extends|new|try|catch|finally|async|await|type|interface|enum|static|private|public|protected|readonly|as|any|string|number|boolean|void|null|undefined|true|false|keyof|typeof|readonly|in|is|unique|symbol|bigint|object|unknown|never)\b|"(?:\\.|[^\\"])*"|'(?:\\.|[^\\'])*'|`(?:\\.|[^\\`])*`|\/\/.*|\/\*[\s\S]*?\*\/|[-+*/%=<>!&|^~]+|\d+)/g);
  return tokens.map((token, i) => {
    if (!token) return null;
    if (/^(const|let|var|function|return|if|else|for|while|import|export|from|class|extends|new|try|catch|finally|async|await|type|interface|enum|static|private|public|protected|readonly|as|any|string|number|boolean|void|null|undefined|keyof|typeof|in|is|unique|symbol|bigint|object|unknown|never)$/.test(token)) {
      return <span key={i} className="text-purple-600 dark:text-purple-400 font-semibold">{token}</span>;
    }
    if (/^(true|false|null|undefined)$/.test(token)) return <span key={i} className="text-orange-600 dark:text-orange-400 font-semibold">{token}</span>;
    if (/^["'`].*["'`]$/.test(token)) return <span key={i} className="text-green-600 dark:text-green-400">{token}</span>;
    if (token.startsWith('//') || token.startsWith('/*')) return <span key={i} className="text-muted-foreground italic">{token}</span>;
    if (/^\d+$/.test(token)) return <span key={i} className="text-blue-600 dark:text-blue-400">{token}</span>;
    if (/^[-+*/%=<>!&|^~]+$/.test(token)) return <span key={i} className="text-cyan-600 dark:text-cyan-400">{token}</span>;
    return <span key={i}>{token}</span>;
  });
};

const LineNumbers = ({ text }: { text: string }) => {
  const lines = text.split('\n');
  const lineCount = lines.length || 1;
  return (
    <div className="flex flex-col text-right pr-2 text-muted-foreground/30 font-code text-xs select-none pt-2.5 bg-muted/20 border-r w-10 shrink-0 h-full overflow-hidden">
      {Array.from({ length: Math.max(lineCount, 15) }).map((_, i) => (
        <div key={i} className="leading-6 h-6">{i + 1}</div>
      ))}
    </div>
  );
};

export default function TypescriptFormatterPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indentSize, setIndentSize] = useState<number>(2);
  const [wordWrap, setWordWrap] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBeautify = () => { if (!input.trim()) return; setOutput(beautifyJs(input, indentSize)); setValidationError(null); };
  const handleMinify = () => { if (!input.trim()) return; setOutput(minifyJs(input)); setValidationError(null); };

  const handleValidate = () => {
    if (!input.trim()) return;
    try {
      // Basic syntax check for JS/TS (TS specific syntax like types might fail in browser new Function)
      // For a true TS check we'd need a TS compiler, but this catches basic brace/syntax issues.
      new Function(input.replace(/:\s*[A-Z][\w<>,\[\]\s|&]*/g, '')); // Stripping some basic type annotations for a crude check
      setValidationError(null);
      toast({ title: t('common.valid') });
    } catch (e: any) {
      setValidationError(e.message);
      toast({ variant: 'destructive', title: t('common.invalid'), description: e.message });
    }
  };

  const handleClear = () => { setInput(''); setOutput(''); setValidationError(null); };
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => { setInput(event.target?.result as string); setValidationError(null); };
    reader.readAsText(file);
  };

  const copyToClipboard = () => { navigator.clipboard.writeText(output); toast({ title: t('common.copied') }); };
  const highlightedOutput = useMemo(() => highlightTs(output), [output]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary"><Code2 className="h-8 w-8" /></div>
        <div>
          <h1 className="text-3xl font-headline font-bold">{t('tools.ts_formatter.name')}</h1>
          <p className="text-muted-foreground">{t('tools.ts_formatter.description')}</p>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row items-stretch gap-4">
        <Card className="flex-1 border-border shadow-lg flex flex-col overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg flex items-center gap-2"><FileCode className="h-5 w-5 text-primary" />{t('common.input')}</CardTitle>
            <div className="flex gap-2">
              <input type="file" accept=".ts,.tsx" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}><Upload className="h-4 w-4 mr-2" />{t('common.upload')}</Button>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleClear}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            <div className="flex flex-1 min-h-[400px] border-t bg-secondary/10 overflow-hidden">
              <LineNumbers text={input} />
              <div className="flex-1 overflow-auto">
                <Textarea placeholder="Paste your TypeScript here..." className={cn("font-code w-full min-h-full border-none focus-visible:ring-0 bg-transparent resize-none leading-6 rounded-none py-2.5 shadow-none", wordWrap ? "whitespace-pre-wrap" : "whitespace-pre overflow-x-auto")} wrap={wordWrap ? "soft" : "off"} value={input} onChange={(e) => setInput(e.target.value)} />
              </div>
            </div>
            {validationError && (
              <div className="bg-destructive/10 border-t border-destructive/20 p-3 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-xs text-destructive font-code whitespace-pre-wrap">{validationError}</p>
              </div>
            )}
          </CardContent>
        </Card>
        <div className="flex flex-row lg:flex-col justify-center items-center gap-4 py-4 lg:py-0 min-w-[200px]">
          <div className="w-full space-y-4 px-2">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('common.indentation')}</Label>
              <Select value={indentSize.toString()} onValueChange={(val) => setIndentSize(parseInt(val))}><SelectTrigger className="h-9 w-full bg-background"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="2">2 {t('common.spaces')}</SelectItem><SelectItem value="4">4 {t('common.spaces')}</SelectItem></SelectContent></Select>
            </div>
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2"><WrapText className="h-4 w-4 text-muted-foreground" /><Label htmlFor="word-wrap" className="text-xs font-medium cursor-pointer">{t('common.wordWrap')}</Label></div>
              <Switch id="word-wrap" checked={wordWrap} onCheckedChange={setWordWrap} />
            </div>
          </div>
          <div className="flex flex-col gap-3 w-full">
            <Button onClick={handleBeautify} className="shadow-md bg-primary hover:bg-primary/90 w-full" size="lg"><Check className="h-4 w-4 mr-2" />{t('common.beautify')}</Button>
            <Button onClick={handleValidate} variant="outline" className="w-full shadow-sm" size="lg"><ShieldCheck className="h-4 w-4 mr-2" />{t('common.validate')}</Button>
            <div className="hidden lg:flex items-center justify-center text-muted-foreground/20 py-1"><ArrowRightLeft className="h-6 w-6" /></div>
            <Button onClick={handleMinify} variant="secondary" className="w-full shadow-sm" size="lg"><Braces className="h-4 w-4 mr-2" />{t('common.minify')}</Button>
          </div>
        </div>
        <Card className="flex-1 border-border shadow-lg flex flex-col overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg">{t('common.output')}</CardTitle>
            <Button variant="outline" size="sm" onClick={copyToClipboard} disabled={!output}><Copy className="h-4 w-4 mr-2" />{t('common.copy')}</Button>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            <div className="flex flex-1 min-h-[400px] border-t bg-secondary/10 overflow-hidden">
              <LineNumbers text={output} />
              <div className="flex-1 overflow-auto bg-[#fafafa] dark:bg-[#0f1115]">
                <div className={cn("font-code w-full min-h-full leading-6 py-2.5 px-3", wordWrap ? "whitespace-pre-wrap" : "whitespace-pre")}>
                  {highlightedOutput || <span className="text-muted-foreground/50">Formatted results will appear here...</span>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}