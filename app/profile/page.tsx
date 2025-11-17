'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface UserProfile {
  id: string;
  nickname?: string;
  profile_image?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    // 1. 인증된 사용자 확인
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error('로그인이 필요합니다');
      router.push('/login');
      return;
    }

    setUser(user);

    // 2. profiles 테이블에서 프로필 정보 가져오기
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('id, nickname, profile_image')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('프로필 로드 실패:', error);
    } else {
      setProfile(profileData);
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error('로그아웃 실패', { description: error.message });
    } else {
      toast.success('로그아웃되었습니다');
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  const displayName = profile?.nickname || '사용자';
  const avatarUrl = profile?.profile_image;
  const email = user?.email || '환영합니다';

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-4 py-4 border-b">
        <button onClick={() => router.back()} className="p-2">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold">마이페이지</h1>
        <div className="w-10" /> {/* 중앙 정렬을 위한 빈 공간 */}
      </header>

      {/* 프로필 섹션 */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-16 h-16">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback className="bg-gray-200 text-gray-600 text-xl">
              {displayName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xl font-bold text-gray-900">{displayName}</p>
            <p className="text-sm text-gray-500">{email}</p>
          </div>
        </div>

        {/* 내 프로필 편집하기 버튼 */}
        <button className="w-full py-3 px-4 bg-white border border-gray-300 rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors">
          <span className="font-medium text-gray-700">내 프로필 편집하기</span>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* 메뉴 섹션 */}
      <div className="px-6 py-2">
        {/* 문의/안내 */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 mb-3">문의/안내</h2>
          <MenuButton title="공지사항" />
          <MenuButton title="자주 묻는 질문" />
          <MenuButton title="1:1 문의하기" />
        </div>

        {/* 혜택 */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 mb-3">혜택</h2>
          <MenuButton title="이벤트" />
          <MenuButton title="기획전" />
        </div>

        {/* 서비스 관리 */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 mb-3">서비스 관리</h2>
          <MenuButton title="설정" />
          <MenuButton title="로그아웃" onClick={handleLogout} />
        </div>

        {/* 버전 정보 */}
        <div className="flex items-center justify-between py-3 text-sm text-gray-500">
          <span>버전정보</span>
          <span>v1.0.0</span>
        </div>
      </div>
    </div>
  );
}

function MenuButton({ title, onClick }: { title: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
    >
      <span className="text-gray-900">{title}</span>
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </button>
  );
}
