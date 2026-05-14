"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function AdminDashboardError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-24">
      <AlertCircle className="h-8 w-8 text-destructive" />
      <p className="text-muted-foreground">Something went wrong.</p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  )
}
