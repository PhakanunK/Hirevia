"use client"

import { useState, useEffect } from "react"
import { getApplicationStatus } from "@/lib/actions/public.action"
import type { ApplicationStatusResponse } from "@/lib/models/application.model"

export function useApplicationStatus(token: string | null) {
  const [application, setApplication] = useState<ApplicationStatusResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStatus = async () => {
    if (!token) {
      setError("No application token provided. Please check your email for the status link.")
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const data = await getApplicationStatus(token)
      setApplication(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load application status")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchStatus() }, [token])

  return { application, isLoading, error, retry: fetchStatus }
}
