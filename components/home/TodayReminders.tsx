"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Trash2, Flag } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"

export default function TodayReminders() {
  const [todayReminders, setTodayReminders] = useState<any[]>([])
  const [doneReminders, setDoneReminders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const getKSTDate = () => {
    const now = new Date()
    const offset = now.getTime() + 9 * 60 * 60 * 1000
    return new Date(offset).toISOString().split("T")[0]
  }
  const today = getKSTDate() // ✅ 한국날짜로 불러오기


  // ✅ 리마인더 불러오기
  const fetchReminders = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("reminders")
      .select("*")
      .eq("date", today)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("❌ 일정 로드 실패:", error.message)
      return
    }

    const active = data.filter((r) => r.status !== "done")
    const done = data.filter((r) => r.status === "done")
    setTodayReminders(active)
    setDoneReminders(done)
    setLoading(false)
  }

  useEffect(() => {
    fetchReminders()

    // ✅ 실시간 구독 등록
    const channel = supabase
      .channel("realtime:reminders")
      .on(
        "postgres_changes",
        {
          event: "*", // INSERT / UPDATE / DELETE 모두 수신
          schema: "public",
          table: "reminders",
        },
        (payload) => {
          console.log("📡 실시간 업데이트:", payload)
          fetchReminders() // ✅ 변경 감지 시 데이터 재조회
        }
      )
      .subscribe()

    // ✅ cleanup (언마운트 시 구독 해제)
    return () => {
      channel.unsubscribe() // ✅ 이렇게 변경
    }
  }, [])


  // ✅ 완료 토글
  const handleToggleDone = async (id: string, isDone: boolean) => {
    const newStatus = isDone ? "done" : "pending"
    const { error } = await supabase
      .from("reminders")
      .update({ status: newStatus })
      .eq("id", id)

    if (error) {
      console.error("❌ 상태 변경 실패:", error.message)
    } else {
      setTodayReminders((prev) =>
        isDone ? prev.filter((r) => r.id !== id) : [...prev]
      )
      fetchReminders() // ✅ DB 최신 반영
    }
  }

  // ✅ 완료 항목목 삭제
  const handleDeleteDone = async (id: string) => {
    const { error } = await supabase.from("reminders").delete().eq("id", id)
    if (error) console.error("❌ 삭제 실패:", error.message)
    fetchReminders()
  }

  // ✅ 전체 완료 삭제
  const handleDeleteAllDone = async () => {
    const { error } = await supabase.from("reminders").delete().eq("status", "done").eq("date", today)
    if (error) console.error("❌ 전체 삭제 실패:", error.message)
    fetchReminders()
  }

  return (
    <div className="mt-8 px-4 space-y-8">
      {/* 오늘 할일 */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">오늘 할일</h2>
        </div>

        {loading ? (
          <p className="text-gray-400 text-sm">불러오는 중...</p>
        ) : todayReminders.length === 0 ? (
          <p className="text-gray-400 text-sm">오늘 할일이 없어요</p>
        ) : (
          <div className="flex flex-col gap-3">
            {todayReminders.map((r) => (
              <Card
                key={r.id}
                // ✅ 카드 클릭 시 완료로 이동
                onClick={() => handleToggleDone(r.id, true)}
                className="flex justify-between items-left p-5 bg-gray-100 rounded-xl"
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

      {/* 오늘 완료 */}
      {doneReminders.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">오늘 완료</h2>
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
  )
}
