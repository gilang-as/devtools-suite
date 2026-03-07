"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/components/providers/i18n-provider';
import { encodeBase64 } from '@/lib/base64';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Copy, Trash2, Hash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ToolSEOContent } from '@/components/tools/ToolSEOContent';

export default function Base64EncodePage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const pathname = usePathname();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLive, setIsLive] = useState(true);

  const handleEncode = () => {
    setOutput(encodeBase64(input));
  };

  useEffect(() => {
    if (isLive) {
      handleEncode();
    }
  }, [input, isLive]);

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
          <Hash className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">{t('tools.base64_encode.name')}</h1>
          <p className="text-muted-foreground">{t('tools.base64_encode.description')}</p>
        </div>
      </div>

      <div className="flex p-1 bg-muted rounded-lg w-fit">
        <Link href="/base64/encode">
          <Button 
            variant={pathname === '/base64/encode' ? 'secondary' : 'ghost'} 
            className={cn("px-8 h-8", pathname === '/base64/encode' && "bg-background shadow-sm")}
            size="sm"
          >
            {t('common.encode')}
          </Button>
        </Link>
        <Link href="/base64/decode">
          <Button 
            variant={pathname === '/base64/decode' ? 'secondary' : 'ghost'} 
            className={cn("px-8 h-8", pathname === '/base64/decode' && "bg-background shadow-sm")}
            size="sm"
          >
            {t('common.decode')}
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="border-border shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('common.input')}</CardTitle>
            <div className="flex items-center space-x-2">
              <Label htmlFor="live-mode" className="text-sm font-medium cursor-pointer">
                {t('common.liveMode')}
              </Label>
              <Switch 
                id="live-mode" 
                checked={isLive} 
                onCheckedChange={setIsLive} 
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your text here..."
              className="font-code min-h-[150px] bg-secondary/30 resize-y"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="flex gap-2">
              {!isLive && (
                <Button onClick={handleEncode} className="flex-1">
                  {t('common.encode')}
                </Button>
              )}
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

      <ToolSEOContent 
        title="Base64 Encoding"
        sections={[
          {
            title: "What is Base64 Encoding?",
            content: "Base64 is a group of binary-to-text encoding schemes that represent binary data in an ASCII string format by translating it into a radix-64 representation. This is commonly used when there is a need to encode binary data that needs to be stored and transferred over media that are designed to deal with textual data."
          },
          {
            title: "When should you use Base64?",
            content: "Base64 is essential for embedding image data within HTML or CSS files (Data URIs), sending attachments via email (MIME), or passing complex data structures in URL parameters without worrying about character escaping."
          },
          {
            title: "How to use this tool?",
            content: "Our encoder works in real-time. Simply start typing or paste your content into the input field. The 'Live Mode' toggle ensures that the Base64 result updates instantly as you type. Once finished, use the copy button to save the result to your clipboard."
          },
          {
            title: "Privacy and Security",
            content: "Unlike other online converters, our Base64 tool performs all calculations locally in your browser. Your sensitive strings or data fragments are never sent to a server, making it safe for developers working with API keys or personal tokens."
          }
        ]}
      />
    </div>
  );
}
