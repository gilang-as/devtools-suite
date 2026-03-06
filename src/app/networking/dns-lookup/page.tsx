"use client"

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { dnsLookup, DnsLookupResult, DnsRecordType } from '@/lib/networking';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Globe, ShieldCheck, Loader2, Braces, Copy, Globe2, Network, Lock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';

type RecordGroup = {
  title: string;
  types: DnsRecordType[];
};

const GROUPS: RecordGroup[] = [
  { title: 'Core', types: ['A', 'AAAA', 'CNAME', 'NS'] },
  { title: 'Mail', types: ['MX'] },
  { title: 'Info', types: ['TXT', 'SOA', 'SRV', 'CAA'] },
  { title: 'Security', types: ['DNSKEY', 'DS', 'RRSIG'] },
];

export default function DnsLookupPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [domain, setDomain] = useState('gilang.dev');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<string, DnsLookupResult>>({});
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaKey, setCaptchaKey] = useState(0);
  const turnstileRef = useRef<TurnstileInstance>(null);

  // Fallback to the 'Always Passes' test key if environment variable is missing
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

  const handleLookup = async () => {
    if (!domain.trim() || !captchaToken) return;
    setLoading(true);
    setResults({});
    
    const allTypes = GROUPS.flatMap(g => g.types);
    const promises = allTypes.map(async (type) => {
      try {
        const res = await dnsLookup(domain, type);
        return { type, res };
      } catch (e) {
        return { type, res: null };
      }
    });

    const settled = await Promise.all(promises);
    const newResults: Record<string, DnsLookupResult> = {};
    settled.forEach(({ type, res }) => {
      if (res && res.Answer && res.Answer.length > 0) {
        newResults[type] = res;
      }
    });

    setResults(newResults);
    setLoading(false);
    
    // Reset captcha for next request
    setCaptchaToken(null);
    setCaptchaKey(prev => prev + 1);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: t('common.copied') });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <Globe2 className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">{t('tools.dns_lookup.name')}</h1>
          <p className="text-muted-foreground">{t('tools.dns_lookup.description')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <Card className="lg:col-span-4 border-border shadow-lg sticky top-24">
          <CardHeader>
            <CardTitle className="text-lg">Domain Input</CardTitle>
            <CardDescription>Enter a domain to inspect its DNS landscape</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  value={domain}
                  onChange={(e) => {
                    setDomain(e.target.value);
                    if (captchaToken) {
                      setCaptchaToken(null);
                      setCaptchaKey(prev => prev + 1);
                    }
                  }}
                  placeholder="example.com"
                  className="pl-10 h-12 text-lg font-code"
                  onKeyDown={(e) => e.key === 'Enter' && captchaToken && !loading && handleLookup()}
                />
              </div>

              <div className="flex flex-col items-center justify-center p-4 bg-secondary/10 rounded-xl border-2 border-dashed border-primary/10 min-h-[120px] overflow-visible">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-1.5">
                  <Lock className="h-3 w-3" />
                  Security Verification
                </p>
                <div className="w-full flex justify-center">
                  <Turnstile
                    key={captchaKey}
                    ref={turnstileRef}
                    sitekey={siteKey}
                    options={{
                      size: 'normal',
                      theme: 'auto',
                    }}
                    onSuccess={(token) => setCaptchaToken(token)}
                    onError={() => {
                      setCaptchaToken(null);
                      toast({
                        variant: 'destructive',
                        title: 'Captcha Error',
                        description: 'Failed to initialize security widget.'
                      });
                    }}
                    onExpire={() => {
                      setCaptchaToken(null);
                      setCaptchaKey(prev => prev + 1);
                    }}
                  />
                </div>
              </div>
            </div>

            <Button 
              onClick={handleLookup} 
              className="w-full h-12 shadow-md transition-all active:scale-95" 
              disabled={loading || !captchaToken || !domain.trim()}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <Search className="h-5 w-5 mr-2" />
              )}
              {loading ? 'Inspecting...' : `${t('common.inspect')} DNS`}
            </Button>
            
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest">
                <ShieldCheck className="h-3 w-3" />
                Reliability Engine
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Uses a multi-provider fallback system (Google → Cloudflare → Quad9) to ensure resolution.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-8 space-y-6">
          {!loading && Object.keys(results).length === 0 ? (
            <div className="h-full min-h-[400px] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-muted-foreground opacity-30 text-center px-8">
              <Network className="h-16 w-16 mb-4" />
              <p className="font-medium text-xl">DNS map will appear here after lookup.</p>
            </div>
          ) : loading ? (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="text-muted-foreground animate-pulse font-medium">Resolving DNS records via multiple providers...</p>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-500">
              {GROUPS.map((group) => {
                const hasVisibleTypes = group.types.some(type => results[type]?.Answer && results[type].Answer!.length > 0);
                
                if (!hasVisibleTypes) return null;

                return (
                  <section key={group.title} className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">
                        {group.title} Records
                      </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {group.types.map((type) => {
                        const res = results[type];
                        if (!res || !res.Answer || res.Answer.length === 0) return null;
                        
                        return (
                          <Card key={type} className="border-border shadow-md overflow-hidden group">
                            <CardHeader className="py-3 px-4 bg-muted/30 border-b flex flex-row items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Badge variant="outline" className="bg-background font-code font-bold text-primary border-primary/20">
                                  {type}
                                </Badge>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">
                                  Resolved via {res.provider}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                {res.AD && <Badge variant="secondary" className="text-[9px] bg-green-500/10 text-green-600 border-green-500/20">DNSSEC</Badge>}
                                <Badge variant="outline" className="text-[9px] font-mono">TTL: {res.Answer?.[0]?.TTL || 'N/A'}</Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="p-0">
                              <div className="divide-y divide-border/50">
                                {res.Answer.map((ans, i) => (
                                  <div key={i} className="p-4 flex items-start justify-between gap-4 hover:bg-accent/5 transition-colors">
                                    <code className="font-code text-sm break-all leading-relaxed flex-1">
                                      {ans.data}
                                    </code>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => copyToClipboard(ans.data)}>
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </section>
                );
              })}

              <Card className="border-border shadow-lg bg-secondary/5 overflow-hidden">
                <CardHeader className="bg-background border-b py-3">
                  <div className="flex items-center gap-2">
                    <Braces className="h-4 w-4 text-primary" />
                    <CardTitle className="text-sm font-bold uppercase tracking-widest">Advanced Inspection (Raw JSON)</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <pre className="font-code text-[10px] p-6 max-h-[400px] overflow-auto leading-relaxed bg-[#fafafa] dark:bg-[#0f1115]">
                    {JSON.stringify(results, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
