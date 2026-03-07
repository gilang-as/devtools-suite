"use client"

import { useState, useEffect } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { useTheme } from '@/components/providers/theme-provider';
import { dnsLookup, DnsLookupResult, DnsRecordType } from '@/lib/networking';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Globe, ShieldCheck, Loader2, Braces, Copy, Network, Lock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Turnstile } from '@marsidev/react-turnstile';
import { ToolSEOContent } from '@/components/tools/ToolSEOContent';

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

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

export default function DnsLookupPage() {
  const { t, language } = useTranslation();
  const { theme } = useTheme();
  const { toast } = useToast();
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<string, DnsLookupResult>>({});
  const [turnstileStatus, setTurnstileStatus] = useState<"success" | "error" | "expired" | "required">("required");
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLookup = async () => {
    if (!domain.trim()) return;
    
    if (turnstileStatus !== "success") {
      setError("Please verify you are not a robot");
      return;
    }

    setLoading(true);
    setResults({});
    setError(null);
    
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
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: t('common.copied') });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <Globe className="h-8 w-8" />
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
                    setError(null);
                  }}
                  placeholder="example.com"
                  className="pl-10 h-12 text-lg font-code"
                  onKeyDown={(e) => e.key === 'Enter' && turnstileStatus === 'success' && !loading && handleLookup()}
                />
              </div>

              <div className="flex flex-col items-center justify-center p-4 bg-secondary/10 rounded-xl border-2 border-dashed border-primary/10 min-h-[140px] overflow-hidden relative">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-1.5">
                  <Lock className="h-3 w-3" />
                  Security Verification
                </p>
                <div className="w-full flex justify-center min-h-[65px]">
                  {mounted && (
                    <Turnstile
                      siteKey={TURNSTILE_SITE_KEY}
                      options={{
                        execution: 'render',
                        appearance: 'always',
                        theme: theme === 'dark' ? 'dark' : 'light',
                        language: language as any
                      }}
                      onSuccess={() => {
                        setTurnstileStatus("success");
                        setError(null);
                      }}
                      onError={() => {
                        setTurnstileStatus("error");
                        setError("Security check failed. Please try again.");
                      }}
                      onExpire={() => {
                        setTurnstileStatus("expired");
                        setError("Security check expired. Please verify again.");
                      }}
                    />
                  )}
                </div>
                {error && (
                  <div className="mt-4 flex items-center gap-2 text-destructive text-xs animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{error}</span>
                  </div>
                )}
              </div>
            </div>

            <Button 
              onClick={handleLookup} 
              className="w-full h-12 shadow-md transition-all active:scale-95" 
              disabled={loading || turnstileStatus !== 'success' || !domain.trim()}
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

      <ToolSEOContent 
        title="DNS Lookup & Network Inspection"
        sections={[
          {
            title: "What is DNS?",
            content: "DNS (Domain Name System) is the internet's equivalent of a phone book. It translates human-readable domain names (like devtools-suite.app) into machine-readable IP addresses (like 192.0.2.1). Understanding your DNS records is crucial for website accessibility and security."
          },
          {
            title: "Why use this lookup tool?",
            content: "Standard command-line tools like 'dig' or 'nslookup' can be complex. Our tool provides a clean, visual breakdown of all record types (A, MX, TXT, etc.) using multiple global DNS providers to ensure you get the most accurate and propagated data."
          },
          {
            title: "Common DNS Record Types",
            content: "A Records map domains to IPv4; AAAA map to IPv6. MX records handle email routing. TXT records are often used for security verification (like SPF or DKIM). CNAME records act as aliases, pointing one domain name to another."
          },
          {
            title: "Security & Propagation",
            content: "We fetch results from Google, Cloudflare, and Quad9. This helps you verify if your DNS changes have propagated globally or if certain providers are serving outdated records (caching issues)."
          }
        ]}
      />
    </div>
  );
}
