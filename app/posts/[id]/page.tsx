import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { PostRow } from '@/types/database';
import type { Metadata } from 'next';

export const revalidate = 60;

async function getPost(id: string): Promise<PostRow | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !data) return null;
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) return { title: '글 찾을 수 없음' };
  return {
    title: post.title,
    description: post.content.slice(0, 160),
  };
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  const dateStr = new Date(post.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="max-w-2xl mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-block text-sm text-sky-600 hover:text-sky-700 mb-6"
      >
        ← 목록으로
      </Link>
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
          {post.title}
        </h1>
        <time className="text-sm text-slate-500">{dateStr}</time>
      </header>
      <div className="prose prose-slate max-w-none text-slate-700 whitespace-pre-line">
        {post.content}
      </div>
    </article>
  );
}
