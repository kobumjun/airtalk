/**
 * Generate URL-safe slug from title.
 * - Spaces → hyphens
 * - Supports Korean characters (kept as-is)
 * - Removes/replaces special chars
 * - Max 80 chars for SEO
 */
export function generateSlug(title: string): string {
  if (!title || typeof title !== 'string') return '';
  let s = title.trim();
  // Replace common separators with hyphen
  s = s.replace(/[\s·\-\_]+/g, '-');
  // Remove or replace other non-URL-safe chars (keep letters, numbers, Korean, hyphens)
  s = s.replace(/[^\p{L}\p{N}\p{Hangul}\-]/gu, '');
  // Collapse multiple hyphens
  s = s.replace(/-+/g, '-').replace(/^-|-$/g, '');
  return s.slice(0, 80) || 'post';
}

/**
 * Append short suffix to ensure slug uniqueness.
 */
export function slugWithSuffix(slug: string): string {
  const shortId = Math.random().toString(36).slice(2, 8);
  return slug ? `${slug}-${shortId}` : `post-${shortId}`;
}
