
"use client"

import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { calculateSubnet, NetworkDetails } from '@/lib/networking';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Network, Search, Trash2, Globe, Binary, Info, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SubnetCalculatorPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [ip, setIp] = useState('192.168.1.1');
  const [mask, setMask] = useState('255.255.255.0');
  const [result, setResult] = useState<NetworkDetails | null>(null);

  const masks = useMemo(() => {
    const arr = [];
    for (let i = 0; i <= 32; i++) {
      // Calculate mask from CIDR for the dropdown
      let m = 0;
      for (let j = 0; j < i; j++) m += (1 << (31 - j));
      const maskStr = [
        (m >>> 24) & 0xFF,
        (m >>> 16) & 0xFF,
        (m >>> 8) & 0xFF,
        m & 0xFF
      ].join('.');
      arr.push({ cidr: i, mask: maskStr });
    }
    return arr;
  }, []);

  const handleCalculate = () => {
    try {
      const res = calculateSubnet(ip, mask);
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
  }, [ip, mask]);

  const StatRow = ({ label, value, binary }: { label: string; value: any; binary?: string }) => (
    <div className="flex flex-col gap-1 py-3 border-b border-border/50 last:border-0 group">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
          {label}
        </span>
        {binary && (
          <span className="text-[9px] font-mono text-muted-foreground/40 hidden sm:inline">
            BIN: {binary}
          </span>
        )}
      </div>
      <span className="font-code text-sm font-bold text-foreground break-all">
        {value}
      </span>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <Network className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">{t('tools.subnet_calculator.name')}</h1>
          <p className="text-muted-foreground">{t('tools.subnet_calculator.description')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Network Parameters</CardTitle>
              <CardDescription>Enter your IP and Subnet configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>IP Address</Label>
                <Input 
                  value={ip} 
                  onChange={(e) => setIp(e.target.value)} 
                  placeholder="e.g. 192.168.1.1"
                  className="font-code"
                />
              </div>

              <div className="space-y-2">
                <Label>Subnet Mask</Label>
                <Select value={mask} onValueChange={setMask}>
                  <SelectTrigger className="font-code">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {masks.map(m => (
                      <SelectItem key={m.cidr} value={m.mask} className="font-code">
                        {m.mask} (/{m.cidr})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleCalculate} className="w-full h-11" variant="secondary">
                <Search className="h-4 w-4 mr-2" />
                Recalculate
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/10">
            <CardContent className="pt-6 flex gap-3 items-start">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                The Network Address and Broadcast Address are reserved and cannot be assigned to hosts. This tool uses standard Classless Inter-Domain Routing (CIDR) logic.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8">
          {!result ? (
            <div className="h-full min-h-[400px] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-muted-foreground opacity-30">
              <Network className="h-16 w-16 mb-4" />
              <p>Network details will appear here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
              <Card className="border-border shadow-md md:col-span-2 overflow-hidden">
                <CardHeader className="bg-muted/30 py-3 border-b">
                  <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-primary">Main Results</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 px-6 py-2">
                  <StatRow label={t('common.network_address')} value={result.networkAddress} binary={result.binaryIp} />
                  <StatRow label={t('common.broadcast_address')} value={result.broadcastAddress} />
                  <StatRow label={t('common.host_range')} value={`${result.firstHost} - ${result.lastHost}`} />
                  <StatRow label="CIDR Notation" value={`/${result.cidr}`} />
                </CardContent>
              </Card>

              <Card className="border-border shadow-md">
                <CardHeader className="bg-muted/30 py-3 border-b">
                  <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Host Capacities</CardTitle>
                </CardHeader>
                <CardContent className="px-6 py-2">
                  <StatRow label={t('common.total_hosts')} value={result.totalHosts.toLocaleString()} />
                  <StatRow label={t('common.usable_hosts')} value={result.usableHosts.toLocaleString()} />
                </CardContent>
              </Card>

              <Card className="border-border shadow-md">
                <CardHeader className="bg-muted/30 py-3 border-b">
                  <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mask Details</CardTitle>
                </CardHeader>
                <CardContent className="px-6 py-2">
                  <StatRow label="Subnet Mask" value={result.mask} binary={result.binaryMask} />
                  <StatRow label={t('common.wildcard_mask')} value={result.wildcardMask} />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
