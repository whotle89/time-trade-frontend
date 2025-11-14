import "./globals.css"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Toaster } from "sonner"
import FloatingHeader from "@/components/common/HomeHeader"

export const metadata = {
  title: "Time Trade",
  description: "시간을 거래하는 새로운 방식",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
      <html lang="ko">
        <body className={cn("min-h-screen bg-background text-foreground")}>
        <FloatingHeader />  {/* ✅ 스크롤 반응 헤더 */}
        <main className="pt-20 pb-40">{children}</main>  {/* ✅ 헤더 높이만큼 패딩 */}
          <Toaster richColors position="top-center" /> {/* ✅ toast 알림 */}
        </body>
      </html>
  )
}
