import { Hash, KeyRound } from 'lucide-react';

export interface Tool {
  id: string;
  nameKey: string;
  descriptionKey: string;
  href: string;
  icon: string;
  category: 'Encoding' | 'Security' | 'Formatting';
}

export const TOOLS: Tool[] = [
  {
    id: 'base64-encode',
    nameKey: 'tools.base64_encode.name',
    descriptionKey: 'tools.base64_encode.description',
    href: '/base64/encode',
    icon: 'Hash',
    category: 'Encoding',
  },
  {
    id: 'base64-decode',
    nameKey: 'tools.base64_decode.name',
    descriptionKey: 'tools.base64_decode.description',
    href: '/base64/decode',
    icon: 'Hash',
    category: 'Encoding',
  }
];
