import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getBlockImageUrl } from '@/lib/block-utils';
import type { PostRow, ContentBlock } from '@/types/database';
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
  // DEBUG 2: exact loaded content_blocks from Supabase
  const rawBlocks = (data as Record<string, unknown>).content_blocks;
  console.log('[Post Detail] DB READ raw content_blocks:', JSON.stringify(rawBlocks, null, 2));
  if (Array.isArray(rawBlocks)) {
    rawBlocks.forEach((b: unknown, idx: number) => {
      const obj = b as Record<string, unknown>;
      const keys = Object.keys(obj);
      console.log(`[Post Detail] DB block ${idx}: type=${obj.type} keys=[${keys.join(',')}] imageUrl=${obj.imageUrl} image_url=${obj.image_url} url=${obj.url} src=${obj.src}`);
    });
  }
  return data as PostRow;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) return { title: '글 찾을 수 없음' };
  const desc = post.content?.slice(0, 160) || post.title;
  return {
    title: post.title,
    description: desc,
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

  const blocks = post.content_blocks as ContentBlock[] | null;
  const hasBlocks = Array.isArray(blocks) && blocks.length > 0;

  return (
    <article className="max-w-2xl mx-auto px-4 py-8 sm:py-10">
      <Link
        href="/"
        className="inline-block text-sm text-amber-400 hover:text-amber-300 mb-4"
      >
        ← 목록으로
      </Link>

      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-50 mb-2">
          {post.title}
        </h1>
        <time className="text-sm text-gray-400">{dateStr}</time>
      </header>

      {hasBlocks ? (
        <div className="space-y-6">
          {blocks.map((block, i) => {
            // DEBUG 3: each block during render
            const b = block as Record<string, unknown>;
            const keys = Object.keys(b);
            const imgUrl = getBlockImageUrl(b);
            console.log(`[Post Detail] RENDER block ${i}: type=${b.type} keys=[${keys.join(',')}] getBlockImageUrl=${imgUrl ?? 'null'}`);
            if (block.type === 'text') {
              return (
                <div
                  key={i}
                  className="prose prose-invert max-w-none text-gray-200 whitespace-pre-line"
                >
                  {block.content ?? ''}
                </div>
              );
            }
            if (block.type === 'image') {
              const src = imgUrl;
              if (src) {
                return (
                  <div
                    key={i}
                    className="rounded-2xl overflow-hidden border border-white/10 bg-slate-800/95 shadow-lg"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt=""
                      className="w-full max-h-[420px] object-cover"
                    />
                  </div>
                );
              }
            }
            return null;
          })}
        </div>
      ) : (
        <>
          {post.image_url && (
            <div className="mb-6 rounded-2xl overflow-hidden border border-white/10 bg-slate-800/95 shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full max-h-[320px] object-cover"
              />
            </div>
          )}
          <div className="prose prose-invert max-w-none text-gray-200 whitespace-pre-line">
            {post.content}
          </div>
        </>
      )}

      {post.contact_phone && (
        <section className="mt-8 p-4 rounded-2xl border border-white/10 bg-slate-800/95">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            문의 전화
          </p>
          <a
            href={`tel:${post.contact_phone.replace(/\D/g, '')}`}
            className="text-lg font-bold text-amber-400 hover:text-amber-300"
          >
            {post.contact_phone}
          </a>
        </section>
      )}
    </article>
  );
}
