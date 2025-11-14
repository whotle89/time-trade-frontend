"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react";
import Link from "next/link";

export function FloatingButton() {
  return (
    <Button size="icon"
      className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg"
    >
      <Link href="/slots/create">
      <Plus className="h-6 w-6" />
      </Link>
    </Button>
  )
}