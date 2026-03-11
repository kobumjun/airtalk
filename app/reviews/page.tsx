import { supabase } from '@/lib/supabase';
import ReviewList from '@/components/ReviewList';
import type { ReviewRow } from '@/types/database';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '고객후기',
  description: '에어컨의 수다방 고객 후기. 설치, 수리, 청소 후기를 확인하세요.',
};

export const revalidate = 60;

async function getReviews(): Promise<ReviewRow[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return [];
  return data ?? [];
}

export default async function ReviewsPage() {
  const reviews = await getReviews();
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">고객후기</h1>
      <ReviewList reviews={reviews} />
    </div>
  );
}
