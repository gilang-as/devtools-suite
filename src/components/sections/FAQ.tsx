'use client';

import { FAQSchema } from '@/components/layout/StructuredData';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  description?: string;
  items: FAQItem[];
}

export function FAQSection({ title = 'Frequently Asked Questions', description, items }: FAQSectionProps) {
  return (
    <>
      {/* Structured Data */}
      <FAQSchema(items) />

      {/* FAQ Section */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4">
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              {description}
            </p>
          )}

          <Accordion type="single" collapsible className="space-y-4">
            {items.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-semibold hover:text-blue-600 dark:hover:text-blue-400">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  );
}
