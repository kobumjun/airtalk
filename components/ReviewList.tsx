import Link from 'next/link';
import { getReviewPreviewText, getReviewThumbnail } from '@/lib/utils';
import type { ReviewRow } from '@/types/database';

type Props = { reviews: ReviewRow[] };

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

export default function ReviewList({ reviews }: Props) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        아직 등록된 후기가 없습니다.
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {reviews.map((review) => {
        const thumbnail = getReviewThumbnail(review);
        const previewText = getReviewPreviewText(review, PREVIEW_LEN);
        return (
          <li key={review.id}>
            <Link
              href={`/reviews/${review.id}`}
              className="flex gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-slate-800/95 hover:bg-slate-700/90 border border-white/10 shadow-lg hover:shadow-xl transition block"
            >
              {thumbnail && (
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbnail}
                    alt={review.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1 flex flex-col">
                <h2 className="font-semibold text-gray-50 text-sm sm:text-base mb-1 line-clamp-2">
                  {review.title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-200 line-clamp-3 mb-2">
                  {previewText}
                </p>
                <div className="mt-auto text-[11px] sm:text-xs text-gray-400">
                  {formatDate(review.created_at)}
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
