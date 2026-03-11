import Link from 'next/link';

const PHONE = '010-5816-4415';
const PHONE_RAW = '01058164415';
const BLOG = 'https://m.blog.naver.com/han082755';

const navItems = [
  { href: '/', label: '홈' },
  { href: '/request', label: '접수폼' },
  { href: '/reviews', label: '고객후기' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="text-lg font-bold text-slate-800 hover:text-sky-600 transition shrink-0"
        >
          에어컨의 수다방
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2 flex-wrap justify-end">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-sky-600 hover:bg-sky-50/80 rounded-lg transition"
            >
              {label}
            </Link>
          ))}
          <a
            href={BLOG}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-sky-600 hover:bg-sky-50/80 rounded-lg transition"
          >
            블로그
          </a>
          <a
            href={`tel:${PHONE_RAW}`}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-lg shadow-sm transition shrink-0"
          >
            <span aria-hidden>📞</span>
            {PHONE}
          </a>
        </nav>
      </div>
    </header>
  );
}
