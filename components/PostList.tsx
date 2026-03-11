import Link from 'next/link';
import type { PostRow } from '@/types/database';

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

function preview(text: string, maxLen: number) {
  const trimmed = text.replace(/\s+/g, ' ').trim();
  if (trimmed.length <= maxLen) return trimmed;
  return trimmed.slice(0, maxLen) + '…';
}

export default function PostList({ posts }: Props) {
  if (posts.length === 0) {
    return (
      <p className="text-slate-500 text-sm">등록된 글이 없습니다.</p>
    );
  }

  return (
    <ul className="space-y-4">
      {posts.map((post) => (
        <li key={post.id}>
          <Link
            href={`/posts/${post.id}`}
            className="block p-5 rounded-2xl bg-stone-900/90 hover:bg-stone-800 border border-stone-700/80 shadow-sm hover:shadow-md transition"
          >
            <h2 className="font-semibold text-gray-50 mb-1">{post.title}</h2>
            <p className="text-sm text-gray-300 mb-2 line-clamp-2">
              {preview(post.content, PREVIEW_LEN)}
            </p>
            <span className="text-xs text-gray-400">{formatDate(post.created_at)}</span>
            <span className="ml-2 text-xs text-amber-400 font-semibold">자세히 보기 →</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
