"use client"

import { useState, useEffect } from "react"
import { getDashboard } from "@/lib/actions/dashboard.action"
import type { DashboardResponse } from "@/lib/models/dashboard.model"

export function useDashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load dashboard"))
      .finally(() => setIsLoading(false))
  }, [])

  return { data, isLoading, error }
}
