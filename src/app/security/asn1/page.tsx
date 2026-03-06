"use client"

import { useState } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { parseAsn1 } from '@/lib/advanced-security';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileKey, Search, Trash2, ChevronDown, ChevronRight, Binary } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Asn1TreeNode = ({ node }: { node: any }) => {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="font-code text-xs py-1">
      <div 
        className={cn(
          "flex items-center gap-2 px-2 py-1 rounded hover:bg-muted/50 transition-colors w-fit cursor-default",
          hasChildren && "cursor-pointer"
        )}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        <div className="w-4 h-4 flex items-center justify-center text-muted-foreground shrink-0">
          {hasChildren ? (isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />) : null}
        </div>
        <span className="font-bold text-primary">{node.type}</span>
        {node.value && (
          <span className="text-muted-foreground truncate max-w-[300px]" title={node.value}>
            : {node.value}
          </span>
        )}
      </div>
      {isOpen && hasChildren && (
        <div className="ml-6 border-l border-muted/30 pl-2">
          {node.children.map((child: any, i: number) => (
            <Asn1TreeNode key={i} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function Asn1Page() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [tree, setTree] = useState<any>(null);

  const handleParse = async () => {
    try {
      if (!input.trim()) return;
      const result = await parseAsn1(input);
      setTree(result);
    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: e.message,
      });
    }
  };

  const handleClear = () => {
    setInput('');
    setTree(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <FileKey className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">{t('tools.asn1.name')}</h1>
          <p className="text-muted-foreground">{t('tools.asn1.description')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-5 border-border shadow-lg flex flex-col h-fit">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Binary className="h-5 w-5 text-primary" />
              {t('common.input')}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={handleClear} className="h-8 w-8">
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste PEM, Hex, or Base64 encoded ASN.1/DER data here..."
              className="font-code min-h-[300px] bg-secondary/30"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button onClick={handleParse} className="w-full h-11">
              <Search className="h-4 w-4 mr-2" />
              {t('common.inspect')}
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-7 border-border shadow-lg flex flex-col overflow-hidden min-h-[500px]">
          <CardHeader>
            <CardTitle className="text-lg">Structural View</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 bg-secondary/10 p-4 overflow-auto">
            {tree ? (
              <Asn1TreeNode node={tree} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-30">
                <FileKey className="h-16 w-16 mb-2" />
                <p>Structure will appear here after inspection</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}