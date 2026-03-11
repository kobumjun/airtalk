import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  variable: '--font-noto-sans-kr',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'),
  title: {
    default: '에어컨 수리 설치 전문 | 에어컨의 수다방',
    template: '%s | 에어컨의 수다방',
  },
  description:
    '에어컨 설치, 수리, 가스충전, 철거, 청소 전문 업체. 빠른 방문 서비스 제공.',
  openGraph: {
    title: '에어컨 수리 설치 전문 | 에어컨의 수다방',
    description: '에어컨 설치, 수리, 가스충전, 철거, 청소 전문 업체. 빠른 방문 서비스 제공.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={notoSansKr.variable}>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
