import { TOOLS } from '@/tools/config';

export interface RelatedTool {
  name: string;
  description: string;
  href: string;
  icon?: string;
}

/**
 * Get related tools based on category and tags
 */
export function getRelatedTools(
  currentToolHref: string,
  limit: number = 3,
  options?: {
    sameCategory?: boolean;
    sameTags?: boolean;
  }
): RelatedTool[] {
  const currentTool = TOOLS.find((tool) => tool.href === currentToolHref);
  if (!currentTool) return [];

  const sameCategory = options?.sameCategory !== false;
  const sameTags = options?.sameTags !== false;

  const related = TOOLS.filter((tool) => {
    // Exclude current tool
    if (tool.href === currentToolHref) return false;

    // Filter by category or tags
    if (sameCategory && tool.category === currentTool.category) return true;
    if (sameTags && currentTool.tags && tool.tags) {
      return currentTool.tags.some((tag) => tool.tags?.includes(tag));
    }

    return false;
  })
    .slice(0, limit)
    .map((tool) => ({
      name: tool.name,
      description: tool.description,
      href: tool.href,
      icon: tool.icon,
    }));

  return related;
}

/**
 * Get random tools (for "Browse More" sections)
 */
export function getRandomTools(limit: number = 6, excludeHrefs?: string[]): RelatedTool[] {
  const filtered = TOOLS.filter((tool) => !excludeHrefs?.includes(tool.href));
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);

  return shuffled.slice(0, limit).map((tool) => ({
    name: tool.name,
    description: tool.description,
    href: tool.href,
    icon: tool.icon,
  }));
}

/**
 * Get tools by category
 */
export function getToolsByCategory(category: string): RelatedTool[] {
  return TOOLS.filter((tool) => tool.category === category)
    .map((tool) => ({
      name: tool.name,
      description: tool.description,
      href: tool.href,
      icon: tool.icon,
    }));
}
