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
  CodeXml, 
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
import { beautifyXml, minifyXml } from '@/lib/xml';

type OutputView = 'code' | 'tree';

interface XmlNode {
  tag: string;
  attributes: Record<string, string>;
  children: (XmlNode | string)[];
}

const parseXmlToTree = (xml: string): XmlNode | null => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "text/xml");
    const errorNode = doc.querySelector("parsererror");
    if (errorNode) return null;

    const elementToNode = (el: Element): XmlNode => {
      const attributes: Record<string, string> = {};
      for (let i = 0; i < el.attributes.length; i++) {
        const attr = el.attributes[i];
        attributes[attr.name] = attr.value;
      }

      const children: (XmlNode | string)[] = [];
      for (let i = 0; i < el.childNodes.length; i++) {
        const child = el.childNodes[i];
        if (child.nodeType === Node.ELEMENT_NODE) {
          children.push(elementToNode(child as Element));
        } else if (child.nodeType === Node.TEXT_NODE && child.nodeValue?.trim()) {
          children.push(child.nodeValue.trim());
        }
      }

      return {
        tag: el.tagName,
        attributes,
        children
      };
    };

    return elementToNode(doc.documentElement);
  } catch (e) {
    return null;
  }
};

const highlightXml = (xml: string) => {
  if (!xml) return null;
  
  const tokens = xml.split(/(<[^>]+>|<!--.*?-->)/g);
  
  return tokens.map((token, i) => {
    if (!token) return null;
    if (token.startsWith('<!--')) {
      return <span key={i} className="text-muted-foreground italic">{token}</span>;
    }
    if (token.startsWith('<')) {
      const parts = token.split(/(\s+)/);
      return (
        <span key={i} className="text-blue-600 dark:text-blue-400">
          {parts.map((part, pi) => {
            if (pi === 0 || (pi === 1 && part.startsWith('/'))) {
              return <span key={pi} className="font-bold">{part}</span>;
            }
            if (part.includes('=')) {
              const [attr, val] = part.split('=');
              return (
                <span key={pi}>
                  <span className="text-cyan-600 dark:text-cyan-400">{attr}</span>
                  <span className="text-muted-foreground">=</span>
                  <span className="text-green-600 dark:text-green-400">{val}</span>
                </span>
              );
            }
            return <span key={pi}>{part}</span>;
          })}
        </span>
      );
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

const XmlTreeNode = ({ node, isLast = true, wordWrap }: { node: XmlNode | string; isLast?: boolean; wordWrap: boolean }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (typeof node === 'string') {
    return (
      <div className={cn(
        "flex items-start gap-1 font-code text-sm py-0.5 ml-6",
        wordWrap ? "whitespace-pre-wrap" : "whitespace-nowrap"
      )}>
        <span className="text-foreground">{node}</span>
      </div>
    );
  }

  const hasChildren = node.children.length > 0;
  const hasAttributes = Object.keys(node.attributes).length > 0;

  return (
    <div className="font-code text-sm py-0.5">
      <div 
        className="flex items-center gap-1 cursor-pointer hover:bg-muted/50 rounded px-1 transition-colors w-fit whitespace-nowrap"
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        <div className="w-4 h-4 flex items-center justify-center text-muted-foreground">
          {hasChildren ? (isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />) : null}
        </div>
        <span className="text-blue-600 dark:text-blue-400 font-bold">&lt;{node.tag}</span>
        {hasAttributes && Object.entries(node.attributes).map(([key, val]) => (
          <span key={key} className="ml-1">
            <span className="text-cyan-600 dark:text-cyan-400">{key}</span>
            <span className="text-muted-foreground">=</span>
            <span className="text-green-600 dark:text-green-400">"{val}"</span>
          </span>
        ))}
        <span className="text-blue-600 dark:text-blue-400 font-bold">&gt;</span>
        {!isOpen && hasChildren && <span className="text-muted-foreground px-1 bg-muted/50 rounded text-xs">...</span>}
        {!isOpen && hasChildren && <span className="text-blue-600 dark:text-blue-400 font-bold">&lt;/{node.tag}&gt;</span>}
      </div>
      
      {isOpen && hasChildren && (
        <div className="ml-6 border-l border-muted/30 pl-2">
          {node.children.map((child, index) => (
            <XmlTreeNode 
              key={index} 
              node={child} 
              isLast={index === node.children.length - 1}
              wordWrap={wordWrap}
            />
          ))}
        </div>
      )}
      
      {isOpen && hasChildren && (
        <div className="ml-4 text-blue-600 dark:text-blue-400 font-bold whitespace-nowrap">
          &lt;/{node.tag}&gt;
        </div>
      )}
    </div>
  );
};

export default function XmlFormatterPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [parsedOutput, setParsedOutput] = useState<XmlNode | null>(null);
  const [indentSize, setIndentSize] = useState<number>(2);
  const [viewMode, setViewMode] = useState<OutputView>('code');
  const [wordWrap, setWordWrap] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBeautify = () => {
    if (!input.trim()) return;
    const formatted = beautifyXml(input, indentSize);
    setOutput(formatted);
    const tree = parseXmlToTree(formatted);
    setParsedOutput(tree);
    setError(null);
  };

  const handleMinify = () => {
    if (!input.trim()) return;
    const minified = minifyXml(input);
    setOutput(minified);
    const tree = parseXmlToTree(minified);
    setParsedOutput(tree);
    setError(null);
    setViewMode('code');
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

  const highlightedOutput = useMemo(() => highlightXml(output), [output]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <CodeXml className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">{t('tools.xml_formatter.name')}</h1>
          <p className="text-muted-foreground">{t('tools.xml_formatter.description')}</p>
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
                accept=".xml"
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
                  placeholder="Paste your XML here..."
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
            <FileCode className="h-4 w-4 mr-2" />
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
                  {parsedOutput && <XmlTreeNode node={parsedOutput} wordWrap={wordWrap} />}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
