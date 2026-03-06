/**
 * Utility to format and minify HTML strings.
 */

export function beautifyHtml(html: string, indentSize: number = 2): string {
  try {
    if (!html.trim()) return '';
    
    // Simple HTML formatter using DOMParser to rebuild the structure
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Helper to recursively format nodes
    const formatNode = (node: Node, level: number): string => {
      const indent = ' '.repeat(level * indentSize);
      
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.nodeValue?.trim();
        return text ? indent + text + '\n' : '';
      }
      
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as Element;
        const tagName = el.tagName.toLowerCase();
        
        // Skip script/style content beautification for simplicity, or handle if needed
        let attributes = '';
        for (let i = 0; i < el.attributes.length; i++) {
          const attr = el.attributes[i];
          attributes += ` ${attr.name}="${attr.value}"`;
        }
        
        const openTag = `${indent}<${tagName}${attributes}>`;
        
        if (el.childNodes.length === 0) {
          // Self-closing or empty
          const selfClosingTags = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
          if (selfClosingTags.includes(tagName)) {
            return `${indent}<${tagName}${attributes}>\n`;
          }
          return `${openTag}</${tagName}>\n`;
        }
        
        let childrenHtml = '';
        for (let i = 0; i < el.childNodes.length; i++) {
          childrenHtml += formatNode(el.childNodes[i], level + 1);
        }
        
        return `${openTag}\n${childrenHtml}${indent}</${tagName}>\n`;
      }
      
      return '';
    };

    // We use innerHTML of body or head depending on what the user pasted
    // If it's a full document, we start from <html>
    let result = '';
    const hasHtmlTag = /<html/i.test(html);
    
    if (hasHtmlTag) {
      result = formatNode(doc.documentElement, 0);
    } else {
      // Just format the contents of body
      for (let i = 0; i < doc.body.childNodes.length; i++) {
        result += formatNode(doc.body.childNodes[i], 0);
      }
    }

    return result.trim();
  } catch (e: any) {
    return `Error: ${e.message}`;
  }
}

export function minifyHtml(html: string): string {
  try {
    return html
      .replace(/>\s+</g, '><') // Remove space between tags
      .replace(/\s{2,}/g, ' ') // Collapse multiple spaces
      .replace(/(\r\n|\n|\r)/gm, '') // Remove newlines
      .trim();
  } catch (e: any) {
    return `Error: ${e.message}`;
  }
}
