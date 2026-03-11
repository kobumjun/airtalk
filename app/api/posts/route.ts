import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { verifyAdminSession } from '@/lib/auth';
import { getBlockImageUrl } from '@/lib/block-utils';
import type { ContentBlock } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const BUCKET = 'review-images';

type UploadResult = { ok: true; url: string } | { ok: false; error: string };

async function uploadFile(supabase: SupabaseClient, file: File): Promise<UploadResult> {
  const ext = file.name.split('.').pop() || 'jpg';
  const fileName = `post-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, file, { contentType: file.type, upsert: false });
  if (error) {
    console.error('[Post API] image upload error:', error);
    return { ok: false, error: error.message };
  }
  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data!.path);
  return { ok: true, url: urlData.publicUrl };
}

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from('posts')
      .select('id, title, content, image_url, contact_phone, content_blocks, created_at')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Supabase posts GET error:', error);
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
    const formData = await request.formData();
    const title = (formData.get('title') as string | null)?.trim();
    const contactPhone = (formData.get('contact_phone') as string | null)?.trim() || null;
    const contentBlocksJson = formData.get('content_blocks') as string | null;
    const legacyContent = (formData.get('content') as string | null)?.trim() || '';

    if (!title) {
      return NextResponse.json(
        { error: '제목을 입력해 주세요.' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    let content_blocks: ContentBlock[] | null = null;
    let image_url: string | null = null;

    if (contentBlocksJson) {
      try {
        const parsed = JSON.parse(contentBlocksJson) as unknown[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          const resolved: ContentBlock[] = [];
          let imageIndex = 0;
          for (let i = 0; i < parsed.length; i++) {
            const block = parsed[i] as Record<string, unknown>;
            const type = block?.type;
            if (type === 'text') {
              resolved.push({ type: 'text', content: (block.content as string) || '' });
            } else if (type === 'image') {
              const raw = formData.get(`image_${imageIndex}`);
              let file: File | null = null;
              if (raw && typeof raw === 'object' && 'arrayBuffer' in raw) {
                file = raw as File;
              }
              const fileOk = file && file.size > 0;
              console.log(`[Post API] image block ${i}: formData.get("image_${imageIndex}") type=${typeof raw} hasFile=${!!file} size=${file?.size ?? 'N/A'}`);

              if (fileOk) {
                const result = await uploadFile(supabase, file!);
                if (result.ok) {
                  resolved.push({ type: 'image', imageUrl: result.url });
                  if (!image_url) image_url = result.url;
                  console.log(`[Post API] upload ok image_${imageIndex}: ${result.url}`);
                } else {
                  console.error(`[Post API] upload FAILED image_${imageIndex}:`, result.error);
                  return NextResponse.json(
                    { error: `이미지 업로드 실패: ${result.error}` },
                    { status: 500 }
                  );
                }
                imageIndex++;
              } else {
                const existingUrl = getBlockImageUrl(block);
                if (existingUrl) {
                  resolved.push({ type: 'image', imageUrl: existingUrl });
                  if (!image_url) image_url = existingUrl;
                } else {
                  console.error(`[Post API] image block ${i}: no file and no existing URL. formData keys:`, [...formData.keys()]);
                  return NextResponse.json(
                    { error: `이미지 블록 ${i + 1}: 파일을 선택해 주세요. (서버가 파일을 받지 못했습니다.)` },
                    { status: 400 }
                  );
                }
              }
            }
          }
          content_blocks = resolved.length > 0 ? resolved : null;
        }
      } catch (e) {
        console.error('[Post API] content_blocks parse error:', e);
        return NextResponse.json(
          { error: 'content_blocks 파싱 오류' },
          { status: 400 }
        );
      }
    }

    // Legacy: single image
    const legacyImage = formData.get('image') as File | null;
    if (legacyImage && legacyImage.size > 0 && !image_url) {
      const result = await uploadFile(supabase, legacyImage);
      if (result.ok) image_url = result.url;
      else {
        return NextResponse.json(
          { error: `이미지 업로드 실패: ${result.error}` },
          { status: 500 }
        );
      }
    }

    // Use first text block or legacy content for `content` (backward compat)
    let content = legacyContent;
    if (content_blocks) {
      const firstText = content_blocks.find((b) => b.type === 'text');
      if (firstText && firstText.type === 'text' && firstText.content) {
        content = firstText.content;
      }
      if (!content) {
        content = content_blocks.map((b) => (b.type === 'text' ? b.content : '[이미지]')).join('\n');
      }
    }

    const row: Record<string, unknown> = {
      title,
      content: content || title,
      image_url,
      contact_phone: contactPhone,
      content_blocks,
    };

    console.log('[Post API] BEFORE INSERT content_blocks:', JSON.stringify(row.content_blocks, null, 2));

    const { error } = await supabase.from('posts').insert(row);
    if (error) {
      console.error('Supabase posts insert error:', error);
      return NextResponse.json(
        { error: error.message || '저장 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Posts POST handler error:', err);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
