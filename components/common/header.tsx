"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function AppHeader({
    title,
    back = true,
  }: {
    title: string
    back?: boolean
  }) {
    const router = useRouter()

    return (
      <header className="w-full flex items-center justify-between px-4 h-14 bg-white">
        {/* 왼쪽 영역 */}
        <div className="w-10 flex items-center">
          {back && (
            <button
            onClick={() => router.back()}
            data-ga-event-name="back"
            className="p-0 bg-transparent border-none outline-none"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
        </div>
  
        {/* 가운데 타이틀 */}
        <h1 className="text-[18px] font-semibold text-center flex-1">
          {title}
        </h1>
  
        {/* 오른쪽 영역 (균형 맞추기용) */}
        <div className="w-7" />
      </header>
    )
  }