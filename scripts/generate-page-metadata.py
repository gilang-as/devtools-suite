#!/usr/bin/env python3
"""
Generate metadata exports for tool pages based on tools configuration.
This script creates or updates page.tsx files to export proper Next.js metadata.
"""

import re
import os
from pathlib import Path

# Tool metadata mappings - customize based on your tools
TOOL_METADATA = {
    # Encoding
    '/base64/encode': {
        'title': 'Base64 Encoder | DevTools Suite',
        'description': 'Encode text and files to Base64 format instantly.',
        'keywords': ['base64', 'encoder', 'encoding', 'text encoding']
    },
    '/base64/decode': {
        'title': 'Base64 Decoder | DevTools Suite',
        'description': 'Decode Base64 encoded text and files back to readable format.',
        'keywords': ['base64', 'decoder', 'decoding', 'text decoding']
    },
    '/binary/encode': {
        'title': 'Binary Encoder | DevTools Suite',
        'description': 'Convert text to binary (0s and 1s) format.',
        'keywords': ['binary', 'encoder', 'binary encoding']
    },
    '/binary/decode': {
        'title': 'Binary Decoder | DevTools Suite',
        'description': 'Convert binary code back to readable text.',
        'keywords': ['binary', 'decoder', 'binary decoding']
    },
    '/hex/encode': {
        'title': 'Hex Encoder | DevTools Suite',
        'description': 'Encode text to hexadecimal format.',
        'keywords': ['hex', 'encoder', 'hexadecimal', 'hex encoding']
    },
    '/hex/decode': {
        'title': 'Hex Decoder | DevTools Suite',
        'description': 'Decode hexadecimal to readable text.',
        'keywords': ['hex', 'decoder', 'hexadecimal', 'hex decoding']
    },
    '/url/encode': {
        'title': 'URL Encoder | DevTools Suite',
        'description': 'Encode text for safe URL transmission.',
        'keywords': ['URL encoder', 'percent encoding', 'URL encoding']
    },
    '/url/decode': {
        'title': 'URL Decoder | DevTools Suite',
        'description': 'Decode URL-encoded text.',
        'keywords': ['URL decoder', 'URL decoding', 'percent decoding']
    },
    '/url/parser': {
        'title': 'URL Parser | DevTools Suite',
        'description': 'Parse and analyze URL structure and components.',
        'keywords': ['URL parser', 'URL analyzer', 'query parameters']
    },
    '/html/encode': {
        'title': 'HTML Encoder | DevTools Suite',
        'description': 'Encode text to HTML entities.',
        'keywords': ['HTML encoder', 'HTML entities', 'HTML encoding']
    },
    '/html/decode': {
        'title': 'HTML Decoder | DevTools Suite',
        'description': 'Decode HTML entities to readable text.',
        'keywords': ['HTML decoder', 'HTML entities', 'HTML decoding']
    },
    
    # Hashing
    '/hashing/md5': {
        'title': 'MD5 Hash Generator | DevTools Suite',
        'description': 'Generate MD5 hashes from text or files.',
        'keywords': ['MD5', 'hash', 'MD5 generator', 'checksum']
    },
    '/hashing/sha1': {
        'title': 'SHA1 Hash Generator | DevTools Suite',
        'description': 'Generate SHA1 hashes from text or files.',
        'keywords': ['SHA1', 'hash', 'SHA1 generator', 'checksum']
    },
    '/hashing/sha256': {
        'title': 'SHA256 Hash Generator | DevTools Suite',
        'description': 'Generate secure SHA256 hashes from text or files.',
        'keywords': ['SHA256', 'hash', 'SHA256 generator', 'checksum']
    },
    '/hashing/sha512': {
        'title': 'SHA512 Hash Generator | DevTools Suite',
        'description': 'Generate SHA512 hashes from text or files.',
        'keywords': ['SHA512', 'hash', 'SHA512 generator', 'checksum']
    },
    '/hashing/sha3': {
        'title': 'SHA3 Hash Generator | DevTools Suite',
        'description': 'Generate SHA3 (Keccak) hashes from text.',
        'keywords': ['SHA3', 'Keccak', 'hash', 'SHA3 generator']
    },
    '/hashing/bcrypt': {
        'title': 'Bcrypt Password Hash | DevTools Suite',
        'description': 'Generate secure Bcrypt password hashes.',
        'keywords': ['bcrypt', 'password hash', 'password security']
    },
    '/hashing/argon2': {
        'title': 'Argon2 Password Hash | DevTools Suite',
        'description': 'Generate Argon2 password hashes for maximum security.',
        'keywords': ['Argon2', 'password hash', 'secure hashing']
    },
    
    # Passwords
    '/passwords/generator': {
        'title': 'Strong Password Generator | DevTools Suite',
        'description': 'Generate secure random passwords.',
        'keywords': ['password generator', 'secure password', 'random password']
    },
    '/passwords/strength': {
        'title': 'Password Strength Checker | DevTools Suite',
        'description': 'Check password strength and get security recommendations.',
        'keywords': ['password strength', 'password checker', 'security']
    },
    '/passwords/compare': {
        'title': 'Password Hash Comparison | DevTools Suite',
        'description': 'Safely compare passwords and hashes.',
        'keywords': ['password compare', 'hash comparison', 'password verify']
    },
    '/passwords/hash': {
        'title': 'Password Hasher | DevTools Suite',
        'description': 'Hash passwords securely in your browser.',
        'keywords': ['password hasher', 'password hash', 'secure hashing']
    },
    
    # DateTime
    '/datetime/unix-converter': {
        'title': 'Unix Timestamp Converter | DevTools Suite',
        'description': 'Convert between Unix timestamps and readable dates.',
        'keywords': ['Unix timestamp', 'timestamp converter', 'epoch']
    },
    '/datetime/unix-generator': {
        'title': 'Unix Timestamp Generator | DevTools Suite',
        'description': 'Generate current Unix timestamps.',
        'keywords': ['Unix timestamp', 'timestamp generator', 'epoch time']
    },
    '/datetime/cron-parser': {
        'title': 'Cron Expression Parser | DevTools Suite',
        'description': 'Parse and explain cron scheduling expressions.',
        'keywords': ['cron parser', 'cron expression', 'scheduling']
    },
    '/datetime/cron-generator': {
        'title': 'Cron Expression Generator | DevTools Suite',
        'description': 'Generate cron expressions from human-readable inputs.',
        'keywords': ['cron generator', 'cron expression', 'scheduling']
    },
    '/datetime/timezone-converter': {
        'title': 'Timezone Converter | DevTools Suite',
        'description': 'Convert times between different timezones.',
        'keywords': ['timezone converter', 'time conversion', 'UTC']
    },
    '/datetime/iso8601': {
        'title': 'ISO 8601 Formatter | DevTools Suite',
        'description': 'Format dates and times to ISO 8601 standard.',
        'keywords': ['ISO 8601', 'date formatter', 'time format']
    },
    
    # Networking
    '/networking/subnet-calculator': {
        'title': 'Subnet Calculator | DevTools Suite',
        'description': 'Calculate IPv4 subnets, host ranges, and CIDR blocks.',
        'keywords': ['subnet calculator', 'IP calculator', 'CIDR', 'IPv4']
    },
    '/networking/cidr-calculator': {
        'title': 'CIDR Calculator | DevTools Suite',
        'description': 'Calculate CIDR ranges and network masks.',
        'keywords': ['CIDR calculator', 'CIDR', 'network calculator']
    },
    '/networking/ipv6-calculator': {
        'title': 'IPv6 Calculator | DevTools Suite',
        'description': 'Calculate IPv6 subnets and address ranges.',
        'keywords': ['IPv6 calculator', 'IPv6', 'subnet calculator']
    },
    '/networking/dns-lookup': {
        'title': 'DNS Lookup Tool | DevTools Suite',
        'description': 'Perform DNS lookups and resolve domain names.',
        'keywords': ['DNS lookup', 'domain resolver', 'DNS records']
    },
    
    # Programming
    '/programming/diff-checker': {
        'title': 'Text Diff Checker | DevTools Suite',
        'description': 'Compare texts and highlight differences.',
        'keywords': ['diff checker', 'text comparison', 'diff tool']
    },
    '/programming/case-converter': {
        'title': 'Case Converter | DevTools Suite',
        'description': 'Convert text between different cases (camelCase, snake_case, etc).',
        'keywords': ['case converter', 'text case', 'string converter']
    },
    '/programming/word-counter': {
        'title': 'Word Counter | DevTools Suite',
        'description': 'Count words, characters, lines, and more in text.',
        'keywords': ['word counter', 'character counter', 'text analyzer']
    },
    '/programming/slug-generator': {
        'title': 'URL Slug Generator | DevTools Suite',
        'description': 'Generate URL-friendly slugs from text.',
        'keywords': ['slug generator', 'URL slug', 'slug creator']
    },
    '/programming/line-sorter': {
        'title': 'Line Sorter | DevTools Suite',
        'description': 'Sort lines of text alphabetically or numerically.',
        'keywords': ['line sorter', 'text sorter', 'sort lines']
    },
    '/programming/duplicate-remover': {
        'title': 'Duplicate Line Remover | DevTools Suite',
        'description': 'Remove duplicate lines from text.',
        'keywords': ['duplicate remover', 'remove duplicates', 'text cleaner']
    },
    '/programming/http-header-parser': {
        'title': 'HTTP Header Parser | DevTools Suite',
        'description': 'Parse and analyze HTTP headers.',
        'keywords': ['HTTP header', 'header parser', 'header analyzer']
    },
    
    # JSON
    '/json/formatter': {
        'title': 'JSON Formatter & Validator | DevTools Suite',
        'description': 'Format, validate, and beautify JSON data.',
        'keywords': ['JSON formatter', 'JSON validator', 'JSON beautifier']
    },
    '/json/to-csv': {
        'title': 'JSON to CSV Converter | DevTools Suite',
        'description': 'Convert JSON data to CSV format.',
        'keywords': ['JSON to CSV', 'data conversion', 'spreadsheet']
    },
    '/json/to-typescript': {
        'title': 'JSON to TypeScript Converter | DevTools Suite',
        'description': 'Generate TypeScript interfaces from JSON.',
        'keywords': ['JSON to TypeScript', 'type generation', 'TypeScript']
    },
    '/json/to-java-class': {
        'title': 'JSON to Java Converter | DevTools Suite',
        'description': 'Generate Java classes from JSON.',
        'keywords': ['JSON to Java', 'Java class generator', 'code generation']
    },
    '/json/to-golang-struct': {
        'title': 'JSON to Go Struct Converter | DevTools Suite',
        'description': 'Generate Go structs from JSON.',
        'keywords': ['JSON to Go', 'Go struct generator', 'code generation']
    },
    '/json/to-rust-struct': {
        'title': 'JSON to Rust Converter | DevTools Suite',
        'description': 'Generate Rust structs from JSON.',
        'keywords': ['JSON to Rust', 'Rust struct generator', 'code generation']
    },
    
    # Colors
    '/colors/converter': {
        'title': 'Color Converter | DevTools Suite',
        'description': 'Convert colors between HEX, RGB, HSL, and other formats.',
        'keywords': ['color converter', 'hex to RGB', 'color formats']
    },
    '/colors/palette': {
        'title': 'Color Palette Generator | DevTools Suite',
        'description': 'Generate harmonic color palettes for design.',
        'keywords': ['color palette', 'color generator', 'palette generator']
    },
    
    # UUID
    '/uuid/v1': {
        'title': 'UUID v1 Generator | DevTools Suite',
        'description': 'Generate UUID v1 (time-based) identifiers.',
        'keywords': ['UUID v1', 'UUID generator', 'unique identifier']
    },
    '/uuid/v4': {
        'title': 'UUID v4 Generator | DevTools Suite',
        'description': 'Generate UUID v4 (random) identifiers.',
        'keywords': ['UUID v4', 'UUID generator', 'GUID generator']
    },
    '/uuid/v7': {
        'title': 'UUID v7 Generator | DevTools Suite',
        'description': 'Generate UUID v7 (sortable) identifiers.',
        'keywords': ['UUID v7', 'UUID generator', 'unique identifier']
    },
    
    # Regex
    '/regex/tester': {
        'title': 'Regex Tester & Debugger | DevTools Suite',
        'description': 'Test and debug regular expressions with real-time matching.',
        'keywords': ['regex tester', 'regex debugger', 'regular expression']
    },
    '/regex/generator': {
        'title': 'Regex Generator | DevTools Suite',
        'description': 'Generate regular expressions from patterns and examples.',
        'keywords': ['regex generator', 'regex builder', 'pattern generator']
    },
    
    # Generators
    '/generators/random-key': {
        'title': 'Random Key Generator | DevTools Suite',
        'description': 'Generate random encryption keys and tokens.',
        'keywords': ['key generator', 'random key', 'encryption key']
    },
    '/generators/secure-token': {
        'title': 'Secure Token Generator | DevTools Suite',
        'description': 'Generate secure random tokens for authentication.',
        'keywords': ['token generator', 'secure token', 'auth token']
    },
    
    # Additional Hashing
    '/hashing/adler32': {
        'title': 'Adler-32 Checksum Generator | DevTools Suite',
        'description': 'Generate Adler-32 checksums for data verification.',
        'keywords': ['adler32', 'checksum', 'data integrity']
    },
    '/hashing/crc32': {
        'title': 'CRC32 Checksum Generator | DevTools Suite',
        'description': 'Generate CRC32 checksums for data verification.',
        'keywords': ['CRC32', 'checksum', 'data verification']
    },
    '/hashing/pbkdf2': {
        'title': 'PBKDF2 Password Hash | DevTools Suite',
        'description': 'Generate secure PBKDF2 password hashes.',
        'keywords': ['PBKDF2', 'password hash', 'key derivation']
    },
    '/hashing/hmac-sha1': {
        'title': 'HMAC-SHA1 Generator | DevTools Suite',
        'description': 'Generate HMAC-SHA1 message authentication codes.',
        'keywords': ['HMAC', 'SHA1', 'authentication', 'MAC']
    },
    '/hashing/hmac-sha256': {
        'title': 'HMAC-SHA256 Generator | DevTools Suite',
        'description': 'Generate HMAC-SHA256 message authentication codes.',
        'keywords': ['HMAC', 'SHA256', 'authentication', 'MAC']
    },
    '/hashing/hmac-sha512': {
        'title': 'HMAC-SHA512 Generator | DevTools Suite',
        'description': 'Generate HMAC-SHA512 message authentication codes.',
        'keywords': ['HMAC', 'SHA512', 'authentication', 'MAC']
    },
    
    # DateTime Tools
    '/datetime/unix-converter': {
        'title': 'Unix Timestamp Converter | DevTools Suite',
        'description': 'Convert between Unix timestamps and readable dates.',
        'keywords': ['unix timestamp', 'epoch converter', 'timestamp']
    },
    '/datetime/unix-generator': {
        'title': 'Unix Timestamp Generator | DevTools Suite',
        'description': 'Generate current or custom Unix timestamps.',
        'keywords': ['unix timestamp', 'epoch', 'timestamp generator']
    },
    '/datetime/cron-parser': {
        'title': 'Cron Expression Parser | DevTools Suite',
        'description': 'Parse and understand cron expressions.',
        'keywords': ['cron parser', 'cron expression', 'schedule']
    },
    '/datetime/cron-generator': {
        'title': 'Cron Expression Generator | DevTools Suite',
        'description': 'Generate cron expressions for task scheduling.',
        'keywords': ['cron generator', 'cron expression', 'schedule']
    },
    '/datetime/timezone-converter': {
        'title': 'Timezone Converter | DevTools Suite',
        'description': 'Convert times between different timezones.',
        'keywords': ['timezone converter', 'time conversion', 'UTC']
    },
    '/datetime/iso8601': {
        'title': 'ISO8601 Date Formatter | DevTools Suite',
        'description': 'Convert and format dates in ISO8601 standard.',
        'keywords': ['ISO8601', 'date format', 'ISO format']
    },
    
    # JSON Tools
    '/json/to-csv': {
        'title': 'JSON to CSV Converter | DevTools Suite',
        'description': 'Convert JSON data to CSV format.',
        'keywords': ['JSON to CSV', 'CSV converter', 'data conversion']
    },
    '/json/to-typescript': {
        'title': 'JSON to TypeScript | DevTools Suite',
        'description': 'Generate TypeScript interfaces from JSON.',
        'keywords': ['JSON to TypeScript', 'type generation', 'interface']
    },
    '/json/to-java-class': {
        'title': 'JSON to Java Class | DevTools Suite',
        'description': 'Generate Java classes from JSON schema.',
        'keywords': ['JSON to Java', 'class generator', 'POJO']
    },
    '/json/to-golang-struct': {
        'title': 'JSON to Go Struct | DevTools Suite',
        'description': 'Generate Go structs from JSON data.',
        'keywords': ['JSON to Go', 'struct generator', 'golang']
    },
    '/json/to-rust-struct': {
        'title': 'JSON to Rust Struct | DevTools Suite',
        'description': 'Generate Rust structs from JSON schema.',
        'keywords': ['JSON to Rust', 'struct generator', 'rust']
    },
    '/json/to-toml': {
        'title': 'JSON to TOML Converter | DevTools Suite',
        'description': 'Convert JSON to TOML format.',
        'keywords': ['JSON to TOML', 'TOML converter', 'config format']
    },
    '/json/to-xml': {
        'title': 'JSON to XML Converter | DevTools Suite',
        'description': 'Convert JSON to XML format.',
        'keywords': ['JSON to XML', 'XML converter', 'data format']
    },
    '/json/to-yaml': {
        'title': 'JSON to YAML Converter | DevTools Suite',
        'description': 'Convert JSON to YAML format.',
        'keywords': ['JSON to YAML', 'YAML converter', 'config format']
    },
    
    # Format Converters
    '/csv/to-json': {
        'title': 'CSV to JSON Converter | DevTools Suite',
        'description': 'Convert CSV data to JSON format.',
        'keywords': ['CSV to JSON', 'CSV converter', 'data conversion']
    },
    '/xml/formatter': {
        'title': 'XML Formatter | DevTools Suite',
        'description': 'Format and pretty-print XML documents.',
        'keywords': ['XML formatter', 'XML beautifier', 'XML editor']
    },
    '/xml/to-json': {
        'title': 'XML to JSON Converter | DevTools Suite',
        'description': 'Convert XML to JSON format.',
        'keywords': ['XML to JSON', 'JSON converter', 'data conversion']
    },
    '/yaml/to-json': {
        'title': 'YAML to JSON Converter | DevTools Suite',
        'description': 'Convert YAML to JSON format.',
        'keywords': ['YAML to JSON', 'JSON converter', 'config format']
    },
    '/toml/to-json': {
        'title': 'TOML to JSON Converter | DevTools Suite',
        'description': 'Convert TOML to JSON format.',
        'keywords': ['TOML to JSON', 'JSON converter', 'config format']
    },
    
    # Code Formatters
    '/javascript/formatter': {
        'title': 'JavaScript Formatter | DevTools Suite',
        'description': 'Format and beautify JavaScript code.',
        'keywords': ['JavaScript formatter', 'code beautifier', 'JS formatter']
    },
    '/typescript/formatter': {
        'title': 'TypeScript Formatter | DevTools Suite',
        'description': 'Format and beautify TypeScript code.',
        'keywords': ['TypeScript formatter', 'code beautifier', 'TS formatter']
    },
    '/css/formatter': {
        'title': 'CSS Formatter | DevTools Suite',
        'description': 'Format and beautify CSS stylesheets.',
        'keywords': ['CSS formatter', 'code beautifier', 'CSS minifier']
    },
    '/html/formatter': {
        'title': 'HTML Formatter | DevTools Suite',
        'description': 'Format and beautify HTML documents.',
        'keywords': ['HTML formatter', 'code beautifier', 'HTML editor']
    },
    
    # Security Tools
    '/security/jwt/decode': {
        'title': 'JWT Decoder | DevTools Suite',
        'description': 'Decode and verify JWT tokens.',
        'keywords': ['JWT decoder', 'JWT validator', 'token decoder']
    },
    '/security/jwt/encode': {
        'title': 'JWT Encoder | DevTools Suite',
        'description': 'Create and sign JWT tokens.',
        'keywords': ['JWT encoder', 'JWT creator', 'token generator']
    },
    '/security/jwt/verify': {
        'title': 'JWT Verifier | DevTools Suite',
        'description': 'Verify JWT token signatures and claims.',
        'keywords': ['JWT verify', 'token verification', 'signature check']
    },
    '/security/rsa/encrypt': {
        'title': 'RSA Encryption Tool | DevTools Suite',
        'description': 'Encrypt data using RSA public key.',
        'keywords': ['RSA encryption', 'public key', 'encryption']
    },
    '/security/rsa/decrypt': {
        'title': 'RSA Decryption Tool | DevTools Suite',
        'description': 'Decrypt data using RSA private key.',
        'keywords': ['RSA decryption', 'private key', 'decryption']
    },
    '/security/rsa/sign': {
        'title': 'RSA Signature Generator | DevTools Suite',
        'description': 'Create digital signatures with RSA.',
        'keywords': ['RSA sign', 'digital signature', 'signing']
    },
    '/security/rsa/verify': {
        'title': 'RSA Signature Verifier | DevTools Suite',
        'description': 'Verify RSA digital signatures.',
        'keywords': ['RSA verify', 'signature verification', 'verify']
    },
    '/security/aes/encrypt': {
        'title': 'AES Encryption Tool | DevTools Suite',
        'description': 'Encrypt data using AES algorithm.',
        'keywords': ['AES encryption', 'AES-256', 'symmetric encryption']
    },
    '/security/aes/decrypt': {
        'title': 'AES Decryption Tool | DevTools Suite',
        'description': 'Decrypt AES encrypted data.',
        'keywords': ['AES decryption', 'AES-256', 'symmetric decryption']
    },
    '/security/des/encrypt': {
        'title': 'DES Encryption Tool | DevTools Suite',
        'description': 'Encrypt data using DES algorithm.',
        'keywords': ['DES encryption', 'symmetric encryption']
    },
    '/security/des/decrypt': {
        'title': 'DES Decryption Tool | DevTools Suite',
        'description': 'Decrypt DES encrypted data.',
        'keywords': ['DES decryption', 'symmetric decryption']
    },
    '/security/3des/encrypt': {
        'title': 'Triple DES Encryption | DevTools Suite',
        'description': 'Encrypt data using Triple DES algorithm.',
        'keywords': ['3DES', 'triple DES', 'encryption']
    },
    '/security/3des/decrypt': {
        'title': 'Triple DES Decryption | DevTools Suite',
        'description': 'Decrypt Triple DES encrypted data.',
        'keywords': ['3DES', 'triple DES', 'decryption']
    },
    '/security/chacha20/encrypt': {
        'title': 'ChaCha20 Encryption | DevTools Suite',
        'description': 'Encrypt data using ChaCha20 cipher.',
        'keywords': ['ChaCha20', 'modern encryption', 'cipher']
    },
    '/security/chacha20/decrypt': {
        'title': 'ChaCha20 Decryption | DevTools Suite',
        'description': 'Decrypt ChaCha20 encrypted data.',
        'keywords': ['ChaCha20', 'cipher decryption', 'decrypt']
    },
    '/security/pgp/encrypt': {
        'title': 'PGP Encryption Tool | DevTools Suite',
        'description': 'Encrypt messages using PGP/OpenPGP.',
        'keywords': ['PGP encryption', 'GPG', 'public key encryption']
    },
    '/security/pgp/decrypt': {
        'title': 'PGP Decryption Tool | DevTools Suite',
        'description': 'Decrypt PGP encrypted messages.',
        'keywords': ['PGP decryption', 'GPG', 'private key decryption']
    },
    '/security/pgp/sign': {
        'title': 'PGP Signature Generator | DevTools Suite',
        'description': 'Create PGP digital signatures.',
        'keywords': ['PGP sign', 'GPG sign', 'digital signature']
    },
    '/security/pgp/verify': {
        'title': 'PGP Signature Verifier | DevTools Suite',
        'description': 'Verify PGP signatures.',
        'keywords': ['PGP verify', 'signature verification', 'GPG']
    },
    '/security/certificate/decode': {
        'title': 'SSL Certificate Decoder | DevTools Suite',
        'description': 'Decode and analyze SSL/TLS certificates.',
        'keywords': ['certificate decoder', 'SSL cert', 'X.509']
    },
    '/security/csr/decode': {
        'title': 'CSR Decoder | DevTools Suite',
        'description': 'Decode and analyze Certificate Signing Requests.',
        'keywords': ['CSR decoder', 'certificate request', 'signing request']
    },
    '/security/pem-der-converter': {
        'title': 'PEM/DER Converter | DevTools Suite',
        'description': 'Convert certificates between PEM and DER formats.',
        'keywords': ['PEM converter', 'DER converter', 'certificate format']
    },
    '/security/asn1': {
        'title': 'ASN.1 Decoder | DevTools Suite',
        'description': 'Decode and analyze ASN.1 structures.',
        'keywords': ['ASN.1 decoder', 'DER parser', 'structure analysis']
    },
    '/security/x509': {
        'title': 'X.509 Certificate Analyzer | DevTools Suite',
        'description': 'Analyze X.509 certificate contents.',
        'keywords': ['X.509', 'certificate analyzer', 'cert info']
    },
    '/security/spki': {
        'title': 'SPKI Key Decoder | DevTools Suite',
        'description': 'Decode SubjectPublicKeyInfo structures.',
        'keywords': ['SPKI', 'public key', 'key format']
    },
    '/security/ecc': {
        'title': 'ECC Key Generator | DevTools Suite',
        'description': 'Generate Elliptic Curve Cryptography keys.',
        'keywords': ['ECC', 'elliptic curve', 'key generator']
    },
    '/security/ecc/sign': {
        'title': 'ECC Signature Generator | DevTools Suite',
        'description': 'Create signatures using ECC keys.',
        'keywords': ['ECC sign', 'elliptic curve', 'signature']
    },
    '/security/ecc/verify': {
        'title': 'ECC Signature Verifier | DevTools Suite',
        'description': 'Verify ECC digital signatures.',
        'keywords': ['ECC verify', 'signature verification', 'elliptic curve']
    },
    '/security/openpgp': {
        'title': 'OpenPGP Tool | DevTools Suite',
        'description': 'Work with OpenPGP keys and messages.',
        'keywords': ['OpenPGP', 'PGP', 'GPG', 'encryption']
    },
    '/security/jose': {
        'title': 'JOSE Tool | DevTools Suite',
        'description': 'Work with JSON Object Signing and Encryption.',
        'keywords': ['JOSE', 'JWT', 'JWE', 'cryptography']
    },
    '/security/cose': {
        'title': 'COSE Tool | DevTools Suite',
        'description': 'Work with CBOR Object Signing and Encryption.',
        'keywords': ['COSE', 'CBOR', 'signing', 'encryption']
    },
    
    # PKCS Tools
    '/pkcs/p1': {
        'title': 'PKCS#1 RSA Key Tool | DevTools Suite',
        'description': 'Work with PKCS#1 RSA private keys.',
        'keywords': ['PKCS#1', 'RSA', 'private key']
    },
    '/pkcs/p7': {
        'title': 'PKCS#7 Tool | DevTools Suite',
        'description': 'Work with PKCS#7 cryptographic message syntax.',
        'keywords': ['PKCS#7', 'CMS', 'signed data']
    },
    '/pkcs/p8': {
        'title': 'PKCS#8 Key Tool | DevTools Suite',
        'description': 'Work with PKCS#8 private keys.',
        'keywords': ['PKCS#8', 'private key', 'key format']
    },
    '/pkcs/p10': {
        'title': 'PKCS#10 CSR Tool | DevTools Suite',
        'description': 'Work with PKCS#10 certificate requests.',
        'keywords': ['PKCS#10', 'CSR', 'certificate request']
    },
    '/pkcs/p12': {
        'title': 'PKCS#12 Certificate Tool | DevTools Suite',
        'description': 'Work with PKCS#12 certificate bundles.',
        'keywords': ['PKCS#12', 'PFX', 'certificate bundle']
    },
    '/pkcs/x509': {
        'title': 'X.509 Certificate Generator | DevTools Suite',
        'description': 'Generate and analyze X.509 certificates.',
        'keywords': ['X.509', 'certificate', 'PKI']
    },
    
    # Obfuscation Tools
    '/obfuscation/rot13': {
        'title': 'ROT13 Encoder/Decoder | DevTools Suite',
        'description': 'Encode and decode ROT13 text obfuscation.',
        'keywords': ['ROT13', 'text obfuscation', 'cipher']
    },
    '/obfuscation/text': {
        'title': 'Text Obfuscation Tool | DevTools Suite',
        'description': 'Obfuscate and de-obfuscate text.',
        'keywords': ['obfuscation', 'text hiding', 'encoding']
    },
    '/obfuscation/javascript': {
        'title': 'JavaScript Obfuscator | DevTools Suite',
        'description': 'Obfuscate and minify JavaScript code.',
        'keywords': ['JavaScript obfuscator', 'code obfuscation', 'minifier']
    },
    
    # Utilities
    '/guid': {
        'title': 'GUID Generator | DevTools Suite',
        'description': 'Generate Globally Unique Identifiers (GUID).',
        'keywords': ['GUID', 'UUID', 'identifier generator']
    },
    '/cookies': {
        'title': 'Cookie Parser & Generator | DevTools Suite',
        'description': 'Parse and generate HTTP cookies.',
        'keywords': ['cookie parser', 'cookie generator', 'HTTP headers']
    },
}

def should_add_metadata(page_content: str) -> bool:
    """Check if the page already has metadata export"""
    return 'export const metadata' not in page_content and 'export async function generateMetadata' not in page_content

def get_import_statement() -> str:
    """Get the import statement for generateMetadata"""
    return "import { generateMetadata } from '@/lib/seo';\n"

def get_metadata_export(path: str, title: str, description: str, keywords: list) -> str:
    """Generate metadata export code"""
    keywords_str = ', '.join(f"'{kw}'" for kw in keywords)
    return f"""
export const metadata = generateMetadata({{
  title: '{title}',
  description: '{description}',
  path: '{path}',
  keywords: [{keywords_str}],
}});
"""

def process_page(file_path: str, tool_path: str, metadata_info: dict) -> bool:
    """Process a single page file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if not should_add_metadata(content):
            print(f"⏭  Skipping {file_path} (already has metadata)")
            return False
        
        # Check if it's a client component
        is_client = '"use client"' in content
        
        # Find where to insert the import
        lines = content.split('\n')
        insert_index = 0
        
        if is_client:
            # After "use client"
            insert_index = 1
        
        # Add import
        if get_import_statement() not in content:
            lines.insert(insert_index, get_import_statement().strip())
        
        # Add metadata export after imports but before component
        import_end = insert_index + 1
        for i in range(insert_index + 1, len(lines)):
            if lines[i].startswith('import ') or lines[i].startswith('export '):
                import_end = i + 1
            elif lines[i].strip() and not lines[i].startswith('//'):
                break
        
        metadata_export = get_metadata_export(
            tool_path,
            metadata_info['title'],
            metadata_info['description'],
            metadata_info['keywords']
        )
        
        lines.insert(import_end, metadata_export)
        
        new_content = '\n'.join(lines)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"✅ Updated {file_path}")
        return True
    except Exception as e:
        print(f"❌ Error processing {file_path}: {e}")
        return False

def main():
    """Main function to process all tool pages"""
    base_path = Path('/vercel/share/v0-project/src/app')
    updated_count = 0
    
    for tool_path, metadata_info in TOOL_METADATA.items():
        # Convert path like /base64/encode to file path src/app/base64/encode/page.tsx
        page_path = base_path / tool_path.lstrip('/') / 'page.tsx'
        
        if page_path.exists():
            if process_page(str(page_path), tool_path, metadata_info):
                updated_count += 1
        else:
            print(f"⚠️  File not found: {page_path}")
    
    print(f"\n✨ Updated {updated_count} pages with metadata")

if __name__ == '__main__':
    main()
