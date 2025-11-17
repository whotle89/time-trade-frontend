"use client"

import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Calendar, Bell, User } from "lucide-react"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface UserProfile {
  profile_image?: string
  nickname?: string
}

export default function FloatingHeader() {
  const [showHeader, setShowHeader] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    checkUserProfile()
  }, [])

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

  const checkUserProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      setIsLoggedIn(true)

      // profiles 테이블에서 프로필 이미지 가져오기
      const { data: profile } = await supabase
        .from('profiles')
        .select('profile_image, nickname')
        .eq('id', user.id)
        .single()

      if (profile?.profile_image) {
        setProfileImage(profile.profile_image)
      }
    }
  }

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
            z-50 transition-all
          "
        >
          <div className="max-w-[1000px] mx-auto flex justify-between items-center px-4 py-3">
            {/* ✅ 좌측 로고 */}
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="로고" width={100} height={100} />
            </div>

            {/* Right: Icon set */}
            <div className="flex items-center gap-8 mr-2">
              <Link href="/reminders" data-ga-id="home_calendar_icon">
                <Calendar className="h-6 w-6 text-gray-700" />
              </Link>

              <Link href="/notifications" data-ga-id="home_notification_icon">
                <Bell className="h-6 w-6 text-gray-700" />
              </Link>

              <Link href="/profile" data-ga-id="home_profile_icon">
                {isLoggedIn && profileImage ? (
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={profileImage} alt="프로필" />
                    <AvatarFallback className="bg-gray-200">
                      <User className="h-5 w-5 text-gray-700" />
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <User className="h-6 w-6 text-gray-700" />
                )}
              </Link>
            </div>
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
