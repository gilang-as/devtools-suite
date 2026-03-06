"use client"

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Braces, 
  Copy, 
  Trash2, 
  Upload, 
  FileJson, 
  ArrowRightLeft, 
  Check, 
  ListOrdered,
  ChevronRight,
  ChevronDown,
  Layout,
  WrapText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type SortOrder = 'none' | 'asc' | 'desc';
type OutputView = 'code' | 'tree';

const sortObject = (obj: any, order: SortOrder): any => {
  if (order === 'none' || obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sortObject(item, order));
  }

  const keys = Object.keys(obj).sort((a, b) => {
    if (order === 'asc') return a.localeCompare(b);
    return b.localeCompare(a);
  });

  const sortedObj: any = {};
  for (const key of keys) {
    sortedObj[key] = sortObject(obj[key], order);
  }
  return sortedObj;
};

const LineNumbers = ({ text }: { text: string }) => {
  const lines = text.split('\n');
  const lineCount = lines.length || 1;
  return (
    <div className="flex flex-col text-right pr-2 text-muted-foreground/30 font-code text-xs select-none pt-2.5 bg-muted/20 border-r w-10 shrink-0 h-full overflow-hidden">
      {Array.from({ length: lineCount }).map((_, i) => (
        <div key={i} className="leading-6 h-6">{i + 1}</div>
      ))}
    </div>
  );
};

const JsonTreeNode = ({ label, value, isLast = true, depth = 0 }: { label?: string; value: any; isLast?: boolean; depth?: number }) => {
  const [isOpen, setIsOpen] = useState(true);
  const isObject = value !== null && typeof value === 'object';
  const isArray = Array.isArray(value);

  if (!isObject) {
    return (
      <div className="flex items-start gap-1 font-code text-sm py-0.5 ml-6">
        {label && <span className="text-primary/80">"{label}": </span>}
        <span className={cn(
          typeof value === 'string' ? 'text-green-600 dark:text-green-400' : 
          typeof value === 'number' ? 'text-blue-600 dark:text-blue-400' :
          typeof value === 'boolean' ? 'text-orange-600 dark:text-orange-400' :
          'text-muted-foreground'
        )}>
          {typeof value === 'string' ? `"${value}"` : String(value)}
        </span>
        {!isLast && <span className="text-muted-foreground">,</span>}
      </div>
    );
  }

  const keys = Object.keys(value);
  const bracketOpen = isArray ? '[' : '{';
  const bracketClose = isArray ? ']' : '}';

  return (
    <div className="font-code text-sm py-0.5">
      <div 
        className="flex items-center gap-1 cursor-pointer hover:bg-muted/50 rounded px-1 transition-colors w-fit"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-4 h-4 flex items-center justify-center text-muted-foreground">
          {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </div>
        {label && <span className="text-primary/80">"{label}": </span>}
        <span className="text-muted-foreground">{bracketOpen}</span>
        {!isOpen && <span className="text-muted-foreground px-1 bg-muted/50 rounded text-xs">... {keys.length} items</span>}
        {!isOpen && <span className="text-muted-foreground">{bracketClose}{!isLast && ','}</span>}
      </div>
      
      {isOpen && (
        <div className="ml-6 border-l border-muted/30 pl-2">
          {keys.map((key, index) => (
            <JsonTreeNode 
              key={key} 
              label={isArray ? undefined : key} 
              value={value[key]} 
              isLast={index === keys.length - 1}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
      
      {isOpen && (
        <div className="ml-4 text-muted-foreground">
          {bracketClose}{!isLast && ','}
        </div>
      )}
    </div>
  );
};

export default function JsonFormatterPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [parsedOutput, setParsedOutput] = useState<any>(null);
  const [indentSize, setIndentSize] = useState<number>(2);
  const [sortOrder, setSortOrder] = useState<SortOrder>('none');
  const [viewMode, setViewMode] = useState<OutputView>('code');
  const [wordWrap, setWordWrap] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLTextAreaElement>(null);

  const handleBeautify = () => {
    try {
      if (!input.trim()) return;
      let parsed = JSON.parse(input);
      if (sortOrder !== 'none') {
        parsed = sortObject(parsed, sortOrder);
      }
      setParsedOutput(parsed);
      const formatted = JSON.stringify(parsed, null, indentSize);
      setOutput(formatted);
      setError(null);
    } catch (e: any) {
      setError(e.message);
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: e.message,
      });
    }
  };

  const handleMinify = () => {
    try {
      if (!input.trim()) return;
      let parsed = JSON.parse(input);
      if (sortOrder !== 'none') {
        parsed = sortObject(parsed, sortOrder);
      }
      setParsedOutput(parsed);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError(null);
      setViewMode('code');
    } catch (e: any) {
      setError(e.message);
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: e.message,
      });
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setParsedOutput(null);
    setError(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInput(content);
      setError(null);
    };
    reader.readAsText(file);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({
      title: t('common.copied'),
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <Braces className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">{t('tools.json_formatter.name')}</h1>
          <p className="text-muted-foreground">{t('tools.json_formatter.description')}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-stretch gap-4">
        {/* Input Section */}
        <Card className="flex-1 border-border shadow-lg flex flex-col overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileJson className="h-5 w-5 text-primary" />
              {t('common.input')}
            </CardTitle>
            <div className="flex gap-2">
              <input
                type="file"
                accept=".json"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fileInputRef.current?.click()}
                title={t('common.upload')}
              >
                <Upload className="h-4 w-4 mr-2" />
                {t('common.upload')}
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8" 
                onClick={handleClear} 
                title={t('common.clear')}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            <div className="flex flex-1 min-h-[400px] border-t bg-secondary/10 overflow-hidden">
              <LineNumbers text={input} />
              <div className="flex-1 overflow-auto">
                <Textarea
                  ref={inputRef}
                  placeholder="Paste your JSON here..."
                  className={cn(
                    "font-code w-full min-h-full border-none focus-visible:ring-0 bg-transparent resize-none leading-6 rounded-none py-2.5 shadow-none",
                    wordWrap ? "whitespace-pre-wrap" : "whitespace-pre overflow-x-auto"
                  )}
                  wrap={wordWrap ? "soft" : "off"}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>
            </div>
            {error && (
              <div className="p-2 border-t border-destructive/20 bg-destructive/5">
                <p className="text-xs text-destructive font-code whitespace-pre-wrap">
                  {error}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons (Middle) */}
        <div className="flex flex-row lg:flex-col justify-center items-center gap-4 py-4 lg:py-0 min-w-[200px]">
          <div className="w-full space-y-4 px-2">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                {t('common.indentation')}
              </Label>
              <Select 
                value={indentSize.toString()} 
                onValueChange={(val) => setIndentSize(parseInt(val))}
              >
                <SelectTrigger className="h-9 w-full bg-background border-input shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 {t('common.spaces')}</SelectItem>
                  <SelectItem value="3">3 {t('common.spaces')}</SelectItem>
                  <SelectItem value="4">4 {t('common.spaces')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                <ListOrdered className="h-3 w-3" />
                {t('common.sort')}
              </Label>
              <Select 
                value={sortOrder} 
                onValueChange={(val: SortOrder) => setSortOrder(val)}
              >
                <SelectTrigger className="h-9 w-full bg-background border-input shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t('common.none')}</SelectItem>
                  <SelectItem value="asc">{t('common.asc')}</SelectItem>
                  <SelectItem value="desc">{t('common.desc')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <WrapText className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="word-wrap" className="text-xs font-medium cursor-pointer">
                  {t('common.wordWrap')}
                </Label>
              </div>
              <Switch 
                id="word-wrap" 
                checked={wordWrap} 
                onCheckedChange={setWordWrap} 
              />
            </div>
          </div>
          
          <Button 
            onClick={handleBeautify} 
            className="flex-1 lg:flex-none lg:w-full shadow-md bg-primary hover:bg-primary/90"
            size="lg"
          >
            <Check className="h-4 w-4 mr-2" />
            {t('common.beautify')}
          </Button>

          <div className="hidden lg:flex items-center justify-center text-muted-foreground/20">
            <ArrowRightLeft className="h-6 w-6" />
          </div>

          <Button 
            onClick={handleMinify} 
            variant="secondary" 
            className="flex-1 lg:flex-none lg:w-full shadow-sm"
            size="lg"
          >
            <Braces className="h-4 w-4 mr-2" />
            {t('common.minify')}
          </Button>
        </div>

        {/* Output Section */}
        <Card className="flex-1 border-border shadow-lg flex flex-col overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="flex items-center gap-4">
              <CardTitle className="text-lg">{t('common.output')}</CardTitle>
              <Tabs value={viewMode} onValueChange={(val) => setViewMode(val as OutputView)} className="w-fit">
                <TabsList className="h-8">
                  <TabsTrigger value="code" className="text-xs">
                    <Braces className="h-3 w-3 mr-1.5" />
                    Code
                  </TabsTrigger>
                  <TabsTrigger value="tree" className="text-xs" disabled={!parsedOutput}>
                    <Layout className="h-3 w-3 mr-1.5" />
                    Tree View
                  </TabsTrigger>
                </TabsList>
              </Tabs>
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
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            <div className="flex flex-1 min-h-[400px] border-t bg-secondary/10 overflow-hidden">
              {viewMode === 'code' ? (
                <>
                  <LineNumbers text={output} />
                  <div className="flex-1 overflow-auto">
                    <Textarea
                      readOnly
                      ref={outputRef}
                      placeholder="Formatted results will appear here..."
                      className={cn(
                        "font-code w-full min-h-full border-none focus-visible:ring-0 bg-transparent resize-none leading-6 rounded-none py-2.5 shadow-none",
                        wordWrap ? "whitespace-pre-wrap" : "whitespace-pre overflow-x-auto"
                      )}
                      wrap={wordWrap ? "soft" : "off"}
                      value={output}
                    />
                  </div>
                </>
              ) : (
                <div className="flex-1 overflow-auto p-4 bg-transparent font-code">
                  {parsedOutput && <JsonTreeNode value={parsedOutput} />}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}