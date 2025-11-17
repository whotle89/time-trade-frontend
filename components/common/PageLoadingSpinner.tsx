"use client"

import { useEffect, useState, useTransition } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

export function PageLoadingSpinner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [prevPath, setPrevPath] = useState("")

  useEffect(() => {
    const currentPath = pathname + (searchParams?.toString() || "")

    // 경로가 실제로 변경되었을 때만 로딩 시작
    if (prevPath && prevPath !== currentPath) {
      setLoading(true)

      // 짧은 시간 후 로딩 종료 (실제 페이지 렌더링 완료 시)
      const timer = setTimeout(() => {
        setLoading(false)
      }, 200)

      return () => clearTimeout(timer)
    } else {
      // 초기 로드 시에는 로딩 표시 안 함
      setPrevPath(currentPath)
      setLoading(false)
    }
  }, [pathname, searchParams])

  if (!loading) return null

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-10 h-10 text-[#FE398E] animate-spin" />
        <p className="text-sm text-gray-600 font-medium">로딩 중...</p>
      </div>
    </div>
  )
}
