'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Heart, MessageCircle, Plus } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Post {
  id: string;
  user_id: string;
  author_name: string;
  is_anonymous: boolean;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
  profile_image?: string;
}

export default function CommunityPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('community_posts')
      .select(`
        *,
        profiles!community_posts_user_id_fkey(profile_image)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('게시글 로드 실패:', error);
    } else {
      // Transform the data to flatten profile_image
      const transformedData = data?.map((post: any) => ({
        ...post,
        profile_image: post.profiles?.profile_image,
        profiles: undefined,
      })) || [];
      setPosts(transformedData);
    }
    setLoading(false);
  };

  const getTimeAgo = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: ko,
    });
  };

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-4 py-4 border-b sticky top-0 bg-white z-10">
        <button onClick={() => router.back()} className="p-2">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold">커뮤니티</h1>
        <div className="w-10" />
      </header>

      {/* 게시글 리스트 */}
      <div className="p-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-400">로딩 중...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-400">작성된 게시글이 없습니다</p>
          </div>
        ) : (
          posts.map((post) => (
            <Card
              key={post.id}
              onClick={() => router.push(`/community/${post.id}`)}
              className="p-4 hover:bg-gray-50 cursor-pointer transition-all border border-gray-300 rounded-xl shadow-sm hover:shadow-md"
            >
              {/* 작성자 정보 */}
              <div className="flex items-center gap-3 mb-2">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={post.is_anonymous ? undefined : post.profile_image || undefined} />
                  <AvatarFallback className="bg-gray-200 text-gray-600">
                    {post.is_anonymous ? '익' : post.author_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">
                    {post.is_anonymous ? '익명' : post.author_name}
                  </p>
                  <p className="text-xs text-gray-500">{getTimeAgo(post.created_at)}</p>
                </div>
              </div>

              {/* 제목 */}
              <h3 className="font-bold text-gray-900 mb-0.5 line-clamp-2">
                {post.title}
              </h3>

              {/* 내용 미리보기 */}
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {post.content}
              </p>

              {/* 통계 */}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span className="text-[#FE398E]">{post.likes_count || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.comments_count || 0}</span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* 플로팅 글쓰기 버튼 */}
      <button
        onClick={() => router.push('/community/new')}
        className="fixed bottom-24 right-6 lg:bottom-10 z-50 w-14 h-14 bg-[#FE398E] text-white rounded-full shadow-lg flex items-center justify-center hover:opacity-90"
      >
        <Plus size={28} />
      </button>
    </div>
  );
}
