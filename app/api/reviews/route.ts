import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminSession } from '@/lib/auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const title = (formData.get('title') as string)?.trim();
    const content = (formData.get('content') as string)?.trim();
    const photoFile = formData.get('photo') as File | null;

    if (!title || !content) {
      return NextResponse.json(
        { error: '제목과 내용을 입력해 주세요.' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    let imageUrl: string | null = null;

    if (photoFile && photoFile.size > 0) {
      const ext = photoFile.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('review-images')
        .upload(fileName, photoFile, {
          contentType: photoFile.type,
          upsert: false,
        });
      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage
          .from('review-images')
          .getPublicUrl(uploadData.path);
        imageUrl = urlData.publicUrl;
      }
    }

    const { error } = await supabase.from('reviews').insert({
      title,
      content,
      image_url: imageUrl,
    });

    if (error) {
      console.error('Supabase insert error:', error);
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
