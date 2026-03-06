
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
