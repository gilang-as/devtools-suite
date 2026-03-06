"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/components/providers/i18n-provider';
import { generateUUIDs, exportToCSV, UUIDVersion } from '@/lib/uuid';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Fingerprint, Copy, Trash2, Download, RefreshCcw, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface UUIDGeneratorProps {
  version: UUIDVersion;
}

export default function UUIDGenerator({ version }: UUIDGeneratorProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const pathname = usePathname();
  const [quantity, setQuantity] = useState(10);
  const [singleUuid, setSingleUuid] = useState('');
  const [bulkUuids, setBulkUuids] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const handleGenerateSingle = () => {
    const [newUuid] = generateUUIDs(version, 1);
    setSingleUuid(newUuid);
    setCopied(false);
  };

  const handleGenerateBulk = () => {
    const count = Math.min(Math.max(1, quantity), 1000);
    const newUuids = generateUUIDs(version, count);
    setBulkUuids(newUuids);
  };

  useEffect(() => {
    handleGenerateSingle();
    handleGenerateBulk();
  }, [version]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: t('common.copied'),
    });
    if (text === singleUuid) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadCSV = () => {
    if (bulkUuids.length === 0) return;
    exportToCSV(bulkUuids, `uuids-${version}-${new Date().getTime()}.csv`);
  };

  const navItems = [
    { name: 'v4', href: '/uuid/v4' },
    { name: 'v1', href: '/uuid/v1' },
    { name: 'v7', href: '/uuid/v7' },
    { name: 'GUID', href: '/guid' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <Fingerprint className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">
            {t(`tools.${version === 'guid' ? 'guid' : `uuid_${version}`}.name`)}
          </h1>
          <p className="text-muted-foreground">
            {t(`tools.${version === 'guid' ? 'guid' : `uuid_${version}`}.description`)}
          </p>
        </div>
      </div>

      <div className="flex p-1 bg-muted rounded-lg w-fit">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button 
              variant={pathname === item.href ? 'secondary' : 'ghost'} 
              className={cn("px-6 h-8", pathname === item.href && "bg-background shadow-sm")}
              size="sm"
            >
              {item.name}
            </Button>
          </Link>
        ))}
      </div>

      <Tabs defaultValue="single" className="space-y-6">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="single">{t('common.single') || 'Single'}</TabsTrigger>
          <TabsTrigger value="bulk">{t('common.bulk') || 'Bulk'}</TabsTrigger>
        </TabsList>

        <TabsContent value="single">
          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle>{t('common.output')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Input 
                    readOnly 
                    value={singleUuid} 
                    className="font-code text-lg h-12 bg-secondary/30 pr-12"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-10 w-10"
                    onClick={() => copyToClipboard(singleUuid)}
                  >
                    {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                  </Button>
                </div>
                <Button onClick={handleGenerateSingle} className="h-12 px-8">
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  {t('common.refresh') || 'Refresh'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-6">
          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle>{t('common.generate')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="quantity">{t('common.quantity')}</Label>
                <div className="flex gap-2">
                  <Input 
                    id="quantity" 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    min={1}
                    max={1000}
                  />
                  <Button onClick={handleGenerateBulk} className="flex-1 shrink-0">
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    {t('common.generate')}
                  </Button>
                </div>
                <p className="text-[0.7rem] text-muted-foreground">Max 1000 per generation</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t('common.output')}</CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDownloadCSV}
                  disabled={bulkUuids.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {t('common.download')}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => copyToClipboard(bulkUuids.join('\n'))}
                  disabled={bulkUuids.length === 0}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {t('common.copy')}
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setBulkUuids([])} title={t('common.clear')}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                readOnly
                className="font-code min-h-[250px] bg-secondary/30"
                value={bulkUuids.join('\n')}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
