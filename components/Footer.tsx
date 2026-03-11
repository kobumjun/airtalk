import Link from 'next/link';

const PHONE = '010-5816-4415';
const BLOG = 'https://m.blog.naver.com/han082755';

export default function Footer() {
  return (
    <footer className="mt-auto bg-slate-800/95 text-slate-200 border-t border-slate-700/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="text-center sm:text-left">
            <p className="font-semibold text-white">에어컨의 수다방</p>
            <p className="text-sm text-slate-400 mt-1">
              에어컨 설치, 수리, 가스충전, 철거, 청소 전문업체
            </p>
          </div>
          <div className="flex flex-col sm:items-end gap-1 text-sm">
            <a
              href={`tel:${PHONE.replace(/-/g, '')}`}
              className="font-medium text-white hover:text-sky-300 transition"
            >
              {PHONE}
            </a>
            <a
              href={BLOG}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-300 transition"
            >
              블로그
            </a>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-600/80 text-center text-xs text-slate-500">
          <Link href="/request" className="hover:text-slate-300 transition">
            접수하기
          </Link>
          {' · '}
          <Link href="/reviews" className="hover:text-slate-300 transition">
            고객후기
          </Link>
        </div>
      </div>
    </footer>
  );
}
