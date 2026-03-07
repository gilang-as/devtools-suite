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
