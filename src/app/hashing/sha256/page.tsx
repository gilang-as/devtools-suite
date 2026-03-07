"use client"

import HashGenerator from '@/components/tools/HashGenerator';
import { ToolSEOContent } from '@/components/tools/ToolSEOContent';

export default function Sha256Page() {
  return (
    <>
      <HashGenerator type="sha256" />
      <ToolSEOContent 
        title="SHA-256 Hash Generation"
        sections={[
          {
            title: "What is SHA-256?",
            content: "SHA-256 (Secure Hash Algorithm 256-bit) is a cryptographic hash function that produces a unique, fixed-size 256-bit (32-byte) hash. It is part of the SHA-2 family and is widely considered one of the most secure ways to ensure data integrity."
          },
          {
            title: "Common Use Cases",
            content: "SHA-256 is the gold standard for verifying data integrity, securing blockchain transactions (including Bitcoin), and creating digital signatures. It is also used by developers to compare large files or database records without transferring the full data content."
          },
          {
            title: "How to use this tool?",
            content: "Simply type or paste your data into the input field. The 64-character hexadecimal hash will be generated instantly. You can then use the 'Copy' button to share the checksum or store it for verification purposes."
          },
          {
            title: "Is SHA-256 Reversible?",
            content: "No. Cryptographic hashes are designed to be 'one-way' functions. It is computationally impossible to reverse a hash back into its original input text. This 'pre-image resistance' is what makes it a vital tool for security and password verification (when combined with salting)."
          }
        ]}
      />
    </>
  );
}
