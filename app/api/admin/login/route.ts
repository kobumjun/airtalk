import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookiePayload } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json(
      { error: '서버에 관리자 비밀번호가 설정되지 않았습니다.' },
      { status: 500 }
    );
  }

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: '잘못된 요청입니다.' },
      { status: 400 }
    );
  }

  const password = body.password;
  if (typeof password !== 'string') {
    return NextResponse.json(
      { error: '비밀번호를 입력해 주세요.' },
      { status: 400 }
    );
  }

  if (password !== adminPassword) {
    return NextResponse.json(
      { error: '비밀번호가 올바르지 않습니다.' },
      { status: 401 }
    );
  }

  const { name, value, options } = getSessionCookiePayload();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(name, value, options as Record<string, string | number | boolean>);
  return res;
}
