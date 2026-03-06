"use client"

import { useState } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { pemToDer, derToPem } from '@/lib/certificates';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft, Copy, Trash2, RefreshCcw, FileCode, Binary, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PemDerConverter() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [direction, setDirection] = useState<'pem2der' | 'der2pem'>('pem2der');
  const [pemType, setPemType] = useState('CERTIFICATE');

  const handleConvert = () => {
    try {
      if (!input.trim()) return;
      if (direction === 'pem2der') {
        setOutput(pemToDer(input));
      } else {
        setOutput(derToPem(input, pemType));
      }
    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: e.message,
      });
    }
  };

  const switchDirection = () => {
    setDirection(prev => prev === 'pem2der' ? 'der2pem' : 'pem2der');
    setInput(output);
    setOutput('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <ArrowRightLeft className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">PEM ↔ DER Converter</h1>
          <p className="text-muted-foreground">{t('tools.pem_der_converter.description')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <Card className="lg:col-span-5 border-border shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {direction === 'pem2der' ? <FileCode className="h-5 w-5 text-primary" /> : <Binary className="h-5 w-5 text-primary" />}
                {direction === 'pem2der' ? 'PEM (Source)' : 'DER (Base64 Source)'}
              </CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setInput('')}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder={direction === 'pem2der' ? "-----BEGIN CERTIFICATE-----..." : "Base64 encoded DER data..."}
              className="font-code text-[10px] h-64 bg-secondary/30"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </CardContent>
        </Card>

        <div className="lg:col-span-2 flex flex-col gap-4 py-10 items-center">
          <Button variant="outline" size="icon" className="h-12 w-12 rounded-full shadow-md" onClick={switchDirection}>
            <RefreshCcw className="h-6 w-6" />
          </Button>
          
          {direction === 'der2pem' && (
            <div className="w-full space-y-1.5 px-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center block">PEM Type</label>
              <Select value={pemType} onValueChange={setPemType}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CERTIFICATE">Certificate</SelectItem>
                  <SelectItem value="PUBLIC KEY">Public Key</SelectItem>
                  <SelectItem value="PRIVATE KEY">Private Key</SelectItem>
                  <SelectItem value="CERTIFICATE REQUEST">CSR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Button onClick={handleConvert} className="w-full shadow-lg" size="lg">
            <Check className="h-4 w-4 mr-2" />
            Convert
          </Button>
        </div>

        <Card className="lg:col-span-5 border-border shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              {direction === 'pem2der' ? <Binary className="h-5 w-5 text-primary" /> : <FileCode className="h-5 w-5 text-primary" />}
              {direction === 'pem2der' ? 'DER (Base64 Result)' : 'PEM (Result)'}
            </CardTitle>
            <Button variant="outline" size="icon" onClick={() => navigator.clipboard.writeText(output)} disabled={!output}>
              <Copy className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <Textarea 
              readOnly
              className="font-code text-[10px] h-64 bg-secondary/10"
              value={output}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
