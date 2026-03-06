"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/components/providers/i18n-provider';
import { generatePKCS, PKCSVersion, PKCSResult } from '@/lib/pkcs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Copy, Trash2, Download, RefreshCcw, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface PKCSGeneratorProps {
  version: PKCSVersion;
}

export default function PKCSGenerator({ version }: PKCSGeneratorProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const pathname = usePathname();
  const [result, setResult] = useState<PKCSResult | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Options
  const [bits, setBits] = useState(2048);
  const [commonName, setCommonName] = useState('example.com');
  const [password, setPassword] = useState('password');

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await generatePKCS(version, { bits, commonName, password });
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
    // Optional: auto-generate on load if simple
    if (version === 'p1' || version === 'p8') {
      handleGenerate();
    }
  }, [version]);

  const copyToClipboard = () => {
    if (!result?.content) return;
    navigator.clipboard.writeText(result.content);
    toast({
      title: t('common.copied'),
    });
  };

  const handleDownload = () => {
    if (!result) return;
    
    let blob: Blob;
    let ext: string;
    
    if (version === 'p12' && result.binary) {
      blob = new Blob([result.binary], { type: 'application/x-pkcs12' });
      ext = 'p12';
    } else {
      blob = new Blob([result.content], { type: 'text/plain' });
      ext = 'pem';
    }
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `generated-${version}.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const navItems = [
    { name: 'PKCS#1', href: '/pkcs/p1' },
    { name: 'PKCS#7', href: '/pkcs/p7' },
    { name: 'PKCS#8', href: '/pkcs/p8' },
    { name: 'PKCS#10', href: '/pkcs/p10' },
    { name: 'PKCS#12', href: '/pkcs/p12' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">
            {t(`tools.pkcs_${version}.name`)}
          </h1>
          <p className="text-muted-foreground">
            {t(`tools.pkcs_${version}.description`)}
          </p>
        </div>
      </div>

      <div className="flex p-1 bg-muted rounded-lg w-fit overflow-x-auto max-w-full">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button 
              variant={pathname === item.href ? 'secondary' : 'ghost'} 
              className={cn("px-6 h-8 whitespace-nowrap", pathname === item.href && "bg-background shadow-sm")}
              size="sm"
            >
              {item.name}
            </Button>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border shadow-md md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="bits">Key Length (bits)</Label>
              <Input 
                id="bits" 
                type="number" 
                value={bits} 
                onChange={(e) => setBits(parseInt(e.target.value) || 2048)}
                step={1024}
                min={1024}
              />
            </div>
            {(version === 'p10' || version === 'p12') && (
              <div className="space-y-1.5">
                <Label htmlFor="cn">Common Name (CN)</Label>
                <Input 
                  id="cn" 
                  value={commonName} 
                  onChange={(e) => setCommonName(e.target.value)}
                  placeholder="example.com"
                />
              </div>
            )}
            {version === 'p12' && (
              <div className="space-y-1.5">
                <Label htmlFor="pass">PFX Password</Label>
                <Input 
                  id="pass" 
                  type="password"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}
            <Button onClick={handleGenerate} className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCcw className="h-4 w-4 mr-2" />}
              {t('common.generate')}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border shadow-lg md:col-span-2 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">{t('common.output')}</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownload}
                disabled={!result}
                className="h-8 text-xs"
              >
                <Download className="h-3 w-3 mr-1.5" />
                {t('common.download')}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={copyToClipboard}
                disabled={!result}
                className="h-8 text-xs"
              >
                <Copy className="h-3 w-3 mr-1.5" />
                {t('common.copy')}
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => setResult(null)} 
                title={t('common.clear')}
                disabled={!result}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <Textarea
              readOnly
              placeholder="Result will appear here..."
              className="font-code min-h-[400px] h-full bg-secondary/30 resize-none text-xs"
              value={result?.content || ''}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
