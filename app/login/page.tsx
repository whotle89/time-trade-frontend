'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  // 카카오 로그인
  const handleKakaoLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) console.error('❌ 카카오 로그인 실패:', error.message);
  };

  // 구글 로그인
  const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) console.error('❌ 구글 로그인 실패:', error.message);
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-white px-6 py-12 lg:py-20">
      {/* 상단: 로고 */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-8 lg:gap-12">
          <Image
            src="/logo.png"
            alt="Time Trade Logo"
            width={230}
            height={230}
            className="object-contain lg:w-[280px] lg:h-[280px]"
          />

          {/* 슬로건 */}
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 text-center">
            남은 시간을 알차게, <span className="whitespace-nowrap">Time IS Gold</span>
          </h1>
        </div>
      </div>

      {/* 하단: 로그인 버튼들 */}
      <div className="w-full max-w-md lg:max-w-lg flex flex-col gap-4">
        {/* 카카오 로그인 */}
        <button
          onClick={handleKakaoLogin}
          className="w-full bg-[#FEE500] text-gray-900 font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 hover:bg-[#FDD835] transition-colors"
        >
          <MessageCircle className="w-6 h-6 fill-gray-900" />
          카카오로 로그인
        </button>

        {/* 구글 로그인 */}
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white text-gray-700 font-semibold py-4 px-6 rounded-xl border border-gray-300 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          구글로 로그인하기
        </button>

        {/* 일반회원 로그인 */}
        <Link
          href="/login/email"
          className="text-center text-gray-700 font-medium py-2 underline underline-offset-4 hover:text-gray-900 transition-colors"
        >
          일반회원 로그인
        </Link>
      </div>
    </div>
  );
}
