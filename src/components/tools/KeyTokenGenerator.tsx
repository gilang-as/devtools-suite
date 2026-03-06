"use client"

import { useState, useEffect } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { generateSecureRandom, GeneratorFormat } from '@/lib/generators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Key, Copy, RefreshCcw, ShieldCheck, Download, Trash2, Zap, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface KeyTokenGeneratorProps {
  type: 'key' | 'token';
}

export default function KeyTokenGenerator({ type }: KeyTokenGeneratorProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [length, setLength] = useState(type === 'key' ? 32 : 48);
  const [format, setFormat] = useState<GeneratorFormat>(type === 'key' ? 'hex' : 'urlsafe');
  const [quantity, setQuantity] = useState(1);
  const [results, setResults] = useState<string[]>([]);

  const handleGenerate = () => {
    const newResults = [];
    const count = Math.min(Math.max(1, quantity), 100);
    for (let i = 0; i < count; i++) {
      newResults.push(generateSecureRandom(length, format));
    }
    setResults(newResults);
  };

  useEffect(() => {
    handleGenerate();
  }, [type]);

  const copyAll = () => {
    navigator.clipboard.writeText(results.join('\n'));
    toast({ title: t('common.copied') });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          {type === 'key' ? <Key className="h-8 w-8" /> : <Zap className="h-8 w-8" />}
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">
            {type === 'key' ? 'Random Key Generator' : 'Secure Token Generator'}
          </h1>
          <p className="text-muted-foreground">
            {t(`tools.${type === 'key' ? 'random_key' : 'secure_token'}.description`)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <RefreshCcw className="h-4 w-4 text-primary" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="font-bold">Byte Length</Label>
                  <span className="text-primary font-code font-bold">{length}</span>
                </div>
                <Slider 
                  value={[length]} 
                  min={8} 
                  max={128} 
                  step={4} 
                  onValueChange={([v]) => setLength(v)} 
                />
                <p className="text-[10px] text-muted-foreground italic">
                  * Byte length determines entropy. Output length varies by format.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Format</Label>
                <Select value={format} onValueChange={(v: GeneratorFormat) => setFormat(v)}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hex">Hexadecimal</SelectItem>
                    <SelectItem value="base64">Base64</SelectItem>
                    <SelectItem value="urlsafe">URL-Safe Base64</SelectItem>
                    <SelectItem value="alphanumeric">Alphanumeric</SelectItem>
                    <SelectItem value="base58">Base58 (Bitcoin)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  min={1}
                  max={100}
                />
              </div>

              <Button onClick={handleGenerate} className="w-full h-11 shadow-md">
                <RefreshCcw className="h-4 w-4 mr-2" />
                {t('common.generate')}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border bg-primary/5 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Security Information
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs leading-relaxed text-muted-foreground space-y-2">
              <p>Generation uses the Web Crypto API's cryptographically secure pseudo-random number generator (CSPRNG).</p>
              <p className="pt-2 border-t border-primary/10">
                <strong>Entropy:</strong> A 32-byte key provides 256 bits of entropy, which is the industry standard for high-security applications.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <Card className="border-border shadow-lg bg-secondary/10 flex flex-col h-full overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-background border-b py-3">
              <CardTitle className="text-lg">{t('common.output')}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyAll} disabled={results.length === 0}>
                  <Copy className="h-4 w-4 mr-2" />
                  {t('common.copy')} All
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setResults([])}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <Textarea
                readOnly
                className="font-code text-xs h-full min-h-[400px] bg-transparent border-none focus-visible:ring-0 resize-none p-6 leading-loose"
                value={results.join('\n')}
                placeholder="Generated results will appear here..."
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
