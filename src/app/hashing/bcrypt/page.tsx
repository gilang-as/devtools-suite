"use client"

import PasswordHasher from '@/components/tools/PasswordHasher';

export default function BcryptPage() {
  return <PasswordHasher algorithm="bcrypt" />;
}
