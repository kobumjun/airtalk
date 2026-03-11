import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { verifyAdminSession } from '@/lib/auth';
import { getBlockImageUrl } from '@/lib/block-utils';
import type { ContentBlock } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const BUCKET = 'review-images';

function uploadFile(supabase: SupabaseClient, file: File): Promise<string | null> {
  const ext = file.name.split('.').pop() || 'jpg';
  const fileName = `post-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  return supabase.storage
    .from(BUCKET)
    .upload(fileName, file, { contentType: file.type, upsert: false })
    .then(({ data, error }) => {
      if (error) {
        console.error('[Post API] image upload error:', error);
        return null;
      }
      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data!.path);
      return urlData.publicUrl;
    });
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
          // DEBUG: inspect incoming blocks
          console.log('[Post API] parsed content_blocks:', JSON.stringify(parsed, null, 2));
          const resolved: ContentBlock[] = [];
          let imageIndex = 0;
          for (let i = 0; i < parsed.length; i++) {
            const block = parsed[i] as Record<string, unknown>;
            const type = block?.type;
            if (type === 'text') {
              resolved.push({ type: 'text', content: (block.content as string) || '' });
            } else if (type === 'image') {
              const file = formData.get(`image_${imageIndex}`) as File | null;
              const fileInfo = file
                ? { hasFile: true, size: file.size, name: file.name }
                : { hasFile: false };
              console.log(`[Post API] image block ${i} file_${imageIndex}:`, fileInfo);
              if (file && file.size > 0) {
                const url = await uploadFile(supabase, file);
                console.log(`[Post API] upload result for image_${imageIndex}:`, url ? 'ok' : 'FAILED');
                if (url) {
                  resolved.push({ type: 'image', imageUrl: url });
                  if (!image_url) image_url = url;
                }
                imageIndex++;
              } else {
                const existingUrl = getBlockImageUrl(block);
                if (existingUrl) {
                  resolved.push({ type: 'image', imageUrl: existingUrl });
                  if (!image_url) image_url = existingUrl;
                }
              }
            }
          }
          content_blocks = resolved.length > 0 ? resolved : null;
          console.log('[Post API] resolved content_blocks:', JSON.stringify(content_blocks, null, 2));
        }
      } catch (e) {
        console.error('[Post API] content_blocks parse error:', e);
      }
    }

    // Legacy: single image
    const legacyImage = formData.get('image') as File | null;
    if (legacyImage && legacyImage.size > 0 && !image_url) {
      const url = await uploadFile(supabase, legacyImage);
      if (url) image_url = url;
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
