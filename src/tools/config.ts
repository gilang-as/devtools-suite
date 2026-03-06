import { Hash, KeyRound, Fingerprint, Braces } from 'lucide-react';

export interface Tool {
  id: string;
  nameKey: string;
  descriptionKey: string;
  href: string;
  icon: string;
  category: 'Encoding' | 'Security' | 'Formatting' | 'Generators';
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
  },
  {
    id: 'json-formatter',
    nameKey: 'tools.json_formatter.name',
    descriptionKey: 'tools.json_formatter.description',
    href: '/json/formatter',
    icon: 'Braces',
    category: 'Formatting',
  },
  {
    id: 'uuid-v4',
    nameKey: 'tools.uuid_v4.name',
    descriptionKey: 'tools.uuid_v4.description',
    href: '/uuid/v4',
    icon: 'Fingerprint',
    category: 'Generators',
  },
  {
    id: 'uuid-v1',
    nameKey: 'tools.uuid_v1.name',
    descriptionKey: 'tools.uuid_v1.description',
    href: '/uuid/v1',
    icon: 'Fingerprint',
    category: 'Generators',
  },
  {
    id: 'uuid-v7',
    nameKey: 'tools.uuid_v7.name',
    descriptionKey: 'tools.uuid_v7.description',
    href: '/uuid/v7',
    icon: 'Fingerprint',
    category: 'Generators',
  },
  {
    id: 'guid',
    nameKey: 'tools.guid.name',
    descriptionKey: 'tools.guid.description',
    href: '/guid',
    icon: 'Fingerprint',
    category: 'Generators',
  }
];
