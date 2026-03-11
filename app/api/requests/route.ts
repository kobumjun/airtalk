import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const address = (formData.get('address') as string)?.trim();
    const phone = (formData.get('phone') as string)?.trim();
    const symptom = (formData.get('symptom') as string)?.trim();
    const photoFile = formData.get('photo') as File | null;

    if (!address || !phone || !symptom) {
      return NextResponse.json(
        { error: '주소, 핸드폰번호, 증상을 입력해 주세요.' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    let photoUrl: string | null = null;

    if (photoFile && photoFile.size > 0) {
      const ext = photoFile.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('request-photos')
        .upload(fileName, photoFile, {
          contentType: photoFile.type,
          upsert: false,
        });
      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage
          .from('request-photos')
          .getPublicUrl(uploadData.path);
        photoUrl = urlData.publicUrl;
      }
    }

    const { error } = await supabase.from('requests').insert({
      address,
      phone,
      symptom,
      photo_url: photoUrl,
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
