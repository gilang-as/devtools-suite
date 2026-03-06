"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/components/providers/i18n-provider';
import { generatePKCS, PKCSVersion, PKCSResult } from '@/lib/pkcs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Copy, Trash2, Download, RefreshCcw, Loader2, Key, FileText, Lock } from 'lucide-react';
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
  const [org, setOrg] = useState('DevTools Suite');
  const [unit, setUnit] = useState('Engineering');

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await generatePKCS(version, { 
        bits, 
        commonName, 
        password,
        organization: org,
        unit: unit
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
    if (version === 'p1' || version === 'p8') {
      handleGenerate();
    } else {
      setResult(null);
    }
  }, [version]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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
    <div className="max-w-6xl mx-auto space-y-8 py-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Options Column */}
        <Card className="lg:col-span-4 border-border shadow-md h-fit">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <RefreshCcw className="h-4 w-4 text-primary" />
              {t('common.generate')}
            </CardTitle>
            <CardDescription>Configure your security parameters</CardDescription>
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

            {version === 'p10' && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="org">Organization (O)</Label>
                  <Input 
                    id="org" 
                    value={org} 
                    onChange={(e) => setOrg(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="unit">Organizational Unit (OU)</Label>
                  <Input 
                    id="unit" 
                    value={unit} 
                    onChange={(e) => setUnit(e.target.value)}
                  />
                </div>
              </>
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

            {version === 'p7' && (
              <div className="space-y-1.5">
                <Label htmlFor="content">Sample Content to Wrap</Label>
                <Textarea 
                  id="content"
                  placeholder="Hello, PKCS#7!"
                  className="h-20"
                />
              </div>
            )}

            <Button onClick={handleGenerate} className="w-full mt-2" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCcw className="h-4 w-4 mr-2" />}
              {t('common.generate')}
            </Button>
          </CardContent>
        </Card>

        {/* Specialized Output Column */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {t('common.output')}
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
              <ShieldCheck className="h-12 w-12 opacity-20 mb-4" />
              <p>Generated results will appear here</p>
              <Button variant="link" onClick={handleGenerate} className="mt-2">
                Click to generate now
              </Button>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Actions Header */}
              <div className="flex gap-2">
                <Button onClick={handleDownload} className="flex-1 shadow-md" variant="secondary">
                  <Download className="h-4 w-4 mr-2" />
                  {t('common.download')} {version === 'p12' ? '.p12' : '.pem'}
                </Button>
                <Button onClick={() => copyToClipboard(result.content)} variant="outline" className="flex-1">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Full Payload
                </Button>
              </div>

              {/* Dynamic Parts Form */}
              <div className="grid grid-cols-1 gap-4">
                {result.parts && Object.entries(result.parts).map(([label, val]) => (
                  <Card key={label} className="border-border shadow-sm overflow-hidden">
                    <CardHeader className="py-3 px-4 bg-secondary/30 flex flex-row items-center justify-between">
                      <div className="flex items-center gap-2">
                        {label.includes('Private') ? <Lock className="h-4 w-4 text-orange-500" /> : <Key className="h-4 w-4 text-blue-500" />}
                        <CardTitle className="text-sm font-bold uppercase tracking-wider">{label}</CardTitle>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0" 
                        onClick={() => copyToClipboard(val)}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Textarea
                        readOnly
                        className="font-code text-[10px] sm:text-xs min-h-[120px] bg-transparent border-none focus-visible:ring-0 rounded-none resize-none leading-relaxed"
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
