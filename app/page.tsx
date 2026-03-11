import Link from 'next/link';

const PHONE = '010-5816-4415';
const PHONE_RAW = '01058164415';
const BLOG = 'https://m.blog.naver.com/han082755';

const SERVICES = [
  { label: '에어컨 설치', icon: '🔧' },
  { label: '에어컨 수리', icon: '🛠️' },
  { label: '가스 충전', icon: '⛽' },
  { label: '철거', icon: '📦' },
  { label: '청소', icon: '✨' },
];

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero */}
      <section className="text-center py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
          에어컨의 수다방
        </h1>
        <p className="text-lg text-slate-600 mb-6">
          에어컨 설치, 수리, 가스충전, 철거, 청소 전문업체
        </p>

        <a
          href={`tel:${PHONE_RAW}`}
          className="inline-flex items-center justify-center gap-2 w-full max-w-xs mx-auto py-4 px-6 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold rounded-xl shadow-lg transition mb-4"
        >
          <span className="text-2xl">📞</span>
          {PHONE}
        </a>

        <a
          href={BLOG}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-primary-600 hover:text-primary-700 font-medium mb-8"
        >
          m.blog.naver.com/han082755
        </a>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/request"
            className="inline-flex items-center justify-center py-3 px-6 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition"
          >
            접수하기
          </Link>
          <Link
            href="/reviews"
            className="inline-flex items-center justify-center py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl transition"
          >
            고객후기 보기
          </Link>
        </div>
      </section>

      {/* Services */}
      <section className="py-10 border-t border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">
          서비스 안내
        </h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {SERVICES.map(({ label, icon }) => (
            <li
              key={label}
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm"
            >
              <span className="text-2xl">{icon}</span>
              <span className="font-medium text-slate-700">{label}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <section className="py-10 text-center">
        <p className="text-slate-600 mb-4">빠른 방문 서비스를 제공합니다.</p>
        <a
          href={`tel:${PHONE_RAW}`}
          className="inline-flex items-center gap-2 py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl"
        >
          📞 전화 문의
        </a>
      </section>
    </div>
  );
}
