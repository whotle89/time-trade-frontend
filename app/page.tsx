"use client"
import { Button } from "@/components/ui/button"
import { HomeHeader } from "@/components/common/HomeHeader"
import { BannerCarousel } from "@/components/common/banner-carousel"
import { MenuCard } from "@/components/common/menu-card"
import TodayReminders from "@/components/home/TodayReminders"
import FloatingAddButton from "@/components/home/FloatingAddButton"
import { useState } from "react"
import { BottomNav } from "@/components/common/BottomNav"

export default function Page() {
  const [refreshKey, setRefreshKey] = useState(0)
  const handleAdded = () => setRefreshKey((prev) => prev + 1)

  return (
    <>
    <main>
      <div>
        <BannerCarousel />
      </div>
      <section>
        {/* 메뉴 카드 */}
        <div className="grid grid-cols-2 gap-4 ml-5 mr-5 mt-6">
          <MenuCard
            title="시간 거래소"
            href="/slots"
            image="/menu1.png"
          />
          <MenuCard
            title="내 예약"
            href=""
            image="/menu2.png"
          />
          <MenuCard
            title="내 일정관리"
            href=""
            image="/menu3.png"
          />
          <MenuCard
            title="커뮤니티"
            href=""
            image="/menu4.png"
          />
        </div>
      </section>
      <section>
        <TodayReminders />
      </section>

      {/* ✅ 홈 전역 플로팅 버튼 */}
      <FloatingAddButton onAdded={handleAdded} />
    </main>
    {/* ✅ 하단 고정 네비게이션 */}
    <BottomNav />
    </>
  )
}
