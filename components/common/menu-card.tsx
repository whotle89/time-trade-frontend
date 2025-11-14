"use client"

import Image from "next/image"
import Link from "next/link"

interface MenuCardProps {
  title: string
  href: string
  image: string // 더미 이미지 경로
}

export function MenuCard({ title, href, image }: MenuCardProps) {
  return (
    <Link href={href} className="block w-full">
      <div className="relative w-full h-[120px] rounded-2xl shadow-md bg-gray-200">
        {/* 더미 배경 이미지 */}
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />

        {/* 텍스트 오버레이 */}
        <div className="absolute top-4 left-5">
          <span className="text-lg font-semibold text-gray-800">{title}</span>
        </div>
      </div>
    </Link>
  )
}
