import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import PostList from '@/components/PostList';
import type { PostRow } from '@/types/database';

const BLOG = 'https://m.blog.naver.com/han082755';
const PHONE_RAW = '01058164415';

const SERVICES = [
  { label: '에어컨 설치', icon: '🔧' },
  { label: '에어컨 수리', icon: '🛠️' },
  { label: '가스 충전', icon: '⛽' },
  { label: '철거', icon: '📦' },
  { label: '청소', icon: '✨' },
];

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
      {/* Hero — minimal */}
      <section className="text-center py-10 sm:py-14">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
          에어컨의 수다방
        </h1>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">
          에어컨 설치, 수리, 가스충전, 철거, 청소 전문업체
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/request"
            className="inline-flex items-center justify-center py-2.5 px-5 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded-xl shadow-sm transition"
          >
            접수하기
          </Link>
          <Link
            href="/reviews"
            className="inline-flex items-center justify-center py-2.5 px-5 bg-white border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 text-slate-700 text-sm font-medium rounded-xl shadow-sm transition"
          >
            고객후기
          </Link>
        </div>
      </section>

      {/* Services */}
      <section className="py-10">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          서비스 안내
        </h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SERVICES.map(({ label, icon }) => (
            <li
              key={label}
              className="flex items-center gap-3 p-4 bg-white/90 rounded-2xl border border-slate-200/80 shadow-sm"
            >
              <span className="text-xl">{icon}</span>
              <span className="font-medium text-slate-700 text-sm sm:text-base">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Latest posts */}
      <section className="py-10">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          최근 글
        </h2>
        <PostList posts={posts} />
      </section>
    </div>
  );
}
