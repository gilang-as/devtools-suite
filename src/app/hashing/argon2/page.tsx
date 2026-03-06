"use client"

import PasswordHasher from '@/components/tools/PasswordHasher';

export default function Argon2Page() {
  return <PasswordHasher algorithm="argon2" />;
}
