"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Plus, Calendar as CalendarIcon } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { toast } from "sonner"

console.log("✅ Supabase 연결 성공:", supabase);

export default function FloatingAddButton({ onAdded }: { onAdded?: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [newTask, setNewTask] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [calendarOpen, setCalendarOpen] = useState(false)

  // ✅ 일정 추가 로직
  const handleAddReminder = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      toast.error("로그인이 필요합니다 😥")
      return
    }
    if (!newTask.trim()) {
      toast.error("일정을 입력해주세요 ✏️")
      return
    }

    const dateStr = selectedDate.toISOString().split("T")[0]

    const { error } = await supabase.from("reminders").insert([
      {
        user_id: user.id,
        content: newTask,
        date: dateStr,
        status: "pending",
      },
    ])

    if (error) {
      toast.error("일정 추가 실패 😥", { description: error.message })
    } else {
      toast.success("일정이 추가되었습니다 ✅", {
        description: `${format(selectedDate, "yyyy년 M월 d일 (EEE)", { locale: ko })} — ${newTask}`,
      })
      setNewTask("")
      setSelectedDate(new Date()) // ✅ 저장 후 다시 오늘로 초기화
      setIsOpen(false)
      onAdded?.()
    }
  }

  return (
    <>
      {/* ✅ 플로팅 버튼 */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-[#FE398E] text-white rounded-full shadow-lg flex items-center justify-center hover:opacity-90"
      >
        <Plus size={28} />
      </button>

      {/* ✅ 슬라이드업 시트 */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl p-6 pb-10 bg-white">
          <SheetHeader>
            <SheetTitle className="text-lg font-semibold text-gray-800">
              새 일정 추가
            </SheetTitle>
          </SheetHeader>

          {/* 🔹 날짜 선택 */}
          <div className="mt-5">
            <label className="text-sm font-medium text-gray-700">날짜 선택</label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-start w-full mt-2 text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(selectedDate, "yyyy년 M월 d일 (EEE)", { locale: ko })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) setSelectedDate(date)
                    setCalendarOpen(false)
                  }}
                  locale={ko}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* 🔹 일정 입력 */}
          <div className="mt-5">
            <label className="text-sm font-medium text-gray-700">일정 내용</label>
            <Input
              placeholder="예: 회의 / 운동 / 약속"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="mt-2"
            />
          </div>

          <SheetFooter className="mt-6">
            <Button
              onClick={handleAddReminder}
              className="w-full bg-[#FE398E] hover:opacity-90 text-white font-semibold py-2.5 rounded-lg"
            >
              저장
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}
