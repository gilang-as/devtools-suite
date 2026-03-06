"use client"

import PasswordHasher from '@/components/tools/PasswordHasher';

export default function Pbkdf2Page() {
  return <PasswordHasher algorithm="pbkdf2" />;
}
