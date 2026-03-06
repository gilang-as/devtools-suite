
"use client"

import { useState, useEffect } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { generatePKCS, PKCSResult } from '@/lib/pkcs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  FileBadge, 
  Copy, 
  Trash2, 
  Download, 
  RefreshCcw, 
  Loader2, 
  FileText, 
  Lock,
  Info,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function X509Generator() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [result, setResult] = useState<PKCSResult | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Options
  const [bits, setBits] = useState(2048);
  const [commonName, setCommonName] = useState('localhost');
  const [org, setOrg] = useState('DevTools Suite');
  const [unit, setUnit] = useState('Engineering');
  const [validityYears, setValidityYears] = useState(1);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await generatePKCS('x509', { 
        bits, 
        commonName, 
        organization: org,
        unit: unit,
        years: validityYears
      });
      setResult(res);
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

  useEffect(() => {
    handleGenerate();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: t('common.copied'),
    });
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([result.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `self-signed-cert.crt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const InfoIcon = ({ content }: { content: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className="inline-flex text-muted-foreground hover:text-primary transition-colors">
            <Info className="h-3.5 w-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-xs">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <FileBadge className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">{t('tools.pkcs_x509.name')}</h1>
          <p className="text-muted-foreground">{t('tools.pkcs_x509.description')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-border shadow-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <RefreshCcw className="h-4 w-4 text-primary" />
                Certificate Config
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="bits">{t('common.bits')}</Label>
                  <InfoIcon content={t('hints.bits')} />
                </div>
                <Input 
                  id="bits" 
                  type="number" 
                  value={bits} 
                  onChange={(e) => setBits(parseInt(e.target.value) || 2048)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="cn">Common Name (CN)</Label>
                  <InfoIcon content={t('hints.cn')} />
                </div>
                <Input 
                  id="cn" 
                  value={commonName} 
                  onChange={(e) => setCommonName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="org">Organization (O)</Label>
                  <InfoIcon content={t('hints.org')} />
                </div>
                <Input id="org" value={org} onChange={(e) => setOrg(e.target.value)} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="years">Validity (Years)</Label>
                  <InfoIcon content={t('hints.validity_years')} />
                </div>
                <Input 
                  id="years" 
                  type="number"
                  value={validityYears} 
                  onChange={(e) => setValidityYears(parseInt(e.target.value) || 1)}
                  min={1}
                />
              </div>

              <Button onClick={handleGenerate} className="w-full mt-2" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ShieldCheck className="h-4 w-4 mr-2" />}
                Generate Certificate
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border bg-primary/5 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-primary" />
                {t('pkcs_kb.x509.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs leading-relaxed text-muted-foreground">
              <p>{t('pkcs_kb.x509.desc')}</p>
              <div className="pt-2 border-t border-primary/10">
                <p className="font-bold text-primary">{t('pkcs_kb.x509.i1_label')}</p>
                <p>{t('pkcs_kb.x509.i1_text')}</p>
              </div>
              <div className="pt-2 border-t border-primary/10">
                <p className="font-bold text-primary">{t('pkcs_kb.x509.i3_label')}</p>
                <p>{t('pkcs_kb.x509.i3_text')}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Certificate Payload
            </h2>
            {result && (
              <Button variant="ghost" size="sm" onClick={() => setResult(null)} className="text-muted-foreground">
                <Trash2 className="h-4 w-4 mr-2" />
                {t('common.clear')}
              </Button>
            )}
          </div>

          {!result ? (
            <Card className="border-dashed border-2 flex flex-col items-center justify-center py-20 text-muted-foreground bg-muted/10">
              <FileBadge className="h-12 w-12 opacity-20 mb-4" />
              <p>{t('common.placeholder_results')}</p>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="flex gap-2">
                <Button onClick={handleDownload} className="flex-1 shadow-md" variant="secondary">
                  <Download className="h-4 w-4 mr-2" />
                  Download .crt
                </Button>
                <Button onClick={() => copyToClipboard(result.content)} variant="outline" className="flex-1">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Certificate
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {result.parts && Object.entries(result.parts).map(([label, val]) => (
                  <Card key={label} className="border-border shadow-sm overflow-hidden">
                    <CardHeader className="py-3 px-4 bg-secondary/30 flex flex-row items-center justify-between">
                      <div className="flex items-center gap-2">
                        {label.includes('Private') ? <Lock className="h-4 w-4 text-orange-500" /> : <FileBadge className="h-4 w-4 text-blue-500" />}
                        <CardTitle className="text-sm font-bold uppercase tracking-wider">{label}</CardTitle>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => copyToClipboard(val)}>
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Textarea
                        readOnly
                        className="font-code text-xs min-h-[250px] bg-transparent border-none focus-visible:ring-0 rounded-none resize-none"
                        value={val}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
