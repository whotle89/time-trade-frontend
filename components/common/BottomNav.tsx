"use client"

import { usePathname, useRouter } from "next/navigation"
import { Home, Clock, Users, MessageSquare } from "lucide-react"

export function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()

  const navItems = [
    { name: "홈", icon: Home, path: "/" },
    { name: "시간거래소", icon: Clock, path: "/slot/list" },
    { name: "친구찾기", icon: Users, path: "/friends" },
    { name: "채팅", icon: MessageSquare, path: "/chat" },
  ]

  return (
    <nav
      className="
        fixed bottom-0 left-0 w-full
        bg-white border-t border-gray-200
        flex justify-around items-center
        py-4
        pb-[calc(env(safe-area-inset-bottom)+1rem)]
        shadow-[0_-2px_10px_rgba(0,0,0,0.05)]
        z-50
      "
    >
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.path
        return (
          <button
            key={item.name}
            onClick={() => router.push(item.path)}
            className={`flex flex-col items-center text-sm font-medium transition-all ${
              isActive ? "text-[#FE398E]" : "text-gray-500"
            }`}
          >
            <Icon
              className={`w-6 h-6 mb-1 ${
                isActive ? "text-[#FE398E] fill-[#FE398E]" : "text-gray-500"
              }`}
            />
            {item.name}
          </button>
        )
      })}
    </nav>
  )
}
