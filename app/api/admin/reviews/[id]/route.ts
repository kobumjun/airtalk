import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminSession } from '@/lib/auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function getStoragePathFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const match = u.pathname.match(/\/storage\/v1\/object\/public\/review-images\/(.+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: row, error: fetchError } = await supabase
      .from('reviews')
      .select('image_url')
      .eq('id', id)
      .single();
    if (fetchError) {
      return NextResponse.json(
        { error: '삭제 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }
    if (row?.image_url) {
      const path = getStoragePathFromUrl(row.image_url);
      if (path) {
        await supabase.storage.from('review-images').remove([path]);
      }
    }
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: '삭제 중 오류가 발생했습니다.' },
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
