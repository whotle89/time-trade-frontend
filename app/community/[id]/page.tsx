'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Heart, MessageCircle, Send } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Image from 'next/image';
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

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  author_name: string;
  is_anonymous: boolean;
  content: string;
  parent_id?: string;
  created_at: string;
  profile_image?: string;
}

export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (postId) {
      fetchPost();
      fetchComments();
      checkIfLiked();
    }
  }, [postId]);

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from('community_posts')
      .select(`
        *,
        profiles!community_posts_user_id_fkey(profile_image)
      `)
      .eq('id', postId)
      .single();

    if (error) {
      console.error('게시글 로드 실패:', error);
      toast.error('게시글을 불러올 수 없습니다');
      setLoading(false);
      return;
    }

    // Transform the data to flatten profile_image
    setPost({
      ...data,
      profile_image: data.profiles?.profile_image,
      profiles: undefined,
    });

    setLoading(false);
  };

  const fetchComments = async () => {
    const { data: commentsData, error } = await supabase
      .from('community_comments')
      .select(`
        *,
        profiles!community_comments_user_id_fkey(profile_image)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('댓글 로드 실패:', error);
      return;
    }

    // Transform the data to flatten profile_image
    const commentsWithProfiles = commentsData?.map((comment: any) => ({
      ...comment,
      profile_image: comment.profiles?.profile_image,
      profiles: undefined,
    })) || [];

    setComments(commentsWithProfiles);
  };

  const checkIfLiked = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('community_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .single();

    setIsLiked(!!data);
  };

  const handleLike = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('로그인이 필요합니다');
      return;
    }

    if (isLiked) {
      // 좋아요 취소
      const { error } = await supabase
        .from('community_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);

      if (!error) {
        setIsLiked(false);
        await supabase.rpc('decrement_post_likes', { post_id: postId });
        fetchPost();
      }
    } else {
      // 좋아요 추가
      const { error } = await supabase.from('community_likes').insert([
        { post_id: postId, user_id: user.id },
      ]);

      if (!error) {
        setIsLiked(true);
        await supabase.rpc('increment_post_likes', { post_id: postId });
        fetchPost();
      }
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      toast.error('댓글 내용을 입력해주세요');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('로그인이 필요합니다');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('nickname')
      .eq('id', user.id)
      .single();

    const { error } = await supabase.from('community_comments').insert([
      {
        post_id: postId,
        user_id: user.id,
        author_name: profile?.nickname || '사용자',
        is_anonymous: false,
        content: newComment.trim(),
        parent_id: replyTo,
      },
    ]);

    if (error) {
      toast.error('댓글 작성 실패');
    } else {
      toast.success(replyTo ? '답글이 작성되었습니다' : '댓글이 작성되었습니다');
      setNewComment('');
      setReplyTo(null);
      fetchComments();
      await supabase.rpc('increment_post_comments', { post_id: postId });
      fetchPost();
    }
  };

  const getTimeAgo = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: ko,
    });
  };

  // 댓글을 트리 구조로 변환
  const getCommentTree = () => {
    const tree: Comment[] = [];
    const childrenMap = new Map<string, Comment[]>();

    comments.forEach((comment) => {
      if (comment.parent_id) {
        if (!childrenMap.has(comment.parent_id)) {
          childrenMap.set(comment.parent_id, []);
        }
        childrenMap.get(comment.parent_id)!.push(comment);
      } else {
        tree.push(comment);
      }
    });

    return { tree, childrenMap };
  };

  const { tree: rootComments, childrenMap } = getCommentTree();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">로딩 중...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">게시글을 찾을 수 없습니다</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-4 py-4 border-b sticky top-0 bg-white z-10">
        <button onClick={() => router.back()} className="p-2">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold">게시글</h1>
        <div className="w-10" />
      </header>

      {/* 게시글 내용 */}
      <div className="p-4">
        {/* 작성자 정보 */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-12 h-12">
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
        <h2 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h2>

        {/* 내용 */}
        <p className="text-gray-700 whitespace-pre-wrap mb-4">{post.content}</p>

        {/* 이미지 */}
        {post.image_url && (
          <div className="mb-4">
            <Image
              src={post.image_url}
              alt="Post image"
              width={600}
              height={400}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
        )}

        {/* 좋아요/댓글 */}
        <div className="flex items-center gap-6 py-4 border-y">
          <button
            onClick={handleLike}
            className="flex items-center gap-2 hover:opacity-70"
          >
            <Heart
              className={`w-5 h-5 ${isLiked ? 'fill-[#FE398E] text-[#FE398E]' : 'text-gray-500'}`}
            />
            <span className={isLiked ? 'text-[#FE398E] font-medium' : 'text-gray-600'}>
              {post.likes_count || 0}
            </span>
          </button>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-gray-500" />
            <span className="text-gray-600">{post.comments_count || 0}</span>
          </div>
        </div>
      </div>

      {/* 댓글 목록 */}
      <div className="px-4 py-2 space-y-4">
        <h3 className="font-semibold text-gray-900">
          댓글 {post.comments_count || 0}
        </h3>

        {rootComments.map((comment) => (
          <div key={comment.id} className="space-y-2">
            {/* 부모 댓글 */}
            <div className="flex gap-3">
              <Avatar className="w-8 h-8 shrink-0">
                <AvatarImage src={comment.is_anonymous ? undefined : comment.profile_image || undefined} />
                <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                  {comment.is_anonymous ? '익' : comment.author_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium">
                    {comment.is_anonymous ? '익명' : comment.author_name}
                  </p>
                  <p className="text-xs text-gray-400">{getTimeAgo(comment.created_at)}</p>
                </div>
                <p className="text-sm text-gray-700 mb-2">{comment.content}</p>
                <button
                  onClick={() => setReplyTo(comment.id)}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  답글
                </button>
              </div>
            </div>

            {/* 대댓글 */}
            {childrenMap.get(comment.id)?.map((reply) => (
              <div key={reply.id} className="flex gap-3 ml-11">
                <Avatar className="w-7 h-7 shrink-0">
                  <AvatarImage src={reply.is_anonymous ? undefined : reply.profile_image || undefined} />
                  <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                    {reply.is_anonymous ? '익' : reply.author_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium">
                      {reply.is_anonymous ? '익명' : reply.author_name}
                    </p>
                    <p className="text-xs text-gray-400">{getTimeAgo(reply.created_at)}</p>
                  </div>
                  <p className="text-sm text-gray-700">{reply.content}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 댓글 입력 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        {replyTo && (
          <div className="flex items-center justify-between mb-2 text-sm text-gray-600">
            <span>답글 작성 중...</span>
            <button onClick={() => setReplyTo(null)} className="text-[#FE398E]">
              취소
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <Textarea
            placeholder={replyTo ? '답글을 입력하세요' : '댓글을 입력하세요'}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="resize-none"
            rows={2}
          />
          <Button
            onClick={handleCommentSubmit}
            className="bg-[#FE398E] hover:opacity-90 shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
