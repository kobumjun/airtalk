import { getBlockImageUrl } from '@/lib/block-utils';
import type { PostRow, ContentBlock } from '@/types/database';

export function getPostPreviewText(post: PostRow, maxLen: number): string {
  if (post.content_blocks && post.content_blocks.length > 0) {
    const first = post.content_blocks.find((b) => b.type === 'text');
    if (first && first.type === 'text' && first.content) {
      const t = first.content.replace(/\s+/g, ' ').trim();
      return t.length <= maxLen ? t : t.slice(0, maxLen) + '…';
    }
  }
  const t = (post.content || '').replace(/\s+/g, ' ').trim();
  return t.length <= maxLen ? t : t.slice(0, maxLen) + '…';
}

export function getPostThumbnail(post: PostRow): string | null {
  if (post.image_url) return post.image_url;
  if (post.content_blocks) {
    const first = post.content_blocks.find((b) => b.type === 'image');
    if (first && first.type === 'image') return getBlockImageUrl(first) ?? null;
  }
  return null;
}

export function getReviewPreviewText(
  review: { content: string; content_blocks?: ContentBlock[] | null },
  maxLen: number
): string {
  if (review.content_blocks && review.content_blocks.length > 0) {
    const first = review.content_blocks.find((b) => b.type === 'text');
    if (first && first.type === 'text' && first.content) {
      const t = first.content.replace(/\s+/g, ' ').trim();
      return t.length <= maxLen ? t : t.slice(0, maxLen) + '…';
    }
  }
  const t = (review.content || '').replace(/\s+/g, ' ').trim();
  return t.length <= maxLen ? t : t.slice(0, maxLen) + '…';
}

export function getReviewThumbnail(review: {
  image_url: string | null;
  content_blocks?: ContentBlock[] | null;
}): string | null {
  if (review.image_url) return review.image_url;
  if (review.content_blocks) {
    const first = review.content_blocks.find((b) => b.type === 'image');
    if (first && first.type === 'image') return getBlockImageUrl(first) ?? null;
  }
  return null;
}
