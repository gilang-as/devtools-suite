"use client"

import { useState, useEffect } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { calculateIPv6, IPv6Details } from '@/lib/networking';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Network, Globe, Info, ShieldCheck, Search, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Ipv6CalculatorPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [ip, setIp] = useState('2001:db8::');
  const [prefix, setPrefix] = useState(64);
  const [result, setResult] = useState<IPv6Details | null>(null);

  const handleCalculate = () => {
    try {
      const res = calculateIPv6(ip, prefix);
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
  }, [ip, prefix]);

  const StatBox = ({ label, value, sub }: { label: string; value: any; sub?: string }) => (
    <div className="p-4 bg-background rounded-xl border-2 border-primary/10 shadow-sm flex flex-col gap-1 items-center justify-center text-center hover:border-primary/30 transition-all group">
      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary">
        {label}
      </span>
      <span className="font-code text-sm font-bold text-foreground break-all px-2">
        {value}
      </span>
      {sub && <span className="text-[9px] text-muted-foreground font-mono mt-1">{sub}</span>}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <Globe className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">{t('tools.ipv6_calculator.name')}</h1>
          <p className="text-muted-foreground">{t('tools.ipv6_calculator.description')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">IPv6 Configuration</CardTitle>
              <CardDescription>Setup your IPv6 prefix and address</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-2">
                <Label>IPv6 Address</Label>
                <Input 
                  value={ip} 
                  onChange={(e) => setIp(e.target.value)} 
                  placeholder="e.g. 2001:db8::"
                  className="font-code text-lg h-12"
                />
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <Label className="font-bold">Prefix Length</Label>
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full font-code font-black text-lg">
                    /{prefix}
                  </span>
                </div>
                <Slider 
                  value={[prefix]} 
                  min={0} 
                  max={128} 
                  step={1} 
                  onValueChange={([v]) => setPrefix(v)} 
                />
                <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                  <span>/0 (Internet)</span>
                  <span>/128 (Host)</span>
                </div>
              </div>

              <Button onClick={handleCalculate} className="w-full h-11" variant="secondary">
                <Search className="h-4 w-4 mr-2" />
                Recalculate
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border bg-primary/5 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                IPv6 Subnetting
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed space-y-2">
              <p>IPv6 uses a 128-bit address space. A typical LAN subnet is a /64.</p>
              <p className="pt-2 border-t border-primary/10 italic">
                Note: Unlike IPv4, there are no broadcast addresses in IPv6. Multicast is used instead.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-6">
          {!result ? (
            <div className="h-full min-h-[400px] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-muted-foreground opacity-30">
              <Activity className="h-16 w-16 mb-4" />
              <p>Results will appear here</p>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatBox label="Network Prefix" value={result.networkPrefix} sub="Start of Range" />
                <StatBox label="First Address" value={result.firstAddress} />
                <StatBox label="Last Address" value={result.lastAddress} />
                <StatBox label="Total Addresses" value={result.totalAddresses} />
              </div>

              <Card className="border-border shadow-lg bg-secondary/10 overflow-hidden">
                <CardHeader className="py-3 border-b bg-background">
                  <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Canonical Expansion</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="bg-background p-4 rounded-lg border-2 border-primary/10 font-code text-center text-primary font-bold text-xs">
                    {result.expandedIp}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-3 text-center uppercase font-black tracking-widest">
                    Full 128-bit Representation
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border shadow-md bg-background">
                <CardContent className="pt-6 flex gap-3 items-start">
                  <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    <strong>IPv6 Notation:</strong> Addresses are written as eight groups of four hexadecimal digits. Double colons (::) can replace one or more groups of consecutive zeros.
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
