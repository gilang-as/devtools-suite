
"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cookie, CheckCircle2, Globe, ShieldCheck } from 'lucide-react';
import { useTranslation } from '@/components/providers/i18n-provider';

export default function CookiePage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-headline font-bold">{t('policies.cookies.title')}</h1>
        <p className="text-muted-foreground">{t('policies.cookies.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center p-6 space-y-2">
          <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="text-primary h-6 w-6" />
          </div>
          <h3 className="font-bold">{t('policies.cookies.c1_title')}</h3>
          <p className="text-xs text-muted-foreground">{t('policies.cookies.c1_desc')}</p>
        </Card>
        <Card className="text-center p-6 space-y-2">
          <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
            <ShieldCheck className="text-primary h-6 w-6" />
          </div>
          <h3 className="font-bold">{t('policies.cookies.c2_title')}</h3>
          <p className="text-xs text-muted-foreground">{t('policies.cookies.c2_desc')}</p>
        </Card>
        <Card className="text-center p-6 space-y-2">
          <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
            <Globe className="text-primary h-6 w-6" />
          </div>
          <h3 className="font-bold">{t('policies.cookies.c3_title')}</h3>
          <p className="text-xs text-muted-foreground">{t('policies.cookies.c3_desc')}</p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cookie className="h-5 w-5 text-primary" />
            {t('policies.cookies.details_title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground">
          <p>{t('policies.cookies.details_intro')}</p>

          <section className="space-y-3">
            <h3 className="text-foreground font-bold underline decoration-primary/30 underline-offset-4">{t('policies.cookies.s1_title')}</h3>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>{t('policies.cookies.s1_item1')}</li>
              <li>{t('policies.cookies.s1_item2')}</li>
              <li>{t('policies.cookies.s1_item3')}</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-foreground font-bold underline decoration-primary/30 underline-offset-4">{t('policies.cookies.s2_title')}</h3>
            <p className="text-sm">{t('policies.cookies.s2_desc')}</p>
          </section>

          <section className="space-y-3">
            <h3 className="text-foreground font-bold underline decoration-primary/30 underline-offset-4">{t('policies.cookies.s3_title')}</h3>
            <p className="text-sm">{t('policies.cookies.s3_desc')}</p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
