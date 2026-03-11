/**
 * Normalized image URL extraction for content blocks.
 * Supports: imageUrl, image_url, url, src (backward compatibility).
 */
export function getBlockImageUrl(block: Record<string, unknown>): string | null {
  const url =
    (block.imageUrl as string) ??
    (block.image_url as string) ??
    (block.url as string) ??
    (block.src as string);
  return typeof url === 'string' && url.length > 0 ? url : null;
}
