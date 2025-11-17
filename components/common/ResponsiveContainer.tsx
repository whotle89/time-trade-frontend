"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ResponsiveContainerProps {
  children: ReactNode
  className?: string
  /** PC 화면에서 최대 너비 (기본값: 1000px) */
  maxWidth?: string
}

/**
 * 반응형 컨테이너 컴포넌트
 * - 모바일: 전체 너비 사용
 * - PC (1000px 이상): 중앙 정렬 + 최대 너비 제한
 */
export function ResponsiveContainer({
  children,
  className,
  maxWidth = "1000px",
}: ResponsiveContainerProps) {
  return (
    <div
      className={cn("w-full mx-auto lg:max-w-[1000px]", className)}
      style={{
        maxWidth: maxWidth,
      }}
    >
      {children}
    </div>
  )
}
