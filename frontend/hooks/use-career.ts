"use client"

import { useState, useEffect } from "react"
import { getPublicJob } from "@/lib/actions/public.action"
import type { JobPublicResponse } from "@/lib/models/job.model"

export function useCareer(id: string) {
  const [job, setJob] = useState<JobPublicResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchJob = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getPublicJob(id)
      setJob(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load job")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchJob() }, [id])

  return { job, isLoading, error, retry: fetchJob }
}
