"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Scale, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-headline font-bold">Terms of Service</h1>
        <p className="text-muted-foreground">Effective Date: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              Agreement to Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              By accessing DevTools Suite, you agree to be bound by these terms. These tools are provided for educational and professional development purposes.
            </p>
            
            <div className="space-y-4 mt-6">
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-foreground">Permitted Use</p>
                  <p className="text-sm">You are free to use these tools for personal or commercial projects. There are no fees or subscriptions.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-foreground">"As Is" Basis</p>
                  <p className="text-sm">The tools are provided without warranties of any kind. While we strive for 100% accuracy in our algorithms (like SHA-256 or RSA), you should verify critical outputs for production systems.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <FileText className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-foreground">Data Responsibility</p>
                  <p className="text-sm">You are responsible for the data you input. Since we do not store your data, we cannot "recover" any lost keys or formatted text once you close your browser session.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="pt-6">
            <h3 className="font-bold text-destructive flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4" />
              Limitation of Liability
            </h3>
            <p className="text-sm text-muted-foreground">
              In no event shall DevTools Suite be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the tools on this website.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
