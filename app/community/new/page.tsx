'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Image as ImageIcon, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import Image from 'next/image';

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('이미지 크기는 5MB 이하여야 합니다');
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('제목과 내용을 입력해주세요');
      return;
    }

    setIsSubmitting(true);

    try {
      // 사용자 정보 가져오기
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('로그인이 필요합니다');
        router.push('/login');
        return;
      }

      // 프로필 정보 가져오기
      const { data: profile } = await supabase
        .from('profiles')
        .select('nickname')
        .eq('id', user.id)
        .single();

      let imageUrl = null;

      // 이미지 업로드
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `community/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, imageFile);

        if (uploadError) {
          console.error('이미지 업로드 실패:', uploadError);
          toast.error('이미지 업로드에 실패했습니다');
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(filePath);
          imageUrl = publicUrl;
        }
      }

      // 게시글 작성
      const { error } = await supabase.from('community_posts').insert([
        {
          user_id: user.id,
          author_name: profile?.nickname || '사용자',
          is_anonymous: isAnonymous,
          title: title.trim(),
          content: content.trim(),
          image_url: imageUrl,
          likes_count: 0,
          comments_count: 0,
        },
      ]);

      if (error) {
        toast.error('게시글 작성 실패', { description: error.message });
      } else {
        toast.success('게시글이 작성되었습니다');
        router.push('/community');
      }
    } catch (error) {
      console.error('게시글 작성 오류:', error);
      toast.error('게시글 작성 중 오류가 발생했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-4 py-4 border-b sticky top-0 bg-white z-10">
        <button onClick={() => router.back()} className="p-2">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold">글쓰기</h1>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-[#FE398E] hover:opacity-90 text-white px-4"
        >
          {isSubmitting ? '작성 중...' : '완료'}
        </Button>
      </header>

      <div className="p-4 space-y-4">
        {/* 익명 토글 */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">익명으로 작성</p>
            <p className="text-sm text-gray-500">닉네임 대신 익명으로 표시됩니다</p>
          </div>
          <Switch checked={isAnonymous} onCheckedChange={setIsAnonymous} />
        </div>

        {/* 제목 */}
        <div>
          <Input
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-medium"
            maxLength={100}
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{title.length}/100</p>
        </div>

        {/* 내용 */}
        <div>
          <Textarea
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[300px] resize-none"
            maxLength={2000}
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{content.length}/2000</p>
        </div>

        {/* 이미지 미리보기 */}
        {imagePreview && (
          <div className="relative">
            <Image
              src={imagePreview}
              alt="Preview"
              width={400}
              height={300}
              className="w-full h-auto rounded-lg object-cover"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-black/70"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 이미지 추가 버튼 */}
        {!imagePreview && (
          <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#FE398E] hover:bg-gray-50 transition-colors">
            <ImageIcon className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600">이미지 추가</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  );
}
