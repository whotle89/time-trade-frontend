import "./globals.css"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Toaster } from "sonner"
import { PageLoadingSpinner } from "@/components/common/PageLoadingSpinner"

export const metadata = {
  title: "Time Trade",
  description: "시간을 거래하는 새로운 방식",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
      <html lang="ko">
        <body className={cn("min-h-screen bg-background text-foreground")}>
          {children}
          <Toaster richColors position="top-center" /> {/* ✅ toast 알림 */}
          <PageLoadingSpinner /> {/* ✅ 페이지 전환 로딩 스피너 */}
        </body>
      </html>
  )
}
