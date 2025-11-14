"use client"

import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Calendar, Bell, User } from "lucide-react"
import { useState, useEffect } from "react"

export default function FloatingHeader() {
  const [showHeader, setShowHeader] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        // 아래로 스크롤 → 헤더 숨김
        setShowHeader(false)
      } else {
        // 위로 스크롤 → 헤더 노출
        setShowHeader(true)
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <AnimatePresence>
      {showHeader && (
        <motion.header
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="
            fixed top-0 left-0 w-full
            bg-white/90 backdrop-blur-md shadow-sm
            flex justify-between items-center px-4 py-3
            z-50 transition-all
          "
        >
          {/* ✅ 좌측 로고 */}
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="로고" width={100} height={100} />
          </div>

          {/* Right: Icon set */}
          <div className="flex items-center gap-8 mr-2">
            <Link href="/schedule" data-ga-id="home_calendar_icon">
              <Calendar className="h-6 w-6 text-gray-700" />
            </Link>

            <Link href="/notifications" data-ga-id="home_notification_icon">
              <Bell className="h-6 w-6 text-gray-700" />
            </Link>

            <Link href="/profile" data-ga-id="home_profile_icon">
              <User className="h-6 w-6 text-gray-700" />
            </Link>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  )
}

export function HomeHeader() {
  return (
    <header className="w-full h-16 flex items-center justify-between px-4 bg-white">

      {/* Left: Logo + Brand */}
      <div className="flex items-center gap-2">
        <Image
          src="/logo.png"     // public/logo.png 파일로 넣어두면 됨
          alt="logo"
          width={100}
          height={100}
        />
      </div>

      {/* Right: Icon set */}
      <div className="flex items-center gap-8 mr-2">
        <Link href="/schedule" data-ga-id="home_calendar_icon">
          <Calendar className="h-6 w-6 text-gray-700" />
        </Link>

        <Link href="/notifications" data-ga-id="home_notification_icon">
          <Bell className="h-6 w-6 text-gray-700" />
        </Link>

        <Link href="/profile" data-ga-id="home_profile_icon">
          <User className="h-6 w-6 text-gray-700" />
        </Link>
      </div>
    </header>
  )
}
