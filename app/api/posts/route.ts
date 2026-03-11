import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminSession } from '@/lib/auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from('posts')
      .select('id, title, content, created_at')
      .order('created_at', { ascending: false });
    if (error) {
      console.error(error);
      return NextResponse.json([], { status: 200 });
    }
    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error(err);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const title = (body.title as string)?.trim();
    const content = (body.content as string)?.trim();
    if (!title || !content) {
      return NextResponse.json(
        { error: '제목과 내용을 입력해 주세요.' },
        { status: 400 }
      );
    }
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error } = await supabase.from('posts').insert({ title, content });
    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: '저장 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
