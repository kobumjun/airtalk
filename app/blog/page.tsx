import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import PostList from '@/components/PostList';
import type { PostRow } from '@/types/database';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '시공사례',
  description: '에어컨 설치, 수리, 가스충전, 철거 시공사례를 확인하세요.',
};

export const revalidate = 60;

async function getPosts(): Promise<PostRow[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, slug, content, image_url, contact_phone, content_blocks, created_at')
    .order('created_at', { ascending: false });
  if (error) return [];
  return data ?? [];
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <Link
        href="/"
        className="inline-block text-sm text-amber-400 hover:text-amber-300 mb-6"
      >
        ← 홈으로
      </Link>
      <h1 className="text-2xl font-bold text-gray-50 mb-6">시공사례</h1>
      <PostList posts={posts} />
    </div>
  );
}
