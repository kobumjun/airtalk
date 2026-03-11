'use client';

import { useEffect, useState } from 'react';
import AdminReviewForm from '@/components/AdminReviewForm';
import AdminPostForm from '@/components/AdminPostForm';
import type { ReviewRow } from '@/types/database';
import type { PostRow } from '@/types/database';

type Tab = 'reviews' | 'posts';

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

export default function AdminPage() {
  const [auth, setAuth] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState<Tab>('reviews');
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'review' | 'post'; id: string } | null>(null);

  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const res = await fetch('/api/admin/reviews', { credentials: 'include' });
      const data = await res.json().catch(() => []);
      setReviews(Array.isArray(data) ? data : []);
    } finally {
      setLoadingReviews(false);
    }
  };

  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const res = await fetch('/api/posts');
      const data = await res.json().catch(() => []);
      setPosts(Array.isArray(data) ? data : []);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetch('/api/admin/session', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        setAuth(data.ok === true);
        if (data.ok) {
          fetchReviews();
          fetchPosts();
        }
      })
      .catch(() => setAuth(false));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
      credentials: 'include',
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.ok) {
      setAuth(true);
      fetchReviews();
      fetchPosts();
    } else {
      setError(data.error || '비밀번호가 올바르지 않습니다.');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
    setAuth(false);
  };

  const handleDeleteReview = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) await fetchReviews();
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  const handleDeletePost = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) await fetchPosts();
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  if (auth === null) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="animate-pulse text-slate-500">확인 중...</div>
      </div>
    );
  }

  if (!auth) {
    return (
      <div className="max-w-sm mx-auto px-4 py-16">
        <h1 className="text-xl font-bold text-slate-800 mb-6 text-center">
          관리자 로그인
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-2 rounded-xl">{error}</p>
          )}
          <div>
            <label
              htmlFor="admin-pw"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              비밀번호
            </label>
            <input
              id="admin-pw"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-sky-400"
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-xl transition"
          >
            로그인
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">관리자페이지</h1>
        <button
          type="button"
          onClick={handleLogout}
          className="text-sm text-slate-500 hover:text-slate-700 transition"
        >
          로그아웃
        </button>
      </div>

      <div className="flex gap-2 mb-6 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setTab('reviews')}
          className={`px-4 py-2 text-sm font-medium rounded-t-xl transition ${
            tab === 'reviews'
              ? 'bg-sky-50 text-sky-700 border-b-2 border-sky-500 -mb-px'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          후기 관리
        </button>
        <button
          type="button"
          onClick={() => setTab('posts')}
          className={`px-4 py-2 text-sm font-medium rounded-t-xl transition ${
            tab === 'posts'
              ? 'bg-sky-50 text-sky-700 border-b-2 border-sky-500 -mb-px'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          글 관리
        </button>
      </div>

      {tab === 'reviews' && (
        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              새 후기 등록
            </h2>
            <AdminReviewForm onSuccess={fetchReviews} />
          </section>
          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              등록된 후기 ({reviews.length})
            </h2>
            {loadingReviews ? (
              <p className="text-slate-500 text-sm">불러오는 중...</p>
            ) : reviews.length === 0 ? (
              <p className="text-slate-500 text-sm">등록된 후기가 없습니다.</p>
            ) : (
              <ul className="space-y-3">
                {reviews.map((r) => (
                  <li
                    key={r.id}
                    className="flex items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-800 truncate">
                        {r.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {formatDate(r.created_at)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setConfirmDelete({ type: 'review', id: r.id })
                      }
                      disabled={deletingId === r.id}
                      className="shrink-0 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                    >
                      {deletingId === r.id ? '삭제 중...' : '삭제'}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}

      {tab === 'posts' && (
        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              새 글 등록
            </h2>
            <AdminPostForm onSuccess={fetchPosts} />
          </section>
          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              등록된 글 ({posts.length})
            </h2>
            {loadingPosts ? (
              <p className="text-slate-500 text-sm">불러오는 중...</p>
            ) : posts.length === 0 ? (
              <p className="text-slate-500 text-sm">등록된 글이 없습니다.</p>
            ) : (
              <ul className="space-y-3">
                {posts.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-800 truncate">
                        {p.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {formatDate(p.created_at)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setConfirmDelete({ type: 'post', id: p.id })
                      }
                      disabled={deletingId === p.id}
                      className="shrink-0 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                    >
                      {deletingId === p.id ? '삭제 중...' : '삭제'}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}

      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
        >
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
            <h2 id="confirm-title" className="font-semibold text-slate-800 mb-2">
              정말 삭제하시겠습니까?
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              {confirmDelete.type === 'review' ? '이 후기' : '이 글'}를
              삭제하면 복구할 수 없습니다.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() =>
                  confirmDelete.type === 'review'
                    ? handleDeleteReview(confirmDelete.id)
                    : handleDeletePost(confirmDelete.id)
                }
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
