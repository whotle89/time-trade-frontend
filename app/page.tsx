"use client"
import { Button } from "@/components/ui/button"
import FloatingHeader from "@/components/common/HomeHeader"
import { BannerCarousel } from "@/components/common/banner-carousel"
import { MenuCard } from "@/components/common/menu-card"
import TodayReminders from "@/components/home/TodayReminders"
import FloatingAddButton from "@/components/home/FloatingAddButton"
import { useState } from "react"
import { BottomNav } from "@/components/common/BottomNav"
import { ResponsiveContainer } from "@/components/common/ResponsiveContainer"

export default function Page() {
  const [refreshKey, setRefreshKey] = useState(0)
  const handleAdded = () => setRefreshKey((prev) => prev + 1)

  return (
    <>
    <FloatingHeader />  {/* ✅ 스크롤 반응 헤더 */}
    <ResponsiveContainer>
      <main className="pt-20 pb-40 lg:pb-20">{/* ✅ PC에서는 하단 네비 없으므로 pb 조정 */}
      <div>
        <BannerCarousel />
      </div>
      <section>
        {/* 메뉴 카드 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 ml-5 mr-5 mt-6">
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
            href="/reminders"
            image="/menu3.png"
          />
          <MenuCard
            title="커뮤니티"
            href="/community"
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
    </ResponsiveContainer>
    {/* ✅ 하단 고정 네비게이션 */}
    <BottomNav />
    </>
  )
}
