"use client"

import PasswordHasher from '@/components/tools/PasswordHasher';

export default function PasswordHashPage() {
  return <PasswordHasher algorithm="bcrypt" />;
}
