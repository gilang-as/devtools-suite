
"use client"

import { useState, useEffect } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { calculateSubnet, NetworkDetails } from '@/lib/networking';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Network, Globe, Binary, Info, ShieldCheck, Copy, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CidrCalculatorPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [ip, setIp] = useState('10.0.0.0');
  const [cidr, setCidr] = useState(24);
  const [result, setResult] = useState<NetworkDetails | null>(null);

  const handleCalculate = () => {
    try {
      const res = calculateSubnet(ip, cidr);
      setResult(res);
    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: e.message,
      });
    }
  };

  useEffect(() => {
    handleCalculate();
  }, [ip, cidr]);

  const StatBox = ({ label, value, sub }: { label: string; value: any; sub?: string }) => (
    <div className="p-4 bg-background rounded-xl border-2 border-primary/10 shadow-sm flex flex-col gap-1 items-center justify-center text-center hover:border-primary/30 transition-all group">
      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary">
        {label}
      </span>
      <span className="font-code text-lg font-bold text-foreground">
        {value}
      </span>
      {sub && <span className="text-[9px] text-muted-foreground font-mono">{sub}</span>}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <Globe className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">{t('tools.cidr_calculator.name')}</h1>
          <p className="text-muted-foreground">{t('tools.cidr_calculator.description')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">CIDR Setup</CardTitle>
              <CardDescription>Adjust the prefix length to see network changes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-2">
                <Label>Base IP Address</Label>
                <Input 
                  value={ip} 
                  onChange={(e) => setIp(e.target.value)} 
                  className="font-code text-lg h-12"
                />
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <Label className="font-bold">CIDR Prefix</Label>
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full font-code font-black text-lg">
                    /{cidr}
                  </span>
                </div>
                <Slider 
                  value={[cidr]} 
                  min={0} 
                  max={32} 
                  step={1} 
                  onValueChange={([v]) => setCidr(v)} 
                />
                <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                  <span>/0 (Internet)</span>
                  <span>/32 (Host)</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex flex-col gap-2">
                <StatBox label="Equivalent Mask" value={result?.mask} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-primary/5 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                CIDR Knowledge
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed space-y-2">
              <p>CIDR (Classless Inter-Domain Routing) replaced the older Class A, B, and C network architecture.</p>
              <p className="pt-2 border-t border-primary/10 italic">
                A /24 network provides 256 addresses, while a /32 represents a single specific host.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-6">
          {!result ? (
            <div className="h-full min-h-[400px] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-muted-foreground opacity-30">
              <Binary className="h-16 w-16 mb-4" />
              <p>Results will appear here</p>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatBox label={t('common.network_address')} value={result.networkAddress} sub={result.binaryIp} />
                <StatBox label={t('common.broadcast_address')} value={result.broadcastAddress} />
                <StatBox label={t('common.first_host') || 'First Host'} value={result.firstHost} />
                <StatBox label={t('common.last_host') || 'Last Host'} value={result.lastHost} />
                <StatBox label={t('common.total_hosts')} value={result.totalHosts.toLocaleString()} />
                <StatBox label={t('common.usable_hosts')} value={result.usableHosts.toLocaleString()} />
              </div>

              <Card className="border-border shadow-lg bg-secondary/10">
                <CardHeader className="py-3 border-b bg-background">
                  <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Detailed Binary Mask</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="bg-background p-4 rounded-lg border-2 border-primary/10 font-code text-center text-primary font-bold">
                    {result.binaryMask}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-3 text-center uppercase font-black tracking-widest">
                    Network bits (1s) vs Host bits (0s)
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
