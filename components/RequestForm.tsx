'use client';

import { useState } from 'react';

type Props = {
  onSubmit: (address: string, phone: string, symptom: string) => void;
};

export default function RequestForm({ onSubmit }: Props) {
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [symptom, setSymptom] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!address.trim() || !phone.trim() || !symptom.trim()) {
      setError('주소, 핸드폰번호, 증상을 모두 입력해 주세요.');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.set('address', address.trim());
      formData.set('phone', phone.trim());
      formData.set('symptom', symptom.trim());
      if (photo) formData.set('photo', photo);

      const res = await fetch('/api/requests', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || '접수 저장에 실패했습니다.');
      }
      onSubmit(address.trim(), phone.trim(), symptom.trim());
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

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1">
          주소 *
        </label>
        <input
          id="address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
          placeholder="주소를 입력하세요"
          required
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
          핸드폰번호 *
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
          placeholder="010-0000-0000"
          required
        />
      </div>

      <div>
        <label htmlFor="symptom" className="block text-sm font-medium text-slate-700 mb-1">
          증상 *
        </label>
        <textarea
          id="symptom"
          value={symptom}
          onChange={(e) => setSymptom(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
          placeholder="증상을 입력하세요"
          required
        />
      </div>

      <div>
        <label htmlFor="photo" className="block text-sm font-medium text-slate-700 mb-1">
          실외기 위치 사진 (선택)
        </label>
        <input
          id="photo"
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
          className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-sky-50 file:text-sky-700"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-400 text-white font-semibold rounded-xl transition"
      >
        {loading ? '저장 중...' : '접수하기'}
      </button>
    </form>
  );
}
