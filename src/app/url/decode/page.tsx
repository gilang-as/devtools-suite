
"use client"

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/components/providers/i18n-provider';
import { decodeUrl } from '@/lib/url';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Trash2, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function UrlDecodePage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const pathname = usePathname();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleDecode = () => {
    setOutput(decodeUrl(input));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({
      title: t('common.copied'),
    });
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <LinkIcon className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">{t('tools.url_decode.name')}</h1>
          <p className="text-muted-foreground">{t('tools.url_decode.description')}</p>
        </div>
      </div>

      <div className="flex p-1 bg-muted rounded-lg w-fit">
        <Link href="/url/encode">
          <Button 
            variant={pathname === '/url/encode' ? 'secondary' : 'ghost'} 
            className={cn("px-8 h-8", pathname === '/url/encode' && "bg-background shadow-sm")}
            size="sm"
          >
            {t('common.encode')}
          </Button>
        </Link>
        <Link href="/url/decode">
          <Button 
            variant={pathname === '/url/decode' ? 'secondary' : 'ghost'} 
            className={cn("px-8 h-8", pathname === '/url/decode' && "bg-background shadow-sm")}
            size="sm"
          >
            {t('common.decode')}
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="border-border shadow-lg">
          <CardHeader>
            <CardTitle>{t('common.input')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your encoded URL string here..."
              className="font-code min-h-[150px] bg-secondary/30 resize-y"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={handleDecode} className="flex-1">
                {t('common.decode')}
              </Button>
              <Button variant="outline" size="icon" onClick={handleClear} title={t('common.clear')}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('common.output')}</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={copyToClipboard}
              disabled={!output}
            >
              <Copy className="h-4 w-4 mr-2" />
              {t('common.copy')}
            </Button>
          </CardHeader>
          <CardContent>
            <Textarea
              readOnly
              className="font-code min-h-[150px] bg-secondary/30"
              value={output}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
