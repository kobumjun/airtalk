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
    <header className="sticky top-0 z-50 bg-neutral-950/95 backdrop-blur border-b border-stone-800 shadow-lg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="text-lg font-extrabold text-amber-400 hover:text-amber-300 tracking-tight transition shrink-0"
        >
          에어컨의 수다방
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2 flex-wrap justify-end text-xs sm:text-sm">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-2 font-medium text-gray-200 hover:text-white hover:bg-stone-800/80 rounded-lg transition"
            >
              {label}
            </Link>
          ))}
          <a
            href={BLOG}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 font-medium text-gray-200 hover:text-white hover:bg-stone-800/80 rounded-lg transition"
          >
            블로그
          </a>
          <a
            href={`tel:${PHONE_RAW}`}
            className="inline-flex items-center gap-1.5 px-3 py-2 font-semibold text-white bg-red-700 hover:bg-red-800 rounded-lg shadow-md transition shrink-0"
          >
            <span aria-hidden>📞</span>
            {PHONE}
          </a>
        </nav>
      </div>
    </header>
  );
}
