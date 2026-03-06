"use client"

import { useState, useRef, useMemo } from 'react';
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
  Palette, 
  Copy, 
  Trash2, 
  Upload, 
  FileCode, 
  ArrowRightLeft, 
  Check, 
  WrapText,
  ChevronRight,
  ChevronDown,
  Layout,
  Braces
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { beautifyCss, minifyCss } from '@/lib/css';

type OutputView = 'code' | 'tree';

interface CssNode {
  selector: string;
  rules: { property: string; value: string }[];
}

const parseCssToTree = (css: string): CssNode[] => {
  try {
    const nodes: CssNode[] = [];
    // Very simple regex-based parser for CSS rules
    const ruleBlocks = css.match(/[^{}]+\{[^{}]+\}/g);
    
    if (ruleBlocks) {
      ruleBlocks.forEach(block => {
        const [selectorPart, rulesPart] = block.split('{');
        const selector = selectorPart.trim();
        const rulesClean = rulesPart.replace('}', '').trim();
        const ruleLines = rulesClean.split(';').filter(r => r.trim());
        
        const rules = ruleLines.map(line => {
          const [prop, ...valParts] = line.split(':');
          return {
            property: prop.trim(),
            value: valParts.join(':').trim()
          };
        });
        
        nodes.push({ selector, rules });
      });
    }
    
    return nodes;
  } catch (e) {
    return [];
  }
};

const highlightCss = (css: string) => {
  if (!css) return null;
  
  // Basic Regex-based highlighting for CSS
  const tokens = css.split(/(\/\*[\s\S]*?\*\/|[\w-]+\s*(?=:)|:\s*[^;{}]+;|[{}])/g);
  
  return tokens.map((token, i) => {
    if (!token) return null;
    
    if (token.startsWith('/*')) {
      return <span key={i} className="text-muted-foreground italic">{token}</span>;
    }
    if (token.includes(':') && !token.startsWith(':')) {
      const [prop, val] = token.split(':');
      return (
        <span key={i}>
          <span className="text-cyan-600 dark:text-cyan-400">{prop}</span>
          <span className="text-muted-foreground">:</span>
          <span className="text-green-600 dark:text-green-400">{val}</span>
        </span>
      );
    }
    if (token === '{' || token === '}') {
      return <span key={i} className="text-muted-foreground font-bold">{token}</span>;
    }
    if (/^[.#\w]/.test(token.trim())) {
      return <span key={i} className="text-purple-600 dark:text-purple-400 font-bold">{token}</span>;
    }
    
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

const CssTreeNode = ({ node, wordWrap }: { node: CssNode; wordWrap: boolean }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="font-code text-sm py-0.5">
      <div 
        className="flex items-center gap-1 cursor-pointer hover:bg-muted/50 rounded px-1 transition-colors w-fit whitespace-nowrap"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-4 h-4 flex items-center justify-center text-muted-foreground">
          {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </div>
        <span className="text-purple-600 dark:text-purple-400 font-bold">{node.selector}</span>
        <span className="text-muted-foreground">{'{'}</span>
        {!isOpen && <span className="text-muted-foreground px-1 bg-muted/50 rounded text-xs">... {node.rules.length} rules</span>}
        {!isOpen && <span className="text-muted-foreground">{'}'}</span>}
      </div>
      
      {isOpen && (
        <div className="ml-6 border-l border-muted/30 pl-2">
          {node.rules.map((rule, index) => (
            <div key={index} className={cn(
              "flex items-start gap-1 py-0.5",
              wordWrap ? "whitespace-pre-wrap" : "whitespace-nowrap"
            )}>
              <span className="text-cyan-600 dark:text-cyan-400">{rule.property}</span>
              <span className="text-muted-foreground">:</span>
              <span className="text-green-600 dark:text-green-400">{rule.value}</span>
              <span className="text-muted-foreground">;</span>
            </div>
          ))}
        </div>
      )}
      
      {isOpen && (
        <div className="ml-4 text-muted-foreground whitespace-nowrap">
          {'}'}
        </div>
      )}
    </div>
  );
};

export default function CssFormatterPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [parsedOutput, setParsedOutput] = useState<CssNode[]>([]);
  const [indentSize, setIndentSize] = useState<number>(2);
  const [viewMode, setViewMode] = useState<OutputView>('code');
  const [wordWrap, setWordWrap] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBeautify = () => {
    if (!input.trim()) return;
    const formatted = beautifyCss(input, indentSize);
    setOutput(formatted);
    const tree = parseCssToTree(formatted);
    setParsedOutput(tree);
    setError(null);
  };

  const handleMinify = () => {
    if (!input.trim()) return;
    const minified = minifyCss(input);
    setOutput(minified);
    const tree = parseCssToTree(minified);
    setParsedOutput(tree);
    setError(null);
    setViewMode('code');
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setParsedOutput([]);
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

  const highlightedOutput = useMemo(() => highlightCss(output), [output]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <Palette className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">{t('tools.css_formatter.name')}</h1>
          <p className="text-muted-foreground">{t('tools.css_formatter.description')}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-stretch gap-4">
        {/* Input Section */}
        <Card className="flex-1 border-border shadow-lg flex flex-col overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileCode className="h-5 w-5 text-primary" />
              {t('common.input')}
            </CardTitle>
            <div className="flex gap-2">
              <input
                type="file"
                accept=".css"
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
                  placeholder="Paste your CSS here..."
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
          
          <div className="flex flex-col gap-3 w-full">
            <Button 
              onClick={handleBeautify} 
              className="shadow-md bg-primary hover:bg-primary/90 w-full"
              size="lg"
            >
              <Check className="h-4 w-4 mr-2" />
              {t('common.beautify')}
            </Button>

            <div className="hidden lg:flex items-center justify-center text-muted-foreground/20 py-1">
              <ArrowRightLeft className="h-6 w-6" />
            </div>

            <Button 
              onClick={handleMinify} 
              variant="secondary" 
              className="w-full shadow-sm"
              size="lg"
            >
              <Palette className="h-4 w-4 mr-2" />
              {t('common.minify')}
            </Button>
          </div>
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
                  <TabsTrigger value="tree" className="text-xs" disabled={parsedOutput.length === 0}>
                    <Layout className="h-3 w-3 mr-1.5" />
                    Tree View
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={copyToClipboard}
                disabled={!output}
              >
                <Copy className="h-4 w-4 mr-2" />
                {t('common.copy')}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            <div className="flex flex-1 min-h-[400px] border-t bg-secondary/10 overflow-hidden">
              {viewMode === 'code' ? (
                <>
                  <LineNumbers text={output} />
                  <div className="flex-1 overflow-auto bg-[#fafafa] dark:bg-[#0f1115]">
                    <div className={cn(
                      "font-code w-full min-h-full leading-6 py-2.5 px-3",
                      wordWrap ? "whitespace-pre-wrap" : "whitespace-pre"
                    )}>
                      {highlightedOutput || <span className="text-muted-foreground/50">Formatted results will appear here...</span>}
                    </div>
                  </div>
                </>
              ) : (
                <div className={cn(
                  "flex-1 overflow-auto p-4 bg-[#fafafa] dark:bg-[#0f1115] font-code",
                  !wordWrap && "overflow-x-auto"
                )}>
                  {parsedOutput.map((node, i) => (
                    <CssTreeNode key={i} node={node} wordWrap={wordWrap} />
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
