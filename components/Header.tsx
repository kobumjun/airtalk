import Link from 'next/link';

const navItems = [
  { href: '/', label: '홈' },
  { href: '/request', label: '접수폼' },
  { href: '/reviews', label: '고객후기' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-bold text-slate-800 hover:text-primary-600 transition"
        >
          에어컨의 수다방
        </Link>
        <nav className="flex gap-4">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-slate-600 hover:text-primary-600 transition"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
