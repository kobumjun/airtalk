import { NextResponse } from 'next/server';
import { getClearSessionCookie } from '@/lib/auth';

export async function POST() {
  const { name, value, options } = getClearSessionCookie();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(name, value, options as Record<string, string | number | boolean>);
  return res;
}
