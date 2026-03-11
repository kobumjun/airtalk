'use client';

import { useState } from 'react';
import Link from 'next/link';
import RequestForm from '@/components/RequestForm';

const PHONE_RAW = '01058164415';

export default function RequestPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (address: string, phone: string, symptom: string) => {
    const body = [
      '새 접수',
      '',
      `주소: ${address}`,
      `핸드폰번호: ${phone}`,
      `증상: ${symptom}`,
    ].join('\n');
    const smsUrl = `sms:${PHONE_RAW}?body=${encodeURIComponent(body)}`;
    window.open(smsUrl, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-2xl font-bold text-gray-50 mb-6">접수폼</h1>

      <div className="prose prose-invert max-w-none mb-8 p-5 bg-slate-800/95 rounded-2xl border border-white/10 text-sm text-gray-200 whitespace-pre-line shadow-lg">
        에어컨 설치,수리,가스충전,철거,청소

        안녕하세요😄
        에어컨수리,설치,철거,청소,가스충전 전문업체 입니다.

        대표번호: 010-5816-4415
        블로그: m.blog.naver.com/han082755

        빠른 방문을 위해 아래 정보를 입력해주세요.
      </div>

      {submitted ? (
        <div className="p-6 bg-slate-800/95 border border-white/10 rounded-2xl text-center shadow-lg">
          <p className="text-amber-300 font-medium mb-2">접수가 완료되었습니다.</p>
          <p className="text-sm text-gray-200 mb-4">
            SMS 앱이 열렸다면 메시지를 전송해 주세요. DB에도 저장되었습니다.
          </p>
          <Link
            href="/"
            className="text-amber-400 hover:text-amber-300 font-medium"
          >
            홈으로
          </Link>
        </div>
      ) : (
        <RequestForm onSubmit={handleSubmit} />
      )}
    </div>
  );
}
