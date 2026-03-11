'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = { onSuccess?: () => void };

export default function AdminPostForm({ onSuccess }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
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
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), content: content.trim() }),
        credentials: 'include',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || '저장에 실패했습니다.');
      setSuccess('글이 등록되었습니다.');
      setTitle('');
      setContent('');
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
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-sky-700 text-sm">
          {success}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          제목 *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-sky-400 bg-white"
          placeholder="글 제목"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          내용 *
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-sky-400 bg-white"
          placeholder="내용"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-400 text-white font-semibold rounded-xl transition"
      >
        {loading ? '저장 중...' : '글 등록'}
      </button>
    </form>
  );
}
