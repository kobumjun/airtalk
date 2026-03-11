'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminReviewForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!title.trim() || !content.trim()) {
      setError('제목과 내용을 입력해 주세요.');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.set('title', title.trim());
      formData.set('content', content.trim());
      if (photo) formData.set('photo', photo);

      const res = await fetch('/api/reviews', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || '저장에 실패했습니다.');
      }
      setSuccess('후기가 등록되었습니다.');
      setTitle('');
      setContent('');
      setPhoto(null);
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
        <label className="block text-sm font-medium text-slate-700 mb-1">
          후기 제목 *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          placeholder="제목"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          후기 내용 *
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          placeholder="내용"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          사진 (선택)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
          className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-50 file:text-primary-700"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-slate-400 text-white font-semibold rounded-xl"
      >
        {loading ? '저장 중...' : '후기 등록'}
      </button>
    </form>
  );
}
