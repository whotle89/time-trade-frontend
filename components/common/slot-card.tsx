"use client"

import { Card, CardContent } from "@/components/ui/card"

type Slot = {
  title: string
  time: string
}

export function SlotCard({ slot }: { slot: Slot }) {
  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="font-medium">{slot.title}</div>
        <div className="text-sm text-muted-foreground mt-1">{slot.time}</div>
      </CardContent>
    </Card>
  )
}
