export function encodeBinary(str: string): string {
  try {
    if (!str) return '';
    return str
      .split('')
      .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
      .join(' ');
  } catch (e) {
    return 'Error: Invalid input for binary encoding';
  }
}

export function decodeBinary(binary: string): string {
  try {
    if (!binary.trim()) return '';
    // Remove all whitespace
    const cleanBinary = binary.replace(/\s+/g, '');
    
    // Check if it's only 0s and 1s
    if (!/^[01]+$/.test(cleanBinary)) {
      return 'Error: Input contains non-binary characters';
    }

    if (cleanBinary.length % 8 !== 0) {
      return 'Error: Binary string length must be a multiple of 8 (8 bits per character)';
    }

    let result = '';
    for (let i = 0; i < cleanBinary.length; i += 8) {
      const byte = cleanBinary.substring(i, i + 8);
      result += String.fromCharCode(parseInt(byte, 2));
    }
    return result;
  } catch (e) {
    return 'Error: Invalid binary string';
  }
}
