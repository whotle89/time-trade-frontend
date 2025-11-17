'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Flag } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, startOfDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import FloatingAddButton from '@/components/home/FloatingAddButton';

export default function RemindersPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [reminders, setReminders] = useState<any[]>([]);
  const [doneReminders, setDoneReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [monthReminders, setMonthReminders] = useState<any[]>([]);

  // 달력 날짜 생성
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // 요일 헤더
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  // 첫 번째 날의 요일 (0: 일요일)
  const firstDayOfWeek = monthStart.getDay();

  // 해당 날짜에 일정이 있는지 확인하는 함수
  const hasReminders = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return monthReminders.some(r => r.date === dateStr);
  };

  // 해당 월의 모든 리마인더 불러오기 (달력 표시용)
  const fetchMonthReminders = async () => {
    const startStr = format(monthStart, 'yyyy-MM-dd');
    const endStr = format(monthEnd, 'yyyy-MM-dd');

    const { data, error } = await supabase
      .from('reminders')
      .select('date')
      .gte('date', startStr)
      .lte('date', endStr);

    if (error) {
      console.error('❌ 월간 일정 로드 실패:', error.message);
      return;
    }

    setMonthReminders(data || []);
  };

  // 선택된 날짜의 리마인더 불러오기
  const fetchReminders = async (date: Date) => {
    setLoading(true);
    const dateStr = format(date, 'yyyy-MM-dd');

    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('date', dateStr)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('❌ 일정 로드 실패:', error.message);
      return;
    }

    const active = data.filter((r) => r.status !== 'done');
    const done = data.filter((r) => r.status === 'done');
    setReminders(active);
    setDoneReminders(done);
    setLoading(false);
  };

  useEffect(() => {
    fetchMonthReminders();
  }, [currentMonth]);

  useEffect(() => {
    fetchReminders(selectedDate);
  }, [selectedDate]);

  // 완료 토글
  const handleToggleDone = async (id: string, isDone: boolean) => {
    const newStatus = isDone ? 'done' : 'pending';
    const { error } = await supabase
      .from('reminders')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      console.error('❌ 상태 변경 실패:', error.message);
    } else {
      fetchReminders(selectedDate);
    }
  };

  // 완료 항목 삭제
  const handleDeleteDone = async (id: string) => {
    const { error } = await supabase.from('reminders').delete().eq('id', id);
    if (error) console.error('❌ 삭제 실패:', error.message);
    fetchReminders(selectedDate);
  };

  // 전체 완료 삭제
  const handleDeleteAllDone = async () => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const { error } = await supabase
      .from('reminders')
      .delete()
      .eq('status', 'done')
      .eq('date', dateStr);
    if (error) console.error('❌ 전체 삭제 실패:', error.message);
    fetchReminders(selectedDate);
    fetchMonthReminders(); // 달력 표시 업데이트
  };

  const today = startOfDay(new Date());
  const isToday = isSameDay(selectedDate, today);
  const isPast = isBefore(startOfDay(selectedDate), today);

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-4 py-4 border-b sticky top-0 bg-white z-10">
        <button onClick={() => router.back()} className="p-2">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold">내 일정관리</h1>
        <div className="w-10" />
      </header>

      {/* 달력 */}
      <div className="px-4 py-6">
        <div className="mb-4 text-center">
          <h2 className="text-xl font-bold text-gray-900">
            {format(currentMonth, 'yyyy년 M월', { locale: ko })}
          </h2>
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day, idx) => (
            <div
              key={idx}
              className={`text-center text-sm font-semibold ${
                idx === 0 ? 'text-red-500' : idx === 6 ? 'text-blue-500' : 'text-gray-600'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 gap-2">
          {/* 빈 칸 채우기 */}
          {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
            <div key={`empty-${idx}`} />
          ))}

          {/* 날짜 */}
          {daysInMonth.map((day) => {
            const isSelected = isSameDay(day, selectedDate);
            const isTodayDate = isSameDay(day, today);
            const isPastDate = isBefore(day, today);
            const hasReminderToday = hasReminders(day);

            return (
              <button
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={`
                  aspect-square rounded-lg flex flex-col items-center justify-center text-sm font-medium
                  transition-colors relative
                  ${isSelected ? 'bg-[#FE398E] text-white' : ''}
                  ${!isSelected && isTodayDate ? 'bg-gray-100 text-gray-900 font-bold' : ''}
                  ${!isSelected && isPastDate && !isTodayDate ? 'text-gray-400' : ''}
                  ${!isSelected && !isPastDate && !isTodayDate ? 'text-gray-900 hover:bg-gray-100' : ''}
                `}
              >
                {format(day, 'd')}
                {hasReminderToday && (
                  <div className={`absolute bottom-1 w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-[#FE398E]'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 할일 목록 */}
      <div className="px-4 space-y-8">
        {/* 할일 섹션 */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">
              {isToday ? '오늘 할일' : `${format(selectedDate, 'M월 d일', { locale: ko })} 할일`}
            </h2>
          </div>

          {loading ? (
            <p className="text-gray-400 text-sm">불러오는 중...</p>
          ) : reminders.length === 0 ? (
            <p className="text-gray-400 text-sm">
              {isPast ? '할일이 없었어요' : '할일이 없어요'}
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {reminders.map((r) => (
                <Card
                  key={r.id}
                  onClick={() => handleToggleDone(r.id, true)}
                  className="flex justify-between items-left p-5 bg-gray-100 rounded-xl cursor-pointer"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <Checkbox
                      checked={false}
                      onCheckedChange={() => handleToggleDone(r.id, true)}
                      className="shrink-0"
                    />
                    <span className="text-gray-800 font-medium">{r.content}</span>
                  </div>
                  {r.is_important && (
                    <Flag className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
                  )}
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* 완료 섹션 */}
        {doneReminders.length > 0 && (
          <section>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">
                {isToday ? '오늘 완료' : `${format(selectedDate, 'M월 d일', { locale: ko })} 완료`}
              </h2>
              <Trash2
                className="w-5 h-5 text-gray-600 cursor-pointer"
                onClick={handleDeleteAllDone}
              />
            </div>

            <div className="flex flex-col gap-3">
              {doneReminders.map((r) => (
                <Card
                  key={r.id}
                  className="flex justify-between items-left p-5 bg-gray-100 rounded-xl opacity-60"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <Checkbox
                      checked={true}
                      onCheckedChange={() => handleToggleDone(r.id, false)}
                      className="mt-0.5"
                    />
                    <span className="line-through text-gray-500">{r.content}</span>
                    <button
                      onClick={() => handleDeleteDone(r.id)}
                      className="flex justify-end items-center gap-4 flex-1 text-sm text-gray-500 transition font-medium"
                    >
                      삭제
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* 플로팅 추가 버튼 */}
      <FloatingAddButton onAdded={() => {
        fetchReminders(selectedDate);
        fetchMonthReminders(); // 달력 표시 업데이트
      }} />
    </div>
  );
}
