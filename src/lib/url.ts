
export function encodeUrl(str: string): string {
  try {
    return encodeURIComponent(str);
  } catch (e) {
    return 'Error: Invalid input for encoding';
  }
}

export function decodeUrl(str: string): string {
  try {
    return decodeURIComponent(str.replace(/\+/g, ' '));
  } catch (e) {
    return 'Error: Invalid URL encoded string';
  }
}

export interface ParsedUrl {
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  params: Record<string, string>;
}

export function parseUrl(urlStr: string): ParsedUrl | null {
  try {
    if (!urlStr.trim()) return null;
    
    // Add protocol if missing for URL constructor
    let absoluteUrl = urlStr.trim();
    if (!/^https?:\/\//i.test(absoluteUrl) && !/^mailto:/i.test(absoluteUrl) && !/^ftp:/i.test(absoluteUrl)) {
      absoluteUrl = 'https://' + absoluteUrl;
    }

    const url = new URL(absoluteUrl);
    const params: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
      params[key] = value;
    });

    return {
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port,
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
      params
    };
  } catch (e) {
    return null;
  }
}
