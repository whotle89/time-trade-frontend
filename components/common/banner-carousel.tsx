"use client"

import React, { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Image from "next/image"
import { Play, Pause } from "lucide-react"

export function BannerCarousel() {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  const slides = [
    "/banner1.png", 
    "/banner2.png",
    "/banner3.png",
    "/banner4.png"
  ] // 일단 더미

  const total = slides.length

  // 슬라이드 변경 감지
  const onSelect = useCallback(() => {
    if (!embla) return
    setSelectedIndex(embla.selectedScrollSnap())
  }, [embla])

  useEffect(() => {
    if (!embla) return
    embla.on("select", onSelect)
    onSelect()
  }, [embla, onSelect])

  // autoplay
  useEffect(() => {
    if (!embla || !isPlaying) return

    const interval = setInterval(() => {
      embla.scrollNext()
    }, 3000)

    return () => clearInterval(interval)
  }, [embla, isPlaying])

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-2xl ml-5 mr-5" ref={emblaRef}>
        <div className="flex">
          {slides.map((src, idx) => (
            <div className="min-w-full" key={idx}>
              <div className="relative w-full h-[200px] bg-gray-200">
                <Image
                  src={src}
                  alt={`banner-${idx}`}
                  fill
                  className="object-cover rounded-2xl"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicator + Controls */}
      <div className="flex items-center justify-between mt-4 px-2 ml-20 mr-20">
        
        {/* Auto play toggle */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center gap-1 text-gray-700"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </button>

        {/* Indicator Bar */}
        <div className="flex-1 px-4">
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-700 transition-all"
              style={{
                width: `${((selectedIndex + 1) / total) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Index */}
        <div className="text-sm bg-gray-200 px-3 py-1 rounded-full">
          {String(selectedIndex + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
        </div>
      </div>
    </div>
  )
}
