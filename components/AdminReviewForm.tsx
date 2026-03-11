'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ContentBlock } from '@/types/database';

type Block =
  | { type: 'text'; content: string }
  | { type: 'image'; file: File | null; imageUrl?: string };

type Props = { onSuccess?: () => void };

export default function AdminReviewForm({ onSuccess }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [blocks, setBlocks] = useState<Block[]>([{ type: 'text', content: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const addTextBlock = () => {
    setBlocks((b) => [...b, { type: 'text', content: '' }]);
  };

  const addImageBlock = () => {
    setBlocks((b) => [...b, { type: 'image', file: null }]);
  };

  const updateBlock = (i: number, upd: Partial<Block>) => {
    setBlocks((b) => {
      const next = [...b];
      next[i] = { ...next[i], ...upd } as Block;
      return next;
    });
  };

  const removeBlock = (i: number) => {
    setBlocks((b) => b.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!title.trim()) {
      setError('제목을 입력해 주세요.');
      return;
    }
    const validBlocks = blocks.filter(
      (b) => b.type === 'text' || (b.type === 'image' && (b.file || b.imageUrl))
    );
    if (validBlocks.length === 0) {
      setError('텍스트 블록 또는 이미지 블록을 최소 하나 추가해 주세요.');
      return;
    }

    setLoading(true);
    try {
      const contentBlocks: { type: string; content?: string; imageUrl?: string }[] =
        validBlocks.map((b) =>
          b.type === 'text'
            ? { type: 'text', content: b.content }
            : { type: 'image' }
        );

      const formData = new FormData();
      formData.set('title', title.trim());
      formData.set('contact_phone', contactPhone.trim());
      formData.set('content_blocks', JSON.stringify(contentBlocks));

      let imageIndex = 0;
      validBlocks.forEach((b) => {
        if (b.type === 'image' && b.file) {
          formData.set(`image_${imageIndex}`, b.file);
          imageIndex++;
        }
      });

      const res = await fetch('/api/reviews', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || '저장에 실패했습니다.');
      setSuccess('후기가 등록되었습니다.');
      setTitle('');
      setContactPhone('');
      setBlocks([{ type: 'text', content: '' }]);
      onSuccess?.();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {success}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-100 mb-1">
          후기 제목 *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-stone-700 rounded-xl bg-neutral-900 text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          placeholder="제목"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-100 mb-1">
          연락처 (선택)
        </label>
        <input
          type="tel"
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
          className="w-full px-4 py-2 border border-stone-700 rounded-xl bg-neutral-900 text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          placeholder="010-0000-0000"
        />
      </div>

      <div>
        <div className="flex gap-2 mb-2">
          <button
            type="button"
            onClick={addTextBlock}
            className="px-3 py-1.5 text-sm bg-stone-700 hover:bg-stone-600 rounded-lg text-gray-200"
          >
            + 텍스트 블록
          </button>
          <button
            type="button"
            onClick={addImageBlock}
            className="px-3 py-1.5 text-sm bg-stone-700 hover:bg-stone-600 rounded-lg text-gray-200"
          >
            + 이미지 블록
          </button>
        </div>
        <div className="space-y-3">
          {blocks.map((block, i) => (
            <div
              key={i}
              className="p-3 rounded-xl border border-stone-700 bg-neutral-900/50"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-400">
                  {block.type === 'text' ? '텍스트' : '이미지'}
                </span>
                <button
                  type="button"
                  onClick={() => removeBlock(i)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  삭제
                </button>
              </div>
              {block.type === 'text' ? (
                <textarea
                  value={block.content}
                  onChange={(e) => updateBlock(i, { content: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-stone-700 rounded-lg bg-neutral-900 text-gray-100 text-sm"
                  placeholder="내용 입력..."
                />
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    updateBlock(i, { file: e.target.files?.[0] ?? null })
                  }
                  className="w-full text-sm text-gray-300 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-stone-800 file:text-gray-100"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-stone-600 text-white font-semibold rounded-xl transition shadow-md"
      >
        {loading ? '저장 중...' : '후기 등록'}
      </button>
    </form>
  );
}
