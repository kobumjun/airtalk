import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import PostList from '@/components/PostList';
import type { PostRow } from '@/types/database';

const BLOG = 'https://m.blog.naver.com/han082755';
const PHONE_RAW = '01058164415';

export const revalidate = 60;

async function getPosts(): Promise<PostRow[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, content, created_at')
    .order('created_at', { ascending: false })
    .limit(10);
  if (error) return [];
  return data ?? [];
}

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Hero – rugged industrial */}
      <section className="mb-8 rounded-3xl bg-gradient-to-br from-neutral-950 via-stone-900 to-zinc-900 border border-stone-800 px-5 py-8 sm:px-8 sm:py-10 text-left text-white shadow-xl">
        <p className="text-xs font-semibold tracking-[0.2em] text-amber-400 mb-3 uppercase">
          현장 aircon total service
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-3 leading-tight">
          상가 · 공장 · 사무실
          <br className="sm:hidden" />
          에어컨 설치 · 수리 · 철거까지
        </h1>
        <p className="text-sm sm:text-base text-gray-200 mb-6 max-w-xl">
          새벽 · 야간 시공, 급한 고장 출동까지 한 번에 해결합니다.
          현장에서 답을 찾는 17년 경력 전문업체입니다.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <Link
            href="/request"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-sm font-semibold text-white shadow-md transition"
          >
            현장 접수 · 견적 문의
          </Link>
          <a
            href={`tel:${PHONE_RAW}`}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-red-500/80 text-sm font-semibold text-red-200 hover:bg-red-700/20 transition"
          >
            📞 전화 상담 010-5816-4415
          </a>
        </div>
      </section>

      {/* Credibility stats */}
      <section className="mb-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: '제휴업체', value: '80개+' },
            { label: '시공사례', value: '8000이상' },
            { label: '누적시공', value: '12000+' },
            { label: '서비스불가건', value: '0건' },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-stone-800 bg-neutral-950/80 px-3 py-4 sm:px-4 sm:py-5 shadow-inner"
            >
              <p className="text-[11px] sm:text-xs font-semibold tracking-[0.18em] text-gray-400 uppercase mb-1">
                {item.label}
              </p>
              <p className="text-lg sm:text-xl font-extrabold text-orange-400">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section className="mb-10 rounded-3xl bg-gradient-to-r from-red-800 via-red-700 to-orange-700 px-5 py-6 sm:px-7 sm:py-7 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-orange-200 mb-1 uppercase">
              무료 현장 실측 · 견적
            </p>
            <p className="text-base sm:text-lg font-bold mb-1">
              기사님이 직접 방문해 배관 동선부터 전력까지 꼼꼼히 체크합니다.
            </p>
            <p className="text-xs sm:text-sm text-orange-100/90">
              사진만으로는 놓치는 부분까지, 현장에서 정확하게 진단해 드립니다.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:min-w-[210px]">
            <Link
              href="/request"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-white text-red-800 text-sm font-semibold hover:bg-orange-50 transition"
            >
              접수폼으로 바로 남기기
            </Link>
            <a
              href={BLOG}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-red-200/80 text-sm font-semibold text-white/90 hover:bg-red-900/30 transition"
            >
              블로그 시공사례 보기
            </a>
          </div>
        </div>
      </section>

      {/* Latest posts */}
      <section className="py-6 border-t border-stone-800/80">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">최근 글</h2>
        <PostList posts={posts} />
      </section>
    </div>
  );
}
