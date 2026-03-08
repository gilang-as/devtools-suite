# DevTools Suite

DevTools Suite is a comprehensive, professional-grade collection of online developer tools designed for speed, security, and privacy. All processing happens locally in your browser, ensuring your sensitive data never leaves your machine.

## 🚀 Key Features

- **100% Client-Side**: No data is sent to a server for processing (except for AI-powered features and DNS lookups).
- **Modern UI**: Built with Next.js, Tailwind CSS, and ShadCN UI.
- **Multilingual Support**: Available in English and Indonesian.
- **Theming**: Includes 10+ professional color schemes (Catppuccin, Seasonal, Cultural).
- **SEO Optimized**: Fully configured with metadata, structured data, and sitemaps.

---

## 🛠 Available Tools

### 🔤 Encoding & Decoding
- **Base64**: Encode and decode text to Base64 format.
- **Binary**: Convert text to binary (0s and 1s) and back.
- **Hexadecimal**: Convert text to hex strings and back.
- **URL**: Safely encode/decode URL components.
- **HTML Entities**: Encode/decode special characters for web safety.
- **URL Parser**: Break down complex URLs into structured parts.

### 🛡 Security & Cryptography
- **RSA**: Encrypt, decrypt, sign, and verify using RSA keys.
- **PGP**: OpenPGP message encryption and digital signatures.
- **AES**: High-security symmetric encryption (GCM, CBC, CTR).
- **ChaCha20**: Modern, fast stream cipher encryption.
- **DES / 3DES**: Legacy symmetric encryption for compatibility.
- **ECC**: Generate high-performance signatures using Elliptic Curve.
- **JWT**: Encode, decode, and cryptographically verify JSON Web Tokens.
- **SSL Certificate**: Deep inspection of X.509 certificates and CSRs.
- **ASN.1 Inspector**: Visualize complex security structures.
- **PKCS Generators**: Generate keys in PKCS#1, #8, #10, and #12 formats.

### 🔑 Passwords & Hashing
- **Password Generator**: Generate high-entropy, random passwords.
- **Strength Checker**: Analyze password complexity and entropy.
- **Hash Generators**: MD5, SHA-1, SHA-256, SHA-512, and SHA-3.
- **Password Hashing**: Bcrypt, Argon2, and PBKDF2.
- **HMAC**: Generate authentication codes using SHA families.
- **Checksums**: CRC32 and Adler-32 for data integrity.

### 📜 Formatting
- **JSON**: Format, minify, and sort keys.
- **Code Formatters**: Professional formatting for JS, TS, HTML, XML, and CSS.

### 🔄 Data Conversion
- **JSON Converters**: Transform JSON to Go, Rust, TypeScript, Java, YAML, TOML, XML, and CSV.
- **Format Swapping**: CSV to JSON, YAML to JSON, TOML to JSON, XML to JSON.
- **Color Converter**: Convert between HEX, RGB, and HSL.
- **Color Palette**: Generate harmonic UI color schemes.

### 💻 Programming Utilities
- **Regex AI**: Generate complex regular expressions using AI.
- **Regex Tester**: Real-time pattern debugging and match info.
- **Diff Checker**: Line-by-line text comparison.
- **Text Transformers**: Case converter, slug generator, and line sorter.
- **Duplicate Remover**: Clean up lists by removing redundant lines.
- **Word Counter**: Detailed text statistics and reading time.
- **Header Parser**: Convert raw HTTP headers to JSON.

### 🌐 Networking
- **DNS Lookup**: Multi-provider DNS record inspection.
- **Subnet Calculator**: IPv4 network planning and host range info.
- **CIDR Calculator**: Visual IP prefix management.
- **IPv6 Calculator**: Detailed IPv6 address decomposition.

### 🕒 Date & Time
- **Unix Converter**: Swap between epoch timestamps and readable dates.
- **Cron Studio**: Build and parse cron scheduling expressions.
- **ISO 8601**: Standardized UTC/Local date formatting.
- **Timezone**: Convert times across all global zones.

### 🎲 Generators
- **UUID/GUID**: Generate v1, v4, and v7 unique identifiers.
- **Random Keys**: Secure keys for encryption or API tokens.

---

## 🛠 Development

### Environment Variables
Create a `.env.local` file based on `.env.example`:

```bash
# General
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Firebase (Analytics)
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Security
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_cloudflare_key

# AI (Genkit)
GOOGLE_GENAI_API_KEY=your_gemini_api_key
```

### Installation
```bash
npm install
npm run dev
```

---

## 📄 License
This project is proprietary. All rights reserved.