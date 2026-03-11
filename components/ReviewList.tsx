import type { ReviewRow } from '@/types/database';

type Props = { reviews: ReviewRow[] };

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

export default function ReviewList({ reviews }: Props) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        아직 등록된 후기가 없습니다.
      </div>
    );
  }

  return (
    <ul className="space-y-6">
      {reviews.map((review) => (
        <li
          key={review.id}
          className="p-4 sm:p-6 bg-white/90 rounded-2xl border border-slate-200/80 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-800 mb-2">
            {review.title}
          </h2>
          <p className="text-slate-600 whitespace-pre-line mb-3">{review.content}</p>
          {review.image_url && (
            <div className="w-full max-w-md rounded-lg overflow-hidden bg-slate-100 mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={review.image_url}
                alt={review.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}
          <time className="text-sm text-slate-400">{formatDate(review.created_at)}</time>
        </li>
      ))}
    </ul>
  );
}
