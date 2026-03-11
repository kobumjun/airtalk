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
        <label htmlFor="address" className="block text-sm font-medium text-gray-200 mb-1">
          주소 *
        </label>
        <input
          id="address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full px-4 py-2 border border-stone-700 rounded-lg bg-neutral-900 text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          placeholder="주소를 입력하세요"
          required
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-200 mb-1">
          핸드폰번호 *
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-2 border border-stone-700 rounded-lg bg-neutral-900 text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          placeholder="010-0000-0000"
          required
        />
      </div>

      <div>
        <label htmlFor="symptom" className="block text-sm font-medium text-gray-200 mb-1">
          증상 *
        </label>
        <textarea
          id="symptom"
          value={symptom}
          onChange={(e) => setSymptom(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-stone-700 rounded-lg bg-neutral-900 text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          placeholder="증상을 입력하세요"
          required
        />
      </div>

      <div>
        <label htmlFor="photo" className="block text-sm font-medium text-gray-200 mb-1">
          실외기 위치 사진 (선택)
        </label>
        <input
          id="photo"
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
          className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-stone-800 file:text-gray-50"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 disabled:bg-stone-600 text-white font-semibold rounded-xl transition shadow-md"
      >
        {loading ? '저장 중...' : '접수하기'}
      </button>
    </form>
  );
}
