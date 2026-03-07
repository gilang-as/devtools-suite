'use client';

import { generateToolSchema } from '@/lib/seo';

interface ToolSchemaProps {
  name: string;
  description: string;
  url: string;
  category?: string;
  image?: string;
  price?: string;
}

export function ToolSchema({
  name,
  description,
  url,
  category,
  image,
  price,
}: ToolSchemaProps) {
  const schema = generateToolSchema({
    name,
    description,
    path: url,
    category,
    image,
    price,
  });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
