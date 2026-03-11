import { cookies } from 'next/headers';
import { createHash } from 'crypto';

const COOKIE_NAME = 'admin_session';
const SALT = 'air-admin-v1';

function getSessionToken(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return '';
  return createHash('sha256').update(password + SALT).digest('hex');
}

export async function verifyAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie?.value) return false;
  const expected = getSessionToken();
  if (!expected) return false;
  return cookie.value === expected;
}

export function getSessionCookiePayload(): { name: string; value: string; options: Record<string, unknown> } {
  return {
    name: COOKIE_NAME,
    value: getSessionToken(),
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    },
  };
}

export function getClearSessionCookie(): { name: string; value: string; options: Record<string, unknown> } {
  return {
    name: COOKIE_NAME,
    value: '',
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 0,
      path: '/',
    },
  };
}
