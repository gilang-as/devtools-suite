/**
 * Utility for advanced text and programming operations.
 */

/**
 * Sorts lines in a string block.
 */
export function sortLines(text: string, order: 'asc' | 'desc' = 'asc'): string {
  if (!text.trim()) return '';
  const lines = text.split(/\r?\n/);
  const sorted = [...lines].sort((a, b) => {
    return order === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
  });
  return sorted.join('\n');
}

/**
 * Removes duplicate lines while preserving the order of the first occurrence.
 */
export function removeDuplicateLines(text: string): { result: string; count: number } {
  if (!text.trim()) return { result: '', count: 0 };
  const lines = text.split(/\r?\n/);
  const unique = Array.from(new Set(lines));
  return {
    result: unique.join('\n'),
    count: lines.length - unique.length
  };
}

/**
 * Parses raw HTTP headers into a JSON object.
 */
export function parseHttpHeaders(text: string): Record<string, string> {
  if (!text.trim()) return {};
  const lines = text.split(/\r?\n/);
  const headers: Record<string, string> = {};
  
  lines.forEach(line => {
    // Matches "Key: Value" pattern
    const match = line.match(/^([^:]+):\s*(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      if (key) {
        headers[key] = value;
      }
    }
  });
  
  return headers;
}
