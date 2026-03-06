/**
 * Utility to format and minify CSS strings.
 */

export function beautifyCss(css: string, indentSize: number = 2): string {
  try {
    if (!css.trim()) return '';
    const PADDING = ' '.repeat(indentSize);
    let formatted = '';
    let depth = 0;

    // Remove comments for simpler processing, or we can handle them
    // For now, let's preserve them by splitting carefully
    
    // Basic cleaning: remove extra whitespace around structural characters
    let cleanCss = css
      .replace(/\s*([\{\};,])\s*/g, '$1')
      .replace(/;\s*}/g, '}');

    const tokens = cleanCss.split(/([\{\}])/);
    
    for (let i = 0; i < tokens.length; i++) {
      let token = tokens[i].trim();
      if (!token) continue;

      if (token === '{') {
        formatted = formatted.trim() + ' {\n';
        depth++;
      } else if (token === '}') {
        depth--;
        formatted += ' '.repeat(depth * indentSize) + '}\n\n';
      } else {
        const rules = token.split(';');
        for (let j = 0; j < rules.length; j++) {
          const rule = rules[j].trim();
          if (!rule) continue;
          
          if (rule.includes(':') && depth > 0) {
            const colonIndex = rule.indexOf(':');
            const prop = rule.substring(0, colonIndex).trim();
            const val = rule.substring(colonIndex + 1).trim();
            formatted += ' '.repeat(depth * indentSize) + prop + ': ' + val + ';\n';
          } else {
            // Likely a selector or at-rule
            formatted += ' '.repeat(depth * indentSize) + rule + (depth > 0 ? ';\n' : '');
          }
        }
      }
    }
    return formatted.trim();
  } catch (e: any) {
    return `Error: ${e.message}`;
  }
}

export function minifyCss(css: string): string {
  try {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s*([\{\}:;,])\s*/g, '$1') // Remove spaces around structural chars
      .replace(/\s+/g, ' ') // Collapse spaces
      .trim();
  } catch (e: any) {
    return `Error: ${e.message}`;
  }
}
