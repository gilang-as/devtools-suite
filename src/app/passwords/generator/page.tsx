"use client"

import PasswordGeneratorTool from '@/components/tools/PasswordGeneratorTool';
import { ToolSEOContent } from '@/components/tools/ToolSEOContent';

export default function PasswordGeneratorPage() {
  return (
    <>
      <PasswordGeneratorTool />
      <ToolSEOContent 
        title="Random Password Generation"
        sections={[
          {
            title: "Why use a Random Password?",
            content: "Using a random, high-entropy password is the single most effective way to protect your accounts from brute-force and dictionary attacks. Humans tend to create predictable patterns; a machine-generated string ensures maximum security by using the full character set available."
          },
          {
            title: "What makes a password 'Strong'?",
            content: "A strong password typically has at least 12 characters and includes a mix of uppercase letters, lowercase letters, numbers, and symbols. The more varied the character pool and the longer the string, the exponentially harder it becomes for an attacker to crack."
          },
          {
            title: "Browser-Based Security",
            content: "Our generator uses the 'Web Crypto API' (window.crypto.getRandomValues), which is a cryptographically secure pseudo-random number generator (CSPRNG). Unlike other online generators, your password is created locally in your browser and never travels across the internet."
          },
          {
            title: "Best Practices",
            content: "We recommend using a length of 16 or more for critical accounts. Use the 'Avoid Similar' toggle to remove ambiguous characters like 'i', 'l', and '1', making it easier to read the password if you need to type it manually."
          }
        ]}
      />
    </>
  );
}
