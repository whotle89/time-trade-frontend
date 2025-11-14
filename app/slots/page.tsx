"use client"

import { SlotCard } from "@/components/common/slot-card"
import Link from "next/link"
import { FloatingButton } from "@/components/common/floating-button"
import { AppHeader } from "@/components/common/header"

const mockSlots = [
  { id: 1, title: "디자인 피드백 30분", time: "13:00 ~ 13:30" },
  { id: 2, title: "프론트 개발 도와드릴게요", time: "15:00 ~ 16:00" },
]

export default function SlotListPage() {
  return (
    <main className="p-6 space-y-4">
        <AppHeader title="시간 슬롯" />

      <div className="space-y-3">
        {mockSlots.map((slot) => (
          <SlotCard key={slot.id} slot={slot} />
        ))}
      </div>
      <FloatingButton />
    </main>
  )
}