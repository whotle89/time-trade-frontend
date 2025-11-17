'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function EmailLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      toast.error('로그인 실패', {
        description: error.message,
      });
    } else {
      toast.success('로그인 성공!');
      router.push('/');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white px-6 py-8">
      {/* 상단: 뒤로가기 */}
      <div className="mb-8">
        <Link href="/login">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
      </div>

      {/* 메인: 로그인 폼 */}
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">로그인</h1>
        <p className="text-gray-600 mb-8">이메일과 비밀번호로 로그인하세요</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
              이메일
            </label>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700 mb-2 block">
              비밀번호
            </label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#FE398E] hover:bg-[#E5307E] text-white font-semibold py-6 rounded-xl mt-4"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>
        </form>

        {/* 회원가입 링크 */}
        <div className="mt-6 text-center">
          <span className="text-gray-600">아직 회원이 아니신가요? </span>
          <Link href="/signup" className="text-[#FE398E] font-semibold hover:underline">
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
