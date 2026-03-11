import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '접수폼',
  description:
    '에어컨 설치, 수리, 가스충전, 철거, 청소 접수. 빠른 방문을 위해 정보를 입력해 주세요.',
};

export default function RequestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
