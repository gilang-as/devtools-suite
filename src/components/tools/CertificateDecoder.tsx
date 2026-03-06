"use client"

import { useState } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { decodeX509, decodeCsr } from '@/lib/certificates';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileBadge, Search, Trash2, Calendar, ShieldCheck, User, Building, Fingerprint, Clock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface CertificateDecoderProps {
  type: 'x509' | 'csr';
}

export default function CertificateDecoder({ type }: CertificateDecoderProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleDecode = () => {
    try {
      if (!input.trim()) return;
      if (type === 'x509') {
        setResult(decodeX509(input));
      } else {
        setResult(decodeCsr(input));
      }
    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: e.message,
      });
    }
  };

  const clear = () => {
    setInput('');
    setResult(null);
  };

  const InfoRow = ({ label, value, icon: Icon }: { label: string; value: any; icon?: any }) => (
    <div className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
      {Icon && <Icon className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium break-all">{value || 'N/A'}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <FileBadge className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">
            {type === 'x509' ? 'SSL Certificate Decoder' : 'CSR Decoder'}
          </h1>
          <p className="text-muted-foreground">
            {t(`tools.${type === 'x509' ? 'certificate_decode' : 'csr_decode'}.description`)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">{t('common.input')}</CardTitle>
              <CardDescription>Paste your PEM encoded data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                placeholder="-----BEGIN CERTIFICATE-----..."
                className="font-code text-[10px] h-80 bg-secondary/30"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={handleDecode} className="flex-1 h-11" size="lg">
                  <Search className="h-4 w-4 mr-2" />
                  {t('common.decode')}
                </Button>
                <Button variant="outline" size="icon" className="h-11 w-11" onClick={clear}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7">
          {!result ? (
            <Card className="h-full border-dashed border-2 flex flex-col items-center justify-center py-20 text-muted-foreground bg-muted/10">
              <ShieldCheck className="h-16 w-16 opacity-20 mb-4" />
              <p>{t('common.placeholder_results')}</p>
            </Card>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              {type === 'x509' && (
                <Card className={cn(
                  "border-l-4 shadow-md",
                  result.validity.isValid ? "border-l-green-500" : "border-l-destructive"
                )}>
                  <CardHeader className="py-4 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant={result.validity.isValid ? "secondary" : "destructive"} className="px-3">
                        {result.validity.isValid ? 'VALID' : 'EXPIRED'}
                      </Badge>
                      <CardTitle className="text-lg">Certificate Status</CardTitle>
                    </div>
                    <Clock className={cn("h-5 w-5", result.validity.isValid ? "text-green-500" : "text-destructive")} />
                  </CardHeader>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-sm">
                  <CardHeader className="bg-muted/30 py-3">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" /> SUBJECT
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-1">
                    <InfoRow label="Common Name (CN)" value={result.subject.commonName} />
                    <InfoRow label="Organization (O)" value={result.subject.organizationName} />
                    <InfoRow label="Unit (OU)" value={result.subject.organizationalUnitName} />
                    <InfoRow label="Country (C)" value={result.subject.countryName} />
                  </CardContent>
                </Card>

                {type === 'x509' && (
                  <Card className="shadow-sm">
                    <CardHeader className="bg-muted/30 py-3">
                      <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Building className="h-4 w-4 text-primary" /> ISSUER
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-1">
                      <InfoRow label="Common Name (CN)" value={result.issuer.commonName} />
                      <InfoRow label="Organization (O)" value={result.issuer.organizationName} />
                    </CardContent>
                  </Card>
                )}

                <Card className="shadow-sm">
                  <CardHeader className="bg-muted/30 py-3">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-primary" /> KEY INFO
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-1">
                    <InfoRow label="Algorithm" value={result.publicKey.algorithm} />
                    <InfoRow label="Key Size" value={`${result.publicKey.bits} bits`} />
                    {type === 'x509' && <InfoRow label="Serial Number" value={result.serialNumber} />}
                  </CardContent>
                </Card>

                {type === 'x509' && (
                  <Card className="shadow-sm">
                    <CardHeader className="bg-muted/30 py-3">
                      <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" /> VALIDITY
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-1">
                      <InfoRow label="Not Before" value={result.validity.notBefore.toUTCString()} />
                      <InfoRow label="Not After" value={result.validity.notAfter.toUTCString()} />
                    </CardContent>
                  </Card>
                )}
              </div>

              {type === 'x509' && (
                <Card className="shadow-sm">
                  <CardHeader className="bg-muted/30 py-3">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Fingerprint className="h-4 w-4 text-primary" /> FINGERPRINTS
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-1">
                    <InfoRow label="SHA-1" value={result.fingerprints.sha1} />
                    <InfoRow label="SHA-256" value={result.fingerprints.sha256} />
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
