import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '관리자페이지',
  description: '에어컨의 수다방 관리자',
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
