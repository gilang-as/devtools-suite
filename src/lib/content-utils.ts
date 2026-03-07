/**
 * Content utility functions for optimal SEO and accessibility
 */

/**
 * Generate a proper heading hierarchy validator
 */
export function validateHeadingHierarchy(headings: Array<{ level: number; text: string }>) {
  const issues: string[] = [];

  if (headings.length === 0) {
    issues.push('No headings found on page');
    return issues;
  }

  // First heading should be H1
  if (headings[0].level !== 1) {
    issues.push(`First heading should be H1, found H${headings[0].level}`);
  }

  // Check for proper hierarchy progression
  for (let i = 1; i < headings.length; i++) {
    const prevLevel = headings[i - 1].level;
    const currLevel = headings[i].level;

    // Should not skip levels (e.g., H2 -> H4)
    if (currLevel - prevLevel > 1) {
      issues.push(
        `Heading hierarchy skipped: H${prevLevel} -> H${currLevel} at "${headings[i].text}"`
      );
    }
  }

  return issues;
}

/**
 * Generate meta description from content
 * Should be 150-160 characters
 */
export function generateMetaDescription(content: string, targetLength: number = 160): string {
  // Remove extra whitespace and HTML tags if any
  let cleaned = content
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Truncate to target length, respecting word boundaries
  if (cleaned.length > targetLength) {
    cleaned = cleaned.substring(0, targetLength);
    const lastSpace = cleaned.lastIndexOf(' ');
    if (lastSpace > 0) {
      cleaned = cleaned.substring(0, lastSpace);
    }
    cleaned += '...';
  }

  return cleaned;
}

/**
 * Generate keyword variations for content
 */
export function generateKeywordVariations(keyword: string): string[] {
  const variations: string[] = [keyword];

  // Add plural if not already plural
  if (!keyword.endsWith('s')) {
    variations.push(keyword + 's');
  }

  // Add quoted version
  variations.push(`"${keyword}"`);

  // Add with hyphens if spaces exist
  if (keyword.includes(' ')) {
    variations.push(keyword.replace(/\s+/g, '-'));
  }

  return variations;
}

/**
 * Calculate estimated reading time
 */
export function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Generate structured heading metadata
 */
export function generateHeadingMetadata(level: number, text: string) {
  return {
    level: `h${level}`,
    text,
    id: text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-'),
  };
}
