
export function encodeBase64(str: string): string {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch (e) {
    return 'Error: Invalid input for encoding';
  }
}

export function decodeBase64(str: string): string {
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch (e) {
    return 'Error: Invalid Base64 string';
  }
}
