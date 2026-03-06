/**
 * Utility to convert between XML and JSON strings.
 */

/**
 * Converts XML string to a JSON-compatible object.
 */
export function xmlToJson(xml: string): any {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xml, 'text/xml');
  
  const errorNode = xmlDoc.querySelector('parsererror');
  if (errorNode) {
    throw new Error('XML Parsing Error: ' + errorNode.textContent);
  }

  function parseNode(node: Node): any {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.nodeValue?.trim() || null;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return null;
    }

    const obj: any = {};
    const element = node as Element;

    // Handle attributes
    if (element.attributes.length > 0) {
      obj['@attributes'] = {};
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i];
        obj['@attributes'][attr.name] = attr.value;
      }
    }

    // Handle children
    if (element.childNodes.length > 0) {
      for (let i = 0; i < element.childNodes.length; i++) {
        const child = element.childNodes[i];
        
        if (child.nodeType === Node.ELEMENT_NODE) {
          const childName = (child as Element).tagName;
          const childValue = parseNode(child);

          if (obj[childName] === undefined) {
            obj[childName] = childValue;
          } else {
            if (!Array.isArray(obj[childName])) {
              obj[childName] = [obj[childName]];
            }
            obj[childName].push(childValue);
          }
        } else if (child.nodeType === Node.TEXT_NODE) {
          const text = child.nodeValue?.trim();
          if (text) {
            if (Object.keys(obj).length === 0) {
              return text;
            } else {
              obj['#text'] = text;
            }
          }
        }
      }
    }

    return Object.keys(obj).length === 0 ? null : obj;
  }

  const rootName = xmlDoc.documentElement.tagName;
  return { [rootName]: parseNode(xmlDoc.documentElement) };
}

/**
 * Converts a JSON object to an XML string.
 */
export function jsonToXml(obj: any, rootName: string = 'root', indentSize: number = 2): string {
  function buildXml(data: any, name: string, level: number): string {
    const indent = ' '.repeat(level * indentSize);
    
    if (data === null || data === undefined) {
      return `${indent}<${name} />`;
    }

    if (typeof data !== 'object') {
      return `${indent}<${name}>${escapeXml(String(data))}</${name}>`;
    }

    if (Array.isArray(data)) {
      return data.map(item => buildXml(item, name, level)).join('\n');
    }

    let xml = `${indent}<${name}`;
    let attributes = '';
    let children = '';
    let text = '';

    for (const key in data) {
      if (key === '@attributes') {
        for (const attr in data[key]) {
          attributes += ` ${attr}="${escapeXml(String(data[key][attr]))}"`;
        }
      } else if (key === '#text') {
        text = escapeXml(String(data[key]));
      } else {
        children += '\n' + buildXml(data[key], key, level + 1);
      }
    }

    if (!children && !text) {
      return `${indent}<${name}${attributes} />`;
    }

    if (text && !children) {
      return `${indent}<${name}${attributes}>${text}</${name}>`;
    }

    return `${indent}<${name}${attributes}>${text}${children}\n${indent}</${name}>`;
  }

  function escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&"']/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '"': return '&quot;';
        case "'": return '&apos;';
        default: return c;
      }
    });
  }

  try {
    const data = typeof obj === 'string' ? JSON.parse(obj) : obj;
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    
    // If input is an object with one key, use that as root if not specified
    const keys = Object.keys(data);
    if (keys.length === 1 && typeof data[keys[0]] === 'object' && !Array.isArray(data[keys[0]])) {
      xml += buildXml(data[keys[0]], keys[0], 0);
    } else {
      xml += buildXml(data, rootName, 0);
    }
    
    return xml;
  } catch (e: any) {
    throw new Error('JSON to XML conversion failed: ' + e.message);
  }
}
