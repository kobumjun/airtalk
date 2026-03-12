import Link from 'next/link';
import type { PostRow } from '@/types/database';
import { getPostPreviewText, getPostThumbnail } from '@/lib/utils';

type Props = { posts: PostRow[] };

const PREVIEW_LEN = 120;

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

export default function PostList({ posts }: Props) {
  if (posts.length === 0) {
    return (
      <p className="text-gray-400 text-sm">등록된 글이 없습니다.</p>
    );
  }

  return (
    <ul className="space-y-4">
      {posts.map((post) => {
        const thumb = getPostThumbnail(post);
        const href = post.slug
          ? `/blog/${encodeURIComponent(post.slug)}`
          : `/posts/${post.id}`;
        return (
          <li key={post.id}>
            <Link
              href={href}
              className="flex gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-slate-800/95 hover:bg-slate-700/90 border border-white/10 shadow-lg hover:shadow-xl transition"
            >
              {thumb && (
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumb}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1 flex flex-col">
                <h2 className="font-semibold text-gray-50 text-sm sm:text-base mb-1 line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-200 mb-2 line-clamp-2">
                  {getPostPreviewText(post, PREVIEW_LEN)}
                </p>
                <div className="mt-auto text-[11px] sm:text-xs text-gray-400">
                  {formatDate(post.created_at)}
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
