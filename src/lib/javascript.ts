/**
 * Utility to format and minify JavaScript and TypeScript strings.
 * Note: This is a basic formatter. For production-grade formatting, 
 * a library like Prettier would be used.
 */

export function beautifyJs(code: string, indentSize: number = 2): string {
  try {
    if (!code.trim()) return '';
    const PADDING = ' '.repeat(indentSize);
    let formatted = '';
    let depth = 0;

    // Basic cleaning: remove extra whitespace around structural characters
    // and add newlines after braces
    let cleanCode = code
      .replace(/\s*([\{\};,])\s*/g, '$1')
      .replace(/{\s*/g, '{\n')
      .replace(/}\s*/g, '\n}\n')
      .replace(/;\s*/g, ';\n');

    const lines = cleanCode.split('\n');
    
    for (let line of lines) {
      line = line.trim();
      if (!line) continue;

      if (line.includes('}')) depth--;
      
      formatted += PADDING.repeat(Math.max(0, depth)) + line + '\n';
      
      if (line.includes('{')) depth++;
    }
    
    return formatted.trim();
  } catch (e: any) {
    return `Error: ${e.message}`;
  }
}

export function minifyJs(code: string): string {
  try {
    return code
      .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '') // Remove comments
      .replace(/\s*([\{\}:;,=\+\-\*\/\(\)\[\]])\s*/g, '$1') // Remove spaces around operators
      .replace(/\s+/g, ' ') // Collapse spaces
      .trim();
  } catch (e: any) {
    return `Error: ${e.message}`;
  }
}
