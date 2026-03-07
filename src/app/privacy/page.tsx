"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, EyeOff, ServerOff } from 'lucide-react';
import { useTranslation } from '@/components/providers/i18n-provider';

export default function PrivacyPage() {
  const { t } = useTranslation();
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    setLastUpdated(new Date().toLocaleDateString());
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-headline font-bold">{t('policies.privacy.title')}</h1>
        <p className="text-muted-foreground">{t('policies.privacy.last_updated')}: {lastUpdated || '...'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-primary/10 bg-primary/5">
          <CardContent className="pt-6 flex gap-4">
            <ServerOff className="h-8 w-8 text-primary shrink-0" />
            <div>
              <h3 className="font-bold">{t('policies.privacy.card1_title')}</h3>
              <p className="text-sm text-muted-foreground">{t('policies.privacy.card1_desc')}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary/10 bg-primary/5">
          <CardContent className="pt-6 flex gap-4">
            <EyeOff className="h-8 w-8 text-primary shrink-0" />
            <div>
              <h3 className="font-bold">{t('policies.privacy.card2_title')}</h3>
              <p className="text-sm text-muted-foreground">{t('policies.privacy.card2_desc')}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            {t('policies.privacy.commitment_title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none space-y-4 text-muted-foreground">
          <section>
            <h3 className="text-foreground font-bold">{t('policies.privacy.s1_title')}</h3>
            <p>{t('policies.privacy.s1_desc')}</p>
          </section>

          <section>
            <h3 className="text-foreground font-bold">{t('policies.privacy.s2_title')}</h3>
            <p>{t('policies.privacy.s2_desc')}</p>
          </section>

          <section>
            <h3 className="text-foreground font-bold">{t('policies.privacy.s3_title')}</h3>
            <p>{t('policies.privacy.s3_desc')}</p>
          </section>

          <section>
            <h3 className="text-foreground font-bold">{t('policies.privacy.s4_title')}</h3>
            <p>{t('policies.privacy.s4_desc')}</p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
