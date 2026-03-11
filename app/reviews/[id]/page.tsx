import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getBlockImageUrl } from '@/lib/block-utils';
import type { ReviewRow, ContentBlock } from '@/types/database';
import type { Metadata } from 'next';

export const revalidate = 60;

async function getReview(id: string): Promise<ReviewRow | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !data) return null;
  return data as ReviewRow;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const review = await getReview(id);
  if (!review) return { title: '후기를 찾을 수 없음' };
  const desc = review.content?.slice(0, 160) || review.title;
  return {
    title: review.title,
    description: desc,
  };
}

export default async function ReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const review = await getReview(id);
  if (!review) notFound();

  const dateStr = new Date(review.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const blocks = review.content_blocks as ContentBlock[] | null;
  const hasBlocks = Array.isArray(blocks) && blocks.length > 0;

  return (
    <article className="max-w-2xl mx-auto px-4 py-8 sm:py-10">
      <Link
        href="/reviews"
        className="inline-block text-sm text-amber-400 hover:text-amber-300 mb-4"
      >
        ← 목록으로
      </Link>

      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-50 mb-2">
          {review.title}
        </h1>
        <time className="text-sm text-gray-400">{dateStr}</time>
      </header>

      {hasBlocks ? (
        <div className="space-y-6">
          {blocks.map((block, i) => {
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
              const src = getBlockImageUrl(block as Record<string, unknown>);
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
          <div className="prose prose-invert max-w-none text-gray-200 whitespace-pre-line mb-6">
            {review.content}
          </div>
          {review.image_url && (
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-slate-800/95 shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={review.image_url}
                alt={review.title}
                className="w-full max-h-[420px] object-cover"
              />
            </div>
          )}
        </>
      )}

      {review.contact_phone && (
        <section className="mt-8 p-4 rounded-2xl border border-white/10 bg-slate-800/95">
          <p className="text-xs text-gray-400 mb-1">연락처</p>
          <a
            href={`tel:${review.contact_phone.replace(/\D/g, '')}`}
            className="text-lg font-bold text-amber-400 hover:text-amber-300"
          >
            {review.contact_phone}
          </a>
        </section>
      )}
    </article>
  );
}
