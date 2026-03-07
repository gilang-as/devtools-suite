#!/usr/bin/env python3
"""
Scan all page.tsx files and add metadata exports based on tool path.
"""

import os
import re
from pathlib import Path

# Extended metadata mapping
METADATA_MAP = {
    'base64/encode': ('Base64 Encoder', 'Encode text and files to Base64 format instantly.', ['base64', 'encoder', 'encoding']),
    'base64/decode': ('Base64 Decoder', 'Decode Base64 encoded text back to readable format.', ['base64', 'decoder', 'decoding']),
    'binary/encode': ('Binary Encoder', 'Convert text to binary (0s and 1s) format.', ['binary', 'encoder', 'binary encoding']),
    'binary/decode': ('Binary Decoder', 'Convert binary code back to readable text.', ['binary', 'decoder', 'binary decoding']),
    'hex/encode': ('Hex Encoder', 'Encode text to hexadecimal format.', ['hex', 'encoder', 'hexadecimal']),
    'hex/decode': ('Hex Decoder', 'Decode hexadecimal to readable text.', ['hex', 'decoder', 'hexadecimal']),
    'url/encode': ('URL Encoder', 'Encode text for safe URL transmission.', ['URL encoder', 'percent encoding']),
    'url/decode': ('URL Decoder', 'Decode URL-encoded text.', ['URL decoder', 'URL decoding']),
    'url/parser': ('URL Parser', 'Parse and analyze URL structure and components.', ['URL parser', 'URL analyzer']),
    'html/encode': ('HTML Encoder', 'Encode text to HTML entities.', ['HTML encoder', 'HTML entities']),
    'html/decode': ('HTML Decoder', 'Decode HTML entities to readable text.', ['HTML decoder', 'HTML entities']),
    'html/formatter': ('HTML Formatter', 'Format and beautify HTML documents.', ['HTML formatter', 'code beautifier']),
    
    'hashing/md5': ('MD5 Hash Generator', 'Generate MD5 hashes from text or files.', ['MD5', 'hash', 'checksum']),
    'hashing/sha1': ('SHA1 Hash Generator', 'Generate SHA1 hashes from text or files.', ['SHA1', 'hash', 'checksum']),
    'hashing/sha256': ('SHA256 Hash Generator', 'Generate secure SHA256 hashes from text or files.', ['SHA256', 'hash', 'checksum']),
    'hashing/sha512': ('SHA512 Hash Generator', 'Generate SHA512 hashes from text or files.', ['SHA512', 'hash', 'checksum']),
    'hashing/sha3': ('SHA3 Hash Generator', 'Generate SHA3 (Keccak) hashes from text.', ['SHA3', 'Keccak', 'hash']),
    'hashing/bcrypt': ('Bcrypt Password Hash', 'Generate secure Bcrypt password hashes.', ['bcrypt', 'password hash']),
    'hashing/argon2': ('Argon2 Password Hash', 'Generate secure Argon2 password hashes.', ['Argon2', 'password hash']),
    'hashing/adler32': ('Adler-32 Checksum', 'Generate Adler-32 checksums for data verification.', ['adler32', 'checksum']),
    'hashing/crc32': ('CRC32 Checksum', 'Generate CRC32 checksums for data verification.', ['CRC32', 'checksum']),
    'hashing/pbkdf2': ('PBKDF2 Hash', 'Generate secure PBKDF2 password hashes.', ['PBKDF2', 'password hash']),
    'hashing/hmac-sha1': ('HMAC-SHA1 Generator', 'Generate HMAC-SHA1 message authentication codes.', ['HMAC', 'SHA1', 'MAC']),
    'hashing/hmac-sha256': ('HMAC-SHA256 Generator', 'Generate HMAC-SHA256 message authentication codes.', ['HMAC', 'SHA256', 'MAC']),
    'hashing/hmac-sha512': ('HMAC-SHA512 Generator', 'Generate HMAC-SHA512 message authentication codes.', ['HMAC', 'SHA512', 'MAC']),
    
    'passwords/generator': ('Password Generator', 'Generate strong and secure passwords.', ['password generator', 'secure password']),
    'passwords/strength': ('Password Strength Checker', 'Check password strength and security.', ['password strength', 'password checker']),
    'passwords/compare': ('Password Hash Comparer', 'Compare passwords against hashes securely.', ['password compare', 'hash verification']),
    'passwords/hash': ('Password Hasher', 'Hash passwords securely using various algorithms.', ['password hasher', 'password hashing']),
    
    'datetime/unix-converter': ('Unix Timestamp Converter', 'Convert between Unix timestamps and readable dates.', ['unix timestamp', 'epoch converter']),
    'datetime/unix-generator': ('Unix Timestamp Generator', 'Generate current or custom Unix timestamps.', ['unix timestamp', 'timestamp generator']),
    'datetime/cron-parser': ('Cron Expression Parser', 'Parse and understand cron expressions.', ['cron parser', 'cron expression']),
    'datetime/cron-generator': ('Cron Expression Generator', 'Generate cron expressions for task scheduling.', ['cron generator', 'cron expression']),
    'datetime/timezone-converter': ('Timezone Converter', 'Convert times between different timezones.', ['timezone converter', 'time conversion']),
    'datetime/iso8601': ('ISO8601 Date Formatter', 'Convert and format dates in ISO8601 standard.', ['ISO8601', 'date format']),
    
    'networking/subnet-calculator': ('Subnet Calculator', 'Calculate IPv4 subnets and CIDR ranges.', ['subnet calculator', 'CIDR', 'IP calculator']),
    'networking/cidr-calculator': ('CIDR Calculator', 'Calculate CIDR ranges and subnet masks.', ['CIDR calculator', 'IP CIDR', 'network mask']),
    'networking/ipv6-calculator': ('IPv6 Calculator', 'Calculate IPv6 addresses and subnets.', ['IPv6 calculator', 'IPv6 subnets']),
    'networking/dns-lookup': ('DNS Lookup Tool', 'Perform DNS lookups and resolve domain names.', ['DNS lookup', 'domain lookup', 'IP lookup']),
    
    'programming/diff-checker': ('Diff Checker', 'Compare and highlight differences between texts.', ['diff checker', 'text compare']),
    'programming/case-converter': ('Case Converter', 'Convert text between different cases.', ['case converter', 'text case']),
    'programming/word-counter': ('Word Counter', 'Count words, characters, and lines in text.', ['word counter', 'character counter']),
    'programming/slug-generator': ('URL Slug Generator', 'Generate URL-friendly slugs from text.', ['slug generator', 'URL slug']),
    'programming/line-sorter': ('Line Sorter', 'Sort lines alphabetically or reverse.', ['line sorter', 'sort lines']),
    'programming/duplicate-remover': ('Duplicate Remover', 'Remove duplicate lines or words from text.', ['duplicate remover', 'duplicate lines']),
    'programming/http-header-parser': ('HTTP Header Parser', 'Parse and analyze HTTP headers.', ['HTTP header', 'header parser']),
    
    'json/formatter': ('JSON Formatter', 'Format and validate JSON data.', ['JSON formatter', 'JSON validator']),
    'json/to-csv': ('JSON to CSV', 'Convert JSON data to CSV format.', ['JSON to CSV', 'CSV converter']),
    'json/to-typescript': ('JSON to TypeScript', 'Generate TypeScript interfaces from JSON.', ['JSON to TypeScript', 'type generation']),
    'json/to-java-class': ('JSON to Java', 'Generate Java classes from JSON schema.', ['JSON to Java', 'class generator']),
    'json/to-golang-struct': ('JSON to Go Struct', 'Generate Go structs from JSON data.', ['JSON to Go', 'struct generator']),
    'json/to-rust-struct': ('JSON to Rust Struct', 'Generate Rust structs from JSON schema.', ['JSON to Rust', 'struct generator']),
    'json/to-toml': ('JSON to TOML', 'Convert JSON to TOML format.', ['JSON to TOML', 'TOML converter']),
    'json/to-xml': ('JSON to XML', 'Convert JSON to XML format.', ['JSON to XML', 'XML converter']),
    'json/to-yaml': ('JSON to YAML', 'Convert JSON to YAML format.', ['JSON to YAML', 'YAML converter']),
    
    'csv/to-json': ('CSV to JSON', 'Convert CSV data to JSON format.', ['CSV to JSON', 'JSON converter']),
    'xml/formatter': ('XML Formatter', 'Format and pretty-print XML documents.', ['XML formatter', 'code beautifier']),
    'xml/to-json': ('XML to JSON', 'Convert XML to JSON format.', ['XML to JSON', 'JSON converter']),
    'yaml/to-json': ('YAML to JSON', 'Convert YAML to JSON format.', ['YAML to JSON', 'JSON converter']),
    'toml/to-json': ('TOML to JSON', 'Convert TOML to JSON format.', ['TOML to JSON', 'JSON converter']),
    
    'javascript/formatter': ('JavaScript Formatter', 'Format and beautify JavaScript code.', ['JavaScript formatter', 'code beautifier']),
    'typescript/formatter': ('TypeScript Formatter', 'Format and beautify TypeScript code.', ['TypeScript formatter', 'code beautifier']),
    'css/formatter': ('CSS Formatter', 'Format and beautify CSS stylesheets.', ['CSS formatter', 'code beautifier']),
    
    'colors/converter': ('Color Converter', 'Convert colors between HEX, RGB, HSL formats.', ['color converter', 'hex to RGB']),
    'colors/palette': ('Color Palette Generator', 'Generate harmonic color palettes for design.', ['color palette', 'color generator']),
    
    'uuid/v1': ('UUID v1 Generator', 'Generate UUID v1 (time-based) identifiers.', ['UUID v1', 'UUID generator']),
    'uuid/v4': ('UUID v4 Generator', 'Generate UUID v4 (random) identifiers.', ['UUID v4', 'UUID generator']),
    'uuid/v7': ('UUID v7 Generator', 'Generate UUID v7 (sortable) identifiers.', ['UUID v7', 'UUID generator']),
    
    'regex/tester': ('Regex Tester & Debugger', 'Test and debug regular expressions with real-time matching.', ['regex tester', 'regex debugger']),
    'regex/generator': ('Regex Generator', 'Generate regular expressions from patterns.', ['regex generator', 'regex builder']),
    
    'generators/random-key': ('Random Key Generator', 'Generate random encryption keys and tokens.', ['key generator', 'random key']),
    'generators/secure-token': ('Secure Token Generator', 'Generate secure random tokens for authentication.', ['token generator', 'secure token']),
    
    'security/jwt/decode': ('JWT Decoder', 'Decode and verify JWT tokens.', ['JWT decoder', 'JWT validator']),
    'security/jwt/encode': ('JWT Encoder', 'Create and sign JWT tokens.', ['JWT encoder', 'JWT creator']),
    'security/jwt/verify': ('JWT Verifier', 'Verify JWT token signatures and claims.', ['JWT verify', 'token verification']),
    'security/jwt': ('JWT Tool', 'Work with JSON Web Tokens.', ['JWT', 'token', 'authentication']),
    
    'security/rsa/encrypt': ('RSA Encryption', 'Encrypt data using RSA public key.', ['RSA encryption', 'public key']),
    'security/rsa/decrypt': ('RSA Decryption', 'Decrypt data using RSA private key.', ['RSA decryption', 'private key']),
    'security/rsa/sign': ('RSA Signature Generator', 'Create digital signatures with RSA.', ['RSA sign', 'digital signature']),
    'security/rsa/verify': ('RSA Signature Verifier', 'Verify RSA digital signatures.', ['RSA verify', 'signature verification']),
    'security/rsa': ('RSA Tool', 'Work with RSA keys and cryptography.', ['RSA', 'encryption', 'asymmetric']),
    
    'security/aes/encrypt': ('AES Encryption', 'Encrypt data using AES algorithm.', ['AES encryption', 'AES-256']),
    'security/aes/decrypt': ('AES Decryption', 'Decrypt AES encrypted data.', ['AES decryption', 'AES-256']),
    
    'security/des/encrypt': ('DES Encryption', 'Encrypt data using DES algorithm.', ['DES encryption', 'symmetric encryption']),
    'security/des/decrypt': ('DES Decryption', 'Decrypt DES encrypted data.', ['DES decryption', 'symmetric decryption']),
    
    'security/3des/encrypt': ('Triple DES Encryption', 'Encrypt data using Triple DES algorithm.', ['3DES', 'triple DES']),
    'security/3des/decrypt': ('Triple DES Decryption', 'Decrypt Triple DES encrypted data.', ['3DES', 'triple DES']),
    
    'security/chacha20/encrypt': ('ChaCha20 Encryption', 'Encrypt data using ChaCha20 cipher.', ['ChaCha20', 'modern encryption']),
    'security/chacha20/decrypt': ('ChaCha20 Decryption', 'Decrypt ChaCha20 encrypted data.', ['ChaCha20', 'cipher decryption']),
    
    'security/pgp/encrypt': ('PGP Encryption', 'Encrypt messages using PGP/OpenPGP.', ['PGP encryption', 'GPG']),
    'security/pgp/decrypt': ('PGP Decryption', 'Decrypt PGP encrypted messages.', ['PGP decryption', 'GPG']),
    'security/pgp/sign': ('PGP Signature Generator', 'Create PGP digital signatures.', ['PGP sign', 'GPG sign']),
    'security/pgp/verify': ('PGP Signature Verifier', 'Verify PGP signatures.', ['PGP verify', 'signature verification']),
    'security/pgp': ('PGP Tool', 'Work with PGP encryption and signing.', ['PGP', 'GPG', 'encryption']),
    
    'security/certificate/decode': ('SSL Certificate Decoder', 'Decode and analyze SSL/TLS certificates.', ['certificate decoder', 'SSL cert']),
    'security/csr/decode': ('CSR Decoder', 'Decode and analyze Certificate Signing Requests.', ['CSR decoder', 'certificate request']),
    'security/pem-der-converter': ('PEM/DER Converter', 'Convert certificates between PEM and DER formats.', ['PEM converter', 'DER converter']),
    'security/asn1': ('ASN.1 Decoder', 'Decode and analyze ASN.1 structures.', ['ASN.1 decoder', 'DER parser']),
    'security/x509': ('X.509 Certificate Analyzer', 'Analyze X.509 certificate contents.', ['X.509', 'certificate analyzer']),
    'security/spki': ('SPKI Key Decoder', 'Decode SubjectPublicKeyInfo structures.', ['SPKI', 'public key']),
    
    'security/ecc': ('ECC Key Generator', 'Generate Elliptic Curve Cryptography keys.', ['ECC', 'elliptic curve']),
    'security/ecc/sign': ('ECC Signature Generator', 'Create signatures using ECC keys.', ['ECC sign', 'elliptic curve']),
    'security/ecc/verify': ('ECC Signature Verifier', 'Verify ECC digital signatures.', ['ECC verify', 'signature verification']),
    
    'security/openpgp': ('OpenPGP Tool', 'Work with OpenPGP keys and messages.', ['OpenPGP', 'PGP', 'GPG']),
    'security/jose': ('JOSE Tool', 'Work with JSON Object Signing and Encryption.', ['JOSE', 'JWT', 'JWE']),
    'security/cose': ('COSE Tool', 'Work with CBOR Object Signing and Encryption.', ['COSE', 'CBOR', 'signing']),
    
    'pkcs/p1': ('PKCS#1 RSA Key Tool', 'Work with PKCS#1 RSA private keys.', ['PKCS#1', 'RSA', 'private key']),
    'pkcs/p7': ('PKCS#7 Tool', 'Work with PKCS#7 cryptographic message syntax.', ['PKCS#7', 'CMS', 'signed data']),
    'pkcs/p8': ('PKCS#8 Key Tool', 'Work with PKCS#8 private keys.', ['PKCS#8', 'private key']),
    'pkcs/p10': ('PKCS#10 CSR Tool', 'Work with PKCS#10 certificate requests.', ['PKCS#10', 'CSR']),
    'pkcs/p12': ('PKCS#12 Certificate Tool', 'Work with PKCS#12 certificate bundles.', ['PKCS#12', 'PFX']),
    'pkcs/x509': ('X.509 Certificate Generator', 'Generate and analyze X.509 certificates.', ['X.509', 'certificate', 'PKI']),
    
    'obfuscation/rot13': ('ROT13 Encoder/Decoder', 'Encode and decode ROT13 text obfuscation.', ['ROT13', 'text obfuscation']),
    'obfuscation/text': ('Text Obfuscation Tool', 'Obfuscate and de-obfuscate text.', ['obfuscation', 'text hiding']),
    'obfuscation/javascript': ('JavaScript Obfuscator', 'Obfuscate and minify JavaScript code.', ['JavaScript obfuscator', 'code obfuscation']),
    
    'guid': ('GUID Generator', 'Generate Globally Unique Identifiers.', ['GUID', 'UUID', 'identifier']),
    'cookies': ('Cookie Parser & Generator', 'Parse and generate HTTP cookies.', ['cookie parser', 'cookie generator']),
}

def should_add_metadata(content: str) -> bool:
    """Check if the page already has metadata export"""
    return 'export const metadata' not in content and 'export async function generateMetadata' not in content

def create_metadata_export(path: str, title: str, description: str, keywords: list) -> str:
    """Create a metadata export snippet"""
    keywords_str = ', '.join(f"'{kw}'" for kw in keywords)
    return f"""
export const metadata = generateMetadata({{
  title: '{title} | DevTools Suite',
  description: '{description}',
  path: '{path}',
  keywords: [{keywords_str}],
}});
"""

def process_page_file(file_path: str) -> bool:
    """Process a single page file"""
    try:
        # Get relative path from app directory
        parts = file_path.replace('\\', '/').split('/')
        app_index = parts.index('app')
        relative_path = '/'.join(parts[app_index + 1:-1])  # Exclude 'app' and 'page.tsx'
        
        # Find metadata for this path
        if relative_path not in METADATA_MAP:
            return False
        
        title, desc, keywords = METADATA_MAP[relative_path]
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if not should_add_metadata(content):
            return False
        
        # Check if it's a client component
        is_client = '"use client"' in content
        
        # Find the position to insert import
        lines = content.split('\n')
        insert_pos = 0
        
        if is_client:
            insert_pos = 1
        
        # Insert import if not present
        import_stmt = "import { generateMetadata } from '@/lib/seo';"
        has_import = any(import_stmt in line for line in lines)
        
        if not has_import:
            lines.insert(insert_pos, import_stmt)
            insert_pos += 1
        
        # Find where to insert metadata (after all imports)
        insert_pos = insert_pos
        for i in range(insert_pos, len(lines)):
            if not lines[i].startswith('import ') and lines[i].strip():
                insert_pos = i
                break
        
        # Create and insert metadata
        metadata_code = create_metadata_export(f'/{relative_path}', title, desc, keywords)
        lines.insert(insert_pos, metadata_code.strip())
        
        new_content = '\n'.join(lines)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f'✅ {relative_path}')
        return True
    except Exception as e:
        print(f'❌ {file_path}: {str(e)[:50]}')
        return False

def main():
    """Scan and update all page.tsx files"""
    base_dir = Path('/vercel/share/v0-project/src/app')
    updated = 0
    
    # Find all page.tsx files
    for page_file in base_dir.rglob('page.tsx'):
        if process_page_file(str(page_file)):
            updated += 1
    
    print(f'\n✨ Updated {updated} pages with metadata exports')

if __name__ == '__main__':
    main()
