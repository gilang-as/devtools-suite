"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cookie, CheckCircle2, Globe, ShieldCheck } from 'lucide-react';

export default function CookiePage() {
  return (
    <div className="max-w-4xl mx-auto py-12 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-headline font-bold">Cookie Policy</h1>
        <p className="text-muted-foreground">How we use local storage and cookies.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center p-6 space-y-2">
          <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="text-primary h-6 w-6" />
          </div>
          <h3 className="font-bold">No Tracking</h3>
          <p className="text-xs text-muted-foreground">We do not use advertising or tracking cookies.</p>
        </Card>
        <Card className="text-center p-6 space-y-2">
          <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
            <ShieldCheck className="text-primary h-6 w-6" />
          </div>
          <h3 className="font-bold">Functional Only</h3>
          <p className="text-xs text-muted-foreground">Used only to remember your theme and language.</p>
        </Card>
        <Card className="text-center p-6 space-y-2">
          <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
            <Globe className="text-primary h-6 w-6" />
          </div>
          <h3 className="font-bold">GDPR Ready</h3>
          <p className="text-xs text-muted-foreground">Compliant with global privacy regulations.</p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cookie className="h-5 w-5 text-primary" />
            Cookie Usage Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground">
          <p>
            DevTools Suite uses very minimal data stored on your device to provide a consistent user experience. We prioritize your privacy by avoiding any invasive tracking techniques.
          </p>

          <section className="space-y-3">
            <h3 className="text-foreground font-bold underline decoration-primary/30 underline-offset-4">1. What we store</h3>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>
                <strong>Theme Preference:</strong> Stored in <code className="bg-muted px-1 rounded">localStorage</code> to remember if you prefer Light or Dark mode.
              </li>
              <li>
                <strong>Language Preference:</strong> Stored in <code className="bg-muted px-1 rounded">localStorage</code> to ensure the interface appears in your chosen language (English or Indonesian).
              </li>
              <li>
                <strong>Sidebar State:</strong> A small cookie used to remember if you prefer the navigation sidebar collapsed or expanded.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-foreground font-bold underline decoration-primary/30 underline-offset-4">2. Why we don't show a "Cookie Banner"</h3>
            <p className="text-sm">
              According to the GDPR (Europe), CCPA (California), and other global privacy laws, explicit consent is generally required for <strong>non-essential tracking or advertising cookies</strong>. Since our data storage is strictly <strong>functional and essential</strong> for user-selected settings (Theme/Language), and we perform no tracking, a intrusive pop-up banner is not legally required and would only clutter your workspace.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-foreground font-bold underline decoration-primary/30 underline-offset-4">3. Managing your data</h3>
            <p className="text-sm">
              You can clear these preferences at any time by clearing your browser's "Site Data" or "Cache" for this domain.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
