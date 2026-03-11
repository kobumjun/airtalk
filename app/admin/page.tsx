'use client';

import { useEffect, useState } from 'react';
import AdminReviewForm from '@/components/AdminReviewForm';

export default function AdminPage() {
  const [auth, setAuth] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/session')
      .then((res) => res.json())
      .then((data) => setAuth(data.ok === true))
      .catch(() => setAuth(false));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.ok) {
      setAuth(true);
    } else {
      setError(data.error || '비밀번호가 올바르지 않습니다.');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAuth(false);
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
            <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>
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
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg"
          >
            로그인
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">관리자페이지</h1>
        <button
          type="button"
          onClick={handleLogout}
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          로그아웃
        </button>
      </div>
      <AdminReviewForm />
    </div>
  );
}
