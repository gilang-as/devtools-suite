/**
 * Utility to format and minify XML strings.
 */

export function beautifyXml(xml: string, indentSize: number = 2): string {
  try {
    if (!xml.trim()) return '';
    
    let formatted = '';
    const reg = /(>)(<)(\/*)/g;
    xml = xml.replace(reg, '$1\r\n$2$3');
    let pad = 0;
    const PADDING = ' '.repeat(indentSize);

    xml.split('\r\n').forEach((node) => {
      let indent = 0;
      if (node.match(/.+<\/\w[^>]*>$/)) {
        indent = 0;
      } else if (node.match(/^<\/\w/)) {
        if (pad !== 0) pad -= 1;
      } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
        indent = 1;
      } else {
        indent = 0;
      }

      formatted += PADDING.repeat(pad) + node + '\r\n';
      pad += indent;
    });

    return formatted.trim();
  } catch (e: any) {
    return `Error: ${e.message}`;
  }
}

export function minifyXml(xml: string): string {
  try {
    return xml
      .replace(/>\s+</g, '><')
      .replace(/\s{2,}/g, ' ')
      .replace(/(\r\n|\n|\r)/gm, '')
      .trim();
  } catch (e: any) {
    return `Error: ${e.message}`;
  }
}
