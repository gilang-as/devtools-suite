
export function encodeHtml(str: string): string {
  if (typeof window === 'undefined') return str;
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function decodeHtml(str: string): string {
  if (typeof window === 'undefined') return str;
  const div = document.createElement('div');
  div.innerHTML = str;
  return div.textContent || '';
}
