"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Lock, EyeOff, ServerOff } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-headline font-bold">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-primary/10 bg-primary/5">
          <CardContent className="pt-6 flex gap-4">
            <ServerOff className="h-8 w-8 text-primary shrink-0" />
            <div>
              <h3 className="font-bold">Client-Side Processing</h3>
              <p className="text-sm text-muted-foreground">All tools (Hashing, Encoding, Formatting) run entirely in your browser. Your data never leaves your computer.</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary/10 bg-primary/5">
          <CardContent className="pt-6 flex gap-4">
            <EyeOff className="h-8 w-8 text-primary shrink-0" />
            <div>
              <h3 className="font-bold">Zero Data Collection</h3>
              <p className="text-sm text-muted-foreground">We do not collect, store, or share any personal information, input data, or generated results.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Our Commitment
          </CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none space-y-4 text-muted-foreground">
          <section>
            <h3 className="text-foreground font-bold">1. Information We Do Not Collect</h3>
            <p>
              DevTools Suite is designed as a "stateless" utility. We do not require account registration, and we do not have a backend database to store your inputs. Whether you are hashing a password or formatting JSON, that data stays in your browser's memory and is cleared when you close the tab.
            </p>
          </section>

          <section>
            <h3 className="text-foreground font-bold">2. Anonymous Analytics</h3>
            <p>
              We may use basic, anonymous analytical tools to understand which tools are most popular and to monitor for technical errors. This data is purely numerical (e.g., "The JSON Formatter was used 100 times today") and contains no identifiable user information or payload data.
            </p>
          </section>

          <section>
            <h3 className="text-foreground font-bold">3. Third-Party Services</h3>
            <p>
              We do not sell, trade, or otherwise transfer your information to outside parties. Since we don't collect data in the first place, there is nothing to share.
            </p>
          </section>

          <section>
            <h3 className="text-foreground font-bold">4. Security</h3>
            <p>
              By performing all operations locally via JavaScript, we eliminate the primary security risk of data interception during transit to a server. For sensitive tasks like PGP key generation or Hashing, this is the safest possible architectural approach.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
