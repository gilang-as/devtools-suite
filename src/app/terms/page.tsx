
"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Scale, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/components/providers/i18n-provider';

export default function TermsPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-headline font-bold">{t('policies.terms.title')}</h1>
        <p className="text-muted-foreground">{t('common.valid')}: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              {t('policies.terms.agreement_title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>{t('policies.terms.agreement_desc')}</p>
            
            <div className="space-y-4 mt-6">
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-foreground">{t('policies.terms.p1_title')}</p>
                  <p className="text-sm">{t('policies.terms.p1_desc')}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-foreground">{t('policies.terms.p2_title')}</p>
                  <p className="text-sm">{t('policies.terms.p2_desc')}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <FileText className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-foreground">{t('policies.terms.p3_title')}</p>
                  <p className="text-sm">{t('policies.terms.p3_desc')}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="pt-6">
            <h3 className="font-bold text-destructive flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4" />
              {t('policies.terms.liability_title')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('policies.terms.liability_desc')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
