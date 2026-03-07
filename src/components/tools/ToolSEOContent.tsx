"use client"

import React from 'react';
import { HelpCircle, BookOpen, Settings2, Info } from 'lucide-react';

interface SEOSection {
  title: string;
  content: string | React.ReactNode;
}

interface ToolSEOContentProps {
  title: string;
  sections: SEOSection[];
}

export function ToolSEOContent({ title, sections }: ToolSEOContentProps) {
  return (
    <div className="mt-20 space-y-12 border-t pt-16 pb-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-headline font-bold tracking-tight">
            Understanding {title}
          </h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {sections.map((section, idx) => (
            <section key={idx} className="space-y-4 relative group">
              <div className="flex items-start gap-4">
                <div className="bg-primary/5 p-3 rounded-2xl group-hover:bg-primary/10 transition-colors">
                  <span className="text-primary font-black text-xl leading-none">
                    {idx + 1}
                  </span>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {section.title}
                  </h3>
                  <div className="text-muted-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none">
                    {section.content}
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        <div className="bg-muted/30 p-8 rounded-3xl border-2 border-dashed flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <div className="bg-background p-4 rounded-2xl shadow-sm border">
            <Settings2 className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-lg">Pro Developer Workflow</h4>
            <p className="text-sm text-muted-foreground">
              All tools in our suite run entirely in your browser. Your data never leaves your machine, ensuring 100% privacy and blazing fast performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
